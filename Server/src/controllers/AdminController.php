<?php

namespace App\Controllers;

use App\Models\Utilizadores;
use App\Models\Restaurantes;
use Slim\Psr7\Request;
use Slim\Psr7\Response;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PDO;



class AdminController
{
    protected $pdo;

    public function __construct($pdo)
    {
        $this->pdo = $pdo;
    }



    public function PedidosDeRegistoRestaurante(Request $request, Response $response, $args)
    {
        $Data = $request->getParsedBody();
        $uploadedFiles = $request->getUploadedFiles();
    
      
        if (!isset($Data['nome'], $Data['email'], $Data['telefone'])) {
        return $this->jsonResponse($response, ['error' => 'Nome, email e telefone são obrigatórios.'], 400);
    }
    
       $nome = $Data['nome'];
        $email = $Data['email'];
        $telefone = $Data['telefone'];

        // Verifica se o ficheiro foi enviado
        if (!isset($uploadedFiles['comprovativo'])) {
            return $this->jsonResponse($response, ['error' => 'Ficheiro comprovativo é obrigatório.'], 400);
        }
    
        $comprovativo = $uploadedFiles['comprovativo'];

        // Verifica erros no upload
        if ($comprovativo->getError() !== UPLOAD_ERR_OK) {
            return $this->jsonResponse($response, ['error' => 'Erro no upload do ficheiro.'], 400);
        }

            // Gera um nome único para o ficheiro
        $uploadDir = __DIR__ . '/../../public/uploads/';
        $originalFileName = $comprovativo->getClientFilename();
        $extension = pathinfo($originalFileName, PATHINFO_EXTENSION);
        $uniqueFileName = uniqid('comprovativo_') . '.' . $extension;

        // Move o ficheiro para a pasta uploads
        $comprovativo->moveTo($uploadDir . $uniqueFileName);
      
        $stmt = $this->pdo->prepare("CALL sp_PedidoRegistoRestaurantes(:nome_pedido, :email_pedido, :telefone_pedido, :comprovativo_morada, @ReturnID)");
        $stmt->bindParam(':nome_pedido', $nome);
        $stmt->bindParam(':email_pedido', $email);
        $stmt->bindParam(':telefone_pedido', $telefone);
        $stmt->bindParam(':comprovativo_morada', $uniqueFileName);
        
        $stmt->execute();
        
       
        $stmt = $this->pdo->query("SELECT @ReturnID");
        $ReturnID = $stmt->fetchColumn();
    
        if ($ReturnID == 0) {
            // Apaga o ficheiro já salvo, porque o pedido não vai ser inserido
             unlink($uploadDir . $uniqueFileName);
            return $this->jsonResponse($response, ['error' => 'Já existe um pedido de registo com este email.'], 400);
        } else {
            $this->sendRegistoEmail($email, $nome);
          
            return $this->jsonResponse($response, [
                'status' => 'success',
                'message' => 'Pedido de registro enviado com sucesso. Aguardando a aprovação!.',
            ], 201);
        }
    }


    private function sendRegistoEmail($email, $nome)
    {
        $mail = new PHPMailer(true);
    
        try {
            // Configuração do servidor de e-mail
            $mail->isSMTP();
            $mail->Host = 'smtp.gmail.com'; // Endereço do servidor SMTP (ex: smtp.gmail.com)
            $mail->SMTPAuth = true;
            $mail->Username = 'brunombita@gmail.com'; // Seu e-mail
            $mail->Password = 'nkfb tcdx skfm modw'; // Sua senha de e-mail
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port = 587;
            $mail->CharSet = 'UTF-8';

    
            // Destinatário
            $mail->setFrom('brunombita@gmail.com', 'MesaFácil');
            $mail->addAddress($email, $nome); // Enviar para o e-mail do restaurante
    
            // Conteúdo do e-mail
            $mail->isHTML(true);
            $mail->Subject = 'Pedido de Registo Recebido';
            $mail->Body    = '
                <h1>Olá ' . $nome . '!</h1>
                <p>Recebemos seu pedido de registro como restaurante. Em breve entraremos em contato para aprovação.</p>
                <p>Seu pedido foi enviado com sucesso e está pendente aprovação!</p>
                <p>Atenciosamente,<br>Equipe MesaFácil</p>
                <p><small>Este é um e-mail automático, por favor, não responda.</small></p>
            ';
    
            // Enviar o e-mail
            $mail->send();
        } catch (Exception $e) {
            // Erro ao enviar o e-mail
            error_log('Erro ao enviar e-mail: ' . $mail->ErrorInfo);
        }
    }

    public function ObterPedidosRegistoRestaurantes(Request $request, Response $response, $args)
    {
        try {
            
            $stmt = $this->pdo->prepare("CALL sp_ObterPedidosRegisto()");
            $stmt->execute();
    
           
            $pedidos = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
            
            if (count($pedidos) > 0) {
                return $this->jsonResponse($response, [
                    'status' => 'success',
                    'pedidos' => $pedidos
                ], 200);
            } else {
                return $this->jsonResponse($response, [
                    'status' => 'error',
                    'message' => 'Nenhum pedido de registo encontrado.'
                ], 404);
            }
    
        } catch (Exception $e) {
            
            return $this->jsonResponse($response, [
                'status' => 'error',
                'message' => 'Erro ao processar a requisição.',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    public function AprovarPedidoRegisto(Request $request, Response $response, $args)
 {
    $data = json_decode($request->getBody()->getContents(), true);

    if (!isset($data['id_pedidoregisto'])) {
        return $this->jsonResponse($response, ['error' => 'ID do pedido é obrigatório.'], 400);
    }

    $id = $data['id_pedidoregisto'];

    try {
        
        $password = $this->gerarPassword(10);
        $password_hash = password_hash($password, PASSWORD_DEFAULT);

        $stmt = $this->pdo->prepare("CALL sp_AprovarPedidoRegisto(:id, :password, @ReturnID)");
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':password', $password_hash, PDO::PARAM_STR);
        $stmt->execute();

        $stmtReturn = $this->pdo->query("SELECT @ReturnID AS result");
        $result = $stmtReturn->fetch(PDO::FETCH_ASSOC);

        if ($result['result'] == 1) {
        
            $stmtInfo = $this->pdo->prepare("SELECT email_pedido, nome_pedido FROM pedido_registo WHERE id_pedidoregisto = :id");
            $stmtInfo->bindParam(':id', $id);
            $stmtInfo->execute();
            $userInfo = $stmtInfo->fetch(PDO::FETCH_ASSOC);

            if ($userInfo) {
                $this->sendAprovacaoEmail($userInfo['email_pedido'], $userInfo['nome_pedido'], $password);
            }

            return $this->jsonResponse($response, [
                'status' => 'success',
                'message' => 'Pedido aprovado com sucesso. E-mail enviado com os dados de acesso.'
            ], 200);
        } else {
            return $this->jsonResponse($response, ['error' => 'Pedido não encontrado ou já aprovado.'], 400);
        }
    } catch (Exception $e) {
        return $this->jsonResponse($response, [
            'error' => 'Erro ao aprovar pedido.',
            'details' => $e->getMessage()
        ], 500);
    }
}



private function gerarPassword($comprimento = 10)
{
    $chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%!&*';
    return substr(str_shuffle(str_repeat($chars, $comprimento)), 0, $comprimento);
}


private function sendAprovacaoEmail($email, $nome, $password)
{
    $mail = new PHPMailer(true);

    try {
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'brunombita@gmail.com';
        $mail->Password = 'nkfb tcdx skfm modw';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;
        $mail->CharSet = 'UTF-8';


        $mail->setFrom('brunombita@gmail.com', 'MesaFácil');
        $mail->addAddress($email, $nome);

        $mail->isHTML(true);
        $mail->Subject = 'Conta Aprovada - MesaFácil';
        $mail->Body = "
            <h2>Olá {$nome},</h2>
            <p>Seu pedido de registo como restaurante foi aprovado com sucesso!</p>
            <p>Aqui estão os seus dados de acesso:</p>
            <ul>
                <li><strong>Email:</strong> {$email}</li>
                <li><strong>Password:</strong> {$password}</li>
            </ul>
            <p>Você já pode aceder à sua conta no sistema.</p>
            <p>Atenciosamente,</p>
            <p><small>Este é um e-mail automático, por favor, não responda.</small></p>
        ";

        $mail->send();
    } catch (Exception $e) {
        error_log('Erro ao enviar e-mail de aprovação: ' . $mail->ErrorInfo);
    }
}


public function RejeitarPedidoRegisto(Request $request, Response $response, $args)
{
    $data = json_decode($request->getBody()->getContents(), true);

    if (!isset($data['id_pedidoregisto'])) {
        return $this->jsonResponse($response, ['error' => 'ID do pedido é obrigatório.'], 400);
    }

    $id = $data['id_pedidoregisto'];

    try {
        // Primeiro, buscar o e-mail e nome do pedido com base no ID
        $stmtInfo = $this->pdo->prepare("SELECT nome_pedido, email_pedido FROM pedido_registo WHERE id_pedidoregisto = :id");
        $stmtInfo->bindParam(':id', $id);
        $stmtInfo->execute();
        $pedido = $stmtInfo->fetch(PDO::FETCH_ASSOC);

        if (!$pedido) {
            return $this->jsonResponse($response, ['error' => 'Pedido não encontrado.'], 404);
        }

        $nome = $pedido['nome_pedido'];
        $email = $pedido['email_pedido'];

        // Rejeitar o pedido
        $stmt = $this->pdo->prepare("CALL sp_RejeitarPedidoRegisto(:id, @ReturnID)");
        $stmt->bindParam(':id', $id);
        $stmt->execute();

        $stmtReturn = $this->pdo->query("SELECT @ReturnID AS result");
        $result = $stmtReturn->fetch(PDO::FETCH_ASSOC);

        if ($result['result'] == 1) {
            $this->sendRejeicaoEmail($email, $nome); 
            return $this->jsonResponse($response, ['status' => 'success', 'message' => 'Pedido rejeitado!'], 200);
        } else {
            return $this->jsonResponse($response, ['error' => 'Pedido não encontrado ou já aprovado.'], 400);
        }
    } catch (Exception $e) {
        return $this->jsonResponse($response, ['error' => 'Erro ao rejeitar pedido.', 'details' => $e->getMessage()], 500);
    }
}
    

private function sendRejeicaoEmail($email, $nome)
{
    $mail = new PHPMailer(true);

    try {
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'brunombita@gmail.com';
        $mail->Password = 'nkfb tcdx skfm modw';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;
        $mail->CharSet = 'UTF-8';


        $mail->setFrom('brunombita@gmail.com', 'MesaFácil');
        $mail->addAddress($email, $nome);

        $mail->isHTML(true);
        $mail->Subject = 'Pedido de Registo Rejeitado';
        $mail->Body    = '
            <h1>Olá ' . $nome . ',</h1>
            <p>Lamentamos informar que seu pedido de registo foi rejeitado.</p>
            <p>Tente numa próxima vez ou entre em contacto com o suporte.</p>
            <p>Atenciosamente,/p>
            <p><small>Este é um e-mail automático. Por favor, não responda.</small></p>
        ';

        $mail->send();
    } catch (Exception $e) {
        error_log('Erro ao enviar e-mail de rejeição: ' . $mail->ErrorInfo);
    }
}

// Obter restaurantes no admin
    public function ObterUtilizadoresRestaurantes(Request $request, Response $response, $args)
    {
        try {
           
            $stmt = $this->pdo->prepare("CALL sp_ObterUtilizadoresRestaurantes()");
            $stmt->execute();
    
            
            $utilizadores = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
            
            if ($utilizadores) {
                
                return $this->jsonResponse($response, [
                    'status' => 'success',
                    'utilizadores' => $utilizadores
                ], 200);
            } else {
                
                return $this->jsonResponse($response, [
                    'status' => 'error',
                    'message' => 'Nenhum utilizador restaurante encontrado.'
                ], 404);
            }
    
        } catch (Exception $e) {
            
            return $this->jsonResponse($response, [
                'status' => 'error',
                'message' => 'Erro ao processar a requisição.',
                'details' => $e->getMessage()
            ], 500);
        }
    }


// Obter clientes no admin
    public function ObterUtilizadoresClientes(Request $request, Response $response, $args)
    {
        try {
           
            $stmt = $this->pdo->prepare("CALL sp_ObterUtilizadoresClientes()");
            $stmt->execute();
    
            
            $utilizadores = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
            
            if ($utilizadores) {
                
                return $this->jsonResponse($response, [
                    'status' => 'success',
                    'utilizadores' => $utilizadores
                ], 200);
            } else {
                
                return $this->jsonResponse($response, [
                    'status' => 'error',
                    'message' => 'Nenhum utilizador cliente encontrado.'
                ], 404);
            }
    
        } catch (Exception $e) {
            
            return $this->jsonResponse($response, [
                'status' => 'error',
                'message' => 'Erro ao processar a requisição.',
                'details' => $e->getMessage()
            ], 500);
        }
    }



    public function EditarRestaurante(Request $request, Response $response, $args)
    {
        
        $data = $request->getParsedBody();
        $files = $request->getUploadedFiles();
    
        $requiredFields = ['id_restaurante', 'nome', 'localizacao', 'cidade', 'pais', 'descricao', 'horario', 'password'];
    
        foreach ($requiredFields as $field) {
            if (empty($data[$field])) {
                return $this->jsonResponse($response, ['error' => "Campo obrigatório em falta: $field"], 400);
            }
        }
    
     
        if (!isset($files['imagem']) || $files['imagem']->getError() !== UPLOAD_ERR_OK) {
            return $this->jsonResponse($response, ['error' => 'Imagem não foi carregada corretamente.'], 400);
        }
    
        $imagemFile = $files['imagem'];
        $uri = $imagemFile->getStream()->getMetadata('uri');  // Armazena a URI da imagem em uma variável
        $imagemInsert = file_get_contents($uri);  // Agora passa a variável para o file_get_contents()
    
 
        $id_restaurante = $data['id_restaurante'];
        $nome = $data['nome'];
        $localizacao = $data['localizacao'];
        $cidade = $data['cidade'];
        $pais = $data['pais'];
        $descricao = $data['descricao'];
        $horario = $data['horario'];
        $password = $data['password'];
    
        
        $restaurante = new Restaurantes();
        $restaurante->setNome($nome);
        $restaurante->setImagem($imagemInsert);
        $restaurante->setDescricao($descricao);
        $restaurante->setLocalizacao($localizacao);
        $restaurante->setCidade($cidade);
        $restaurante->setPais($pais);
        $restaurante->setHorario($horario);
        $restaurante->setIdRestaurante($id_restaurante);
      
        $utilizador = new Utilizadores();
        $utilizador->setPassword($data['password']);

    
        try {
            $stmt = $this->pdo->prepare("CALL sp_EditarRestaurante(:id_restaurante, :nome, :localizacao, :cidade, :pais, :descricao, :horario, :imagem, :password, @ReturnID)");
    
            $stmt->bindParam(':id_restaurante', $id_restaurante);
            $stmt->bindParam(':nome', $nome);
            $stmt->bindParam(':localizacao', $localizacao);
            $stmt->bindParam(':cidade', $cidade);
            $stmt->bindParam(':pais', $pais);
            $stmt->bindParam(':descricao', $descricao);
            $stmt->bindParam(':horario', $horario);


            $imagem = $restaurante->getImagem();
            $stmt->bindParam(':imagem', $imagem, PDO::PARAM_LOB);

            $stmt->bindParam(':password', $password);
    
            $stmt->execute();

            $stmt = $this->pdo->prepare("SELECT @ReturnID AS ReturnID");
            $stmt->execute();
            $result = $stmt->fetch(PDO::FETCH_ASSOC);


            if ($result['ReturnID'] == 0) {
                return $this->jsonResponse($response, ['error' => 'Restaurante não encontrado.'], 404);
            }          
            return $this->jsonResponse($response, ['status' => 'success', 'message' => 'Restaurante atualizado com sucesso.'], 200);

            } catch (Exception $e) {
        return $this->jsonResponse($response, ['error' => 'Erro ao processar a requisição.', 'details' => $e->getMessage()], 500);
    }
            
    }
    
   
    public function ObterContagemPedidosPendentes(Request $request, Response $response, $args)
    {
        try {
           
            $stmt = $this->pdo->prepare("CALL sp_ObterContagemPedidosPendentes()");
            $stmt->execute();
    
            
            $pedidos = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
            
            if ($pedidos) {
                
                return $this->jsonResponse($response, [
                    'status' => 'success',
                    'pedidos' => $pedidos
                ], 200);
            } else {
                
                return $this->jsonResponse($response, [
                    'status' => 'error',
                    'message' => 'Nenhum pedido de restaurante pendente.'
                ], 404);
            }
    
        } catch (Exception $e) {
            
            return $this->jsonResponse($response, [
                'status' => 'error',
                'message' => 'Erro ao processar a requisição.',
                'details' => $e->getMessage()
            ], 500);
        }
    }

 public function ObterContagemRestaurantes(Request $request, Response $response, $args)
    {
        try {
           
            $stmt = $this->pdo->prepare("CALL sp_ObterContagemRestaurantes()");
            $stmt->execute();
    
            
            $num_restaurantes = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
            
            if ($num_restaurantes) {
                
                return $this->jsonResponse($response, [
                    'status' => 'success',
                    'num_restaurantes' => $num_restaurantes
                ], 200);
            } else {
                
                return $this->jsonResponse($response, [
                    'status' => 'error',
                    'message' => 'Não existe restarantes associados ao sistema.'
                ], 404);
            }
    
        } catch (Exception $e) {
            
            return $this->jsonResponse($response, [
                'status' => 'error',
                'message' => 'Erro ao processar a requisição.',
                'details' => $e->getMessage()
            ], 500);
        }
    }



public function ObterContagemClientes(Request $request, Response $response, $args)
    {
        try {
           
            $stmt = $this->pdo->prepare("CALL sp_ObterContagemClientes()");
            $stmt->execute();
    
            
            $num_clientes = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
            
            if ($num_clientes) {
                
                return $this->jsonResponse($response, [
                    'status' => 'success',
                    'num_clientes' => $num_clientes
                ], 200);
            } else {
                
                return $this->jsonResponse($response, [
                    'status' => 'error',
                    'message' => 'Não existe clientes associados ao sistema.'
                ], 404);
            }
    
        } catch (Exception $e) {
            
            return $this->jsonResponse($response, [
                'status' => 'error',
                'message' => 'Erro ao processar a requisição.',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    private function jsonResponse(Response $response, array $data, int $status)
    {

        // Função para garantir que os dados estejam em UTF-8
        array_walk_recursive($data, function (&$item) {
            if (is_string($item)) {
                // Converte os dados para UTF-8, ignorando erros
                $item = mb_convert_encoding($item, 'UTF-8', 'UTF-8');
            }
        });

        $jsonData = json_encode($data);

        if($jsonData === false) {
            $error = json_last_error_msg();
            return $this->jsonResponse($response, [
                'status' => 'error',
                'message' => 'Erro ao codificar os dados em JSON.',
                'details' => $error
            ], 500);
        }

        $response->getBody()->write(json_encode($data));
        return $response->withHeader('Content-Type', 'application/json')->withStatus($status);
    }
}

?>
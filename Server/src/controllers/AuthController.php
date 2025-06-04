<?php

namespace App\Controllers;

use App\Models\Utilizadores;
use App\Models\Restaurantes;
use Slim\Psr7\Request;
use Slim\Psr7\Response;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

use PDO;

class AuthController
{
    protected $pdo;

    public function __construct($pdo)
    {
        $this->pdo = $pdo;
    }

    
    public function login(Request $request, Response $response, $args)
    {
        $data = json_decode($request->getBody()->getContents(), true);
    
        if (!isset($data['email']) || !isset($data['password'])) {
            return $this->jsonResponse($response, ['error' => 'Email e senha são obrigatórios.'], 400);
        }
    
        $email = $data['email'];
        $password = $data['password'];
    
        try {
           
            $stmt = $this->pdo->prepare("CALL sp_InicarSessaoHash(:email)");
            $stmt->bindParam(':email', $email);
            $stmt->execute();
    
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
            if (!$user) {
                return $this->jsonResponse($response, ['error' => 'Email não encontrado.'], 401);
            }
    
            
            if (!password_verify($password, $user['password'])) {
                return $this->jsonResponse($response, ['error' => 'Password incorreta.'], 401);
            }
    
            
            $utilizador = new Utilizadores();
            $utilizador->setId($user['id']);
            $utilizador->setNome($user['nome']);
            $utilizador->setEmail($user['email']);
            $utilizador->setTelefone($user['telefone']);
            $utilizador->setTipo($user['tipo']);
    
            return $this->jsonResponse($response, [
                'status' => 'success',
                'message' => 'Login bem-sucedido',
                'utilizador' => [
                    'id' => $utilizador->getId(),
                    'nome' => $utilizador->getNome(),
                    'email' => $utilizador->getEmail(),
                    'telefone' => $utilizador->getTelefone(),
                    'tipo' => $utilizador->getTipo()
                ]
            ], 200);
        } catch (\PDOException $e) {
            return $this->jsonResponse($response, ['error' => 'Erro ao iniciar sessão.', 'details' => $e->getMessage()], 500);
        }
    }
    


public function register(Request $request, Response $response, $args)
{
    $data = json_decode($request->getBody()->getContents(), true);

    
    if (!isset($data['nome'], $data['email'], $data['password'], $data['telefone'], $data['confirmPassword'])) {
        return $this->jsonResponse($response, ['error' => 'Todos os campos são obrigatórios.'], 400);
    }

    $nome = $data['nome'];
    $email = $data['email'];
    $telefone = $data['telefone'];
    $password = $data['password'];
    $confirmPassword = $data['confirmPassword'];

    
    if ($password !== $confirmPassword) {
        return $this->jsonResponse($response, ['error' => 'As passwords têm de ser iguais.'], 400);
    }

    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $this->pdo->prepare("CALL sp_CriarConta(:nome, :email, :password, :telefone, @u_utilizadorId)");
    $stmt->bindParam(':nome', $nome);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':password', $hashedPassword);
    $stmt->bindParam(':telefone', $telefone);

  
    $stmt->execute();

    
    $stmt = $this->pdo->query("SELECT @u_utilizadorId");
    $utilizadorId = $stmt->fetchColumn();

    
    if ($utilizadorId == -1) {
        return $this->jsonResponse($response, ['error' => 'Email já existe!).'], 400);
    }


    $this->sendWelcomeEmail($email, $nome);
 
    return $this->jsonResponse($response, [
        'status' => 'success',
        'message' => 'Registo bem-sucedido',
        'utilizador' => [
            'id' => $utilizadorId,
            'nome' => $nome,
            'email' => $email,
            'telefone' => $telefone
        ]
    ], 201);
}

private function sendWelcomeEmail($email, $nome)
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
        $mail->setFrom('brunombita@gmail.com', 'MesaFaçil');
        $mail->addAddress($email, $nome); // Enviar para o e-mail do usuário

        // Conteúdo do e-mail
        $mail->isHTML(true);
        $mail->Subject = 'Bem-vindo ao nosso sistema de reservas';
        $mail->Body    = '
                <h1>Bem Vindo ' . $nome . '!</h1>
                <p>Bem-vindo ao nosso sistema de reservas! Sua conta foi criada com sucesso.</p>
                <p>Agora você pode começar a explorar os restaurantes e fazer suas reservas de forma fácil e rápida.</p>
                <p>Estamos muito felizes em tê-lo(a) conosco. Não perca tempo, acesse nosso sistema agora e faça sua primeira reserva!</p>
                <p><strong>Se precisar de ajuda, entre em contato com nosso suporte.</strong></p>
                <p>Atenciosamente,<br>Equipe MesaFácil</p>
                <p><small>Este é um e-mail automático, por favor, não responda.</small></p>
';

        // Enviar o e-mail
        $mail->send();
    } catch (Exception $e) {
        // Erro no envio do e-mail
        error_log('Erro ao enviar e-mail: ' . $mail->ErrorInfo);
    }
}

public function editarCliente(Request $request, Response $response, $args)
{
    $data = json_decode($request->getBody()->getContents(), true);

    if (!isset($data['id'], $data['nome'], $data['email'], $data['telefone'])) {
        return $this->jsonResponse($response, ['error' => 'Todos os campos são obrigatórios.'], 400);
    }

    $id = $data['id'];
    $nome = $data['nome'];
    $email = $data['email'];
    $telefone = $data['telefone'];

    $password = isset($data['password']) && !empty($data['password'])
    ? password_hash($data['password'], PASSWORD_DEFAULT)
    : null;
    
    $stmt = $this->pdo->prepare("CALL sp_EditarCliente(:id, :nome, :email, :telefone, :password)");
    $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    $stmt->bindParam(':nome', $nome);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':telefone', $telefone);
    $stmt->bindValue(':password', $password, $password === null ? PDO::PARAM_NULL : PDO::PARAM_STR);
    
    try {
        $stmt->execute();

        return $this->jsonResponse($response, [
            'status' => 'success',
            'message' => 'Dados do cliente atualizados com sucesso.'
        ], 200);

    } catch (\PDOException $e) {
        return $this->jsonResponse($response, [
            'error' => 'Erro ao atualizar dados do cliente: ' . $e->getMessage()
        ], 500);
    }
}

  
    private function jsonResponse(Response $response, array $data, int $status)
    {
        $response->getBody()->write(json_encode($data));
        return $response->withHeader('Content-Type', 'application/json')->withStatus($status);
    }

    
   
}


?>
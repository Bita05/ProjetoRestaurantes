<?php

namespace App\Controllers;

use App\Models\Restaurantes;
use App\Models\Menu;
use App\Models\Utilizadores;
use App\Models\Horarios;
use App\Models\Reserva;
use Slim\Psr7\Request;
use Slim\Psr7\Response;
use PDO;

class RestauranteController
{
    protected $pdo;

    public function __construct($pdo)
    {
        $this->pdo = $pdo;
    }


   


    // Listar todos os restaurantes
    public function listarRestaurantes(Request $request, Response $response, $args)
    {   
    
        $stmt = $this->pdo->prepare("CALL sp_ObterRestaurantes()");
        $stmt->execute();
        $restaurantesData = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $restaurantes = [];
    
        // Preenche os dados do restaurante nos objetos
        foreach ($restaurantesData as $data) {
            $restaurante = new Restaurantes();
            $restaurante->setIdRestaurante($data['id_restaurante']);
            $restaurante->setNome($data['nome']);

        if($data['imagem']) {
            $restaurante->setImagem($data['imagem']);
        } else {
            $restaurante->setImagem(null); 
        }

        $restaurante->setDescricao($data['descricao']);
        $restaurante->setLocalizacao($data['localizacao']);
        $restaurante->setCidade($data['cidade']);
        $restaurante->setPais($data['pais']);
        $restaurante->setHorario($data['horario']);
        $restaurante->setAtivo($data['ativo']);
        $restaurante->setIdUtilizador($data['id_utilizador']);

        // Converte o objeto para array e adiciona ao array de restaurantes
        $restaurantes[] = $restaurante->toArray();
        }

    
        return $this->jsonResponse($response, [
            'status' => 'success',
            'restaurantes' => $restaurantes
        ], 200);
    }   


public function InfoRestaurante(Request $request, Response $response, $args)
{
    $data = json_decode($request->getBody()->getContents(), true);

    if (!isset($data['id_utilizador'])) {
        return $this->jsonResponse($response, ['error' => 'ID do utilizador é obrigatório.'], 400);
    }

    $id_utilizador = $data['id_utilizador'];

    $stmt = $this->pdo->prepare("CALL sp_ObterInfoRestaurantes(:id_utilizador)");
    $stmt->bindParam(':id_utilizador', $id_utilizador);
    $stmt->execute();
    $restauranteData = $stmt->fetch(PDO::FETCH_ASSOC);


    if (!$restauranteData) {
        return $this->jsonResponse($response, ['error' => 'Restaurante não encontrado.'], 404);
    }

    
    $restaurante = new Restaurantes(
        $restauranteData['id_restaurante'],
        $restauranteData['nome'],
        $restauranteData['imagem'],
        $restauranteData['descricao'],
        $restauranteData['localizacao'],
        $restauranteData['cidade'],
        $restauranteData['pais'],
        $restauranteData['horario'],
        $restauranteData['id_utilizador'],
        $restauranteData['ativo']
    );

    return $this->jsonResponse($response, [
        'status' => 'success',
        'message' => 'Informações do restaurante obtidas com sucesso',
        'restaurante' => $restaurante->toArray()
    ], 200);
}



public function AddMenu(Request $request, Response $response, $args)
{
    // Obter os dados do prato do form
    $data = $request->getParsedBody();
    $files = $request->getUploadedFiles();

   
    if (empty($data['nome_prato']) || empty($data['descricao']) || empty($data['preco']) || empty($data['categoria'])) {
        return $this->jsonResponse($response, ['error' => ' Os campos são todos obrigatórios.'], 400);
    }

   
    if (empty($data['id_utilizador'])) {
        return $this->jsonResponse($response, ['error' => 'ID do utilizador é obrigatório.'], 400);
    }

    $id_utilizador = $data['id_utilizador'];

   
    $stmt = $this->pdo->prepare("SELECT id_restaurante FROM restaurantes WHERE id_utilizador = :id_utilizador LIMIT 1");
    $stmt->bindParam(':id_utilizador', $id_utilizador);
    $stmt->execute();
    $restauranteData = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$restauranteData) {
        return $this->jsonResponse($response, ['error' => 'Restaurante não encontrado!'], 404);
    }

    $id_restaurante = $restauranteData['id_restaurante'];

    
    $menu = new Menu(
        null, 
        $id_restaurante, 
        $data['nome_prato'],
        $data['descricao'],
        $data['preco'],
        $data['categoria'],
        null 
    );

    
    $imagemUploud = null;
    if (isset($files['imagem']) && $files['imagem']->getError() === UPLOAD_ERR_OK) {
        $image = $files['imagem'];
  
        $imagemUploud = file_get_contents($image->getStream()->getMetadata('uri'));
    }

    
    $menu->setImagem($imagemUploud);

    try {
        $stmt = $this->pdo->prepare("INSERT INTO menu (id_restaurante, nome_prato, descricao, preco, categoria, imagem) VALUES (:id_restaurante, :nome_prato, :descricao, :preco, :categoria, :imagem)");

        $id_restaurante = $menu->getIdRestaurante();
        $nome_prato = $menu->getNomePrato();
        $descricao = $menu->getDescricao();
        $preco = $menu->getPreco();
        $categoria = $menu->getCategoria();
        $imagem = $menu->getImagem();  

        $stmt->bindParam(':id_restaurante', $id_restaurante);
        $stmt->bindParam(':nome_prato', $nome_prato);
        $stmt->bindParam(':descricao', $descricao);
        $stmt->bindParam(':preco', $preco);
        $stmt->bindParam(':categoria', $categoria);
        $stmt->bindParam(':imagem', $imagem, PDO::PARAM_LOB); //PARAM_LOB usado para guardar grandes objetos binarios
        $stmt->execute();

        return $this->jsonResponse($response, [
            'status' => 'success',
            'message' => 'Menu adicionado com sucesso!'
        ], 200);

    } catch (Exception $e) {
        return $this->jsonResponse($response, ['error' => 'Erro ao adicionar o menu: ' . $e->getMessage()], 500);
    }
}




public function listarMenusRestaurante(Request $request, Response $response, $args)
{
    
    $data = json_decode($request->getBody()->getContents(), true);

    if (!isset($data['id_restaurante'])) {
        return $this->jsonResponse($response, ['error' => 'ID do restaurante é obrigatório.'], 400);
    }

    $id_restaurante = $data['id_restaurante'];

    
    try {
        // Chama a stored procedure sp_ObterMenus
        $stmt = $this->pdo->prepare("CALL sp_ObterMenus(:id_restaurante)");
        $stmt->bindParam(':id_restaurante', $id_restaurante, PDO::PARAM_INT);
        $stmt->execute();
        $pratosData = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (empty($pratosData)) {
            return $this->jsonResponse($response, ['error' => 'Nenhum menu encontrado!'], 404);
        }

        $pratos = [];

        foreach ($pratosData as $data) {
            $imagemBase64 = null;
            if (!empty($data['imagem'])) {
                $imagemBase64 = base64_encode($data['imagem']);
            }

            
            $prato = new Menu(
                $data['id_menu'],
                $data['id_restaurante'],
                $data['nome_prato'],
                $data['descricao'],
                $data['preco'],
                $data['categoria'],
                $imagemBase64
            );

            // Adiciona o prato ao array de pratos
            $pratos[] = $prato->toArray();
        }


    return $this->jsonResponse($response, [
        'status' => 'success',
        'pratos' => $pratos
    ], 200);

    } catch (Exception $e) {
        return $this->jsonResponse($response, ['error' => 'Erro ao obter os menus: ' . $e->getMessage()], 500);
    }
}


public function ObterReservasRestaurante(Request $request, Response $response, $args)
{
    $data = json_decode($request->getBody()->getContents(), true);

    if (!isset($data['id_restaurante'])) {
        return $this->jsonResponse($response, ['error' => 'ID do restaurante é obrigatório.'], 400);
    }

    $id_restaurante = $data['id_restaurante'];

    try {
        $stmt = $this->pdo->prepare("CALL sp_ObterReservasRestaurante(:id_restaurante)");
        $stmt->bindParam(':id_restaurante', $id_restaurante, PDO::PARAM_INT);
        $stmt->execute();
        $reservasData = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (empty($reservasData)) {
            return $this->jsonResponse($response, ['error' => 'Nenhuma reserva encontrada!'], 404);
        }

        $reservas = [];

        foreach ($reservasData as $data) {
            $imagemBase64 = null;
            if (!empty($data['imagem'])) {
                $imagemBase64 = base64_encode($data['imagem']);
            }

            // Adiciona o prato e o preço ao array da reserva
            $reserva = [
                'id_reserva' => $data['id_reserva'] ?? null,
                'dia_semana' => $data['dia_semana'] ?? null,
                'hora_inicio' => $data['hora_inicio'] ?? null,
                'hora_fim' => $data['hora_fim'] ?? null,
                'nome_prato' => $data['nome_prato'] ?? null,
                'preco' => $data['preco'] ?? null,
                'imagem' => $imagemBase64,
                'nome_cliente' => $data['nome_cliente'] ?? null,
                'telefone' => $data['telefone'] ?? null,
                'data_reserva' => $data['data_reserva'] ?? null,
                'data_reserva_marcada' => $data['data_reserva_marcada'] ?? null,
                'num_pessoas' => $data['num_pessoas'] ?? null
            ];

            // Verificar se o prato já existe na reserva e adicioná-lo corretamente
            if (isset($reservas[$data['id_reserva']])) {
                // Se a reserva já existe, adicionamos o prato atual à lista de pratos
                $reservas[$data['id_reserva']]['menus'][] = [
                    'nome_prato' => $data['nome_prato'],
                    'preco' => $data['preco'],
                    'imagem' => $imagemBase64                   
                ];
            } else {
                // Caso contrário, inicializamos a reserva com o prato
                $reserva['menus'] = [
                    [
                        'nome_prato' => $data['nome_prato'],
                        'preco' => $data['preco'],
                        'imagem' => $imagemBase64
                    ]
                ];
                $reservas[$data['id_reserva']] = $reserva;
            }
        }

        return $this->jsonResponse($response, [
            'status' => 'success',
            'reservas' => array_values($reservas) // Reorganiza para não ter chave duplicada
        ], 200);

    } catch (Exception $e) {
        return $this->jsonResponse($response, ['error' => 'Erro ao obter as reservas: ' . $e->getMessage()], 500);
    }
}





public function getNumeroReservasSemana(Request $request, Response $response, $args)
{
    
    $data = json_decode($request->getBody()->getContents(), true);
    $idRestaurante = $data['id_restaurante'];

    try {
        
        $stmt = $this->pdo->prepare("CALL sp_GetNumeroReservasSemana(:id_restaurante)");
        $stmt->bindParam(':id_restaurante', $idRestaurante, PDO::PARAM_INT);
        $stmt->execute();  
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($result) {
            
            return $this->jsonResponse($response, [
                'status' => 'success',
                'numero_reservas' => $result['numero_reservas']
            ], 200);
        } else {
           
            return $this->jsonResponse($response, [
                'status' => 'success',
                'numero_reservas' => 0
            ], 200);
        }
    } catch (Exception $e) {
        
        return $this->jsonResponse($response, [
            'error' => 'Erro ao consultar número de reservas: ' . $e->getMessage()
        ], 500);
    }
}


public function getMaisReservasSemanais(Request $request, Response $response, $args)
{
    $data = json_decode($request->getBody()->getContents(), true);
    $idRestaurante = $data['id_restaurante'];

    try {
        $stmt = $this->pdo->prepare("CALL sp_GetMaisReservasSemanais(:id_restaurante)");
        $stmt->bindParam(':id_restaurante', $idRestaurante, PDO::PARAM_INT);
        $stmt->execute();
        
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return $this->jsonResponse($response, [
            'status' => 'success',
            'reservas_por_dia' => $result
        ], 200);
    } catch (Exception $e) {
        return $this->jsonResponse($response, [
            'error' => 'Erro ao consultar reservas por dia: ' . $e->getMessage()
        ], 500);
    }
}


public function DadosRestaurante(Request $request, Response $response, $args)
{
    $data = json_decode($request->getBody()->getContents(), true);

    if (!isset($data['id_restaurante'])) {
        return $this->jsonResponse($response, ['error' => 'ID do utilizador é obrigatório.'], 400);
    }

    $id_restaurante = $data['id_restaurante'];

    $stmt = $this->pdo->prepare("SELECT u.id as id_utilizador, r.id_restaurante, u.nome as nome_utilizador, u.email, u.telefone, r.nome as nome_restaurante, r.imagem,r.descricao, r.localizacao, r.cidade, r.pais, r.horario, r.ativo
                                        FROM utilizadores u
                                        INNER JOIN restaurantes r ON r.id_utilizador = u.id
                                        WHERE id_restaurante = :id_restaurante");
    $stmt->bindParam(':id_restaurante', $id_restaurante, PDO::PARAM_INT);
    $stmt->execute();
    $restauranteData = $stmt->fetch(PDO::FETCH_ASSOC);


    if (!$restauranteData) {
        return $this->jsonResponse($response, ['error' => 'Restaurante não encontrado.'], 404);
    }


    $imagemBase64 = null;
    if (!empty($restauranteData['imagem'])) {
        $tipoImagem = 'jpeg'; 
        $base64 = base64_encode($restauranteData['imagem']);
        $imagemBase64 = "data:image/{$tipoImagem};base64,{$base64}";
    }
    
    $restaurante = new Restaurantes(
        $id_restaurante,
        $restauranteData['nome_restaurante'],
        $imagemBase64,
        $restauranteData['descricao'],
        $restauranteData['localizacao'],
        $restauranteData['cidade'],
        $restauranteData['pais'],
        $restauranteData['horario'],
        $restauranteData['id_utilizador'],
        $restauranteData['ativo']
       
    );

    $utilizador = new Utilizadores(
        $restauranteData['id_utilizador'], 
        $restauranteData['nome_utilizador'],
        $restauranteData['email'],  
        null, 
        $restauranteData['telefone'],
        null, 
        null 
    );

    return $this->jsonResponse($response, [
        'status' => 'success',
        'message' => 'Informações do restaurante obtidas com sucesso',
        'restaurante' => $restaurante->toArray(),
        'utilizador' => $utilizador->toArray()
    ], 200);
    
}


public function AtualizarRestaurante(Request $request, Response $response, $args)
{
    $data = $request->getParsedBody();
    $uploadedFiles = $request->getUploadedFiles();

    
    if (empty($data['id_utilizador'])) {
        return $this->jsonResponse($response, ['error' => 'O campo id_utilizador é obrigatório.'], 400);
    }
    $id_utilizador = (int)$data['id_utilizador'];

    
    $telefone = $data['telefone'] ?? null;
    $nome = $data['nome'] ?? null;
    $descricao = $data['descricao'] ?? null;
    $localizacao = $data['localizacao'] ?? null;
    $cidade = $data['cidade'] ?? null;
    $horario = $data['horario'] ?? null;
    $pais = $data['pais'] ?? null;


    
    if (empty($data['password'])) {
        $stmt = $this->pdo->prepare("SELECT password FROM utilizadores WHERE id = :id");
        $stmt->bindValue(':id', $id_utilizador, PDO::PARAM_INT);
        $stmt->execute();
        $password = $stmt->fetchColumn();
    } else {
        $password = password_hash($data['password'], PASSWORD_BCRYPT);
    }

   
    $imagem = null;
    if (!empty($uploadedFiles['imagem'])) {
        $imagemFile = $uploadedFiles['imagem'];
        if ($imagemFile->getError() === UPLOAD_ERR_OK) {
            $imagemStream = fopen($imagemFile->getFilePath(), 'rb');
            $imagem = stream_get_contents($imagemStream);
            fclose($imagemStream);
        }
    }

    try {
        $stmt = $this->pdo->prepare("CALL AtualizarRestaurantes(:telefone, :password, :id_utilizador, :nome, :imagem, :descricao, :localizacao, :cidade, :horario, :pais)");

        $stmt->bindValue(':telefone', $telefone, PDO::PARAM_STR);
        $stmt->bindValue(':password', $password, PDO::PARAM_STR);
        $stmt->bindValue(':id_utilizador', $id_utilizador, PDO::PARAM_INT);
        $stmt->bindValue(':nome', $nome, PDO::PARAM_STR);
        $stmt->bindValue(':imagem', $imagem, PDO::PARAM_LOB);
        $stmt->bindValue(':descricao', $descricao, PDO::PARAM_STR);
        $stmt->bindValue(':localizacao', $localizacao, PDO::PARAM_STR);
        $stmt->bindValue(':cidade', $cidade, PDO::PARAM_STR);
        $stmt->bindValue(':horario', $horario, PDO::PARAM_STR);
        $stmt->bindValue(':pais', $pais, PDO::PARAM_STR);

        $stmt->execute();

        return $this->jsonResponse($response, [
            'status' => 'success',
            'message' => 'Dados atualizados com sucesso!'
        ], 200);

    } catch (PDOException $e) {
        return $this->jsonResponse($response, [
            'error' => 'Erro ao atualizar os dados: ' . $e->getMessage()
        ], 500);
    }
}


public function ObterRestaurantesPopulares(Request $request, Response $response, $args)
    {   
    
        $stmt = $this->pdo->prepare("CALL sp_ObterRestaurantesPopulares()");
        $stmt->execute();
        $restaurantesPopularesData  = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $restaurantesPopulares  = [];
    
        foreach ($restaurantesPopularesData as $data) {
            $restaurante = new Restaurantes();
            $restaurante->setIdRestaurante($data['id_restaurante']);
            $restaurante->setNome($data['nome']);

        if($data['imagem']) {
            $imageBase64 = base64_encode($data['imagem']);
            $restaurante->setImagem($imageBase64);
        } else {
            $restaurante->setImagem(null); 
        }

        $restaurante->setDescricao($data['descricao']);
        $restaurante->setLocalizacao($data['localizacao']);
        $restaurante->setCidade($data['cidade']);
        $restaurante->setPais($data['pais']);
        $restaurante->setHorario($data['horario']);
        $restaurante->setAtivo($data['ativo']);
        $restaurante->setIdUtilizador($data['id_utilizador']);

        // Converte o objeto para array e adiciona ao array de restaurantes
        $restaurantesPopulares[] = $restaurante->toArray();
        }

    
        return $this->jsonResponse($response, [
            'status' => 'success',
            'restaurantes' => $restaurantesPopulares
        ], 200);
    }   


    

private function jsonResponse(Response $response, array $data, int $status)
{
    try {
        $json = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR | JSON_INVALID_UTF8_IGNORE);
    } catch (JsonException $e) {
        $json = json_encode(['error' => 'Erro ao converter resposta para JSON.', 'details' => $e->getMessage()]);
        $status = 500;
    }

    $response->getBody()->write($json);
    return $response->withHeader('Content-Type', 'application/json')->withStatus($status);
}





}

?>
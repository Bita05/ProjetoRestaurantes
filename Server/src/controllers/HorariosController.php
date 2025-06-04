<?php

namespace App\Controllers;

use App\Models\Restaurantes;
use App\Models\Menu;
use App\Models\Horarios;
use Slim\Psr7\Request;
use Slim\Psr7\Response;
use PDO;

class HorariosController
{
    protected $pdo;

    public function __construct($pdo)
    {
        $this->pdo = $pdo;
    }


    public function addHorario(Request $request, Response $response, $args)
    {
        $data = json_decode($request->getBody()->getContents(), true);
    
     
        if (!isset($data['id_restaurante'], $data['dia_semana'], $data['hora_inicio'], $data['hora_fim'], $data['capacidade_maxima'])) {
            return $this->jsonResponse($response, ['error' => 'Todos os campos são obrigatórios.'], 400);
        }
    
        $id_restaurante = $data['id_restaurante'];
        $dia_semana = $data['dia_semana'];
        $horario_inicio = $data['hora_inicio'];
        $horario_fim = $data['hora_fim'];
        $capacidade = $data['capacidade_maxima'];
    
        
        if (strtotime($horario_inicio) >= strtotime($horario_fim)) {
            return $this->jsonResponse($response, ['error' => 'Horário de início deve ser anterior ao horário de fim.'], 400);
        }
    
        
        $stmt = $this->pdo->prepare("SELECT id_restaurante FROM restaurantes WHERE id_restaurante = :id_restaurante");
        $stmt->bindParam(':id_restaurante', $id_restaurante);
        $stmt->execute();
    
        if (!$stmt->fetch()) {
            return $this->jsonResponse($response, ['error' => 'Restaurante não encontrado.'], 404);
        }
    
       
        $horario = new Horarios();
        $horario->setIdRestaurante($id_restaurante);
        $horario->setDiaSemana($dia_semana);
        $horario->setHorarioInicio($horario_inicio);
        $horario->setHorarioFim($horario_fim);
        $horario->setCapacidade($capacidade);
    
    
        $stmt = $this->pdo->prepare("INSERT INTO horarios_reserva (id_restaurante, dia_semana, hora_inicio, hora_fim, capacidade_maxima) VALUES (:id_restaurante, :dia_semana, :hora_inicio, :hora_fim, :capacidade_maxima)");
    
       // Passa as variáveis diretamente para o bindParam
        $stmt->bindParam(':id_restaurante', $id_restaurante);
        $stmt->bindParam(':dia_semana', $dia_semana);
        $stmt->bindParam(':hora_inicio', $horario_inicio);
        $stmt->bindParam(':hora_fim', $horario_fim);
        $stmt->bindParam(':capacidade_maxima', $capacidade);
    
        if ($stmt->execute()) {
            
            return $this->jsonResponse($response, [
                'status' => 'success',
                'message' => 'Horário adicionado com sucesso.',
                'horario' => [
                    'id_restaurante' => $horario->getIdRestaurante(),
                    'dia_semana' => $horario->getDiaSemana(),
                    'hora_inicio' => $horario->getHorarioInicio(),
                    'hora_fim' => $horario->getHorarioFim(),
                    'capacidade_maxima' => $horario->getCapacidade()
                ]
            ], 201);
        } else {
            return $this->jsonResponse($response, ['error' => 'Erro ao adicionar horário.'], 500);
        }
    }
    

    public function getHorarios(Request $request, Response $response, $args)
    {

        $data = json_decode($request->getBody()->getContents(), true);
        $id_restaurante = $data['id_restaurante'] ?? null;

       
        if (!$id_restaurante) {
            return $this->jsonResponse($response, ['error' => 'id_restaurante é obrigatório.'], 400);
        }

        
        $stmt = $this->pdo->prepare("SELECT id_restaurante FROM restaurantes WHERE id_restaurante = :id_restaurante");
        $stmt->bindParam(':id_restaurante', $id_restaurante);
        $stmt->execute();

        if (!$stmt->fetch()) {
            return $this->jsonResponse($response, ['error' => 'Restaurante não encontrado.'], 404);
        }

        
        $stmt = $this->pdo->prepare("SELECT * FROM horarios_reserva WHERE id_restaurante = :id_restaurante AND ativo = 1");
        $stmt->bindParam(':id_restaurante', $id_restaurante);
        $stmt->execute();
        $horarios = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if ($horarios) {
            return $this->jsonResponse($response, [
                'status' => 'success',
                'horarios' => $horarios
            ], 200);
        } else {
            return $this->jsonResponse($response, ['error' => 'Nenhum horário encontrado.'], 404);
        }
    }
  
    public function getHorariosParaReserva(Request $request, Response $response, $args)
{
    $data = json_decode($request->getBody()->getContents(), true);
    $id_restaurante = $data['id_restaurante'] ?? null;
    $data_reserva = $data['data_reserva'] ?? null;

    $stmt = $this->pdo->prepare("CALL listarHorariosReserva(:id_restaurante, :data_reserva)");
    $stmt->bindParam(':id_restaurante', $id_restaurante);
    $stmt->bindParam(':data_reserva', $data_reserva);
    $stmt->execute();

    $horarios = $stmt->fetchAll(PDO::FETCH_ASSOC);

    return $this->jsonResponse($response, [
        'status' => 'success',
        'horarios' => $horarios
    ], 200);
}


public function ObterHorariosRestaurante(Request $request, Response $response, $args)
    {

        $data = json_decode($request->getBody()->getContents(), true);
        $id_restaurante = $data['id_restaurante'] ?? null;

       
        if (!$id_restaurante) {
            return $this->jsonResponse($response, ['error' => 'id_restaurante é obrigatório.'], 400);
        }
         
        
        $stmt = $this->pdo->prepare("CALL sp_ObterHorariosRestaurante(:id_restaurante)");
        $stmt->bindParam(':id_restaurante', $id_restaurante);
        $stmt->execute();
        $horarios = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if ($horarios) {
            return $this->jsonResponse($response, [
                'status' => 'success',
                'horarios' => $horarios
            ], 200);
        } else {
            return $this->jsonResponse($response, ['error' => 'Nenhum horário encontrado.'], 404);
        }
    }


public function removerHorario(Request $request, Response $response, $args)
{
    $data = json_decode($request->getBody()->getContents(), true);

    if (!isset($data['id_restaurante'], $data['id_horario'])) {
        return $this->jsonResponse($response, ['error' => 'id_restaurante e id_horario são obrigatórios.'], 400);
    }

    $id_restaurante = $data['id_restaurante'];
    $id_horario = $data['id_horario'];

    
    $stmt = $this->pdo->prepare("SELECT 1 FROM horarios_reserva WHERE id_restaurante = :id_restaurante AND id_horario = :id_horario");
    $stmt->bindParam(':id_restaurante', $id_restaurante);
    $stmt->bindParam(':id_horario', $id_horario);
    $stmt->execute();

    if (!$stmt->fetch()) {
        return $this->jsonResponse($response, ['error' => 'Horário não encontrado para este restaurante.'], 404);
    }

   $stmt = $this->pdo->prepare("CALL sp_RemoverHorarios(:id_restaurante, :id_horario)");
    $stmt->bindParam(':id_restaurante', $id_restaurante);
    $stmt->bindParam(':id_horario', $id_horario);

    if ($stmt->execute()) {
        return $this->jsonResponse($response, ['status' => 'success', 'message' => 'Horário removido com sucesso.'], 200);
    } else {
        return $this->jsonResponse($response, ['error' => 'Erro ao executar a stored procedure.'], 500);
    }
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
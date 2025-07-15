<?php

namespace App\Controllers;

use App\models\Restaurantes;
use App\models\Menu;
use App\models\Utilizadores;
use App\models\Horarios;
use App\models\Reservas;
use Slim\Psr7\Request;
use Slim\Psr7\Response;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PDO;

class ReservasController
{
    protected $pdo;

    public function __construct($pdo)
    {
        $this->pdo = $pdo;
    }




    public function addReserva2(Request $request, Response $response, $args)
{
    $data = json_decode($request->getBody()->getContents(), true);

    // Verificar campos obrigatórios
    if (!isset(
        $data['id_restaurante'],
        $data['id_menus'], // <- Alterado de 'id_menu' para 'id_menus'
        $data['num_pessoas'],
        $data['id_horario'],
        $data['id_cliente'],
        $data['data_reserva_marcada']
    )) {
        return $this->jsonResponse($response, ['error' => 'Todos os campos são obrigatórios.'], 400);
    }

    $id_restaurante = $data['id_restaurante'];
    $id_menus = $data['id_menus']; // array
    $num_pessoas = (int)$data['num_pessoas'];
    $id_horario = $data['id_horario'];
    $id_cliente = $data['id_cliente'];
    $data_reserva_marcada = $data['data_reserva_marcada'];
    $data_reserva = date('Y-m-d');

    // Verificar se já existe reserva nesse dia
    $stmt = $this->pdo->prepare("
        SELECT COUNT(*) as total
        FROM reservas
        WHERE id_cliente = :id_cliente
        AND data_reserva_marcada = :data_reserva_marcada
        AND cancelada = 0
    ");
    $stmt->execute([
        ':id_cliente' => $id_cliente,
        ':data_reserva_marcada' => $data_reserva_marcada
    ]);
    $existente = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($existente['total'] > 0) {
        return $this->jsonResponse($response, ['error' => 'Já tem uma reserva marcada para esse dia.'], 400);
    }

        // Obter o dia da semana em inglês e mapear para o português
    $diaSemana = date('l', strtotime($data_reserva_marcada));  // 'l' retorna o nome completo do dia em inglês
    $diasSemanaPT = [
        "Monday" => "Segunda",
        "Tuesday" => "Terça",
        "Wednesday" => "Quarta",
        "Thursday" => "Quinta",
        "Friday" => "Sexta",
        "Saturday" => "Sábado",
        "Sunday" => "Domingo"
    ];
    $diaSemana = $diasSemanaPT[$diaSemana]; // Convertendo para o português

    // Buscar a capacidade para esse dia da semana e horário
    $stmt = $this->pdo->prepare("
        SELECT capacidade_maxima 
        FROM horarios_reserva 
        WHERE id_horario = :id_horario 
        AND id_restaurante = :id_restaurante
        AND dia_semana = :dia_semana
    ");
    $stmt->execute([
        ':id_horario' => $id_horario,
        ':id_restaurante' => $id_restaurante,
        ':dia_semana' => $diaSemana  // Passando o nome do dia em português
    ]);
    $horario = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$horario) {
        return $this->jsonResponse($response, ['error' => 'Horário não encontrado.'], 404);
    }

    // Verificar reservas existentes
    $stmt = $this->pdo->prepare("
        SELECT SUM(num_pessoas) as total_reservado
        FROM reservas
        WHERE id_horario = :id_horario
        AND id_restaurante = :id_restaurante
        AND data_reserva_marcada = :data_reserva_marcada
        AND data_reserva_marcada >= CURDATE()
    ");
    $stmt->execute([
        ':id_horario' => $id_horario,
        ':id_restaurante' => $id_restaurante,
        ':data_reserva_marcada' => $data_reserva_marcada
    ]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    $reservado = $result['total_reservado'] ?? 0;

    if ($horario['capacidade_maxima'] - $reservado < $num_pessoas) {
        return $this->jsonResponse($response, ['error' => 'Capacidade insuficiente para o número de pessoas.'], 400);
    }

    // Inserir reserva e obter o ID gerado
    $stmt = $this->pdo->prepare("
        INSERT INTO reservas (id_restaurante, num_pessoas, id_horario, id_cliente, data_reserva, data_reserva_marcada)
        VALUES (:id_restaurante, :num_pessoas, :id_horario, :id_cliente, :data_reserva, :data_reserva_marcada)
    ");
    $success = $stmt->execute([
        ':id_restaurante' => $id_restaurante,
        ':num_pessoas' => $num_pessoas,
        ':id_horario' => $id_horario,
        ':id_cliente' => $id_cliente,
        ':data_reserva' => $data_reserva,
        ':data_reserva_marcada' => $data_reserva_marcada
    ]);

    if (!$success) {
        return $this->jsonResponse($response, ['error' => 'Erro ao criar a reserva.'], 500);
    }

    $id_reserva = $this->pdo->lastInsertId();

    // Associar menus à reserva
    $stmtInsertMenu = $this->pdo->prepare("
        INSERT INTO reserva_menus (id_reserva, id_menu) VALUES (:id_reserva, :id_menu)
    ");

    foreach ($id_menus as $id_menu) {
        $stmtInsertMenu->execute([
            ':id_reserva' => $id_reserva,
            ':id_menu' => $id_menu
        ]);
    }

   


    $stmtInfo = $this->pdo->prepare("
    SELECT 
        r.id_reserva AS id_reserva,
        res.nome AS nome_restaurante,
        hr.hora_inicio,
        hr.hora_fim,
        m.nome_prato AS nome_menu,
        r.num_pessoas,
        r.data_reserva_marcada,
        u.nome,
        u.email
    FROM reservas r
    JOIN restaurantes res ON r.id_restaurante = res.id_restaurante
    JOIN horarios_reserva hr ON r.id_horario = hr.id_horario AND hr.id_restaurante = r.id_restaurante
    JOIN reserva_menus rm ON rm.id_reserva = r.id_reserva
    JOIN menu m ON m.id_menu = rm.id_menu
    JOIN utilizadores u ON r.id_cliente = u.id
    WHERE r.id_reserva = :id_reserva
");
$stmtInfo->execute([':id_reserva' => $id_reserva]);
$dados = $stmtInfo->fetchAll(PDO::FETCH_ASSOC);

if ($dados) {
    $menus = array_column($dados, 'nome_menu');

    $this->sendReservasEmail(
        $dados[0]['email'],
        $dados[0]['nome'],
        $dados[0]['nome_restaurante'],
        $dados[0]['data_reserva_marcada'],
        $dados[0]['num_pessoas'],
        $menus,
        $dados[0]['hora_inicio'] . ' - ' . $dados[0]['hora_fim']
    );
}

    return $this->jsonResponse($response, [
        'status' => 'success',
        'message' => 'Reserva realizada com sucesso.'
    ], 201);
}

public function getHorariosComOcupacao(Request $request, Response $response, $args)
{
     $data = json_decode($request->getBody()->getContents(), true);
    

    // Verificar se o id_restaurante foi fornecido
    if (!isset($data['id_restaurante'])) {
        return $this->jsonResponse($response, ['error' => 'id_restaurante não fornecido'], 400);
    }

    $id_restaurante = $data['id_restaurante'];

    try {
        // Buscar todos os horários para o restaurante, excluindo os horários passados
        $stmt = $this->pdo->prepare("
            SELECT h.id_horario, 
                   h.dia_semana, 
                   h.hora_inicio, 
                   h.hora_fim, 
                   h.capacidade_maxima, 
                   COALESCE(SUM(r.num_pessoas), 0) AS total_reservado
            FROM horarios_reserva h
            LEFT JOIN reservas r 
                ON r.id_horario = h.id_horario 
                AND r.id_restaurante = h.id_restaurante
                AND r.data_reserva_marcada >= CURDATE()
                AND (
                    (r.data_reserva_marcada = CURDATE() AND h.hora_inicio >= CURTIME())
                    OR r.data_reserva_marcada > CURDATE()
                )
                AND r.cancelada = 0
            WHERE h.id_restaurante = :id_restaurante
            AND h.ativo = 1
            GROUP BY h.id_horario
        ");
        $stmt->execute([':id_restaurante' => $id_restaurante]);
        $horarios = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Verificar se algum horário foi encontrado
        if (!$horarios) {
            return $this->jsonResponse($response, ['error' => 'Nenhum horário encontrado para este restaurante.'], 404);
        }

        // Calcular a capacidade restante
        foreach ($horarios as &$horario) {
            $horario['capacidade_restante'] = $horario['capacidade_maxima'] - $horario['total_reservado'];
        }

        // Retornar os horários com capacidade restante
        return $this->jsonResponse($response, [
            'status' => 'success',
            'horarios' => $horarios
        ],200);
    } catch (Exception $e) {
        // Tratar erros de banco de dados ou outros problemas
        return $this->jsonResponse($response, ['error' => 'Erro ao buscar os horários.'], 500);
    }
}
    

private function sendReservasEmail($email, $nome, $nomeRestaurante, $dataReserva, $numPessoas, $menus, $horario)
{
    $mail = new PHPMailer(true);

    try {
        // Configuração do servidor de e-mail
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'brunombita@gmail.com';
        $mail->Password = 'nkfb tcdx skfm modw';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;
        $mail->CharSet = 'UTF-8';


        // Destinatário
        $mail->setFrom('brunombita@gmail.com', 'MesaFácil');
        $mail->addAddress($email, $nome);

        $mail->CharSet = 'UTF-8'; 

        // Conteúdo
        $mail->isHTML(true);
        $mail->Subject = 'Confirmação da sua reserva na MesaFácil';

        // Formatando os menus (array) para string
        $menuLista = '<ul>';
        foreach ($menus as $menu) {
            $menuLista .= '<li>' . htmlspecialchars($menu) . '</li>';
        }
        $menuLista .= '</ul>';

        // Corpo do e-mail
        $mail->Body = '
            <h1>Olá ' . htmlspecialchars($nome) . '!</h1>
            <p>Obrigado por realizar sua reserva conosco. Aqui estão os detalhes da sua reserva:</p>
            <table style="border: 1px solid #ddd; padding: 10px; border-collapse: collapse; width: 100%;">
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Restaurante:</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">' . htmlspecialchars($nomeRestaurante) . '</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Data:</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">' . date("d/m/Y", strtotime($dataReserva)) . '</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Número de Pessoas:</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">' . intval($numPessoas) . '</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Menus Escolhidos:</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">' . $menuLista . '</td>
                </tr>
                <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Horário:</strong></td>
                    <td style="padding: 8px; border: 1px solid #ddd;">' . htmlspecialchars($horario) . '</td>
                </tr>
            </table>
            <p>Estamos ansiosos para recebê-lo no <strong>' . htmlspecialchars($nomeRestaurante) . '</strong>.</p>
            <p><strong>Se precisar de ajuda ou quiser modificar a sua reserva, entre em contato com o nosso suporte.</strong></p>
            <p>Atenciosamente,</p>
            <p><small>Este é um e-mail automático, por favor, não responda.</small></p>
        ';

        $mail->send();
    } catch (Exception $e) {
        error_log('Erro ao enviar e-mail: ' . $mail->ErrorInfo);
    }
}


    public function addReserva(Request $request, Response $response, $args)
{
    
    $data = json_decode($request->getBody()->getContents(), true);

    
    if (!isset($data['id_restaurante'], $data['id_menu'], $data['num_pessoas'], $data['id_horario'], $data['id_cliente'])) {
        return $this->jsonResponse($response, ['error' => 'Todos os campos são obrigatórios.'], 400);
    }

 
    $id_restaurante = $data['id_restaurante'];
    $id_menu = $data['id_menu'];
    $num_pessoas = $data['num_pessoas'];
    $id_horario = $data['id_horario'];
    $id_cliente = $data['id_cliente'];

    
    $stmt = $this->pdo->prepare("SELECT id_restaurante FROM restaurantes WHERE id_restaurante = :id_restaurante");
    $stmt->bindParam(':id_restaurante', $id_restaurante);
    $stmt->execute();

    if (!$stmt->fetch()) {
        return $this->jsonResponse($response, ['error' => 'Restaurante não encontrado.'], 404);
    }

   
    $stmt = $this->pdo->prepare("SELECT id_menu FROM menu WHERE id_menu = :id_menu");
    $stmt->bindParam(':id_menu', $id_menu);
    $stmt->execute();

    if (!$stmt->fetch()) {
        return $this->jsonResponse($response, ['error' => 'Menu não encontrado.'], 404);
    }

    $stmt = $this->pdo->prepare("SELECT * FROM horarios_reserva WHERE id_horario = :id_horario AND id_restaurante = :id_restaurante");
    $stmt->bindParam(':id_horario', $id_horario);
    $stmt->bindParam(':id_restaurante', $id_restaurante);
    $stmt->execute();
    
    $horario = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$horario) {
        return $this->jsonResponse($response, ['error' => 'Horário não encontrado ou indisponível.'], 404);
    }

    $capacidade_restante = $horario['capacidade_maxima'] - $this->getReservasCount($id_restaurante, $id_horario);

    if ($capacidade_restante < $num_pessoas) {
        return $this->jsonResponse($response, ['error' => 'Capacidade insuficiente para o número de pessoas.'], 400);
    }

 
    $data_reserva = date('Y-m-d');

    
    $stmt = $this->pdo->prepare("
        INSERT INTO reservas (id_restaurante, id_menu, num_pessoas, id_horario, id_cliente, data_reserva)
        VALUES (:id_restaurante, :id_menu, :num_pessoas, :id_horario, :id_cliente, :data_reserva)
    ");

    $stmt->bindParam(':id_restaurante', $id_restaurante);
    $stmt->bindParam(':id_menu', $id_menu);
    $stmt->bindParam(':num_pessoas', $num_pessoas);
    $stmt->bindParam(':id_horario', $id_horario);
    $stmt->bindParam(':id_cliente', $id_cliente);
    $stmt->bindParam(':data_reserva', $data_reserva);

    if ($stmt->execute()) {
        return $this->jsonResponse($response, [
            'status' => 'success',
            'message' => 'Reserva realizada com sucesso.'
        ], 201);
    } else {
        return $this->jsonResponse($response, ['error' => 'Erro ao realizar a reserva.'], 500);
    }
}


private function getReservasCount($id_restaurante, $id_horario)
{
    $stmt = $this->pdo->prepare("
        SELECT COUNT(*) as reservas
        FROM reservas
        WHERE id_restaurante = :id_restaurante
        AND id_horario = :id_horario
    ");
    $stmt->bindParam(':id_restaurante', $id_restaurante);
    $stmt->bindParam(':id_horario', $id_horario);
    $stmt->execute();
    return $stmt->fetch(PDO::FETCH_ASSOC)['reservas'];
}




public function ObterReservasCliente(Request $request, Response $response, $args)
{
    $data = json_decode($request->getBody()->getContents(), true);

    if (!isset($data['id_utilizador'])) {
        return $this->jsonResponse($response, ['error' => 'ID do utilizador é obrigatório.'], 400);
    }

    $id_utilizador = $data['id_utilizador'];

    try {
        $stmt = $this->pdo->prepare("CALL sp_ObterReservasCliente(:id_utilizador)");
        $stmt->bindParam(':id_utilizador', $id_utilizador, PDO::PARAM_INT);
        $stmt->execute();
        $reservasData = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (empty($reservasData)) {
            return $this->jsonResponse($response, ['error' => 'Nenhuma reserva encontrada!'], 404);
        }

        $reservas = [];

        foreach ($reservasData as $data) {
            $id_reserva = $data['id_reserva'];

            if (!isset($reservas[$id_reserva])) {
                $reservas[$id_reserva] = [
                    'id_reserva' => $id_reserva,
                    'restaurante' => $data['nome_restaurante'] ?? null,
                    'localizacao' => $data['localizacao'] ?? null,
                    'dia_semana' => $data['dia_semana'] ?? null,
                    'hora_inicio' => $data['hora_inicio'] ?? null,
                    'hora_fim' => $data['hora_fim'] ?? null,
                    'data_reserva' => $data['data_reserva'] ?? null,
                    'data_reserva_marcada' => $data['data_reserva_marcada'] ?? null,
                    'num_pessoas' => $data['num_pessoas'] ?? null,
                    'imagem_restaurante' => !empty($data['imagem_restaurante']) ? base64_encode($data['imagem_restaurante']) : null,
                    'menus' => []
                ];
            }

            $reservas[$id_reserva]['menus'][] = [
                'nome_prato' => $data['nome_prato'],
                'preco' => $data['preco'],
                'imagem_prato' => !empty($data['imagem_prato']) ? base64_encode($data['imagem_prato']) : null,
            ];
        }

        return $this->jsonResponse($response, [
            'status' => 'success',
            'reservas' => array_values($reservas)
        ], 200);

    } catch (Exception $e) {
        return $this->jsonResponse($response, ['error' => 'Erro ao obter as reservas: ' . $e->getMessage()], 500);
    }
}



public function ObterReservasCanceladasCliente(Request $request, Response $response, $args)
{
    $data = json_decode($request->getBody()->getContents(), true);

    if (!isset($data['id_utilizador'])) {
        return $this->jsonResponse($response, ['error' => 'ID do utilizador é obrigatório.'], 400);
    }

    $id_utilizador = $data['id_utilizador'];

    try {
        $stmt = $this->pdo->prepare("CALL sp_ObterReservasCanceladasCliente(:id_utilizador)");
        $stmt->bindParam(':id_utilizador', $id_utilizador, PDO::PARAM_INT);
        $stmt->execute();
        $reservasData = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (empty($reservasData)) {
            return $this->jsonResponse($response, ['error' => 'Nenhuma reserva encontrada!'], 404);
        }

        $reservas = [];

        foreach ($reservasData as $data) {
            $id_reserva = $data['id_reserva'];

            if (!isset($reservas[$id_reserva])) {
                $reservas[$id_reserva] = [
                    'id_reserva' => $id_reserva,
                    'restaurante' => $data['nome_restaurante'] ?? null,
                    'localizacao' => $data['localizacao'] ?? null,
                    'dia_semana' => $data['dia_semana'] ?? null,
                    'hora_inicio' => $data['hora_inicio'] ?? null,
                    'hora_fim' => $data['hora_fim'] ?? null,
                    'data_reserva' => $data['data_reserva'] ?? null,
                    'data_reserva_marcada' => $data['data_reserva_marcada'] ?? null,
                    'num_pessoas' => $data['num_pessoas'] ?? null,
                    'imagem_restaurante' => !empty($data['imagem_restaurante']) ? base64_encode($data['imagem_restaurante']) : null,
                    'menus' => []
                ];
            }

            $reservas[$id_reserva]['menus'][] = [
                'nome_prato' => $data['nome_prato'],
                'preco' => $data['preco'],
                'imagem_prato' => !empty($data['imagem_prato']) ? base64_encode($data['imagem_prato']) : null,
            ];
        }

        return $this->jsonResponse($response, [
            'status' => 'success',
            'reservas' => array_values($reservas)
        ], 200);

    } catch (Exception $e) {
        return $this->jsonResponse($response, ['error' => 'Erro ao obter as reservas: ' . $e->getMessage()], 500);
    }
}

public function ObterReservasPassadasCliente(Request $request, Response $response, $args)
{
    $data = json_decode($request->getBody()->getContents(), true);

    if (!isset($data['id_utilizador'])) {
        return $this->jsonResponse($response, ['error' => 'ID do utilizador é obrigatório.'], 400);
    }

    $id_utilizador = $data['id_utilizador'];

    try {
        $stmt = $this->pdo->prepare("CALL sp_ObterReservasPassadasCliente(:id_utilizador)");
        $stmt->bindParam(':id_utilizador', $id_utilizador, PDO::PARAM_INT);
        $stmt->execute();
        $reservasData = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (empty($reservasData)) {
            return $this->jsonResponse($response, ['error' => 'Nenhuma reserva encontrada!'], 404);
        }

        $reservas = [];

        foreach ($reservasData as $data) {
            $id_reserva = $data['id_reserva'];

            if (!isset($reservas[$id_reserva])) {
                $reservas[$id_reserva] = [
                    'id_reserva' => $id_reserva,
                    'restaurante' => $data['nome_restaurante'] ?? null,
                    'localizacao' => $data['localizacao'] ?? null,
                    'dia_semana' => $data['dia_semana'] ?? null,
                    'hora_inicio' => $data['hora_inicio'] ?? null,
                    'hora_fim' => $data['hora_fim'] ?? null,
                    'data_reserva_marcada' => $data['data_reserva_marcada'] ?? null,
                    'num_pessoas' => $data['num_pessoas'] ?? null,
                    'imagem_restaurante' => !empty($data['imagem_restaurante']) ? base64_encode($data['imagem_restaurante']) : null,
                    'menus' => []
                ];
            }

            $reservas[$id_reserva]['menus'][] = [
                'nome_prato' => $data['nome_prato'],
                'preco' => $data['preco'],
                'imagem_prato' => !empty($data['imagem_prato']) ? base64_encode($data['imagem_prato']) : null,
            ];
        }

        return $this->jsonResponse($response, [
            'status' => 'success',
            'reservas' => array_values($reservas)
        ], 200);

    } catch (Exception $e) {
        return $this->jsonResponse($response, ['error' => 'Erro ao obter as reservas: ' . $e->getMessage()], 500);
    }
}

public function verificarReservaPorData(Request $request, Response $response, $args)
{
    $data = json_decode($request->getBody()->getContents(), true);

    if (!isset($data['id_cliente'], $data['data_reserva_marcada'])) {
        return $this->jsonResponse($response, ['error' => 'Campos obrigatórios não fornecidos.'], 400);
    }

    $id_cliente = $data['id_cliente'];
    $data_reserva_marcada = $data['data_reserva_marcada'];

    $stmt = $this->pdo->prepare("
        SELECT COUNT(*) as total
        FROM reservas
        WHERE id_cliente = :id_cliente
        AND data_reserva_marcada = :data_reserva_marcada
        AND cancelada = 0
    ");
    $stmt->execute([
        ':id_cliente' => $id_cliente,
        ':data_reserva_marcada' => $data_reserva_marcada
    ]);
    $resultado = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($resultado['total'] > 0) {
        return $this->jsonResponse($response, [
            'reserva_existente' => true,
            'mensagem' => 'Já existe uma reserva sua marcada para este dia.'
        ], 200);
    }

    return $this->jsonResponse($response, [
        'reserva_existente' => false
    ], 200);
}

  
public function CancelarReserva(Request $request, Response $response, $args)
{
    $data = json_decode($request->getBody()->getContents(), true);

    
    if (!isset($data['id_reserva'])) {
        return $this->jsonResponse($response, ['error' => 'ID da reserva é obrigatório.'], 400);
    }

    $id_reserva = $data['id_reserva'];

    try {
        
        $stmt = $this->pdo->prepare("CALL sp_CancelarReserva(:id_reserva)");
        $stmt->bindParam(':id_reserva', $id_reserva, PDO::PARAM_INT);
        $stmt->execute();

        
        $result = $stmt->fetch(PDO::FETCH_ASSOC);


        if (!$result || !isset($result['resultado'])) {
            return $this->jsonResponse($response, [
                'error' => 'Erro inesperado ao cancelar a reserva.'
            ], 500);
        }

        if ($result['resultado'] == -1) {
            return $this->jsonResponse($response, [
                'error' => 'Não é possível cancelar a reserva, pois faltam menos de 2 horas.'
            ], 400);
        }

        if ($result['resultado'] == 1) {
            return $this->jsonResponse($response, [
                'status' => 'success',
                'message' => 'Reserva cancelada com sucesso.'
            ], 200);
        }

        return $this->jsonResponse($response, [
            'error' => 'Reserva não encontrada ou já foi cancelada.'
        ], 404);

    } catch (Exception $e) {
        return $this->jsonResponse($response, [
            'error' => 'Erro ao cancelar a reserva: ' . $e->getMessage()
        ], 500);
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
<?php

use App\controllers\ReservasController;


$app->post('/addReservas', function ($request, $response, $args) {
    global $pdo;
    $reservasController = new ReservasController($pdo);
    return $reservasController->addReserva2($request, $response, $args);
});


$app->post('/obterReservas', function ($request, $response, $args) {
    global $pdo;
    $reservasController = new ReservasController($pdo);
    return $reservasController->ObterReservasCliente($request, $response, $args);
});

$app->post('/obterReservasCanceladas', function ($request, $response, $args) {
    global $pdo;
    $reservasController = new ReservasController($pdo);
    return $reservasController->ObterReservasCanceladasCliente($request, $response, $args);
});

$app->post('/obterReservasPassadas', function ($request, $response, $args) {
    global $pdo;
    $reservasController = new ReservasController($pdo);
    return $reservasController->ObterReservasPassadasCliente($request, $response, $args);
});


$app->post('/verificarReservasExistentes', function ($request, $response, $args) {
    global $pdo;
    $reservasController = new ReservasController($pdo);
    return $reservasController->verificarReservaPorData($request, $response, $args);
});


$app->put('/cancelarReserva', function ($request, $response, $args) {
    global $pdo;
    $reservasController = new ReservasController($pdo);
    return $reservasController->CancelarReserva($request, $response, $args);
});



$app->POST('/ObterCapacidadeHorarios', function ($request, $response, $args) {
    global $pdo;
    $reservasController = new ReservasController($pdo);
    return $reservasController->getHorariosComOcupacao($request, $response, $args);
});

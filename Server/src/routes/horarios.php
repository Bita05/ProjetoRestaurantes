<?php

use App\Controllers\HorariosController;


$app->post('/horarios/add', function ($request, $response, $args) {
    global $pdo;
    $horariosControlelr = new HorariosController($pdo);
    return $horariosControlelr->addHorario($request, $response, $args);
});


$app->post('/horarios', function ($request, $response, $args) {
    global $pdo;
    $horariosController = new HorariosController($pdo);
    return $horariosController->getHorarios($request, $response, $args);
});


$app->post('/horariosReserva', function ($request, $response, $args) {
    global $pdo;
    $horariosController = new HorariosController($pdo);
    return $horariosController->getHorariosParaReserva($request, $response, $args);
});


$app->post('/horariosRestaurante', function ($request, $response, $args) {
    global $pdo;
    $horariosController = new HorariosController($pdo);
    return $horariosController->ObterHorariosRestaurante($request, $response, $args);
});

$app->post('/removerHorarios', function ($request, $response, $args) {
    global $pdo;
    $horariosController = new HorariosController($pdo);
    return $horariosController->removerHorario($request, $response, $args);
});


<?php

use App\Controllers\RestauranteController;
use Slim\App;

return function (App $app) {
$app->get('/restaurantes', function ($request, $response, $args) {

    global $pdo;
    
    
    $restauranteController = new RestauranteController($pdo);
    
    
    return $restauranteController->listarRestaurantes($request, $response, $args);
});


$app->post('/restaurante/info', function ($request, $response, $args) {
    global $pdo;
    $restauranteController = new RestauranteController($pdo);
    return $restauranteController->InfoRestaurante($request, $response, $args);
});


$app->post('/restaurante/menu', function ($request, $response, $args) {
    global $pdo;
    $restauranteController = new RestauranteController($pdo);
    return $restauranteController->AddMenu($request, $response, $args);
});

$app->post('/restaurante/listarMenu', function ($request, $response, $args) {
    global $pdo;
    $restauranteController = new RestauranteController($pdo);
    return $restauranteController->listarMenusRestaurante($request, $response, $args);
});


$app->post('/restaurante/obterReservas', function ($request, $response, $args) {
    global $pdo;
    $restauranteController = new RestauranteController($pdo);
    return $restauranteController->ObterReservasRestaurante($request, $response, $args);
});


$app->post('/restaurante/ObterNumeroReservas', function ($request, $response, $args) {
    global $pdo;
    $restauranteController = new RestauranteController($pdo);
    return $restauranteController->getNumeroReservasSemana($request, $response, $args);
});

$app->post('/restaurante/ObterMaisReservasSemanais', function ($request, $response, $args) {
    global $pdo;
    $restauranteController = new RestauranteController($pdo);
    return $restauranteController->getMaisReservasSemanais($request, $response, $args);
});

$app->post('/restaurante/DadosRestaurante', function ($request, $response, $args) {
    global $pdo;
    $restauranteController = new RestauranteController($pdo);
    return $restauranteController->DadosRestaurante($request, $response, $args);
});

$app->post('/restaurante/AtualizarRestaurante', function ($request, $response, $args) {
    global $pdo;
    $restauranteController = new RestauranteController($pdo);
    return $restauranteController->AtualizarRestaurante($request, $response, $args);
});


$app->get('/restaurante/RestaurantesPopulares', function ($request, $response, $args) {
    global $pdo;
    $restauranteController = new RestauranteController($pdo);
    return $restauranteController->ObterRestaurantesPopulares($request, $response, $args);
});

}

?>
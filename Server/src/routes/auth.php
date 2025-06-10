<?php

use App\controllers\AuthController;


$app->post('/login', function ($request, $response, $args) {
    global $pdo;
    
    $authController = new AuthController($pdo);
    return $authController->login($request, $response, $args);
});


$app->post('/register', function ($request, $response, $args) {
    global $pdo;
    
    $authController = new AuthController($pdo);
    return $authController->register($request, $response, $args);
});


$app->put('/editarCliente', function ($request, $response, $args) {
    global $pdo;
    
    $authController = new AuthController($pdo);
    return $authController->editarCliente($request, $response, $args);
});




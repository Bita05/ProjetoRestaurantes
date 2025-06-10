<?php

use App\controllers\AdminController;
use App\config\EmailHandler;


$app->post('/admin/pedidoRegisto', function ($request, $response, $args) {
    global $pdo;
    
    $adminController = new AdminController($pdo);
    return $adminController->PedidosDeRegistoRestaurante($request, $response, $args);
});

$app->get('/admin/ObterPedidoRegisto', function ($request, $response, $args) {
    global $pdo;
    
    $adminController = new AdminController($pdo);
    return $adminController->ObterPedidosRegistoRestaurantes($request, $response, $args);
});

$app->post('/admin/AprovarPedido', function ($request, $response, $args) {
    global $pdo;
    
    $adminController = new AdminController($pdo);
    return $adminController->AprovarPedidoRegisto($request, $response, $args);
});


$app->post('/admin/RejeitarPedido', function ($request, $response, $args) {
    global $pdo;
    
    $adminController = new AdminController($pdo);
    return $adminController->RejeitarPedidoRegisto($request, $response, $args);
});

$app->get('/admin/Utilizadores', function ($request, $response, $args) {
    global $pdo;
    
    $adminController = new AdminController($pdo);
    return $adminController->ObterUtilizadoresRestaurantes($request, $response, $args);
});


$app->get('/admin/UtilizadoresClientes', function ($request, $response, $args) {
    global $pdo;
    
    $adminController = new AdminController($pdo);
    return $adminController->ObterUtilizadoresClientes($request, $response, $args);
});


$app->post('/admin/EditarRestaurantes', function ($request, $response, $args) {
    global $pdo;
    
    $adminController = new AdminController($pdo);
    return $adminController->EditarRestaurante($request, $response, $args);
});


$app->get('/admin/ObteredidosPendentes', function ($request, $response, $args) {
    global $pdo;
    
    $adminController = new AdminController($pdo);
    return $adminController->ObterContagemPedidosPendentes($request, $response, $args);
});

$app->get('/admin/ObterNumRestaurantes', function ($request, $response, $args) {
    global $pdo;
    
    $adminController = new AdminController($pdo);
    return $adminController->ObterContagemRestaurantes($request, $response, $args);
});

$app->get('/admin/ObterNumClientes', function ($request, $response, $args) {
    global $pdo;
    $adminController = new AdminController($pdo);
    return $adminController->ObterContagemClientes($request, $response, $args);
});






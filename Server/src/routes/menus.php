<?php

use App\Controllers\MenusController;



$app->post('/menu/delete', function ($request, $response, $args) {
    global $pdo;
    $menusController = new MenusController($pdo);
    return $menusController->deleteMenu($request, $response, $args);
});

$app->post('/menu/editar', function ($request, $response, $args) {
    global $pdo;
    $menusController = new MenusController($pdo);
    return $menusController->editarMenu($request, $response, $args);
});



<?php

use Slim\Factory\AppFactory;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Exception\HttpNotFoundException;

require __DIR__ . '/../vendor/autoload.php';
require __DIR__ . '/../src/config/db.php';

$app = AppFactory::create();

// Middleware CORS
(require __DIR__ . '/cors.php')($app);

// Middleware de roteamento (obrigatório antes dos handlers de erro)
$app->addRoutingMiddleware();

// Middleware de erro 404 personalizado
$customErrorHandler = function (
    Request $request,
    Throwable $exception,
    bool $displayErrorDetails,
    bool $logErrors,
    bool $logErrorDetails
) use ($app) {
    $response = $app->getResponseFactory()->createResponse();
    
    if ($exception instanceof HttpNotFoundException) {
        $response->getBody()->write(json_encode([
            'error' => 'Rota não encontrada'
        ]));
        return $response
            ->withStatus(404)
            ->withHeader('Content-Type', 'application/json');
    }

    // Deixa os outros erros seguirem o fluxo normal
    throw $exception;
};

$errorMiddleware = $app->addErrorMiddleware(true, true, true);
$errorMiddleware->setErrorHandler(HttpNotFoundException::class, $customErrorHandler);

// ✅ Rota de raiz opcional (evita erro ao acessar a home)
$app->get('/', function (Request $request, Response $response) {
    $response->getBody()->write("API Slim funcionando!");
    return $response;
});

// Suas rotas
require __DIR__ . '/../src/routes/auth.php';
require __DIR__ . '/../src/routes/restaurantes.php';
require __DIR__ . '/../src/routes/menus.php';
require __DIR__ . '/../src/routes/horarios.php';
require __DIR__ . '/../src/routes/reservas.php';
require __DIR__ . '/../src/routes/admin.php';

// Executa a aplicação
$app->run();

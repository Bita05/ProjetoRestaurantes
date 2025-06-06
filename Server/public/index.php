<?php
require __DIR__ . '/../vendor/autoload.php';
require __DIR__ . '/../src/config/db.php';


use Slim\Factory\AppFactory;
use Psr\Container\ContainerInterface;
use Slim\Middleware\CorsMiddleware;


$app = AppFactory::create();

(require __DIR__ . '/cors.php')($app);

require __DIR__ . '/../src/routes/auth.php';
(require __DIR__ . '/../src/routes/restaurantes.php')($app);
require __DIR__ . '/../src/routes/menus.php';
require __DIR__ . '/../src/routes/horarios.php';
require __DIR__ . '/../src/routes/reservas.php';
require __DIR__ . '/../src/routes/admin.php';


$app->run();
?>

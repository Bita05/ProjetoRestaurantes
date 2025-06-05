<?php
// Pega as variáveis de ambiente definidas no Render
$host = getenv('DB_HOST');        // ex: hopper.proxy.rlwy.net
$port = getenv('DB_PORT');        // ex: 15790
$dbname = getenv('DB_NAME');      // ex: railway
$username = getenv('DB_USER');    // ex: root
$password = getenv('DB_PASSWORD'); // a password da base

// Cria o DSN incluindo o host, porta e base de dados
$dsn = "mysql:host=$host;port=$port;dbname=$dbname;charset=utf8mb4";

try {
    $pdo = new PDO($dsn, $username, $password);
    // Configura para lançar exceções em caso de erro
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo 'Erro na conexão: ' . $e->getMessage();
}
?>

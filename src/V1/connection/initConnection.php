<?php

define('DEVICE', 'postgresql');

$host = 'ec2-54-235-204-221.compute-1.amazonaws.com';
$username = 'ulqihxhcoevgpg';
$password = '9a5c3428150105758db6893d78d87fd149492a36e361e213d88c4030b78e535a';
$database = 'dcop731sa5nvrp';

include __DIR__ . '/../connection/IConnection.php';

if (DEVICE == 'mysql') {
    include __DIR__ . '/../connection/Connection.php';
    $connection = new \Dijkstra\V1\Connection\Connection($host, $username, $password, $database);
} elseif (DEVICE == 'postgresql') {
    include __DIR__ . '/../connection/PostgresqlConnection.php';
    $connection = new \Dijkstra\V1\Connection\PostgresqlConnection($host, $username, $password, $database);
} else {
    throw new Exception('Missing device');
}


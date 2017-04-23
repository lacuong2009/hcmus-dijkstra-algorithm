<?php

include __DIR__ . '/../connection/initConnection.php';
$results = $connection->fetchAll('SELECT * FROM location');

echo json_encode(['data' => $results]);
exit;
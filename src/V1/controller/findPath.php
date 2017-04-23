<?php

$from = isset($_POST['from']) ? $_POST['from'] : null;
$to = isset($_POST['to']) ? $_POST['to'] : null;

include __DIR__ . '/../dijkstras/Dijkstras.php';
include __DIR__ . '/../connection/initConnection.php';

$from_location = $connection->fetchAll("SELECT id FROM location WHERE address = $from");
$from_location = current($from_location);

$to_location = $connection->fetchAll("SELECT id FROM location WHERE address = $to");
$to_location = current($to_location);

$graph = new Graph();

$results = $connection->fetchAll('SELECT * FROM parent_children');

$data = [];
$queue = [];

foreach ($results as $result) {
    $children = [];
    foreach ($results as $index => $item) {
        if (in_array($result['parent'], $queue)) continue;

        if ($result['parent'] == $item['parent']) {
            $children += [$item['children'] => (int)$item['distance']];
        }

        if ($result['parent'] == $item['children']) {
            $children += [$item['parent'] => (int)$item['distance']];
        }
    }

    if (!empty($children)) {
        $queue[] = $result['parent'];
        $graph->add_vertex($result['parent'], $children);
    }
}

$short = $graph->shortest_path(intval($from_location['id']), intval($to_location['id']));

$sql = sprintf('SELECT * FROM location WHERE id IN (%s)', implode(',', $short));
$location = $connection->fetchAll($sql);

$data = [];
foreach ($short as $item) {
    foreach ($location as $value)  {
        if ($item == $value['id']) {
            $data[] = $value;
            break;
        }
    }
}



echo json_encode(['data' => ($data)]);
exit();
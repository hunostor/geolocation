<?php

require_once 'app/bootstrap.php';

$mongoStores = $mongodb->selectCollection('stores');

$stores = $db->query("
    SELECT * FROM stores
");

$stores = $stores->fetchAll(PDO::FETCH_OBJ);

$mongodb->dropCollection('stores');

foreach ($stores as $store) {
    $mongoStores->insert([
        'address' => $store->address,
        'telephone' => $store->telephone,
        'location' => [
            'type' => 'Point',
            'coordinates' => [
                (float) $store->lng,
                (float) $store->lat
            ]
        ]
    ]);
}

$mongoStores->createIndex(['location' => '2dsphere']);

<?php
require_once 'app/bootstrap.php';

header('Content-Type: application/json');

if (!isset($_GET['lat'], $_GET['lng'])) {
    echo json_encode([
        'error' => 'No lat/lng provided',
    ]);

    die();
}

$lat = (float) $_GET['lat'];
$lng = (float) $_GET['lng'];



$locations = $db->query("SELECT id, address, lat, lng, telephone, email, website, name, ( 6371 * acos( cos( radians( $lat ) ) * cos( radians( lat ) ) * cos( radians( lng ) - radians( $lng ) ) + sin( radians( $lat ) ) * sin( radians( lat ) ) ) ) AS distance FROM locations HAVING distance < 10000 ORDER BY distance LIMIT 0 , 20;
");

$locations = $locations->fetchAll(PDO::FETCH_ASSOC);


$results = array_map(function ($store) {
    return [
        'distance' => [
            'meters' => round($store['distance'], 2, PHP_ROUND_HALF_UP),
            'miles' => round($store['distance'], 2, PHP_ROUND_HALF_UP),
        ],
        'address' => $store['address'],
        'telephone' => $store['telephone'],
        'email' => $store['email'],  
        'website' => $store['website'],
        'name' => $store['name'],
        'location' => [
            'lat' => $store['lat'],
            'lng' => $store['lng'],
        ],
    ]; 
}, $locations);

echo json_encode([
    'count' => count($results),
    'results' => $results,
]);


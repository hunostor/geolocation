<?php

$db = new PDO('mysql:host=localhost;dbname=location', 'homestead', 'secret');
$db->exec("set names utf8");
// $mongodb = new MongoClient('mongodb://localhost:27017');
// $mongodb = $mongodb->selectDB('codecourse');

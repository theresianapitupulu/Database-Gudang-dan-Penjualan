<?php
header('Content-Type: application/json; charset=utf-8');
require 'config.php';

try {
    // Cek apakah tabel items ada
    $stmt = $pdo->query("SHOW TABLES LIKE 'items'");
    if ($stmt->rowCount() === 0) {
        throw new Exception("Tabel 'items' tidak ditemukan di database.");
    }

    $stmt = $pdo->query("SELECT item_id, item_name, quantity, unit_price FROM items");
    $items = $stmt->fetchAll();
    echo json_encode($items);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Gagal mengambil data barang: ' . $e->getMessage()]);
}
?>
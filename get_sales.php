<?php
header('Content-Type: application/json; charset=utf-8');
require 'config.php';

try {
    $stmt = $pdo->query("SELECT t.transaction_id, t.item_id, t.quantity, t.transaction_date, t.notes, i.item_name 
                         FROM transactions t 
                         JOIN items i ON t.item_id = i.item_id 
                         WHERE t.transaction_type = 'out'");
    $sales = $stmt->fetchAll();
    echo json_encode($sales);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Gagal mengambil data penjualan: ' . $e->getMessage()]);
}
?>
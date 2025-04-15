<?php
header('Content-Type: text/plain; charset=utf-8');
require 'config.php';

try {
    $id = isset($_POST['id']) ? (int)$_POST['id'] : 0;
    $item_name = isset($_POST['item_name']) ? trim($_POST['item_name']) : '';
    $quantity = isset($_POST['quantity']) ? (int)$_POST['quantity'] : 0;
    $unit_price = isset($_POST['unit_price']) ? (float)$_POST['unit_price'] : 0.0;

    if ($id <= 0 || empty($item_name) || $quantity < 0 || $unit_price < 0) {
        throw new Exception("Data tidak valid.");
    }

    $stmt = $pdo->prepare("UPDATE items SET item_name = ?, quantity = ?, unit_price = ? WHERE item_id = ?");
    $stmt->execute([$item_name, $quantity, $unit_price, $id]);

    echo "Barang berhasil diupdate";
} catch (Exception $e) {
    http_response_code(400);
    echo "Gagal mengedit barang: " . $e->getMessage();
}
?>
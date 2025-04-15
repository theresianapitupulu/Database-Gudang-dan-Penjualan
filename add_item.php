<?php
header('Content-Type: text/plain; charset=utf-8');
require 'config.php';

try {
    $item_name = isset($_POST['item_name']) ? trim($_POST['item_name']) : '';
    $quantity = isset($_POST['quantity']) ? (int)$_POST['quantity'] : 0;
    $unit_price = isset($_POST['unit_price']) ? (float)$_POST['unit_price'] : 0.0;

    if (empty($item_name) || $quantity < 0 || $unit_price < 0) {
        throw new Exception("Nama barang, jumlah, dan harga satuan harus valid.");
    }

    $stmt = $pdo->prepare("INSERT INTO items (item_name, quantity, unit_price) VALUES (?, ?, ?)");
    $stmt->execute([$item_name, $quantity, $unit_price]);

    echo "Barang berhasil ditambahkan";
} catch (Exception $e) {
    http_response_code(400);
    echo "Gagal menambah barang: " . $e->getMessage();
}
?>
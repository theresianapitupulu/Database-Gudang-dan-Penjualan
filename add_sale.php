<?php
header('Content-Type: text/plain; charset=utf-8');
require 'config.php';

try {
    $item_id = isset($_POST['item_id']) ? (int)$_POST['item_id'] : 0;
    $quantity = isset($_POST['quantity']) ? (int)$_POST['quantity'] : 0;
    $notes = isset($_POST['notes']) ? trim($_POST['notes']) : '';

    if ($item_id <= 0 || $quantity <= 0) {
        throw new Exception("Pilih barang dan masukkan jumlah yang valid.");
    }

    // Validasi stok
    $stmt = $pdo->prepare("SELECT quantity FROM items WHERE item_id = ?");
    $stmt->execute([$item_id]);
    $item = $stmt->fetch();

    if (!$item) {
        throw new Exception("Barang tidak ditemukan.");
    }
    if ($item['quantity'] < $quantity) {
        throw new Exception("Stok tidak cukup.");
    }

    // Kurangi stok
    $stmt = $pdo->prepare("UPDATE items SET quantity = quantity - ? WHERE item_id = ?");
    $stmt->execute([$quantity, $item_id]);

    // Catat transaksi
    $stmt = $pdo->prepare("INSERT INTO transactions (item_id, transaction_type, quantity, notes) VALUES (?, 'out', ?, ?)");
    $stmt->execute([$item_id, $quantity, $notes]);

    echo "Penjualan berhasil dicatat";
} catch (Exception $e) {
    http_response_code(400);
    echo "Gagal mencatat penjualan: " . $e->getMessage();
}
?>
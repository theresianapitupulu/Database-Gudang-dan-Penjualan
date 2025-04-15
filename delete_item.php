<?php
header('Content-Type: text/plain; charset=utf-8');
require 'config.php';

try {
    $id = isset($_POST['id']) ? (int)$_POST['id'] : 0;

    if ($id <= 0) {
        throw new Exception("ID tidak valid.");
    }

    $stmt = $pdo->prepare("DELETE FROM items WHERE item_id = ?");
    $stmt->execute([$id]);

    echo "Barang berhasil dihapus";
} catch (Exception $e) {
    http_response_code(400);
    echo "Gagal menghapus barang: " . $e->getMessage();
}
?>
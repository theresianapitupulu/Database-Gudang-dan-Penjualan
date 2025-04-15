// Memuat data stok barang
function loadInventory() {
    fetch('get_items.php')
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            const tbody = document.getElementById('inventoryBody');
            tbody.innerHTML = '';
            if (data.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5">Tidak ada data barang.</td></tr>';
                return;
            }
            data.forEach(item => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${item.item_id}</td>
                    <td>${item.item_name}</td>
                    <td>${item.quantity}</td>
                    <td>${parseFloat(item.unit_price).toLocaleString('id-ID')}</td>
                    <td>
                        <button class="btn-edit" onclick="editItem(${item.item_id}, '${item.item_name.replace(/'/g, "\\'")}', ${item.quantity}, ${item.unit_price})">Edit</button>
                        <button class="btn-delete" onclick="deleteItem(${item.item_id})">Hapus</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        })
        .catch(error => {
            console.error('Error fetching items:', error);
            alert('Gagal memuat data barang. Periksa konsol untuk detail.');
        });
}

// Menambah barang baru
function addItem() {
    const name = document.getElementById('itemName').value.trim();
    const quantity = document.getElementById('quantity').value;
    const unitPrice = document.getElementById('unitPrice').value;

    if (!name || !quantity || !unitPrice || quantity < 0 || unitPrice < 0) {
        alert('Nama barang, jumlah, dan harga satuan harus diisi dengan nilai yang valid!');
        return;
    }

    fetch('add_item.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `item_name=${encodeURIComponent(name)}&quantity=${encodeURIComponent(quantity)}&unit_price=${encodeURIComponent(unitPrice)}`
    })
    .then(response => {
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return response.text();
    })
    .then(result => {
        console.log('Add item response:', result);
        if (result.includes('berhasil')) {
            document.getElementById('itemName').value = '';
            document.getElementById('quantity').value = '';
            document.getElementById('unitPrice').value = '';
            loadInventory();
        } else {
            alert('Gagal menambah barang: ' + result);
        }
    })
    .catch(error => {
        console.error('Error adding item:', error);
        alert('Gagal menambah barang. Periksa konsol untuk detail.');
    });
}

// Menghapus barang
function deleteItem(id) {
    if (confirm('Apakah Anda yakin ingin menghapus barang ini?')) {
        fetch('delete_item.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `id=${id}`
        })
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.text();
        })
        .then(result => {
            console.log('Delete item response:', result);
            loadInventory();
        })
        .catch(error => {
            console.error('Error deleting item:', error);
            alert('Gagal menghapus barang.');
        });
    }
}

// Mengedit barang
function editItem(id, name, quantity, unitPrice) {
    const newName = prompt('Masukkan nama baru:', name);
    const newQuantity = prompt('Masukkan jumlah baru:', quantity);
    const newUnitPrice = prompt('Masukkan harga satuan baru:', unitPrice);

    if (newName && newQuantity && newUnitPrice && newQuantity >= 0 && newUnitPrice >= 0) {
        fetch('update_item.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `id=${id}&item_name=${encodeURIComponent(newName)}&quantity=${encodeURIComponent(newQuantity)}&unit_price=${encodeURIComponent(newUnitPrice)}`
        })
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.text();
        })
        .then(result => {
            console.log('Update item response:', result);
            loadInventory();
        })
        .catch(error => {
            console.error('Error updating item:', error);
            alert('Gagal mengedit barang.');
        });
    } else {
        alert('Semua kolom harus diisi dengan nilai yang valid!');
    }
}

// Memuat stok saat halaman dibuka
window.onload = loadInventory;
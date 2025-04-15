// Memuat daftar barang ke dropdown
function loadItems() {
    fetch('get_items.php')
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            const select = document.getElementById('itemId');
            select.innerHTML = '<option value="">Pilih Barang</option>';
            data.forEach(item => {
                const option = document.createElement('option');
                option.value = item.item_id;
                option.textContent = `${item.item_name} (Stok: ${item.quantity})`;
                select.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching items:', error);
            alert('Gagal memuat daftar barang.');
        });
}

// Memuat riwayat penjualan
function loadSales() {
    fetch('get_sales.php')
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            const tbody = document.getElementById('salesBody');
            tbody.innerHTML = '';
            if (data.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5">Tidak ada data penjualan.</td></tr>';
                return;
            }
            data.forEach(sale => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${sale.transaction_id}</td>
                    <td>${sale.item_name}</td>
                    <td>${sale.quantity}</td>
                    <td>${new Date(sale.transaction_date).toLocaleString('id-ID')}</td>
                    <td>${sale.notes || '-'}</td>
                `;
                tbody.appendChild(tr);
            });
        })
        .catch(error => {
            console.error('Error fetching sales:', error);
            alert('Gagal memuat riwayat penjualan.');
        });
}

// Mencatat penjualan
function addSale() {
    const itemId = document.getElementById('itemId').value;
    const quantity = document.getElementById('quantity').value;
    const notes = document.getElementById('notes').value;

    if (!itemId || !quantity || quantity <= 0) {
        alert('Pilih barang dan masukkan jumlah yang valid!');
        return;
    }

    fetch('add_sale.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `item_id=${encodeURIComponent(itemId)}&quantity=${encodeURIComponent(quantity)}&notes=${encodeURIComponent(notes)}`
    })
    .then(response => {
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return response.text();
    })
    .then(result => {
        console.log('Add sale response:', result);
        if (result.includes('berhasil')) {
            document.getElementById('itemId').value = '';
            document.getElementById('quantity').value = '';
            document.getElementById('notes').value = '';
            loadItems();
            loadSales();
        } else {
            alert('Gagal mencatat penjualan: ' + result);
        }
    })
    .catch(error => {
        console.error('Error adding sale:', error);
        alert('Gagal mencatat penjualan.');
    });
}

// Memuat data saat halaman dibuka
window.onload = () => {
    loadItems();
    loadSales();
};
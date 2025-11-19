// Transaction History - Updated for correct data structure

let transactions = [];
let filteredTransactions = [];
let currentPage = 1;
const itemsPerPage = 10;

// DOM Elements
const currentPointsEl = document.getElementById('currentPoints');
const typeFilter = document.getElementById('typeFilter');
const periodFilter = document.getElementById('periodFilter');
const searchInput = document.getElementById('searchInput');
const resetBtn = document.getElementById('resetBtn');
const tableBody = document.getElementById('tableBody');
const emptyState = document.getElementById('emptyState');
const detailsModal = document.getElementById('detailsModal');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadCurrentPoints();
    loadTransactions();
    setupFilters();
    resetFilters();
    console.log('✅ Transaction history page initialized');
});

// Load current points
async function loadCurrentPoints() {
    try {
        const response = await fetch('/user');
        const result = await response.json();
        
        if (result.success) {
            currentPointsEl.textContent = result.points;
        }
    } catch (error) {
        console.error('Error loading points:', error);
    }
}

// Load transactions
async function loadTransactions() {
    try {
        const response = await fetch('/transactions/load');
        const result = await response.json();
        
        if (result.success) {
            transactions = result.data;
            applyFilters();
        }
    } catch (error) {
        console.error('Error loading transactions:', error);
    }
}

// Setup filters
function setupFilters() {
    typeFilter.addEventListener('change', applyFilters);
    periodFilter.addEventListener('change', applyFilters);
    searchInput.addEventListener('input', applyFilters);
    resetBtn.addEventListener('click', resetFilters);
}

// Apply filters
function applyFilters() {
    filteredTransactions = [...transactions];

    // Type filter
    const type = typeFilter.value;
    if (type !== 'all') {
        filteredTransactions = filteredTransactions.filter(t => t.type === type);
    }

    // Period filter
    const period = periodFilter.value;
    if (period !== 'all') {
        const now = new Date();
        let startDate;

        if (period === 'week') {
            startDate = new Date(now.setDate(now.getDate() - 7));
        } else if (period === 'month') {
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        } else if (period === 'year') {
            startDate = new Date(now.getFullYear(), 0, 1);
        }

        if (startDate) {
            filteredTransactions = filteredTransactions.filter(t => 
                new Date(t.date) >= startDate
            );
        }
    }

    // Search filter
    const search = searchInput.value.toLowerCase();
    if (search) {
        filteredTransactions = filteredTransactions.filter(t =>
            t.name.toLowerCase().includes(search)
        );
    }

    currentPage = 1;
    renderTable();
}

// Reset filters
function resetFilters() {
    typeFilter.value = 'all';
    periodFilter.value = 'all';
    searchInput.value = '';
    applyFilters();
}

// Render table
function renderTable() {
    if (filteredTransactions.length === 0) {
        tableBody.parentElement.style.display = 'none';
        emptyState.style.display = 'block';
        document.getElementById('paginationBar').style.display = 'none';
        return;
    }

    tableBody.parentElement.style.display = 'table';
    emptyState.style.display = 'none';
    document.getElementById('paginationBar').style.display = 'flex';

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageData = filteredTransactions.slice(start, end);

    tableBody.innerHTML = pageData.map(transaction => {
        const typeClass = `type-${transaction.type}`;
        const typeIcon = {
            product: 'box-seam',
            service: 'tools',
            reward: 'trophy'
        }[transaction.type] || 'circle';

        // Calculate total (unitPrice * quantity)
        const unitPrice = transaction.unitPrice || 0;
        const quantity = transaction.quantity || 1;
        const total = unitPrice * quantity;

        // Format quantity display with color
        const quantityDisplay = quantity > 0 
            ? `<span style="color: var(--success-green);">${quantity}</span>`
            : `<span style="color: var(--primary-red);">${quantity}</span>`;

        return `
            <tr>
                <td>
                    <span class="type-badge ${typeClass}">
                        <i class="bi bi-${typeIcon}"></i>
                        ${transaction.type.toUpperCase()}
                    </span>
                </td>
                <td>${transaction.name}</td>
                <td>${unitPrice ? unitPrice.toFixed(2) + 'Ar' : '—'}</td>
                <td>${quantityDisplay}</td>
                <td><strong>${total.toFixed(2)}Ar</strong></td>
                <td>${formatDate(transaction.date)}</td>
                <td>
                    <button class="action-btn" onclick="showDetails(${transaction.id})">
                        <i class="bi bi-eye"></i> Détails
                    </button>
                </td>
            </tr>
        `;
    }).join('');

    updatePagination();
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
}

// Update pagination
function updatePagination() {
    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, filteredTransactions.length);

    document.getElementById('showingFrom').textContent = start;
    document.getElementById('showingTo').textContent = end;
    document.getElementById('totalItems').textContent = filteredTransactions.length;

    const buttonsHTML = [];

    // Previous button
    buttonsHTML.push(`
        <button class="page-btn" onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
            <i class="bi bi-chevron-left"></i>
        </button>
    `);

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            buttonsHTML.push(`
                <button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">
                    ${i}
                </button>
            `);
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            buttonsHTML.push('<span style="color: var(--text-gray); padding: 0 0.5rem;">...</span>');
        }
    }

    // Next button
    buttonsHTML.push(`
        <button class="page-btn" onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
            <i class="bi bi-chevron-right"></i>
        </button>
    `);

    document.getElementById('paginationButtons').innerHTML = buttonsHTML.join('');
}

// Change page
function changePage(page) {
    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    renderTable();
}

// Show details modal
function showDetails(id) {
    const transaction = transactions.find(t => t.id === id);
    if (!transaction) return;

    const modalBody = document.getElementById('modalBody');
    
    const typeLabels = {
        product: 'Produit',
        service: 'Service',
        reward: 'Récompense'
    };

    const unitPrice = transaction.unitPrice || 0;
    const quantity = transaction.quantity || 1;
    const total = unitPrice * quantity;

    modalBody.innerHTML = `
        <div class="detail-row">
            <span class="detail-label">ID Transaction</span>
            <span class="detail-value">#${transaction.id}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Type</span>
            <span class="detail-value">${typeLabels[transaction.type] || transaction.type}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Nom</span>
            <span class="detail-value">${transaction.name}</span>
        </div>
        ${transaction.description ? `
        <div class="detail-row">
            <span class="detail-label">Description</span>
            <span class="detail-value">${transaction.description}</span>
        </div>
        ` : ''}
        ${unitPrice > 0 ? `
        <div class="detail-row">
            <span class="detail-label">Prix Unitaire</span>
            <span class="detail-value">${unitPrice.toFixed(2)}Ar</span>
        </div>
        ` : ''}
        <div class="detail-row">
            <span class="detail-label">Quantité</span>
            <span class="detail-value">${quantity}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Total</span>
            <span class="detail-value">
                <strong>${total.toFixed(2)}Ar</strong>
            </span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Date</span>
            <span class="detail-value">${new Date(transaction.date).toLocaleString('fr-FR')}</span>
        </div>
    `;

    detailsModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
    detailsModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close modal on backdrop click
if (detailsModal) {
    const backdrop = detailsModal.querySelector('.modal-backdrop');
    if (backdrop) {
        backdrop.addEventListener('click', closeModal);
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && detailsModal.style.display === 'flex') {
        closeModal();
    }
});

console.log('✅ Transaction history loaded');

// Export functionality (optional)
function exportTransactions() {
    const csv = generateCSV(filteredTransactions);
    downloadCSV(csv, 'historique-transactions.csv');
}

function generateCSV(data) {
    const headers = ['ID', 'Type', 'Nom', 'Prix Unitaire', 'Quantité', 'Total', 'Date'];
    const rows = data.map(t => {
        const unitPrice = t.unitPrice || 0;
        const quantity = t.quantity || 1;
        const total = unitPrice * quantity;
        
        return [
            t.id,
            t.type,
            t.name,
            unitPrice,
            quantity,
            total.toFixed(2),
            new Date(t.date).toLocaleDateString('fr-FR')
        ];
    });
    
    let csv = headers.join(',') + '\n';
    rows.forEach(row => {
        csv += row.map(cell => `"${cell}"`).join(',') + '\n';
    });
    
    return csv;
}

function downloadCSV(content, filename) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}
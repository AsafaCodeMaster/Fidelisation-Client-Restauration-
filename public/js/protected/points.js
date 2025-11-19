
let pointsData = [];
// State management
let currentPage = 1;
const itemsPerPage = 10;
let filteredData = [];
let sortColumn = 'date';
let sortDirection = 'desc';

// DOM Elements
const typeFilter = document.getElementById('typeFilter');
const periodFilter = document.getElementById('periodFilter');
const customDateRange = document.getElementById('customDateRange');
const startDate = document.getElementById('startDate');
const endDate = document.getElementById('endDate');
const resetFiltersBtn = document.getElementById('resetFilters');
const searchInput = document.getElementById('searchInput');
const exportBtn = document.getElementById('exportBtn');
const tableBody = document.getElementById('tableBody');
const emptyState = document.getElementById('emptyState');
const resultCount = document.getElementById('resultCount');
const pagination = document.getElementById('pagination');

// Initialize

document.addEventListener('DOMContentLoaded', async () => {
  await loadPointsFromServer();
  initializeFilters();
  updateSummaryCards();
  renderTable();
  setupEventListeners();
  console.log('✅ Points page initialized with database data');
});
async function loadPointsFromServer() {
  try {
/*     const response = await fetch('/points/load'); // Adjust route if needed
    const result = await response.json(); */
const response = await fetch('/points/load', { credentials: 'include' });
const result = await response.json();
 pointsData = result.data;
   
      filteredData = [...pointsData];
    
        
  } catch (error) {
    console.error('❌ Error loading points from server:', error);
  }
}

// Alert function
function showAlert(type, message, duration = 5000) {
    const alertContainer = document.getElementById('alertContainer');
    const alertId = 'alert-' + Date.now();
    
    const icons = {
        success: 'check-circle-fill',
        danger: 'exclamation-triangle-fill',
        warning: 'exclamation-circle-fill',
        info: 'info-circle-fill'
    };
    
    const alertHtml = `
        <div class="alert alert-${type}" id="${alertId}">
            <i class="bi bi-${icons[type]}"></i>
            <span>${message}</span>
            <button class="alert-close" onclick="closeAlert('${alertId}')">
                <i class="bi bi-x"></i>
            </button>
        </div>
    `;
    
    alertContainer.insertAdjacentHTML('beforeend', alertHtml);
    
    setTimeout(() => {
        closeAlert(alertId);
    }, duration);
}

function closeAlert(alertId) {
    const alert = document.getElementById(alertId);
    if (alert) {
        alert.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => alert.remove(), 300);
    }
}

// Initialize filters
async function initializeFilters() {
    const today = new Date();
    endDate.value = today.toISOString().split('T')[0];
    
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    startDate.value = firstDayOfMonth.toISOString().split('T')[0];
}

// Update summary cards
function updateSummaryCards() {
    const purchase = pointsData.filter(p => p.type === 'purchase').reduce((sum, p) => sum + p.points, 0);
    const reward = Math.abs(pointsData.filter(p => p.type === 'reward').reduce((sum, p) => sum + p.points, 0));
    const total = purchase - reward;
    const rate = purchase > 0 ? ((reward / purchase) * 100).toFixed(1) : 0;
    
    document.getElementById('totalPoints').textContent = formatNumber(total);
    document.getElementById('earnedPoints').textContent = formatNumber(purchase);
    document.getElementById('usedPoints').textContent = formatNumber(reward);
    
    const rateCard = document.querySelector('.rate-card .card-value');
    if (rateCard) rateCard.textContent = rate + '%';
    
    const progressFill = document.querySelector('.progress-fill');
    if (progressFill) progressFill.style.width = rate + '%';
}

// Format number with thousands separator
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Setup event listeners
function setupEventListeners() {

    if (!typeFilter || !periodFilter || !searchInput || !exportBtn || !resetFiltersBtn) return;
    
    // Filters
    typeFilter.addEventListener('change', applyFilters);
    periodFilter.addEventListener('change', handlePeriodChange);
    startDate.addEventListener('change', applyFilters);
    endDate.addEventListener('change', applyFilters);
    resetFiltersBtn.addEventListener('click', resetFilters);
    
    // Search
    searchInput.addEventListener('input', debounce(applyFilters, 300));
    
    // Export
    exportBtn.addEventListener('click', exportData);
    
    // Table sorting
    document.querySelectorAll('.sortable').forEach(th => {
        th.addEventListener('click', () => handleSort(th.dataset.sort));
    });
}

// Handle period filter change
function handlePeriodChange() {
    const period = periodFilter.value;
    
    if (period === 'custom') {
        customDateRange.style.display = 'flex';
    } else {
        customDateRange.style.display = 'none';
        
        const today = new Date();
        let start = new Date();
        
        switch (period) {
            case 'today':
                start = new Date(today);
                break;
            case 'week':
                start = new Date(today.setDate(today.getDate() - 7));
                break;
            case 'month':
                start = new Date(today.getFullYear(), today.getMonth(), 1);
                break;
            case 'year':
                start = new Date(today.getFullYear(), 0, 1);
                break;
            default:
                start = null;
        }
        
        if (start) {
            startDate.value = start.toISOString().split('T')[0];
            endDate.value = new Date().toISOString().split('T')[0];
        }
    }
    
    applyFilters();
}

// Apply filters
function applyFilters() {
   filteredData = pointsData;
  
    
    // Type filter
    const type = typeFilter.value;
    if (type !== 'all') {
        filteredData = filteredData.filter(item => item.type === type);
    }
    
    // Date filter
    const period = periodFilter.value;
    if (period !== 'all') {
        const start = new Date(startDate.value);
        const end = new Date(endDate.value);
        end.setHours(23, 59, 59);
        
        filteredData = filteredData.filter(item => {
            const itemDate = new Date(item.date);
            return itemDate >= start && itemDate <= end;
        });
    }
    
    // Search filter
    const search = searchInput.value.toLowerCase();
    if (search) {
        filteredData = filteredData.filter(item => 
            item.description.toLowerCase().includes(search) ||
            item.id.toString().includes(search)
        );
    }
    
    // Sort
    sortData();
    
    // Reset to first page
    currentPage = 1;
    
    // Render
    renderTable();
}

// Reset filters
function resetFilters() {
    typeFilter.value = 'all';
    periodFilter.value = 'month';
    searchInput.value = '';
    customDateRange.style.display = 'none';
    
    initializeFilters();
    applyFilters();
    
    showAlert('info', 'Filtres réinitialisés');
}

// Handle sorting
function handleSort(column) {
    if (sortColumn === column) {
        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        sortColumn = column;
        sortDirection = 'desc';
    }
    
    // Update UI
    document.querySelectorAll('.sortable').forEach(th => {
        th.classList.remove('active');
        const icon = th.querySelector('i');
        if (icon) icon.className = 'bi bi-chevron-expand';
    });
    
    const activeTh = document.querySelector(`[data-sort="${column}"]`);
    if (activeTh) {
        activeTh.classList.add('active');
        const icon = activeTh.querySelector('i');
        if (icon) icon.className = sortDirection === 'asc' ? 'bi bi-chevron-up' : 'bi bi-chevron-down';
    }
    
    sortData();
    renderTable();
}

// Sort data
function sortData() {
    filteredData.sort((a, b) => {
        let aVal = a[sortColumn];
        let bVal = b[sortColumn];
        
        // Handle date sorting
        if (sortColumn === 'date') {
            aVal = new Date(aVal);
            bVal = new Date(bVal);
        }
        
        if (sortDirection === 'asc') {
            return aVal > bVal ? 1 : -1;
        } else {
            return aVal < bVal ? 1 : -1;
        }
    });
}

// Render table
function renderTable() {
    if (!tableBody) return;
    
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageData = filteredData.slice(start, end);
    
    if (filteredData.length === 0) {
        const tableWrapper = tableBody.closest('.table-wrapper');
        const tableFooter = document.querySelector('.table-footer');
        
        if (tableWrapper) tableWrapper.style.display = 'none';
        if (tableFooter) tableFooter.style.display = 'none';
        if (emptyState) emptyState.style.display = 'block';
    } else {
        const tableWrapper = tableBody.closest('.table-wrapper');
        const tableFooter = document.querySelector('.table-footer');
        
        if (tableWrapper) tableWrapper.style.display = 'block';
        if (tableFooter) tableFooter.style.display = 'flex';
        if (emptyState) emptyState.style.display = 'none';
        
        tableBody.innerHTML = pageData.map(item => `
            <tr>
                <td>#${item.id}</td>
                <td>
                    <span class="type-badge ${item.type=='purchase' ? 'earned' : 'used'}">
                        <i class="bi bi-${item.type === 'purchase' ? 'plus-circle' : 'dash-circle'}"></i>
                        ${item.type === 'purchase' ? 'Gagné' : 'Utilisé'}
                    </span>
                </td>
                <td>${formatDate(item.date)}</td>
                <td>${item.description}</td>
                <td>
                    <span class="points-display ${item.type === 'purchase'  ? 'positive' : 'negative'}">
                        <i class="bi bi-${item.type === 'purchase' ? 'arrow-up' : 'arrow-down'}"></i>
                        ${item.type === 'purchase'? '+' : '-'}${formatNumber(item.points)} pts
                    </span>
                </td>
                <td>${formatNumber(item.balance)} pts</td>
                <td>
                    <span class="status-badge ${item.status}">
                        <i class="bi bi-${getStatusIcon(item.status)}"></i>
                        ${getStatusLabel(item.status , item.type)}
                    </span>
                </td>
                <td class="text-center">
                    <div class="action-buttons">
                        <button class="action-btn" onclick="viewDetails(${item.id})" title="Voir détails">
                            <i class="bi bi-eye"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }
    
    updateResultCount();
    renderPagination();
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('fr-FR', options);
}

// Get status icon
function getStatusIcon(status) {
    const icons = {
        completed: 'check-circle-fill',
        pending: 'clock-fill'/* ,
        expired: 'x-circle-fill' */
    };
    return icons[status] || 'info-circle-fill';
}

// Get status label
function getStatusLabel(status , type) {
    const labels = {
        completed: type == 'purchase' ? 'payée' : 'reçu',
        pending: 'En attente'
/*         expired: 'Expiré' */
    };
    return labels[status] || status;
}

// Update result count
function updateResultCount() {
    if (!resultCount) return;
    
    resultCount.innerHTML = `<strong>${filteredData.length}</strong> transaction${filteredData.length > 1 ? 's' : ''}`;
    
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, filteredData.length);
    
    const showingFrom = document.getElementById('showingFrom');
    const showingTo = document.getElementById('showingTo');
    const totalItems = document.getElementById('totalItems');
    
    if (showingFrom) showingFrom.textContent = filteredData.length > 0 ? start : 0;
    if (showingTo) showingTo.textContent = end;
    if (totalItems) totalItems.textContent = filteredData.length;
}

// Render pagination
function renderPagination() {
    if (!pagination) return;
    
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    let paginationHTML = '';
    
    // Previous button
    paginationHTML += `
        <button class="pagination-btn ${currentPage === 1 ? 'disabled' : ''}" 
                onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
            <i class="bi bi-chevron-left"></i>
        </button>
    `;
    
    // Page numbers
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    
    if (endPage - startPage < maxVisible - 1) {
        startPage = Math.max(1, endPage - maxVisible + 1);
    }
    
    if (startPage > 1) {
        paginationHTML += `<button class="pagination-btn" onclick="changePage(1)">1</button>`;
        if (startPage > 2) {
            paginationHTML += `<button class="pagination-btn disabled" disabled>...</button>`;
        }
    }
    
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <button class="pagination-btn ${i === currentPage ? 'active' : ''}" 
                    onclick="changePage(${i})">
                ${i}
            </button>
        `;
    }
    
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationHTML += `<button class="pagination-btn disabled" disabled>...</button>`;
        }
        paginationHTML += `<button class="pagination-btn" onclick="changePage(${totalPages})">${totalPages}</button>`;
    }
    
    // Next button
    paginationHTML += `
        <button class="pagination-btn ${currentPage === totalPages ? 'disabled' : ''}" 
                onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
            <i class="bi bi-chevron-right"></i>
        </button>
    `;
    
    pagination.innerHTML = paginationHTML;
}

// Change page
function changePage(page) {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    renderTable();
    
    // Scroll to top of table
    const tableSection = document.querySelector('.table-section');
    if (tableSection) {
        tableSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// View details modal
function viewDetails(id) {
    const item = pointsData.find(p => p.id === id);
    if (!item){ /* alert('it is not working as expected ' + pointsData);
        alert('pointsData is ' +pointsData[0].id); */
        return;}
    
    const modal = document.getElementById('detailsModal');
    const modalBody = document.getElementById('modalBody');
    
    if (!modal || !modalBody) return;
    
    modalBody.innerHTML = `
        <div class="detail-row">
            <span class="detail-label">ID de transaction</span>
            <span class="detail-value">#${item.id}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Type</span>
            <span class="detail-value">
                <span class="type-badge ${item.type}">
                    <i class="bi bi-${item.type === 'purchase' ? 'plus-circle' : 'dash-circle'}"></i>
                    ${item.type === 'purchase' ? 'Points Gagnés' : 'Points Utilisés'}
                </span>
            </span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Date</span>
            <span class="detail-value">${formatDate(item.date)}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Description</span>
            <span class="detail-value">${item.description}</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Points</span>
            <span class="detail-value">
                <span class="points-display ${item.type === 'purchase' ? 'positive' : 'negative'}">
                    ${item.type === 'purchase' ? '+' : '-'}${formatNumber(item.points)} points
                </span>
            </span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Solde après transaction</span>
            <span class="detail-value">${formatNumber(item.balance)} points</span>
        </div>
        <div class="detail-row">
            <span class="detail-label">Statut</span>
            <span class="detail-value">
                <span class="status-badge ${item.status}">
                    <i class="bi bi-${getStatusIcon(item.status)}"></i>
                    ${getStatusLabel(item.status , item.type)}
                </span>
            </span>
        </div>
    `;
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Close details modal
function closeDetailsModal() {
    const modal = document.getElementById('detailsModal');
    if (!modal) return;
    
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close modal when clicking backdrop
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('detailsModal');
    if (modal) {
        const backdrop = modal.querySelector('.modal-backdrop');
        if (backdrop) {
            backdrop.addEventListener('click', closeDetailsModal);
        }
    }
});

// Export data
function exportData() {
    if (!exportBtn) return;
    
    const btn = exportBtn;
    const originalText = btn.innerHTML;
    
    btn.classList.add('loading');
    btn.innerHTML = '<span class="loading-spinner"></span> Export en cours...';
    btn.disabled = true;
    
    setTimeout(() => {
        try {
            const csvContent = generateCSV();
            downloadCSV(csvContent, 'points_export.csv');
            showAlert('success', 'Export réussi ! Le fichier a été téléchargé.');
        } catch (error) {
            console.error('Export error:', error);
            showAlert('danger', 'Erreur lors de l\'export des données.');
        } finally {
            btn.classList.remove('loading');
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    }, 1000);
}

// Generate CSV
function generateCSV() {
    const headers = ['ID', 'Type', 'Date', 'Description', 'Points', 'Solde Après', 'Statut'];
    const rows = filteredData.map(item => [
        item.id,
        item.type === 'purchase' ? 'Gagné' : 'Utilisé',
        formatDate(item.date),
        item.description,
        item.points,
        item.balance,
        getStatusLabel(item.status , item.type)
    ]);
    
    let csv = headers.join(',') + '\n';
    rows.forEach(row => {
        csv += row.map(cell => `"${cell}"`).join(',') + '\n';
    });
    
    return csv;
}

// Download CSV
function downloadCSV(content, filename) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (navigator.msSaveBlob) {
        navigator.msSaveBlob(blob, filename);
    } else {
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (searchInput) searchInput.focus();
    }
    
    // Ctrl/Cmd + R to reset filters
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        resetFilters();
    }
    
    // Escape to close modal
    if (e.key === 'Escape') {
        const modal = document.getElementById('detailsModal');
        if (modal && modal.style.display === 'flex') {
            closeDetailsModal();
        }
    }
    
    // Arrow keys for pagination
    if (e.key === 'ArrowLeft' && !e.ctrlKey && !e.metaKey) {
        const totalPages = Math.ceil(filteredData.length / itemsPerPage);
        if (currentPage > 1 && document.activeElement.tagName !== 'INPUT') {
            e.preventDefault();
            changePage(currentPage - 1);
        }
    }
    
    if (e.key === 'ArrowRight' && !e.ctrlKey && !e.metaKey) {
        const totalPages = Math.ceil(filteredData.length / itemsPerPage);
        if (currentPage < totalPages && document.activeElement.tagName !== 'INPUT') {
            e.preventDefault();
            changePage(currentPage + 1);
        }
    }
});

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        from {
            transform: translateY(0);
            opacity: 1;
        }
        to {
            transform: translateY(-100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Save and load preferences
function savePreferences() {
    const preferences = {
        defaultSort: sortColumn,
        defaultSortDirection: sortDirection,
        defaultPeriod: periodFilter ? periodFilter.value : 'month'
    };
    localStorage.setItem('points_preferences', JSON.stringify(preferences));
}

function loadPreferences() {
    const saved = localStorage.getItem('points_preferences');
    if (saved) {
        try {
            const preferences = JSON.parse(saved);
            sortColumn = preferences.defaultSort || 'date';
            sortDirection = preferences.defaultSortDirection || 'desc';
            if (periodFilter) periodFilter.value = preferences.defaultPeriod || 'month';
        } catch (e) {
            console.error('Error loading preferences:', e);
        }
    }
}

// Load preferences on init
loadPreferences();

// Save preferences when changed
if (periodFilter) {
    periodFilter.addEventListener('change', savePreferences);
}

console.log('✅ Points page fully loaded');
console.log('📊 Total transactions:', pointsData.length);
console.log('🎯 Keyboard shortcuts:');
console.log('  - Ctrl/Cmd + K : Rechercher');
console.log('  - Ctrl/Cmd + R : Réinitialiser les filtres');
console.log('  - Escape : Fermer le modal');
console.log('  - ← → : Navigation pagination');
// Rewards Page JavaScript - Simple

let userPoints = 0;
let availableRewards = [];
let rewardsHistory = [];

// DOM Elements
const userPointsEl = document.getElementById('userPoints');
const availableRewardsEl = document.getElementById('availableRewards');
const emptyAvailable = document.getElementById('emptyAvailable');
const rewardsHistoryEl = document.getElementById('rewardsHistory');
const emptyHistory = document.getElementById('emptyHistory');
const claimModal = document.getElementById('claimModal');
const confirmClaimBtn = document.getElementById('confirmClaimBtn');

let selectedReward = null;

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    await loadUserPoints();
    loadAvailableRewards();
    loadRewardsHistory();
    // console.log('✅ Rewards page initialized');
});

// Load user points
async function loadUserPoints() {
    try {
        const response = await fetch('/user/load');
        const result = await response.json();
        
        if (result.success) {
            userPoints = result.data.rewardPoints;
            userPointsEl.textContent = userPoints;
        }
    } catch (error) {
        // console.error('Error loading points:', error);
    }
}

// Load available rewards
async function loadAvailableRewards() {
    try {
        const response = await fetch('/reward/available');
        const result = await response.json();
        
        if (result.success) {
            availableRewards = result.data;
            renderAvailableRewards();
        }
    } catch (error) {
        // console.error('Error loading rewards:', error);
    }
}

// Render available rewards
function renderAvailableRewards() {
    if (availableRewards.length === 0) {
        availableRewardsEl.style.display = 'none';
        emptyAvailable.style.display = 'block';
        return;
    }

    availableRewardsEl.style.display = 'grid';
    emptyAvailable.style.display = 'none';

    availableRewardsEl.innerHTML = availableRewards.map(reward => {
        const canClaim = userPoints >= reward.cost;
        
        return `
            <div class="reward-card">
                <div class="reward-icon">${reward.icon || '🎁'}</div>
                <div class="reward-name">${reward.name}</div>
                <div class="reward-description">${reward.description}</div>
                <div class="reward-footer">
                    <div class="reward-cost">
                        <i class="bi bi-gem"></i>
                        ${reward.cost}
                    </div>
                    <button 
                        class="claim-btn" 
                        onclick="openClaimModal(${reward.id})"
                        ${!canClaim ? 'disabled' : ''}>
                        ${canClaim ? 'Récupérer' : 'Pas assez de points'}
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Load rewards history
async function loadRewardsHistory() {
    try {
        const response = await fetch('/reward/history');
        const result = await response.json();
        
        if (result.success) {
            rewardsHistory = result.data;
            renderRewardsHistory();
        }
    } catch (error) {
        // console.error('Error loading history:', error);
    }
}

// Render rewards history
function renderRewardsHistory() {
    if (rewardsHistory.length === 0) {
        rewardsHistoryEl.style.display = 'none';
        emptyHistory.style.display = 'block';
        return;
    }

    rewardsHistoryEl.style.display = 'block';
    emptyHistory.style.display = 'none';

    rewardsHistoryEl.innerHTML = rewardsHistory.map(item => {
        const statusClass = `status-${item.status}`;
        const statusText = {
            claimed: 'Récupérée',
            pending: 'En attente',
            expired: 'Expirée'
        }[item.status] || item.status;

        return `
            <div class="history-item">
                <div class="history-icon">${item.icon || '🎁'}</div>
                <div class="history-info">
                    <div class="history-name">${item.name}</div>
                    <div class="history-date">${formatDate(item.date)}</div>
                </div>
                <div class="history-cost">-${item.cost} pts</div>
                <div class="history-status ${statusClass}">${statusText}</div>
            </div>
        `;
    }).join('');
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Open claim modal
function openClaimModal(rewardId) {
    selectedReward = availableRewards.find(r => r.id === rewardId);
    if (!selectedReward) return;

    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <div style="text-align: center;">
            <div style="font-size: 4rem; margin-bottom: 1rem;">${selectedReward.icon || '🎁'}</div>
            <h3 style="color: var(--text-white); margin-bottom: 0.5rem;">${selectedReward.name}</h3>
            <p style="color: var(--text-gray); margin-bottom: 1.5rem;">${selectedReward.description}</p>
            <div style="padding: 1rem; background: var(--hover-bg); border-radius: 8px; margin-bottom: 1rem;">
                <div style="color: var(--text-gray); font-size: 0.875rem; margin-bottom: 0.25rem;">Coût</div>
                <div style="color: var(--primary-red); font-size: 1.5rem; font-weight: 700;">
                    <i class="bi bi-gem"></i> ${selectedReward.cost} points
                </div>
            </div>
            <div style="padding: 1rem; background: var(--hover-bg); border-radius: 8px;">
                <div style="color: var(--text-gray); font-size: 0.875rem; margin-bottom: 0.25rem;">Solde après récupération</div>
                <div style="color: var(--text-white); font-size: 1.25rem; font-weight: 600;">
                    ${userPoints - selectedReward.cost} points
                </div>
            </div>
        </div>
    `;

    claimModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Close claim modal
function closeClaimModal() {
    claimModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    selectedReward = null;
}

// Confirm claim
if (confirmClaimBtn) {
    confirmClaimBtn.addEventListener('click', async () => {
        if (!selectedReward) return;

        const originalText = confirmClaimBtn.innerHTML;
        confirmClaimBtn.disabled = true;
        confirmClaimBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Traitement...';

        try {
            const response = await fetch('/reward/claim', {
                method: 'POST',
                credentials : 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    rewardId: selectedReward.id
                })
            });

            const result = await response.json();

            if (result.success) {
                // alert('✅ Récompense récupérée avec succès !');
                closeClaimModal();
                
                // Reload data
                loadUserPoints();
                loadAvailableRewards();
                loadRewardsHistory();
            } else {
                // alert('❌ Erreur : ' + result.message);
            }
        } catch (error) {
            // console.error('Claim error:', error);
            // alert('❌ Erreur de connexion');
        } finally {
            confirmClaimBtn.disabled = false;
            confirmClaimBtn.innerHTML = originalText;
        }
    });
}

// Close modal on backdrop click
if (claimModal) {
    const backdrop = claimModal.querySelector('.modal-backdrop');
    if (backdrop) {
        backdrop.addEventListener('click', closeClaimModal);
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (claimModal && claimModal.style.display === 'flex') {
            closeClaimModal();
        }
    }
});

// console.log('✅ Rewards page loaded');
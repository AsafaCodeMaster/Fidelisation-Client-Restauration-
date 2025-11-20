// Orders Page JavaScript - Simple Version

// Cart state
let cart = [];
let products = [];

// Service fee
const SERVICE_FEE = 0.00;

// DOM Elements
const searchInput = document.getElementById('searchInput');
const productsGrid = document.getElementById('productsGrid');
const emptyState = document.getElementById('emptyState');
const cartItems = document.getElementById('cartItems');
const checkoutBtn = document.getElementById('checkoutBtn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    setupSearch();
    // console.log('✅ Orders page initialized');
});

// Load products from API
async function loadProducts() {
    try {
        const response = await fetch('/products/load');
        const result = await response.json();
        
        if (result.success) {
            products = result.data;
            renderProducts(products);
        } else {
            showError('Erreur lors du chargement des produits');
        }
    } catch (error) {
        // console.error('Error loading products:', error);
        showError('Erreur de connexion');
    }
}

// Render products
function renderProducts(productsToRender) {
    if (productsToRender.length === 0) {
        productsGrid.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }

    productsGrid.style.display = 'grid';
    emptyState.style.display = 'none';

    productsGrid.innerHTML = productsToRender.map(product => `
        <div class="product-card" onclick="addToCart(${product.id})">
            <div class="product-image">
                ${product.emoji || '🍔'}
            </div>
            <div class="product-name">${product.name}</div>
            <div class="product-price">${product.price.toFixed(2)} Ar</div>
        </div>
    `).join('');
}

// Setup search
function setupSearch() {
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        
        const filtered = products.filter(product => 
            product.name.toLowerCase().includes(query)
        );
        
        renderProducts(filtered);
    });
}

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }

    updateCart();
}

// Update quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        updateCart();
    }
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// Update cart display
function updateCart() {
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="bi bi-cart"></i>
                <p>Votre panier est vide</p>
            </div>
        `;
        checkoutBtn.disabled = true;
        updateSummary(0, 0, 0);
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${item.price.toFixed(2)} Ar</div>
            </div>
            <div class="quantity-controls">
                <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">
                    <i class="bi bi-dash"></i>
                </button>
                <span class="qty-value">${item.quantity}</span>
                <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">
                    <i class="bi bi-plus"></i>
                </button>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${item.id})">
                <i class="bi bi-x"></i>
            </button>
        </div>
    `).join('');

    checkoutBtn.disabled = false;

    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal + SERVICE_FEE;

    updateSummary(subtotal, SERVICE_FEE, total);
}

// Update summary
function updateSummary(subtotal, serviceFee, total) {
    document.getElementById('subtotal').textContent = subtotal.toFixed(2) + 'Ar';
    document.getElementById('serviceFee').textContent = serviceFee.toFixed(2) + 'Ar';
    document.getElementById('total').textContent = total.toFixed(2) + 'Ar';
}

// Checkout
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', async () => {
        if (cart.length === 0) return;

        const originalText = checkoutBtn.innerHTML;
        checkoutBtn.disabled = true;
        checkoutBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Traitement...';

        try {
            const response = await fetch('/orders/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    items: cart,
                    subtotal: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
                    serviceFee: SERVICE_FEE,
                    total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) + SERVICE_FEE
                })
            });

            const result = await response.json();

            if (result.success) {
                // alert('✅ Commande passée avec succès !');
                cart = [];
                updateCart();
                searchInput.value = '';
            } else {
                // alert('❌ Erreur : ' + result.message);
            }
        } catch (error) {
            // console.error('Checkout error:', error);
            // alert('❌ Erreur de connexion');
        } finally {
            checkoutBtn.disabled = false;
            checkoutBtn.innerHTML = originalText;
        }
    });
}

// Error display
function showError(message) {
    productsGrid.style.display = 'none';
    emptyState.style.display = 'block';
    emptyState.innerHTML = `
        <i class="bi bi-exclamation-triangle"></i>
        <p>${message}</p>
    `;
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
    }
});

// console.log('✅ Orders page loaded');
// console.log('🎯 Ctrl/Cmd + K : Focus recherche');
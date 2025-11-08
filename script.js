const products = [
    {
        id: 1,
        name: "Midnight Eclipse",
        description: "Rare black diamonds with platinum setting",
        price: 499.99,
        image: "images/midnight-eclipse.jpg"
    },
    {
        id: 2,
        name: "Azure Dreams",
        description: "Deep sapphire crystals in white gold",
        price: 379.99,
        image: "images/azure-dreams.jpg"
    },
    {
        id: 3,
        name: "Royal Crown",
        description: "24K gold vermeil with ruby accents",
        price: 549.99,
        image: "images/royal-crown.jpg"
    },
    {
        id: 4,
        name: "Emerald Forest",
        description: "Colombian emerald with rose gold chain",
        price: 429.99,
        image: "images/emerald-forest.jpg"
    },
    {
        id: 5,
        name: "Celestial Star",
        description: "Meteorite fragments in sterling silver",
        price: 599.99,
        image: "images/celestial-star.jpg"
    },
    {
        id: 6,
        name: "Obsidian Night",
        description: "Volcanic glass with titanium fusion",
        price: 459.99,
        image: "images/obsidian-night.jpg"
    }
];

// Cart array to store items
let cartItems = [];

function renderProducts() {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" />
            </div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-description">${product.description}</div>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cartItems.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cartItems.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCartUI();
    showNotification();
}

function removeFromCart(productId) {
    cartItems = cartItems.filter(item => item.id !== productId);
    updateCartUI();
}

function updateQuantity(productId, change) {
    const item = cartItems.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartUI();
        }
    }
}

function updateCartUI() {
    // Update cart count
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = totalItems;
    
    // Update cart items display
    const cartItemsContainer = document.getElementById('cartItems');
    
    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">
                    <img src="images/empty-cart-icon.png" alt="Empty Cart" style="width: 100px; height: 100px; opacity: 0.5;" />
                </div>
                <p>Your cart is empty</p>
            </div>
        `;
    } else {
        cartItemsContainer.innerHTML = cartItems.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}" />
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${item.price.toFixed(2)}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span class="quantity-display">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                </div>
                <button class="remove-item" onclick="removeFromCart(${item.id})">
                    <img src="images/trash-icon.png" alt="Remove" style="width: 20px; height: 20px; filter: brightness(0) saturate(100%) invert(38%) sepia(95%) saturate(2663%) hue-rotate(333deg) brightness(101%) contrast(104%);" />
                </button>
            </div>
        `).join('');
    }
    
    // Update total price
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('totalPrice').textContent = `${total.toFixed(2)}`;
}

function toggleCart() {
    const cartModal = document.getElementById('cartModal');
    cartModal.classList.toggle('active');
}

function openCheckout() {
    if (cartItems.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    toggleCart();
    const checkoutModal = document.getElementById('checkoutModal');
    checkoutModal.classList.add('active');
    
    // Update order summary
    updateOrderSummary();
}

function closeCheckout() {
    const checkoutModal = document.getElementById('checkoutModal');
    checkoutModal.classList.remove('active');
}

function updateOrderSummary() {
    const orderSummary = document.getElementById('orderSummary');
    const checkoutTotal = document.getElementById('checkoutTotal');
    
    orderSummary.innerHTML = cartItems.map(item => `
        <div class="order-item">
            <div>
                <div class="order-item-name">${item.name}</div>
                <div class="order-item-quantity">Quantity: ${item.quantity}</div>
            </div>
            <div class="order-item-price">${(item.price * item.quantity).toFixed(2)}</div>
        </div>
    `).join('');
    
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    checkoutTotal.textContent = `${total.toFixed(2)}`;
}

function handleCheckout(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const customerData = {
        fullName: formData.get('fullName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        city: formData.get('city'),
        state: formData.get('state'),
        zipCode: formData.get('zipCode'),
        country: formData.get('country')
    };
    
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Create order summary message
    const orderDetails = cartItems.map(item => 
        `${item.name} x${item.quantity} - ${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');
    
    const message = `
ORDER CONFIRMATION

Customer Details:
Name: ${customerData.fullName}
Email: ${customerData.email}
Phone: ${customerData.phone}

Shipping Address:
${customerData.address}
${customerData.city}, ${customerData.state} ${customerData.zipCode}
${customerData.country}

Order Items:
${orderDetails}

Total: ${total.toFixed(2)}

Thank you for your order! We will contact you shortly to confirm.
    `.trim();
    
    alert(message);
    
    // Clear cart and close modals
    cartItems = [];
    updateCartUI();
    closeCheckout();
    
    // Reset form
    event.target.reset();
}

function checkout() {
    openCheckout();
}

function showNotification() {
    const notification = document.getElementById('notification');
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 2500);
}

function scrollToProducts() {
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

function toggleTheme() {
    const body = document.body;
    const themeIcon = document.getElementById('themeIcon');
    
    body.classList.toggle('light-mode');
    
    // Update icon
    if (body.classList.contains('light-mode')) {
        themeIcon.src = 'images/moon-icon.png';
        themeIcon.alt = 'Dark Mode';
        localStorage.setItem('theme', 'light');
    } else {
        themeIcon.src = 'images/sun-icon.png';
        themeIcon.alt = 'Light Mode';
        localStorage.setItem('theme', 'dark');
    }
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    const body = document.body;
    const themeIcon = document.getElementById('themeIcon');
    
    if (savedTheme === 'light') {
        body.classList.add('light-mode');
        themeIcon.src = 'images/moon-icon.png';
        themeIcon.alt = 'Dark Mode';
    } else {
        themeIcon.src = 'images/sun-icon.png';
        themeIcon.alt = 'Light Mode';
    }
}

// Initialize the page
renderProducts();
updateCartUI();
loadTheme();
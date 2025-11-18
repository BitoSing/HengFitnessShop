let currentSlideIndex = 0;
let currentCategory = 'all';

// Performance optimization: Debounce function
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

// Initialize page

function slideCarousel(n) {
    showSlide(currentSlideIndex += n);
}

function currentSlide(n) {
    showSlide(currentSlideIndex = n);
}

function showSlide(n) {
    const slides = document.querySelectorAll('.carousel-item');
    const dots = document.querySelectorAll('.dot');

    if (n >= slides.length) {
        currentSlideIndex = 0;
    } else if (n < 0) {
        currentSlideIndex = slides.length - 1;
    }

    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    slides[currentSlideIndex].classList.add('active');
    dots[currentSlideIndex].classList.add('active');
}

// Auto-advance carousel every 5 seconds
setInterval(() => {
    slideCarousel(1);
}, 5000);

// CATEGORY FILTER SETUP
function setupCategoryFilters() {
    document.querySelectorAll('.category-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = link.getAttribute('data-category');
            
            document.querySelectorAll('.category-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            currentCategory = category;
            displayProducts(category);
        });
    });
}

// Add event listeners to view details buttons
function addViewDetailsListeners() {
    const viewDetailsBtns = document.querySelectorAll('.view-details-btn');
    viewDetailsBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = btn.getAttribute('data-product-id');
            showProductDetails(productId);
        });
    });
}

// Simple product display
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded - checking products...');
    
    // Wait a moment for products to load
    setTimeout(() => {
        if (typeof products !== 'undefined' && products.length > 0) {
            console.log('Products found:', products.length);
            displayProducts('all');
        } else {
            console.error('No products loaded');
        }
    }, 500);
});

function displayProducts(category) {
    console.log('Displaying products...');
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) {
        console.error('Products grid not found!');
        return;
    }

    productsGrid.innerHTML = '';
    
    const productsToShow = category === 'all' ? products : products.slice(0, 6);
    
    productsToShow.forEach((product, index) => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/250x250?text=${encodeURIComponent(product.name)}'">
            </div>
            <div class="product-info">
                <p class="product-id">ID: ${product.id}</p>
                <h4 class="product-name">${product.name}</h4>
                <p class="product-price">${product.price}</p>
                <button class="btn-add view-details-btn" data-product-id="${product.id}">View Details</button>
            </div>
        `;
        
        productsGrid.appendChild(productCard);
    });
    
    console.log('Displayed', productsToShow.length, 'products');
    
    // Add event listeners to view details buttons
    addViewDetailsListeners();
}

// Show product details popup
function showProductDetails(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // Create modal overlay
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'product-details-modal';
    modalOverlay.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <div class="modal-product-image">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/400x400?text=${encodeURIComponent(product.name)}'">
            </div>
            <div class="modal-product-info">
                <p class="modal-product-id">Product ID: ${product.id}</p>
                <h2 class="modal-product-name">${product.name}</h2>
                <p class="modal-product-khmer-name">${product.khmerName}</p>
                <p class="modal-product-price">${product.price}</p>
                <p class="modal-product-description">${product.description || 'No description available for this product.'}</p>
                <div class="modal-product-actions">
                    <button class="btn-add">Add to Cart</button>
                    <button class="btn-contact">Contact Us</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modalOverlay);

    // Add close functionality
    const closeBtn = modalOverlay.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(modalOverlay);
    });

    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            document.body.removeChild(modalOverlay);
        }
    });
}

// Global variable to store current modal product ID
let currentModalProductId = null;

// MODAL FUNCTIONS
function openModal(productId) {
    const product = products.find(p => p.id === productId);
    
    if (product) {
        currentModalProductId = productId; // Store current product ID
        
        document.getElementById('modalProductImage').src = product.image;
        document.getElementById('modalProductImage').onerror = function() {
            this.src = `https://via.placeholder.com/400x400?text=${encodeURIComponent(product.name)}`;
        };
        document.getElementById('modalProductId').textContent = `ID: ${product.id}`;
        document.getElementById('modalProductName').textContent = product.name;
        document.getElementById('modalProductCategory').textContent = `Category: ${product.category}`;
        document.getElementById('modalProductPrice').textContent = product.price;
        document.getElementById('modalProductDescription').textContent = product.description;
        
        document.getElementById('productModal').classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    document.getElementById('productModal').classList.remove('active');
    document.body.style.overflow = 'auto';
}



function proceedToCheckout() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (cart.length === 0) {
        showNotification('Your cart is empty', 'error');
        return;
    }
    
    closeCart();
    openCheckoutModal();
}

function openCheckoutModal() {
    const modal = document.getElementById('checkoutModal');
    if (modal) {
        modal.style.display = 'block';
        generateInvoiceNumber();
        updateInvoiceDate();
        displayInvoiceItems();
        updateInvoiceTotals();
    }
}

function closeCheckoutModal() {
    const modal = document.getElementById('checkoutModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function generateInvoiceNumber() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const invoiceNumber = `INV-${year}-${month}${day}-${random}`;
    
    document.getElementById('invoiceNumber').textContent = invoiceNumber;
}

function updateInvoiceDate() {
    const date = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('invoiceDate').textContent = date.toLocaleDateString('en-US', options);
}

function displayInvoiceItems() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const invoiceItemsContainer = document.getElementById('invoiceItems');
    
    invoiceItemsContainer.innerHTML = `
        <div class="invoice-item invoice-item-header">
            <div>Product</div>
            <div>Price</div>
            <div>Qty</div>
            <div>Total</div>
        </div>
        ${cart.map(item => {
            const price = parseFloat(item.price.replace(/[^0-9.]/g, ''));
            const itemTotal = price * (item.quantity || 1);
            return `
                <div class="invoice-item">
                    <div>${item.name}</div>
                    <div>$${price.toFixed(2)}</div>
                    <div>${item.quantity || 1}</div>
                    <div>$${itemTotal.toFixed(2)}</div>
                </div>
            `;
        }).join('')}
    `;
}

function updateInvoiceTotals() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const subtotal = cart.reduce((sum, item) => {
        const price = parseFloat(item.price.replace(/[^0-9.]/g, ''));
        return sum + (price * (item.quantity || 1));
    }, 0);
    
    // Get values from cart summary inputs
    const deliveryFeeInput = document.getElementById('deliveryFeeInput');
    const discountInput = document.getElementById('discountInput');
    
    const deliveryFee = deliveryFeeInput ? parseFloat(deliveryFeeInput.value) || 0 : 0;
    const discountPercentage = discountInput ? parseFloat(discountInput.value) || 0 : 0;
    const discountAmount = subtotal * (discountPercentage / 100);
    const grandTotal = subtotal + deliveryFee - discountAmount;
    
    // Convert to Khmer currency
    const grandTotalKHR = grandTotal * 4000;
    
    document.getElementById('invoiceSubtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('invoiceDelivery').textContent = `$${deliveryFee.toFixed(2)}`;
    document.getElementById('invoiceDiscount').textContent = `$${discountAmount.toFixed(2)}`;
    document.getElementById('invoiceGrandTotal').textContent = `$${grandTotal.toFixed(2)}`;
    document.getElementById('invoiceGrandTotalKHR').textContent = `៛${grandTotalKHR.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}

function confirmOrder() {
    const customerName = document.getElementById('customerName').value;
    const customerPhone = document.getElementById('customerPhone').value;
    const customerEmail = document.getElementById('customerEmail').value;
    const customerAddress = document.getElementById('customerAddress').value;
    
    if (!customerName || !customerPhone || !customerEmail || !customerAddress) {
        showNotification('Please fill in all customer information', 'error');
        return;
    }
    
    // Update customer info on invoice
    document.getElementById('invoiceCustomer').textContent = customerName;
    
    // Clear cart after order confirmation
    localStorage.removeItem('cart');
    
    
    showNotification('Order confirmed successfully!', 'success');
    
    // Print invoice automatically
    setTimeout(() => {
        printInvoice();
    }, 1000);
}

function printInvoice() {
    const customerName = document.getElementById('customerName').value || 'Customer';
    const invoiceNumber = document.getElementById('invoiceNumber').textContent;
    
    // Update customer info on invoice before printing
    document.getElementById('invoiceCustomer').textContent = customerName;
    
    // Create print-friendly version
    const printContent = document.getElementById('checkoutModal').innerHTML;
    const originalContent = document.body.innerHTML;
    
    document.body.innerHTML = `
        <div style="padding: 20px; font-family: Arial, sans-serif;">
            <h1 style="text-align: center; color: #2c3e50;">Heng Fitness - Invoice</h1>
            ${printContent}
        </div>
    `;
    
    window.print();
    document.body.innerHTML = originalContent;
    
    // Reload the page to restore functionality
    window.location.reload();
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function scrollToProducts() {
    const productsSection = document.querySelector('.products');
    if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('productModal');
    const checkoutModal = document.getElementById('checkoutModal');
    
    if (event.target === modal) {
        closeModal();
    }
    
    if (event.target === checkoutModal) {
        closeCheckoutModal();
    }
}

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href !== '#' && !href.includes('data-category')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const headerHeight = document.querySelector('.header').offsetHeight;
                const totalOffset = navbarHeight + headerHeight;
                const targetPosition = target.offsetTop - totalOffset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Scroll to top button functionality
const scrollToTopBtn = document.getElementById('scrollToTop');

// Show/hide scroll to top button based on scroll position (debounced for performance)
const handleScroll = debounce(() => {
    if (window.pageYOffset > 300) {
        scrollToTopBtn.classList.add('visible');
    } else {
        scrollToTopBtn.classList.remove('visible');
    }
}, 100);

window.addEventListener('scroll', handleScroll, { passive: true });

// Scroll to top when button is clicked
scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});



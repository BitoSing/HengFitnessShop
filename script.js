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
    console.log('Setting up category filters...');
    document.querySelectorAll('.category-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = link.getAttribute('data-category');
            console.log('Category clicked:', category);
            
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
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    const wishlistBtns = document.querySelectorAll('.wishlist-btn');
    
    viewDetailsBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = btn.getAttribute('data-product-id');
            showProductDetails(productId);
        });
    });
    
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = btn.getAttribute('data-product-id');
            addToCart(productId);
        });
    });
    
    wishlistBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = btn.getAttribute('data-product-id');
            addToWishlist(productId);
        });
    });
}

// Add to cart function
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        console.log('Added to cart:', product.name);
        // You can implement cart functionality here
        // For now, just show a simple notification
        showNotification(`${product.name} added to cart!`);
    }
}

// Add to wishlist function
function addToWishlist(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        console.log('Added to wishlist:', product.name);
        // You can implement wishlist functionality here
        // For now, just show a simple notification
        showNotification(`${product.name} added to wishlist!`);
    }
}

// Show notification function
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--accent-color);
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Simple product display
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded - checking products...');
    
    // Wait a moment for products to load
    setTimeout(() => {
        if (typeof products !== 'undefined' && products.length > 0) {
            console.log('Products found:', products.length);
            displayProducts('all');
            setupCategoryFilters();
        } else {
            console.error('No products loaded');
        }
    }, 500);
});

function displayProducts(category) {
    console.log('Displaying products for category:', category);
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) {
        console.error('Products grid not found!');
        return;
    }

    // Add loading state to grid
    productsGrid.classList.add('loading');
    
    // Fade out existing products
    const existingCards = productsGrid.querySelectorAll('.product-card');
    existingCards.forEach(card => card.classList.add('fade-out'));
    
    // Show loading skeleton briefly
    setTimeout(() => {
        productsGrid.innerHTML = '';
        showLoadingSkeleton(productsGrid);
        
        // Simulate loading delay for better UX
        setTimeout(() => {
            productsGrid.classList.remove('loading');
            loadProducts(category, productsGrid);
        }, 400);
    }, 300);
}

function showLoadingSkeleton(container) {
    const skeletonCount = 6; // Number of skeleton cards to show
    let skeletonHTML = '';
    
    for (let i = 0; i < skeletonCount; i++) {
        skeletonHTML += `
            <div class="skeleton-card">
                <div class="skeleton-image"></div>
                <div class="skeleton-text title"></div>
                <div class="skeleton-text"></div>
                <div class="skeleton-text price"></div>
            </div>
        `;
    }
    
    container.innerHTML = skeletonHTML;
}

function loadProducts(category, container) {
    const productsToShow = category === 'all' ? products : products.filter(product => product.category === category);
    console.log('Products to show:', productsToShow.length, 'out of', products.length);
    
    // Log first few products and their categories for debugging
    if (productsToShow.length > 0) {
        console.log('Sample products in category:', productsToShow.slice(0, 3).map(p => ({name: p.name, category: p.category})));
    } else {
        console.log('All available categories:', [...new Set(products.map(p => p.category))]);
    }
    
    // Clear skeleton
    container.innerHTML = '';
    
    // Show no products message if needed
    if (productsToShow.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: #666;">
                <i class="fas fa-search" style="font-size: 48px; margin-bottom: 20px; opacity: 0.3;"></i>
                <h3>No products found in this category</h3>
                <p>Try selecting a different category or check back later for new products.</p>
            </div>
        `;
        return;
    }
    
    // Create and append products with staggered animation
    productsToShow.forEach((product, index) => {
        setTimeout(() => {
            const productCard = createProductCard(product);
            container.appendChild(productCard);
            
            // Add entrance animation
            setTimeout(() => {
                productCard.style.opacity = '1';
                productCard.style.transform = 'translateY(0) scale(1)';
            }, 50);
        }, index * 100); // Staggered delay
    });
    
    console.log('Displayed', productsToShow.length, 'products');
    
    // Add event listeners to view details buttons
    setTimeout(() => {
        addViewDetailsListeners();
    }, productsToShow.length * 100 + 200);
}

function createProductCard(product) {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    productCard.style.opacity = '0';
    productCard.style.transform = 'translateY(30px) scale(0.95)';
    productCard.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    
    productCard.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/250x250?text=${encodeURIComponent(product.name)}'">
            ${product.badge ? `<span class="product-badge ${product.badge.toLowerCase()}">${product.badge}</span>` : ''}
        </div>
        <div class="product-info">
            <p class="product-id">ID: ${product.id}</p>
            <h4 class="product-name">${product.name}</h4>
            <p class="product-price">${product.price}</p>
            <button class="btn-add view-details-btn" data-product-id="${product.id}">View Details</button>
        </div>
        <div class="product-overlay">
            <div class="product-actions">
                <button class="product-action-btn view-details-btn" data-product-id="${product.id}" title="View Details">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="product-action-btn add-to-cart-btn" data-product-id="${product.id}" title="Add to Cart">
                    <i class="fas fa-shopping-cart"></i>
                </button>
                <button class="product-action-btn wishlist-btn" data-product-id="${product.id}" title="Add to Wishlist">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
            <div class="quick-view-text">Quick View</div>
        </div>
    `;
    
    return productCard;
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
                    <button class="btn-close-modal">Close</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modalOverlay);

    // Add close functionality
    const closeBtn = modalOverlay.querySelector('.close-modal');
    const closeBtnBottom = modalOverlay.querySelector('.btn-close-modal');
    
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(modalOverlay);
    });

    closeBtnBottom.addEventListener('click', () => {
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



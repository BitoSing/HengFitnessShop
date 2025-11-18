let currentSlideIndex = 0;
let currentCategory = 'all';
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Pagination variables
let currentPage = 1;
let itemsPerPage = 20;
let totalPages = 1;
let allProducts = [];

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
    
    // Add event listeners to cart buttons
    const cartBtns = document.querySelectorAll('.add-to-cart');
    cartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const productId = btn.getAttribute('data-product-id');
            addToCart(productId);
        });
    });
}

// Add to cart function is implemented later

// Add to wishlist function
function addToWishlist(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    const existingItem = wishlist.find(item => item.id === productId);
    
    if (existingItem) {
        showNotification(`${product.name} is already in your wishlist!`);
        return;
    }
    
    wishlist.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category
    });
    
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistCount();
}

// Initialize Cart
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded - checking products...');
    
    // Initialize navbar functionality
    initializeNavbar();
    
    // Initialize cart
    updateCartCount();
    updateWishlistCount();
    setupCartEventListeners();
    
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

// Initialize Navbar Functionality
function initializeNavbar() {
    const navbar = document.querySelector('.navbar');
    let scrollThreshold = 50;
    
    // Enhanced scroll handling for navbar
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > scrollThreshold) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });
    
    // Mobile Menu Toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    
    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenu.classList.add('active');
            document.body.style.overflow = 'hidden'; // OVERFLOW_SET
        });
    }
    
    if (mobileMenuClose && mobileMenu) {
        mobileMenuClose.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Mobile Dropdown Toggle
    const mobileDropdownToggles = document.querySelectorAll('.mobile-dropdown-toggle');
    mobileDropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            const dropdown = toggle.closest('.mobile-dropdown');
            dropdown.classList.toggle('open');
        });
    });
    
    // Search Functionality
    const searchInput = document.getElementById('searchInput');
    const mobileSearchInput = document.getElementById('mobileSearchInput');
    
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
    
    if (mobileSearchInput) {
        mobileSearchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
                // Close mobile menu after search
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    
    // Update cart count
    updateCartCount();
}

// Search Function
function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const mobileSearchInput = document.getElementById('mobileSearchInput');
    const searchTerm = searchInput ? searchInput.value.trim() : (mobileSearchInput ? mobileSearchInput.value.trim() : '');
    
    if (!searchTerm) {
        displayProducts('all');
        return;
    }
    
    console.log('Searching for:', searchTerm);
    
    // Filter products based on search term
    const searchResults = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.khmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    console.log('Search results:', searchResults.length);
    
    // Display search results
    displaySearchResults(searchResults, searchTerm);
}

// Display Search Results
function displaySearchResults(results, searchTerm) {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    // Add loading state
    productsGrid.classList.add('loading');
    productsGrid.innerHTML = '';
    
    // Show loading skeleton briefly
    showLoadingSkeleton(productsGrid);
    
    setTimeout(() => {
        productsGrid.classList.remove('loading');
        productsGrid.innerHTML = '';
        
        if (results.length === 0) {
            productsGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: #666;">
                    <i class="fas fa-search" style="font-size: 48px; margin-bottom: 20px; opacity: 0.3;"></i>
                    <h3>No products found for "${searchTerm}"</h3>
                    <p>Try searching with different keywords or browse our categories.</p>
                    <button class="btn-primary" onclick="displayProducts('all')" style="margin-top: 20px;">
                        View All Products
                    </button>
                </div>
            `;
            return;
        }
        
        // Display all results at once
        const fragment = document.createDocumentFragment();
        results.forEach((product) => {
            const productCard = createProductCard(product);
            // Set initial state for animation
            productCard.style.opacity = '0';
            productCard.style.transform = 'translateY(20px) scale(0.95)';
            productCard.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            fragment.appendChild(productCard);
        });
        
        // Append all products at once
        productsGrid.appendChild(fragment);
        
        // Trigger entrance animation for all items simultaneously
        setTimeout(() => {
            const allCards = productsGrid.querySelectorAll('.product-card');
            allCards.forEach(card => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0) scale(1)';
            });
        }, 50);
        
        // Set up event listeners immediately
        setupProductListeners();
        
        // Update active category in navbar
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
    }, 400);
}

// Filter by Category from Navbar
function filterByCategory(category) {
    console.log('Filtering by category:', category);
    
    // Update active state in navbar
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Find and activate the correct nav link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        if (link.textContent.toLowerCase().includes(category.toLowerCase()) || 
            (category === 'all' && link.textContent.toLowerCase().includes('home'))) {
            link.classList.add('active');
        }
    });
    
    // Display products
    displayProducts(category);
    
    // Close mobile menu if open
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Scroll to products section
    const productsSection = document.querySelector('.products');
    if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Update Cart Count is implemented later

// Toggle Wishlist Modal/View
function toggleWishlist() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    if (wishlist.length === 0) {
        showNotification('Your wishlist is empty', 'info');
        return;
    }
    
    // Create wishlist modal
    const existingModal = document.querySelector('.wishlist-modal');
    if (existingModal) {
        document.body.removeChild(existingModal); document.body.style.overflow = 'auto'; return;
    }
    
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'wishlist-modal';
    modalOverlay.innerHTML = `
        <div class="modal-overlay" onclick="toggleWishlist()"></div>
        <div class="wishlist-content">
            <div class="wishlist-header">
                <h2><i class="fas fa-heart"></i> My Wishlist</h2>
                <button class="close-btn" onclick="toggleWishlist()">&times;</button>
            </div>
            <div class="wishlist-items">
                ${wishlist.map((productId, index) => {
                    const product = products.find(p => p.id === productId);
                    if (!product) return '';
                    return `
                        <div class="wishlist-item" style="animation-delay: ${index * 0.1}s">
                            <div class="wishlist-item-image-container">
                                <img src="${product.image}" alt="${product.name}" 
                                     onerror="this.src='https://via.placeholder.com/150x150?text=${encodeURIComponent(product.name)}'"
                                     loading="lazy">
                                <div class="wishlist-item-badge">
                                    <i class="fas fa-heart"></i>
                                </div>
                            </div>
                            <div class="wishlist-item-content">
                                <div class="wishlist-item-header">
                                    <h4 class="wishlist-item-title">${product.name}</h4>
                                    <span class="wishlist-item-category">${product.category}</span>
                                </div>
                                <div class="wishlist-item-price-section">
                                    <p class="wishlist-item-price">${product.price}</p>
                                    <p class="wishlist-item-original-price">${product.originalPrice || product.price}</p>
                                </div>
                                <div class="wishlist-item-actions">
                                    <button class="wishlist-btn-primary" onclick="addToCart('${product.id}'); closeWishlistModal();">
                                        <i class="fas fa-shopping-cart"></i>
                                        <span>Add to Cart</span>
                                    </button>
                                    <button class="wishlist-btn-danger" onclick="removeFromWishlist('${product.id}')">
                                        <i class="fas fa-trash"></i>
                                        <span>Remove</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
    
    document.body.appendChild(modalOverlay);
    document.body.style.overflow = 'hidden'; // OVERFLOW_SET
}

// Remove from Wishlist
function removeFromWishlist(productId) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    wishlist = wishlist.filter(id => id !== productId);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    
    const product = products.find(p => p.id === productId);
    showNotification(`${product.name} removed from wishlist`);
    updateWishlistCount();
    
    // Refresh wishlist modal if open
    const modal = document.querySelector('.wishlist-modal');
    if (modal) {
        document.body.removeChild(modal);
        closeWishlistModal();
    }
}

// Update Wishlist Count
function updateWishlistCount() {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const wishlistBadge = document.querySelector('.wishlist-badge');
    if (wishlistBadge) {
        wishlistBadge.textContent = wishlist.length;
        wishlistBadge.style.display = wishlist.length > 0 ? 'flex' : 'none';
    }
    
    // Update wishlist button state
    const wishlistBtn = document.querySelector('.action-btn[title="Favorites"]');
    if (wishlistBtn) {
        if (wishlist.length > 0) {
            wishlistBtn.classList.add('wishlist-active');
        } else {
            wishlistBtn.classList.remove('wishlist-active');
        }
    }
}

// Open Cart
function openCart() {
    openCartModal();
}

// Show Notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Style notification
    notification.style.cssText = `
        position: fixed;
        top: 120px;
        right: 20px;
        background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        z-index: 2000;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function displayProducts(category) {
    console.log('Displaying products for category:', category);
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) {
        console.error('Products grid not found!');
        return;
    }

    // Add loading state to grid with fade effect
    productsGrid.classList.add('loading');
    productsGrid.style.opacity = '0.5';
    
    // Fade out existing products smoothly
    const existingCards = productsGrid.querySelectorAll('.product-card');
    existingCards.forEach((card, index) => {
        card.style.animation = `fadeOut 0.3s ease forwards`;
        card.style.animationDelay = `${index * 0.05}s`;
    });
    
    // Show loading skeleton with staggered animation
    setTimeout(() => {
        productsGrid.innerHTML = '';
        productsGrid.style.opacity = '1';
        showLoadingSkeleton(productsGrid);
        
        // Load products after skeleton animation
        setTimeout(() => {
            productsGrid.classList.remove('loading');
            loadProducts(category, productsGrid);
        }, 600);
    }, 300);
}

function showLoadingSkeleton(container) {
    const skeletonCount = 6; // Number of skeleton cards to show
    let skeletonHTML = '';
    
    for (let i = 0; i < skeletonCount; i++) {
        skeletonHTML += `
            <div class="skeleton-card" style="animation-delay: ${i * 0.1}s">
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
    // Get all products for the category
    allProducts = category === 'all' ? products : products.filter(product => product.category === category);
    console.log('Products to show:', allProducts.length, 'out of', products.length);
    
    // Reset to page 1 when category changes
    currentPage = 1;
    
    // Calculate total pages
    totalPages = Math.ceil(allProducts.length / itemsPerPage);
    
    // Display products for current page
    displayProductsPage(container);
    
    // Generate pagination controls
    generatePagination();
}

function displayProductsPage(container) {
    // Calculate start and end indices
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageProducts = allProducts.slice(startIndex, endIndex);
    
    console.log(`Displaying page ${currentPage} of ${totalPages}, items ${startIndex + 1}-${Math.min(endIndex, allProducts.length)}`);
    
    // Clear container immediately
    container.innerHTML = '';
    
    // Create a document fragment to batch append all products
    const fragment = document.createDocumentFragment();
    
    // Create product cards with staggered animation
    pageProducts.forEach((product, index) => {
        const productCard = createProductCard(product);
        // Set initial state for animation
        productCard.style.opacity = '0';
        productCard.style.transform = 'translateY(30px) scale(0.9)';
        productCard.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
        productCard.style.animationDelay = `${index * 0.08}s`;
        fragment.appendChild(productCard);
    });
    
    // Append all products at once
    container.appendChild(fragment);
    
    // Trigger entrance animation with staggered timing
    setTimeout(() => {
        const allCards = container.querySelectorAll('.product-card');
        allCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0) scale(1)';
            }, index * 60);
        });
    }, 50);
    
    // Set up event listeners immediately
    setupProductListeners();
    
    console.log('Displayed', pageProducts.length, 'products');
}

function generatePagination() {
    const paginationContainer = document.getElementById('paginationContainer');
    if (!paginationContainer) return;
    
    paginationContainer.innerHTML = '';
    
    // Hide pagination if only 1 page
    if (totalPages <= 1) {
        paginationContainer.style.display = 'none';
        return;
    }
    
    paginationContainer.style.display = 'flex';
    
    // Previous button
    const prevBtn = document.createElement('button');
    prevBtn.className = 'pagination-btn';
    prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i> Previous';
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => goToPage(currentPage - 1);
    paginationContainer.appendChild(prevBtn);
    
    // Page numbers
    const pageNumbersContainer = document.createElement('div');
    pageNumbersContainer.className = 'pagination-numbers';
    
    // Calculate which page numbers to show
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);
    
    // Show first page if not visible
    if (startPage > 1) {
        const firstPageBtn = document.createElement('button');
        firstPageBtn.className = 'pagination-number';
        firstPageBtn.textContent = '1';
        firstPageBtn.onclick = () => goToPage(1);
        pageNumbersContainer.appendChild(firstPageBtn);
        
        if (startPage > 2) {
            const dots = document.createElement('span');
            dots.className = 'pagination-dots';
            dots.textContent = '...';
            pageNumbersContainer.appendChild(dots);
        }
    }
    
    // Show page numbers
    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `pagination-number ${i === currentPage ? 'active' : ''}`;
        pageBtn.textContent = i;
        pageBtn.onclick = () => goToPage(i);
        pageNumbersContainer.appendChild(pageBtn);
    }
    
    // Show last page if not visible
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            const dots = document.createElement('span');
            dots.className = 'pagination-dots';
            dots.textContent = '...';
            pageNumbersContainer.appendChild(dots);
        }
        
        const lastPageBtn = document.createElement('button');
        lastPageBtn.className = 'pagination-number';
        lastPageBtn.textContent = totalPages;
        lastPageBtn.onclick = () => goToPage(totalPages);
        pageNumbersContainer.appendChild(lastPageBtn);
    }
    
    paginationContainer.appendChild(pageNumbersContainer);
    
    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.className = 'pagination-btn';
    nextBtn.innerHTML = 'Next <i class="fas fa-chevron-right"></i>';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => goToPage(currentPage + 1);
    paginationContainer.appendChild(nextBtn);
}

function goToPage(pageNumber) {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    
    currentPage = pageNumber;
    const productsGrid = document.getElementById('productsGrid');
    
    // Scroll to products section
    const productsSection = document.querySelector('.products');
    if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    // Display products for the new page
    displayProductsPage(productsGrid);
    
    // Regenerate pagination
    generatePagination();
}

function setupProductListeners() {
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        setupProductCardListeners(card);
    });
}

// Set up event listeners for a product card
function setupProductCardListeners(productCard) {
    // Cart button
    const cartBtn = productCard.querySelector('.add-to-cart-btn');
    if (cartBtn) {
        cartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const productId = cartBtn.getAttribute('data-product-id');
            addToCart(productId);
        });
    }
    
    // Wishlist button
    const wishlistBtn = productCard.querySelector('.wishlist-btn');
    if (wishlistBtn) {
        wishlistBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const productId = wishlistBtn.getAttribute('data-product-id');
            addToWishlist(productId);
        });
    }
    
    // View details buttons
    const viewBtns = productCard.querySelectorAll('.view-details-btn');
    viewBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const productId = btn.getAttribute('data-product-id');
            showProductDetails(productId);
        });
    });
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
        </div>
    `;
    
    return productCard;
}

// Show product details popup
function showProductDetails(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // Remove any existing modal overlays first
    const existingModals = document.querySelectorAll('.product-details-modal');
    existingModals.forEach(modal => {
        if (modal.parentNode) {
            modal.parentNode.removeChild(modal);
        }
    });

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
    document.body.style.overflow = 'hidden'; // OVERFLOW_SET

    // Create a single close function to avoid duplication
    const closeModalOverlay = () => {
        if (modalOverlay.parentNode) {
            document.body.removeChild(modalOverlay);
            document.body.style.overflow = 'auto';
        }
    };

    // Add close functionality
    const closeBtn = modalOverlay.querySelector('.close-modal');
    const closeBtnBottom = modalOverlay.querySelector('.btn-close-modal');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModalOverlay);
    }

    if (closeBtnBottom) {
        closeBtnBottom.addEventListener('click', closeModalOverlay);
    }

    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModalOverlay();
        }
    });

    // Add to cart functionality
    const addBtn = modalOverlay.querySelector('.btn-add');
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            addToCart(product.id);
            closeModalOverlay();
        });
    }
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
        document.body.style.overflow = 'hidden'; // OVERFLOW_SET
    }
}

function closeModal() {
    document.getElementById('productModal').classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Cart, Checkout & Invoice Functionality
function proceedToCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty', 'error');
        return;
    }
    
    closeCart();
    openCheckoutModal();
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
    document.getElementById('invoiceGrandTotalKHR').textContent = `KHR ${grandTotalKHR.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
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

// Cart State Management
let cartCount = 0;

// Setup Cart Event Listeners
function setupCartEventListeners() {
    // Cart icon click
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.addEventListener('click', openCartModal);
    }

    // Modal close buttons
    const cartClose = document.querySelector('.cart-close');
    const checkoutClose = document.querySelector('.checkout-close');
    const invoiceClose = document.querySelector('.invoice-close');

    if (cartClose) cartClose.addEventListener('click', closeCartModal);
    if (checkoutClose) checkoutClose.addEventListener('click', closeCheckoutModal);
    if (invoiceClose) invoiceClose.addEventListener('click', closeInvoiceModal);

    // Overlay clicks
    const cartOverlay = document.querySelector('.cart-overlay');
    const checkoutOverlay = document.querySelector('.checkout-overlay');
    const invoiceOverlay = document.querySelector('.invoice-overlay');

    if (cartOverlay) cartOverlay.addEventListener('click', closeCartModal);
    if (checkoutOverlay) checkoutOverlay.addEventListener('click', closeCheckoutModal);
    if (invoiceOverlay) invoiceOverlay.addEventListener('click', closeInvoiceModal);

    // Cart action buttons
    const clearCartBtn = document.getElementById('clearCartBtn');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    const printInvoiceBtn = document.getElementById('printInvoiceBtn');

    if (clearCartBtn) clearCartBtn.addEventListener('click', clearCart);
    if (checkoutBtn) checkoutBtn.addEventListener('click', openCheckoutModal);
    if (placeOrderBtn) placeOrderBtn.addEventListener('click', placeOrder);
    if (printInvoiceBtn) printInvoiceBtn.addEventListener('click', printInvoice);

    // Add to cart buttons (delegated)
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart-btn')) {
            const productId = e.target.getAttribute('data-product-id');
            addToCart(productId);
        }
    });
}

// Cart Modal Functions
function openCartModal() {
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        cartModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        renderCart();
    }
}

function closeCart() {
    closeCartModal();
}

function closeCartModal() {
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        cartModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Checkout Modal Functions
function openCheckoutModal() {
    closeCartModal();
    const checkoutModal = document.getElementById('checkoutModal');
    if (checkoutModal) {
        checkoutModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        renderCheckoutSummary();
    }
}

function closeCheckoutModal() {
    const checkoutModal = document.getElementById('checkoutModal');
    if (checkoutModal) {
        checkoutModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Invoice Modal Functions
function openInvoiceModal(orderData) {
    closeCheckoutModal();
    const invoiceModal = document.getElementById('invoiceModal');
    if (invoiceModal) {
        invoiceModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        renderInvoice(orderData);
    }
}

function closeInvoice() {
    closeInvoiceModal();
}

function closeInvoiceModal() {
    const invoiceModal = document.getElementById('invoiceModal');
    if (invoiceModal) {
        invoiceModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Cart Management Functions
function addToCart(productId) {
    const product = products.find(p => p.id == productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id == productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    saveCart();
    updateCartCount();
    showNotification('Product added to cart!', 'success');
}

function removeFromCart(index) {
    if (index >= 0 && index < cart.length) {
        cart.splice(index, 1);
        saveCart();
        updateCartCount();
        renderCart();
        showNotification('Item removed from cart', 'info');
    }
}

function updateQuantity(index, change) {
    if (index >= 0 && index < cart.length) {
        const item = cart[index];
        const newQuantity = item.quantity + change;
        
        if (newQuantity <= 0) {
            removeFromCart(index);
        } else {
            item.quantity = newQuantity;
            saveCart();
            renderCart();
        }
    }
}

function clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
        cart = [];
        saveCart();
        updateCartCount();
        renderCart();
        showNotification('Cart cleared!', 'info');
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
    cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    
    // Update desktop cart badge
    const cartBadge = document.getElementById('cartCount');
    if (cartBadge) {
        cartBadge.textContent = cartCount;
        cartBadge.style.display = cartCount > 0 ? 'inline-flex' : 'none';
    }
    
    // Update mobile cart count
    const mobileBadge = document.getElementById('mobileCartCount');
    if (mobileBadge) {
        mobileBadge.textContent = cartCount;
        mobileBadge.style.display = cartCount > 0 ? 'inline-flex' : 'none';
    }
}

// Render Functions
function renderCart() {
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const emptyCart = document.querySelector('.empty-cart');
    const cartContent = document.querySelector('.cart-content');

    if (!cartItemsContainer) return;

    if (cart.length === 0) {
        if (emptyCart) emptyCart.style.display = 'block';
        if (cartContent) cartContent.style.display = 'none';
        return;
    }

    if (emptyCart) emptyCart.style.display = 'none';
    if (cartContent) cartContent.style.display = 'grid';

    cartItemsContainer.innerHTML = cart.map((item, index) => {
        const itemPrice = parseFloat(item.price.replace(/[^0-9.]/g, ''));
        const itemTotal = (itemPrice * item.quantity).toFixed(2);
        return `
        <div class="cart-item" data-index="${index}" style="animation-delay: ${index * 0.08}s">
            <div class="cart-item-image-container">
                <img src="${item.image}" alt="${item.name}" 
                     onerror="this.src='https://via.placeholder.com/150x150?text=${encodeURIComponent(item.name)}'"
                     loading="lazy">
                <div class="cart-item-badge">
                    <i class="fas fa-check"></i>
                </div>
            </div>
            <div class="cart-item-content">
                <div class="cart-item-header">
                    <div>
                        <h4 class="cart-item-name">${item.name}</h4>
                        <span class="cart-item-category">${item.category || 'Product'}</span>
                    </div>
                </div>
                
                <div class="cart-item-details">
                    <div class="cart-item-price-section">
                        <span class="price-label">Price:</span>
                        <span class="cart-item-price">${item.price}</span>
                    </div>
                    
                    <div class="cart-item-quantity-section">
                        <div class="quantity-control">
                            <span class="qty-label">Qty:</span>
                            <div class="cart-item-quantity">
                                <button class="quantity-btn" onclick="updateQuantity(${index}, -1)" title="Decrease">
                                    <i class="fas fa-minus"></i>
                                </button>
                                <span class="quantity">${item.quantity}</span>
                                <button class="quantity-btn" onclick="updateQuantity(${index}, 1)" title="Increase">
                                    <i class="fas fa-plus"></i>
                                </button>
                            </div>
                        </div>
                        
                        <div class="cart-item-total-price">
                            <span class="item-total-label">Total:</span>
                            <span class="item-total-amount">$${itemTotal}</span>
                        </div>
                    </div>
                </div>
                
                <div class="cart-item-actions">
                    <button class="cart-btn-primary" onclick="addToCart('${item.id}')" title="Add another item">
                        <i class="fas fa-plus-circle"></i>
                        <span>Add More</span>
                    </button>
                    <button class="cart-btn-danger" onclick="removeFromCart(${index})" title="Remove from cart">
                        <i class="fas fa-trash-alt"></i>
                        <span>Remove</span>
                    </button>
                </div>
            </div>
        </div>
    `;
    }).join('');

    renderCartSummary();
}

// Print Cart Functionality
function printCart() {
    if (cart.length === 0) {
        showNotification('Your cart is empty', 'error');
        return;
    }

    // Create print content
    const printWindow = window.open('', '_blank');
    const subtotal = cart.reduce((total, item) => {
        const price = parseFloat(item.price.replace(/[^0-9.]/g, ''));
        return total + (price * item.quantity);
    }, 0);
    const tax = subtotal * 0.08;
    const shipping = subtotal > 100 ? 0 : 10;
    const total = subtotal + tax + shipping;

    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Cart Summary - Heng Fitness Shop</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
                .header { text-align: center; border-bottom: 2px solid #4CAF50; padding-bottom: 20px; margin-bottom: 30px; }
                .header h1 { color: #4CAF50; margin: 0; }
                .header p { color: #666; margin: 5px 0; }
                .cart-item { display: flex; align-items: center; margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 8px; }
                .item-image { width: 80px; height: 80px; margin-right: 15px; border-radius: 5px; }
                .item-details { flex: 1; }
                .item-name { font-size: 1.1rem; font-weight: bold; margin: 0 0 5px 0; }
                .item-price { color: #666; margin: 0 0 5px 0; }
                .item-quantity { color: #888; font-size: 0.9rem; }
                .item-total { text-align: right; font-weight: bold; color: #4CAF50; min-width: 100px; }
                .summary { margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 8px; }
                .summary-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
                .summary-row.total { font-size: 1.2rem; font-weight: bold; color: #4CAF50; border-top: 2px solid #ddd; padding-top: 10px; }
                .footer { text-align: center; margin-top: 30px; color: #666; font-size: 0.9rem; }
                @media print { body { margin: 10px; } }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Heng Fitness Shop</h1>
                <p>Cart Summary</p>
                <p>Date: ${new Date().toLocaleDateString()}</p>
            </div>
            
            <div class="cart-items">
                ${cart.map(item => `
                    <div class="cart-item">
                        <img src="${item.image}" alt="${item.name}" class="item-image" onerror="this.src='https://via.placeholder.com/80x80?text=${encodeURIComponent(item.name)}'">
                        <div class="item-details">
                            <div class="item-name">${item.name}</div>
                            <div class="item-price">${item.price}</div>
                            <div class="item-quantity">Quantity: ${item.quantity}</div>
                        </div>
                        <div class="item-total">
                            $${(parseFloat(item.price.replace(/[^0-9.]/g, '')) * item.quantity).toFixed(2)}
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="summary">
                <div class="summary-row">
                    <span>Subtotal:</span>
                    <span>$${subtotal.toFixed(2)}</span>
                </div>
                <div class="summary-row">
                    <span>Tax (8%):</span>
                    <span>$${tax.toFixed(2)}</span>
                </div>
                <div class="summary-row">
                    <span>Shipping:</span>
                    <span>${shipping === 0 ? 'FREE' : '$' + shipping.toFixed(2)}</span>
                </div>
                <div class="summary-row total">
                    <span>Total:</span>
                    <span>$${total.toFixed(2)}</span>
                </div>
            </div>
            
            <div class="footer">
                <p>Thank you for shopping at Heng Fitness Shop!</p>
                <p>Visit us again soon</p>
            </div>
        </body>
        </html>
    `);

    printWindow.document.close();
    printWindow.print();
}

function renderCartSummary() {
    const subtotal = cart.reduce((total, item) => {
        const price = parseFloat(item.price.replace(/[^0-9.]/g, ''));
        return total + (price * item.quantity);
    }, 0);

    const summaryContainer = document.querySelector('.summary-section');
    if (summaryContainer) {
        summaryContainer.innerHTML = `
            <h3>Order Summary</h3>
            <div class="summary-row">
                <span>Subtotal:</span>
                <span>$${subtotal.toFixed(2)}</span>
            </div>
            
            <div class="summary-row">
                <span>Delivery Fee (Optional):</span>
                <div class="input-group">
                    <span>$</span>
                    <input type="number" id="deliveryFeeInput" placeholder="0.00" min="0" step="0.01" 
                           onchange="updateCartSummaryTotals()">
                </div>
            </div>
            
            <div class="summary-row">
                <span>Discount (Optional):</span>
                <div class="input-group">
                    <input type="number" id="discountInput" placeholder="0" min="0" max="100" step="0.01" 
                           onchange="updateCartSummaryTotals()">
                    <span>%</span>
                </div>
            </div>
            
            <div class="summary-row total">
                <span>Total:</span>
                <span id="cartTotal">$${subtotal.toFixed(2)}</span>
            </div>
            <div class="cart-actions">
                <button class="btn-secondary" onclick="clearCart()">Clear Cart</button>
                <button class="btn-primary" onclick="openCheckoutModal()">Checkout</button>
            </div>
        `;
    }
}

function updateCartSummaryTotals() {
    const subtotal = cart.reduce((total, item) => {
        const price = parseFloat(item.price.replace(/[^0-9.]/g, ''));
        return total + (price * item.quantity);
    }, 0);

    const deliveryFeeInput = document.getElementById('deliveryFeeInput');
    const discountInput = document.getElementById('discountInput');
    
    const deliveryFee = deliveryFeeInput ? parseFloat(deliveryFeeInput.value) || 0 : 0;
    const discountPercentage = discountInput ? parseFloat(discountInput.value) || 0 : 0;
    
    const discountAmount = subtotal * (discountPercentage / 100);
    const total = subtotal + deliveryFee - discountAmount;
    
    const cartTotalElement = document.getElementById('cartTotal');
    if (cartTotalElement) {
        cartTotalElement.textContent = `$${total.toFixed(2)}`;
    }
}

function renderCheckoutSummary() {
    const orderItemsContainer = document.getElementById('orderItems');
    if (!orderItemsContainer) return;

    const subtotal = cart.reduce((total, item) => {
        const price = parseFloat(item.price.replace(/[^0-9.]/g, ''));
        return total + (price * item.quantity);
    }, 0);

    const tax = subtotal * 0.08;
    const shipping = subtotal > 100 ? 0 : 10;
    const total = subtotal + tax + shipping;

    orderItemsContainer.innerHTML = cart.map(item => `
        <div class="order-item">
            <span class="order-item-name">${item.name}</span>
            <span class="order-item-quantity">x${item.quantity}</span>
            <span class="order-item-price">${item.price}</span>
        </div>
    `).join('');

    // Update checkout summary totals
    const checkoutSummary = document.querySelector('.checkout-summary');
    if (checkoutSummary) {
        const totalsHtml = checkoutSummary.innerHTML;
        const newTotalsHtml = totalsHtml.replace(
            /<div class="summary-row total">.*?<\/div>/s,
            `<div class="summary-row total">
                <span>Total:</span>
                <span>$${total.toFixed(2)}</span>
            </div>`
        );
        checkoutSummary.innerHTML = newTotalsHtml;
    }
}

function placeOrder() {
    const form = document.getElementById('checkoutForm');
    if (!form) return;

    // Basic form validation
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'postalCode'];
    let isValid = true;

    requiredFields.forEach(fieldName => {
        const field = form[fieldName];
        if (field && !field.value.trim()) {
            field.style.borderColor = 'red';
            isValid = false;
        } else if (field) {
            field.style.borderColor = '#ddd';
        }
    });

    if (!isValid) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    // Create order data
    const orderData = {
        orderNumber: 'ORD-' + Date.now(),
        date: new Date().toLocaleDateString(),
        customer: {
            firstName: form.firstName.value,
            lastName: form.lastName.value,
            email: form.email.value,
            phone: form.phone.value,
            address: form.address.value,
            city: form.city.value,
            postalCode: form.postalCode.value
        },
        items: cart,
        paymentMethod: form.paymentMethod.value,
        orderNotes: form.orderNotes.value,
        totals: calculateTotals()
    };

    // Open invoice modal
    openInvoiceModal(orderData);

    // Clear cart after successful order
    cart = [];
    saveCart();
    updateCartCount();

    showNotification('Order placed successfully!', 'success');
}

function renderInvoice(orderData) {
    const invoiceContent = document.getElementById('invoiceContent');
    if (!invoiceContent) return;

    const { orderNumber, date, customer, items, totals } = orderData;

    invoiceContent.innerHTML = `
        <div class="invoice-header-info">
            <div class="invoice-company">
                <h2>Heng Fitness Shop</h2>
                <p>123 Fitness Street</p>
                <p>City, State 12345</p>
                <p>Phone: (555) 123-4567</p>
                <p>Email: info@hengfitness.com</p>
            </div>
            <div class="invoice-info">
                <div class="invoice-number">Invoice #${orderNumber}</div>
                <div class="invoice-date">Date: ${date}</div>
            </div>
        </div>

        <div class="invoice-section">
            <h3>Billing Information</h3>
            <div class="invoice-billing">
                <div class="billing-group">
                    <h4>Customer</h4>
                    <p>${customer.firstName} ${customer.lastName}</p>
                    <p>${customer.email}</p>
                    <p>${customer.phone}</p>
                </div>
                <div class="billing-group">
                    <h4>Shipping Address</h4>
                    <p>${customer.address}</p>
                    <p>${customer.city}, ${customer.postalCode}</p>
                </div>
            </div>
        </div>

        <div class="invoice-section">
            <h3>Order Items</h3>
            <table class="invoice-table">
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Quantity</th>
                        <th class="text-right">Price</th>
                        <th class="text-right">Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${items.map(item => {
                        const price = parseFloat(item.price.replace(/[^0-9.]/g, ''));
                        const itemTotal = price * item.quantity;
                        return `
                            <tr>
                                <td>${item.name}</td>
                                <td>${item.quantity}</td>
                                <td class="text-right">${item.price}</td>
                                <td class="text-right">$${itemTotal.toFixed(2)}</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>

        <div class="invoice-totals">
            <table class="totals-table">
                <tr>
                    <td>Subtotal:</td>
                    <td class="text-right">$${totals.subtotal.toFixed(2)}</td>
                </tr>
                <tr>
                    <td>Tax (8%):</td>
                    <td class="text-right">$${totals.tax.toFixed(2)}</td>
                </tr>
                <tr>
                    <td>Shipping:</td>
                    <td class="text-right">${totals.shipping === 0 ? 'FREE' : '$' + totals.shipping.toFixed(2)}</td>
                </tr>
                <tr class="total-row">
                    <td>Total:</td>
                    <td class="text-right">$${totals.total.toFixed(2)}</td>
                </tr>
            </table>
        </div>

        <div class="invoice-footer">
            <p>Thank you for your order!</p>
            <p>Payment Method: ${orderData.paymentMethod}</p>
            <p>${orderData.orderNotes ? 'Order Notes: ' + orderData.orderNotes : ''}</p>
        </div>
    `;
}

function calculateTotals() {
    const subtotal = cart.reduce((total, item) => {
        const price = parseFloat(item.price.replace(/[^0-9.]/g, ''));
        return total + (price * item.quantity);
    }, 0);

    const tax = subtotal * 0.08;
    const shipping = subtotal > 100 ? 0 : 10;
    const total = subtotal + tax + shipping;

    return { subtotal, tax, shipping, total };
}









// Fix for wishlist modal overflow issue
function closeWishlistModal() {
    const modal = document.querySelector('.wishlist-modal');
    if (modal) {
        document.body.removeChild(modal);
        document.body.style.overflow = 'auto'; // Restore scrolling
    }
}



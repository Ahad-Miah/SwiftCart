let allProductsData = [];
let cart = [];

// Load all products and trending
const loadAllData = () => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.remove('hidden');

    fetch('https://fakestoreapi.com/products')
        .then(res => res.json())
        .then(data => {
            allProductsData = data;
            displayProducts(data.slice(0, 3), 'trending-card-container');
            displayProducts(data, 'all-products-container');
        })
        .catch(console.log)
        .finally(() => loader && loader.classList.add('hidden'));
};

// Load category products
const loadCategoryCards = (category) => {
    const loader = document.getElementById('loader');
    const allProducts = document.getElementById('all-products-container');
    loader.classList.remove('hidden'); 
    allProducts.classList.add('hidden');

    fetch(`https://fakestoreapi.com/products/category/${category}`)
        .then(res => res.json())
        .then(data => displayProducts(data, 'all-products-container'))
        .catch(console.log)
        .finally(() => {
            allProducts.classList.remove('hidden');
            loader.classList.add('hidden'); 
        });
};

// Load categories
const loadCategories = () => {
    fetch('https://fakestoreapi.com/products/categories')
        .then(res => res.json())
        .then(displayCategories)
        .catch(console.log);
};

// Load single product details
const loadDetails = id => {
    fetch(`https://fakestoreapi.com/products/${id}`)
        .then(res => res.json())
        .then(displayDetails)
        .catch(console.log);
};

// Load product for cart
const loadSpecificProduct = id => {
    fetch(`https://fakestoreapi.com/products/${id}`)
        .then(res => res.json())
        .then(addedCart)
        .catch(console.log);
};

// Display details modal
const displayDetails = details => {
    const modalBox = document.getElementById('modalBox');
    modalBox.innerHTML = `
        <div class="p-4 space-y-4">
            <img src="${details.image}" alt="${details.title}" class="w-full h-64 object-cover rounded-lg shadow-md" />
            <h2 class="text-2xl font-bold text-gray-800">${details.title}</h2>
            <p class="text-gray-600">${details.description}</p>
            <div class="flex justify-between items-center">
                <span class="text-xl font-semibold text-[#0E7A81]">$${details.price}</span>
                <span class="flex items-center gap-1 text-yellow-500">
                    ${"★".repeat(Math.floor(details.rating.rate))}${"☆".repeat(5-Math.floor(details.rating.rate))}
                    <span class="text-gray-500 text-sm">(${details.rating.rate})</span>
                </span>
            </div>
            <button class="btn w-full bg-[#0E7A81] text-white hover:bg-[#0B5C5E]" onclick="addToCart('${details.id}')">Add to Cart</button>
        </div>
    `;
    document.getElementById('modal').click();
};

// Add to Cart
const addToCart = id => loadSpecificProduct(id);
const addedCart = data => {
    cart.push(data);
    updateCartCount();
    showToast(`${data.title} added to cart!`);
    if(document.getElementById('showModal')) document.getElementById('showModal').close();
};

// Remove from cart
const removeFromCart = index => {
    const removed = cart.splice(index, 1)[0];
    updateCartCount();
    showToast(`${removed.title} removed from cart!`);
};

// Update cart UI
const updateCartCount = () => {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartCountBadge = document.getElementById('cartItemCount');
    const cartCountText = document.getElementById('cartCount');
    const cartSubtotal = document.getElementById('cartSubtotal');

    cartItemsContainer.innerHTML = '';
    let total = 0;
    cart.forEach((item, idx) => {
        total += parseFloat(item.price);
        const div = document.createElement('div');
        div.className = "flex justify-between items-center border-b border-gray-200 pb-1 text-sm";
        div.innerHTML = `<span class="truncate">${item.title}</span>
                         <div class="flex items-center gap-2">
                           <span class="font-semibold">$${item.price}</span>
                           <button class="text-red-500 font-bold hover:text-red-700 removeBtn">×</button>
                         </div>`;
        div.querySelector('.removeBtn').addEventListener('click', () => removeFromCart(idx));
        cartItemsContainer.appendChild(div);
    });
    cartCountBadge.textContent = cart.length;
    cartCountText.textContent = cart.length;
    cartSubtotal.textContent = total.toFixed(2);
};

// Display products in grid
const displayProducts = (products, containerId) => {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    products.forEach(product => {
        const card = document.createElement('div');
        card.innerHTML = `
        <div class="bg-white rounded-2xl shadow-sm hover:shadow-md transition duration-300 overflow-hidden border border-gray-100 h-full flex flex-col">
          <div class="bg-gray-100 p-4 flex items-center justify-center">
            <img src="${product.image}" class="h-48 object-contain" />
          </div>
          <div class="p-4 sm:p-6 flex flex-col flex-grow">
            <div class="flex justify-between items-center mb-2">
              <span class="text-xs px-3 py-1 rounded-full bg-indigo-100 text-indigo-600 uppercase">${product.category}</span>
              <div class="flex items-center text-sm text-gray-500">
                <i class="fa-solid fa-star text-yellow-400 mr-1"></i>${product.rating.rate}
              </div>
            </div>
            <h3 class="font-semibold text-gray-800 mb-2 line-clamp-2 text-sm sm:text-base">${product.title}</h3>
            <p class="text-lg font-bold text-gray-900 mb-2 mt-auto">$${product.price}</p>
            <div class="flex gap-2">
              <button onclick="loadDetails(${product.id})" class="flex-1 border border-gray-300 rounded-lg py-2 text-xs sm:text-sm text-gray-600 hover:bg-gray-50 transition">Details</button>
              <button onclick="addToCart(${product.id})" class="flex-1 bg-indigo-600 text-white rounded-lg py-2 text-xs sm:text-sm hover:bg-indigo-700 transition">Add to Cart</button>
            </div>
          </div>
        </div>`;
        container.appendChild(card);
    });
};

// Display category buttons
const displayCategories = categories => {
    const container = document.getElementById('category-container');
    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = `btn btn-outline border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-700 hover:border-slate-300 rounded-full px-6 sm:px-8 normal-case text-base font-medium h-10 sm:h-12 min-h-0`;
        btn.innerText = cat;
        btn.addEventListener("click", () => {
            setActiveButton(btn);
            loadCategoryCards(cat);
        });
        container.appendChild(btn);
    });
};

// Active category button
const setActiveButton = btn => {
    document.querySelectorAll('#category-container button').forEach(b => b.classList.remove('activeBtn'));
    btn.classList.add('activeBtn');
};

// Toast notification
const showToast = msg => {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'bg-green-500 text-white px-4 py-2 rounded shadow-lg flex items-center justify-between space-x-2 animate-fadeIn';
    toast.innerHTML = `<span>${msg}</span><button class="ml-4 font-bold text-white">&times;</button>`;
    toast.querySelector('button').addEventListener('click', () => toast.remove());
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
};

// Load all on DOM ready
document.addEventListener("DOMContentLoaded", () => {
    loadAllData();
    loadCategories();
    const allBtn = document.getElementById("all");
    allBtn && allBtn.addEventListener("click", function() {
        allProductsData && allProductsData.length && displayProducts(allProductsData, "all-products-container");
        setActiveButton(this);
    });
});

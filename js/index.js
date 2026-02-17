let allProductsData = [];
let cart = [];
const loadAllData = () => {

    const loader = document.getElementById('loader');

    if (loader) {
        loader.classList.remove('hidden');
    }

    fetch('https://fakestoreapi.com/products')
        .then(res => res.json())
        .then(data => {
            allProductsData = data;

            displayProducts(data.slice(0, 3), 'trending-card-container');
            displayProducts(data, 'all-products-container');
        })
        .catch(error => {
            console.log(error);
        })
        .finally(() => {
            if (loader) {
                loader.classList.add('hidden');
            }
        });
};


const loadCategoryCards = (category) => {

    const loader = document.getElementById('loader');
    const allProducts=document.getElementById('all-products-container');
    loader.classList.remove('hidden'); 
    allProducts.classList.add('hidden');

    fetch(`https://fakestoreapi.com/products/category/${category}`)
        .then(res => res.json())
        .then(data => {
            displayProducts(data, 'all-products-container');
        })
        .catch(error => {
            console.log(error);
        })
        .finally(() => {
          allProducts.classList.remove('hidden');
            loader.classList.add('hidden'); 
        });
};

const loadCategories=()=>{
  fetch('https://fakestoreapi.com/products/categories')
  .then(res=>res.json())
  .then(categories=>{
   
    displayCategories(categories)}
    );
}
const loadDetails=(id)=>{
    
    fetch(`https://fakestoreapi.com/products/${id}`)
    .then(res =>res.json())
    .then(data=>
      {
        displayDetails(data)})
    .catch(error=>console.log(error));
}
const loadSpecificProduct=(id)=>{
    fetch(`https://fakestoreapi.com/products/${id}`)
    .then(res =>res.json())
    .then(data=>
      {
        addedCart(data)})
    .catch(error=>console.log(error));
}
const displayDetails = (details) => {
    const modalBox = document.getElementById('modalBox');
    modalBox.innerHTML = `
        <div class="p-4 space-y-4">
            <!-- Image -->
            <img src="${details.image || 'https://via.placeholder.com/400x250'}" 
                 alt="${details.title || 'Product Image'}" 
                 class="w-full h-64 object-cover rounded-lg shadow-md" />
            
            <!-- Title -->
            <h2 class="text-2xl font-bold text-gray-800">${details.title || "No Title"}</h2>
            
            <!-- Description -->
            <p class="text-gray-600">${details.description || "No Description Available."}</p>
            
            <!-- Price and Rating -->
            <div class="flex justify-between items-center">
                <span class="text-xl font-semibold text-[#0E7A81]">$${details.price || "0.00"}</span>
                <span class="flex items-center gap-1 text-yellow-500">
                    ${"★".repeat(Math.floor(details.rating.rate || 0))} 
                    ${"☆".repeat(5 - Math.floor(details.rating.rate|| 0))}
                    <span class="text-gray-500 text-sm">(${details.rating.rate || 0})</span>
                </span>
            </div>
            
            <!-- Add to Cart Button -->
            <button 
                class="btn w-full bg-[#0E7A81] text-white hover:bg-[#0B5C5E]"
                onclick="addToCart('${details.id || ''}')">
                Add to Cart
            </button>
        </div>
    `;
    
    // Open the modal
    document.getElementById('modal').click();
}

// Example Add to Cart function
const addToCart = (id) => {
   loadSpecificProduct(id);
}
const addedCart=(data)=>{
 cart.push(data);
 updateCartCount();
   showToast(`${data.title} added to cart!`);
     if(document.getElementById('showModal')) document.getElementById('showModal').close();

}
const updateCartCount = () => {
   const cartItemsContainer = document.getElementById('cartItems');
    const cartCountBadge = document.getElementById('cartItemCount');
    const cartCountText = document.getElementById('cartCount');
    const cartSubtotal = document.getElementById('cartSubtotal');
    cartItemsContainer.innerHTML = '';

    let total = 0;

    cart.forEach(item => {
        total += parseFloat(item.price);

        const itemEl = document.createElement('div');
        itemEl.className = "flex justify-between items-center border-b border-gray-200 pb-1";
        itemEl.innerHTML = `
            <span class="truncate">${item.title}</span>
            <span class="font-semibold">$${item.price}</span>
        `;
        cartItemsContainer.appendChild(itemEl);
    });
    cartCountBadge.textContent = cart.length;
    cartCountText.textContent = cart.length;
    cartSubtotal.textContent = total.toFixed(2);
  
}

const displayProducts = (products, containerId) => {
    const cardContainer = document.getElementById(containerId);
    
    if (!cardContainer) return;

    // Clear container before adding (prevents duplicates)
    cardContainer.innerHTML = "";

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.innerHTML = `
        <div class="bg-white rounded-2xl shadow-sm hover:shadow-md transition duration-300 overflow-hidden border border-gray-100 h-full flex flex-col">
          <div class="bg-gray-100 p-4 flex items-center justify-center">
            <img src="${product.image}" class="h-48 object-contain" />
          </div>
          <div class="p-6 flex flex-col flex-grow">
            <div class="flex justify-between items-center mb-3">
              <span class="text-xs font-medium px-3 py-1 rounded-full bg-indigo-100 text-indigo-600 uppercase">
                ${product.category}
              </span>
              <div class="flex items-center text-sm text-gray-500">
                <i class="fa-solid fa-star text-yellow-400 mr-1"></i>
                <span> ${product.rating.rate}</span>
              </div>
            </div>
            <h3 class="font-semibold text-gray-800 mb-2 line-clamp-2">
              ${product.title}
            </h3>
            <p class="text-lg font-bold text-gray-900 mb-5 mt-auto">$${product.price}</p>
            <div class="flex gap-2">
              <button  onclick="loadDetails(${product.id})"  class="flex-1 border border-gray-300 rounded-lg py-2 text-sm text-gray-600 hover:bg-gray-50 transition">
                Details
              </button>
              <button  onclick="addToCart(${product.id})"  class="flex-1 bg-indigo-600 text-white rounded-lg py-2 text-sm hover:bg-indigo-700 transition">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
        `;
         
        cardContainer.append(productCard);
    });
}
const displayCategories = (categories) => {

  const categoryContainer = document.getElementById('category-container');

  categories.forEach(category => {

    const button = document.createElement('button');

    button.className = `
      btn btn-outline border-slate-200 text-slate-600 
      hover:bg-slate-50 hover:text-slate-700 
      hover:border-slate-300 rounded-full px-6 
      normal-case text-base font-medium h-12 min-h-0
    `;

    button.innerText = category;

    // Click Event
    button.addEventListener("click", () => {
      setActiveButton(button);
      loadCategoryCards(category);
    });

    categoryContainer.appendChild(button);
  });

};

document.addEventListener("DOMContentLoaded", () => {

    const allBtn = document.getElementById("all");

    if (!allBtn) return;  

    allBtn.addEventListener("click", function () {

        if (allProductsData && allProductsData.length > 0) {
            displayProducts(allProductsData, "all-products-container");
        }

        setActiveButton(this);
    });

});


const setActiveButton = (clickedButton) => {

  const buttons = document.querySelectorAll('#category-container button');

  buttons.forEach(btn => btn.classList.remove('activeBtn'));

  clickedButton.classList.add('activeBtn');
};
const showToast = (message) => {
    const toastContainer = document.getElementById('toastContainer');

    const toast = document.createElement('div');
    toast.className = `
        bg-green-500 text-white px-4 py-2 rounded shadow-lg
        flex items-center justify-between space-x-2 animate-fadeIn
    `;
    toast.innerHTML = `
        <span>${message}</span>
        <button class="ml-4 font-bold text-white">&times;</button>
    `;

    toast.querySelector('button').addEventListener('click', () => {
        toast.remove();
    });

    toastContainer.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 3000);
}



loadAllData();
loadCategories();
let allProductsData = [];
const loadAllData = () => {
    fetch('https://fakestoreapi.com/products')
    .then(res => res.json())
    .then(data => {
      allProductsData=data;
        displayProducts(data.slice(0, 3), 'trending-card-container');
        displayProducts(data, 'all-products-container');
    });
}
const loadCategoryCards=(category)=>{
fetch(`https://fakestoreapi.com/products/category/${category}`)
.then(res=>res.json())
.then(data=>displayProducts(data,'all-products-container'))

}
const loadCategories=()=>{
  fetch('https://fakestoreapi.com/products/categories')
  .then(res=>res.json())
  .then(categories=>{
   
    displayCategories(categories)}
    );
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
              <button class="flex-1 border border-gray-300 rounded-lg py-2 text-sm text-gray-600 hover:bg-gray-50 transition">
                Details
              </button>
              <button class="flex-1 bg-indigo-600 text-white rounded-lg py-2 text-sm hover:bg-indigo-700 transition">
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


loadAllData();
loadCategories();
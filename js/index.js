const loadProducts=()=>{


    fetch('https://fakestoreapi.com/products')
    .then(res=>res.json())
    .then(data=>displayProducts(data.slice(0,3)));
}
const displayProducts=(Products)=>{

   const cardContainer=document.getElementById('trending-card-container');

   Products.forEach(product => {
    const productCard=document.createElement('div');
    productCard.innerHTML=`
    <div
          class="bg-white rounded-2xl shadow-sm hover:shadow-md transition duration-300 overflow-hidden"
        >
          <div class="bg-gray-100 p-4 flex items-center justify-center">
            <img
              src="${product.image}"
              class="h-56 object-contain"
            />
          </div>

          <div class="p-6">
            <div class="flex justify-between items-center mb-3">
              <span
                class="text-xs font-medium px-3 py-1 rounded-full bg-indigo-100 text-indigo-600"
              >
               ${product.category}
              </span>

              <div class="flex items-center text-sm text-gray-500">
                <i class="fa-solid fa-star text-yellow-400 mr-1"></i>
                <span> ${product.rating.rate} (${product.rating.count})</span>
              </div>
            </div>
            <h3 class="font-semibold text-gray-800 truncate mb-2">
              ${product.title.slice(0,37)}
            </h3>

            <p class="text-lg font-bold text-gray-900 mb-5"> ${product.price}</p>
            <div class="flex gap-3">
              <button
                class="flex-1 border border-gray-300 rounded-lg py-2 flex items-center justify-center gap-2 text-gray-600 hover:bg-gray-50 transition"
              >
                <i class="fa-regular fa-eye"></i>
                Details
              </button>
              <button
                class="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg py-2 flex items-center justify-center gap-2 hover:opacity-90 transition"
              >
                <i class="fa-solid fa-cart-shopping"></i>
                Add
              </button>
            </div>
          </div>
        </div>
    `
    cardContainer.append(productCard)
   });
    


}


loadProducts();
const products = [

  {
    id:1,
    name:"Red Dress",
    price:1499,
    category:"dress",
    image:"https://images.unsplash.com/photo-1496747611176-843222e1e57c"
  },

  {
    id:2,
    name:"Lipstick",
    price:499,
    category:"makeup",
    image:"https://images.unsplash.com/photo-1586495777744-4413f21062fa"
  },

  {
    id:3,
    name:"Face Cream",
    price:799,
    category:"skincare",
    image:"https://images.unsplash.com/photo-1556228578-8c89e6adf883"
  },

  {
    id:4,
    name:"Kitchen Pan",
    price:1299,
    category:"kitchen",
    image:"https://images.unsplash.com/photo-1584990347449-a8b2c2d8b7f0"
  },

  {
    id:5,
    name:"Hand Bag",
    price:999,
    category:"accessories",
    image:"https://images.unsplash.com/photo-1584917865442-de89df76afd3"
  }

];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// DISPLAY PRODUCTS

const productsContainer = document.getElementById("products");

if(productsContainer){

  displayProducts(products);

}

function displayProducts(items){

  productsContainer.innerHTML = "";

  items.forEach(product => {

    productsContainer.innerHTML += `

      <div class="product-card">

        <img src="${product.image}" alt="${product.name}">

        <div class="product-info">

          <h3>${product.name}</h3>

          <p>₹${product.price}</p>

          <button onclick="addToCart(${product.id})">
            Add To Cart
          </button>

        </div>

      </div>

    `;
  });
}

// FILTER PRODUCTS

function filterProducts(category){

  if(category === "all"){

    displayProducts(products);

  }else{

    const filtered = products.filter(product =>
      product.category === category
    );

    displayProducts(filtered);
  }
}

// SEARCH PRODUCTS

const searchInput = document.getElementById("searchInput");

if(searchInput){

  searchInput.addEventListener("keyup", () => {

    const value = searchInput.value.toLowerCase();

    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(value)
    );

    displayProducts(filtered);

  });
}

// ADD TO CART

function addToCart(id){

  const product = products.find(item => item.id === id);

  const existing = cart.find(item => item.id === id);

  if(existing){

    existing.quantity += 1;

  }else{

    cart.push({
      ...product,
      quantity:1
    });

  }

  localStorage.setItem("cart", JSON.stringify(cart));

  updateCartCount();

  alert("Product Added To Cart");

}

// UPDATE CART COUNT

function updateCartCount(){

  const cartCount = document.getElementById("cartCount");

  if(cartCount){

    const totalQty = cart.reduce((acc,item)=>{
      return acc + item.quantity;
    },0);

    cartCount.innerText = totalQty;
  }
}

updateCartCount();

// CART PAGE

const cartItems = document.getElementById("cartItems");

const cartTotal = document.getElementById("cartTotal");

if(cartItems){

  renderCart();
}

function renderCart(){

  cartItems.innerHTML = "";

  let total = 0;

  if(cart.length === 0){

    cartItems.innerHTML = `
      <h2>Your Cart Is Empty</h2>
    `;

    cartTotal.innerText = "";

    return;
  }

  cart.forEach(item => {

    total += item.price * item.quantity;

    cartItems.innerHTML += `

      <div class="cart-item">

        <div>

          <h3>${item.name}</h3>

          <p>₹${item.price}</p>

        </div>

        <div class="qty-controls">

          <button onclick="changeQty(${item.id},-1)">
            -
          </button>

          ${item.quantity}

          <button onclick="changeQty(${item.id},1)">
            +
          </button>

        </div>

      </div>

    `;
  });

  cartTotal.innerText = `Total: ₹${total}`;
}

// CHANGE QUANTITY

function changeQty(id,value){

  const item = cart.find(product => product.id === id);

  item.quantity += value;

  if(item.quantity <= 0){

    cart = cart.filter(product => product.id !== id);
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  renderCart();

  updateCartCount();
}

// CHECKOUT PAGE

const checkoutItems = document.getElementById("checkoutItems");

const checkoutTotal = document.getElementById("checkoutTotal");

if(checkoutItems){

  renderCheckout();
}

function renderCheckout(){

  checkoutItems.innerHTML = "";

  let total = 0;

  cart.forEach(item => {

    total += item.price * item.quantity;

    checkoutItems.innerHTML += `

      <div class="cart-item">

        <p>${item.name} x ${item.quantity}</p>

        <p>₹${item.price * item.quantity}</p>

      </div>

    `;
  });

  checkoutTotal.innerText = `Total: ₹${total}`;
}

// SHOW CARD FIELDS

function showCardFields(){

  document.getElementById("cardFields")
    .classList.remove("hidden");
}

// VALIDATE SHIPPING

function validateShipping(){

  const name = document.getElementById("name").value;

  const email = document.getElementById("email").value;

  const address = document.getElementById("address").value;

  const city = document.getElementById("city").value;

  const pincode = document.getElementById("pincode").value;

  if(
    name === "" ||
    email === "" ||
    address === "" ||
    city === "" ||
    pincode === ""
  ){

    alert("Please Fill All Shipping Details");

    return false;
  }

  return true;
}

// SAVE ORDER

function saveOrder(paymentMethod){

  const today = new Date();

  const delivery = new Date();

  delivery.setDate(today.getDate() + 5);

  const order = {

    items:cart,

    paymentMethod:paymentMethod,

    orderDate:today.toDateString(),

    deliveryDate:delivery.toDateString(),

    total:cart.reduce((acc,item)=>{
      return acc + item.price * item.quantity;
    },0)

  };

  localStorage.setItem(
    "latestOrder",
    JSON.stringify(order)
  );

  localStorage.removeItem("cart");

  cart = [];

}

// GOOGLE PAY UPDATED FLOW

function payWithGPay() {

  if (!validateShipping()) return;

  if (cart.length === 0) {

    alert("Cart is empty");

    return;
  }

  const total = cart.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);

  // YOUR REAL UPI ID
  const upiID = "gopikavenkatram2006@oksbi";

  // STORE NAME
  const merchantName = "GlowMart";

  // PAYMENT NOTE
  const transactionNote = "Shopping Payment";

  // ENCODED UPI LINK
  const upiLink =
    `upi://pay?pa=${encodeURIComponent(upiID)}&pn=${encodeURIComponent(merchantName)}&tn=${encodeURIComponent(transactionNote)}&am=${total}&cu=INR`;

  // CHECK MOBILE
  const isMobile =
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  if(isMobile){

    // OPEN GPAY
    window.location.href = upiLink;

  }else{

    alert(
      "Open this website on mobile for Google Pay payment."
    );

    return;
  }

  // SHOW LOADER
  const loader = document.getElementById("loader");

  loader.style.display = "block";

  // WAIT FOR PAYMENT
  setTimeout(() => {

    loader.style.display = "none";

    const success = confirm(
      "Did payment complete successfully?"
    );

    if(success){

      saveOrder("Google Pay");

      window.location.href = "success.html";

    }else{

      alert("Payment not completed");

    }

  }, 8000);

}

// CARD PAYMENT

function payWithCard(){

  if(!validateShipping()) return;

  const cardName =
    document.getElementById("cardName").value;

  const cardNumber =
    document.getElementById("cardNumber").value;

  const expiry =
    document.getElementById("expiry").value;

  const cvv =
    document.getElementById("cvv").value;

  if(
    cardName === "" ||
    cardNumber.length !== 16 ||
    expiry === "" ||
    cvv.length !== 3
  ){

    alert("Invalid Card Details");

    return;
  }

  const loader = document.getElementById("loader");

  loader.style.display = "block";

  setTimeout(()=>{

    loader.style.display = "none";

    saveOrder("Card Payment");

    window.location.href = "success.html";

  },3000);

}

// CASH ON DELIVERY

function placeCODOrder(){

  if(!validateShipping()) return;

  saveOrder("Cash On Delivery");

  window.location.href = "success.html";
}

// SUCCESS PAGE

const successDetails =
  document.getElementById("successDetails");

if(successDetails){

  const order = JSON.parse(
    localStorage.getItem("latestOrder")
  );

  if(order){

    successDetails.innerHTML = `

      <p>
        <strong>Payment Method:</strong>
        ${order.paymentMethod}
      </p>

      <br>

      <p>
        <strong>Order Date:</strong>
        ${order.orderDate}
      </p>

      <br>

      <p>
        <strong>Delivery Date:</strong>
        ${order.deliveryDate}
      </p>

      <br>

      <p>
        <strong>Total Amount:</strong>
        ₹${order.total}
      </p>

    `;
  }
}
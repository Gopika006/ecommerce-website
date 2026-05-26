let cart =
JSON.parse(localStorage.getItem("cart"))
|| [];

/* ADD TO CART */

function addToCart(name,price,image){

  let existingItem =
  cart.find(item => item.name === name);

  if(existingItem){

    existingItem.quantity += 1;

  } else {

    cart.push({
      name:name,
      price:price,
      image:image,
      quantity:1
    });

  }

  localStorage.setItem(
    "cart",
    JSON.stringify(cart)
  );

  updateCartCount();

  alert(name + " Added To Cart");
}

/* UPDATE CART COUNT */

function updateCartCount(){

  let total = 0;

  cart.forEach(item=>{

    total += item.quantity;

  });

  let cartCount =
  document.getElementById("cart-count");

  if(cartCount){

    cartCount.innerText = total;
  }
}

/* DISPLAY CART */

function displayCart(){

  let cartItems =
  document.getElementById("cart-items");

  let totalPrice = 0;

  cartItems.innerHTML = "";

  if(cart.length === 0){

    cartItems.innerHTML = `

      <div class="empty-cart">

        <h2>
          Your Cart Is Empty
        </h2>

      </div>

    `;

    document.getElementById("total-price")
    .innerText = 0;

    document.getElementById("checkout-btn")
    .disabled = true;

    return;
  }

  document.getElementById("checkout-btn")
  .disabled = false;

  cart.forEach((item,index)=>{

    let itemTotal =
    item.price * item.quantity;

    totalPrice += itemTotal;

    cartItems.innerHTML += `

      <div class="cart-product">

        <img src="${item.image}">

        <div class="cart-details">

          <h2>${item.name}</h2>

          <p>
            Price: ₹${item.price}
          </p>

          <p>
            Quantity: ${item.quantity}
          </p>

          <h3>
            Total: ₹${itemTotal}
          </h3>

          <div class="cart-buttons">

            <button
            onclick="increaseQty(${index})">
              +
            </button>

            <button
            onclick="decreaseQty(${index})">
              -
            </button>

            <button
            onclick="removeItem(${index})">
              Remove
            </button>

          </div>

        </div>

      </div>

    `;
  });

  document.getElementById("total-price")
  .innerText = totalPrice;

  updateCartCount();
}

/* INCREASE */

function increaseQty(index){

  cart[index].quantity += 1;

  localStorage.setItem(
    "cart",
    JSON.stringify(cart)
  );

  displayCart();
}

/* DECREASE */

function decreaseQty(index){

  if(cart[index].quantity > 1){

    cart[index].quantity -= 1;

  } else {

    cart.splice(index,1);
  }

  localStorage.setItem(
    "cart",
    JSON.stringify(cart)
  );

  displayCart();
}

/* REMOVE */

function removeItem(index){

  cart.splice(index,1);

  localStorage.setItem(
    "cart",
    JSON.stringify(cart)
  );

  displayCart();
}

/* SEARCH */

function searchProducts(){

  let input =
  document.getElementById("searchInput")
  .value.toLowerCase();

  let products =
  document.querySelectorAll(".product-card");

  products.forEach(product=>{

    let productName =
    product.querySelector("h3")
    .innerText.toLowerCase();

    if(productName.includes(input)){

      product.style.display = "block";

    } else {

      product.style.display = "none";
    }

  });
}

/* CHECKOUT */

function goToCheckout(){

  if(cart.length === 0){

    alert("Your Cart Is Empty");

  } else {

    window.location.href =
    "checkout.html";
  }
}

updateCartCount();
/* LOAD CHECKOUT */

function loadCheckout(){

  let checkoutItems =
  document.getElementById("checkout-items");

  let total = 0;

  checkoutItems.innerHTML = "";

  if(cart.length === 0){

    checkoutItems.innerHTML = `

      <div class="empty-cart">

        <h2>
          No Products In Checkout
        </h2>

      </div>

    `;

    return;
  }

  cart.forEach(item=>{

    let itemTotal =
    item.price * item.quantity;

    total += itemTotal;

    checkoutItems.innerHTML += `

      <div class="cart-product">

        <img src="${item.image}">

        <div class="cart-details">

          <h2>${item.name}</h2>

          <p>
            Price: ₹${item.price}
          </p>

          <p>
            Quantity: ${item.quantity}
          </p>

          <h3>
            Total: ₹${itemTotal}
          </h3>

        </div>

      </div>

    `;
  });

  document.getElementById(
    "checkout-total"
  ).innerText = total;

  updateCartCount();
}

/* PLACE ORDER */

function placeOrder(){

  let paymentMethod =
  document.querySelector(
    'input[name=\"payment\"]:checked'
  ).value;

  if(paymentMethod === "gpay"){

    let upi =
    document.getElementById("upi-id").value;

    if(upi === ""){

      alert("Enter UPI ID");

      return;
    }
  }

  let today =
  new Date();

  let delivery =
  new Date();

  delivery.setDate(
    today.getDate() + 5
  );

  localStorage.setItem(
    "orderDate",
    today.toDateString()
  );

  localStorage.setItem(
    "deliveryDate",
    delivery.toDateString()
  );

  localStorage.setItem(
    "paymentMethod",
    paymentMethod
  );

  localStorage.removeItem("cart");

  window.location.href =
  "success.html";
}
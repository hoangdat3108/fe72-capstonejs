var productList = [];
var cart = [];
function getEle(id) {
  return document.getElementById(id);
}
function getListProduct() {
  axios({
    url: "https://62bc4dda6b1401736cf762fd.mockapi.io/api/PhoneProducts",
    method: "GET",
  })
    .then(function (result) {
      renderProducts(result.data);
      productList = result.data;
    })
    .catch(function (error) {
      console.log(error);
    });
}
function renderProducts(data) {
  var contentHTML = "";
  for (var i = 0; i < data.length; i++) {
    contentHTML += `
      <div class="col-lg-3 col-sm-6 col-md-6">
      <div class="item">
      <img src="${data[i].img}"/>
        <div class="info">
          <h2>${data[i].name}</h2>
          <h3>${data[i].price}$</h3>
          <p>
            Camera trước: ${data[i].frontCamera}
            <br />
            Camera sau: ${data[i].backCamera}
            <br />
            Màn hình: ${data[i].screen}
          </p>
          <h4>Loại: ${data[i].type}</h4>
          <span> Mô tả: ${data[i].desc}</span>
          <div>
          <button onclick="addToCart(${data[i].id})">Add to cart</button>
          </div>
        </div>
      </div>
    </div>
            `;
  }
  getEle("listProduct").innerHTML = contentHTML;
}
getListProduct();

function filterProduct(value) {
  var filterList = [];
  var key = "";
  if (value === "1") {
    key = "samsung";
  } else {
    key = "iphone";
  }

  for (var i = 0; i < productList.length; i++) {
    if (productList[i].type.toLowerCase() === key) {
      filterList.push(productList[i]);
    }
  }
  renderProducts(filterList);
}
function addToCart(id) {
  for (var i = 0; i < productList.length; i++) {
    if (+productList[i].id === id) {
      var cartItem = new CartItem(productList[i], 1);
      if (!checkCartItem(cart, id)) {
        cart.push(cartItem);
      } else {
        findCartItem(id).quantity++;
      }
    }
  }
  renderCart(cart);
  saveLocalStorage();
  if (cart.length > 0) {
    getEle("cartItemNumber").style.display = "inline-block";
    getEle("cartItemNumber").innerHTML = cart.length;
  }
}
function checkCartItem(item, id) {
  for (var i = 0; i < item.length; i++) {
    if (+item[i].product.id === id) {
      return true;
    }
  }
  return false;
}
function findCartItem(id) {
  for (var i = 0; i < cart.length; i++) {
    if (+cart[i].product.id === id) {
      return cart[i];
    }
  }
  return -1;
}
function displayCart() {
  getEle("cart-info").classList.toggle("active");
  getEle("cart-info").classList.toggle("disable");
  getEle("cart-info").classList.toggle("animate__fadeInRight");
  getEle("cart-info").classList.toggle("animate__fadeOutRight");
  getEle("btn-cart").classList.toggle("disable");
  getEle("bg").classList.toggle("active");
}

function renderCart(data) {
  var contentHTML = "";
  var footer = "";
  var totalMoney = 0;
  for (var i = 0; i < data.length; i++) {
    contentHTML += `
              <tr>
                  <td>${data[i].product.name}</td>
                  <td>
                  <button onclick="excQuantity(${data[i].product.id})" id="btn-exc" class="fa-solid fa-arrow-left"></button>
                  ${data[i].quantity}
                  <button onclick="addQuantity(${data[i].product.id})" id="btn-plus" class="fa-solid fa-arrow-right"></button>
                  </td>
                  <td>${data[i].product.price}</td>
                  <td>
                  <button onclick="deleteCartItem(${data[i].product.id})" class="fa-solid fa-xmark btn-delete"></button>
                  </td>
              </tr>
          `;
    totalMoney += data[i].product.price * data[i].quantity;
  }
  footer += `
                  <div class="total-money">
                    Tổng tiền: 
                    <span>${totalMoney}</span>
                  </div>
                  <div class="payment">
                    <button onclick="payMoney()">Thanh Toán</button>
                    <button id="clear" class="disable">Clear</button>
                  </div>
  `;
  getEle("tableListCart").innerHTML = contentHTML;
  getEle("cartFooter").innerHTML = footer;
  saveLocalStorage();
}
function addQuantity(id) {
  findCartItem(id).quantity += 1;
  renderCart(cart);
  saveLocalStorage();
}
function excQuantity(id) {
  if (findCartItem(id).quantity >= 1) {
    findCartItem(id).quantity -= 1;
  } else {
    findCartItem(id).quantity -= 0;
  }
  renderCart(cart);
  saveLocalStorage();
}
function closeByOutSide() {
  getEle("btn-close").click();
}
function saveLocalStorage() {
  var cartListJSON = JSON.stringify(cart);
  localStorage.setItem("listCart", cartListJSON);
}
function getLocalStorage() {
  var cartListJSON = localStorage.getItem("listCart");
  if (cartListJSON === null) {
    return;
  }

  var cartListLocal = JSON.parse(cartListJSON);
  console.log(cartListLocal);
  cartList = mapData(cartListLocal);
  for (var i = 0; i < cartList.length; i++) {
    cart.push(cartList[i]);
  }
  renderCart(cart);
  if (cart.length > 0) {
    getEle("cartItemNumber").style.display = "inline-block";
    getEle("cartItemNumber").innerHTML = cart.length;
  }
}
function mapData(cartListLocal) {
  var result = [];
  for (var i = 0; i < cartListLocal.length; i++) {
    var currentCart = cartListLocal[i];
    var copyCart = new CartItem(currentCart.product, currentCart.quantity);
    result.push(copyCart);
  }
  return result;
}
getLocalStorage();
function payMoney() {
  getEle("btn-close").click();
  getEle("payment").classList.toggle("disable");
  getEle("bg").classList.toggle("active");
}
function confirmPayment() {
  if (cart.length > 0) {
    clearCart();
    getEle("payment").classList.toggle("disable");
    getEle("bg").classList.toggle("active");
  } else {
    alert("Không có sản phẩm ...");
    getEle("payment").classList.toggle("disable");
    getEle("bg").classList.toggle("active");
    return;
  }
}
function declinePayment() {
  getEle("payment").classList.toggle("disable");
  getEle("bg").classList.toggle("active");
}
function clearCart() {
  cart = [];
  renderCart(cart);
  getEle("cartItemNumber").style.display = "inline-block";
  getEle("cartItemNumber").innerHTML = 0;
}
function deleteCartItem(id) {
  var cartDelete = cart.indexOf(findCartItem(id));
  cart.splice(cartDelete, 1);
  renderCart(cart);
  if (cart.length > 0) {
    getEle("cartItemNumber").style.display = "inline-block";
    getEle("cartItemNumber").innerHTML = cart.length;
  } else {
    getEle("cartItemNumber").style.display = "none";
  }
}

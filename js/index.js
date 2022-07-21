var listProduct = [];
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
      listProduct = result.data;
      console.log(listProduct);
    })
    .catch(function (error) {
      console.log(error);
    });
}
function renderProducts(data) {
  var contentHTML = "";
  for (var i = 0; i < data.length; i++) {
    contentHTML += `
              <tr>
                  <td>${i + 1}</td>
                  <td>${data[i].name}</td>
                  <td>${data[i].price}</td>
                  <td>
                      <img src="${data[i].img}" width="50px"/>
                  </td>
                  <td>${data[i].desc}</td>
                  <td>
                      <button onclick="confirmDelete('${
                        data[i].id
                      }')" class="btn btn-danger">Xóa</button>
                      <button onclick="getProduct('${
                        data[i].id
                      }')" class="btn btn-info">Cập Nhật</button>
                  </td>
              </tr>
          `;
  }
  getEle("tblDanhSachSP").innerHTML = contentHTML;
}
getListProduct();

function createProduct() {
  var isValid = validateCreate();
  if (isValid === 0) return;

  var phoneName = getEle("TenSP").value;
  var phonePrice = getEle("GiaSP").value;
  var phoneImage = getEle("HinhSP").value;
  var phoneScreen = getEle("screen").value;
  var phoneBackCamera = getEle("bCamera").value;
  var phoneFrontCamera = getEle("fCamera").value;
  var phoneDescription = getEle("MoTa").value;
  var phoneType = getEle("type").value;

  var phone = new Phone(
    phoneName,
    phonePrice,
    phoneScreen,
    phoneBackCamera,
    phoneFrontCamera,
    phoneImage,
    phoneDescription,
    phoneType
  );

  axios({
    url: "https://62bc4dda6b1401736cf762fd.mockapi.io/api/PhoneProducts",
    method: "POST",
    data: phone,
  })
    .then(function (res) {
      getListProduct();
      getEle("btnCloseModal").click();
    })
    .catch(function (err) {
      console.log(err);
    });
}
function deleteProduct(id) {
  axios({
    url: "https://62bc4dda6b1401736cf762fd.mockapi.io/api/PhoneProducts/" + id,
    method: "DELETE",
  })
    .then(function (res) {
      alert("Xóa thành công");
      getListProduct();
    })
    .catch(function (err) {
      console.log(err);
    });
}
function getProduct(id) {
  axios({
    url: "https://62bc4dda6b1401736cf762fd.mockapi.io/api/PhoneProducts/" + id,
    method: "GET",
  })
    .then(function (res) {
      getEle("btnThemSP").click();
      getEle("TenSP").value = res.data.name;
      getEle("GiaSP").value = res.data.price;
      getEle("HinhSP").value = res.data.img;
      getEle("MoTa").value = res.data.desc;
      getEle("screen").value = res.data.screen;
      getEle("bCamera").value = res.data.backCamera;
      getEle("fCamera").value = res.data.frontCamera;
      getEle("type").value = res.data.type;
      getEle("productID").value = res.data.id;
      getEle("btnSaveInfo").style.display = "none";
      getEle("btnUpdate").style.display = "inline";
    })
    .catch(function (err) {
      console.log(err);
    });
}
function updateProduct() {
  var isValid = validateUpdate();
  if (isValid === 0) return;
  var phoneName = getEle("TenSP").value;
  var phonePrice = getEle("GiaSP").value;
  var phoneImage = getEle("HinhSP").value;
  var phoneScreen = getEle("screen").value;
  var phoneBackCamera = getEle("bCamera").value;
  var phoneFrontCamera = getEle("fCamera").value;
  var phoneDescription = getEle("MoTa").value;
  var phoneType = getEle("type").value;
  var productID = getEle("productID").value;
  var phone = new Phone(
    phoneName,
    phonePrice,
    phoneScreen,
    phoneBackCamera,
    phoneFrontCamera,
    phoneImage,
    phoneDescription,
    phoneType
  );
  axios({
    url:
      "https://62bc4dda6b1401736cf762fd.mockapi.io/api/PhoneProducts/" +
      productID,
    method: "PUT",
    data: phone,
  })
    .then(function (res) {
      getListProduct();
      getEle("TenSP").value = "";
      getEle("GiaSP").value = "";
      getEle("HinhSP").value = "";
      getEle("MoTa").value = "";
      getEle("screen").value = "";
      getEle("bCamera").value = "";
      getEle("fCamera").value = "";
      getEle("type").value = "";
      getEle("btnSaveInfo").style.display = "inline";
      getEle("btnUpdate").style.display = "none";
      getEle("btnCloseModal").click();
    })
    .catch(function (err) {
      console.log(err);
    });
}

function checkEmpty(value, spanID) {
  if (value.length === 0) {
    getEle(spanID).innerHTML = "* Hãy nhập dữ liệu";
    return false;
  } else {
    getEle(spanID).innerHTML = "";
    return true;
  }
}
function checkName(val, spanId) {
  var leter = /^[A-Za-z0-9 -]*$/;
  if (val.match(leter)) {
    document.getElementById(spanId).innerHTML = "";
    return true;
  }
  document.getElementById(spanId).innerHTML =
    "* Vui lòng nhập đúng định dạng tên gồm Kí tự và Số (nếu có)";
  return false;
}
function checkPrice(val, spanId) {
  var leter = /^[0-9]+$/;
  if (val.match(leter)) {
    document.getElementById(spanId).innerHTML = "";
    return true;
  }
  document.getElementById(spanId).innerHTML =
    "* Vui lòng nhập đúng định dạng số";
  return false;
}
function checkNameExist(name, spanID) {
  for (var i = 0; i < listProduct.length; i++) {
    if (name === listProduct[i].name) {
      getEle(spanID).innerHTML = "* Tên đã tồn tại";
      return false;
    }
  }
  return true;
}
function validateCreate() {
  var isValid = true;
  var phoneName = getEle("TenSP").value;
  var phonePrice = getEle("GiaSP").value;
  var phoneImage = getEle("HinhSP").value;
  var phoneType = getEle("type").value;
  isValid &=
    checkEmpty(phoneName, "spanName") &&
    checkName(phoneName, "spanName") &&
    checkNameExist(phoneName, "spanName");
  isValid &=
    checkEmpty(phonePrice, "spanPrice") && checkPrice(phonePrice, "spanPrice");
  isValid &= checkEmpty(phoneImage, "spanImage");
  isValid &= checkEmpty(phoneType, "spanType");
  return isValid;
}
function validateUpdate() {
  var isValid = true;
  var phoneName = getEle("TenSP").value;
  var phonePrice = getEle("GiaSP").value;
  var phoneImage = getEle("HinhSP").value;
  var phoneType = getEle("type").value;
  isValid &=
    checkEmpty(phoneName, "spanName") && checkName(phoneName, "spanName");
  isValid &=
    checkEmpty(phonePrice, "spanPrice") && checkPrice(phonePrice, "spanPrice");
  isValid &= checkEmpty(phoneImage, "spanImage");
  isValid &= checkEmpty(phoneType, "spanType");
  return isValid;
}
function clearData() {
  getEle("TenSP").value = "";
  getEle("GiaSP").value = "";
  getEle("HinhSP").value = "";
  getEle("MoTa").value = "";
  getEle("screen").value = "";
  getEle("bCamera").value = "";
  getEle("fCamera").value = "";
  getEle("type").value = "";
  getEle("spanName").innerHTML = "";
  getEle("spanPrice").innerHTML = "";
  getEle("spanImage").innerHTML = "";
  getEle("spanType").innerHTML = "";
}

function confirmDelete(id) {
  var c = confirm("Bạn chắc chắn muốn xóa ?");
  if (c) {
    deleteProduct(id);
  } else {
    return;
  }
}

let items = [];

function addItem() {
  const name = document.getElementById('itemName').value.trim();
  const qty = parseFloat(document.getElementById('itemQty').value);
  const price = parseFloat(document.getElementById('itemPrice').value);
  const discount = parseFloat(document.getElementById('itemDiscount').value) || 0;

  if (!name || qty <= 0 || price <= 0) {
    alert("Please fill all fields correctly.");
    return;
  }

  const discountedPrice = price - (price * (discount / 100));
  const total = discountedPrice * qty;

  const item = { name, qty, price, discount, total };
  items.push(item);
  updateTable();
  clearItemInputs();
}

function updateTable() {
  const tbody = document.querySelector("#itemsTable tbody");
  tbody.innerHTML = "";
  let grandTotal = 0;

  items.forEach((item, index) => {
    grandTotal += item.total;
    const row = `
      <tr>
        <td>${item.name}</td>
        <td>${item.qty}</td>
        <td>₹${item.price.toFixed(2)}</td>
        <td>${item.discount}%</td>
        <td>₹${item.total.toFixed(2)}</td>
        <td><button onclick="removeItem(${index})">Remove</button></td>
      </tr>
    `;
    tbody.innerHTML += row;
  });

  document.getElementById("grandTotal").innerText = grandTotal.toFixed(2);
}

function clearItemInputs() {
  document.getElementById("itemName").value = "";
  document.getElementById("itemQty").value = "";
  document.getElementById("itemPrice").value = "";
  document.getElementById("itemDiscount").value = "0";
}

function removeItem(index) {
  items.splice(index, 1);
  updateTable();
}

function generateBill() {
  if (items.length === 0) {
    alert("Please add at least one item.");
    return;
  }

  const customerName = document.getElementById("customerName").value.trim();
  const customerPhone = document.getElementById("customerPhone").value.trim();
  const paymentMode = document.getElementById("paymentMode").value;

  if (!customerName || !customerPhone) {
    alert("Please fill customer details.");
    return;
  }

  const date = new Date().toLocaleDateString();
  const invoiceNo = getInvoiceNumber();

  let grandTotal = 0;
  let itemRows = "";
  items.forEach((item, index) => {
    const amount = item.total.toFixed(2);
    itemRows += `
      <div style="display:flex; margin-bottom:6px; font-size:26px;">
        <div style="width:10%;">${index + 1}</div>
        <div style="width:40%;">${item.name}</div>
        <div style="width:10%; text-align:center;">${item.qty}</div>
        <div style="width:25%; text-align:center;">₹${item.price.toFixed(2)}</div>
        <div style="width:15%; text-align:right;">₹${amount}</div>
      </div>
    `;
    grandTotal += item.total;
  });

  const billHTML = `
    <div style="
      background-image: url('1.jpg');
      background-size: cover;
      width: 794px;
      height: 1123px;
      padding: 250px 60px 120px 60px;
      box-sizing: border-box;
      font-family: Arial, sans-serif;
      position: relative;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    ">
      <div style="position: absolute; top: 350px; left: 160px; font-size: 19px;">${invoiceNo}</div>
      <div style="position: absolute; top: 350px; right: 70px; font-size: 19px;">${date}</div>
      <div style="position: absolute; top: 385px; left: 105px; font-size: 26px;">${customerName}</div>
      <div style="position: absolute; top: 425px; left: 120px; font-size: 26px;">${customerPhone}</div>

      <div style="margin-top: 300px; font-size: 26px;">
        <div style="display:flex; font-weight:bold; margin-bottom: 6px;">
          <div style="width:10%;">S.No</div>
          <div style="width:40%;">Particulars</div>
          <div style="width:10%; text-align:center;">Qty</div>
          <div style="width:25%; text-align:center;">Rate</div>
          <div style="width:15%; text-align:right;">Amount</div>
        </div>
        ${itemRows}
      </div>

      <div style="position: absolute; bottom: 45px; right: 340px; font-size: 26px; font-weight:bold;">Total</div>
      <div style="position: absolute; bottom: 45px; right: 140px; font-size: 26px; font-weight:bold;">₹${grandTotal.toFixed(2)}</div>
      <div style="position: absolute; bottom: 45px; left: 200px; font-size: 26px; font-weight:bold;">Signature</div>
    </div>
  `;

  document.getElementById("billContent").innerHTML = billHTML;
  document.getElementById("billSection").style.display = "block";

  saveBillToStorage({
    invoiceNo,
    date,
    customerName,
    customerPhone,
    paymentMode,
    items,
    grandTotal: grandTotal.toFixed(2)
  });

  items = [];
  updateTable();
  document.getElementById("customerName").value = "";
  document.getElementById("customerPhone").value = "";

  // ✅ Print after rendering — slight delay to ensure DOM updates
  setTimeout(() => {
    window.print();
  }, 300);
}


function getInvoiceNumber() {
  let last = parseInt(localStorage.getItem("lastInvoice")) || 1000;
  last += 1;
  localStorage.setItem("lastInvoice", last);
  return last;
}

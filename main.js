if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register(new URL('/service-worker.js', import.meta.url))
    .then(registration => {
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    })
    .catch(error => {
      console.log('ServiceWorker registration failed: ', error);
    });
}


const orderForm = document.getElementById("orderForm");
const orderList = document.getElementById("orderList");
const totalChiliColoradoElement = document.getElementById("totalChiliColorado");
const totalPeppersCheeseElement = document.getElementById("totalPeppersCheese");

let orders = JSON.parse(localStorage.getItem("orders")) || [];

function createOrderItem(order) {
  const orderItem = document.createElement("div");
  orderItem.classList.add("order-item");
  orderItem.dataset.id = order.id;

  orderItem.innerHTML = `
    <p><strong>Pickup Date:</strong> ${order.pickupDate}</p>
    <p><strong>Pickup Time:</strong> ${formatTime(order.pickupTime)}</p>
    <p><strong>Chili Colorado:</strong> ${order.coloradoAmount} amount (${
    order.coloradoTemperature
  })</p>
    <p><strong>Peppers and Cheese:</strong> ${order.cheeseAmount} amount (${
    order.cheeseTemperature
  })</p>
    <p><strong>Customer Name:</strong> ${order.customerName}</p>
    <p><strong>Phone Number:</strong> ${order.phoneNumber}</p>
    <label>
      <input type="checkbox" ${
        order.fulfilled ? "checked" : ""
      } onchange="toggleFulfilled(${order.id})">
      <span class="fulfilled-label">Picked Up</span>
    </label>
    <button class="delete-btn" onclick="deleteOrder(${
      order.id
    })">Delete</button>
  `;

  return orderItem;
}

function renderOrders() {
  orderList.innerHTML = "";
  let totalChiliColorado = 0;
  let totalPeppersCheese = 0;

  orders.forEach((order) => {
    const orderItem = createOrderItem(order);
    orderList.appendChild(orderItem);

    totalChiliColorado += order.coloradoAmount;
    totalPeppersCheese += order.cheeseAmount;
  });

  totalChiliColoradoElement.textContent = `Total Chili Colorado Ordered: ${totalChiliColorado}`;
  totalPeppersCheeseElement.textContent = `Total Peppers and Cheese Ordered: ${totalPeppersCheese}`;
}

function formatTime(timeString) {
  const [hours, minutes] = timeString.split(":");
  const period = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  return `${formattedHours}:${minutes} ${period}`;
}

function handleSubmit(event) {
  event.preventDefault();
  const newOrder = {
    id: orders.length > 0 ? orders[orders.length - 1].id + 1 : 1,
    pickupDate: document.getElementById("pickupDate").value,
    pickupTime: document.getElementById("pickupTime").value,
    coloradoAmount: parseInt(
      document.getElementById("coloradoAmount").value,
      10
    ),
    coloradoTemperature: document.getElementById("coloradoTemperature").value,
    cheeseAmount: parseInt(document.getElementById("cheeseAmount").value, 10),
    cheeseTemperature: document.getElementById("cheeseTemperature").value,
    customerName: document.getElementById("customerName").value,
    phoneNumber: document.getElementById("phoneNumber").value,
    fulfilled: false,
  };
  orders.push(newOrder);
  localStorage.setItem("orders", JSON.stringify(orders));
  renderOrders();
  orderForm.reset();
}

function deleteOrder(orderId) {
  orders = orders.filter((order) => order.id !== orderId);
  localStorage.setItem("orders", JSON.stringify(orders));
  renderOrders();
}

function toggleFulfilled(orderId) {
  const order = orders.find((order) => order.id === orderId);
  if (order) {
    order.fulfilled = !order.fulfilled;
    localStorage.setItem("orders", JSON.stringify(orders));
    renderOrders();
  }
}

orderForm.addEventListener("submit", handleSubmit);

renderOrders();

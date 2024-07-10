// Check if service worker is supported and register it
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(registration => {
      console.log('ServiceWorker registration successful with scope:', registration.scope);
    })
    .catch(error => {
      console.error('ServiceWorker registration failed:', error);
    });
}

// DOM elements
const orderForm = document.getElementById("orderForm");
const orderList = document.getElementById("orderList");
const totalChiliColoradoElement = document.getElementById("totalChiliColorado");
const totalPeppersCheeseElement = document.getElementById("totalPeppersCheese");

// Initialize orders array from localStorage or start empty
let orders = JSON.parse(localStorage.getItem("orders")) || [];

// Function to create an order item HTML element
function createOrderItem(order) {
  const orderItem = document.createElement("div");
  orderItem.classList.add("order-item");
  orderItem.dataset.id = order.id;

  orderItem.innerHTML = `
    <p><strong>Pickup Date:</strong> ${order.pickupDate}</p>
    <p><strong>Pickup Time:</strong> ${formatTime(order.pickupTime)}</p>
    <p><strong>Chili Colorado:</strong> ${order.coloradoAmount} amount (${order.coloradoTemperature})</p>
    <p><strong>Peppers and Cheese:</strong> ${order.cheeseAmount} amount (${order.cheeseTemperature})</p>
    <p><strong>Customer Name:</strong> ${order.customerName}</p>
    <p><strong>Phone Number:</strong> ${order.phoneNumber}</p>
    <label>
      <input type="checkbox" ${order.fulfilled ? "checked" : ""} onchange="toggleFulfilled(${order.id})">
      <span class="fulfilled-label">Picked Up</span>
    </label>
    <button class="delete-btn" data-id="${order.id}">Delete</button>
  `;

  return orderItem;
}

// Function to render all orders in the UI
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

// Function to format time in AM/PM format
function formatTime(timeString) {
  const [hours, minutes] = timeString.split(":");
  const period = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  return `${formattedHours}:${minutes} ${period}`;
}

// Function to handle form submission and add new order
function handleSubmit(event) {
  event.preventDefault();
  const newOrder = {
    id: orders.length > 0 ? orders[orders.length - 1].id + 1 : 1,
    pickupDate: document.getElementById("pickupDate").value,
    pickupTime: document.getElementById("pickupTime").value,
    coloradoAmount: parseInt(document.getElementById("coloradoAmount").value, 10),
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

// Function to delete an order by ID
function deleteOrder(orderId) {
  orders = orders.filter((order) => order.id !== orderId);
  localStorage.setItem("orders", JSON.stringify(orders));
  renderOrders();
}

// Function to toggle fulfillment status of an order by ID
function toggleFulfilled(orderId) {
  const order = orders.find((order) => order.id === orderId);
  if (order) {
    order.fulfilled = !order.fulfilled;
    localStorage.setItem("orders", JSON.stringify(orders));
    renderOrders();
  }
}

// Event listener for form submission
orderForm.addEventListener("submit", handleSubmit);

// Event delegation for delete and toggle fulfilled actions
orderList.addEventListener("click", (event) => {
  if (event.target.classList.contains("delete-btn")) {
    const orderId = parseInt(event.target.dataset.id, 10);
    deleteOrder(orderId);
  }

  if (event.target.type === "checkbox") {
    const orderId = parseInt(event.target.parentElement.parentElement.dataset.id, 10);
    toggleFulfilled(orderId);
  }
});

// Initial rendering of orders on page load
renderOrders();

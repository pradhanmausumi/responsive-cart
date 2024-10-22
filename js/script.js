document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889';
    const cartItemsContainer = document.getElementById('cart-items');
    const cartSubtotalElement = document.getElementById('cart-subtotal');
    const cartTotalElement = document.getElementById('cart-total');
    let cartItems = [];

    // Fetch cart data
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            cartItems = data.items;
            renderCartItems();
            calculateTotals();
        })
        .catch(error => console.error('Error fetching cart data:', error));

    // Render cart items
    function renderCartItems() {
        cartItemsContainer.innerHTML = ''; // Clear previous items
        cartItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('item');
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.title}">
                <div class="item-details">
                    <h4>${item.title}</h4>
                    <p>Price: ₹${(item.price / 100).toFixed(2)}</p>
                    <input type="number" value="${item.quantity}" min="1" class="item-quantity" data-id="${item.id}">
                    <p>Subtotal: ₹<span class="item-subtotal">${(item.line_price / 100).toFixed(2)}</span></p>
                    <button class="remove-item" data-id="${item.id}">Remove</button>
                </div>
            `;
            cartItemsContainer.appendChild(itemElement);
        });

        // Add event listeners for quantity update and remove buttons
        document.querySelectorAll('.item-quantity').forEach(input => {
            input.addEventListener('change', updateQuantity);
        });

        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', removeItem);
        });
    }

    // Update item quantity
    function updateQuantity(event) {
        const itemId = event.target.getAttribute('data-id');
        const newQuantity = event.target.value;
        const item = cartItems.find(item => item.id == itemId);
        item.quantity = newQuantity;
        item.line_price = item.price * newQuantity;

        renderCartItems();
        calculateTotals();
    }

    // Remove item from cart
    function removeItem(event) {
        const itemId = event.target.getAttribute('data-id');
        cartItems = cartItems.filter(item => item.id != itemId);

        renderCartItems();
        calculateTotals();
    }

    // Calculate totals
    function calculateTotals() {
        let subtotal = 0;
        cartItems.forEach(item => {
            subtotal += item.line_price;
        });

        cartSubtotalElement.textContent = (subtotal / 100).toFixed(2);
        cartTotalElement.textContent = (subtotal / 100).toFixed(2); // Assuming no tax or discounts for now
    }
});

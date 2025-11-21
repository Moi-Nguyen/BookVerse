document.addEventListener('DOMContentLoaded', () => {
    const printButton = document.getElementById('printOrderBtn');
    const chatLink = document.getElementById('openChatLink');

    if (printButton) {
        printButton.addEventListener('click', () => {
            window.print();
        });
    }

    if (chatLink) {
        chatLink.addEventListener('click', (event) => {
            event.preventDefault();
            openChatWidget();
        });
    }

    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('orderId');

    if (orderId) {
        loadOrderDetails(orderId);
    }
});

function loadOrderDetails(orderId) {
    // Placeholder: replace with API integration
    // e.g., fetch(`/api/orders/${orderId}`).then(...)
    console.log('Loading order details for:', orderId);
}

function openChatWidget() {
    // Placeholder for chat widget integration
    alert('Chat widget sẽ được mở ở đây');
}


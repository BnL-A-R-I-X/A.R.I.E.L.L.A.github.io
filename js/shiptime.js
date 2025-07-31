function updateShipTime() {
    const now = new Date();
    const shipTimeElement = document.getElementById("shipTime");
    if (shipTimeElement) {
        shipTimeElement.textContent = now.toUTCString().replace("GMT", "UTC");
    }
}

// Initialize ship time updates
function initShipTime() {
    updateShipTime();
    setInterval(updateShipTime, 1000);
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initShipTime);

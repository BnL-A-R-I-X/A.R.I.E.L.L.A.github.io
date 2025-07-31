/**
 * Simple Lightbox Viewer
 * Opens clicked gallery image in a fullscreen overlay.
 */

document.addEventListener('DOMContentLoaded', () => {
    function openLightbox(src, alt) {
        let lightbox = document.getElementById("lightbox");
        if (!lightbox) {
            lightbox = document.createElement("div");
            lightbox.id = "lightbox";
            lightbox.innerHTML = `
                <div class="lightbox-content">
                    <img>
                    <span id="close-lightbox">&times;</span>
                </div>
            `;
            document.body.appendChild(lightbox);

            document.getElementById("close-lightbox").addEventListener("click", () => {
                lightbox.classList.remove("active");
            });
            
            // Close on click outside image
            lightbox.addEventListener("click", (e) => {
                if (e.target === lightbox) {
                    lightbox.classList.remove("active");
                }
            });
        }

        const img = lightbox.querySelector("img");
        img.src = src;
        img.alt = alt;
        lightbox.classList.add("active");
    }

    document.querySelectorAll('.gallery-grid img').forEach(image => {
        image.addEventListener('click', () => {
            openLightbox(image.src, image.alt);
        });
    });
});

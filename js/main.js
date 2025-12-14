
//DOM content 
document.addEventListener("DOMContentLoaded", () => {

    /* ================= SLIDER BANNIÈRE ================= */

    const slides = document.querySelectorAll(".slide");
    const rightArrow = document.querySelector(".arrow.right");
    const leftArrow = document.querySelector(".arrow.left");

    let slideIndex = 0;

    if (slides.length && rightArrow && leftArrow) {

        const showSlide = (i) => {
            slides.forEach(slide => slide.classList.remove("active"));
            slides[i].classList.add("active");
        };

        rightArrow.addEventListener("click", () => {
            slideIndex = (slideIndex + 1) % slides.length;
            showSlide(slideIndex);
        });

        leftArrow.addEventListener("click", () => {
            slideIndex = (slideIndex - 1 + slides.length) % slides.length;
            showSlide(slideIndex);
        });
    }


    /* ================= PREVIEW IMAGES À PROPOS ================= */

    const aboutImages = document.querySelectorAll(".about-images img");
    const preview = document.getElementById("imagePreview");
    const previewImg = document.getElementById("previewImg");

    if (aboutImages.length && preview && previewImg) {

        aboutImages.forEach(img => {
            img.addEventListener("click", () => {
                previewImg.src = img.src;
                preview.style.display = "flex";
            });
        });

        preview.addEventListener("click", () => {
            preview.style.display = "none";
        });
    }




    const cartBtn = document.getElementById("cart-btn");
    const cart = document.getElementById("cart");
    const cartItemsContainer = document.querySelector(".cart-items");
    const cartTotal = document.getElementById("cartTotal");
    const clearCartBtn = document.getElementById("clearCart");
    const checkoutBtn = document.getElementById("checkoutBtn");

    const orderModal = document.getElementById("orderModal");
    const validateOrder = document.getElementById("validateOrder");

    let cartItems = JSON.parse(localStorage.getItem("cart")) || [];

    // ouvrir / fermer panier
    if (cart && cartBtn) {

        cartBtn.addEventListener("click", (e) => {
            e.stopPropagation(); // important
            cart.classList.toggle("active");
        });

        // empêcher fermeture quand on clique dans le panier
        cart.addEventListener("click", (e) => {
            e.stopPropagation();
        });

        // fermer au clic extérieur
        document.addEventListener("click", () => {
            if (cart.classList.contains("active")) {
                cart.classList.remove("active");
            }
        });

        // fermer au scroll
        window.addEventListener("scroll", () => {
            if (cart.classList.contains("active")) {
                cart.classList.remove("active");
            }
        });
    }



    // ajouter produit
    document.querySelectorAll(".add-to-cart").forEach(btn => {
        btn.addEventListener("click", () => {
            const card = btn.closest(".menu-card");

            const name = card.querySelector("h3").innerText;
            const img = card.querySelector("img").src;

            // extraction sûre du prix
            const priceText = card.querySelector(".price").innerText;
            const price = Number(priceText.replace(/[^0-9]/g, ""));

            const existing = cartItems.find(i => i.name === name);

            if (existing) {
                existing.qty++;
            } else {
                cartItems.push({ name, img, price, qty: 1 });
            }

            saveAndUpdate();
            cart.classList.add("active");
        });
    });



    /* ================= FILTRAGE MENU ================= */

    const filterButtons = document.querySelectorAll(".menu-filters button");
    const menuCards = document.querySelectorAll(".menu-card");

    if (filterButtons.length && menuCards.length) {

        filterButtons.forEach(button => {
            button.addEventListener("click", () => {

                const category = button.getAttribute("data-category");

                // CAS "TOUS"
                if (category === "all") {
                    menuCards.forEach(card => {
                        card.classList.remove("hide");
                    });
                    return;
                }

                // AUTRES CATÉGORIES
                menuCards.forEach(card => {
                    if (card.getAttribute("data-category") === category) {
                        card.classList.remove("hide");
                    } else {
                        card.classList.add("hide");
                    }
                });

            });
        });

    }


    // mise à jour panier
    function saveAndUpdate() {
        localStorage.setItem("cart", JSON.stringify(cartItems));
        updateCart();
    }

    function updateCart() {
        cartItemsContainer.innerHTML = "";
        let total = 0;

        cartItems.forEach((item, index) => {
            total += item.price * item.qty;

            const div = document.createElement("div");
            div.className = "cart-item";

            div.innerHTML = `
            <img src="${item.img}" alt="${item.name}">
            <div class="cart-info">
                
                <strong class="cart-item-name">${item.name}</strong>

                <div class="qty-price-row">
    <span class="item-price">${item.price} DT</span>

    <div class="qty-controls">
        <i class="fas fa-minus qty-minus" data-index="${index}"></i>
        <span class="qty-number">${item.qty}</span>
        <i class="fas fa-plus qty-plus" data-index="${index}"></i>
    </div>
</div>
            </div>

            <i class="fas fa-trash cart-remove" data-index="${index}"></i>
        `;

            cartItemsContainer.appendChild(div);
        });

        cartTotal.textContent = total;
    }
    cartItemsContainer.addEventListener("click", (e) => {
        const index = e.target.dataset.index;
        if (index === undefined) return;

        // PLUS
        if (e.target.classList.contains("qty-plus")) {
            cartItems[index].qty++;
            saveAndUpdate();
        }

        // MOINS
        if (e.target.classList.contains("qty-minus")) {
            if (cartItems[index].qty > 1) {
                cartItems[index].qty--;
            } else {
                cartItems.splice(index, 1);
            }
            saveAndUpdate();
        }

        // SUPPRIMER
        if (e.target.classList.contains("cart-remove")) {
            cartItems.splice(index, 1);
            saveAndUpdate();
        }
    });



    updateCart();

    // vider panier
    clearCartBtn.addEventListener("click", () => {
        cartItems = [];
        saveAndUpdate();
    });



    // valider commande
    validateOrder.addEventListener("click", () => {
        alert("Commande envoyée avec succès !");
        cartItems = [];
        saveAndUpdate();
        orderModal.classList.remove("active");
        cart.classList.remove("active");
    });


});

    /* ================= CONTACT : MODAL MERCI ================= */
    document.addEventListener("DOMContentLoaded", function () {

        const form = document.getElementById("contactForm");
        const modal = document.getElementById("thankModal");

        if (!form || !modal) {
            console.log("FORM ou MODAL introuvable");
            return;
        }

        form.addEventListener("submit", function (e) {
            e.preventDefault();
            modal.style.display = "flex";
            console.log("MODAL AFFICHÉ");
            form.reset();
        });

        modal.addEventListener("click", function () {
            modal.style.display = "none";
        });

    });

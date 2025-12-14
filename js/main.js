document.addEventListener("DOMContentLoaded", () => {

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
    if (cartBtn) {
        cartBtn.addEventListener("click", () => {
            cart.classList.toggle("active");
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
            <img src="${item.img}">
            <div style="flex:1">
                <strong>${item.name}</strong><br>
                ${item.qty} × ${item.price} DT
            </div>
            <span class="cart-remove" data-index="${index}">
                <i class="fas fa-trash"></i>
            </span>
        `;

            cartItemsContainer.appendChild(div);
        });

        cartTotal.textContent = total;

        // activer suppression individuelle
        document.querySelectorAll(".cart-remove").forEach(btn => {
            btn.addEventListener("click", () => {
                const i = btn.getAttribute("data-index");
                cartItems.splice(i, 1);
                saveAndUpdate();
            });
        });
    }


    updateCart();

    // vider panier
    clearCartBtn.addEventListener("click", () => {
        cartItems = [];
        saveAndUpdate();
    });

    // passer commande
    checkoutBtn.addEventListener("click", () => {
        if (cartItems.length === 0) {
            alert("Votre panier est vide");
        } else {
            orderModal.classList.add("active");
        }
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

// ======================================================
// IFFAH SHOP - SCRIPT.JS
// PART 1 / 4
// Firebase + Global Data + Basic Functions
// ======================================================

console.log("🔥 Firebase SDK Loaded");

// ======================================================
// GLOBAL PRODUCTS
// ======================================================

let products = [];


// ======================================================
// GLOBAL CART
// ======================================================

let cart = [];

try {

    cart =
        JSON.parse(
            localStorage.getItem("cart")
        ) || [];

} catch (error) {

    console.error(
        "❌ Cart Load Error:",
        error
    );

    cart = [];
}


// ======================================================
// FIREBASE DATABASE CHECK
// ======================================================

if (
    typeof db === "undefined" ||
    !db
) {

    console.error(
        "❌ Firebase Database পাওয়া যাচ্ছে না!"
    );

} else {

    console.log(
        "🔥 Firebase Database Ready"
    );

}


// ======================================================
// CART SAVE
// ======================================================

function saveCart() {

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

}


// ======================================================
// CART COUNT
// ======================================================

function updateCartCount() {

    const cartCount =
        document.getElementById("cart-count");

    if (!cartCount) {
        return;
    }

    cartCount.textContent =
        cart.length;

}


// ======================================================
// ADD TO CART
// ======================================================

function addToCart(
    name,
    price,
    image = "",
    id = ""
) {

    const product = {

        id: id,

        name: name,

        price: Number(price) || 0,

        image: image || ""

    };

    cart.push(product);

    saveCart();

    updateCartCount();

    console.log(
        "🛒 Cart-এ Product Added:",
        product
    );

    alert(
        "✅ Product Cart-এ যোগ হয়েছে"
    );

}


// ======================================================
// REMOVE FROM CART
// ======================================================

function removeFromCart(index) {

    if (
        index < 0 ||
        index >= cart.length
    ) {

        return;

    }

    cart.splice(index, 1);

    saveCart();

    updateCartCount();

    console.log(
        "🗑️ Cart থেকে Product Remove হয়েছে"
    );

}


// ======================================================
// CLEAR CART
// ======================================================

function clearCart() {

    cart = [];

    saveCart();

    updateCartCount();

    console.log(
        "🗑️ Cart পরিষ্কার করা হয়েছে"
    );

}


// ======================================================
// CART TOTAL
// ======================================================

function getCartTotal() {

    let total = 0;

    cart.forEach(function (item) {

        total +=
            Number(item.price) || 0;

    });

    return total;

}


// ======================================================
// PAGE LOAD
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "🚀 IFFAH Shop Script Ready"
        );

        updateCartCount();

    }
);

// ======================================================
// IFFAH SHOP - SCRIPT.JS
// PART 2 / 4
// FIREBASE PRODUCT SYSTEM
// ======================================================


// ======================================================
// LOAD PRODUCTS FROM FIREBASE
// ======================================================

async function loadProductsFromFirebase() {

    try {

        console.log(
            "🔥 Firebase থেকে Product Load শুরু..."
        );

        if (
            typeof db === "undefined" ||
            !db
        ) {

            console.error(
                "❌ Firebase Database পাওয়া যাচ্ছে না"
            );

            return;

        }

        const snapshot =
            await db
                .collection("products")
                .get();

        products = [];

        snapshot.forEach(function (doc) {

            const data = doc.data();

            products.push({

                id: doc.id,

                name:
                    data.name || "",

                price:
                    Number(data.price) || 0,

                category:
                    data.category || "",

                image:
                    data.image || "",

                description:
                    data.description || "",

                createdAt:
                    data.createdAt || ""

            });

        });

        console.log(
            "🔥 Firebase থেকে Product Load হয়েছে:",
            products.length
        );

        console.log(
            "📦 Products:",
            products
        );

        // Product দেখানোর Function
        displayProducts(products);

    } catch (error) {

        console.error(
            "❌ Firebase Product Load Error:",
            error
        );

    }

}


// ======================================================
// DISPLAY PRODUCTS
// ======================================================

function displayProducts(productList) {

    console.log(
        "📦 Product Display শুরু:",
        productList.length
    );

    const containers = [

        document.getElementById("productList"),

        document.getElementById("products"),

        document.getElementById("productGrid"),

        document.getElementById("productsGrid")

    ];

    let container = null;

    for (
        let i = 0;
        i < containers.length;
        i++
    ) {

        if (containers[i]) {

            container = containers[i];

            break;

        }

    }

    if (!container) {

        console.log(
            "ℹ️ Product Container এই Page-এ নেই"
        );

        return;

    }

    container.innerHTML = "";

    if (!productList.length) {

        container.innerHTML = `
            <div class="no-products">
                <p>📦 এখনো কোনো Product নেই</p>
            </div>
        `;

        return;

    }

    productList.forEach(function (product) {

        const card =
            document.createElement("div");

        card.className =
            "product-card";

        const image =
            product.image ||
            "images/no-image.png";

        card.innerHTML = `

            <img
                src="${image}"
                alt="${product.name}"
                class="product-image"
                onerror="this.style.display='none'"
            >

            <div class="product-info">

                <h3>
                    ${product.name}
                </h3>

                <p>
                    ${product.description || ""}
                </p>

                <strong>
                    ৳${product.price}
                </strong>

                <button
                    class="btn"
                    onclick="
                        addToCart(
                            '${escapeQuotes(product.name)}',
                            ${product.price},
                            '${escapeQuotes(product.image || "")}',
                            '${product.id}'
                        )
                    "
                >
                    🛒 Cart-এ যোগ করুন
                </button>

            </div>

        `;

        container.appendChild(card);

    });

}


// ======================================================
// ESCAPE QUOTES
// ======================================================

function escapeQuotes(text) {

    return String(text)
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'");

}


// ======================================================
// LOAD PRODUCTS WHEN PAGE OPENS
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadProductsFromFirebase();

    }
);

// ======================================================
// IFFAH SHOP - SCRIPT.JS
// PART 3 / 4
// CART + CHECKOUT + FIREBASE ORDER
// ======================================================


// ======================================================
// DISPLAY CART
// ======================================================

function displayCart() {

    const cartContainer =
        document.getElementById("cartItems");

    if (!cartContainer) {
        return;
    }

    cartContainer.innerHTML = "";

    if (!cart.length) {

        cartContainer.innerHTML = `
            <div class="no-products">
                <h3>🛒 আপনার Cart খালি</h3>
                <p>Product যোগ করে আবার আসুন।</p>
            </div>
        `;

        updateCartTotal();

        return;
    }


    cart.forEach(function (item, index) {

        const itemDiv =
            document.createElement("div");

        itemDiv.className =
            "cart-item";

        itemDiv.innerHTML = `

            <div>

                <h3>
                    ${item.name}
                </h3>

                <p>
                    মূল্য: ৳${Number(item.price) || 0}
                </p>

            </div>

            <button
                class="btn"
                onclick="removeFromCart(${index})"
            >
                🗑️ Remove
            </button>

        `;

        cartContainer.appendChild(itemDiv);

    });

    updateCartTotal();

}


// ======================================================
// UPDATE CART TOTAL
// ======================================================

function updateCartTotal() {

    const total =
        getCartTotal();

    const totalElements = [

        document.getElementById("cartTotal"),

        document.getElementById("total"),

        document.getElementById("totalAmount")

    ];

    totalElements.forEach(function (element) {

        if (element) {

            element.textContent =
                "৳" + total;

        }

    });

}


// ======================================================
// CHECKOUT - FIREBASE ORDER SAVE
// ======================================================

function setupCheckout() {

    const checkoutForm =
        document.getElementById("checkoutForm");

    if (!checkoutForm) {

        return;

    }

    console.log(
        "🛒 Checkout Form Ready"
    );


    checkoutForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            console.log(
                "🚀 Order Submit শুরু..."
            );


            // ------------------------------------------
            // CUSTOMER INFORMATION
            // ------------------------------------------

            const name =
                document
                    .getElementById("name")
                    ?.value
                    .trim() || "";

            const phone =
                document
                    .getElementById("phone")
                    ?.value
                    .trim() || "";

            const address =
                document
                    .getElementById("address")
                    ?.value
                    .trim() || "";

            const payment =
                document
                    .getElementById("payment")
                    ?.value || "";


            // ------------------------------------------
            // VALIDATION
            // ------------------------------------------

            if (
                !name ||
                !phone ||
                !address ||
                !payment
            ) {

                alert(
                    "⚠️ অনুগ্রহ করে সব তথ্য পূরণ করুন।"
                );

                return;

            }


            // ------------------------------------------
            // CART CHECK
            // ------------------------------------------

            if (!cart.length) {

                alert(
                    "⚠️ আপনার Cart খালি।"
                );

                return;

            }


            // ------------------------------------------
            // TOTAL
            // ------------------------------------------

            const total =
                getCartTotal();


            // ------------------------------------------
            // ORDER OBJECT
            // ------------------------------------------

            const order = {

                customerName:
                    name,

                phone:
                    phone,

                address:
                    address,

                paymentMethod:
                    payment,

                products:
                    cart,

                totalAmount:
                    total,

                status:
                    "Pending",

                createdAt:
                    firebase.firestore
                        .FieldValue
                        .serverTimestamp()

            };


            console.log(
                "📦 Order Data:",
                order
            );


            // ------------------------------------------
            // SAVE TO FIRESTORE
            // ------------------------------------------

            try {

                if (
                    typeof db === "undefined" ||
                    !db
                ) {

                    throw new Error(
                        "Firebase Database পাওয়া যাচ্ছে না"
                    );

                }


                const docRef =
                    await db
                        .collection("orders")
                        .add(order);


                console.log(
                    "✅ Order Firebase-এ Save হয়েছে:",
                    docRef.id
                );


                // --------------------------------------
                // CLEAR CART
                // --------------------------------------

                cart = [];

                saveCart();

                updateCartCount();


                // --------------------------------------
                // SUCCESS
                // --------------------------------------

                alert(
                    "✅ অর্ডার সফলভাবে গ্রহণ করা হয়েছে!\n\n" +
                    "Order ID: " +
                    docRef.id
                );


                // --------------------------------------
                // REDIRECT
                // --------------------------------------

                window.location.href =
                    "index.html";


            } catch (error) {

                console.error(
                    "❌ Order Save Error:",
                    error
                );

                alert(
                    "❌ অর্ডার Save হয়নি।\n\n" +
                    error.message
                );

            }

        }
    );

}


// ======================================================
// PAGE READY
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        displayCart();

        setupCheckout();

    }
);

// ======================================================
// IFFAH SHOP - SCRIPT.JS
// PART 4 / 4
// ADMIN PRODUCT + SEARCH + FILTER + FINAL INITIALIZATION
// ======================================================


// ======================================================
// LOAD ADMIN PRODUCTS
// ======================================================

function loadAdminProducts() {

    const container =
        document.getElementById("adminProductList");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    if (!products.length) {

        container.innerHTML = `
            <p>📦 কোনো Product পাওয়া যায়নি।</p>
        `;

        return;
    }

    products.forEach(function (product) {

        const item =
            document.createElement("div");

        item.className =
            "admin-product-item";

        item.innerHTML = `

            <div>

                <h3>
                    ${product.name}
                </h3>

                <p>
                    মূল্য: ৳${product.price}
                </p>

                <p>
                    Category: ${product.category}
                </p>

            </div>

            <button
                class="btn"
                onclick="deleteProduct('${product.id}')"
            >
                🗑️ Delete
            </button>

        `;

        container.appendChild(item);

    });

}


// ======================================================
// DELETE PRODUCT FROM FIREBASE
// ======================================================

async function deleteProduct(productId) {

    if (!productId) {
        return;
    }

    const confirmDelete =
        confirm(
            "আপনি কি এই Product Delete করতে চান?"
        );

    if (!confirmDelete) {
        return;
    }

    try {

        await db
            .collection("products")
            .doc(productId)
            .delete();

        console.log(
            "🗑️ Product Firebase থেকে Delete হয়েছে:",
            productId
        );

        products =
            products.filter(function (product) {

                return product.id !== productId;

            });

        displayProducts(products);

        loadAdminProducts();

        alert(
            "✅ Product Delete হয়েছে"
        );

    } catch (error) {

        console.error(
            "❌ Product Delete Error:",
            error
        );

        alert(
            "❌ Product Delete করা যায়নি।\n\n" +
            error.message
        );

    }

}


// ======================================================
// SEARCH PRODUCTS
// ======================================================

function searchProducts(keyword) {

    const search =
        String(keyword || "")
            .toLowerCase()
            .trim();

    if (!search) {

        displayProducts(products);

        return;

    }

    const filtered =
        products.filter(function (product) {

            const name =
                String(product.name || "")
                    .toLowerCase();

            const category =
                String(product.category || "")
                    .toLowerCase();

            const description =
                String(product.description || "")
                    .toLowerCase();

            return (
                name.includes(search) ||
                category.includes(search) ||
                description.includes(search)
            );

        });

    displayProducts(filtered);

}


// ======================================================
// SEARCH BOX
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const searchInput =
            document.getElementById(
                "productSearch"
            );

        if (searchInput) {

            searchInput.addEventListener(
                "input",
                function () {

                    searchProducts(
                        this.value
                    );

                }
            );

        }

    }
);


// ======================================================
// ADMIN PRODUCTS LOAD
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        setTimeout(function () {

            loadAdminProducts();

        }, 500);

    }
);


// ======================================================
// FINAL START
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "================================="
        );

        console.log(
            "🔥 IFFAH SHOP SCRIPT.JS READY"
        );

        console.log(
            "📦 Products:",
            products.length
        );

        console.log(
            "🛒 Cart:",
            cart.length
        );

        console.log(
            "================================="
        );

    }
);

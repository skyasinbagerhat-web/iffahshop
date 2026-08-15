// ======================================================
// IFFAH SHOP
// COMPLETE FIREBASE SCRIPT
// STEP 1
// Firebase + Products + Cart
// ======================================================

"use strict";


// ======================================================
// GLOBAL DATA
// ======================================================

let products = [];

let cart =
    JSON.parse(localStorage.getItem("cart")) || [];

let orders =
    JSON.parse(localStorage.getItem("orders")) || [];


// ======================================================
// FIREBASE CHECK
// ======================================================

if (!window.db) {

    console.error(
        "❌ Firebase Database পাওয়া যায়নি"
    );

} else {

    console.log(
        "🔥 Iffah Shop Firebase Connected"
    );

}


// ======================================================
// CART STORAGE
// ======================================================

function saveCart() {

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

}


// ======================================================
// ORDER STORAGE
// ======================================================

function saveOrders() {

    localStorage.setItem(
        "orders",
        JSON.stringify(orders)
    );

}


// ======================================================
// CART COUNTER
// ======================================================

function updateCartCount() {

    const element =
        document.getElementById("cart-count");

    if (!element) return;

    element.innerText =
        cart.length;

}


// ======================================================
// ESCAPE HTML
// ======================================================

function escapeHTML(value) {

    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ======================================================
// ESCAPE JAVASCRIPT QUOTES
// ======================================================

function escapeQuotes(value) {

    return String(value || "")
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'")
        .replace(/"/g, '\\"');

}


// ======================================================
// FIREBASE LOAD PRODUCTS
// ======================================================

async function loadProductsFromFirebase() {

    if (!window.db) {

        console.error(
            "❌ Firebase DB পাওয়া যায়নি"
        );

        return;

    }


    try {

        console.log(
            "🔥 Firebase থেকে Product Load শুরু..."
        );


        const snapshot =
            await db
                .collection("products")
                .get();


        products = [];


        snapshot.forEach(function(doc) {

            const data =
                doc.data();


            products.push({

                id:
                    doc.id,

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
            "📦 Firebase Products:",
            products
        );


        // Homepage
        loadProducts();


        // Admin
        loadAdminProducts();


        // Cart
        updateCartCount();


    }

    catch (error) {

        console.error(
            "❌ Firebase Product Load Error:",
            error
        );

    }

}


// ======================================================
// IMAGE HTML
// ======================================================

function getProductImage(product) {

    if (!product.image) {

        return `
            <div
                style="
                    width:100%;
                    min-height:180px;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    font-size:60px;
                "
            >
                📦
            </div>
        `;

    }


    return `

        <img
            src="${escapeHTML(product.image)}"
            alt="${escapeHTML(product.name)}"
            style="
                width:100%;
                max-height:220px;
                object-fit:contain;
                display:block;
            "
        >

    `;

}


// ======================================================
// HOMEPAGE PRODUCTS
// ======================================================

function loadProducts() {

    const container =
        document.getElementById("productList");


    if (!container) return;


    if (products.length === 0) {

        container.innerHTML = `

            <div
                class="card"
                style="
                    grid-column:1/-1;
                    text-align:center;
                    padding:30px;
                "
            >

                <h2>
                    📦 কোনো Product নেই
                </h2>

                <p>
                    শীঘ্রই নতুন পণ্য যুক্ত করা হবে।
                </p>

            </div>

        `;

        return;

    }


    const featured =
        products
            .slice()
            .reverse()
            .slice(0, 6);


    let html = "";


    featured.forEach(function(product) {

        html += `

            <div class="product-card">

                <div class="product-image">

                    ${getProductImage(product)}

                </div>


                <div class="product-info">

                    ${
                        product.category
                        ?

                        `
                        <span class="product-category">
                            📂
                            ${escapeHTML(product.category)}
                        </span>
                        `

                        :

                        ""
                    }


                    <h3>
                        ${escapeHTML(product.name)}
                    </h3>


                    <p class="price">
                        ৳${product.price}
                    </p>


                    <p>
                        ${
                            escapeHTML(
                                product.description ||
                                "মানসম্মত পণ্য"
                            )
                        }
                    </p>


                    <div class="btn-group">

                        <a
                            href="product.html?id=${encodeURIComponent(product.id)}"
                            class="btn-small"
                        >
                            👁️ বিস্তারিত
                        </a>


                        <button
                            class="btn-small"
                            onclick="
                                addToCart(
                                    '${escapeQuotes(product.name)}',
                                    ${product.price}
                                )
                            "
                        >
                            🛒 কার্ট
                        </button>


                        <button
                            class="btn-small"
                            onclick="
                                buyNow(
                                    '${escapeQuotes(product.name)}',
                                    ${product.price}
                                )
                            "
                        >
                            ⚡ অর্ডার
                        </button>

                    </div>

                </div>

            </div>

        `;

    });


    container.innerHTML =
        html;

}


// ======================================================
// SEARCH PRODUCTS
// ======================================================

function searchProduct() {

    const input =
        document.getElementById("search");

    const container =
        document.getElementById("productList");


    if (!input || !container) return;


    const keyword =
        input.value
            .toLowerCase()
            .trim();


    const result =
        products.filter(function(product) {

            return (

                String(product.name)
                    .toLowerCase()
                    .includes(keyword)

                ||

                String(product.category)
                    .toLowerCase()
                    .includes(keyword)

            );

        });


    if (result.length === 0) {

        container.innerHTML = `

            <div
                style="
                    text-align:center;
                    padding:30px;
                "
            >

                <h2>
                    ❌ কোনো Product পাওয়া যায়নি
                </h2>

            </div>

        `;

        return;

    }


    let html = "";


    result.forEach(function(product) {

        html += `

            <div class="product-card">

                <div class="product-image">

                    ${getProductImage(product)}

                </div>


                <div class="product-info">

                    <h3>
                        ${escapeHTML(product.name)}
                    </h3>


                    <p class="price">
                        ৳${product.price}
                    </p>


                    <p>
                        ${
                            escapeHTML(
                                product.description || ""
                            )
                        }
                    </p>


                    <div class="btn-group">

                        <a
                            href="product.html?id=${encodeURIComponent(product.id)}"
                            class="btn-small"
                        >
                            👁️ বিস্তারিত
                        </a>


                        <button
                            class="btn-small"
                            onclick="
                                addToCart(
                                    '${escapeQuotes(product.name)}',
                                    ${product.price}
                                )
                            "
                        >
                            🛒 কার্ট
                        </button>


                        <button
                            class="btn-small"
                            onclick="
                                buyNow(
                                    '${escapeQuotes(product.name)}',
                                    ${product.price}
                                )
                            "
                        >
                            ⚡ Order Now
                        </button>

                    </div>

                </div>

            </div>

        `;

    });


    container.innerHTML =
        html;

}


// ======================================================
// ADD TO CART
// ======================================================

function addToCart(name, price) {

    cart.push({

        id:
            Date.now(),

        name:
            name,

        price:
            Number(price)

    });


    saveCart();

    updateCartCount();


    alert(
        "✅ " +
        name +
        " কার্টে যোগ হয়েছে"
    );

}


// ======================================================
// BUY NOW
// ======================================================

function buyNow(name, price) {

    cart = [];


    cart.push({

        id:
            Date.now(),

        name:
            name,

        price:
            Number(price)

    });


    saveCart();

    updateCartCount();


    window.location.href =
        "checkout.html";

}


// ======================================================
// REMOVE CART
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


    loadCart();

}


// ======================================================
// CLEAR CART
// ======================================================

function clearCart() {

    if (cart.length === 0) {

        alert(
            "🛒 কার্ট ইতিমধ্যে খালি"
        );

        return;

    }


    if (
        !confirm(
            "আপনি কি পুরো কার্ট খালি করতে চান?"
        )
    ) {

        return;

    }


    cart = [];


    saveCart();

    updateCartCount();


    loadCart();

}


// ======================================================
// LOAD CART
// ======================================================

function loadCart() {

    const container =
        document.getElementById("cartList");

    const totalElement =
        document.getElementById("totalPrice");


    if (!container) return;


    if (cart.length === 0) {

        container.innerHTML = `

            <div class="card">

                <h2>
                    🛒 আপনার কার্ট খালি
                </h2>

            </div>

        `;


        if (totalElement) {

            totalElement.innerText =
                "৳0";

        }


        return;

    }


    let total = 0;

    let html = "";


    cart.forEach(function(item, index) {

        total +=
            Number(item.price) || 0;


        html += `

            <div class="card">

                <h3>
                    ${escapeHTML(item.name)}
                </h3>


                <p class="price">
                    ৳${item.price}
                </p>


                <button
                    class="btn-small"
                    onclick="
                        removeFromCart(${index})
                    "
                >
                    ❌ Remove
                </button>

            </div>

        `;

    });


    container.innerHTML =
        html;


    if (totalElement) {

        totalElement.innerText =
            "৳" + total;

    }

}


// ======================================================
// SINGLE PRODUCT
// ======================================================

async function loadSingleProduct() {

    const nameElement =
        document.getElementById(
            "productName"
        );


    if (!nameElement) return;


    const params =
        new URLSearchParams(
            window.location.search
        );


    const id =
        params.get("id");


    if (!id) return;


    let product =
        products.find(function(item) {

            return String(item.id) ===
                String(id);

        });


    // Firebase load শেষ হওয়ার আগে page খুললে
    if (!product) {

        try {

            const doc =
                await db
                    .collection("products")
                    .doc(id)
                    .get();


            if (doc.exists) {

                const data =
                    doc.data();


                product = {

                    id:
                        doc.id,

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

                };

            }

        }

        catch (error) {

            console.error(
                "❌ Product Load Error:",
                error
            );

        }

    }


    if (!product) {

        nameElement.innerText =
            "❌ Product পাওয়া যায়নি";

        return;

    }


    nameElement.innerText =
        product.name;


    const priceElement =
        document.getElementById(
            "productPrice"
        );


    if (priceElement) {

        priceElement.innerText =
            "৳" + product.price;

    }


    const descriptionElement =
        document.getElementById(
            "productDescription"
        );


    if (descriptionElement) {

        descriptionElement.innerText =
            product.description ||
            "কোনো বিবরণ নেই";

    }


    const imageElement =
        document.getElementById(
            "productImage"
        );


    if (imageElement) {

        if (product.image) {

            imageElement.src =
                product.image;

        } else {

            imageElement.style.display =
                "none";

        }

    }


    const cartButton =
        document.getElementById(
            "addCartBtn"
        );


    if (cartButton) {

        cartButton.onclick =
            function() {

                addToCart(
                    product.name,
                    product.price
                );

            };

    }


    const buyButton =
        document.getElementById(
            "buyNowBtn"
        );


    if (buyButton) {

        buyButton.onclick =
            function() {

                buyNow(
                    product.name,
                    product.price
                );

            };

    }


    const whatsappButton =
        document.getElementById(
            "whatsappBtn"
        );


    if (whatsappButton) {

        whatsappButton.href =
            "https://wa.me/8801978236232?text=" +

            encodeURIComponent(

                "আমি " +
                product.name +
                " অর্ডার করতে চাই।\n\n" +

                "দাম: ৳" +
                product.price

            );

    }

}


// ======================================================
// START
// ======================================================

updateCartCount();

loadProductsFromFirebase();

loadCart();

loadSingleProduct();


// ======================================================
// IFFAH SHOP
// FIREBASE PRODUCT LOAD - STEP 2
// ======================================================

let products = [];

// ------------------------------------------------------
// Firebase থেকে Product আনা
// ------------------------------------------------------

async function loadProductsFromFirebase() {

    try {

        console.log("🔥 Firebase থেকে Product Load শুরু...");

        const snapshot = await db
            .collection("products")
            .get();

        products = [];

        snapshot.forEach(function(doc) {

            const data = doc.data();

            products.push({

                id: doc.id,

                name: data.name || "",

                price: Number(data.price) || 0,

                category: data.category || "",

                image: data.image || "",

                description: data.description || "",

                createdAt: data.createdAt || ""

            });

        });

        console.log(
            "🔥 Firebase থেকে Product Load হয়েছে:",
            products.length
        );

        console.log("📦 Products:", products);

        displayProducts();

    }

    catch (error) {

        console.error(
            "❌ Firebase Product Load Error:",
            error
        );

    }

}


// ------------------------------------------------------
// Homepage-এ Product দেখানো
// ------------------------------------------------------

function displayProducts() {

    const container =
        document.getElementById("productList");

    if (!container) {

        console.log(
            "ℹ️ productList পাওয়া যায়নি"
        );

        return;

    }


    if (products.length === 0) {

        container.innerHTML = `

            <div class="card"
                style="
                    grid-column:1/-1;
                    text-align:center;
                    padding:30px;
                ">

                <h2>📦 কোনো Product নেই</h2>

                <p>
                    শীঘ্রই নতুন পণ্য যুক্ত করা হবে।
                </p>

            </div>

        `;

        return;

    }


    let html = "";


    products.forEach(function(product) {

        html += `

        <div class="product-card">

            <div class="product-image">

                ${
                    product.image
                    ?
                    `
                    <img
                        src="${product.image}"
                        alt="${product.name}"
                    >
                    `
                    :
                    `
                    <div
                        style="
                            padding:40px;
                            text-align:center;
                            font-size:50px;
                        "
                    >
                        📦
                    </div>
                    `
                }

            </div>


            <div class="product-info">

                ${
                    product.category
                    ?
                    `
                    <span>
                        📂 ${product.category}
                    </span>
                    `
                    :
                    ""
                }


                <h3>
                    ${product.name}
                </h3>


                <p class="price">
                    ৳${product.price}
                </p>


                <p>
                    ${
                        product.description || 
                        "মানসম্মত পণ্য"
                    }
                </p>


                <div class="btn-group">

                    <a
                        href="product.html?id=${product.id}"
                        class="btn-small"
                    >
                        👁️ বিস্তারিত
                    </a>


                    <button
                        class="btn-small"
                        onclick="
                            addToCart(
                                '${String(product.name)
                                    .replace(/'/g, "\\'")}',
                                ${product.price}
                            )
                        "
                    >
                        🛒 কার্ট
                    </button>


                    <button
                        class="btn-small"
                        onclick="
                            buyNow(
                                '${String(product.name)
                                    .replace(/'/g, "\\'")}',
                                ${product.price}
                            )
                        "
                    >
                        ⚡ অর্ডার
                    </button>

                </div>

            </div>

        </div>

        `;

    });


    container.innerHTML = html;

}


// ------------------------------------------------------
// Firebase Product Load চালু
// ------------------------------------------------------

loadProductsFromFirebase();



// ======================================================
// STEP 3
// ADD PRODUCT → FIREBASE
// ======================================================

const productForm =
    document.getElementById("productForm");


if (productForm) {

    productForm.addEventListener("submit", async function(e) {

        e.preventDefault();

        // ------------------------------------------
        // FORM DATA
        // ------------------------------------------

        const name =
            document.getElementById("name").value.trim();

        const price =
            Number(
                document.getElementById("price").value
            );

        const categoryElement =
            document.getElementById("category");

        const category =
            categoryElement
                ? categoryElement.value.trim()
                : "";

        const imageElement =
            document.getElementById("image");

        const image =
            imageElement
                ? imageElement.value.trim()
                : "";

        const descriptionElement =
            document.getElementById("description");

        const description =
            descriptionElement
                ? descriptionElement.value.trim()
                : "";


        // ------------------------------------------
        // VALIDATION
        // ------------------------------------------

        if (!name) {

            alert("❌ Product Name দিন");

            return;

        }


        if (!price || price <= 0) {

            alert("❌ সঠিক Price দিন");

            return;

        }


        // ------------------------------------------
        // PRODUCT DATA
        // ------------------------------------------

        const product = {

            name: name,

            price: price,

            category: category,

            image: image,

            description: description,

            createdAt:
                firebase.firestore.FieldValue.serverTimestamp()

        };


        // ------------------------------------------
        // FIREBASE SAVE
        // ------------------------------------------

        try {

            console.log(
                "🔥 Product Firebase-এ Save হচ্ছে..."
            );


            const docRef =
                await db
                    .collection("products")
                    .add(product);


            console.log(
                "✅ Product Firebase-এ Save হয়েছে:",
                docRef.id
            );


            alert(
                "✅ Product সফলভাবে যোগ হয়েছে!"
            );


            // --------------------------------------
            // FORM RESET
            // --------------------------------------

            productForm.reset();


            // --------------------------------------
            // FIREBASE থেকে আবার PRODUCTS LOAD
            // --------------------------------------

            await loadProductsFromFirebase();


        }

        catch (error) {

            console.error(
                "❌ Product Save Error:",
                error
            );


            alert(
                "❌ Product Save হয়নি!\n\n" +
                error.message
            );

        }

    });

}


// ======================================================
// STEP 4
// CART + ORDER → FIREBASE
// ======================================================


// ======================================================
// CART
// ======================================================

let cart = [];


// Cart Firebase নয়,
// কারণ Cart প্রতিটি Customer-এর নিজের ডিভাইসের জন্য।
// তাই Cart আপাতত LocalStorage-এ থাকবে।

try {

    cart =
        JSON.parse(
            localStorage.getItem("cart")
        ) || [];

}
catch (error) {

    cart = [];

}


// ======================================================
// CART COUNTER
// ======================================================

function updateCartCount() {

    const count =
        document.getElementById("cart-count");

    if (count) {

        count.innerText =
            cart.length;

    }

}


// ======================================================
// ADD TO CART
// ======================================================

function addToCart(name, price) {

    cart.push({

        id: Date.now(),

        name: name,

        price: Number(price)

    });


    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    updateCartCount();


    alert(
        "✅ " + name +
        " কার্টে যোগ হয়েছে"
    );

}


// ======================================================
// BUY NOW
// ======================================================

function buyNow(name, price) {

    cart = [];

    cart.push({

        id: Date.now(),

        name: name,

        price: Number(price)

    });


    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    updateCartCount();


    window.location.href =
        "checkout.html";

}


// ======================================================
// CHECKOUT → FIREBASE ORDER
// ======================================================

const checkoutForm =
    document.getElementById("checkoutForm");


if (checkoutForm) {

    checkoutForm.addEventListener(
        "submit",
        async function(e) {

            e.preventDefault();


            // --------------------------------------
            // CART CHECK
            // --------------------------------------

            if (cart.length === 0) {

                alert(
                    "🛒 আপনার কার্ট খালি"
                );

                return;

            }


            // --------------------------------------
            // CUSTOMER DATA
            // --------------------------------------

            const name =
                document
                    .getElementById("name")
                    .value
                    .trim();


            const phone =
                document
                    .getElementById("phone")
                    .value
                    .trim();


            const address =
                document
                    .getElementById("address")
                    .value
                    .trim();


            const paymentElement =
                document.getElementById("payment");


            const payment =
                paymentElement
                    ? paymentElement.value
                    : "Cash on Delivery";


            // --------------------------------------
            // VALIDATION
            // --------------------------------------

            if (
                !name ||
                !phone ||
                !address
            ) {

                alert(
                    "❌ নাম, মোবাইল নম্বর ও ঠিকানা পূরণ করুন"
                );

                return;

            }


            // --------------------------------------
            // ORDER ID
            // --------------------------------------

            const orderId =
                "ORD" +
                Date.now();


            // --------------------------------------
            // ORDER DATA
            // --------------------------------------

            const order = {

                orderId: orderId,

                name: name,

                phone: phone,

                address: address,

                payment: payment,

                products: cart,

                status: "Pending",

                createdAt:
                    firebase.firestore.FieldValue.serverTimestamp()

            };


            // --------------------------------------
            // FIREBASE SAVE
            // --------------------------------------

            try {

                console.log(
                    "🔥 Order Firebase-এ Save হচ্ছে..."
                );


                const docRef =
                    await db
                        .collection("orders")
                        .add(order);


                console.log(
                    "✅ Order Firebase-এ Save হয়েছে:",
                    docRef.id
                );


                // ----------------------------------
                // CART EMPTY
                // ----------------------------------

                cart = [];


                localStorage.removeItem(
                    "cart"
                );


                updateCartCount();


                // ----------------------------------
                // SUCCESS
                // ----------------------------------

                alert(
                    "✅ আপনার অর্ডার সফলভাবে গ্রহণ করা হয়েছে!\n\n" +
                    "Order ID: " +
                    orderId
                );


                window.location.href =
                    "index.html";


            }

            catch (error) {

                console.error(
                    "❌ Order Save Error:",
                    error
                );


                alert(
                    "❌ অর্ডার Save হয়নি!\n\n" +
                    error.message
                );

            }

        }
    );

}


// ======================================================
// START CART COUNTER
// ======================================================

updateCartCount();


// ======================================================
// STEP 4 END
// ======================================================

// ======================================================
// CHECKOUT FORM TEST
// ======================================================

console.log("🟢 Checkout Test Code Loaded");

const checkoutTestForm =
    document.getElementById("checkoutForm");

if (checkoutTestForm) {

    console.log("✅ Checkout Form পাওয়া গেছে");

    checkoutTestForm.addEventListener("submit", function(e) {

        e.preventDefault();

        console.log("🔥 ORDER BUTTON CLICKED");

        alert("✅ Order Button কাজ করছে");

    });

} else {

    console.log("❌ Checkout Form পাওয়া যায়নি");

}




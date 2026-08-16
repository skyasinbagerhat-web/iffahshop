// ======================================================
// IFFAH SHOP - COMPLETE FIREBASE SCRIPT.JS
// Firebase Firestore + LocalStorage
// ======================================================


// ======================================================
// FIREBASE CHECK
// ======================================================

let firebaseReady = false;

try {

    if (
        typeof firebase !== "undefined" &&
        typeof db !== "undefined"
    ) {

        firebaseReady = true;

        console.log("🔥 Iffah Shop Firebase Connected");

    } else {

        console.warn("⚠️ Firebase / db পাওয়া যায়নি");

    }

} catch (error) {

    console.error("❌ Firebase Check Error:", error);

}


// ======================================================
// DEFAULT IMAGE
// ======================================================

const DEFAULT_IMAGE =
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg"
             width="600"
             height="600"
             viewBox="0 0 600 600">

            <rect width="600" height="600" fill="#f1f5f9"/>

            <text
                x="300"
                y="280"
                text-anchor="middle"
                font-size="80">
                📦
            </text>

            <text
                x="300"
                y="360"
                text-anchor="middle"
                font-size="34"
                fill="#64748b">
                IFFAH SHOP
            </text>

        </svg>
    `);


// ======================================================
// LOCAL STORAGE
// ======================================================

let products =
    JSON.parse(
        localStorage.getItem("products")
    ) || [];


let cart =
    JSON.parse(
        localStorage.getItem("cart")
    ) || [];


let orders =
    JSON.parse(
        localStorage.getItem("orders")
    ) || [];


// ======================================================
// SAVE LOCAL DATA
// ======================================================

function saveProducts() {

    localStorage.setItem(
        "products",
        JSON.stringify(products)
    );

}


function saveCart() {

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

}


function saveOrders() {

    localStorage.setItem(
        "orders",
        JSON.stringify(orders)
    );

}


// ======================================================
// SAFE VALUE
// ======================================================

function safeText(value) {

    return String(value ?? "");

}


// ======================================================
// ESCAPE HTML
// ======================================================

function escapeHTML(value) {

    return safeText(value)
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

    return safeText(value)
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'")
        .replace(/"/g, '\\"')
        .replace(/\n/g, "\\n")
        .replace(/\r/g, "\\r");

}


// ======================================================
// FIREBASE PRODUCT NORMALIZE
// ======================================================

function normalizeProduct(data, id) {

    return {

        id: id,

        name:
            data.name || "",

        price:
            Number(data.price) || 0,

        category:
            data.category || "",

        image:
            data.image || DEFAULT_IMAGE,

        description:
            data.description || "",

        createdAt:
            data.createdAt || "",

        updatedAt:
            data.updatedAt || ""

    };

}


// ======================================================
// FIREBASE ORDER NORMALIZE
// ======================================================

function normalizeOrder(data, id) {

    return {

        id:
            data.id || id,

        name:
            data.name || "",

        phone:
            data.phone || "",

        address:
            data.address || "",

        payment:
            data.payment || "",

        products:
            Array.isArray(data.products)
                ? data.products
                : [],

        status:
            data.status || "Pending",

        date:
            data.date || "",

        createdAt:
            data.createdAt || "",

        updatedAt:
            data.updatedAt || ""

    };

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
// DARK MODE
// ======================================================

function darkMode() {

    document.body.classList.toggle("dark");

}


// ======================================================
// ADD TO CART
// ======================================================

function addToCart(name, price) {

    cart.push({

        id:
            Date.now(),

        name:
            safeText(name),

        price:
            Number(price) || 0

    });

    saveCart();

    updateCartCount();

    alert(
        "✅ " +
        name +
        " কার্টে যোগ হয়েছে"
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
            safeText(name),

        price:
            Number(price) || 0

    });

    saveCart();

    updateCartCount();

    window.location.href =
        "checkout.html";

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
// FIREBASE - LOAD PRODUCTS
// ======================================================

async function loadProductsFromFirebase() {

    if (!firebaseReady) {

        console.warn(
            "⚠️ Firebase নেই। LocalStorage Product ব্যবহার করা হচ্ছে।"
        );

        loadProducts();
        loadSingleProduct();
        loadAdminProducts();
        loadProductsAdmin();

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

        const firebaseProducts = [];

        snapshot.forEach(function(doc) {

            firebaseProducts.push(
                normalizeProduct(
                    doc.data(),
                    doc.id
                )
            );

        });

        products =
            firebaseProducts;

        saveProducts();

        console.log(
            "🔥 Firebase থেকে Product Load হয়েছে:",
            products.length
        );

        loadProducts();

        loadSingleProduct();

        loadAdminProducts();

        loadProductsAdmin();

        loadDashboardStats();

    }

    catch (error) {

        console.error(
            "❌ Firebase Product Load Error:",
            error
        );

        alert(
            "⚠️ Firebase থেকে Product Load করা যায়নি। LocalStorage ব্যবহার করা হচ্ছে।"
        );

        loadProducts();

        loadSingleProduct();

        loadAdminProducts();

        loadProductsAdmin();

    }

}


// ======================================================
// FIREBASE - ADD PRODUCT
// ======================================================

async function saveProductToFirebase(product) {

    if (!firebaseReady) {

        console.warn(
            "⚠️ Firebase নেই। LocalStorage-এ Product Save করা হচ্ছে।"
        );

        products.push(product);

        saveProducts();

        return;

    }

    try {

        const docRef =
            await db
                .collection("products")
                .add({

                    name:
                        product.name,

                    price:
                        Number(product.price) || 0,

                    category:
                        product.category || "",

                    image:
                        product.image || DEFAULT_IMAGE,

                    description:
                        product.description || "",

                    createdAt:
                        new Date().toISOString(),

                    updatedAt:
                        new Date().toISOString()

                });

        product.id =
            docRef.id;

        products.push(product);

        saveProducts();

        console.log(
            "✅ Product Firebase-এ Save হয়েছে:",
            docRef.id
        );

    }

    catch (error) {

        console.error(
            "❌ Product Firebase Save Error:",
            error
        );

        throw error;

    }

}


// ======================================================
// FIREBASE - UPDATE PRODUCT
// ======================================================

async function updateProductInFirebase(
    productId,
    productData
) {

    if (!firebaseReady) {

        return;

    }

    try {

        await db
            .collection("products")
            .doc(String(productId))
            .update({

                name:
                    productData.name,

                price:
                    Number(productData.price) || 0,

                category:
                    productData.category || "",

                image:
                    productData.image || DEFAULT_IMAGE,

                description:
                    productData.description || "",

                updatedAt:
                    new Date().toISOString()

            });

        console.log(
            "✅ Firebase Product Update হয়েছে:",
            productId
        );

    }

    catch (error) {

        console.error(
            "❌ Firebase Product Update Error:",
            error
        );

        throw error;

    }

}


// ======================================================
// FIREBASE - DELETE PRODUCT
// ======================================================

async function deleteProductFromFirebase(
    productId
) {

    if (!firebaseReady) {

        return;

    }

    try {

        await db
            .collection("products")
            .doc(String(productId))
            .delete();

        console.log(
            "🗑️ Firebase Product Delete হয়েছে:",
            productId
        );

    }

    catch (error) {

        console.error(
            "❌ Firebase Product Delete Error:",
            error
        );

        throw error;

    }

}


// ======================================================
// LOAD PRODUCTS - HOMEPAGE
// ======================================================

function loadProducts() {

    const container =
        document.getElementById(
            "productList"
        );

    if (!container) {

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

    const featuredProducts =
        products
            .slice(-6)
            .reverse();

    let html = "";

    featuredProducts.forEach(
        function(product) {

            html += `

            <div class="product-card professional-product-card">

                <div class="professional-product-image">

                    <img
                        src="${escapeHTML(
                            product.image || DEFAULT_IMAGE
                        )}"
                        alt="${escapeHTML(product.name)}"
                        onerror="this.onerror=null;this.src='${DEFAULT_IMAGE}'"
                    >

                </div>

                <div class="product-info">

                    ${
                        product.category
                        ?
                        `
                        <span class="product-category">
                            📂 ${escapeHTML(product.category)}
                        </span>
                        `
                        :
                        ""
                    }

                    <h3>
                        ${escapeHTML(product.name)}
                    </h3>

                    <p class="price professional-price">
                        ৳${Number(product.price) || 0}
                    </p>

                    <p class="professional-description">

                        ${
                            product.description
                            ?
                            escapeHTML(
                                product.description.length > 70
                                ?
                                product.description.substring(0, 70) + "..."
                                :
                                product.description
                            )
                            :
                            "মানসম্মত পণ্য"
                        }

                    </p>

                    <div class="professional-product-buttons">

                        <a
                            href="product.html?id=${encodeURIComponent(product.id)}"
                            class="professional-btn details-btn">

                            👁️ বিস্তারিত

                        </a>

                        <button
                            class="professional-btn cart-btn"
                            onclick="
                                addToCart(
                                    '${escapeQuotes(product.name)}',
                                    ${Number(product.price) || 0}
                                )
                            ">

                            🛒 কার্ট

                        </button>

                        <button
                            class="professional-btn order-btn"
                            onclick="
                                buyNow(
                                    '${escapeQuotes(product.name)}',
                                    ${Number(product.price) || 0}
                                )
                            ">

                            ⚡ অর্ডার

                        </button>

                    </div>

                </div>

            </div>

            `;

        }
    );

    container.innerHTML =
        html;

}


// ======================================================
// SEARCH PRODUCT
// ======================================================

function searchProduct() {

    const search =
        document.getElementById("search");

    const container =
        document.getElementById("productList");

    if (!search || !container) {

        return;

    }

    const keyword =
        search.value
            .toLowerCase()
            .trim();

    const result =
        products.filter(
            function(product) {

                return (
                    safeText(product.name)
                        .toLowerCase()
                        .includes(keyword)
                    ||

                    safeText(product.category)
                        .toLowerCase()
                        .includes(keyword)
                );

            }
        );

    if (result.length === 0) {

        container.innerHTML = `

            <div class="card"
                 style="
                    grid-column:1/-1;
                    text-align:center;
                 ">

                <h2>
                    ❌ কোনো Product পাওয়া যায়নি
                </h2>

            </div>

        `;

        return;

    }

    let html = "";

    result.forEach(
        function(product) {

            html += `

            <div class="product-card">

                <img
                    src="${escapeHTML(
                        product.image || DEFAULT_IMAGE
                    )}"
                    alt="${escapeHTML(product.name)}"
                    onerror="this.onerror=null;this.src='${DEFAULT_IMAGE}'"
                >

                <div class="product-info">

                    <h3>
                        ${escapeHTML(product.name)}
                    </h3>

                    <p class="price">
                        ৳${Number(product.price) || 0}
                    </p>

                    <p>
                        ${escapeHTML(
                            product.description || ""
                        )}
                    </p>

                    <div class="btn-group">

                        <a
                            href="product.html?id=${encodeURIComponent(product.id)}"
                            class="btn-small">

                            👁️ বিস্তারিত

                        </a>

                        <button
                            class="btn-small"
                            onclick="
                                addToCart(
                                    '${escapeQuotes(product.name)}',
                                    ${Number(product.price) || 0}
                                )
                            ">

                            🛒 কার্টে যোগ করুন

                        </button>

                        <button
                            class="btn-small"
                            onclick="
                                buyNow(
                                    '${escapeQuotes(product.name)}',
                                    ${Number(product.price) || 0}
                                )
                            ">

                            ⚡ Order Now

                        </button>

                    </div>

                </div>

            </div>

            `;

        }
    );

    container.innerHTML =
        html;

}


// ======================================================
// SINGLE PRODUCT
// ======================================================

function loadSingleProduct() {

    const productName =
        document.getElementById(
            "productName"
        );

    if (!productName) {

        return;

    }

    const params =
        new URLSearchParams(
            window.location.search
        );

    const id =
        params.get("id");

    const product =
        products.find(
            function(item) {

                return (
                    String(item.id) ===
                    String(id)
                );

            }
        );

    if (!product) {

        const details =
            document.querySelector(
                ".product-details"
            );

        if (details) {

            details.innerHTML = `

                <h2 style="text-align:center;">
                    ❌ Product পাওয়া যায়নি
                </h2>

            `;

        }

        return;

    }

    productName.innerText =
        product.name;

    const price =
        document.getElementById(
            "productPrice"
        );

    if (price) {

        price.innerText =
            "৳" +
            Number(product.price);

    }

    const description =
        document.getElementById(
            "productDescription"
        );

    if (description) {

        description.innerText =
            product.description ||
            "কোনো বিবরণ নেই";

    }

    const image =
        document.getElementById(
            "productImage"
        );

    if (image) {

        image.src =
            product.image ||
            DEFAULT_IMAGE;

        image.onerror =
            function() {

                this.onerror = null;

                this.src =
                    DEFAULT_IMAGE;

            };

    }

    const cartBtn =
        document.getElementById(
            "addCartBtn"
        );

    if (cartBtn) {

        cartBtn.onclick =
            function() {

                addToCart(
                    product.name,
                    product.price
                );

            };

    }

    const buyNowBtn =
        document.getElementById(
            "buyNowBtn"
        );

    if (buyNowBtn) {

        buyNowBtn.onclick =
            function() {

                buyNow(
                    product.name,
                    product.price
                );

            };

    }

    const whatsappBtn =
        document.getElementById(
            "whatsappBtn"
        );

    if (whatsappBtn) {

        whatsappBtn.href =
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
// LOAD CART
// ======================================================

function loadCart() {

    const cartList =
        document.getElementById(
            "cartList"
        );

    const totalPrice =
        document.getElementById(
            "totalPrice"
        );

    if (!cartList) {

        return;

    }

    if (cart.length === 0) {

        cartList.innerHTML = `

            <h2 style="text-align:center;">
                🛒 আপনার কার্ট খালি
            </h2>

        `;

        if (totalPrice) {

            totalPrice.innerText =
                "৳0";

        }

        return;

    }

    let html = "";

    let total = 0;

    cart.forEach(
        function(item, index) {

            const price =
                Number(item.price) || 0;

            total +=
                price;

            html += `

            <div class="card">

                <h3>
                    ${escapeHTML(item.name)}
                </h3>

                <p class="price">
                    ৳${price}
                </p>

                <button
                    class="btn-small"
                    onclick="
                        removeFromCart(${index})
                    ">

                    ❌ Remove

                </button>

            </div>

            `;

        }
    );

    cartList.innerHTML =
        html;

    if (totalPrice) {

        totalPrice.innerText =
            "৳" +
            total;

    }

}


// ======================================================
// IMAGE FILE PREVIEW
// ======================================================

const productForm =
    document.getElementById(
        "productForm"
    );

const imageFile =
    document.getElementById(
        "imageFile"
    );

const imagePreview =
    document.getElementById(
        "imagePreview"
    );

const imagePreviewBox =
    document.getElementById(
        "imagePreviewBox"
    );


if (imageFile) {

    imageFile.addEventListener(
        "change",
        function() {

            const file =
                this.files[0];

            if (!file) {

                return;

            }

            if (
                !file.type.startsWith(
                    "image/"
                )
            ) {

                alert(
                    "❌ শুধু Image নির্বাচন করুন"
                );

                this.value = "";

                return;

            }

            const reader =
                new FileReader();

            reader.onload =
                function(e) {

                    if (imagePreview) {

                        imagePreview.src =
                            e.target.result;

                    }

                    if (imagePreviewBox) {

                        imagePreviewBox.style.display =
                            "block";

                    }

                };

            reader.readAsDataURL(file);

        }
    );

}


// ======================================================
// ADD PRODUCT
// ======================================================

if (productForm) {

    productForm.addEventListener(
        "submit",
        async function(e) {

            e.preventDefault();

            const nameElement =
                document.getElementById(
                    "name"
                );

            const priceElement =
                document.getElementById(
                    "price"
                );

            const imageElement =
                document.getElementById(
                    "image"
                );

            const descriptionElement =
                document.getElementById(
                    "description"
                );

            const categoryElement =
                document.getElementById(
                    "category"
                );

            const name =
                nameElement
                ?
                nameElement.value.trim()
                :
                "";

            const price =
                priceElement
                ?
                Number(priceElement.value)
                :
                0;

            const imageURL =
                imageElement
                ?
                imageElement.value.trim()
                :
                "";

            const description =
                descriptionElement
                ?
                descriptionElement.value.trim()
                :
                "";

            const category =
                categoryElement
                ?
                categoryElement.value.trim()
                :
                "";

            if (!name || !price) {

                alert(
                    "❌ Product Name ও Price দিন"
                );

                return;

            }

            let image =
                imageURL;

            if (
                imageFile &&
                imageFile.files &&
                imageFile.files.length > 0
            ) {

                image =
                    imagePreview &&
                    imagePreview.src
                    ?
                    imagePreview.src
                    :
                    "";

            }

            if (!image) {

                image =
                    DEFAULT_IMAGE;

            }

            if (
                image.startsWith("data:image") &&
                image.length > 950000
            ) {

                alert(
                    "❌ ছবিটি অনেক বড়। ছোট সাইজের ছবি ব্যবহার করুন।"
                );

                return;

            }

            const product = {

                id:
                    "TEMP" +
                    Date.now(),

                name:
                    name,

                price:
                    price,

                category:
                    category,

                image:
                    image,

                description:
                    description,

                createdAt:
                    new Date().toISOString()

            };

            const submitButton =
                productForm.querySelector(
                    'button[type="submit"]'
                );

            if (submitButton) {

                submitButton.disabled =
                    true;

                submitButton.innerText =
                    "⏳ Product Save হচ্ছে...";

            }

            try {

                await saveProductToFirebase(
                    product
                );

                alert(
                    "✅ Product সফলভাবে Firebase-এ Save হয়েছে"
                );

                productForm.reset();

                if (imagePreviewBox) {

                    imagePreviewBox.style.display =
                        "none";

                }

                if (imagePreview) {

                    imagePreview.src =
                        "";

                }

                loadProducts();

                loadAdminProducts();

                loadProductsAdmin();

            }

            catch (error) {

                alert(
                    "❌ Product Save করা যায়নি।\n\n" +
                    error.message
                );

            }

            finally {

                if (submitButton) {

                    submitButton.disabled =
                        false;

                    submitButton.innerText =
                        "Product Add করুন";

                }

            }

        }
    );

}


// ======================================================
// FIREBASE - SAVE ORDER
// ======================================================

async function saveOrderToFirebase(order) {

    if (!firebaseReady) {

        orders.push(order);

        saveOrders();

        return;

    }

    try {

        await db
            .collection("orders")
            .doc(String(order.id))
            .set({

                id:
                    order.id,

                name:
                    order.name,

                phone:
                    order.phone,

                address:
                    order.address,

                payment:
                    order.payment,

                products:
                    order.products,

                status:
                    order.status,

                date:
                    order.date,

                createdAt:
                    new Date().toISOString(),

                updatedAt:
                    new Date().toISOString()

            });

        orders.push(order);

        saveOrders();

        console.log(
            "✅ Order Firebase-এ Save হয়েছে:",
            order.id
        );

    }

    catch (error) {

        console.error(
            "❌ Firebase Order Save Error:",
            error
        );

        throw error;

    }

}


// ======================================================
// FIREBASE - LOAD ORDERS
// ======================================================

async function loadOrdersFromFirebase() {

    if (!firebaseReady) {

        loadOrders();

        loadOrdersPage();

        loadCustomersPage();

        loadPendingOrdersPage();

        loadDashboardStats();

        return;

    }

    try {

        const snapshot =
            await db
                .collection("orders")
                .get();

        const firebaseOrders = [];

        snapshot.forEach(
            function(doc) {

                firebaseOrders.push(
                    normalizeOrder(
                        doc.data(),
                        doc.id
                    )
                );

            }
        );

        firebaseOrders.sort(
            function(a, b) {

                return String(b.date)
                    .localeCompare(
                        String(a.date)
                    );

            }
        );

        orders =
            firebaseOrders;

        saveOrders();

        console.log(
            "🔥 Firebase থেকে Order Load হয়েছে:",
            orders.length
        );

        loadOrders();

        loadOrdersPage();

        loadCustomersPage();

        loadPendingOrdersPage();

        loadDashboardStats();

    }

    catch (error) {

        console.error(
            "❌ Firebase Order Load Error:",
            error
        );

        loadOrders();

        loadOrdersPage();

        loadCustomersPage();

        loadPendingOrdersPage();

        loadDashboardStats();

    }

}


// ======================================================
// CHECKOUT / ORDER
// ======================================================

const checkoutForm =
    document.getElementById(
        "checkoutForm"
    );


if (checkoutForm) {

    checkoutForm.addEventListener(
        "submit",
        async function(e) {

            e.preventDefault();

            if (cart.length === 0) {

                alert(
                    "🛒 আপনার কার্ট খালি"
                );

                return;

            }

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

            const payment =
                document
                    .getElementById("payment")
                    .value;

            if (
                !name ||
                !phone ||
                !address ||
                !payment
            ) {

                alert(
                    "❌ নাম, মোবাইল নম্বর, ঠিকানা ও পেমেন্ট পদ্ধতি পূরণ করুন"
                );

                return;

            }

            const order = {

                id:
                    "ORD" +
                    Date.now(),

                name:
                    name,

                phone:
                    phone,

                address:
                    address,

                payment:
                    payment,

                products:
                    JSON.parse(
                        JSON.stringify(cart)
                    ),

                status:
                    "Pending",

                date:
                    new Date()
                        .toLocaleString(
                            "bn-BD"
                        )

            };

            const submitButton =
                checkoutForm.querySelector(
                    'button[type="submit"]'
                );

            if (submitButton) {

                submitButton.disabled =
                    true;

                submitButton.innerText =
                    "⏳ অর্ডার Save হচ্ছে...";

            }

            try {

                await saveOrderToFirebase(
                    order
                );

                cart = [];

                saveCart();

                updateCartCount();

                alert(
                    "✅ আপনার অর্ডার সফলভাবে গ্রহণ করা হয়েছে!\n\n" +
                    "Order ID: " +
                    order.id
                );

                window.location.href =
                    "index.html";

            }

            catch (error) {

                alert(
                    "❌ Order Firebase-এ Save হয়নি।\n\n" +
                    error.message
                );

            }

            finally {

                if (submitButton) {

                    submitButton.disabled =
                        false;

                    submitButton.innerText =
                        "✅ অর্ডার নিশ্চিত করুন";

                }

            }

        }
    );

}


// ======================================================
// ADMIN - LOAD ORDERS
// ======================================================

function loadOrders() {

    const container =
        document.getElementById(
            "orderList"
        );

    if (!container) {

        return;

    }

    if (orders.length === 0) {

        container.innerHTML =
            "<h2>📭 এখনো কোনো Order নেই</h2>";

        return;

    }

    let html = "";

    orders.forEach(
        function(order, index) {

            let total = 0;

            if (
                Array.isArray(
                    order.products
                )
            ) {

                order.products.forEach(
                    function(item) {

                        total +=
                            Number(item.price) || 0;

                    }
                );

            }

            html += `

            <div class="card">

                <h3>
                    👤 ${escapeHTML(order.name)}
                </h3>

                <p>
                    🆔 Order ID:
                    <strong>
                        ${escapeHTML(order.id)}
                    </strong>
                </p>

                <p>
                    📞 ${escapeHTML(order.phone)}
                </p>

                <p>
                    📍 ${escapeHTML(order.address)}
                </p>

                <p>
                    💳 ${escapeHTML(order.payment)}
                </p>

                <p>
                    📦 মোট পণ্য:
                    ${order.products.length}
                </p>

                <p>
                    💰 মোট:
                    ৳${total}
                </p>

                <p>
                    📅 ${escapeHTML(order.date)}
                </p>

                <p>
                    📌 Status:
                    <strong>
                        ${escapeHTML(
                            order.status || "Pending"
                        )}
                    </strong>
                </p>

                <div class="btn-group">

                    <button
                        class="btn-small"
                        onclick="
                            updateOrderStatus(
                                ${index},
                                'Pending'
                            )
                        ">

                        🟡 Pending

                    </button>

                    <button
                        class="btn-small"
                        onclick="
                            updateOrderStatus(
                                ${index},
                                'Confirmed'
                            )
                        ">

                        🟢 Confirmed

                    </button>

                    <button
                        class="btn-small"
                        onclick="
                            updateOrderStatus(
                                ${index},
                                'Delivered'
                            )
                        ">

                        🚚 Delivered

                    </button>

                </div>

            </div>

            `;

        }
    );

    container.innerHTML =
        html;

}


// ======================================================
// FIREBASE - UPDATE ORDER STATUS
// ======================================================

async function updateOrderStatus(
    index,
    status
) {

    if (!orders[index]) {

        alert(
            "❌ Order পাওয়া যায়নি"
        );

        return;

    }

    const order =
        orders[index];

    try {

        if (firebaseReady) {

            await db
                .collection("orders")
                .doc(String(order.id))
                .update({

                    status:
                        status,

                    updatedAt:
                        new Date().toISOString()

                });

        }

        order.status =
            status;

        saveOrders();

        alert(
            "✅ Order Status Updated: " +
            status
        );

        loadOrders();

        loadOrdersPage();

        loadPendingOrdersPage();

        loadDashboardStats();

    }

    catch (error) {

        console.error(
            "❌ Order Status Update Error:",
            error
        );

        alert(
            "❌ Order Status Update করা যায়নি"
        );

    }

}


// ======================================================
// LOGIN
// ======================================================

const loginForm =
    document.getElementById(
        "loginForm"
    );


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        function(e) {

            e.preventDefault();

            const username =
                document
                    .getElementById(
                        "username"
                    )
                    .value
                    .trim();

            const password =
                document
                    .getElementById(
                        "password"
                    )
                    .value;

            if (
                username === "admin" &&
                password === "12345"
            ) {

                localStorage.setItem(
                    "isLoggedIn",
                    "true"
                );

                alert(
                    "✅ Login Successful"
                );

                window.location.href =
                    "admin.html";

            }

            else {

                alert(
                    "❌ Username অথবা Password ভুল"
                );

            }

        }
    );

}


// ======================================================
// LOGOUT
// ======================================================

function logout() {

    localStorage.removeItem(
        "isLoggedIn"
    );

    window.location.href =
        "login.html";

}


// ======================================================
// ADMIN PAGE PROTECTION
// ======================================================

const protectedPages = [

    "admin.html",

    "add-product.html",

    "edit-product.html",

    "products.html",

    "Dashboard.html"

];


const currentPage =
    window.location.pathname
        .split("/")
        .pop();


if (
    protectedPages.includes(
        currentPage
    ) &&
    localStorage.getItem(
        "isLoggedIn"
    ) !== "true"
) {

    window.location.href =
        "login.html";

}


// ======================================================
// PAYMENT
// ======================================================

function submitPayment() {

    const trxid =
        document.getElementById(
            "trxid"
        );

    if (!trxid) {

        return;

    }

    const transactionId =
        trxid.value.trim();

    if (!transactionId) {

        alert(
            "❌ Transaction ID লিখুন"
        );

        return;

    }

    const selectedPayment =
        document.querySelector(
            'input[name="payment"]:checked'
        );

    const paymentMethod =
        selectedPayment
        ?
        selectedPayment.value
        :
        "";

    localStorage.setItem(
        "paymentStatus",
        "Paid"
    );

    localStorage.setItem(
        "transactionId",
        transactionId
    );

    localStorage.setItem(
        "paymentMethod",
        paymentMethod
    );

    alert(
        "✅ Payment তথ্য সংরক্ষণ হয়েছে"
    );

    window.location.href =
        "checkout.html";

}


// ======================================================
// ADMIN PRODUCT MANAGEMENT
// ======================================================

function loadAdminProducts() {

    const container =
        document.getElementById(
            "adminProductList"
        );

    if (!container) {

        return;

    }

    if (products.length === 0) {

        container.innerHTML = `

            <div class="card">

                <h3>
                    📦 কোনো Product নেই
                </h3>

            </div>

        `;

        return;

    }

    let html = "";

    products.forEach(
        function(product, index) {

            html += `

            <div class="card">

                <div style="text-align:center;">

                    <img
                        src="${escapeHTML(
                            product.image || DEFAULT_IMAGE
                        )}"
                        alt="${escapeHTML(product.name)}"
                        onerror="this.onerror=null;this.src='${DEFAULT_IMAGE}'"
                        style="
                            width:150px;
                            height:150px;
                            object-fit:contain;
                            border-radius:10px;
                        "
                    >

                </div>

                <h3>
                    📦 ${escapeHTML(product.name)}
                </h3>

                <p class="price">
                    💰 ৳${Number(product.price) || 0}
                </p>

                <p>
                    ${escapeHTML(
                        product.description ||
                        "কোনো বিবরণ নেই"
                    )}
                </p>

                <div class="btn-group">

                    <button
                        class="btn-small"
                        onclick="
                            editProduct(${index})
                        ">

                        ✏️ Edit

                    </button>

                    <button
                        class="btn-small"
                        onclick="
                            deleteProduct(${index})
                        ">

                        🗑️ Delete

                    </button>

                </div>

            </div>

            `;

        }
    );

    container.innerHTML =
        html;

}


// ======================================================
// EDIT PRODUCT
// ======================================================

function editProduct(index) {

    if (!products[index]) {

        alert(
            "❌ Product পাওয়া যায়নি"
        );

        return;

    }

    const product =
        products[index];

    window.location.href =
        "edit-product.html?id=" +
        encodeURIComponent(
            product.id
        );

}


// ======================================================
// DELETE PRODUCT
// ======================================================

async function deleteProduct(index) {

    if (!products[index]) {

        alert(
            "❌ Product পাওয়া যায়নি"
        );

        return;

    }

    const product =
        products[index];

    const confirmDelete =
        confirm(
            "⚠️ আপনি কি এই Product মুছে ফেলতে চান?\n\n" +
            "📦 Product: " +
            product.name +
            "\n" +
            "💰 দাম: ৳" +
            product.price
        );

    if (!confirmDelete) {

        return;

    }

    try {

        if (firebaseReady) {

            await deleteProductFromFirebase(
                product.id
            );

        }

        products =
            products.filter(
                function(item) {

                    return (
                        String(item.id) !==
                        String(product.id)
                    );

                }
            );

        saveProducts();

        alert(
            "✅ Product সফলভাবে Delete হয়েছে"
        );

        loadAdminProducts();

        loadProductsAdmin();

        loadProducts();

        loadDashboardStats();

    }

    catch (error) {

        console.error(
            "❌ Product Delete Error:",
            error
        );

        alert(
            "❌ Product Delete করা যায়নি"
        );

    }

}


// ======================================================
// EDIT PRODUCT PAGE
// ======================================================

function loadEditProduct() {

    const form =
        document.getElementById(
            "editProductForm"
        );

    if (!form) {

        return;

    }

    const params =
        new URLSearchParams(
            window.location.search
        );

    const id =
        params.get("id");

    const product =
        products.find(
            function(item) {

                return (
                    String(item.id) ===
                    String(id)
                );

            }
        );

    if (!product) {

        alert(
            "❌ Product পাওয়া যায়নি"
        );

        window.location.href =
            "admin.html";

        return;

    }

    const editName =
        document.getElementById(
            "editName"
        );

    const editPrice =
        document.getElementById(
            "editPrice"
        );

    const editCategory =
        document.getElementById(
            "editCategory"
        );

    const editImage =
        document.getElementById(
            "editImage"
        );

    const editDescription =
        document.getElementById(
            "editDescription"
        );

    const preview =
        document.getElementById(
            "editImagePreview"
        );

    if (editName) {

        editName.value =
            product.name;

    }

    if (editPrice) {

        editPrice.value =
            product.price;

    }

    if (editCategory) {

        editCategory.value =
            product.category || "";

    }

    if (editImage) {

        editImage.value =
            product.image || "";

    }

    if (editDescription) {

        editDescription.value =
            product.description || "";

    }

    if (preview) {

        preview.src =
            product.image ||
            DEFAULT_IMAGE;

        preview.onerror =
            function() {

                this.onerror = null;

                this.src =
                    DEFAULT_IMAGE;

            };

    }

    const editImageFile =
        document.getElementById(
            "editImageFile"
        );

    if (editImageFile) {

        editImageFile.addEventListener(
            "change",
            function() {

                const file =
                    this.files[0];

                if (!file) {

                    return;

                }

                if (
                    !file.type.startsWith(
                        "image/"
                    )
                ) {

                    alert(
                        "❌ শুধু Image নির্বাচন করুন"
                    );

                    this.value = "";

                    return;

                }

                const reader =
                    new FileReader();

                reader.onload =
                    function(e) {

                        if (preview) {

                            preview.src =
                                e.target.result;

                        }

                    };

                reader.readAsDataURL(file);

            }
        );

    }

    if (editImage) {

        editImage.addEventListener(
            "input",
            function() {

                if (
                    editImageFile &&
                    editImageFile.files.length > 0
                ) {

                    return;

                }

                if (preview) {

                    preview.src =
                        this.value ||
                        DEFAULT_IMAGE;

                }

            }
        );

    }

    form.addEventListener(
        "submit",
        async function(e) {

            e.preventDefault();

            const name =
                editName
                ?
                editName.value.trim()
                :
                "";

            const price =
                editPrice
                ?
                Number(editPrice.value)
                :
                0;

            const category =
                editCategory
                ?
                editCategory.value.trim()
                :
                "";

            const description =
                editDescription
                ?
                editDescription.value.trim()
                :
                "";

            let image =
                editImage
                ?
                editImage.value.trim()
                :
                "";

            if (
                editImageFile &&
                editImageFile.files &&
                editImageFile.files.length > 0
            ) {

                image =
                    preview &&
                    preview.src
                    ?
                    preview.src
                    :
                    image;

            }

            if (!image) {

                image =
                    DEFAULT_IMAGE;

            }

            if (!name || !price) {

                alert(
                    "❌ Product Name ও Price দিন"
                );

                return;

            }

            if (
                image.startsWith("data:image") &&
                image.length > 950000
            ) {

                alert(
                    "❌ ছবিটি অনেক বড়। ছোট সাইজের ছবি ব্যবহার করুন।"
                );

                return;

            }

            const submitButton =
                form.querySelector(
                    'button[type="submit"]'
                );

            if (submitButton) {

                submitButton.disabled =
                    true;

                submitButton.innerText =
                    "⏳ Update হচ্ছে...";

            }

            try {

                await updateProductInFirebase(
                    product.id,
                    {

                        name:
                            name,

                        price:
                            price,

                        category:
                            category,

                        image:
                            image,

                        description:
                            description

                    }
                );

                product.name =
                    name;

                product.price =
                    price;

                product.category =
                    category;

                product.image =
                    image;

                product.description =
                    description;

                saveProducts();

                alert(
                    "✅ Product সফলভাবে Update হয়েছে"
                );

                window.location.href =
                    "admin.html";

            }

            catch (error) {

                alert(
                    "❌ Product Update করা যায়নি.\n\n" +
                    error.message
                );

            }

            finally {

                if (submitButton) {

                    submitButton.disabled =
                        false;

                    submitButton.innerText =
                        "Update Product";

                }

            }

        }
    );

}


// ======================================================
// PRODUCTS ADMIN PAGE
// ======================================================

function loadProductsAdmin() {

    const container =
        document.getElementById(
            "productsAdminList"
        );

    const total =
        document.getElementById(
            "productsAdminTotal"
        );

    if (!container) {

        return;

    }

    if (total) {

        total.innerText =
            products.length;

    }

    if (products.length === 0) {

        container.innerHTML = `

            <div class="card">

                <h2 style="text-align:center;">
                    📦 কোনো Product নেই
                </h2>

            </div>

        `;

        return;

    }

    let html = "";

    products.forEach(
        function(product, index) {

            html += `

            <div class="card">

                <div style="text-align:center;">

                    <img
                        src="${escapeHTML(
                            product.image || DEFAULT_IMAGE
                        )}"
                        alt="${escapeHTML(product.name)}"
                        onerror="this.onerror=null;this.src='${DEFAULT_IMAGE}'"
                        style="
                            width:180px;
                            height:180px;
                            object-fit:contain;
                            border-radius:10px;
                        "
                    >

                </div>

                <h3>
                    📦 ${escapeHTML(product.name)}
                </h3>

                <p class="price">
                    💰 ৳${Number(product.price) || 0}
                </p>

                <p>
                    📝 ${escapeHTML(
                        product.description ||
                        "কোনো বিবরণ নেই"
                    )}
                </p>

                <div class="btn-group">

                    <button
                        class="btn-small"
                        onclick="
                            editProduct(${index})
                        ">

                        ✏️ Edit

                    </button>

                    <button
                        class="btn-small"
                        onclick="
                            deleteProduct(${index})
                        ">

                        🗑️ Delete

                    </button>

                </div>

            </div>

            `;

        }
    );

    container.innerHTML =
        html;

}


// ======================================================
// SEARCH ADMIN PRODUCTS
// ======================================================

function searchAdminProducts() {

    const search =
        document.getElementById(
            "adminProductSearch"
        );

    const container =
        document.getElementById(
            "productsAdminList"
        );

    if (!search || !container) {

        return;

    }

    const keyword =
        search.value
            .toLowerCase()
            .trim();

    const result =
        products.filter(
            function(product) {

                return (

                    safeText(product.name)
                        .toLowerCase()
                        .includes(keyword)

                    ||

                    safeText(product.category)
                        .toLowerCase()
                        .includes(keyword)

                );

            }
        );

    if (result.length === 0) {

        container.innerHTML = `

            <div class="card">

                <h2 style="text-align:center;">
                    ❌ কোনো Product পাওয়া যায়নি
                </h2>

            </div>

        `;

        return;

    }

    let html = "";

    result.forEach(
        function(product) {

            const index =
                products.findIndex(
                    function(item) {

                        return (
                            String(item.id) ===
                            String(product.id)
                        );

                    }
                );

            html += `

            <div class="card">

                <div style="text-align:center;">

                    <img
                        src="${escapeHTML(
                            product.image || DEFAULT_IMAGE
                        )}"
                        alt="${escapeHTML(product.name)}"
                        onerror="this.onerror=null;this.src='${DEFAULT_IMAGE}'"
                        style="
                            width:180px;
                            height:180px;
                            object-fit:contain;
                            border-radius:10px;
                        "
                    >

                </div>

                <h3>
                    📦 ${escapeHTML(product.name)}
                </h3>

                <p class="price">
                    💰 ৳${Number(product.price) || 0}
                </p>

                <p>
                    📝 ${escapeHTML(
                        product.description ||
                        "কোনো বিবরণ নেই"
                    )}
                </p>

                <div class="btn-group">

                    <button
                        class="btn-small"
                        onclick="
                            editProduct(${index})
                        ">

                        ✏️ Edit

                    </button>

                    <button
                        class="btn-small"
                        onclick="
                            deleteProduct(${index})
                        ">

                        🗑️ Delete

                    </button>

                </div>

            </div>

            `;

        }
    );

    container.innerHTML =
        html;

}


// ======================================================
// ALL ORDERS PAGE
// ======================================================

function loadOrdersPage() {

    const container =
        document.getElementById(
            "ordersPageList"
        );

    const totalElement =
        document.getElementById(
            "ordersPageTotal"
        );

    if (!container) {

        return;

    }

    if (totalElement) {

        totalElement.innerText =
            orders.length;

    }

    if (orders.length === 0) {

        container.innerHTML = `

            <div class="card">

                <h2 style="text-align:center;">
                    📭 এখনো কোনো Order নেই
                </h2>

            </div>

        `;

        return;

    }

    let html = "";

    orders.forEach(
        function(order, index) {

            let total = 0;

            if (
                Array.isArray(
                    order.products
                )
            ) {

                order.products.forEach(
                    function(item) {

                        total +=
                            Number(item.price) || 0;

                    }
                );

            }

            html += `

            <div class="card">

                <h3>
                    🆔 ${escapeHTML(order.id)}
                </h3>

                <p>
                    👤 <strong>
                    ${escapeHTML(order.name)}
                    </strong>
                </p>

                <p>
                    📞 ${escapeHTML(order.phone)}
                </p>

                <p>
                    📍 ${escapeHTML(order.address)}
                </p>

                <p>
                    💳 ${escapeHTML(
                        order.payment || "N/A"
                    )}
                </p>

                <p>
                    📦 মোট পণ্য:
                    ${order.products.length}
                </p>

                <p class="price">
                    💰 মোট:
                    ৳${total}
                </p>

                <p>
                    📅 ${escapeHTML(order.date)}
                </p>

                <p>
                    📌 Status:
                    <strong>
                    ${escapeHTML(
                        order.status ||
                        "Pending"
                    )}
                    </strong>
                </p>

                <hr>

                <h4>
                    📦 Products
                </h4>

                ${
                    Array.isArray(order.products)
                    ?
                    order.products
                        .map(
                            function(item) {

                                return `

                                <p>
                                    • ${escapeHTML(item.name)}
                                    — ৳${Number(item.price) || 0}
                                </p>

                                `;

                            }
                        )
                        .join("")
                    :
                    ""
                }

                <div class="btn-group">

                    <button
                        class="btn-small"
                        onclick="
                            updateOrderStatus(
                                ${index},
                                'Pending'
                            )
                        ">

                        ⏳ Pending

                    </button>

                    <button
                        class="btn-small"
                        onclick="
                            updateOrderStatus(
                                ${index},
                                'Confirmed'
                            )
                        ">

                        ✅ Confirmed

                    </button>

                    <button
                        class="btn-small"
                        onclick="
                            updateOrderStatus(
                                ${index},
                                'Delivered'
                            )
                        ">

                        🚚 Delivered

                    </button>

                    <button
                        class="btn-small"
                        onclick="
                            updateOrderStatus(
                                ${index},
                                'Cancelled'
                            )
                        ">

                        ❌ Cancelled

                    </button>

                </div>

            </div>

            `;

        }
    );

    container.innerHTML =
        html;

}


// ======================================================
// CUSTOMERS PAGE
// ======================================================

function loadCustomersPage() {

    const container =
        document.getElementById(
            "customersPageList"
        );

    const totalElement =
        document.getElementById(
            "customersPageTotal"
        );

    if (!container) {

        return;

    }

    const customerMap = {};

    orders.forEach(
        function(order) {

            const phone =
                String(
                    order.phone || ""
                ).trim();

            if (!phone) {

                return;

            }

            if (!customerMap[phone]) {

                customerMap[phone] = {

                    name:
                        order.name ||
                        "Unknown",

                    phone:
                        phone,

                    address:
                        order.address ||
                        "",

                    orders:
                        0,

                    total:
                        0

                };

            }

            customerMap[phone].orders += 1;

            let orderTotal = 0;

            if (
                Array.isArray(
                    order.products
                )
            ) {

                order.products.forEach(
                    function(item) {

                        orderTotal +=
                            Number(item.price) || 0;

                    }
                );

            }

            customerMap[phone].total +=
                orderTotal;

            customerMap[phone].name =
                order.name ||
                customerMap[phone].name;

            customerMap[phone].address =
                order.address ||
                customerMap[phone].address;

        }
    );

    const customers =
        Object.values(
            customerMap
        );

    if (totalElement) {

        totalElement.innerText =
            customers.length;

    }

    if (customers.length === 0) {

        container.innerHTML = `

            <div class="card">

                <h2 style="text-align:center;">
                    👤 এখনো কোনো Customer নেই
                </h2>

            </div>

        `;

        return;

    }

    let html = "";

    customers.forEach(
        function(customer) {

            html += `

            <div class="card">

                <h3>
                    👤 ${escapeHTML(customer.name)}
                </h3>

                <p>
                    📞 <strong>
                    ${escapeHTML(customer.phone)}
                    </strong>
                </p>

                <p>
                    📍 ${escapeHTML(customer.address)}
                </p>

                <p>
                    🛒 মোট Order:
                    <strong>
                    ${customer.orders}
                    </strong>
                </p>

                <p class="price">
                    💰 মোট কেনাকাটা:
                    <strong>
                    ৳${customer.total}
                    </strong>
                </p>

                <div class="btn-group">

                    <a
                        href="tel:${escapeHTML(customer.phone)}"
                        class="btn-small">

                        📞 Call

                    </a>

                    <a
                        href="https://wa.me/88${customer.phone.replace(/[^0-9]/g, '')}"
                        class="btn-small"
                        target="_blank">

                        💬 WhatsApp

                    </a>

                </div>

            </div>

            `;

        }
    );

    container.innerHTML =
        html;

}


// ======================================================
// PENDING ORDERS PAGE
// ======================================================

function loadPendingOrdersPage() {

    const container =
        document.getElementById(
            "pendingOrdersList"
        );

    const totalElement =
        document.getElementById(
            "pendingPageTotal"
        );

    if (!container) {

        return;

    }

    const pendingOrders =
        orders.filter(
            function(order) {

                return (
                    !order.status ||
                    order.status === "Pending"
                );

            }
        );

    if (totalElement) {

        totalElement.innerText =
            pendingOrders.length;

    }

    if (pendingOrders.length === 0) {

        container.innerHTML = `

            <div class="card">

                <h2 style="text-align:center;">
                    ✅ কোনো Pending Order নেই
                </h2>

                <p style="text-align:center;">
                    সব অর্ডার বর্তমানে Process করা হয়েছে।
                </p>

            </div>

        `;

        return;

    }

    let html = "";

    pendingOrders.forEach(
        function(order) {

            const originalIndex =
                orders.findIndex(
                    function(item) {

                        return (
                            String(item.id) ===
                            String(order.id)
                        );

                    }
                );

            let total = 0;

            if (
                Array.isArray(
                    order.products
                )
            ) {

                order.products.forEach(
                    function(item) {

                        total +=
                            Number(item.price) || 0;

                    }
                );

            }

            html += `

            <div class="card">

                <h3>
                    ⏳ Pending Order
                </h3>

                <p>
                    🆔 Order ID:
                    <strong>
                    ${escapeHTML(order.id)}
                    </strong>
                </p>

                <p>
                    👤 Customer:
                    <strong>
                    ${escapeHTML(order.name)}
                    </strong>
                </p>

                <p>
                    📞 Phone:
                    ${escapeHTML(order.phone)}
                </p>

                <p>
                    📍 Address:
                    ${escapeHTML(order.address)}
                </p>

                <p>
                    💳 Payment:
                    ${escapeHTML(
                        order.payment || "N/A"
                    )}
                </p>

                <p>
                    📅 Date:
                    ${escapeHTML(order.date)}
                </p>

                <hr>

                <h4>
                    📦 Ordered Products
                </h4>

                ${
                    Array.isArray(order.products)
                    ?
                    order.products
                        .map(
                            function(item) {

                                return `

                                <p>
                                    • ${escapeHTML(item.name)}
                                    — ৳${Number(item.price) || 0}
                                </p>

                                `;

                            }
                        )
                        .join("")
                    :
                    "<p>কোনো Product তথ্য নেই</p>"
                }

                <p class="price">

                    💰 মোট:
                    <strong>
                    ৳${total}
                    </strong>

                </p>

                <p>

                    📌 Status:
                    <strong>
                    Pending
                    </strong>

                </p>

                <div class="btn-group">

                    <button
                        class="btn-small"
                        onclick="
                            updatePendingOrderStatus(
                                ${originalIndex},
                                'Confirmed'
                            )
                        ">

                        ✅ Confirm Order

                    </button>

                    <button
                        class="btn-small"
                        onclick="
                            updatePendingOrderStatus(
                                ${originalIndex},
                                'Cancelled'
                            )
                        ">

                        ❌ Cancel Order

                    </button>

                </div>

            </div>

            `;

        }
    );

    container.innerHTML =
        html;

}


// ======================================================
// UPDATE PENDING ORDER
// ======================================================

async function updatePendingOrderStatus(
    index,
    status
) {

    if (!orders[index]) {

        alert(
            "❌ Order পাওয়া যায়নি"
        );

        return;

    }

    if (
        !confirm(
            status === "Confirmed"
            ?
            "আপনি কি এই Order Confirm করতে চান?"
            :
            "আপনি কি এই Order Cancel করতে চান?"
        )
    ) {

        return;

    }

    await updateOrderStatus(
        index,
        status
    );

    loadPendingOrdersPage();

}


// ======================================================
// DASHBOARD STATISTICS
// ======================================================

function loadDashboardStats() {

    const totalProducts =
        document.getElementById(
            "totalProducts"
        );

    if (totalProducts) {

        totalProducts.innerText =
            products.length;

    }

    const totalOrders =
        document.getElementById(
            "totalOrders"
        );

    const pendingOrders =
        document.getElementById(
            "pendingOrders"
        );

    const confirmedOrders =
        document.getElementById(
            "confirmedOrders"
        );

    const deliveredOrders =
        document.getElementById(
            "deliveredOrders"
        );

    const cancelledOrders =
        document.getElementById(
            "cancelledOrders"
        );

    const allOrders =
        orders;

    if (totalOrders) {

        totalOrders.innerText =
            allOrders.length;

    }

    let pending = 0;

    let confirmed = 0;

    let delivered = 0;

    let cancelled = 0;

    allOrders.forEach(
        function(order) {

            const status =
                order.status ||
                "Pending";

            if (
                status === "Pending"
            ) {

                pending++;

            }

            else if (
                status === "Confirmed"
            ) {

                confirmed++;

            }

            else if (
                status === "Delivered"
            ) {

                delivered++;

            }

            else if (
                status === "Cancelled"
            ) {

                cancelled++;

            }

        }
    );

    if (pendingOrders) {

        pendingOrders.innerText =
            pending;

    }

    if (confirmedOrders) {

        confirmedOrders.innerText =
            confirmed;

    }

    if (deliveredOrders) {

        deliveredOrders.innerText =
            delivered;

    }

    if (cancelledOrders) {

        cancelledOrders.innerText =
            cancelled;

    }

    const totalCustomers =
        document.getElementById(
            "totalCustomers"
        );

    const customers =
        [];

    allOrders.forEach(
        function(order) {

            if (
                order.phone &&
                !customers.includes(
                    order.phone
                )
            ) {

                customers.push(
                    order.phone
                );

            }

        }
    );

    if (totalCustomers) {

        totalCustomers.innerText =
            customers.length;

    }

    const totalSales =
        document.getElementById(
            "totalSales"
        );

    let sales = 0;

    allOrders.forEach(
        function(order) {

            if (
                order.status ===
                "Delivered"
            ) {

                if (
                    Array.isArray(
                        order.products
                    )
                ) {

                    order.products.forEach(
                        function(item) {

                            sales +=
                                Number(item.price) || 0;

                        }
                    );

                }

            }

        }
    );

    if (totalSales) {

        totalSales.innerText =
            "৳" +
            sales;

    }

}


// ======================================================
// INITIALIZE
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    async function() {

        updateCartCount();

        loadCart();

        loadProducts();

        loadSingleProduct();

        loadAdminProducts();

        loadProductsAdmin();

        loadOrders();

        loadOrdersPage();

        loadCustomersPage();

        loadPendingOrdersPage();

        loadDashboardStats();

        loadEditProduct();

        await loadProductsFromFirebase();

        await loadOrdersFromFirebase();

    }
);


// ======================================================
// END OF SCRIPT
// ======================================================

// ======================================================
// IFFAH SHOP - COMPLETE FIREBASE SCRIPT
// Product + Cart + Order + Admin + Customer + Dashboard
// ======================================================


// ======================================================
// GLOBAL DATA
// ======================================================

let products = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let orders = [];


// ======================================================
// FIREBASE CHECK
// ======================================================

if (typeof firebase === "undefined") {
    console.error("❌ Firebase SDK Load হয়নি");
}

if (typeof db === "undefined") {
    console.error("❌ Firestore DB পাওয়া যায়নি");
}


// ======================================================
// LOCAL STORAGE - CART
// ======================================================

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}


// ======================================================
// CART COUNTER
// ======================================================

function updateCartCount() {

    const count = document.getElementById("cart-count");

    if (count) {
        count.innerText = cart.length;
    }
}

updateCartCount();


// ======================================================
// DARK MODE
// ======================================================

function darkMode() {
    document.body.classList.toggle("dark");
}


// ======================================================
// SAFE HTML
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
// ESCAPE QUOTES FOR BUTTON
// ======================================================

function escapeQuotes(text) {

    return String(text || "")
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'");
}


// ======================================================
// FIREBASE PRODUCT LOAD
// ======================================================

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

                image: data.image || "images/no-image.png",

                description: data.description || "",

                createdAt: data.createdAt || ""

            });

        });


        // নতুন Product আগে
        products.sort(function(a, b) {

            const aTime =
                a.createdAt && a.createdAt.toMillis
                    ? a.createdAt.toMillis()
                    : 0;

            const bTime =
                b.createdAt && b.createdAt.toMillis
                    ? b.createdAt.toMillis()
                    : 0;

            return bTime - aTime;

        });


        console.log(
            "🔥 Firebase থেকে Product Load হয়েছে:",
            products.length
        );


        // সব Product UI reload
        loadProducts();
        loadProductsAdmin();
        loadProductsAdminPage();
        loadSingleProduct();
        loadEditProduct();

        loadDashboardStats();

    }

    catch (error) {

        console.error(
            "❌ Firebase Product Load Error:",
            error
        );

        const container =
            document.getElementById("productList");

        if (container) {

            container.innerHTML = `
                <div class="card"
                     style="grid-column:1/-1;text-align:center;padding:30px;">

                    <h2>❌ Product Load করা যায়নি</h2>

                    <p>
                        Firebase connection অথবা Firestore Rules পরীক্ষা করুন।
                    </p>

                </div>
            `;

        }

    }

}


// ======================================================
// ADD PRODUCT TO FIREBASE
// ======================================================

async function addProductToFirebase(productData) {

    try {

        const docRef =
            await db
                .collection("products")
                .add({

                    name: productData.name,

                    price: Number(productData.price),

                    category: productData.category || "",

                    image:
                        productData.image ||
                        "images/no-image.png",

                    description:
                        productData.description || "",

                    createdAt:
                        firebase.firestore.FieldValue.serverTimestamp()

                });


        console.log(
            "✅ Product Firebase-এ Added:",
            docRef.id
        );


        return docRef.id;

    }

    catch (error) {

        console.error(
            "❌ Product Add Error:",
            error
        );

        throw error;

    }

}


// ======================================================
// UPDATE PRODUCT FIREBASE
// ======================================================

async function updateProductInFirebase(
    productId,
    productData
) {

    try {

        await db
            .collection("products")
            .doc(productId)
            .update({

                name: productData.name,

                price: Number(productData.price),

                category:
                    productData.category || "",

                image:
                    productData.image ||
                    "images/no-image.png",

                description:
                    productData.description || "",

                updatedAt:
                    firebase.firestore.FieldValue.serverTimestamp()

            });


        console.log(
            "✅ Product Firebase-এ Updated:",
            productId
        );


    }

    catch (error) {

        console.error(
            "❌ Product Update Error:",
            error
        );

        throw error;

    }

}


// ======================================================
// DELETE PRODUCT FIREBASE
// ======================================================

async function deleteProductFromFirebase(productId) {

    try {

        await db
            .collection("products")
            .doc(productId)
            .delete();


        console.log(
            "🗑️ Product Firebase থেকে Deleted:",
            productId
        );

    }

    catch (error) {

        console.error(
            "❌ Product Delete Error:",
            error
        );

        throw error;

    }

}


// ======================================================
// ADD TO CART
// ======================================================

function addToCart(name, price, productId) {

    cart.push({

        id: productId || Date.now(),

        productId: productId || "",

        name: name,

        price: Number(price) || 0

    });


    saveCart();

    updateCartCount();


    alert(
        "✅ " + name + " কার্টে যোগ হয়েছে"
    );

}


// ======================================================
// BUY NOW
// ======================================================

function buyNow(name, price, productId) {

    cart = [];


    cart.push({

        id: productId || Date.now(),

        productId: productId || "",

        name: name,

        price: Number(price) || 0

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
// LOAD PRODUCTS - HOMEPAGE
// ======================================================

function loadProducts() {

    const container =
        document.getElementById("productList");


    if (!container) {
        return;
    }


    if (products.length === 0) {

        container.innerHTML = `

            <div class="card"
                 style="grid-column:1/-1;text-align:center;padding:30px;">

                <h2>📦 কোনো Product নেই</h2>

                <p>
                    শীঘ্রই নতুন পণ্য যুক্ত করা হবে।
                </p>

            </div>

        `;

        return;
    }


    const featuredProducts =
        products.slice(0, 6);


    let html = "";


    featuredProducts.forEach(function(product) {

        html += `

        <div class="product-card professional-product-card">

            <div class="professional-product-image">

                <img
                    src="${escapeHTML(product.image || "images/no-image.png")}"
                    alt="${escapeHTML(product.name)}"
                    onerror="this.src='images/no-image.png'"
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
                            product.description.substring(0,70) + "..."
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
                        class="professional-btn details-btn"
                    >
                        👁️ বিস্তারিত
                    </a>


                    <button
                        class="professional-btn cart-btn"
                        onclick="addToCart(
                            '${escapeQuotes(product.name)}',
                            ${Number(product.price) || 0},
                            '${escapeQuotes(product.id)}'
                        )"
                    >
                        🛒 কার্ট
                    </button>


                    <button
                        class="professional-btn order-btn"
                        onclick="buyNow(
                            '${escapeQuotes(product.name)}',
                            ${Number(product.price) || 0},
                            '${escapeQuotes(product.id)}'
                        )"
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
        products.filter(function(product) {

            return String(product.name)
                .toLowerCase()
                .includes(keyword);

        });


    if (result.length === 0) {

        container.innerHTML = `

            <div class="card"
                 style="grid-column:1/-1;text-align:center;">

                <h2>
                    ❌ কোনো Product পাওয়া যায়নি
                </h2>

            </div>

        `;

        return;
    }


    let html = "";


    result.forEach(function(product) {

        html += `

        <div class="product-card">

            <img
                src="${escapeHTML(product.image || "images/no-image.png")}"
                alt="${escapeHTML(product.name)}"
                onerror="this.src='images/no-image.png'"
            >


            <div class="product-info">

                <h3>
                    ${escapeHTML(product.name)}
                </h3>


                <p class="price">
                    ৳${Number(product.price) || 0}
                </p>


                <p>
                    ${escapeHTML(product.description || "")}
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
                        onclick="addToCart(
                            '${escapeQuotes(product.name)}',
                            ${Number(product.price) || 0},
                            '${escapeQuotes(product.id)}'
                        )"
                    >
                        🛒 কার্টে যোগ করুন
                    </button>


                    <button
                        class="btn-small"
                        onclick="buyNow(
                            '${escapeQuotes(product.name)}',
                            ${Number(product.price) || 0},
                            '${escapeQuotes(product.id)}'
                        )"
                    >
                        ⚡ Order Now
                    </button>

                </div>

            </div>

        </div>

        `;

    });


    container.innerHTML = html;

}


// ======================================================
// SINGLE PRODUCT - FIREBASE
// ======================================================

async function loadSingleProduct() {

    const productName =
        document.getElementById("productName");


    if (!productName) {
        return;
    }


    const params =
        new URLSearchParams(
            window.location.search
        );


    const id =
        params.get("id");


    if (!id) {

        showProductNotFound();

        return;

    }


    try {

        console.log(
            "🔎 Firebase Product Search:",
            id
        );


        let product = null;


        // প্রথমে Firebase থেকে সরাসরি ID দিয়ে খুঁজবে
        const doc =
            await db
                .collection("products")
                .doc(id)
                .get();


        if (doc.exists) {

            const data =
                doc.data();


            product = {

                id: doc.id,

                name: data.name || "",

                price:
                    Number(data.price) || 0,

                category:
                    data.category || "",

                image:
                    data.image ||
                    "images/no-image.png",

                description:
                    data.description || "",

                createdAt:
                    data.createdAt || ""

            };

        }


        if (!product) {

            showProductNotFound();

            return;

        }


        // ==============================
        // PRODUCT DATA
        // ==============================

        document.getElementById(
            "productName"
        ).innerText =
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

            imageElement.src =
                product.image ||
                "images/no-image.png";

            imageElement.onerror =
                function() {

                    this.src =
                        "images/no-image.png";

                };

        }


        // ==============================
        // CATEGORY
        // ==============================

        const categoryElement =
            document.getElementById(
                "productCategory"
            );


        if (categoryElement) {

            categoryElement.innerText =
                product.category || "";

        }


        // ==============================
        // ADD CART
        // ==============================

        const cartBtn =
            document.getElementById(
                "addCartBtn"
            );


        if (cartBtn) {

            cartBtn.onclick =
                function() {

                    addToCart(
                        product.name,
                        product.price,
                        product.id
                    );

                };

        }


        // ==============================
        // BUY NOW
        // ==============================

        const buyNowBtn =
            document.getElementById(
                "buyNowBtn"
            );


        if (buyNowBtn) {

            buyNowBtn.onclick =
                function() {

                    buyNow(
                        product.name,
                        product.price,
                        product.id
                    );

                };

        }


        // ==============================
        // WHATSAPP
        // ==============================

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

    catch (error) {

        console.error(
            "❌ Single Product Error:",
            error
        );

        showProductNotFound();

    }

}


// ======================================================
// PRODUCT NOT FOUND
// ======================================================

function showProductNotFound() {

    const details =
        document.querySelector(
            ".product-details"
        );


    if (details) {

        details.innerHTML = `

            <div class="card"
                 style="text-align:center;padding:30px;">

                <h2>
                    ❌ Product পাওয়া যায়নি
                </h2>

                <p>
                    Product টি Firebase-এ নেই অথবা ID ভুল।
                </p>

            </div>

        `;

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


    cart.forEach(function(item,index) {

        total +=
            Number(item.price) || 0;


        html += `

        <div class="card">

            <h3>
                ${escapeHTML(item.name)}
            </h3>

            <p class="price">
                ৳${Number(item.price) || 0}
            </p>

            <button
                class="btn-small"
                onclick="removeFromCart(${index})"
            >
                ❌ Remove
            </button>

        </div>

        `;

    });


    cartList.innerHTML =
        html;


    if (totalPrice) {

        totalPrice.innerText =
            "৳" + total;

    }

}


loadCart();


// ======================================================
// PRODUCT FORM
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


// ======================================================
// IMAGE PREVIEW
// ======================================================

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
// ADD PRODUCT FORM - FIREBASE
// ======================================================

if (productForm) {

    productForm.addEventListener(
        "submit",
        async function(e) {

            e.preventDefault();


            const name =
                document
                    .getElementById("name")
                    .value
                    .trim();


            const price =
                Number(
                    document
                        .getElementById("price")
                        .value
                );


            const imageURLElement =
                document.getElementById(
                    "image"
                );


            const imageURL =
                imageURLElement
                ?
                imageURLElement.value.trim()
                :
                "";


            const description =
                document
                    .getElementById(
                        "description"
                    )
                    .value
                    .trim();


            const categoryElement =
                document.getElementById(
                    "category"
                );


            const category =
                categoryElement
                ?
                categoryElement.value
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

                if (
                    imagePreview &&
                    imagePreview.src
                ) {

                    image =
                        imagePreview.src;

                }

            }


            if (!image) {

                image =
                    "images/no-image.png";

            }


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

                const productId =
                    await addProductToFirebase({

                        name: name,

                        price: price,

                        category: category,

                        image: image,

                        description: description

                    });


                alert(
                    "✅ Product Firebase-এ সফলভাবে Added!\n\n" +
                    "Product ID: " +
                    productId
                );


                productForm.reset();


                if (imagePreviewBox) {

                    imagePreviewBox.style.display =
                        "none";

                }


                if (imagePreview) {

                    imagePreview.src = "";

                }


                await loadProductsFromFirebase();


            }

            catch (error) {

                alert(
                    "❌ Product Save হয়নি!\n\n" +
                    error.message
                );

            }


            finally {

                if (submitButton) {

                    submitButton.disabled =
                        false;

                    submitButton.innerText =
                        "✅ Product Add করুন";

                }

            }

        }
    );

}


// ======================================================
// LOAD ORDERS FROM FIREBASE
// ======================================================

async function loadOrdersFromFirebase() {

    try {

        const snapshot =
            await db
                .collection("orders")
                .orderBy(
                    "createdAt",
                    "desc"
                )
                .get();


        orders = [];


        snapshot.forEach(function(doc) {

            const data =
                doc.data();


            orders.push({

                id: doc.id,

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
                    ?
                    data.products
                    :
                    [],

                status:
                    data.status || "Pending",

                date:
                    data.date || "",

                createdAt:
                    data.createdAt || ""

            });

        });


        console.log(
            "🔥 Firebase Orders:",
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


        // যদি orderBy-এর কারণে সমস্যা হয়
        try {

            const snapshot =
                await db
                    .collection("orders")
                    .get();


            orders = [];


            snapshot.forEach(function(doc) {

                const data =
                    doc.data();


                orders.push({

                    id: doc.id,

                    name:
                        data.name || "",

                    phone:
                        data.phone || "",

                    address:
                        data.address || "",

                    payment:
                        data.payment || "",

                    products:
                        data.products || [],

                    status:
                        data.status || "Pending",

                    date:
                        data.date || ""

                });

            });


            loadOrders();
            loadOrdersPage();
            loadCustomersPage();
            loadPendingOrdersPage();
            loadDashboardStats();

        }

        catch (secondError) {

            console.error(
                "❌ Orders Load Failed:",
                secondError
            );

        }

    }

}


// ======================================================
// CHECKOUT
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
                    "❌ নাম, মোবাইল, ঠিকানা ও পেমেন্ট পদ্ধতি পূরণ করুন"
                );

                return;

            }


            const orderData = {

                name: name,

                phone: phone,

                address: address,

                payment: payment,

                products: [...cart],

                status: "Pending",

                date:
                    new Date()
                        .toLocaleString("bn-BD"),

                createdAt:
                    firebase.firestore.FieldValue.serverTimestamp()

            };


            const submitButton =
                checkoutForm.querySelector(
                    'button[type="submit"]'
                );


            if (submitButton) {

                submitButton.disabled =
                    true;

                submitButton.innerText =
                    "⏳ Order Save হচ্ছে...";

            }


            try {

                const docRef =
                    await db
                        .collection("orders")
                        .add(orderData);


                console.log(
                    "✅ Order Firebase-এ Save হয়েছে:",
                    docRef.id
                );


                cart = [];

                saveCart();

                updateCartCount();


                alert(
                    "✅ আপনার অর্ডার সফলভাবে গ্রহণ করা হয়েছে!\n\n" +
                    "Order ID: " +
                    docRef.id
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
                    "❌ Order Save হয়নি!\n\n" +
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


    orders.forEach(function(order,index) {

        let total = 0;


        if (Array.isArray(order.products)) {

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
                    ${escapeHTML(order.status || "Pending")}
                </strong>
            </p>

            <div class="btn-group">

                <button
                    class="btn-small"
                    onclick="updateOrderStatus(
                        '${escapeQuotes(order.id)}',
                        'Pending'
                    )"
                >
                    🟡 Pending
                </button>

                <button
                    class="btn-small"
                    onclick="updateOrderStatus(
                        '${escapeQuotes(order.id)}',
                        'Confirmed'
                    )"
                >
                    🟢 Confirmed
                </button>

                <button
                    class="btn-small"
                    onclick="updateOrderStatus(
                        '${escapeQuotes(order.id)}',
                        'Delivered'
                    )"
                >
                    🚚 Delivered
                </button>

                <button
                    class="btn-small"
                    onclick="updateOrderStatus(
                        '${escapeQuotes(order.id)}',
                        'Cancelled'
                    )"
                >
                    ❌ Cancelled
                </button>

            </div>

        </div>

        `;

    });


    container.innerHTML =
        html;

}


// ======================================================
// UPDATE ORDER STATUS - FIREBASE
// ======================================================

async function updateOrderStatus(
    orderId,
    status
) {

    try {

        await db
            .collection("orders")
            .doc(orderId)
            .update({

                status: status,

                updatedAt:
                    firebase.firestore.FieldValue.serverTimestamp()

            });


        alert(
            "✅ Order Status Updated: " +
            status
        );


        await loadOrdersFromFirebase();

    }

    catch (error) {

        console.error(
            "❌ Order Status Error:",
            error
        );


        alert(
            "❌ Status Update হয়নি!\n\n" +
            error.message
        );

    }

}


// ======================================================
// ADMIN PRODUCT MANAGEMENT
// ======================================================

function loadProductsAdmin() {

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


    products.forEach(function(product,index) {

        html += `

        <div class="card">

            <div style="text-align:center;">

                <img
                    src="${escapeHTML(product.image || "images/no-image.png")}"
                    alt="${escapeHTML(product.name)}"
                    onerror="this.src='images/no-image.png'"
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
                💰 ৳${product.price}
            </p>


            <p>
                📂 ${escapeHTML(product.category || "")}
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
                    onclick="editProduct('${escapeQuotes(product.id)}')"
                >
                    ✏️ Edit
                </button>


                <button
                    class="btn-small"
                    onclick="deleteProduct('${escapeQuotes(product.id)}')"
                >
                    🗑️ Delete
                </button>

            </div>

        </div>

        `;

    });


    container.innerHTML =
        html;

}


// ======================================================
// PRODUCTS ADMIN PAGE
// ======================================================

function loadProductsAdminPage() {

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


    products.forEach(function(product) {

        html += `

        <div class="card">

            <div style="text-align:center;">

                <img
                    src="${escapeHTML(product.image || "images/no-image.png")}"
                    alt="${escapeHTML(product.name)}"
                    onerror="this.src='images/no-image.png'"
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
                💰 ৳${product.price}
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
                    onclick="editProduct('${escapeQuotes(product.id)}')"
                >
                    ✏️ Edit
                </button>


                <button
                    class="btn-small"
                    onclick="deleteProduct('${escapeQuotes(product.id)}')"
                >
                    🗑️ Delete
                </button>

            </div>

        </div>

        `;

    });


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
        products.filter(function(product) {

            return String(product.name)
                .toLowerCase()
                .includes(keyword);

        });


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


    result.forEach(function(product) {

        html += `

        <div class="card">

            <div style="text-align:center;">

                <img
                    src="${escapeHTML(product.image || "images/no-image.png")}"
                    alt="${escapeHTML(product.name)}"
                    onerror="this.src='images/no-image.png'"
                    style="
                        width:180px;
                        height:180px;
                        object-fit:contain;
                    "
                >

            </div>


            <h3>
                📦 ${escapeHTML(product.name)}
            </h3>


            <p class="price">
                💰 ৳${product.price}
            </p>


            <p>
                📝 ${escapeHTML(
                    product.description || ""
                )}
            </p>


            <div class="btn-group">

                <button
                    class="btn-small"
                    onclick="editProduct('${escapeQuotes(product.id)}')"
                >
                    ✏️ Edit
                </button>


                <button
                    class="btn-small"
                    onclick="deleteProduct('${escapeQuotes(product.id)}')"
                >
                    🗑️ Delete
                </button>

            </div>

        </div>

        `;

    });


    container.innerHTML =
        html;

}


// ======================================================
// EDIT PRODUCT
// ======================================================

function editProduct(productId) {

    if (!productId) {

        alert(
            "❌ Product ID পাওয়া যায়নি"
        );

        return;

    }


    window.location.href =
        "edit-product.html?id=" +
        encodeURIComponent(productId);

}


// ======================================================
// DELETE PRODUCT
// ======================================================

async function deleteProduct(productId) {

    if (!productId) {

        alert(
            "❌ Product ID পাওয়া যায়নি"
        );

        return;

    }


    const product =
        products.find(function(item) {

            return item.id === productId;

        });


    if (!product) {

        alert(
            "❌ Product পাওয়া যায়নি"
        );

        return;

    }


    const confirmDelete =
        confirm(

            "⚠️ আপনি কি এই Product মুছে ফেলতে চান?\n\n" +

            "📦 Product: " +
            product.name +
            "\n\n" +

            "💰 দাম: ৳" +
            product.price

        );


    if (!confirmDelete) {
        return;
    }


    try {

        await deleteProductFromFirebase(
            productId
        );


        alert(
            "✅ Product Firebase থেকে Delete হয়েছে"
        );


        await loadProductsFromFirebase();

    }

    catch (error) {

        alert(
            "❌ Product Delete হয়নি!\n\n" +
            error.message
        );

    }

}


// ======================================================
// EDIT PRODUCT PAGE
// ======================================================

async function loadEditProduct() {

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


    if (!id) {

        alert(
            "❌ Product ID পাওয়া যায়নি"
        );

        return;

    }


    try {

        const doc =
            await db
                .collection("products")
                .doc(id)
                .get();


        if (!doc.exists) {

            alert(
                "❌ Firebase-এ Product পাওয়া যায়নি"
            );

            window.location.href =
                "admin.html";

            return;

        }


        const data =
            doc.data();


        const product = {

            id: doc.id,

            name:
                data.name || "",

            price:
                Number(data.price) || 0,

            category:
                data.category || "",

            image:
                data.image ||
                "images/no-image.png",

            description:
                data.description || ""

        };


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


        if (editName)
            editName.value =
                product.name;


        if (editPrice)
            editPrice.value =
                product.price;


        if (editCategory)
            editCategory.value =
                product.category;


        if (editImage)
            editImage.value =
                product.image;


        if (editDescription)
            editDescription.value =
                product.description;


        const preview =
            document.getElementById(
                "editImagePreview"
            );


        if (preview) {

            preview.src =
                product.image ||
                "images/no-image.png";

        }


        // ==============================
        // EDIT IMAGE FILE
        // ==============================

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


        // ==============================
        // IMAGE URL PREVIEW
        // ==============================

        if (editImage) {

            editImage.addEventListener(
                "input",
                function() {

                    if (
                        !editImageFile ||
                        editImageFile.files.length === 0
                    ) {

                        if (preview) {

                            preview.src =
                                this.value ||
                                "images/no-image.png";

                        }

                    }

                }
            );

        }


        // ==============================
        // UPDATE FORM
        // ==============================

        if (
            !form.dataset.firebaseBound
        ) {

            form.dataset.firebaseBound =
                "true";


            form.addEventListener(
                "submit",
                async function(e) {

                    e.preventDefault();


                    const name =
                        document
                            .getElementById(
                                "editName"
                            )
                            .value
                            .trim();


                    const price =
                        Number(
                            document
                                .getElementById(
                                    "editPrice"
                                )
                                .value
                        );


                    const categoryElement =
                        document.getElementById(
                            "editCategory"
                        );


                    const category =
                        categoryElement
                        ?
                        categoryElement.value
                        :
                        "";


                    const description =
                        document
                            .getElementById(
                                "editDescription"
                            )
                            .value
                            .trim();


                    const imageURL =
                        document
                            .getElementById(
                                "editImage"
                            )
                            .value
                            .trim();


                    if (!name || !price) {

                        alert(
                            "❌ Product Name ও Price দিন"
                        );

                        return;

                    }


                    let image =
                        imageURL;


                    if (
                        editImageFile &&
                        editImageFile.files &&
                        editImageFile.files.length > 0
                    ) {

                        if (
                            preview &&
                            preview.src
                        ) {

                            image =
                                preview.src;

                        }

                    }


                    if (!image) {

                        image =
                            "images/no-image.png";

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
                            id,
                            {

                                name: name,

                                price: price,

                                category:
                                    category,

                                image: image,

                                description:
                                    description

                            }
                        );


                        alert(
                            "✅ Product Firebase-এ Update হয়েছে"
                        );


                        window.location.href =
                            "products.html";


                    }

                    catch (error) {

                        alert(
                            "❌ Product Update হয়নি!\n\n" +
                            error.message
                        );

                    }


                    finally {

                        if (submitButton) {

                            submitButton.disabled =
                                false;

                            submitButton.innerText =
                                "✅ Update Product";

                        }

                    }

                }
            );

        }

    }

    catch (error) {

        console.error(
            "❌ Edit Product Error:",
            error
        );


        alert(
            "❌ Product Load হয়নি!\n\n" +
            error.message
        );

    }

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


    orders.forEach(function(order) {

        let total = 0;


        if (Array.isArray(order.products)) {

            order.products.forEach(function(item) {

                total +=
                    Number(item.price) || 0;

            });

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
                💳 ${escapeHTML(order.payment)}
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
                        order.status || "Pending"
                    )}
                </strong>
            </p>

            <hr>

            <h4>
                📦 Products
            </h4>

            ${
                order.products
                .map(function(item) {

                    return `
                        <p>
                            • ${escapeHTML(item.name)}
                            — ৳${Number(item.price) || 0}
                        </p>
                    `;

                })
                .join("")
            }


            <div class="btn-group">

                <button
                    class="btn-small"
                    onclick="updateOrderStatus(
                        '${escapeQuotes(order.id)}',
                        'Pending'
                    )"
                >
                    ⏳ Pending
                </button>


                <button
                    class="btn-small"
                    onclick="updateOrderStatus(
                        '${escapeQuotes(order.id)}',
                        'Confirmed'
                    )"
                >
                    ✅ Confirmed
                </button>


                <button
                    class="btn-small"
                    onclick="updateOrderStatus(
                        '${escapeQuotes(order.id)}',
                        'Delivered'
                    )"
                >
                    🚚 Delivered
                </button>


                <button
                    class="btn-small"
                    onclick="updateOrderStatus(
                        '${escapeQuotes(order.id)}',
                        'Cancelled'
                    )"
                >
                    ❌ Cancelled
                </button>

            </div>

        </div>

        `;

    });


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


    orders.forEach(function(order) {

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
                    order.address || "",

                orders: 0,

                total: 0

            };

        }


        customerMap[phone].orders++;


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

    });


    const customers =
        Object.values(customerMap);


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


    customers.forEach(function(customer) {

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
                    class="btn-small"
                >
                    📞 Call
                </a>


                <a
                    href="https://wa.me/88${customer.phone.replace(/[^0-9]/g,'')}"
                    class="btn-small"
                    target="_blank"
                >
                    💬 WhatsApp
                </a>

            </div>

        </div>

        `;

    });


    container.innerHTML =
        html;

}


// ======================================================
// PENDING ORDERS
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
        orders.filter(function(order) {

            return (
                !order.status ||
                order.status === "Pending"
            );

        });


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


    pendingOrders.forEach(function(order) {

        let total = 0;


        if (
            Array.isArray(
                order.products
            )
        ) {

            order.products.forEach(function(item) {

                total +=
                    Number(item.price) || 0;

            });

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
                ${escapeHTML(order.payment)}
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
                order.products.map(function(item) {

                    return `
                        <p>
                            • ${escapeHTML(item.name)}
                            — ৳${Number(item.price) || 0}
                        </p>
                    `;

                }).join("")
                :
                "<p>কোনো Product তথ্য নেই</p>"
            }

            <p class="price">

                💰 মোট:
                <strong>
                    ৳${total}
                </strong>

            </p>


            <div class="btn-group">

                <button
                    class="btn-small"
                    onclick="updatePendingOrderStatus(
                        '${escapeQuotes(order.id)}',
                        'Confirmed'
                    )"
                >
                    ✅ Confirm Order
                </button>


                <button
                    class="btn-small"
                    onclick="updatePendingOrderStatus(
                        '${escapeQuotes(order.id)}',
                        'Cancelled'
                    )"
                >
                    ❌ Cancel Order
                </button>

            </div>

        </div>

        `;

    });


    container.innerHTML =
        html;

}


// ======================================================
// UPDATE PENDING ORDER
// ======================================================

async function updatePendingOrderStatus(
    orderId,
    status
) {

    if (!orderId) {
        return;
    }


    const message =
        status === "Confirmed"
        ?
        "আপনি কি এই Order Confirm করতে চান?"
        :
        "আপনি কি এই Order Cancel করতে চান?";


    if (!confirm(message)) {
        return;
    }


    try {

        await updateOrderStatus(
            orderId,
            status
        );

    }

    catch (error) {

        console.error(error);

    }

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


    if (totalOrders) {

        totalOrders.innerText =
            orders.length;

    }


    let pending = 0;
    let confirmed = 0;
    let delivered = 0;
    let cancelled = 0;


    orders.forEach(function(order) {

        const status =
            order.status ||
            "Pending";


        if (status === "Pending")
            pending++;


        else if (status === "Confirmed")
            confirmed++;


        else if (status === "Delivered")
            delivered++;


        else if (status === "Cancelled")
            cancelled++;

    });


    if (pendingOrders)
        pendingOrders.innerText =
            pending;


    if (confirmedOrders)
        confirmedOrders.innerText =
            confirmed;


    if (deliveredOrders)
        deliveredOrders.innerText =
            delivered;


    if (cancelledOrders)
        cancelledOrders.innerText =
            cancelled;


    // CUSTOMERS

    const totalCustomers =
        document.getElementById(
            "totalCustomers"
        );


    const uniquePhones =
        [];


    orders.forEach(function(order) {

        if (
            order.phone &&
            !uniquePhones.includes(
                order.phone
            )
        ) {

            uniquePhones.push(
                order.phone
            );

        }

    });


    if (totalCustomers) {

        totalCustomers.innerText =
            uniquePhones.length;

    }


    // TOTAL SALES

    const totalSales =
        document.getElementById(
            "totalSales"
        );


    let sales = 0;


    orders.forEach(function(order) {

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

    });


    if (totalSales) {

        totalSales.innerText =
            "৳" + sales;

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
                    .value;


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

    "orders.html",

    "customers.html"

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
// INITIALIZE FIREBASE DATA
// ======================================================

async function initializeAppData() {

    console.log(
        "🔥 IFFAH Shop Firebase System Starting..."
    );


    await loadProductsFromFirebase();

    await loadOrdersFromFirebase();


    loadCart();

    updateCartCount();


    console.log(
        "✅ IFFAH Shop Firebase System Ready"
    );

}


// ======================================================
// START
// ======================================================

initializeAppData();


// ======================================================
// END
// ======================================================

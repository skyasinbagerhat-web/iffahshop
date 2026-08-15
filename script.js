// ======================================================
// IFFAH SHOP - COMPLETE SCRIPT.JS
// Version 2.0
// ======================================================


// ======================================================
// LOCAL STORAGE
// ======================================================

let products = JSON.parse(localStorage.getItem("products")) || [];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

let orders = JSON.parse(localStorage.getItem("orders")) || [];


// ======================================================
// SAVE FUNCTIONS
// ======================================================

function saveProducts() {
    localStorage.setItem("products", JSON.stringify(products));
}

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function saveOrders() {
    localStorage.setItem("orders", JSON.stringify(orders));
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
// ADD TO CART
// ======================================================

function addToCart(name, price) {

    cart.push({
        id: Date.now(),
        name: name,
        price: Number(price)
    });

    saveCart();

    updateCartCount();

    alert("✅ " + name + " কার্টে যোগ হয়েছে");

}


// ======================================================
// BUY NOW
// ======================================================

function buyNow(name, price) {

    // শুধুমাত্র নির্বাচিত Product থাকবে
    cart = [];

    cart.push({
        id: Date.now(),
        name: name,
        price: Number(price)
    });

    saveCart();

    updateCartCount();

    // সরাসরি Checkout
    window.location.href = "checkout.html";

}


// ======================================================
// REMOVE FROM CART
// ======================================================

function removeFromCart(index) {

    if (index < 0 || index >= cart.length) {
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
        alert("🛒 কার্ট ইতিমধ্যে খালি");
        return;
    }

    if (!confirm("আপনি কি পুরো কার্ট খালি করতে চান?")) {
        return;
    }

    cart = [];

    saveCart();

    updateCartCount();

    loadCart();

}


// ======================================================
// LOAD PRODUCTS - PROFESSIONAL HOMEPAGE
// ======================================================
function loadProducts() {

    const container =
        document.getElementById("productList");

    if (!container) {
        return;
    }

    if (products.length === 0) {

        container.innerHTML = `
            <div class="card" style="
                grid-column:1/-1;
                text-align:center;
                padding:30px;
            ">
                <h2>📦 কোনো Product নেই</h2>
                <p>শীঘ্রই নতুন পণ্য যুক্ত করা হবে।</p>
            </div>
        `;

        return;
    }

    // Homepage-এ সর্বোচ্চ 6টি Product দেখাবে
    const featuredProducts =
        products.slice(-6).reverse();

    let html = "";

    featuredProducts.forEach(function(product) {

        html += `

        <div class="product-card professional-product-card">

            <!-- PRODUCT IMAGE -->
            <div class="professional-product-image">

                <img
                    src="${product.image || "images/no-image.png"}"
                    alt="${product.name}"
                    onerror="this.src='images/no-image.png'"
                >

            </div>


            <!-- PRODUCT INFO -->
            <div class="product-info">

                ${
                    product.category
                    ?
                    `<span class="product-category">
                        📂 ${product.category}
                    </span>`
                    :
                    ""
                }


                <h3>
                    ${product.name}
                </h3>


                <p class="price professional-price">
                    ৳${product.price}
                </p>


                <p class="professional-description">
                    ${
                        product.description
                        ?
                        product.description.length > 70
                        ?
                        product.description.substring(0, 70) + "..."
                        :
                        product.description
                        :
                        "মানসম্মত পণ্য"
                    }
                </p>


                <!-- BUTTONS -->
                <div class="professional-product-buttons">

                    <a
                        href="product.html?id=${product.id}"
                        class="professional-btn details-btn"
                    >
                        👁️ বিস্তারিত
                    </a>


                    <button
                        class="professional-btn cart-btn"
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
                        class="professional-btn order-btn"
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

    container.innerHTML = html;
}

loadProducts();


// ======================================================
// ESCAPE PRODUCT NAME
// ======================================================

function escapeQuotes(text) {

    return String(text)
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'")
        .replace(/"/g, '\\"');

}


// ======================================================
// SEARCH PRODUCT
// ======================================================

function searchProduct() {

    const search = document.getElementById("search");

    const container = document.getElementById("productList");

    if (!search || !container) {
        return;
    }

    const keyword = search.value.toLowerCase().trim();

    const result = products.filter(function(product) {

        return product.name
            .toLowerCase()
            .includes(keyword);

    });

    if (result.length === 0) {

        container.innerHTML = `
            <h2 style="text-align:center;">
                ❌ কোনো Product পাওয়া যায়নি
            </h2>
        `;

        return;
    }

    let html = "";

    result.forEach(function(product) {

        html += `

        <div class="product-card">

            <img
                src="${product.image || "images/no-image.png"}"
                alt="${product.name}"
            >

            <div class="product-info">

                <h3>${product.name}</h3>

                <p class="price">
                    ৳${product.price}
                </p>

                <p>
                    ${product.description || ""}
                </p>

                <div class="btn-group">

                    <a
                        href="product.html?id=${product.id}"
                        class="btn-small">

                        👁️ বিস্তারিত

                    </a>

                    <button
                        class="btn-small"
                        onclick="addToCart('${escapeQuotes(product.name)}', ${product.price})">

                        🛒 কার্টে যোগ করুন

                    </button>

                    <button
                        class="btn-small"
                        onclick="buyNow('${escapeQuotes(product.name)}', ${product.price})">

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
// SINGLE PRODUCT
// ======================================================

function loadSingleProduct() {

    const productName =
        document.getElementById("productName");

    if (!productName) {
        return;
    }

    const params =
        new URLSearchParams(window.location.search);

    const id =
        Number(params.get("id"));

    const product =
        products.find(function(item) {

            return item.id === id;

        });

    if (!product) {

        const details =
            document.querySelector(".product-details");

        if (details) {

            details.innerHTML = `
                <h2 style="text-align:center;">
                    ❌ Product পাওয়া যায়নি
                </h2>
            `;

        }

        return;
    }


    document.getElementById("productName").innerText =
        product.name;


    document.getElementById("productPrice").innerText =
        "৳" + product.price;


    document.getElementById("productDescription").innerText =
        product.description || "কোনো বিবরণ নেই";


    document.getElementById("productImage").src =
        product.image || "images/no-image.png";


    // ADD TO CART

    const cartBtn =
        document.getElementById("addCartBtn");

    if (cartBtn) {

        cartBtn.onclick = function() {

            addToCart(
                product.name,
                product.price
            );

        };

    }


    // ORDER NOW

    const buyNowBtn =
        document.getElementById("buyNowBtn");

    if (buyNowBtn) {

        buyNowBtn.onclick = function() {

            buyNow(
                product.name,
                product.price
            );

        };

    }


    // WHATSAPP

    const whatsappBtn =
        document.getElementById("whatsappBtn");

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

loadSingleProduct();


// ======================================================
// LOAD CART
// ======================================================

function loadCart() {

    const cartList =
        document.getElementById("cartList");

    const totalPrice =
        document.getElementById("totalPrice");

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
            totalPrice.innerText = "৳0";
        }

        return;
    }


    let html = "";

    let total = 0;


    cart.forEach(function(item, index) {

        total += Number(item.price);


        html += `

        <div class="card">

            <h3>
                ${item.name}
            </h3>

            <p class="price">
                ৳${item.price}
            </p>

            <button
                class="btn-small"
                onclick="removeFromCart(${index})">

                ❌ Remove

            </button>

        </div>

        `;

    });


    cartList.innerHTML = html;


    if (totalPrice) {

        totalPrice.innerText =
            "৳" + total;

    }

}

loadCart();


// ======================================================
// ADD PRODUCT + IMAGE PREVIEW
// ======================================================

const productForm =
document.getElementById("productForm");

const imageFile =
document.getElementById("imageFile");

const imagePreview =
document.getElementById("imagePreview");

const imagePreviewBox =
document.getElementById("imagePreviewBox");


// ======================================================
// GALLERY IMAGE PREVIEW
// ======================================================

if (imageFile) {

    imageFile.addEventListener("change", function () {

        const file = this.files[0];

        if (!file) {
            return;
        }

        if (!file.type.startsWith("image/")) {

            alert("❌ শুধু Image নির্বাচন করুন");

            this.value = "";

            return;
        }


        const reader = new FileReader();


        reader.onload = function (e) {

            imagePreview.src = e.target.result;

            imagePreviewBox.style.display = "block";

        };


        reader.readAsDataURL(file);

    });

}


// ======================================================
// PRODUCT ADD
// ======================================================

if (productForm) {

    productForm.addEventListener(
        "submit",
        function(e) {

            e.preventDefault();


            const name =
            document.getElementById("name")
            .value
            .trim();


            const price =
            Number(
                document.getElementById("price")
                .value
            );


            const imageURL =
            document.getElementById("image")
            .value
            .trim();


            const description =
            document.getElementById("description")
            .value
            .trim();

            const category =
    document.getElementById("category")
    .value;


            if (!name || !price) {

                alert(
                    "❌ Product Name ও Price দিন"
                );

                return;
            }


            // ==========================================
            // IMAGE
            // ==========================================

            let image = imageURL;


            // Gallery থেকে ছবি নেওয়া হলে
            if (
                imageFile &&
                imageFile.files &&
                imageFile.files.length > 0
            ) {

                image =
                imagePreview.src;

            }


            // কোনো ছবি না দিলে
            if (!image) {

                image =
                "images/no-image.png";

            }


            // ==========================================
            // CREATE PRODUCT
            // ==========================================

            const product = {

    id: Date.now(),

    name: name,

    price: price,

    category: category,

    image: image,

    description: description

};



            // ==========================================
            // SAVE PRODUCT
            // ==========================================

            products.push(product);

            saveProducts();


            alert(
                "✅ Product Added Successfully"
            );


            // ==========================================
            // RESET
            // ==========================================

            productForm.reset();


            if (imagePreviewBox) {

                imagePreviewBox.style.display =
                "none";

            }


            if (imagePreview) {

                imagePreview.src = "";

            }


            // Products reload
            loadProducts();

        }
    );

}



// ======================================================
// CHECKOUT / ORDER
// ======================================================

const checkoutForm =
    document.getElementById("checkoutForm");


if (checkoutForm) {

    checkoutForm.addEventListener(
        "submit",
        function(e) {

            e.preventDefault();


            if (cart.length === 0) {

                alert("🛒 আপনার কার্ট খালি");

                return;

            }


            const name =
                document.getElementById("name").value.trim();


            const phone =
                document.getElementById("phone").value.trim();


            const address =
                document.getElementById("address").value.trim();


            const payment =
                document.getElementById("payment").value;


            if (!name || !phone || !address) {

                alert(
                    "❌ নাম, মোবাইল নম্বর ও ঠিকানা পূরণ করুন"
                );

                return;

            }


            const order = {

                id: "ORD" + Date.now(),

                name: name,

                phone: phone,

                address: address,

                payment: payment,

                products: [...cart],

                status: "Pending",

                date: new Date().toLocaleString()

            };


            orders.push(order);

            saveOrders();


            // Cart Empty

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
    );

}


// ======================================================
// ADMIN - LOAD ORDERS
// ======================================================

function loadOrders() {

    const container =
        document.getElementById("orderList");


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


            order.products.forEach(
                function(item) {

                    total +=
                        Number(item.price);

                }
            );


            html += `

            <div class="card">

                <h3>
                    👤 ${order.name}
                </h3>

                <p>
                    🆔 Order ID:
                    <strong>${order.id}</strong>
                </p>

                <p>
                    📞 ${order.phone}
                </p>

                <p>
                    📍 ${order.address}
                </p>

                <p>
                    💳 ${order.payment}
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
                    📅 ${order.date}
                </p>

                <p>
                    📌 Status:
                    <strong>${order.status || "Pending"}</strong>
                </p>


                <div class="btn-group">

                    <button
                        class="btn-small"
                        onclick="updateOrderStatus(${index}, 'Pending')">

                        🟡 Pending

                    </button>


                    <button
                        class="btn-small"
                        onclick="updateOrderStatus(${index}, 'Confirmed')">

                        🟢 Confirmed

                    </button>


                    <button
                        class="btn-small"
                        onclick="updateOrderStatus(${index}, 'Delivered')">

                        🚚 Delivered

                    </button>

                </div>

            </div>

            `;

        }
    );


    container.innerHTML = html;

}

loadOrders();


// ======================================================
// UPDATE ORDER STATUS
// ======================================================

function updateOrderStatus(index, status) {

    let allOrders =
        JSON.parse(
            localStorage.getItem("orders")
        ) || [];


    if (!allOrders[index]) {

        alert("❌ Order পাওয়া যায়নি");

        return;

    }


    allOrders[index].status =
        status;


    localStorage.setItem(
        "orders",
        JSON.stringify(allOrders)
    );


    orders = allOrders;


    alert(
        "✅ Order Status Updated: " +
        status
    );


    loadOrders();

}


// ======================================================
// LOGIN
// ======================================================

const loginForm =
    document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        function(e) {

            e.preventDefault();


            const username =
                document.getElementById("username").value;


            const password =
                document.getElementById("password").value;


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
    "edit-product.html"
];

const currentPage =
    window.location.pathname
    .split("/")
    .pop();

if (
    protectedPages.includes(currentPage) &&
    localStorage.getItem("isLoggedIn") !== "true"
) {

    window.location.href = "login.html";

}



// ======================================================
// PAYMENT
// ======================================================

function submitPayment() {

    const trxid =
        document.getElementById("trxid");


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
            ? selectedPayment.value
            : "";


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
// EDIT + DELETE
// ======================================================

function loadAdminProducts() {

    const container =
        document.getElementById("adminProductList");

    if (!container) {
        return;
    }

    if (products.length === 0) {

        container.innerHTML = `
            <div class="card">
                <h3>📦 কোনো Product নেই</h3>
            </div>
        `;

        return;
    }

    let html = "";

    products.forEach(function(product, index) {

        html += `
        <div class="card">

            <div style="text-align:center;">

                <img
                    src="${product.image || "images/no-image.png"}"
                    alt="${product.name}"
                    style="
                        width:150px;
                        height:150px;
                        object-fit:contain;
                        border-radius:10px;
                    "
                >

            </div>

            <h3>
                📦 ${product.name}
            </h3>

            <p class="price">
                💰 ৳${product.price}
            </p>

            <p>
                ${product.description || "কোনো বিবরণ নেই"}
            </p>

            <div class="btn-group">

                <button
                    class="btn-small"
                    onclick="editProduct(${index})">

                    ✏️ Edit

                </button>

                <button
                    class="btn-small"
                    onclick="deleteProduct(${index})">

                    🗑️ Delete

                </button>

            </div>

        </div>
        `;
    });

    container.innerHTML = html;
}


// ======================================================
// EDIT PRODUCT
// ======================================================

function editProduct(index) {

    if (!products[index]) {
        alert("❌ Product পাওয়া যায়নি");
        return;
    }

    const product = products[index];

    window.location.href =
        "edit-product.html?id=" + product.id;
}



// ======================================================
// DELETE PRODUCT
// ======================================================

function deleteProduct(index) {

    if (!products[index]) {
        alert("❌ Product পাওয়া যায়নি");
        return;
    }

    const product = products[index];

    const confirmDelete = confirm(
        "⚠️ আপনি কি এই Product মুছে ফেলতে চান?\n\n" +
        "📦 Product: " + product.name + "\n" +
        "💰 দাম: ৳" + product.price
    );

    if (!confirmDelete) {
        return;
    }

    products.splice(index, 1);

    saveProducts();

    alert("✅ Product সফলভাবে Delete হয়েছে");

    loadAdminProducts();
    loadProducts();
}

// ======================================================
// LOAD ADMIN PRODUCTS
// ======================================================

loadAdminProducts();

// ======================================================
// EDIT PRODUCT PAGE
// ======================================================

function loadEditProduct() {

    const form =
        document.getElementById("editProductForm");

    if (!form) {
        return;
    }

    const params =
        new URLSearchParams(window.location.search);

    const id =
        Number(params.get("id"));

    const product =
        products.find(function(item) {
            return item.id === id;
        });

    if (!product) {

        alert("❌ Product পাওয়া যায়নি");

        window.location.href =
            "admin.html";

        return;
    }


    // ==============================
    // LOAD PRODUCT DATA
    // ==============================

    document.getElementById("editName").value =
        product.name;

    document.getElementById("editPrice").value =
        product.price;

document.getElementById("editCategory").value =
    product.category || "";


    document.getElementById("editImage").value =
        product.image || "";

    document.getElementById("editDescription").value =
        product.description || "";


    const preview =
        document.getElementById("editImagePreview");

    if (preview) {

        preview.src =
            product.image ||
            "images/no-image.png";

    }


    // ==============================
    // GALLERY PREVIEW
    // ==============================

    const imageFile =
        document.getElementById("editImageFile");

    if (imageFile) {

        imageFile.addEventListener(
            "change",
            function() {

                const file =
                    this.files[0];

                if (!file) {
                    return;
                }

                if (!file.type.startsWith("image/")) {

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

                        preview.src =
                            e.target.result;

                    };


                reader.readAsDataURL(file);

            }
        );

    }


    // ==============================
    // IMAGE URL PREVIEW
    // ==============================

    const imageURL =
        document.getElementById("editImage");

    if (imageURL) {

        imageURL.addEventListener(
            "input",
            function() {

                if (
                    !imageFile ||
                    imageFile.files.length === 0
                ) {

                    preview.src =
                        this.value ||
                        "images/no-image.png";

                }

            }
        );

    }


    // ==============================
    // UPDATE PRODUCT
    // ==============================

    form.addEventListener(
        "submit",
        function(e) {

            e.preventDefault();


            const name =
                document
                    .getElementById("editName")
                    .value
                    .trim();


            const price =
                Number(
                    document
                        .getElementById("editPrice")
                        .value
                );


            const description =
                document
                    .getElementById("editDescription")
                    .value
                    .trim();

const category =
    document
        .getElementById("editCategory")
        .value;


            const url =
                document
                    .getElementById("editImage")
                    .value
                    .trim();


            if (!name || !price) {

                alert(
                    "❌ Product Name ও Price দিন"
                );

                return;
            }


            // ==============================
            // IMAGE
            // ==============================

            let image =
                url;


            if (
                imageFile &&
                imageFile.files &&
                imageFile.files.length > 0
            ) {

                image =
                    preview.src;

            }


            if (!image) {

                image =
                    "images/no-image.png";

            }


            // ==============================
            // UPDATE
            // ==============================

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
    );

}


// ======================================================
// START EDIT PRODUCT
// ======================================================

loadEditProduct();

// ======================================================
// PRODUCTS ADMIN PAGE
// ======================================================

function loadProductsAdmin() {

    const container =
        document.getElementById("productsAdminList");

    const total =
        document.getElementById("productsAdminTotal");

    if (!container) {
        return;
    }


    // Total Products

    if (total) {
        total.innerText = products.length;
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


    products.forEach(function(product, index) {

        html += `

        <div class="card">

            <div style="text-align:center;">

                <img
                    src="${product.image || "images/no-image.png"}"
                    alt="${product.name}"
                    style="
                        width:180px;
                        height:180px;
                        object-fit:contain;
                        border-radius:10px;
                    ">

            </div>


            <h3>
                📦 ${product.name}
            </h3>


            <p class="price">
                💰 ৳${product.price}
            </p>


            <p>
                📝 ${product.description || "কোনো বিবরণ নেই"}
            </p>


            <div class="btn-group">

                <button
                    class="btn-small"
                    onclick="editProduct(${index})">

                    ✏️ Edit

                </button>


                <button
                    class="btn-small"
                    onclick="deleteProduct(${index})">

                    🗑️ Delete

                </button>

            </div>

        </div>

        `;

    });


    container.innerHTML = html;

}


// ======================================================
// SEARCH ADMIN PRODUCTS
// ======================================================

function searchAdminProducts() {

    const search =
        document.getElementById("adminProductSearch");

    const container =
        document.getElementById("productsAdminList");


    if (!search || !container) {
        return;
    }


    const keyword =
        search.value.toLowerCase().trim();


    const result =
        products.filter(function(product) {

            return product.name
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

        const index =
            products.findIndex(function(item) {

                return item.id === product.id;

            });


        html += `

        <div class="card">

            <div style="text-align:center;">

                <img
                    src="${product.image || "images/no-image.png"}"
                    alt="${product.name}"
                    style="
                        width:180px;
                        height:180px;
                        object-fit:contain;
                        border-radius:10px;
                    ">

            </div>


            <h3>
                📦 ${product.name}
            </h3>


            <p class="price">
                💰 ৳${product.price}
            </p>


            <p>
                📝 ${product.description || "কোনো বিবরণ নেই"}
            </p>


            <div class="btn-group">

                <button
                    class="btn-small"
                    onclick="editProduct(${index})">

                    ✏️ Edit

                </button>


                <button
                    class="btn-small"
                    onclick="deleteProduct(${index})">

                    🗑️ Delete

                </button>

            </div>

        </div>

        `;

    });


    container.innerHTML = html;

}


loadProductsAdmin();

// ======================================================
// ALL ORDERS PAGE
// ======================================================

function loadOrdersPage() {

    const container =
        document.getElementById("ordersPageList");

    const totalElement =
        document.getElementById("ordersPageTotal");

    if (!container) {
        return;
    }


    // Total Orders

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


    orders.forEach(function(order, index) {

        let total = 0;


        order.products.forEach(function(item) {

            total +=
                Number(item.price);

        });


        html += `

        <div class="card">

            <h3>
                🆔 ${order.id}
            </h3>

            <p>
                👤 <strong>
                ${order.name}
                </strong>
            </p>

            <p>
                📞 ${order.phone}
            </p>

            <p>
                📍 ${order.address}
            </p>

            <p>
                💳 ${order.payment || "N/A"}
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
                📅 ${order.date}
            </p>

            <p>
                📌 Status:
                <strong>
                ${order.status || "Pending"}
                </strong>
            </p>


            <hr>


            <h4>
                📦 Products
            </h4>

            ${order.products.map(function(item) {

                return `

                    <p>
                        • ${item.name}
                        — ৳${item.price}
                    </p>

                `;

            }).join("")}


            <div class="btn-group">


                <button
                    class="btn-small"
                    onclick="updateOrderStatus(${index}, 'Pending')">

                    ⏳ Pending

                </button>


                <button
                    class="btn-small"
                    onclick="updateOrderStatus(${index}, 'Confirmed')">

                    ✅ Confirmed

                </button>


                <button
                    class="btn-small"
                    onclick="updateOrderStatus(${index}, 'Delivered')">

                    🚚 Delivered

                </button>


                <button
                    class="btn-small"
                    onclick="updateOrderStatus(${index}, 'Cancelled')">

                    ❌ Cancelled

                </button>


            </div>

        </div>

        `;

    });


    container.innerHTML =
        html;

}


loadOrdersPage();

// ======================================================
// CUSTOMERS PAGE
// ======================================================

function loadCustomersPage() {

    const container =
        document.getElementById("customersPageList");

    const totalElement =
        document.getElementById("customersPageTotal");

    if (!container) {
        return;
    }


    // ==========================================
    // CREATE UNIQUE CUSTOMERS
    // ==========================================

    const customerMap = {};


    orders.forEach(function(order) {

        const phone =
            String(order.phone || "").trim();

        if (!phone) {
            return;
        }


        if (!customerMap[phone]) {

            customerMap[phone] = {

                name: order.name || "Unknown",

                phone: phone,

                address: order.address || "",

                orders: 0,

                total: 0

            };

        }


        customerMap[phone].orders += 1;


        let orderTotal = 0;


        if (Array.isArray(order.products)) {

            order.products.forEach(function(item) {

                orderTotal +=
                    Number(item.price) || 0;

            });

        }


        customerMap[phone].total +=
            orderTotal;


        // সর্বশেষ ঠিকানা/নাম রাখা

        customerMap[phone].name =
            order.name || customerMap[phone].name;

        customerMap[phone].address =
            order.address || customerMap[phone].address;

    });


    const customers =
        Object.values(customerMap);


    // ==========================================
    // TOTAL CUSTOMERS
    // ==========================================

    if (totalElement) {

        totalElement.innerText =
            customers.length;

    }


    // ==========================================
    // NO CUSTOMER
    // ==========================================

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


    // ==========================================
    // CUSTOMER LIST
    // ==========================================

    let html = "";


    customers.forEach(function(customer, index) {

        html += `

        <div class="card">

            <h3>
                👤 ${customer.name}
            </h3>


            <p>
                📞 <strong>
                ${customer.phone}
                </strong>
            </p>


            <p>
                📍 ${customer.address}
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
                    href="tel:${customer.phone}"
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

    });


    container.innerHTML =
        html;

}


loadCustomersPage();

// ======================================================
// PENDING ORDERS PAGE
// ======================================================

function loadPendingOrdersPage() {

    const container =
        document.getElementById("pendingOrdersList");

    const totalElement =
        document.getElementById("pendingPageTotal");

    if (!container) {
        return;
    }


    // ==========================================
    // ONLY PENDING ORDERS
    // ==========================================

    const pendingOrders =
        orders.filter(function(order) {

            return (
                !order.status ||
                order.status === "Pending"
            );

        });


    // ==========================================
    // TOTAL PENDING
    // ==========================================

    if (totalElement) {

        totalElement.innerText =
            pendingOrders.length;

    }


    // ==========================================
    // NO PENDING ORDER
    // ==========================================

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


    // ==========================================
    // ORDER LIST
    // ==========================================

    let html = "";


    pendingOrders.forEach(function(order) {


        // Original orders array-এর index বের করা
        const originalIndex =
            orders.findIndex(function(item) {

                return item.id === order.id;

            });


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
                ⏳ Pending Order
            </h3>


            <p>
                🆔 Order ID:
                <strong>
                ${order.id}
                </strong>
            </p>


            <p>
                👤 Customer:
                <strong>
                ${order.name}
                </strong>
            </p>


            <p>
                📞 Phone:
                ${order.phone}
            </p>


            <p>
                📍 Address:
                ${order.address}
            </p>


            <p>
                💳 Payment:
                ${order.payment || "N/A"}
            </p>


            <p>
                📅 Date:
                ${order.date}
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
                        • ${item.name}
                        — ৳${item.price}
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


            <p>

                📌 Status:
                <strong>
                Pending
                </strong>

            </p>


            <!-- ================= -->
            <!-- ACTION BUTTONS -->
            <!-- ================= -->

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

    });


    container.innerHTML =
        html;

}


// ======================================================
// UPDATE PENDING ORDER
// ======================================================

function updatePendingOrderStatus(index, status) {

    if (!orders[index]) {

        alert(
            "❌ Order পাওয়া যায়নি"
        );

        return;
    }


    const order =
        orders[index];


    if (
        status === "Confirmed"
    ) {

        if (
            !confirm(
                "আপনি কি এই Order Confirm করতে চান?"
            )
        ) {

            return;

        }

    }


    if (
        status === "Cancelled"
    ) {

        if (
            !confirm(
                "আপনি কি এই Order Cancel করতে চান?"
            )
        ) {

            return;

        }

    }


    // ==========================================
    // UPDATE STATUS
    // ==========================================

    order.status =
        status;


    saveOrders();


    alert(
        status === "Confirmed"
        ?
        "✅ Order Confirmed হয়েছে"
        :
        "❌ Order Cancelled হয়েছে"
    );


    // Reload current page

    loadPendingOrdersPage();

}


// ======================================================
// START PENDING ORDERS PAGE
// ======================================================

loadPendingOrdersPage();

// ======================================================
// ADMIN DASHBOARD STATISTICS
// ======================================================

function loadDashboardStats() {

    // ==============================
    // PRODUCTS
    // ==============================

    const totalProducts =
        document.getElementById("totalProducts");

    if (totalProducts) {

        totalProducts.innerText =
            products.length;

    }


    // ==============================
    // ORDERS
    // ==============================

    const totalOrders =
        document.getElementById("totalOrders");

    const pendingOrders =
        document.getElementById("pendingOrders");

    const confirmedOrders =
        document.getElementById("confirmedOrders");

    const deliveredOrders =
        document.getElementById("deliveredOrders");

    const cancelledOrders =
        document.getElementById("cancelledOrders");


    const allOrders =
        JSON.parse(
            localStorage.getItem("orders")
        ) || [];


    if (totalOrders) {

        totalOrders.innerText =
            allOrders.length;

    }


    // ==============================
    // ORDER STATUS COUNT
    // ==============================

    let pending = 0;
    let confirmed = 0;
    let delivered = 0;
    let cancelled = 0;


    allOrders.forEach(function(order) {

        const status =
            order.status || "Pending";


        if (status === "Pending") {

            pending++;

        }

        else if (status === "Confirmed") {

            confirmed++;

        }

        else if (status === "Delivered") {

            delivered++;

        }

        else if (status === "Cancelled") {

            cancelled++;

        }

    });


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


    // ==============================
    // CUSTOMERS
    // ==============================

    const totalCustomers =
        document.getElementById(
            "totalCustomers"
        );


    const customers = [];


    allOrders.forEach(function(order) {

        if (
            order.phone &&
            !customers.includes(order.phone)
        ) {

            customers.push(order.phone);

        }

    });


    if (totalCustomers) {

        totalCustomers.innerText =
            customers.length;

    }


    // ==============================
    // TOTAL SALES
    // ==============================

    const totalSales =
        document.getElementById(
            "totalSales"
        );


    let sales = 0;


    allOrders.forEach(function(order) {

        // শুধু Delivered Order-এর টাকা Sales হিসেবে গণনা হবে

        if (
            order.status === "Delivered"
        ) {

            if (order.products) {

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


// Dashboard চালু করুন

loadDashboardStats();


// ======================================================
// END
// ======================================================

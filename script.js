// ======================================================
// IFFAH SHOP - FIREBASE SCRIPT
// PART 1 / 4
// ======================================================

// ======================================================
// FIREBASE CHECK
// ======================================================

if (typeof firebase === "undefined") {

    console.error("❌ Firebase SDK পাওয়া যায়নি");

} else {

    console.log("🔥 Firebase SDK Loaded");

}


// ======================================================
// LOCAL DATA
// ======================================================

let products = [];

let cart =
    JSON.parse(localStorage.getItem("cart")) || [];

let orders =
    JSON.parse(localStorage.getItem("orders")) || [];


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
// ORDER LOCAL BACKUP
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
// ESCAPE QUOTES
// ======================================================

function escapeQuotes(text) {

    return String(text)
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'")
        .replace(/"/g, '\\"');

}


// ======================================================
// FIREBASE - LOAD PRODUCTS
// ======================================================
async function loadProductsFromFirebase() {

    try {

        console.log("🔥 Firebase থেকে Product Load শুরু...");
console.log(products);
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


        // LocalStorage-এ Firebase-এর Product রাখবে
        localStorage.setItem(
            "products",
            JSON.stringify(products)
        );


        console.log(
            "🔥 Firebase থেকে মোট Product:",
            products.length
        );


        // Homepage Product
        loadProducts();


        // Admin Product
        loadAdminProducts();


        // Products Admin
        loadProductsAdmin();


    } catch (error) {

        console.error(
            "❌ Firebase Product Load Error:",
            error
        );

        alert(
            "❌ Firebase থেকে Product Load হচ্ছে না।\n\n" +
            error.message
        );

    }

}

loadProductsFromFirebase();


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

        id: Date.now(),

        name: name,

        price: Number(price)

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
                        src="${
                            product.image ||
                            "images/no-image.png"
                        }"
                        alt="${product.name}"

                        onerror="
                            this.src='images/no-image.png'
                        "
                    >

                </div>


                <div class="product-info">

                    ${
                        product.category
                        ?
                        `
                        <span class="product-category">
                            📂 ${product.category}
                        </span>
                        `
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
                            (
                                product.description.length > 70
                                ?
                                product.description.substring(
                                    0,
                                    70
                                ) + "..."
                                :
                                product.description
                            )
                            :
                            "মানসম্মত পণ্য"
                        }

                    </p>


                    <div class="professional-product-buttons">

                        <a
                            href="
                                product.html?id=${encodeURIComponent(product.id)}
                            "
                            class="
                                professional-btn
                                details-btn
                            "
                        >
                            👁️ বিস্তারিত
                        </a>


                        <button
                            class="
                                professional-btn
                                cart-btn
                            "

                            onclick="
                                addToCart(
                                    '${escapeQuotes(product.name)}',
                                    ${Number(product.price)}
                                )
                            "
                        >
                            🛒 কার্ট
                        </button>


                        <button
                            class="
                                professional-btn
                                order-btn
                            "

                            onclick="
                                buyNow(
                                    '${escapeQuotes(product.name)}',
                                    ${Number(product.price)}
                                )
                            "
                        >
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
        document.getElementById(
            "search"
        );


    const container =
        document.getElementById(
            "productList"
        );


    if (
        !search ||
        !container
    ) {

        return;

    }


    const keyword =
        search.value
            .toLowerCase()
            .trim();


    const result =
        products.filter(
            function(product) {

                return String(
                    product.name || ""
                )
                .toLowerCase()
                .includes(keyword);

            }
        );


    if (result.length === 0) {

        container.innerHTML = `

            <h2 style="text-align:center;">

                ❌ কোনো Product পাওয়া যায়নি

            </h2>

        `;

        return;

    }


    let html = "";


    result.forEach(
        function(product) {

            html += `

            <div class="product-card">

                <img
                    src="${
                        product.image ||
                        "images/no-image.png"
                    }"

                    alt="${product.name}"

                    onerror="
                        this.src='images/no-image.png'
                    "
                >


                <div class="product-info">

                    <h3>
                        ${product.name}
                    </h3>


                    <p class="price">
                        ৳${product.price}
                    </p>


                    <p>
                        ${product.description || ""}
                    </p>


                    <div class="btn-group">

                        <a
                            href="
                                product.html?id=${encodeURIComponent(product.id)}
                            "
                            class="btn-small"
                        >
                            👁️ বিস্তারিত
                        </a>


                        <button
                            class="btn-small"

                            onclick="
                                addToCart(
                                    '${escapeQuotes(product.name)}',
                                    ${Number(product.price)}
                                )
                            "
                        >
                            🛒 কার্টে যোগ করুন
                        </button>


                        <button
                            class="btn-small"

                            onclick="
                                buyNow(
                                    '${escapeQuotes(product.name)}',
                                    ${Number(product.price)}
                                )
                            "
                        >
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

                return String(item.id) ===
                    String(id);

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


    document.getElementById(
        "productName"
    ).innerText =
        product.name;


    document.getElementById(
        "productPrice"
    ).innerText =
        "৳" + product.price;


    document.getElementById(
        "productDescription"
    ).innerText =
        product.description ||
        "কোনো বিবরণ নেই";


    const image =
        document.getElementById(
            "productImage"
        );


    if (image) {

        image.src =
            product.image ||
            "images/no-image.png";

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

            total +=
                Number(item.price) || 0;


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

                    onclick="
                        removeFromCart(${index})
                    "
                >
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
            "৳" + total;

    }

}


// ======================================================
// INITIAL LOAD
// ======================================================

updateCartCount();

loadCart();

loadProductsFromFirebase();

// ======================================================
// IFFAH SHOP - PRODUCT MANAGEMENT
// PART 2 / 4
// ======================================================


// ======================================================
// IMAGE PREVIEW
// ======================================================

const productForm =
    document.getElementById("productForm");

const imageFile =
    document.getElementById("imageFile");

const imagePreview =
    document.getElementById("imagePreview");

const imagePreviewBox =
    document.getElementById("imagePreviewBox");


if (imageFile) {

    imageFile.addEventListener(
        "change",
        function () {

            const file =
                this.files[0];

            if (!file) {
                return;
            }


            if (
                !file.type.startsWith("image/")
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
                function (e) {

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
        async function (e) {

            e.preventDefault();


            const nameElement =
                document.getElementById("name");


            const priceElement =
                document.getElementById("price");


            const imageElement =
                document.getElementById("image");


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
                categoryElement.value
                :
                "";


            if (!name || !price) {

                alert(
                    "❌ Product Name ও Price দিন"
                );

                return;

            }


            // ==================================================
            // IMAGE
            // ==================================================

            let image =
                imageURL;


            if (
                imageFile &&
                imageFile.files &&
                imageFile.files.length > 0
            ) {

                // Gallery image-এর Data URL
                image =
                    imagePreview
                    ?
                    imagePreview.src
                    :
                    "";

            }


            if (!image) {

                image =
                    "images/no-image.png";

            }


            // ==================================================
            // PRODUCT DATA
            // ==================================================

            const product = {

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


            // ==================================================
            // FIREBASE SAVE
            // ==================================================

            try {

                if (!window.db) {

                    alert(
                        "❌ Firebase Database Connected নয়"
                    );

                    return;

                }


                const docRef =
                    await db
                        .collection("products")
                        .add(product);


                console.log(
                    "🔥 Product Firebase-এ Save হয়েছে:",
                    docRef.id
                );


                alert(
                    "✅ Product সফলভাবে যুক্ত হয়েছে"
                );


                // Form reset
                productForm.reset();


                if (imagePreviewBox) {

                    imagePreviewBox.style.display =
                        "none";

                }


                if (imagePreview) {

                    imagePreview.src =
                        "";

                }


                // Firebase থেকে আবার Load
                await loadProductsFromFirebase();


            } catch (error) {

                console.error(
                    "❌ Product Save Error:",
                    error
                );


                alert(
                    "❌ Product Save হয়নি।\n\n" +
                    error.message
                );

            }

        }
    );

}


// ======================================================
// ADMIN PRODUCT LIST
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

                <div
                    style="text-align:center;"
                >

                    <img
                        src="${
                            product.image ||
                            "images/no-image.png"
                        }"

                        alt="${product.name}"

                        style="
                            width:150px;
                            height:150px;
                            object-fit:contain;
                            border-radius:10px;
                        "

                        onerror="
                            this.src='images/no-image.png'
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
                    📂 ${
                        product.category ||
                        "কোনো Category নেই"
                    }
                </p>


                <p>
                    ${
                        product.description ||
                        "কোনো বিবরণ নেই"
                    }
                </p>


                <div class="btn-group">

                    <button
                        class="btn-small"

                        onclick="
                            editProduct(
                                '${escapeQuotes(product.id)}'
                            )
                        "
                    >
                        ✏️ Edit
                    </button>


                    <button
                        class="btn-small"

                        onclick="
                            deleteProduct(
                                '${escapeQuotes(product.id)}'
                            )
                        "
                    >
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
        function(product) {

            html += `

            <div class="card">

                <div
                    style="text-align:center;"
                >

                    <img
                        src="${
                            product.image ||
                            "images/no-image.png"
                        }"

                        alt="${product.name}"

                        style="
                            width:180px;
                            height:180px;
                            object-fit:contain;
                            border-radius:10px;
                        "

                        onerror="
                            this.src='images/no-image.png'
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
                    📝 ${
                        product.description ||
                        "কোনো বিবরণ নেই"
                    }
                </p>


                <div class="btn-group">

                    <button
                        class="btn-small"

                        onclick="
                            editProduct(
                                '${escapeQuotes(product.id)}'
                            )
                        "
                    >
                        ✏️ Edit
                    </button>


                    <button
                        class="btn-small"

                        onclick="
                            deleteProduct(
                                '${escapeQuotes(product.id)}'
                            )
                        "
                    >
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

function editProduct(id) {

    const product =
        products.find(
            function(item) {

                return String(item.id) ===
                    String(id);

            }
        );


    if (!product) {

        alert(
            "❌ Product পাওয়া যায়নি"
        );

        return;

    }


    window.location.href =
        "edit-product.html?id=" +
        encodeURIComponent(product.id);

}


// ======================================================
// DELETE PRODUCT
// ======================================================

async function deleteProduct(id) {

    const product =
        products.find(
            function(item) {

                return String(item.id) ===
                    String(id);

            }
        );


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

        await db
            .collection("products")
            .doc(String(id))
            .delete();


        console.log(
            "🗑️ Firebase Product Deleted:",
            id
        );


        alert(
            "✅ Product সফলভাবে Delete হয়েছে"
        );


        await loadProductsFromFirebase();


    } catch (error) {

        console.error(
            "❌ Product Delete Error:",
            error
        );


        alert(
            "❌ Product Delete হয়নি।\n\n" +
            error.message
        );

    }

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


    if (
        !search ||
        !container
    ) {

        return;

    }


    const keyword =
        search.value
            .toLowerCase()
            .trim();


    const result =
        products.filter(
            function(product) {

                return String(
                    product.name || ""
                )
                .toLowerCase()
                .includes(keyword);

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

            html += `

            <div class="card">

                <h3>
                    📦 ${product.name}
                </h3>

                <p class="price">
                    💰 ৳${product.price}
                </p>


                <div class="btn-group">

                    <button
                        class="btn-small"

                        onclick="
                            editProduct(
                                '${escapeQuotes(product.id)}'
                            )
                        "
                    >
                        ✏️ Edit
                    </button>


                    <button
                        class="btn-small"

                        onclick="
                            deleteProduct(
                                '${escapeQuotes(product.id)}'
                            )
                        "
                    >
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
// START ADMIN PRODUCT LIST
// ======================================================

loadAdminProducts();

loadProductsAdmin();

// ======================================================
// IFFAH SHOP - LOAD PRODUCTS FROM FIREBASE
// PART 3 / 4
// ======================================================

async function loadProductsFromFirebase() {

    try {

        if (!window.db) {
            console.error("❌ Firebase Database পাওয়া যায়নি");
            return;
        }

        const snapshot =
            await db
                .collection("products")
                .orderBy("createdAt", "desc")
                .get();


        // Firebase থেকে নতুন Product List
        products = [];


        snapshot.forEach(function(doc) {

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
                    data.image || "images/no-image.png",

                description:
                    data.description || "",

                createdAt:
                    data.createdAt || ""

            });

        });


        // LocalStorage-এও আপডেট
        localStorage.setItem(
            "products",
            JSON.stringify(products)
        );


        console.log(
            "🔥 Firebase থেকে Product Load হয়েছে:",
            products.length
        );


        // Homepage
        loadProducts();


        // Admin Product
        loadAdminProducts();


        // Products Admin
        loadProductsAdmin();


    } catch (error) {

        console.error(
            "❌ Firebase Product Load Error:",
            error
        );

    }

}


// ======================================================
// LOAD FIREBASE PRODUCTS
// ======================================================

loadProductsFromFirebase();

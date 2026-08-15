document.addEventListener("DOMContentLoaded", function () {

    const box = document.getElementById("userAuthBox");

    if (!box) return;

    /* ==============================
       POSITION
    ============================== */

    box.style.position = "fixed";
    box.style.top = "15px";
    box.style.right = "15px";
    box.style.zIndex = "99999";


    const loggedIn =
        localStorage.getItem("iffahUserLoggedIn") === "true";


    /* ==============================
       LOGGED IN USER
    ============================== */

    if (loggedIn) {

        let user = null;

        try {

            user = JSON.parse(
                localStorage.getItem("iffahCurrentUser")
            );

        } catch (error) {

            user = null;

        }


        const name =
            user && user.name
                ? user.name
                : "User";


        box.innerHTML = `

            <div style="
                position:relative;
                font-family:Arial,sans-serif;
            ">

                <button
                    onclick="iffahToggleUserMenu()"
                    style="
                        display:flex;
                        align-items:center;
                        gap:8px;
                        border:1px solid rgba(255,255,255,.35);
                        background:rgba(255,255,255,.95);
                        color:#166534;
                        padding:8px 13px;
                        border-radius:30px;
                        box-shadow:0 4px 15px rgba(0,0,0,.12);
                        cursor:pointer;
                        font-weight:700;
                        font-size:14px;
                    "
                >

                    👤

                    <span>
                        ${name}
                    </span>

                    <span>
                        ▾
                    </span>

                </button>


                <div
                    id="iffahUserMenu"
                    style="
                        display:none;
                        position:absolute;
                        right:0;
                        top:48px;
                        width:190px;
                        background:#fff;
                        border:1px solid #e5e7eb;
                        border-radius:12px;
                        box-shadow:0 10px 30px rgba(0,0,0,.15);
                        overflow:hidden;
                    "
                >

                    <div style="
                        padding:13px;
                        border-bottom:1px solid #eee;
                        background:#f8fafc;
                    ">

                        <div style="
                            font-weight:700;
                            color:#111827;
                        ">
                            👤 ${name}
                        </div>

                        <div style="
                            font-size:12px;
                            color:#6b7280;
                            margin-top:3px;
                        ">
                            IFFAH Shop User
                        </div>

                    </div>


                    <button
                        onclick="iffahUserLogout()"
                        style="
                            width:100%;
                            border:0;
                            background:#fff;
                            color:#dc2626;
                            padding:11px;
                            text-align:left;
                            cursor:pointer;
                            font-weight:600;
                        "
                    >
                        🚪 Logout
                    </button>

                </div>

            </div>

        `;

    }


    /* ==============================
       NOT LOGGED IN
    ============================== */

    else {

        box.innerHTML = `

            <div style="
                position:relative;
                font-family:Arial,sans-serif;
            ">

                <button
                    onclick="iffahToggleUserMenu()"
                    style="
                        display:flex;
                        align-items:center;
                        gap:7px;
                        border:1px solid #e5e7eb;
                        background:#fff;
                        color:#374151;
                        padding:8px 13px;
                        border-radius:30px;
                        box-shadow:0 4px 15px rgba(0,0,0,.10);
                        cursor:pointer;
                        font-weight:700;
                        font-size:14px;
                    "
                >

                    👤

                    <span>
                        Account
                    </span>

                    <span>
                        ▾
                    </span>

                </button>


                <div
                    id="iffahUserMenu"
                    style="
                        display:none;
                        position:absolute;
                        right:0;
                        top:48px;
                        width:200px;
                        background:#fff;
                        border:1px solid #e5e7eb;
                        border-radius:12px;
                        box-shadow:0 10px 30px rgba(0,0,0,.15);
                        overflow:hidden;
                    "
                >

                    <div style="
                        padding:13px;
                        background:#f8fafc;
                        border-bottom:1px solid #eee;
                    ">

                        <div style="
                            font-weight:700;
                            color:#111827;
                        ">
                            🛍️ IFFAH Shop
                        </div>

                        <div style="
                            font-size:12px;
                            color:#6b7280;
                            margin-top:3px;
                        ">
                            আপনার Account
                        </div>

                    </div>


                    <a
                        href="user-login.html"
                        style="
                            display:block;
                            padding:11px 13px;
                            text-decoration:none;
                            color:#166534;
                            font-weight:600;
                            border-bottom:1px solid #f1f1f1;
                        "
                    >
                        🔐 Login
                    </a>


                    <a
                        href="Register.html"
                        style="
                            display:block;
                            padding:11px 13px;
                            text-decoration:none;
                            color:#2563eb;
                            font-weight:600;
                        "
                    >
                        📝 Registration
                    </a>

                </div>

            </div>

        `;

    }

});


/* ==============================
   OPEN / CLOSE MENU
============================== */

function iffahToggleUserMenu() {

    const menu =
        document.getElementById("iffahUserMenu");

    if (!menu) return;

    if (menu.style.display === "none") {

        menu.style.display = "block";

    } else {

        menu.style.display = "none";

    }

}


/* ==============================
   LOGOUT
============================== */

function iffahUserLogout() {

    localStorage.removeItem(
        "iffahUserLoggedIn"
    );

    localStorage.removeItem(
        "iffahCurrentUser"
    );

    alert("✅ আপনার Account থেকে Logout হয়েছে।");

    location.reload();

}


/* ==============================
   CLICK OUTSIDE
============================== */

document.addEventListener(
    "click",
    function (event) {

        const box =
            document.getElementById(
                "userAuthBox"
            );

        const menu =
            document.getElementById(
                "iffahUserMenu"
            );

        if (
            box &&
            menu &&
            !box.contains(event.target)
        ) {

            menu.style.display = "none";

        }

    }
);
/* ==========================================
   IFFAH SHOP
   USER PROFILE LINK
========================================== */

(function () {

    function addProfileLink() {

        const box =
            document.getElementById("userAuthBox");

        if (!box) {
            return;
        }

        const loggedIn =
            localStorage.getItem(
                "iffahUserLoggedIn"
            ) === "true";

        if (!loggedIn) {
            return;
        }

        if (
            document.getElementById(
                "iffahProfileLink"
            )
        ) {
            return;
        }

        const profileLink =
            document.createElement("a");

        profileLink.id =
            "iffahProfileLink";

        profileLink.href =
            "user-profile.html";

        profileLink.innerHTML =
            "👤 My Profile";

        profileLink.style.cssText = `

            display:inline-flex;
            align-items:center;
            justify-content:center;
            gap:6px;
            padding:8px 13px;
            margin-left:6px;
            background:#166534;
            color:#fff;
            border-radius:8px;
            text-decoration:none;
            font-size:13px;
            font-weight:700;
            box-shadow:0 3px 10px rgba(0,0,0,.12);
            transition:.2s ease;

        `;

        profileLink.addEventListener(
            "mouseenter",
            function () {

                profileLink.style.background =
                    "#15803d";

                profileLink.style.transform =
                    "translateY(-1px)";

            }
        );

        profileLink.addEventListener(
            "mouseleave",
            function () {

                profileLink.style.background =
                    "#166534";

                profileLink.style.transform =
                    "translateY(0)";

            }
        );

        box.appendChild(
            profileLink
        );

    }

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            function () {

                setTimeout(
                    addProfileLink,
                    100
                );

            }
        );

    } else {

        setTimeout(
            addProfileLink,
            100
        );

    }

    setTimeout(
        addProfileLink,
        500
    );

    setTimeout(
        addProfileLink,
        1000
    );

    setTimeout(
        addProfileLink,
        2000
    );

})();

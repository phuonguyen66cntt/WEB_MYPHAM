const btn = document.getElementById("loadMore");

btn.addEventListener("click", function() {
    const hiddenProducts = document.querySelectorAll(".hidden-product");

    hiddenProducts.forEach(product => {
        product.style.display = "block";
    });

    btn.style.display = "none";
});

window.addEventListener("DOMContentLoaded", () => {

    const accountMenu = document.getElementById("accountMenu");

    const isLogin = localStorage.getItem("isLogin");

    if (isLogin === "true") {

        accountMenu.innerHTML = `
            <p class="open-login">Đăng nhập</p>
            <p class="open-register">Đăng ký</p>
            <p class="open-admin">Admin</p>
        `;
           

    } else {
        accountMenu.innerHTML = `
            <p onclick="goProfile()">Tài khoản của tôi</p>
            <p onclick="logout()">Đăng xuất <i class="bx bx-arrow-out-right-square-half"></i></p>
        `;
        

        document.querySelector(".open-login")?.addEventListener("click", () => {
            document.querySelector(".login-overlay").classList.add("active");
        });

        document.querySelector(".open-register")?.addEventListener("click", () => {
            document.querySelector(".register-overlay").classList.add("active");
        });

        document.querySelector(".open-admin")?.addEventListener("click", () => {
            document.querySelector(".admin-overlay").classList.add("active");
        });
    }
});

function goProfile() {
    window.location.href = "tkdadangnhap.html";
}

function logout() {

    localStorage.clear(); 

    const accountMenu = document.getElementById("accountMenu");

    accountMenu.innerHTML = `
        <p class="open-login">Đăng nhập</p>
        <p class="open-register">Đăng ký</p>
        <p class="open-admin">Admin</p>
    `;

    window.location.href = "home.html";
}
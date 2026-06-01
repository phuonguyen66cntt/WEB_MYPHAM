const accordionHeaders = document.querySelectorAll(".accordion-header");

accordionHeaders.forEach(header => {
    header.addEventListener("click", () => {
        const accordionItem = header.parentElement;
        const content = accordionItem.querySelector(".accordion-content");

        accordionItem.classList.toggle("active");

        if(accordionItem.classList.contains("active")){
            content.style.height = content.scrollHeight + "px";
        } else{
            content.style.height = 0;
        }
    });
});

const sidebar = document.querySelector(".sidebar");

const menuIcon = document.querySelector(".menu-icon");
const closeSidebar = document.querySelector(".sidebar-close");
const overlay = document.querySelector(".sidebar-overlay");

menuIcon.addEventListener("click", () => {
    sidebar.classList.add("active");
    overlay.classList.add("active");
});

closeSidebar.addEventListener("click", () => {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");

});

overlay.addEventListener("click", () => {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
});

const swiper = new Swiper(".mySwiper", {
    slidesPerView: 4,
    spaceBetween: 20,
    loop: true,
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
    breakpoints: {
        0: {
            slidesPerView: 1,
        },
        664: {
            slidesPerView: 2,
        },
        768: {
            slidesPerView: 3,
        },
        992: {
            slidesPerView: 4,
        },
        1024: {
            slidesPerView: 5,
        }
    }
});

const fsSwiper = new Swiper(".fs-swiper", {
    slidesPerView: 4,
    spaceBetween: 20,
    loop: true,
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
    breakpoints: {
        0: {
            slidesPerView: 1,
        },
        664: {
            slidesPerView: 2,
        },
        768: {
            slidesPerView: 3,
        },
        992: {
            slidesPerView: 4,
        },
        1024: {
            slidesPerView: 5,
        }
    }
});

document.addEventListener("DOMContentLoaded", function(){
    const openLogin = document.querySelector(".open-login");
    const loginOverlay = document.querySelector(".login-overlay");
    const closeLogin = document.querySelector(".close-login");
    openLogin.addEventListener("click", function(){
        loginOverlay.classList.add("active");
    });

    closeLogin.addEventListener("click", function(){
        loginOverlay.classList.remove("active");
    });

    loginOverlay.addEventListener("click", function(e){
       if(e.target === loginOverlay){
            loginOverlay.classList.remove("active");
        }
    });
});

document.addEventListener("DOMContentLoaded", function(){
    const openRegister = document.querySelector(".open-register");
    const registerOverlay = document.querySelector(".register-overlay");
    const closeRegister = document.querySelector(".close-register");

    openRegister.addEventListener("click", function(){
        registerOverlay.classList.add("active");
    });

    closeRegister.addEventListener("click", function(){
        registerOverlay.classList.remove("active");
    });

    registerOverlay.addEventListener("click", function(e){
        if(e.target === registerOverlay){
            registerOverlay.classList.remove("active");
        }
    });
});

document.addEventListener("DOMContentLoaded", function(){
    const openAdmin = document.querySelector(".open-admin");
    const adminOverlay = document.querySelector(".admin-overlay");
    const closeAdmin = document.querySelector(".close-admin");

    openAdmin.addEventListener("click", function(){
        adminOverlay.classList.add("active");
    });

    closeAdmin.addEventListener("click", function(){
        adminOverlay.classList.remove("active");
    });

    adminOverlay.addEventListener("click", function(e){
        if(e.target === adminOverlay){
            adminOverlay.classList.remove("active");
        }
    });
});

function loginAdmin() {

    let user = document.getElementById("adminUser").value;
    let pass = document.getElementById("adminPass").value;

    if(user === "admin" && pass === "123456"){

        
        // Lưu thông tin nếu cần
        localStorage.setItem("username", user);
        localStorage.setItem("isLogin", "true");

        window.location.href = "admin.html";

    }else{

        alert("Sai tài khoản hoặc mật khẩu");

    }
}

function loginTK() {

    let username = document.querySelector('.login-frame input[type="text"]').value;
    let password = document.querySelector('.login-frame input[type="password"]').value;

    if(username === "Hồ Ngọc Hà" && password === "123456"){

        localStorage.setItem("isLogin", "true");
        localStorage.setItem("username", username);

        // Nếu đăng nhập từ tìm kiếm
        let keyword = localStorage.getItem("searchKeyword");

        if(keyword){
            window.location.href = "SpSearch.html";
        }else{
            window.location.href = "tkdadangnhap.html";
        }

    }else{

        alert("Sai tài khoản hoặc mật khẩu!");

    }

}

function registerTK() {

    let username = document.querySelector('.register-frame input[type="text"]').value;
    let email = document.querySelector('.register-frame input[type="email"]').value;
    let password = document.querySelector('.register-frame input[type="password"]').value;

    if(username && email && password){


        // Chuyển trang
        window.location.href = "tkdadangnhap.html";

    }else{
        alert("Vui lòng nhập đầy đủ thông tin!");
    }
}

// Hiển thị menu tài khoản theo trạng thái đăng nhập
window.addEventListener("DOMContentLoaded", () => {

    const accountMenu = document.getElementById("accountMenu");

    const isLogin = localStorage.getItem("isLogin");
    const username = localStorage.getItem("username");

    if (isLogin === "true") {

        accountMenu.innerHTML = `
            <p onclick="goProfile()">Tài khoản của tôi</p>
            <p onclick="logout()">Đăng xuất <i class="bx bx-arrow-out-right-square-half"></i></p>
        `;

    } else {

        accountMenu.innerHTML = `
            <p class="open-login">Đăng nhập</p>
            <p class="open-register">Đăng ký</p>
            <p class="open-admin">Admin</p>
        `;

        // gắn lại sự kiện mở form
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

    localStorage.removeItem("isLogin");
    localStorage.removeItem("username");

    window.location.href = "home.html";
}

// Tìm kiếm sản phẩm
document.addEventListener("DOMContentLoaded", function () {

    const searchInput = document.getElementById("searchInput");

    searchInput.addEventListener("keypress", function (e) {

        if (e.key === "Enter") {

            const keyword = searchInput.value.trim();

            if (keyword === "") {
                alert("Vui lòng nhập từ khóa tìm kiếm!");
                return;
            }

            // Kiểm tra đăng nhập
            const isLogin = localStorage.getItem("isLogin");

            if (isLogin !== "true") {

                alert("Vui lòng đăng nhập để tìm kiếm sản phẩm!");

                document.querySelector(".login-overlay").classList.add("active");

                // Lưu từ khóa để tìm lại sau khi đăng nhập
                localStorage.setItem("searchKeyword", keyword);

                return;
            }

            // Đã đăng nhập -> lưu từ khóa và chuyển trang
            localStorage.setItem("searchKeyword", keyword);
            window.location.href = "SpSearch.html";
        }

    });

});



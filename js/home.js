
const PRODUCTS_DATA = {
    '1': { name: 'Mascara Maybelline Lash Sensational', price: 205000, img: '../img/img1.jpg', cat: 'Trang điểm mắt' },
    '2': { name: 'Son Kem Lì Romand Juicy Lasting Tint', price: 155000, img: '../img/img2.jpg', cat: 'Son môi' },
    '3': { name: 'Phấn Nền Maybelline Fit Me Matte', price: 215000, img: '../img/img3.jpg', cat: 'Trang điểm mặt' },
    '4': { name: 'Nước Tẩy Trang L\'Oreal Khô Rát', price: 179000, img: '../img/img4.jpg', cat: 'Tẩy trang' },
    '5': { name: 'Kem Chống Nắng La Roche-Posay Anthelios', price: 395000, img: '../img/img5.jpg', cat: 'Chống nắng' },
    '6': { name: 'Sữa Rửa Mặt Cetaphil Gentle Skin', price: 145000, img: '../img/img6.jpg', cat: 'Sữa rửa mặt' },
    '7': { name: 'Tẩy Tế Bào Chết Cocoon Cà Phê Đắk Lắk', price: 125000, img: '../img/img7.jpg', cat: 'Tẩy tế bào chết' },
    '8': { name: 'Torriden DIVE-IN Serum Cấp Ẩm', price: 200000, img: '../img/img8.jpg', cat: 'Serum dưỡng ẩm' }
};


// --- Accordion Đóng/Mở ---
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
 
// --- Sidebar Mobile ---
const sidebar = document.querySelector(".sidebar");
const menuIcon = document.querySelector(".menu-icon");
const closeSidebar = document.querySelector(".sidebar-close");
const overlay = document.querySelector(".sidebar-overlay");
 
if (menuIcon && sidebar && overlay) {
    menuIcon.addEventListener("click", () => {
        sidebar.classList.add("active");
        overlay.classList.add("active");
    });
}
if (closeSidebar && sidebar && overlay) {
    closeSidebar.addEventListener("click", () => {
        sidebar.classList.remove("active");
        overlay.classList.remove("active");
    });
}
if (overlay && sidebar) {
    overlay.addEventListener("click", () => {
        sidebar.classList.remove("active");
        overlay.classList.remove("active");
    });
}
 
// --- Cấu hình Slider chính mySwiper ---
const swiper = new Swiper(".mySwiper", {
    slidesPerView: 4,
    spaceBetween: 20,
    loop: true,
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
    breakpoints: {
        0: { slidesPerView: 1 },
        664: { slidesPerView: 2 },
        768: { slidesPerView: 3 },
        992: { slidesPerView: 4 },
        1024: { slidesPerView: 5 }
    }
});
 
// --- Cấu hình Slider Flash Sale fs-swiper ---
const fsSwiper = new Swiper(".fs-swiper", {
    slidesPerView: 4,
    spaceBetween: 20,
    loop: true,
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
    breakpoints: {
        0: { slidesPerView: 1 },
        664: { slidesPerView: 2 },
        768: { slidesPerView: 3 },
        992: { slidesPerView: 4 },
        1024: { slidesPerView: 5 }
    }
});

document.addEventListener("DOMContentLoaded", function(){
    // Form Đăng nhập
    const openLogin = document.querySelector(".open-login");
    const loginOverlay = document.querySelector(".login-overlay");
    const closeLogin = document.querySelector(".close-login");
    if(openLogin && loginOverlay) {
        openLogin.addEventListener("click", function(){ loginOverlay.classList.add("active"); });
    }
    if(closeLogin && loginOverlay) {
        closeLogin.addEventListener("click", function(){ loginOverlay.classList.remove("active"); });
    }
    if(loginOverlay) {
        loginOverlay.addEventListener("click", function(e){ if(e.target === loginOverlay){ loginOverlay.classList.remove("active"); } });
    }

    // Form Đăng ký
    const openRegister = document.querySelector(".open-register");
    const registerOverlay = document.querySelector(".register-overlay");
    const closeRegister = document.querySelector(".close-register");
    if(openRegister && registerOverlay) {
        openRegister.addEventListener("click", function(){ registerOverlay.classList.add("active"); });
    }
    if(closeRegister && registerOverlay) {
        closeRegister.addEventListener("click", function(){ registerOverlay.classList.remove("active"); });
    }
    if(registerOverlay) {
        registerOverlay.addEventListener("click", function(e){ if(e.target === registerOverlay){ registerOverlay.classList.remove("active"); } });
    }

    // Form Admin
    const openAdmin = document.querySelector(".open-admin");
    const adminOverlay = document.querySelector(".admin-overlay");
    const closeAdmin = document.querySelector(".close-admin");
    if(openAdmin && adminOverlay) {
        openAdmin.addEventListener("click", function(){ adminOverlay.classList.add("active"); });
    }
    if(closeAdmin && adminOverlay) {
        closeAdmin.addEventListener("click", function(){ adminOverlay.classList.remove("active"); });
    }
    if(adminOverlay) {
        adminOverlay.addEventListener("click", function(e){ if(e.target === adminOverlay){ adminOverlay.classList.remove("active"); } });
    }
});

function loginAdmin() {
    let user = document.getElementById("adminUser")?.value;
    let pass = document.getElementById("adminPass")?.value;
    if(user === "admin" && pass === "123456"){
        window.location.href = "admin.html";
    }else{
        alert("Sai tài khoản hoặc mật khẩu");
    }
}

function loginTK() {
    let username = document.querySelector('.login-frame input[type="text"]')?.value;
    let password = document.querySelector('.login-frame input[type="password"]')?.value;
    if(username === "Hồ Ngọc Hà" && password === "123456"){
        localStorage.setItem("isLogin", "true");
        localStorage.setItem("username", username);
        window.location.href = "tkdadangnhap.html";
    }else{
        alert("Sai tài khoản hoặc mật khẩu!");
    }
}

function registerTK() {
    let username = document.querySelector('.register-frame input[type="text"]')?.value;
    let email = document.querySelector('.register-frame input[type="email"]')?.value;
    let password = document.querySelector('.register-frame input[type="password"]')?.value;
    if(username && email && password){
        window.location.href = "tkdadangnhap.html";
    }else{
        alert("Vui lòng nhập đầy đủ thông tin!");
    }
}

function goProfile() { window.location.href = "tkdadangnhap.html"; }

function logout() {
    localStorage.removeItem("isLogin");
    localStorage.removeItem("username");
    window.location.href = "home.html";
}


// Điều hướng sang trang chi tiết CTSP.html kèm theo ID sản phẩm
function goToProduct(id) {
    window.location.href = 'CTSP.html?id=' + id;
}

// Cập nhật số hiển thị Badge giỏ hàng trên Header
function updateCartCount() {
    let cart = [];
    try { cart = JSON.parse(localStorage.getItem('luv_cart')) || []; } catch(e) { cart = []; }
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    
    // Đồng bộ: Tìm cả 2 trường hợp đặt tên ID cũ hoặc class mới
    const badge = document.querySelector('.cart span') || document.getElementById('cartCount');
    if (badge) badge.textContent = count;
}

// Thiết lập trạng thái đăng nhập cho Header và menu tài khoản theo thời gian thực
window.addEventListener("DOMContentLoaded", () => {
    const accountMenu = document.getElementById("accountMenu");
    if(!accountMenu) return;

    const isLogin = localStorage.getItem("isLogin");
    const username = localStorage.getItem("username");

    if (isLogin === "true") {
        accountMenu.innerHTML = `
            <p onclick="goProfile()" style="cursor:pointer; font-weight:600;">👤 ${username || 'Tài khoản của tôi'}</p>
            <p onclick="logout()" style="cursor:pointer; color:#999; margin-left:10px;">Đăng xuất <i class="bx bx-arrow-out-right-square-half"></i></p>
        `;
    } else {
        accountMenu.innerHTML = `
            <p class="open-login">Đăng nhập</p>
            <p class="open-register">Đăng ký</p>
            <p class="open-admin">Admin</p>
        `;
        // Gắn lại sự kiện mở form sau khi viết đè HTML tĩnh
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

// Khởi chạy đồng bộ hệ thống khi DOM load xong
document.addEventListener('DOMContentLoaded', function(){
    updateCartCount();
    
    // Gán sự kiện click cho các khối sản phẩm (Ép vào trang chi tiết)
    const items = document.querySelectorAll('.pro-item, .box-sale');
    items.forEach((item, index) => {
        item.style.cursor = "pointer";
        
        // Ẩn nút mua nhanh trực tiếp ngoài danh sách theo yêu cầu của bạn
        const quickBtn = item.querySelector('.add-to-cart-btn');
        if(quickBtn) quickBtn.style.display = 'none';

        item.onclick = function(e) {
            const productId = (index + 1).toString(); // Tạo ID từ 1 đến 8 đồng bộ cơ sở dữ liệu
            goToProduct(productId);
        };
    });

    // Sự kiện bấm vào Icon Giỏ hàng
    const cartBtn = document.querySelector('.cart');
    if(cartBtn) {
        cartBtn.addEventListener('click', function(){
            window.location.href = 'cart.html';
        });
    }
    
    // Xử lý tìm kiếm cơ bản dẫn sang trang SpSearch.html
    const searchBtn = document.querySelector('.box-i');
    const searchInput = document.querySelector('.search input');
    if(searchBtn && searchInput) {
        searchBtn.onclick = function() {
            if(searchInput.value.trim() !== "") {
                window.location.href = 'SpSearch.html?query=' + encodeURIComponent(searchInput.value.trim());
            }
        };
    }
});

// --- Đồng hồ đếm ngược Flash Sale liên tục ---
(function(){
    let end = new Date().getTime() + 2*60*60*1000; // Đếm ngược 2 tiếng
    function tick(){
        let now = new Date().getTime(), diff = Math.max(0, end - now);
        let h = Math.floor(diff / 3600000), 
            m = Math.floor((diff % 3600000) / 60000), 
            s = Math.floor((diff % 60000) / 1000);
            
        const eh = document.getElementById('fh'), 
              em = document.getElementById('fm'), 
              es = document.getElementById('fs') || document.getElementById('fs_');
              
        if(eh) eh.textContent = String(h).padStart(2, '0');
        if(em) em.textContent = String(m).padStart(2, '0');
        if(es) es.textContent = String(s).padStart(2, '0');
    }
    setInterval(tick, 1000); 
    tick();
})();
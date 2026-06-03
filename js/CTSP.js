window.addEventListener("DOMContentLoaded", () => {

    const accountMenu = document.getElementById("accountMenu");

    const isLogin = localStorage.getItem("isLogin");

    if (isLogin === "true") {

        accountMenu.innerHTML = `
            <p onclick="goProfile()">Tài khoản của tôi</p>
            <p onclick="logout()">Đăng xuất <i class="bx bx-arrow-out-right-square-half"></i></p>
        `;
    }
});

function goProfile() {
    window.location.href = "tkdadangnhap.html";
}

function logout() {
    localStorage.removeItem("isLogin");
    localStorage.removeItem("username");
    localStorage.removeItem("searchKeyword");
    window.location.href = "home.html";
}

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

// ===== DỮ LIỆU SẢN PHẨM =====
const PRODUCTS = [
    { id:'p1', name:'Son Tint Romand', price:200000, img:'../img/img8.jpg', cat:'Son môi' },
    { id:'p2', name:'Serum Torriden', price:350000, img:'../img/img9.jpg', cat:'Serum' },
    { id:'p3', name:'Kem dưỡng ẩm', price:280000, img:'../img/img10.jpg', cat:'Kem dưỡng' },
    { id:'p4', name:'Mặt nạ Abib', price:180000, img:'../img/img11.jpg', cat:'Mặt nạ' },
    { id:'p5', name:'Toner Klairs', price:320000, img:'../img/img12.jpg', cat:'Toner' },
    { id:'p6', name:'Kem chống nắng', price:250000, img:'../img/img13.jpg', cat:'SPF' },
];

// Lấy ID sản phẩm từ URL truy cập
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');
let currentProduct = PRODUCTS.find(p => p.id === productId) || PRODUCTS[0];

function loadProduct() {
    document.getElementById('mainProductImg').src = currentProduct.img;
    document.getElementById('productName').textContent = currentProduct.name;
    document.getElementById('productPrice').textContent = currentProduct.price.toLocaleString('vi-VN') + 'đ';
    document.title = 'L.U.V - ' + currentProduct.name;
}

// ===== ĐIỀU KHIỂN SỐ LƯỢNG =====
function changeDetailQty(d) {
    const input = document.getElementById('detailQty');
    let val = parseInt(input.value) + d;
    if (val < 1) val = 1;
    if (val > 99) val = 99;
    input.value = val;
}

// ===== XỬ LÝ GIỎ HÀNG (LocalStorage) =====
function getCart() { try { return JSON.parse(localStorage.getItem('luv_cart')) || []; } catch(e) { return []; } }
function saveCart(c) { localStorage.setItem('luv_cart', JSON.stringify(c)); }

function updateCartCount() {
    const c = getCart();
    const el = document.getElementById('cartCount');
    if (el) el.textContent = c.reduce((s,i) => s+i.qty, 0);
}

function addToCartDetail() {

    const isLogin = localStorage.getItem("isLogin");

    if (isLogin !== "true") {

        alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");

        localStorage.setItem("returnPage", window.location.href);

        window.location.href = "home.html";
        return;
    }

    const qty = parseInt(document.getElementById('detailQty').value);

    let cart = getCart();

    const idx = cart.findIndex(i => i.id === currentProduct.id);

    if (idx >= 0) {
        cart[idx].qty += qty;
    } else {
        cart.push({
            id: currentProduct.id,
            name: currentProduct.name,
            price: currentProduct.price,
            img: currentProduct.img,
            qty: qty
        });
    }

    saveCart(cart);
    updateCartCount();

    showToast('✅ Đã thêm ' + currentProduct.name + ' vào giỏ!');
}

function buyNowDetail() {

    const isLogin = localStorage.getItem("isLogin");

    if (isLogin !== "true") {

        alert("Vui lòng đăng nhập để mua hàng!");

        localStorage.setItem("returnPage", window.location.href);

        window.location.href = "home.html";
        return;
    }

    addToCartDetail();
    setTimeout(() => {
        window.location.href = 'cart.html';
    }, 600);
}

// ===== YÊU THÍCH =====
function toggleWishlist(el) {
    const icon = document.getElementById('heartIcon');
    icon.classList.toggle('fa-heart-o');
    icon.classList.toggle('fa-heart');
    icon.style.color = icon.classList.contains('fa-heart') ? '#ff4466' : '';
    showToast(icon.classList.contains('fa-heart') ? '❤️ Đã thêm vào yêu thích!' : 'Đã xóa khỏi yêu thích');
}

function showToast(msg) {
    const t = document.getElementById('toastMsg');
    t.textContent = msg; t.style.opacity = '1';
    clearTimeout(window._tt);
    window._tt = setTimeout(() => { t.style.opacity = '0'; }, 2200);
}

// ===== TỰ ĐỘNG DỰA VÀO ĐỐI TƯỢNG ĐỂ RENDER SẢN PHẨM LIÊN QUAN =====
function renderRelated() {
    const related = PRODUCTS.filter(p => p.id !== currentProduct.id);
    document.getElementById('relatedProducts').innerHTML = related.map(p => `
        <div class="swiper-slide">
            <div class="pro-item" onclick="goToProduct('${p.id}')" style="cursor:pointer;">
                <img src="${p.img}" alt="${p.name}" onerror="this.src='https://placehold.co/180x180/ffd4e1/ff81a5?text=SP'">
                <p>${p.name}</p>
                <div class="item">
                    <p style="color:#ff81a5;font-weight:700;">${p.price.toLocaleString('vi-VN')}đ</p>
                </div>
                <div class="star"><i class="fa fa-star" style="color:#ff81a5;"></i><p>5.0</p></div>
            </div>
        </div>`).join('');
}

function goToProduct(id) {
    window.location.href = 'CTSP.html?id=' + id;
}

// ===== TRẠNG THÁI ĐĂNG NHẬP TRÊN HEADER =====
function updateHeader() {
    const isLogin = localStorage.getItem('isLogin') === 'true';
    const accountMenu = document.getElementById('accountMenu');
    if (isLogin) {
        const username = localStorage.getItem('username') || 'Tài khoản';
        accountMenu.innerHTML = `
            <p onclick="window.location.href='tkdadangnhap.html'" style="cursor:pointer;">Tài khoản của tôi</p>
            <p onclick="logout()" style="cursor:pointer;">Đăng xuất <i class="bx bx-arrow-out-right-square-half"></i></p>
        `;
    }
}

function logout() {
    localStorage.removeItem('isLogin');
    localStorage.removeItem('username');
    location.reload();
}

// ===== KHỞI CHẠY =====
document.addEventListener('DOMContentLoaded', function() {
    loadProduct();
    renderRelated();
    updateCartCount();
    updateHeader();
    
    // Cấu hình Slider Swiper chạy mượt mà
    new Swiper('.mySwiper', {
        slidesPerView: 4, spaceBetween: 20, loop: true,
        navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
        breakpoints: { 0:{slidesPerView:1}, 600:{slidesPerView:2}, 900:{slidesPerView:3}, 1200:{slidesPerView:4} }
    });
});
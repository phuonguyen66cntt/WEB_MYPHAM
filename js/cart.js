let cart = [];
let discount = 0;
let shipFee = 30000;
let orderData = {};
let trackStep = 0;

const TRACK_STEPS = [
    { title: "Đơn hàng đã xác nhận", desc: "L.U.V đã tiếp nhận đơn hàng của bạn", icon: "✅" },
    { title: "Đang lấy hàng", desc: "Nhân viên đang chuẩn bị và đóng gói sản phẩm", icon: "📦" },
    { title: "Đang vận chuyển", desc: "Đơn hàng đang trên đường giao đến bạn", icon: "🚚" },
    { title: "Đang giao hàng", desc: "Shipper đang giao hàng đến địa chỉ của bạn", icon: "🛵" },
    { title: "Đã giao hàng", desc: "Đơn hàng đã được giao thành công!", icon: "🎉" },
];

function getCart() { 
    try { return JSON.parse(localStorage.getItem('luv_cart')) || []; } 
    catch(e) { return []; } 
}

function saveCart(c) { localStorage.setItem('luv_cart', JSON.stringify(c)); }

function fmt(n) { return n.toLocaleString('vi-VN') + 'đ'; }

function isLoggedIn() {
    return localStorage.getItem('isLogin') === 'true';
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    const el = document.getElementById('cartCount');
    if (el) el.textContent = count;
}

function showToast(msg) {
    const t = document.getElementById('toastMsg');
    if (!t) return;
    t.textContent = msg; 
    t.classList.add('show');
    clearTimeout(window._tt); 
    window._tt = setTimeout(() => t.classList.remove('show'), 2000);
}

// ===== STEP NAVIGATION =====
function setStep(n) {
    [1,2,3,4].forEach(i => {
        const s = document.getElementById('step'+i);
        s.classList.remove('active','done');
        if (i < n) s.classList.add('done');
        if (i === n) s.classList.add('active');
    });
    ['pageCart','pageCheckout','pageConfirm','pageTracking'].forEach((id,i) => {
        document.getElementById(id).classList.toggle('active', i+1 === n);
    });
}

// ===== PAGE 1: CART =====
function renderCart() {
    cart = getCart();
    const list = document.getElementById('cartItemsList');
    const empty = document.getElementById('emptyCart');
    
    if (cart.length === 0) { 
        list.innerHTML = ''; 
        empty.style.display = 'block'; 
        document.getElementById('checkoutBtn').disabled = true; 
        updateCartCount();
        return; 
    }
    
    empty.style.display = 'none'; 
    document.getElementById('checkoutBtn').disabled = false;
    
    list.innerHTML = cart.map((item,i) => `
        <div class="cart-item">
            <img src="${item.img || ''}" alt="" onerror="this.src='https://placehold.co/75x75/ffd4e1/ff81a5?text=SP'">
            <div class="cart-item-info">
                <div class="name">${item.name}</div>
                <div class="price">${fmt(item.price)}</div>
                <div class="qty-ctrl">
                    <button class="qty-btn" onclick="changeQty(${i},-1)">-</button>
                    <span class="qty-val">${item.qty}</span>
                    <button class="qty-btn" onclick="changeQty(${i},1)">+</button>
                </div>
            </div>
            <span class="remove-btn" onclick="removeItem(${i})"><i class="fa fa-trash"></i></span>
        </div>`).join('');
    updateSummary();
    updateCartCount();
}

function changeQty(i, d) {
    cart[i].qty += d;
    if (cart[i].qty <= 0) cart.splice(i,1);
    saveCart(cart); 
    renderCart();
}

function removeItem(i) {
    cart.splice(i,1); 
    saveCart(cart); 
    renderCart();
    showToast('Đã xóa sản phẩm khỏi giỏ');
}

function updateSummary() {
    const sub = cart.reduce((s,i) => s+i.price*i.qty, 0);
    document.getElementById('subtotalTxt').textContent = fmt(sub);
    document.getElementById('discountTxt').textContent = '-' + fmt(discount);
    document.getElementById('shipFeeTxt').textContent = 'Chọn ở bước sau';
    document.getElementById('totalTxt').textContent = fmt(sub - discount);
}

function applyPromo() {
    const code = document.getElementById('promoInput').value.trim().toUpperCase();
    const sub = cart.reduce((s,i) => s+i.price*i.qty, 0);
    if (code === 'LUV10') { discount = Math.floor(sub * 0.1); showToast('Áp dụng mã LUV10: giảm 10%!'); }
    else if (code === 'SALE50K') { discount = 50000; showToast('Áp dụng mã SALE50K: giảm 50.000đ!'); }
    else { discount = 0; showToast('Mã không hợp lệ!'); }
    updateSummary();
}

function goToStep1() { 
    setStep(1); renderCart(); window.scrollTo(0,0); 
}

// ===== PAGE 2: CHECKOUT — kiểm tra đăng nhập =====
function goToStep2() {
    cart = getCart();
    if (cart.length === 0) { showToast('Giỏ hàng trống!'); return; }

    // ✅ KIỂM TRA ĐĂNG NHẬP
    if (!isLoggedIn()) {
        // Hiện popup nhắc đăng nhập
        showLoginPrompt();
        return;
    }

    setStep(2); 
    renderCheckoutPreview(); 
    window.scrollTo(0,0);
}

// Hiện popup nhắc đăng nhập/đăng ký
function showLoginPrompt() {
    const overlay = document.getElementById('loginPromptOverlay');
    if (overlay) {
        overlay.classList.add('active');
    } else {
        // Fallback: mở login overlay nếu có
        const lo = document.querySelector('.login-overlay');
        if (lo) lo.classList.add('active');
    }
}

function closeLoginPrompt() {
    const overlay = document.getElementById('loginPromptOverlay');
    if (overlay) overlay.classList.remove('active');
}

function goToLogin() {
    closeLoginPrompt();
    const lo = document.querySelector('.login-overlay');
    if (lo) lo.classList.add('active');
}

function goToRegister() {
    closeLoginPrompt();
    const ro = document.querySelector('.register-overlay');
    if (ro) ro.classList.add('active');
}

function renderCheckoutPreview() {
    const sub = cart.reduce((s,i) => s+i.price*i.qty, 0);
    document.getElementById('checkoutItemsPreview').innerHTML = cart.map(item =>
        `<div class="order-item-row">
            <img src="${item.img || ''}" alt="" onerror="this.src='https://placehold.co/55x55/ffd4e1/ff81a5?text=SP'">
            <div><div class="name">${item.name}</div><div class="sub">x${item.qty}</div></div>
            <div class="price">${fmt(item.price*item.qty)}</div>
        </div>`
    ).join('');
    document.getElementById('subtotalTxt2').textContent = fmt(sub);
    document.getElementById('discountTxt2').textContent = '-'+fmt(discount);
    document.getElementById('shipFeeTxt2').textContent = fmt(shipFee);
    document.getElementById('totalTxt2').textContent = fmt(sub-discount+shipFee);

    // Điền tên người dùng nếu đã đăng nhập
    const username = localStorage.getItem('username');
    if (username) {
        const fnInput = document.getElementById('fullname');
        if (fnInput && !fnInput.value) fnInput.value = username;
    }
}

function selectShip(el, fee) {
    document.querySelectorAll('.ship-opt').forEach(e => e.classList.remove('selected'));
    document.querySelectorAll('input[name="ship"]').forEach(r => r.checked = false);
    el.classList.add('selected');
    const radio = el.querySelector('input');
    if (radio) radio.checked = true;
    shipFee = fee;
    renderCheckoutPreview();
}

function selectPay(el) {
    document.querySelectorAll('.pay-method').forEach(e => e.classList.remove('selected'));
    el.classList.add('selected');
}

function placeOrder() {
    const name = document.getElementById('fullname').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    if (!name || !phone || !address) { showToast('Vui lòng điền đầy đủ thông tin!'); return; }
    
    const sub = cart.reduce((s,i) => s+i.price*i.qty, 0);
    const orderId = 'LUV' + String(Math.floor(Math.random()*9000)+1000);
    const now = new Date();
    
    orderData = { 
        id: orderId, date: now, name, phone, 
        email: document.getElementById('email').value, 
        city: document.getElementById('city').value, 
        address, note: document.getElementById('note').value, 
        subtotal: sub, discount, shipFee, 
        total: sub-discount+shipFee, 
        items: [...cart], 
        status: 'confirmed',
        payMethod: document.querySelector('.pay-method.selected')?.textContent || 'COD' 
    };
    
    // Lưu vào luv_orders
    let orders = [];
    try { orders = JSON.parse(localStorage.getItem('luv_orders')) || []; } catch(e){}
    orders.unshift(orderData);
    localStorage.setItem('luv_orders', JSON.stringify(orders));
    localStorage.setItem('luv_order', JSON.stringify(orderData));
    
    saveCart([]); 
    trackStep = 0;
    setStep(3); 
    renderConfirm(); 
    window.scrollTo(0,0);
}

// ===== PAGE 3: CONFIRM =====
function renderConfirm() {
    const o = orderData;
    document.getElementById('confirmOrderId').textContent = 'Đơn hàng #' + o.id;
    document.getElementById('confirmDate').textContent = o.date ? new Date(o.date).toLocaleString('vi-VN') : '';
    document.getElementById('confirmSubtotal').textContent = fmt(o.subtotal);
    document.getElementById('confirmDiscount').textContent = '-'+fmt(o.discount);
    document.getElementById('confirmShip').textContent = fmt(o.shipFee);
    document.getElementById('confirmTotal').textContent = fmt(o.total);
    document.getElementById('confirmAddress').innerHTML = `<b>${o.name}</b> — ${o.phone}<br>${o.address}${o.city?', '+o.city:''}<br>Thanh toán: ${o.payMethod}`;
    document.getElementById('confirmItemsList').innerHTML = o.items.map(item =>
        `<div class="order-item-row">
            <img src="${item.img||''}" alt="" onerror="this.src='https://placehold.co/55x55/ffd4e1/ff81a5?text=SP'">
            <div><div class="name">${item.name}</div><div class="sub">x${item.qty}</div></div>
            <div class="price">${fmt(item.price*item.qty)}</div>
        </div>`
    ).join('');
}

function goToTracking() { setStep(4); renderTracking(); window.scrollTo(0,0); }

// ===== PAGE 4: TRACKING =====
function renderTracking() {
    try { orderData = JSON.parse(localStorage.getItem('luv_order')) || orderData; } catch(e){}
    const o = orderData;
    document.getElementById('trackOrderId').textContent = 'Đơn hàng #' + (o.id || '---');
    document.getElementById('trackDate').textContent = o.date ? new Date(o.date).toLocaleString('vi-VN') : '';
    document.getElementById('trackStatus').textContent = TRACK_STEPS[trackStep]?.icon + ' ' + (TRACK_STEPS[trackStep]?.title || '');
    
    const tl = document.getElementById('trackTimeline');
    tl.innerHTML = TRACK_STEPS.map((s,i) => `
        <div class="track-step ${i < trackStep ? 'done' : i === trackStep ? 'current' : ''}">
            <div class="track-dot"></div>
            <div class="track-title">${s.icon} ${s.title}</div>
            ${i <= trackStep ? `<div class="track-time">${new Date().toLocaleString('vi-VN')}</div><div class="track-desc">${s.desc}</div>` : ''}
        </div>`).join('');
        
    if (o.items) {
        document.getElementById('trackItemsList').innerHTML = o.items.map(item =>
            `<div class="order-item-row">
                <img src="${item.img||''}" alt="" onerror="this.src='https://placehold.co/55x55/ffd4e1/ff81a5?text=SP'">
                <div><div class="name">${item.name}</div><div class="sub">x${item.qty}</div></div>
                <div class="price">${fmt(item.price*item.qty)}</div>
            </div>`
        ).join('');
    }
}

function simulateNextStep() {
    if (trackStep < TRACK_STEPS.length-1) { 
        trackStep++; renderTracking(); 
        showToast(TRACK_STEPS[trackStep].icon + ' ' + TRACK_STEPS[trackStep].title); 
    } else { 
        showToast('Đơn hàng đã giao thành công! 🎉'); 
    }
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', function() {
   if (document.getElementById('cartItemsList')) {
        renderCart(); 
        setStep(1);
    }
    
    // Trang nào cũng cần chạy hàm này nên để ở ngoài
    updateHeaderLogin();
});

function updateHeaderLogin() {
    const accountMenu = document.getElementById('accountMenu');
    if (!accountMenu) return;
    if (isLoggedIn()) {
        const username = localStorage.getItem('username') || 'Tài khoản';
        accountMenu.innerHTML = `
            <p onclick="window.location.href='tkdadangnhap.html'">👤 ${username}</p>
            <p onclick="logoutCart()">Đăng xuất</p>
        `;
    } else {
        accountMenu.innerHTML = `
            <p class="open-login-btn">Đăng nhập</p>
            <p class="open-register-btn">Đăng ký</p>
        `;
        setTimeout(() => {
            document.querySelector('.open-login-btn')?.addEventListener('click', () => {
                document.querySelector('.login-overlay')?.classList.add('active');
            });
            document.querySelector('.open-register-btn')?.addEventListener('click', () => {
                document.querySelector('.register-overlay')?.classList.add('active');
            });
        }, 100);
    }
}

function logoutCart() {
    localStorage.removeItem('isLogin');
    localStorage.removeItem('username');
    location.reload();
}
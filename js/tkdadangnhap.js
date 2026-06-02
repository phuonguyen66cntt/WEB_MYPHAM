// ===== CHUYỂN TAB =====
function showTab(tabName, clickedItem) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.style.display = 'none';
    });

    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });

    const target = document.getElementById('tab-' + tabName);
    if (target) {
        target.style.display = (tabName === 'hoso') ? 'grid' : 'block';
    }

    if (clickedItem) clickedItem.classList.add('active');

    // Khi chuyển sang tab đơn mua thì load danh sách
    if (tabName === 'donmua') initOrders();
}


window.addEventListener('DOMContentLoaded', () => {
    showTab('hoso', document.querySelector('.menu-item'));

    // Gắn sự kiện modal xác nhận đơn hàng
    document.getElementById('modalConfirmBtn').addEventListener('click', function() {
        if (!pendingAction) return;
        const { type, orderId } = pendingAction;
        const order = orders.find(o => o.id === orderId);
        if (!order) return;
        if (type === 'cancel') {
            order.status = 'cancelled';
            showToast('Đã hủy đơn hàng #' + orderId);
        } else if (type === 'received') {
            order.status = 'completed';
            showToast('Cảm ơn bạn đã xác nhận nhận hàng! 🎉');
        } else if (type === 'return') {
            order.status = 'returning';
            showToast('Yêu cầu trả hàng đã được gửi!');
        }
        saveOrders();
        closeModal();
        renderOrders(currentFilter);
    });
 
    document.getElementById('modalOverlay').addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });
});

// ===== ĐỔI ẢNH =====
document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('profileAvatar').src = e.target.result;
            document.getElementById('leftAvatar').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// ===== LƯU HỒ SƠ =====
function saveProfile() {
    const updatedUsername = document.getElementById('input-username').value;
    const updatedEmail = document.getElementById('input-email').value;
    const updatedPhone = document.getElementById('input-phone').value;
    const updatedAddress = document.getElementById('input-address').value;

    if (!updatedUsername.trim()) {
        alert("Tên đăng nhập không được để trống!");
        return;
    }
      localStorage.setItem('luv_user', JSON.stringify({
        name: updatedUsername,
        avatar: document.getElementById('profileAvatar').src
    }));

    document.getElementById('leftUsername').innerText = updatedUsername;
    alert("Thông tin cá nhân của bạn đã được cập nhật thành công!");

    console.log({ username: updatedUsername, email: updatedEmail, phone: updatedPhone, address: updatedAddress });
}

window.addEventListener('DOMContentLoaded', () => {
    showTab('hoso', document.querySelector('.menu-item'));

    // Lưu thông tin user mặc định nếu chưa có
    if (!localStorage.getItem('luv_user')) {
        const defaultUser = {
            name: document.getElementById('leftUsername').innerText,
            avatar: document.getElementById('leftAvatar').src
        };
        localStorage.setItem('luv_user', JSON.stringify(defaultUser));
    }
});

// ===== LOGIC ĐƠN MUA =====
const DEMO_ORDERS = [
    {
        id: 'LUV1001',
        date: new Date(Date.now() - 1000*60*30).toISOString(),
        status: 'confirmed',
        name: 'Nguyễn Thị Mai', address: '123 Đường ABC, Khánh Hòa', payMethod: 'COD',
        subtotal: 480000, discount: 0, shipFee: 30000, total: 510000,
        items: [
            { name: 'Torriden DIVE-IN Serum', price: 200000, qty: 1, img: '../img/img8.jpg', cat: 'Serum dưỡng ẩm' },
            { name: 'Abib Dark Spot Serum',   price: 280000, qty: 1, img: '../img/img10.jpg', cat: 'Serum trị thâm' }
        ]
    },
    {
        id: 'LUV1002',
        date: new Date(Date.now() - 1000*60*60*3).toISOString(),
        status: 'pickup',
        name: 'Nguyễn Thị Mai', address: '123 Đường ABC, Khánh Hòa', payMethod: 'Chuyển khoản',
        subtotal: 320000, discount: 0, shipFee: 30000, total: 350000,
        items: [
            { name: 'Skin1004 Centella Ampoule', price: 320000, qty: 1, img: '../img/img13.jpg', cat: 'Ampoule dưỡng da' }
        ]
    },
    {
        id: 'LUV1003',
        date: new Date(Date.now() - 1000*60*60*24).toISOString(),
        status: 'delivered',
        name: 'Nguyễn Thị Mai', address: '123 Đường ABC, Khánh Hòa', payMethod: 'MoMo',
        subtotal: 380000, discount: 0, shipFee: 30000, total: 410000,
        items: [
            { name: 'Torriden Cellmazing Ampoule', price: 380000, qty: 1, img: '../img/img16.jpg', cat: 'Brightening Ampoule' }
        ]
    },
    {
        id: 'LUV1004',
        date: new Date(Date.now() - 1000*60*60*48).toISOString(),
        status: 'cancelled',
        name: 'Nguyễn Thị Mai', address: '123 Đường ABC, Khánh Hòa', payMethod: 'COD',
        subtotal: 200000, discount: 0, shipFee: 30000, total: 230000,
        items: [
            { name: 'Torriden DIVE-IN Serum', price: 200000, qty: 1, img: '../img/img8.jpg', cat: 'Serum dưỡng ẩm' }
        ]
    }
];
 
const STATUS_LABELS = {
    confirmed: { text: 'Chờ xác nhận', cls: 'badge-confirmed' },
    pickup:    { text: 'Chờ lấy hàng', cls: 'badge-pickup' },
    shipping:  { text: 'Đang giao',    cls: 'badge-shipping' },
    delivered: { text: 'Đã giao',      cls: 'badge-delivered' },
    cancelled: { text: 'Đã hủy',       cls: 'badge-cancelled' },
};
 
let orders = [];
let currentFilter = 'all';
let pendingAction = null;
 
function fmtO(n) { return (n||0).toLocaleString('vi-VN') + 'đ'; }
 
function initOrders() {
    try {
        const saved = JSON.parse(localStorage.getItem('luv_orders')) || [];
        const realOrder = JSON.parse(localStorage.getItem('luv_order'));
        if (realOrder && realOrder.id) {
            if (!realOrder.status) realOrder.status = 'confirmed';
            realOrder.items.forEach(i => { if (!i.cat) i.cat = 'Sản phẩm L.U.V'; });
            const existsIdx = saved.findIndex(o => o.id === realOrder.id);
            if (existsIdx >= 0) saved[existsIdx].status = realOrder.status;
            else saved.unshift(realOrder);
            localStorage.setItem('luv_orders', JSON.stringify(saved));
        }
        orders = saved.length > 0 ? saved : DEMO_ORDERS;
    } catch(e) {
        orders = DEMO_ORDERS;
    }
    renderOrders('all');
    // Reset filter tab về Tất cả
    document.querySelectorAll('.tab-btn').forEach((b, i) => {
        b.classList.toggle('active', i === 0);
    });
}
 
function renderOrders(filter) {
    currentFilter = filter;
    const list = document.getElementById('ordersList');
    if (!list) return;
    const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);
    if (filtered.length === 0) {
        list.innerHTML = `
            <div class="empty-orders">
                <i class="bx bx-package"></i>
                <h3>Chưa có đơn hàng</h3>
                <p>Hãy mua sắm ngay nhé!</p>
                <a href="home.html" class="btn-pink-order" style="text-decoration:none;padding:12px 28px;border-radius:12px;display:inline-block;">Mua sắm ngay</a>
            </div>`;
        return;
    }
    list.innerHTML = filtered.map(order => renderOrderCard(order)).join('');
}
 
function renderOrderCard(order) {
    const st = STATUS_LABELS[order.status] || { text: order.status, cls: 'badge-confirmed' };
    const dateStr = order.date ? new Date(order.date).toLocaleString('vi-VN') : '';
    const itemsHtml = order.items.map(item => `
        <div class="order-item-row">
            <img src="${item.img || ''}" alt="" onerror="this.src='https://via.placeholder.com/70'">
            <div class="order-item-info">
                <div class="name">${item.name}</div>
                <div class="cat">${item.cat || ''}</div>
                <div class="qty">x${item.qty}</div>
            </div>
            <div class="order-item-price">
                <div class="price">${fmtO(item.price)}</div>
                <div class="subtotal">Thành tiền: ${fmtO(item.price * item.qty)}</div>
            </div>
        </div>`).join('');
    return `
        <div class="order-card" id="order-${order.id}">
            <div class="order-card-header">
                <span>Mã đơn: <b>#${order.id}</b> &nbsp;|&nbsp; ${dateStr}</span>
                <span class="order-status-badge ${st.cls}">${st.text}</span>
            </div>
            ${itemsHtml}
            <div class="order-card-footer">
                <div class="order-total">Tổng tiền: <span>${fmtO(order.total)}</span></div>
                <div class="order-actions">${getActions(order)}</div>
            </div>
        </div>`;
}
 
function getActions(order) {
    switch(order.status) {
        case 'confirmed':
        case 'pickup':
            return `
                <button class="btn-action btn-cancel" onclick="confirmAction('cancel','${order.id}')">Hủy đơn hàng</button>
                <button class="btn-action btn-contact" onclick="showToast('Đang kết nối người bán...')">Liên hệ người bán</button>`;
        case 'shipping':
            return `<button class="btn-action btn-contact" onclick="showToast('Đang kết nối người bán...')">Liên hệ người bán</button>`;
        case 'delivered':
            return `
                <button class="btn-action btn-received" onclick="confirmAction('received','${order.id}')">Đã nhận được hàng</button>
                <button class="btn-action btn-return" onclick="confirmAction('return','${order.id}')">Trả hàng / Hoàn tiền</button>
                <button class="btn-action btn-rebuy" onclick="rebuy('${order.id}')">Mua lại</button>`;
        case 'cancelled':
            return `
                <button class="btn-action btn-rebuy" onclick="rebuy('${order.id}')">Mua lại</button>
                <button class="btn-action btn-contact" onclick="showToast('Đang kết nối người bán...')">Liên hệ người bán</button>`;
        default: return '';
    }
}
 
function filterOrders(filter, btn) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderOrders(filter);
}
 
function confirmAction(type, orderId) {
    const msgs = {
        cancel:   { title: 'Hủy đơn hàng',          msg: 'Bạn có chắc muốn hủy đơn hàng này không?' },
        received: { title: 'Xác nhận đã nhận hàng',  msg: 'Bạn xác nhận đã nhận được hàng và hài lòng?' },
        return:   { title: 'Trả hàng / Hoàn tiền',   msg: 'Bạn muốn trả hàng và yêu cầu hoàn tiền?' },
    };
    const m = msgs[type];
    document.getElementById('modalTitle').textContent = m.title;
    document.getElementById('modalMsg').textContent = m.msg;
    pendingAction = { type, orderId };
    document.getElementById('modalOverlay').classList.add('active');
}
 
function closeModal() {
    document.getElementById('modalOverlay').classList.remove('active');
    pendingAction = null;
}
 
function rebuy(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    let cart = [];
    try { cart = JSON.parse(localStorage.getItem('luv_cart')) || []; } catch(e){}
    order.items.forEach(item => {
        const idx = cart.findIndex(c => c.name === item.name);
        if (idx >= 0) cart[idx].qty += item.qty;
        else cart.push({ id: 'rb_' + Date.now(), name: item.name, price: item.price, img: item.img, qty: item.qty });
    });
    localStorage.setItem('luv_cart', JSON.stringify(cart));
    showToast('Đã thêm vào giỏ hàng!');
    setTimeout(() => window.location.href = 'cart.html', 1200);
}
 
function saveOrders() {
    try { localStorage.setItem('luv_orders', JSON.stringify(orders)); } catch(e){}
}
 
function showToast(msg) {
    const t = document.getElementById('toastMsg');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(window._tt);
    window._tt = setTimeout(() => t.classList.remove('show'), 2000);
}
 

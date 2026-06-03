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
}


window.addEventListener('DOMContentLoaded', () => {
    loadProfile();
    // 1. Đọc tham số ?tab=... trên URL
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');

    if (tab) {
        // Tìm menu item dựa trên thuộc tính onclick chứa tên tab (ví dụ: onclick="showTab('caidat', this)")
        let menuItem = document.querySelector(`.menu-item[onclick*="${tab}"]`);
        
        // Nếu không tìm thấy bằng onclick, tìm thử bằng cách quét text hiển thị bên trong
        if (!menuItem) {
            const menuItems = document.querySelectorAll('.menu-item');
            menuItems.forEach(item => {
                if (item.innerHTML.toLowerCase().includes(tab.toLowerCase()) || 
                   (tab === 'caidat' && item.innerHTML.includes('Cài đặt'))) {
                    menuItem = item;
                }
            });
        }

        // Kích hoạt tab được truyền từ URL
        showTab(tab, menuItem);
    } else {
        // 2. Nếu không có tham số trên URL, mặc định hiện tab hồ sơ và kích hoạt menu item đầu tiên
        showTab('hoso', document.querySelector('.menu-item'));
    }
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
    const updatedUsername = document.getElementById('input-username').value.trim();
    const updatedEmail    = document.getElementById('input-email').value.trim();
    const updatedPhone    = document.getElementById('input-phone').value.trim();
    const updatedAddress  = document.getElementById('input-address').value.trim();

    if (!updatedUsername) {
        alert("Tên đăng nhập không được để trống!");
        return;
    }

    // Lưu vào localStorage dưới dạng object luv_user (đồng bộ với orders.js)
    const userObj = { name: updatedUsername, email: updatedEmail, phone: updatedPhone, address: updatedAddress };
    localStorage.setItem('luv_user', JSON.stringify(userObj));

    // Cập nhật DOM ngay
    document.getElementById('leftUsername').innerText = updatedUsername;
    alert("Thông tin cá nhân của bạn đã được cập nhật thành công!");
}

// ===== TẢI THÔNG TIN ĐÃ LƯU =====
function loadProfile() {
    try {
        const user = JSON.parse(localStorage.getItem('luv_user'));
        if (!user) return;

        if (user.name)    { 
            document.getElementById('input-username').value = user.name;
            document.getElementById('leftUsername').innerText = user.name;
        }
        if (user.email)   document.getElementById('input-email').value   = user.email;
        if (user.phone)   document.getElementById('input-phone').value   = user.phone;
        if (user.address) document.getElementById('input-address').value = user.address;
    } catch(e) {}
}

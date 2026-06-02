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

// Mặc định hiện tab hồ sơ khi load trang
window.addEventListener('DOMContentLoaded', () => {
    showTab('hoso', document.querySelector('.menu-item'));

    // Đọc ?tab=... trên URL và mở đúng tab
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab) {
        const menuItem = document.querySelector(`.menu-item[onclick*="${tab}"]`);
        showTab(tab, menuItem);
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
    const updatedUsername = document.getElementById('input-username').value;
    const updatedEmail = document.getElementById('input-email').value;
    const updatedPhone = document.getElementById('input-phone').value;
    const updatedAddress = document.getElementById('input-address').value;

    if (!updatedUsername.trim()) {
        alert("Tên đăng nhập không được để trống!");
        return;
    }

    document.getElementById('leftUsername').innerText = updatedUsername;
    alert("Thông tin cá nhân của bạn đã được cập nhật thành công!");

    console.log({ username: updatedUsername, email: updatedEmail, phone: updatedPhone, address: updatedAddress });
}
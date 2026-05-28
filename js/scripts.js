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
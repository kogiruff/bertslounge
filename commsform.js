// kecil aja biar ga ribet :3
document.querySelector("form")?.addEventListener("submit", () => {
    console.log("Commission sent!");
});
if (!localStorage.getItem("fromIndex")) {
    window.location.href = "index.html";
}
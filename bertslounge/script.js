localStorage.setItem("fromIndex", "true");

window.onload = function () {
    const loader = document.getElementById('loader');
    const mainContent = document.getElementById('main-content');

    // 1. Berikan delay 1 detik setelah halaman benar-benar load
    setTimeout(() => {

        // 2. Mulai animasi fade-out (opacity menjadi 0)
        loader.style.opacity = '0';
        loader.style.visibility = 'hidden';

        // 3. Tampilkan konten utama dengan animasi
        mainContent.classList.remove('hidden');

        // 4. (Opsional) Hapus elemen loader dari DOM setelah animasi selesai
        // agar tidak memberatkan browser
        setTimeout(() => {
            loader.remove();
        }, 800); // 800ms sesuai durasi transition di CSS

    }, 500); // Angka 1000 adalah delay 1 detik
};

document.addEventListener("DOMContentLoaded", () => {
    const swiper = new Swiper(".mySwiper", {
        effect: "coverflow",
        grabCursor: true,
        centeredSlides: false,
        slidesPerView: "auto",
        loop: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: true,
        },
        coverflowEffect: {
            depth: 500,
            modifier: 1,
            slideShadows: true,
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
            dynamicBullets: false,
        },
        on: {
            slideChangeTransitionStart() {
                const img = document.querySelector(
                    ".swiper-slide-active img"
                );
                if (img) {
                    document.querySelector(".bg-blur").style.backgroundImage =
                        `url(${img.src})`;
                }
            },
        },
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const swiper = new Swiper(".m-mySwiper", {
        effect: "coverflow",
        grabCursor: true,
        centeredSlides: false,
        slidesPerView: "auto",
        loop: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: true,
        },
        coverflowEffect: {
            depth: 500,
            modifier: 1,
            slideShadows: true,
        },
        pagination: {
            el: ".m-swiper-pagination",
            clickable: true,
            dynamicBullets: false,
        },
        on: {
            slideChangeTransitionStart() {
                const img = document.querySelector(
                    ".m-swiper-slide-active img"
                );
                if (img) {
                    document.querySelector(".bg-blur").style.backgroundImage =
                        `url(${img.src})`;
                }
            },
        },
    });


});


const link = document.getElementById("comms-link");
const mainContent = document.getElementById("main-content");



if (link) {
    link.addEventListener("click", e => {
        e.preventDefault();

        const href = link.getAttribute("href");

        mainContent.classList.add("slide-out");

        setTimeout(() => {
            window.location.href = href;
        }, 600); // harus sama dgn durasi animasi
    });
}

const socBtns = document.querySelectorAll(".socbtn");
const socPanel = document.querySelector(".socials");
const backdrop = document.querySelector(".socials-backdrop");

socBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        socPanel.classList.add("active");
        backdrop.classList.add("active");
        document.body.style.overflow = "hidden";
    });
});

document.addEventListener("click", e => {
    if (!socPanel.classList.contains("active")) return;

    if (
        !socPanel.contains(e.target) &&
        !e.target.closest(".socbtn")
    ) {
        socPanel.classList.remove("active");
        backdrop.classList.remove("active");
        document.body.style.overflow = "";
    }
});


document.addEventListener("DOMContentLoaded", () => {
    const loader = document.getElementById("loader");
    const progressBar = document.querySelector(".loader-progress");
    const percentText = document.getElementById("load-percent");

    const images = document.images;
    const totalAssets = images.length;
    let loadedAssets = 0;

    // Kalau gak ada gambar sama sekali
    if (totalAssets === 0) finishLoading();

    function assetLoaded() {
        loadedAssets++;
        const percent = Math.round((loadedAssets / totalAssets) * 100);
        progressBar.style.width = percent + "%";
        percentText.textContent = percent;

        if (loadedAssets === totalAssets) {
            finishLoading();
        }
    }

    function finishLoading() {
        progressBar.style.width = "100%";
        percentText.textContent = "100";

        setTimeout(() => {
            loader.style.opacity = "0";
            loader.style.pointerEvents = "none";
            setTimeout(() => loader.remove(), 400);
        }, 300);
    }

    // Track semua gambar
    for (let img of images) {
        if (img.complete) {
            assetLoaded();
        } else {
            img.addEventListener("load", assetLoaded);
            img.addEventListener("error", assetLoaded);
        }
    }
});
const texts = [
    "Halo",
    "Hello",
    "こんにちは",
    "안녕",
    "Bonjour",
    "Hola",
    "Ciao",
    "Heya",
    "Hai",
    "你好"
];

const stickerWrap = document.querySelector(".sticker-wrap");
const sticker = document.querySelector(".header-sticker");
const stickerText = document.querySelector(".sticker-text");
const popSound = document.getElementById("popSound");

let hideTimeout = null;
let lastIndex = -1;

function randomText() {
    let index;
    do {
        index = Math.floor(Math.random() * texts.length);
    } while (index === lastIndex);

    lastIndex = index;
    stickerText.textContent = texts[index];
}

function playPop() {
    if (!popSound) return;
    popSound.currentTime = 0;
    popSound.volume = 0.3;
    popSound.play().catch(() => { });
}

stickerWrap.addEventListener("click", () => {
    // 🛑 kalau masih ada text → ilangin langsung
    if (hideTimeout) {
        clearTimeout(hideTimeout);
        hideTimeout = null;
        stickerText.classList.remove("show");
    }

    // 🔁 reset animasi twitch biar bisa diulang
    sticker.classList.remove("twitch");
    void sticker.offsetWidth; // force reflow
    sticker.classList.add("twitch");

    // 📝 text baru
    randomText();
    stickerText.classList.add("show");

    playPop();

    // ⏱️ auto hide
    hideTimeout = setTimeout(() => {
        stickerText.classList.remove("show");
        hideTimeout = null;
    }, 1200); // 1.2 detik (bisa diubah)
});

const bgm = document.getElementById("bgm");
const muteBtn = document.getElementById("muteBtn");
const iconOn = document.getElementById("iconVolumeOn");
const iconOff = document.getElementById("iconVolumeOff");

let isMuted = true;

// default icon
iconOff.classList.add("active");

muteBtn.addEventListener("click", () => {
    if (isMuted) {
        bgm.volume = 0.3;
        bgm.play().catch(() => { });
        iconOff.classList.remove("active");
        iconOn.classList.add("active");
    } else {
        bgm.pause();
        iconOn.classList.remove("active");
        iconOff.classList.add("active");
    }
    isMuted = !isMuted;
});



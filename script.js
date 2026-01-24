localStorage.setItem("fromIndex", "true");

const greetings = [
  "Halo", "Hello", "こんにちは", "안녕", "Bonjour",
  "Hola", "Ciao", "Heya", "Hai", "你好",
  "Привет", "Olá", "مرحبا", "Merhaba", "สวัสดี",
  "Xin chào", "Salve", "Hej", "Ahoj", "नमस्ते",
  "Hallo", "Selam", "Yo", "Sup"
];

window.onload = function () {
  const loader = document.getElementById('loader');
  const mainContent = document.getElementById('main-content');

  setTimeout(() => {
    if (loader) {
      loader.style.opacity = '0';
      loader.style.visibility = 'hidden';
    }
    if (mainContent) {
      mainContent.classList.remove('hidden');
    }
    setTimeout(() => {
      if (loader) loader.remove();
    }, 800);
  }, 500);
};

document.addEventListener("DOMContentLoaded", () => {
  // swiper config
  const commonSwiperConfig = {
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
  };

  const swiper1 = new Swiper(".mySwiper", {
    ...commonSwiperConfig,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
      dynamicBullets: false,
    },
    on: {
      slideChangeTransitionStart() {
        const img = document.querySelector(".swiper-slide-active img");
        if (img) {
          document.querySelector(".bg-blur").style.backgroundImage = `url(${img.src})`;
        }
      },
    },
  });

  const swiper2 = new Swiper(".m-mySwiper", {
    ...commonSwiperConfig,
    pagination: {
      el: ".m-swiper-pagination",
      clickable: true,
      dynamicBullets: false,
    },
    on: {
      slideChangeTransitionStart() {
        const img = document.querySelector(".m-swiper-slide-active img");
        if (img) {
          document.querySelector(".bg-blur").style.backgroundImage = `url(${img.src})`;
        }
      },
    },
  });

  // transition
  const commsLink = document.getElementById("comms-link");
  const mainContent = document.getElementById("main-content");

  if (commsLink) {
    commsLink.addEventListener("click", (e) => {
      e.preventDefault();
      const href = commsLink.getAttribute("href");
      mainContent.classList.add("slide-out");
      setTimeout(() => {
        window.location.href = href;
      }, 600);
    });
  }

  // socials
  const socBtns = document.querySelectorAll(".socbtn");
  const socPanel = document.querySelector(".socials");
  const backdrop = document.querySelector(".socials-backdrop");

  if (socPanel && backdrop) {
    socBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        socPanel.classList.add("active");
        backdrop.classList.add("active");
        document.body.style.overflow = "hidden";
      });
    });

    document.addEventListener("click", (e) => {
      if (!socPanel.classList.contains("active")) return;
      if (!socPanel.contains(e.target) && !e.target.closest(".socbtn")) {
        socPanel.classList.remove("active");
        backdrop.classList.remove("active");
        document.body.style.overflow = "";
      }
    });
  }

  // sticker anim
  const stickerWrap = document.querySelector(".sticker-wrap");
  const sticker = document.querySelector(".header-sticker");
  const stickerText = document.querySelector(".sticker-text");
  const popSound = document.getElementById("popSound");
  
  let hideTimeout = null;
  let lastIndex = -1;

  function playPop() {
    if (!popSound) return;
    popSound.currentTime = 0;
    popSound.volume = 0.3;
    popSound.play().catch(() => {});
  }

  if (stickerWrap) {
    stickerWrap.addEventListener("click", () => {
      if (hideTimeout) {
        clearTimeout(hideTimeout);
        hideTimeout = null;
        stickerText.classList.remove("show");
      }

      sticker.classList.remove("twitch");
      void sticker.offsetWidth;
      sticker.classList.add("twitch");

      let index;
      do {
        index = Math.floor(Math.random() * greetings.length);
      } while (index === lastIndex);
      
      lastIndex = index;
      stickerText.textContent = greetings[index];
      stickerText.classList.add("show");
      
      playPop();

      hideTimeout = setTimeout(() => {
        stickerText.classList.remove("show");
        hideTimeout = null;
      }, 1200);
    });
  }

  // bgm
  const bgm = document.getElementById("bgm");
  const muteBtn = document.getElementById("muteBtn");
  const iconOn = document.getElementById("iconVolumeOn");
  const iconOff = document.getElementById("iconVolumeOff");
  let isMuted = true;

  if (muteBtn && bgm) {
    iconOff.classList.add("active");
    muteBtn.addEventListener("click", () => {
      if (isMuted) {
        bgm.volume = 0.3;
        bgm.play().catch(() => {});
        iconOff.classList.remove("active");
        iconOn.classList.add("active");
      } else {
        bgm.pause();
        iconOn.classList.remove("active");
        iconOff.classList.add("active");
      }
      isMuted = !isMuted;
    });
  }

  // loader
  const loader = document.getElementById("loader");
  const progressBar = document.querySelector(".loader-progress");
  const percentText = document.getElementById("load-percent");
  const images = document.images;
  const totalAssets = images.length;
  let loadedAssets = 0;

  function finishLoading() {
    if (!loader) return;
    if (progressBar) progressBar.style.width = "100%";
    if (percentText) percentText.textContent = "100";

    setTimeout(() => {
      loader.style.opacity = "0";
      loader.style.pointerEvents = "none";
      setTimeout(() => loader.remove(), 400);
    }, 300);
  }

  function assetLoaded() {
    loadedAssets++;
    const percent = Math.round((loadedAssets / totalAssets) * 100);
    if (progressBar) progressBar.style.width = percent + "%";
    if (percentText) percentText.textContent = percent;

    if (loadedAssets === totalAssets) {
      finishLoading();
    }
  }

  if (totalAssets === 0) {
    finishLoading();
  } else {
    for (let img of images) {
      if (img.complete) {
        assetLoaded();
      } else {
        img.addEventListener("load", assetLoaded);
        img.addEventListener("error", assetLoaded);
      }
    }
  }
});

let COMMISSION_OPEN = true;


if (!localStorage.getItem("fromIndex")) {
    window.location.href = "index.html";
}
const link = document.getElementById("comms-link");
const tos = document.getElementById("tos");
const mainContent = document.querySelectorAll(".main-content");
if (link) {
    link.addEventListener("click", e => {
        e.preventDefault();

        const href = link.getAttribute("href");
        mainContent.forEach(el => {
            el.classList.add("slide-out");
        });


        setTimeout(() => {
            window.location.href = href;
        }, 600); // harus sama dgn durasi animasi
    });
}

const tosBtns = document.querySelectorAll(".tosbtn");
const tosPanel = document.getElementById("tos");
const backdrop = document.getElementById("tos-backdrop");
tosBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        tosPanel.classList.add("active");
        backdrop.classList.add("active");
        document.body.style.overflow = "hidden"; // lock scroll
    });
});

document.addEventListener("click", e => {
    if (!tosPanel.classList.contains("active")) return;

    if (
        !tosPanel.contains(e.target) &&
        !e.target.classList.contains("tosbtn")
    ) {
        tosPanel.classList.remove("active");
        backdrop.classList.remove("active");
        document.body.style.overflow = "";
    }
});

const tosScroll = document.querySelector(".tos-cont");
const agreeCheckbox = document.getElementById("agree");
const proceedBtn = document.querySelector(".tos-accept button");
const tosAccept = document.querySelector(".tos-accept");

agreeCheckbox.disabled = true;
tosAccept.classList.add("locked");

tosScroll.addEventListener("scroll", () => {
    const reachedBottom =
        tosScroll.scrollTop + tosScroll.clientHeight >=
        tosScroll.scrollHeight - 5;

    if (reachedBottom && COMMISSION_OPEN) {
        agreeCheckbox.disabled = false;
        tosAccept.classList.remove("locked");
    }
});

agreeCheckbox.addEventListener("change", () => {
    if (!COMMISSION_OPEN) return;

    if (agreeCheckbox.checked) {
        proceedBtn.disabled = false;
        proceedBtn.classList.add("enabled");
    } else {
        proceedBtn.disabled = true;
        proceedBtn.classList.remove("enabled");
    }
});


// ===============================
// CONFIG DARI GOOGLE SHEET
// ===============================
async function getConfig() {
    const res = await fetch(
        "https://opensheet.elk.sh/1SNFcMzfhPWWjxzO-PLXK5VYh1CAFnTkAubymXaG2rwA/config"
    );
    const data = await res.json();

    const get = (k) => data.find(d => d.key === k)?.value;
    return {
        open: String(get("open")).toLowerCase().trim() === "true"
    };
}


// ===============================
// APPLY STATUS COMMISSION
// ===============================
(async () => {
    const config = await getConfig();
    COMMISSION_OPEN = config.open;

    if (!COMMISSION_OPEN) {
        const proceedBtn = document.getElementById("proceed-btn");
        const proceedLink = document.getElementById("proceed-link");
        const agreeCheckbox = document.getElementById("agree");
        const tosAccept = document.querySelector(".tos-accept");

        proceedBtn.disabled = true;
        proceedBtn.classList.remove("enabled");
        proceedBtn.querySelector(".btn-text").textContent = "Comms Closed";

        agreeCheckbox.disabled = true;
        tosAccept.classList.add("locked");
        proceedLink.removeAttribute("href");
    }
})();





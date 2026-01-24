document.addEventListener("DOMContentLoaded", () => {
    // - utk selector n main var
    const link = document.getElementById("comms-link");
    const mainContent = document.querySelectorAll(".main-content");
    // var elemen tos
    const tosBtns = document.querySelectorAll(".tosbtn");
    const tosPanel = document.getElementById("tos");
    const backdrop = document.getElementById("tos-backdrop");
    const tosScroll = document.querySelector(".tos-cont");
    const tosAccept = document.querySelector(".tos-accept");
    // form element dalam tos
    const agreeCheckbox = document.getElementById("agree");
    const proceedBtn = document.getElementById("proceed-btn");
    const proceedLink = document.getElementById("proceed-link");
    const btnText = proceedBtn ? proceedBtn.querySelector(".btn-text") : null;

    let COMMISSION_OPEN = false;

    // 2. nav + anim
    if (link) {
        link.addEventListener("click", e => {
            e.preventDefault();
            const href = link.getAttribute("href");
            mainContent.forEach(el => el.classList.add("slide-out"));
            setTimeout(() => {
                window.location.href = href;
            }, 600);
        });
    }
    // 3. anim buka tutup tos
    if (tosBtns) {
        tosBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                if (tosPanel && backdrop) {
                    tosPanel.classList.add("active");
                    backdrop.classList.add("active");
                    document.body.style.overflow = "hidden";
                }
            });
        });
    }
    document.addEventListener("click", e => {
        if (tosPanel && tosPanel.classList.contains("active")) {
            if (!tosPanel.contains(e.target) && !e.target.classList.contains("tosbtn")) {
                tosPanel.classList.remove("active");
                backdrop.classList.remove("active");
                document.body.style.overflow = "";
            }
        }
    });

    // 4. enable checkbox tos pas udh scroll
    if (agreeCheckbox) agreeCheckbox.disabled = true;
    if (proceedBtn) proceedBtn.disabled = true;
    if (tosAccept) tosAccept.classList.add("locked");

    if (tosScroll) {
        tosScroll.addEventListener("scroll", () => {
            const reachedBottom =
                tosScroll.scrollTop + tosScroll.clientHeight >= tosScroll.scrollHeight - 20;
            if (reachedBottom && COMMISSION_OPEN) {
                if (agreeCheckbox) agreeCheckbox.disabled = false;
                if (tosAccept) tosAccept.classList.remove("locked");
            }
        });
    }

    if (agreeCheckbox) {
        agreeCheckbox.addEventListener("change", () => {
            if (!COMMISSION_OPEN) return;
            if (agreeCheckbox.checked) {
                if (proceedBtn) {
                    proceedBtn.disabled = false;
                    proceedBtn.classList.add("enabled");
                }
            } else {
                if (proceedBtn) {
                    proceedBtn.disabled = true;
                    proceedBtn.classList.remove("enabled");
                }
            }
        });
    }
    
    // 5. update ui klo comms closed
    function updateUI() {
        if (!COMMISSION_OPEN) {
            // klo closed
            console.log("UI Mode: CLOSED");
            if (btnText) btnText.textContent = "No Slots Available";
            if (proceedBtn) {
                proceedBtn.disabled = true;
                proceedBtn.classList.remove("enabled");
            }
            if (agreeCheckbox) {
                agreeCheckbox.disabled = true;
                agreeCheckbox.checked = false;
            }
            if (tosAccept) tosAccept.classList.add("locked");
            if (proceedLink) {
                proceedLink.removeAttribute("href");
                proceedLink.style.cursor = "not-allowed";
            }
        } else {
            console.log("UI Mode: OPEN");
            if (btnText) btnText.textContent = "Proceed to Comm";
            if (proceedLink) {
                proceedLink.setAttribute("href", "https://forms.gle/T2ukaDUDPqhPd4yo7");
                proceedLink.style.cursor = "pointer";
            }
        }
    }
        // 6. fetch config dari gsheet
    async function initConfig() {
        try {
            const res = await fetch(
                "https://opensheet.elk.sh/1SNFcMzfhPWWjxzO-PLXK5VYh1CAFnTkAubymXaG2rwA/1",
                { cache: "no-store" }
            );

            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
            const data = await res.json();
            console.log("Data Sheet:", data);
            const found = data.find(d => d.key && d.key.toLowerCase() === "open");
            const rawStatus = found ? found.value : "FALSE";
            console.log("Status Raw:", rawStatus);
            if (String(rawStatus).trim().toLowerCase() === "true") {
                COMMISSION_OPEN = true;
            } else {
                COMMISSION_OPEN = false;
            }
            console.log("Status Final:", COMMISSION_OPEN);
            updateUI();
        } catch (error) {
            console.error("Gagal mengambil config:", error);
            COMMISSION_OPEN = false; // Default close jika error
            updateUI();
        }
    }
    initConfig();
});


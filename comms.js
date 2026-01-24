document.addEventListener("DOMContentLoaded", () => {
    // -----------------------------------------------------------
    // 1. SELECTOR & VARIABEL UTAMA
    // -----------------------------------------------------------
    const link = document.getElementById("comms-link");
    const mainContent = document.querySelectorAll(".main-content");

    // TOS Elements
    const tosBtns = document.querySelectorAll(".tosbtn");
    const tosPanel = document.getElementById("tos");
    const backdrop = document.getElementById("tos-backdrop");
    const tosScroll = document.querySelector(".tos-cont");
    const tosAccept = document.querySelector(".tos-accept");

    // Form Elements inside TOS
    const agreeCheckbox = document.getElementById("agree");
    const proceedBtn = document.getElementById("proceed-btn");
    const proceedLink = document.getElementById("proceed-link");

    // Ambil elemen teks di dalam tombol (handle jika null)
    const btnText = proceedBtn ? proceedBtn.querySelector(".btn-text") : null;

    let COMMISSION_OPEN = false; // Default status

    // -----------------------------------------------------------
    // 2. NAVIGASI & ANIMASI
    // -----------------------------------------------------------
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

    // -----------------------------------------------------------
    // 3. MODAL TOS (Buka/Tutup)
    // -----------------------------------------------------------
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

    // -----------------------------------------------------------
    // 4. LOGIKA SCROLL & CHECKBOX
    // -----------------------------------------------------------

    // Reset state awal
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

    // -----------------------------------------------------------
    // 5. UPDATE UI (Fungsi Tampilan)
    // -----------------------------------------------------------
    function updateUI() {
        if (!COMMISSION_OPEN) {
            // --- JIKA CLOSED ---
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
            // --- JIKA OPEN ---
            console.log("UI Mode: OPEN");

            if (btnText) btnText.textContent = "Proceed to Comm";

            if (proceedLink) {
                proceedLink.setAttribute("href", "commsform.html");
                proceedLink.style.cursor = "pointer";
            }
        }
    }

    // -----------------------------------------------------------
    // 6. FETCH CONFIG
    // -----------------------------------------------------------
    async function initConfig() {
        try {
            // Gunakan URL bersih tanpa parameter
            const res = await fetch(
                "https://opensheet.elk.sh/1SNFcMzfhPWWjxzO-PLXK5VYh1CAFnTkAubymXaG2rwA/1",
                { cache: "no-store" } // Pastikan tidak pakai cache browser
            );

            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

            const data = await res.json();
            console.log("Data Sheet:", data);

            // Cari key "open"
            const found = data.find(d => d.key && d.key.toLowerCase() === "open");
            const rawStatus = found ? found.value : "FALSE";

            console.log("Status Raw:", rawStatus);

            // Cek apakah TRUE (string atau boolean)
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

    // Jalankan
    initConfig();
});
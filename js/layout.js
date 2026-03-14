/**
 * Layout Loader - يحمّل الـ Nav والـ Footer من ملفات منفصلة ويحقنهما في كل الصفحات
 * عدّل محتوى components/nav.html أو components/footer.html وسيُطبّق على كل الموقع
 */
(function () {
    "use strict";

    function getBasePath() {
        var path = window.location.pathname;
        if (path.indexOf("/") !== -1) {
            var parts = path.split("/");
            parts.pop(); // remove current page
            return parts.length ? parts.join("/") + "/" : "";
        }
        return "";
    }

    function setActiveNavLink() {
        var currentPage = window.location.pathname.split("/").pop() || "index.html";
        if (!currentPage.match(/\.html?$/)) currentPage = "index.html";
        var container = document.getElementById("navbar-container");
        if (!container) return;
        container.querySelectorAll(".nav-link[href]").forEach(function (link) {
            var href = link.getAttribute("href") || "";
            if (href === "#") return;
            var linkPage = href.split("/").pop() || href;
            if (linkPage === currentPage) {
                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }
        });
        container.querySelectorAll(".dropdown-item[href]").forEach(function (link) {
            var href = link.getAttribute("href") || "";
            var linkPage = href.split("/").pop() || href;
            if (linkPage === currentPage) {
                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }
        });
    }

    function loadLayout() {
        var base = getBasePath();
        var navUrl = base + "components/nav.html";
        var footerUrl = base + "components/footer.html";

        var navContainer = document.getElementById("navbar-container");
        var footerContainer = document.getElementById("footer-container");

        var promises = [];

        if (navContainer) {
            promises.push(
                fetch(navUrl)
                    .then(function (r) { return r.text(); })
                    .then(function (html) {
                        navContainer.innerHTML = html;
                        setActiveNavLink();
                    })
                    .catch(function () {
                        navContainer.innerHTML = "<!-- خطأ في تحميل القائمة -->";
                    })
            );
        }

        if (footerContainer) {
            promises.push(
                fetch(footerUrl)
                    .then(function (r) { return r.text(); })
                    .then(function (html) {
                        footerContainer.innerHTML = html;
                    })
                    .catch(function () {
                        footerContainer.innerHTML = "<!-- خطأ في تحميل التذييل -->";
                    })
            );
        }

        Promise.all(promises).then(function () {
            if (typeof jQuery !== "undefined") {
                jQuery(document).trigger("layoutLoaded");
            }
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", loadLayout);
    } else {
        loadLayout();
    }
})();

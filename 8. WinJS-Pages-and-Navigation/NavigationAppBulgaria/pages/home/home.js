(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/home/home.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            var main = document.getElementById("nav-main");

            main.addEventListener("click", function () {
                WinJS.Navigation.navigate("ms-appx:///pages/home/home.html");
            });
        }
    });
})();

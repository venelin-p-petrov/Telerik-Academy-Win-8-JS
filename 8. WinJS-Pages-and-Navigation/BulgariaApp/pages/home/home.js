(function () {
    "use strict";

    WinJS.UI.Pages.define("/pages/home/home.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            WinJS.Utilities.query("#nav-history", element).listen("click", function () {
                WinJS.Navigation.navigate("ms-appx:///pages/history/history.html");
            });

            WinJS.Utilities.query("#nav-geography", element).listen("click", function () {
                WinJS.Navigation.navigate("ms-appx:///pages/geography/geography.html");
            });

            WinJS.Utilities.query("#nav-politics", element).listen("click", function () {
                WinJS.Navigation.navigate("ms-appx:///pages/politics/politics.html");
            });

            WinJS.Utilities.query("#nav-economy", element).listen("click", function () {
                WinJS.Navigation.navigate("ms-appx:///pages/economy/economy.html");
            });

            WinJS.Utilities.query("#nav-demographics", element).listen("click", function () {
                WinJS.Navigation.navigate("ms-appx:///pages/demographics/demographics.html");
            });

            WinJS.Utilities.query("#nav-culture", element).listen("click", function () {
                WinJS.Navigation.navigate("ms-appx:///pages/culture/culture.html");
            });
        }
    });
})();

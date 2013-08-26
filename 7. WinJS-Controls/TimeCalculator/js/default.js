// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232509
(function () {
    "use strict";

    WinJS.Binding.optimizeBindingReferences = true;

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;

    app.onactivated = function (args) {
        args.setPromise(WinJS.UI.processAll());

        var startDatePicker = document.getElementById("start-date-picker").winControl;
        var endDatePicker = document.getElementById("end-date-picker").winControl;
        var timePickerSwitch = document.getElementById("time-picker-switch").winControl;
        var openElement = document.getElementById("open-button");
        openElement.addEventListener("click", function () {
            var menu = document.getElementById("menu-container").winControl;
            menu.show();
        });

        var startDateWrapper = document.getElementById("start-date-wrapper");
        var endDateWrapper = document.getElementById("end-date-wrapper");

        var startTimeWrapper = document.createElement("div");
        var endTimeWrapper = document.createElement("div");

        var startTimeLabel = document.createElement("label");
        startTimeLabel.innerHTML = "Choose start time:";
        startTimeLabel.classList.add("time-label");
        var endTimeLabel = document.createElement("label");
        endTimeLabel.innerHTML = "Choose end time:";
        endTimeLabel.classList.add("time-label");

        var startTimePickerHost = document.createElement("div");
        var endTimePickerHost = document.createElement("div");

        startTimeWrapper.appendChild(startTimeLabel);
        startTimeWrapper.appendChild(startTimePickerHost);
        endTimeWrapper.appendChild(endTimeLabel);
        endTimeWrapper.appendChild(endTimePickerHost);

        startDateWrapper.appendChild(startTimeWrapper);
        endDateWrapper.appendChild(endTimeWrapper);

        var startTimePicker = new WinJS.UI.TimePicker(startTimePickerHost, { clock: "24HourClock" });
        var endTimePicker = new WinJS.UI.TimePicker(endTimePickerHost, { clock: "24HourClock" });

        startTimeWrapper.style.display = "none";
        endTimeWrapper.style.display = "none";

        timePickerSwitch.addEventListener("change", function () {
            if (timePickerSwitch.checked) {
                startTimeWrapper.style.display = "inline-block";
                endTimeWrapper.style.display = "inline-block";
            } else {
                startTimeWrapper.style.display = "none";
                endTimeWrapper.style.display = "none";
            }
        });

        var calculateDaysButton = document.getElementById("calculate-days-button");
        var calculateHoursButton = document.getElementById("calculate-hours-button");
        var calculateDaysHoursButton = document.getElementById("calculate-days-hours-button");

        var output = document.getElementById("output");

        var ONE_DAY = 1000 * 60 * 60 * 24;
        var ONE_HOUR = 1000 * 60 * 60;

        calculateDaysButton.addEventListener("click", function () {
            var startDate = new Date(startDatePicker.current);
            var endDate = new Date(endDatePicker.current);

            var difference = Math.abs(startDate - endDate);
            var resultPar = document.createElement("p");
            resultPar.innerText = "Difference Days: " + Math.round(difference / ONE_DAY);

            output.appendChild(resultPar);
        });

        calculateHoursButton.addEventListener("click", function () {
            if (timePickerSwitch.checked) {
                var startTime = new Date(startTimePicker.current);
                var endTime = new Date(endTimePicker.current);

                var difference = Math.abs(startTime - endTime);
                var resultPar = document.createElement("p");
                resultPar.innerText = "Difference Hours: " + Math.round(difference / ONE_HOUR);

                output.appendChild(resultPar);
            } else {
                timePickerSwitch.checked = true;
                startTimeWrapper.style.display = "inline-block";
                endTimeWrapper.style.display = "inline-block";
                var resultPar = document.createElement("p");
                resultPar.innerText = "Pick a time";

                output.appendChild(resultPar);
            }
            
        });

        calculateDaysHoursButton.addEventListener("click", function () {
            if (timePickerSwitch.checked) {
                var startDate = new Date(startDatePicker.current);
                var endDate = new Date(endDatePicker.current);
                var startTime = new Date(startTimePicker.current);
                var endTime = new Date(endTimePicker.current);

                var differenceDate = Math.abs(startDate - endDate);
                var differenceTime = Math.abs(startTime - endTime);
                var resultPar = document.createElement("p");
                resultPar.innerText = "Difference Days: " +
                    Math.round(differenceDate / ONE_DAY) + ", Hours: " +
                    Math.round(differenceTime / ONE_HOUR);

                output.appendChild(resultPar);
            } else {
                timePickerSwitch.checked = true;
                startTimeWrapper.style.display = "inline-block";
                endTimeWrapper.style.display = "inline-block";
                var resultPar = document.createElement("p");
                resultPar.innerText = "Pick a time";

                output.appendChild(resultPar);
            }

        });
    };

    app.start();
})();

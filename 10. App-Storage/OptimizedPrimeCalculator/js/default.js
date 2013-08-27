// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232509
(function () {
    "use strict";

    WinJS.Binding.optimizeBindingReferences = true;

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;

    app.onactivated = function (args) {
        var localSettings = Windows.Storage.ApplicationData.current.localSettings;

        if (!localSettings.values['workerNumber']) {
            localSettings.values['workerNumber'] = 3;
        }

        var calculator = new Calculator.PrimeNumbersCalculator(localSettings.values['workerNumber']);

        var calculatePrimesUpToButton = document.getElementById("primes-upto-btn");
        var primesUpTo = document.getElementById("primes-upto");

        var calculatePrimesFirstButton = document.getElementById("primes-first-btn");
        var primesFirst = document.getElementById("primes-first");

        var calculatePrimesBetweenButton = document.getElementById("primes-between-btn");
        var primesLower = document.getElementById("primes-lower");
        var primesUpper = document.getElementById("primes-upper");

        var workerNumber = document.getElementById("worker-number");
        var workerNumberButton = document.getElementById("set-worker-number");

        var clearOutputButton = document.getElementById("clear-output");

        workerNumber.value = localSettings.values['workerNumber'];

        calculatePrimesUpToButton.addEventListener("click", function () {
            calculator.calculateUpToAsync(primesUpTo.value).then(function (data) {
                printResult(data.method + data.primes.join(", "));
            }, function (error) {
                printResult(error);
            });
        });

        calculatePrimesFirstButton.addEventListener("click", function () {
            calculator.calculateFirstNAsync(primesFirst.value).then(function (data) {
                printResult(data.method + data.primes.join(", "));
            }, function (error) {
                printResult(error);
            });
        });

        calculatePrimesBetweenButton.addEventListener("click", function () {
            calculator.calculateBetweenAsync(primesLower.value, primesUpper.value).then(function (data) {
                printResult(data.method + data.primes.join(", "));
            }, function (error) {
                printResult(error);
            });
        });

        workerNumberButton.addEventListener("click", function () {
            localSettings.values['workerNumber'] = workerNumber.value;
            calculator = new Calculator.PrimeNumbersCalculator(localSettings.values['workerNumber']);
        });

        clearOutputButton.addEventListener("click", function () {
            document.getElementById("output").innerHTML = "";
        });

        var printResult = function (text) {
            var resultParagraph = document.createElement("p");
            resultParagraph.innerText = text;
            document.getElementById("output").appendChild(resultParagraph);
        }
    };

    app.start();
})();

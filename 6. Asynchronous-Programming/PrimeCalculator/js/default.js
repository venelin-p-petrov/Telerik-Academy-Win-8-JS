/// <reference path="primeNumbersCalculator.js" />
(function () {
    "use strict";

    WinJS.Binding.optimizeBindingReferences = true;

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;

    app.onactivated = function (args) {
        var calculator = new Calculator.PrimeNumbersCalculator(3);


        //for (var i = 0; i < 3; i++) {
        //    primesWorkers[i] = new Worker("/js/primesWorker.js");
        //    primesWorkers[i].onmessage = function (event) {
        //        takenWorkers[event.data.number] = false;
        //        var primesPar = document.createElement("p");
        //        primesPar.innerText = event.data.method + event.data.primes.join(", ");
        //        document.body.appendChild(primesPar);
        //    }
        //}

        var calculatePrimesUpToButton = document.getElementById("primes-upto-btn");
        var primesUpTo = document.getElementById("primes-upto");

        var calculatePrimesFirstButton = document.getElementById("primes-first-btn");
        var primesFirst = document.getElementById("primes-first");

        var calculatePrimesBetweenButton = document.getElementById("primes-between-btn");
        var primesLower = document.getElementById("primes-lower");
        var primesUpper = document.getElementById("primes-upper");

        calculatePrimesUpToButton.addEventListener("click", function () {
            calculator.calculateUpTo(primesUpTo.value).then(function (data) {
                printResult(data.method + data.primes.join(", "));
            }, function(error) {
                printResult(error);
            });
        });

        calculatePrimesFirstButton.addEventListener("click", function () {
            calculator.calculateFirstN(primesFirst.value).then(function (data) {
                printResult(data.method + data.primes.join(", "));
            }, function (error) {
                printResult(error);
            });
        });

        calculatePrimesBetweenButton.addEventListener("click", function () {
            calculator.calculateBetween(primesLower.value, primesUpper.value).then(function (data) {
                printResult(data.method + data.primes.join(", "));
            }, function (error) {
                printResult(error);
            });
        });

        var printResult = function (text) {
            var resultParagraph = document.createElement("p");
            resultParagraph.innerText = text;
            document.body.appendChild(resultParagraph);
        }
    };

    app.start();
})();

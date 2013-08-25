/// <reference path="//Microsoft.WinJS.1.0/js/base.js" />

WinJS.Namespace.define("Calculator", {
    PrimeNumbersCalculator: WinJS.Class.define(
        function (workersNumber) {
            var self = this;
            this.workersNumber = workersNumber;
            this.primesWorkers = new Array(this.workersNumber);
            this.takenWorkers = new Array(this.workersNumber);

            for (var i = 0; i < workersNumber; i++) {
                this.primesWorkers[i] = new Worker("/js/primesWorker.js");
                this.takenWorkers[i] = false;
            }
        }, {
            getWorkerNumber: function () {
                for (var i = 0; i < this.workersNumber; i++) {
                    if (!this.takenWorkers[i]) {
                        return i;
                    }
                }
                return null;
            },
            calculateUpTo: function (upto) {
                var self = this;
                return new WinJS.Promise(function (complete, error) {
                    var workerNumber = self.getWorkerNumber();
                    if (workerNumber !== null) {
                        self.primesWorkers[workerNumber].onmessage = function (event) {
                            self.takenWorkers[event.data.number] = false;
                            complete(event.data);
                        };
                        self.takenWorkers[workerNumber] = true;
                        self.primesWorkers[workerNumber].postMessage({ method: "upto", upto: upto, number: workerNumber });
                    } else {
                        error("Only " + self.workersNumber + " requests are allowed at one time.")
                    }
                });
            },
            calculateFirstN: function (n) {
                var self = this;
                return new WinJS.Promise(function (complete, error) {
                    var workerNumber = self.getWorkerNumber();
                    if (workerNumber !== null) {
                        self.primesWorkers[workerNumber].onmessage = function (event) {
                            self.takenWorkers[event.data.number] = false;
                            complete(event.data);
                        };
                        self.takenWorkers[workerNumber] = true;
                        self.primesWorkers[workerNumber].postMessage({ method: "firstN", n: n, number: workerNumber });
                    } else {
                        error("Only " + self.workersNumber + " requests are allowed at one time.")
                    }
                });
            },
            calculateBetween: function (first, last) {
                var self = this;
                return new WinJS.Promise(function (complete, error) {
                    var workerNumber = self.getWorkerNumber();
                    if (workerNumber !== null) {
                        self.primesWorkers[workerNumber].onmessage = function (event) {
                            self.takenWorkers[event.data.number] = false;
                            complete(event.data);
                        };
                        self.takenWorkers[workerNumber] = true;
                        self.primesWorkers[workerNumber].postMessage({ method: "between", first: first, last: last, number: workerNumber });
                    } else {
                        error("Only " + self.workersNumber + " requests are allowed at one time.")
                    }
                });
            }
        })
});
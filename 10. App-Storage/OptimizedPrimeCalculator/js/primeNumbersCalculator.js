/// <reference path="//Microsoft.WinJS.1.0/js/base.js" />

WinJS.Namespace.define("Calculator", {
    PrimeNumbersCalculator: WinJS.Class.define(
        function (workersNumber) {
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
            saveResultAsync: function (meta, data) {
                var localFolder = Windows.Storage.ApplicationData.current.localFolder;
                var filename;

                switch (meta.method) {
                    case "upto":
                        filename = "upto-" + meta.upto + ".txt";
                        break;
                    case "firstN":
                        filename = "firstN-" + meta.firstN + ".txt";
                        break;
                    case "between":
                        filename = "between-" + meta.first + "-" + meta.last + ".txt";
                        break;
                }
                localFolder.createFileAsync(filename, Windows.Storage.CreationCollisionOption.replaceExisting).done(function (file) {
                    Windows.Storage.FileIO.writeTextAsync(file, JSON.stringify(data));
                });
            },
            loadResultAsync: function (meta) {
                var localFolder = Windows.Storage.ApplicationData.current.localFolder;
                var filename;

                switch (meta.method) {
                    case "upto":
                        filename = "upto-" + meta.upto + ".txt";
                        break;
                    case "firstN":
                        filename = "firstN-" + meta.firstN + ".txt";
                        break;
                    case "between":
                        filename = "between-" + meta.first + "-" + meta.last + ".txt";
                        break;
                }

                return new WinJS.Promise(function (complete, error) {
                    localFolder.getFileAsync(filename).then(function (file) {
                        Windows.Storage.FileIO.readTextAsync(file).done(function (text) {
                            complete(JSON.parse(text));
                        });
                    }, function () {
                        complete(null);
                    });
                });
            },
            calculateUpToAsync: function (upto) {
                var self = this;
                return new WinJS.Promise(function (complete, error) {
                    self.loadResultAsync({ method: "upto", upto: upto }).then(function (saved) {
                        if (saved) {
                            complete(saved);
                        }
                        else {
                            var workerNumber = self.getWorkerNumber();
                            if (workerNumber !== null) {
                                self.primesWorkers[workerNumber].onmessage = function (event) {
                                    self.takenWorkers[event.data.number] = false;

                                    self.saveResultAsync({ method: "upto", upto: upto }, event.data);

                                    complete(event.data);
                                };
                                self.takenWorkers[workerNumber] = true;
                                self.primesWorkers[workerNumber].postMessage({ method: "upto", upto: upto, number: workerNumber });
                            } else {
                                error("Only " + self.workersNumber + " requests are allowed at one time.")
                            }
                        }
                    });
                });
            },
            calculateFirstNAsync: function (n) {
                var self = this;
                return new WinJS.Promise(function (complete, error) {
                    self.loadResultAsync({ method: "firstN", firstN: n }).then(function (saved) {
                        if (saved) {
                            complete(saved);
                        }
                        else {
                            var workerNumber = self.getWorkerNumber();
                            if (workerNumber !== null) {
                                self.primesWorkers[workerNumber].onmessage = function (event) {
                                    self.takenWorkers[event.data.number] = false;

                                    self.saveResultAsync({ method: "firstN", firstN: n }, event.data);

                                    complete(event.data);
                                };
                                self.takenWorkers[workerNumber] = true;
                                self.primesWorkers[workerNumber].postMessage({ method: "firstN", n: n, number: workerNumber });
                            } else {
                                error("Only " + self.workersNumber + " requests are allowed at one time.")
                            }
                        }
                    });
                });
            },
            calculateBetweenAsync: function (first, last) {
                var self = this;
                return new WinJS.Promise(function (complete, error) {
                    self.loadResult({ method: "between", first: first, last: last }).then(function (saved) {
                        if (saved) {
                            complete(saved);
                        }
                        else {
                            var workerNumber = self.getWorkerNumber();
                            if (workerNumber !== null) {
                                self.primesWorkers[workerNumber].onmessage = function (event) {
                                    self.takenWorkers[event.data.number] = false;

                                    self.saveResultAsync({ method: "between", first: first, last: last }, event.data);

                                    complete(event.data);
                                };
                                self.takenWorkers[workerNumber] = true;
                                self.primesWorkers[workerNumber].postMessage({ method: "between", first: first, last: last, number: workerNumber });
                            } else {
                                error("Only " + self.workersNumber + " requests are allowed at one time.")
                            }
                        }
                    });
                });
            }
        })
});
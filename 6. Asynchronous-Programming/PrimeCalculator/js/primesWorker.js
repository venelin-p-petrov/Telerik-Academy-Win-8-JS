/// <reference group="Dedicated Worker" />

var calculatePrimesUpTo = function (upto) {
    // Uses Sieve of Atkin

    // search limit
    var limit = upto || Number.MAX_VALUE;

    // initialize the sieve
    var isPrime = new Array(limit);

    var sqrtLimit = Math.sqrt(limit);

    // put in candidate primes: 
    // integers which have an odd number of
    // representations by certain quadratic forms
    for (var x = 1; x <= sqrtLimit; x++) {
        for (var y = 1; y <= sqrtLimit; y++) {
            var n = 4 * x * x + y * y;
            if (n <= limit && (n % 12 == 1 || n % 12 == 5)) {
                isPrime[n] = !isPrime[n];
            }

            n = 3 * x * x + y * y;
            if (n <= limit && n % 12 == 7) {
                isPrime[n] = !isPrime[n];
            }

            n = 3 * x * x - y * y;
            if (x > y && n <= limit && n % 12 == 11) {
                isPrime[n] = !isPrime[n];
            }
        }
    }

    // eliminate composites by sieving
    for (var n = 5; n <= sqrtLimit; n++) {
        if (isPrime[n]) {
            // n is prime, omit multiples of its square; this is
            // sufficient because composites which managed to get
            // on the list cannot be square-free
            var nSquare = n * n;
            for (var k = nSquare; k <= limit; k += nSquare) {
                isPrime[k] = false;
            }
        }
    }

    var primesList = new Array(2, 3);
    for (var n = 5; n <= limit; n++) {
        if (isPrime[n]) {
            primesList.push(n);
        }
    }

    return primesList;
}

var calculateFirstN = function (n) {
    if (n == 0) {
        return new Array();
    }
    else if (n == 1) {
        return new Array(2);
    }
    else if (n == 2) {
        return new Array(2, 3);
    }

    var primesList = new Array(2, 3);
    var curr = 5;

    while (primesList.length < n) {
        var currSqrt = Math.sqrt(curr);
        var isPrime = true;
        for (var i = 2; i <= currSqrt; i++) {
            if (curr % i == 0) {
                isPrime = false;
                break;
            }
        }

        if (isPrime) {
            primesList.push(curr);
        }

        curr++;
    }

    return primesList;
}

var calculateBetween = function (first, last) {
    var primesList = calculatePrimesUpTo(last);

    primesList = primesList.filter(function (element) { return element >= first; });

    return primesList;
}

onmessage = function (event) {
    var data = {};
    switch (event.data.method) {
        case "upto":
            var upto = event.data.upto;
            data = {
                primes: calculatePrimesUpTo(upto),
                method: "Primes less than " + upto + ": ",
            };
            break;
        case "firstN":
            var n = event.data.n;
            data = {
                primes: calculateFirstN(n),
                method: "First " + n + " primes: "
            };
            break;
        case "between":
            var first = event.data.first;
            var last = event.data.last;
            data = {
                primes: calculateBetween(first, last),
                method: "Primes between " + first + " and " + last + " : "
            };
            break;
        default:

    }

    data.number = event.data.number;
    postMessage(data);
}

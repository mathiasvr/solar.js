// TODO: constify
const J2000 = toEpoch(new Date('2000-01-01T12:00:00-0000'));
const SECS_PER_DAY = 24 * 60 * 60;
const DAYS_PER_CENTURY = 365.25 * 100;
const RAD2DEG = 180 / Math.PI;
const DEG2RAD = Math.PI / 180;
// -------

export function computeOrbitalElements(planet_orbitalElements, myday_epoch) {
	//var mars = planets.mars;

	//var myday =/* toEpoch(new Date('1997-06-21T00:00:00')); */ //J2000;// 
	//	toEpoch(new Date('1991-10-02T05:15:00'));

	// TODO: maybe copy first and then ehhh, time shift function
	var dat = getOrbitalElementsForEpoch(planet_orbitalElements, myday_epoch);

	// convert degrees to radians
	// TODO: maybe fix entire dataset, if precise enough, else prettify this
	dat.i = dat.i * DEG2RAD;
	dat.wl = dat.wl * DEG2RAD;
	dat.N = dat.N * DEG2RAD;
	dat.L = dat.L * DEG2RAD;

	computeMoreOrbitalElements(dat); //todo separate?

	dat.E = solveEccentricAnomaly(solveKepler(dat.e, dat.M), dat.M, 6);

	return dat;
}

// todo rename
// 1: compute keplerian elements for the given epoch 
function getOrbitalElementsForEpoch(baseElements, epoch) { //initial, keplarian, time stuff
	// Number of centuries past J2000.0
	// var Tj = (2448531.7187500 - 2451545.0) / DAYS_PER_CENTURY;
	var T = (epoch - J2000) / SECS_PER_DAY / DAYS_PER_CENTURY;
	var result = {};

	for (var el in baseElements.el) {
		result[el] = baseElements.el[el] + T * baseElements.cy[el];
	}

	return result;
}

// TODO 1 alternative
// this would make more sense if the cy was not appended, maybe we should make a class
function timeCorrectOrbitalElementsForEpoch(elements, epoch) {
	// Number of centuries past J2000.0
	var T = (epoch - J2000) / SECS_PER_DAY / DAYS_PER_CENTURY;

	for (var el in elements.el) {
		elements.el[el] += T * elements.cy[el];
	}
}


// todo rename
function computeMoreOrbitalElements(elements) {
	// argument of perigee (perihelion)
	elements.w = elements.wl - elements.N;
	// mean anomaly
	elements.M = elements.L - elements.wl;
	//TODO modulus
}


//

function toEpoch(date) {
	var epoch = date.getTime() / 1000;
	// TODO: omfg cant use dates before 1582 4 oct because of julian to gregorian calendar shift, it baffles me that this is a problem.
	// all before 5 oct, untested and unreadable
	return epoch < -12220156800 ? epoch + 10 : epoch;
}


// ------

// the stolen code
var solveEccentricAnomaly = function (f, x0, maxIter) {
	var x = 0;
	var x2 = x0;

	for (var i = 0; i < maxIter; i++) {
		x = x2;
		x2 = f(x);
	}

	return x2;
}

var solveKepler = function (e, M) {
	return function (x) {
		return x + (M + e * Math.sin(x) - x) / (1 - e * Math.cos(x));
	};
};

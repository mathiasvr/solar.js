// TODO FIX ALL THIS

import Position from './position';

function toEpoch(date) {
	var epoch = date.getTime() / 1000;
	// TODO: omfg cant use dates before 1582 4 oct because of julian to gregorian calendar shift, it baffles me that this is a problem.
	// all before 5 oct, untested and unreadable
	return epoch < -12220156800 ? epoch + 10 : epoch;
}

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

// TODO: well
const J2000 = new Date('2000-01-01T12:00:00-0000');
const SECS_PER_DAY = 24 * 60 * 60;
const DAYS_PER_CENTURY = 365.25 * 100;
const RAD2DEG = 180 / Math.PI;
const DEG2RAD = Math.PI / 180;

//OrbitalElements
function compute(orbit, epoch) {
	let elements = {};

	elements.epoch = epoch; // TODO: epochify with method or getter or something
		
	// Number of centuries past J2000.0
	// TODO orbit.ref-epoch
	let T = (toEpoch(epoch) - toEpoch(J2000)) / SECS_PER_DAY / DAYS_PER_CENTURY;

	for (let key in orbit.elements) {
		elements[key] = orbit.elements[key] + T * orbit.rates[key];
	}

	// convert degrees to radians
	// TODO: maybe fix entire dataset, if precise enough, else prettify this
	elements.i = elements.i * DEG2RAD;
	elements.ϖ = elements.ϖ * DEG2RAD;
	elements.Ω = elements.Ω * DEG2RAD;
	elements.L = elements.L * DEG2RAD;

	// argument of perigee (perihelion)
	elements.w = elements.ϖ - elements.Ω;
	// mean anomaly
	elements.M = elements.L - elements.ϖ;
		
	//TODO modulus all or waht maybe in funcions whater test elements haha lol dont n
	elements.w = elements.w % (2 * Math.PI);
	elements.M = elements.M % (2 * Math.PI);

	elements.E = solveEccentricAnomaly(solveKepler(elements.e, elements.M), elements.M, 6);
		
	// TODO: the structure need serious work
	elements.position = Position.calculateOrbitalPosition(elements.a, elements.e, elements.E);

	elements.helposition = Position.calculateEcclipticPosition(elements.Ω, elements.i, elements.w, elements.position);

	return elements;
}

// TODO: is it better to just export all sep and do * thing
export default {compute, J2000};

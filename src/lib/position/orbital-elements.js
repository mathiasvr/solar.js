function toEpoch(date) {
	var epoch = date.getTime() / 1000;
	// TODO: omfg cant use dates before 1582 4 oct because of julian to gregorian calendar shift, it baffles me that this is a problem.
	// all before 5 oct, untested and unreadable
	return epoch < -12220156800 ? epoch + 10 : epoch;
}

const MAX_ITERATIONS = 10;
const TOLERANCE = 10E-6;

function computeEccentricAnomaly(M, e) {
	let E = M;

	// solve Kepler's equation: M = E - e * sin(E)
	for (let i = 0, ΔE = 1; Math.abs(ΔE) > TOLERANCE && i < MAX_ITERATIONS; i++, E += ΔE) {
		ΔE = (M - E + e * Math.sin(E)) / (1 - e * Math.cos(E));
	}
	
	// TODO: if(Math.abs(ΔE) > TOLERANCE) { // error: did not converge }

	return E;
}


// TODO: well
const J2000 = new Date('2000-01-01T12:00:00-0000');
const SECS_PER_DAY = 24 * 60 * 60;
const DAYS_PER_CENTURY = 365.25 * 100;
const RAD_TO_DEG = 180 / Math.PI;
const DEG_TO_RAD = Math.PI / 180;

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
	elements.i *= DEG_TO_RAD;
	elements.ϖ *= DEG_TO_RAD;
	elements.Ω *= DEG_TO_RAD;
	elements.L *= DEG_TO_RAD;

	// argument of perigee (perihelion)
	elements.w = elements.ϖ - elements.Ω;
	
	// mean anomaly
	elements.M = elements.L - elements.ϖ;
		
	//TODO modulus all angles 
	elements.w %= (2 * Math.PI);
	elements.M %= (2 * Math.PI);

	elements.E = computeEccentricAnomaly(elements.M, elements.e);

	return elements;
}

// TODO: is it better to just export all sep and do * thing
export default {compute, J2000};

// TODO: well
export const J2000 = new Date('2000-01-01T12:00:00-0000');
const SECS_PER_DAY = 24 * 60 * 60;
const DAYS_PER_CENTURY = 365.25 * 100;
const RAD_TO_DEG = 180 / Math.PI;
const DEG_TO_RAD = Math.PI / 180;
const TAU = 2 * Math.PI;

export function compute(orbit, epoch) {
	let elements = {};

	elements.epoch = epoch; // TODO: epochify with method or getter or something
		
	// number of centuries past J2000
	// TODO orbit.ref-epoch
	// get rid of toEpoch
	let T = (toEpoch(epoch) - toEpoch(J2000)) / SECS_PER_DAY / DAYS_PER_CENTURY;

	// calculate orbital elements for given epoch
	for (let key in orbit.elements) {
		elements[key] = orbit.elements[key] + T * orbit.rates[key];
	}

	// convert degrees to radians for all angles
	// TODO: maybe fix entire dataset, if precise enough
	['i', 'ϖ', 'Ω', 'L'].forEach(key => elements[key] *= DEG_TO_RAD);

	// argument of perigee (perihelion)
	elements.w = elements.ϖ - elements.Ω;
	
	// mean anomaly
	elements.M = elements.L - elements.ϖ;
		
	// TODO: modulus all angles 
	elements.w %= TAU;
	elements.M %= TAU;
	//['i', 'ϖ', 'Ω', 'L', 'w', 'M'].forEach(key => elements[key] %= TAU);

	elements.E = computeEccentricAnomaly(elements.M, elements.e);

	return elements;
}

const MAX_ITERATIONS = 10;
const TOLERANCE = 10E-6;

function computeEccentricAnomaly(M, e) {
	let E = M;

	// solve Kepler's equation: M = E - e * sin(E)
	for (let i = 0, ΔE = 1; Math.abs(ΔE) > TOLERANCE && i < MAX_ITERATIONS; i++, E += ΔE) {
		ΔE = (M - E + e * Math.sin(E)) / (1 - e * Math.cos(E));
	}
	
	// TODO: if(Math.abs(ΔE) > TOLERANCE) { // error: did not converge } // if(i === MAX_ITERATIONS)

	return E;
}

function toEpoch(date) {
	var epoch = date.getTime() / 1000;
	// TODO: omfg cant use dates before 1582 4 oct because of julian to gregorian calendar shift, it baffles me that this is a problem.
	// all before 5 oct, untested and unreadable
	return epoch < -12220156800 ? epoch + 10 : epoch;
}

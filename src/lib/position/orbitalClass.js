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

// TODO: removed the class
// const mean = Symbol(); // TODO fuck this

// export default class OrbitalElements {

// 	constructor(initialElements, epoch) {

// 		this[mean] = initialElements; // TODO: consider naming

// 		if (epoch /* is typeof date*/) {
// 			this.setEpoch(epoch);
// 		} else {
// 			// TODO: set to ref (J2000)
// 			this.setEpoch(J2000);
// 		}

// 	}

// 	// 1: compute keplerian elements for the given epoch 
// 	setEpoch(epoch) {
// 		this.epoch = epoch; // TODO: epochify with method or getter or something
		
// 		// Number of centuries past J2000.0
// 		// todo initialElements.refepoch
// 		let T = (toEpoch(epoch) - toEpoch(J2000)) / SECS_PER_DAY / DAYS_PER_CENTURY;

// 		for (let key in this[mean].elements) {
// 			this[key] = this[mean].elements[key] + T * this[mean].rates[key];
// 		}

// 		this._computeElements();
// 	}

// 	_computeElements() {
// 		// convert degrees to radians
// 		// TODO: maybe fix entire dataset, if precise enough, else prettify this
// 		this.i = this.i * DEG2RAD;
// 		this.ϖ = this.ϖ * DEG2RAD;
// 		this.Ω = this.Ω * DEG2RAD;
// 		this.L = this.L * DEG2RAD;

// 		// argument of perigee (perihelion)
// 		this.w = this.ϖ - this.Ω;
// 		// mean anomaly
// 		this.M = this.L - this.ϖ;
		
// 		//TODO modulus
// 		this.w = this.w % (2 * Math.PI);
// 		this.M = this.M % (2 * Math.PI);
		
// 		this.E = solveEccentricAnomaly(solveKepler(this.e, this.M), this.M, 6);
		
// 		// TODO: the structure need serious work
// 		this.position = Position.calculateOrbitalPosition(this.a, this.e, this.E);
		
// 		this.helposition = Position.calculateEcclipticPosition(this.Ω, this.i, this.w, this.position);
// 	}

// }

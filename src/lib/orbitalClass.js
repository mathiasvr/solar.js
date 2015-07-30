'use strict'; // TODO: this should be automated by bable ????

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

// heliocentric coordinates in the orbital plane
function calculateOrbitalPosition(a, e, E) {
	return {
		x: a * (Math.cos(E) - e),
		y: a * Math.sqrt(1 - e * e) * Math.sin(E),
		z: 0
	}
}

// position it the helicentric eccliptic plane
//TODO: this can be done in many ways... choose 
// TEST IN AFTER EDITS
function calculateEcclipticPosition(N, i, w, opos) {
	return {
		x: opos.x * (Math.cos(w) * Math.cos(N) - Math.sin(w) * Math.sin(N) * Math.cos(i))
		+ opos.y * (- Math.sin(w) * Math.cos(N) - Math.cos(w) * Math.sin(N) * Math.cos(i)),
		y: opos.x * (Math.cos(w) * Math.sin(N) + Math.sin(w) * Math.cos(N) * Math.cos(i))
		+ opos.y * (- Math.sin(w) * Math.sin(N) + Math.cos(w) * Math.cos(N) * Math.cos(i)),
		z: opos.x * (Math.sin(w) * Math.sin(i))
		+ opos.y * (Math.cos(w) * Math.sin(i))
	}
	
	/*let cN = Math.cos(N); let sN = Math.sin(N);
	let ci = Math.cos(i); let si = Math.sin(i);
	let cw = Math.cos(w); let sw = Math.sin(w);
	
	return {
		x: opos.x * (cw * cN - sw * sN * ci) + opos.y * (- sw * cN - cw * sN * ci),
		y: opos.x * (cw * sN + sw * cN * ci) + opos.y * (- sw * sN + cw * cN * ci),
		z: opos.x * (sw * si) + opos.y * (cw * si)
	}*/
}



// TODO: well
const J2000 = new Date('2000-01-01T12:00:00-0000');
const SECS_PER_DAY = 24 * 60 * 60;
const DAYS_PER_CENTURY = 365.25 * 100;
const RAD2DEG = 180 / Math.PI;
const DEG2RAD = Math.PI / 180;

const mean = Symbol(); // TODO fuck this

export default class OrbitalElements {

	constructor(initialElements, epoch) {

		this[mean] = initialElements; // TODO: consider naming

		if (epoch /* is typeof date*/) {
			this.setEpoch(epoch);
		} else {
			// TODO: set to ref (J2000)
			this.setEpoch(J2000);
		}

	}

	// 1: compute keplerian elements for the given epoch 
	setEpoch(epoch) {
		this.epoch = epoch; // TODO: epochify with method or getter or something
		
		// Number of centuries past J2000.0
		// todo initialElements.refepoch
		let T = (toEpoch(epoch) - toEpoch(J2000)) / SECS_PER_DAY / DAYS_PER_CENTURY;

		for (let key in this[mean].elements) {
			this[key] = this[mean].elements[key] + T * this[mean].rates[key];
		}

		this._computeElements();
	}

	_computeElements() {
		// convert degrees to radians
		// TODO: maybe fix entire dataset, if precise enough, else prettify this
		this.i = this.i * DEG2RAD;
		this.wl = this.wl * DEG2RAD;
		this.N = this.N * DEG2RAD;
		this.L = this.L * DEG2RAD;

		// argument of perigee (perihelion)
		this.w = this.wl - this.N;
		// mean anomaly
		this.M = this.L - this.wl;
		
		//TODO modulus
		this.w = this.w % (2 * Math.PI);
		this.M = this.M % (2 * Math.PI);
		
		this.E = solveEccentricAnomaly(solveKepler(this.e, this.M), this.M, 6);
		
		// TODO: the structure need serious work
		this.position = calculateOrbitalPosition(this.a, this.e, this.E);
		
		this.helposition = calculateEcclipticPosition(this.N, this.i, this.w, this.position);
	}

}

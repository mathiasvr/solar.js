import 'three.js';

// TODO: remove this module, it was supposed to do three pos casting, but that is now in planet.js

import {meanElements} from '../position/orbital-elements-data';

import {CelestialBody} from './space';


// TODO where does this really belong
export function getPlanets() {
	// todo map this better
	let planets = [];
	for (let property in meanElements) {
		let planetData = meanElements[property];
		planets.push(new CelestialBody(planetData));
	}
	return planets;
}

// todo look into this 
/*export function* getPlanets() {
	for (let property in meanElements) {
		let planetData = meanElements[property];
		yield new CelestialBody(planetData);
	}
}
*/
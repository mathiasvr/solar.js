import 'three.js';

// TODO: remove this module, it was supposed to do three pos casting, but that is now in planet.js

import {meanElements} from '../position/orbital-elements-data';

import {CelestialBody} from './space';


// TODO REMOVE MOST
export function getMars() {
	let datetime = new Date('1997-06-21T00:00:00');

	let mars = new CelestialBody(meanElements.mars.physical.eqradius, 0xff0000, meanElements.mars);
	mars.setPositionFromEpoch(datetime);

	console.log('mars-pos', mars.position);
	return mars
}

export function getEarth() {
	let datetime = new Date('1997-06-21T00:00:00');

	let earth = new CelestialBody(meanElements.earth.physical.eqradius, 0x0000ff, meanElements.earth);
	earth.setPositionFromEpoch(datetime);

	console.log('earth-pos', earth.position);
	return earth
}

export function getInnerPlanets() {
	let mercury = new CelestialBody(meanElements.mercury.physical.eqradius, 0x00ffff, meanElements.mercury);
	let venus = new CelestialBody(meanElements.venus.physical.eqradius, 0xffff00, meanElements.venus);
	let earth = new CelestialBody(meanElements.earth.physical.eqradius, 0x0000ff, meanElements.earth);
	let mars = new CelestialBody(meanElements.mars.physical.eqradius, 0xff0000, meanElements.mars);

	return [mercury, venus, earth, mars];
}


// TODO where does this really belong
export function getPlanets() {
	// todo map this better
	let planets = [];
	for (let property in meanElements) {
		let planet = meanElements[property];
		planets.push(new CelestialBody(planet.physical.eqradius, planet.color, planet));
	}
	return planets;
}

// todo look into this 
/*export function* getPlanets() {
	for (let property in meanElements) {
		let planet = meanElements[property];
		yield new CelestialBody(planet.physical.eqradius, planet.color, planet);
	}
}
*/
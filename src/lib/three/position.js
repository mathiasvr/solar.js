import 'three.js';

// TODO: remove this module, it was supposed to do three pos casting, but that is now in planet.js

import OrbitalElements from '../position/orbitalClass';
import {meanElements} from '../position/orbital-elements-data';

import {CelestialBody, Stars} from './planet';

// testing

export function getMars() {
	let datetime = new Date('1997-06-21T00:00:00');

	let mars = new CelestialBody(meanElements.mars.eqradius, 0xff0000, meanElements.mars);
	mars.setPositionFromEpoch(datetime);

	console.log('mars-pos', mars.position);
	return mars
}

export function getEarth() {
	let datetime = new Date('1997-06-21T00:00:00');

	let earth = new CelestialBody(meanElements.earth.eqradius, 0x0000ff, meanElements.earth);
	earth.setPositionFromEpoch(datetime);

	console.log('earth-pos', earth.position);
	return earth
}

export function getInnerPlanets() {
	let mercury = new CelestialBody(meanElements.mercury.eqradius, 0x00ffff, meanElements.mercury);
	let venus = new CelestialBody(meanElements.venus.eqradius, 0xffff00, meanElements.venus);
	let earth = new CelestialBody(meanElements.earth.eqradius, 0x0000ff, meanElements.earth);
	let mars = new CelestialBody(meanElements.mars.eqradius, 0xff0000, meanElements.mars);

	return [mercury, venus, earth, mars];
}


export function getPlanets() {
	// todo map this better
	let planets = [];
	for (let property in meanElements) {
		let planet = meanElements[property];
		planets.push(new CelestialBody(planet.eqradius, planet.color, planet));
	}
	return planets;
}


/*// first
console.time('pos1');
var orbel = new OrbitalElements(mars);
console.timeEnd('pos1');

console.log(orbel);

// second
console.time('pos2');
orbel.setEpoch(new Date('1997-06-21T00:00:00')); //new Date('1991-10-02T05:15:00'));
console.timeEnd('pos2');

console.log(orbel);

console.time('1000 pos');
for (var i = 0; i < 1000; i++) {
	orbel.setEpoch(new Date('1997-06-21T00:00:00'));
}

console.timeEnd('1000 pos');

console.log(orbel);*/
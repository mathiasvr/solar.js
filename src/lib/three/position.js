import 'three.js';

import OrbitalElements from '../position/orbitalClass';
import {meanElements} from '../position/orbital-elements-data';

import {CelestialBody, Stars} from './planet';

// testing

export function getMars() { 
	let datetime = new Date('1997-06-21T00:00:00');

	let mars = new CelestialBody(40, 0xff0000, meanElements.mars);
	mars.setPositionFromEpoch(datetime);

	console.log('mars-pos', mars.position);
	return mars
}

export function getEarth() { 
	let datetime = new Date('1997-06-21T00:00:00');

	let earth = new CelestialBody(50, 0x0000ff, meanElements.earth);
	earth.setPositionFromEpoch(datetime);

	console.log('earth-pos', earth.position);
	return earth
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
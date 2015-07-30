'use strict'; // TODO: this should be automated by bable ????

import OrbitalElements from '../orbitalClass';

// testing
let mars = {
	name: 'Mars',
	elements: { a: 1.52371034, e: 0.09339410, i: 1.84969142, L: -4.55343205, wl: -23.94362959, N: 49.55953891 },
	rates: { a: 0.00001847, e: 0.00007882, i: -0.00813131, L: 19140.30268499, wl: 0.44441088, N: -0.29257343 }
};

// first
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

console.log(orbel);

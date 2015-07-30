(function () {

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


// mah shit 

var kep = function(M, e, ith) {
	var E = M + e * Math.sin(M);

	for (var i = 0; i < ith; i++) {
		E += (M - E + e * Math.sin(E)) / (1 - e * Math.cos(E));
	}

	return E;
}

// things
var toEpoch = function(date) {
	var epoch = date.getTime() / 1000;
	// TODO: omfg cant use dates before 1582 4 oct because of julian to gregorian calendar shift, it baffles me that this is a problem.
	// all before 5 oct, untested and unreadable
	return epoch < -12220156800 ? epoch + 10 : epoch;
};

// whateva
var toJulian = function (epoch) {
	return epoch / SECS_PER_DAY + 2440587.5;
};


var SECS_PER_DAY = 24 * 60 * 60;
var DAYS_PER_CENTURY = 365.25 * 100;

var RAD2DEG = 180 / Math.PI;
var DEG2RAD = Math.PI / 180;
// gonna start with a direct implementation of the jpl documents
// failed lol, the radians got me hard

/*
Keplerian elements and their rates, with respect to the mean ecliptic
and equinox of J2000, valid for the time-interval 1800 AD - 2050 AD.

               a              e               I                L            long.peri.      long.node.
           AU, AU/Cy     rad, rad/Cy     deg, deg/Cy      deg, deg/Cy      deg, deg/Cy     deg, deg/Cy
-----------------------------------------------------------------------------------------------------------
Mercury   0.38709927      0.20563593      7.00497902      252.25032350     77.45779628     48.33076593
          0.00000037      0.00001906     -0.00594749   149472.67411175      0.16047689     -0.12534081
Venus     0.72333566      0.00677672      3.39467605      181.97909950    131.60246718     76.67984255
          0.00000390     -0.00004107     -0.00078890    58517.81538729      0.00268329     -0.27769418
EM Bary   1.00000261      0.01671123     -0.00001531      100.46457166    102.93768193      0.0
          0.00000562     -0.00004392     -0.01294668    35999.37244981      0.32327364      0.0
Mars      1.52371034      0.09339410      1.84969142       -4.55343205    -23.94362959     49.55953891
          0.00001847      0.00007882     -0.00813131    19140.30268499      0.44441088     -0.29257343
Jupiter   5.20288700      0.04838624      1.30439695       34.39644051     14.72847983    100.47390909
         -0.00011607     -0.00013253     -0.00183714     3034.74612775      0.21252668      0.20469106
Saturn    9.53667594      0.05386179      2.48599187       49.95424423     92.59887831    113.66242448
         -0.00125060     -0.00050991      0.00193609     1222.49362201     -0.41897216     -0.28867794
Uranus   19.18916464      0.04725744      0.77263783      313.23810451    170.95427630     74.01692503
         -0.00196176     -0.00004397     -0.00242939      428.48202785      0.40805281      0.04240589
Neptune  30.06992276      0.00859048      1.77004347      -55.12002969     44.96476227    131.78422574
          0.00026291      0.00005105      0.00035372      218.45945325     -0.32241464     -0.00508664
Pluto    39.48211675      0.24882730     17.14001206      238.92903833    224.06891629    110.30393684
         -0.00031596      0.00005170      0.00004818      145.20780515     -0.04062942     -0.01183482
*/

/*
test mars
2451545.000000000 = A.D. 2000-Jan-01 12:00:00.0000 (CT)
 EC= 9.331510145396062E-02 QR= 1.381496733143451E+00 IN= 1.849876432291737E+00
 OM= 4.956200626315643E+01 W = 2.865373825261921E+02 Tp=  2451508.062923342921
 N = 5.240393798848797E-01 MA= 1.935648274604994E+01 TA= 2.333319664242420E+01
 A = 1.523678992954245E+00 AD= 1.665861252765038E+00 PR= 6.869712731876836E+02
 
 2451545.000000000 = A.D. 2000-Jan-01 12:00:00.0000 (CT)
   1.383579466402647E+00 -1.621204117825275E-02 -3.426152579691658E-02
   6.768779495222499E-04  1.517984118259482E-02  3.015574279972501E-04
   7.993886602636887E-03  1.384098559453095E+00  4.913569193788442E-04
*/
//var earth = { a: 1.00000261, e: 0.01671123, I: -0.00001531, L: 100.46457166, wq: 102.93768193, O: 0.0 };
//var earth_cy = { a: 0.00000562, e: -0.00004392, I: -0.01294668, L: 35999.37244981, wq: 0.32327364, O: 0.0 };


/*
a: Semimajor axis
e: Eccentricity 
I: Inclination
L: Mean longitude
wl: Longitude of the periapsis
N: Longitude of the ascending node

w/ω: Argument of periapsis (perihelion)
M: Mean anomaly
*/

var planets = {
	mercury: {
		name: 'Mercury',
		el: { a: 0.38709927, e: 0.20563593, i: 7.00497902, L: 252.25032350, wl: 77.45779628, N: 48.33076593 },
		cy: { a: 0.00000037, e: 0.00001906, i: -0.00594749, L: 149472.67411175, wl: 0.16047689, N: -0.12534081 }
	}, venus: {
		name: 'Venus',
		el: { a: 0.72333566, e: 0.00677672, i: 3.39467605, L: 181.97909950, wl: 131.60246718, N: 76.67984255 },
		cy: { a: 0.00000390, e: -0.00004107, i: -0.00078890, L: 58517.81538729, wl: 0.00268329, N: -0.27769418 }
	}, earth: {
		name: 'EM Bary', // Earth-Moon Bary-center (i guess)
		el: { a: 1.00000261, e: 0.01671123, i: -0.00001531, L: 100.46457166, wl: 102.93768193, N: 0.0 },
		cy: { a: 0.00000562, e: -0.00004392, i: -0.01294668, L: 35999.37244981, wl: 0.32327364, N: 0.0 }
	}, mars: {
		name: 'Mars',
		el: { a: 1.52371034, e: 0.09339410, i: 1.84969142, L: -4.55343205, wl: -23.94362959, N: 49.55953891 },
		cy: { a: 0.00001847, e: 0.00007882, i: -0.00813131, L: 19140.30268499, wl: 0.44441088, N: -0.29257343 }
	}, jupiter: {
		name: 'Jupiter',
		el: { a: 5.20288700, e: 0.04838624, i: 1.30439695, L: 34.39644051, wl: 14.72847983, N: 100.47390909 },
		cy: { a: -0.00011607, e: -0.00013253, i: -0.00183714, L: 3034.74612775, wl: 0.21252668, N: 0.20469106 }
	}, saturn: {
		name: 'Saturn',
		el: { a: 9.53667594, e: 0.05386179, i: 2.48599187, L: 49.95424423, wl: 92.59887831, N: 113.66242448 },
		cy: { a: -0.00125060, e: -0.00050991, i: 0.00193609, L: 1222.49362201, wl: -0.41897216, N: -0.28867794 }
	}, uranus: {
		name: 'Uranus',
		el: { a: 19.18916464, e: 0.04725744, i: 0.77263783, L: 313.23810451, wl: 170.95427630, N: 74.01692503 },
		cy: { a: -0.00196176, e: -0.00004397, i: -0.00242939, L: 428.48202785, wl: 0.40805281, N: 0.04240589 }
	}, neptune: {
		name: 'Neptune',
		el: { a: 30.06992276, e: 0.00859048, i: 1.77004347, L: -55.12002969, wl: 44.96476227, N: 131.78422574 },
		cy: { a: 0.00026291, e: 0.00005105, i: 0.00035372, L: 218.45945325, wl: -0.32241464, N: -0.00508664 }
	}, pluto: {
		name: 'Pluto',
		el: { a: 39.48211675, e: 0.24882730, i: 17.14001206, L: 238.92903833, wl: 224.06891629, N: 110.30393684 },
		cy: { a: -0.00031596, e: 0.00005170, i: 0.00004818, L: 145.20780515, wl: -0.04062942, N: -0.01183482 }
	}
};

var mars = planets.mars;

var J2000 = toEpoch(new Date('2000-01-01T12:00:00-0000'));
var myday =/* toEpoch(new Date('1997-06-21T00:00:00')); */ //J2000;// 
	toEpoch(new Date('1991-10-02T05:15:00'));

// Number of centuries past J2000.0
// var Tj = (2448531.7187500 - 2451545.0) / DAYS_PER_CENTURY;
var T = (myday - J2000) / SECS_PER_DAY / DAYS_PER_CENTURY;

//console.log('T:', T);

var dat = {};

// 1: compute keplerian elements for the given epoch 
for (var el in mars.el) {
	dat[el] = mars.el[el] + T * mars.cy[el];
}

dat.i = dat.i * DEG2RAD;
dat.wl = dat.wl * DEG2RAD;
dat.N = dat.N * DEG2RAD;
dat.L = dat.L * DEG2RAD;

// 2 : comupte argument of perihelion and mean anomaly
dat.w = dat.wl - dat.N;
dat.M = dat.L - dat.wl;
// TODO: Jupiter stuff perpetuatians....

// 3

// TODO: FIX BAD MODULO
// use in all degree elms
/*if (dat.M >= 0) {
	dat.M = (dat.M + 180) % 360 - 180;
} else {
	dat.M = -((Math.abs(dat.M) + 180) % 360 - 180);
}*/

//3 keplerian
// eccentric anomaly
dat.E = solveEccentricAnomaly(solveKepler(dat.e, dat.M), dat.M, 6);

console.log('ea', dat.E);
console.log('eax', kep(dat.M, dat.e, 6));

// 4
// heliocentric coordinates in the orbital plane
dat.opos = {
	x: dat.a * (Math.cos(dat.E) - dat.e),
	y: dat.a * Math.sqrt(1 - dat.e * dat.e) * Math.sin(dat.E),
	z: 0
}

// todo use built in euler angles lol -----------------
	
// quaternion tests	OMFG IT ACTUALLY WORKED????	 such a longshot from my side (didnt even use the correct signs this is unbelievable)
// now how to simplify
var aa = dat.N;
var bb = dat.i;
var yy = dat.w;

// zxz rot-mat to quaternion
var qi = Math.cos((aa - yy) / 2) * Math.sin(bb / 2);
var qj = Math.sin((aa - yy) / 2) * Math.sin(bb / 2);
var qk = Math.sin((aa + yy) / 2) * Math.cos(bb / 2);
var qr = Math.cos((aa + yy) / 2) * Math.cos(bb / 2);

/*var quaternion = new THREE.Quaternion(qi, qj, qk, qr);

var pos2 = new THREE.Vector3(dat.opos.x, dat.opos.y, dat.opos.z);
pos2.applyQuaternion(quaternion);

console.log('qua', pos2);	*/

// ------------------


// 5: position it the helicentric eccliptic plane

	
dat.eclpos = {
	x: (Math.cos(dat.w) * Math.cos(dat.N) - Math.sin(dat.w) * Math.sin(dat.N) * Math.cos(dat.i)) * dat.opos.x +
	(- Math.sin(dat.w) * Math.cos(dat.N) - Math.cos(dat.w) * Math.sin(dat.N) * Math.cos(dat.i)) * dat.opos.y,

	y: (Math.cos(dat.w) * Math.sin(dat.N) + Math.sin(dat.w) * Math.cos(dat.N) * Math.cos(dat.i)) * dat.opos.x +
	(- Math.sin(dat.w) * Math.sin(dat.N) + Math.cos(dat.w) * Math.cos(dat.N) * Math.cos(dat.i)) * dat.opos.y,

	z: (Math.sin(dat.w) * Math.sin(dat.i)) * dat.opos.x +
	(Math.cos(dat.w) * Math.sin(dat.i)) * dat.opos.y
}

console.log(dat);

console.log('Pos1', dat.eclpos);

// the swedish way

// aka palar coordinates (not same way as wandering stars guy?)
// true anomaly
var v = Math.atan2(dat.opos.y, dat.opos.x);
// radial distance
var r = Math.sqrt(dat.opos.x * dat.opos.x + dat.opos.y * dat.opos.y); // TODO: vector length

dat.eclpos2 = {
	x: r * (Math.cos(dat.N) * Math.cos(v + dat.w) - Math.sin(dat.N) * Math.sin(v + dat.w) * Math.cos(dat.i)),
	y: r * (Math.sin(dat.N) * Math.cos(v + dat.w) + Math.cos(dat.N) * Math.sin(v + dat.w) * Math.cos(dat.i)),
	z: r * (Math.sin(v + dat.w) * Math.sin(dat.i))
}

console.log('Pos2', dat.eclpos2);

console.log('o-pos', dat.opos);
console.log('polar v,r', v + '(' + (v * RAD2DEG) + ')', r);

// todo we dont need this lets go ecclip
//eq icrf / J2000 ref frame
/*var ee = 23.43928 * DEG2RAD; //todo rad

//ee = dat.i; // sun eq hack

var xeq = x;
var yeq = Math.cos(ee) * y - Math.sin(ee) * z;
var zeq = Math.sin(ee) * y + Math.cos(ee) * z;

console.log('icrf', xeq, yeq, zeq);
*/

// console.log(new Date('1582-10-05T00:00:00-0000').getTime());
// console.log(toJulian(toEpoch(new Date('1582-10-05T00:00:00-0000'))));
// console.log(toJulian(toEpoch(new Date('1582-10-04T00:00:00-0000'))));

})();
// Keplerian (orbital) elements:		http://ssd.jpl.nasa.gov/?planet_pos
// Physical Characteristics:				http://ssd.jpl.nasa.gov/?planet_phys_par

/*
=====================================================================
  These data are to be used as described in the related document
  titled "Keplerian Elements for Approximate Positions of the
  Major Planets" by E.M. Standish (JPL/Caltech) available from
  the JPL Solar System Dynamics web site (http://ssd.jpl.nasa.gov/).
=====================================================================
*/


// TODO rename this file to planetary data or something its not just orbital elements any more
// consider seperating things, instead of 1 big object (orbital, physical, misc), then zip it together

/*
 * Keplerian elements and their rates, with respect to the mean ecliptic
 * and equinox of J2000, valid for the time-interval 1800 AD - 2050 AD.
 *
 * a:	Semimajor axis											AU
 * e: Eccentricity 												rad
 * i: Inclination													deg
 * L: Mean longitude											deg
 * ϖ: Longitude of the periapsis					deg
 * Ω: Longitude of the ascending node			deg
 *
 * rates: units added per century
 */
 
/*
 * equatorialRadius: 			km
 * meanRadius: 						km
 * siderealOrbit:					years
 */

// TODO: not using equatorialRadius anymore, maybe shape planets correctly

// TODO: a lot rename and shit
export const planetsInfo = [
	/*reference_epoch: J2000,*/
	/*validInterval: {
		from: new Date('1800-01-01T00:00:00'),
		to: new Date('2050-01-01T00:00:00')
	},*/
	/*mercury:*/ {
		name: 'Mercury',
		orbit: {
			elements: { a: 0.38709927, e: 0.20563593, i: 7.00497902, L: 252.25032350, ϖ: 77.45779628, Ω: 48.33076593 },
			rates: { a: 0.00000037, e: 0.00001906, i: -0.00594749, L: 149472.67411175, ϖ: 0.16047689, Ω: -0.12534081 }
		},
		physical: { meanRadius: 2439.7, equatorialRadius: 2439.7, siderealOrbit: 0.2408467 },
		color: 0x6d7b7b // todo structure this , i want to seperate this completely
	}, /*venus:*/ {
		name: 'Venus',
		orbit: {
			elements: { a: 0.72333566, e: 0.00677672, i: 3.39467605, L: 181.97909950, ϖ: 131.60246718, Ω: 76.67984255 },
			rates: { a: 0.00000390, e: -0.00004107, i: -0.00078890, L: 58517.81538729, ϖ: 0.00268329, Ω: -0.27769418 }
		},
		physical: { meanRadius: 6051.8, equatorialRadius: 6051.8, siderealOrbit: 0.61519726 },
		color: 0xffff66
	}, /*earth:*/ {
		name: 'Earth', // TODO: this is actually the Earth-Moon Barycenter
		orbit: {
			elements: { a: 1.00000261, e: 0.01671123, i: -0.00001531, L: 100.46457166, ϖ: 102.93768193, Ω: 0.0 },
			rates: { a: 0.00000562, e: -0.00004392, i: -0.01294668, L: 35999.37244981, ϖ: 0.32327364, Ω: 0.0 }
		},
		physical: { meanRadius: 6371, equatorialRadius: 6378.14, siderealOrbit: 1.0000174 },
		color: 0x0033ff
	}, /*mars:*/ {
		name: 'Mars',
		orbit: {
			elements: { a: 1.52371034, e: 0.09339410, i: 1.84969142, L: -4.55343205, ϖ: -23.94362959, Ω: 49.55953891 },
			rates: { a: 0.00001847, e: 0.00007882, i: -0.00813131, L: 19140.30268499, ϖ: 0.44441088, Ω: -0.29257343 }
		},
		physical: { meanRadius: 3389.50, equatorialRadius: 3396.19, siderealOrbit: 1.8808476 },
		color: 0xff3300
	}, /*jupiter:*/ {
		name: 'Jupiter',
		orbit: {
			elements: { a: 5.20288700, e: 0.04838624, i: 1.30439695, L: 34.39644051, ϖ: 14.72847983, Ω: 100.47390909 },
			rates: { a: -0.00011607, e: -0.00013253, i: -0.00183714, L: 3034.74612775, ϖ: 0.21252668, Ω: 0.20469106 }
		},
		physical: { meanRadius: 69911, equatorialRadius: 71492, siderealOrbit: 11.862615 },
		color: 0xff9900
	}, /*saturn:*/ {
		name: 'Saturn',
		orbit: {
			elements: { a: 9.53667594, e: 0.05386179, i: 2.48599187, L: 49.95424423, ϖ: 92.59887831, Ω: 113.66242448 },
			rates: { a: -0.00125060, e: -0.00050991, i: 0.00193609, L: 1222.49362201, ϖ: -0.41897216, Ω: -0.28867794 }
		},
		physical: { meanRadius: 58232, equatorialRadius: 60268, siderealOrbit: 29.447498 },
		color: 0xffff99
	}, /*uranus:*/ {
		name: 'Uranus',
		orbit: {
			elements: { a: 19.18916464, e: 0.04725744, i: 0.77263783, L: 313.23810451, ϖ: 170.95427630, Ω: 74.01692503 },
			rates: { a: -0.00196176, e: -0.00004397, i: -0.00242939, L: 428.48202785, ϖ: 0.40805281, Ω: 0.04240589 }
		},
		physical: { meanRadius: 25362, equatorialRadius: 25559, siderealOrbit: 84.016846 },
		color: 0x33ffcc
	}, /*neptune:*/ {
		name: 'Neptune',
		orbit: {
			elements: { a: 30.06992276, e: 0.00859048, i: 1.77004347, L: -55.12002969, ϖ: 44.96476227, Ω: 131.78422574 },
			rates: { a: 0.00026291, e: 0.00005105, i: 0.00035372, L: 218.45945325, ϖ: -0.32241464, Ω: -0.00508664 }
		},
		physical: { meanRadius: 24622, equatorialRadius: 24764, siderealOrbit: 164.79132 },
		color: 0x0066ff
	}, /*pluto:*/ {
		name: 'Pluto',
		orbit: {
			elements: { a: 39.48211675, e: 0.24882730, i: 17.14001206, L: 238.92903833, ϖ: 224.06891629, Ω: 110.30393684 },
			rates: { a: -0.00031596, e: 0.00005170, i: 0.00004818, L: 145.20780515, ϖ: -0.04062942, Ω: -0.01183482 }
		},
		physical: { meanRadius: 1151, equatorialRadius: 1151, siderealOrbit: 247.92065 },
		color: 0x99ccff
	}
];




// TODO: try remaining data set

/*
 * Keplerian elements and their rates, with respect to the mean ecliptic and equinox of J2000,
 * valid for the time-interval 3000 BC -- 3000 AD.  NOTE: the computation of M for Jupiter through
 * Pluto *must* be augmented by the additional terms given in Table 2b (below).
 */

const otherData = [{
		name: 'Mercury',
		orbit: {
		elements: { a: 0.38709843, e: 0.20563661, i: 7.00559432, L: 252.25166724, ϖ: 77.45771895, Ω: 48.33961819 },
		rates: { a: 0.00000000, e: 0.00002123, i: -0.00590158, L: 149472.67486623, ϖ: 0.15940013, Ω: -0.12214182 }
		}
}, {
		name: 'Venus',
		orbit: {
			elements: { a: 0.72332102, e: 0.00676399, i: 3.39777545, L: 181.97970850, ϖ: 131.76755713, Ω: 76.67261496 },
			rates: { a: -0.00000026, e: -0.00005107, i: 0.00043494, L: 58517.81560260, ϖ: 0.05679648, Ω: -0.27274174 }
		}
	}, {
		name: 'Earth',
		orbit: {
			elements: { a: 1.00000018, e: 0.01673163, i: -0.00054346, L: 100.46691572, ϖ: 102.93005885, Ω: -5.11260389 },
			rates: { a: -0.00000003, e: -0.00003661, i: -0.01337178, L: 35999.37306329, ϖ: 0.31795260, Ω: -0.24123856 }
		}
	}, {
		name: 'Mars',
		orbit: {
			elements: { a: 1.52371243, e: 0.09336511, i: 1.85181869, L: -4.56813164, ϖ: -23.91744784, Ω: 49.71320984 },
			rates: { a: 0.00000097, e: 0.00009149, i: -0.00724757, L: 19140.29934243, ϖ: 0.45223625, Ω: -0.26852431 }
		}
	}, {
		name: 'Jupiter',
		orbit: {
			elements: { a: 5.20248019, e: 0.04853590, i: 1.29861416, L: 34.33479152, ϖ: 14.27495244, Ω: 100.29282654 },
			rates: { a: -0.00002864, e: 0.00018026, i: -0.00322699, L: 3034.90371757, ϖ: 0.18199196, Ω: 0.13024619 },
			pert: { b: -0.00012452, c: 0.06064060, s: -0.35635438, f: 38.35125000 } // TODO: rename
		}
	}, {
		name: 'Saturn',
		orbit: {
			elements: { a: 9.54149883, e: 0.05550825, i: 2.49424102, L: 50.07571329, ϖ: 92.86136063, Ω: 113.63998702 },
			rates: { a: -0.00003065, e: -0.00032044, i: 0.00451969, L: 1222.11494724, ϖ: 0.54179478, Ω: -0.25015002 },
			pert: { b: 0.00025899, c: -0.13434469, s: 0.87320147, f: 38.35125000 }
		}
	}, {
		name: 'Uranus',
		orbit: {
			elements: { a: 19.18797948, e: 0.04685740, i: 0.77298127, L: 314.20276625, ϖ: 172.43404441, Ω: 73.96250215 },
			rates: { a: -0.00020455, e: -0.00001550, i: -0.00180155, L: 428.49512595, ϖ: 0.09266985, Ω: 0.05739699 },
			pert: { b: 0.00058331, c: -0.97731848, s: 0.17689245, f: 7.67025000 }
		}
	}, {
		name: 'Neptune',
		orbit: {
			elements: { a: 30.06952752, e: 0.00895439, i: 1.77005520, L: 304.22289287, ϖ: 46.68158724, Ω: 131.78635853 },
			rates: { a: 0.00006447, e: 0.00000818, i: 0.00022400, L: 218.46515314, ϖ: 0.01009938, Ω: -0.00606302 },
			pert: { b: -0.00041348, c: 0.68346318, s: -0.10162547, f: 7.67025000 }
		}
	}, {
		name: 'Pluto',
		orbit: {
			elements: { a: 39.48686035, e: 0.24885238, i: 17.14104260, L: 238.96535011, ϖ: 224.09702598, Ω: 110.30167986 },
			rates: { a: 0.00449751, e: 0.00006016, i: 0.00000501, L: 145.18042903, ϖ: -0.00968827, Ω: -0.00809981 },
			pert: { b: -0.01262724 }
		}
	},
];

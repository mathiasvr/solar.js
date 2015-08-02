/*
 * Keplerian elements and their rates, with respect to the mean ecliptic
 * and equinox of J2000, valid for the time-interval 1800 AD - 2050 AD.
 *
 * a:		Semimajor axis						AU
 * e: 		Eccentricity 						rad
 * I: 		Inclination							deg
 * L: 		Mean longitude						deg
 * wl/ϖ: 	Longitude of the periapsis			deg
 * N/Ω: 	Longitude of the ascending node		deg
 *
 * rates: x/ century
 */

// TODO: a lot rename and shit
export const meanElements = {
	/*reference_epoch: J2000,*/
	/*validInterval: {
		from: new Date('1800-01-01T00:00:00'),
		to: new Date('2050-01-01T00:00:00')
	},*/
	mercury: {
		name: 'Mercury',
		elements: { a: 0.38709927, e: 0.20563593, i: 7.00497902, L: 252.25032350, wl: 77.45779628, N: 48.33076593 },
		rates: { a: 0.00000037, e: 0.00001906, i: -0.00594749, L: 149472.67411175, wl: 0.16047689, N: -0.12534081 },
		physical: { eqradius: 2439.7, siderealOrbit: 0.2408467 },
		color: 0x6D7B7B // todo structure this shit
	}, venus: {
		name: 'Venus',
		elements: { a: 0.72333566, e: 0.00677672, i: 3.39467605, L: 181.97909950, wl: 131.60246718, N: 76.67984255 },
		rates: { a: 0.00000390, e: -0.00004107, i: -0.00078890, L: 58517.81538729, wl: 0.00268329, N: -0.27769418 },
		physical: { eqradius: 6051.8, siderealOrbit: 0.61519726 },
		color: 0xffff66
	}, earth: {
		name: 'Earth', // TODO: this is actually the Earth-Moon Barycenter
		elements: { a: 1.00000261, e: 0.01671123, i: -0.00001531, L: 100.46457166, wl: 102.93768193, N: 0.0 },
		rates: { a: 0.00000562, e: -0.00004392, i: -0.01294668, L: 35999.37244981, wl: 0.32327364, N: 0.0 },
		physical: { eqradius: 6378.14, siderealOrbit: 1.0000174 }, // TODO: km and year, physical charac. organize it + update all or whatever
		color: 0x0033ff
	}, mars: {
		name: 'Mars',
		elements: { a: 1.52371034, e: 0.09339410, i: 1.84969142, L: -4.55343205, wl: -23.94362959, N: 49.55953891 },
		rates: { a: 0.00001847, e: 0.00007882, i: -0.00813131, L: 19140.30268499, wl: 0.44441088, N: -0.29257343 },
		physical: { eqradius: 3396.19, siderealOrbit: 1.8808476 },
		color: 0xff3300
	}, jupiter: {
		name: 'Jupiter',
		elements: { a: 5.20288700, e: 0.04838624, i: 1.30439695, L: 34.39644051, wl: 14.72847983, N: 100.47390909 },
		rates: { a: -0.00011607, e: -0.00013253, i: -0.00183714, L: 3034.74612775, wl: 0.21252668, N: 0.20469106 },
		physical: { eqradius: 71492, siderealOrbit: 11.862615 },
		color: 0xff9900
	}, saturn: {
		name: 'Saturn',
		elements: { a: 9.53667594, e: 0.05386179, i: 2.48599187, L: 49.95424423, wl: 92.59887831, N: 113.66242448 },
		rates: { a: -0.00125060, e: -0.00050991, i: 0.00193609, L: 1222.49362201, wl: -0.41897216, N: -0.28867794 },
		physical: { eqradius: 60268, siderealOrbit: 29.447498 },
		color: 0xffff99
	}, uranus: {
		name: 'Uranus',
		elements: { a: 19.18916464, e: 0.04725744, i: 0.77263783, L: 313.23810451, wl: 170.95427630, N: 74.01692503 },
		rates: { a: -0.00196176, e: -0.00004397, i: -0.00242939, L: 428.48202785, wl: 0.40805281, N: 0.04240589 },
		physical: { eqradius: 25559, siderealOrbit: 84.016846 },
		color: 0x33ffcc
	}, neptune: {
		name: 'Neptune',
		elements: { a: 30.06992276, e: 0.00859048, i: 1.77004347, L: -55.12002969, wl: 44.96476227, N: 131.78422574 },
		rates: { a: 0.00026291, e: 0.00005105, i: 0.00035372, L: 218.45945325, wl: -0.32241464, N: -0.00508664 },
		physical: { eqradius: 24764, siderealOrbit: 164.79132 },
		color: 0x0066ff
	}, pluto: {
		name: 'Pluto',
		elements: { a: 39.48211675, e: 0.24882730, i: 17.14001206, L: 238.92903833, wl: 224.06891629, N: 110.30393684 },
		rates: { a: -0.00031596, e: 0.00005170, i: 0.00004818, L: 145.20780515, wl: -0.04062942, N: -0.01183482 },
		physical: { eqradius: 1151, siderealOrbit: 247.92065 },
		color: 0x00ffff
	}
};


//TODO: remaining data set

/*
=====================================================================
  These data are to be used as described in the related document
  titled "Keplerian Elements for Approximate Positions of the
  Major Planets" by E.M. Standish (JPL/Caltech) available from
  the JPL Solar System Dynamics web site (http://ssd.jpl.nasa.gov/).
=====================================================================


Table 2a.

Keplerian elements and their rates, with respect to the mean ecliptic and equinox of J2000,
valid for the time-interval 3000 BC -- 3000 AD.  NOTE: the computation of M for Jupiter through
Pluto *must* be augmented by the additional terms given in Table 2b (below).

               a              e               I                L            long.peri.      long.node.
           AU, AU/Cy     rad, rad/Cy     deg, deg/Cy      deg, deg/Cy      deg, deg/Cy     deg, deg/Cy
------------------------------------------------------------------------------------------------------
Mercury   0.38709843      0.20563661      7.00559432      252.25166724     77.45771895     48.33961819
          0.00000000      0.00002123     -0.00590158   149472.67486623      0.15940013     -0.12214182
Venus     0.72332102      0.00676399      3.39777545      181.97970850    131.76755713     76.67261496
         -0.00000026     -0.00005107      0.00043494    58517.81560260      0.05679648     -0.27274174
EM Bary   1.00000018      0.01673163     -0.00054346      100.46691572    102.93005885     -5.11260389
         -0.00000003     -0.00003661     -0.01337178    35999.37306329      0.31795260     -0.24123856
Mars      1.52371243      0.09336511      1.85181869       -4.56813164    -23.91744784     49.71320984
          0.00000097      0.00009149     -0.00724757    19140.29934243      0.45223625     -0.26852431
Jupiter   5.20248019      0.04853590      1.29861416       34.33479152     14.27495244    100.29282654
         -0.00002864      0.00018026     -0.00322699     3034.90371757      0.18199196      0.13024619
Saturn    9.54149883      0.05550825      2.49424102       50.07571329     92.86136063    113.63998702
         -0.00003065     -0.00032044      0.00451969     1222.11494724      0.54179478     -0.25015002
Uranus   19.18797948      0.04685740      0.77298127      314.20276625    172.43404441     73.96250215
         -0.00020455     -0.00001550     -0.00180155      428.49512595      0.09266985      0.05739699
Neptune  30.06952752      0.00895439      1.77005520      304.22289287     46.68158724    131.78635853
          0.00006447      0.00000818      0.00022400      218.46515314      0.01009938     -0.00606302
Pluto    39.48686035      0.24885238     17.14104260      238.96535011    224.09702598    110.30167986
          0.00449751      0.00006016      0.00000501      145.18042903     -0.00968827     -0.00809981
------------------------------------------------------------------------------------------------------



Table 2b.

Additional terms which must be added to the computation of M
for Jupiter through Pluto, 3000 BC to 3000 AD, as described
in the related document.

                b             c             s            f 
---------------------------------------------------------------
Jupiter   -0.00012452    0.06064060   -0.35635438   38.35125000
Saturn     0.00025899   -0.13434469    0.87320147   38.35125000
Uranus     0.00058331   -0.97731848    0.17689245    7.67025000
Neptune   -0.00041348    0.68346318   -0.10162547    7.67025000
Pluto     -0.01262724
---------------------------------------------------------------

*/


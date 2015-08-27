import THREE from 'three.js';
// TODO: maybe separate this from the mesh class (but then maybe not)
import OrbitalElements from '../../position/orbital-elements';
import Positions from '../../position/position';

// TODO: a lot of code is identical with celesial-body, can this be shared better

// TODO: remove (we need general solution anyway)
Date.prototype.addDays = function (days) {
	let dat = new Date(this.valueOf());
	dat.setDate(dat.getDate() + days);
	return dat;
}

export default class OrbitLine extends THREE.Line {
		// orbit a sidereal year from J2000
	constructor(planetData) {
		// TODO: use some sort of spline ellipsis thing, instead off many lines
		// then refactor addDays if still nec.

		let precision = 100; // lines per orbit
		let orbitDays = planetData.physical.siderealOrbit * 365.25;
		let unit = orbitDays / precision;

		let geometry = new THREE.Geometry();

		for (let i = 0, j = 0; i < precision; i += 1, j += unit) {
			let elements = OrbitalElements.compute(planetData.orbit, OrbitalElements.J2000.addDays(j));
			let positions = Positions(elements);
			
			let vertex = new THREE.Vector3();
			vertex.copy(positions.eclipticPosition); // TODO: not vector3 hack (maybe make own (safe) copy/convert)
			//vertex.multiplyScalar(SCALE); //todo remove scaling
			geometry.vertices.push(vertex);
		}
		
		// TODO: is there an api way of doing this	
		// close path
		geometry.vertices.push(geometry.vertices[0]);
		
		//TODO: fix all dis
		let material = new THREE.LineBasicMaterial({ color: planetData.color, linewidth: 0.1 });
		//let material = new THREE.LineDashedMaterial({ color: this.color, dashSize: 3, gapSize: 0.5, linewidth: 2 }, THREE.LinePieces);
		// todo make dashed lines work

		// TODO DONT DO IT HERE
		// darken color
		material.color.multiplyScalar(0.7);

		super(geometry, material);
	}

}

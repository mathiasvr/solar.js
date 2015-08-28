import THREE from 'three.js';
// TODO: maybe separate this from the mesh class (but then maybe not)
import * as OrbitalElements from '../../position/orbital-elements';
import Positions from '../../position/position';

// TODO: a lot of code is identical with celestial-body, can this be reused better

// orbit of the sidereal year starting in J2000
export default class OrbitLine extends THREE.Line {

	constructor(planetData) {
		let linePieces = 150;
		
		let orbitDays = planetData.physical.siderealOrbit * 365.25;
		let orbitMilliseconds = orbitDays * 24 * 60 * 60 * 1000;
		let ms = orbitMilliseconds / linePieces;

		let epoch = new Date(OrbitalElements.J2000.valueOf());

		let geometry = new THREE.Geometry();

		//for (let i = 0, j = 0; i < precision; i += 1, j += unit) {
		//let elements = OrbitalElements.compute(planetData.orbit, OrbitalElements.J2000.addDays(j));
		for (let i = 0; i < linePieces; i += 1, epoch.setTime(epoch.getTime() + ms)) {
			let elements = OrbitalElements.compute(planetData.orbit, epoch);
			let positions = Positions(elements);

			let vertex = new THREE.Vector3();
			vertex.copy(positions.eclipticPosition); // TODO: not vector3 hack (maybe make own (safe) copy/convert)
			//vertex.multiplyScalar(SCALE); //todo remove scaling
			geometry.vertices.push(vertex);
		}
		
		// close path
		geometry.vertices.push(geometry.vertices[0]);
		
		//TODO: fix all dis
		let material = new THREE.LineBasicMaterial({ color: planetData.color, linewidth: 0.1 });
		//let material = new THREE.LineDashedMaterial({ color: planetData.color});
		// todo make dashed lines work

		// TODO DONT DO IT HERE
		// darken color
		material.color.multiplyScalar(0.6);

		// todo LinePieces, is a hack to get dashed lines
		super(geometry, material, THREE.LinePieces /*THREE.LineStrip*/);
	}

}

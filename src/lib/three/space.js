import THREE from 'three.js';
// TODO: maybe separate this from the mesh class (but then maybe not)
import OrbitalElements from '../position/orbitalClass';

// TODO: remove (we need general solution anyway)
Date.prototype.addDays = function (days) {
	let dat = new Date(this.valueOf());
	dat.setDate(dat.getDate() + days);
	return dat;
}

const KM_PER_AU = 149597870.7;
const SCALE = 1; // TODO: getting ready to remove scaling, but test if it is precise enough, working in AU cuts some decimals son
const SIZE_SCALE = 1000; // TODO: remove even more hacks
		
export class CelestialBody extends THREE.Mesh {
	constructor(meanElements) {
		let radius = (meanElements.physical.eqradius * SCALE * SIZE_SCALE) / KM_PER_AU; // TODO: less hacky
		
		console.log(meanElements.name + ' radius: ' + radius); // TODO: DON'T DEBUG LOG AND sheet though

		super(new THREE.SphereGeometry(radius, 32, 24), new THREE.MeshPhongMaterial({ color: meanElements.color, wireframe: false }));

		this.planetData = meanElements; // todo consistent naming 
	}
	
	setPositionFromEpoch(epoch) {
		this.epoch = epoch;
		let elements = OrbitalElements.compute(this.planetData, epoch);

		// TODO this is pretty hacky since helposition is NOT Vector3D
		this.position.copy(elements.helposition);
		
		// TODO: dont multiply (make scene adapt if that works)
		this.position.multiplyScalar(SCALE);
		
		// TODO: REMOVE ME SOOOOON
		//if (this.planetData.name == ('Uranus')) console.log(this.planetData.name, 'pos', this.position);
		
	}

	// orbit a sidereal year from J2000
	getOrbitLine() {
		// TODO: use some sort of spline ellipsis thing, instead off many lines
		let precision = 100; // lines per orbit
		let orbitDays = this.planetData.physical.siderealOrbit * 365.25;
		let unit = orbitDays / precision;

		let geometry = new THREE.Geometry();

		for (let i = 0, j = 0; i < precision; i += 1, j += unit) {
			let elements = OrbitalElements.compute(this.planetData, OrbitalElements.J2000.addDays(j));
			let vertex = new THREE.Vector3();
			vertex.x = elements.helposition.x * SCALE;
			vertex.y = elements.helposition.y * SCALE;
			vertex.z = elements.helposition.z * SCALE;
			geometry.vertices.push(vertex);
		}
		
		// TODO: is there an api way of doing this	
		// close path
		geometry.vertices.push(geometry.vertices[0]);
		
		//TODO: fix all dis
		let material = new THREE.LineBasicMaterial({ color: this.material.color, linewidth: 0.1 });
		//let material = new THREE.LineDashedMaterial({ color: this.color, dashSize: 3, gapSize: 0.5, linewidth: 2 }, THREE.LinePieces);
		// todo make dashed lines work

		material.color.multiplyScalar(0.7);
		return new THREE.Line(geometry, material);
	}

}

// randomized star field (particles)
export class Stars extends THREE.PointCloud {
	constructor(amount, size, color) {
		let geometry = new THREE.Geometry();

		for (let i = 0; i < amount; i++) {
			let vertex = new THREE.Vector3();
			vertex.x = THREE.Math.randFloatSpread(size);
			vertex.y = THREE.Math.randFloatSpread(size);
			vertex.z = THREE.Math.randFloatSpread(size);
			geometry.vertices.push(vertex);
		}

		super(geometry, new THREE.PointCloudMaterial({ color: color }));
	}
}

//TODO: lens flare, and maybe actual sun object
// SunLight really
export class Sun extends THREE.PointLight {
	constructor() {
		//  let light = new THREE.PointLight(0xffffff, 1, 0);
		super(0xffffff, 1, 0);
	}
}

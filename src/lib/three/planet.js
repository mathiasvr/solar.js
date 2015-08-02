import 'three.js';

// TODO: remove (we need general solution anyway)
Date.prototype.addDays = function (days) {
	var dat = new Date(this.valueOf());
	dat.setDate(dat.getDate() + days);
	return dat;
}

// TODO: maybe separate this from the mesh class (but then maybe not)
import OrbitalElements from '../position/orbitalClass';

const J2000 = new Date('2000-01-01T12:00:00-0000');//TODO remove
const KM_PER_AU = 149597870.7;
const SCALE = 100; // TODO: fix
export class CelestialBody extends THREE.Mesh {
	constructor(radius, color, meanElements) {

		const size_scale = 500; // TODO: remove even more hacks
		radius = (radius * SCALE * size_scale) / KM_PER_AU; // TODO: less hacky
		console.log(meanElements.name + ' radius: ' + radius);

		super(new THREE.SphereGeometry(radius, 32, 24), new THREE.MeshPhongMaterial({ color: color, wireframe: false }));

		this.planetData = meanElements;
		this.color = color; // todo: can this be accessed from basic mesh or what do we do in the future anyway
	}
	
	// TODO dont care for OE.setEpoch function (think we can remove it/refactor)
	setPositionFromEpoch(epoch) {
		this.epoch = epoch;
		var elements = new OrbitalElements(this.planetData, epoch);

		// TODO: map values more pretty
		// and dont multiply (make scene adapt if that works)
		//return new THREE.Vector3(elements.helposition.x, elements.helposition.y, elements.helposition.z);
		this.position.set(
			elements.helposition.x * SCALE,
			elements.helposition.y * SCALE,
			elements.helposition.z * SCALE
			);
	}

	getOrbitLine() {
		let precision = 50; // lines per sidereal orbit
		let orbitDays = this.planetData.physical.siderealOrbit * 365.25;
		let unit = orbitDays / precision;

		let geometry = new THREE.Geometry();

		for (let i = 0, j = 0; i < precision; i += 1, j += unit) {
			let elements = new OrbitalElements(this.planetData, J2000.addDays(j));
			let vertex = new THREE.Vector3();
			vertex.x = elements.helposition.x * SCALE;
			vertex.y = elements.helposition.y * SCALE;
			vertex.z = elements.helposition.z * SCALE;
			geometry.vertices.push(vertex);
		}
		
		// close path
		// TODO: is there an api way of doing this		
		geometry.vertices.push(geometry.vertices[0]);
	 let material = new THREE.LineBasicMaterial({ color: this.color, linewidth: 0.1 });
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

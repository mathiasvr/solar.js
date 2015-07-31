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
const SCALE = 400; // TODO: fix
export class CelestialBody extends THREE.Mesh {
	constructor(radius, color, meanElements) {

		const size_scale = 3000; // TODO: remove even more hacks
		radius = (radius * SCALE * size_scale) / KM_PER_AU; // TODO: less hacky
		console.log(meanElements.name + ' radius: ' + radius);

		super(new THREE.SphereGeometry(radius, 32, 24), new THREE.MeshBasicMaterial({ color: color, wireframe: true }));

		this.meanElements = meanElements;
		this.color = color; // todo: can this be accessed from basic mesh or what do we do in the future anyway
	}
	
	// TODO dont care for OE.setEpoch function (think we can remove it/refactor)
	setPositionFromEpoch(epoch) {
		this.epoch = epoch;
		var elements = new OrbitalElements(this.meanElements, epoch);

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
		let epoch = J2000; //TODO remove
		
		//static orbit thing
		var geometry = new THREE.Geometry();

		// TODO: better (exact) wrap-around + how to know how many turns is enough
		// maybe need sidereal period, or find a better way to calculate one turn...
		// guess it is not really that easy when working from position data, maybe we can use mean elements
		for (var i = 0; i < 700/10; i += 1, epoch = epoch.addDays(10)) {
			let elements = new OrbitalElements(this.meanElements, epoch);
			let vertex = new THREE.Vector3();
			vertex.x = elements.helposition.x * SCALE;
			vertex.y =elements.helposition.y * SCALE;
			vertex.z = elements.helposition.z * SCALE;
			geometry.vertices.push(vertex);
		}

		return new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: this.color }));
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

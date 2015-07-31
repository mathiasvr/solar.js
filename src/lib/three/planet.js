import 'three.js';

// TODO: maybe separate this from the mesh class (but then maybe not)
import OrbitalElements from '../position/orbitalClass';


const SCALE = 400; // TODO: fix
export class CelestialBody extends THREE.Mesh {
	constructor(size, color, meanElements) {
		// TODO: Investigate params 
		super(new THREE.SphereGeometry(size, 32, 32), new THREE.MeshBasicMaterial({ color: color, wireframe: true }));
		
		this.meanElements = meanElements;
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

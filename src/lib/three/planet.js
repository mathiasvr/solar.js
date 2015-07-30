import 'three.js';

export class Planet extends THREE.Mesh {
	constructor(size, color) {
		// TODO: Investigate params 
		super(new THREE.SphereGeometry(size, 32, 32), new THREE.MeshBasicMaterial({ color: color, wireframe: true }));
	}
}

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

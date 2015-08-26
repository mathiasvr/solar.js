import THREE from 'three.js';

// randomized star field (particles)
export default class Stars extends THREE.PointCloud {
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

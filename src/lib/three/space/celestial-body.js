import THREE from 'three.js';
// TODO: maybe separate this from the mesh class (but then maybe not)
import OrbitalElements from '../../position/orbital-elements';
import Positions from '../../position/position';

const KM_PER_AU = 149597870.7;
const SCALE = 1; // TODO: getting ready to remove scaling, but check if it is precise enough to use AU
		
export default class CelestialBody extends THREE.Mesh {
	constructor(planetData, scale) {
		let radius = (planetData.physical.meanRadius * SCALE /* * sizeScale */) / KM_PER_AU; // TODO: less hacky
		console.log(planetData.name + ' radius: ' + radius); // TODO: remove
		
		super(new THREE.SphereGeometry(radius, 32, 24), new THREE.MeshPhongMaterial({ color: planetData.color, wireframe: false }));

		this.planetData = planetData;
		
		this.setScale(scale);
	}

	setScale(value) {
		this.scale.set(value, value, value);
	}

	get epoch() {
		// TODO: maybe set default value?
		return this._epoch;
	}
	
	// set position from epoch
	set epoch(epoch) {
		this._epoch = epoch;
		let elements = OrbitalElements.compute(this.planetData.orbit, epoch);
		let positions = Positions(elements);

		// TODO this is pretty hacky since helposition is NOT Vector3
		this.position.copy(positions.eclipticPosition);
		
		// TODO: dont multiply (make scene adapt if that works)
		this.position.multiplyScalar(SCALE);
	}
	
	get name() {
		return this.planetData.name;
	}

}

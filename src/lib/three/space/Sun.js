import THREE from 'three.js';

// TODO: move 
let textureFlare0 = THREE.ImageUtils.loadTexture("jspm_packages/github/mrdoob/three.js@master/examples/textures/lensflare/lensflare0.png");

//TODO: maybe add actual sun mesh object
export default class Sun extends THREE.Object3D {
	constructor(size) {
		super();

		// light source of the sun
		// TODO: distance/intensity makes it easier to judge distances when orbit lines is turned off
		// base this value on system radius etc. 
		let light = new THREE.PointLight(0xffffff, 1, 28);
		
		// lens flare effect to represent the sun
		let flareColor = new THREE.Color(0xffffff);
		flareColor.setHSL(0.55, 0.9, 0.95);
		let flare = new THREE.LensFlare(textureFlare0, size, 0, THREE.AdditiveBlending, flareColor);

		// TODO: adjust flare size based on camera distance, how does positionScreen work is it based on camera?
		/*flare.customUpdateCallback = function () {
			var f, fl = this.lensFlares.length;
			var flare;
			//var vecX = - this.positionScreen.x * 2;
			//var vecY = - this.positionScreen.y * 2;
			
			//console.log(this.positionScreen, this.lensFlares[0].size);
			//console.log(1-this.positionScreen.z);

			for (f = 0; f < fl; f++) {
				flare = this.lensFlares[f];
				
				//flare.size += 1;
				
				flare.x = this.positionScreen.x; //+ vecX * flare.distance;
				flare.y = this.positionScreen.y; //+ vecY * flare.distance;

				flare.wantedRotation = flare.x * Math.PI * 0.25;
				flare.rotation += (flare.wantedRotation - flare.rotation) * 0.25;
			}
			
		};*/

		this.add(light, flare);
	}
}


// 
//dat.opos = calculateOrbitalPosition(dat.a, dat.e, dat.E);
	
//dat.eclpos = calculateEcclipticPosition(dat.N, dat.i, dat.w, dat.opos);


// heliocentric coordinates in the orbital plane
function calculateOrbitalPosition(a, e, E) {
	return {
		x: a * (Math.cos(E) - e),
		y: a * Math.sqrt(1 - e * e) * Math.sin(E),
		z: 0
	}
}

// position it the helicentric eccliptic plane
//TODO: this can be done in many ways... choose 
// TEST IN AFTER EDITS
function calculateEcclipticPosition(N, i, w, opos) {
	return {
		x: opos.x * (Math.cos(w) * Math.cos(N) - Math.sin(w) * Math.sin(N) * Math.cos(i))
		+ opos.y * (- Math.sin(w) * Math.cos(N) - Math.cos(w) * Math.sin(N) * Math.cos(i)),
		y: opos.x * (Math.cos(w) * Math.sin(N) + Math.sin(w) * Math.cos(N) * Math.cos(i))
		+ opos.y * (- Math.sin(w) * Math.sin(N) + Math.cos(w) * Math.cos(N) * Math.cos(i)),
		z: opos.x * (Math.sin(w) * Math.sin(i))
		+ opos.y * (Math.cos(w) * Math.sin(i))
	}
	
	/*let cN = Math.cos(N); let sN = Math.sin(N);
	let ci = Math.cos(i); let si = Math.sin(i);
	let cw = Math.cos(w); let sw = Math.sin(w);
	
	return {
		x: opos.x * (cw * cN - sw * sN * ci) + opos.y * (- sw * cN - cw * sN * ci),
		y: opos.x * (cw * sN + sw * cN * ci) + opos.y * (- sw * sN + cw * cN * ci),
		z: opos.x * (sw * si) + opos.y * (cw * si)
	}*/
}


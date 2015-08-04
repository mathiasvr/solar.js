 // TODO text testing: we should probably just use simple 2d labels instead, from css or canvas
 
/*  let textGeometry = new THREE.TextGeometry('Hello World!', {

					// size: size,
					// height: height,
					// curveSegments: curveSegments,

					// font: font,
					// weight: weight,
					// style: style,

					// bevelThickness: bevelThickness,
					// bevelSize: bevelSize,
					// bevelEnabled: bevelEnabled,

					// material: 0,
					// extrudeMaterial: 1

				});

  let textMaterial = new THREE.MeshBasicMaterial();

  let text = new THREE.Mesh(textGeometry, textMaterial);

  scene.add(text);*/
  
 console.log( THREE.FontUtils);
  
 var textShapes = THREE.FontUtils.generateShapes( 'text test', options );
  var text = new THREE.ShapeGeometry( textShapes );
  var textMesh = new THREE.Mesh( text, new THREE.MeshBasicMaterial( { color: 0xff0000 } ) ) ;
  scene.add(textMesh);
  // Example text options : {'font' : 'helvetiker','weight' : 'normal', 'style' : 'normal','size' : 100,'curveSegments' : 300};

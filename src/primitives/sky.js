import config from '../config/config.js';


const sky = (game) => {
  const THREE = game.THREE;
  
  const skySphere = new THREE.SphereGeometry(config.side, 15, 15);
  const material = new THREE.MeshPhongMaterial();
  const sky = new THREE.Mesh(skySphere, material);

  material.map = THREE.ImageUtils.loadTexture("dist/textures/space.jpg");
  material.side = THREE.BackSide;
  material.fog = false;

  sky.position.set(config.side / 2, 0, config.side / 2);
  game.addItem({ mesh: sky });
  game.view.camera.far = 100000;
  sky.rotation.y = 3
  sky.rotation.x = 1.6

  game.render();

  // animation();
  
  // function animation() {
  //   requestAnimationFrame(animation);
  //   sky.rotation.x += 180/Math.PI * 0.000001;
  //   sky.rotation.y += 180/Math.PI * 0.000001;
  //   game.render();
  // };
  
  return sky;
};

export default sky;
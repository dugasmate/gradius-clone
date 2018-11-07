let app = new PIXI.Application();

document.body.appendChild(app.view);

PIXI.loader
  .add("./images/spaceship.png")
  .load(setup);

function setup() {
  let spaceship = new PIXI.Sprite(
    PIXI.loader.resources["./images/spaceship.png"].texture);
  document.body.appendChild(spaceship);
};
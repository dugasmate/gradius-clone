let app = new PIXI.Application();

document.body.appendChild(app.view);

PIXI.loader
  .add("./images/spaceship.bmp")
  .load(setup);

function setup() {
  let spaceship = new PIXI.Sprite(
    PIXI.loader.resources["./images/spaceship.bmp"].texture);
    app.stage.addChild(spaceship);
    spaceship.y = 280;
    spaceship.scale.y = 0.60;
    spaceship.scale.x = 0.75;

};
let app = new PIXI.Application();
let spaceship, state
document.body.appendChild(app.view);

PIXI.loader
  .add("./images/spaceship.bmp")
  .add("./images/splash.bmp")
  .add("./images/rubble.bmp")
  .add("./images/space.bmp")
  .load(setup);

function setup() {
  let background = new PIXI.extras.TilingSprite(
    PIXI.loader.resources["./images/space.bmp"].texture, 800, 600);
  spaceship = new PIXI.Sprite(
    PIXI.loader.resources["./images/spaceship.bmp"].texture);
  let rubble = new PIXI.extras.TilingSprite(
    PIXI.loader.resources["./images/rubble.bmp"].texture, 800, 600);
    app.stage.addChild(background);
    app.stage.addChild(rubble);
    app.stage.addChild(spaceship);
    spaceship.y = 280;
    spaceship.scale.y = 0.60;
    spaceship.scale.x = 0.75;
    spaceship.vy = 0;
    spaceship.vx = 0;
    let left = keyboard("ArrowLeft"),
    up = keyboard("ArrowUp"),
    right = keyboard("ArrowRight"),
    down = keyboard("ArrowDown");

left.press = () => {
  spaceship.vx = -4;
  spaceship.vy = 0;
};

left.release = () => {
  if (!right.isDown && spaceship.vy === 0) {
    spaceship.vx = 0;
  }
};

up.press = () => {
  spaceship.vy = -4;
  spaceship.vx = 0;
};

up.release = () => {
  if (!down.isDown && spaceship.vx === 0) {
    spaceship.vy = 0;
  }
};

right.press = () => {
  spaceship.vx = 4;
  spaceship.vy = 0;
};

right.release = () => {
  if (!left.isDown && spaceship.vy === 0) {
    spaceship.vx = 0;
  }
};

down.press = () => {
  spaceship.vy = 4;
  spaceship.vx = 0;
};

down.release = () => {
  if (!up.isDown && spaceship.vx === 0) {
    spaceship.vy = 0;
  }
};

state = play;
app.ticker.add(delta => gameLoop(delta));

    function gameLoop(delta){

      state(delta);
      background.tilePosition.x -= 0.1;
      rubble.tilePosition.x -= 0.2;
      contain(spaceship);
    };
};

function play(delta) {
  
  spaceship.x += spaceship.vx;
  spaceship.y += spaceship.vy;
};

function keyboard(value) {
  let key = {};
  key.value = value;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  
  key.downHandler = event => {
    if (event.key === key.value) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
      event.preventDefault();
    }
  };

  key.upHandler = event => {
    if (event.key === key.value) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
      event.preventDefault();
    }
  };

  const downListener = key.downHandler.bind(key);
  const upListener = key.upHandler.bind(key);
  
  window.addEventListener(
    "keydown", downListener, false
  );
  window.addEventListener(
    "keyup", upListener, false
  );
  
  key.unsubscribe = () => {
    window.removeEventListener("keydown", downListener);
    window.removeEventListener("keyup", upListener);
  };

  return key;
}

function contain(spaceship) {

  let collision = undefined;

  if (spaceship.x < 0) {
    spaceship.x = 0;
    collision = "left";
  }

  if (spaceship.y < 0) {
    spaceship.y = 0;
    collision = "top";
  }

  if (spaceship.x + spaceship.width > 800) {
    spaceship.x = 800 - spaceship.width;
    collision = "right";
  }

  if (spaceship.y + spaceship.height > 600) {
    spaceship.y = 600 - spaceship.height;
    collision = "bottom";
  }

  return collision;
}
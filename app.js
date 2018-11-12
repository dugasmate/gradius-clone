let app = new PIXI.Application();
let spaceship, state
let direction = 0;
document.body.appendChild(app.view);

PIXI.loader
  .add("./images/spaceship.bmp")
  .add("./images/splash.bmp")
  .add("./images/rubble.bmp")
  .add("./images/space.bmp")
  .add("./images/enemy2.png")
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
    enemies = [];
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
spawn();
setDirection();
app.ticker.add(delta => gameLoop(delta));

    function gameLoop(delta){

      state(delta);
      background.tilePosition.x -= 0.1;
      rubble.tilePosition.x -= 0.2;
      contain(spaceship)
      enemies.forEach(function(element) {
          element.x -= 1;
          element.y -= direction;
          console.log (element.y)
          containEnemy(element);
          if (element.x < -100)
          {
            app.stage.removeChild(element);
          }
      });
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

  if (spaceship.x < 0) {
    spaceship.x = 0;
  }

  if (spaceship.y < 0) {
    spaceship.y = 0;
  }

  if (spaceship.x + spaceship.width > 800) {
    spaceship.x = 800 - spaceship.width;
  }

  if (spaceship.y + spaceship.height > 600) {
    spaceship.y = 600 - spaceship.height;
  }
}

function containEnemy (enemy)
{
  if (enemy.y < 0) {
    enemy.y = 0;
  }

  if (enemy.y + enemy.height > 600) {
    enemy.y = 600 - enemy.height;
  }
}

function spawn (){
  spawnInterval = setInterval(function() {
  let enemy = new PIXI.Sprite(
    PIXI.loader.resources["./images/enemy2.png"].texture);
  enemy.x = 800;
  enemy.y = Math.floor(Math.random() * (600 - enemy.height));
  app.stage.addChild(enemy);
  enemies.push(enemy);
  }, 2000)
}

function setDirection(){
  directionInterval = setInterval(function() {
      direction = (Math.random() * 5) -3 ;
    }, 2000)
}
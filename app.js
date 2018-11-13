let app = new PIXI.Application();
let spaceship, state
let direction = 0;
document.body.appendChild(app.view);

PIXI.loader
  .add("./images/spaceship.bmp")
  .add("./images/gameover.bmp")
  .add("./images/rubble.bmp")
  .add("./images/space.bmp")
  .add("./images/enemy2.png")
  .add("./images/missile.bmp")
  .load(setup);

function setup() {
  
state = play;
  gameOverScene = new PIXI.Container();
  gameScene = new PIXI.Container();
  app.stage.addChild(gameOverScene);
  app.stage.addChild(gameScene);
gameOverScreen = new PIXI.Sprite(
  PIXI.loader.resources["./images/gameover.bmp"].texture);
gameOverScene.addChild(gameOverScreen);
  let background = new PIXI.extras.TilingSprite(
    PIXI.loader.resources["./images/space.bmp"].texture, 800, 600);
  spaceship = new PIXI.Sprite(
    PIXI.loader.resources["./images/spaceship.bmp"].texture);
  let rubble = new PIXI.extras.TilingSprite(
    PIXI.loader.resources["./images/rubble.bmp"].texture, 800, 600);
    gameScene.addChild(background);
    gameScene.addChild(rubble);
    gameScene.addChild(spaceship);
    spaceship.y = 280;
    spaceship.scale.y = 0.60;
    spaceship.scale.x = 0.75;
    spaceship.vy = 0;
    spaceship.vx = 0;
    enemies = [];
    bullets = [];
    let left = keyboard("ArrowLeft"),
    up = keyboard("ArrowUp"),
    right = keyboard("ArrowRight"),
    down = keyboard("ArrowDown");
    a = keyboard("a");

a.press = () => {
    shoot();
    console.log("lőőőő")
};

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
spawn();
setDirection();
app.ticker.add(delta => gameLoop(delta));

    function gameLoop(delta){

      state(delta);
      background.tilePosition.x -= 0.3;
      rubble.tilePosition.x -= 0.7;
    
    };
};

function play() {
  random = randomInt(0, 2);
  spaceship.x += spaceship.vx;
  spaceship.y += spaceship.vy;
  contain(spaceship)
  bullets.forEach(function(bullet){
    bullet.x += 5;
    if (bullet.x > 800)
    {
      gameScene.removeChild(bullet);
      bullets.splice(bullet, 1);
    }
      
     enemies.forEach(function(enemy)
     {
      if (hitTestRectangle(bullet, enemy)) {

        gameScene.removeChild(enemy);
         enemies.splice(enemy, 1);
      
       }
    })
  });
  enemies.forEach(function(element) {
  element.x -= 1;
  element.y += direction * random;
  containEnemy(element);
  if (element.x < -100)
  {
    gameScene.removeChild(element);
  }
    
  if (hitTestRectangle(spaceship, element)) {

    gameScene.removeChild(spaceship);
  state = gameOver;

  }
  });
  };
function gameOver() {
  gameScene.visible = false;
  gameOverScene.visible = true;
}
  
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
  enemy.y = randomInt(0, 600 - enemy.height);
  gameScene.addChild(enemy);
  enemies.push(enemy);
  }, 2000)
}

function shoot (){
    if (bullets.length < 5)
    {
      let bullet = new PIXI.Sprite(
        PIXI.loader.resources["./images/missile.bmp"].texture);
        gameScene.addChild(bullet);
        bullet.scale.x = 0.08;
        bullet.scale.y = 0.1;
        bullet.x = spaceship.x + 90;
        bullet.y = spaceship.y + 25;
    bullets.push(bullet);
    }
};

function setDirection(){
  directionInterval = setInterval(function() {
      direction = randomInt(-1, 1);
    }, 2000)
}

function hitTestRectangle(r1, r2) {

  let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

  hit = false;

  r1.centerX = r1.x + r1.width / 2;
  r1.centerY = r1.y + r1.height / 2;
  r2.centerX = r2.x + r2.width / 2;
  r2.centerY = r2.y + r2.height / 2;

  r1.halfWidth = r1.width / 2;
  r1.halfHeight = r1.height / 2;
  r2.halfWidth = r2.width / 2;
  r2.halfHeight = r2.height / 2;

  vx = r1.centerX - r2.centerX;
  vy = r1.centerY - r2.centerY;

  combinedHalfWidths = r1.halfWidth + r2.halfWidth;
  combinedHalfHeights = r1.halfHeight + r2.halfHeight;

  if (Math.abs(vx) < combinedHalfWidths) {

    if (Math.abs(vy) < combinedHalfHeights) {

      hit = true;
    } else {

      hit = false;
    }
  } else {

    hit = false;
  }

  return hit;
};

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
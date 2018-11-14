let app = new PIXI.Application();
let spaceship, state, direction, gameSpeed
document.body.appendChild(app.view);
PIXI.loader
  .add("./images/splash.bmp")
  .add("./images/spaceship.bmp")
  .add("./images/gameover.bmp")
  .add("./images/rubble.bmp")
  .add("./images/space.bmp")
  .add("./images/enemy2.png")
  .add("./images/missile.bmp")
  .add("./images/button.png")
  .add("./images/astralogo.png")
  .add("./images/menubackground.bmp")
  .load(appStart);

function appStart() {
  gameOverScene = new PIXI.Container();
  gameScene = new PIXI.Container();
  menuScene = new PIXI.Container();
  app.stage.addChild(gameScene);
  app.stage.addChild(menuScene);
  app.stage.addChild(gameOverScene);
  menuBG = new PIXI.Sprite(
    PIXI.loader.resources["./images/menubackground.bmp"].texture, 800, 600);
  menuScene.addChild(menuBG);
  button = new PIXI.Sprite(
    PIXI.loader.resources["./images/button.png"].texture);
    menuScene.addChild(button);
    button2 = new PIXI.Sprite(
      PIXI.loader.resources["./images/button.png"].texture);
      menuScene.addChild(button2);
      button2.x = 400;
  splash = new PIXI.Sprite(
    PIXI.loader.resources["./images/splash.bmp"].texture, 800, 600);
  menuScene.addChild(splash);
gameOverScreen = new PIXI.Sprite(
  PIXI.loader.resources["./images/gameover.bmp"].texture);
  gameBG = new PIXI.extras.TilingSprite(
    PIXI.loader.resources["./images/space.bmp"].texture, 800, 600);
  spaceship = new PIXI.Sprite(
    PIXI.loader.resources["./images/spaceship.bmp"].texture);
  rubble = new PIXI.extras.TilingSprite(
    PIXI.loader.resources["./images/rubble.bmp"].texture, 800, 600);
    gameScene.addChild(gameBG);
    gameScene.addChild(rubble);
gameOverScene.addChild(gameOverScreen);
button.on('mousedown', startButton);
button2.on('mousedown', startButton2);
gameOverScene.visible = false;
enemies = [];
bullets = [];
    let left = keyboard("ArrowLeft"),
    up = keyboard("ArrowUp"),
    right = keyboard("ArrowRight"),
    down = keyboard("ArrowDown");
    a = keyboard("a");

left.press = () => {
  spaceship.vx = -4;
  spaceship.vy = 0;
};


a.press = () => {
  shoot();
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
state = menu;
app.ticker.add(delta => gameLoop(delta));

    function gameLoop(delta){
      state(delta);
    };
};
function menu() {
  if (splash.alpha >= 0){
    fade(splash, 2000, .01)
  }
    if (splash.alpha < 0 && state == menu){
  button.interactive = true;
  button2.interactive = true;
  }
};


function play(delta) {
  gameBG.tilePosition.x -= 0.3 * gameSpeed;
  rubble.tilePosition.x -= 0.7 * gameSpeed;
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

        enemy.visible = false;
      
       }
    })
  });
  enemies.forEach(function(element) {
  element.x -= 1 * gameSpeed;
  element.y += direction * random;
  containEnemy(element);
  if (element.x < -100)
  {
    gameScene.removeChild(element);
  }
    
  if (hitTestRectangle(spaceship, element)) {
    if (element.visible == true)
    {
    gameScene.removeChild(spaceship);
    state = gameOver;
    }
  }
  });
  };
function gameOver() {
  gameOverScene.visible = true;
  menuScene.visible = true;
  clearInterval(spawnInterval);
  clearInterval(directionInterval);
  enemies.forEach(function(enemy){
  gameScene.removeChild(enemy);
  });
  bullets.forEach(function(bullet){
    gameScene.removeChild(bullet);
    });
  enemies = [];
  if (gameOverScreen.alpha > 0){
    fade(gameOverScreen, 1500, .02)
  }
  if (gameOverScreen.alpha < -1.7)
  {
  state = menu;
  }
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
  let enemy = new PIXI.Sprite(
  PIXI.loader.resources["./images/enemy2.png"].texture);
  enemy.x = 800;
  enemy.y = randomInt(0, 600 - enemy.height);
  gameScene.addChild(enemy);
  enemies.push(enemy);
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
      direction = randomInt(-1, 1) * (gameSpeed / 2);
      console.log(direction);
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
function start(){
  menuScene.visible = false;
  gameOverScene.visible = false;
  gameOverScreen.alpha = 1;
  button.interactive = false;
  button2.interactive = false;
  spaceship.x = 0;
  spaceship.y = 280;
  spaceship.scale.y = 0.60;
  spaceship.scale.x = 0.75;
  spaceship.vy = 0;
  spaceship.vx = 0;
  directionInterval = setInterval(setDirection, 2000 / gameSpeed);
  spawnInterval = setInterval(spawn, 2000 / gameSpeed);
  gameScene.addChild(spaceship);
  gameScene.visible = true;
  state = play;
}

function startButton (eventData) {
  gameSpeed = 1;
  start();
}

function startButton2 (eventData) {
  gameSpeed = 10;
  start();
}

function fade (scene, timeout, speed) {
  setTimeout(() => fader(scene, speed), timeout);

function fader (scene, speed) {
  scene.alpha -= speed;
}
}
let app = new PIXI.Application();
let spaceship, state, gameSpeed, direction = 0,
bulletCount = 0, 
tick = 0,
random = 0;
document.body.appendChild(app.view);
PIXI.loader
  .add("./images/splash.bmp")
  .add("./images/spaceship.png")
  .add("./images/gameover.bmp")
  .add("./images/rubble.png")
  .add("./images/space.bmp")
  .add("./images/enemy.png")
  .add("./images/missile.png")
  .add("./images/button.bmp")
  .add("./images/logo.bmp")
  .add("./images/menubackground.bmp")
  .add("./images/bgship.png")
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
  bgship = new PIXI.Sprite(
    PIXI.loader.resources["./images/bgship.png"].texture);
  menuScene.addChild(bgship);
  buttons = [];
  logo = new PIXI.Sprite(
    PIXI.loader.resources["./images/logo.bmp"].texture);
    menuScene.addChild(logo);
    logo.scale.x = 1.4
    logo.x = 325;
    logo.y = 70;
for (var i = 0; i < 4; i++) { 
  button = new PIXI.Sprite(
    PIXI.loader.resources["./images/button.bmp"].texture);
    menuScene.addChild(button);
    button.y = 210 + i * 100;
    button.x = 120;
    buttons.push(button);
}
  easyText = new PIXI.Text("Easy");
  menuScene.addChild(easyText);
  easyText.y = 235;
  easyText.x = 190;
  mediumText = new PIXI.Text("Medium");
  menuScene.addChild(mediumText);
  mediumText.y = 335;
  mediumText.x = 175;
  hardText = new PIXI.Text("Hard");
  menuScene.addChild(hardText);
  hardText.y = 435;
  hardText.x = 192;
  exitText = new PIXI.Text("Exit");
  menuScene.addChild(exitText);
  exitText.y = 535;
  exitText.x = 195;
  splash = new PIXI.Sprite(
    PIXI.loader.resources["./images/splash.bmp"].texture, 800, 600);
  menuScene.addChild(splash);
gameOverScreen = new PIXI.Sprite(
  PIXI.loader.resources["./images/gameover.bmp"].texture);
  gameBG = new PIXI.extras.TilingSprite(
    PIXI.loader.resources["./images/space.bmp"].texture, 800, 600);
  spaceship = new PIXI.Sprite(
    PIXI.loader.resources["./images/spaceship.png"].texture);
  rubble = new PIXI.extras.TilingSprite(
    PIXI.loader.resources["./images/rubble.png"].texture, 800, 600);
    gameScene.addChild(gameBG);
    gameScene.addChild(rubble);
gameOverScene.addChild(gameOverScreen);
buttons[0].on('mousedown', slow);
buttons[1].on('mousedown', medium);
buttons[2].on('mousedown', fast);
buttons[3].on('mousedown', exit);
gameOverScene.visible = false;
enemies = [];
bullets = [];
bgship.vx = 0.5;
bgship.vy = 0.5;
bgship.x = 750;
bgship.y = - 250;
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
  bgship.x -= bgship.vx;
  bgship.y += bgship.vy;
  if (splash.alpha >= 0){
    fade(splash, 2000, .01)
  }
    if (splash.alpha < 0 && state == menu){
  buttons[0].interactive = true;
  buttons[1].interactive = true;
  buttons[2].interactive = true;
  buttons[3].interactive = true;
  }
  if(bgship.y > 650)
  {
    bgship.x = 750;
    bgship.y = - 250;
  }
};


function play(delta) {
  gameBG.tilePosition.x -= 0.3 * gameSpeed;
  rubble.tilePosition.x -= 0.7 * gameSpeed;
  spaceship.x += spaceship.vx;
  spaceship.y += spaceship.vy;
  contain(spaceship)
  bullets.forEach(function(bullet){
  bullet.x += 5;
    if (bullet.x > 800)
    {
      if (bullet.visible)
      {
      bullet.visible = false;
      gameScene.removeChild(bullet);
      bulletCount -= 1;
    }
      
    }
      
     enemies.forEach(function(enemy)
     {
      if (hitTestRectangle(bullet, enemy) && bullet.visible && enemy.visible) {

        enemy.visible = false;
        bullet.visible = false;
        bulletCount -= 1;
       }
    })
  });
  enemies.forEach(function(element) {
  element.x -= 1 * gameSpeed;
  element.y += element.vy * gameSpeed;
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
  clearInterval(movementInterval);
  enemies.forEach(function(enemy){
  gameScene.removeChild(enemy);
  });
  bullets.forEach(function(bullet){
    gameScene.removeChild(bullet);
    });
  enemies = [];
  bullets = [];
  bulletCount = 0;
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
  PIXI.loader.resources["./images/enemy.png"].texture);
  enemy.x = 800;
  enemy.y = randomInt(0, 600 - enemy.height);
  enemy.vy = randomInt(-1, 1);
  gameScene.addChild(enemy);
  enemies.push(enemy);
}

function shoot (){
    if (bulletCount < 5)
    {
      bulletCount +=1;
      let bullet = new PIXI.Sprite(
        PIXI.loader.resources["./images/missile.png"].texture);
        gameScene.addChild(bullet);
        bullet.scale.x = 0.08;
        bullet.scale.y = 0.1;
        bullet.x = spaceship.x + 90;
        bullet.y = spaceship.y + 25;
        bullets.push(bullet);
    }
};

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
  buttons[0].interactive = false;
  buttons[1].interactive = false;
  buttons[2].interactive = false;
  buttons[3].interactive = false;
  spaceship.x = 0;
  spaceship.y = 280;
  spaceship.scale.y = 0.60;
  spaceship.scale.x = 0.65;
  spaceship.vy = 0;
  spaceship.vx = 0;
  bgship.x = 750;
  bgship.y = - 250;
  spawnInterval = setInterval(spawn, 2000 / gameSpeed);
  movementInterval = setInterval(movement, 2000);
  gameScene.addChild(spaceship);
  gameScene.visible = true;
  state = play;
}

function slow (eventData) {
  gameSpeed = 1;
  start();
}

function medium (eventData) {
  gameSpeed = 3;
  start();
}

function fast (eventData) {
  gameSpeed = 5;
  start();
}

function exit (eventData) {
  window.location.href = "https://github.com/dugasmate/gradius-clone"
}

function fade (scene, timeout, speed) {
  setTimeout(() => fader(scene, speed), timeout);

function fader (scene, speed) {
  scene.alpha -= speed;
}
}
function movement ()
{
  enemies.forEach(function(enemy)
  {
    if (enemy.y == 0){
      enemy.vy = 2;
    }
    else if (enemy.y == 600 - enemy.height)
    {
      enemy.vy = -2;
    }
    else{
    enemy.vy = randomInt(-1, 1)
    }
  })

}
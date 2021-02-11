var mario, wall, castleWall, logo, startButton, gameOver, replayButton;
var marioStanding, marioJumping;
var wallImage, logoImage, startImage, castleWallImage, doorImage, brickImage, spikeImage, gameOverImage, replayImage, ladderImage, pipeImage, bulletImage, coinImage, goombaImage, koopaImage, ghostImage, kingGhostImage;
var jumpSound, endSound;
var doorGroup, brickGroup, obstacleGroup, ladderGroup, coinGroup;
var gameState = "Start";
var r;
var score = 0, hiScore = 0;

function preload() {
  marioStanding = loadImage("mario-standing.png");
  marioJumping = loadImage("mario-jumping.png");
  wallImage = loadImage("wall-sprite.png");
  logoImage = loadImage("game-logo.png");
  startImage = loadImage("start.png");
  castleWallImage = loadImage("castle-wall.png");
  doorImage = loadImage("window.png");
  brickImage = loadImage("window-brick.png");
  spikeImage = loadImage("spike.png");
  gameOverImage = loadImage("gameover.png");
  replayImage = loadImage("replay.png");
  ladderImage = loadImage("ladder.png");
  pipeImage = loadImage("pipe.png");
  bulletImage = loadImage("bullet.png");
  coinImage = loadImage("coin.png");
  goombaImage = loadImage("goomba.png");
  koopaImage = loadImage("koopa.png");
  ghostImage = loadImage("ghost.png");
  kingGhostImage = loadImage("king-ghost.png");

  jumpSound = loadSound("mario-jump.mp3");
  endSound = loadSound("mario-death.mp3");
  coinSound = loadSound("coin-sound.mp3");
}

function setup() {
  createCanvas(600, 600);

  mario = createSprite(300, 550, 50, 50);
  mario.addImage(marioStanding);
  mario.scale = 0.07;
  mario.setCollider("rectangle", 0, 0, 1000, 1000);

  wall = createSprite(300, 200, 600, 600);
  wall.addImage(wallImage);
  wall.depth = mario.depth - 1;
  wall.scale = 0.5;

  castleWall = createSprite(300, 300, 600, 600);
  castleWall.addImage(castleWallImage);
  castleWall.depth = mario.depth - 1;
  castleWall.scale = 1.85;

  logo = createSprite(300, 180, 100, 100);
  logo.addImage(logoImage);
  logo.scale = 0.5;

  startButton = createSprite(300, 340, 50, 50);
  startButton.addImage(startImage);
  startButton.scale = 0.5;

  gameOver = createSprite(300, 200, 100, 100);
  gameOver.addImage(gameOverImage);
  gameOver.scale = 0.6;
  gameOver.visible = false;

  replayButton = createSprite(300, 500, 100, 100);
  replayButton.addImage(replayImage);
  replayButton.scale = 0.4;
  replayButton.visible = false;

  doorGroup = createGroup();
  brickGroup = createGroup();
  obstacleGroup = createGroup();
  ladderGroup = createGroup();
  coinGroup = createGroup();
}

function draw() {
  background("white");
  if (gameState === "Start") {
    wall.visible = false;
    startButton.visible = true;
    logo.visible = true;

    if (mousePressedOver(startButton)) {
      gameState = "Play";
      startButton.visible = false;
      mario.y = 300;

      var platform = createSprite(mario.x, mario.y + 50, 50, 50);
      platform.addImage(brickImage);
      platform.scale = 0.6;
      platform.lifetime = 100;
      brickGroup.add(platform);
    }

  } else if (gameState === "Play") {
    logo.visible = false;
    castleWall.visible = false;

    mario.visible = true;
    wall.visible = true;
    doorGroup.setVisibleEach(true);
    brickGroup.setVisibleEach(true);
    obstacleGroup.setVisibleEach(true);

    //allow mario to jump using space bar
    if (keyWentDown("space")) {
      mario.addImage(marioJumping);
      mario.velocityY = -(15 + score / 30);
      jumpSound.play();
      mario.scale = 0.21;
      mario.setCollider("rectangle", 0, 0, 300, 300);
    }
    if (keyWentUp("space")) {
      mario.addImage(marioStanding);
      mario.scale = 0.07;
      mario.setCollider("rectangle", 0, 0, 1000, 1000);
    }

    //allow mario to move left and right using arrow keys
    if (keyDown("left")) {
      mario.x = mario.x - 5;
      mario.mirrorX(-1);
    }
    if (keyDown("right")) {
      mario.x = mario.x + 5;
      mario.mirrorX(1);
    }

    //add gravity
    mario.velocityY = mario.velocityY + 0.5;

    //make a scrolling wall
    wall.velocityY = 3 + (score / 30);

    if (wall.y > 490) {
      wall.y = 300;
    }

    if (mario.isTouching(brickGroup)) {
      mario.velocityY = 0;
    }
    if (mario.isTouching(obstacleGroup) || mario.y > 650 || mario.y < -50 || mario.x < -50 || mario.x > 650) {
      gameState = "End";
      endSound.play();
    }
    if (mario.isTouching(ladderGroup)) {
      mario.velocityY = -1;
    }
    if (mario.isTouching(coinGroup)) {
      score = score + 1;
      coinSound.play();
      coinSound.volume = 0.5;
      coinGroup.destroyEach();
    }

    //create a random variable which will be used for random spawning
    r = Math.round(random(1, 2));

    //call the functions
    spawnDoors();
    spawnObstacles();

  } else if (gameState === "End") {
    mario.visible = false;
    mario.addImage(marioStanding);
    mario.scale = 0.07;
    mario.setCollider("rectangle", 0, 0, 1000, 1000);

    //show the final score
    textSize(36);
    fill("black");
    text("Coins Collected: " + score, 160, 360);

    if (score >= hiScore) {
      hiScore = score;
    }
    text("High Score: " + hiScore, 160, 400);

    wall.visible = false;
    doorGroup.destroyEach();
    brickGroup.destroyEach();
    obstacleGroup.destroyEach();
    ladderGroup.destroyEach();
    coinGroup.destroyEach();

    gameOver.visible = true;
    replayButton.visible = true;

    if (mousePressedOver(replayButton)) {
      restart();
      replayButton.visible = false;
      gameOver.visible = false;
    }
  }

  drawSprites();
  
  if(gameState === "Start"){
    textSize(23);
    fill("white");
    text("Press spacebar to jump, left and right arrow keys to move", 5, 420);
    text("Collect coins and avoid obstacles", 120, 455);
    text("Click on Start to begin", 170, 490);
}
  if (score > 0) {
    textSize(24);
    fill("white");
    text("Coins Collected: " + score, 20, 570);
  }
}

function spawnDoors() {

  if (frameCount % 100 === 0) {
    var door = createSprite(Math.round(random(80, 520)), -50, 50, 50);
    door.addImage(doorImage);
    door.velocityY = 3 + (score / 30);
    door.scale = 0.5;
    door.depth = mario.depth - 1;
    door.lifetime = 650 / door.velocityY;
    doorGroup.add(door);

    var brick = createSprite(door.x, door.y + 80, 50, 50);
    brick.addImage(brickImage);
    brick.velocityY = door.velocityY;
    brick.scale = 0.6;
    brick.depth = mario.depth - 1;
    brick.lifetime = 600 / brick.velocityY;
    brickGroup.add(brick);

    var coin = createSprite(brick.x, door.y + 20, 10, 10);
    coin.addImage(coinImage);
    coin.velocityY = door.velocityY;
    coin.scale = 0.075;
    coin.lifetime = 120;
    coinGroup.add(coin);

    if (r === 1) {
      var spike = createSprite(door.x, brick.y + 30, 50, 50);
      spike.addImage(spikeImage);
      spike.velocityY = door.velocityY;
      spike.scale = 0.12;
      spike.lifetime = 600 / spike.velocityY;
      obstacleGroup.add(spike);
    } else if (r === 2) {
      var ladder = createSprite(door.x, brick.y + 50, 50, 50);
      ladder.addImage(ladderImage);
      ladder.velocityY = door.velocityY;
      ladder.scale = 0.35;
      ladder.lifetime = 600 / ladder.velocityY;
      ladderGroup.add(ladder);
    }
  }
}

function spawnObstacles() {
  if (frameCount % 420 === 0) {
    var pipe = createSprite(0, -150, 300, 300);
    pipe.addImage(pipeImage);
    pipe.velocityY = 3 + (score / 30);
    pipe.scale = 0.4;
    pipe.lifetime = 750 / pipe.velocityY;
    pipe.setCollider("rectangle", 0, 0, 180, 420);
    obstacleGroup.add(pipe);

    var bullet = createSprite(pipe.x, pipe.y, 300, 300);
    bullet.addImage(bulletImage);
    bullet.scale = 0.1;
    bullet.depth = pipe.depth - 1;
    bullet.velocityY = pipe.velocityY;
    bullet.lifetime = 600 / bullet.velocityY;
    obstacleGroup.add(bullet);

    if (r === 1) {
      pipe.x = Math.round(random(20, 50));
      pipe.rotation = 90;
      bullet.x = 50;
      bullet.mirrorX(1);
      bullet.velocityX = 5 + (score / 30);
    } else if (r === 2) {
      pipe.x = Math.round(random(550, 580));
      pipe.rotation = -90;
      bullet.x = 550;
      bullet.mirrorX(-1);
      bullet.velocityX = -(5 + score / 30);
    }
  }
  if (frameCount % 200 === 0 && score >= 15) {
    var enemy = createSprite(Math.round(random(80, 520)), 0, 10, 10);
    enemy.velocityY = 6 + enemy.velocityY + 0.5;
    obstacleGroup.add(enemy);

    if (r === 1) {
      enemy.addImage(goombaImage);
      enemy.scale = 0.4;
      enemy.setCollider("rectangle", -20, -5, 160, 160);
    } else if (r === 2) {
      enemy.addImage(koopaImage);
      enemy.scale = 0.2;
      enemy.setCollider("rectangle",0,0,300,520);
    }

    if (enemy.isTouching(brickGroup)) {
      enemy.velocityY = 3 + (score / 30);
      enemy.velocityX = 0;
    } else {
      enemy.velocityY = 6 + (score/30);
      enemy.velocityX = 0;
    }
  }
  if(frameCount % 360 === 0 && score >= 32){
    var ghost = createSprite(0,0,10,10);
    ghost.addImage(ghostImage);
    ghost.velocityY = 3 + (score/30);
    ghost.scale = 0.18;
    ghost.liftime = 150;
    obstacleGroup.add(ghost);
    
    if(r === 1){
      ghost.x = 0;
      ghost.velocityX = 4 + (score/30);
      ghost.mirrorX(-1);
    } else if (r === 2){
      ghost.x = 600;
      ghost.velocityX = -(4 + score/30);
      ghost.mirrorX(1);
    }
}
}

function restart() {
  gameState = "Start";
  score = 0;

  mario.x = 300;
  mario.y = 300;
  mario.velocityY = 0;

  wall.visible = false;
  startButton.visible = true;
  castleWall.visible = true;
  logo.visible = true;
}
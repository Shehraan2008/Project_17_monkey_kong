var score;
// game states 
var PLAY = 1;
var END = 0;
var gameState = PLAY;
// monkey
var monkey, monkey_running;
// banana and obs 
var banana, bananaImage, obstacle, obstacleImage;
// groups 
var FoodGroup, obstacleGroup;
// classsfier 
let classifier;
let video;

// loading images and animations 
function preload() {
  monkey_running = loadAnimation("sprite_0.png", "sprite_1.png", "sprite_2.png", "sprite_3.png", "sprite_4.png", "sprite_5.png", "sprite_6.png", "sprite_7.png", "sprite_8.png")
  bananaImage = loadImage("banana.png");
  obstacleImage = loadImage("obstacle.png");
}

function setup() {
  // canvas 
  createCanvas(600, 400);

  // monkey
  monkey = createSprite(50, 160, 20, 50);
  monkey.addAnimation("running", monkey_running);
  monkey.scale = 0.07;

  // ground
  ground = createSprite(width / 2, height - 20, width, 50);
  ground.shapeColor = "green";

  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  FoodGroup = createGroup();

  // monkey.setCollider("rectangle", 0, 0, monkey.width, monkey.height);
  // monkey.debug = true
  score = 0;
}

function draw() {
  // sky
  background("black");
  
  // makingt he ground move 
  ground.velocityX = -5;
  if(ground.x < 400){
    ground.x = width/2;   
  }

  //displaying score
  text("Score: " + score, 500, 50);

  // Game State fro playing 
  if (gameState === PLAY) {
    //scoring
    score = score + Math.round(getFrameRate() / 60);

    // monkey stying on the gorund 
    monkey.collide(ground);
    //add gravity
    monkey.velocityY = monkey.velocityY + 0.8

    //spawn the food
    spawnFood();

    //spawn obstacles on the ground
    spawnObstacles();

    // losing the game 
    if (obstaclesGroup.isTouching(monkey)) {
      gameState = END;
    }
  } else if (gameState === END) { // end state 
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    FoodGroup.setLifetimeEach(-1);

    // stopping them 
    obstaclesGroup.setVelocityXEach(0);
    FoodGroup.setVelocityXEach(0);

    monkey.velcityY = 0;
  }

  // spawing the obstacles at every 100 fames 
  if (frameCount % 100 === 0) {
    spawnObstacles();
  }
  //jump when the space key is pressed
  if (keyDown("space") && monkey.y > 200) {
    monkey.velocityY = -12;
  }
  // drawing the sprites 
  drawSprites();
}


function spawnObstacles() {
  if (frameCount % 60 === 0) {
    obstacle = createSprite(600, 165, 10, 40);
    obstacle.y = height - 70;
    obstacle.velocityX = -(6 + score / 100);
    obstacle.addImage(obstacleImage);


    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.2;
    obstacle.lifetime = 300;

    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function spawnFood() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    banana = createSprite(600, 120, 40, 10);
    banana.y = Math.round(random(80, 120));
    banana.addImage(bananaImage);
    banana.scale = 0.05;
    banana.velocityX = -3;

    //assign lifetime to the variable
    banana.lifetime = 200;

    //adjust the depth
    banana.depth = monkey.depth;
    monkey.depth = monkey.depth + 1;

    //add each cloud to the group
    FoodGroup.add(banana);
  }
}

function reset() {
  gameState = PLAY;
  FoodGroup.destroyEach();
  obstaclesGroup.destroyEach();
  score = 0;
}
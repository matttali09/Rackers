import React, { Component } from "react";
import API from "../utils/API";
// import Entites from "./Entities.js";
// import Inventory from "./Inventory.js";


export default class Game1 extends Component {
  state = {
    username: "Sephiroth91",
    canvasSize: { canvasWidth: 640, canvasHeight: 360 },
    enemyList: {},
    upgradeList: {},
    bulletList: {},
    player: this.props.player,
    // hp of player to not setstate of player state object prop
    hp: 20,
    frameCount: 0,
    score: 0,
    timeWhenGameStarted: null,
    toRemove: false,
  };

  // only start the timer when the component is mounted, clear on dismount and update during setinterval 
  // function to get the time from game start
  startTimer = () => {
    this.setState({
      timeWhenGameStarted: Date.now()
    })
  }

  // function to construct enemy object and update enemy list
  enemy = (id, x, y, spdX, spdY, width, height) => {
    let enemy = {
      x: x,
      spdX: spdX,
      y: y,
      spdY: spdY,
      name: 'E',
      id: id,
      width: height,
      height: width,
      color: "red"
    };
    this.setState(prevState => ({
      enemyList: {
        ...prevState.enemyList,
        [id]: enemy,
      }
    }));
  };

  // called to create an enemy with random property values
  randomlyGenerateEnemy = () => {
    //Math.random() returns a number between 0 and 1
    let x = Math.random() * 640;
    let y = Math.random() * 360;
    let height = 10 + Math.random() * 30;     //between 10 and 40
    let width = 10 + Math.random() * 30;
    let id = Math.random();
    let spdX = 5 + Math.random() * 5;
    let spdY = 5 + Math.random() * 5;
    this.enemy(id, x, y, spdX, spdY, width, height);
  }

  // function to construct upgrade object and update upgrade list
  upgrade = (id, x, y, spdX, spdY, width, height, category) => {
    let upgrades = {
      x: x,
      spdX: spdX,
      y: y,
      spdY: spdY,
      name: 'E',
      id: id,
      width: height,
      height: width,
      color: "orange",
      category: category
    };
    this.setState(prevState => ({
      upgradeList: {
        ...prevState.upgradeList,
        [id]: upgrades,
      }
    }));
  };
  // function to construct bullet object and update bullet list
  bullet = (id, x, y, spdX, spdY, width, height) => {
    let bullets = {
      x: x,
      spdX: spdX,
      y: y,
      spdY: spdY,
      name: 'E',
      id: id,
      width: height,
      height: width,
      color: "black",

      timer: 0
    };
    this.setState(prevState => ({
      bulletList: {
        ...prevState.bulletList,
        [id]: bullets,
      }
    }));
  };

  // function to randomly generate upgrade
  randomlyGenerateUpgrade = () => {
    //Math.random() returns a number between 0 and 1
    let x = Math.random() * 640;
    let y = Math.random() * 360;
    let height = 10;     //between 10 and 40
    let width = 10;
    let id = Math.random();
    let spdX = 0;
    let spdY = 0;
    let category = ""
    if (Math.random() < 0.5) {
      category = "low"
    } else {
      category = "high"
    }

    this.upgrade(id, x, y, spdX, spdY, width, height, category);
  }
  // function to randomly generate bullet from player position
  randomlyGenerateBullet = (player) => {
    //Math.random() returns a number between 0 and 1
    let x = player.x;
    let y = player.y;
    let height = 10;     //between 10 and 40
    let width = 10;
    let id = Math.random();
    let angle = Math.random() * 360;
    let spdX = Math.cos(angle / 180 * Math.PI) * 5;
    let spdY = Math.sin(angle / 180 * Math.PI) * 5;
    this.bullet(id, x, y, spdX, spdY, width, height);
  }

  getDistanceBetweenEntity = (entity1, entity2) => {  //return distance (number)
    // clean for state catch up second entity or something is enemy who may not always be there at game start.
    if (entity2) {
      let vx = entity1.x - entity2.x;
      let vy = entity1.y - entity2.y;
      return Math.sqrt(vx * vx + vy * vy);
    }
    else {
      return null;
    }
  }
  testCollisionEntity = (entity1, entity2) => {       //return if colliding (true/false)
    if (entity2) {
      let rect1 = {
        x: entity1.x - (entity1.width / 2),
        y: entity1.y - (entity1.height / 2),
        width: entity1.width,
        height: entity1.height,
      }
      let rect2 = {
        x: entity2.x - (entity2.width / 2),
        y: entity2.y - (entity2.height / 2),
        width: entity2.width,
        height: entity2.height,
      }
      return this.testCollisionRectRect(rect1, rect2)
    }
    else {
      return null;
    }
  }
  testCollisionRectRect = (rect1, rect2) => {
    if (rect2) {
      return rect1.x <= rect2.x + rect2.width
        && rect2.x <= rect1.x + rect1.width
        && rect1.y <= rect2.y + rect2.height
        && rect2.y <= rect1.y + rect1.height;
    }
    else {
      return null;
    }
  }

  // function that starts the game up when the component is loaded
  componentDidMount() {
    this.startTimer();
    this.getMousePosition(this.props.player);
    this.randomlyGenerateEnemy();
    this.randomlyGenerateEnemy();
    this.randomlyGenerateEnemy();
    const { canvasWidth, canvasHeight } = this.state.canvasSize;
    this.canvasRender.width = canvasWidth;
    this.canvasRender.height = canvasHeight;
    this.drawImg(this.canvasRender);
  }

  // get the canvas refrence passed in and get the context to store and send to other functions
  drawImg(canvasID) {
    const ctx = canvasID.getContext("2d");
    ctx.font = "30px Arial";
    this.interval = setInterval(() => {
      this.update(ctx)
    }, 40)
  }
  getMousePosition = (player) => {
    document.onmousemove = function (mouse) {
      let mouseX = mouse.clientX - 8;
      let mouseY = mouse.clientY - 8;

      if (mouseX < player.width / 2 + 260)
        mouseX = player.width / 2 + 260;
      if (mouseX > 640 - player.width / 2 + 260)
        mouseX = 640 - player.width / 2 + 260;
      if (mouseY < player.height / 2 + 120)
        mouseY = player.height / 2 + 120;
      if (mouseY > 360 - player.height / 2 + 120)
        mouseY = 360 - player.height / 2 + 120;

      player.x = mouseX - 260;
      player.y = mouseY - 120;
    }
  }

  updateEntity = (something, ctx) => {
    if (something) {
      this.updateEntityPosition(something)
      this.drawEntity(something, ctx)
    }
    else {
      return null;
    }
  }
  updateEntityPosition = (something) => {
    if (something) {
      something.x += something.spdX;
      something.y += something.spdY;


      if (something.x < 0 || something.x > this.state.canvasSize.canvasWidth) {
        // console.log(this.state.message);
        something.spdX = -something.spdX;
      }
      if (something.y < 0 || something.y > this.state.canvasSize.canvasHeight) {
        // console.log(this.state.message);
        something.spdY = -something.spdY;
      }
    }
    else {
      return null;
    }
  }

  drawEntity = (something, ctx) => {
    if (something) {
      ctx.save();
      ctx.fillStyle = something.color;
      ctx.fillRect(something.x - (something.width / 2), something.y - (something.height), something.width, something.height);
      ctx.restore();
    }
    else {
      return null;
    }
  }

  // function on the interval loop that clears and then rerenders the canvas
  update = (ctx) => {
    this.setHighscore();
    ctx.clearRect(0, 0, this.state.canvasSize.canvasWidth, this.state.canvasSize.canvasHeight);
    // console.log(`this.state.timestarted = ${Date.now() - this.state.timeWhenGameStarted}`)
    this.setState({
      frameCount: this.state.frameCount + 1,
      score: this.state.score + 1,
    });

    if (this.state.frameCount % 100 === 0) {     //every 4 sec generate new enemy
      this.randomlyGenerateEnemy();
    }
    if (this.state.frameCount % 75 === 0) {     //every 3 sec generate new upgrade
      this.randomlyGenerateUpgrade();
    }
    if (this.state.frameCount % 75 === 0) {     //every 3 sec generate new bullet
      this.randomlyGenerateBullet(this.state.player);
    }

    // map through bullet list and render
    Object.keys(this.state.bulletList).map((bullet) => {
      let thisbullet = this.state.bulletList[bullet];
      this.updateEntity(thisbullet, ctx);
      thisbullet.timer += 1
      if (thisbullet.timer > 400) { // 4 secs
        delete this.state.bulletList[bullet]
        return null;
      }
      // // loop through every enemy for every bullet and make sure to break the loop if deleted
      Object.keys(this.state.enemyList).map((enemy) => {
        if (this.testCollisionEntity(thisbullet, this.state.enemyList[enemy])) {
          delete this.state.bulletList[bullet];
          delete this.state.enemyList[enemy];
          return null;
        }
        return null;
      })
      return null;
    })

    // map through upgrade list render and update
    Object.keys(this.state.upgradeList).map((upgrade) => {
      let thisupgrade = this.state.upgradeList[upgrade];
      this.updateEntity(thisupgrade, ctx);

      if (this.testCollisionEntity(this.state.player, thisupgrade)) {
        console.log(thisupgrade.category)
        if (thisupgrade.category === "low") {
          this.setState({
            score: this.state.score + 1000,
          })
        } else if (thisupgrade.category === "high") {
          this.setState({
            score: this.state.score + 10000,
          })
        }
        delete this.state.upgradeList[upgrade]
        // console.log("Player HP = " + this.state.hp)
      }
      return null;
    })

    // map through enemy list and update health and game based off collision
    Object.keys(this.state.enemyList).map((enemy) => {
      let thisenemy = this.state.enemyList[enemy];
      this.updateEntity(thisenemy, ctx);

      if (this.testCollisionEntity(this.state.player, thisenemy)) {
        this.setState({
          hp: this.state.hp - 1
        })
        if (this.state.hp <= 0) {
          console.log(`You Lost, You Survived for ${Date.now() - this.state.timeWhenGameStarted} ms.`);
          this.startNewGame()
        }
        console.log("Player HP = " + this.state.hp)
      }
      return null;
    })

    this.drawEntity(this.props.player, ctx);
    ctx.fillText(this.state.hp + " HP", 0, 30);
    ctx.fillText(`Score : ${this.state.score}`, 200, 30);
  }

  // function to reset states and enemy position
  startNewGame = () => {
    // let enemy = this.randomlyGenerateEnemy();
    this.setState({
      timeWhenGameStarted: Date.now(),
      frameCount: 0,
      score: 0,
      hp: 20,
      enemyList: {},
      upgradeList: {},
      bulletList: {},
    })
    this.randomlyGenerateEnemy();
    this.randomlyGenerateEnemy();
    this.randomlyGenerateEnemy();
  }

  setHighscore = () => {
    // console.log(this.props.username)
    if (this.props.username) {
      API.getUser(this.props.username)
        .then(response => {
          console.log("the current score = " + this.state.score)
          console.log("the user is " + JSON.stringify(response.data))
          if (response.data.highScore < this.state.score) {
            API.updateUser(response.data.username, { highScore: this.state.score })
              .then(res => {
                // console.log("updated user is = " + JSON.stringify(res))
              })
          } else {
            // console.log("You didnt Get a higher high score this time sorry :(")
          }
        })
    }
    else {
      API.getUser(this.state.username)
        .then(response => {
          console.log("the user is " + JSON.stringify(response.data)  )  
          if (response.data.highScore < this.state.score) {
            API.updateUser(this.state.username, { highScore: this.state.score })
              .then(res => {
                // console.log("updated user is = " + JSON.stringify(res))
              })
          } else {
            // console.log("You didnt Get a higher high score this time sorry :(")
          }
        })
    }
  }

  // clear the setinterval id on dismount and other end of game functions
  componentWillUnmount() {
    // this.setHighscore();
    clearInterval(this.interval);
  }
  componentDidUpdate() {}

  render() {
    return (
      <div className="container mainContent">
        <canvas
          id="canvas"
          ref={canvasRender => this.canvasRender = canvasRender}
          style={{ border: "1px solid #000000" }}
        />
        <div id="inventory" />

      </div>
    );
  }
}
  // resizeCanvas = () => {

  //   var canvas = document.getElementById("canvas");
  //   var ctx = canvas.getContext("2d");

  //   var TILE_SIZE = 32;
  //   var WIDTH = 640;
  //   var HEIGHT = 360;
  //   var CANVAS_WIDTH = 640;
  //   var CANVAS_HEIGHT = 360;
  //   var timeWhenGameStarted = Date.now();	//return time in ms

  //   let ratio = 16 / 9;
  //   if (CANVAS_HEIGHT < CANVAS_WIDTH / ratio)
  //     CANVAS_WIDTH = CANVAS_HEIGHT * ratio;
  //   else
  //     CANVAS_HEIGHT = CANVAS_WIDTH / ratio;

  //   canvas.width = WIDTH;
  //   canvas.height = HEIGHT;
  //   ctx.font = '30px Arial';
  //   ctx.mozImageSmoothingEnabled = false;	//better graphics for pixel art
  //   ctx.msImageSmoothingEnabled = false;
  //   ctx.imageSmoothingEnabled = false;

  //   canvas.style.width = `${CANVAS_WIDTH}px`;
  //   canvas.style.height = `${CANVAS_HEIGHT}px`;
  // }
  // componenetWillLoad = () => {

  //   this.resizeCanvas();

  //   window.addEventListener('resize', () => {
  //     this.resizeCanvas();
  //   });

  //   let frameCount = 0;

  //   let score = 0;

  //   let paused = false;

  //   const Img = {};
  //   Img.player = new Image();
  //   Img.player.src = "./images/player.png";
  //   Img.bat = new Image();
  //   Img.bat.src = './images/bat.png';
  //   Img.bee = new Image();
  //   Img.bee.src = './images/bee.png';
  //   Img.bullet = new Image();
  //   Img.bullet.src = './images/bullet.png';
  //   Img.upgrade1 = new Image();
  //   Img.upgrade1.src = './images/upgrade1.png';
  //   Img.upgrade2 = new Image();
  //   Img.upgrade2.src = './images/upgrade2.png';


  //   document.onmousedown = ({ which }) => {
  //     if (which === 1)
  //       player.pressingMouseLeft = true;
  //     else
  //       player.pressingMouseRight = true;
  //   }
  //   document.onmouseup = ({ which }) => {
  //     if (which === 1)
  //       player.pressingMouseLeft = false;
  //     else
  //       player.pressingMouseRight = false;
  //   }
  //   document.oncontextmenu = mouse => {
  //     mouse.preventDefault();
  //   }

  //   document.onmousemove = ({ clientX, clientY }) => {
  //     let mouseX = clientX - canvas.getBoundingClientRect().left;
  //     let mouseY = clientY - canvas.getBoundingClientRect().top;

  //     mouseX -= CANVAS_WIDTH / 2;
  //     mouseY -= CANVAS_HEIGHT / 2;

  //     player.aimAngle = Math.atan2(mouseY, mouseX) / Math.PI * 180;
  //   }

  //   document.onkeydown = ({ keyCode }) => {
  //     if (keyCode === 68)	//d
  //       player.pressingRight = true;
  //     else if (keyCode === 83)	//s
  //       player.pressingDown = true;
  //     else if (keyCode === 65) //a
  //       player.pressingLeft = true;
  //     else if (keyCode === 87) // w
  //       player.pressingUp = true;

  //     else if (keyCode === 80) //p
  //       paused = !paused;
  //   }

  //   document.onkeyup = ({ keyCode }) => {
  //     if (keyCode === 68)	//d
  //       player.pressingRight = false;
  //     else if (keyCode === 83)	//s
  //       player.pressingDown = false;
  //     else if (keyCode === 65) //a
  //       player.pressingLeft = false;
  //     else if (keyCode === 87) // w
  //       player.pressingUp = false;
  //   }

  //   update = () => {
  //     if (paused) {
  //       ctx.fillText('Paused', WIDTH / 2, HEIGHT / 2);
  //       return;
  //     }

  //     ctx.clearRect(0, 0, WIDTH, HEIGHT);
  //     Maps.current.draw();
  //     frameCount++;
  //     score++;


  //     Bullet.update();
  //     Upgrade.update();
  //     Enemy.update();

  //     player.update();

  //     ctx.fillText(`${player.hp} Hp`, 0, 30);
  //     ctx.fillText(`Score: ${score}`, 200, 30);
  //   }

  //   startNewGame = () => {
  //     player.hp = 10;
  //     timeWhenGameStarted = Date.now();
  //     frameCount = 0;
  //     score = 0;
  //     Enemy.list = {};
  //     Upgrade.list = {};
  //     Bullet.list = {};
  //     Enemy.randomlyGenerate();
  //     Enemy.randomlyGenerate();
  //     Enemy.randomlyGenerate();

  //   }

  //   Maps = (id, imgSrc, grid) => {
  //     const self = {
  //       id,
  //       image: new Image(),
  //       width: grid[0].length * TILE_SIZE,
  //       height: grid.length * TILE_SIZE,
  //       grid,
  //     };
  //     self.image.src = imgSrc;

  //     self.isPositionWall = ({ x, y }) => {
  //       const gridX = Math.floor(x / TILE_SIZE);
  //       const gridY = Math.floor(y / TILE_SIZE);
  //       if (gridX < 0 || gridX >= self.grid[0].length)
  //         return true;
  //       if (gridY < 0 || gridY >= self.grid.length)
  //         return true;
  //       return self.grid[gridY][gridX];
  //     }

  //     self.draw = () => {
  //       const x = WIDTH / 2 - player.x;
  //       const y = HEIGHT / 2 - player.y;
  //       ctx.drawImage(self.image, 0, 0, self.image.width, self.image.height, x, y, self.image.width * 2, self.image.height * 2);
  //     }
  //     return self;
  //   }

  //   const array = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 502, 502, 502, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 502, 502, 502, 502, 502, 502, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 502, 502, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 502, 502, 502, 502, 502, 502, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 502, 502, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 502, 502, 0, 0, 0, 0, 0, 0, 0, 502, 502, 502, 502, 502, 502, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 502, 502, 0, 0, 0, 0, 0, 0, 0, 502, 502, 502, 502, 502, 502, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 502, 502, 502, 502, 502, 502, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 502, 502, 502, 502, 502, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 502, 502, 502, 502, 502, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 502, 502, 502, 502, 502, 502, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 502, 502, 502, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 502, 502, 502, 502, 502, 502, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 502, 502, 502, 502, 502, 502, 502, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 502, 502, 502, 502, 502, 502, 502, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 502, 502, 502, 502, 502, 502, 502, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 502, 502, 502, 502, 502, 0, 0, 0, 0, 0, 502, 502, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 502, 502, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 502, 502, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 502, 502, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 502, 502, 502, 502, 502, 502, 502, 502, 502, 502, 502, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 502, 502, 502, 502, 502, 502, 502, 502, 502, 502, 502, 502, 502, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 502, 502, 502, 502, 502, 502, 502, 502, 502, 502, 502, 502, 502, 0, 0, 0, 0, 0, 0, 502, 502, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 502, 502, 0, 0, 0, 0, 0, 502, 502, 502, 502, 502, 502, 502, 502, 502, 502, 502, 502, 502, 0, 0, 0, 0, 0, 0, 502, 502, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 502, 502, 0, 0, 0, 0, 0, 502, 502, 502, 502, 502, 502, 502, 502, 502, 502, 502, 502, 502, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 502, 502, 502, 502, 502, 502, 502, 502, 502, 502, 502, 502, 502, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 502, 502, 502, 502, 502, 502, 502, 502, 502, 502, 502, 502, 502, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 502, 502, 502, 502, 502, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 502, 502, 502, 502, 502, 502, 502, 502, 502, 502, 502, 502, 502, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 502, 502, 502, 502, 502, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 502, 502, 502, 502, 502, 502, 502, 502, 502, 502, 502, 502, 502, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 502, 502, 502, 502, 502, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 502, 502, 502, 502, 502, 502, 502, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 502, 502, 502, 502, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 502, 502, 502, 502, 502, 502, 502, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 502, 502, 502, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 502, 502, 502, 502, 502, 502, 502, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 502, 502, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 502, 502, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 502, 502, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 502, 502, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 502, 502, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 502, 502, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  //   const array2D = [];
  //   for (let i = 0; i < 40; i++) {
  //     array2D[i] = [];
  //     for (let j = 0; j < 40; j++) {
  //       array2D[i][j] = array[i * 40 + j];
  //     }
  //   }

  //   Maps.current = Maps('field', 'img/map.png', array2D);



  //   player = Player();
  //   playerInventory = Inventory();
  //   startNewGame();

  //   canvasRender = () => {setInterval(update, 40);
  //   }
  // }
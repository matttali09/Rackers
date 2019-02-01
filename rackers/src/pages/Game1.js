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
      color: "red",
      aimAngle: 0,
      atkSpd: 1,
      attackCounter: 0,
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
  upgrade = (id, x, y, spdX, spdY, width, height, category, color) => {
    let upgrades = {
      x: x,
      spdX: spdX,
      y: y,
      spdY: spdY,
      name: 'E',
      id: id,
      width: height,
      height: width,
      color: color,
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

  // function that starts the game up when the component is loaded
  componentDidMount() {
    this.startTimer();
    this.getMousePosition(this.props.player);
    this.getRightClick(this.props.player);
    this.getLeftClick(this.props.player);
    this.getKeyDown(this.props.player);
    this.getKeyUp(this.props.player);
    this.randomlyGenerateEnemy();
    this.randomlyGenerateEnemy();
    this.randomlyGenerateEnemy();
    const { canvasWidth, canvasHeight } = this.state.canvasSize;
    this.canvasRender.width = canvasWidth;
    this.canvasRender.height = canvasHeight;
    this.drawImg(this.canvasRender);
  }

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
    let category = "";
    let color = "";

    if (Math.random() < 0.5) {
      category = "low"
      color = "orange"
    } else {
      category = "high"
      color = "purple"
    }
    this.upgrade(id, x, y, spdX, spdY, width, height, category, color);
  }
  // function to randomly generate bullet from player position
  generateBullet = (actor, aimAngle) => {
    //Math.random() returns a number between 0 and 1
    let x = actor.x;
    let y = actor.y;
    let height = 10;     //between 10 and 40
    let width = 10;
    let id = Math.random();
    let angle = aimAngle;
    let spdX = Math.cos(angle / 180 * Math.PI) * 5;
    let spdY = Math.sin(angle / 180 * Math.PI) * 5;
    this.bullet(id, x, y, spdX, spdY, width, height);
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

  // get the canvas refrence passed in and get the context to store and send to other functions
  drawImg(canvasID) {
    const ctx = canvasID.getContext("2d");
    ctx.font = "30px Arial";
    this.interval = setInterval(() => {
      this.update(ctx, this.state.player)
    }, 40)
  }

  // functions for player control
  // get mouse position and atan it to get the angle, 8 is harcoded version
  getMousePosition = (player) => {
    document.onmousemove = function (event) {
      let mouseX = event.clientX - 8;
      let mouseY = event.clientY - 8;
      mouseX -= player.x;
      mouseY -= player.y;
      player.aimAngle = Math.atan2(mouseY, mouseX) / Math.PI * 180;
    }
  }
  // function to listen for a players mouse
  getLeftClick = (player) => {
    document.onmousedown = () => {
      if (player.atkCounter > 25) {
        this.generateBullet(player, player.aimAngle);
        player.atkCounter = 0;
      }
    }
  }
  // function to listen for the players left click super attack, not working but will shoot one
  getRightClick = (player) => {
    document.oncontextmenu = (event) => {
      if (player.atkCounter > 50) {

        for (let angle; angle < 360; angle++) {
          this.generateBullet(player, angle);
        }

        player.atkCounter = 0;
      }
      event.preventDefault();
    }
  }
  getKeyDown = (player) => {
    document.onkeydown = (event) => {
      if (event.keyCode === 68)        //d
        player.pressingRight = true;
      else if (event.keyCode === 83)   //s
        player.pressingDown = true;
      else if (event.keyCode === 65) //a
        player.pressingLeft = true;
      else if (event.keyCode === 87) // w
        player.pressingUp = true;
    }
  }
  getKeyUp = (player) => {
    document.onkeyup = (event) => {
      if (event.keyCode === 68)        //d
        player.pressingRight = false;
      else if (event.keyCode === 83)   //s
        player.pressingDown = false;
      else if (event.keyCode === 65) //a
        player.pressingLeft = false;
      else if (event.keyCode === 87) // w
        player.pressingUp = false;
    }
  }
  updatePlayerPosition = (player) => {
    if (player.pressingRight)
      player.x += 10;
    if (player.pressingLeft)
      player.x -= 10;
    if (player.pressingDown)
      player.y += 10;
    if (player.pressingUp)
      player.y -= 10;

    //ispositionvalid
    if (player.x < player.width / 2)
      player.x = player.width / 2;
    if (player.x > 640 - player.width / 2)
      player.x = 640 - player.width / 2;
    if (player.y < player.height / 2)
      player.y = player.height / 2;
    if (player.y > 360 - player.height / 2)
      player.y = 360 - player.height / 2;
  }

  // // takes object and generates a bullet every 1 sec, not working
  // performAttack = (actor) => {
  //   if (actor.attackCounter > 25) {   //every 1 sec
  //     actor.attackCounter = 0;
  //     generateBullet(actor);
  //   }
  // }

  // // same for special attack
  // performSpecialAttack = (actor) => {
  //   if (actor.attackCounter > 50) {   //every 1 sec
  //     actor.attackCounter = 0;
  //     generateBullet(actor, actor.aimAngle - 20);
  //     generateBullet(actor, actor.aimAngle);
  //     generateBullet(actor, actor.aimAngle + 20);
  //   }
  // }

  // how other objects besides player are drawn
  updateEntity = (something, ctx) => {
    if (something) {
      this.updateEntityPosition(something)
      this.drawEntity(something, ctx)
    }
    else {
      return null;
    }
  }
  // update the x and y coordinates of object passed to it
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
  // draws an object to the canvas
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
  update = (ctx, player) => {
    // this.setHighscore();
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

    player.atkCounter += 1

    // map through bullet list and render, increase the bullets timer, delete at 400
    Object.keys(this.state.bulletList).map((bullet) => {
      let thisbullet = this.state.bulletList[bullet];
      this.updateEntity(thisbullet, ctx);
      thisbullet.timer += 1
      if (thisbullet.timer > 200) { // 4 secs
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
        if (thisupgrade.category === "low") {
          this.setState({
            score: this.state.score + 1000,
          })
        } else if (thisupgrade.category === "high") {
          player.atkSpd += 1;
        }
        delete this.state.upgradeList[upgrade]
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
      }
      return null;
    })

    this.updatePlayerPosition(player)
    this.drawEntity(player, ctx);
    ctx.fillText(this.state.hp + " HP", 0, 30);
    ctx.fillText(`Score : ${this.state.score}`, 200, 30);
  }

  // function to reset states and enemy position
  startNewGame = () => {
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

  // function to send to user highscore to the database
  setHighscore = () => {
    if (this.props.username) {
      API.getUser(this.props.username)
        .then(response => {
          if (response.data.highScore < this.state.score) {
            console.log(`response.data.highscore was higher than the state score ${response.data.highScore} < ${this.state.score}`)
            API.updateUser(response.data.username, { highScore: this.state.score })
              .then(res => {
              })
          }
        })
    }
    else {
      API.getUser(this.state.username)
        .then(response => {
          if (response.data.highScore < this.state.score) {
            API.updateUser(this.state.username, { highScore: this.state.score })
              .then(res => {
              })
          } else {

          }
        })
    }
  }

  // clear the setinterval id on dismount and other end of game functions
  componentWillUnmount() {
    // this.setHighscore();
    clearInterval(this.interval);
  }
  componentDidUpdate() { }

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

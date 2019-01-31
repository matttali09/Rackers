import React, { Component } from "react";
// import Entites from "./Entities.js";
// import Inventory from "./Inventory.js";


export default class Canvas extends Component {
  state = {
    username: "Sephiroth91",
    canvasSize: { canvasWidth: 640, canvasHeight: 360 },
    enemyList: {},
    upgradeList: {},
    bulletList: {},
    player: this.props.player,
    hp: 20,
    frameCount: 0,
    score: 0,
    timeWhenGameStarted: null
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
  upgrade = (id, x, y, spdX, spdY, width, height) => {
    let upgrades = {
      x: x,
      spdX: spdX,
      y: y,
      spdY: spdY,
      name: 'E',
      id: id,
      width: height,
      height: width,
      color: "orange"
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
      color: "black"
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
    this.upgrade(id, x, y, spdX, spdY, width, height);
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
  // clear the setinterval id on dismount
  componentWillUnmount() {
    clearInterval(this.interval)
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
    ctx.clearRect(0, 0, this.state.canvasSize.canvasWidth, this.state.canvasSize.canvasHeight);
    // console.log(`this.state.timestarted = ${Date.now() - this.state.timeWhenGameStarted}`)
    this.setState({
      frameCount: this.state.frameCount + 1,
      score: this.state.score + 1
    });

    if (this.state.frameCount % 100 === 0) {     //every 4 sec generate new enemy
      this.randomlyGenerateEnemy();
    }
    if (this.state.frameCount % 75 === 0) {     //every 3 sec generate new upgrade
      this.randomlyGenerateUpgrade();
    }
    if (this.state.frameCount % 25 === 0) {     //every 1 sec generate new bullet
      this.randomlyGenerateBullet(this.state.player);
    }

    // map through upgrade list and render
    // Object.keys(this.state.bulletList).map((upgrade) => {
    //   let thisupgrade = this.state.upgradeList[upgrade];
    //   this.updateEntity(thisupgrade, ctx);

    //   if (this.testCollisionEntity(this.state.player, thisupgrade)) {
    //     this.setState({
    //       score: this.state.score + 1000
    //     })
    //     delete this.state.upgradeList[upgrade]
    //   }
    //   return null;
    // })
    // map through upgrade list render and update
    Object.keys(this.state.upgradeList).map((upgrade) => {
      let thisupgrade = this.state.upgradeList[upgrade];
      this.updateEntity(thisupgrade, ctx);

      if (this.testCollisionEntity(this.state.player, thisupgrade)) {
        this.setState({
          score: this.state.score + 1000
        })
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
    })
    this.randomlyGenerateEnemy();
    this.randomlyGenerateEnemy();
    this.randomlyGenerateEnemy();
  }


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
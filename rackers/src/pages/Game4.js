import React, { Component } from "react";
import API from "../utils/API";


export default class Game4 extends Component {
  // Global Refs ==========================================================================
  username = "Sephiroth91";
  canvasSize = { canvasWidth: 640, canvasHeight: 360 };
  enemyList = [];
  upgradeList = [];
  bulletList = [];
  frameCount = 0;
  score = 0;
  timeWhenGameStarted = null;
  toRemove = false;
  player = {
    type: "player",
    hp: 20,
    x: 50,
    spdX: 30,
    y: 40,
    spdY: 5,
    name: 'P',
    color: "green",
    width: 20,
    height: 20,
    atkSpd: 1,
    atkCounter: 26,
    pressingDown: false,
    pressingUp: false,
    pressingLeft: false,
    pressingRight: false,
    aimAngle: 0,
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
    this.bulletList.push(bullets);
  };
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
    this.enemyList.push(enemy);
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

  // canvas rendering ==========================================================================================================
  // get the canvas refrence passed in and get the context to store and send to other functions
  drawImg(canvasID) {
    // set the context to 2d for images and text rendering
    const ctx = canvasID.getContext("2d");
    // set the context to 30 pixel arial
    ctx.font = "30px Arial";
    this.interval = setInterval(() => {
      this.update(ctx, this.player)
    }, 40)
  }

  // ========================== Update Function ====================================
  // function on the interval loop that clears and then rerenders the canvas
  update = (ctx, player) => {
    // clear the canvas
    ctx.clearRect(0, 0, this.canvasSize.canvasWidth, this.canvasSize.canvasHeight);
    // increment frame count and score
    this.frameCount++;
    this.score++;
    this.player.atkCounter++;

    if (this.frameCount % 100 === 0) {     //every 4 sec generate new enemy
      this.randomlyGenerateEnemy();
    }

    // map through bullet list and render, increase the bullets timer, delete at 400
    for (var i = 0; i < this.bulletList.length; i++) {

    }

    // update player position then draw the new player position
    this.updatePlayerPosition(player);
    this.drawEntity(player, ctx);
    // Display Health in the top left of the Canvas and Score In the Middle
    ctx.fillText(this.player.hp + " HP", 0, 30);
    ctx.fillText(`Score : ${this.score}`, 200, 30);
  }
  // function that starts the game up when the component is loaded
  componentDidMount() {
    this.getMousePosition();
    this.getRightClick();
    this.getLeftClick();
    this.getKeyDown();
    this.getKeyUp();
    this.canvasRender.width = this.canvasSize.canvasWidth;
    this.canvasRender.height = this.canvasSize.canvasHeight;
    this.randomlyGenerateEnemy();
    this.drawImg(this.canvasRender)
  }

  // Helper Functions ===================================================
  // =============== functions for player control =======================================
  // get mouse position and atan it to get the angle, 8 is harcoded version
  getMousePosition = () => {
    document.onmousemove = function (event) {
      const player = { player };
      let mouseX = event.clientX - 8;
      let mouseY = event.clientY - 8;
      mouseX -= player.x;
      mouseY -= player.y;
      player.aimAngle = Math.atan2(mouseY, mouseX) / Math.PI * 180;
    }
  }
  // function to listen for a players mouse left click for normal attack
  getLeftClick = () => {
    document.onmousedown = () => {
      const player = { player };
      if (this.player.atkCounter > 25) {
        this.generateBullet(player, player.aimAngle);
        player.atkCounter = 0;
      }
    }
  }
  // function to listen for the players left click super attack, not working but will shoot one
  getRightClick = () => {
    document.oncontextmenu = (event) => {
      const player = { player };
      if (player.atkCounter > 60) {
        for (let angle; angle < 360; angle++) {
          this.generateBullet(player, player.angle);
        }
        player.atkCounter = 0;
      }
      event.preventDefault();
    }
  }
  getKeyDown = () => {
    document.onkeydown = (event) => {
      if (event.keyCode === 68)        //d
        this.player.pressingRight = true;
      else if (event.keyCode === 83)   //s
        this.player.pressingDown = true;
      else if (event.keyCode === 65) //a
        this.player.pressingLeft = true;
      else if (event.keyCode === 87) // w
        this.player.pressingUp = true;
    }
  }
  getKeyUp = () => {
    document.onkeyup = (event) => {
      if (event.keyCode === 68)        // d
        this.player.pressingRight = false;
      else if (event.keyCode === 83)   // s
        this.player.pressingDown = false;
      else if (event.keyCode === 65) // a
        this.player.pressingLeft = false;
      else if (event.keyCode === 87) // w
        this.player.pressingUp = false;
    }
  }
  updatePlayerPosition = () => {
    if (this.player.pressingRight)
      this.player.x += 10;
    if (this.player.pressingLeft)
      this.player.x -= 10;
    if (this.player.pressingDown)
      this.player.y += 10;
    if (this.player.pressingUp)
      this.player.y -= 10;

    // Is The Position Valid?
    if (this.player.x < this.player.width / 2)
      this.player.x = this.player.width / 2;
    if (this.player.x > 650 - this.player.width / 2)
      this.player.x = 650 - this.player.width / 2;
    if (this.player.y < this.player.height / 2)
      this.player.y = this.player.height / 2;
    if (this.player.y > 370 - this.player.height / 2)
      this.player.y = 370 - this.player.height / 2;
  }

  //================ Generation of NPC enemys ==========================
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
  // clear the setinterval id on dismount and other end of game functions
  componentWillUnmount() {
    // this.setHighscore();
    clearInterval(this.interval);
  }

  // not used currently.
  componentDidUpdate() {

  }

  // JSX Render method and Return ========================================================================================
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
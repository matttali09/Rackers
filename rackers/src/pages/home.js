import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Modal, Button } from "react-materialize";
import HighScoreTable from "../components/highScoreTable";
import HighScoreTable2 from "../components/highScoreTable2";
import HighScoreTable3 from "../components/highScoreTable3";

class Home extends Component {
  state = {
    hidden: true,
  }

  toggleHidden() {
    console.log("i was clicked")
    // setTimeout(() => {
    this.setState({
      isHidden: !this.state.isHidden
    })
    // }, 2000)

  }

  render() {
    const imageStyle = {
      background: "white"
    };
    return (
      <center>
        <div className="container mainContent">
          <h6 className="game-header">Survival Mode!</h6>
          <div className="row">
            <Link to="/game1" className="active">
              <img
                className="col s12 m4 game-img"
                style={imageStyle}
                src="./images/game1.png"
                alt="Survival Mode!"
                href="/game1"
              />
            </Link>
            <div className="col s12 m8">
              <p className="game-description">
              Click on the image to start the game! controls are WSAD for
              movement. Left and/or right click mouse to fire bullets. pressing
              "P" will pause the game. Collect purple upgrades to increase attack
              speed, and orange to increase score by 1000!
              Try to stay alive as long as possible!
              It is the Current stage that I am in completing the first full game with images, 
                stay tuned!
              </p>
              <Modal
                header='Survival Mode LeaderBoard'
                trigger={<Button className="leader-board waves-effect waves-effect-dark">Survival Mode LeaderBoard</Button>}>
                <HighScoreTable />
              </Modal>
            </div>
          </div>
        </div>
        <div className="container mainContent">
          <h6 className="game-header">Collect the Dots</h6>
          <div className="row">
            <Link to="/game2" className="active">
              <img
                className="col s12 m4 game-img"
                style={imageStyle}
                src="./images/game2.gif"
                alt="Collect the Dots"
                href="/game2"
              />
            </Link>
            <div className="col s12 m8">
              <p className="game-description">Control the player with your mouse.Click on the image to start the game! 
              Try to stay alive as long as possible while collecting the dots for a higher score!
              <em>be sure to center the game on your screen</em>
              </p>
              <Modal
                header='Collect the Dots LeaderBoard'
                trigger={<Button className="leader-board2 waves-effect waves-effect-dark">Collect the Dots LeaderBoard</Button>}>
                <HighScoreTable2 />
              </Modal>
            </div>
          </div>
        </div>
        <div className="container mainContent">
          <h6 className="game-header">Mine Dropper</h6>
          <div className="row">
            <Link to="/game3" className="active">
              <img
                className="col s12 m4 game-img"
                style={imageStyle}
                src="./images/game3.gif"
                alt="Mine Dropper"
                href="/game3"
              />
            </Link>
            <div className="col s12 m8">
              <p className="game-description" >Click on the image to start the game! controls are WSAD for
              movement. Left and/or right click mouse to fire bullets. Collect purple
              upgrades to increase attack speed, and orange to increase score by 1000!
              Try to stay alive as long as possible!
              </p>
              <Modal
                header='Mine Dropper LeaderBoard'
                trigger={<Button className="leader-board3 waves-effect waves-effect-dark">Mine Dropper LeaderBoard</Button>}>
                <HighScoreTable3 />
              </Modal>
            </div>
          </div>
        </div>
      </center>
    );

  }
}

export default Home;

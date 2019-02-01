import React, { Component } from "react";
import { Link } from "react-router-dom";
import HighScoreTable from "../components/highScoreTable";
import HighScoreTable2 from "../components/highScoreTable2";
import HighScoreTable3 from "../components/highScoreTable3";

class Home extends Component {
  render() {
    const imageStyle = {
      // width: 400
    };
    return (
      <>
        <div className="container mainContent">
          <center>
            <h6 className="center">Survival Mode!</h6>
          </center>
          <div className="row">
            <Link to="/game1" className="active">
              <img
                className="col s12 m4"
                style={imageStyle}
                src="./images/game1.png"
                alt="Game 1"
                href="/game1"
              />
            </Link>
            <p className="col s12 m8">
              Click on the image to start the game! controls are WSAD for
              movement. Left and/or right click mouse to fire bullets. pressing
              "P" will pause the game. Try to stay alive as long as possible!
          </p>
            <HighScoreTable />
          </div>
        </div>
        <div className="container mainContent">
          <center>
            <h6 className="center">Collect the Dots</h6>
          </center>
          <div className="row">
            <Link to="/game2" className="active">
              <img
                className="col s12 m4"
                style={imageStyle}
                src="./images/game1.png"
                alt="Game 1"
                href="/game2"
              />
            </Link>
            <p className="col s12 m8">
              Click on the image to start the game! control the player with your mouse. 
              Try to stay alive as long as possible while collecting the dots for a higher score!
              <em>be sure to center the game on your screen</em>
          </p>
            <HighScoreTable2 />
          </div>
        </div>
        <div className="container mainContent">
          <center>
            <h6 className="center">Game #1</h6>
          </center>
          <div className="row">
            <Link to="/game3" className="active">
              <img
                className="col s12 m4"
                style={imageStyle}
                src="./images/game1.png"
                alt="Game 3"
                href="/game3"
              />
            </Link>
            <p className="col s12 m8">
              Click on the image to start the game! controls are WSAD for
              movement. Left and/or right click mouse to fire bullets. Collect purple
              upgrades to increase attack speed, and orange to increase score by 1000!
              Try to stay alive as long as possible!
          </p>
            <HighScoreTable3 />
          </div>
        </div>
      </>
    );

  }
}

export default Home;

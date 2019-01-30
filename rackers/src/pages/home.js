import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import HighScoreTable from '../components/highScoreTable'

class Home extends Component {

    render() {
        const imageStyle = {
            // width: 400
        }
        return (
            <div className="container mainContent">
                <h6 className="center">Game #1</h6>
                <div className="row">
                <Link to="/game1" className="active">
                    <img className="col s12 m4" style={imageStyle} src="./images/game1.png" alt="Game 1" href="/game1" />
                    </Link>
                    <p className="col s12 m8" >Click on the image to start the game! controls are WSAD for movement. 
                        Left and/or right click mouse to fire bullets. pressing "P" will pause the game. 
                        Try to stay alive as long as possible!
                    </p>
                    <HighScoreTable />
                </div>
            </div>
        )

    }
}

export default Home;

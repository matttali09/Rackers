import React, { Component } from 'react'

class Home extends Component {

    render() {
        const imageStyle = {
            // width: 400
        }
        return (
            <div className="container mainContent">
                <h6 className="center">It's good to be home</h6>
                <div className="row">
                    <img className="col s12 m4" style={imageStyle} src="./images/game1.png" alt="Game 1" href="/game1" />
                    <p className="col s12 m8" >Click on the image to start the game bro! controls are WSAD and left and/or right click 
                        mouse to fire bullets. Try to stay alive as long as possible!
                    </p>
                </div>
            </div>
        )

    }
}

export default Home

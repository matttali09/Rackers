import React, { Component } from 'react'
import API from '../utils/API'

class highScoreTable extends Component {
    state = {
        highScores: []
    }

    componentWillMount = () => {
        this.getUsersbyHighscore()
    }
    getUsersbyHighscore = () => {
        API.getUsersbyHighscore().then(response => {
            console.log('HighScore user response: ')
            console.log(response.data)
            this.setState({
                highScores: (response.data)
            })
            console.log("user with highscores = " + JSON.stringify(this.state.highScores))
        }
        )
    }

    render() {

        return (
            <table className="highscore-table">
                <thead>
                    <tr>
                        <th className="ranking-text">Ranking</th>
                        <th className="username-text">Username</th>
                        <th className="score-text">HighScore</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.highScores.map((user, index) =>
                        <tr key={user.id}>
                            <td className="ranking-text">{index + 1}.</td>
                            <td className="username-text">{user.username}</td>
                            <td className="score-text">{user.highScore}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        )

    }
}

export default highScoreTable;
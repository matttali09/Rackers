import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom'
import API from "./utils/API";
// components
import Signup from './pages/sign-up';
import LoginForm from './pages/login-form';
import Home from './pages/home';
import Game1 from './pages/Game1';
import Game2 from './pages/Game2';
import Game3 from './pages/Game3';
import Navbar from './components/navbar';
import Footer from './components/footer';
import NoMatch from './components/noMatch';

class App extends Component {
  state = {
    loggedIn: false,
    username: null
  }

  componentDidMount() {
    this.getUsers()
  }

  updateUser = userObject => {
    this.setState(userObject)
  }

  getUsers() {
    API.getUsers()
      .then(response => {
        // console.log('Get user response: ')
        // console.log(response.data)
      }
      )
  }

  render() {
    return (
      <div className="App">

        <Navbar updateUser={this.updateUser} loggedIn={this.state.loggedIn} />
        {/* greet user if logged in: */}
        {this.state.loggedIn &&
          <div className="container mainContent">
            <center>
            <h6>Welcome, <span className="username-text1">{this.state.username}!</span></h6>
            </center>
          </div>
        }
        {/* Routes to different components */}
        <Switch>
          <Route exact path="/"  render={() => <Signup updateUser={this.updateUser} />}
          />
          <Route exact path="/home" render={() => <Home />}
          />
          <Route path="/signin" render={() => <LoginForm updateUser={this.updateUser} />}
          />
          <Route path="/signup" render={() => <Signup updateUser={this.updateUser} />}
          />
          <Route path="/game1" render={() => <Game1 player={{
            type: "player",
            x: 50,
            spdX: 30,
            y: 40,
            spdY: 5,
            name: 'P',
            color: "green",
            width: 20,
            height: 20,
            atkSpd: 1,
            atkCounter: 0,
            pressingDown: false,
            pressingUp: false,
            pressingLeft: false,
            pressingRight: false,
            aimAngle: 0,
          }}
            username={this.state.username}
          />}
          />
          <Route path="/game2" render={() => <Game2 player={{
            type: "player",
            x: 50,
            spdX: 30,
            y: 40,
            spdY: 5,
            name: 'P',
            color: "green",
            width: 20,
            height: 20,
            atkSpd: 1,
            atkCounter: 0,
            pressingDown: false,
            pressingUp: false,
            pressingLeft: false,
            pressingRight: false,
            aimAngle: 0,
          }}
            username={this.state.username}
          />}
          />
          <Route path="/game3" render={() => <Game3 player={{
            type: "player",
            x: 50,
            spdX: 30,
            y: 40,
            spdY: 5,
            name: 'P',
            color: "green",
            width: 20,
            height: 20,
            atkSpd: 1,
            atkCounter: 0,
            pressingDown: false,
            pressingUp: false,
            pressingLeft: false,
            pressingRight: false,
            aimAngle: 0,
          }}
            username={this.state.username}
          />}
          />
          <Route component={NoMatch} />
        </Switch>
        <Footer />
      </div>
    );

  }
}

export default App;
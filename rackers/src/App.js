import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom'
import API from "./utils/API";
// components
import Signup from './pages/sign-up'
import LoginForm from './pages/login-form'
import Home from './pages/home'
import Game1 from './pages/Game1'
import Navbar from './components/navbar'
import Footer from './components/footer'

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
        console.log('Get user response: ')
        console.log(response.data)
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
            <h6 className="center">Join the party, <span className="username-text">{this.state.username}!</span></h6>
          </div>
        }
        {/* Routes to different components */}
        <Switch>
          <Route exact path="/" component={Home}
          />
          <Route path="/signin" render={() => <LoginForm updateUser={this.updateUser} />}
          />
          <Route path="/signup" render={() => <Signup updateUser={this.updateUser}/>}
          />
          <Route path="/game1" render={() => <Game1 />}
          />
        </Switch>
        <Footer />
      </div>
    );

  }
}

export default App;

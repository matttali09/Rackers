import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import "materialize-css/dist/css/materialize.min.css";
import '../App.css';
// import { NavItem, SideNav} from 'react-materialize'
import API from '../utils/API'

class Nav extends Component {

    componentDidMount() {

    }

    logout = event => {
        event.preventDefault()
        // console.log('logging out')
        API.signOutUser().then(response => {
            // console.log(response.data)
            if (response.status === 200) {
                this.props.updateUser({
                    loggedIn: false,
                    username: null
                })
            }
        }).catch(error => {
            // console.log('Logout error')
        })
    }

    render() {
        const loggedIn = this.props.loggedIn;
        // console.log('navbar render, props: ')
        // console.log(this.props);

        return (
            <header className="App-header" id="nav-container">
                <nav>
                    {/* if logged in show this on navbar :else */}
                    {loggedIn ? (
                        <>
                            <Link to="/home" className="btn brand waves-effect">
                                <i className="fas fa-gamepad">Rackers</i></Link>
                            <Link to="/signin" className="btn btn-link waves-effect text-secondary center" onClick={this.logout}>
                                <span className="text-secondary">logout</span></Link>
                        </>
                    ) : (
                            <>
                                <Link to="/signin" className="btn brand waves-effect">
                                    <i className="fas fa-gamepad">Rackers</i>
                                </Link>
                                <Link to="/signup" className="btn btn-link waves-effect center">
                                    <span className="text-secondary">sign up</span>
                                </Link>
                                <Link to="/signin" className="btn btn-link waves-effect text-secondary center">
                                    <span className="text-secondary">login</span>
                                </Link>
                            </>
                        )}
                </nav>
            </header >
        );

    }
}

export default Nav
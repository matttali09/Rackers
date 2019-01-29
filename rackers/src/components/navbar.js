import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { Route, Link } from 'react-router-dom'
import M from "materialize-css";
import "materialize-css/dist/css/materialize.min.css";
import '../App.css';
import { Navbar, NavItem, Icon } from 'react-materialize'
import axios from 'axios'

class Nav extends Component {
    constructor() {
        super()
        this.logout = this.logout.bind(this)
    }

    componentDidMount() {
        // const options = {
        //   inDuration: 250,
        //   outDuration: 200,
        //   draggable: true
        // };
    
        // M.Sidenav.init(this.Sidenav);
    
        // let instance = M.Sidenav.getInstance(this.Sidenav);
        // instance.open();
        // console.log(instance.isOpen);
      }

    logout(event) {
        event.preventDefault()
        console.log('logging out')
        axios.post('/api/users/logout').then(response => {
            console.log(response.data)
            if (response.status === 200) {
                this.props.updateUser({
                    loggedIn: false,
                    username: null
                })
            }
        }).catch(error => {
            console.log('Logout error')
        })
    }

    render() {
        const loggedIn = this.props.loggedIn;
        console.log('navbar render, props: ')
        console.log(this.props);

        return (
            <header className="App-header" id="nav-container">
                <Navbar>
                    {/* if logged in show this on navbar :else */}
                    {loggedIn ? (
                        <>
                            <NavItem href="/" className="brand">
                                <i className="fas fa-gamepad">Rackers</i></NavItem>
                            <NavItem href="#" className="btn btn-link text-secondary" onClick={this.logout}>
                                <span className="text-secondary">logout</span></NavItem>
                        </>
                    ) : (
                            <>
                                <NavItem href="/" className="brand">
                                    <i className="fas fa-gamepad">Rackers</i>
                                </NavItem>
                                <NavItem href="/" className="btn btn-link text-secondary">
                                    <span className="text-secondary">home</span>
                                </NavItem>
                                <NavItem href="/signin" className="btn btn-link text-secondary">
                                    <span className="text-secondary">login</span>
                                </NavItem>
                                <NavItem href="/signup" className="btn btn-link">
                                    <span className="text-secondary">sign up</span>
                                </NavItem>
                            </>
                        )}
                </Navbar>
            </header >
        );

    }
}

export default Nav
import React, { Component } from 'react'

class Footer extends Component {
    render() {
        return (
        <footer className="page-footer" id="footer">
            <div className="container">
                <div className="row">
                    <div className="col s12 m4">
                        <i className="fas fa-gamepad">Rackers</i>
                </div>
                    <div className="col s12 m8">
                        <h6 className="grey-text text-lighten-1">Team Members</h6>
                        <p className="grey-text text-lighten-1">
                            This site is a combined effort between Matthew Taliancich, and Carlo Cabrera.
                            We're a group of web developers based out of Orlando, Fl.
                            We wanted to create an application that would be a safehaven of unbiased
                            movie reviews. We hope you enjoy our site.
                    </p>
                    </div>
                </div>
            </div>
            <div className="footer-copyright">
                <div className="container">
                    <p className="grey-text text-lighten-1">Created by Rackers</p>
                </div>
            </div>
        </footer>

        )
    }       
}

export default Footer
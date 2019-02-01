import React, { Component } from "react";

const today = new Date();

class Footer extends Component {
  render() {
    return (
      <footer className="page-footer" id="footer">
        <div className="container">
          <div className="row">
            <div className="col s12 m8">
              <h6 className="grey-text text-lighten-1">About Rackers</h6>
              <p className="grey-text text-lighten-1" />
              We are a Central FL based team of web developers and wanted to
              create an application that would allow for gamers to come together
              and have a platform to play & compete on canvas / react games. Want to add
              your game?:{" "}
              <a href="https://github.com/matttali09/Rackers">Rackers Community</a>
            </div>
            <div className="col s12 m4">
              <h6 className="grey-text text-lighten-1">Team</h6>
              <p className="grey-text text-lighten-1">
                <li>
                  <a href="https://www.linkedin.com/in/matthew-taliancich-718970168/">
                    Matthew Taliancich
                  </a>
                </li>
                <li>
                  <a href="https://www.linkedin.com/in/carlocabrera/">
                    Carlo Cabrera
                  </a>
                </li>
              </p>
            </div>
          </div>
        </div>
        <div className="footer-copyright">
          <div className="container">
            <center>
              <p className="grey-text text-lighten-1">
                Copyright © {today.getFullYear()} All rights reserved | Made
                with <i className="far fa-heart" aria-hidden="true" /> by{" "}
                <i className="fas fa-gamepad">Rackers</i>
              </p>
            </center>
          </div>
        </div>
      </footer>
    );
  }
}

export default Footer;

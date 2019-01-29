import React, { Component } from "react";
import ReactDOM from "react-dom";
// import Entites from "./Entities.js";
// import Inventory from "./Inventory.js";
import Canvas from "./Canvas.js";


class Layout extends Component {
  constructor() {
    super();
    this.state = {
      name: "Carlo"
    };
  }
  clickedBtn = () => {
    console.log("swag");
  };
  render() {
    return (
      <div>
        <Canvas />
        {/* <Entities /> */}
        {/* <Inventory /> */}
      </div>
    );
  }
}

const app = document.getElementById("app");

ReactDOM.render(<Layout />, app);

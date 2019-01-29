import React, { Component } from "react";
// import Entites from "./Entities.js";
// import Inventory from "./Inventory.js";


export default class Canvas extends Component {
  constructor() {
    super();
    this.state = {
      name: "Carlo"
    };
    
  }

  

  render() {
    return (
      <div>
        <canvas
          id="canvas"
          width={640}
          height={360}
          style={{ border: "1px solid #000000" }}
        />
        <div id="inventory" />
        
      </div>
    );
  }
}

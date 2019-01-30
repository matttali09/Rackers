import React from "react";
import ReactDOM from "react-dom";

const CanvasComponent = React.createClass({
    propTypes: {
        render: React.PropTypes.func.isRequired,
    },

    componentDidMount() {
        this._canvas = ReactDOM.findDOMNode(this);
        this._ctx = this._canvas.getContext('2d');
        this.renderCanvas();
    },

    componentDidUpdate() {
        this.renderCanvas();
    },

    renderCanvas() {
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        this.props.render(this._ctx, this.props);
    },

    render() {
        return <canvas />;
    },
});

export default CanvasComponent;
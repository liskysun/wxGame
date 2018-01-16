import React, { Component } from "react";
import "./Screen.css";

class Screen extends Component {
  render() {
    return (
      <canvas
        className="Screen"
        width="256"
        height="240"
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.props.onMouseUp}
        ref={canvas => {
          this.canvas = canvas;
        }}
      />
    );
  }

  componentDidMount() {
    this.initCanvas();
  }

  initCanvas() {
    this.context = this.canvas.getContext("2d");
    this.imageData = this.context.getImageData(0, 0, 256, 240);

    this.context.fillStyle = "black";
    // set alpha to opaque
    this.context.fillRect(0, 0, 256, 240);

    // buffer to write on next animation frame
    this.buf = new ArrayBuffer(this.imageData.data.length);
    // Get the canvas buffer in 8bit and 32bit
    this.buf8 = new Uint8ClampedArray(this.buf);
    this.buf32 = new Uint32Array(this.buf);

    // Set alpha
    for (var i = 0; i < this.buf32.length; ++i) {
      this.buf32[i] = 0xff000000;
    }
  }

  setBuffer = buffer => {
    var i = 0;
    for (var y = 0; y < 240; ++y) {
      for (var x = 0; x < 256; ++x) {
        i = y * 256 + x;
        // Convert pixel from NES BGR to canvas ABGR
        this.buf32[i] = 0xff000000 | buffer[i]; // Full alpha
      }
    }
  };

  writeBuffer = () => {
    this.imageData.data.set(this.buf8);
    this.context.putImageData(this.imageData, 0, 0);
  };

  fitInParent = () => {
    //自适应窗口
    let parent = this.canvas.parentNode;
    let parentWidth = parent.clientWidth;
    let parentHeight = parent.clientHeight;
    let parentRatio = parentWidth / parentHeight;
    let desiredRatio = 256 / 240;
    if (desiredRatio < parentRatio) {
      //如果 "画布的宽长比" 比 "当前窗口的宽长比" 小时
      this.canvas.style.width = `${Math.round(parentHeight * desiredRatio)}px`;
      this.canvas.style.height = `${parentHeight}px`;
    } else {
      this.canvas.style.width = `${parentWidth}px`;
      this.canvas.style.height = `${Math.round(parentWidth / desiredRatio)}px`;
    }
  };

  screenshot() {
    var img = new Image();
    img.src = this.canvas.toDataURL("image/png");
    return img;
  }

  handleMouseDown = (e) => {
    if (!this.props.onMouseDown) return;
    // Make coordinates unscaled
    let scale = 256 / parseFloat(this.canvas.style.width);
    let rect = this.canvas.getBoundingClientRect();
    let x = Math.round((e.clientX - rect.left) * scale);
    let y = Math.round((e.clientY - rect.top) * scale);
    this.props.onMouseDown(x, y);
  };
}

export default Screen;

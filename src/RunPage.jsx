import React, { Component } from "react";
import { Button } from "reactstrap";
import { Link } from "react-router-dom";
import "./RunPage.css";
import config from "./config";
import ControlsModal from "./ControlsModal";
import FrameTimer from "./FrameTimer";
import KeyboardController from "./KeyboardController";
import Screen from "./Screen";
import Speakers from "./Speakers";
import { NES } from "jsnes";

  // window.onload = function() {
  //   var judgeStr = window.location.href;
  //   if(judgeStr.includes("run")){
  //     var keyBtnObj = document.getElementById("key-btn");

  //     var windowHeight = window.screen.height;
  //     var navHeight = 70;
  //     var screenHeightString = document.getElementById("screen-height").style.height;
  //     var screenHeight = parseInt(screenHeightString.substr(0, screenHeightString.length - 2));
  //     console.log(windowHeight);
  //     console.log(navHeight);
  //     console.log(screenHeight);
  //     keyBtnObj.style.height = windowHeight - navHeight - screenHeight + "px";
  //   }
  // }


function loadBinary(path, callback) {
  var req = new XMLHttpRequest();
  req.open("GET", path);
  req.overrideMimeType("text/plain; charset=x-user-defined");
  req.onload = function() {
    if (this.status === 200) {
      callback(null, this.responseText);
    } else {
      callback(new Error(req.statusText));
    }
  };
  req.onerror = function() {
    callback(new Error(req.statusText));
  };
  req.send();
}

class RunPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      running: false,
      paused: false,
      controlsModal: false
    };
  }

  render() {
    return (
      <div id="no-touch-move" className="RunPage">
        <div>
          <nav
            className="navbar navbar-expand"
            ref={el => {
              this.navbar = el;
            }}
          >
            <ul className="navbar-nav mr-auto">
              <li className="navitem">
                <Link id="back-link"to="/" className="nav-link">
                  &lsaquo; Back
                </Link>
              </li>
            </ul>
            <Button
              outline
              id="control-btn"
              onClick={this.toggleControlsModal}
              className="mr-3"
            >
              Controls
            </Button>
            <Button
              outline
              id="pause-btn"
              onClick={this.handlePauseResume}
              disabled={!this.state.running}
            >
              {this.state.paused ? "Resume" : "Pause"}
            </Button>

          </nav>
          </div>
        
        <div className="screen-container"
             id="screen-height"
             ref={el => {
              this.screenContainer = el;
            }}
        >
            <Screen
              ref={screen => {
                this.screen = screen;
              }}
              onGenerateFrame={() => {
                this.nes.frame();
              }}
              onMouseDown={(x, y) => {
                // console.log("mouseDown")
                this.nes.zapperMove(x, y);
                this.nes.zapperFireDown();
              }}
              onMouseUp={() => {
                // console.log("mouseUp")
                this.nes.zapperFireUp();
              }}
            />
              <ControlsModal
                isOpen={this.state.controlsModal}
                toggle={this.toggleControlsModal}
              />
        </div>
        <div id="key-btn">
            <div className="key-top-region"> 
              <div className="keys-start">
              <button 
              id="back-img"
              onClick={this.backList}
              >

              </button>
                <Button
                  outline
                  color="primary"
                  id="start-btn"
                  onClick={this.vitualJump}
                >
                </Button>
              </div>
              <div className="keys-select">
                <Button
                  outline
                  color="primary"
                  id="select-btn"
                  onClick={this.vitualJump}
                >
                </Button>
              </div>
            </div>

            <div className="key-bottom-region">

              <div className="direction-keys">

                <div className="keys-up">
                  <Button
                      outline
                      color="primary"
                      id="up-btn"
                      onClick={this.vitualJump}
                    >
                    </Button>
                </div>
                  <div className="keys-left">
                    <Button
                      outline
                      color="primary"
                      id="left-btn"
                      onClick={this.vitualJump}
                    >
                    </Button>  
                  </div>
                  <div className="keys-right">
                     <Button
                      outline
                      color="primary"
                      id="right-btn"
                      onClick={this.vitualJump}
                    >
                    </Button>
                  </div>
                <div className="keys-down">
                  <Button
                    outline
                    color="primary"
                    id="down-btn"
                    onClick={this.vitualJump}
                  >
                  </Button>
                </div>

              </div>

              <div className="function-keys">

                <div className="keys-b">
                  <Button
                    outline
                    color="primary"
                    id="b-btn"
                    onClick={this.vitualJump}
                  >
                  </Button>
                </div>
                <div className="keys-a" id="test-a">
                  <Button
                    outline
                    color="primary"
                    id="a-btn"
                    onClick={this.vitualJump}
                  >
                  </Button>
                </div>

              </div>
          </div>
          </div>
      </div>
    );
  }

  componentDidMount() {
    this.speakers = new Speakers({
      onBufferUnderrun: (actualSize, desiredSize) => {
        if (!this.state.running || this.state.paused) {
          return;
        }
        // Skip a video frame so audio remains consistent. This happens for
        // a variety of reasons:
        // - Frame rate is not quite 60fps, so sometimes buffer empties
        // - Page is not visible, so requestAnimationFrame doesn't get fired.
        //   In this case emulator still runs at full speed, but timing is
        //   done by audio instead of requestAnimationFrame.
        // - System can't run emulator at full speed. In this case it'll stop
        //    firing requestAnimationFrame.
        //liskysun console.log(
        //liskysun   "Buffer underrun, running another frame to try and catch up"
        //liskysun );
        this.nes.frame();
        // desiredSize will be 2048, and the NES produces 1468 samples on each
        // frame so we might need a second frame to be run. Give up after that
        // though -- the system is not catching up
        if (this.speakers.buffer.size() < desiredSize) {
          //liskysun console.log("Still buffer underrun, running a second frame");
          this.nes.frame();
        }
      }
    });
    this.nes = new NES({
      onFrame: this.screen.setBuffer,
      onStatusUpdate: console.log,
      onAudioSample: this.speakers.writeSample
    });

    this.frameTimer = new FrameTimer({
      onGenerateFrame: this.nes.frame,
      onWriteFrame: this.screen.writeBuffer
    });

    this.keyboardController = new KeyboardController({
      onButtonDown: this.nes.buttonDown,
      onButtonUp: this.nes.buttonUp
    });
    document.addEventListener("keydown", this.keyboardController.handleKeyDown);
    document.addEventListener("keyup", this.keyboardController.handleKeyUp);
    document.addEventListener("keypress",this.keyboardController.handleKeyPress);
    document.getElementById("a-btn").addEventListener("mousedown",this.keyboardController.aDown);
    document.getElementById("a-btn").addEventListener("mouseup",this.keyboardController.aUp);
    document.getElementById("b-btn").addEventListener("mousedown",this.keyboardController.bDown);
    document.getElementById("b-btn").addEventListener("mouseup",this.keyboardController.bUp);
    document.getElementById("left-btn").addEventListener("mousedown",this.keyboardController.leftDown);
    document.getElementById("left-btn").addEventListener("mouseup",this.keyboardController.leftUp);
    document.getElementById("up-btn").addEventListener("mousedown",this.keyboardController.upDown);
    document.getElementById("up-btn").addEventListener("mouseup",this.keyboardController.upUp);
    document.getElementById("down-btn").addEventListener("mousedown",this.keyboardController.downDown);
    document.getElementById("down-btn").addEventListener("mouseup",this.keyboardController.downUp);
    document.getElementById("right-btn").addEventListener("mousedown",this.keyboardController.rightDown);
    document.getElementById("right-btn").addEventListener("mouseup",this.keyboardController.rightUp);
    document.getElementById("select-btn").addEventListener("mousedown",this.keyboardController.selectDown);
    document.getElementById("select-btn").addEventListener("mouseup",this.keyboardController.selectUp);
    document.getElementById("start-btn").addEventListener("mousedown",this.keyboardController.startDown);
    document.getElementById("start-btn").addEventListener("mouseup",this.keyboardController.startUp);
    document.getElementById("a-btn").addEventListener("touchstart",this.keyboardController.aDown);
    document.getElementById("a-btn").addEventListener("touchend",this.keyboardController.aUp);
    // document.getElementById("test-a").addEventListener("touchstart",this.keyboardController.aDown);
    // document.getElementById("test-a").addEventListener("touchend",this.keyboardController.aUp);
    document.getElementById("b-btn").addEventListener("touchstart",this.keyboardController.bDown);
    document.getElementById("b-btn").addEventListener("touchend",this.keyboardController.bUp);
    document.getElementById("left-btn").addEventListener("touchstart",this.keyboardController.leftDown);
    document.getElementById("left-btn").addEventListener("touchend",this.keyboardController.leftUp);
    document.getElementById("up-btn").addEventListener("touchstart",this.keyboardController.upDown);
    document.getElementById("up-btn").addEventListener("touchend",this.keyboardController.upUp);
    document.getElementById("down-btn").addEventListener("touchstart",this.keyboardController.downDown);
    document.getElementById("down-btn").addEventListener("touchend",this.keyboardController.downUp);
    document.getElementById("right-btn").addEventListener("touchstart",this.keyboardController.rightDown);
    document.getElementById("right-btn").addEventListener("touchend",this.keyboardController.rightUp);
    document.getElementById("select-btn").addEventListener("touchstart",this.keyboardController.selectDown);
    document.getElementById("select-btn").addEventListener("touchend",this.keyboardController.selectUp);
    document.getElementById("start-btn").addEventListener("touchstart",this.keyboardController.startDown);
    document.getElementById("start-btn").addEventListener("touchend",this.keyboardController.startUp);

    window.addEventListener("resize", this.layout);
    this.layout();
    this.load();
  }
  componentWillUnmount() {
    this.stop();
    document.removeEventListener("keydown", this.keyboardController.handleKeyDown);
    document.removeEventListener("keyup", this.keyboardController.handleKeyUp);
    document.removeEventListener("keypress",this.keyboardController.handleKeyPress);
    window.removeEventListener("resize", this.layout);
  }

  load = () => {

    var noTouch = document.getElementById("no-touch-move");
    noTouch.ontouchmove = function(e){ e.preventDefault(); };

    if (this.props.match.params.rom) {
      const path = config.BASE_ROM_URL + this.props.match.params.rom;
      console.log(path);
      loadBinary(path, (err, data) => {
        if (err) {
          window.alert(`Error loading ROM: ${err.toString()}`);
        } else {
          this.handleLoaded(data);
        }
      });
    } else if (this.props.location.state && this.props.location.state.file) {
      let reader = new FileReader();
      reader.readAsBinaryString(this.props.location.state.file);
      reader.onload = e => {
        this.handleLoaded(e.target.result);
      };
    } else {
      window.alert("No ROM provided");
    }
  };

  handleLoaded = data => {
    //ÍÏ×§¼ÓÔØ
    this.setState({ uiEnabled: true, running: true });
    this.nes.loadROM(data);
    this.start();
  };

  start = () => {
    this.frameTimer.start();
    this.speakers.start();
    this.fpsInterval = setInterval(() => {
      console.log();
      // console.log(`FPS: ${this.nes.getFPS()}`);
    }, 1000);
  };

  stop = () => {
    this.frameTimer.stop();
    this.speakers.stop();
    clearInterval(this.fpsInterval);
  };

  handlePauseResume = () => {
    if (this.state.paused) {
      this.setState({ paused: false });
      this.start();
    } else {
      this.setState({ paused: true });
      this.stop();
    }
  };
  backList = _ => {
    window.location.href = "/";
  }
  layout = () => {
    // var windowHeight = window.screen.height;
    // var strFoo = document.body.scrollHeight;
    // console.log("strFoo:"+strFoo);
    // var navHeight = 70;
    // let screenHeight = 0.5*window.innerHeight;
    // keyBtnObj.style.height = windowHeight - screenHeight + "px";
    // this.screenContainer.style.height = `${window.innerHeight * 0.5}px`;

    var keyBtnObj = document.getElementById("key-btn");
    keyBtnObj.style.height = 0.5*window.innerHeight - 10 + "px";
    
    this.screenContainer.style.height = `${window.innerHeight * 0.5}px`;
    this.screenContainer.style.width = `${window.innerWidth}px`;
    this.screen.fitInParent();
  };

  toggleControlsModal = () => {
    this.setState({ controlsModal: !this.state.controlsModal });
  };
}

export default RunPage;

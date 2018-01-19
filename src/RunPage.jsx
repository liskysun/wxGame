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
      <div id="dont-move">
      <div className="screen-container" id="screen-height" ref={el => {this.screenContainer = el;}}>
          <Screen
            id="vertical-screen-true"
            ref={screen => { this.screen = screen;}}
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
        <div id="vertical-screen" className="RunPage">
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
                <div id="off-hidden" className="keys-off">
                  <Button
                    outline
                    color="primary"
                    id="off-btn"
                    onClick={this.switchListenerOn}
                  >
                  </Button>
                </div>
                <div id="on-hidden" className="keys-on">
                  <Button
                    outline
                    color="primary"
                    id="on-btn"
                    onClick={this.switchListenerOff}
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
                  <div className="keys-ac">
                    <div className="keys-a">
                      <Button
                        outline
                        color="primary"
                        id="a-btn"
                        onClick={this.vitualJump}
                      >
                      </Button>
                    </div>
                    <div className="keys-c">
                      <Button
                        outline
                        color="primary"
                        id="c-btn"
                        onClick={this.vitualJump}
                      >
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
          </div>
        </div>
        <div id="cross-screen" className="RunPage">
          <div id="screen-left" ref={el => {this.leftScreenContainer = el;}}>
              <div id="cross-start-btn">
                <Button
                  outline
                  color="primary"
                  id="cross-startBtn"
                >
                </Button>
              </div>
              <div id="cross-off-on-btn">
                <div id="cross-off-btn">
                  <Button
                    outline
                    color="primary"
                    id="cross-offbtn"
                    onClick={this.switchListenerOn}
                  >
                  </Button>
                </div>
                <div id="cross-on-btn">
                  <Button
                    outline
                    color="primary"
                    id="cross-onBtn"
                    onClick={this.switchListenerOff}
                  >
                  </Button>
                </div>
              </div>
              <div id="cross-up-btn">
                <Button
                  outline
                  color="primary"
                  id="cross-upBtn"
                >
                </Button>
              </div>
              <div id="cross-left-right-btn">
                <div id="cross-left-btn">

                <Button
                  outline
                  color="primary"
                  id="cross-leftBtn"
                >
                </Button>

                </div>
                <div id="cross-right-btn">
                <Button
                  outline
                  color="primary"
                  id="cross-rightBtn"
                >
                </Button>
                </div>
              </div>
              <div id="cross-down-btn">
                <Button
                  outline
                  color="primary"
                  id="cross-downBtn"
                >
                </Button>
              </div>
          </div>
          <div id="screen-right" ref={el => {this.rightScreenContainer = el;}}>
              <div id="cross-select-btn">
                <Button
                  outline
                  color="primary"
                  id="cross-selectBtn"
                >
                </Button>
              </div>
              <div id="cross-b-btn">
                <Button
                  outline
                  color="primary"
                  id="cross-bBtn"
                >
                </Button>
              </div>
              <div id="cross-a-btn">
                <Button
                  outline
                  color="primary"
                  id="cross-aBtn"
                >
                </Button>
              </div>
              <div id="cross-c-btn">
                <Button
                  outline
                  color="primary"
                  id="cross-cBtn"
                >
                </Button>
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
    //竖屏的监听
    this.keyAddListener("a-btn", "touchstart", this.keyboardController.aDown);
    this.keyAddListener("a-btn", "touchend", this.keyboardController.aUp);
    this.keyAddListener("c-btn", "touchstart", this.keyboardController.cDown);
    this.keyAddListener("c-btn", "touchend", this.keyboardController.cUp);
    this.keyAddListener("b-btn", "touchstart", this.keyboardController.bDown);
    this.keyAddListener("b-btn", "touchend", this.keyboardController.bUp);
    this.keyAddListener("left-btn", "touchstart", this.keyboardController.leftDown);
    this.keyAddListener("left-btn", "touchend", this.keyboardController.leftUp);
    this.keyAddListener("up-btn", "touchstart", this.keyboardController.upDown);
    this.keyAddListener("up-btn", "touchend", this.keyboardController.upUp);
    this.keyAddListener("down-btn", "touchstart", this.keyboardController.downDown);
    this.keyAddListener("down-btn", "touchend", this.keyboardController.downUp);
    this.keyAddListener("right-btn", "touchstart", this.keyboardController.rightDown);
    this.keyAddListener("right-btn", "touchend", this.keyboardController.rightUp);
    this.keyAddListener("select-btn", "touchstart", this.keyboardController.selectDown);
    this.keyAddListener("select-btn", "touchend", this.keyboardController.selectUp);
    this.keyAddListener("start-btn", "touchstart", this.keyboardController.startDown);
    this.keyAddListener("start-btn", "touchend", this.keyboardController.startUp);
    //横屏的监听
    this.keyAddListener("cross-aBtn", "touchstart", this.keyboardController.aDown);
    this.keyAddListener("cross-aBtn", "touchend", this.keyboardController.aUp);
    this.keyAddListener("cross-cBtn", "touchstart", this.keyboardController.cDown);
    this.keyAddListener("cross-cBtn", "touchend", this.keyboardController.cUp);
    this.keyAddListener("cross-bBtn", "touchstart", this.keyboardController.bDown);
    this.keyAddListener("cross-bBtn", "touchend", this.keyboardController.bUp);
    this.keyAddListener("cross-leftBtn", "touchstart", this.keyboardController.leftDown);
    this.keyAddListener("cross-leftBtn", "touchend", this.keyboardController.leftUp);
    this.keyAddListener("cross-upBtn", "touchstart", this.keyboardController.upDown);
    this.keyAddListener("cross-upBtn", "touchend", this.keyboardController.upUp);
    this.keyAddListener("cross-downBtn", "touchstart", this.keyboardController.downDown);
    this.keyAddListener("cross-downBtn", "touchend", this.keyboardController.downUp);
    this.keyAddListener("cross-rightBtn", "touchstart", this.keyboardController.rightDown);
    this.keyAddListener("cross-rightBtn", "touchend", this.keyboardController.rightUp);
    this.keyAddListener("cross-selectBtn", "touchstart", this.keyboardController.selectDown);
    this.keyAddListener("cross-selectBtn", "touchend", this.keyboardController.selectUp);
    this.keyAddListener("cross-startBtn", "touchstart", this.keyboardController.startDown);
    this.keyAddListener("cross-startBtn", "touchend", this.keyboardController.startUp);

    window.addEventListener("orientationchange", function() {
      var screenSt = (window.innerHeight)/(window.innerWidth);
      if(screenSt<1){
        //变成竖屏
        document.getElementById("vertical-screen").style.display="block";
        document.getElementById("cross-screen").style.display="none";
      }else{
        //变成横屏
        document.getElementById("vertical-screen").style.display="none";
        document.getElementById("cross-screen").style.display="block";
      }
    }, false);
    window.addEventListener("resize", this.layout);
    this.layout();
    this.load();
  }

  keyAddListener(domKey, eventKey, funKey) {
    document.getElementById(domKey).addEventListener(eventKey,funKey);
  }

  componentWillUnmount() {
    this.stop();
    document.removeEventListener("keydown", this.keyboardController.handleKeyDown);
    document.removeEventListener("keyup", this.keyboardController.handleKeyUp);
    document.removeEventListener("keypress",this.keyboardController.handleKeyPress);
    window.removeEventListener("resize", this.layout);
  }

  load = () => {
    //禁止桌面拖动
    var screenSt = (window.innerHeight)/(window.innerWidth);
    if(screenSt<1){
      //变成竖屏
      document.getElementById("vertical-screen").style.display="none";
      document.getElementById("cross-screen").style.display="block";
    }else{
      //变成横屏
      document.getElementById("vertical-screen").style.display="block";
      document.getElementById("cross-screen").style.display="none";
    }

    var dontMove = document.getElementById("dont-move");
    dontMove.ontouchmove = function(e){ e.preventDefault(); };
    //禁止微信弹以浏览器打开
    document.oncontextmenu = function (e) { e.preventDefault();};

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
  };

  switchListenerOn = _ => {
    //添加新监听
    // console.log("D");
    var offBtn = document.getElementById("off-hidden");
    var onBtn = document.getElementById("on-hidden");
    var crossOffBtn = document.getElementById("cross-off-btn");
    var crossOnBtn = document.getElementById("cross-on-btn");

    offBtn.style.display = "none";
    onBtn.style.display = "inline-block";
    crossOffBtn.style.display = "none";
    crossOnBtn.style.display = "inline-block";

    document.getElementById("a-btn").addEventListener("touchstart",this.keyboardController.aLoopDown);
    document.getElementById("cross-aBtn").addEventListener("touchstart",this.keyboardController.aLoopDown);

    document.getElementById("b-btn").addEventListener("touchstart",this.keyboardController.bLoopDown);
    document.getElementById("cross-bBtn").addEventListener("touchstart",this.keyboardController.bLoopDown);

    document.getElementById("c-btn").addEventListener("touchstart",this.keyboardController.cLoopDown);
    document.getElementById("cross-cBtn").addEventListener("touchstart",this.keyboardController.cLoopDown);
  };

  switchListenerOff = _ => {
    var offBtn = document.getElementById("off-hidden");
    var onBtn = document.getElementById("on-hidden");
    var crossOffBtn = document.getElementById("cross-off-btn");
    var crossOnBtn = document.getElementById("cross-on-btn");

    offBtn.style.display = "inline-block";
    onBtn.style.display = "none";
    crossOffBtn.style.display = "inline-block";
    crossOnBtn.style.display = "none";

    document.getElementById("a-btn").addEventListener("touchstart",this.keyboardController.aDown);
    document.getElementById("cross-aBtn").addEventListener("touchstart",this.keyboardController.aDown);

    document.getElementById("b-btn").addEventListener("touchstart",this.keyboardController.bDown);
    document.getElementById("cross-bBtn").addEventListener("touchstart",this.keyboardController.bDown);

    document.getElementById("c-btn").addEventListener("touchstart",this.keyboardController.cDown);
    document.getElementById("cross-cBtn").addEventListener("touchstart",this.keyboardController.cDown);
  };

  layout = () => {
    //竖屏
    var keyBtnObj = document.getElementById("key-btn");
    keyBtnObj.style.height = 0.5*window.innerHeight - 10 + "px";
    //横屏
    this.leftScreenContainer.style.height = `${window.innerHeight}px`
    this.rightScreenContainer.style.height = `${window.innerHeight}px`
    var screenSt = (window.innerHeight)/(window.innerWidth);
    if(screenSt<1){
      // 横屏
    this.screenContainer.style.height = `${window.innerHeight}px`;
    this.screenContainer.style.width = `${window.innerWidth*0.6}px`;
    this.screenContainer.style.marginLeft = `20%`;
    }else{
    this.screenContainer.style.height = `${window.innerHeight * 0.5}px`;
    this.screenContainer.style.width = `${window.innerWidth}px`;
    this.screenContainer.style.marginLeft = `0%`;
  }
    this.screen.fitInParent();
  };

  toggleControlsModal = () => {
    this.setState({ controlsModal: !this.state.controlsModal });
  };
}

export default RunPage;

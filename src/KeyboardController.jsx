import {
  Controller
} from "jsnes";


// Mapping keyboard code to [controller, button]
const KEYS = {
  74: [1, Controller.BUTTON_A], // J
  89: [1, Controller.BUTTON_B], // Y (Central European keyboard)
  90: [1, Controller.BUTTON_B], // Z
  17: [1, Controller.BUTTON_SELECT], // Right Ctrl菜单选择
  13: [1, Controller.BUTTON_START], // Enter
  87: [1, Controller.BUTTON_UP], // W
  83: [1, Controller.BUTTON_DOWN], // S
  65: [1, Controller.BUTTON_LEFT], // A
  68: [1, Controller.BUTTON_RIGHT], // D
  103: [2, Controller.BUTTON_A], // Num-7
  105: [2, Controller.BUTTON_B], // Num-9
  99: [2, Controller.BUTTON_SELECT], // Num-3
  97: [2, Controller.BUTTON_START], // Num-1
  104: [2, Controller.BUTTON_UP], // Num-8
  98: [2, Controller.BUTTON_DOWN], // Num-2
  100: [2, Controller.BUTTON_LEFT], // Num-4
  102: [2, Controller.BUTTON_RIGHT], // Num-6
};


export default class KeyboardController {
  constructor(options) {
    this.onButtonDown = options.onButtonDown;
    this.onButtonUp = options.onButtonUp;
  }

  handleKeyDown = e => {
    var key = KEYS[e.keyCode];
    if (key) {
      this.onButtonDown(key[0], key[1]);
      e.preventDefault();
    }
  };

  handleKeyUp = e => {
    var key = KEYS[e.keyCode];
    if (key) {
      this.onButtonUp(key[0], key[1]);
      e.preventDefault();
    }
  };

  handleKeyPress = e => {
    e.preventDefault();
  };

  startDown = _ => {
    var key = KEYS[13];
    this.onButtonDown(key[0], key[1]);
  };

  startUp = _ => {
    var key = KEYS[13];
    this.onButtonUp(key[0], key[1]);
  };

  selectDown = _ => {
    var key = KEYS[17];
    this.onButtonDown(key[0], key[1]);
  };

  selectUp = _ => {
    var key = KEYS[17];
    this.onButtonUp(key[0], key[1]);
  };

  cDown = _ => {
    var keya = KEYS[74];
    var keyb = KEYS[90];
    this.onButtonDown(keya[0], keya[1]);
    this.onButtonDown(keyb[0], keyb[1]);
  };

  cUp = _ => {
    var keya = KEYS[74];
    var keyb = KEYS[90];
    this.onButtonUp(keya[0], keya[1]);
    this.onButtonUp(keyb[0], keyb[1]);
  };
  cLoopDown = _ => {
    var offBtn = document.getElementById("off-hidden");
    var offBtnSt = offBtn.style.display;

    var keya = KEYS[74];
    var keyb = KEYS[90];

    if(offBtnSt === "none"){
      var cReturn = _ => {
        // console.log("延时:10000ms");
        this.onButtonUp(keya[0], keya[1]);
        this.onButtonUp(keyb[0], keyb[1]);
      }
      this.onButtonDown(keya[0], keya[1]);
      this.onButtonDown(keyb[0], keyb[1]);
      setTimeout(cReturn, 350);//设置跳起结束时间
      setTimeout(this.cLoopDown, 374);//重新跳起时间
    }

  };
  aDown = _ => {
    var key = KEYS[74];
    this.onButtonDown(key[0], key[1]);
  };

  aUp = _ => {
    var key = KEYS[74];
    this.onButtonUp(key[0], key[1]);
  };

  aLoopDown = _ => {
    var offBtn = document.getElementById("off-hidden");
    var offBtnSt = offBtn.style.display;
    var key = KEYS[74];

    if(offBtnSt === "none"){
      var aReturn = _ => {
        // console.log("延时:10000ms");
        this.onButtonUp(key[0], key[1]);
      }
      this.onButtonDown(key[0], key[1]);
      setTimeout(aReturn, 350);//设置跳起结束时间
      setTimeout(this.aLoopDown, 374);//重新跳起时间
    }

  };

  bDown = _ => {
    var key = KEYS[90];
    this.onButtonDown(key[0], key[1]);
  };

  bUp = _ => {
    var key = KEYS[90];
    this.onButtonUp(key[0], key[1]);
  };

  bLoopDown = _ => {
    var offBtn = document.getElementById("off-hidden");
    var offBtnSt = offBtn.style.display;
    var key = KEYS[90];

    if(offBtnSt === "none"){
      var bReturn = _ => {
        // console.log("延时:10000ms");
        this.onButtonUp(key[0], key[1]);
      }
      this.onButtonDown(key[0], key[1]);
      setTimeout(bReturn, 350);//设置跳起结束时间
      setTimeout(this.bLoopDown, 374);//重新跳起时间
    }

  };

  leftDown = _ => {
    var key = KEYS[65];
    this.onButtonDown(key[0], key[1]);
  };

  leftUp = _ => {
    var key = KEYS[65];
    this.onButtonUp(key[0], key[1]);
  };

  rightDown = _ => {
    var key = KEYS[68];
    this.onButtonDown(key[0], key[1]);
  };

  rightUp = _ => {
    var key = KEYS[68];
    this.onButtonUp(key[0], key[1]);
  };

  upDown = _ => {
    var key = KEYS[87];
    this.onButtonDown(key[0], key[1]);
  };

  upUp = _ => {
    var key = KEYS[87];
    this.onButtonUp(key[0], key[1]);
  };

  downDown = _ => {
    var key = KEYS[83];
    this.onButtonDown(key[0], key[1]);
  };

  downUp = _ => {
    var key = KEYS[83];
    this.onButtonUp(key[0], key[1]);
  };

}

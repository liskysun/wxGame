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
    this.btnDown(13);
  };

  startUp = _ => {
    this.btnUp(13);
  };

  selectDown = _ => {
    this.btnDown(17);
  };

  selectUp = _ => {
    this.btnUp(17);
  };

  cDown = _ => {
    this.btnDown(74);
    this.btnDown(90);
  };

  cUp = _ => {
    this.btnUp(74);
    this.btnUp(90);
  };

  aDown = _ => {
    this.btnDown(74);
  };

  aUp = _ => {
    this.btnUp(74);
  };

  bDown = _ => {
    this.btnDown(90);
  };

  bUp = _ => {
    this.btnUp(90);
  };

  leftDown = _ => {
    this.btnDown(65);
  };

  leftUp = _ => {
    this.btnUp(65);
  };

  rightDown = _ => {
    this.btnDown(68);
  };

  rightUp = _ => {
    this.btnUp(68);
  };

  upDown = _ => {
    this.btnDown(87);

  };

  upUp = _ => {
    this.btnUp(87);
  };

  downDown = _ => {
    this.btnDown(83);

  };

  downUp = _ => {
    this.btnUp(83);
  };

  aLoopDown = _ => {
    var offBtnSt = this.getBtnSt();
    if (offBtnSt === "none") {
      //为了获取btn改变的状态使其停止
      this.btnLoopDown(74);
      setTimeout(this.aLoopDown, 374);
    }
  };

  bLoopDown = _ => {
    var offBtnSt = this.getBtnSt();
    if (offBtnSt === "none") {
      this.btnLoopDown(90);
      setTimeout(this.bLoopDown, 374);
    }
  };

  cLoopDown = _ => {
    var offBtnSt = this.getBtnSt();
    if (offBtnSt === "none") {
      this.btnLoopDown(74);
      this.btnLoopDown(90);
      setTimeout(this.cLoopDown, 374);
    }
  };
  
  getBtnSt = _ => {
    var offBtn = document.getElementById("off-hidden");
    //当打开连发返回游戏列表页面,防止报null错误
    if (offBtn === null) {
      offBtn = document.getElementById("root");
    }
    var offBtnSt = offBtn.style.display;
    return offBtnSt;
  };

  btnDown = (btnNum) => {
    var key = KEYS[btnNum];
    this.onButtonDown(key[0], key[1]);
  };

  btnUp = (btnNum) => {
    var key = KEYS[btnNum];
    this.onButtonUp(key[0], key[1]);
  };

  btnLoopDown = (btnNum) => {
      var key = KEYS[btnNum];
      //作为转变状态后停止的开关
      var btnReturn = _ => {
        this.onButtonUp(key[0], key[1]);
      }
      //设置跳起结束时间 350ms此时间后 
      // 执行啊aReturn()方法恢复按键的状态(弹起)
      this.onButtonDown(key[0], key[1]);
      //重新跳起时间 374ms此时间后 
      // 再次调用aLoopDown循环这个过程
      setTimeout(btnReturn, 350);
  };

}
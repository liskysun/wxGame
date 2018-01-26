import RingBuffer from "ringbufferjs";

export default class Speakers {
  constructor({onBufferUnderrun}) {

    this.onBufferUnderrun = onBufferUnderrun;
    this.bufferSize = 8192;
    //nes中audio的buffer
    this.buffer = new RingBuffer(this.bufferSize * 2);
  }

  start() {
    // Audio is not supported
    if (!window.AudioContext) {
      return;
    }
    window.AudioContext = window.AudioContext || window.webkitAudioContext || 
      window.mozAudioContext || window.msAudioContext;
    //创建AudioContext对象
    this.audioCtx = new window.AudioContext();
    //创建scriptNode用于通过js直接处理音频
    this.scriptNode = this.audioCtx.createScriptProcessor(1024, 0, 32);
    //第一个参数 为缓冲区大小,如果不传递或为零.那么取当前环境最合适的缓冲区大小,且该node的整个生命周期中都不变
    //第二个参数 为输入node声道的数量,默认为2,最高取32
    //第三个参数 为输出node声道的数量,默认为2,最高取32
    console.log(this.scriptNode);
    //绑定 audioprocess事件
    this.scriptNode.onaudioprocess = this.onaudioprocess;
    // 连接 最终输出源
    // 为 window.AudioContext所在destination
    this.scriptNode.connect(this.audioCtx.destination);
  }

  stop() {
    
    if (this.scriptNode) {
      // 断开 最终输出源
      this.scriptNode.disconnect(this.audioCtx.destination);
      // 清除外界scriptprocess事件
      this.scriptNode.onaudioprocess = null;
    }
    if (this.audioCtx) {
      //关闭音频环境 释放使用音频的系统资源
      this.audioCtx.close();
    }
  }

  writeSample = (left, right) => {
    if (this.buffer.size() / 2 >= this.bufferSize) {
      // console.log(`Buffer overrun`);
    }
    this.buffer.enq(left);
    this.buffer.enq(right);
    // setTimeout(this.writeSample,1000);
  }

  onaudioprocess = (e) => {
    // 参数"e"是一个AudioBuffer
    // 音频数组缓冲区
    // 由频道参数定义（0代表第一个频道）
    var left = e.outputBuffer.getChannelData(0);
    // 由频道参数定义（1代表第二个频道）
    var right = e.outputBuffer.getChannelData(1);

    var size = left.length;

    // We're going to buffer underrun. Attempt to fill the buffer.
    if (this.buffer.size() < size * 2 && this.onBufferUnderrun) {
      this.onBufferUnderrun(this.buffer.size(), size * 2);
    }

    try {
      var samples = this.buffer.deqN(size * 2);
    } catch (e) {
      // onBufferUnderrun failed to fill the buffer, so handle a real buffer
      // underrun
      // ignore empty buffers... assume audio has just stopped
      var bufferSize = this.buffer.size() / 2;
      if (bufferSize > 0) {
        // console.log(`Buffer underrun (needed ${size}, got ${bufferSize})`);
      }
      for (var j = 0; j < size; j++) {
        left[j] = 0;
        right[j] = 0;
      }
      return;
    }
    for (var i = 0; i < size; i++) {
      left[i] = samples[i * 2];
      right[i] = samples[i * 2 + 1];
    }

  };
}

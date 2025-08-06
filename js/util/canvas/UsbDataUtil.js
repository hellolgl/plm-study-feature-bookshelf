export default class UsbDataUtil {
  constructor() {
    this.toServeX = new Array();
    this.toServeY = new Array();
    this.toServeXY = new Array();
    this.lastX = 0;
    this.lastY = 0;
  }
  static canvasCount = 0;

  initListX = (data) => {
    this.toServeX = [...data]
  }

  initListY = (data) => {
    this.toServeY = [...data]
  }

  initListXY = (data) => {
    // console.log(this.toServeXY)
    if (data.usbCanvasDataPressure > 0) {
      if (+this.lastX != +data.usbCanvasDataX || +this.lastY != +data.usbCanvasDataY) {
        this.lastX = data.usbCanvasDataX
        this.lastY = data.usbCanvasDataY
        this.toServeX.push(data.usbCanvasDataX);
        this.toServeY.push(data.usbCanvasDataY);
      }

    } else {
      if (this.toServeX.length > 0) {
        // this.toServeX = [...new Set(this.toServeX)]
        // this.toServeY = [...new Set(this.toServeY)]
        this.toServeXY.push([this.toServeX, this.toServeY]);
        this.toServeX = new Array();
        this.toServeY = new Array();
      }
    }
  }

  clearListXY = () => {
    //console.log('usbUtil ClearListXY',this.toServeXY)
    this.toServeXY = new Array();
  }
}
/**
 *
 * 基于webview的Canvas画布
 */
import React, { PureComponent, Component } from "react";
import { StyleSheet, View, Text, Image, Platform } from "react-native";
import {
  isURL,
  pxToDp,
  pxToDpHeight,
  pxToDpWidth,
  getIsTablet,
  pxToDpWidthLs,
} from "../../util/tools";
import RenderHtml from "react-native-render-html";

const systemFonts = ["JiangCheng-Pai-Medium", "JiangCheng-Pai-Bold"];

const SIZE_MAP = {
  28: pxToDp(28),
  32: pxToDp(32),
  36: pxToDp(36),
  40: pxToDp(40),
  48: pxToDp(48),
  50: pxToDp(50),
  52: pxToDp(52),
  60: pxToDp(60),
  70: pxToDp(70),
  80: pxToDp(80),
};

class RichShowViewHtml extends PureComponent {
  constructor(props) {
    super(props);
    this.width_index = 0;
    this.state = {
      value: "",
      arr: [],
      img_length: 0,
      show: false,
      isPhone: !getIsTablet(),
    };
  }

  static getDerivedStateFromProps(props, state) {
    let tempState = { ...state };
    if (props.value && tempState.value !== props.value) {
      tempState.value = props.value;
      var imgReg = /<img.*?(?:>|\/>)/gi;
      // 匹配src属性
      var img_arr = props.value.match(imgReg);
      tempState.img_length = img_arr ? img_arr.length : 0;
      tempState.show = true;
      return tempState;
    }
  }

  componentDidMount() {
    // console.log('______________________________________________',this.props)
    if (!this.props.value) return;
    this.getImgWidth(this.props.value).then((res) => {
      this.setState({
        arr: res,
        show: true,
      });
    });
  }

  getImgWidth(html) {
    const { img_length } = this.state;
    var imgReg = /<img.*?(?:>|\/>)/gi;
    // 匹配src属性
    var srcReg = /src=[\\"]?([^\\"]*)[\\"]?/i;
    var img_arr = html.match(imgReg);
    let width_arr = [];
    return new Promise(async (resolve, reject) => {
      if (img_arr) {
        // 富文本有图片
        for (let i = 0; i < img_arr.length; i++) {
          var src = img_arr[i].match(srcReg)[1].replace(/\s*/g, "");
          let width = await this.getWidth(src);
          width_arr.push(width);
          if (width_arr.length === img_length) {
            resolve(width_arr);
          }
        }
      } else {
        resolve([]);
      }
    });
  }

  getWidth = (src) => {
    return new Promise((resolve, reject) => {
      Image.getSize(
        src,
        (width, height) => {
          resolve(width);
        },
        () => {
          // 获取图片信息失败回调
          resolve(pxToDp(1450));
        }
      );
    });
  };

  onElement = (element) => {
    const { arr, isPhone } = this.state;
    const { tagName } = element;
    const { max_image_width } = this.props;
    let now_image_max_width = max_image_width ? max_image_width : pxToDp(1450);
    if (tagName === "img") {
      let max_width = 0;
      // if (max_image_width) {
      //   max_width =
      //     arr[this.width_index] > max_image_width
      //       ? max_image_width
      //       : arr[this.width_index];
      // } else {
      max_width =
        arr[this.width_index] > now_image_max_width
          ? now_image_max_width
          : arr[this.width_index];
      // }

      element.attribs.style = `max-width:${max_width}px`;
      element.attribs.src = element.attribs.src.replace(/\s*/g, "");
      if (
        element.attribs.width &&
        element.attribs.width.indexOf("%") === -1 &&
        element.attribs.width < now_image_max_width
      ) {
        // 图片本身有在pc端设置过宽度
        element.attribs.style = `max-width:${element.attribs.width}px`;
      }
      this.width_index++;
      if (this.width_index >= arr.length) this.width_index = 0;
    }
    if (tagName === "span") {
      let color = element.attribs.color;
      if (color) element.attribs.style = `color:${color}`;
    }
  };

  filterValue = (value) => {
    if (!value) return "";
    const { haveStyle } = this.props;
    //   console.log('before_______',value)
    let v = value
      .replaceAll("font-family", "")
      .replaceAll("font-size", "")
      .replaceAll("font", "span")
      .replace(/\s+style="[^"]*"/g, "");
    //  console.log('after________',v)
    if (haveStyle) {
      v = value
        .replaceAll("font-family", "")
        .replaceAll("font-size", "")
        .replaceAll("font", "span");
    }
    return v;
  };

  render() {
    //  console.log('RichShowView render————————————————————————————————————————',this.filterValue(this.props.value))
    const {
      value,
      containerStyle,
      size,
      color,
      p_style,
      fontFamily,
      span_style,
    } = this.props;
    const { show } = this.state;
    // console.log(
    //   "RichShowView render————————————————————————————————————————",
    //   this.state.value,
    //   show
    // );

    if (!show) return null;
    let source = {
      html: `<div>${this.filterValue(value)}</div>`,
    };
    let tagsStyles = {
      p: {
        fontFamily: fontFamily ? fontFamily : "JiangCheng-Pai-Medium",
        margin: 0,
        padding: 0,
        color: color ? color : "#4c4c59",
        ...(size
          ? { fontSize: SIZE_MAP[size], lineHeight: SIZE_MAP[size] + 10 }
          : { fontSize: pxToDp(40) }),
        ...(p_style ? p_style : {}),
      },
      span: {
        fontFamily: fontFamily ? fontFamily : "JiangCheng-Pai-Medium",
        margin: 0,
        padding: 0,
        color: color ? color : "#4c4c59",
        ...(size
          ? { fontSize: SIZE_MAP[size], lineHeight: SIZE_MAP[size] + 10 }
          : { fontSize: pxToDp(40) }),
        ...(span_style ? span_style : {}),
      },
      div: {
        fontFamily: fontFamily ? fontFamily : "JiangCheng-Pai-Medium",
        margin: 0,
        padding: 0,
        color: color ? color : "#4c4c59",
        ...(size
          ? { fontSize: SIZE_MAP[size], lineHeight: SIZE_MAP[size] + 10 }
          : { fontSize: pxToDp(40) }),
      },
      h3: {
        fontFamily: fontFamily ? fontFamily : "JiangCheng-Pai-Medium",
        margin: 0,
        padding: 0,
        color: color ? color : "#4c4c59",
        ...(size
          ? {
              fontSize: SIZE_MAP[size] + 5,
              lineHeight: SIZE_MAP[size] + 10 + 15,
            }
          : { fontSize: pxToDp(40) }),
      },
    };
    return (
      <RenderHtml
        source={source}
        tagsStyles={tagsStyles}
        baseStyle={containerStyle}
        systemFonts={systemFonts}
        domVisitors={{
          onElement: (e) => {
            this.onElement(e);
          },
        }}
      />
    );
  }
}

const styles = StyleSheet.create({});

export default RichShowViewHtml;

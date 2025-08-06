import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  PanResponder,
  Platform,
  ImageBackground,
} from "react-native";
// import Util from './common/util'
import PinYinModule from "../../../../../../component/chinese/pinyin/PinYinModule";
import _ from "lodash";
import { appStyle, appFont } from "../../../../../../theme";
import {
  size_tool,
  pxToDp,
  padding_tool,
  fontFamilyRestoreMargin,
} from "../../../../../../util/tools";
import NavigationUtil from "../../../../../../navigator/NavigationUtil";
import url from "../../../../../../util/url";
import { sizeObj } from "../../../../../../component/chinese/pinyin/size";
class SvgDrawTest extends Component {
  constructor(props) {
    super(props);
    this.allPoint = "";
    this.line_start_x = -1;
    this.line_start_y = -1;
    this.line_end_x = -1;
    this.line_end_y = -1;
    this.temp_point_mat = [];
    this.all_point_mat = [];
    this.stroke_width = 20; //线条宽度
    this.state = {
      // drawPath: 'M25 10 L98 65 L70 25 L16 77 L11 30 L0 4 L90 50 L50 10 L11 22 L77 95 L20 25'
      drawPath: "", // 绘制轨迹
      draw_all_svg: [], // 全局线条绘制
      draw_temp_svg: [], // 临时轨迹线
    };
  }
  componentWillMount() {
    // 初始化渲染
    // 引用类计算
  }

  componentDidMount() {
    console.log("后渲染");
  }
  _getData(data_dict) {
    console.log("回传数据------data_dict.temp_data", data_dict.temp_data);
    console.log("回传数据------data_dict.all_data", data_dict.all_data);
  }
  goBack = () => {
    NavigationUtil.goBack(this.props);
  };
  render() {
    // console.log('绘制渲染-------this.state.slider_end_x - this.state.slider_start_x',)
    // 组装数据
    let frame_width = pxToDp(800); // 组件宽度
    let frame_height = pxToDp(650); // 组件高度
    let stroke_width = pxToDp(40); // 线宽
    let img_uri = { uri: `${url.baseURL}pinyin/alphabet_image/${"b"}.png` }; // 图形uri
    // img_uri = { uri: '' } // 传空字符串
    let img_resource = `require('./img4.png') `; // 本地源图像
    let know = this.props.data.knowledge_point;
    let pinyin_mat = know.split(""); // 字符串组
    // pinyin_mat = ['b', 'j', 'm']         // 字符串组
    let img_resource_mat = {};
    let width = 0;
    pinyin_mat.forEach((item, index) => {
      img_resource_mat[item] = {
        uri: `${url.baseURL}pinyin/alphabet_image/${item}.png`,
      };
      width += sizeObj[item].width;
      width -= 1;
    });
    frame_width = pxToDp(width);
    // let img_resource_mat = {
    //     'b': img_uri,
    //     'p': require('../../../../../../images/chineseHomepage/pingyin/1/img_p.png'),
    //     'm': require('../../../../../../images/chineseHomepage/pingyin/1/img_m.png'),
    //     'j': require('../../../../../../images/chineseHomepage/pingyin/1/img_j.png'),
    // }   // 字母字符串组

    return (
      <View style={[{ flex: 1, position: "relative" }, appStyle.flexCenter]}>
        <ImageBackground
          source={require("../../../../../../images/chineseHomepage/pingyin/new/pinyinWriteBg.png")}
          style={[appStyle.flexCenter, , size_tool(1648, 650)]}
        >
          {/* <View style={[{ flex: 1, width: '100%', backgroundColor: 'pink' }]}> */}
          <PinYinModule
            resetToLogin={() => {
              NavigationUtil.resetToLogin(this.props);
            }}
            width={frame_width}
            height={frame_height}
            stroke_width={stroke_width}
            img_uri={img_uri}
            img_resource={img_resource}
            pinyin_mat={pinyin_mat}
            img_resource_mat={img_resource_mat}
            _getData={this._getData.bind(this)}
            p_id={this.props.data.p_id}
            showStar={this.props.showStar}
          />
          {/* </View> */}
        </ImageBackground>
      </View>
    );
  }
}

export default SvgDrawTest;

import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
} from "react-native";
import { appStyle,appFont } from "../../theme";
import { size_tool, pxToDp, padding_tool, fontFamilyRestoreMargin } from "../../util/tools";
import NavigationUtil from "../../navigator/NavigationUtil";
import RichShowView from "./RichShowView";
import CorrectionCheck from "../CorrectionCheck";
import url from "../../util/url";
import ViewControl from "react-native-image-pan-zoom";
import axios from '../../util/http/axios'
import api from '../../util/http/api'
import { Toast } from "antd-mobile-rn";
let baseURL = url.baseURL;
class SpeSentenceTreeModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      bottomList: [],
      currentNode: {},
      currentNodeIndex: -1
    };
    this.infoData = props.infoData
    this.currentNode = {}
  }
  getData = (knowledge_code, currentNodeLeval) => {
    // api.knowledgeSystem + this.props.preOrigin + '/' + this.props.userInfo.id + '?knowledge_code=' + knowledge_code + '&code=' + this.props.code+'&element_type='+1
    axios.get(api.getChinspect + '?iid=' + knowledge_code).then(
      res => {
        if (currentNodeLeval === 1) {
          this.setState({
            bottomList: res.data.data
          })
          return
        }
        let list = JSON.parse(JSON.stringify(res.data.data))
        list.forEach((i) => {
          i.isActive = false
        })
        this.setState({
          list
        })
      }
    )
  }

  nodeClick = (currentNode, currentNodeIndex) => {
    const { list } = this.state
    this.getData(currentNode.iid, currentNode.level)
    if (currentNodeIndex || currentNodeIndex === 0) {
      list.forEach((i, index) => {
        i.isActive = false
        if (currentNodeIndex === index) i.isActive = true
      })
      this.setState({
        list,
        currentNode,
        currentNodeIndex: currentNode.level === 1 ? currentNodeIndex : -1
      })
    }
  }
  goExplain = () => {
    console.log(this.state.currentNodeIndex)
    const currentNodeIndex = this.state.currentNodeIndex
    if (currentNodeIndex > -1) {
      this.props.goExplain(this.state.currentNode)
    } else {
      Toast.info("请选择练习类型", 1, undefined, false);
    }

  }
  renderLeval = () => {
    const { list, bottomList } = this.state
    let arr = []
    list.map((item, index) => {
      arr.push(
        <>
          <TouchableOpacity style={{ paddingTop: pxToDp(40) }} key={index} onPress={() => { this.nodeClick(item, index) }}>
            <ImageBackground
              source={require("../../images/treeBtn_bg2.png")}
              key={item.iid}
              style={[
                {
                  height: pxToDp(102), width: pxToDp(176),
                  paddingLeft: pxToDp(12),
                  paddingRight: pxToDp(12),
                },
                appStyle.flexCenter
              ]}
              resizeMode={'stretch'}
            >
              <Text style={[{ fontSize: pxToDp(32), color: "#fff" },appFont.fontFamily_syst]}>
                {item.name}
              </Text>
              {item.isActive && bottomList.length > 0 ? <ImageBackground source={require("../../images/line1.png")} style={[styles.line3]} resizeMode={'cover'}></ImageBackground> : null}
              {item.isActive ? <Image style={[styles.activeIcon]} source={require("../../images/chineseDailyActive.png")} ></Image> : null}
            </ImageBackground>
          </TouchableOpacity>

          {index === list.length - 1 ? null : <ImageBackground source={require("../../images/line2.png")} style={[styles.line2]} resizeMode={'cover'}></ImageBackground>}

        </>

      )
    })
    let tempView = (
      <ScrollView horizontal={true} style={[{ maxWidth: pxToDp(1900), marginTop: pxToDp(12), height: pxToDp(190), zIndex: 2 }]} contentContainerStyle={{ justifyContent: 'center', minWidth: pxToDp(1220) }}>
        {arr}
      </ScrollView>
    )
    return tempView
  }
  render() {
    const { list, bottomList } = this.state;

    return (
      <View style={[appStyle.flexAliCenter]}>
        <TouchableOpacity onPress={() => { this.nodeClick(this.infoData, 0) }}>
          <ImageBackground
            source={require("../../images/treeBtn_bg1.png")}
            resizeMode={'contain'}
            style={[
              {
                height: pxToDp(80), width: pxToDp(252),
                paddingLeft: pxToDp(12),
                paddingRight: pxToDp(12),
                alignItems: 'center',
                justifyContent: 'center'
              },
            ]}
          >
            <Text style={[{ fontSize: pxToDp(32), color: "#fff" },appFont.fontFamily_syst]}>{this.infoData.inspect_name}</Text>
          </ImageBackground>
        </TouchableOpacity>
        {list.length > 0 ? <ImageBackground source={require("../../images/line1.png")} style={[styles.line1]} resizeMode={'cover'}></ImageBackground> : null}
        {this.renderLeval()}
        {bottomList.length > 0 ?
          <ImageBackground source={require("../../images/tree_bg.png")} style={[styles.level2Content]} resizeMode={'stretch'}>
            <ScrollView style={{ maxHeight: pxToDp(430) }} contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap' }}>

              {bottomList.map((item, index) => {
                return <Text key={index} style={[{ fontSize: pxToDp(40), color: '#fff', width: '50%', paddingLeft: (index + 1) % 2 === 0 ? pxToDp(40) : 0 },appFont.fontFamily_syst,fontFamilyRestoreMargin('',-30)]}>{index + 1}、{item.name}</Text>
              })}
            </ScrollView>
            <View style={[styles.line4]}></View>
          </ImageBackground> : null}
        {bottomList.length > 0 ? <>
          <ImageBackground source={require("../../images/line1.png")} style={[styles.line5]} resizeMode={'cover'}></ImageBackground>
          <TouchableOpacity style={[styles.startBth]} onPress={() => { this.goExplain() }}>
            <Image source={require("../../images/tree_start.png")} style={[size_tool(207, 71),]} />
          </TouchableOpacity>
        </> : null}
        {list.length > 0 && bottomList.length === 0 ? <>
          <TouchableOpacity style={[styles.startBth, { bottom: pxToDp(-350) }]} onPress={() => { this.goExplain() }}>
            <Image source={require("../../images/tree_start.png")} style={[size_tool(207, 71),]} />
          </TouchableOpacity>
        </> : null}

      </View>
    );
  }
}

const styles = StyleSheet.create({
  line1: {
    position: 'absolute',
    width: pxToDp(13),
    height: pxToDp(100),
    // backgroundColor:'#FFA500',
    marginLeft: pxToDp(930),
    left: pxToDp(10),
    top: pxToDp(80),
    zIndex: 1
  },
  level2Content: {
    width: pxToDp(1880),
    height: pxToDp(438),
    padding: pxToDp(40),
  },
  line2: {
    // position:'absolute',
    width: pxToDp(107),
    height: pxToDp(13),
    // backgroundColor:'#FFA500',
    marginTop: pxToDp(85)
    // top:pxToDp(46)
  },
  line3: {
    position: 'absolute',
    width: pxToDp(13),
    height: pxToDp(120),
    // backgroundColor:'#FFA500',
    top: pxToDp(100),
    zIndex: 1
  },
  line4: {
    position: 'absolute',
    width: pxToDp(4),
    height: pxToDp(390),
    backgroundColor: '#fff',
    left: pxToDp(938),
    top: pxToDp(23)
  },
  startBth: {
    width: pxToDp(207),
    height: pxToDp(71),
    position: 'absolute',
    bottom: pxToDp(-60)
  },
  line5: {
    width: pxToDp(13),
    height: pxToDp(60),
    // backgroundColor:'#FFA500',
  },
  activeIcon: {
    width: pxToDp(32),
    height: pxToDp(32),
    position: 'absolute',
    right: -6,
    top: -6,
  }
});
export default SpeSentenceTreeModal;

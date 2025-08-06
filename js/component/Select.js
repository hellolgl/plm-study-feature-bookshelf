import React, { PureComponent, Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList
} from "react-native";
import { appStyle ,appFont} from "../theme";
import {
  pxToDp,
  fontFamilyRestoreMargin
} from "../util/tools";

// icon 下拉框图标
// borderStyle 边框样式
// borderWidth:pxToDp(4),
// borderColor:"#CB8345",
// borderRadius:pxToDp(16)
// activeBg 选中背景色
// fatherColor  father的字体颜色

class Select extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showSelect: false,
      FlatListWidth: 0,
      currentIndex: -1,
    };
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    let tempState = { ...prevState };
    if (nextProps.resetSelect) {
      tempState.currentIndex = -1
      return tempState;
    }
    return null

  }
  clickFather = (options) => {
    const { showSelect } = this.state;
    this.setState({
      showSelect: !showSelect,
    });
  };
  selectItem = (item, index) => {
    this.setState({
      currentIndex: index,
      showSelect: false
    })
    this.props.selectItem(item)
  }
  renderItem = ({ item, index }) => {
    const { currentIndex } = this.state
    const { options, activeBg, borderStyle, textColor, activeTextColor } = this.props
    // let _borderStyle = borderStyle?borderStyle:styles.borderStyle  
    // let Radius = _borderStyle.borderRadius - _borderStyle.borderWidth   //FlatList的第一个和最后一个元素的Radius
    let borderRadius = styles.borderStyle.borderRadius
    let borderWidth = styles.borderStyle.borderWidth
    if (borderStyle) {
      if (borderStyle.borderRadius) borderRadius = borderStyle.borderRadius
      if (borderStyle.borderWidth) borderWidth = borderStyle.borderWidth
    }
    let Radius = borderRadius - borderWidth
    return (
      <TouchableOpacity onPress={() => { this.selectItem(item, index) }} style={[appStyle.flexJusCenter, styles.item,
      index === 0 ? { borderTopLeftRadius: Radius, borderTopRightRadius: Radius } : null,
      currentIndex === index ? { backgroundColor: activeBg ? activeBg : '#F8EDE4' } : null,
      index === options.length - 1 ? { borderBottomLeftRadius: Radius, borderBottomRightRadius: Radius } : null,]} >
        <Text style={[{ fontSize: pxToDp(32), color: currentIndex === index ? activeTextColor ? activeTextColor : '#666666' : textColor ? textColor : "#666666" },appFont.fontFamily_syst]}>{item.label}</Text>
      </TouchableOpacity>
    );
  };
  render() {
    const { showSelect, currentIndex } = this.state;
    const { options, icon, borderStyle, fatherColor, subject } = this.props
    // console.log('222222222222222222',borderStyle)
    return (
      <View style={[styles.container]}>
        <TouchableOpacity style={[styles.father, styles.borderStyle, appStyle.flexAliCenter, appStyle.flexTopLine, appStyle.flexJusBetween, borderStyle]} onPress={this.clickFather}>
          <Text style={[{ fontSize: pxToDp(32), color: fatherColor ? fatherColor : '#CB8345' },appFont.fontFamily_syst]}>{currentIndex === -1 ? subject === 'english' ? 'Please select' : '请选择' : options[currentIndex].label}</Text>
          {icon ? <Image style={{ width: pxToDp(28), height: pxToDp(24), marginLeft: pxToDp(16) }} source={icon} resizeMode="contain"></Image> : null}
        </TouchableOpacity>
        {showSelect ? <View style={[styles.child, styles.borderStyle, borderStyle]}>
          <FlatList
            data={options}
            renderItem={this.renderItem}
            keyExtractor={(item) => item.id}
            extraData={currentIndex}
          />
        </View> : null}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    marginLeft: pxToDp(8),
    marginRight: pxToDp(8),
    marginTop: pxToDp(8)
  },
  father: {
    minWidth: pxToDp(230),
    height: pxToDp(72),
    paddingLeft: pxToDp(33),
    paddingRight: pxToDp(33)
  },
  child: {
    marginTop: pxToDp(8)
  },
  borderStyle: {
    borderWidth: pxToDp(4),
    borderColor: "#CB8345",
    borderRadius: pxToDp(16)
  },
  item: {
    height: pxToDp(72),
    paddingLeft: pxToDp(33),
    paddingRight: pxToDp(33)
  },
  title: {
    fontSize: 16,
  },
});

export default Select;

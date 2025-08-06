import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import { appStyle } from "../../theme";
import {
  size_tool,
  pxToDp,
  borderRadius_tool,
  padding_tool,
} from "../../util/tools";

// marginRight 右距离
// selectStyle 下拉框样式修改
// dropWrapStyle 下拉列表父元素样式
// dropItemStyle 下拉列表item样式修改
// dropItemText 下拉列表item文字样式修改
// selectWrapStyle 最外层样式

class DropdownSelect extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showSelect: false,
    };
  }
  clickSelect = (options) => {
    const { showSelect } = this.state;
    this.setState({
      showSelect: !showSelect,
    });
    // 智能句要触发事件算下拉框高度
    if(this.props.isSmart){
      showSelect?null:this.props.selectShow(options)
    }
  };
  changeSelect = (item, index) => {
    let _options = JSON.parse(JSON.stringify(this.props.options));
    _options.forEach((i) => {
      i.check = false;
    });
    _options[index].check = true;
    this.setState({
      options: _options,
      label: item.label,
      showSelect: false,
    });
    this.props.selectChange(item, _options);
  };
  render() {
    const { showSelect } = this.state;
    return (
      <View
        style={[
          this.props.selectWrapStyle ? this.props.selectWrapStyle : null,
          {
            position: "relative",
          },
        ]}
      >
        <TouchableOpacity
          style={[
            appStyle.flexTopLine,
            appStyle.flexAliCenter,
            appStyle.flexJusBetween,
            styles.select,
            padding_tool(0, 33),
            this.props.selectStyle ? this.props.selectStyle : null,
          ]}
          onPress={()=>{this.clickSelect(this.props.options)}}
        >
          <Text
            style={[
              styles.selectBtnText,
              this.props.dropItemText ? this.props.dropItemText : null,
            ]}
          >
            {this.props.label}
          </Text>
          <Image
            source={require("../../images/select_icon.png")}
            style={[size_tool(28,24)]}
          ></Image>
        </TouchableOpacity>
        <View
          style={[
            styles.dropWrap,
            {
              height: showSelect ? "auto" : 0,
              borderWidth: showSelect ? 1 : 0,
              width: this.props.selectStyle
                ? this.props.selectStyle.width
                : pxToDp(400),
            },
            this.props.dropWrapStyle ? this.props.dropWrapStyle : null,
          ]}
        >
          <ScrollView
            style={[
              styles.drop,
              {
                height: this.props.selectStyle
                  ? this.props.selectStyle.dropHeight
                  : pxToDp(240),
              },
            ]}
          >
            {this.props.options && this.props.options.length > 0
              ? this.props.options.map((item, index) => {
                  return (
                    <TouchableOpacity
                      style={[
                        styles.dropItem,
                        item.check ? styles.isCheck : null,
                        this.props.dropItemStyle
                          ? this.props.dropItemStyle
                          : null,
                      ]}
                      onPress={() => {
                        this.changeSelect(item, index);
                      }}
                      key={index}
                    >
                      <Text
                        style={[
                          styles.dropItemText,
                          this.props.dropItemText
                            ? this.props.dropItemText
                            : null,
                          {
                            lineHeight: this.props.dropItemStyle
                              ? this.props.dropItemStyle.minHeight
                              : pxToDp(80),
                          },
                        ]}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })
              : null}
          </ScrollView>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  select: {
    width: pxToDp(400),
    height: pxToDp(80),
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#0179FF",
    borderRadius:20
  },
  selectBtnText: {
    color: "#0179FF",
    fontSize: pxToDp(28),
  },
  dropWrap: {
    borderWidth: 1,
    borderColor: "#0179FF",
    backgroundColor: "#fff",
    marginTop: pxToDp(8),
    borderRadius:20
  },
  drop: {
    height: pxToDp(240),
  },
  dropItem: {
    minHeight: pxToDp(80),
    paddingLeft: pxToDp(33),
    paddingRight: pxToDp(33),
    borderRadius:20
  },
  dropItemText: {
    lineHeight: pxToDp(80),
    color: "#0179FF",
    fontSize: pxToDp(34),
  },
  isCheck: {
    backgroundColor: "#C3E8FF",
  },
});

export default DropdownSelect;

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
  RefreshControl
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
// dropItemStyleCheckBg   下拉选中后的背景颜色
// dropIcon  下拉的icon
// showDropItemIcon   下拉选项前的icon

class SentenceDropdownSelect extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showSelect: false,
      refreshing:false
    };
  }
  componentWillUnmount(){
    this.onRefreshTimeOut&&clearTimeout(this.onRefreshTimeOut)
  }
  clickSelect = (options) => {
    const { showSelect } = this.state;
    this.setState({
      showSelect: !showSelect,
    });
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
  onLayoutDropWrap = (e) => {
    let { x, y, width, height } = e.nativeEvent.layout;
    // console.log("智能句要触发事件算下拉框高度", x, y);
    // 智能句要触发事件算下拉框高度
    if (this.props.isSmart && height > 0) {
      this.props.selectShow(height);
    }
  }
   //下拉视图开始刷新时调用
   _onRefresh = ()=> {

    if (this.state.refreshing === false) {
        this._updateState( true);

        //5秒后结束刷新
        this.onRefreshTimeOut = setTimeout( ()=>{
            this._updateState(false)
        }, 3*1000)

    }
}

    //更新State
    _updateState=(refresh)=>{
        this.setState(()=>({refreshing: refresh}),()=>{
          if(refresh&&this.props._onRefresh){
            console.log('_updateState')
            this.props._onRefresh()
          }
        })
    }
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
          onPress={() => {
            this.clickSelect(this.props.options);
          }}
        >
          <Text
            style={[
              styles.selectBtnText,
              this.props.dropItemText ? this.props.dropItemText : null,
            ]}
          >
            {this.props.label}
          </Text>
          {/* {this.props.dropIcon ? (
            <Image
              source={require("../../images/en_dropIcon.png")}
              style={[size_tool(28, 24)]}
            ></Image>
          ) : (
            <Image
              source={require("../../images/select_icon.png")}
              style={[size_tool(28,24)]}
            ></Image>
          )} */}
        </TouchableOpacity>
        <View
          style={[
            styles.dropWrap,
            {
              height: showSelect ? "auto" : 0,
              borderWidth: showSelect
                ? this.props.dropWrapStyle &&
                  this.props.dropWrapStyle._borderWidth
                  ? this.props.dropWrapStyle._borderWidth
                  : 3
                : 0,
              // width:
              //   this.props.dropWrapStyle && this.props.dropWrapStyle.width
              //     ? this.props.dropWrapStyle.width
              //     : pxToDp(400),
              width: this.props.selectStyle
                ? this.props.selectStyle.width
                : pxToDp(400),
            },
            this.props.dropWrapStyle ? this.props.dropWrapStyle : null,
          ]}
          onLayout={(e) => this.onLayoutDropWrap(e)}
        >
          <ScrollView
            style={[
              this.props.dropWrapStyle
                ? {
                    height: "auto",
                  }
                : styles.drop,
            ]}
            bounces={true}
            refreshControl={
                    <RefreshControl
                        tintColor={'red'}
                        titleColor={'brown'}
                        title={'正在刷新......'}
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh}
                    />
            }
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
                        this.props.dropItemStyleCheckBg && item.check
                          ? this.props.dropItemStyleCheckBg
                          : null,
                        // 有圆角的处理
                        this.props.dropWrapStyle &&
                        this.props.dropWrapStyle.borderRadius &&
                        (index === 0 || index === this.props.options.length - 1)
                          ? {
                              borderRadius:
                                this.props.dropWrapStyle.borderRadius - 4, //不减就有留白
                            }
                          : null,
                        index === 0
                          ? {
                              borderBottomLeftRadius: 0,
                              borderBottomEndRadius: 0,
                            }
                          : null,
                        index === this.props.options.length - 1
                          ? {
                              borderTopLeftRadius: 0,
                              borderTopEndRadius: 0,
                            }
                          : null,
                      ]}
                      onPress={() => {
                        this.changeSelect(item, index);
                      }}
                      key={index}
                    >
                      <View style={[appStyle.flexTopLine]}>
                        {this.props.showDropItemIcon?<Text style={[styles.circle,item.check?{backgroundColor:'#892804'}:null]}></Text>:null}
                        
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
                            item.check ? styles.dropItemTextIsCheck : null
                          ]}
                        >
                          {item.label}
                        </Text>
                      </View>
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
    borderWidth: 3,
    borderColor: "#892804",
    borderRadius:8,
    backgroundColor:'#FBCF89'
  },
  selectBtnText: {
    color: "#892804",
    fontSize: pxToDp(38),
  },
  dropWrap: {
    borderWidth: 3,
    borderColor: "#892804",
    backgroundColor: '#FBCF89',
    marginTop: pxToDp(8),
    borderRadius:8
  },
  drop: {
    height: pxToDp(240),
    backgroundColor:'#FBCF89'
  },
  dropItem: {
    minHeight: pxToDp(80),
    paddingLeft: pxToDp(33),
    paddingRight: pxToDp(33),
    // borderRadius:8,
    backgroundColor:'#FBCF89'
  },
  dropItemText: {
    lineHeight: pxToDp(80),
    // color: "#892804",
    color: "#fff",
    fontSize: pxToDp(34),
    
  },
  dropItemTextIsCheck:{
    color: "#892804"
  },
  isCheck: {
    backgroundColor: "rgba(255, 255, 255, .2)",
    // opacity:0.2
  },
  circle:{
    width:pxToDp(20),
    height:pxToDp(20),
    borderRadius:pxToDp(10),
    backgroundColor:'#fff',
    marginRight:pxToDp(12),
    marginTop:pxToDp(30),
  }
});

export default SentenceDropdownSelect;

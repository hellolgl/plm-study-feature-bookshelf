import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  Animated,
} from "react-native";
import { appStyle } from "../../theme";
import { size_tool, pxToDp, padding_tool } from "../../util/tools";
import { VerticalCalculationFunc } from "../../util/VerticalCalculation";
let verticalClass = new VerticalCalculationFunc();

class VerticalDivision extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      detailsArr: [],
      width: "auto",
      leftWidth: "auto",
    };
  }
  static getDerivedStateFromProps(props, state) {
    let tempState = { ...state };
    console.log("props.groupData", props);
    let num1 = props.numData.num1;
    let num2 = props.numData.num2;
    let detailsArr = verticalClass.IntDivVerticalCalculator(num1, num2);
    console.log("detailsArr", detailsArr);
    let width = detailsArr[0][0].length * pxToDp(50);
    // let leftWidth = props.numData.num2.length * pxToDp(30);
    tempState.detailsArr = detailsArr;
    tempState.width = width;
    // tempState.leftWidth = leftWidth;
    return tempState;
  }
  onLayout = (e) => {
    let { x, y, width, height } = e.nativeEvent.layout;
    console.log(width);
    if(width>0){
      this.setState({
        leftWidth:width
      })
    }
  };
  renderContent = (item, index) => {
    const { leftWidth, width } = this.state;
    return (
      <View style={[appStyle.flexLine]}>
        <View
          style={[
            appStyle.flexLine,
            {width:leftWidth },
          ]}
          onLayout={(e) => this.onLayout(e)}
        >
          {index === 0 ? (
            <>
              <Text style={[{ paddingTop: pxToDp(8), fontSize: pxToDp(38),position:'relative',left:pxToDp(18)}]}>
                {this.props.numData.num2}
              </Text>
              <Text style={[{ fontSize: pxToDp(40),position:'relative',left:pxToDp(18) }]}>丿</Text>
            </>
          ) : null}
        </View>
        <View
          style={[
            appStyle.flexLine,
            index === 0 ? { paddingTop: pxToDp(8) } : null,
            { width },
            index % 2 !== 0 ? styles.haveBorder : null,
          ]}
          key={index}
        >
          {item.map((child, indexChild) => {
            return (
              <Text key={indexChild} style={[styles.child]}>
                {child}
              </Text>
            );
          })}
        </View>
      </View>
    );
  };
  render() {
    const { detailsArr, width, leftWidth } = this.state;
    return (
      <View style={{}}>
        <View style={[appStyle.flexLine, { marginBottom: pxToDp(-16) }]}>
          <View
            style={[appStyle.flexLine, { borderBottomWidth: pxToDp(3), width,marginLeft:leftWidth }]}
          >
            {detailsArr[1].map((item, index) => {
              return (
                <Text key={index} style={[styles.child]}>
                  {item}
                </Text>
              );
            })}
          </View>
        </View>

        {detailsArr[0].map((item, index) => {
          return this.renderContent(item, index);
        })}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  child: {
    width: pxToDp(50),
    textAlign: "center",
    fontSize: pxToDp(38),
  },
  haveBorder: {
    borderBottomWidth: pxToDp(3),
  },
});
export default VerticalDivision;

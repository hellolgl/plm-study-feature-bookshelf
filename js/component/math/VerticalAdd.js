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

class VerticalAdd extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      detailsArr: [],
      width: "auto",
    };
  }
  static getDerivedStateFromProps(props, state) {
    let tempState = { ...state };
    let num1 = props.numData.num1;
    let num2 = props.numData.num2;
    let detailsArr = verticalClass.IntAddVerticalCalculator(num1, num2);
    // console.log("detailsArr", detailsArr);
    let width = detailsArr[0].length * pxToDp(50);
    tempState.detailsArr = detailsArr;
    tempState.width = width;
    return tempState;
  }
  render() {
    const { detailsArr, width } = this.state;
    return (
      <View style={{ width }}>
        {detailsArr.map((item, index) => {
          return (
            <View
              key={index}
              style={[
                appStyle.flexLine,
                index === detailsArr.length - 1 ? styles.haveBorder : null,
              ]}
            >
              {item.map((child, indexChild) => {
                return (
                  <Text
                    key={indexChild}
                    style={[styles.child, index === 2 ? styles.textJ : null]}
                  >
                    {child}
                  </Text>
                );
              })}
            </View>
          );
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
    borderTopWidth: pxToDp(3),
  },
  textJ: {
    fontSize: pxToDp(20),
    marginLeft: pxToDp(6),
    marginTop: pxToDp(-24),
  },
});
export default VerticalAdd;

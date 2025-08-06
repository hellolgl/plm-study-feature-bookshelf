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

class VerticalReduce extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      detailsArr: [],
      width: "auto",
    };
  }
  static getDerivedStateFromProps(props, state) {
    let tempState = { ...state };
    console.log("props.groupData", props);
    let num1 = props.numData.num1;
    let num2 = props.numData.num2;
    let detailsArr = verticalClass.IntSubVerticalCalculator(num1, num2);
    console.log("detailsArr", detailsArr);
    let width = detailsArr[0].length * pxToDp(50);
    tempState.detailsArr = detailsArr;
    tempState.width = width;
    return tempState;
  }
  render() {
    const { detailsArr, width } = this.state;
    return (
      <View style={{ width, paddingTop: pxToDp(20) }}>
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
                    {index === 2 && child !== null ? "." : child}
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
    fontSize: pxToDp(50),
    marginTop: pxToDp(-240),
  },
});
export default VerticalReduce;

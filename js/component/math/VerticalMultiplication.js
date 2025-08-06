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

class VerticalMultiplication extends PureComponent {
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
    let detailsArr = verticalClass.IntMulVerticalCalculator(num1, num2);
    console.log("detailsArr", detailsArr);
    let width = detailsArr[detailsArr.length - 1].length * pxToDp(50);
    tempState.detailsArr = detailsArr;
    tempState.width = width;
    return tempState;
  }
  renderContent = (item, index) => {
    const { detailsArr } = this.state;
    let htm = <Text></Text>;
    htm = item.map((child, indexChild) => {
      if (index !== detailsArr.length - 1) {
        return (
          <View
            key={indexChild}
            style={[
              appStyle.flexLine,
              indexChild === item.length - 1 ? styles.haveBorder : null,
            ]}
          >
            {child.map((a, b) => {
              return (
                <Text key={b} style={[styles.child]}>
                  {a}
                </Text>
              );
            })}
          </View>
        );
      }
    });
    return htm;
  };
  render() {
    const { width, detailsArr } = this.state;
    return (
      <View style={{ width }}>
        {detailsArr.map((item, index) => {
          if (index !== detailsArr.length - 1) {
            return this.renderContent(item, index);
          } else {
            return (
              <View style={[appStyle.flexLine]} key={index}>
                {item.map((child, indexChild) => {
                  return (
                    <Text key={indexChild} style={[styles.child]}>
                      {child}
                    </Text>
                  );
                })}
              </View>
            );
          }
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
  textJ: {
    fontSize: pxToDp(50),
    marginTop: pxToDp(-240),
  },
});
export default VerticalMultiplication;

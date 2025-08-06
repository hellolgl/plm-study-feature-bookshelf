import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { pxToDp, size_tool } from "../util/tools";
import { appStyle } from "../theme";
import { prop } from "lodash/fp";


const MATH_BOOK_MAP = {
  '10': '人教版',
  '11': '北师版'
}

export default class CheckGradeTerm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gradeOptions: this.props.gradeList ? this.props.gradeList : [],
      termOptions: [],
      textbookOptions: this.props.textbookOptions ? this.props.textbookOptions : [],
      checkBookValue: props.checkBookValue ? props.checkBookValue : ''
    };
  }
  componentDidMount() {
    const { textbookOptions, gradeList, checkGradeValue } = this.props
    if (textbookOptions && textbookOptions.length > 0) {
      // 有教材版本选择(只有数学有)
      let _gradeList = this.getGradeList()
      this.setState({
        gradeOptions: _gradeList
      }, () => {
        this.setTerm()
      })
      return
    }
    if (checkGradeValue && gradeList) this.setTerm()
  }

  setTerm = () => {
    const { checkGradeValue } = this.props
    const { gradeOptions } = this.state
    for (let i = 0; i < gradeOptions.length; i++) {
      if (gradeOptions[i].value === checkGradeValue) {
        this.setState({
          termOptions: gradeOptions[i].term
        })
        return
      }
    }
  }

  getGradeList = () => {
    const { checkBookValue } = this.state
    const { gradeList } = this.props
    let list = gradeList.filter(i => {
      return i.textbook === checkBookValue
      // return i.textbook === '11'
    })
    return list
  }

  checkGradeNow(item) {
    this.setState({
      termOptions: item.term,
    });
    this.props.checkGrade(item);
  }
  compare(property) {
    return function (a, b) {
      var value1 = a[property];
      var value2 = b[property];
      return value1 - value2;
    };
  }

  changeBook = (i, x) => {
    this.setState({
      checkBookValue: i
    }, () => {
      let _gradeList = this.getGradeList()
      this.setState({
        gradeOptions: _gradeList
      })
      this.props.checkBook ? this.props.checkBook(i) : null
    })
  }
  checkChildren = () => {
    this.props.checkGrade({
      value: '00', label: '幼小衔接'
    });

  }
  render() {
    const { checkGradeValue, checkTermValue, showChildren } = this.props;
    const { gradeOptions, termOptions, textbookOptions, checkBookValue } = this.state;
    gradeOptions.sort(this.compare("value")); //按年级排序
    return (
      <View style={styles.mainWrap}>
        {textbookOptions && textbookOptions.length > 0 ? <View>
          <Text style={styles.titleTxt}>教材版本</Text>
          <View style={[appStyle.flexLine]}>
            {textbookOptions.map((i, x) => {
              return <TouchableOpacity key={x} style={[styles.touchItem, { backgroundColor: checkBookValue === i ? "#5C96FF" : "#EEEEEE", marginRight: pxToDp(32) },]} onPress={() => { this.changeBook(i, x) }}>
                <Text style={{ fontSize: pxToDp(32), color: checkBookValue === i ? "#fff" : "#666", }}>{MATH_BOOK_MAP[i]}</Text>
              </TouchableOpacity>
            })}
          </View>
        </View> : null}
        {
          showChildren ? <TouchableOpacity
            onPress={this.checkChildren}
            style={[
              styles.touchItem,
              {
                backgroundColor:
                  checkGradeValue === '00' && checkTermValue === '02' ? "#5C96FF" : "#EEEEEE",
                // marginRight: index % 4 === 3 ? 0 : pxToDp(32),
              },
            ]}
          >
            <Text
              style={{
                fontSize: pxToDp(32),
                color: checkGradeValue === '00' && checkTermValue === '02' ? "#fff" : "#666",
              }}
            >幼小衔接</Text>
          </TouchableOpacity> : null
        }
        <View>
          <Text style={styles.titleTxt}>年级</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {gradeOptions.map((item, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={this.checkGradeNow.bind(this, item)}
                  style={[
                    styles.touchItem,
                    {
                      backgroundColor:
                        checkGradeValue === item.value ? "#5C96FF" : "#EEEEEE",
                      marginRight: index % 4 === 3 ? 0 : pxToDp(32),
                    },
                  ]}
                >
                  <Text
                    style={{
                      fontSize: pxToDp(32),
                      color: checkGradeValue === item.value ? "#fff" : "#666",
                    }}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        <View>
          <Text style={styles.titleTxt}>学期</Text>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              height: pxToDp(100),
            }}
          >
            {termOptions.map((item, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => this.props.checkTerm(item)}
                  style={[
                    styles.touchItem,
                    {
                      backgroundColor:
                        checkTermValue === item.value ? "#5C96FF" : "#EEEEEE",
                      marginRight: index % 4 === 3 ? 0 : pxToDp(32),
                    },
                  ]}
                >
                  <Text
                    style={{
                      fontSize: pxToDp(32),
                      color: checkTermValue === item.value ? "#fff" : "#666",
                    }}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainWrap: {
    width: pxToDp(1072),
    padding: pxToDp(20),
  },
  titleTxt: {
    fontSize: pxToDp(28),
    color: "#AAAAAA",
    marginBottom: pxToDp(24),
  },
  touchItem: {
    width: pxToDp(224),
    height: pxToDp(96),
    marginBottom: pxToDp(20),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: pxToDp(12),
  },
});

import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import {
  margin_tool,
  size_tool,
  pxToDp,
  padding_tool,
  border_tool,
} from "../../../util/tools";
import { appStyle } from "../../../theme";
import NavigationUtil from "../../../navigator/NavigationUtil";
import axios from "../../../util/http/axios";
import api from "../../../util/http/api";
import UserInfo from "../../../component/userInfo";
import { connect } from "react-redux";
import DropdownSelect from "../../../component/DropdownSelect";
const classMap = {
  "01": "一年级",
  "02": "二年级",
  "03": "三年级",
  "04": "四年级",
  "05": "五年级",
  "06": "六年级",
};
const unitMap = {
  "01": "一单元",
  "02": "二单元",
  "03": "三单元",
  "04": "四单元",
  "05": "五单元",
  "06": "六单元",
  "07": "七单元",
  "08": "八单元",
  "09": "九单元",
  10: "十单元",
  11: "十一单元",
  12: "十二单元",
  13: "十三单元",
  14: "十四单元",
  15: "十五单元",
};
class ChooseText extends PureComponent {
  constructor(props) {
    super(props);
    //console.log(props.userInfo.toJS());
    this.lessonList = [];
    this.unitList = [];
    this.articalObj = {};
    this.unitLessonOptions = [];
    this.state = {
      pageType: props.navigation.state.params.data.pageType, //4：字词积累 0:智能句
      textBookOptions: [],
      unitOptions: [],
      articleOptions: [],
      origin: "",
      constArticle: "",
      checkGrade: props.userInfo.toJS().checkGrade,
      checkTeam: props.userInfo.toJS().checkTeam,
      tishi: "",
      unit: "单元",
      article: "课文",
    };
  }
  componentDidMount() {
    const { checkGrade, checkTeam } = this.state;
    let unitOptions = [];
    axios.get(api.lessonListDetail).then((res) => {
      this.lessonList = res.data.data;
      let nowLessonList = {};
      //console.log("课文课文", this.lessonList);
      for (let i in this.lessonList) {
        if (checkGrade === i) {
          nowLessonList = this.lessonList[i];
          break;
        }
      }
      for (let i in nowLessonList) {
        if (checkTeam === i) {
          this.unitLessonOptions = nowLessonList[i];
          break;
        }
      }
      for (let i in this.unitLessonOptions) {
        unitOptions.push({ value: i, label: unitMap[i] });
      }
      this.setState({
        unitOptions,
      });
    });
  }
  selectUnit = (item, _options) => {
    this.setState({
      origin: "",
      constArticle: "",
      unit: item.label,
      article: "课文",
    });
    let articleOptions = [];
    for (let i in this.unitLessonOptions) {
      if (i === item.value) {
        for (let j in this.unitLessonOptions[i]) {
          articleOptions.push({
            value: j,
            label: this.unitLessonOptions[i][j],
          });
        }
        break;
      }
    }
    this.setState({
      articleOptions,
      unitOptions: _options,
    });
  };
  selectArticle = (item, _options) => {
    this.setState({
      article:
        item.label.length > 5 ? item.label.substring(0, 6) + "..." : item.label,
      origin: item.value,
      constArticle: item.label,
      articleOptions: _options,
    });
  };
  toWordAccumulation() {
    const { origin, constArticle, pageType } = this.state;
    if (!origin) {
      this.setState({
        tishi: "请选择课文",
      });
      return;
    }
    this.setState({
      tishi: "",
    });
    switch (pageType) {
      // 字词积累
      case 4:
        NavigationUtil.toWordAccumulation({
          ...this.props,
          data: {
            origin,
            constArticle,
          },
        });
        break;
      // 智能句
      case 0:
        console.log("智能句");
        // NavigationUtil.toSmartSentences({
        //   ...this.props,
        //   data: {
        //     origin,
        //     constArticle,
        //   },
        // });
        break;
    }
  }
  goBack = () => {
    NavigationUtil.goBack(this.props);
  };
  renderSelct() {
    const { unit, article, unitOptions, articleOptions } = this.state;
    return (
      <View style={[appStyle.flexTopLine, { marginTop: pxToDp(48) }]}>
        {/* 单元选择 */}
        <DropdownSelect
          label={unit}
          options={unitOptions}
          selectChange={this.selectUnit}
          selectWrapStyle={{ marginRight: pxToDp(78) }}
        ></DropdownSelect>
        {/* 课文选择 */}
        <DropdownSelect
          label={article}
          options={articleOptions}
          selectChange={this.selectArticle}
        ></DropdownSelect>
      </View>
    );
  }
  toDidExerciseNow = () => {
    const { origin, constArticle, pageType } = this.state;
    if (!origin) {
      this.setState({
        tishi: "请选择课文",
      });
      return;
    }
    this.setState({
      tishi: "",
    });
    NavigationUtil.toChineseDidExercise({
      ...this.props,
      data: { origin },
    });
  };

  render() {
    const { tishi, unitOptions, pageType } = this.state;
    return (
      <View style={[styles.container, appStyle.flexAliCenter]}>
        <UserInfo avatarSize={164}></UserInfo>
        {unitOptions.length > 0 ? this.renderSelct() : null}
        <TouchableOpacity
          style={[
            { position: "absolute", top: pxToDp(125), right: pxToDp(96) },
          ]}
          onPress={this.goBack}
        >
          <Image
            source={require("../../../images/subject_back.png")}
            style={[size_tool(52)]}
          ></Image>
        </TouchableOpacity>
        <View
          style={[
            styles.confirmWrap,
            { flexDirection: "row", justifyContent: "center" },
          ]}
        >
          {/* {pageType === 4 ?
            <TouchableOpacity
            onPress={() => {
              this.toDidExerciseNow();
            }}
            style={[styles.confirm, appStyle.flexCenter, { marginRight: pxToDp(40) }]}
          >
            <Text style={[{ color: "#fff", fontSize: pxToDp(32), }]}>查看记录</Text>
          </TouchableOpacity>
            : null} */}
          <TouchableOpacity
            onPress={() => {
              this.toWordAccumulation();
            }}
            style={[styles.confirm, appStyle.flexCenter]}
          >
            <Text style={[{ color: "#fff", fontSize: pxToDp(32) }]}>确定</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.tishi]}>{tishi}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEF3F5",
    paddingTop: pxToDp(222),
  },
  confirm: {
    // position: "absolute",
    width: pxToDp(198),
    height: pxToDp(60),
    backgroundColor: "#38B3FF",
    borderRadius: pxToDp(32),
  },
  confirmWrap: {
    position: "absolute",
    width: pxToDp(400),
    height: pxToDp(60),
    bottom: pxToDp(90),
    borderRadius: pxToDp(32),
  },
  tishi: {
    position: "absolute",
    bottom: pxToDp(50),
    color: "red",
  },
});
const mapStateToProps = (state) => {
  return {
    userInfo: state.getIn(["userInfo", "currentUserInfo"]),
  };
};

const mapDispathToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispathToProps)(ChooseText);
// export default SelectSubject

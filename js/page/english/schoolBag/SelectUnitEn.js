import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  Platform,
} from "react-native";
import {size_tool, pxToDp, padding_tool, getGradeInfo} from "../../../util/tools"
import axios from '../../../util/http/axios'
import api from '../../../util/http/api'
import NavigationUtil from "../../../navigator/NavigationUtil";
import { connect } from 'react-redux';
import FreeTag from '../../../component/FreeTag'
import * as actionCreators from "../../../action/purchase/index";
import * as purchaseCreators from "../../../action/purchase"
class SelectUnitEn extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      unitList: [],
      list: [
        {
          text: "Listening",
          value: '100%',
          bgColor: ["#6384F0", "#8BA0F8"],
        },
        {
          text: "Speaking",
          value: '80%',
          bgColor: ["#FDAE00", "#FAC845"],
        },
        {
          text: "Reading",
          value: '10%',
          bgColor: ["#FA7528", "#FC8A4B"],
        },
        {
          text: "Writing",
          value: '50%',
          bgColor: ["#3AB4FF", "#78D7FE"],
        },
      ],
    };
  }
  componentDidMount() {
    const { userInfo, textBookCode } = this.props;
    const userInfoJs = userInfo.toJS();
    const data = {}
    data.grade_code = userInfoJs.checkGrade;
    data.term_code = userInfoJs.checkTeam;
    data.student_code = userInfoJs.id;
    data.subject = '03' //英语学科

    data.textbook_origin = textBookCode || '20' //教材code
    axios.post(api.QueryEnTextbookLesson, data).then(
      res => {
        let list = res.data.data
        let classList = []
        list.map((item) => {
          item.unit_code === '00' ? '' : classList.push(item)
        })
        this.setState(() => ({
          unitList: classList,
        })
        )
      }
    )
  }

  goBack() {
    NavigationUtil.goBack(this.props);
  }

  goEnglishSchoolHome = (item, authority) => {
    if (!authority) {
      this.props.setVisible(true)
      return
    }

    if (item.unit_code === '00') {
      NavigationUtil.toEnglishSchoolHomeUnit0({ ...this.props, data: { origin: item.origin, unit_name: item.unit_name, unit_code: item.unit_code } })
    } else {
      // NavigationUtil.toEnglishSchoolHome({ ...this.props, data: { origin: item.origin, unit_name: item.unit_name, unit_code: item.unit_code } })
      // type  === 2的时候是testMe
      let type = this.props.navigation.state.params.data.pageType
      let propsdata = {
        origin: item.origin,
        unit_name: item.unit_name,
        mode: this.props.navigation.state.params.data.pageType,
        // kpg_type: this.props.navigation.state.params.data.pageType,
        knowledge_type: 2,
        unit_code: item.unit_code,
        exercise_origin: item.origin
      }
      console.log("DDDBUG type: ", type)
      if (type === 1) {
        NavigationUtil.toEnglishChooseType({
          ...this.props,
          data: propsdata,
        });
      } else {
        NavigationUtil.toEnglishTestMeCheckType({
          ...this.props,
          data: propsdata,
        });
      }
    }
  }

  render() {
    const { unitList } = this.state;
    let pageType = this.props.navigation.state.params.data.pageType
    // 1 my study 2 test me
    const authority = this.props.authority
    return (
      <ImageBackground style={[{ flex: 1, }]}
        source={require('../../../images/englishHomepage/checkUnitBg.png')}
      >
        {Platform.OS === "ios" ? <View style={[{ marginTop: pxToDp(80) }]}></View> : <></>}
        <View
          style={[padding_tool(pageType === 1 ? 0 : 49, 80, 0, 80), styles.header, { position: "absolute", zIndex: 999, top: pxToDp(50) }]}
        >
          <TouchableOpacity onPress={this.goBack.bind(this)}
            style={[pageType === 1 ? size_tool(218, 110) : size_tool(80),]}
          >
            <Image
              style={[pageType === 1 ? size_tool(218, 110) : size_tool(80),]}
              source={pageType === 1 ? require('../../../images/englishHomepage/my_study_back.png') : require('../../../images/englishHomepage/wordHelpBack.png')} />
          </TouchableOpacity>
        </View>
        <View
          style={{
            marginTop: Platform.OS === "ios" ? pxToDp(0) : pxToDp(30),
            marginBottom: pxToDp(20),
            alignItems: "center",
          }}
        >
          {pageType === 1 ? <ImageBackground
            style={[size_tool(478, 110), { justifyContent: 'center', alignItems: 'center', marginTop: pxToDp(20), }]}
            source={require('../../../images/englishHomepage/myStudyTitle.png')}
          >
            <Text style={{ fontSize: pxToDp(32), fontWeight: 'bold', color: '#fff' }}>Let's Check/My Study</Text>
          </ImageBackground>
            :
            <ImageBackground
              style={[size_tool(523, 97), { justifyContent: 'center', alignItems: 'center', }]}
              source={require('../../../images/englishHomepage/testmeTitle.png')}
            >
              <Text style={{ fontSize: pxToDp(40), fontWeight: 'bold', color: '#fff' }}>Let's Check/Test Me</Text>
            </ImageBackground>
          }
        </View>

        {Platform.OS === "ios" ? <View style={[{ marginTop: pxToDp(170) }]}></View> : <></>}
        <View
          style={[padding_tool(0, 120, 0, 120), { width: '100%', flex: 1, flexDirection: 'row', flexWrap: 'wrap', }]}
        >
          {
            unitList.map((item, index) => {
              if (this.props.navigation.state.params.data.pageType === 1) {
                return (
                  <TouchableOpacity style={[styles.rightItem, { marginBottom: index < 4 ? pxToDp(30) : 0, marginRight: index % 4 === 3 ? 0 : pxToDp(90) }]} key={index} onPress={this.goEnglishSchoolHome.bind(this, item, index === 0 || authority)}>
                    <ImageBackground style={[size_tool(384), { alignItems: 'center', justifyContent: 'center' }]}
                      source={require('../../../images/englishHomepage/unitName.png')}
                    >
                      {index === 0 && !authority ?
                        <FreeTag txt='Free' style={{ position: 'absolute', top: pxToDp(0), right: pxToDp(-10), zIndex: 99, }} />
                        : null}
                      <View style={{ width: pxToDp(270), height: pxToDp(150), marginBottom: pxToDp(39), justifyContent: 'center', alignItems: "center", marginRight: pxToDp(16) }}>
                        <Text style={[styles.rightText, { textAlign: 'center', fontSize: item.unit_name.includes("Neighbourhood") ? pxToDp(33) : pxToDp(38) }]}> {item.unit_name}</Text>
                      </View>
                      <Text style={[styles.rightText, { color: "#FFAE00", fontSize: pxToDp(32) }]}>Unit {Number(item.unit_code)}</Text>
                    </ImageBackground>
                  </TouchableOpacity>
                )
              } else {
                return (
                  <TouchableOpacity style={[styles.rightItem, { marginBottom: index < 4 ? pxToDp(60) : 0, marginRight: index % 4 === 3 ? 0 : pxToDp(90) }]} key={index} onPress={this.goEnglishSchoolHome.bind(this, item, index === 0 || authority)}>
                    <ImageBackground style={[size_tool(340, 408), padding_tool(86, 0, 40, 0), {
                      alignItems: 'center', justifyContent: 'space-between',
                    }]}
                      source={require('../../../images/englishHomepage/englishTestMeItemBg.png')}
                    >
                      {index === 0 && !authority ?
                        <FreeTag txt='Free' style={{ position: 'absolute', top: pxToDp(30), right: pxToDp(-10), zIndex: 99, }} />
                        : null}
                      <Text style={[styles.rightText, { color: "#fff", fontSize: pxToDp(24) }]}>Unit {Number(item.unit_code)}</Text>

                      <View style={{ width: pxToDp(270), height: pxToDp(150), justifyContent: 'center', alignItems: "center", }}>
                        <Text style={[styles.rightText, { textAlign: 'center', fontSize: item.unit_name.includes("Neighbourhood") ? pxToDp(33) : pxToDp(38), color: '#A55903' }]}> {item.unit_name}</Text>
                      </View>
                      <Text style={[size_tool(148, 56), {
                        backgroundColor: '#FFFFFD',
                        borderRadius: pxToDp(28),
                        fontSize: pxToDp(32),
                        color: '#A55903',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        lineHeight: pxToDp(56)
                      }]}>START</Text>
                    </ImageBackground>
                  </TouchableOpacity>
                )
              }
            })
          }
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEF3F5",
  },
  header: {
    height: pxToDp(174),
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  left: {
    width: pxToDp(600),
    height: pxToDp(870),
    backgroundColor: "#fff",
    borderRadius: pxToDp(32),
    marginRight: pxToDp(48),
  },
  right: {
    flex: 1,
  },
  goDetailsBtn: {
    width: pxToDp(192),
    height: pxToDp(64),
    backgroundColor: "#fff",
    textAlign: "center",
    lineHeight: pxToDp(64),
    borderRadius: pxToDp(32),
    position: "absolute",
    fontSize: pxToDp(32),
    left: pxToDp(28),
    bottom: pxToDp(28),
  },
  rightText: {
    fontSize: pxToDp(38),
    fontWeight: 'bold',
    color: "#fff"
  },
  rightItem: {
    width: pxToDp(384),
    height: pxToDp(384),
    // backgroundColor: '#5CC1FF',
    justifyContent: 'space-between',
    borderRadius: pxToDp(16),
    marginBottom: pxToDp(20),
  },
  rightItemOpacity: {
    backgroundColor: '#FFFFFF',
    borderRadius: pxToDp(30),
    width: pxToDp(143),
    alignItems: 'center',
    marginEnd: pxToDp(48)
  }
});

const mapStateToProps = (state) => {
  return {
    userInfo: state.getIn(["userInfo", "currentUserInfo"]),
    textBookCode: state.getIn(["bagEnglish", "textBookCode"]),
    lock_primary_school: state.getIn(["userInfo", "lock_primary_school"]),
    authority:state.getIn(["userInfo", "selestModuleAuthority"]),
  }
}

const mapDispathToProps = (dispatch) => {
  return {
    setVisible(data) {
      dispatch(actionCreators.setVisible(data));
    },
    setModules(data) {
      dispatch(purchaseCreators.setModules(data));
    },
  }
}


export default connect(mapStateToProps, mapDispathToProps)(SelectUnitEn)

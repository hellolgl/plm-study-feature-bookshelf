import React, { Component, PureComponent } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from "react-native";
import axios from "../../../../util/http/axios";
import api from "../../../../util/http/api";
import NavigationUtil from "../../../../navigator/NavigationMathUtil";
import BaseButton from "../../../../component/BaseButton";
import { connect } from "react-redux";
import CircleCard from "../../../../component/math/CircleCard";
import Stem from './components/Stem'
import {changeTopicData} from './tools'
import styles from '../../../../theme/math/wrongExercisePageStyle'
import WrongPageHeader from '../../../../component/math/WrongPageHeader'

class WrongExercisePage extends PureComponent {
  constructor(props) {
    super(props);
    this.clickTopic_map = new Map()
    this.state = {
      clickIndex: 0, //当前点击的题目index
      topaicDataList: [],
      page_index:1,
      currentTopaicData:{},
      loading:true
    };
  }

  goBack = () => {
    NavigationUtil.goBack(this.props);
  };

  componentDidMount() {
    this.getTopicIds();
  }

  getTopicIds = () => {
    const {page_index,topaicDataList} = this.state
    const { userInfo ,textCode} = this.props
    const userInfoJs = userInfo.toJS();
    let obj = {
      wrong_type:0, //未做对两次的错题
      page_index,
      page_size:19,
      grade_code: userInfoJs.checkGrade,
      term_code: userInfoJs.checkTeam,
      textbook: textCode,
    }
    axios.get(api.getExpandApplicationWrongTopicIds, { params: obj }).then((res) => {
        let data = res.data.data
        let list = topaicDataList.concat(data)
        this.setState({
            topaicDataList:list,
        })
        if(list.length > 0) this.getTopic(list[0].m_a_id,list[0].e_w_id)
    });
  };
  getTopic = (m_a_id,e_w_id)=>{
    if(this.clickTopic_map.get(m_a_id)){
      let _data = JSON.parse(JSON.stringify(this.clickTopic_map.get(m_a_id)))
      _data.e_w_id = e_w_id
      this.setState({
        currentTopaicData:this.clickTopic_map.get(m_a_id),
        showBtn: this.clickTopic_map.get(m_a_id).displayed_type ? true : false,
      })
      return
    }
    let obj = {
      m_a_id
    }
    axios.get(api.getExpandApplicationWrongTopicDetails, { params: obj }).then((res) => {
      let data = changeTopicData(res.data.data)
      data.e_w_id = e_w_id
      this.setState({
        currentTopaicData:data,
        showBtn: data.displayed_type ? true : false,
        loading:false
      },()=>{
        this.clickTopic_map.set(m_a_id,data)
      })
  });
  }
  toWrongDoExercisePage = (currentTopaicData) => {
    NavigationUtil.toMathExpandApplicationWrongDoWrongExercise({...this.props,data:{currentTopaicData:{...currentTopaicData}}})
  };

  showTopaicDetail = (index, item) => {
    this.getTopic(item.m_a_id,item.e_w_id)
    this.setState({
      clickIndex: index,
    })
  };

  renderTopaicCard = () => {
    let cardList = new Array();
    const { topaicDataList } = this.state;
    for (let i = 0; i < topaicDataList.length; i++) {
      cardList.push(
        <TouchableOpacity
          key={i}
          onPress={() => {
            this.showTopaicDetail(i, topaicDataList[i]);
          }}
          style={[styles.topaicCardItem]}
        >
          <CircleCard isActive={i === this.state.clickIndex} text={i - 0 + 1} />
        </TouchableOpacity>
      );
    }
    return cardList;
  };
  nextPage = (e)=>{
    let { page_index } = this.state;
    var offsetX = e.nativeEvent.contentOffset.x; //滑动距离
    var contentSizeWidth = e.nativeEvent.contentSize.width; //scrollView contentSize宽度
    var oriageScrollWidth = e.nativeEvent.layoutMeasurement.width; //scrollView宽度
    console.log(offsetX + oriageScrollWidth,contentSizeWidth)
    if (offsetX + oriageScrollWidth +10 >= contentSizeWidth) {
        console.log('下一页')
        let page = page_index + 1;
        this.setState({
            page_index: page,
        },()=>{
            this.getTopicIds();
        });
    }
  }
  render() {
    const { topaicDataList, clickIndex,currentTopaicData,loading} = this.state;
    if(topaicDataList.length === 0) return null
    return (
      <ImageBackground source={require('../../../../images/thinkingTraining/do_exercise_bg.png')} style={styles.mainWrap}>
        <WrongPageHeader title={'拓展应用-错题集'} goBack={this.goBack}></WrongPageHeader>
          <View style={styles.topaicCard}>
            <ScrollView horizontal={true} onMomentumScrollEnd={this.nextPage}>
              <View
                style={[styles.TopaicCardWrap]}
              >
                {this.renderTopaicCard()}
              </View>
            </ScrollView>
          </View>
          <View style={[styles.content]}>
                <View
                  style={[styles.contentTopWrap]}
                >
                  <Text
                    style={[styles.displayed_type]}
                  >
                      {currentTopaicData.displayed_type}
                  </Text>
                  <Text style={[styles.displayed_type]}>{currentTopaicData.p_name}</Text>
                </View>
                <View
                  style={[styles.topicWrap]}
                >
                  <ScrollView>
                    <Stem currentTopaicData={currentTopaicData}></Stem>
                  </ScrollView>
                </View>
              <View
                 style={[styles.contentFooter]}
              >
                <BaseButton
                  onPress={() => {
                    this.toWrongDoExercisePage(currentTopaicData);
                  }}
                  text={"再练一次"}
                ></BaseButton>
              </View>
          </View>
      </ImageBackground>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userInfo: state.getIn(["userInfo", "currentUserInfo"]),
    textCode: state.getIn(["bagMath", "textBookCode"]),
  };
};

const mapDispathToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispathToProps)(WrongExercisePage);

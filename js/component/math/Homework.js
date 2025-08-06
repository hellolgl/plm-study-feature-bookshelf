import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
} from "react-native";
import { appStyle } from "../../theme";
import { size_tool, pxToDp, padding_tool } from "../../util/tools";
import NavigationUtil from "../../navigator/NavigationUtil";
import RichShowView from "../../component/chinese/RichShowView";
import CorrectionCheck from "../../component/CorrectionCheck";
import url from "../../util/url";
import ViewControl from "react-native-image-pan-zoom";
let baseURL = url.baseURL;
const optionsMap = {
  0: "A",
  1: "B",
  2: "C",
  3: "D",
  4: "E",
  5: "F",
};
class Homework extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      listMap : new Map()

    };

  }
  componentDidMount(){
    const { list } = this.props
    let tempMap = new Map()
    list.map((item)=>{
      Image.getSize(baseURL+item.image_path,(width,height)=>{
        tempMap.set(item.s_de_e_id,{width,height})
      })
    })
    setTimeout(() => {
      this.setState((preState)=>({
        listMap:new Map([...preState.listMap, ...tempMap])
      }))
    }, (1));
   
  }
  renderOptions = (item) => {
    if (!item.choice_content_type || item.choice_content_type === "text") {
      // 文字选择
      if (item.exercise_content) {
        let options = item.exercise_content.split("#");
        let choice = options.map((child, childIndex) => {
          return (
            <View style={[styles.optionItem]} key={childIndex}>
              <Text style={[{ fontSize: pxToDp(32), lineHeight: 36 }]}>
                {optionsMap[childIndex]}、{child}
              </Text>
            </View>
          );
        });
        return <View>{choice}</View>;
      }
    }
    if (item.choice_content_type === "img") {
      // 图片选择
      if (item.exercise_content) {
        let options = item.exercise_content.split("#");
        let choice = options.map((child, childIndex) => {
          return (
            <View className={styles.optionItem} key={childIndex}>
              <Text style={[{ fontSize: pxToDp(32) }]}>
                {optionsMap[childIndex]}、
              </Text>
              <Image
                style={{
                  width: 350,
                  height: 300,
                }}
                source={{
                  uri: baseURL + child,
                }}
                resizeMode="contain"
              ></Image>
            </View>
          );
        });

        return <View>{choice}</View>;
      }
    }
    return null;
  };
  renderCorrect = (item) => {
    if (!item.answer_content) return null;
    let answer_content_arr = item.answer_content.split("#");
    for (let i = 0; i < answer_content_arr.length; i++) {
      if (answer_content_arr[i] === "null") {
        return null;
      }
    }
    return (
      <View
        style={[
          appStyle.flexLine,
          { marginBottom: pxToDp(20), marginTop: pxToDp(20) },
        ]}
      >
        <Text style={[styles.label]}>正确答案：</Text>
        <Text style={[styles.labelText]}>{answer_content_arr.join("、")}</Text>
      </View>
    );
  };
  renderAnswer = (item) =>{
    console.log('render image',this.state.listMap)
    if(this.state.listMap.size <=0)return
    console.log('render image1111',this.state.listMap)
    return (
              <Image
                resizeMode={"contain"}
                style={{ width: this.state.listMap.get(item.s_de_e_id).width, height: this.state.listMap.get(item.s_de_e_id).height }}
                source={{ uri: baseURL + item.image_path }}
              ></Image>
    )

  }
  render() {
    const { list } = this.props;
    return (
      <>
        {list.map((item, index) => {
          return (
            <View
              style={[
                styles.wrap,
                appStyle.flexTopLine,
                appStyle.flexJusBetween,
                { marginBottom: pxToDp(40) },
              ]}
              key={index}
            >
              <View style={[styles.left]}>
                <RichShowView
                  divStyle={"font-size: x-large"}
                  pStyle={"font-size: x-large"}
                  spanStyle={"font-size: x-large"}
                  width={pxToDp(1400)}
                  value={
                    item.public_exercise_stem ? item.public_exercise_stem : ""
                  }
                ></RichShowView>
                <RichShowView
                  divStyle={"font-size: x-large"}
                  pStyle={"font-size: x-large"}
                  spanStyle={"font-size: x-large"}
                  width={pxToDp(1400)}
                  value={
                    item.private_exercise_stem ? item.private_exercise_stem : ""
                  }
                ></RichShowView>
                {this.renderOptions(item)}
                {this.renderCorrect(item)}
                <Text style={[styles.label]}>答案：</Text>
                {item.image_path ? (
                  this.renderAnswer(item)
                  // <Image
                  //   resizeMode={"contain"}
                  //   style={{ width: pxToDp(750), height: pxToDp(300) }}
                  //   source={{ uri: baseURL + item.image_path }}
                  // ></Image>
                ) : null}
                {item.correction_remarks ? (
                  <View style={[appStyle.flexLine]}>
                    <Text style={{ fontSize: pxToDp(32), color: "#FC6161" }}>
                      评语：{item.correction_remarks}
                    </Text>
                  </View>
                ) : null}
              </View>
              <View style={[styles.right]}>
                <CorrectionCheck details={item}></CorrectionCheck>
              </View>
            </View>
          );
        })}
      </>
    );
  }
}

const styles = StyleSheet.create({
  wrap: {
    paddingLeft: pxToDp(40),
  },
  label: {
    fontSize: pxToDp(28),
    color: "#2884ff",
  },
  labelText: {
    fontSize: pxToDp(28),
  },
});
export default Homework;

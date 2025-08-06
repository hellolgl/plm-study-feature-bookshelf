import React, { PureComponent } from "react";
import {
  View,
  // Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { appStyle } from "../../theme";
import { size_tool, pxToDp, fitHeight } from "../../util/tools";

import Svg, { Polyline, G,Text} from "react-native-svg";
// 50
// 一艘轮船A时行驶B千米，这艘轮船行驶C时能行驶多少千米    c=8   640/80 = 8   500/8 = 62.5一份
// B/A*C
// =D*C
// = E
// 一艘轮船5时行驶400千米，这艘轮船行驶8时能行驶多少千米？
// 甲一天10，乙20，甲乙5天做多少？
// 甲5天做了60，乙4天做了8，甲每天比乙多做多少？
// 10   5
let c_w = pxToDp(1600);

// const X_MAP = {
//   A: 10,
//   B: 20,
//   C: 5,
//   D: 30,
//   E: 150,
// };

// const X_MAP = {
//   A: 268,
//   B: 4,
//   C: 8,
//   D: 67,
//   E: 536,
// };

// const X_MAP = {
//   A: 400,
//   B: 5,
//   C: 8,
//   D: 80,
//   E: 640,
// };

// const X_MAP = {
//   A: 60,
//   B: 5,
//   C: 20,
//   D: 4,
//   E: 12,
//   F:5,
//   G:7
// };

const text_map = {
  text1: "text1",
  text2: "text2text2text2text2",
  text3: "text3",
  text4: "text4",
};

class Myline1 extends PureComponent {
  constructor(props) {
    super(props);
    const { groupItem } = this.props;
    this.lineNum = [];
    let len = groupItem.echo_len;
    for (let i = 0; i < len + 1; i++) {
      this.lineNum.push(i);
    }
  }
 
  render() {
    const { groupItem } = this.props;
    return (
      <>
        <G>
          {this.lineNum.map((item, index) => {
            return (
              <Polyline
                points={
                  groupItem.echo_len === 1
                    ? `${groupItem.x},${groupItem.y},${groupItem.x},${
                        groupItem.y + 10
                      },${groupItem.x + groupItem._width},${groupItem.y + 10},${
                        groupItem.x + groupItem._width
                      },${groupItem.y},${groupItem.x + groupItem._width},${
                        groupItem.y + 10
                      }`
                    : index === this.lineNum.length - 1
                    ? `${groupItem.x + index * groupItem._width},${
                        groupItem.y
                      },${groupItem.x + groupItem._width * index},${
                        groupItem.y + 10
                      }`
                    : `${groupItem.x + index * groupItem._width},${
                        groupItem.y
                      },${groupItem.x + groupItem._width * index},${
                        groupItem.y + 10
                      },${groupItem.x + groupItem._width * (index + 1)},${
                        groupItem.y + 10
                      }`
                }
                fill="none"
                stroke={groupItem.color}
                strokeWidth="2"
              />
            );
          })}
        </G>
      </>
    );
  }
}
class BracesAndText extends PureComponent {
  constructor(props) {
    super(props);
    const { groupItem } = this.props;
    this.w = (groupItem._width - 24) / 2;
  }
  render() {
    const { groupItem } = this.props;
    return (
      <>
        <G>
          <Polyline
            points={
              groupItem.address === 2
                ? `${groupItem.x},${groupItem.y},${groupItem.x + 6},${
                    groupItem.y - 6
                  },${groupItem.x + 6 + this.w},${groupItem.y - 6},${
                    groupItem.x + 6 + this.w + 6
                  },${groupItem.y - 6 - 6},${
                    groupItem.x + 6 + this.w + 6 + 6
                  },${groupItem.y - 6},${
                    groupItem.x + 6 + this.w + 6 + 6 + this.w
                  },${groupItem.y - 6},${
                    groupItem.x + 6 + this.w + 6 + 6 + this.w + 6
                  },${groupItem.y},`
                : `${groupItem.x},${groupItem.y},${groupItem.x + 6},${
                    groupItem.y + 6
                  },${groupItem.x + 6 + this.w},${groupItem.y + 6},${
                    groupItem.x + 6 + this.w + 6
                  },${groupItem.y + 6 + 6},${
                    groupItem.x + 6 + this.w + 6 + 6
                  },${groupItem.y + 6},${
                    groupItem.x + 6 + this.w + 6 + 6 + this.w
                  },${groupItem.y + 6},${
                    groupItem.x + 6 + this.w + 6 + 6 + this.w + 6
                  },${groupItem.y}`
            }
            fill="none"
            stroke={ groupItem.color}
            strokeWidth="2"
          />
          <Text
              fill={groupItem.color}
              fontSize={pxToDp(24)}
              x={groupItem.x + groupItem._width/2}
              y={groupItem.address === 2 ? groupItem.y - 20 : groupItem.y + 30}
              textAnchor="middle"
              >{groupItem.text}</Text>

        </G>
      </>
    );
  }
}

class LineCavans extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      groupData: {},
    };
  }
  static getDerivedStateFromProps(props, state) {
    let tempState = { ...state };
    if(!props.equationExercise){
      return {
        groupData:{ }
      }
    }
    let equationExerciseArr = props.equationExercise.match(/[A-W]/gi).join("");
    // console.log("props.groupData", props.groupData);
    let str = props.groupData.replaceAll("\\", "");
    let _groupData = JSON.parse(str.substring(1, str.length - 1));
    // let _groupData = JSON.parse( props.groupData)
    // let _groupData = JSON.parse('{"group1":[{"width":200,"len":4,"color":"#333","id":1,"x":47,"y":42,"all_len":"A","one_len":"D"},{"width":400,"len":1,"color":"#333","id":2,"x":47,"y":141,"all_len":"E","one_len":"D"},{"width":50,"len":1,"color":"#ff6900","id":3,"x":47,"y":141,"all_len":"D","one_len":"D"}],"long_all":"E","group2":[{"width":200,"text":"text1","address":1,"color":"#333","x":48,"y":66,"all_len":"A"},{"width":400,"text":"text2","address":1,"color":"#333","x":47,"y":166,"all_len":"E"},{"width":50,"text":"text3","address":2,"color":"#ff6900","x":47,"y":135,"all_len":"D"}]}')
    // console.log("props.groupData", _groupData);
    const X_MAP = props.alphabet_value;
    let _variable_value = JSON.parse(JSON.stringify(props.variable_value));
    for(let i in X_MAP){
      _variable_value.forEach((j,index)=>{
        _variable_value[index].value[0] = _variable_value[index].value[0].replaceAll(i+'',X_MAP[i])
      })
    }
    let TEXT_MAP = {};
    if (_variable_value.length > 0) {
      TEXT_MAP = _variable_value.reduce((c, i) => {
        c[i.key] = i.value.join(
          equationExerciseArr.indexOf(i.key) === -1 ? "?" : X_MAP[i.key]
        );
        return c;
      }, {});
    }
    // console.log("TEXT_MAPTEXT_MAPTEXT_MAP", TEXT_MAP, equationExerciseArr);
    // let long_all = _groupData.long_all;
    let long_all = _groupData.long_all;
    let long_all_width = X_MAP[long_all]
    if(!long_all_width){
      let arr = long_all.split('')
      arr.forEach((i,index)=>{
        if(X_MAP[i]) arr[index] = X_MAP[i]
      })
      long_all_width = eval(arr.join('').replaceAll('×',"*").replaceAll('÷',"/"))
    }
    let getWidthMap = () => {
      let obj = {};
      for (let i in X_MAP) {
        obj[i] = c_w / (long_all_width / X_MAP[i]);
      }
      return obj;
    };
    let WIDTH_MAP = getWidthMap();
    // console.log("WIDTH_MAPWIDTH_MAP", WIDTH_MAP);
    _groupData.group1.forEach((item) => {
      item.echo_len = item.len;
      item._width = WIDTH_MAP[item.one_len] * item.echo_len;
      if (item.len > 1) {
        // 切割的的宽度
        item.echo_len = X_MAP[item.all_len] / X_MAP[item.one_len];
        item._width = WIDTH_MAP[item.one_len];
      }
      item.x = 20;
      if (item.juxtaposition) {
        if(WIDTH_MAP[item.juxtaposition]){
          item.x = item.x + WIDTH_MAP[item.juxtaposition];
        }else{
          let arr = item.juxtaposition.split('')
          arr.forEach((i,index)=>{
            if(WIDTH_MAP[i]) arr[index] = WIDTH_MAP[i]
          })
          let _x = eval(arr.join('').replaceAll('×',"*").replaceAll('÷',"/"))
          item.x = item.x + _x;
        }
      }
      !item.y?item.y = 0:null
       
    });
    _groupData.group2.forEach((item) => {
      item._width = WIDTH_MAP[item.all_len];
      item.x = 20;
      if (item.juxtaposition) {
        // 表示有并列线段，需要重新计算x
        if(WIDTH_MAP[item.juxtaposition]){
          item.x = item.x + WIDTH_MAP[item.juxtaposition];
        }else{
          let arr = item.juxtaposition.split('')
          arr.forEach((i,index)=>{
            if(WIDTH_MAP[i]) arr[index] = WIDTH_MAP[i]
          })
          let _x = eval(arr.join('').replaceAll('×',"*").replaceAll('÷',"/"))
          item.x = item.x + _x;
        }
      }
      item.text = TEXT_MAP[item.all_len]
        ? TEXT_MAP[item.all_len]
        : X_MAP[item.all_len];
    });
    // console.log("_groupData.group1_groupData.group1", _groupData.group1);
    // console.log("_groupData.group2_groupData.group2", _groupData.group2);
    tempState.groupData = _groupData;
    return tempState;
  }
  render() {
    const { groupData } = this.state;
    return (
      <View>
        <Svg width={pxToDp(1800)} height={fitHeight(0.4,0.4)}>
          {groupData.group1&&groupData.group1.map((item, index) => {
            
            return <Myline1 groupItem={item} key={index}></Myline1>;
          })}
          {groupData.group2&&groupData.group2.map((item, index) => {
            return <BracesAndText groupItem={item} key={index}></BracesAndText>;
          })}
        </Svg>
      </View>
    );
  }
}

const styles = StyleSheet.create({});
export default LineCavans;

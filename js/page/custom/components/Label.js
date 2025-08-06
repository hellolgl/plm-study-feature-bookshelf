import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { ECharts } from "react-native-echarts-wrapper";
import { pxToDp } from "../../../util/tools";
import * as _ from "lodash";

export default class Label extends Component {
  constructor(props) {
    super(props);
    this.data1 = [
      { check: 1, name: "观影达人", value: 1 },
      { check: 1, name: "小书法家", value: 1 },
      { check: 1, name: "运动小达人", value: 1 },
      { check: 1, name: "语言小天才", value: 1 },
      { check: 1, name: "阅读达人", value: 1 },
      { check: 0, name: "拼音", value: 1 },
      { check: 0, name: "字学树", value: 1 },
      { check: 0, name: "字词积累", value: 1 },
      { check: 0, name: "ABCs", value: 1 },
      { check: 0, name: "Words", value: 1 },
      { check: 0, name: "Test me", value: 1 },
      { check: 0, name: "编程", value: 1 },
      { check: 0, name: "思维训练", value: 1 },
      { check: 0, name: "巧算", value: 1 },
    ];
    this.chart = null;
    this.state = {
      option: {
        backgroundColor: "#fff",
        series: [
          {
            type: "treemap",
            breadcrumb: {
              show: false,
            },
            itemStyle: {
              borderRadius: 10,
              gapWidth: 5,
            },
            label: {
              // position: "insideBottomLeft",
              formatter: function (params) {
                if (params.name.split("|")[0] === "variableColor") {
                  return `{variableIcon| } \n{variableColor|${
                    params.name.split("|")[1]
                  }}`;
                } else {
                  return `{unVariableIcon| } \n{unVariableColor|${
                    params.name.split("|")[1]
                  }} `;
                }
              },
              fontSize: 18,
              overflow: "break",
              rich: {
                variableIcon: {
                  height: 30,
                  lineHeight: 40,
                  align: "right",
                  verticalAlign: "top",
                  backgroundColor: {
                    image:
                      "https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/icon/1.png",
                  },
                },
                unVariableIcon: {
                  height: 30,
                  lineHeight: 40,
                  align: "right",
                  verticalAlign: "top",
                  backgroundColor: {
                    image:
                      "https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/icon/2.png",
                  },
                },
                variableColor: {
                  color: "#0b112c",
                  fontSize: 17,
                  fontWeight: "bold",
                },
                unVariableColor: {
                  color: "#ececec",
                  fontSize: 17,
                  fontWeight: "bold",
                },
              },
            },
            roam: false,
            nodeClick: false,
            width: "100%",
            height: "100%",
            // data: this.data1,
            data: [],
          },
        ],
      },
    };
  }

  groupData = () => {
    // const chartData = this.data1;
    const chartData = this.props.chartData;
    const originalData = Array.from(
      new Map(chartData.map((item) => [item.name, item])).values()
    );
    const data = [];
    const collection = {
      逻辑: ["巧算", "思维训练"],
      编程: ["编程"],
      英语: ["英语同步诊断", "Words", "ABCs"],
      汉语基础: ["字词积累", "字学树", "拼音"],
    };
    const deepColor = "#d64a25";
    const lightColor = "#d6f1ce";
    const unVariableColor = deepColor;
    const variableColor = lightColor;
    const reorganizedData = {};
    const modules = [
      "巧算",
      "思维训练",
      "编程",
      "英语同步诊断",
      "Words",
      "ABCs",
      "字词积累",
      "字学树",
      "拼音",
    ];
    originalData.forEach((item) => {
      if (!modules.includes(item["name"])) {
        item["name"] = `variableColor|${item["name"]}`;
        item["itemStyle"] = {
          color: variableColor,
        };
        data.push(item);
      } else {
        for (const category in collection) {
          // 如果当前项的名称在集合中
          if (collection[category].includes(item.name)) {
            // 将当前项添加到重新组织的数据中的对应类别
            if (!reorganizedData[category]) {
              reorganizedData[category] = [];
            }
            reorganizedData[category].push(item);
            break; // 找到匹配的集合后可以跳出内层循环
          }
        }
      }
    });
    for (const reorganizedDataKey in reorganizedData) {
      const allCheck = reorganizedData[reorganizedDataKey].every(
        (v) => v["check"] === 1
      );
      const d = {
        name: reorganizedDataKey,
        value: 1,
        check: allCheck ? 1 : 0,
        itemStyle: {
          color: unVariableColor,
        },
      };
      if (allCheck) {
        d["name"] = `variableColor|${d["name"]}小达人`;
        d["itemStyle"]["color"] = variableColor;
      } else {
        d["name"] = `unVariableColor|${d["name"]}领域(待提升)`;
        d["value"] = 1.2;
      }
      data.unshift(d);
    }
    return data;
  };

  render() {
    const { option } = this.state;
    option.series[0].data = this.groupData();
    return (
      <ECharts
        ref={(ref) => {
          this.chart = ref;
        }}
        option={option}
        // option={_o}
        backgroundColor="rgba(93, 169, 81, 0.3)"
      />
    );
  }
}

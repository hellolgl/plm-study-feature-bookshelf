import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { appFont, appStyle } from "../../../../../theme";
import { pxToDp, padding_tool, size_tool } from "../../../../../util/tools";

import { useSelector, useDispatch } from "react-redux";
import url from "../../../../../util/url";
import { ECharts } from "react-native-echarts-wrapper";
import * as _ from "lodash";

const Avatar = ({ data, links, nextLevel }) => {
    const { avatar } = useSelector((state) => state.toJS().userInfo);
    let chart = null;

    const option = {
        series: [
            {
                type: "graph",
                layout: "force", // 使用力导向布局
                force: {
                    repulsion: 3000, // 节点之间的排斥力
                    edgeLength: [pxToDp(300), pxToDp(600)], // 边的长度范围
                },
                roam: true, // 是否开启缩放和平移
                label: {
                    show: true, // 显示节点标签
                    color: "#22294D",
                    fontSize: pxToDp(36),
                    fontWeight: "bold",
                    formatter: function (params) {
                        var name = params.data.name;
                        return name.length > 4 ? name.slice(0, 4) + "..." : name;
                    },
                },
                symbolSize: pxToDp(200),
                edgeSymbol: ["circle", "arrow"],
                edgeSymbolSize: [4, 10],
                edgeLabel: {
                    fontSize: pxToDp(40),
                    color: "#FFB82E",
                    formatter: "{c}", // 显示连接线的值，这里使用 {c} 表示连接线的 value
                    show: true,
                    fontWeight: "bold",
                },
                data,
                links,
                lineStyle: {
                    color: "#fff", // 线条颜色取决于 source 节点的颜色
                    width: pxToDp(4), // 线条宽度
                    curveness: 0,
                    opacity: 1,
                },
                itemStyle: {
                    color: "#D3D3D3",
                },
                categories: [
                    {
                        name: "Type 1",
                        itemStyle: {
                            color: "#D3D3D3", // 1 对应红色
                        },
                    },
                    {
                        name: "Type 2",
                        itemStyle: {
                            color: "#FFAC92", // 2 对应绿色
                        },
                    },
                    {
                        name: "Type 3",
                        itemStyle: {
                            color: "#35CBB2", // 2 对应绿色
                        },
                    },
                ],
            },
        ],
    };

    useEffect(() => {
        console.log("数据变化", data, links);
        let datanow = _.cloneDeep(data),
            linknow = _.cloneDeep(links);
        chart.setOption({
            series: [
                {
                    data: datanow,
                    links: linknow,
                },
            ],
        });
    }, [data, links]);
    const additionalCode = `
  chart.on('click', function(param) {
      var obj = {
      type: 'event_clicked',
      data: param.data
      };

      sendData(obj);
  });
`;
    const onData = (e) => {
        nextLevel(e.name);
    };
    return (
        <View style={[{ flex: 1 }]}>
            <ECharts
                ref={(ref) => {
                    chart = ref;
                }}
                option={option}
                // option={_o}
                // backgroundColor="rgba(93, 169, 81, 0.3)"
                onData={(e) => {
                    console.log("onData", e.data);
                    onData(e.data);
                }}
                onMessage={() => console.log("onMessage", e)}
                additionalCode={additionalCode}
                onChartReady={() => {
                    console.log("Chart is ready!");
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({});
export default Avatar;

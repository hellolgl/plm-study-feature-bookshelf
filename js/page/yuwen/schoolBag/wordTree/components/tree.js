import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import url from "../../../../../util/url";
import { ECharts } from "react-native-echarts-wrapper";
import * as _ from "lodash";
import { pxToDp } from "../../../../../util/tools";

const Tree = ({ data, handleClick }) => {
    const option = {
        animationDuration: 3000,
        animationEasingUpdate: "quinticInOut",
        series: [
            {
                name: "字学树",
                type: "graph",
                layout: "force",
                draggable: "true",
                force: {
                    repulsion: 1000,
                    gravity: 0.1,
                    edgeLength: 200,
                    layoutAnimation: true,
                },
                data: data.data,
                links: data.links,
                roam: true,
                label: {
                    normal: {
                        show: true,
                        position: "inside",
                        fontSize: pxToDp(56),
                        color: '#475266'
                    },
                },
                lineStyle: {
                    normal: {
                        width: 3,
                        color: "#FFB82E",
                        curveness: 0,
                        type: "solid",
                    },
                },
                itemStyle: {
                    color: '#D3D3D3'
                }
            },
        ],
    }

    const additionalCode = `
    chart.on('click', function(param) {
        var obj = {
        type: 'event_clicked',
        data: param.data
        };

        sendData(obj);
    });
`;
    return (
        <ECharts
            option={option}
            onData={(e) => {
                handleClick(e.data);
            }}
            onMessage={() => console.log("onMessage", e)}
            additionalCode={additionalCode}
        />
    );
};

export default Tree;

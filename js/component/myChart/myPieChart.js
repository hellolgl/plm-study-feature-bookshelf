import React, { useEffect, useState } from 'react'
import { StyleSheet, processColor, Platform, View } from 'react-native'
import {
    pxToDp, size_tool,
} from "../../util/tools";
import {
    PieChart
} from 'react-native-charts-wrapper';

const myLineChart = (props) => {

    const [data, setdata] = useState([
        {
            label: 'x',
            value: 20
        },
        {
            label: 'y',
            value: 80
        }
    ])

    const [linename, setlinename] = useState([])
    const [arangelist, setarangelist] = useState([])
    const legend = {
        horizontalAlignment: "RIGHT",
        verticalAlignment: 'TOP',
        enabled: false, //图例是否展示
        textSize: 14,
        form: 'SQUARE',
        formSize: 14,
        xEntrySpace: 10,
        yEntrySpace: 5,
        formToTextSpace: 5,
        wordWrapEnabled: true,
        maxSizePercent: 0.5,
    }

    useEffect(() => {
        let datanow = { ...data }
        setdata(props.value)
        setlinename(props.linename)
        setarangelist(props.arangelist)
        console.log('pie list', props)

    }, [props.value])

    return (
        <PieChart
            style={[{ flex: 1, width: 72, height: 72, backgroundColor: 'red' }]}
            data={{
                dataSets: [
                    {
                        values: [
                            {
                                label: '',
                                value: 20
                            },
                            {
                                label: '',
                                value: 80
                            },
                        ],
                        label: '饼图',

                        config: {
                            colors: [processColor('#77D102'), processColor('#fff')], //柱子默认显示颜色
                            // valueFormatter: 'percent',
                            // valueFormatterPattern: '%',
                            drawValues: false
                        }
                    },
                ],
            }}
            usePercentValues={false}
            centerTextRadiusPercent={10}
            holeRadius={0}
            // holeColor={processColor('#000000')}
            transparentCircleRadius={0}
            legend={legend}
            chartDescription={{
                text: ''
            }}
            scaleEnabled={false}
            touchEnabled={false}
        />

    )
}
export default myLineChart

const styles = StyleSheet.create(
    {
        mainWrap: {
            backgroundColor: 'linear - gradient(90deg, rgba(55, 55, 54, 1) 0 %, rgba(76, 76, 76, 1) 100 %)',
            height: '100%',
            width: '100%',
            padding: 24,
            backgroundColor: '#FFFFFFFF',
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: "space-between",
            height: 55,
            width: '100%',
            marginBottom: 24,
            paddingLeft: 33,
            backgroundColor: '#FFFFFFFF',
            borderRadius: 15,
        },
        headerTitle: {
            fontSize: 22,
            color: '#3F403F',

        },
        chart: {
            // width: pxToDp(),
            height: pxToDp(400)
        }
    }
)



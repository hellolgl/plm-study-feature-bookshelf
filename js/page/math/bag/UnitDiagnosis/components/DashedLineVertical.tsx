import React from 'react';
import { View } from 'react-native';
import Svg, { Line } from 'react-native-svg';

interface Props {
    height?: number;
    width?: number;        // 线“粗细”，默认 1
    color?: string;
    dashGap?: number;
    dashLength?: number;
}

export default function DashedLineVertical({
    height,
    width = 1,
    color = '#D9D9D9',
    dashGap = 4,
    dashLength = 4,
}: Props) {
    return (
        <View style={{ width, height }}>
            <Svg width="100%" height="100%">
                <Line
                    x1={width / 2}
                    y1="0"
                    x2={width / 2}
                    y2="100%"
                    stroke={color}
                    strokeWidth={width}
                    strokeDasharray={`${dashLength},${dashGap}`}
                />
            </Svg>
        </View>
    );
}
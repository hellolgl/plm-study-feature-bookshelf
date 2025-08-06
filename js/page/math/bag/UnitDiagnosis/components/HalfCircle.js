import React from 'react';
import { View, StyleSheet } from 'react-native';

export const LeftHalfCircle = ({ size = 100, color = '#4CAF50' }) => (
    <View
        style={[
            styles.halfCircle,
            {
                width: size / 2,
                height: size,
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
                backgroundColor: color,
            },
        ]}
    />
);

export const RightHalfCircle = ({ size = 100, color = '#2196F3' }) => (
    <View
        style={[
            styles.halfCircle,
            {
                width: size / 2,
                height: size,
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
                backgroundColor: color,
            },
        ]}
    />
);

const styles = StyleSheet.create({
    halfCircle: {
        borderTopLeftRadius: 1000, // 足够大即可
        borderBottomLeftRadius: 1000,
        borderTopRightRadius: 1000,
        borderBottomRightRadius: 1000,
    },
});
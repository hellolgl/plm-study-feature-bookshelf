import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import Lottie from 'lottie-react-native';
import {pxToDp} from '../util/tools';

function PlayIcon({style, source, playing, children}){
  return (
    <View>
      {playing ? (
        <Lottie
          source={source}
          autoPlay
          style={[styles.lottieWrap, style]}
        />
      ) : (
        <>{children}</>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  lottieWrap: {
    width: pxToDp(80),
    height: pxToDp(50),
  },
});
export default PlayIcon;

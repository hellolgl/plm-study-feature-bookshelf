import React, { PureComponent } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Text,
  Platform
} from "react-native";
import { fitHeight, pxToDp, padding_tool, pxToDpHeight } from "../../../util/tools";
import topaicTypes from '../../../res/data/MathTopaicType'
import Cursor  from "../Keyboard/Cursor";
import { appFont, appStyle } from "../../../theme";


class AnswerViewFranction extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
        fadeInOpacity: new Animated.Value(0),
    };
  }
componentDidMount(){
    this.loopOpcity()
}
loopOpcity = () => {
    const {fadeInOpacity} = this.state
    const animationArr = Animated.sequence([
        Animated.timing(fadeInOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
        }),
        Animated.timing(fadeInOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
        }),
    ]);
    Animated.loop(animationArr).start()
};

TouchIdx = (idx) => {
    this.props.changeIdx(idx)
}
CharView = () => {
    const {init_char_mat,cursor_idx} = this.props.value
    // let char_mat = init_char_mat
    // 字符串展示
    let char_view_mat = []
    let row_view_mat = []
    if (cursor_idx === -1 && init_char_mat.length === 0) {
        row_view_mat.push(
            <Cursor></Cursor>
        )
    }
    else {
        row_view_mat = init_char_mat.map((i,x)=>{
            if(cursor_idx === x){
                return <>
                    <TouchableOpacity style={[]}
                        onPress={() => this.TouchIdx(x)}
                        key={x}
                    >
                        <Text style={[styles.txt]}>
                            {init_char_mat[x]}
                        </Text>
                    </TouchableOpacity>
                    <Cursor></Cursor>
                </>
            }
            return <TouchableOpacity style={[]}
                    onPress={() => this.TouchIdx(x)}
                    key={x}
                >
                    <Text style={[styles.txt]}>
                        {init_char_mat[x]}
                    </Text>
                </TouchableOpacity>
        })
        if(cursor_idx === -1){
            // 代表从中间删数据删到不能在删了，如果需要光标自动到最后，这一个unshift就不要
            row_view_mat.unshift(
                <Cursor></Cursor>
            )
        }
    }
    char_view_mat = <View style={[appStyle.flexLine]}>
        {row_view_mat}
    </View>
    return char_view_mat
}
  render() {
    return (
      <>
          {this.CharView()}
      </>
    );
  }
}

const styles = StyleSheet.create({
    txt:{
        fontSize:pxToDp(36),
        ...appFont.fontFamily_jcyt_500,
        color:"#4C4C59"
    }
});
export default AnswerViewFranction;

import React, { PureComponent } from "react"
import {
    Text,
    StyleSheet,
    View,
    Image,
    ScrollView,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Dimensions,
    Platform,
    ImageBackground
} from "react-native"
import _, { size } from "lodash"

import { pxToDp, size_tool } from "../../../../util/tools"
import { appFont, appStyle, mathFont } from "../../../../theme"
import { connect } from "react-redux";
import * as actionCreators from "../../../../action/yuwen/language";
import fonts from "../../../../theme/fonts"

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

class DoExerciseRecord extends PureComponent {
    constructor(props) {
        super(props)
    }


    render() {

        return <View style={[styles.container]}>

        </View>
    }
}

const styles = StyleSheet.create({



})
const mapStateToProps = (state) => {
    return {
        language_data: state.getIn(["languageChinese", "language_data"]),
    };
};

const mapDispathToProps = (dispatch) => {
    return {
        setLanguageData(data) {
            dispatch(actionCreators.setLanguageData(data));
        }
    };
};

export default connect(mapStateToProps, mapDispathToProps)(DoExerciseRecord);

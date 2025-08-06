import React, { PureComponent } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ImageBackground,
    Platform,
    ScrollView,
} from "react-native";
import { appFont, appStyle } from "../../../theme";
import { pxToDp, pxToDpHeight } from "../../../util/tools";

const bg_map = {
    0: "#DD5F74",
    1: "#2ED197",
};

const color_map = {
    0: "#8F0D23",
    1: "#028053",
};

class TopicNums extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            currentIndex: 0,
        };
    }
    componentDidMount() {
        this.props.onRef(this);
    }

    clickItem = (item, index, noCLick) => {
        // ;
        this.setState(
            {
                currentIndex: index,
            },
            () => {
                this.props.clickItem(item, index);
            }
        );
    };

    initIndex = () => {
        this.setState({
            currentIndex: 0,
        });
    };


    nextIndex = (index) => {
        this.setState({
            currentIndex: index,
        });
    };

    render() {
        const { list } = this.props;
        const { currentIndex } = this.state;
        console.log('list', list)
        return (
            <ScrollView horizontal={true}>
                {list.map((item, index) => {
                    return (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.item,
                                currentIndex === index ? styles.item_active : null,
                            ]}
                            onPress={() => {
                                if (this.props.noClick) return;
                                this.clickItem(item, index);
                            }}
                        >
                            <View
                                style={[
                                    styles.num,
                                    bg_map[item.correct]
                                        ? { backgroundColor: bg_map[item.correct] }
                                        : null,
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.num_txt,
                                        color_map[item.correct]
                                            ? { color: color_map[item.correct] }
                                            : null,
                                    ]}
                                >
                                    {index + 1}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    item: {
        width: pxToDp(72),
        height: pxToDp(72),
        borderRadius: pxToDp(36),
        marginRight: pxToDp(24),
        ...appStyle.flexCenter,
    },
    item_active: {
        borderWidth: pxToDp(4),
        borderColor: "#00B295",
    },
    num: {
        width: pxToDp(56),
        height: pxToDp(56),
        borderRadius: pxToDp(28),
        backgroundColor: "#9BD5E8",
        ...appStyle.flexCenter,
    },
    num_txt: {
        color: "#00745F",
        fontSize: pxToDp(28),
        ...appFont.fontFamily_jcyt_500,
    },
});

export default TopicNums;

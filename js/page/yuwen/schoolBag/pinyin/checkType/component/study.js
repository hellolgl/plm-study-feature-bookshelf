import React, { PureComponent } from "react";
import {
    View,
    DeviceEventEmitter
} from "react-native";
import { appStyle, appFont } from "../../../../../../theme";
import {
    size_tool,
    pxToDp,
    pxToDpHeight,
    padding_tool,
} from "../../../../../../util/tools";
import axios from "../../../../../../util/http/axios";
import api from "../../../../../../util/http/api";
import Header from "../../../../../../component/Header";
import NavigationUtil from "../../../../../../navigator/NavigationUtil";
import { connect } from "react-redux";
import LookPinyinWordItem from "../../../../../../component/chinese/pinyin/LookPinyinWordItem";
class LookAllExerciseHome extends PureComponent {
    constructor(props) {
        super(props);
        this.eventListenerRefreshPage = undefined
        let language_data = props.language_data.toJS();
        this.state = {
            wordobj: [],
            language_data,
        };
    }
    componentDidMount() {
        this.getList();
        this.eventListenerRefreshPage = DeviceEventEmitter.addListener(
            "refreshPinyinStudy",
            (event) => {
                this.getList();
            }
        );
    }
    componentWillUnmount() {
        this.eventListenerRefreshPage && this.eventListenerRefreshPage.remove()
    }
    getList = () => {
        axios
            .get(api.chinesePinyinGetKnowWord, {
                params: { p_id: this.props.data.p_id },
            })
            .then((res) => {
                console.log("回调", res.data.data);
                let knowObj = res.data.data;
                let list = [];
                for (let i in knowObj) {
                    i !== "tag" && list.push(...knowObj[i]);
                }
                if (res.data.err_code === 0) {
                    if (res.data.data.tag) {
                        this.props.showStar();
                    }
                    this.setState({
                        wordobj: list,
                    });
                }
            })
    };
    goBack = () => {
        NavigationUtil.goBack(this.props);
    };

    checkThis = (item) => {
        const { token } = this.props
        if (!token) {
            NavigationUtil.resetToLogin(this.props);
            return
        }
        // NavigationUtil.toChinesePinyinLookWordDetail({
        //     ...this.props, data: {
        //         ...item,
        //         updata: () => { this.getList() }
        //     }
        // })
        NavigationUtil.toChinesePinyinStudy({ ...this.props, data: item });
    };

    render() {
        const { wordobj, language_data } = this.state;
        const { show_translate } = language_data;
        return (
            <View
                style={[
                    { height: "100%" },
                    appStyle.flexTopLine,
                    appStyle.flexCenter,
                    padding_tool(112, 80, 112, 80),
                ]}
            >
                {wordobj.map((item, index) => {
                    return (
                        <LookPinyinWordItem
                            show_translate={show_translate}
                            value={item}
                            props={this.props}
                            clickBack={this.checkThis.bind(this, item)}
                        />
                    );
                })}
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        userInfo: state.getIn(["userInfo", "currentUserInfo"]),
        token: state.getIn(["userInfo", "token"]),
        language_data: state.getIn(["languageChinese", "language_data"]),
    };
};

const mapDispathToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispathToProps)(LookAllExerciseHome);

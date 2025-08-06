import React, { PureComponent } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ImageBackground,
    Animated,
    Platform,
} from "react-native";
import { appStyle, appFont } from "../../../../../theme";
import { size_tool, pxToDp, padding_tool, borderRadius_tool, fontFamilyRestoreMargin } from "../../../../../util/tools";
import axios from '../../../../../util/http/axios'
import api from '../../../../../util/http/api'
import Header from '../../../../../component/Header'
import NavigationUtil from "../../../../../navigator/NavigationUtil";
import { connect } from "react-redux";
import { Toast } from "antd-mobile-rn";
import { ScrollView } from "react-native-gesture-handler";
import LookPinyinWordItem from '../../../../../component/chinese/pinyin/LookPinyinWordItem'
class LookAllExerciseHome extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            wordobj: {}

        };

    }
    componentDidMount() {
        this.getList()

    }
    getList = () => {
        axios.get(api.chinesePinyinGetKnowWord, { params: { p_id: this.props.navigation.state.params.data.p_id } }).then((res) => {
            console.log("回调", res.data.data)
            if (res.data.err_code === 0) {
                this.setState({
                    wordobj: res.data.data
                })
            }
        })
    }
    goBack = () => {
        NavigationUtil.goBack(this.props);
    }

    checkThis = (item) => {
        NavigationUtil.toChinesePinyinLookWordDetail({
            ...this.props, data: {
                ...item,
                updata: () => { this.getList() }
            }
        })
    }

    render() {
        const { wordobj } = this.state
        return (<View></View>
            // <ImageBackground
            //     source={require('../../../../../images/chineseHomepage/pingyin/homeBg.png')}
            //     style={[, { flex: 1, position: 'relative', paddingTop: Platform.OS === 'ios' ? pxToDp(40) : 0 }]}>
            //     <TouchableOpacity
            //         onPress={this.goBack}
            //         style={[{ position: 'absolute', top: pxToDp(48), left: pxToDp(48), zIndex: 99999 }]}>
            //         <Image
            //             source={require('../../../../../images/chineseHomepage/pingyin/back.png')}
            //             style={[size_tool(80),
            //             ]}
            //         />
            //     </TouchableOpacity>
            //     <View style={[{ flex: 1, },
            //     appStyle.flexTopLine, appStyle.flexCenter,
            //     padding_tool(0, 80, 0, 80)
            //     ]}>
            //         <ImageBackground
            //             source={
            //                 Platform.OS === 'ios' ?
            //                     require('../../../../../images/chineseHomepage/pingyin/ios/lookAllWordBg.png')
            //                     :
            //                     require('../../../../../images/chineseHomepage/pingyin/lookAllWordBg.png')}
            //             style={[Platform.OS === 'ios' ? size_tool(1948, 1324) : size_tool(1840, 946), appStyle.flexCenter, padding_tool(20, 100, 60, 100)]}
            //         >
            //             <Text
            //                 style={[{
            //                     fontSize: pxToDp(50),
            //                     color: "#fff", marginBottom: pxToDp(60)
            //                 }, appFont.fontFamily_syst, fontFamilyRestoreMargin('', -32)]}
            //             >拼一拼</Text>
            //             <View style={[{ flex: 1, width: '100%' }, appStyle.flexCenter, padding_tool(40, 0, 0, 0)]}>
            //                 <View style={[{ height: pxToDp(200), width: '100%', }, appStyle.flexTopLine, appStyle.flexJusCenter]}>
            //                     {
            //                         wordobj['1']?.map((item, index) => {
            //                             return <LookPinyinWordItem value={item} props={this.props} clickBack={this.checkThis.bind(this, item)} />
            //                         })

            //                     }
            //                 </View>
            //                 <View style={[appStyle.flexTopLine, padding_tool(40, 0, 40, 0)]}>
            //                     <View style={[{ width: pxToDp(500), justifyContent: 'flex-end' }, appStyle.flexTopLine]}>
            //                         {
            //                             wordobj['2']?.map((item, index) => {
            //                                 return <LookPinyinWordItem value={item} props={this.props} clickBack={this.checkThis.bind(this, item)} />
            //                             })

            //                         }
            //                     </View>
            //                     <View style={[{
            //                         backgroundColor: '#FFFAE5',
            //                         borderColor: '#FFD688',
            //                         borderWidth: pxToDp(6),
            //                         borderRadius: pxToDp(16),
            //                         height: pxToDp(220)
            //                     },
            //                     padding_tool(0, 60, 0, 60),
            //                     appStyle.flexCenter
            //                     ]}>
            //                         <Text style={[{
            //                             fontSize: pxToDp(160),
            //                             fontFamily: Platform.OS === 'ios' ? 'AaBanruokaishu (Non-Commercial Use)' : '1574320058',
            //                             color: '#333'
            //                         }]}>
            //                             {this.props.navigation.state.params.data.knowledge_point}
            //                         </Text>
            //                     </View>

            //                     <View style={[{ marginLeft: pxToDp(40), width: pxToDp(500), }, appStyle.flexTopLine]}>
            //                         {
            //                             wordobj['3']?.map((item, index) => {
            //                                 return <LookPinyinWordItem value={item} props={this.props} clickBack={this.checkThis.bind(this, item)} />
            //                             })

            //                         }
            //                     </View>
            //                 </View>
            //                 <View style={[{ height: pxToDp(200), }, appStyle.flexTopLine]}>
            //                     {
            //                         wordobj['4']?.map((item, index) => {
            //                             return <LookPinyinWordItem value={item} props={this.props} clickBack={this.checkThis.bind(this, item)} />
            //                         })

            //                     }
            //                 </View>
            //             </View>
            //         </ImageBackground>

            //     </View>

            // </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "pink"
    }
});
const mapStateToProps = (state) => {
    return {
        userInfo: state.getIn(["userInfo", "currentUserInfo"]),
    };
};

const mapDispathToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispathToProps)(LookAllExerciseHome);
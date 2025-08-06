import React, { PureComponent } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
} from "react-native";
import { appStyle } from "../../../../theme";
import { size_tool, pxToDp, padding_tool } from "../../../../util/tools";
import axios from '../../../../util/http/axios'
import api from '../../../../util/http/api'
import Bar from "../../../../component/bar";
import NavigationUtil from "../../../../navigator/NavigationUtil";
import UserInfo from "../../../../component/userInfo";
import { connect } from 'react-redux';
import { LineChart } from 'react-native-charts-wrapper'
import CircleStatistcs from '../../../../component/circleStatistcs'
import MyBarChart from '../../../../component/myBarChart'
class StatisticsItem extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            unitList: [],
            list: [
            ],
            paiList: [

            ],
            checkType: '1'
        };
    }
    componentDidMount() {
        console.log(this.props.navigation.state.params.data)
        this.getList()
    }
    getList() {
        const { userInfo, textBookCode } = this.props;
        const { checkType } = this.state
        const userInfoJs = userInfo.toJS();
        //console.log(userInfoJs, 'userInfoJs')
        const data = {}
        data.grade_code = userInfoJs.checkGrade;
        data.term_code = userInfoJs.checkTeam;
        data.student_code = userInfoJs.id;
        data.subject = '03' //英语学科
        console.log('textBook', this.props.textBookCode)

        data.textbook = textBookCode || '20' //教材code
        data.time_segment = this.props.navigation.state.params.data.type
        data.exercise_element = this.props.navigation.state.params.data.exercise_element.substr(0, 1)
        axios.get(api.englishGetStacisticsItem, { params: { ...data } }).then(
            res => {
                let list = res.data.data
                console.log('list', list)
                let classList = []

                // list.map((item) => {
                //     classList.push(item)
                // })
                this.setState(() => ({
                    list: list.ability_statistic,
                    paiList: list.knowledge_rate
                })
                )
            }
        )
    }
    goBack() {
        NavigationUtil.goBack(this.props);
    }
    checkType(typeItem) {
        this.getList(typeItem.value)
        this.setState({
            checkType: typeItem.value
        })
    }

    renderThreeItem(list) {
        return list.map((item, index) => {
            return <View key={index} style={{
                width: pxToDp(612),
                height: pxToDp(530),
                backgroundColor: "#fff",
                borderRadius: pxToDp(32),
                padding: pxToDp(40),
                marginBottom: pxToDp(40)
            }}>
                <View>
                    <Text style={{ fontSize: pxToDp(32), color: '#333333' }}>{item.related_ability_primary}</Text>
                    <Text>{''}</Text>
                </View>
                <MyBarChart width={500} right={Number(item.r_total)} wrong={Number(item.w_total)} />
            </View>
        })
    }
    renderFourItem(list) {
        return list.map((item, index) => {
            return <View key={index} style={{
                width: pxToDp(440),
                height: pxToDp(530),
                backgroundColor: "#fff",
                borderRadius: pxToDp(32),
                padding: pxToDp(30),
                marginBottom: pxToDp(40)
            }}>
                <View>
                    <Text style={{ fontSize: pxToDp(32), color: '#333333' }}>{item.related_ability_primary}</Text>
                    <Text>{''}</Text>
                </View>
                <MyBarChart width={400} right={Number(item.r_total)} wrong={Number(item.w_total)} />
            </View>
        })
    }
    renderFiveItem(list) {
        return list.map((item, index) => {
            return <View key={index} style={{
                width: pxToDp(350),
                height: pxToDp(530),
                backgroundColor: "#fff",
                borderRadius: pxToDp(32),
                padding: pxToDp(30),
                marginBottom: pxToDp(40)
            }}>
                <View>
                    <Text style={{ fontSize: pxToDp(32), color: '#333333' }}>{item.related_ability_primary}</Text>
                    <Text>{''}</Text>
                </View>
                <MyBarChart width={300} right={Number(item.r_total)} wrong={Number(item.w_total)} />
            </View>
        })
    }
    rendernull() {

    }
    render() {
        const { list, typeList, checkType, paiList } = this.state;
        return (
            <View style={[padding_tool(72, 48, 48, 48)]}>
                <View style={[styles.header, appStyle.flexCenter]}>
                    <Text style={{ fontSize: pxToDp(40), color: '#333333' }}>
                        {this.props.navigation.state.params.data.exercise_element}
                    </Text>
                    <TouchableOpacity
                        onPress={() => this.goBack()}
                        style={[
                            {
                                position: "absolute",
                                top: pxToDp(0),
                                left: pxToDp(0),
                                width: pxToDp(128),
                                height: pxToDp(104),
                                borderRadius: pxToDp(32),
                                backgroundColor: '#fff',
                                justifyContent: 'center',
                                alignItems: 'center'
                            },
                        ]}
                    >
                        <Image
                            source={require("../../../../images/statisticsGoBack.png")}
                            style={[size_tool(64)]}
                        ></Image>
                    </TouchableOpacity>
                </View>
                <View style={{ width: "100%" }}>
                    <View style={[styles.left]}>
                        {list.length === 3 ? this.renderThreeItem(list) : this.rendernull()}
                        {list.length === 4 ? this.renderFourItem(list) : this.rendernull()}
                        {list.length === 5 ? this.renderFiveItem(list) : this.rendernull()}
                    </View>
                    <View style={[styles.right]}>
                        {paiList.map((item, index) => {
                            return <View key={index} style={{
                                backgroundColor: "#fff",
                                borderRadius: pxToDp(20),
                                padding: pxToDp(40),
                                flexDirection: 'row'
                            }}>
                                <View style={{ marginRight: pxToDp(70) }}>
                                    <Text style={{
                                        fontSize: pxToDp(32),
                                        color: '#333',
                                        marginBottom: pxToDp(35)
                                    }}>{item.knowledgepoint_type}</Text>
                                    <Text style={{
                                        fontSize: pxToDp(32),
                                        color: '#AAAAAA'
                                    }}>
                                        Pass rate
                                    </Text>
                                </View>
                                <View>
                                    <CircleStatistcs
                                        total={item.total}
                                        right={Number(item.percent)}
                                        size={176}
                                        width={28}
                                        tintColor={index % 2 === 1 ? '#FCAC14' : '#77D102'}
                                        backgroundColor={index % 2 === 1 ? '#FEEED0' : '#E4F6CC'}
                                        type='percent'
                                    />

                                </View>

                            </View>
                        })}
                    </View>

                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#EEF3F5",
    },
    header: {
        height: pxToDp(110),
        backgroundColor: "#fff",
        borderRadius: pxToDp(16),
        marginBottom: pxToDp(48),
        position: "relative",
        justifyContent: 'space-between'
    },
    left: {
        width: '100%',
        height: pxToDp(530),
        // backgroundColor: "#fff",
        borderRadius: pxToDp(32),
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginBottom: pxToDp(40)
    },
    right: {
        // flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        height: pxToDp(200)
    },

});

const mapStateToProps = (state) => {
    return {
        userInfo: state.getIn(["userInfo", "currentUserInfo"]),
        textBookCode: state.getIn(["bagEnglish", "textBookCode"])

    }
}

const mapDispathToProps = (dispatch) => {
    return {

    }
}


export default connect(mapStateToProps, mapDispathToProps)(StatisticsItem)

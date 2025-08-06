import React, { PureComponent } from "react";
import {
    View, Text, StyleSheet, TouchableOpacity, Image,
    PermissionsAndroid, TextInput, ScrollView
} from "react-native";
import {
    borderRadius_tool,
    pxToDp, size_tool,
} from "../../../../../util/tools";
import LinearGradient from "react-native-linear-gradient";
import { appStyle } from "../../../../../theme";
import axios from "../../../../../util/http/axios";
import { connect } from "react-redux";
// import { launchImageLibrary } from "react-native-image-picker";
import ImagePicker from 'react-native-syan-image-picker'
import { Toast, } from "antd-mobile-rn";
import DropdownSelect from "../../../../../component/Select";

class UploadImage extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            imgList: [],
            articleName: '我的作文',
            gradeList: [
                {
                    value: "01",
                    label: "一年级",
                },
                {
                    value: "02",
                    label: "二年级",
                },
                {
                    value: "03",
                    label: "三年级",
                },
                {
                    value: "04",
                    label: "四年级",
                },
                {
                    value: "05",
                    label: "五年级",
                },
                {
                    value: "06",
                    label: "六年级",
                },
            ],
            termList: [
                {
                    value: "00",
                    label: "上学期",
                },
                {
                    value: "01",
                    label: "下学期",
                },
            ],
            grade_code: '',
            term_code: '',
            isloading: false
        };
    }
    componentDidMount() {

    }


    requestPermission = async (dispatch, getState) => {
        // if (Platform.OS === 'android') {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    title: '当前程序需要获取相机权限',
                    message: '打开相机需要获得相机权限',
                    buttonNeutral: '稍后再问',
                    buttonNegative: '取消',
                    buttonPositive: '打开权限'
                }
            )
            console.log('权限', granted)
            // PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            // {
            //     title: '申请读写手机存储权限',
            //     message:
            //         '一个很牛逼的应用想借用你的摄像头，' +
            //         '然后你就可以拍出酷炫的皂片啦。',
            //     buttonNeutral: '等会再问我',
            //     buttonNegative: '不行',
            //     buttonPositive: '好吧',
            // },
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {

            } else {

            }
        } catch (err) {

        }
        // } else {


    }


    photo() {
        console.log('response1 =')
        this.requestPermission().then(() => {
            let options = {
                title: '请选择图片来源',
                cancelButtonTitle: '取消',
                takePhotoButtonTitle: '拍照',
                chooseFromLibraryButtonTitle: '相册图片',
                storageOptions: {
                    skipBackup: true,
                    path: 'images'
                }
            }
            ImagePicker.showImagePicker({
                ...options,
                mediaType: 'photo',
                maxHeight: 1000,
                maxWidth: 1000,
                quality: 0.8,
                // isRecordSelected: true
            }, (err, res) => {
                if (err) {
                    console.log("err", err)

                } else {
                    console.log("res", res)
                    this.setState({
                        imgList: res
                    })
                }
            })
        })

    }

    delthisImg = (index) => {
        let listnow = JSON.parse(JSON.stringify(this.state.imgList))
        listnow.splice(index, 1)
        this.setState({
            imgList: listnow
        })
    }
    uploadMP3 = (file) => {
        const { imgList, articleName, grade_code, term_code } = this.state;
        const { userInfo } = this.props;
        const userInfoJs = userInfo.toJS();
        let formData = new FormData();
        let filelist = []
        if (grade_code && term_code) {
            for (var i = 0; i < imgList.length; i++) {
                var uri = imgList[i].uri;
                var index = uri.lastIndexOf("/");
                var name = uri.substring(index + 1, uri.length);
                let file = { uri: uri, type: 'multipart/form-data', name: name };
                formData.append('file' + i, file);
            }

            formData.append("name", articleName);
            formData.append("grade_code", grade_code);
            formData.append("term_code", term_code);
            console.log('file', formData)
            const config = {
                headers: { "Content-Type": "multipart/form-data" },
            };
            axios
                .post(
                    "http://www.pailaimi.com/api/student_blue/upload_composition",
                    // "http://192.168.0.148:5000/api/student_blue/upload_composition",
                    formData,
                    config
                )
                .then((res) => {
                    if (res.data.err_code === 0) {
                        this.props.uplodDown()
                    } else {
                        Toast.info('上传失败，请稍后重试!')
                    }
                });
        } else {
            this.setState({
                isloading: true
            }, () => {
                setTimeout(() => {
                    this.setState({
                        isloading: false
                    })
                }, 2000)
            })
        }

    };
    onChangeText = (text,) => {
        this.setState({
            articleName: text,
        })
    }
    selectChange = (type, value) => {
        if (type === 'grade') {
            this.setState({
                grade_code: value.value
            })
        } else {
            this.setState({
                term_code: value.value
            })
        }
    }
    render() {
        const { imgList, articleName, gradeList, termList, isloading } = this.state;
        return (
            <View style={[{ height: '100%', paddingBottom: pxToDp(60) }]}>
                <View style={[appStyle.flexTopLine, { marginBottom: pxToDp(10), }]}>
                    <Text style={[styles.txtName]}>年级：</Text>
                    <View style={{ width: pxToDp(300) }}>
                        <DropdownSelect
                            options={gradeList}
                            // dropItemStyleCheckBg={'#F99C32'}
                            dropItemText={{ fontSize: pxToDp(36), color: '#333' }}
                            selectItem={this.selectChange.bind(this, 'grade')}
                        ></DropdownSelect>
                    </View>
                    <Text style={[styles.txtName]}>学期：</Text>
                    <View style={{ width: pxToDp(300) }}>
                        <DropdownSelect
                            options={termList}
                            // dropItemStyleCheckBg={'#F99C32'}
                            dropItemText={{ fontSize: pxToDp(36), color: '#333' }}
                            selectItem={this.selectChange.bind(this, 'term')}
                        ></DropdownSelect>
                    </View>


                    <Text style={[styles.txtName,]}>作文名：</Text>
                    <TextInput
                        style={{ height: pxToDp(80), borderColor: '#CB8345', color: '#CB8345', borderWidth: pxToDp(4), width: pxToDp(400), borderRadius: pxToDp(16), fontSize: pxToDp(32) }}
                        onChangeText={text => this.onChangeText(text)}
                        value={articleName}

                    />
                    <TouchableOpacity onPress={this.photo.bind(this)}
                        style={[size_tool(200, 60), borderRadius_tool(32), appStyle.flexCenter,
                        {
                            backgroundColor: '#FDE7BE',
                            marginLeft: pxToDp(40)
                        }]}>

                        <Text style={[{ fontSize: pxToDp(32), color: '#B75416' }]}>选择照片</Text>
                    </TouchableOpacity>
                </View>
                {
                    isloading ?
                        <Text style={[{
                            fontSize: pxToDp(40),
                            color: 'red',
                            lineHeight: pxToDp(80)
                        }]}>
                            请选择年级，学期以后再上传作文！
                        </Text>
                        : null
                }
                <View style={[appStyle.flexJusBetween, { flexGrow: 1, }]}>
                    <View style={[{ flex: 1, marginBottom: pxToDp(20), paddingTop: pxToDp(30) }]}>
                        <ScrollView>
                            <View style={[appStyle.flexTopLine, appStyle.flexLineWrap,]}>
                                {
                                    imgList.map((item, index) => {
                                        return <View style={[appStyle.flexCenter, { marginRight: pxToDp(10), marginBottom: pxToDp(10) }]} key={index}>
                                            <Image source={{ uri: item.uri }} style={[size_tool(400)]} />
                                            <TouchableOpacity onPress={this.delthisImg.bind(this, index)}><Text>删除</Text></TouchableOpacity>
                                        </View>
                                    })
                                }
                            </View>
                        </ScrollView>
                    </View>

                    <TouchableOpacity onPress={this.uploadMP3}
                        style={[size_tool(200, 60), borderRadius_tool(32), appStyle.flexCenter, { backgroundColor: '#FDE7BE' }]}>
                        <Text style={[{ fontSize: pxToDp(32), color: '#B75416' }]}>上传作文</Text></TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    txtName: {
        fontSize: pxToDp(32),
        color: '#AAAAAA',
        fontWeight: 'bold',
        lineHeight: pxToDp(80)
    }
});
const mapStateToProps = (state) => {
    return {
        userInfo: state.getIn(["userInfo", "currentUserInfo"]),
    };
};

const mapDispathToProps = (dispatch) => {
    return {
        setUser(data) {
            dispatch(actionCreators.setUserInfoNow(data));
        },
    };
};

export default connect(mapStateToProps, mapDispathToProps)(UploadImage);

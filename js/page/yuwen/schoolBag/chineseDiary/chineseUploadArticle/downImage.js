
import React, { PureComponent } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, PermissionsAndroid, TextInput, } from "react-native";
import CameraRoll from '@react-native-community/cameraroll'
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
import { ScrollView } from "react-native-gesture-handler";
import { Toast } from "antd-mobile-rn";
import RNFS from 'react-native-fs';
const baseSrc = 'https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/'
class UploadImage extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            imgList: [],
            articleName: '我的作文'
        };
    }
    componentDidMount() {

    }

    savePicture = (uri) => {
        if (!uri) return null;
        return new Promise((resolve, reject) => {
            let timestamp = new Date().getTime(); //获取当前时间错
            let random = String((Math.random() * 1000000) | 0); //六位随机数
            let dirs =
                Platform.OS === 'ios'
                    ? RNFS.LibraryDirectoryPath
                    : RNFS.ExternalDirectoryPath; //外部文件，共享目录的绝对路径（仅限android）
            const downloadDest = `${dirs}/${timestamp + random}.png`;
            const formUrl = uri;
            const options = {
                fromUrl: formUrl,
                toFile: downloadDest,
                background: true,
                begin: (res) => {
                    // console.log('begin', res);
                    // console.log('contentLength:', res.contentLength / 1024 / 1024, 'M');
                },
            };
            try {
                const ret = RNFS.downloadFile(options);
                // console.log('dirs', formUrl)

                ret.promise
                    .then((res) => {
                        // console.log('success', res);
                        console.log('file://' + downloadDest)
                        var promise = CameraRoll.save(downloadDest);
                        promise
                            .then(function (result) {
                                alert('保存成功！地址如下：\n' + result);
                                // Toast.info('保存图片成功！', 1)
                            })
                            .catch(function (error) {
                                console.log('error', error);
                                // alert('保存失败！\n' + error);
                            });
                        resolve(res);
                    })
                    .catch((err) => {
                        reject(new Error(err));
                        // console.log('error1', err);
                    });
            } catch (e) {
                reject(new Error(e));
            }
        });
    }
    downImage = (item) => {
        // var path = RNFS.DocumentDirectoryPath + '/test.txt';

        // write the file
        // let uri = 'https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/chinese/2022/5/7/exercise/image/81be0757871843d09989234cf904051a.png'
        this.savePicture(baseSrc + item)
        // RNFS.writeFile(path, file, 'utf8')
        //     .then((success) => {
        //         console.log('FILE WRITTEN!', success);
        //     })
        //     .catch((err) => {
        //         console.log(err.message);
        //     })

    }



    render() {
        const { imgList, articleName } = this.state;
        const { articleDetail, islookReview } = this.props
        return (
            <View style={[appStyle.flexCenter]}>
                <Text style={[{ fontSize: pxToDp(32), fontWeight: 'bold' }]}>标题：《{articleDetail.name}》</Text>
                <View style={[size_tool(1600, 600)]}>
                    <ScrollView>
                        {islookReview ?
                            articleDetail.review_image_path?.length > 0 ?
                                articleDetail.review_image_path.map((item, index) => {
                                    return <View style={[appStyle.flexCenter]} key={index}>
                                        <Image source={{ uri: baseSrc + item }} style={[size_tool(1500, 1000)]} />
                                        <TouchableOpacity onPress={this.downImage.bind(this, item)}
                                            style={[size_tool(200, 60), borderRadius_tool(32), appStyle.flexCenter,
                                            {
                                                backgroundColor: '#FDE7BE',
                                                marginLeft: pxToDp(40),
                                                marginBottom: pxToDp(16)
                                            }]}>

                                            <Text style={[{ fontSize: pxToDp(32), color: '#B75416', }]}>下载图片</Text>
                                        </TouchableOpacity>
                                    </View>
                                })
                                : null
                            :
                            articleDetail.image_path?.length > 0 ?
                                articleDetail?.image_path.map((item, index) => {
                                    return <View style={[appStyle.flexCenter]} key={index}
                                    >

                                        <Image source={{ uri: baseSrc + item }} style={[size_tool(1500, 1000), { marginBottom: pxToDp(16) }]} />
                                        <TouchableOpacity onPress={this.downImage.bind(this, item)}
                                            style={[size_tool(200, 60), borderRadius_tool(32), appStyle.flexCenter,
                                            {
                                                backgroundColor: '#FDE7BE',
                                                marginLeft: pxToDp(40),
                                                marginBottom: pxToDp(16)
                                            }]}>
                                            <Text style={[{ fontSize: pxToDp(32), color: '#B75416', }]}>下载图片</Text>
                                        </TouchableOpacity>
                                    </View>
                                })
                                : null
                        }

                    </ScrollView>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({

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

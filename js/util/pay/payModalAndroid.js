import React from "react"
import {
    Alert,
    FlatList,
    Image,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator,
    Modal,
} from "react-native"
import { pxToDp } from "../tools"
import { Toast } from "antd-mobile-rn"
import * as _ from "lodash"
import * as IAP from "react-native-iap"

import DropDown from "./dropDown"
import axios from "../http/axios"
import api from "../http/api"

const log = console.log.bind(console)


class PayModal extends React.Component {
    constructor() {
        super()
        this.state = {
            selectGrade: null,
            selectTerm: null,
            selectProductId: 0,

            subscribeTimesArrIndex: 0,

            // 派莱米商品列表
            productInfoList: [],
            // 默认是语文学科
            subject: "01",
            // 选中的商品
            selectProduct: "",
            // 商品所包含的年级
            grades: [],
            // 商品所包含的学期
            terms: [],

            // 商品图片信息
            imgInfoList: [],
            // 微信小程序商品 id
            pId: -1,
            showLoading: false,
            productIapPrice: 0,
            productPrice: 0,
            showProductPrice: 0,
            showProductIapPrice: 0,
        }

        this.duration = ["一个月", "两个月", "四个月(学期)"]

        this.subscribeTimesMap = {
            0: 1,
            1: 2,
            2: 4,
        }
        this.gradeMap = {
            "01": "一年级",
            "02": "二年级",
            "03": "三年级",
            "04": "四年级",
            "05": "五年级",
            "06": "六年级",
        }

        this.termMap = {
            "00": "上学期",
            "01": "下学期",
        }

        // this.invertGradeMap = _.invert(this.gradeMap)
        // this.invertTermMap = _.invert(this.termMap)

        // 支付相关
        this.purchaseUpdatedListener = null
        this.purchaseErrorSubscription = null

        this.buyInfo = {}
        this.handleBuyEventThrottled = _.throttle(this.buyEvent, 1 * 1000, { 'trailing': false });
    }

    buyEvent = () => {
        const { transactionId, transactionReceipt, pId, subscribeTimesArrIndex } = this.buyInfo
        const data = {
            // app 内对应的 id， 561 对应一年级上学期语文智学树
            product_id: pId,
            multiple: this.subscribeTimesMap[subscribeTimesArrIndex],
            lifetime: 0,
            transaction_id: transactionId,
            receipt_data: transactionReceipt,
        }

        log("pid: ", pId)
        // this.setState({
        //     showLoading: false,
        //     selectGrade: null,
        //     selectTerm: null,
        // }, () => {
        //     this.props.onClose()
        //     this.props.refreshGoods()
        //     Toast.info("您已成功完成购买!")
        // })

        // 向后端发送苹果支付成功订单信息
        axios.post("/apple_payment_blue/apple_payment_launch", data, { timeout: 20000 }).then(res => {
            this.setState({
                showLoading: false,
                selectGrade: null,
                selectTerm: null,
                subscribeTimesArrIndex: 0,
            }, () => {
                this.props.onClose()
                this.props.refreshGoods()
                Toast.info("您已成功完成购买!")
            })
        }).catch(err => {
            log("ERROR: ", JSON.stringify(err))
            this.setState({
                showLoading: false,
                selectGrade: null,
                selectTerm: null,
                subscribeTimesArrIndex: 0,
            }, () => {
                this.props.onClose()
                this.props.refreshGoods()
                Toast.info("购买失败，请求超时")
            })
            // retry
        })
        // axios.post("/apple_payment_blue/apple_payment_launch", data).then(res => {
        //     this.setState({
        //         showLoading: false,
        //         selectGrade: null,
        //         selectTerm: null,
        //     }, () => {
        //         this.props.onClose()
        //         this.props.refreshGoods()
        //         Toast.info("您已成功完成购买!")
        //     })
        // }).catch(err => {
        //     log("ERROR: ", JSON.stringify(err))
        //     // retry
        //     log("WILL RETRY send")
        //     setTimeout(() => {
        //         axios.post("/apple_payment_blue/apple_payment_launch", data).then(res => {
        //             this.setState({
        //                 showLoading: false,
        //                 selectGrade: null,
        //                 selectTerm: null,
        //             }, () => {
        //                 this.props.onClose()
        //                 this.props.refreshGoods()
        //                 Toast.info("您已成功完成购买!")
        //             })
        //         })
        //     }, 2000)
        // })
    }

    componentDidMount() {
        const { subject, selectModule } = this.props
        this.setState({
            subject,
        })

        // 获取商品信息，用来展示页面
        this.updateProductList(selectModule, subject)
        // 在iOS下初始化IAP

    }


    componentDidUpdate(prevProps, prevState) {
        // log("componentDidUpdate prevProps: ", prevProps)
        // log("componentDidUpdate thisProps: ", this.props)
        if (prevProps.subject !== this.props.subject) {
            const { subject, selectModule } = this.props
            // 获取商品信息，用来展示页面
            this.updateProductList(selectModule, subject)
            this.setState({
                subject,
            })
            // this.iapConnectionInit()
        } else if (prevProps.selectModule !== this.props.selectModule) {
            const { subject, selectModule } = this.props
            // 获取商品信息，用来展示页面
            this.updateProductList(selectModule, subject)
            this.setState({
                subject,
            })
        }
    }

    getDefaultGradeAndTerm = (productName, data) => {
        const { checkGrade, checkTerCode } = this.props
        const defaultGradesInfo = data[productName]['gradesInfo'][0]
        const grades = Array.from(new Set(data[productName]['gradesInfo'].map(v => v[0]).sort()))
        const terms = Array.from(new Set(data[productName]['gradesInfo'].filter(v => v[0] === grades[0]).map(item => item[1])))
        const [_grade, _term,] = defaultGradesInfo
        let pId
        let productId
        pId = data[productName]['gradesInfo'][0][3]
        if ((checkGrade !== "") && (checkTerCode !== "")) {
            const ts = Array.from(new Set(data[productName]['gradesInfo'].filter(v => v[0] === checkGrade).map(item => item[1])))
            if (grades.includes(checkGrade)) {
                if (ts.includes(checkTerCode)) {
                    for (let i = 0; i < data[productName]['gradesInfo'].length; i++) {
                        const gradesInfo = data[productName]['gradesInfo'][i]
                        if (`${gradesInfo[0]}_${gradesInfo[1]}` === `${checkGrade}_${checkTerCode}`) {
                            productId = gradesInfo[2]
                            pId = gradesInfo[3]
                            break
                        }
                    }
                    return [productId, grades.map(g => this.gradeMap[g]), ts.map(t => this.termMap[t]), pId]
                }
                for (let i = 0; i < data[productName]['gradesInfo'].length; i++) {
                    const gradesInfo = data[productName]['gradesInfo'][i]
                    if (`${gradesInfo[0]}_${gradesInfo[1]}` === `${checkGrade}_${terms[0]}`) {
                        productId = gradesInfo[2]
                        pId = gradesInfo[3]
                        break
                    }
                }
                return [productId, grades.map(g => this.gradeMap[g]), ts.map(t => this.termMap[t]), pId]
            }
        }
        productId = data[productName]['gradesInfo'][0][2]
        pId = data[productName]['gradesInfo'][0][3]
        return [productId, grades.map(g => this.gradeMap[g]), terms.map(t => this.termMap[t]), pId]
    }

    updateProductList = (selectModule, subject) => {
        console.log('商品', `${api.getPurchaseProductsList}?alias=${selectModule}&subject=${subject}`)
        axios.get(`${api.getPurchaseProductsList}?alias=${selectModule}&subject=${subject}`).then(
            res => {
                const rawData = res.data.data
                console.log('rawData', rawData)
                if (Object.keys(rawData).length === 0) {
                    this.setState({
                        selectProduct: "",
                        productInfoList: [],
                        imgInfoList: [],
                        selectGrade: null,
                        selectTerm: null,
                        selectProductId: 0,
                        showLoading: false,
                        pId: -1,
                        productPrice: 0,
                        productIapPrice: 0,
                        showProductPrice: parseFloat(0).toFixed(2),
                        showProductIapPrice: parseFloat(0).toFixed(2),
                    })
                } else {
                    const data = this.parseData(rawData)
                    const defaultProductName = Object.keys(data)[0]
                    const productIapPrice = data[defaultProductName]['iapPrice']
                    const productPrice = data[defaultProductName]['price']
                    const [productId, grades, terms, pId] = this.getDefaultGradeAndTerm(defaultProductName, data)
                    const imgInfoList = Object.values(data).map(v => [`https://pailaimi-static.oss-cn-chengdu.aliyuncs.com/${v['imgPath']}`, v['name'], v['price'], v["iapPrice"]])
                    this.setState({
                        productInfoList: data,
                        selectProduct: defaultProductName,
                        imgInfoList,
                        // selectProductI  sd: productId,
                        grades,
                        terms,
                        // pId,
                        productPrice,
                        productIapPrice,
                        showProductIapPrice: parseFloat(productIapPrice).toFixed(2),
                        showProductPrice: parseFloat(productPrice).toFixed(2),
                    })
                }
            }
        )
    }


    componentWillUnmount() {
        log("delete listener...")
        // 移除 IAP Listener
        // if (Platform.OS === "ios") {
        this.setState({
            selectGrade: null,
            selectTerm: null,
            selectProductId: 0,
            productInfoList: [],
            showLoading: false,
            pId: -1,
            selectProduct: "",
        })
        this.closeConnection()
        // IAP.endConnection()
        // }
    }

    updateGradeAndTerm = ([grade, term]) => {
        // this.updateGrade(grade)
        // this.updateTerm(term)
        const { productInfoList, selectProduct } = this.state
        if (productInfoList.length !== 0) {
            const gradesInfo = productInfoList[selectProduct]['gradesInfo']
            let selectProductId = 0
            let pId = -1
            let terms = []
            for (let i = 0; i < gradesInfo.length; i++) {
                let g = gradesInfo[i]
                if (grade === g[0]) {
                    terms.push(this.termMap[g[1]])
                }
            }
            for (let i = 0; i < gradesInfo.length; i++) {
                let g = gradesInfo[i]
                if (`${grade}_${term}` === `${g[0]}_${g[1]}`) {
                    selectProductId = g[2]
                    pId = g[3]
                    break
                }
            }
            this.setState({
                selectGrade: grade,
                selectTerm: term,
                selectProductId,
                pId,
                terms,
            })
        }
    }

    updateSubscribeIndex = (index) => {
        const { productIapPrice, productPrice } = this.state
        const numMap = {
            0: 1,
            1: 2,
            2: 4,
        }

        this.setState({
            showProductPrice: (parseFloat(productPrice) * numMap[index]).toFixed(2),
            showProductIapPrice: (parseFloat(productIapPrice) * numMap[index]).toFixed(2),
            subscribeTimesArrIndex: index,
        })
    }

    purchase = () => {
        // if (Platform.OS==="ios") {
        // log("DDDDD: ", this.purchaseUpdatedListener)
        const { showProductIapPrice } = this.state
        const { selectProduct, selectProductId, subscribeTimesArrIndex, selectGrade, selectTerm, pId } = this.state
        if (selectProduct === "") {
            Alert.alert("该商品暂不存在～")
        } else if ((selectGrade === null) || (selectTerm === null)) {
            Alert.alert("请选择年级和学期～")
        } else {
            if (parseInt(showProductIapPrice) !== 0) {
                // Alert.alert(`即将购买 ${selectProduct} iapID: [${selectProductId}],  小程序ID:[${pId}] 年级: ${selectGrade} 学期: ${selectTerm} 时长 ${this.subscribeTimesMap[subscribeTimesArrIndex]}个月`)
                // this.setState({
                //     showLoading: true,
                // })
                // this.requestSubscription(selectProductId, this.subscribeTimesMap[subscribeTimesArrIndex])
                // NavifationUtil.toChineseDailyHome(this.props)

                this.props.toPay({
                    id: pId,
                    lenth: this.subscribeTimesMap[subscribeTimesArrIndex],
                    selectGrade,
                    selectTerm,
                    selectProduct,
                    showProductIapPrice
                })
                this.setState({
                    showLoading: false,
                    selectGrade: null,
                    selectTerm: null,
                    subscribeTimesArrIndex: 0,
                })
            } else {
                Alert.alert("没有可以购买的商品哦～")
            }
        }
        // }
    }

    getColor = (subject) => {
        const colorMap = {
            // 分别对应语数外
            "01": {
                selectedSubBgColor: "#FAF8F7",
                selectedBgColor: "#99755C",
                defaultBgColor: "#eee",
                selectedTextColor: "#fff",
                defaultTextColor: "#b7b7b7",
            },
            "02": {
                selectedSubBgColor: "#E7F1FF",
                selectedBgColor: "#5d85db",
                defaultBgColor: "#eee",
                selectedTextColor: "#fff",
                defaultTextColor: "#b7b7b7",
            },
            "03": {
                selectedSubBgColor: "#FBF3FF",
                selectedBgColor: "#B219FF",
                defaultBgColor: "#eee",
                selectedTextColor: "#fff",
                defaultTextColor: "#b7b7b7",
            },
        }
        return Object.values(colorMap[subject])
    }

    parseData = (data) => {
        if (Object.keys(data).length !== 0) {
            const d = {}
            for (const k in data) {
                d[k] = {}
                const values = data[k]
                const gradesInfo = []
                let iapImagePath = ""

                for (let i = 0; i < values.length; i++) {
                    const value = values[i]
                    const { iap_image_path } = value
                    if (iap_image_path !== "") {
                        iapImagePath = iap_image_path
                    }
                }

                for (let i = 0; i < values.length; i++) {
                    const value = values[i]
                    const { grade_code, term_code, iap_product_id, price, iap_price, p_id } = value
                    d[k]['imgPath'] = iapImagePath
                    d[k]['price'] = parseFloat(price).toFixed(2)
                    d[k]['iapPrice'] = parseFloat(iap_price).toFixed(2)
                    d[k]['name'] = k
                    gradesInfo.push([grade_code, term_code, iap_product_id, p_id])
                }
                d[k]['gradesInfo'] = gradesInfo
            }
            return d
        } else {
            return {}
        }
    }

    selectProductEvent = (productName, productPrice, productIapPrice) => {
        const { productInfoList, subscribeTimesArrIndex } = this.state
        const [productId, grades, terms, pId] = this.getDefaultGradeAndTerm(productName, productInfoList)
        this.setState({
            selectProduct: productName,
            selectGrade: null,
            selectTerm: null,
            selectProductId: productId,
            grades,
            pId,
            productPrice,
            productIapPrice,
            showProductIapPrice: parseFloat(productIapPrice * this.subscribeTimesMap[subscribeTimesArrIndex]).toFixed(2),
            showProductPrice: parseFloat(productPrice * this.subscribeTimesMap[subscribeTimesArrIndex]).toFixed(2),
        })
    }

    closeConnection = () => {
        if (this.purchaseUpdatedListener) {
            this.purchaseUpdatedListener.remove()
            this.purchaseUpdatedListener = null
        }

        if (this.purchaseErrorSubscription) {
            this.purchaseErrorSubscription.remove()
            this.purchaseErrorSubscription = null
        }
    }

    render() {
        const { visible } = this.props
        const { imgInfoList, subscribeTimesArrIndex, subject, selectProduct, showLoading, showProductPrice, showProductIapPrice, productInfoList } = this.state
        const [selectedSubBgColor, selectedBgColor, defaultBgColor, selectedTextColor, defaultTextColor] = this.getColor(subject)
        const logoMap = {
            "01": require('../../images/applePay/chinese_logo.png'),
            "02": require('../../images/applePay/math_logo.png'),
            "03": require('../../images/applePay/english_logo.png'),
        }
        // const imgInfoList = [require('../../images/applePay/p1.png'), require('../../images/applePay/p2.png'),]
        const up = "▲"
        const down = "▼"
        return (
            <View style={modalStyles.container}>
                <Modal
                    animationType='fade'
                    transparent={true}
                    visible={visible}
                    supportedOrientations={['portrait', 'landscape']}
                >
                    <View style={modalStyles.modalLayer}>
                        <View style={modalStyles.contentStyle}>
                            {
                                showLoading ?
                                    <View
                                        style={{
                                            position: "absolute",
                                            top: "40%",
                                            left: "47%",
                                            zIndex: 999,
                                        }}
                                    >
                                        <ActivityIndicator size="large" color={selectedBgColor} />
                                    </View>
                                    :
                                    null
                            }
                            <View
                                style={{
                                    marginLeft: pxToDp(150),
                                    position: 'absolute',
                                    right: pxToDp(160),
                                    top: pxToDp(20)
                                }}
                            >
                                <DropDown
                                    selectedColor={selectedBgColor}
                                    productInfoDict={{ selectProduct, productInfoList }}
                                    updateGradeInfo={this.updateGradeAndTerm}
                                />
                            </View>
                            <View
                                style={{
                                    width: "89%",
                                    marginLeft: pxToDp(126),
                                    justifyContent: "space-between",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    marginTop: pxToDp(-40),
                                    zIndex: 999,
                                }}
                            >
                                <View
                                >
                                    <Image style={[{ width: pxToDp(600), height: pxToDp(200) }]} source={logoMap[subject]} resizeMode="contain"></Image>
                                </View>



                                <View
                                >
                                    <TouchableOpacity onPress={() => {
                                        this.props.onClose()
                                        // this.closeConnection()
                                        this.setState({
                                            showLoading: false,
                                            selectGrade: null,
                                            selectTerm: null,
                                            subscribeTimesArrIndex: 0,
                                        })
                                    }}>
                                        <Image style={[{ width: pxToDp(80), height: pxToDp(80) }]} source={require('../../images/applePay/close_btn.png')} resizeMode="contain"></Image>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View
                                style={{
                                    marginLeft: pxToDp(50),
                                    height: pxToDp(420),
                                }}
                            >
                                <FlatList
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    data={imgInfoList}
                                    renderItem={({ item }) => {
                                        const [imgPath, productName, productPrice, productIapPrice] = item
                                        return <TouchableOpacity
                                            onPress={() => this.selectProductEvent(productName, productPrice, productIapPrice)}
                                        >
                                            <View
                                                style={[
                                                    styles.productSelectedItem, { borderColor: selectProduct !== productName ? "transparent" : selectedBgColor, }
                                                ]}
                                            >
                                                <Image
                                                    source={{ uri: imgPath }}
                                                    style={[styles.productImg]}
                                                />
                                            </View>
                                        </TouchableOpacity>
                                    }}
                                />
                            </View>

                            <View
                                style={{
                                    justifyContent: "flex-start",
                                    width: "100%",
                                    marginLeft: pxToDp(50),
                                }}
                            >
                                <Text
                                    style={{
                                        marginTop: pxToDp(10),
                                        color: "#a7a7a7",
                                        fontSize: pxToDp(26),
                                        fontWeight: "bold",
                                    }}
                                >购买时长:</Text>
                            </View>
                            <View
                                style={{
                                    marginLeft: pxToDp(50),
                                    marginTop: pxToDp(30),
                                    flexDirection: "row",
                                    width: "30%",
                                    justifyContent: "flex-start",
                                }}
                            >
                                {this.duration.map((d, index) => {
                                    return (
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.updateSubscribeIndex(index)
                                            }}
                                        >
                                            <View
                                                style={[styles.selectItem, d.length > 3 ? styles.selectItemBigWidth : styles.selectItemWidth, { borderColor: subscribeTimesArrIndex === index ? selectedBgColor : "transparent", backgroundColor: subscribeTimesArrIndex === index ? selectedSubBgColor : "#F6F6F7", }]}
                                            >
                                                <Text
                                                    style={[styles.selectItemText, { fontWeight: subscribeTimesArrIndex === index ? "bold" : "normal", color: subscribeTimesArrIndex === index ? selectedBgColor : "#4C4C59" }]}
                                                >{d}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    )
                                })}
                            </View>

                            <View
                                style={{
                                    marginTop: pxToDp(50),
                                    width: "100%",
                                    height: pxToDp(4),
                                    backgroundColor: "#F6F6F7",
                                }}
                            >
                            </View>
                            <View
                                style={{
                                    justifyContent: "flex-end",
                                    width: "100%",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    flex: 1,
                                }}
                            >
                                <View
                                    style={{
                                        marginRight: pxToDp(30),
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: "#909090",
                                            fontWeight: "bold",
                                            fontSize: pxToDp(28),
                                        }}
                                    >合计:</Text>
                                </View>
                                <View
                                    style={{
                                        flexDirection: "column",
                                        marginRight: pxToDp(40),
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: "#FF4949",
                                            fontSize: pxToDp(48),
                                            fontWeight: "bold",
                                        }}
                                    >{showProductIapPrice} <Text
                                        style={{
                                            color: "#FF4949",
                                            fontSize: pxToDp(24),
                                        }}
                                    >元</Text></Text>

                                    {/*{parseInt(showProductPrice)===0?*/}
                                    {/*    null*/}
                                    {/*    :*/}
                                    {/*    <Text*/}
                                    {/*        style={{*/}
                                    {/*            color: "#ccc",*/}
                                    {/*            textDecorationLine: "line-through",*/}
                                    {/*        }}*/}
                                    {/*    >{showProductPrice}元</Text>*/}
                                    {/*}*/}
                                </View>
                                <TouchableOpacity
                                    onPress={() => {
                                        if (showLoading === false) {
                                            this.purchase()
                                        }
                                    }}
                                >
                                    <View
                                        style={{
                                            backgroundColor: selectedBgColor,
                                            width: pxToDp(240),
                                            height: pxToDp(96),
                                            justifyContent: "center",
                                            alignItems: "center",
                                            borderRadius: pxToDp(60),
                                            marginRight: pxToDp(30),
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: pxToDp(40),
                                                color: "#fff",
                                                fontWeight: "bold",
                                            }}
                                        >立即支付</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        )
    }
}

const modalStyles = StyleSheet.create({
    container: {
    },
    contentStyle: {
        borderRadius: pxToDp(30),
        width: pxToDp(1420),
        height: pxToDp(960),
        backgroundColor: '#fff',
        position: 'relative'
    },
    contentTextStyle: {
        textAlign: 'center',
        fontSize: pxToDp(36),
    },
    modalContentText: {
        fontSize: pxToDp(33),
        color: "#547fda",
    },
    modalLayer: {
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        flex: 1,
        textAlign: "center",
        justifyContent: 'center',
        alignItems: "center",
    },
    modalHeader: {
        height: pxToDp(96),
        backgroundColor: '#91b8ff',
        justifyContent: 'center'
    },
    modalHeaderText: {
        fontSize: pxToDp(36),
        color: "white",
        justifyContent: 'center',
        textAlign: "center",
    },
    modalTitleStyle: {
        textAlign: 'center',
        fontSize: 26
    },
    modalButtonStyle: {
        paddingLeft: 30,
        paddingRight: 30,
        marginTop: 10,
        textAlign: "center",
        justifyContent: 'center',
        alignItems: "center",
    }
})


const styles = StyleSheet.create({
    container: {

    },
    productSelectedItem: {
        // backgroundColor: "red",
        // marginRight: pxToDp(20) ,
        width: pxToDp(640),
        height: pxToDp(396),
        resizeMode: 'contain',
        borderRadius: pxToDp(50),
        flexDirection: "column",

        borderWidth: pxToDp(7),
        alignItems: "center",
        justifyContent: "center",
    },
    productImg: {
        width: pxToDp(608),
        height: pxToDp(364),
    },
    selectItem: {
        height: pxToDp(90),
        justifyContent: "center",
        alignItems: "center",
        borderRadius: pxToDp(20),
        marginRight: pxToDp(20),
        borderWidth: pxToDp(4),
    },
    selectItemWidth: {
        width: pxToDp(240),
    },
    selectItemBigWidth: {
        width: pxToDp(320),
    },
    selectItemText: {
        fontSize: pxToDp(36),
    },
    modalLayer: {
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        flex: 1,
        textAlign: "center",
        justifyContent: 'center',
        alignItems: "center",
    },
})

export default PayModal

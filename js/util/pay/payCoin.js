import React, { useEffect, useRef, useState } from "react";
import {
    Text,
    View,
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
    Modal,
    Image,
    Platform,
    Dimensions,
    FlatList,
    ActivityIndicator,
    DeviceEventEmitter,
} from "react-native";
import { pxToDp } from "../../util/tools";
import { useSelector, useDispatch } from "react-redux";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
import * as IAP from "react-native-iap";
import { appFont, appStyle } from "../../theme";
import QRCode from "react-native-qrcode-svg";
import api from "../../util/http/api";
import axios from "../../util/http/axios";
import MyToast from "../../component/myToast";
import _ from "lodash";

// 1元派币 => 100个派币  M_P1_2A_545
// 6元派币 => 600个派币  M_P1_2B_546
// 12元派币 => 1200个派币 M_P1_3A_196
// 28元派币 => 2800个派币 M_P1_3B_195

const coinList = [
    {
        coins: 100,
        money: 1,
        // money: 0.01,
        iap_product_id: "M_P1_2A_545",
    },
    {
        coins: 600,
        money: 6,
        // money: 0.02,
        // oldMoney: 7,
        iap_product_id: "M_P1_2B_546",
    },
    {
        coins: 1200,
        money: 12,
        // money: 0.03,
        // oldMoney: 15,
        iap_product_id: "M_P1_3A_196",
    },
    {
        coins: 2800,
        money: 28,
        // money: 0.04,
        // oldMoney: 40,
        iap_product_id: "M_P1_3B_195",
    },
];

function PayCoin({ visible }) {
    const [checkIndex, setCheckIndex] = useState(0);
    const [codeUrl, setCodeUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [showErr, setShowErr] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const dispatch = useDispatch();
    const { coin } = useSelector((state) => state.toJS().userInfo);
    const purchaseErrorSubscription = useRef(undefined);
    const purchaseUpdatedListener = useRef(undefined);
    const OS = Platform.OS;
    const currentIndex = useRef(0);
    useEffect(() => {
        currentIndex.current = checkIndex;
    }, [checkIndex]);
    useEffect(() => {
        if (visible) {
            axios.get(api.getMyCoinAndFire).then((res) => {
                dispatch({
                    type: "userInfo/setCoin",
                    data: res.data.data.total_gold,
                });
            });
        }
    }, [visible]);
    const onShow = () => {
        // 初始化 IAP 相关步骤
        // console.log('show::::::::::')
        if (OS === "ios") {
            IAP.initConnection()
                .catch(() => {
                    console.log("err connected to store...");
                })
                .then(() => {
                    // console.log('connected to store...');
                    purchaseErrorSubscription.current = IAP.purchaseErrorListener(
                        (error) => {
                            console.log("支付异常：：：：：：：", error);
                        }
                    );
                    purchaseUpdatedListener.current = IAP.purchaseUpdatedListener(
                        async (purchase) => {
                            try {
                                await IAP.finishTransaction({ purchase });
                                const { transactionId, transactionReceipt } = purchase;
                                saveOrder(transactionId, transactionReceipt);
                            } catch (error) {
                                console.log("支付异常：：：：：：：", error);
                            }
                        }
                    );
                });
        } else {
            getCode(0);
        }
    };
    const getCode = (index) => {
        const currentItem = coinList[index];
        const { money } = currentItem;
        setCodeUrl("");
        axios.post(api.getPayCoinWx, { amount: money }).then((res) => {
            const data = JSON.parse(res.data.data);
            setCodeUrl(data.code_url);
        });
    };
    const saveOrder = (transactionId, transactionReceipt) => {
        const currentItem = coinList[currentIndex.current];
        const { money, iap_product_id } = currentItem;
        const data = {
            product_id: iap_product_id,
            transaction_id: transactionId,
            receipt: transactionReceipt,
            price: money,
        };
        axios
            .post(api.savePayCoinApple, data)
            .then((res) => {
                setLoading(false);
                setTimeout(() => {
                    getMyCoin();
                }, 500);
            })
            .catch((err) => {
                setLoading(false);
                setShowErr(true);
            });
    };

    requestSubscription = async (currentItem) => {
        const { iap_product_id } = currentItem;
        setLoading(true);
        try {
            const items = Platform.select({
                ios: [iap_product_id],
                android: [""],
            });
            console.log("items: ", items);
            await IAP.getProducts({ skus: items });
            console.log("PRODUCT ID: ", iap_product_id);
            await IAP.requestSubscription({ sku: iap_product_id });
        } catch (err) {
            console.log("ERROR requestSubscription");
            setLoading(false);
            setShowErr(true);
            setTimeout(() => {
                setShowErr(false);
            }, 1000);
        }
    };

    const getMyCoin = async () => {
        let res = await axios.get(api.getMyCoinAndFire);
        DeviceEventEmitter.emit("refreshTypeList");
        // console.log("币", res.data);
        if (res.data.err_code === 0) {
            const newCoin = res.data.data.total_gold;
            dispatch({
                type: "userInfo/setCoin",
                data: newCoin,
            });
            if (newCoin !== coin) {
                setShowSuccess(true);
                setTimeout(() => {
                    setShowSuccess(false);
                    close();
                }, 1000);
            } else {
                close();
            }
        }
    };

    const close = () => {
        // console.log('close::::::::::')
        if (purchaseUpdatedListener.current) {
            purchaseUpdatedListener.current.remove();
            purchaseUpdatedListener.current = undefined;
        }
        if (purchaseErrorSubscription.current) {
            purchaseErrorSubscription.current.remove();
            purchaseErrorSubscription.current = undefined;
        }
        setCheckIndex(0);
        dispatch({
            type: "SET_PAYCOIN_VISIBLE",
            data: false,
        });
    };

    const renderItem = ({ item, index }) => {
        const { coins, money, oldMoney } = item;
        return (
            <TouchableOpacity
                style={[
                    styles.item,
                    appStyle.flexLine,
                    appStyle.flexJusBetween,
                    checkIndex === index ? styles.itemActive : null,
                ]}
                key={index}
                onPress={() => {
                    setCheckIndex(index);
                    getCode(index);
                }}
            >
                <View style={[appStyle.flexLine]}>
                    <Image
                        source={require("../../images/square/paiCoin2.png")}
                        style={[
                            {
                                width: pxToDp(87),
                                height: pxToDp(87),
                                marginRight: pxToDp(12),
                            },
                        ]}
                        resizeMode="stretch"
                    ></Image>
                    <Text
                        style={[
                            { color: "#474A4C", fontSize: pxToDp(42) },
                            appFont.fontFamily_jcyt_700,
                        ]}
                    >
                        x{coins}
                    </Text>
                </View>
                <View style={[appStyle.flexAliCenter, appStyle.flexEnd]}>
                    <View
                        style={[
                            styles.money,
                            appStyle.flexLine,
                            appStyle.flexCenter,
                            appStyle,
                        ]}
                    >
                        <Text
                            style={[
                                { color: "#F9F9F9", fontSize: pxToDp(33) },
                                appFont.fontFamily_jcyt_700,
                            ]}
                        >
                            {money}
                        </Text>
                        <Text
                            style={[
                                { color: "#F9F9F9", fontSize: pxToDp(25) },
                                appFont.fontFamily_jcyt_700,
                            ]}
                        >
                            元
                        </Text>
                    </View>
                    {oldMoney ? (
                        <Text
                            style={{
                                color: "#A9A9A9",
                                textDecorationLine: "line-through",
                                fontSize: pxToDp(21),
                                position: "absolute",
                                top: pxToDp(46),
                            }}
                        >
                            {oldMoney}元
                        </Text>
                    ) : null}
                </View>
            </TouchableOpacity>
        );
    };
    const currentItem = coinList[checkIndex];
    const { coins, money, oldMoney, iap_product_id } = currentItem;
    return (
        <Modal
            animationType="none"
            transparent={true}
            visible={visible}
            supportedOrientations={["portrait", "landscape"]}
            onShow={onShow}
        >
            <View style={[styles.container, appStyle.flexCenter]}>
                {loading ? (
                    <View
                        style={[
                            {
                                position: "absolute",
                                width: "100%",
                                height: "100%",
                                zIndex: 1,
                            },
                            appStyle.flexCenter,
                        ]}
                    >
                        <ActivityIndicator size="large" color="#FFBB00" />
                    </View>
                ) : null}
                {showErr ? (
                    <View
                        style={[
                            {
                                position: "absolute",
                                width: "100%",
                                height: "100%",
                                zIndex: 1,
                            },
                            appStyle.flexCenter,
                        ]}
                    >
                        <MyToast text={"支付失败"} />
                    </View>
                ) : null}
                {showSuccess ? (
                    <View
                        style={[
                            {
                                position: "absolute",
                                width: "100%",
                                height: "100%",
                                zIndex: 1,
                            },
                            appStyle.flexCenter,
                        ]}
                    >
                        <MyToast text={"支付成功"} />
                    </View>
                ) : null}
                <View style={[styles.content]}>
                    <TouchableOpacity style={[styles.closeBtn]} onPress={close}>
                        <Image
                            style={[{ width: pxToDp(100), height: pxToDp(100) }]}
                            source={require("../../images/chineseHomepage/sentence/status2.png")}
                        ></Image>
                    </TouchableOpacity>
                    <Text
                        style={[
                            { color: "#3F454B", fontSize: pxToDp(50), textAlign: "center" },
                            appFont.fontFamily_jcyt_500,
                        ]}
                    >
                        充值
                    </Text>
                    <View style={[appStyle.flexLine]}>
                        <View style={[{ flex: 1 }]}>
                            <View>
                                <View style={[appStyle.flexAliStart]}>
                                    <View
                                        style={[
                                            appStyle.flexLine,
                                            styles.myCoinWrap,
                                            appStyle.flexCenter,
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                {
                                                    color: "#333333",
                                                    fontSize: pxToDp(33),
                                                    marginRight: pxToDp(13),
                                                },
                                                appFont.fontFamily_jcyt_500,
                                            ]}
                                        >
                                            我的派币
                                        </Text>
                                        <View
                                            style={[
                                                appStyle.flexLine,
                                                styles.coinWrap,
                                                appStyle.flexCenter,
                                            ]}
                                        >
                                            <Image
                                                source={require("../../images/square/paiCoin2.png")}
                                                style={[
                                                    {
                                                        width: pxToDp(45),
                                                        height: pxToDp(45),
                                                        marginRight: pxToDp(10),
                                                    },
                                                ]}
                                                resizeMode="stretch"
                                            />
                                            <Text
                                                style={[
                                                    { color: "#333333", fontSize: pxToDp(25) },
                                                    appFont.fontFamily_jcyt_500,
                                                ]}
                                            >
                                                x{" "}
                                            </Text>
                                            <Text
                                                style={[
                                                    { color: "#333333", fontSize: pxToDp(33) },
                                                    appFont.fontFamily_jcyt_500,
                                                ]}
                                            >
                                                {coin}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={[{ marginBottom: pxToDp(35) }]}>
                                    <Text style={[styles.desTxt]}>
                                        1、每次充值后，如派币未到账，请您退出APP，重新登录账号查看。
                                    </Text>
                                    <Text style={[styles.desTxt]}>
                                        2、派效学不支持退款，请您审慎选择充值金额。
                                    </Text>
                                    <Text style={[styles.desTxt]}>
                                        3、我们的软件借助第三方AI工具为您生成每一段故事内容和语音，因此会出现生成语音无法完成的偶然事件，派莱米不承担和负有任何责任。当故事内容、语音没有生成成功时，我们不会扣除派币。
                                    </Text>
                                </View>
                                <FlatList
                                    data={coinList}
                                    renderItem={renderItem}
                                    keyExtractor={(item) => item.coins + ""}
                                    numColumns={2}
                                    horizontal={false}
                                />
                            </View>
                        </View>
                        <View
                            style={[
                                styles.right,
                                appStyle.flexAliCenter,
                                OS === "ios" ? { height: pxToDp(518) } : null,
                            ]}
                        >
                            {OS === "android" ? (
                                <>
                                    <Text
                                        style={[
                                            { color: "#F96262", fontSize: pxToDp(50) },
                                            appFont.fontFamily_jcyt_700,
                                        ]}
                                    >
                                        {money}元
                                    </Text>
                                    <View style={[styles.codeContent]}>
                                        <View
                                            style={[
                                                appStyle.flexLine,
                                                appStyle.flexJusBetween,
                                                { width: "100%", marginBottom: pxToDp(25) },
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    { color: "#474A4C", fontSize: pxToDp(25) },
                                                    appFont.fontFamily_jcyt_500,
                                                ]}
                                            >
                                                请使用微信扫码
                                            </Text>
                                            <TouchableOpacity
                                                style={[appStyle.flexLine]}
                                                onPress={() => {
                                                    getCode(checkIndex);
                                                }}
                                            >
                                                <Image
                                                    source={require("../../images/square/refresh_icon_1.png")}
                                                    style={[
                                                        {
                                                            width: pxToDp(32),
                                                            height: pxToDp(32),
                                                            marginRight: pxToDp(6),
                                                        },
                                                    ]}
                                                    resizeMode="stretch"
                                                ></Image>
                                                <Text
                                                    style={[
                                                        { color: "#FDC224", fontSize: pxToDp(25) },
                                                        appFont.fontFamily_jcyt_500,
                                                    ]}
                                                >
                                                    刷新
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View
                                            style={[
                                                { width: pxToDp(308), height: pxToDp(308) },
                                                appStyle.flexCenter,
                                            ]}
                                        >
                                            {codeUrl ? (
                                                <QRCode size={pxToDp(308)} value={codeUrl} />
                                            ) : (
                                                <ActivityIndicator size="large" color="#FFBB00" />
                                            )}
                                        </View>
                                    </View>
                                    <TouchableOpacity
                                        style={[styles.finishBtn, { marginTop: pxToDp(32) }]}
                                        onPress={getMyCoin}
                                    >
                                        <View style={[styles.finishBtnInner, appStyle.flexCenter]}>
                                            <Text
                                                style={[
                                                    { color: "#474A4C", fontSize: pxToDp(29) },
                                                    appFont.fontFamily_jcyt_700,
                                                ]}
                                            >
                                                我已完成扫码支付
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                </>
                            ) : (
                                <>
                                    <View style={[styles.titleWrap, appStyle.flexCenter]}>
                                        <Text
                                            style={[
                                                { color: "#474A4C", fontSize: pxToDp(42) },
                                                appFont.fontFamily_jcyt_700,
                                            ]}
                                        >
                                            结算
                                        </Text>
                                    </View>
                                    <View
                                        style={[
                                            styles.item,
                                            appStyle.flexLine,
                                            appStyle.flexJusBetween,
                                            styles.itemActive,
                                            {
                                                marginTop: pxToDp(70),
                                                marginBottom: pxToDp(70),
                                                marginRight: 0,
                                                width: pxToDp(385),
                                                height: pxToDp(124),
                                            },
                                        ]}
                                    >
                                        <View style={[appStyle.flexLine]}>
                                            <Image
                                                source={require("../../images/square/paiCoin2.png")}
                                                style={[
                                                    {
                                                        width: pxToDp(87),
                                                        height: pxToDp(87),
                                                        marginRight: pxToDp(12),
                                                    },
                                                ]}
                                                resizeMode="stretch"
                                            ></Image>
                                            <Text
                                                style={[
                                                    { color: "#474A4C", fontSize: pxToDp(42) },
                                                    appFont.fontFamily_jcyt_700,
                                                ]}
                                            >
                                                x{coins}
                                            </Text>
                                        </View>
                                        <View style={[appStyle.flexAliCenter, appStyle.flexEnd]}>
                                            <View
                                                style={[
                                                    styles.money,
                                                    appStyle.flexLine,
                                                    appStyle.flexCenter,
                                                    appStyle,
                                                ]}
                                            >
                                                <Text
                                                    style={[
                                                        { color: "#F9F9F9", fontSize: pxToDp(33) },
                                                        appFont.fontFamily_jcyt_700,
                                                    ]}
                                                >
                                                    {money}
                                                </Text>
                                                <Text
                                                    style={[
                                                        { color: "#F9F9F9", fontSize: pxToDp(25) },
                                                        appFont.fontFamily_jcyt_700,
                                                    ]}
                                                >
                                                    元
                                                </Text>
                                            </View>
                                            {oldMoney ? (
                                                <Text
                                                    style={{
                                                        color: "#A9A9A9",
                                                        textDecorationLine: "line-through",
                                                        fontSize: pxToDp(21),
                                                        position: "absolute",
                                                        top: pxToDp(46),
                                                    }}
                                                >
                                                    {oldMoney}元
                                                </Text>
                                            ) : null}
                                        </View>
                                    </View>
                                    <TouchableOpacity
                                        style={[styles.iosBtn]}
                                        onPress={() => {
                                            requestSubscription(currentItem);
                                        }}
                                    >
                                        <View style={[styles.iosBtnInner, appStyle.flexCenter]}>
                                            <Text
                                                style={[
                                                    { color: "#474A4C", fontSize: pxToDp(29) },
                                                    appFont.fontFamily_jcyt_700,
                                                ]}
                                            >
                                                支付
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        width: windowWidth,
        height: windowHeight,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
    },
    content: {
        backgroundColor: "#EFE9E6",
        width: pxToDp(1600),
        borderRadius: pxToDp(56),
        padding: pxToDp(40),
    },
    myCoinWrap: {
        minWidth: pxToDp(372),
        height: pxToDp(74),
        borderRadius: pxToDp(37),
        backgroundColor: "#E1DBD7",
        marginBottom: pxToDp(40),
        paddingLeft: pxToDp(30),
        paddingRight: pxToDp(16),
    },
    coinWrap: {
        minWidth: pxToDp(181),
        height: pxToDp(55),
        backgroundColor: "#EDE9E7",
        borderWidth: pxToDp(2),
        borderColor: "#fff",
        borderRadius: pxToDp(27),
        paddingLeft: pxToDp(20),
        paddingRight: pxToDp(20),
    },
    desTxt: {
        color: "rgba(63, 69, 75, .6)",
        fontSize: pxToDp(21),
        // ...appFont.fontFamily_jcyt_500,
        lineHeight: pxToDp(30),
    },
    right: {
        width: pxToDp(515),
        height: pxToDp(663),
        borderRadius: pxToDp(69),
        backgroundColor: "#fff",
        borderWidth: pxToDp(3),
        borderColor: "#E1DBD7",
        marginLeft: pxToDp(40),
    },
    item: {
        width: pxToDp(430),
        height: pxToDp(119),
        backgroundColor: "#F9F9F9",
        borderRadius: pxToDp(41),
        marginRight: pxToDp(50),
        marginBottom: pxToDp(50),
        paddingLeft: pxToDp(46),
        paddingRight: pxToDp(30),
        borderRadius: pxToDp(41),
        borderWidth: pxToDp(5),
        borderColor: "transparent",
    },
    itemActive: {
        backgroundColor: "#FFED95",
        borderColor: "#FFBB00",
    },
    money: {
        width: pxToDp(86),
        height: pxToDp(44),
        borderRadius: pxToDp(18),
        backgroundColor: "#FF5252",
    },
    codeContent: {
        width: pxToDp(308),
    },
    finishBtn: {
        width: pxToDp(400),
        height: pxToDp(95),
        borderRadius: pxToDp(30),
        backgroundColor: "#FFBB00",
        paddingBottom: pxToDp(5),
    },
    finishBtnInner: {
        flex: 1,
        backgroundColor: "#FFF4BC",
        borderRadius: pxToDp(30),
    },
    closeBtn: {
        position: "absolute",
        right: pxToDp(-30),
        top: pxToDp(-30),
    },
    titleWrap: {
        width: pxToDp(253),
        height: pxToDp(89),
        backgroundColor: "#FFD165",
        borderBottomLeftRadius: pxToDp(28),
        borderBottomRightRadius: pxToDp(28),
        borderBottomWidth: pxToDp(3),
        borderLeftWidth: pxToDp(3),
        borderRightWidth: pxToDp(3),
        borderColor: "#E1DBD7",
    },
    iosBtn: {
        width: pxToDp(400),
        height: pxToDp(95),
        borderRadius: pxToDp(30),
        paddingBottom: pxToDp(5),
        backgroundColor: "#FF8F32",
    },
    iosBtnInner: {
        flex: 1,
        backgroundColor: "#FFD165",
        borderRadius: pxToDp(30),
    },
    errWrap: {
        width: pxToDp(300),
        height: pxToDp(100),
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        borderRadius: pxToDp(50),
    },
});
export default PayCoin;

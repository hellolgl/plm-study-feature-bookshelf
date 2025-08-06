import React, { Component } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  DeviceEventEmitter,
  Alert,
  BackHandler,
  Platform,
  Modal,
  UIManager,
  findNodeHandle
} from "react-native";
import _ from "lodash";
import { connect } from "react-redux";
import { pxToDp, size_tool } from "../tools";
import { appFont, appStyle } from "../../theme";
import * as actionCreatorsPurchase from "../../action/purchase";
import QRcodePay from "../../util/pay/QRcodePay";
import axios from "../../util/http/axios";
import api from "../../util/http/api";
import * as actionCreators from "../../action/userInfo/index";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const formatPrice = (price) =>
  parseFloat(price)
    .toFixed(3)
    .replace(/\.?0*$/, "");

class ModuleSquare extends Component {
  constructor(props) {
    super(props);
  }

  toggleColor = () => {
  	const {alias, mustSelectModules,selectAliasModules,check,isPay} = this.props
  	// console.log("mustSelectModules: ", mustSelectModules)
    if(isPay){
      return
    }
  	if (mustSelectModules.includes(alias)) {
  		Alert.alert("该模块为必选模块！")
  	} else {
  		const {alias} = this.props
      selectAliasModules(alias,check)
  	}
  }

  renderIcon = () => {
    const { check,isPay } = this.props;
    if(isPay){
      return <View style={[appStyle.flexLine]}>
        <Image
          source={require("../../images/new-android-purchase/pay_check.png")}
          style={[{ width: pxToDp(40), height: pxToDp(40) }]}
        />
        <Text style={[appFont.fontFamily_jcyt_500,{color:'#C3C3C3',fontSize:pxToDp(23),marginLeft:pxToDp(8)}]}>已购买</Text>
      </View>

    }
    if(check){
      return <Image
        source={require("../../images/new-android-purchase/check.png")}
        style={[{ width: pxToDp(40), height: pxToDp(40) }]}
      />
    }
    return  <Image
      source={require("../../images/new-android-purchase/un-check.png")}
      style={[{ width: pxToDp(40), height: pxToDp(40) }]}
    />
  }

  render() {
    const { name, describe,check,isPay } = this.props;
    const squareColor = check ? "#484c64" : "#fff";
    const fontColor = check ? "#fff" : "#484c64";
    const specialList = ["巧算", "思维训练"]
    const isSpecial = specialList.includes(name)
    return (
      <TouchableOpacity
        style={[moduleSquareStyles.container]}
          onPress={this.toggleColor}
      >
        <View
          style={[moduleSquareStyles.square, { backgroundColor: squareColor },isPay?{backgroundColor:'#EDEDED'}:null]}
        >
          <View style={[moduleSquareStyles.topContent]}>
            {this.renderIcon()}
          </View>
          {
            isSpecial?
                <View
                    style={{
                      position: "absolute",
                      top: pxToDp(10),
                      right: pxToDp(10),
                    }}
                >
                  <Image
                      style={[{ width: pxToDp(102), height: pxToDp(123) }]}
                      source={require("../../images/new-android-purchase/gold.png")}
                  ></Image>
                </View>
                :
                null
          }

          <View style={[moduleSquareStyles.bottomContent]}>
            <Text
              style={[
                { color: fontColor },
                moduleSquareStyles.bottomContentTitle,
                appFont.fontFamily_jcyt_700,
                isPay?{color:'#9EA2A9'}:null
              ]}
            >
              {name}
            </Text>
            <Text
              style={[
                { color: fontColor },
                moduleSquareStyles.bottomContentDescribe,
                appFont.fontFamily_jcyt_500,
                isPay?{color:'#9EA2A9'}:null
              ]}
            >
              {describe}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const PurchaseItem = (props) => {
  const { itemInfo } = props;
  const { name, price, serviceType } = itemInfo.item;
  return (
    <View
      style={{
        flexDirection: "row",
        width: pxToDp(400),
        height: pxToDp(80),
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <View>
        <Text
          style={{
            fontSize: pxToDp(30),
            color: "#474C66",
            ...appFont.fontFamily_jcyt_700,
          }}
        >
          {name}
        </Text>
      </View>
      <View>
        <Text
          style={{
            fontSize: pxToDp(27),
            color: "#FF5C66",
            ...appFont.fontFamily_jcyt_700,
          }}
        >
          {`¥${formatPrice(price)} / ${serviceType === "year" ? "年" : "月"}`}
        </Text>
      </View>
    </View>
  );
};

class AIPlanShoppingCartModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      finalPrice: 0,
    };
    this.flatListRef = React.createRef();
    this.scrollRef = undefined
    this.plan_map = {}
  }
  selectAliasModules = (alias,check) => {
    const {modules} = this.props
    let _modules = _.cloneDeep(modules)
    _modules.forEach((i,x) => {
      i.module.forEach((ii,xx) => {
        if(ii.alias === alias){
          ii.check = check?0:1
        }
      })
    })
    this.props.setModules(_modules)
  }

  renderItem = ({ item }) => {
    const selectModule = this.props.selestModule.toJS()
    const purchaseModule =this.props.purchaseModule.toJS()
    const { name, detail, price, alias, check } = item;
    const isPay = purchaseModule.indexOf(alias) > -1 //代表该模块已经购买没有过期
    return (
      <View
        style={{
          margin: pxToDp(15),
        }}
      >
        <ConnectModalSquare
          name={name}
          check={check}
          describe={detail}
          alias={alias}
          price={price}
          isPay={isPay}
          selectModule={selectModule}
          selectAliasModules={this.selectAliasModules}
        />
      </View>
    );
  };

  getModulePriceList = (
    modulesInfoList,
    aliasModuleList,
    selectedServiceType
  ) => {
    const r = [];
    if (aliasModuleList.length !== 0) {
      aliasModuleList.forEach((alias) => {
        const item = modulesInfoList.filter((m) => m["alias"] === alias)[0];
        let { price, name } = item;
        if (selectedServiceType === "year") {
          // price = Math.floor(price * 12 * 100 * 0.8) / 100
          price = price * 12 * 0.8;
        }
        const d = {
          alias,
          name,
          price: price,
          serviceType: selectedServiceType,
        };
        r.push(d);
      });
      return r;
    } else {
      return r;
    }
  };

  setSelectedServiceType = (serviceType) => {
    this.props.setServiceType(serviceType);
  };

  getServiceContentStyle = (serviceType) => {
    const selectedServiceType = this.props.serviceType;
    let bgStyle = {
      width: pxToDp(220),
      height: pxToDp(80),
      backgroundColor: "#474C66",
      borderRadius: pxToDp(30),
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row",
    };
    let fontStyle = {
      color: "#FFFFFF",
      fontSize: pxToDp(26),
      ...appFont.fontFamily_jcyt_700,
    };
    if (serviceType !== selectedServiceType) {
      bgStyle = {
        width: pxToDp(220),
        height: pxToDp(80),
        backgroundColor: "#f4f4f4",
        borderRadius: pxToDp(30),
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
      };
      fontStyle = {
        color: "#283139",
        fontSize: pxToDp(26),
        ...appFont.fontFamily_jcyt_700,
      };
    }
    return { bgStyle, fontStyle };
  };

  renderServiceTypeButton = () => {
    const yearButtonStyleMap = this.getServiceContentStyle("year");
    const monthButtonStyleMap = this.getServiceContentStyle("month");
    return (
      <View
        style={{
          flexDirection: "row",
          backgroundColor: "#f4f4f4",
          borderRadius: pxToDp(30),
          marginTop: pxToDp(30),
        }}
      >
        <TouchableOpacity
          onPress={() => this.setSelectedServiceType("year")}
          style={[yearButtonStyleMap.bgStyle]}
        >
          <Text style={[yearButtonStyleMap.fontStyle]}>年卡</Text>
          <Text
            style={{
              color: "#FF964A",
              fontSize: pxToDp(22),
              ...appFont.fontFamily_jcyt_700,
              marginLeft: pxToDp(10),
            }}
          >
            8折
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.setSelectedServiceType("month")}
          style={[monthButtonStyleMap.bgStyle]}
        >
          <Text style={[monthButtonStyleMap.fontStyle]}>月卡</Text>
        </TouchableOpacity>
      </View>
    );
  };

  getNeedPurchaseProductsList = (modules) => {
    const { serviceType } = this.props;
    const selectedServiceType = serviceType;
    const checkedModules = modules.filter((i)=>{
      return i.check
    })
    const checkedModulesAlias =_.uniq(checkedModules.map((i) => {
      return i.alias
    }))
    if (checkedModulesAlias.length === 0) {
      return [];
    } else {
      const modulePriceList = this.getModulePriceList(
        modules,
        checkedModulesAlias,
        selectedServiceType
      );
      return modulePriceList;
    }
  };

  getFinalPrice = (modulePriceList) => {
    if (modulePriceList.length === 0) {
      return 0;
    } else {
      const rowPrice = _.sumBy(modulePriceList, function (o) {
        return parseFloat(o.price);
      });
      const finalPrice = formatPrice(rowPrice);
      return finalPrice;
    }
  };

  renderSelectModulePriceList = (modulePriceList) => {
    const selectedServiceType = this.props.serviceType;
    if (modulePriceList.length !== 0) {
      const finalPrice = this.getFinalPrice(modulePriceList);
      return (
        <View
          style={{
            // height: pxToDp(680),
            height: Dimensions.get("window").height * 0.6,
          }}
        >
          <FlatList
            ref={this.flatListRef}
            data={modulePriceList}
            renderItem={(item) => <PurchaseItem itemInfo={item} />}
            onContentSizeChange={() =>
              this.flatListRef.current.scrollToEnd({ animated: true })
            }
          />
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <Text
              style={{
                fontSize: pxToDp(26),
                ...appFont.fontFamily_jcyt_500,
              }}
            >
              合计
            </Text>
            <Text
              style={{
                color: "#FF5C66",
                fontSize: pxToDp(30),
                ...appFont.fontFamily_jcyt_700,
              }}
            >
              {`¥ ${finalPrice} ${
                selectedServiceType === "year" ? " / 年" : " / 月"
              }`}
            </Text>
          </View>
        </View>
      );
    } else {
      return (
        <View>
          <Text
            style={{
              fontSize: pxToDp(30),
              color: "#474C66",
              ...appFont.fontFamily_jcyt_700,
            }}
          >
            无选中模块
          </Text>
        </View>
      );
    }
  };

  renderPurchaseButton = (selectAliasModules) => {
    if(!selectAliasModules.length){
      return
    }
    return (
      <TouchableOpacity
        onPress={() => {

          this.setState({
            show: true,
          });
        }}
        style={[styles.item]}
      >
        <View style={[styles.item_inner]}>
          <Text
            style={[
              { fontSize: pxToDp(40), color: "#283139" },
              appFont.fontFamily_jcyt_700,
            ]}
          >
            立即支付
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  updateData = () => {
    DeviceEventEmitter.emit("afterPay");
    this.props.onClose();
  };

  closeQrcodePay = () => {
    this.updateData();
    this.setState({
      show: false,
    });
  };
  onLayout = (e,index) => {
    // console.log('fffff',e,x)
    let { x, y, width, height } = e.nativeEvent.layout;
    this.plan_map[index] = y
  }
  render() {
    const { visible, modules, serviceType } = this.props;
    if (!modules.length) return null;
    const selectedServiceType = serviceType;
    const { show } = this.state;
    const screenHeight = Dimensions.get("window").height;
    const flattenModules = _.flatten(modules.map((m) => m["module"]));
    const modulePriceList = this.getNeedPurchaseProductsList(flattenModules);
    const price = this.getFinalPrice(modulePriceList);
    const names = modulePriceList.map((m) => m["name"]);
    const selectAliasModules =  modulePriceList.map((i,x) => {
      return i.alias
    })
    const {grade} = this.props.userInfo.toJS();
    const product = {
      selectAliasModules,
      app_price: price,
      num: selectedServiceType === "year" ? 12 : 1,
      selectedServiceType,
      name: names.join("\n"),
    };
    return (
      <Modal
        visible={visible}
        onShow={()=>{
          const selectModule = this.props.selestModule.toJS()
          const {alias} = selectModule
          const {planIndex} = this.props
          // 获取推荐模块
          this.selectAliasModules(alias,false) //首次进入初始化当前选中模块
          this.scrollRef.scrollTo({ y: this.plan_map[planIndex] })
        }}
        onRequestClose={() => {
          this.props.setVisible(false);
        }}
      >
        <ImageBackground
          source={require("../../images/new-android-purchase/bg.png")}
          style={[styles.container]}
        >
          <TouchableOpacity
            style={[styles.btn]}
            onPress={() => {
              // if(this.backHandler && Platform.OS === "android") {
              // 	this.backHandler?.remove()
              // }
              // console.log("here.....")
              this.props.onClose();
            }}
          >
            <Image
              style={[{ width: pxToDp(120), height: pxToDp(80) }]}
              source={require("../../images/new-android-purchase/back_btn.png")}
            ></Image>
          </TouchableOpacity>
          <View style={[styles.content]}>
            <View style={[styles.leftContent]}>
              <ScrollView
                ref={view => this.scrollRef = view}
                style={{
                  width: "100%",
                  marginBottom: pxToDp(100),
                }}
              >
                {modules.map((i,x) => {
                  return <View key={x} onLayout={(e) => this.onLayout(e,x)}>
                      <View style={[appStyle.flexLine]}>
                        <Text
                          style={[
                            styles.leftContentTitle,
                            appFont.fontFamily_jcyt_700,
                          ]}
                        >
                          {i["h_name"]}
                        </Text>
                      </View>
                      {_.chunk(i["module"], 4).map((chunkItem) => {
                        return (
                          <View
                            style={{
                              justifyContent: "space-around",
                            }}
                          >
                            <FlatList
                              data={chunkItem}
                              horizontal={true}
                              renderItem={({ item }) =>
                                this.renderItem({ item })
                              }
                            />
                          </View>
                        );
                      })}
                    </View>
                })}
              </ScrollView>
            </View>
            <View style={[styles.rightContent]}>
              <View style={[styles.pandaLogo]}>
                <ImageBackground
                  resizeMode='stretch'
                  style={[size_tool(640, 76), appStyle.flexCenter]}
                  source={require("../../images/new-android-purchase/content-bg.png")}
                >
                  <Text
                    style={[
                      {
                        color: "#ffffff",
                        fontSize: pxToDp(36),
                        ...appFont.fontFamily_jcyt_500,
                      },
                    ]}
                  >
                    购买后解锁当前({grade})所对应的模块
                  </Text>
                </ImageBackground>
                <Image
                  style={[{ width: pxToDp(180), height: pxToDp(120) }]}
                  source={require("../../images/new-android-purchase/panda.png")}
                ></Image>
              </View>
              <View
                style={{
                  width: pxToDp(560),
                  height: screenHeight * 0.8,
                  borderRadius: pxToDp(50),
                  backgroundColor: "white",
                  alignItems: "center",
                  paddingLeft: pxToDp(20),
                  paddingRight: pxToDp(20),
                }}
              >
                {this.renderServiceTypeButton()}
                {this.renderSelectModulePriceList(modulePriceList)}
                {this.renderPurchaseButton(selectAliasModules)}
              </View>
            </View>
          </View>
        </ImageBackground>
        {show ? (
          <QRcodePay close={this.closeQrcodePay} product={product}></QRcodePay>
        ) : null}
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: windowWidth,
    height: windowHeight,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  btn: {
    // ...appStyle.flexCenter,
    position: "absolute",
    top: pxToDp(30),
    left: pxToDp(30),
  },
  content: {
    marginTop: pxToDp(130),
    // width: "100%",
    flexDirection: "row",
    flex: 1,
    marginLeft: pxToDp(60),
    marginRight: pxToDp(60),
  },
  leftContent: {
    flex: 7,
  },
  leftContentTitle: {
    fontSize: pxToDp(40),
    color: "#474C66",
  },
  rightContent: {
    flex: 3,
  },
  list: {
    padding: 10,
    flexDirection: "column",
  },
  pandaLogo: {
    flexDirection: "row",
    position: "absolute",
    alignItems: "center",
    top: pxToDp(-110),
    left: pxToDp(-300),
  },
  item: {
    height: pxToDp(110),
    width: pxToDp(400),
    backgroundColor: "#FFB649",
    borderRadius: pxToDp(40),
    paddingBottom: pxToDp(8),
    position: "absolute",
    bottom: pxToDp(10),
  },
  item_inner: {
    height: "100%",
    backgroundColor: "#FFDB5D",
    borderRadius: pxToDp(40),
    paddingLeft: pxToDp(40),
    paddingRight: pxToDp(40),
    ...appStyle.flexCenter,
    ...appStyle.flexLine,
  },
});

const moduleSquareStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  square: {
    width: pxToDp(280),
    height: pxToDp(280),
    borderRadius: pxToDp(30),
  },
  topContent: {
    margin: pxToDp(30),
  },
  topContentFont: {
    fontSize: pxToDp(30),
    color: "#484c64",
  },
  bottomContent: {
    marginLeft: pxToDp(30),
    marginRight: pxToDp(30),
  },
  bottomContentTitle: {
    fontSize: pxToDp(30),
  },
  bottomContentDescribe: {
    fontSize: pxToDp(20),
  },
});

const modalSquareMapStateToProps = (state) => {
  return {
    mustSelectModules: state.getIn(["purchase", "mustSelectModules"]),
  };
};

const mapStateToProps = (state) => {
  return {
    modules: state.getIn(["purchase", "modules"]),
    serviceType: state.getIn(["purchase", "serviceType"]),
    purchaseModule: state.getIn(["userInfo", "purchaseModule"]),
    userInfo: state.getIn(["userInfo", "currentUserInfo"]),
    selestModule:state.getIn(["userInfo", "selestModule"]),
    planIndex:state.getIn(["userInfo", "planIndex"]),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setLockPrimarySchool(data) {
      dispatch(actionCreators.setLockPrimarySchool(data));
    },
    setLockYoung(data) {
      dispatch(actionCreators.setLockYoung(data));
    },
    setPurchaseModule(data) {
      dispatch(actionCreators.setPurchaseModule(data));
    },
    setServiceType(data) {
      dispatch(actionCreatorsPurchase.setServiceType(data));
    },
    setVisible(data) {
      dispatch(actionCreatorsPurchase.setVisible(data));
    },
    setModules(data) {
      dispatch(actionCreatorsPurchase.setModules(data));
    },
  };
};

const ConnectModalSquare = connect(
  modalSquareMapStateToProps,
  {}
)(ModuleSquare);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AIPlanShoppingCartModal);

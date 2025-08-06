import store from "../store";
import { Dimensions, Platform } from "react-native";
import { isTablet } from "react-native-device-info";

// 设计图尺寸
// export const isTablet = isTablet
const UIWidth = 2048;
const UIHeight = 1536;
export const pxToDp = (px, width) => {
    let dw = Dimensions.get("window").width;
    if (width) {
        // 手机横屏
        return (px * dw) / width;
    }
    return (px * dw) / UIWidth;
};
export const pxToDpWidthLs = (px) => {
    return pxToDp(px, 1580); //2532手机横屏ui尺寸
};

export const pxToDpHeight = (px) => {
    let dw = Dimensions.get("window").height;
    return (px * dw) / UIHeight;
};

export const fitHeight = (coefficientAndroid, coefficientIos) => {
    let dh = Dimensions.get("window").height;
    if (Platform.OS === "android" && coefficientAndroid) {
        return dh * coefficientAndroid;
    }
    if (Platform.OS === "ios" && coefficientIos) {
        return dh * coefficientIos;
    }
    return "auto";
};

export const getHeaderPadding = (v) => {
    return v ? v : pxToDp(10);
};

export const has_key = (obj, key) => {
    if (!obj) {
        return false;
    }
    return obj.hasOwnProperty(key);
};

export const margin_tool = (...args) => {
    let margin = {};
    switch (args.length) {
        case 1:
            margin = {
                marginTop: pxToDp(args[0]),
                marginRight: pxToDp(args[0]),
                marginBottom: pxToDp(args[0]),
                marginLeft: pxToDp(args[0]),
            };
            break;
        case 2:
            margin = {
                marginTop: pxToDp(args[0]),
                marginRight: pxToDp(args[1]),
                marginBottom: pxToDp(args[0]),
                marginLeft: pxToDp(args[1]),
            };
            break;
        case 4:
            margin = {
                marginTop: pxToDp(args[0]),
                marginRight: pxToDp(args[1]),
                marginBottom: pxToDp(args[2]),
                marginLeft: pxToDp(args[3]),
            };
            break;
    }
    return margin;
};

export const padding_tool = (...args) => {
    let padding = {};
    switch (args.length) {
        case 1:
            padding = {
                paddingTop: pxToDp(args[0]),
                paddingRight: pxToDp(args[0]),
                paddingBottom: pxToDp(args[0]),
                paddingLeft: pxToDp(args[0]),
            };
            break;
        case 2:
            padding = {
                paddingTop: pxToDp(args[0]),
                paddingRight: pxToDp(args[1]),
                paddingBottom: pxToDp(args[0]),
                paddingLeft: pxToDp(args[1]),
            };
            break;
        case 4:
            padding = {
                paddingTop: pxToDp(args[0]),
                paddingRight: pxToDp(args[1]),
                paddingBottom: pxToDp(args[2]),
                paddingLeft: pxToDp(args[3]),
            };
            break;
    }
    return padding;
};

export const border_tool = (width, style, color, radius = 0) => {
    let border = {
        borderColor: color,
        borderWidth: pxToDp(width),
        borderStyle: style,
        borderRadius: pxToDp(radius),
    };
    return border;
};

export const size_tool = (...args) => {
    let result = {};
    switch (args.length) {
        case 1:
            result = {
                width: pxToDp(args[0]),
                height: pxToDp(args[0]),
            };
            break;
        case 2:
            result = {
                width: pxToDp(args[0]),
                height: pxToDp(args[1]),
            };
    }
    return result;
};

export const bg_color = (color) => {
    return { backgroundColor: color };
};

export const borderRadius_tool = (...args) => {
    let borderRadius = {};
    switch (args.length) {
        case 1:
            borderRadius = {
                borderTopLeftRadius: pxToDp(args[0]),
                borderTopRightRadius: pxToDp(args[0]),
                borderBottomRightRadius: pxToDp(args[0]),
                borderBottomLeftRadius: pxToDp(args[0]),
            };
            break;
        case 2:
            borderRadius = {
                borderTopLeftRadius: pxToDp(args[0]),
                borderTopRightRadius: pxToDp(args[1]),
                borderBottomRightRadius: pxToDp(args[0]),
                borderBottomLeftRadius: pxToDp(args[1]),
            };
            break;
        case 4:
            borderRadius = {
                borderTopLeftRadius: pxToDp(args[0]),
                borderTopRightRadius: pxToDp(args[1]),
                borderBottomRightRadius: pxToDp(args[2]),
                borderBottomLeftRadius: pxToDp(args[3]),
            };
            break;
    }
    return borderRadius;
};

export const isEmpty = (value) => {
    return (
        (Array.isArray(value) && value.length === 0) ||
        (Object.prototype.isPrototypeOf(value) && Object.keys(value).length === 0)
    );
};

// 替换所有
String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

Date.prototype.format = function (fmt) {
    // fmt = 'yyyy-MM-dd hh:mm:ss'
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        S: this.getMilliseconds(), //毫秒
    };
    if (!fmt) {
        fmt = "yyyy-MM-dd hh:mm:ss";
    }
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(
            RegExp.$1,
            (this.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(
                RegExp.$1,
                RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
            );
        }
    }
    return fmt;
};

export const fontFamilyRestoreMargin = (iosStyle, v, style) => {
    // v 用了字体后会自动增加行高，这个用来复原上下边距,有的地方需要直接设置一些样式才可以
    // if(style) return style
    // if(Platform.OS === 'ios'){
    //     return iosStyle?iosStyle:null
    // }else{
    //     return {marginBottom:pxToDp(v?v:-20),marginTop:pxToDp(v?v:-20)}
    // }
    return null;
};

// 去掉富文本标签获取纯文字
export const replaceData = (value) => {
    if (value) {
        return value
            .replace(/<[^>]+>/g, "")
            .replace(/ /gi, "")
            .replace(/\s/g, "");
    }
};

export const isChinese = (str) => {
    let reg = /.*[\u4e00-\u9fa5]+.*/;
    if (reg.test(str)) return true;
    return false;
};

export const getGradeInfo = () => {
    const _store = store.getState();
    const userInfo = _store.getIn(["userInfo", "currentUserInfo"]).toJS();
    const { grade, term } = userInfo;
    const gradeMap = {
        一年级: "01",
        二年级: "02",
        三年级: "03",
        四年级: "04",
        五年级: "05",
        六年级: "06",
    };
    const termMap = {
        上学期: "00",
        下学期: "01",
    };
    return {
        gradeCode: gradeMap[grade],
        termCode: termMap[term],
    };
};

export const ChangeRichToTxt = (html) => {
    const chineseCharsAndPunctuation = html.match(
        /(?:>)(.|\s)*?(?=<\/?\w+[^<]*>)/g
    );

    //  /(?)(.|\s)*?(?=<\/?\w+[^)/g
    // console.log('数据', html.match(/(?<=>)(.|\s)*?(?=<\/?\w+[^<]*>)/g).join('').replaceAll('&nbsp;', ''))

    // value.split("</p>").map((item) => {
    //     if (item.length > 0) {
    //         list.push(item + '</p>')
    //         let str = item + '</p>'
    //         let arr = str.match(/(?:>)(.|\s)*?(?=<\/?\w+[^<]*>)/g)
    //         htmllist.push(<View><Text style={[{ fontSize: pxToDp(36) }]}>{arr.join('').replaceAll('>', '').replaceAll('&nbsp;', '')}</Text></View>)
    //     }
    // })

    //  /(?)(.|\s)*?(?=<\/?\w+[^)/g
    // console.log('数据', html.match(/(?<=>)(.|\s)*?(?=<\/?\w+[^<]*>)/g).join('').replaceAll('&nbsp;', ''))
    if (chineseCharsAndPunctuation) {
        // 如果匹配成功，将匹配到的字符数组连接成一个字符串
        const chineseText = chineseCharsAndPunctuation.join("");
        return (
            chineseText
                // .replaceAll("（）", "")
                .replaceAll("&nbsp;", "")
                .replaceAll(">", "")
        );
    } else {
        // 如果没有匹配到字符，返回空字符串或者其他适当的值
        return "";
    }
};

export const getIsTablet = () => {
    if (Platform.OS === "ios") {
        return Platform.isPad;
    }
    const { height, width } = Dimensions.get("window");
    const diagonalSize = Math.sqrt(Math.pow(height, 2) + Math.pow(width, 2));
    const isTabletDevice = isTablet();
    // 根据实际情况调整阈值
    return isTabletDevice || diagonalSize >= 1000; // 平板设备阈值  华为板子1003
};

export const touristInfo = {
    account_id: 905,
    checkGrade: "03",
    checkTeam: "00",
    // class_code: 18,
    grade: "三年级",
    grade_code: "",
    id: 750,
    name: "游客",
    password: "123456",
    role: "student",
    sex: "0",
    term: "上学期",
    textBook: "11",
    textbookname: "北师版",
    username: "游客0021",
    isGrade: true,
};

export const isSymbol = (str) => {
    const symbolArr = [",", ".", ";", "?", "!"];
    return symbolArr.indexOf(str) > -1;
};
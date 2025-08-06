import * as _ from "lodash"
import DropDownPicker from "react-native-dropdown-picker"
import React from "react"
import { pxToDp } from "../tools"
import { View, Text, TouchableOpacity } from "react-native"

const log = console.log.bind(console)

class DropDown extends React.Component {

    constructor() {
        super()
        this.state = {
            open: false,
            value: null,
            items: [
                {
                    label: "一年级·上学期",
                    value: ["01", "00"],
                },
                {
                    label: "一年级·下学期",
                    value: ["01", "01"],
                },
                {
                    label: "二年级·上学期",
                    value: ["02", "00"],
                },
                {
                    label: "二年级·下学期",
                    value: ["02", "01"],
                },
                {
                    label: "三年级·上学期",
                    value: ["03", "00"],
                },
                {
                    label: "三年级·下学期",
                    value: ["03", "01"],
                },
                {
                    label: "四年级·上学期",
                    value: ["04", "00"],
                },
                {
                    label: "四年级·下学期",
                    value: ["04", "01"],
                },
                {
                    label: "五年级·上学期",
                    value: ["05", "00"],
                },
                {
                    label: "五年级·下学期",
                    value: ["05", "01"],
                },
                {
                    label: "六年级·上学期",
                    value: ["06", "00"],
                },
                {
                    label: "六年级·下学期",
                    value: ["06", "01"],
                },
            ],
            placeholder: "请选择年级和学期",
        }
        this.gradesMap = {
            "01_00": "一年级·上学期",
            "01_01": "一年级·下学期",
            "02_00": "二年级·上学期",
            "02_01": "二年级·下学期",
            "03_00": "三年级·上学期",
            "03_01": "三年级·下学期",
            "04_00": "四年级·上学期",
            "04_01": "四年级·下学期",
            "05_00": "五年级·上学期",
            "05_01": "五年级·下学期",
            "06_00": "六年级·上学期",
            "06_01": "六年级·下学期",
        }
    }

    generateItems = ({ selectProduct, productInfoList }) => {
        const d = []
        if (productInfoList.length !== 0) {
            let gradesInfo = productInfoList[selectProduct]["gradesInfo"]
            gradesInfo = gradesInfo.sort((_a, _b) => parseInt(`${_a[0]}${_a[1]}`) - parseInt(`${_b[0]}${_b[1]}`))
            for (let i = 0; i < gradesInfo.length; i++) {
                const g = gradesInfo[i]
                const grade = g[0]
                const term = g[1]
                const v = {
                    label: this.gradesMap[`${grade}_${term}`],
                    value: [grade, term],
                }
                d.push(v)
            }
        }
        return d
    }

    componentDidMount() {
        const { productInfoDict } = this.props
        const { productInfoList } = productInfoDict
        if (productInfoList.length !== 0) {
            const d = this.generateItems(productInfoDict)
            this.setState({
                items: d,
            })
        } else {
            this.setState({
                items: [],
            })
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.productInfoDict.selectProduct !== this.props.productInfoDict.selectProduct) {
            const { productInfoDict } = this.props
            const { productInfoList } = productInfoDict
            if (productInfoList.length !== 0) {
                const d = this.generateItems(productInfoDict)
                this.setState({
                    items: d,
                })
            } else {
                this.setState({
                    items: [],
                })
            }
        }
    }

    componentWillUnmount() {
        this.setState({
            placeholder: "请选择年级和学期",
            items: [],
        })
    }

    renderItem = ({ item, isSelected }) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    this.setState({
                        value: item.value,
                        open: false,
                        placeholder: "请选择年级和学期",
                    })
                    this.props.updateGradeInfo(item.value)
                }}
            >
                <View
                    style={{
                        backgroundColor: isSelected ? this.props.selectedColor : "#F6F6F6",
                        width: pxToDp(320),
                        height: pxToDp(70),
                        borderRadius: pxToDp(20),
                        marginTop: pxToDp(10),
                        marginBottom: pxToDp(10),
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Text
                        style={{
                            color: isSelected ? "#fff" : "#4C4C59",
                            fontWeight: isSelected ? "bold" : "normal",
                        }}
                    >{item['label']}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    setOpen = (open) => {
        this.setState({
            open
        });
    }

    setValue = (callback) => {
        this.setState(state => ({
            value: callback(state.value)
        }));
    }

    setItems = (callback) => {
        this.setState(state => ({
            items: callback(state.items)
        }));
    }

    render() {
        const { open, value, items, placeholder } = this.state
        // log("render value: ", value)
        // log("render items: ", items)
        return (
            <DropDownPicker
                placeholder={placeholder}
                open={open}
                value={value}
                items={items}
                setOpen={this.setOpen}
                setValue={this.setValue}
                setItems={this.setItems}
                style={{
                    width: pxToDp(360),
                    height: pxToDp(84),
                    backgroundColor: "#F6F6F7",
                    borderRadius: pxToDp(60),
                    borderColor: "transparent",
                }}
                placeholderStyle={{
                    fontWeight: "bold",
                    color: "#FF4949",
                    marginLeft: pxToDp(20),
                }}
                textStyle={{
                    fontWeight: "bold",
                    marginLeft: pxToDp(20),
                }}
                dropDownContainerStyle={{
                    borderTopLeftRadius: pxToDp(30),
                    marginTop: pxToDp(10),
                    borderColor: "transparent",
                    maxHeight: pxToDp(480),
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 1,
                    },
                    shadowOpacity: 0.22,
                    shadowRadius: 2.22,

                    elevation: 3,
                    overflow: 'visible',
                    alignItems: "center",
                }}
                renderListItem={(props) => this.renderItem(props)}
            />
        )
    }
}

export default DropDown

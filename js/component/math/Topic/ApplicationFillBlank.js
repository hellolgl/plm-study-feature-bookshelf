import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  ScrollView
} from "react-native";
import { appFont, appStyle } from "../../../theme";
import { size_tool, pxToDp, padding_tool, pxToDpHeight } from "../../../util/tools";
import Stem from './Stem'
import AutoImage from './AutoImage'
import * as _ from "lodash";
import Franction from '../FractionalRendering/Franction_new'
import { Toast } from "antd-mobile-rn";

class ApplicationFillBlank extends PureComponent {
  constructor(props) {
    super(props);
    this.answer_map = {}
    this.my_answer_map = {}
    this.wrong_answer_map = {}
    this.submitThrottle = _.debounce(this.submit, 300);
    this.nextThrottle = _.debounce(this.toNext, 300);
    this.state = {
        options:[],
        currentIndex:-1,
        currentType:'',
        understand:[],
        method:[],
        correct_answer:[],
        isWrong:false,
        bottom_height:0,
        showTips:true
    };
  }
  componentDidMount(){
    const {data} = this.props
    const {understand,understand_index,method,method_index,correct_answer,correct_answer_index} = data
    let understand_arr = this.getOpions(understand,understand_index)
    let _understand = this.getArr(understand,understand_index,'understand')
    let method_arr = this.getOpions(method,method_index)
    let _method = this.getArr(method,method_index,'method')
    let correct_answer_arr = this.getOpions(correct_answer,correct_answer_index)
    let _correct_answer = this.getArr(correct_answer,correct_answer_index,'correct_answer')
    let options = understand_arr.concat(method_arr).concat(correct_answer_arr)
    options = this.uniqueArr(options)
    let obj = {
        understand:_understand,
        method:_method,
        correct_answer:_correct_answer
    }
    let index_obj = {
        understand:understand_index,
        method:method_index,
        correct_answer:correct_answer_index
    }
    let type = ''
    for(let i in obj){
        if(obj[i].length > 0 && index_obj[i]){
            // 可能有数据，但是没有挖空，要找到有数据并且挖空的那类
            type = i
            break
        }
    }
    let currentIndex = -1
    switch(type) {
        case 'understand':
            currentIndex = understand_index?JSON.parse(understand_index)[0]:-1
            break;
        case 'method':
            currentIndex = method_index?JSON.parse(method_index)[0]:-1
            break;
        case 'correct_answer':
            currentIndex = correct_answer_index?JSON.parse(correct_answer_index)[0]:-1
            break;
   }
    this.setState({
        options,
        method:_method,
        understand:_understand,
        correct_answer:_correct_answer,
        currentIndex,
        currentType:type
    })
  }
  

  uniqueArr = (arr) => {
    for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            if (JSON.stringify(arr[i]) === JSON.stringify(arr[j])) {
                arr.splice(j, 1)
                j--
            }
        }
    }
    arr = this.shuffle(arr)
    return arr
 }

 getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  shuffle = (arr) => {
    let _arr = arr.slice();
    for (let i = 0; i < _arr.length; i++) {
      let j = this.getRandomInt(0, i);
      let t = _arr[i];
      _arr[i] = _arr[j];
      _arr[j] = t;
    }
    return _arr;
  };

  getArr = (value,indexs,type) =>{
    if(!value) return []
    const {data} = this.props
    const {exercise_data_type} = data
    let fill_index = indexs?JSON.parse(indexs):[]
    let arr = []
    this.answer_map[type] = {}
    if(exercise_data_type === 'FS'){
        arr = JSON.parse(value)
        arr.forEach((i,x)=>{
            arr[x].forEach((ii,xx)=>{
                let key = JSON.stringify([x,xx])
                if(fill_index.indexOf(key) > -1){
                    this.answer_map[type][key] = ii
                    arr[x][xx] = ''
                }
            })
        })
    }else{
        arr = value.split('\n').filter(i=>{
            return i
        })
        arr.forEach((i,x)=>{
            arr[x] = i.split('#')
            arr[x].forEach((ii,xx)=>{
                let key = JSON.stringify([x,xx])
                if(fill_index.indexOf(key) > -1){
                    this.answer_map[type][key] = ii
                    arr[x][xx] = ''
                }
            })
        })
    }    
    return arr
  }

  getOpions = (value,indexs) =>{
    if(!value) return []
    const {data} = this.props
    const {exercise_data_type} = data
    let options = []
    let arr = []
    let fill_index = indexs?JSON.parse(indexs):[]
    if(exercise_data_type === 'FS'){
        arr = JSON.parse(value)
        arr.forEach((i,x)=>{
            arr[x].forEach((ii,xx)=>{
                let key = JSON.stringify([x,xx])
                if(fill_index.indexOf(key) > -1){
                    options.push(ii)
                }
            })
        })
    }else{
        arr = value.split('\n').filter(i=>{
            return i
        })
        arr.forEach((i,x)=>{
            arr[x] = i.split('#')
            arr[x].forEach((ii,xx)=>{
                let key = JSON.stringify([x,xx])
                if(fill_index.indexOf(key) > -1){
                    options.push(ii)
                }
            })
        })
    }
    
    return options
  }

  clickSpace = (x,xx,type)=>{
    this.setState({
        currentIndex:JSON.stringify([x,xx]),
        currentType:type
    })
  }

  renderContent = (arr,indexs,type) => {
    const {data} = this.props
    const {exercise_data_type} = data
    const {currentIndex,currentType,isWrong} = this.state
    let fill_index = indexs?JSON.parse(indexs):[]
    let wrong_answer_map_item = this.wrong_answer_map[type]
    let answer_map_item = this.answer_map[type]
    if(isWrong){
        // 诊断后
        if(exercise_data_type === 'FS'){
            return arr.map((i,x)=>{
                return <View style={[appStyle.flexLine,appStyle.flexLineWrap]} key={x}>
                    {i.map((ii,xx)=>{
                        let key = JSON.stringify([x,xx])
                        if(fill_index.indexOf(key) > -1){
                            if(wrong_answer_map_item.indexOf(key) > -1){
                                // 做错的空
                                return <View>
                                    <View style={[styles.space,{backgroundColor:'#FF6666'}]} key={xx}>
                                        {Array.isArray(ii)?<Franction key={xx} value={ii} txt_style={[styles.fraction_txt_2]} fraction_border_style={{borderBottomColor:'#fff'}}></Franction>
                                        :<Text style={[styles.txt,{color:"#fff"}]}>{ii}</Text>}
                                    </View>
                                    {Array.isArray(answer_map_item[key])?<View style={[appStyle.flexLine]}>
                                        <Text style={[styles.correct_txt]}>正确答案:</Text>
                                        <Franction key={xx} value={answer_map_item[key]} txt_style={[styles.correct_fraction_txt]} fraction_border_style={{borderBottomColor:'#00C780',borderBottomWidth:pxToDp(3)}}></Franction>
                                    </View>:<Text style={[styles.correct_txt]}>正确答案：{answer_map_item[key]}</Text>}
                                </View>
                            }
                            // 做对的空
                            return <View style={[styles.space,{backgroundColor:'#00C780'}]} key={xx}>
                                {Array.isArray(ii)?<Franction key={xx} value={ii} txt_style={[styles.fraction_txt_2]} fraction_border_style={{borderBottomColor:'#fff'}}></Franction>
                                :<Text style={[styles.txt,{color:"#fff"}]}>{ii}</Text>}
                            </View>
                        }
                        return Array.isArray(ii)?<Franction key={xx} value={ii} txt_style={[styles.fraction_txt]} fraction_border_style={{borderBottomColor:'#4C4C59'}}></Franction>
                        :<Text style={[styles.txt]}>{ii}</Text>
                    })}
                </View>
            })
        }
        return arr.map((i,x)=>{
            return <View style={[appStyle.flexLine,appStyle.flexLineWrap]} key={x}>
                {i.map((ii,xx)=>{
                    let key = JSON.stringify([x,xx])
                    if(fill_index.indexOf(key) > -1){
                        if(wrong_answer_map_item.indexOf(key) > -1){
                            // 做错的空
                            return <View>
                                <View style={[styles.space,{backgroundColor:'#FF6666'}]} key={xx}>
                                    <Text style={[styles.txt,{color:"#fff"}]}>{ii}</Text>
                                </View>
                                <Text style={[styles.correct_txt]}>正确答案：{answer_map_item[key]}</Text>
                            </View>
                        }
                        // 做对的空
                        return <View style={[styles.space,{backgroundColor:'#00C780'}]} key={xx}>
                            <Text style={[styles.txt,{color:"#fff"}]}>{ii}</Text>
                        </View>
                    }
                    return <Text style={[styles.txt]} key={xx}>{ii}</Text>
                })}
            </View>
        })
    }else{
        if(exercise_data_type === "FS"){
            return arr.map((i,x)=>{
                return <View style={[appStyle.flexLine,appStyle.flexLineWrap]} key={x}>
                    {i.map((ii,xx)=>{
                        let key = JSON.stringify([x,xx])
                        if(fill_index.indexOf(key) > -1){
                            return <TouchableOpacity key={xx} style={[styles.space,currentIndex === key && currentType === type?styles.space_active:null]} onPress={()=>{this.clickSpace(x,xx,type)}}>
                                {Array.isArray(ii)?<Franction value={ii} txt_style={styles.fraction_txt} fraction_border_style={{borderBottomColor:'#4C4C59'}}></Franction>
                                :<Text style={[styles.txt]}>{ii}</Text>}
                            </TouchableOpacity>
                        }
                        if(Array.isArray(ii)){
                            return <Franction value={ii} txt_style={styles.fraction_txt} fraction_border_style={{borderBottomColor:'#4C4C59'}}></Franction>
                        }
                        return <Text style={[styles.txt]} key={xx}>{ii}</Text>
                    })}
                </View>
            })
        }
        return arr.map((i,x)=>{
            return <View style={[appStyle.flexLine,appStyle.flexLineWrap]} key={x}>
                {i.map((ii,xx)=>{
                    let key = JSON.stringify([x,xx])
                    if(fill_index.indexOf(key) > -1){
                        return <TouchableOpacity key={xx} style={[styles.space,currentIndex === key && currentType === type?styles.space_active:null]} onPress={()=>{this.clickSpace(x,xx,type)}}>
                            {exercise_data_type === 'FS'?<Text> </Text>:<Text style={[styles.txt]}>{ii}</Text>}
                        </TouchableOpacity>
                    }
                    return <Text style={[styles.txt]} key={xx}>{ii}</Text>
                })}
            </View>
        })
    }
  }

  clickOption = (i,x) => {
    const {currentType,currentIndex,understand,method,correct_answer,showTips} = this.state
    if(this.my_answer_map[currentType]){
        this.my_answer_map[currentType][currentIndex] = i
    }else{
        this.my_answer_map[currentType] = {}
        this.my_answer_map[currentType][currentIndex] = i
    }
    let arr = []
    if(showTips){
        this.setState({
            showTips:false
        })
    }
    switch(currentType) {
        case 'understand':
            arr = this.gethaveAnswerArr(understand,i)
            this.setState({
                understand:arr
            })
           break;
        case 'method':
            arr = this.gethaveAnswerArr(method,i)
            this.setState({
                method:arr
            })
            break;
        case 'correct_answer':
            arr = this.gethaveAnswerArr(correct_answer,i)
            this.setState({
                correct_answer:arr
            })
            break;
   } 
  }

  gethaveAnswerArr = (arr,value) => {
    const {currentIndex} = this.state
    let _arr = JSON.parse(JSON.stringify(arr))
    _arr.forEach((i,x)=>{
        i.forEach((ii,xx)=>{
            let key = JSON.stringify([x,xx])
            if(key === currentIndex){
                i[xx] = value
            }
        })
    })
    return _arr
  }

  submit = () => {
    const {showTips} = this.state
    if(showTips){
        this.setState({
            showTips:false
        })
    }
    for(let i in this.answer_map){
        let obj = this.answer_map[i]
        let my_answer_obj = this.my_answer_map[i]
        if(!my_answer_obj){
            this.wrong_answer_map[i] = Object.keys(obj)
        }else{
            this.wrong_answer_map[i] = []
            for(let ii in obj){
                if(JSON.stringify(obj[ii]) !== JSON.stringify(my_answer_obj[ii])){
                    this.wrong_answer_map[i].push(ii)
                }
            }
        }
    }
    let isWrong = false
    for(let i in this.wrong_answer_map){
        if(this.wrong_answer_map[i].length > 0){
            isWrong = true
            this.setState({
                isWrong
            })
            break
        }
    }
    if(!isWrong){
        this.toNext()
    }
  }

  toNext = ()=>{
    this.props.toNext()
  }

  onLayoutBottom = (e) => {
    let { height } = e.nativeEvent.layout;
    this.setState({
        bottom_height:height
    })
  }
  

  render() {
    const {data,doWrong,my_style} = this.props
    const {understand_index,understand_img,method_index,method_img,correct_answer_index,correct_answer_img} = data
    const {options,understand,method,correct_answer,isWrong,bottom_height,showTips} = this.state
    return <>
        <ScrollView contentContainerStyle={{paddingBottom:pxToDp(400),paddingLeft:pxToDp(170),paddingRight:pxToDp(170)}}>
            <Stem data={data} my_style={my_style}></Stem>
            <Text style={[styles.txt,Platform.OS === 'ios'?{marginTop:pxToDp(20),marginBottom:pxToDp(20)}:null]}>解析:</Text>
            {understand?this.renderContent(understand,understand_index,'understand'):null}
            {understand_img?<AutoImage url={understand_img}></AutoImage>:null}
            {method?this.renderContent(method,method_index,'method'):null}
            {method_img?<AutoImage url={method_img}></AutoImage>:null}
            {correct_answer?this.renderContent(correct_answer,correct_answer_index,'correct_answer'):null}
            {correct_answer_img?<AutoImage url={correct_answer_img}></AutoImage>:null}
        </ScrollView>
        <View style={[styles.bottom]} onLayout={(e) => this.onLayoutBottom(e)}>
            {isWrong?doWrong?<View style={[appStyle.flexAliCenter]}>
                <View style={[appStyle.flexLine,{alignItems:'center'}]}>
                    <TouchableOpacity style={[{marginRight:pxToDp(32)}]} onPress={this.props.tryAgain}>
                        <ImageBackground resizeMode='stretch' source={require('../../../images/MathSyncDiagnosis/btn_bg_5.png')} style={[{width:pxToDp(400),height:pxToDp(112)},appStyle.flexCenter]}>
                        <Text style={[{color:"#fff",fontSize:pxToDp(32)},appFont.fontFamily_jcyt_700]}>关闭</Text>
                        </ImageBackground>
                    </TouchableOpacity>
                </View>
            </View>:
            <TouchableOpacity style={{alignItems:'center'}} onPress={this.nextThrottle}>
                <ImageBackground resizeMode='stretch' source={require('../../../images/MathSyncDiagnosis/btn_bg_3.png')} style={[{width:pxToDp(400),height:pxToDp(112)},appStyle.flexCenter]}>
                    <Text style={[{color:"#fff",fontSize:pxToDp(32)},appFont.fontFamily_jcyt_700]}>下一题</Text>
                </ImageBackground>
          </TouchableOpacity>: <View style={[styles.bottom_content]}>
                <ScrollView horizontal={true}>
                    {options.map((i,x)=>{
                        return <TouchableOpacity style={[styles.option]} key={x} onPress={()=>{this.clickOption(i,x)}}>
                             {Array.isArray(i)?<Franction value={i} txt_style={{color:'#fff',fontSize:pxToDpHeight(40)}} fraction_border_style={{borderBottomColor:'#fff'}}></Franction>:
                            <Text style={[{color:'#fff',fontSize:pxToDpHeight(40)},appFont.fontFamily_jcyt_700]}>{i}</Text>}
                        </TouchableOpacity>
                    })}
                </ScrollView>
                <TouchableOpacity style={{marginLeft:pxToDp(40)}} onPress={this.submitThrottle}>
                    <ImageBackground resizeMode='stretch' source={require('../../../images/MathSyncDiagnosis/btn_bg_2.png')} style={[{width:pxToDp(200),height:pxToDp(120)},appStyle.flexCenter]}>
                        <Text style={[{color:"#fff",fontSize:pxToDp(32)},appFont.fontFamily_jcyt_700]}>提交</Text>
                    </ImageBackground>
                </TouchableOpacity>
            </View>}
        </View>
        {showTips?<View style={[styles.tipsWrap,{bottom:bottom_height}]}>
            <Image resizeMode='contain' style={[styles.tips]} source={require('../../../images/MathSyncDiagnosis/tips_bg.png')}></Image>
        </View>:null}
    </>
  }
}

const styles = StyleSheet.create({
    txt:{
        ...appFont.fontFamily_jcyt_500,
        color:"#4C4C59",
        fontSize:pxToDpHeight(48)
    },
    space:{
        minWidth:pxToDp(240),
        minHeight:pxToDp(88),
        backgroundColor:"#F5F5FA",
        borderRadius:pxToDp(20),
        marginLeft:pxToDp(20),
        marginRight:pxToDp(20),
        marginBottom:pxToDp(10),
        ...appStyle.flexCenter,
        paddingLeft:pxToDp(20),
        paddingRight:pxToDp(20)
    },
    space_active:{
        backgroundColor:"#FFC93F"
    },
    bottom:{
        position:'absolute',
        bottom:pxToDp(0),
        width:'100%',
        backgroundColor:"#fff",
        padding:pxToDp(20),
    },
    bottom_content:{
        backgroundColor:'#EBEBF5',
        ...appStyle.flexLine,
        borderRadius:pxToDp(40),
        padding:pxToDp(40),
        ...appStyle.flexJusBetween,
    },
    option:{
        paddingLeft:pxToDp(40),
        paddingRight:pxToDp(40),
        height:pxToDp(120),
        backgroundColor:'#4C4C59',
        borderRadius:pxToDp(40),
        ...appStyle.flexCenter,
        marginRight:pxToDp(20)
    },
    correct_txt:{
        color:"#00C780",
        fontSize:pxToDp(32),
        ...appFont.fontFamily_jcyt_500,
        marginLeft:pxToDp(20),
        marginRight:pxToDp(20)
    },
    correct_fraction_txt:{
        color:"#00C780",
        fontSize:pxToDp(28),
        ...appFont.fontFamily_jcyt_500,
    },
    fraction_txt:{
        ...appFont.fontFamily_jcyt_700,
        color:"#4C4C59",
        fontSize:pxToDp(28)
    },
    fraction_txt_2:{
        ...appFont.fontFamily_jcyt_500,
        color:"#fff",
        fontSize:pxToDp(28)
    },
    tipsWrap:{
        alignItems:'center',
        position:'absolute',
        width:'100%',
    },
    tips:{
        width:pxToDp(480),
        height:pxToDp(140),
    }
});
export default ApplicationFillBlank;

import React, { PureComponent } from "react";
import {
  StyleSheet,
  View,
  Text
} from "react-native";
import { pxToDp } from "../../../util/tools";
import TextView from '../FractionalRendering/TextView'
import RichShowView from '../RichShowView'
import topaicTypes from '../../../res/data/MathTopaicType'
import AutoImage from './AutoImage'
import { appStyle } from "../../../theme";


class TopicSteam extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  renderSteam = ()=>{
    const {data,width} = this.props
    let _width = pxToDp(820)
    if(width) _width = width
    // 有的题只有题干图片，没有题干
    return <>
         {data.exercise_data_type === 'FS' || data.data_type === 'FS'?<>
         {/* 分数活题比较大小 */}
            {data.name === topaicTypes.Than_Size && data.alphabet_value?<View style={[appStyle.flexLine]}>
                <Text> <TextView value = {data.exercise_stem}></TextView></Text>
                <Text style={[{fontSize:pxToDp(36)}]}> 〇 </Text>
                <Text><TextView value = {data.exercise_stem_}></TextView></Text>
            </View>:<>
              {data.public_exercise_stem ?<TextView value = {data.public_exercise_stem}></TextView>:null}   
                {data.public_exercise_image?<AutoImage url={data.public_exercise_image}></AutoImage>:null} 
                {data.private_exercise_stem?<TextView value = {data.private_exercise_stem}></TextView>:null}
                {data.private_exercise_image?<AutoImage url={data.private_exercise_image}></AutoImage>:null} 
                {data.exercise_stem?<TextView value = {data.exercise_stem}></TextView>:null}
                {data.exercise_stem_image?<AutoImage url={data.exercise_stem_image}></AutoImage>:null} 
            </>}
          </>:<>
            <RichShowView divStyle={'font-size: x-large'} pStyle={'font-size: x-large'} spanStyle={'font-size: x-large'}  width={_width} value = {data.public_exercise_stem?data.public_exercise_stem:''}> 
            </RichShowView>
            <RichShowView divStyle={'font-size: x-large'} pStyle={'font-size: x-large'} spanStyle={'font-size: x-large'}  width={_width} value = {data.private_exercise_stem?data.private_exercise_stem:''}>
            </RichShowView>
            {data.name === topaicTypes.Than_Size?<RichShowView divStyle={'font-size: x-large'} pStyle={'font-size: x-large'} spanStyle={'font-size: x-large'} width={_width} value = {data.exercise_stem_change?data.exercise_stem_change:''}>
            </RichShowView>:<RichShowView divStyle={'font-size: x-large'} pStyle={'font-size: x-large'} spanStyle={'font-size: x-large'} width={_width} value = {data.exercise_stem?data.exercise_stem:''}>
            </RichShowView>}
          </>}
          {/* 拓展计算题的题干图片 */}
          {data.name === topaicTypes.Extended_Calculation_Problem && data.public_exercise_image_cal?<View>{data.public_exercise_image_cal}</View>:null}
    </>
  }
  render() {
    return (
      <>
          {this.renderSteam()}
      </>
    );
  }
}

const styles = StyleSheet.create({
});
export default TopicSteam;

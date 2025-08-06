import React, { PureComponent ,Component} from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";
import { size_tool, pxToDp, padding_tool } from "../../../util/tools";
import RichShowView from '../../../component/math/RichShowView'
import TextView from '../../../component/math/FractionalRendering/TextView'
import LineCavans from '../../../component/math/LineCavans'
import MathFrameView from '../../../component/math/MathFrameView'
import styles from '../../../theme/math/doExcesiceStyle'
import * as actionCreators from '../../../action/math/bag/index'
import MathFrameSynthesisView from '../MathFrameSynthesisView'
import AutoImage from './AutoImage'
import TopicSteam from './TopicSteam'


class Explanation2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  // 防止多次无效render
  shouldComponentUpdate(nextProps) {
    const isRender = this.props.yinDaoNum !== nextProps.yinDaoNum;
    return isRender
  }

  // 框图渲染
  renderMathFrameView = (data)=>{
    const {yinDaoNum} = this.props
    let props_mat0 = actionCreators.getBlockdiagram(data,yinDaoNum)
    if(!props_mat0) return null
    if(data.solve && data.solve.indexOf ('框图')>-1 ){
      return <MathFrameView math_frame_svg0={props_mat0}></MathFrameView>
    }
    return <MathFrameSynthesisView math_frame_svg0={props_mat0}></MathFrameSynthesisView>
  }

  render() {
    const {currentTopaicData} = this.props
    // if(!currentTopaicData.private_exercise_stem) currentTopaicData.private_exercise_stem = currentTopaicData.public_exercise_stem
    return <>
        {currentTopaicData.alphabet_value?<>
          <View>
            {currentTopaicData.exercise_data_type === 'FS' || currentTopaicData.data_type === 'FS'?<TextView value = {currentTopaicData.private_exercise_stem}></TextView>:<RichShowView divStyle={'font-size: x-large'} pStyle={'font-size: x-large'} spanStyle={'font-size: x-large'}  width={styles.applicaBywrongRichStemWidth.width} value = {currentTopaicData.private_exercise_stem?currentTopaicData.private_exercise_stem:''}>
          </RichShowView>}
          </View>
          <View>
            {currentTopaicData.exercise_data_type === 'FS' || currentTopaicData.data_type === 'FS'?<TextView value = {currentTopaicData.understand}></TextView>:<Text style={[styles.explainText,{}]}>{currentTopaicData.understand?currentTopaicData.understand:' '}</Text>}
            {currentTopaicData.understand_img?<AutoImage url={currentTopaicData.understand_img}></AutoImage>:null}
          {
            currentTopaicData.line_diagram !== '""' ?<LineCavans
            groupData={currentTopaicData.line_diagram}
            alphabet_value={currentTopaicData.alphabet_value}
            variable_value={currentTopaicData.variable_value}
            equationExercise = {currentTopaicData.equation_exercise}
          ></LineCavans>:null
          }
          </View>
          <View >
            {currentTopaicData.exercise_data_type === 'FS' || currentTopaicData.data_type === 'FS'?<TextView value = {currentTopaicData.method}></TextView>:<Text style={[styles.explainText]}>{currentTopaicData.method?currentTopaicData.method:' '}</Text>}
          </View>
          {currentTopaicData.method_img?<AutoImage url={currentTopaicData.method_img}></AutoImage>:null}
          {this.renderMathFrameView(currentTopaicData)}
          <View>
            {currentTopaicData.exercise_data_type === 'FS' || currentTopaicData.data_type === 'FS'?<TextView value = {currentTopaicData.answer_explanation}></TextView>: <Text style={[styles.explainText]}>{currentTopaicData.answer_explanation?currentTopaicData.answer_explanation:''}</Text>}
          </View> 
        </>:<View> 
          {currentTopaicData.exercise_data_type === 'FS' || currentTopaicData.data_type === 'FS'?<>
          <TopicSteam data={currentTopaicData} width={pxToDp(1850)}></TopicSteam>
          <TextView value = {currentTopaicData.knowledgepoint_explanation}></TextView>
          {currentTopaicData.knowledgepoint_explanation_image?<AutoImage url={currentTopaicData.knowledgepoint_explanation_image}></AutoImage>:null}
          </>:<>
          <TopicSteam data={currentTopaicData} width={pxToDp(1850)}></TopicSteam>
            <RichShowView divStyle={'font-size: x-large'} pStyle={'font-size: x-large'} spanStyle={'font-size: x-large'}  width={styles.applicaBywrongRichStemWidth.width} value = {currentTopaicData.knowledgepoint_explanation?currentTopaicData.knowledgepoint_explanation:''}>
            </RichShowView>
          </>}
          </View>}
          
        </>
  }
}

const stylesSelf = StyleSheet.create({
});
export default Explanation2;

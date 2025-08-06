import React, { PureComponent } from "react";
import {
  StyleSheet,
} from "react-native";
import {pxToDp } from "../../../util/tools";
import RichShowView from '../../../component/math/RichShowView'
import TextView from '../../../component/math/FractionalRendering/TextView'
import url from '../../../util/url'
import AutoImage from './AutoImage'

class Explanation1 extends PureComponent {
  constructor(props) {
    super(props);
    this.imgUrl = url.baseURL
    this.state = {
    };
  }
  render() {
    const {currentTopaicData,width} = this.props
    return (
      <>
            {currentTopaicData.exercise_data_type === 'FS' || currentTopaicData.data_type === 'FS'?<>
              <TextView value = {currentTopaicData.knowledgepoint_explanation}></TextView>
              {currentTopaicData.knowledgepoint_explanation_image?<AutoImage url={currentTopaicData.knowledgepoint_explanation_image}></AutoImage>:null}
             </>:<>
                <RichShowView divStyle={'font-size: x-large'} pStyle={'font-size: x-large'} spanStyle={'font-size: x-large'} width={width?width:pxToDp(880)} value = {currentTopaicData.knowledgepoint_explanation?currentTopaicData.knowledgepoint_explanation:' '}> </RichShowView>
              </>}
      </>
    );
  }
}

const styles = StyleSheet.create({
});
export default Explanation1;

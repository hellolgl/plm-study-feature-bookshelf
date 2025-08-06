import React, { PureComponent } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity
} from "react-native";
import { pxToDp, pxToDpHeight } from "../../../util/tools";
import TextView from '../FractionalRendering/TextView_new'
import RichShowView from '../RichShowView'
import topaicTypes from '../../../res/data/MathTopaicType'
import AutoImage from './AutoImage'
import { appFont, appStyle } from "../../../theme";
import RichShowViewHtml from '../RichShowViewHtml'
import AnswerView from '../Keyboard/AnswerView'
import AnswerTxtView from './AnswerTxtView'


class CalculationStem extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentIndex: -1,
      my_answer_tk_map: ''  //为了答错之后解析的回显
    };
  }


  componentDidMount() {
    const { data } = this.props
    this.props.onRef ? this.props.onRef(this) : null
    this.setState({
      my_answer_tk_map: data.my_answer_tk_map,
      currentIndex: 0
    }, () => {
      this.props.clickSpace ? this.props.clickSpace(0) : null
    })
  }

  componentDidUpdate(prevProps, prevState) {
    const { data } = this.props
    const { m_e_s_id } = data
    if (m_e_s_id !== prevProps.data.m_e_s_id) {
      this.setState({
        my_answer_tk_map: data.my_answer_tk_map,
        currentIndex: 0
      }, () => {
        this.props.clickSpace ? this.props.clickSpace(0) : null
      })
    }
  }

  changeValues = (value) => {
    const { currentIndex, my_answer_tk_map } = this.state
    let now_init_char_mat = my_answer_tk_map[currentIndex].init_char_mat
    let now_cursor_idx = my_answer_tk_map[currentIndex].cursor_idx
    if (value === '删除') {
      if (now_cursor_idx !== -1) { now_init_char_mat.splice(now_cursor_idx, 1) }  //删到头不能在删了
      // now_init_char_mat.splice(now_cursor_idx , 1)   //需要光标自动到最后
      if (now_cursor_idx > 0) {
        now_cursor_idx -= 1
      } else {
        // now_cursor_idx = now_init_char_mat.length - 1   //需要光标自动到最后
        now_cursor_idx = -1
      }
      let _my_answer_tk_map = JSON.parse(JSON.stringify(my_answer_tk_map))
      _my_answer_tk_map[currentIndex].init_char_mat = now_init_char_mat
      _my_answer_tk_map[currentIndex].cursor_idx = now_cursor_idx
      this.setState({
        my_answer_tk_map: _my_answer_tk_map
      }, () => {
        this.props.changeMyAnswerMap ? this.props.changeMyAnswerMap(_my_answer_tk_map) : null
      })
      return
    }
    now_init_char_mat.splice(now_cursor_idx + 1, 0, value)
    now_cursor_idx += 1
    let _my_answer_tk_map = JSON.parse(JSON.stringify(my_answer_tk_map))
    _my_answer_tk_map[currentIndex].init_char_mat = now_init_char_mat
    _my_answer_tk_map[currentIndex].cursor_idx = now_cursor_idx
    this.setState({
      my_answer_tk_map: _my_answer_tk_map
    }, () => {
      this.props.changeMyAnswerMap ? this.props.changeMyAnswerMap(_my_answer_tk_map) : null
    })
  }

  changeIdx = (idx) => {
    const { currentIndex, my_answer_tk_map } = this.state
    let _my_answer_tk_map = JSON.parse(JSON.stringify(my_answer_tk_map))
    _my_answer_tk_map[currentIndex].cursor_idx = idx
    this.setState({
      my_answer_tk_map: _my_answer_tk_map
    }, () => {
      this.props.changeMyAnswerMap ? this.props.changeMyAnswerMap(_my_answer_tk_map) : null
    })
  }

  setInitdata = (my_answer_tk_map) => {
    const { currentIndex } = this.state
    let _currentIndex = currentIndex
    if (my_answer_tk_map[currentIndex].isFraction) _currentIndex = -1
    this.setState({
      my_answer_tk_map,
      currentIndex: _currentIndex
    }, () => {
      this.props.clickSpace ? this.props.clickSpace(_currentIndex) : null
    })
  }

  renderTxt = (value) => {
    const { correct, onlySee } = this.props
    if (!value || onlySee) return
    return <AnswerTxtView correct={correct} value={value}></AnswerTxtView>
  }

  clickSpace = () => {
    const { my_answer_tk_map } = this.state
    let _my_answer_tk_map = JSON.parse(JSON.stringify(my_answer_tk_map))
    if (!_my_answer_tk_map[0].isFraction) _my_answer_tk_map[0].cursor_idx = _my_answer_tk_map[0].init_char_mat.length - 1   //切换时候光标始终在最后一位
    this.setState({
      currentIndex: 0
    }, () => {
      this.props.clickSpace ? this.props.clickSpace(0, _my_answer_tk_map[0].isFraction) : null
    })
  }

  render() {
    const { data, correct, translate, my_style } = this.props
    let { _exercise_stem, exercise_data_type } = data
    const { currentIndex, my_answer_tk_map } = this.state

    if (!my_answer_tk_map) return null
    if (translate) _exercise_stem = data._exercise_stem_c
    return (
      <View style={[appStyle.flexLine]}>
        {exercise_data_type === 'FS' ? <TextView txt_style={[translate ? my_style.stem_txt_trans : my_style.stem_txt]} fraction_border_style={translate ? [my_style.stem_txt_borderBottom_trans, { borderBottomColor: my_style.stem_txt_trans.color }] : { borderBottomColor: my_style.stem_txt.color }} value={_exercise_stem} ></TextView>
          : <Text style={[translate ? my_style.stem_txt_trans : my_style.stem_txt]}>{_exercise_stem}</Text>}
        <TouchableOpacity style={[translate ? my_style.stem_answer_line : styles.line, currentIndex === 0 && correct === -1 ? styles.line_active : null]} onPress={this.clickSpace}>
          {correct === -1 && !my_answer_tk_map[0].isFraction ? <AnswerView value={my_answer_tk_map[0]} changeIdx={this.changeIdx}></AnswerView> : this.renderTxt(my_answer_tk_map[0])}
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  line: {
    borderBottomColor: '#4c4c59',
    borderBottomWidth: pxToDp(4),
    minWidth: pxToDp(100),
    minHeight: pxToDp(50),
    paddingLeft: pxToDp(10),
    paddingRight: pxToDp(10),
    ...appStyle.flexAliCenter,
  },
  line_active: {
    borderBottomColor: '#FFAE66'
  },
});

export default CalculationStem;

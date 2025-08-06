import * as React from 'react';
import {Text, View,StyleSheet,Image} from 'react-native';
import { Avatar, Day, utils,Bubble } from 'react-native-gifted-chat'
const { isSameUser, isSameDay } = utils
import { appFont, appStyle } from "../../theme";
import MyBubble from './Bubble'
import { pxToDp } from '../../util/tools';



function Message(props) {
    const {currentMessage,renderDay,nextMessage,renderAvatar,defaultBubble,selectAnswer} = props
    const {text,user} = currentMessage
    const getInnerComponentProps = () =>{
        return {
          ...props,
          isSameUser,
          isSameDay,
          selectAnswer
        //   position:'right'
        }
    }
    // console.log('+++++',isSameUser,isSameDay)
    const renderMyDay = () => {
        // console.log('iiiiiiiii',props)
        if (currentMessage.createdAt) {
            const dayProps = getInnerComponentProps()
            if (renderDay) {
              return renderDay(dayProps)
            }
            return <Day {...dayProps} />
          }
        return null
    }
    const renderMyAvatar = () => {
        return (
          <Image style={[{width:pxToDp(102),height:pxToDp(98),marginRight:pxToDp(24)}]} source={require('../../images/aiGiveExercise/avatar_1.png')}></Image>
        )
    }

    const renderMyBubble = () => {
        const bubbleProps = getInnerComponentProps()
        if (!defaultBubble) {
          return <MyBubble {...bubbleProps}></MyBubble>
        }
        return <Bubble {...bubbleProps} />
    }
    const marginBottom = isSameUser(
       currentMessage,
       nextMessage,
      )
        ? pxToDp(10)
        : pxToDp(20)
  return (
    <View>
         {/* { renderMyDay()}   //显示当前年月日 */}
         <View
          style={[
            styles.messageWrap,
            user._id === 2?appStyle.flexEnd:null,
            appStyle.flexTopLine,
            {marginBottom}
          ]}
        >
          {user._id === 1?renderMyAvatar():null}
          {renderMyBubble()}
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
    messageWrap: {
        // backgroundColor:"pink"
    },
  })
export default Message;

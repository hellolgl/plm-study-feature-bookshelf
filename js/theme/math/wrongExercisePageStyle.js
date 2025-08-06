import { StyleSheet} from "react-native";
import { pxToDp,fitHeight } from "../../util/tools";
import {appStyle} from '../../theme'
let styles = StyleSheet.create({
    mainWrap: {
        paddingTop: pxToDp(40),
        paddingRight: pxToDp(48),
        paddingBottom: pxToDp(48),
        paddingLeft: pxToDp(48),
        backgroundColor: "#C8EFFF",
        flex: 1,
      },
      TopaicCardWrap:{...appStyle.flexTopLine,...appStyle.flexCenter},
      topaicCard: {
        width: pxToDp(1840),
        height: pxToDp(120),
        marginLeft: pxToDp(50),
      },
      topaicCardItem:{
        marginRight: pxToDp(32)
      },
      content: {
        borderRadius: pxToDp(32),
        backgroundColor: "rgba(255, 255, 255, 1)",
        paddingBottom:pxToDp(32),
      },
      contentTopWrap:{
        borderBottomWidth: pxToDp(1),
        borderBottomColor: "rgba(237, 237, 237, 1)",
        height: pxToDp(100),
        ...appStyle.flexTopLine,
        ...appStyle.flexJusBetween,
        paddingLeft:pxToDp(24),
        paddingRight:pxToDp(24)
      },
      displayed_type:{
        fontSize: pxToDp(35),
        marginTop: pxToDp(24),
      },
      topicWrap:{
        height: fitHeight(0.47,0.57),
        marginBottom:pxToDp(30),
        paddingLeft:pxToDp(24),
        paddingRight:pxToDp(24),
      },
      stemWidth:{
        width:pxToDp(1850)
      },
      contentFooter:{...appStyle.flexLine,...appStyle.flexJusCenter},
      noDataText:{
        fontSize: pxToDp(32), 
        padding: pxToDp(48)
      },
})

export default styles;

import { StyleSheet} from "react-native";
import { pxToDp,fitHeight } from "../../util/tools";
let styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: pxToDp(40),
    paddingTop: pxToDp(28),
    backgroundColor: "#C8EFFF",
  },
  left: {
    width: pxToDp(950),
    marginRight: pxToDp(40),
  },
  right: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: pxToDp(32),
    padding: pxToDp(32),
  },
  leftOne: {
    height:fitHeight(0.12,0.1),
    backgroundColor: "#fff",
    borderRadius: pxToDp(32),
    marginBottom: pxToDp(40),
  },
  leftTwo: {
    position: "relative",
    height: fitHeight(0.653,0.73),
    backgroundColor: "#fff",
    borderRadius: pxToDp(32),
    padding: pxToDp(32),
  },
  doWrongleftTwoHeight:{
    height: fitHeight(0.807,0.853),
  },
  nextBtn: {
    width: pxToDp(144),
    height: pxToDp(48),
    backgroundColor: "#0179FF",
    borderRadius: pxToDp(36),
    position: "absolute",
    right: pxToDp(32),
    bottom: pxToDp(32),
  },
  num: {
    color: "#AAAAAA",
    fontSize: pxToDp(32),
  },
  applicaBywrongleftTwo: {
    width:pxToDp(1970),
    height: fitHeight(0.8,0.85),
  },
  applicaBywrongRichStemWidth: {
    width: pxToDp(1800),
  },
  explainText: {
    fontSize: pxToDp(32),
  },
  displayedTypeText: {
    fontSize: pxToDp(36),
  },
  displayedTypeTextChioce: {
    fontSize: pxToDp(32),
    color: "#AAAAAA",
  },
  yindaoText: {
    fontSize: pxToDp(32),
  },
});

export default styles;

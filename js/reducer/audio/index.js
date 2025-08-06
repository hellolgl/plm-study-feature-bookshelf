import { fromJS } from "immutable";
import {RecordingStatus} from "../../util/storyRecord";

const defaultState = fromJS({
  // 默认中
  audio_data: {
    audioObj: {},
    audioSrc: "",
  },
  playingAudio:'',
  recordingStatus:RecordingStatus.hang
});

export default (state = defaultState, action) => {
  switch (action.type) {
    case "SET_AUDIO_STATUS":
      return state.merge({
        audio_data: action.audio_data,
      });
    case "audio/setPlayingAudio":
      return state.merge({
        playingAudio: action.data,
      });
    case "audio/setRecordingStatus":
      return state.merge({
        recordingStatus: action.data,
      });
    default:
      return state;
  }
};

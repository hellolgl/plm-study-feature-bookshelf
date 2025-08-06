import { fromJS } from "immutable";

export const setAudioStatus = (data) => {
  return {
    type: "SET_AUDIO_STATUS",
    audio_data: fromJS(data),
  };
};

export const setPlayingAudio = (data) => {
  return {
    type: "audio/setPlayingAudio",
    data,
  };
};

export const setRecordingStatus = (data) => {
  return {
    type: "audio/setRecordingStatus",
    data,
  };
};


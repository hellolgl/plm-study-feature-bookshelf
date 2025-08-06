import axios from "../../util/http/axios";
import api from "../../util/http/api";

export const setMessages = (data) => {
  return {
    type: "square/setMessages",
    data,
  };
};

export const setCanSend = (data) => {
  return {
    type: "square/setCanSend",
    data,
  };
};

export const setBottomHeight = (data) => {
  return {
    type: "square/setBottomHeight",
    data,
  };
};

export const getChat = () => {
  return {
    type: "square/getChat",
  };
};

export const setImg = (data) => {
  return {
    type: "square/setImg",
    data,
  };
};
export const setCheckWordList = (data) => {
  return {
    type: "square/setCheckWordList",
    data,
  };
};
export const setCheckStoryType = (data) => {
  return {
    type: "square/setCheckStoryType",
    data,
  };
};

export const initChatData = () => {
  return {
    type: "square/initChatData",
  };
};

export const setHomeSelectItem = (data) => {
  return {
    type: "square/setHomeSelectItem",
    data,
  };
};
export const setStoryCreateType = (data) => {
  return {
    type: "square/setStoryCreateType",
    data,
  };
};

export const setCheckedQuestion = (data) => {
  return {
    type: "square/setCheckedQuestion",
    data,
  };
};

export const setCheckQuestionTag = (data) => {
  return {
    type: "square/setCheckQuestionTag",
    data,
  };
};

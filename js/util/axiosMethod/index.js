import axios from "../http/axios";
import api from "../http/api";
import NavigationUtil from "../../navigator/NavigationUtil";

export const getPaiCoin = async (data) => {
  const res = await axios.post(api.getPaiCoinNow, data);
  // console.log("11111", res.data);
  if (res.data.err_code === 0) {
    return res.data.data;
  }
};
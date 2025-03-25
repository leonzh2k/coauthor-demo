import { type ManuscriptData } from "../types/index.js";

export async function sendData(manuscriptData: ManuscriptData) {
  const uploadSuccessful: boolean = await chrome.runtime.sendMessage({
    message: "postData",
    url: `${process.env.API_BASE_URL}/api/manuscripts/`,
    data: manuscriptData,
  });

  return uploadSuccessful;
}

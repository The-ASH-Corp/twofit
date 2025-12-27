import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../utils/axiosInstance";

export const getChats = createAsyncThunk(
  "chats/get-chat/:page/:limit/:chatId",
  async ({page,limit,chatId}, { rejectWithValue }) => {
    try {
      const data = await axiosInstance.get(`/chats/get-chat/${page}/${limit}/${chatId}`);          
      return data.data;
     
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "chat fetch failed");
    }
  }
);


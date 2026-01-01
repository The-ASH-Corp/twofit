import axiosInstance from "@/utils/axiosInstance";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAllCategories=createAsyncThunk('category/getAllCategories',async(__,{rejectWithValue})=>{
    try{
        const data=await axiosInstance.get('/category/list')
        console.log(data.data)
         return data.data; 
        
    }
    catch(error){
        return rejectWithValue(error.response?.data?.message || "Failed to get categories");
    }
})
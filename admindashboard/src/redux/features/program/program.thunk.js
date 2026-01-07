import axiosInstance from "@/utils/axiosInstance";
import { createAsyncThunk } from "@reduxjs/toolkit";



export const createProgram = createAsyncThunk("program/createProgram", async (programDetails, { rejectWithValue }) => {
  try {
    const data = await axiosInstance.post(`/programs/create`, programDetails)
    return data.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to Create Program");
  }
})

export const getAllPrograms=createAsyncThunk('program/getAllPrograms',async({page,limit},{rejectWithValue})=>{
    try{
        const data=await axiosInstance.get(`/programs/list/${page}/${limit}`)
         return data; 
        
    }
    catch(error){
        return rejectWithValue(error.response?.data?.message || "Failed to get programs");
    }
})
export const getProgramById=createAsyncThunk('program/getProgramById',async(programId,{rejectWithValue})=>{
    try{
        const data=await axiosInstance.get(`/programs/get/${programId}`)
         return data.data; 
    }
    catch(error){
        return rejectWithValue(error.response?.data?.message || "Failed to get program by id");
    }
})
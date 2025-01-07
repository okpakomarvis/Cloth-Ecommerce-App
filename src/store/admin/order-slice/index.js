import {createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios  from "axios";

const initialState={
    isLoading: false,
    orderId: null,
    orderList:[],
    orderDetails:null
}


export const getAllOrdersForAdminUser = createAsyncThunk('/admin/getAllOrdersForAdminUser', 
    async()=>{
        const result = await axios.get('http://localhost:5000/api/admin/orders/get');
        return result?.data;
});
export const getOrderDetailsForAdmin = createAsyncThunk('/admin/getOrderDetailsForAdmin', 
    async(id)=>{
        const result = await axios.get(`http://localhost:5000/api/admin/orders/details/${id}`);
        return result?.data;
})


const adminOrderSlice  = createSlice({
    name:'adminOrderSlice',
    initialState,
    reducers:{
        resetOrderDetails:(state, action)=>{
            state.orderDetails =null
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(getAllOrdersForAdminUser.pending, (state, action)=>{
            state.isLoading=true
        }).addCase(getAllOrdersForAdminUser.fulfilled, (state, action)=>{
            console.log(action.payload, "paylaod");
            state.isLoading = false
            state.orderList = action?.payload?.data;
        }).addCase(getAllOrdersForAdminUser.rejected, (state, action)=>{
            state.isLoading = false
            state.orderList = [];
        }).addCase(getOrderDetailsForAdmin.pending, (state, action)=>{
            state.isLoading=true
        }).addCase(getOrderDetailsForAdmin.fulfilled, (state, action)=>{
            console.log(action.payload, "paylaod");
            state.isLoading = false
            state.orderDetails = action?.payload?.data
        }).addCase(getOrderDetailsForAdmin.rejected, (state, action)=>{
            state.isLoading = false
            state.orderDetails = null;
        })
    }
});

export const {resetOrderDetails} =adminOrderSlice.actions;
export default adminOrderSlice.reducer;
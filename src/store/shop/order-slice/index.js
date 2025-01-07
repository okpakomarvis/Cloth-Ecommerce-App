import {createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios  from "axios";

const initialState={
    isLoading: false,
    approvalUrl:null,
    orderId: null,
    orderList:[],
    orderDetails:null
}

export const createNewOrder = createAsyncThunk('/shop/createNewOrder', 
    async(orderData)=>{
        const result = await axios.post('http://localhost:5000/api/shop/order/create',orderData);
        return result?.data;
});

export const capturedPayment = createAsyncThunk('/shop/capturedPayment', 
    async({paymentId, payerId, orderId})=>{
        const result = await axios.post('http://localhost:5000/api/shop/order/capture',
            {paymentId, payerId, orderId}
        );
        return result?.data;
})
export const getAllOrdersByUser = createAsyncThunk('/shop/getAllOrdersByUser', 
    async(userId)=>{
        const result = await axios.get(`http://localhost:5000/api/shop/order/list/${userId}`);
        return result?.data;
});
export const getOrderDetails = createAsyncThunk('/shop/getOrderDetails', 
    async(id)=>{
        const result = await axios.get(`http://localhost:5000/api/shop/order/details/${id}`);
        return result?.data;
})


const shoppingOrderSlice  = createSlice({
    name:'shoppingOrderSlice',
    initialState,
    reducers:{
        resetOrderDetails:(state, action)=>{
            state.orderDetails =null
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(createNewOrder.pending, (state, action)=>{
            state.isLoading=true
        }).addCase(createNewOrder.fulfilled, (state, action)=>{
            console.log(action.payload, "paylaod");
            state.isLoading = false
            state.approvalUrl = action?.payload?.approvalUrl,
            state.orderId = action?.payload?.orderId
            sessionStorage.setItem('currentOrderId', JSON.stringify(action?.payload?.orderId))
        }).addCase(createNewOrder.rejected, (state, action)=>{
            state.isLoading = false
            state.approvalUrl = null
            state.orderId = null
        }).addCase(getAllOrdersByUser.pending, (state, action)=>{
            state.isLoading=true
        }).addCase(getAllOrdersByUser.fulfilled, (state, action)=>{
            console.log(action.payload, "paylaod");
            state.isLoading = false
            state.orderList = action?.payload?.data
        }).addCase(getAllOrdersByUser.rejected, (state, action)=>{
            state.isLoading = false
            state.orderList = []
        }).addCase(getOrderDetails.pending, (state, action)=>{
            state.isLoading=true
        }).addCase(getOrderDetails.fulfilled, (state, action)=>{
            console.log(action.payload, "paylaod");
            state.isLoading = false
            state.orderDetails = action?.payload?.data
        }).addCase(getOrderDetails.rejected, (state, action)=>{
            state.isLoading = false
            state.orderDetails = null
        })
    }
});

export const {resetOrderDetails} =shoppingOrderSlice.actions;
export default shoppingOrderSlice.reducer;
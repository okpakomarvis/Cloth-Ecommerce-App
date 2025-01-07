import {createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios  from "axios";

const initialState={
    isLoading: false,
    addressList: [],
}

export const addNewAddress = createAsyncThunk('/shop/addAddress', 
    async(formData)=>{
        const result = await axios.post('http://localhost:5000/api/shop/address/add/',formData);
        return result?.data;
});
export const fetchAllAddress = createAsyncThunk('/shop/fetchAllAddress', 
    async(userId)=>{
        const result = await axios.get(`http://localhost:5000/api/shop/address/get/${userId}`);
        return result?.data;
})
export const deleteAddress = createAsyncThunk('/shop/deleteAddress', 
    async({userId, addressId})=>{
        const result = await axios.delete(`http://localhost:5000/api/shop/address/delete/${userId}/${addressId}`);
        return result?.data;
})
export const editAddress = createAsyncThunk('/shop/editAddress', 
    async({userId, addressId,formData})=>{
        const result = await axios.put(`http://localhost:5000/api/shop/address/update/${userId}/${addressId}`,formData);
        return result?.data;
})

const addressSlice  = createSlice({
    name:'address',
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(addNewAddress.pending, (state, action)=>{
            state.isLoading=true
        }).addCase(addNewAddress.fulfilled, (state, action)=>{
            console.log(action.payload, "paylaod");
            state.isLoading = false
            //state.addressList = action?.payload?.data
        }).addCase(addNewAddress.rejected, (state, action)=>{
            state.isLoading = false,
            state.addressList = []
        }).addCase(fetchAllAddress.pending, (state, action)=>{
            state.isLoading=true
        }).addCase(fetchAllAddress.fulfilled, (state, action)=>{
            console.log(action.payload, "paylaod");
            state.isLoading = false,
            state.addressList = action?.payload?.data
        }).addCase(fetchAllAddress.rejected, (state, action)=>{
            state.isLoading = false,
            state.addressList = []
        })
    }
});

export default addressSlice.reducer;
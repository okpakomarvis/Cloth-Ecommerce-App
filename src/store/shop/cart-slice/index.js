import {createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios  from "axios";

const initialState={
    isLoading: false,
    cartItems: [],
}

export const addtoCart = createAsyncThunk('/cart/addtoCart', 
    async({userId, productId, quantity})=>{
        const result = await axios.post('http://localhost:5000/api/shop/cart/add/',{
            userId, productId, quantity
        });
        return result?.data;
});
export const fetchCartItems = createAsyncThunk('/cart/fetchCartItems', 
    async(userId)=>{
        const result = await axios.get(`http://localhost:5000/api/shop/cart/get/${userId}`);
        return result?.data;
})
export const deleteCartItem = createAsyncThunk('/cart/deleteCartItem', 
    async({userId, productId})=>{
        const result = await axios.delete(`http://localhost:5000/api/shop/cart/${userId}/${productId}`);
        return result?.data;
})
export const updateCartItemQty = createAsyncThunk('/cart/updateCartItemQty', 
    async({userId, productId,quantity})=>{
        const result = await axios.put('http://localhost:5000/api/shop/cart/update-cart/',{
            userId,
            productId,
            quantity
        });
        return result?.data;
})

const shoppingCartslice  = createSlice({
    name:'shoppingCart',
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(addtoCart.pending, (state, action)=>{
            state.isLoading=true
        }).addCase(addtoCart.fulfilled, (state, action)=>{
            console.log(action.payload, "paylaod");
            state.isLoading = false,
            state.cartItems = action?.payload?.data
        }).addCase(addtoCart.rejected, (state, action)=>{
            state.isLoading = false,
            state.cartItems = []
        }).addCase(fetchCartItems.pending, (state, action)=>{
            state.isLoading=true
        }).addCase(fetchCartItems.fulfilled, (state, action)=>{
            console.log(action.payload, "paylaod");
            state.isLoading = false,
            state.cartItems = action?.payload?.data
        }).addCase(fetchCartItems.rejected, (state, action)=>{
            state.isLoading = false,
            state.cartItems = null
        }).addCase(updateCartItemQty.pending, (state, action)=>{
            state.isLoading=true
        }).addCase(updateCartItemQty.fulfilled, (state, action)=>{
            console.log(action.payload, "paylaod");
            state.isLoading = false,
            state.cartItems = action?.payload?.data
        }).addCase(updateCartItemQty.rejected, (state, action)=>{
            state.isLoading = false,
            state.cartItems = null
        }).addCase(deleteCartItem.pending, (state, action)=>{
            state.isLoading=true
        }).addCase(deleteCartItem.fulfilled, (state, action)=>{
            console.log(action.payload, "paylaod");
            state.isLoading = false,
            state.cartItems = action?.payload?.data
        }).addCase(deleteCartItem.rejected, (state, action)=>{
            state.isLoading = false,
            state.cartItems = null
        })
    }
});

export default shoppingCartslice.reducer;
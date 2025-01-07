import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import adminProductsSlice from "./admin/products-slice";
import shopProductSlice from "./shop/product-slice";
import shopCartSlice from "./shop/cart-slice";
import shopAddressSlice from "./shop/address-slice";
import shopOrderSlice from "./shop/order-slice";
import adminOrderSlice from "./admin/order-slice";


const store = configureStore({
    reducer:{
        auth: authReducer,
        adminProduct: adminProductsSlice,
        shopProduct: shopProductSlice,
        shopCart: shopCartSlice,
        shopAddress: shopAddressSlice,
        shopOrder: shopOrderSlice,
        adminOrder: adminOrderSlice
    }
});

export default store;
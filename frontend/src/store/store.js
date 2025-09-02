import { configureStore } from "@reduxjs/toolkit";
import cartReducer from '../Context/CartSlice'

// masukan slice ke store
export const store = configureStore({
    reducer:{
        cart:cartReducer
    },
})


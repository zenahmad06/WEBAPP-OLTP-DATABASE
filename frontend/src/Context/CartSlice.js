
import {createSlice} from '@reduxjs/toolkit'
//buat slice
const CartSlice = createSlice({
    name:'cart',
    initialState:{
        data : [],
        confirm : false
    }, //bentuk list object nya
    reducers:{
        // add item
        addItem : (state,actions) => {
            state.data.push(actions.payload) //action.payload diharapkan berbentuk object
        },
        removeItem : (state,actions) => {
            state.data = state.data.filter((i,j) => j != actions.payload)
            return state
        },
        removeAll : (state) => {
            //hapus semua item di array
            state.data.splice(0)
        },
        changeStatus : (state,actions) => {
            state.confirm = actions.payload
        }
    }
})

//export action dan slice 
export const {addItem,removeItem,removeAll,changeStatus} = CartSlice.actions;

//export slice ke store
export default CartSlice.reducer;
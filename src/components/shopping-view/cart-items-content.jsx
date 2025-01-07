import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/button";
import {Minus, Plus, TrashIcon } from 'lucide-react';
import { deleteCartItem, updateCartItemQty } from "@/store/shop/cart-slice";
import { useToast } from "@/hooks/use-toast";

function UserCartItemsContent({cart}){
    console.log("cart2", cart);
    const dispatch = useDispatch();
    const {user} = useSelector((state)=> state.auth);
    const {toast} = useToast();

    function handleUpadeQuantity(getCartItem, typeOfAction){
        dispatch(updateCartItemQty({userId:user?.id, productId:getCartItem.productId,
            quantity: typeOfAction === 'plus'? getCartItem?.quantity +1 : getCartItem?.quantity -1
        })).then(data=>{
            if(data?.payload?.success){
                toast({
                    title:'Cart items updated successfully'
                })
            }
        })
    }
    function handleCartItemDelete(getCartItem){
        dispatch(deleteCartItem({userId:user?.id, productId:getCartItem.productId})).then(data=>{
            if(data?.payload?.success){
                toast({
                    title:'Cart items deleted successfully'
                })
            }
        })
    }
    return (
    <div className="flex items-center space-x-4">
        <img src={cart?.image} alt={cart?.title} 
        className="w-20 h-20 rounded object-cover"/>
        <div className="flex-1">
            <h3 className="font-extrabold">{cart?.title}</h3>
            <div className="flex items-center gap-2 mt-1">
                <Button onClick={()=>handleUpadeQuantity(cart, "minus")} 
                variant="outline"  disabled={cart?.quantity === 1} className="h-8 w-8  rounded-full" size="icon">
                    <Minus className="w-4 h-4" />
                    <span className="sr-only">Decrease</span>
                </Button>
                <span className="font-semibold">{cart?.quantity}</span>
                 <Button  onClick={()=>handleUpadeQuantity(cart, "plus")} variant="outline" className="h-8 w-8 rounded-full" size="icon">
                    <Plus className="w-4 h-4" />
                    <span className="sr-only">Increase</span>
                </Button>
            </div>
        </div>
        <div className="flex flex-col items-end">
            <p className="font-semibold">
                ${((cart?.salePrice > 0 ? cart?.salePrice : cart?.price) * cart?.quantity).toFixed(2)}
            </p>
            <TrashIcon onClick={()=> handleCartItemDelete(cart)} className="cursor-pointer mt-1" size={20}/>
        </div>
    </div>)
}

export default UserCartItemsContent;
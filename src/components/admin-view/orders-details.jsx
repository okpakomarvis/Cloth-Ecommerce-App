import { useState } from "react";
import CommonForm from "../common/form";
import {  DialogContent } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { BadgeCheck } from "lucide-react";
import { useSelector } from "react-redux";

const initialFormData ={
    status:''
}

function AdminOrderDetailsView({orderDetails}){
    const [formData, setFormData] = useState(initialFormData);
    const {user} = useSelector(state=>state.auth);

    function handleUpdateStatus(event){
        event.preventDefault();
        
    }
    return(
        <DialogContent className="sm:max-w-[600px]">
            <div className="grid gap-6">
                <div className="grid gap-2">
                    <div className="flex items-center justify-between mt-8">
                        <p className="font-medium">Order ID</p>
                        <label >{orderDetails?._id}</label>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                        <p className="font-medium">Order Date</p>
                        <label >{orderDetails?.orderDate.split('T')[0]}</label>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                        <p className="font-medium">Order Price</p>
                        <label >${orderDetails?.totalAmount}</label>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                        <p className="font-medium">Order Status</p>
                        <label ><Badge className={`py-1 px-3 ${orderDetails?.orderStatus ==='confirmed' ? 'bg-green-500':'' }`}> {orderDetails?.orderStatus}</Badge></label>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                        <p className="font-medium">Payment Method</p>
                        <label >${orderDetails?.paymentMethod}</label>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                        <p className="font-medium">Payment Status</p>
                        <label className={`${orderDetails?.paymentStatus ==='paid' ? 'bg-green-600 ' :'bg-black'} text-white p-1 border rounded-2xl`}>{orderDetails?.paymentStatus}{orderDetails?.paymentStatus ==='paid' ? <BadgeCheck className="bg-green-600 w-4 h-4 inline-block text-white"/> :''}</label>
                    </div>
                    
                </div>
                <Separator />
                <div className="grid gap-4 ">
                    <div className="grid gap-2">
                        <div className="font-medium">Order details</div>
                        <ul className="grid gap-3 ">
                            {
                                orderDetails?.cartItems && orderDetails?.cartItems.length > 0 ?orderDetails.cartItems.map(item=>(
                                 <li className="flex items-center justify-between">
                                    <span>Title: {item.title}</span>
                                    <span>Quantity: {item.quantity}</span>
                                    <span>Price: ${item.price}</span>
                                </li>   
                                )):null
                            }
                            
                        </ul>
                    </div>
                </div>
                <div className="grid gap-4 ">
                    <div className="grid gap-2">
                        <div className="font-medium">Shipping Info</div>
                        <div className="grid gap-0.5 text-muted-foreground ">
                                <span>{user?.username}</span>
                                <span>{orderDetails?.addressIfo?.address}</span>
                                 <span>{orderDetails?.addressIfo?.city}</span>
                                <span>{orderDetails?.addressIfo?.pincode}</span>
                                 <span>{orderDetails?.addressIfo?.phone}</span>
                                  <span>{orderDetails?.addressIfo?.notes}</span>
                        </div>
                    </div>
                </div>
                <div>
                    <CommonForm
                    formControls={[
                        {

                            label:"Order Status",
                            name:"status",
                            componentType:"select",
                            options:[
                                {id:"pending", label:"Pending"},
                                {id:"inProcess", label:"In Process"},
                                {id:"inShipping", label:"In Shipping"},
                                {id:"rejected", label:"Rejected"},
                                {id:"delivered", label:"Delivered"}
                            ]
                        }
                    ]} 
                    formData={formData}
                    setFormData={setFormData}
                    buttonText={'Update Order Status'}
                    onSubmit={handleUpdateStatus}
                    />
                </div>
            </div>
        </DialogContent>
    )
}

export default AdminOrderDetailsView;
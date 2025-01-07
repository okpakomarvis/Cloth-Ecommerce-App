
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import { Dialog } from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import AdminOrderDetailsView from "./orders-details";
import { getAllOrdersForAdminUser, getOrderDetailsForAdmin, resetOrderDetails } from "@/store/admin/order-slice";
import { Badge } from "../ui/badge";
import { useDispatch, useSelector } from "react-redux";
import { DialogTitle } from "../ui/dialog";

function AdminOrders(){
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    const dispatch = useDispatch();
    //const {user} = useSelector(state=>state.auth);
    const {orderList, orderDetails} = useSelector(state=>state.adminOrder);

    function handleFetchOrderDetails(getOrderId){
        dispatch(getOrderDetailsForAdmin(getOrderId))
    }
    useEffect(()=>{
        dispatch(getAllOrdersForAdminUser());
    },[dispatch]);
     useEffect(()=>{
        if(orderDetails !==null) setOpenDetailsDialog(true)
        //dispatch(getAllOrdersForAdminUser());
    },[orderDetails]);
    console.log("orderDetails", orderDetails);
    console.log("orderList", orderList);
    return (
        <Card>
            <CardHeader>
                <CardTitle>Order History</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order Id</TableHead>
                            <TableHead>Order Date</TableHead>
                            <TableHead>Order Status</TableHead>
                            <TableHead>Order Price</TableHead>
                            <TableHead>
                                <span className="sr-only">Details</span>
                            </TableHead>
                            
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            orderList && orderList.length >0 ? orderList.map(orderItem=>(
                            <TableRow key={orderItem?._id}>
                                <TableCell>{orderItem?._id}</TableCell>
                                <TableCell>{orderItem?.orderDate.split('T')[0]}</TableCell>
                                <TableCell>
                                    <Badge className={`py-1 px-3 ${orderItem?.orderStatus ==='confirmed' ? 'bg-green-500':'' }`}> {orderItem?.orderStatus}</Badge>
                                </TableCell>
                                <TableCell>${orderItem?.totalAmount}</TableCell>
                                <TableCell>
                                   <Dialog open={openDetailsDialog} onOpenChange={()=>{
                                     setOpenDetailsDialog(false);
                                    dispatch(resetOrderDetails());
                                   }
                                    }>
                                        <DialogTitle>
                                            <Button onClick={()=>handleFetchOrderDetails(orderItem?._id)}> View Details</Button>
                                        </DialogTitle>
                                        <AdminOrderDetailsView  orderDetails={orderDetails}/>
                                    </Dialog>
                                </TableCell>

                            </TableRow>
                            )):null
                        }
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

export default AdminOrders;
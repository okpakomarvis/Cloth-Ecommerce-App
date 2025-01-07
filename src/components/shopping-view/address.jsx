import { Phone } from "lucide-react";
import {useEffect, useState} from 'react';
import CommonForm from "../common/form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { AddressFormControls } from "../config";
import { useDispatch, useSelector } from "react-redux";
import { addNewAddress, deleteAddress, editAddress, fetchAllAddress } from "@/store/shop/address-slice";
import { useToast } from "@/hooks/use-toast";
import AddressCard from "./address-card";

const initialAddressFormData ={
    address:'',
    city:'',
    phone:'',
    pincode:'',
    notes:''
}

function Address({setCurrentSelectedAddress}) {
    const[formData, setFormDate] = useState(initialAddressFormData);
    const dispatch = useDispatch();
    const {user} = useSelector((state)=>state.auth);
    const {toast} = useToast();
    const {addressList} = useSelector((state)=>state.shopAddress);
    const [curretEditedId, setcurretEditedId] = useState(null);
 
    function handleMangeAddress(event){
        event.preventDefault();
        if(addressList.length >=3 && curretEditedId === null){
            toast({
                    title:"You can only add Max three Addresses",
                    variant:"destructive"
                });
                setFormDate(initialAddressFormData);
                return;
        }
        curretEditedId !== null ? dispatch(editAddress({
            userId:user?.id, addressId:curretEditedId,formData
        })).then((data)=>{
            if(data?.payload?.success){
                 toast({
                    title:"Address updated Successfully"
                })
                dispatch(fetchAllAddress(user?.id));
                setcurretEditedId(null);
                setFormDate(initialAddressFormData)
            }
        }):
        dispatch(addNewAddress({
            ...formData,
            userId:user?.id
        })).then((data)=>{
           if(data?.payload?.success){
                toast({
                    title:"Address added Successfully"
                })
                dispatch(fetchAllAddress(user?.id))
                setFormDate(initialAddressFormData)
           }
        });
    }
    function handleEditedAddress(getCurrentAddress){
        setcurretEditedId(getCurrentAddress?._id);
        setFormDate({
            ...formData,
             address:getCurrentAddress?.address,
            city:getCurrentAddress?.city,
            phone:getCurrentAddress?.phone,
            pincode:getCurrentAddress?.pincode,
            notes:getCurrentAddress?.notes
        })
    }
    function handleDeleteAddress(getCurrentAddress){
        dispatch(deleteAddress({userId:user?.id, addressId: getCurrentAddress?._id})).then(data=>{
            if(data?.payload?.success){
                toast({
                    title:"Address deleted Successfully"
                })
                dispatch(fetchAllAddress(user?.id));
            }
        })
    }
    function isFormValid(){
        return Object.keys(formData).map(key=>formData[key]?.trim() !=='').every((item)=> item);
    }
    useEffect(()=>{
        dispatch(fetchAllAddress(user?.id))
    },[]);
    console.log("addressList",addressList);
    return(
        <Card>
            <div className="mb-5 p-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {
                    addressList && addressList.length >0 ? addressList.map(singleAddressItem=>(
                        <AddressCard key={singleAddressItem?._id}
                         addressIfo={singleAddressItem}
                         handleDeleteAddress={handleDeleteAddress}
                         handleEditedAddress={handleEditedAddress}
                         setCurrentSelectedAddress={setCurrentSelectedAddress}
                         />
                    )):null
                }
            </div>
            <CardHeader>
                <CardTitle>
                    {curretEditedId !==null ? 'Edit Address':'Add New Address'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <CommonForm  formControls={AddressFormControls}
                formData={formData}
                setFormData={setFormDate}
                buttonText= {curretEditedId !==null ? 'Edit':'Add'}
                onSubmit={handleMangeAddress}
                isButtonDisabled = {!isFormValid()}
                
                />
            </CardContent>
        </Card>
    )
    
}

export default Address;
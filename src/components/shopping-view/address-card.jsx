import { Button } from "../ui/button";
import {CardContent, Card, CardFooter } from "../ui/card";

function AddressCard({addressIfo, handleDeleteAddress,handleEditedAddress,setCurrentSelectedAddress}){
    return(
        <Card onClick={setCurrentSelectedAddress? 
            ()=>setCurrentSelectedAddress(addressIfo): null}>
            <CardContent className="grid p-4 gap-4">
                <label >
                    Address: {addressIfo?.address}
                </label>
                <label >
                   City: {addressIfo?.city}
                </label>
                <label >
                   PinCode: {addressIfo?.pincode}
                </label>
                <label >
                   Phone Number: {addressIfo?.phone}
                </label>
                <label >
                   Notes: {addressIfo?.notes}
                </label>
            </CardContent>
            <CardFooter className="flex p-3 justify-between">
                <Button onClick={()=>handleEditedAddress(addressIfo)}>Edit</Button>
                <Button onClick={()=>handleDeleteAddress(addressIfo)}>Delete</Button>
            </CardFooter>
        </Card>
    )
}

export default AddressCard;
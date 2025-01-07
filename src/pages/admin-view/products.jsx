import {useEffect, useState} from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Fragment } from "react";
import CommonForm from "@/components/common/form";
import { addProductFormElements } from "@/components/config";
import ProductImageUplaod from "./image-upload";
import { useDispatch, useSelector } from "react-redux";
import { AddnewProduct, deleteProduct, editProduct, fetchAllProduct } from "@/store/admin/products-slice";
import { useToast } from "@/hooks/use-toast";
import AdminProductTile from "./product-tile";


const initialFormData = {
    image: null,
    title: '',
    description: '',
    category:'',
    brand: '',
    price: '',
    salePrice:'',
    totalStock:''
}


function AdminProducts(){
    const [openCreateProductsDialog, setOpenCreateProductsDialog] = useState(false);
    const [formData, setFormData] = useState(initialFormData);
    const [imageFile, setImageFile] = useState(null);
    const [uplaodedImageUrl, setUploadedImageUrl] =useState('');
    const [imageLoadingState, setImageLoadingState] = useState(false);
    const [currentEditedId, setCurrentEditedId] = useState(null);
    const dispatch = useDispatch();
    const {productList} = useSelector((state)=>state.adminProduct);
    const  {toast} = useToast();

    function onSubmit(event){
    event.preventDefault();
    currentEditedId !==null ? dispatch(editProduct({id:  currentEditedId, formData: formData})).then((data=>{
        console.log("editData:",data);
        if(data.payload?.success){
            dispatch(fetchAllProduct());
            setFormData(initialFormData);
            setOpenCreateProductsDialog(false);
            setCurrentEditedId(null);
        }
    })):
    dispatch(AddnewProduct({
        ...formData,
        image:uplaodedImageUrl
    })).then((data)=>{
        if(data.payload?.success){
            dispatch(fetchAllProduct())
            setOpenCreateProductsDialog(false);
            setImageFile(null);
            setFormData(initialFormData);
            toast({
                title:"Product added successfully"
            })

        }
    });
   
    }

    function handleDelete(getCurrentProductId){
        dispatch(deleteProduct(getCurrentProductId)).then((data)=>{
            console.log("delete",data)
            if(data?.payload?.success){
                dispatch(fetchAllProduct())
            }
        })
    }

    function isFormValid(){
        return Object.keys(formData).map(key=>formData[key] !=='').every(item=>item);
    }
    useEffect(()=>{
        dispatch(fetchAllProduct())
    },[dispatch]);
    console.log("productList:"+productList, "\nUrl: "+uplaodedImageUrl);
    return (
        <Fragment>
            <div className="mb-5 w-full flex justify-end">
                <Button onClick={()=> setOpenCreateProductsDialog(true)}>Add new Product</Button>
            </div>
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
                {
                    productList && productList.length>0 ? productList.map(productItem=><AdminProductTile 
                     setOpenCreateProductsDialog={setOpenCreateProductsDialog}  
                     setCurrentEditedId={setCurrentEditedId}
                     setFormData={setFormData}
                     handleDelete={handleDelete}
                     key={productItem._id} product={productItem}/>): null
                }
            </div>
             <Sheet open={openCreateProductsDialog} onOpenChange={()=>{
                setOpenCreateProductsDialog(false);
                setCurrentEditedId(null);
                setFormData(initialFormData);
                }}>
                <SheetContent side="right" className="overflow-auto">
                    <SheetHeader>
                        <SheetTitle>
                            {currentEditedId !==null ? 'Edit Product': 'Add New Product'}
                            
                        </SheetTitle>
                    </SheetHeader>
                    <ProductImageUplaod imageFile ={imageFile} 
                    setImageFile={setImageFile} 
                    uploadedImageUrl={uplaodedImageUrl} 
                    setUploadedImageUrl={setUploadedImageUrl}
                    setImageLoadingState={setImageLoadingState}
                    imageLoadingState={imageLoadingState}
                    isEditedMode={currentEditedId !== null}

                    />
                    <div className="py-6">
                        <CommonForm
                        formControls={addProductFormElements}
                        formData={formData}
                        setFormData={setFormData}
                        buttonText={currentEditedId !==null ? 'Edit' : 'Add'}
                        onSubmit={onSubmit}
                        isButtonDisabled={!isFormValid()}
                         />
                    </div>
                </SheetContent>
             </Sheet>
        </Fragment>
    )
}

export default AdminProducts;
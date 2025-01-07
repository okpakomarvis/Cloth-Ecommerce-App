import { Input } from "@/components/ui/input";
import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";

function ProductImageUplaod({imageFile, 
    setImageFile,uploadedImageUrl, 
    setUploadedImageUrl ,
    setImageLoadingState,
    imageLoadingState,
    isEditedMode
}) {
    const inputRef = useRef(null);
    function handleImageFileChange(event){
        console.log(event.target.files);
        const selectedFile = event.target.files?.[0]
        if(selectedFile) setImageFile(selectedFile)

    }
    function handleDragOver(event){
        event.preventDefault()
    }
    function handleDrop(event){
         event.preventDefault()
         const dropFile =event.dataTransfer.files?.[0];
         if(dropFile) setImageFile(dropFile)
    }
    function handleRemoveImage(event){
        event.preventDefault();
        setImageFile(null);
        if(inputRef.current){
            inputRef.current.value = '';
        }
    }
    async function uploadImageFileToCloudinary(){
        setImageLoadingState(true);
        const data = new FormData();
        data.append('my_file', imageFile);
        const response = await axios.post('http://localhost:5000/api/admin/products/upload-image', data);
        console.log(response.data);
        if(response?.data?.success) {
            setUploadedImageUrl(response.data.result.url)
            setImageLoadingState(false)
        }
    }
    useEffect(()=>{
        if(imageFile !==null) uploadImageFileToCloudinary()
    },[imageFile])
    return(
        <div className="w-full max-w-md mx-auto mt-4">
            <label className=" font-semibold mb-2 block">Upload Image</label>
            <div  onDragOver={handleDragOver}  onDrop={handleDrop} 
            className={`${isEditedMode ? 'opacity-60' :''}border-2 border-dashed rounded-lg p-4`} >
                <Input  id="image-upload"  type="file" className="hidden" disabled={isEditedMode}
                ref={inputRef} onChange={handleImageFileChange}/>
                {
                    !imageFile ? 
                    (<label htmlFor="image-upload" className={`${isEditedMode ? 'cursor-not-allowed' : ''}flex flex-col items-center justify-center h-32 cursor-pointer`}>
                        <UploadCloudIcon  className="w-10 h-10 text-muted-foreground mb-2"/>
                        <span>Drag & drop or click to upload image</span>
                    </label>): (imageLoadingState? <Skeleton className='h-10 bg-gray-100'/>:<div className="flex items-center justify-between">
                        <div className="flex items-center ">
                            <FileIcon className="w-8 h-8 text-primary mr-2"/>
                        </div>
                        <p className="text-sm font-medium">{imageFile.name}</p>
                        <Button  variant="ghost" size="icon" 
                        className="text-muted-foreground hover:text-foreground" 
                        onClick={handleRemoveImage}>
                            <XIcon className="w-4 h-4 "/>
                            <span className="sr-only">Remove file</span>
                        </Button>
                    </div>
                    )
                }
            </div>
        </div>
        
    )
}

export default ProductImageUplaod;
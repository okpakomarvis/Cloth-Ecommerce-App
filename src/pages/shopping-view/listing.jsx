import { sortOptions } from "@/components/config";
import ProductFilter from "@/components/shopping-view/filter";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { fetchAllFilteredProduct, fetchProductDetails } from "@/store/shop/product-slice";
import { DropdownMenuRadioItem } from "@radix-ui/react-dropdown-menu";
import { ArrowUpDownIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ShoppingProductTile from "./product-tile";
import { useSearchParams } from "react-router-dom";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { addtoCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/hooks/use-toast";

function createSearchParamsHelper(filterParams){
    const queryParams = [];
    for (const [key, value] of Object.entries(filterParams)) {
        if(Array.isArray(value) && value.length >0 ){
            const paramValue = value.join(",");
            queryParams.push(`${key}=${encodeURIComponent(paramValue)}`)
        }
        
    }
    console.log(queryParams, "queryParams");
    return queryParams.join("&");
}

function ShoppingListing(){
    const dispatch = useDispatch();
    const {productList, productDetails}  = useSelector((state)=>state.shopProduct);
    const [filters, setFilters] = useState({});
    const [sort, setSort] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const [openDetailsDialog,setOpenDetailsDialog] = useState(false);
    const {user} = useSelector((state)=>state.auth);
    const {toast} = useToast()
    

    function handleAddtoCart(getCurrentProductId){
        console.log("id",getCurrentProductId);
        dispatch(addtoCart({userId:user?.id, productId:getCurrentProductId, quantity:1})).then((data)=>{
            //console.log(data);
            
            if(data?.payload?.success){
                dispatch(fetchCartItems(user?.id))
                toast({
                    title:'Product added to cart successfully'
                })
            }
        })
    }
    

    function handleGetProductDetails(getCurrentProductId){
        console.log(getCurrentProductId);
        dispatch(fetchProductDetails(getCurrentProductId));
    }
    function handleSort(value){
        console.log(value)
        setSort(value)
    }
    function handleFilter(getSectionId, getCurrentOptions){
        console.log(getSectionId, getCurrentOptions);
        let cpyFilters = {...filters};
        const indexOfCurrentSection  = Object.keys(cpyFilters).indexOf(getSectionId);
        if(indexOfCurrentSection === -1){
            cpyFilters ={
                ...cpyFilters,
                [getSectionId]: [getCurrentOptions]
            }
        }else{
            const indexOfCurrentOption = cpyFilters[getSectionId].indexOf(getCurrentOptions);
            if(indexOfCurrentOption === -1) {
                cpyFilters[getSectionId].push(getCurrentOptions);
            }else{
                cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
            }
            
        }
        //console.log(cpyFilters);
        setFilters(cpyFilters);
        sessionStorage.setItem('filters', JSON.stringify(cpyFilters));
    }
    console.log(filters, "filters");
    console.log(searchParams, "searchParam");
    console.log(productDetails, "ProductDetails")
    useEffect(()=>{
        if(productDetails !==null) setOpenDetailsDialog(true)
    },[productDetails])
    useEffect(()=>{
        setSort("price-lowtohigh");
        setFilters(JSON.parse(sessionStorage.getItem('filters')) || {})
    },[]);
    useEffect(()=>{
        if(filters && Object.keys(filters).length > 0 ){
            const createQueryString = createSearchParamsHelper(filters);
            setSearchParams(new URLSearchParams(createQueryString));
            
        }
        
    },[filters])
        //fetch list of product
        useEffect(()=>{
            if(filters !== null && sort !== null){
                dispatch(fetchAllFilteredProduct({filterParams:filters, sortParams:sort}))
            }
        },[dispatch, filters,sort]);
        console.log(productList, "productList");

    return (<div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 p-4 md:px-6">
            <ProductFilter  filters={filters} handleFilter={handleFilter}/>
            <div className="bg-background w-full rounded-lg shadow-sm ">
                <div className="p-4 border-b flex items-center justify-between">
                    <h2 className="text-lg font-extrabold ">
                        All Products
                    </h2>
                    <div className="flex items-center gap-3">
                        <span className="text-muted-foreground">{productList.length}  Products</span>
                         <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="flex items-center gap-1">
                                <ArrowUpDownIcon  className="h-4 w-4"/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[200px]">
                         <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                            {
                                sortOptions.map(sortItem=>(
                                    <DropdownMenuRadioItem  value={sortItem.id} key={sortItem.id}>
                                        {sortItem.label}
                                    </DropdownMenuRadioItem>
                                ))
                            }
                         </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    </div>
                   
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                    {
                        productList && productList.length >0 ? productList.map(productItem=>
                            (<ShoppingProductTile handleGetProductDetails={handleGetProductDetails}
                                 key={productItem.title} 
                                 product={productItem}
                                 handleAddtoCart={handleAddtoCart}
                                 />)
                        ) : null
                    }
                </div>
            </div>
            <ProductDetailsDialog open={openDetailsDialog} 
            setOpen={setOpenDetailsDialog} productDetails={productDetails}/>
        </div>)
}

export default ShoppingListing;
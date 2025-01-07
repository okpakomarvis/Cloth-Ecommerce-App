import { Button } from '@/components/ui/button';
import bannerOne from '../../assets/banner-1.webp';
import bannerTwo from '../../assets/banner-2.webp';
import bannerThree from '../../assets/banner-3.webp';
import { BabyIcon, ChevronsLeftIcon, 
    ChevronsRightIcon, CloudLightning, 
    ShirtIcon, UmbrellaIcon,Check,RectangleEllipsis,Tent,Dumbbell,Boxes,Droplets, 
     WatchIcon } from 'lucide-react';
import { CardContent, Card } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllFilteredProduct, fetchProductDetails } from '@/store/shop/product-slice';
import ShoppingProductTile from './product-tile';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { addtoCart, fetchCartItems } from '@/store/shop/cart-slice';
import ProductDetailsDialog from '@/components/shopping-view/product-details';

 const categoriesWithIcon = [
            {id:"men", label:"Men", icon: ShirtIcon},
            {id:"women", label:"Women", icon: CloudLightning},
            {id:"kids", label:"Kids", icon:BabyIcon},
            {id:"accessories", label:"Accessories", icon: WatchIcon},
            {id:"footwear", label:"Footwear", icon: UmbrellaIcon}
    ];
const  brandWithIcons =[
        {id:"nike", label:"Nike",icon: Check },
        {id:"adidas", label:"Adidas", icon: RectangleEllipsis },
        {id:"puma", label:"Puma", icon: Tent },
        {id:"levi", label:"levi's", icon: Dumbbell },
        {id:"zara", label:"Zara", icon:Boxes },
        {id:"h&m", label:"H&M", icon: Droplets }
    ]

function ShoppingHome(){
        const [currentSlide, setCurrentSlide] = useState(0);
    const slides = [bannerOne, bannerTwo, bannerThree];
    const dispatch = useDispatch();
    const {productList, productDetails} = useSelector((state)=> state.shopProduct);
    const {user} = useSelector((state)=> state.auth);
    const navigate = useNavigate();
    const {toast} = useToast();
     const [openDetailsDialog,setOpenDetailsDialog] = useState(false);

      useEffect(()=>{
        if(productDetails !==null) setOpenDetailsDialog(true)
    },[productDetails])

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
    
    function handleNavigateToListingPage(getCurrentItems, section){
        sessionStorage.removeItem('filters');
        const currentFilter = {
            [section]:[getCurrentItems.id]
        }
        
        sessionStorage.setItem('filters', JSON.stringify(currentFilter));
        navigate(`/shop/listing`);
    }

   
    useEffect(()=>{
        const timer = setInterval(()=>{
            setCurrentSlide((prevSlide)=>(prevSlide +1) % slides.length);
        }, 5000)

        return ()=> clearInterval(timer);
    },[]);

    useEffect(()=>{
        dispatch(fetchAllFilteredProduct({filterParams:{}, sortParams:'price-lowtohigh'}))
    },[]);

    

    return <div className="flex flex-col min-h-screen ">
        <div className="relative w-full h-[600px] overflow-hidden">
            {
                slides.map((slide, index)=>(<img src={slide} key={index} className={`
                    ${index === currentSlide ? 'opacity-100':'opacity-0'} absolute top-0 left-0 h-full transition-opacity duration-1000`}/>))
            }
            <Button  onClick={()=>setCurrentSlide(prevSlide=>(prevSlide -1 + slides.length) % slides.length)} variant="outline" size="icon" 
            className="absolute top-1/2 left-4 transform -translatey-1/2 bg-black/20">
            <ChevronsLeftIcon className='w-4 h-4' />
            </Button>
            <Button onClick={()=>setCurrentSlide(prevSlide=>(prevSlide  + 1) % slides.length)} variant="outline" size="icon" 
            className="absolute top-1/2 right-4 transform -translatey-1/2 bg-black/20">
                <ChevronsRightIcon className='w-4 h-4' />
            </Button>
        </div>
        <section className='py-12 bg-gray-50'>
            <div className='container mx-auto px-4'>
                <h2 className='text-3xl font-bold text-center mb-8'>shop by category</h2>
                <div className='grid grid-col-2 md:grid-cols-3 lg:grid-cols-5 gap-4'>
                    {categoriesWithIcon.map(cartegoryItem=>(<Card 
                    onClick={()=>handleNavigateToListingPage(cartegoryItem, 'category')}
                    key={cartegoryItem.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                        <CardContent  className="flex flex-col items-center justify-center p-6">
                            <cartegoryItem.icon className='w-12 h-12 mb-4 text-primary' />
                            <span className='font-bold'>{cartegoryItem.label}</span>
                        </CardContent>
                    </Card>) )
                    }
                </div>
            </div>
        </section>
         <section className='py-12 bg-gray-50'>
            <div className='container mx-auto px-4'>
                <h2 className='text-3xl font-bold text-center mb-8'>shop by Brand</h2>
                <div className='grid grid-col-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
                    {brandWithIcons.map(brandItem=>(<Card onClick={()=>handleNavigateToListingPage(brandItem, 'brand')}
                    key={brandItem.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                        <CardContent className="flex flex-col items-center justify-center p-6">
                            <brandItem.icon className='w-12 h-12 mb-4 text-primary' />
                            <span className='font-bold'>{brandItem.label}</span>
                        </CardContent>
                    </Card>) )
                    }
                </div>
            </div>
        </section>
        <section className='py-12 bg-gray-50'>
            <div className='container mx-auto px-4'>
                <h2 className='text-3xl font-bold text-center mb-8'>Feature Products</h2>
                <div className='grid grid-col-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                    {
                        productList && productList.length >0 ? productList.map((productItem=>(
                            <ShoppingProductTile key={productItem._id}
                            handleGetProductDetails={handleGetProductDetails}
                            handleAddtoCart={handleAddtoCart}
                             product={productItem}/>
                        ))) : null
                    }
                   
                </div>
            </div>
        </section>
         <ProductDetailsDialog open={openDetailsDialog} 
            setOpen={setOpenDetailsDialog} productDetails={productDetails}/>
    </div>
}

export default ShoppingHome;
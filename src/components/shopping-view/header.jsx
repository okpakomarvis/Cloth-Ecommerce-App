import { Link, useNavigate } from "react-router-dom";
import { House, Menu, ShoppingCart,UserCog,LogOut } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "../config";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { logoutUser } from "@/store/auth-slice";
import UserCartItemsContent from "./cart-items-content";
import UserCartWrapper from "./cart-weapper";
import { useEffect, useState } from "react";
import { fetchCartItems } from "@/store/shop/cart-slice";

function MenuItems({handleNavigate}){
    return (<nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
        {
            shoppingViewHeaderMenuItems.map(menuItem=>
            <label  className="text-sm font-medium cursor-pointer" 
             key={menuItem.id}
             onClick={()=>handleNavigate(menuItem)}
             >
                {menuItem.label}
            </label>)
        }
    </nav>)
}

function HeaderRightContent(){
    const {user} = useSelector(state=> state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const  [opeCartSheet, setOPenCartSheet] = useState(false);
    const {cartItems} = useSelector((state)=>state.shopCart);


    function handleLogout(){
        dispatch(logoutUser());
    }
    useEffect(()=>{
        dispatch(fetchCartItems(user?.id))
    }, [dispatch])
    console.log(cartItems,"cartItems");
    return <div className="flex lg:items-center lg:flex-row flex-col gap-4">
        <Sheet open={opeCartSheet} onOpenChange={()=>setOPenCartSheet(false)}>
            <Button variant="outline" size="icon" onClick={()=>setOPenCartSheet(true)}>
                <ShoppingCart className="w-6 h-6"/>
                <span className="sr-only">User cart</span>
            </Button>
            <UserCartWrapper setOPenCartSheet={setOPenCartSheet} cartItems={cartItems && cartItems.items && cartItems.items.length >0 ? cartItems.items : []}/>
        </Sheet>
        <DropdownMenu>
            <DropdownMenuTrigger  asChild>
                <Avatar>
                    <AvatarFallback className="bg-black text-white font-extrabold">
                        {user?.username[0].toUpperCase()}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" className="w-56 ">
                <DropdownMenuLabel>
                    Logged in as {user?.username}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={()=> navigate('/shop/account')}>
                    <UserCog className="mr-2 h-4 w-4"/>
                    Account
                </DropdownMenuItem>
                 <DropdownMenuSeparator />
                 <DropdownMenuItem onClick={handleLogout}>
                    <LogOut  className="mr-2 h-4 w-4"/>
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

    </div>
}

function ShoppingHeader(){
    //*chech if user authenticated
    const {isAuthenticated, user} = useSelector(state=> state.auth);
    const navigate = useNavigate();
    console.log(user, "userInfor");
      
    function handleNavigate(getCurrentMenuItems){
        sessionStorage.removeItem('filters');
        const currentFilter = getCurrentMenuItems.id !== 'home' ? {
            category:[getCurrentMenuItems.id]
        } : null
        sessionStorage.setItem('filters', JSON.stringify(currentFilter));
        navigate(getCurrentMenuItems.path);
    }
    return (
        
        <header className="sticky top-0 z-40 w-full border-b bg-background">
            <div className="flex h-16 items-center justify-between px-4 md:px-6">
                <Link to='/shop/home' className="flex items-center gap-2">
                    <House  className="h-6 w-6 "/>
                    <span className="font-bold">Moheems Clothings</span>
                </Link>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" className="lg:hidden">
                            <Menu className="h-6 w-6"/>
                            <span className="sr-only">Toggle header Menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-full max-w-xs">
                        <MenuItems handleNavigate={handleNavigate} />
                        <HeaderRightContent  />
                    </SheetContent>
                </Sheet>
                <div className="hidden lg:block">
                    <MenuItems  handleNavigate={handleNavigate}/>
                </div>

                {/** 
                 isAuthenticated ? (<div>
                    <HeaderRightContent />
                 </div>): null
                 */
                }
               <div className="hidden lg:block">
                    <HeaderRightContent  />
                </div> 
            </div>

        </header>
    );
}

export default ShoppingHeader
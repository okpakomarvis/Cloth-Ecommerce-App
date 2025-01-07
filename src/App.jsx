
import { Route, Routes } from 'react-router-dom'
import AuthLogin from './pages/auth/login'
import AuthLayout from './components/auth/layout'
import AuthRegister from './pages/auth/register'
import AdminLayout from './components/admin-view/layout'
import AdminDashboard from './pages/admin-view/dasboard'
import AdminOrders from './pages/admin-view/orders'
import AdminProducts from './pages/admin-view/products'
import AdminFeatures from './pages/admin-view/features'
import ShoppingLayout from './components/shopping-view/layout'
import NotFound from './pages/not-found'
import ShoppingHome from './pages/shopping-view/home'
import ShoppingCheckout from './pages/shopping-view/checkout'
import ShoppingAccount from './pages/shopping-view/account'
import ShoppingListing from './pages/shopping-view/listing'
import CheckAuth from './components/common/check-auth'
import UnauthPage from './pages/unauth-page'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { checkAuth } from './store/auth-slice'
import { Skeleton } from '@/components/ui/skeleton'
import AdminAllOrders from './pages/admin-view/orders'
import PaypalReturnPage from './pages/shopping-view/paypay-return'
import PaymentSuccessPage from './pages/shopping-view/payment-success'




function App() {
  const {user, isAuthenticated, isLoading} = useSelector((state)=>state.auth);
  const dispatch = useDispatch();
  
  useEffect(()=>{
    dispatch(checkAuth())
  }, [dispatch]);

  if(isLoading) return <Skeleton className="w-[800] bg-black h-[600px] " />


  return (
    <div className='flex flex-col overflow-hidden bg-white'>
      <Routes>
        <Route path='/auth' element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user}>
            <AuthLayout />
          </CheckAuth> } >
          <Route path='login' element={<AuthLogin />}></Route>
          <Route path='Register' element ={<AuthRegister />}></Route>
        </Route>
        {/** admin route */}
        <Route path='/admin' element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user}>
            <AdminLayout/>
          </CheckAuth>}>
          <Route path='dashboard' element={<AdminDashboard />}></Route>
          <Route path='orders' element ={<AdminAllOrders
           />}></Route>
          <Route path='products' element={<AdminProducts />}></Route>
          <Route path='features' element ={<AdminFeatures />}></Route>
        </Route>
        {/***shopping route */}
        <Route path='/shop' element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user}>
          <ShoppingLayout />
          </CheckAuth>} >
          <Route path='Home' element={<ShoppingHome />}></Route>
          <Route path='checkout' element ={<ShoppingCheckout />}></Route>
          <Route path='account' element={<ShoppingAccount />}></Route>
          <Route path='listing' element ={<ShoppingListing />}></Route>
          <Route path='paypal-return' element ={<PaypalReturnPage />}></Route>
          <Route path='payment-success' element ={<PaymentSuccessPage />}></Route>
        </Route>
        {/*** not found  */}
        <Route path='*'  element={<NotFound/>} />
        <Route path='/unauth-page' element={<UnauthPage/>} />
      </Routes>
    </div>
  )
}

export default App

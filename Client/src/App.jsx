import { useAuthStore } from './store/useAuthStore';
import './index.css';
import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import {Loader} from 'lucide-react';
import SignUpPage from './pages/auth/SignUpPage';
import EmailVerify from './pages/auth/EmailVerify';
import { ToastContainer } from 'react-toastify';
import LogInPage from './pages/auth/LogInPage';
import ForgotPassword from './pages/auth/ForgotPassword';
import OtpVerify from './pages/auth/OtpVerify';
import UpdatePassword from './pages/auth/UpdatePassword';
import AuthLayout from './layouts/AuthLayout';
import AdminLayout from './layouts/AdminLayout';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import RoleRedirect from './components/common/RoleRedirect';
import ShoppingLayout from './layouts/ShoppingLayout';
import ShoppingListing from './pages/shopping/ShoppingListing';
import HomePage from './pages/shopping/HomePage';
import AccountPage from './pages/shopping/AccountPage';
import CheckoutPage from './pages/shopping/CheckoutPage';
import StripeReturnPage from './pages/shopping/StripeReturnPage';
import PaymentSuccessPage from './pages/shopping/PaymentSuccessPage';
import SearchProductPage from './pages/shopping/SearchPage';
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {

  const {authUser, checkAuth, isCheckingAuth} = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if(isCheckingAuth){ 
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className='size-10 animate-spin' />
      </div>
    )
  }

  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path="/" element={
            authUser ? (
              authUser?.role === "admin" ? <Navigate to="/admin" replace /> : <Navigate to="/shop/home" replace />
            ) : (
              <Navigate to="/shop/home" replace />
            )
          } 
        />
        
        <Route element={<AuthLayout />}>
          <Route path="/login" element={
              authUser ? (
                authUser.role === "admin"
                  ? <Navigate to="/admin" replace />
                  : <Navigate to={location.state?.from || "/shop/home"} replace />
              ) : (
                <LogInPage />
              )
            } 
          />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/verifyemail" element={
              authUser ? (
                authUser?.role === "admin" ? <Navigate to="/admin" replace /> : <Navigate to="/shop/home" replace />
              ) : (
                <EmailVerify />
              )
            } 
          />
          <Route path='/forgotpassword' element={<ForgotPassword />} />
          <Route path='/verifyotp' element={<OtpVerify />} />
          <Route path='/updatepassword' element={<UpdatePassword />} />
        </Route> 

        <Route element={<RoleRedirect only="admin" />}> 
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
          </Route>
        </Route>

        <Route element={<RoleRedirect only="user" />}>
          <Route path="/shop" element={<ShoppingLayout />}>
            <Route path="home" element={<HomePage />} />
            <Route path="listing" element={<ShoppingListing />} />
            <Route path="account" element={<AccountPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="stripe_return" element={<StripeReturnPage />} />
            <Route path="payment_success" element={<PaymentSuccessPage />} />
            <Route path="search" element={<SearchProductPage />} />
          </Route>
        </Route>
      </Routes>
    </div>
  )
}

export default App;

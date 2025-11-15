import FloatingShape from "./components/FloatingShape"
import {Routes, Route} from 'react-router-dom'
import HomePage from "./pages/HomePage"
import SignupPage from "./pages/SignupPage"
import LoginPage from "./pages/LoginPage"
import ForgetPasswordPage from "./pages/ForgetPasswordPage"
import ResetPasswordPage from "./pages/ResetPasswordPage"
import EmailVerificationPage from "./pages/EmailVerificationPage"
import ProtectedPage from "./pages/ProtectedPage"
import RedirectAuthenticatedUser from "./pages/RedirectAuthenticatedUser"
import { useAuthStore } from './store/AuthStore.js';
import { useEffect } from "react"
import { Navigate } from "react-router-dom"
import LoadingSpinner from "./components/LoadingSpinner.jsx"
import { Toaster } from "react-hot-toast"
function App() {
  const {checkAuth, isCheckingAuth} = useAuthStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  if (isCheckingAuth) {
    return (
      <LoadingSpinner/>
      // <div className="min-h-screen flex items-center justify-center bg-gray-900">
      //   <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500"></div>
      // </div>
    );
  }
  return (
    
    <div className='min-h-screen bg-linear-to-br from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden'>
      <FloatingShape color='bg-green-500' size='w-64 h-64' top='-5%' left='10%' delay={0} />
			<FloatingShape color='bg-emerald-500' size='w-48 h-48' top='70%' left='80%' delay={5} />
			<FloatingShape color='bg-lime-500' size='w-32 h-32' top='40%' left='-10%' delay={2} />
      <Routes>

        <Route path="/" element={<ProtectedPage><HomePage /></ProtectedPage>} />
        <Route path="/signup" element={<RedirectAuthenticatedUser><SignupPage /></RedirectAuthenticatedUser>} />
        <Route path='/verify-email' element={<EmailVerificationPage />} />
        <Route path="/login" element={<RedirectAuthenticatedUser><LoginPage /></RedirectAuthenticatedUser>} />
        <Route path="/forgot-password" element={<RedirectAuthenticatedUser><ForgetPasswordPage /></RedirectAuthenticatedUser>} />
        <Route path="/reset-password/:token" element={
          <RedirectAuthenticatedUser><ResetPasswordPage /></RedirectAuthenticatedUser>} />

        {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
      </Routes>
      <Toaster/>
    </div>
     
  )
}

export default App

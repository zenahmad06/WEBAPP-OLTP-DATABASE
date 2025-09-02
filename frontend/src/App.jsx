import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LoginPage from './pages/LoginPage'
import LandingLayout from './layouts/LandingLayouts'
import { BrowserRouter, Routes,Route } from 'react-router-dom'
import SignUpPage from './pages/SignUpPage'
import DashBoard from './pages/DashBoard'
import DetailedPage from './pages/DetailedPage'
import ProductPage from './pages/ProductPage'
import CartPage from './pages/CartPage'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Routes>
            <Route path='/' element={<LandingLayout/>}>
              <Route index element={<LoginPage/>}/>
              <Route path='login' element={<LoginPage/>}/>
              <Route path='register' element={<SignUpPage/>}/>
            </Route>
            <Route path = '/' element={<DashBoard/>}>
              <Route path='/product' element={<ProductPage/>}/>

              <Route path='/cart' element={<CartPage/>}/>

            </Route>
            <Route path = '/product/:menu_id' element={<DetailedPage/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App

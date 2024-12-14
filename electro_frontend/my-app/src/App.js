import './App.css';
import { BrowserRouter, Routes,Route } from 'react-router-dom';
import Login from './components/Login/Login';
import { CreateProductPage, HomePage } from './routes';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartProductPage from './pages/CartProductPage';
import OrderProduct from './components/OrderProduct/OrderProduct';
import Signup from './components/Signup/Signup';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
   <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />}/>
        <Route path='/sign-up' element={<Signup/>}/>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/product/:id' element={<ProductDetailsPage/>}/>
        <Route path='/cart'element={<CartProductPage/>}/>
        <Route path='/user/:userId/order'element={<OrderProduct/>}/>
        <Route path='/admin/create' element={<CreateProductPage/>}/>
        
      </Routes>
      <ToastContainer/>
   </BrowserRouter>
  );
}

export default App;

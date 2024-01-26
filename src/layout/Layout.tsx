import { Route, Routes } from 'react-router-dom';
import './layout.scss'
import Background from '../components/Background';
import Header from '../components/Header/';
import Product from '../pages/Product/index.tsx'
import Products from '../pages/Products/index.tsx'
import Cart from '../pages/Cart/index.tsx';

export default function Layout() {
  return (
    <>
      <div id="background">
        <Background />
      </div>
      <div id="app">
        <Header />
        <Routes>
          <Route path="/" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/:id" element={<Product />} />
        </Routes>
      </div>
    </>
  )
}

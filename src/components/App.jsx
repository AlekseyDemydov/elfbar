import React from 'react';
import { CartProvider } from 'react-use-cart';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './Layout/Layout';
import Main from 'pages/Main/Main';
import AddProduct from 'pages/AddProduct/AddProduct';
import ProductDetail from 'pages/ProductDetail/ProductDetail';
import AdminLogin from 'pages/AdminLogin/AdminLogin';
import Basket from 'pages/Basket/Basket';
import { Contacts } from 'pages/Contacts/Contacts';
import Question from 'pages/Question/Question';
import Feedback from 'pages/Feedback/Feedback';
import Thanks from 'pages/Thanks/Thanks';


export const App = () => {
  return (
    <CartProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Main />} />
          <Route path="thanks" element={<Thanks />} />
          <Route path="feedback" element={<Feedback />} />
          <Route path="question" element={<Question />} />
          <Route path="contacts" element={<Contacts />} />
          <Route path="admin" element={<AdminLogin />} />
          <Route path="basket" element={<Basket />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="products/:id" element={<ProductDetail />} />
          <Route path="products/:id/edit" element={<AddProduct />} /> 
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </CartProvider>
  );
};

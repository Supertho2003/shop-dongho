import React from 'react'
import Header from '../components/Layout/Header';
import Product from '../components/Product/Product';
import Hero from '../components/Hero/Hero';
import Footer from '../components/Layout/Footer';

const HomePage = () => {
  return (
    <div className='bg-gray-50'>
      <Header/>
      <Hero/>
      <Product/>
      <Footer />
    </div>
  )
}

export default HomePage

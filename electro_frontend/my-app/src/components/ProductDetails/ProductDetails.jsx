import React, { useEffect, useState } from "react";
import Header from "../Layout/Header";
import Footer from "../Layout/Footer";
import { BsCartPlus } from "react-icons/bs";
import { FaRegHeart } from "react-icons/fa6";
import { BsCartCheck } from "react-icons/bs";
import { productDataDetails } from "../../static/data";
import { Link, useParams } from "react-router-dom";
import { toast } from 'react-toastify';
import axios from "axios";

const ProductDetails = () => {
    const { id } = useParams(); // Get the product ID from the route params
    const [product, setProduct] = useState(null); // State to store product details
    const [loading, setLoading] = useState(true); // State to handle loading state
    const [error, setError] = useState(null); // State to handle error
    const [quantity, setQuantity] = useState(1); // State for quantity of product to add

    // Fetch product details based on the product ID
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:9191/api/v1/products/${id}/product`);
                setProduct(response.data.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleAddToCart = async () => {
        const token = localStorage.getItem('jwt');
    
        if (product && token) {
            try {
                const response = await axios.post(
                    `http://localhost:9191/api/v1/cartItems/item/add?productId=${product.id}&quantity=${quantity}`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                toast.success('Đã thêm vào giỏ hàng !!'); // Show success toast
            } catch (error) {
               
                toast.error('Thêm sản phẩm thất bại !!'); // Show error toast
            }
        } else {
            toast.error('Bạn phải đăng nhập để thêm vào giỏ hàng'); // Show error toast
        }
    };
    
    // Increment quantity
    const increaseQuantity = () => {
        setQuantity(prevQuantity => prevQuantity + 1);
    };

    // Decrement quantity
    const decreaseQuantity = () => {
        setQuantity(prevQuantity => (prevQuantity > 1 ? prevQuantity - 1 : 1));
    };

    // Early return if loading or if there's an error
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!product) return <div>No product found.</div>;

    const [firstImage, ...otherImages] = product.images;

    return (
        <div>
            <Header />
            <div className="bg-[#ebebeb]">
                <div className="w-12/12 mx-auto p-14">
                    <div className="flex bg-white justify-between px-16 py-14 border shadow-md rounded-md">
                        <div className="w-[40%]">
                            <div className="flex items-center justify-center mb-5">
                                {firstImage && (
                                    <img
                                        alt={product.name}
                                        src={firstImage.downloadUrl}
                                        width={300}
                                    />
                                )}
                            </div>

                            <div className="flex items-center justify-center">
                                {otherImages.length > 0 ? otherImages.map((image, index) => (
                                    <img
                                        key={index}
                                        alt={`Product Image ${index}`}
                                        src={image.downloadUrl}
                                        width={120}
                                        className="border rounded-md mx-1 shadow-md"
                                    />
                                )) : (
                                    <p>No additional images available</p>
                                )}
                            </div>
                        </div>
                        <div className="w-[40%]">
                            <h1 className="text-2xl font-medium text-[#0a263c]">
                                {product.name}
                            </h1>

                            <p className="text-xl mb-4">{product.description}</p>

                            <div className="flex items-center justify-start mt-5 mb-5">
                                <button onClick={decreaseQuantity} className="px-4 py-1 rounded-sm text-lg bg-black text-white flex items-center justify-center cursor-pointer">
                                    -
                                </button>
                                <p className="px-4 py-1.5 border">{quantity}</p>
                                <button onClick={increaseQuantity} className="px-4 py-1 rounded-sm text-xl bg-black text-white flex items-center justify-center cursor-pointer">
                                    +
                                </button>
                            </div>

                            <span className="text-2xl text-gray-600">{product.price}0.000 đ</span>

                            <div className="border cursor-pointer rounded-md py-3 text-center w-full flex items-center justify-center bg-blue-600 text-white mt-5 mb-5">
                                <BsCartCheck size={25} className="mr-2" />
                                <button onClick={handleAddToCart} className="font-medium text-xl">Mua ngay</button>
                            </div>

                            <div className="flex justify-between gap-3">
                                <div className="bg-white border cursor-pointer rounded-md py-3 text-center shadow-sm w-[50%] flex items-center justify-center hover:bg-blue-600 hover:text-white duration-300 hover:scale-105">
                                    <BsCartPlus size={25} className="mr-2" />
                                    <button onClick={handleAddToCart} className="font-medium text-lg">
                                        Thêm vào giỏ hàng
                                    </button>
                                </div>
                                <div className="bg-white border cursor-pointer shadow-sm rounded-md py-3 text-center w-[50%] flex items-center justify-center hover:bg-blue-600 hover:text-white duration-300 hover:scale-105">
                                    <FaRegHeart size={25} className="mr-2" />
                                    <button className="font-medium text-lg">
                                        Thêm vào yêu thích
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white mt-5 rounded-md py-4 px-6">
                        <h2 className="text-2xl font-medium mb-4">Các sản phẩm liên quan</h2>
                        <div className="grid grid-cols-5 gap-6">
                            {productDataDetails &&
                                productDataDetails.map((i, index) => (
                                    <div key={index} className="border px-5 shadow-md py-5">
                                        <img alt="" src={i.image_Url[0].url} />
                                        <div>
                                            <Link className="font-medium">{i.name}</Link>

                                            <button className=" bg-[#E90628] text-white border cursor-pointer font-medium  rounded-2xl py-2 px-2 text-center shadow-sm w-full flex items-center justify-center hover:bg-blue-600 hover:text-white duration-300 hover:scale-105 text-md mt-5"
                                            onClick={handleAddToCart}
                                            >
                                                Thêm vào giỏ hàng
                                            </button>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default ProductDetails;

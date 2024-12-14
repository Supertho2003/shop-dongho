import React, { useEffect, useState } from "react";
import Header from "../Layout/Header";
import Footer from "../Layout/Footer";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineDelete } from "react-icons/md";
import { AiOutlineGift } from "react-icons/ai";
import { FaMoneyCheck } from "react-icons/fa6";
import { jwtDecode } from "jwt-decode";
import axios from "axios";


const OrderProduct = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('jwt');

  let userId = null;
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      userId = decodedToken.id;
    } catch (err) {
      console.error('Invalid token', err);
    }
  }

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userId) {
        setError('User ID is missing or token is invalid.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:9191/api/v1/orders/user/${userId}/order`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(response.data.data);
      } catch (err) {
        setError(err.response ? err.response.data.message : err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId, token]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (orders.length === 0) {
    return <div>No orders found.</div>;
  }

  return (
    <div>
      <Header />
      <div className="m-10">
        <div className="mb-3 ml-16">
          <Link
            to="/"
            className="text-blue-600 text-lg font-semibold underline"
          >
            Trang chủ / Đặt hàng
          </Link>
        </div>
        <div className="flex bg-white px-16 py-6 border-b border-gray-400">
      
          <div className="w-[100%]">
          <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2 text-left">Ngày Đặt Hàng</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Tổng tiền</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Trạng Thái</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Sản Phẩm Đã Đặt</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">{new Date(order.orderDate).toLocaleDateString()}</td>
              <td className="border border-gray-300 px-4 py-2">{order.totalAmount.toFixed(2)}0.000 đ</td>
              <td className="border border-gray-300 px-4 py-2">{order.status}</td>
              <td className="border border-gray-300 px-4 py-2">
                <ul className="list-disc list-inside">
                  {order.items.map((item, index) => (
                    <li key={index} className="flex items-center py-1">
                      <img
                        src={item.product.images[0]?.downloadUrl}
                        alt={item.product.name}
                        className="w-8 h-8 object-cover mr-2"
                      />
                      {item.product.name} (x{item.quantity}) - ${item.product.price.toFixed(2)}
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

          
          </div>
        </div>
        
      </div>
      <Footer />
    </div>
  );
};

export default OrderProduct;

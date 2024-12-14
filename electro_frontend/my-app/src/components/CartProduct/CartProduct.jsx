import React, { useEffect, useState } from "react";
import Header from "../Layout/Header";
import Footer from "../Layout/Footer";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineDelete } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const CartProduct = () => {
  const [cartItems, setCartItems] = useState([]);
  const [cartId, setCartId] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch cart items from API
  useEffect(() => {
    const fetchCartItems = () => {
      const token = localStorage.getItem("jwt");
      let userId = null;
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          userId = decodedToken.id; // Lấy userId từ token
        } catch (err) {
          console.error("Invalid token", err);
          toast.error("Token không hợp lệ");
        }
      }

      axios
        .get(`http://localhost:9191/api/v1/carts/user/${userId}/my-cart`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log(response.data.data.items);
          setCartItems(
            response.data.data.items.map((item) => ({
              productId: item.product.id,
              name: item.product.name,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              images: item.product.images,
            }))
          );
          setCartId(response.data.data.cartId);
        })
        .catch((error) => {
          console.error("Failed to fetch cart items", error);
          toast.error("Đăng nhập để xem giỏ hàng");
        })
        .finally(() => {
          setLoading(false);
        });
    };

    fetchCartItems();
  }, []);

  // Function to handle removing an item from the cart
  const handleRemoveItem = (itemId) => {
    const token = localStorage.getItem("jwt");

    if (!token) {
      toast.error("Thiếu token hoặc ID giỏ hàng");
      return;
    }

    axios
      .delete(
        `http://localhost:9191/api/v1/cartItems/cart/${cartId}/item/${itemId}/remove`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        setCartItems((prevItems) =>
          prevItems.filter((item) => item.productId !== itemId)
        );
        toast.success("Đã xóa sản phẩm khỏi giỏ hàng thành công!");
      })
      .catch((error) => {
        console.error("Failed to remove item from cart", error);
        toast.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng");
      });
  };

  // Function to handle clearing the cart
  const handleClearCart = () => {
    const token = localStorage.getItem("jwt");

    if (!token) {
      toast.error("Thiếu token hoặc ID giỏ hàng");
      return;
    }

    axios
      .delete(`http://localhost:9191/api/v1/carts/${cartId}/clear`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setCartItems([]); // Xóa tất cả sản phẩm khỏi state
        toast.success("Đã xóa toàn bộ sản phẩm khỏi giỏ hàng thành công!");
      })
      .catch((error) => {
        toast.error("Bạn cần có một tài khoản để có giỏ hàng");
      });
  };

  // Function to handle increasing or decreasing item quantity
  const handleQuantityChange = (itemId, newQuantity) => {
    const token = localStorage.getItem("jwt");

    if (!token) {
      toast.error("Thiếu token hoặc ID giỏ hàng");
      return;
    }

    if (newQuantity <= 0) {
      handleRemoveItem(itemId);
      return;
    }

    axios
      .put(
        `http://localhost:9191/api/v1/cartItems/cart/${cartId}/item/${itemId}/update`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: { quantity: newQuantity },
        }
      )
      .then(() => {
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.productId === itemId
              ? { ...item, quantity: newQuantity }
              : item
          )
        );
        toast.success("Cập nhật số lượng thành công!");
      })
      .catch((error) => {
        console.error("Failed to update item quantity", error);
        toast.error("Lỗi khi cập nhật số lượng sản phẩm");
      });
  };

  // Function to create an order
  const createOrder = () => {
    const token = localStorage.getItem("jwt");

    if (!token) {
      console.error("No token found");
      toast.error("Bạn cần đăng nhập để tạo đơn hàng.");
      return;
    }

    let userId;
    try {
      const decodedToken = jwtDecode(token);
      userId = decodedToken.id;
    } catch (error) {
      console.error("Error decoding token", error);
      toast.error("Token không hợp lệ. Vui lòng đăng nhập lại.");
      return;
    }

    if (!userId) {
      console.error("No user ID found in token");
      toast.error("Thiếu ID người dùng trong token.");
      return;
    }

    axios
      .post(
        `http://localhost:9191/api/v1/orders/order?userId=${userId}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        const orderId = response.data.data.id;
        toast.success(response.data.message);
        localStorage.setItem("orderId", orderId);
      })
      .catch((error) => {
        console.error("Failed to create order", error);
        toast.error("Lỗi khi tạo đơn hàng");
      });
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <Header />
      <div className="m-10">
        <div className="mb-3">
          <Link
            to="/"
            className="text-blue-600 text-lg font-semibold underline"
          >
            Trang chủ / giỏ hàng
          </Link>
        </div>

        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          {cartItems.length > 0 ? (
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 border">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3 border">
                    Ảnh sản phẩm
                  </th>
                  <th scope="col" className="px-6 py-3 border">
                    Tên sản phẩm
                  </th>
                  <th scope="col" className="px-6 py-3 border">
                    Giá bán
                  </th>
                  <th scope="col" className="px-6 py-3 border">
                    Số lượng
                  </th>
                  <th scope="col" className="px-6 py-3 border">
                    Tạm tính
                  </th>
                  <th scope="col" className="px-6 py-3 border">
                    Xoá
                  </th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.productId}>
                    <td className="px-6 py-4 border flex items-center justify-center">
                      <img
                        className="rounded-lg"
                        src={
                          item.images && item.images.length > 0
                            ? item.images[0].downloadUrl
                            : ""
                        }
                        alt={item.name}
                        width={80}
                      />
                    </td>
                    <td className="px-6 py-4 border">{item.name}</td>
                    <td className="px-6 py-4 border">{item.unitPrice}0.000 đ</td>
                    <td className="px-6 py-4 border">
                      <div className="flex items-center justify-start">
                        <button
                          className="px-4 py-1 rounded-sm text-lg bg-black text-white flex items-center justify-center cursor-pointer"
                          onClick={() =>
                            handleQuantityChange(
                              item.productId,
                              item.quantity - 1
                            )
                          }
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <p className="px-4 py-1.5 border">{item.quantity}</p>
                        <button
                          className="px-3 py-1 rounded-sm text-xl bg-black text-white flex items-center justify-center cursor-pointer"
                          onClick={() =>
                            handleQuantityChange(
                              item.productId,
                              item.quantity + 1
                            )
                          }
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 border">{item.unitPrice}0.000 đ</td>
                    <td className="px-6 py-4 border">
                      <button
                        className="bg-red-500 px-2 text-white py-2 rounded-full"
                        onClick={() => handleRemoveItem(item.productId)}
                      >
                        <MdOutlineDelete size={25} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="p-2 text-center text-gray-600">Giỏ hàng trống</p>
          )}
        </div>

        <div className="flex justify-between  mt-2">
          <div className="mt-4 ">
            <Link
              to="/"
              className="py-2 px-4 border rounded-md shadow-lg font-medium hover:bg-blue-600 hover:text-white duration-300"
            >
              Tiếp tục mua hàng
            </Link>
          </div>

          <div className="flex flex-col mt-1">
            <span className="py-2 w-[220px] pl-2 mr-20 border rounded-md shadow-lg font-medium ">
              Tổng tiền: 42.570.000 ₫
            </span>

            <button
              className="w-[150px] bg-blue-600 text-white font-medium h-[50px] my-3 flex items-center justify-center rounded-xl cursor-pointer mt-5"
              onClick={createOrder}
            >
              Đặt hàng
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CartProduct;

import React from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { Link } from "react-router-dom";
import { FaMicrophone, FaShoppingBag } from "react-icons/fa";
import { navItems } from "../../static/data";
import { jwtDecode } from "jwt-decode";
const Header = () => {
  const token = localStorage.getItem('jwt'); // Get JWT token from localStorage
  let userId = null;
  let userName = null;

  if (token) {
      try {
          const decodedToken = jwtDecode(token);
          userId = decodedToken.id; // Get userId from token
          userName = decodedToken.name; // Assuming the token contains a 'name' field
      } catch (err) {
          console.error('Invalid token', err);
      }
  }
  return (
    <div className="min-h-100vh mt-2">
      <div className="w-11/12 flex items-center justify-end">
        <div className="w-[50%] relative float-right  flex items-center">
          <input
            type="text"
            placeholder="         Tìm sản phẩm hoặc thương hiệu ..."
            className="h-[40px] w-full px-2 border-[2px] rounded-md border-[#3957db]"
          />
          <AiOutlineSearch size={25} className="absolute top-1.5 ml-2" />
          <FaMicrophone
            sizse={30}
            className="absolute top-1.5 right-2 mt-1.5"
          />
        </div>
        <div className="relative p-3 ">
        <Link to="/cart"><FaShoppingBag size={25} className="ml-3" /></Link>
        <span className="absolute bg-red-700 rounded-full h-5 w-5 flex items-center justify-center text-white font-medium right-2 top-[30px]">2</span>
        </div>
        
        
      </div>

      <div className="flex py-4 justify-center items-center mx-auto mt-1 bg-[#3321c8]">
     
          <div>
            <Link to="/">
              <img
                src="https://shopo.quomodothemes.website/assets/images/logo.svg"
                alt=""
              />
            </Link>
          </div>
        {navItems &&
          navItems.map((i, index) => (
            <div className="flex px-6">
              <Link
                to={i.url}
                className="text-[#fff] font-[500] px-6 cursor-pointer text-lg"
              >
                {i.title}
              </Link>
            </div>
          ))}
          <div className="flex px-6">
              <Link
               to={`/user/${userId}/order`}
                className="text-[#fff] font-[500] px-6 cursor-pointer text-lg"
              >
               XEM ORDER
              </Link>
            </div>
          <Link to="/login" className="w-[150px] bg-[#FFBB38] h-[50px]  flex items-center justify-center rounded-xl cursor-pointer font-medium text-black text-lg">Đăng Nhập</Link>
      </div>
    </div>
  );
};

export default Header;

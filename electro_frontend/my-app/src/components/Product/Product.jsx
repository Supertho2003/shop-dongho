import React, { useEffect, useState } from "react";
import { brandingData, productData } from "../../static/data";
import { Link } from "react-router-dom";
import  axios  from 'axios';
import  debounce  from 'lodash.debounce';

const Product = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:9191/api/v1/categories/all"
        );
        setCategories(response.data.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    setError(null);
    try {
      let response;
      if (searchTerm.trim()) {
        // Tìm kiếm sản phẩm theo tên
        response = await axios.get(
          `http://localhost:9191/api/v1/products/products/search?name=${searchTerm}`
        );
        setProducts(response.data.data || []);
      } else if (selectedCategory) {
        // Lấy sản phẩm theo danh mục
        response = await axios.get(
          `http://localhost:9191/api/v1/products/product/${selectedCategory}/all/products`
        );
        setProducts(response.data.data || []);
      } else {
        // Lấy tất cả sản phẩm
        response = await axios.get("http://localhost:9191/api/v1/products/all");
        setProducts(response.data.data || []);
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError("No products found for the given search term."); // Thông báo tùy chỉnh cho 404
        setProducts([]);
      } else {
        setError(err.message);
      }
    }
  }

 

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    const debouncedFetch = debounce(fetchProducts, 300);
    debouncedFetch();
    return () => {
      debouncedFetch.cancel();
    };
  }, [selectedCategory, searchTerm]);

  return (
    <div className="w-11/12 mx-auto mt-5">
      <div
        className={`branding my-12 flex justify-between w-full shadow-sm bg-white p-5 rounded-md`}
      >
        {brandingData &&
          brandingData.map((i, index) => (
            <div className="flex items-start" key={index}>
              {i.icon}
              <div className="px-3">
                <h3 className="font-bold text-sm md:text-base">{i.title}</h3>
                <p className="text-xs md:text-sm">{i.Description}</p>
              </div>
            </div>
          ))}
      </div>
      <h2 className="text-2xl font-medium mb-4">ĐỒNG HỒ BÁN CHẠY</h2>
      <div className="mb-6 mr-[120px]">
          <label className="block mb-2 text-sm font-bold">
            Chọn danh mục :
          </label>
          <select
            className="p-2 border rounded"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12">
        {/* {productData &&
          productData.map((i, index) => (
            <div className="border shadow-lg flex flex-col items-center rounded-md p-3 hover:scale-110 duration-300 cursor-pointer">
              <div>
                <img
                  alt=""
                  src={i.image_Url[0]?.url}
                  width={250}
                  height={100}
                />
              </div>
              <div className="mt-2">
                <Link to="/details" className="text-sm font-[600] mb-4 block">
                  {i.name}
                </Link>
                <span className="text-gray-600">{i.price} ₫</span>
              </div>
            </div>
          ))} */}
          {products.length > 0 ? (
          products.map((product) => (
            <Link key={product.id} to={`/product/${product.id}`}>
              <div className="border shadow-lg flex flex-col rounded-md p-3 hover:scale-110 duration-300 cursor-pointer h-full min-h-[300px]">
                <div className="flex justify-center mb-3">
                  {Array.isArray(product.images) && product.images.length > 0 ? (
                    // eslint-disable-next-line jsx-a11y/img-redundant-alt
                    <img
                      src={product.images[0].downloadUrl}
                      alt={`Image for ${product.name}`}
                      className="w-50 h-50 pb-4 object-cover rounded-md shadow-md"
                    />
                  ) : (
                    <p>No images available</p>
                  )}
                </div>
                <h2 className="text-xl font-[600] mb-2 block ">
                  {product.name}
                </h2>
                <p className="text-lg font-bold mb-2 text-gray-600">
                  Giá: {product.price}0.000 đ
                </p>
                <p className="text-gray-600 mb-4 flex-grow">
                  {product.description}
                </p>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-4 text-center">No products available</div>
        )}
      </div>
    </div>
  );
};

export default Product;

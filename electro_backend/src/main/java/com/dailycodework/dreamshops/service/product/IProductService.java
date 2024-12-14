package com.dailycodework.dreamshops.service.product;
import com.dailycodework.dreamshops.dto.ProductDto;
import com.dailycodework.dreamshops.model.Product;
import com.dailycodework.dreamshops.request.AddProductRequest;
import com.dailycodework.dreamshops.request.ProductUpdateRequest;
import org.springframework.web.multipart.MultipartFile;


import java.util.List;

public interface IProductService {

    Product addProduct(AddProductRequest request, List<MultipartFile> files);
    Product getProductById(Long id);
    void deleteProductById(Long id);

    Product updateProduct(ProductUpdateRequest request, Long productId, List<MultipartFile> newFiles);

    List<Product> getAllProducts();
    List<Product> getProductsByCategory(String category);
    List<Product> getProductsByBrand(String brand);
    List<Product> getProductsByCategoryAndBrand(String category, String brand);
    List<Product> getProductsByName(String name);
    List<Product> getProductsByBrandAndName(String category, String name);
    Long countProductsByBrandAndName(String brand, String name);

    List<ProductDto> getConvertedProducts(List<Product> products);

    ProductDto convertToDto(Product product);
}

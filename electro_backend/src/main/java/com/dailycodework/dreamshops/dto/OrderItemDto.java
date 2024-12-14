package com.dailycodework.dreamshops.dto;

import com.dailycodework.dreamshops.model.Category;
import com.dailycodework.dreamshops.model.Product;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class OrderItemDto {
//    private Long productId;
//  private String productName;
   private String productBrand;
   private int quantity;
//    private BigDecimal price;
    private ProductDto product;
}

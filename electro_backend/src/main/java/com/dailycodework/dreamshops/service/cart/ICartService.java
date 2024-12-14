package com.dailycodework.dreamshops.service.cart;

import com.dailycodework.dreamshops.dto.CartDto;
import com.dailycodework.dreamshops.model.Cart;
import com.dailycodework.dreamshops.model.User;

import java.math.BigDecimal;
import java.util.List;

public interface ICartService {
    Cart getCart(Long id);
    void clearCart(Long id);
    BigDecimal getTotalPrice(Long id);

    Cart initializeNewCart(User user);

    Cart getCartByUserId(Long userId);

    CartDto convertToDto(Cart cart);

    List<CartDto> convertToDtos(List<Cart> carts);
}

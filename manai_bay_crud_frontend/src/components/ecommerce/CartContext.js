import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingProductIndex = state.findIndex(item => item.id === action.product.id);
      if (existingProductIndex > -1) {
        const newState = [...state];
        newState[existingProductIndex].quantity += action.quantity || 1;
        return newState;
      }
      return [...state, { ...action.product, quantity: action.quantity || 1 }];
    }
    case 'REMOVE_FROM_CART':
      return state.filter(item => item.id !== action.productId);
    case 'UPDATE_QUANTITY':
      return state.map(item =>
        item.id === action.productId ? { ...item, quantity: action.quantity } : item
      );
    case 'CLEAR_CART':
      return [];
    case 'SET_CART':
      return action.cart;
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const initialState = JSON.parse(localStorage.getItem('cart')) || [];
  const [cart, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  return (
    <CartContext.Provider value={{ cart, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

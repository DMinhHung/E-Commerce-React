import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type CartState = {
  productsInCart: ProductInCart[];
  subtotal: number;
};

const loadCartFromLocalStorage = (): CartState | undefined => {
  try {
    const data = localStorage.getItem("cart");
    if (!data) return undefined;
    return JSON.parse(data);
  } catch {
    return undefined;
  }
};

const saveCartToLocalStorage = (state: CartState) => {
  try {
    localStorage.setItem("cart", JSON.stringify(state));
  } catch {}
};

// ✅ load từ localStorage nếu có
const initialState: CartState =
  loadCartFromLocalStorage() || {
    productsInCart: [],
    subtotal: 0,
  };

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addProductToTheCart: (state, action: PayloadAction<ProductInCart>) => {
      const product = state.productsInCart.find(
        (p) => p.id === action.payload.id
      );
      if (product) {
        product.quantity += action.payload.quantity;
      } else {
        state.productsInCart.push(action.payload);
      }
      cartSlice.caseReducers.calculateTotalPrice(state);
      saveCartToLocalStorage(state); // ✅ lưu mỗi lần thay đổi
    },
    removeProductFromTheCart: (state, action: PayloadAction<{ id: string }>) => {
      state.productsInCart = state.productsInCart.filter(
        (p) => p.id !== action.payload.id
      );
      cartSlice.caseReducers.calculateTotalPrice(state);
      saveCartToLocalStorage(state);
    },
    updateProductQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      const product = state.productsInCart.find(
        (p) => p.id === action.payload.id
      );
      if (product) product.quantity = action.payload.quantity;

      cartSlice.caseReducers.calculateTotalPrice(state);
      saveCartToLocalStorage(state);
    },
    calculateTotalPrice: (state) => {
      state.subtotal = state.productsInCart.reduce(
        (acc, product) => acc + product.price * product.quantity,
        0
      );
    },
  },
});

export const {
  addProductToTheCart,
  removeProductFromTheCart,
  updateProductQuantity,
  calculateTotalPrice,
} = cartSlice.actions;

export default cartSlice.reducer;

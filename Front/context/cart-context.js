import { useState, useEffect, createContext } from "react";

export const CartContext = createContext({
  cart: [],
  totalPrice: 0,
  order: {},
  getQuantity: (item) => {},
  addToCart: (cartItem) => {},
  removeFromCart: () => {},
  clearCart: () => {},
  continue: () => {},
});

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [order, setOrder] = useState({});

  const clearCartHandler = () => {
    setCart([]);
    setTotalPrice(0);
    setOrder({});
    localStorage.removeItem("cart");
  };

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart"));
    if (storedCart && storedCart.items) {
      setCart(storedCart.items);
      updatePrice(storedCart.items, true);
      continueHandler();
    }
  }, []);

  const continueHandler = () => {
    const cartArray = JSON.parse(localStorage.getItem("cart"));
    const cartGrouped = cartArray.items.reduce((accum, curr) => {
      if (!accum[curr["restaurant"]]) {
        accum[curr["restaurant"]] = [];
      }
      accum[curr["restaurant"]].push(curr);
      return accum;
    }, {});
    setOrder(cartGrouped);
  };

  const updatePrice = (cart, isAdding) => {
    const arrayPrices = cart.map((item) => item.itemUnityPrice * item.itemQty);
    const total = arrayPrices.reduce((accum, curr) => {
      if (isAdding) {
        return accum + curr;
      } else {
        return accum - curr;
      }
    }, 0);

    setTotalPrice(total.toFixed(2));
  };

  const getQuantity = (item) => {
    const cartArray = [...cart];
    const index = cartArray.findIndex((el) => el.itemName === item);
    const qty = cartArray[index] && cartArray[index].itemQty;
    return qty ? qty : 0;
  };

  const addToCartHandler = (cartItem, restaurantId, logo) => {
    const cartArray = [...cart];
    const item = cartArray.find((el) => el.itemName === cartItem.name);
    const index = cartArray.findIndex((el) => el.itemName === cartItem.name);

    if (item) {
      cartArray[index].itemQty += 1;
    } else {
      cartArray.push({
        itemImage: cartItem.image,
        itemName: cartItem.name,
        itemUnityPrice: cartItem.price,
        restaurant: cartItem.restaurant,
        itemQty: 1,
        restaurantId: restaurantId,
        logo: logo,
      });
    }

    updatePrice(cartArray, true);
    setCart(cartArray);
    localStorage.setItem("cart", JSON.stringify({ items: cartArray }));
  };

  const removeFromCartHandler = (cartItem) => {
    const cartArray = [...cart];
    const item = cartArray.find((el) => el.itemName === cartItem.name);
    const index = cartArray.findIndex((el) => el.itemName === cartItem.name);
    const qty = cartArray[index].itemQty;

    if (item && qty > 1) {
      cartArray[index].itemQty -= 1;
    } else {
      cartArray.splice(index, 1);
    }

    updatePrice(cartArray, true);
    setCart(cartArray);
    localStorage.setItem("cart", JSON.stringify({ items: cartArray }));
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        totalPrice,
        order,
        getQuantity,
        addToCart: addToCartHandler,
        removeFromCart: removeFromCartHandler,
        clearCart: clearCartHandler,
        continue: continueHandler,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;

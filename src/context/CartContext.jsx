import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useState,
} from "react";
import toast from "react-hot-toast";
import PropTypes from "prop-types";
import { useUser } from "@clerk/clerk-react";

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART": {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );
      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload }],
      };
    }
    case "REMOVE_FROM_CART":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };

    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };

    case "CLEAR_CART":
      return {
        ...state,
        items: [],
      };

    case "INITIALIZE_CART":
      return {
        ...state,
        items: action.payload || [],
      };

    case "SYNC_CART":
      return {
        ...state,
        items: action.payload || [],
        lastSynced: new Date().toISOString(),
      };

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const { isSignedIn, user } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    lastSynced: null,
  });

  // Load initial cart data
  useEffect(() => {
    const initializeCart = async () => {
      if (isSignedIn && user) {
        try {
          const cartData = user.publicMetadata.cartData;
          if (cartData) {
            dispatch({
              type: "INITIALIZE_CART",
              payload: JSON.parse(cartData),
            });
          }
        } catch (error) {
          console.error("Error loading cart data:", error);
          toast.error("Failed to load cart data");
        }
      }
      setIsLoading(false);
    };

    initializeCart();
  }, [isSignedIn, user]);

  // Save cart data with debouncing
  useEffect(() => {
    let timeoutId;

    const saveCartData = async () => {
      if (isSignedIn && user) {
        try {
          const currentMetadata = { ...user.publicMetadata };
          const updatedMetadata = {
            ...currentMetadata,
            cartData: JSON.stringify(state.items),
            lastUpdated: new Date().toISOString(),
          };

          await user.update({
            publicMetadata: updatedMetadata,
          });
        } catch (error) {
          console.error("Error saving cart data:", error);
          toast.error("Failed to save cart changes");
        }
      }
    };

    // Clear any existing timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Set new timeout to save cart after 1 second of no changes
    if (state.items.length > 0 || state.items.length === 0) {
      timeoutId = setTimeout(saveCartData, 1000);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [state.items, isSignedIn, user]);

  // Sync cart data periodically
  useEffect(() => {
    let intervalId;

    const syncCart = async () => {
      if (isSignedIn && user) {
        try {
          // Reload user to get fresh metadata
          await user.reload();
          const cartData = user.publicMetadata.cartData;
          const serverLastUpdated = user.publicMetadata.lastUpdated;

          if (cartData) {
            const serverCart = JSON.parse(cartData);
            // Only update if server data is newer
            if (
              !state.lastSynced ||
              new Date(serverLastUpdated) > new Date(state.lastSynced)
            ) {
              dispatch({
                type: "SYNC_CART",
                payload: serverCart,
              });
            }
          }
        } catch (error) {
          console.error("Error syncing cart:", error);
        }
      }
    };

    // Sync every 30 seconds
    if (isSignedIn) {
      intervalId = setInterval(syncCart, 30000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isSignedIn, user]);

  const addToCart = (product) => {
    dispatch({ type: "ADD_TO_CART", payload: product });
    toast.success(`${product.title} added to cart`);
  };

  const removeFromCart = (productId) => {
    const item = state.items.find((item) => item.id === productId);
    if (item) {
      dispatch({ type: "REMOVE_FROM_CART", payload: productId });
      toast.error(`${item.title} removed from cart`);
    }
  };

  const updateQuantity = (productId, quantity) => {
    const item = state.items.find((item) => item.id === productId);
    if (item) {
      dispatch({
        type: "UPDATE_QUANTITY",
        payload: { id: productId, quantity },
      });
      toast.success(`Updated ${item.title} quantity to ${quantity}`);
    }
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
    toast.success("Cart cleared");
  };

  const getCartTotal = () => {
    return state.items.reduce((total, item) => {
      const price = item.price - (item.price * item.discountPercentage) / 100;
      return total + price * item.quantity;
    }, 0);
  };

  const getCartCount = () => {
    return state.items.reduce((count, item) => count + item.quantity, 0);
  };

  if (isLoading) {
    return <div>Loading cart...</div>;
  }

  return (
    <CartContext.Provider
      value={{
        cart: state.items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export { CartContext };

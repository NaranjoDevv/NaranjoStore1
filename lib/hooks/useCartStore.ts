import { create } from "zustand";
import { round2 } from "../round2";
import { OrderItem } from "../models/OrderModel";
import { persist } from "zustand/middleware";

type Cart = {
  items: OrderItem[];
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
};

const initialState: Cart = {
  items: [],
  itemsPrice: 0,
  taxPrice: 0,
  shippingPrice: 0,
  totalPrice: 0,
};

// Nuevo store para notificaciones
type NotificationStore = {
  message: string;
  isVisible: boolean;
  showNotification: (message: string) => void;
  hideNotification: () => void;
};

export const notificationStore = create<NotificationStore>((set) => ({
  message: "",
  isVisible: false,
  showNotification: (message: string) => {
    set({ message, isVisible: true });
    // Auto-hide after 2 seconds instead of 3
    setTimeout(() => {
      set({ isVisible: false });
    }, 2000);
  },
  hideNotification: () => set({ isVisible: false }),
}));

export const cartStore = create<Cart>()(
  persist(() => initialState, {
    name: "cart-storage",
  })
);

const CalcPrice = (items: OrderItem[]) => {
  const itemsPrice = round2(
    items.reduce((acc, item) => acc + item.price * item.qty, 0)
  );
  const taxPrice = round2(itemsPrice * 0.19);
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const totalPrice = round2(itemsPrice + taxPrice + shippingPrice);
  return { itemsPrice, taxPrice, shippingPrice, totalPrice };
};

export default function useCartService() {
  const { items, itemsPrice, taxPrice, shippingPrice, totalPrice } =
    cartStore();

  const { showNotification } = notificationStore();

  return {
    items,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    increase: (item: OrderItem) => {
      const exist = items.find((x) => x.slug === item.slug);
      const updatedCartItems = exist
        ? items.map((x) =>
            x.slug === exist.slug ? { ...exist, qty: exist.qty + 1 } : x
          )
        : [...items, { ...item, qty: 1 }];

      const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
        CalcPrice(updatedCartItems);

      cartStore.setState({
        items: updatedCartItems,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      });

      // Mostrar notificación solo cuando se añade por primera vez
      if (!exist) {
        showNotification(`${item.name} - ADDED TO CART`);
      }
    },
    decrease: (item: OrderItem) => {
      const exist = items.find((x) => x.slug === item.slug);
      if (!exist) return;

      const updatedCartItems =
        exist.qty === 1
          ? items.filter((x) => x.slug !== item.slug)
          : items.map((x) =>
              x.slug === exist.slug ? { ...exist, qty: exist.qty - 1 } : x
            );

      const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
        CalcPrice(updatedCartItems);

      cartStore.setState({
        items: updatedCartItems,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      });
    },
  };
}

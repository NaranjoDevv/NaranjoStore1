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

  // Función para generar un ID único para cada variante
  const generateVariantId = (item: OrderItem): string => {
    return `${item.slug}-${item.color || "default"}-${item.size || "onesize"}`;
  };

  return {
    items,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    findCartItem: (slug: string, color?: string, size?: string) => {
      const variantId = generateVariantId({
        slug,
        color: color || undefined,
        size: size || undefined,
      } as OrderItem);
      
      return items.find((x) => x.variantId === variantId);
    },
    increase: (item: OrderItem) => {
      // Asegurarse de que el item tenga un variantId
      const itemWithVariantId = {
        ...item,
        variantId: item.variantId || generateVariantId(item),
      };
      
      // Buscar por variantId en lugar de solo por slug
      const exist = items.find(
        (x) => x.variantId === itemWithVariantId.variantId
      );
      
      // Limitar la cantidad máxima a 10 unidades
      if (exist && exist.qty >= 10) {
        showNotification("Maximum quantity reached (10)");
        return;
      }

      const updatedCartItems = exist
        ? items.map((x) =>
            x.variantId === exist.variantId
              ? { ...exist, qty: exist.qty + 1 }
              : x
          )
        : [...items, { ...itemWithVariantId, qty: 1 }];

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
        const colorInfo = item.color ? ` - ${item.color}` : '';
        const sizeInfo = item.size ? ` - ${item.size}` : '';
        showNotification(`${item.name}${colorInfo}${sizeInfo} - ADDED TO CART`);
      }
    },
    decrease: (item: OrderItem) => {
      // Asegurarse de que el item tenga un variantId
      const itemWithVariantId = {
        ...item,
        variantId: item.variantId || generateVariantId(item),
      };
      
      // Buscar por variantId en lugar de solo por slug
      const exist = items.find(
        (x) => x.variantId === itemWithVariantId.variantId
      );
      
      if (!exist) return;

      const updatedCartItems =
        exist.qty === 1
          ? items.filter((x) => x.variantId !== itemWithVariantId.variantId)
          : items.map((x) =>
              x.variantId === exist.variantId ? { ...exist, qty: exist.qty - 1 } : x
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
    removeItem: (item: OrderItem) => {
      // Asegurarse de que el item tenga un variantId
      const itemWithVariantId = {
        ...item,
        variantId: item.variantId || generateVariantId(item),
      };
      
      const updatedCartItems = items.filter(
        (x) => x.variantId !== itemWithVariantId.variantId
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

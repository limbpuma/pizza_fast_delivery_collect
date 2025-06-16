interface Item {
  pizzaId: number;
  name: string;
  quantity: number;
  totalPrice: number;
}

export interface InitialStateTypes {
  cart: {
    pizzaId: number;
    totalPrice: number;
    unitPrice: number;
    name: string;
    quantity: number;
    items: Item[];
  }[];
}

export interface ButtonProps {
  children: React.ReactNode;
  disabled?: boolean;
  to?: string;
  type: "primary" | "secondary" | "small" | "round";
  onClick?: (e: any) => void;
}

export interface LinkButtonProps {
  children: React.ReactNode;
  to: string;
}

export interface CartItemProps {
  item: Item;
}

interface Pizza {
  id: number;
  name: string;
  unitPrice: number;
  ingredients: string[];
  soldOut: boolean;
  imageUrl: string;
}

export interface MenuItemProps {
  pizza: Pizza;
}

export interface OrderItemProps {
  item: {
    quantity: number;
    name: string;
    totalPrice: number;
  };
  isLoadingIngredients: boolean;
  ingredients: string[];
}

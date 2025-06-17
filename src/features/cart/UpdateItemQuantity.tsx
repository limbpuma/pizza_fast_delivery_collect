import { useDispatch } from "react-redux";
import Button from "../../ui/Button";
import { decreaseSpecificItem, increaseSpecificItem } from "./cartSlice";

interface UpdateItemQuantityProps {
  pizzaId: number;
  size?: string;
  currentQuantity: number;
  compact?: boolean;
}

function UpdateItemQuantity({
  pizzaId,
  size,
  currentQuantity,
  compact = false,
}: UpdateItemQuantityProps) {
  const dispatch = useDispatch();
  
  const handleDecrease = () => {
    dispatch(decreaseSpecificItem({ pizzaId, size }));
  };
  
  const handleIncrease = () => {
    dispatch(increaseSpecificItem({ pizzaId, size }));
  };

  if (compact) {
    return (
      <div className="flex items-center gap-1">
        <button
          onClick={handleDecrease}
          className="w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-gray-700 text-sm transition-colors"
        >
          -
        </button>
        <span className="text-sm font-medium min-w-[1.5rem] text-center">{currentQuantity}</span>
        <button
          onClick={handleIncrease}
          className="w-6 h-6 bg-orange-500 hover:bg-orange-600 text-white rounded-full flex items-center justify-center text-sm transition-colors"
        >
          +
        </button>
      </div>
    );
  }
  
  return (
    <div className=" flex items-center gap-1 md:gap-3">
      <Button
        type="round"
        onClick={handleDecrease}
      >
        -
      </Button>
      <span className="text-sm font-medium">{currentQuantity}</span>
      <Button
        type="round"
        onClick={handleIncrease}
      >
        +
      </Button>
    </div>
  );
}

export default UpdateItemQuantity;

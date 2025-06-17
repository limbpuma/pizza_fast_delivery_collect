import { useDispatch } from "react-redux";
import Button from "../../ui/Button";
import { decreaseSpecificItem, increaseSpecificItem } from "./cartSlice";

function UpdateItemQuantity({
  pizzaId,
  size,
  currentQuantity,
}: {
  pizzaId: number;
  size?: string;
  currentQuantity: number;
}) {
  const dispatch = useDispatch();
  
  const handleDecrease = () => {
    dispatch(decreaseSpecificItem({ pizzaId, size }));
  };
  
  const handleIncrease = () => {
    dispatch(increaseSpecificItem({ pizzaId, size }));
  };
  
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

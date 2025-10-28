import type { CardProps } from "./card.types";
import CardHeader from "./CardHeader";
import CardContent from "./CardContent";

const Card = ({
  selected,
  qty,
  handleSelectCart,
  handleCount,
  item,
}: CardProps) => {
  return (
    <div className="flex flex-col gap-[3rem]">
      <CardHeader
        item={item}
        selected={selected}
        qty={qty}
        handleSelectCart={handleSelectCart}
        handleCount={handleCount}
      />
      <CardContent item={item} />
    </div>
  );
};
export default Card;

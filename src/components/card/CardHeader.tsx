import iconCart from "@/assets/images/icon-add-to-cart.svg";
import iconDecrement from "@/assets/images/icon-decrement-quantity.svg";
import iconIncrement from "@/assets/images/icon-increment-quantity.svg";
import type { CardProps } from "./card.types";
const CardHeader = ({
  selected,
  qty,
  handleCount,
  handleSelectCart,
  item,
}: CardProps) => {
  return (
    <div className="relative flex flex-col items-center">
      <picture>
        <source
          srcSet={item.image.mobile}
          type="image/jpeg"
          media="(max-width: 37.5rem)"
        />
        <source
          srcSet={item.image.tablet}
          type="image/jpeg"
          media="(max-width: 102.4rem)"
        />
        <source
          srcSet={item.image.desktop}
          type="image/jpeg"
          media="(min-width: 102.5rem)"
        />

        <img
          src={item.image.desktop}
          alt={item.name ?? ""}
          className={selected ? "border-2 border-Red rounded-lg" : ""}
        />
      </picture>

      <div className="absolute bottom-[-1.5rem] flex items-center justify-center rounded-full gap-[0.5rem] w-[10rem] h-[3rem] border-1 border-gray-400 overflow-hidden">
        {selected ? (
          <div
            className="flex justify-between bg-Red w-full h-full items-center px-[1rem]"
            role="group"
            aria-label="Quantity"
          >
            <button
              type="button"
              onClick={() => handleCount("decrement")}
              className="flex border-1 border-white rounded-full w-[1rem] h-[1rem] items-center justify-center"
            >
              <img src={iconDecrement} alt="Decrease" />
            </button>

            <p className="text-white" aria-live="polite">
              {qty}
            </p>

            <button
              type="button"
              onClick={() => handleCount("increment")}
              className="flex border-1 border-white rounded-full w-[1rem] h-[1rem] items-center justify-center"
            >
              <img src={iconIncrement} alt="Increase" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleSelectCart}
            className="flex items-center justify-center gap-[0.5rem] bg-white w-full h-full"
          >
            <img src={iconCart} alt="" />
            <p>Add to Cart</p>
          </button>
        )}
      </div>
    </div>
  );
};

export default CardHeader;

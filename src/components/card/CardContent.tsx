import type { Data } from "@/types/data";

const CardContent = ({ item }: { item: Data }) => {
  console.log(item.name);
  return (
    <div className="relative">
      <p className="text-Rose-500 font-normal text-[0.8rem]">{item.category}</p>
      <p className="text-[1rem] font-semibold">{item.name}</p>
      <p className="text-[1rem] text-Rose-500 font-semibold">
        ${item.price.toFixed(2)}
      </p>
    </div>
  );
};
export default CardContent;

import type { Data } from "@/types/data";

const CardContent = ({ item }: { item: Data }) => {
  console.log(item.name);
  return (
    <div className="relative">
      <p>{item.category}</p>
      <p>{item.name}</p>
      <p>{item.price}</p>
    </div>
  );
};
export default CardContent;

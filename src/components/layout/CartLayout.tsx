import type { ReactNode } from "react";

const CartLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="px-[1.5rem] lg:px-[7rem] py-[1.5rem] lg:py-[4rem] bg-white lg:bg-Rose-50">
      {children}
    </div>
  );
};

export default CartLayout;

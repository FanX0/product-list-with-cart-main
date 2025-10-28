import CartLayout from "@/components/layout/CartLayout";
import { useEffect, useState } from "react";
import type { Data } from "@/types/data";
import Card from "./components/card/Card";
import iconRemove from "@/assets/images/icon-remove-item.svg";
import iconCarbon from "@/assets/images/icon-carbon-neutral.svg";
import iconConfirmed from "@/assets/images/icon-order-confirmed.svg";

function Cart() {
  const [data, setData] = useState<Data[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMap, setSelectedMap] = useState<Record<string, boolean>>({});
  const [qtyMap, setQtyMap] = useState<Record<string, number>>({});
  const [dialog, setDialog] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("data/data.json");
        const data = await res.json();
        setData(data);
        setLoading(false);
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        setError(msg);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  useEffect(() => {
    try {
      const savedQty = localStorage.getItem("cart:qty");
      if (savedQty) {
        const parsed: Record<string, number> = JSON.parse(savedQty);
        setQtyMap(parsed);
        const derivedSelected: Record<string, boolean> = Object.keys(
          parsed
        ).reduce((acc, key) => {
          acc[key] = (parsed[key] ?? 0) > 0;
          return acc;
        }, {} as Record<string, boolean>);
        setSelectedMap(derivedSelected);
      }
    } catch (e) {
      console.error((e as Error).message);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem("cart:qty", JSON.stringify(qtyMap));
      localStorage.setItem("cart:selected", JSON.stringify(selectedMap));
    } catch (e) {
      console.error((e as Error).message);
    }
  }, [qtyMap, selectedMap, hydrated]);

  const handleSelectCart = (name: string) => {
    setSelectedMap((prevSel) => {
      const nextSelected = !prevSel[name];
      setQtyMap((prevQty) => {
        const current = prevQty[name] ?? 0;
        if (!nextSelected) {
          return { ...prevQty, [name]: 0 };
        }
        const next = current === 0 ? 1 : current;
        return { ...prevQty, [name]: next };
      });
      return { ...prevSel, [name]: nextSelected };
    });
  };

  const handleCount = (name: string, type: "increment" | "decrement") => {
    setQtyMap((prev) => {
      const current = prev[name] ?? 0;
      if (type === "increment") {
        return { ...prev, [name]: current + 1 };
      }
      const next = Math.max(0, current - 1);
      const updated = { ...prev, [name]: next };
      if (next <= 0) {
        setSelectedMap((sPrev) => ({ ...sPrev, [name]: false }));
      }
      return updated;
    });
  };

  const cartItems = data.filter((item) => (qtyMap[item.name] ?? 0) > 0);
  const cartCount = cartItems.reduce(
    (sum, item) => sum + (qtyMap[item.name] ?? 0),
    0
  );
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price * (qtyMap[item.name] ?? 0),
    0
  );

  const handleRemove = (name: string) => {
    setQtyMap((prev) => ({ ...prev, [name]: 0 }));
    setSelectedMap((prev) => ({ ...prev, [name]: false }));
  };

  const handleConfirmOrder = () => {
    setDialog(true);
  };

  const handleCloseDialog = () => {
    setDialog(false);
    setQtyMap({});
    setSelectedMap({});
    try {
      localStorage.removeItem("cart:qty");
      localStorage.removeItem("cart:selected");
    } catch (e) {
      console.error((e as Error).message);
    }
  };

  return (
    <CartLayout>
      <div className="flex flex-col lg:flex-row lg:gap-[1rem]">
        <div className="flex flex-col gap-[2rem] lg:w-[65%]">
          <h1 className="text-[2.5rem] font-bold">Desserts</h1>
          {loading && <p>Loading...</p>}
          {error && <p style={{ color: "red" }}>Error: {error}</p>}
          <ul className="grid grid-cols-1 gap-[1.5rem] lg:grid-cols-3">
            {data.map((item) => (
              <li key={item.name}>
                <Card
                  item={item}
                  selected={!!selectedMap[item.name]}
                  qty={qtyMap[item.name] ?? 0}
                  handleSelectCart={() => handleSelectCart(item.name)}
                  handleCount={(type) => handleCount(item.name, type)}
                />
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:w-[25%]">
          <div className="flex flex-col gap-[1rem] p-[1rem] bg-white rounded-[0.5rem]">
            <h2 className="text-[1.25rem] font-bold text-Red">
              Your Cart ({cartCount})
            </h2>
            {cartItems.length === 0 ? (
              <p className="text-Rose-500">Your cart is empty.</p>
            ) : (
              <div className="flex flex-col gap-[0.75rem]">
                <ul className="flex flex-col gap-[0.5rem]">
                  {cartItems.map((item) => {
                    const qty = qtyMap[item.name] ?? 0;
                    const lineTotal = item.price * qty;
                    return (
                      <li
                        key={item.name}
                        className="flex justify-between items-center pb-4 lg:border-b-1 border-Rose-100"
                      >
                        <div>
                          <span className="font-semibold text-[0.7rem]">
                            {item.name}
                          </span>
                          <div className="flex items-center gap-[1rem]">
                            <span className="text-Rose-500 font-semibold">
                              {qty}x
                            </span>
                            <div className="flex items-center gap-[0.5rem]">
                              <p className="text-Rose-300">
                                @ {item.price.toFixed(2)}
                              </p>
                              <p className="text-Rose-500 font-semibold">
                                ${lineTotal.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemove(item.name)}
                          className="w-[1rem] h-[1rem] flex items-center justify-center rounded-full border-1 border-Rose-400"
                        >
                          <img src={iconRemove} alt="" />
                        </button>
                      </li>
                    );
                  })}
                </ul>

                <div className="flex justify-between ">
                  <span className=" font-normal text-Rose-500">
                    Order Total
                  </span>
                  <span className="text-[1.5rem] font-semibold">
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-center items-center gap-[0.5rem]">
                  <img src={iconCarbon} alt="carbon-neutral" />
                  <div className="text-Rose-500 flex gap-1">
                    <p>This is a</p>
                    <span className="font-semibold text-black">
                      carbon-neutral
                    </span>
                    <p> delivery</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleConfirmOrder}
                  className="mt-[0.5rem] border-1 border-Rose-300 rounded-[0.25rem] p-[0.5rem] bg-Red rounded-full text-white font-semibold"
                >
                  Confirm Order
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {dialog && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setDialog(false)}
        >
          <div
            className="flex flex-col gap-[1rem] bg-white p-[2rem] rounded-[0.5rem] max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <img src={iconConfirmed} alt="order confirmed" />
            </div>
            <div>
              <h3 className="text-[1.8rem] font-bold ">Order Confirmed</h3>
              <p className="text-[0.8rem] text-Rose-500">
                We hope you enjoy your food
              </p>
            </div>

            <ul className="flex flex-col gap-[1rem]">
              {cartItems.map((item) => (
                <li
                  key={item.name}
                  className="flex justify-between items-center mx-[1rem]"
                >
                  <div className="flex items-center gap-[0.5rem]">
                    <img
                      src={item.image.thumbnail}
                      className="w-[2rem] h-[2rem]"
                      alt=""
                    />
                    <div>
                      <p className="font-semibold text-[0.8rem]">{item.name}</p>
                      <div className="flex items-center gap-[0.5rem]">
                        <p className="text-Rose-500 font-semibold">
                          x{qtyMap[item.name]}
                        </p>
                        <p className="text-Rose-300">
                          @ ${item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="text-Rose-500 font-semibold">
                    ${(item.price * (qtyMap[item.name] ?? 0)).toFixed(2)}
                  </p>
                </li>
              ))}
            </ul>
            <div className="flex justify-between items-center">
              <p className="text-[0.9rem] font-normal">Order Total </p>
              <p className="text-[1.5rem] font-semibold">
                ${cartTotal.toFixed(2)}
              </p>
            </div>
            <button
              onClick={handleCloseDialog}
              className="w-full bg-Red text-white p-[0.75rem] rounded-[0.25rem] hover:bg-opacity-90 rounded-full"
            >
              Start New Order
            </button>
          </div>
        </div>
      )}
    </CartLayout>
  );
}

export default Cart;

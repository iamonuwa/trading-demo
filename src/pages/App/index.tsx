import React from "react";
import OrderBook from "react-trading-ui";

interface IOrderbook {
  asks: number[][] | undefined;
  bids: number[][] | undefined;
}
const App = (props: IOrderbook) => {
  return (
    <div className="">
      <OrderBook asks={props.asks} bids={props.bids} />
    </div>
  );
};

export default App;

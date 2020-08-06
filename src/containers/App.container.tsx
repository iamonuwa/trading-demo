import React, { useState } from "react";
import * as ccxt from "ccxt";
import { bindActionCreators, Dispatch, AnyAction } from "redux";
import { connect } from "react-redux";
import { sortBy } from "lodash";
import AppComponent from "../pages/App";

import { decreaseAggregate, increaseAggregate } from "../state/actions";
import useInterval from "../hooks/useInterval";
import { AppState } from "../state";

const AppContainer = ({
  aggregation,
  increaseAggregate,
  decreaseAggregate,
}: any) => {
  let isRunning = true;
  let interval = 1000;
  let [applicationState, setApplicationState] = useState<any>({
    asks: [],
    bids: [],
    spread: 0,
    askCumulative: 0,
    bidCumulative: 0,
  });

  const aggregateOrderBookSide = (
    orderbookSide: number[][],
    precision: number
  ) => {
    const result: number[][] = [];
    const amounts: any = {};
    for (let i = 0; i < orderbookSide.length; i++) {
      const ask = orderbookSide[i];
      let price = ask[0];
      if (precision !== undefined) {
        console.log(precision);
        price = price;
        // price = ccxt.decimalToPrecision(
        //   price,
        //   ccxt.ROUND,
        //   precision,
        //   ccxt.TICK_SIZE
        // );
      }
      amounts[price] = (amounts[price] || 0) + ask[1];
    }
    Object.keys(amounts).forEach((price) =>
      result.push([parseFloat(price), amounts[price]])
    );
    return result;
  };

  const aggregateOrderBook = (
    orderbook: {
      asks: number[][];
      bids: number[][];
      datetime: any;
      nonce: number | undefined;
      timestamp: number | undefined;
    },
    precision: number
  ) => {
    let asks = aggregateOrderBookSide(orderbook["asks"], precision);
    let bids = aggregateOrderBookSide(orderbook["bids"], precision);
    return {
      asks: sortBy(asks, 0),
      bids: sortBy(bids, 0, true),
      // due to little time alloted, I'm going to use lodash here
      // asks: ccxt.sortBy(asks, 0),
      // bids: ccxt.sortBy(bids, 0, true),
    };
  };

  useInterval(
    () => {
      (async () => {
        const exchange = new ccxt.coinbasepro({
          enableRateLimit: true,
        });

        // await exchange.fetchOrderBook("BTC/USD");

        const orderbook = await exchange.fetchOrderBook("BTC/USD");

        const aggOrderBook = aggregateOrderBook(
          orderbook,
          parseFloat(aggregation)
        );

        const asks = aggOrderBook.asks;
        let askCumulative = 0;
        asks.map((ask: number[]) => {
          askCumulative += ask[1];
        });
        setApplicationState({ ...applicationState, askCumulative, asks });

        const bids = aggOrderBook.bids;
        let bidCumulative = 0;
        console.log("Bids ", bids);
        bids.map((bid: any) => {
          bidCumulative += bid[1];
        });
        setApplicationState({
          ...applicationState,
          bidCumulative,
          bids,
          spread: orderbook.asks[0][0] - orderbook.bids[0][0],
        });
      })();
    },
    isRunning ? interval : 0
  );

  return (
    <AppComponent asks={applicationState.asks} bids={applicationState.bids} />
  );
};

function mapStateToProps(state: AppState) {
  return {
    aggregation: state.AggregationReducer.aggregation,
  };
}

function mapDispatchToProps(dispatch: Dispatch<AnyAction>) {
  return bindActionCreators(
    {
      increaseAggregate,
      decreaseAggregate,
    },
    dispatch
  );
}
export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);

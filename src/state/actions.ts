import { INCREASE_AGGREGATE, DECREASE_AGGREGATE } from "./constants";

export const increaseAggregate = () => {
  return {
    type: INCREASE_AGGREGATE,
  };
};

export const decreaseAggregate = () => {
  return {
    type: DECREASE_AGGREGATE,
  };
};

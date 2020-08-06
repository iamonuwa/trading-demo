import { INCREASE_AGGREGATE, DECREASE_AGGREGATE } from "./constants";

interface AggregationState {
  aggregation: string;
}

enum CounterTypes {
  INCREASE_AGGREGATE = "INCREASE_AGGREGATE",
  DECREASE_AGGREGATE = "DECREASE_AGGREGATE",
}
type CounterActions = INCREASE_AGGREGATE | DECREASE_AGGREGATE;

interface INCREASE_AGGREGATE {
  type: CounterTypes.INCREASE_AGGREGATE;
}

interface DECREASE_AGGREGATE {
  type: CounterTypes.DECREASE_AGGREGATE;
}

const AggregateLevels = ["0.01", "0.05", "0.10", "0.50", "1.00"];

const intialState: AggregationState = {
  aggregation: AggregateLevels[0],
};

export default function Reducer(
  state: AggregationState = intialState,
  action: CounterActions
): AggregationState {
  switch (action.type) {
    case INCREASE_AGGREGATE:
      return {
        ...state,
        aggregation: AggregateLevels[AggregateLevels.indexOf(state.aggregation) + 1],
      };
    case DECREASE_AGGREGATE:
      return {
        ...state,
        aggregation: AggregateLevels[AggregateLevels.indexOf(state.aggregation) - 1],
      };
    default:
      return state;
  }
}

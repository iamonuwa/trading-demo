import { useEffect, useRef } from "react";

export default function useInterval(callback: any, delay: number) {
  const curCB: any = useRef();

  useEffect(() => {
    curCB.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      if (curCB) curCB.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

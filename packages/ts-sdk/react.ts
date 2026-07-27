import { useEffect, useState, useCallback } from "react";
import { BdApiClient, type QueryParams } from "./index";

type State<T> = { data: T | null; loading: boolean; error: Error | null };

export function useBdApi<T>(
  fetcher: (client: BdApiClient) => Promise<T>,
  deps: unknown[] = [],
): { data: T | null; loading: boolean; error: Error | null; refetch: () => void } {
  const [state, setState] = useState<State<T>>({ data: null, loading: true, error: null });
  const [tick, setTick] = useState(0);

  const refetch = useCallback(() => {
    setState((prev) => ({ ...prev, loading: true }));
    setTick((t) => t + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const client = new BdApiClient();

    fetcher(client)
      .then((result) => {
        if (!cancelled) {
          setState({ data: result, loading: false, error: null });
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setState({ data: null, loading: false, error: err });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [...deps, tick]);

  return { ...state, refetch };
}

export function useDivisions(params?: QueryParams) {
  return useBdApi((client) => client.getDivisions(params), [JSON.stringify(params)]);
}

export function useDistricts(params?: QueryParams) {
  return useBdApi((client) => client.getDistricts(params), [JSON.stringify(params)]);
}

export function useUpazilas(params?: QueryParams) {
  return useBdApi((client) => client.getUpazilas(params), [JSON.stringify(params)]);
}

export function useUnions(params?: QueryParams) {
  return useBdApi((client) => client.getUnions(params), [JSON.stringify(params)]);
}

export function usePrayerTimes(params: QueryParams) {
  return useBdApi((client) => client.getPrayerTimes(params), [JSON.stringify(params)]);
}

export function useHolidays(params?: QueryParams) {
  return useBdApi((client) => client.getHolidays(params), [JSON.stringify(params)]);
}

export function useExchangeRates() {
  return useBdApi((client) => client.getExchangeRates(), []);
}

export function useSearch(q: string, params?: QueryParams) {
  return useBdApi((client) => (q ? client.search(q, params) : Promise.resolve(null)), [
    q,
    JSON.stringify(params),
  ]);
}

export function useMobileOperator(number: string) {
  return useBdApi(
    (client) => (number ? client.getMobileOperator(number) : Promise.resolve(null)),
    [number],
  );
}

export { BdApiClient };
export default useBdApi;

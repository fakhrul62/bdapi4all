export class BdApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public status: number,
    public docs?: string,
  ) {
    super(message);
    this.name = "BdApiError";
  }
}

type ApiResponse<T> = {
  success: boolean;
  version: string;
  request_id: string;
  timestamp: string;
  data: T;
  meta?: Record<string, unknown>;
  error?: { code: string; message: string; docs: string };
};

export type QueryParams = Record<string, string | number | boolean | undefined>;

type SdkOptions = {
  baseUrl?: string;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  cache?: boolean;
  cacheTtl?: number;
};

type CacheEntry<T> = { value: T; expires: number };

const DEFAULT_BASE_URL = "https://bdapi4all.vercel.app/api/v1";

export class BdApiClient {
  private baseUrl: string;
  private timeout: number;
  private retries: number;
  private retryDelay: number;
  private cacheEnabled: boolean;
  private cacheTtl: number;
  private cache = new Map<string, CacheEntry<unknown>>();

  constructor(options: SdkOptions = {}) {
    this.baseUrl = options.baseUrl ?? DEFAULT_BASE_URL;
    this.timeout = options.timeout ?? 10000;
    this.retries = options.retries ?? 3;
    this.retryDelay = options.retryDelay ?? 500;
    this.cacheEnabled = options.cache ?? true;
    this.cacheTtl = options.cacheTtl ?? 3600_000;
  }

  private buildUrl(path: string, params?: QueryParams): string {
    const url = new URL(`${this.baseUrl}${path}`);
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null) {
          url.searchParams.set(key, String(value));
        }
      }
    }
    return url.toString();
  }

  private getCacheKey(path: string, params?: QueryParams): string {
    const url = new URL(`${this.baseUrl}${path}`);
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null) {
          url.searchParams.set(key, String(value));
        }
      }
    }
    return url.toString();
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async request<T>(path: string, params?: QueryParams): Promise<T> {
    const cacheKey = this.getCacheKey(path, params);

    if (this.cacheEnabled) {
      const cached = this.cache.get(cacheKey) as CacheEntry<T> | undefined;
      if (cached && cached.expires > Date.now()) {
        return cached.value;
      }
    }

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= this.retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        const response = await fetch(this.buildUrl(path, params), {
          signal: controller.signal,
          headers: { Accept: "application/json" },
        });

        clearTimeout(timeoutId);

        const payload: ApiResponse<T> = await response.json();

        if (!payload.success) {
          throw new BdApiError(
            payload.error?.code ?? "UNKNOWN_ERROR",
            payload.error?.message ?? "Unknown API error",
            response.status,
            payload.error?.docs,
          );
        }

        if (this.cacheEnabled) {
          this.cache.set(cacheKey, { value: payload.data, expires: Date.now() + this.cacheTtl });
        }

        return payload.data;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        if (attempt < this.retries) {
          await this.sleep(this.retryDelay * Math.pow(2, attempt));
        }
      }
    }

    throw lastError ?? new Error("Request failed");
  }

  clearCache(): void {
    this.cache.clear();
  }

  async getDivisions(params?: QueryParams) {
    return this.request<unknown[]>("/divisions", params);
  }

  async getDivision(id: number) {
    return this.request<unknown>(`/divisions/${id}`);
  }

  async getDistricts(params?: QueryParams) {
    return this.request<unknown[]>("/districts", params);
  }

  async getDistrict(id: number) {
    return this.request<unknown>(`/districts/${id}`);
  }

  async getUpazilas(params?: QueryParams) {
    return this.request<unknown[]>("/upazilas", params);
  }

  async getUpazila(id: number) {
    return this.request<unknown>(`/upazilas/${id}`);
  }

  async getUnions(params?: QueryParams) {
    return this.request<unknown[]>("/unions", params);
  }

  async getPostcodes(params?: QueryParams) {
    return this.request<unknown[]>("/postcodes", params);
  }

  async getGeocode(params: QueryParams) {
    return this.request<unknown>("/geocode", params);
  }

  async getPrayerTimes(params: QueryParams) {
    return this.request<unknown>("/prayer-times", params);
  }

  async getMonthlyPrayerTimes(params: QueryParams) {
    return this.request<unknown>("/prayer-times/monthly", params);
  }

  async getHolidays(params?: QueryParams) {
    return this.request<unknown>("/holidays", params);
  }

  async getHoliday(date: string) {
    return this.request<unknown>(`/holidays/${date}`);
  }

  async getNextHoliday() {
    return this.request<unknown>("/holidays/next");
  }

  async getExchangeRates() {
    return this.request<unknown>("/exchange-rates");
  }

  async getExchangeRate(currency: string) {
    return this.request<unknown>(`/exchange-rates/${currency}`);
  }

  async getExchangeRateHistory(params: QueryParams) {
    return this.request<unknown>("/exchange-rates/history", params);
  }

  async getMobileOperator(number: string) {
    return this.request<unknown>("/mobile/operator", { number });
  }

  async getMobileOperators() {
    return this.request<unknown[]>("/mobile/operators");
  }

  async validate(type: string, value: string) {
    return this.request<unknown>(`/validate/${type}`, { [type]: value });
  }

  async toBengali(text: string) {
    return this.request<unknown>("/bn/to-bengali", { text });
  }

  async toEnglish(text: string) {
    return this.request<unknown>("/bn/to-english", { text });
  }

  async transliterate(text: string) {
    return this.request<unknown>("/bn/transliterate", { text });
  }

  async search(q: string, params?: QueryParams) {
    return this.request<unknown>("/search", { q, ...params });
  }

  async getEncyclopedia(category: string, params?: QueryParams) {
    return this.request<unknown>(`/${category}`, params);
  }

  async getEncyclopediaRecord(category: string, id: number) {
    return this.request<unknown>(`/${category}/${id}`);
  }

  async searchEncyclopedia(category: string, q: string, params?: QueryParams) {
    return this.request<unknown>(`/${category}/search`, { q, ...params });
  }

  async getFixtures() {
    return this.request<unknown>("/fixtures");
  }

  async getFixture(slug: string) {
    return this.request<unknown>(`/fixtures/${slug}`);
  }

  async batch<T>(
    requests: Array<() => Promise<T>>,
    concurrency = 5,
  ): Promise<T[]> {
    const results: T[] = [];
    for (let i = 0; i < requests.length; i += concurrency) {
      const batch = requests.slice(i, i + concurrency);
      const batchResults = await Promise.all(batch.map((req) => req()));
      results.push(...batchResults);
    }
    return results;
  }

  async requestRaw<T>(path: string, params?: QueryParams): Promise<T> {
    return this.request<T>(path, params);
  }
}

export function createClient(options?: SdkOptions): BdApiClient {
  return new BdApiClient(options);
}

export default BdApiClient;

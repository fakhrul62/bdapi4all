"""
BDApi4All Python Client

A free, open-source Python client for the BDApi4All Bangladesh REST API.
Supports retries, caching, pandas-friendly responses, and batch helpers.

Usage:
    from bdapi4all import BdApiClient

    client = BdApiClient()
    divisions = client.get_divisions()
    districts = client.get_districts(division_id=6)

    # Pandas-friendly
    import pandas as pd
    df = client.get_districts(as_frame=True)
"""

import time
import json
import hashlib
from typing import Any, Optional, Dict, List, Union
from urllib.request import urlopen, Request
from urllib.error import URLError, HTTPError
from urllib.parse import urlencode, urljoin


class BdApiError(Exception):
    def __init__(self, code: str, message: str, status: int, docs: str = ""):
        super().__init__(f"[{code}] {message}")
        self.code = code
        self.message = message
        self.status = status
        self.docs = docs


class BdApiClient:
    DEFAULT_BASE_URL = "https://bdapi4all.vercel.app/api/v1"

    def __init__(
        self,
        base_url: str = None,
        timeout: int = 10,
        retries: int = 3,
        retry_delay: float = 0.5,
        cache: bool = True,
        cache_ttl: int = 3600,
    ):
        self.base_url = base_url or self.DEFAULT_BASE_URL
        self.timeout = timeout
        self.retries = retries
        self.retry_delay = retry_delay
        self.cache_enabled = cache
        self.cache_ttl = cache_ttl
        self._cache: Dict[str, tuple] = {}

    def _build_url(self, path: str, params: Optional[Dict] = None) -> str:
        url = f"{self.base_url}{path}"
        if params:
            clean = {k: v for k, v in params.items() if v is not None}
            if clean:
                url += "?" + urlencode(clean)
        return url

    def _cache_key(self, path: str, params: Optional[Dict] = None) -> str:
        return self._build_url(path, params)

    def _get_cache(self, key: str) -> Optional[Any]:
        if not self.cache_enabled:
            return None
        entry = self._cache.get(key)
        if entry and entry[1] > time.time():
            return entry[0]
        return None

    def _set_cache(self, key: str, value: Any) -> None:
        if self.cache_enabled:
            self._cache[key] = (value, time.time() + self.cache_ttl)

    def clear_cache(self) -> None:
        self._cache.clear()

    def _request(self, path: str, params: Optional[Dict] = None) -> Any:
        cache_key = self._cache_key(path, params)
        cached = self._get_cache(cache_key)
        if cached is not None:
            return cached

        url = self._build_url(path, params)
        last_error = None

        for attempt in range(self.retries + 1):
            try:
                req = Request(url, headers={"Accept": "application/json"})
                with urlopen(req, timeout=self.timeout) as response:
                    payload = json.loads(response.read().decode("utf-8"))

                if not payload.get("success"):
                    err = payload.get("error", {})
                    raise BdApiError(
                        err.get("code", "UNKNOWN_ERROR"),
                        err.get("message", "Unknown API error"),
                        response.status,
                        err.get("docs", ""),
                    )

                self._set_cache(cache_key, payload["data"])
                return payload["data"]

            except (URLError, HTTPError, BdApiError) as e:
                last_error = e
                if attempt < self.retries:
                    time.sleep(self.retry_delay * (2 ** attempt))

        raise last_error

    def _as_frame(self, data: Any, as_frame: bool = False):
        if not as_frame:
            return data
        try:
            import pandas as pd
        except ImportError:
            raise ImportError("pandas is required for as_frame=True. Install with: pip install pandas")
        if isinstance(data, list):
            return pd.DataFrame(data)
        return pd.DataFrame([data])

    def get_divisions(self, params: Optional[Dict] = None, as_frame: bool = False):
        data = self._request("/divisions", params)
        return self._as_frame(data, as_frame)

    def get_division(self, id: int):
        return self._request(f"/divisions/{id}")

    def get_districts(self, params: Optional[Dict] = None, as_frame: bool = False):
        data = self._request("/districts", params)
        return self._as_frame(data, as_frame)

    def get_district(self, id: int):
        return self._request(f"/districts/{id}")

    def get_upazilas(self, params: Optional[Dict] = None, as_frame: bool = False):
        data = self._request("/upazilas", params)
        return self._as_frame(data, as_frame)

    def get_upazila(self, id: int):
        return self._request(f"/upazilas/{id}")

    def get_unions(self, params: Optional[Dict] = None, as_frame: bool = False):
        data = self._request("/unions", params)
        return self._as_frame(data, as_frame)

    def get_postcodes(self, params: Optional[Dict] = None):
        return self._request("/postcodes", params)

    def get_geocode(self, district: str = None, upazila: str = None):
        return self._request("/geocode", {"district": district, "upazila": upazila})

    def get_prayer_times(self, district_id: int = None, lat: float = None, lng: float = None, date: str = None):
        return self._request("/prayer-times", {"district_id": district_id, "lat": lat, "lng": lng, "date": date})

    def get_monthly_prayer_times(self, district_id: int = None, year: int = None, month: int = None, lat: float = None, lng: float = None):
        return self._request("/prayer-times/monthly", {"district_id": district_id, "year": year, "month": month, "lat": lat, "lng": lng})

    def get_holidays(self, year: int = None):
        return self._request("/holidays", {"year": year})

    def get_holiday(self, date: str):
        return self._request(f"/holidays/{date}")

    def get_next_holiday(self):
        return self._request("/holidays/next")

    def get_exchange_rates(self):
        return self._request("/exchange-rates")

    def get_exchange_rate(self, currency: str):
        return self._request(f"/exchange-rates/{currency}")

    def get_exchange_rate_history(self, currency: str, from_date: str, to_date: str):
        return self._request("/exchange-rates/history", {"currency": currency, "from": from_date, "to": to_date})

    def get_mobile_operator(self, number: str):
        return self._request("/mobile/operator", {"number": number})

    def get_mobile_operators(self):
        return self._request("/mobile/operators")

    def validate(self, type: str, value: str):
        return self._request(f"/validate/{type}", {type: value})

    def to_bengali(self, text: str):
        return self._request("/bn/to-bengali", {"text": text})

    def to_english(self, text: str):
        return self._request("/bn/to-english", {"text": text})

    def transliterate(self, text: str):
        return self._request("/bn/transliterate", {"text": text})

    def search(self, q: str, params: Optional[Dict] = None):
        return self._request("/search", {"q": q, **(params or {})})

    def get_encyclopedia(self, category: str, params: Optional[Dict] = None):
        return self._request(f"/{category}", params)

    def get_encyclopedia_record(self, category: str, id: int):
        return self._request(f"/{category}/{id}")

    def search_encyclopedia(self, category: str, q: str, params: Optional[Dict] = None):
        return self._request(f"/{category}/search", {"q": q, **(params or {})})

    def get_fixtures(self):
        return self._request("/fixtures")

    def get_fixture(self, slug: str):
        return self._request(f"/fixtures/{slug}")

    def batch(self, requests: List, concurrency: int = 5) -> List:
        import concurrent.futures
        results = []
        with concurrent.futures.ThreadPoolExecutor(max_workers=concurrency) as executor:
            futures = [executor.submit(req) for req in requests]
            for future in concurrent.futures.as_completed(futures):
                results.append(future.result())
        return results

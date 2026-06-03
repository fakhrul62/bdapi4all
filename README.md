# BDApi4All

BDApi4All is a free, open-source REST API for Bangladesh. It gives developers one public API for Bangladesh geography, prayer times, holidays, exchange rates, mobile operators, validators, Bengali utilities, books, people, culture, food, spices, nature, history, sports, and more.

Base URL:

```txt
https://bdapi4all.vercel.app/api/v1
```

No API key is required for normal use.

## What You Can Build

- Address forms with divisions, districts, upazilas, and unions
- Prayer-time widgets by district or coordinates
- Holiday calendars for Bangladesh apps
- Mobile number validation and operator detection
- Bengali digit conversion and basic transliteration tools
- Search experiences for Bangladesh people, books, places, rivers, foods, spices, and culture
- Local encyclopedia pages for districts, heritage, sports, literature, and notable people

## Main Links

- Documentation: https://bdapi4all.vercel.app/docs
- Playground: https://bdapi4all.vercel.app/playground
- OpenAPI: https://bdapi4all.vercel.app/openapi.json
- Cookbook: https://bdapi4all.vercel.app/cookbook
- Data sources: https://bdapi4all.vercel.app/sources
- Status: https://bdapi4all.vercel.app/status

## Quick Examples

List districts:

```bash
curl "https://bdapi4all.vercel.app/api/v1/districts"
```

Search the Bangladesh encyclopedia:

```bash
curl "https://bdapi4all.vercel.app/api/v1/search?q=Padma"
```

Get prayer times:

```bash
curl "https://bdapi4all.vercel.app/api/v1/prayer-times?district_id=47"
```

Find spices and masala:

```bash
curl "https://bdapi4all.vercel.app/api/v1/spices?category=masala_blend"
```

## JavaScript

```js
const res = await fetch("https://bdapi4all.vercel.app/api/v1/districts");
const payload = await res.json();

console.log(payload.data);
```

## Next.js

```tsx
export default async function Page() {
  const res = await fetch("https://bdapi4all.vercel.app/api/v1/search?q=Dhaka", {
    next: { revalidate: 86400 },
  });
  const payload = await res.json();

  return <pre>{JSON.stringify(payload.data, null, 2)}</pre>;
}
```

## Laravel

```php
use Illuminate\Support\Facades\Http;

$response = Http::get('https://bdapi4all.vercel.app/api/v1/people/search', [
    'q' => 'Shakib',
]);

$people = $response->json('data');
```

## Flutter

```dart
import 'dart:convert';
import 'package:http/http.dart' as http;

Future<List<dynamic>> loadDistricts() async {
  final uri = Uri.parse('https://bdapi4all.vercel.app/api/v1/districts');
  final response = await http.get(uri);
  final payload = jsonDecode(response.body) as Map<String, dynamic>;
  return payload['data'] as List<dynamic>;
}
```

## Response Format

Successful responses use the same wrapper:

```json
{
  "success": true,
  "version": "v1",
  "timestamp": "2026-06-03T00:00:00.000Z",
  "data": []
}
```

Paginated endpoints include `meta.pagination`.

Errors use the same wrapper with an `error` object:

```json
{
  "success": false,
  "version": "v1",
  "timestamp": "2026-06-03T00:00:00.000Z",
  "error": {
    "code": "INVALID_PARAMETER",
    "message": "Integer filters must be valid whole numbers.",
    "docs": "https://bdapi4all.vercel.app/docs/errors#invalid_parameter"
  }
}
```

## Popular Endpoints

```txt
GET /divisions
GET /districts
GET /upazilas
GET /unions
GET /geocode
GET /prayer-times
GET /holidays
GET /exchange-rates
GET /mobile/operator
GET /validate/mobile
GET /bn/to-bengali
GET /search
GET /people/search
GET /books
GET /authors
GET /spices
GET /historical-places/by-district
GET /rivers/by-district
GET /foods/by-region
```

## Data Trust

Many records include:

- `source`: where the data came from
- `source_url`: a reference link when available
- `verified`: whether the record has been source-backed or reviewed
- `needs_image`: whether a confirmed reusable image is still missing

Apps that need strict data can filter for verified records. Apps that want wider discovery can show unverified records with a label.

## Rate Limits

Basic public use is free and does not require authentication. The API is rate-limited to keep the service stable for everyone.

## Open Source

BDApi4All is built as a free public resource for developers working on Bangladesh-focused products, tools, research, and civic projects. Contributions that improve accuracy, source quality, Bengali text, and coverage are welcome.

## License

MIT

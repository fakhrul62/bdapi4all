# BDApi4All SDKs & CLI

Official client libraries and tools for the BDApi4All Bangladesh REST API.

## TypeScript SDK

```ts
import { createClient } from "@bdapi4all/sdk";

const client = createClient();
const divisions = await client.getDivisions();
const districts = await client.getDistricts({ division_id: 6 });
```

Features: retries with exponential backoff, in-memory caching, batch helpers, full type coverage.

## React Hooks

```tsx
import { useDistricts } from "@bdapi4all/sdk/react";

function MyComponent() {
  const { data, loading, error } = useDistricts({ division_id: 6 });
  if (loading) return <p>Loading...</p>;
  return <ul>{data?.map((d) => <li key={d.id}>{d.name_en}</li>)}</ul>;
}
```

## Python Client

```python
from bdapi4all import BdApiClient

client = BdApiClient()
districts = client.get_districts(division_id=6)

# Pandas-friendly
import pandas as pd
df = client.get_districts(division_id=6, as_frame=True)
```

## CLI

```bash
# Query data
bdapi divisions
bdapi districts --division_id=6
bdapi prayer 47
bdapi search "Padma"

# Validate
bdapi validate mobile 01712345678
bdapi validate nid 1234567890

# Fixtures & mocking
bdapi fixtures
bdapi fixture divisions
bdapi mock divisions
```

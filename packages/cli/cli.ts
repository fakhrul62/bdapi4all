#!/usr/bin/env tsx

const BASE_URL = process.env.BDAPI_BASE_URL ?? "https://bdapi4all.vercel.app/api/v1";

async function api<T>(path: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value) url.searchParams.set(key, value);
    }
  }
  const response = await fetch(url);
  const payload = await response.json();
  if (!payload.success) {
    throw new Error(payload.error?.message ?? "API error");
  }
  return payload.data as T;
}

function print(data: unknown) {
  console.log(JSON.stringify(data, null, 2));
}

function printHelp() {
  console.log(`
BDApi4All CLI - Query, validate, and mock Bangladesh API data

USAGE:
  bdapi <command> [options]

COMMANDS:
  divisions              List all divisions
  districts [id]         List districts or get one by ID
  upazilas [id]          List upazilas or get one by ID
  unions [id]            List unions or get one by ID
  prayer <district_id>   Get prayer times for a district
  holidays [year]        List holidays for a year
  exchange-rates         Get latest exchange rates
  operator <number>      Detect mobile operator from number
  validate <type> <val>  Validate NID, TIN, mobile, or postcode
  search <query>         Search the encyclopedia
  fixtures               List all available fixtures
  fixture <slug>         Download a fixture for an endpoint
  mock <endpoint>        Serve mock data from fixtures

OPTIONS:
  --json    Output raw JSON (default)
  --table   Output as a table
  --help    Show this help

EXAMPLES:
  bdapi divisions
  bdapi districts --division_id=6
  bdapi prayer 47
  bdapi validate mobile 01712345678
  bdapi search "Padma"
  bdapi fixtures
`);
}

function parseFlags(args: string[]): { flags: Record<string, string>; positional: string[] } {
  const flags: Record<string, string> = {};
  const positional: string[] = [];
  for (const arg of args) {
    if (arg.startsWith("--")) {
      const [key, ...rest] = arg.slice(2).split("=");
      flags[key] = rest.join("=");
    } else {
      positional.push(arg);
    }
  }
  return { flags, positional };
}

async function main() {
  const { flags, positional } = parseFlags(process.argv.slice(2));
  const command = positional[0];

  if (!command || command === "help" || flags.help) {
    printHelp();
    return;
  }

  switch (command) {
    case "divisions": {
      const data = await api("/divisions", flags);
      print(data);
      break;
    }
    case "districts": {
      const id = positional[1];
      if (id) {
        const data = await api(`/districts/${id}`);
        print(data);
      } else {
        const data = await api("/districts", flags);
        print(data);
      }
      break;
    }
    case "upazilas": {
      const id = positional[1];
      if (id) {
        const data = await api(`/upazilas/${id}`);
        print(data);
      } else {
        const data = await api("/upazilas", flags);
        print(data);
      }
      break;
    }
    case "unions": {
      const id = positional[1];
      if (id) {
        const data = await api(`/unions/${id}`);
        print(data);
      } else {
        const data = await api("/unions", flags);
        print(data);
      }
      break;
    }
    case "prayer": {
      const districtId = positional[1];
      if (!districtId) {
        console.error("Error: district_id is required. Usage: bdapi prayer <district_id>");
        process.exit(1);
      }
      const data = await api("/prayer-times", { district_id: districtId });
      print(data);
      break;
    }
    case "holidays": {
      const year = positional[1] ?? String(new Date().getFullYear());
      const data = await api("/holidays", { year });
      print(data);
      break;
    }
    case "exchange-rates": {
      const data = await api("/exchange-rates");
      print(data);
      break;
    }
    case "operator": {
      const number = positional[1];
      if (!number) {
        console.error("Error: number is required. Usage: bdapi operator <number>");
        process.exit(1);
      }
      const data = await api("/mobile/operator", { number });
      print(data);
      break;
    }
    case "validate": {
      const type = positional[1];
      const value = positional[2];
      if (!type || !value) {
        console.error("Error: type and value are required. Usage: bdapi validate <type> <value>");
        process.exit(1);
      }
      const data = await api(`/validate/${type}`, { [type]: value });
      print(data);
      break;
    }
    case "search": {
      const query = positional[1];
      if (!query) {
        console.error("Error: query is required. Usage: bdapi search <query>");
        process.exit(1);
      }
      const data = await api("/search", { q: query });
      print(data);
      break;
    }
    case "fixtures": {
      const data = await api("/fixtures");
      print(data);
      break;
    }
    case "fixture": {
      const slug = positional[1];
      if (!slug) {
        console.error("Error: slug is required. Usage: bdapi fixture <slug>");
        process.exit(1);
      }
      const data = await api(`/fixtures/${slug}`);
      print(data);
      break;
    }
    case "mock": {
      const endpoint = positional[1];
      if (!endpoint) {
        console.error("Error: endpoint slug is required. Usage: bdapi mock <endpoint>");
        process.exit(1);
      }
      console.log(`# Mock data for ${endpoint}:`);
      const data = await api(`/fixtures/${endpoint}`);
      print(data);
      break;
    }
    default:
      console.error(`Unknown command: ${command}`);
      printHelp();
      process.exit(1);
  }
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});

# Postcode data

`data/postcodes.json` contains 733 community-sourced postal-office entries whose
upazila names matched the existing geography dataset. Entries cover 61 districts;
unmatched names and ambiguous district mappings were excluded. Multiple postal
offices can share a postcode. Database records are deduplicated by district,
upazila and postcode.

Source: [MHNahib/bangladesh-postcodes-npm](https://github.com/MHNahib/bangladesh-postcodes-npm/blob/main/src/postcodes.json)
(MIT, as stated in that repository's README). Source district IDs differ from this
project's IDs: district mappings were derived from multiple matching upazila names,
then each imported row was matched to its district and upazila. Numeric source IDs
were never copied directly.

Sample codes for Amtali and Bamna were cross-checked against the
[Bangladesh Post Office Barguna list](https://bdpost.gov.bd/pages/static-pages/6922db72933eb65569e0a2be).
The full community dataset has not been independently verified. Responses identify
it as community-sourced; consumers should confirm important addresses with the
Bangladesh Post Office.

Run `npm run data:seed-postcodes` after seeding geography. The import validates
parent relationships, obtains a transaction lock, inserts missing records, and
preserves existing records. It can safely be rerun.

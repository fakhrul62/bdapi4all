Data repair is opt-in: `npm run data:repair` previews counts, and `npm run data:repair -- --apply` commits a single transaction.

Every changed record is saved as JSON in `record_archive`, with its original ID, category, reason and timestamp. The archive has row-level security and is accessible through the server database connection only.

Records marked verified without a source or source URL become unverified. This does not fabricate a reference or change their content. Exact duplicates are compared across every stored field except the ID and creation/update timestamps. The lowest ID remains canonical. Referenced duplicate records are retained; foreign keys are never rewritten automatically.

Old encyclopedia detail URLs continue to resolve through the archive to the canonical record. Name collisions with different content are reported for review and are retained.

To undo a change, review the relevant archived JSON. Verification flags can be restored from the `unsupported_verification` snapshot. An exact duplicate can be restored with its original ID and fields using PostgreSQL `jsonb_populate_record`; its canonical record remains untouched. Remove the corresponding archive alias only after restoring and checking the row. Repair never deletes archive snapshots.

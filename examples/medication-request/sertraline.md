# Sertraline 50mg, then 100mg

[`sertraline-50mg.json`](sertraline-50mg.json) ·
[`sertraline-100mg.json`](sertraline-100mg.json)

Sertraline 50mg tablets, one tablet daily. After four weeks,
increased to 100mg daily.

## Decisions

- **Two resources, not one.** A MedicationRequest records a single
  authorisation. Editing the dose in place would destroy the record
  of what was taken in the first four weeks.

- **Different bounds for each.** The 50mg has `boundsDuration` of
  28 days: a planned four-week authorisation. The 100mg has none,
  because it's indefinite. Its four-weekly rhythm comes from
  `expectedSupplyDuration` — the patient returns when supply runs
  out — not from a limit on therapy.

- **Completed vs active.** On completion of the four weeks of
  sertraline 50mg it was marked `completed`, and the 100mg is
  `active`. `priorPrescription` on the 100mg references the 50mg.
  (`ended` might seem to fit, but it doesn't exist in R4 — it was
  added in R5.)

- **Same `authoredOn`.** Both carry the same prescription date,
  assuming the prescriber set out the plan to double the dose at
  four weeks in one consultation. Nothing in the data then says when
  the 100mg starts — both look current from day one. In practice the
  sequencing lives in dispensing, not in the resources.
  
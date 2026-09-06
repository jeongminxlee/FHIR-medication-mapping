# Sertraline on admission

[`sertraline-on-admission.json`](sertraline-on-admission.json)

Medicines reconciliation on admission. The patient is asked what they
take at home and says:

> "I'm on sertraline for my mood. One in the morning. I think it went
> up to the higher dose a while back. I started it the day I picked it
> up from the chemist."

There is no prescription for this in the admitting system. The
statement records what was said, not what was observed.

## Decisions

- **`informationSource` is the patient.** This is the field that makes
  the resource what it is. The same statement sourced from the GP
  record or a repeat slip would carry the same content with different
  reliability, and nothing else in the resource marks that difference.

- **`dateAsserted` and `effectivePeriod` answer different questions.**
  The patient has been taking it since September; the statement was
  made in November. The gap between the two is a measure of how stale
  the information may be, and it is the reason this field exists on
  MedicationStatement and not on MedicationAdministration, where the
  event and the record are the same moment.

- **The start date is inferred, and nothing says so.**
  `effectivePeriod.start` is 6 September. The patient did not give a
  date; they said they started the day they collected it, and 6
  September comes from the dispense record. The field looks like a
  fact and is actually a reconstruction. There is no way to mark a
  value as inferred rather than reported.

- **The resource cannot express partial adherence.** `status: active`
  plus a daily dose reads as someone taking it exactly as prescribed.
  All the patient actually confirmed is that they take it. Any caveat
  — "most days", "not sure about this week" — can only go in `note`,
  which is free text and unprocessable. A receiving system sees
  perfect adherence.
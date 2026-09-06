# Dispensing a repeat

[`sertraline-50mg.json`](sertraline-50mg.json) ·
[`sertraline-100mg-issue1.json`](sertraline-100mg-issue1.json) ·
[`sertraline-100mg-issue2-uncollected.json`](sertraline-100mg-issue2-uncollected.json)

Both sertraline prescriptions were written at the same consultation on
31 August. The 50mg was dispensed and collected. The 100mg was
dispensed and collected four weeks later. The next issue of the 100mg
was prepared on 28 September and never collected.

## Decisions

- **The dispense records what the prescription only predicts.**
  `expectedSupplyDuration` on the MedicationRequest is an estimate
  made at prescribing. `daysSupply` and `whenHandedOver` on the
  dispense are facts about what was actually supplied and when. The
  run-out date — the thing a refill reminder needs — comes from the
  dispense alone, and doesn't need the prescription at all.

- **Nothing records which issue this is.** All three files reference
  an authorising prescription, but no field says whether this is the
  first supply or the fourth, or how many repeats remain. The only way
  to order them is by `whenPrepared`. A system holding a single
  dispense cannot tell where in the cycle it sits.

- **`receiver` contradicts its own definition.** The definition says
  the person who picked up the medication "will usually be a patient
  or their caregiver", but the type permits only `Patient` or
  `Practitioner`. A relative or carer collecting — routine in
  community pharmacy — cannot be recorded. R5 added `RelatedPerson`,
  but UK Core is R4 and has no current plan to migrate, so this
  remains a live limitation for NHS-facing systems.

- **`in-progress` means ready for pickup.** Counterintuitive: the
  natural reading is "being assembled", but the definition is that the
  product is ready and waiting. `preparation` covers the earlier
  staging. The uncollected file uses `in-progress` accordingly.

- **`cancelled` is too strong for an uncollected bag.** Its definition
  is that the product "was not and will never be picked up". A
  pharmacy cannot know that — patients collect late. `in-progress` is
  the honest status for something still on the shelf, and the resource
  has no way to express "prepared, waiting, and increasingly unlikely
  to be collected". There is also no field for when a bag was returned
  to stock.

- **Legal validity and clinical intent diverge silently.** A
  prescription is legally valid for six months, so collecting weeks
  after it was written is normal. But the prescriber's four-week
  review point assumed prompt collection. The 50mg was collected on 6
  September, so the four weeks actually ran to 4 October rather than
  28 September. Nothing joins `whenHandedOver` to `boundsDuration`,
  so the drift is invisible in the data.

- **An uncollected repeat is a stronger adherence signal than a missed dose.** 
A single missed dose is noise. A prepared, never
  collected issue of an SSRI is disengagement, and it is the one
  adherence signal community pharmacy already holds — but it stays in
  the pharmacy's system and never reaches the GP.
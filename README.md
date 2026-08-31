# FHIR medication mapping

Worked examples mapping common UK prescriptions to FHIR R4 MedicationRequest resources, using dm+d codes.

Written from a Pharmacy background learning FHIR. Each example was chosen because it breaks the mapping in a different way.

## Examples

### Amoxicillin 500mg capsules
One capsule three times a day for 7 days, 21 supplied.

Decisions:

- **Durations recorded in days.** Prescriptions are written in
  shorthand where the denominator gives the unit — 5/7 is five days,
  2/52 two weeks. Days are the base unit for courses, so "one week"
  is recorded as 7 d rather than 1 wk.

- **VMP, not AMP.** dm+d codes products at three levels — substance
  (VTM), generic product (VMP), and specific manufacturer's product
  (AMP). Used the VMP code (39732411000001106) because the
  prescription specifies a generic product (*non-proprietary*), not a brand.

- **dm+d system URI, not SNOMED.** dm+d codes are SNOMED CT
  identifiers, so `http://snomed.info/sct` would technically resolve.
  Used `https://dmd.nhs.uk` because UK Core expects the dm+d URI for
  medication resources.

- **Codes are versioned.** The dm+d lookup returned two codes for
  this product: 323510009, retired 26-05-2021, and the current
  39732411000001106. Historical records will contain retired codes,
  so a real mapping layer needs to handle supersession.

- **boundsDuration and expectedSupplyDuration are different claims.**
  Both hold "7 days" here, which initially looked like duplication.
  They aren't: `boundsDuration` is how long to take it, a clinical
  instruction; `expectedSupplyDuration` is how long the supply will
  last, which the spec explicitly calls an estimate influenced by
  external factors. They coincide for a course taken as directed and
  diverge as soon as it isn't — which is precisely the case an
  adherence tool cares about. Kept both.


### Paracetamol 500mg tablets
Paracetamol 500mg tablets. One to two tablets every four to six hours when required. Maximum 8 tablets in 24 hours. Supply 32.


Decisions:

- **PRN (as needed).** Dropped `courseOfTherapyType`. PRN is not a course of therapy. 

- **No `expectedSupplyDuration`.** Amoxicillin has it because a course
  consumed as directed has a predictable duration. Sertraline has it
  because a repeat has a supply interval. Paracetamol can't: 32 tablets
  lasts four days or a fortnight depending entirely on symptoms, so
  there's no estimate to make.

- **Two ranges, not two numbers.** Both the dose (1–2 tablets) and
  the interval (every 4–6 hours) are ranges. These use `doseRange`
  and `periodMax` respectively. Flattening either into a single
  value silently changes the prescription.

- **The maximum can't be derived.** With a variable dose and a
  variable interval, the daily total isn't computable from the
  other fields — 1 tablet every 6 hours and 2 tablets every 4 hours
  are both valid readings, and they differ by a factor of three.
  So `maxDosePerPeriod` has to be stated explicitly. It's a safety
  limit, not an instruction, and it's the field a receiving system
  needs most.

- **Units coded where safety depends on them.** Doses and the
  maximum use UCUM codes (`{tbl}` for tablets). The dispense
  quantity uses free text, since ambiguity there is a supply
  question rather than a dosing one.

- **Free text and structured fields can disagree.** While writing
  this I set `period: 1` instead of `period: 4`, making the
  structured data read "every 1 to 6 hours" while `text` still said
  four to six. Nothing in FHIR validates the two against each
  other. A human reading the text would never have caught it; a
  system acting on the structure could have dosed hourly.

### Sertraline 50mg tablets then Sertraline 100mg tablets (One regimen, two entries)
Sertraline 50mg tablets, one tablet daily. After four weeks, increased to 100mg daily.

Decisions:

- **Two resources, not one.** A MedicationRequest records a single
  authorisation. Editing the dose in place would destroy the record
  of what was taken in the first four weeks.

- **Different bounds for each.** The 50mg has `boundsDuration` of
  28 days: a planned four-week authorisation. The 100mg has none,
  because it's indefinite. Its four-weekly rhythm comes from
  `expectedSupplyDuration` — the patient returns when supply runs
  out — not from a limit on therapy.

- **Completed vs active.** `MedicationRequest.status` is generally
  either `completed` or `active`. On completion of the four weeks of
  sertraline 50mg it was marked `completed`, and the 100mg is
  `active`. Note that `priorPrescription` is added to the 100mg,
  referencing the 50mg. (`ended` might seem to fit, but it doesn't
  exist in R4 — it was added in R5.)

- **Same `authoredOn`.** Both carry the same prescription date,
  assuming the prescriber set out the plan to double the dose at
  four weeks in one consultation.


*(in progress)*
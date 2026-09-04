# Amoxicillin 500mg capsules

[`amoxicillin.json`](amoxicillin.json)

One capsule three times a day for 7 days, 21 supplied.

## Decisions

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
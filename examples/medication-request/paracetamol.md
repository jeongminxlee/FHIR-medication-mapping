# Paracetamol 500mg tablets

[`paracetamol.json`](paracetamol.json)

One to two tablets every four to six hours when required. Maximum 8
tablets in 24 hours. Supply 32.

## Decisions

- **PRN is not a course of therapy.** Dropped `courseOfTherapyType`
  entirely rather than leaving it empty.

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

- **No `expectedSupplyDuration`.** Amoxicillin has it because a
  course consumed as directed has a predictable duration. Sertraline
  has it because a repeat has a supply interval. Paracetamol can't:
  32 tablets lasts four days or a fortnight depending entirely on
  symptoms, so there's no estimate to make.

- **Units coded where safety depends on them.** Doses and the
  maximum use UCUM codes (`{tbl}` for tablets). The dispense
  quantity uses free text, since ambiguity there is a supply
  question rather than a dosing one.

- **Free text and structured fields can disagree.** While writing
  this I set `period: 1` instead of `period: 4`, making the
  structured data read "every 1 to 6 hours" while `text` still said
  four to six. Nothing in FHIR validates the two against each other.
  A human reading the text would never have caught it; a system
  acting on the structure could have dosed hourly.
  
# Recording doses taken and missed

[`amoxicillin-day3-dose1.json`](amoxicillin-day3-dose1.json) ·
[`amoxicillin-day3-dose2.json`](amoxicillin-day3-dose2.json) ·
[`amoxicillin-day3-dose3.json`](amoxicillin-day3-dose3.json)

Day three of the amoxicillin course. The 8am dose was taken. The 2pm
dose was missed. The 10pm dose was taken.

## Decisions

- **Only administration can record a non-event.** `status: not-done`
  has no equivalent in MedicationStatement. It is deliberate, as a
  statement describes a state.

- **The vocabulary for why assumes refusal.** All eight SNOMED codes
  for `statusReason` are "drug declined by patient"; nothing for
  forgetting to take the medication, which is the most common cause.
  However, as the binding is Example, other inputs, such
  as "patient forgot", are allowed.

- **Example binding means no shared answer.** Example is the weakest
  binding strength, so systems will diverge.

- **Lateness can't be expressed.** The resource only records when a
  dose happened, not when it was due. Neither does MedicationRequest —
  TDS is a count, not clock times. So lateness isn't recorded anywhere
  and can't be calculated. Lateness holds low clinical significance.
  Whether they've skipped the dose is important (`status: not-done`).

- **Patients can be performers.** Patients can be performers in
  `MedicationAdministration`. A patient's account of taking medication
  should be recorded under `MedicationStatement`. However, when a
  patient reports to a clinician that they have taken a medication at
  a certain time, there is a tension between whether it should be
  recorded under `MedicationAdministration` or `MedicationStatement`,
  taking into consideration factors such as the patient's mental
  capacity.

- **`effectiveDateTime` is mandatory even for a non-event.** The 2pm
  dose was not taken. However, as `effectiveDateTime` is mandatory,
  what is recorded is the expected time to take it, despite the dose
  not being taken.
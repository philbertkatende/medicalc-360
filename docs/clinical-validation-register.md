# MediCalc 360 — clinical validation register

**Catalogue snapshot:** 71 calculator definitions  
**Branch:** `safety/input-validation-errors`  
**Purpose:** Track the evidence and review required before any calculator is represented as clinically validated.

## Important status statement

This register is an audit aid, not a clinical endorsement. A named publication or formula citation does not prove that the implementation matches the source, that the source remains current, or that the calculator is appropriate for every patient. All entries below remain **not independently verified** until a qualified reviewer records the equation, input units, population, exclusions, rounding, interpretation, test cases, source version/date and approval.

## Calculator inventory

| Calculator ID | Citation specificity in current code | Independent clinical verification |
|---|---|---|
| `dose-volume` | Generic basis / convention | Not independently verified |
| `weight-dose` | Generic basis / convention | Not independently verified |
| `daily-dose` | Generic basis / convention | Not independently verified |
| `infusion-rate` | Generic basis / convention | Not independently verified |
| `drop-rate` | Generic basis / convention | Not independently verified |
| `mcg-kg-min` | Generic basis / convention | Not independently verified |
| `dilution` | Generic basis / convention | Not independently verified |
| `percent-wv` | Generic basis / convention | Not independently verified |
| `molarity` | Generic basis / convention | Not independently verified |
| `meq` | Generic basis / convention | Not independently verified |
| `mg-mmol` | Generic basis / convention | Not independently verified |
| `bmi` | Publication named | Not independently verified |
| `bsa` | Publication named | Not independently verified |
| `ibw` | Publication named | Not independently verified |
| `adjusted-weight` | Generic basis / convention | Not independently verified |
| `peds-421` | Publication named | Not independently verified |
| `holliday-segar` | Publication named | Not independently verified |
| `crcl` | Publication named | Not independently verified |
| `egfr-2021` | Publication named | Not independently verified |
| `anion-gap` | Publication named | Not independently verified |
| `corrected-calcium` | Generic basis / convention | Not independently verified |
| `osmolality` | Generic basis / convention | Not independently verified |
| `corrected-sodium` | Publication named | Not independently verified |
| `fena` | Generic basis / convention | Not independently verified |
| `map` | Generic basis / convention | Not independently verified |
| `pulse-pressure` | Generic basis / convention | Not independently verified |
| `shock-index` | Generic basis / convention | Not independently verified |
| `qtc-bazett` | Publication named | Not independently verified |
| `qtc-fridericia` | Publication named | Not independently verified |
| `chadsvasc` | Publication named | Not independently verified |
| `cha2ds2-va` | Publication named | Not independently verified |
| `has-bled` | Publication named | Not independently verified |
| `edd` | Generic basis / convention | Not independently verified |
| `gestational-age` | Generic basis / convention | Not independently verified |
| `anc` | Generic basis / convention | Not independently verified |
| `pf-ratio` | Publication named | Not independently verified |
| `aa-gradient` | Generic basis / convention | Not independently verified |
| `vd` | Generic basis / convention | Not independently verified |
| `half-life` | Generic basis / convention | Not independently verified |
| `ke` | Generic basis / convention | Not independently verified |
| `clearance` | Generic basis / convention | Not independently verified |
| `loading-dose` | Generic basis / convention | Not independently verified |
| `maintenance-rate` | Generic basis / convention | Not independently verified |
| `bioavailability` | Generic basis / convention | Not independently verified |
| `sensitivity` | Generic basis / convention | Not independently verified |
| `specificity` | Generic basis / convention | Not independently verified |
| `ppv-npv` | Generic basis / convention | Not independently verified |
| `incidence` | Generic basis / convention | Not independently verified |
| `prevalence` | Generic basis / convention | Not independently verified |
| `relative-risk` | Generic basis / convention | Not independently verified |
| `odds-ratio` | Generic basis / convention | Not independently verified |
| `arr-nnt` | Generic basis / convention | Not independently verified |
| `rrr` | Generic basis / convention | Not independently verified |
| `corrected-ag` | Publication named | Not independently verified |
| `winter-formula` | Publication named | Not independently verified |
| `fib4` | Publication named | Not independently verified |
| `child-pugh` | Publication named | Not independently verified |
| `curb65` | Publication named | Not independently verified |
| `qsofa` | Publication named | Not independently verified |
| `gcs` | Publication named | Not independently verified |
| `apgar` | Publication named | Not independently verified |
| `retic-corrected` | Generic basis / convention | Not independently verified |
| `transferrin-sat` | Generic basis / convention | Not independently verified |
| `phenytoin-corrected` | Generic basis / convention | Not independently verified |
| `calvert` | Publication named | Not independently verified |
| `free-water-deficit` | Generic basis / convention | Not independently verified |
| `osm-gap` | Generic basis / convention | Not independently verified |
| `bsa-dose` | Generic basis / convention | Not independently verified |
| `oxytocin-rate` | Generic basis / convention | Not independently verified |
| `edd-conception` | Generic basis / convention | Not independently verified |
| `corrected-age` | Generic basis / convention | Not independently verified |

## Required review record for each calculator

Before changing a calculator's status to reviewed, record:

1. Exact equation and an authoritative source (guideline, original derivation/validation paper, regulator-approved product information, or authoritative textbook).
2. Intended population, exclusions, and clinical setting.
3. Required units, allowed ranges, integer constraints, and cross-field rules.
4. Independent hand-calculated known-answer cases and boundary/invalid-input tests.
5. Interpretation thresholds, their population and guideline version, and explicit limitations.
6. Source publication/version and date reviewed.
7. Reviewer name, professional role, date, decision, and any required follow-up.

## Priority order

- **Critical/high risk:** paediatric and neonatal dosing, IV fluids, infusion rates, oxytocin, carboplatin, phenytoin, renal dosing, corrected sodium, anticoagulation/stroke/bleeding scores, and acute-care severity scores.
- **Moderate risk:** renal/electrolyte and respiratory calculations, obstetric dating, hepatic fibrosis scores, haematology.
- **Lower direct clinical risk:** dimensional-analysis, concentration conversions, epidemiology and diagnostic test arithmetic. These still require unit and arithmetic verification.

## Automated testing status

GitHub Actions run `41980381559` completed successfully on commit `65a33d88f2b380ad8e491d3ba4c1d05231ee17a5`; its calculator-test and production-build steps passed. This is software verification only, not clinical validation.

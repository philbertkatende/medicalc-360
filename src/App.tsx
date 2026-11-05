import { useMemo, useState } from 'react';
import {
  Activity, Baby, Beaker, Calculator, ChevronRight, ClipboardList,
  HeartPulse, Menu, Pill, Search, ShieldCheck, Syringe, X,
} from 'lucide-react';

type Field = { key: string; label: string; unit?: string; type?: 'number' | 'select'; min?: number; max?: number; step?: number; options?: string[]; hint?: string };
type Result = { title: string; value: string; detail?: string };
type CalculatorDefinition = {
  id: string; name: string; category: string; description: string; fields: Field[];
  calculate: (v: Record<string, string>) => Result[];
  formula: string; reference: string; caution?: string;
};

const n = (v: Record<string, string>, key: string) => Number(v[key]);
const fmt = (v: number, digits = 2) => Number.isFinite(v) ? v.toLocaleString(undefined, { maximumFractionDigits: digits }) : '—';

const calculators: CalculatorDefinition[] = [
  {
    id: 'dose-volume', name: 'Dose to volume', category: 'Dosage & administration',
    description: 'Convert a prescribed dose into the volume to administer from a known liquid concentration.',
    fields: [
      { key: 'dose', label: 'Required dose', unit: 'mg', min: 0, step: 0.01 },
      { key: 'strength', label: 'Available concentration', unit: 'mg/mL', min: 0.0001, step: 0.01 },
    ],
    calculate: v => [{ title: 'Volume to administer', value: fmt(n(v, 'dose') / n(v, 'strength')) + ' mL', detail: 'Check the prescribed dose, product concentration and route before administration.' }],
    formula: 'Volume (mL) = Required dose (mg) ÷ Concentration (mg/mL)',
    reference: 'Standard dimensional analysis; verify against the product label and prescription.',
    caution: 'This calculator does not assess whether the prescribed dose is clinically appropriate.'
  },
  {
    id: 'weight-dose', name: 'Weight-based dose', category: 'Dosage & administration',
    description: 'Calculate a dose from a prescribed amount per kilogram and patient weight.',
    fields: [
      { key: 'weight', label: 'Body weight', unit: 'kg', min: 0.01, step: 0.1 },
      { key: 'dose', label: 'Prescribed dose', unit: 'mg/kg/dose', min: 0, step: 0.01 },
    ],
    calculate: v => [{ title: 'Calculated dose', value: fmt(n(v, 'weight') * n(v, 'dose')) + ' mg', detail: 'Compare with the recommended minimum and maximum dose for the specific medicine.' }],
    formula: 'Dose (mg) = Weight (kg) × Prescribed dose (mg/kg/dose)',
    reference: 'Standard dimensional analysis; medicine-specific prescribing reference required.',
    caution: 'Confirm whether the order is per dose or per day. Do not use without checking maximum-dose limits.'
  },
  {
    id: 'infusion-rate', name: 'IV infusion rate', category: 'IV & infusion',
    description: 'Calculate a pump rate from total volume and infusion duration.',
    fields: [
      { key: 'volume', label: 'Total volume', unit: 'mL', min: 0.01, step: 1 },
      { key: 'hours', label: 'Infusion duration', unit: 'hours', min: 0.01, step: 0.25 },
    ],
    calculate: v => [{ title: 'Pump rate', value: fmt(n(v, 'volume') / n(v, 'hours')) + ' mL/hour' }],
    formula: 'Rate (mL/hour) = Total volume (mL) ÷ Time (hours)',
    reference: 'Standard infusion arithmetic; confirm the prescribed duration and device settings.',
    caution: 'Does not calculate drug-specific infusion concentrations or establish a clinically appropriate rate.'
  },
  {
    id: 'drop-rate', name: 'Gravity drip rate', category: 'IV & infusion',
    description: 'Calculate drops per minute using the giving-set drop factor.',
    fields: [
      { key: 'volume', label: 'Volume to infuse', unit: 'mL', min: 0.01, step: 1 },
      { key: 'minutes', label: 'Infusion time', unit: 'minutes', min: 0.01, step: 1 },
      { key: 'factor', label: 'Giving-set drop factor', unit: 'drops/mL', min: 1, step: 1, hint: 'Read this from the actual giving set (e.g. 15, 20 or 60 drops/mL).' },
    ],
    calculate: v => [{ title: 'Drip rate', value: fmt((n(v, 'volume') * n(v, 'factor')) / n(v, 'minutes'), 0) + ' drops/minute', detail: 'Count drops over a full minute when setting a gravity infusion.' }],
    formula: 'Drops/min = [Volume (mL) × Drop factor (drops/mL)] ÷ Time (minutes)',
    reference: 'Standard infusion arithmetic; use the drop factor printed on the administration set.'
  },
  {
    id: 'bmi', name: 'Body mass index (BMI)', category: 'General & anthropometry',
    description: 'Calculate BMI from weight and height.',
    fields: [
      { key: 'weight', label: 'Weight', unit: 'kg', min: 1, step: 0.1 },
      { key: 'height', label: 'Height', unit: 'cm', min: 30, step: 0.1 },
    ],
    calculate: v => {
      const bmi = n(v, 'weight') / Math.pow(n(v, 'height') / 100, 2);
      const group = bmi < 18.5 ? 'Below the usual adult reference range' : bmi < 25 ? 'Usual adult reference range' : bmi < 30 ? 'Overweight range' : 'Obesity range';
      return [{ title: 'BMI', value: fmt(bmi) + ' kg/m²', detail: group }];
    },
    formula: 'BMI = Weight (kg) ÷ Height² (m²)',
    reference: 'WHO. Obesity: preventing and managing the global epidemic. WHO Technical Report Series 894 (2000).',
    caution: 'Adult BMI categories are not interpreted the same way in children, pregnancy, or some muscular/clinical populations.'
  },
  {
    id: 'bsa', name: 'Body surface area (Mosteller)', category: 'General & anthropometry',
    description: 'Estimate body surface area using the Mosteller equation.',
    fields: [
      { key: 'weight', label: 'Weight', unit: 'kg', min: 1, step: 0.1 },
      { key: 'height', label: 'Height', unit: 'cm', min: 30, step: 0.1 },
    ],
    calculate: v => [{ title: 'Body surface area', value: fmt(Math.sqrt((n(v, 'height') * n(v, 'weight')) / 3600)) + ' m²' }],
    formula: 'BSA (m²) = √[(Height (cm) × Weight (kg)) ÷ 3600]',
    reference: 'Mosteller RD. Simplified calculation of body-surface area. N Engl J Med. 1987;317:1098.'
  },
  {
    id: 'crcl', name: 'Creatinine clearance (Cockcroft–Gault)', category: 'Renal & electrolytes',
    description: 'Estimate creatinine clearance using age, weight, serum creatinine and sex coefficient.',
    fields: [
      { key: 'age', label: 'Age', unit: 'years', min: 18, max: 120, step: 1 },
      { key: 'weight', label: 'Body weight', unit: 'kg', min: 1, step: 0.1 },
      { key: 'scr', label: 'Serum creatinine', unit: 'mg/dL', min: 0.01, step: 0.01 },
      { key: 'sex', label: 'Sex coefficient', type: 'select', options: ['Male', 'Female'] },
    ],
    calculate: v => {
      const base = ((140 - n(v, 'age')) * n(v, 'weight')) / (72 * n(v, 'scr'));
      const crcl = v.sex === 'Female' ? base * 0.85 : base;
      return [{ title: 'Estimated creatinine clearance', value: fmt(crcl) + ' mL/min', detail: 'Cockcroft–Gault estimate; interpretation depends on body-weight choice and clinical context.' }];
    },
    formula: 'CrCl = [(140 − age) × weight (kg)] ÷ [72 × SCr (mg/dL)]; multiply by 0.85 for the female coefficient.',
    reference: 'Cockcroft DW, Gault MH. Prediction of creatinine clearance from serum creatinine. Nephron. 1976;16:31–41.',
    caution: 'Not interchangeable with laboratory-reported eGFR. The appropriate weight scalar, body composition, renal function stability and local dosing guidance matter. This basic version is for adults and does not adjust for dialysis.'
  },
  {
    id: 'anion-gap', name: 'Anion gap', category: 'Renal & electrolytes',
    description: 'Calculate the serum anion gap without potassium.',
    fields: [
      { key: 'na', label: 'Sodium (Na⁺)', unit: 'mmol/L', min: 50, step: 0.1 },
      { key: 'cl', label: 'Chloride (Cl⁻)', unit: 'mmol/L', min: 20, step: 0.1 },
      { key: 'hco3', label: 'Bicarbonate (HCO₃⁻)', unit: 'mmol/L', min: 1, step: 0.1 },
    ],
    calculate: v => [{ title: 'Anion gap', value: fmt(n(v, 'na') - n(v, 'cl') - n(v, 'hco3')) + ' mmol/L', detail: 'Interpret using the laboratory reference interval and albumin concentration.' }],
    formula: 'Anion gap = Na⁺ − (Cl⁻ + HCO₃⁻)',
    reference: 'Kraut JA, Madias NE. Serum anion gap: its uses and limitations in clinical medicine. Clin J Am Soc Nephrol. 2007;2:162–174.',
    caution: 'A normal anion gap varies by laboratory and analyser. Albumin affects the gap; a low albumin can mask an increased gap.'
  },
  {
    id: 'map', name: 'Mean arterial pressure (MAP)', category: 'Cardiovascular',
    description: 'Estimate MAP from systolic and diastolic blood pressure.',
    fields: [
      { key: 'sbp', label: 'Systolic BP', unit: 'mmHg', min: 20, step: 1 },
      { key: 'dbp', label: 'Diastolic BP', unit: 'mmHg', min: 10, step: 1 },
    ],
    calculate: v => [{ title: 'Estimated MAP', value: fmt((n(v, 'sbp') + 2 * n(v, 'dbp')) / 3) + ' mmHg', detail: 'Approximation assumes a typical heart rate and waveform.' }],
    formula: 'MAP ≈ [SBP + (2 × DBP)] ÷ 3',
    reference: 'Standard bedside approximation; direct arterial waveform integration is more accurate.',
    caution: 'This estimate may be less accurate at high heart rates or with abnormal arterial waveforms.'
  },
  {
    id: 'qtc', name: 'Corrected QT (Bazett)', category: 'Cardiovascular',
    description: 'Correct QT interval for heart rate using Bazett’s formula.',
    fields: [
      { key: 'qt', label: 'Measured QT interval', unit: 'ms', min: 1, step: 1 },
      { key: 'hr', label: 'Heart rate', unit: 'beats/min', min: 1, max: 250, step: 1 },
    ],
    calculate: v => {
      const rr = 60 / n(v, 'hr');
      const qtc = (n(v, 'qt') / 1000) / Math.sqrt(rr) * 1000;
      return [{ title: 'QTc (Bazett)', value: fmt(qtc, 0) + ' ms', detail: 'Bazett correction; review the ECG and clinical context.' }];
    },
    formula: 'QTc = QT ÷ √RR, with QT and RR expressed in seconds.',
    reference: 'Bazett HC. An analysis of the time-relations of electrocardiograms. Heart. 1920;7:353–370.',
    caution: 'Bazett may overcorrect at high heart rates and undercorrect at low heart rates. This calculator does not interpret an ECG or assess torsades risk.'
  },
  {
    id: 'edd', name: 'Estimated date of delivery (EDD)', category: 'Obstetrics & gynaecology',
    description: 'Estimate EDD from the first day of the last menstrual period (LMP), assuming a 28-day cycle.',
    fields: [{ key: 'lmp', label: 'First day of LMP', type: 'number', hint: 'Enter a date below.' }],
    calculate: v => {
      const d = new Date(v.lmp);
      if (Number.isNaN(d.getTime())) return [{ title: 'EDD', value: 'Enter a valid LMP date' }];
      d.setDate(d.getDate() + 280);
      return [{ title: 'Estimated date of delivery', value: d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }), detail: '40 weeks from the first day of the LMP.' }];
    },
    formula: 'EDD = LMP + 280 days (Naegele’s rule equivalent for a 28-day cycle).',
    reference: 'Standard obstetric dating convention; confirm gestational age using appropriate clinical assessment and ultrasound.',
    caution: 'Assumes a reliable LMP and a 28-day cycle. Not reliable for irregular cycles or uncertain dates.'
  },
  {
    id: 'gestational-age', name: 'Gestational age from LMP', category: 'Obstetrics & gynaecology',
    description: 'Estimate gestational age in weeks and days from the first day of the LMP.',
    fields: [{ key: 'lmp', label: 'First day of LMP', type: 'number', hint: 'Enter a date below.' }],
    calculate: v => {
      const start = new Date(v.lmp);
      if (Number.isNaN(start.getTime())) return [{ title: 'Gestational age', value: 'Enter a valid LMP date' }];
      const days = Math.floor((new Date().setHours(0,0,0,0) - start.setHours(0,0,0,0)) / 86400000);
      if (days < 0) return [{ title: 'Gestational age', value: 'LMP date is in the future' }];
      return [{ title: 'Estimated gestational age', value: Math.floor(days / 7) + ' weeks ' + (days % 7) + ' days', detail: 'Calculated from LMP; dating should be confirmed clinically.' }];
    },
    formula: 'Gestational age (days) = Current date − first day of LMP; convert days into weeks and days.',
    reference: 'Standard obstetric dating convention; confirm with ultrasound when indicated.',
    caution: 'Uses the device date and assumes a reliable LMP. Not a substitute for obstetric assessment.'
  },
];

const categories = ['All calculators', 'Dosage & administration', 'IV & infusion', 'Renal & electrolytes', 'Cardiovascular', 'Obstetrics & gynaecology', 'General & anthropometry'];
const icons: Record<string, typeof Calculator> = {
  'Dosage & administration': Pill, 'IV & infusion': Syringe, 'Renal & electrolytes': Beaker,
  Cardiovascular: HeartPulse, 'Obstetrics & gynaecology': Baby, 'General & anthropometry': Activity,
};

export default function App() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All calculators');
  const [selected, setSelected] = useState<CalculatorDefinition | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [showFormula, setShowFormula] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);

  const filtered = useMemo(() => calculators.filter(c =>
    (category === 'All calculators' || c.category === category) &&
    (c.name + ' ' + c.category + ' ' + c.description).toLowerCase().includes(query.toLowerCase())
  ), [query, category]);

  const choose = (calc: CalculatorDefinition) => {
    setSelected(calc);
    setValues(Object.fromEntries(calc.fields.map(f => [f.key, f.key === 'sex' ? 'Male' : ''])));
    setShowFormula(false);
    setMobileNav(false);
  };
  const result = useMemo(() => {
    if (!selected || selected.fields.some(f => !values[f.key])) return null;
    const invalid = selected.fields.some(f => {
      if (f.type === 'select' || f.key === 'lmp') return false;
      const x = Number(values[f.key]);
      return !Number.isFinite(x) || x <= 0 || (f.min !== undefined && x < f.min) || (f.max !== undefined && x > f.max);
    });
    if (invalid) return null;
    try { return selected.calculate(values); } catch { return null; }
  }, [selected, values]);

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="icon-button mobile-menu" onClick={() => setMobileNav(!mobileNav)} aria-label="Toggle navigation"><Menu size={20} /></button>
        <a className="brand" href="#" onClick={() => setSelected(null)}>
          <span className="brand-mark"><Activity size={21} /></span>
          <span><strong>MediCalc</strong><small>360</small></span>
        </a>
        <div className="topbar-label">MEDICAL & PHARMACEUTICAL CALCULATORS</div>
        <div className="topbar-right"><span className="status-dot" /> Educational tool · In development</div>
      </header>

      <div className="layout">
        <aside className={mobileNav ? 'sidebar open' : 'sidebar'}>
          <div className="sidebar-heading">CALCULATOR LIBRARY</div>
          <nav>
            {categories.map((cat, i) => {
              const Icon = icons[cat] || ClipboardList;
              return <button key={cat} className={category === cat ? 'nav-item active' : 'nav-item'} onClick={() => { setCategory(cat); setSelected(null); setMobileNav(false); }}>
                <Icon size={17} /><span>{cat}</span>{i === 0 && <span className="nav-count">{calculators.length}</span>}
              </button>;
            })}
          </nav>
          <div className="sidebar-note">
            <ShieldCheck size={18} />
            <div><strong>Safety first</strong><p>Every result needs clinical verification. References and limitations are shown with each calculator.</p></div>
          </div>
          <div className="sidebar-footer">VERSION 0.1.0 · EARLY ACCESS</div>
        </aside>

        <main className="main-content">
          <div className="page-intro">
            <div className="eyebrow">THE CLINICAL CALCULATION WORKSPACE</div>
            <h1>{selected ? selected.name : 'Medical calculations, made clearer.'}</h1>
            <p>{selected ? selected.description : 'A growing library of medical and pharmaceutical calculators, designed for clear working, transparent formulas and safer decisions.'}</p>
          </div>

          {!selected ? <>
            <div className="search-wrap"><Search size={19} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search calculators, categories or clinical terms…" /><kbd>⌕</kbd></div>
            <div className="section-heading"><div><h2>{category}</h2><p>{filtered.length} {filtered.length === 1 ? 'calculator' : 'calculators'} available in this section</p></div><span className="library-tag">STARTER LIBRARY</span></div>
            {filtered.length ? <div className="calculator-grid">
              {filtered.map(calc => {
                const Icon = icons[calc.category] || Calculator;
                return <button className="calc-card" key={calc.id} onClick={() => choose(calc)}>
                  <span className="calc-icon"><Icon size={20} /></span>
                  <span className="calc-category">{calc.category}</span>
                  <strong>{calc.name}</strong>
                  <p>{calc.description}</p>
                  <span className="card-action">Open calculator <ChevronRight size={15} /></span>
                </button>;
              })}
            </div> : <div className="empty-state"><Search size={28} /><strong>No calculators found</strong><p>Try a different search term or category.</p></div>}
            <div className="roadmap-panel">
              <div className="roadmap-icon"><ClipboardList size={21} /></div>
              <div><strong>This is the foundation, not the finished catalogue.</strong><p>Next modules will expand into pharmacokinetics, paediatrics and neonatology, toxicology, critical care, antimicrobial dosing, QC/QA, epidemiology, biostatistics and pharmacoeconomics.</p></div>
            </div>
          </> : <div className="calculator-workspace">
            <button className="back-link" onClick={() => setSelected(null)}>← Back to calculator library</button>
            <div className="workspace-grid">
              <section className="input-panel">
                <div className="panel-title"><Calculator size={18} /><div><h2>Enter patient or calculation data</h2><p>Use the units shown beside each field.</p></div></div>
                <div className="fields">
                  {selected.fields.map(field => <label className="field" key={field.key}>
                    <span>{field.label}</span>
                    {field.key === 'lmp' ? <input type="date" value={values[field.key] || ''} onChange={e => setValues({ ...values, [field.key]: e.target.value })} /> :
                    field.type === 'select' ? <select value={values[field.key] || ''} onChange={e => setValues({ ...values, [field.key]: e.target.value })}>{field.options?.map(o => <option key={o}>{o}</option>)}</select> :
                    <div className="input-unit"><input type="number" min={field.min} max={field.max} step={field.step || 'any'} value={values[field.key] || ''} onChange={e => setValues({ ...values, [field.key]: e.target.value })} placeholder="Enter value" /><span>{field.unit}</span></div>}
                    {field.hint && <small>{field.hint}</small>}
                  </label>)}
                </div>
                <button className="reset-button" onClick={() => setValues(Object.fromEntries(selected.fields.map(f => [f.key, f.key === 'sex' ? 'Male' : ''])))}><X size={15} /> Clear values</button>
              </section>
              <section className="result-panel">
                <div className="result-header"><span className="result-icon"><Activity size={19} /></span><div><h2>Calculation result</h2><p>Output is generated from the values entered.</p></div></div>
                {result ? <div className="results">{result.map((r, i) => <div className="result-value" key={i}><span>{r.title}</span><strong>{r.value}</strong>{r.detail && <p>{r.detail}</p>}</div>)}</div> : <div className="result-placeholder"><Calculator size={27} /><strong>Awaiting complete inputs</strong><p>Enter valid values in all required fields to calculate.</p></div>}
                <div className="formula-box"><button onClick={() => setShowFormula(!showFormula)}>{showFormula ? 'Hide' : 'Show'} formula and reference <ChevronRight size={15} className={showFormula ? 'rotate' : ''} /></button>
                  {showFormula && <div className="formula-content"><strong>Formula</strong><p>{selected.formula}</p><strong>Reference / basis</strong><p>{selected.reference}</p></div>}
                </div>
              </section>
            </div>
            <div className="clinical-warning"><ShieldCheck size={19} /><div><strong>Clinical-use warning</strong><p>{selected.caution || 'Confirm the inputs, units, assumptions and result against an authoritative clinical reference before use.'} Results are educational estimates and must not replace professional judgement, local protocols or independent checking.</p></div></div>
          </div>}
          <footer className="footer"><span>© 2026 MediCalc 360</span><span>Built for learning, calculation transparency and patient-safety awareness.</span></footer>
        </main>
      </div>
    </div>
  );
}
import {describe,it,expect} from 'vitest';
import {calculators,runCalculator} from './calculators';
describe('MediCalc 360 calculator registry and arithmetic',()=>{
 it('contains at least 65 unique calculator definitions',()=>{expect(calculators.length).toBeGreaterThanOrEqual(65);expect(new Set(calculators.map(c=>c.id)).size).toBe(calculators.length)});
 it('calculates dose to volume',()=>expect(runCalculator('dose-volume',{dose:'500',strength:'100'})[0].value).toBe('5 mL'));
 it('calculates Cockcroft-Gault example',()=>expect(parseFloat(runCalculator('crcl',{age:'40',weight:'70',scr:'1',sex:'Male'})[0].value)).toBeCloseTo(97.22,1));
 it('calculates Mosteller BSA',()=>expect(runCalculator('bsa',{height:'170',weight:'70'})[0].value).toBe('1.82 m²'));
 it('rejects invalid ranges',()=>expect(()=>runCalculator('bmi',{weight:'-1',height:'170'})).toThrow());
 it('calculates 4-2-1 for 25 kg',()=>expect(runCalculator('peds-421',{weight:'25'})[0].value).toBe('65 mL/hour'));
 it('calculates qSOFA criteria',()=>expect(runCalculator('qsofa',{rr:'24',sbp:'95',mental:'Yes'})[0].value).toBe('3 points'));
 it('calculates GCS total',()=>expect(runCalculator('gcs',{eye:'4',verbal:'5',motor:'6'})[0].value).toBe('15/15'));
 it('calculates corrected phenytoin estimate',()=>expect(parseFloat(runCalculator('phenytoin-corrected',{total:'15',albumin:'2'})[0].value)).toBeCloseTo(30,1));
 it('calculates carboplatin Calvert arithmetic',()=>expect(runCalculator('calvert',{auc:'5',gfr:'80'})[0].value).toBe('525 mg'));
});
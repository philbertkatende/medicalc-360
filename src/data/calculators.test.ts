import {describe,it,expect} from 'vitest';
import {calculators,runCalculator} from './calculators';
describe('MediCalc 360 registry and arithmetic',()=>{
 it('contains at least 40 distinct calculators',()=>{expect(calculators.length).toBeGreaterThanOrEqual(40);expect(new Set(calculators.map(c=>c.id)).size).toBe(calculators.length)});
 it('calculates dose to volume',()=>expect(runCalculator('dose-volume',{dose:'500',strength:'100'})[0].value).toBe('5 mL'));
 it('calculates Cockcroft-Gault example',()=>expect(parseFloat(runCalculator('crcl',{age:'40',weight:'70',scr:'1',sex:'Male'})[0].value)).toBeCloseTo(97.22,1));
 it('calculates Mosteller BSA',()=>expect(runCalculator('bsa',{height:'170',weight:'70'})[0].value).toBe('1.82 m²'));
 it('rejects invalid ranges',()=>expect(()=>runCalculator('bmi',{weight:'-1',height:'170'})).toThrow());
 it('calculates 4-2-1 for 25 kg',()=>expect(runCalculator('peds-421',{weight:'25'})[0].value).toBe('65 mL/hour'));
});
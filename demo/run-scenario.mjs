import { expiredCouponScenario, duplicateShippingScenario } from '../src/demo/scenarios.mjs';

const name = process.argv[2];
const result = name === 'expired-coupon' ? expiredCouponScenario()
  : name === 'duplicate-shipping' ? duplicateShippingScenario(process.argv.includes('--two-parcels') ? 2 : 1)
  : null;
if (!result) { console.error('Use expired-coupon or duplicate-shipping.'); process.exit(2); }
console.log(JSON.stringify(result, null, 2));
process.exitCode = result.pass ? 0 : 1;

const nock = require('nock');
const currency = require('./');

test('convert 1 USD to EUR', async () => {
  expect(await currency({amount:'1', from:'USD', to:'EUR'})).toBe(0.899);
});

test('convert 1 USD to USD', async () => {
  expect(await currency({amount:'1', from:'USD', to:'USD'})).toBe(1);
});

test('convert 1 EUR to USD', async () => {
  expect(await currency({amount:'1', from:'EUR', to:'USD'})).toBe(1.1122);
});

test('convert 1 BTC to USD', async () => {
  expect(await currency({amount:'1', from:'BTC', to:'USD'})).toBe(8944.49);
});

test('convert 1 BTC to EUR', async () => {
  expect(await currency({amount:'1', from:'BTC', to:'EUR'})).toBe(8048.11);
});

test('convert without arguments', async () => {
  expect(await currency({})).toBe(0.00011180067281644902);
});

test('convert with amount only', async () => {
  expect(await currency({amount:'1'})).toBe(0.00011180067281644902);
});

test('convert with amount and (from) currency only', async () => {
  expect(await currency({amount:'1', from:'USD'})).toBe(0.00011180067281644902);
});

test('convert without a correct `from` or `to` currency value', async () => {
  expect(await currency({amount:'1', from:'EU', to:'FR'})).toThrowError('💵 Please specify a valid `from` and/or `to` currency value!');
});
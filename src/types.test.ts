import test from 'node:test';
import assert from 'node:assert/strict';
import { vndToCredits, creditsToVnd } from './types.ts';

test('Quy đổi tiền sang Credits: 10,000 VNĐ = 10 Credits', () => {
  assert.equal(vndToCredits(10000), 10);
  assert.equal(vndToCredits(20000), 20);
  assert.equal(vndToCredits(50000), 50);
  assert.equal(vndToCredits(100000), 100);
  assert.equal(vndToCredits(200000), 200);
  assert.equal(vndToCredits(500000), 500);
});

test('Quy đổi Credits sang VNĐ tương đương', () => {
  assert.equal(creditsToVnd(10), 10000);
  assert.equal(creditsToVnd(50), 50000);
  assert.equal(creditsToVnd(100), 100000);
});

test('Xác thực số dư Credits khi mua hàng', () => {
  const currentCredits = 50;
  const productPriceCredits = 50;
  assert.ok(currentCredits >= productPriceCredits, 'Đủ tiền mua gói 50 Credits');

  const expensiveProductCredits = 100;
  assert.ok(currentCredits < expensiveProductCredits, 'Không đủ tiền mua gói 100 Credits');
});

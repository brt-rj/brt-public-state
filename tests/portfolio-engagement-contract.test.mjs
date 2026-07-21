import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const payload = JSON.parse(
  readFileSync('analytics/portfolio-engagement/latest.json', 'utf8'),
);

test('portfolio engagement placeholder follows the unavailable freshness contract', () => {
  assert.equal(payload.ok, false);
  assert.equal(payload.status, 'unavailable');
  assert.equal(payload.error, null);
  assert.deepEqual(payload.freshness, {
    last_success_at: null,
    last_attempt_at: null,
  });
  assert.equal(payload.coverage.window_days, 30);
  assert.equal(payload.coverage.observed_days, 0);
  assert.equal(payload.coverage.complete, false);
});

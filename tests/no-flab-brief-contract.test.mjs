import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const latest = JSON.parse(
  readFileSync('briefs/no-flab-brief/latest.json', 'utf8'),
);
const archive = JSON.parse(
  readFileSync('briefs/no-flab-brief/archive.json', 'utf8'),
);

test('No-Flab Brief placeholder is a sanitized needs-mart release', () => {
  assert.equal(latest.version, 1);
  assert.equal(latest.status, 'NEEDS MART');
  assert.equal(latest.report_date, null);
  assert.deepEqual(latest.coverage, {
    enabled_source_classes: [],
    completed_source_classes: [],
    missing_source_classes: [],
  });
  assert.deepEqual(latest.items, []);
  assert.equal(JSON.stringify(latest).includes('raw_content'), false);
  assert.equal(JSON.stringify(latest).includes('error'), false);
});

test('No-Flab Brief archive starts as an empty immutable release index', () => {
  assert.deepEqual(archive, {
    version: 1,
    latest_report_date: null,
    briefs: [],
  });
});

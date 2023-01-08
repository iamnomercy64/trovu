import CallHandler from '../src/js/modules/CallHandler.js';
import Env from '../src/js/modules/Env.js';
import 'isomorphic-fetch';
import jsyaml from 'js-yaml';
import fs from 'fs';

const docroot = 'http://127.0.0.1:8081/process/index.html?#debug=1';

main();

async function main() {
  let calls = jsyaml.load(fs.readFileSync('./__tests__/calls.yml', 'utf8'));
  for (const call of calls) {
    test(JSON.stringify(call), async () => {
      await testCallUnit(call);
    });
  }
}

async function testCallUnit(call) {
  const env = new Env();
  env.language = 'en';
  env.country = 'us';
  await env.populate(call);
  const response = await CallHandler.getRedirectResponse(env);
  if (call.expected.redirectUrl) {
    expect(response.redirectUrl).toMatch(call.expected.redirectUrl);
  } else {
    expect(response.status).toMatch(call.expected.status);
  }
}

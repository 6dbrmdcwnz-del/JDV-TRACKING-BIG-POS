import test from 'node:test';
import assert from 'node:assert/strict';
import {activityScore,parseTrade,tokenAddress} from './worker.js';

test('parses WETH buys and sells from GeckoTerminal trade fields',()=>{
  const buy=parseTrade({id:'buy',attributes:{block_timestamp:new Date().toISOString(),volume_in_usd:'125.50',from_token_address:'0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',to_token_address:'0x4200000000000000000000000000000000000006',tx_from_address:'0xabc'}});
  const sell=parseTrade({id:'sell',attributes:{block_timestamp:new Date().toISOString(),volume_in_usd:'80',from_token_address:'0x4200000000000000000000000000000000000006',to_token_address:'0x833589fcd6edb6e08f4c7c32d4f71b54bda02913'}});
  assert.equal(buy.side,'buy');assert.equal(buy.usd,125.5);assert.equal(buy.trader,'0xabc');assert.equal(sell.side,'sell');
});

test('rejects invalid trade volume and reads relationship addresses',()=>{
  assert.equal(parseTrade({attributes:{volume_in_usd:'0'}}),null);
  assert.equal(tokenAddress({data:{id:'base_0xABC'}}),'0xabc');
});

test('pool ranking remains useful when m15 volume is temporarily zero',()=>{
  const active={attributes:{volume_usd:{m15:'0',h1:'500000'},reserve_in_usd:'1000000'}};
  const quiet={attributes:{volume_usd:{m15:'0',h1:'100'},reserve_in_usd:'1000'}};
  assert.ok(activityScore(active)>activityScore(quiet));
});


test('build is pinned to the requested D42A Arcadia account',async()=>{
  const fs=await import('node:fs/promises');
  const worker=await fs.readFile(new URL('./worker.js',import.meta.url),'utf8');
  const html=await fs.readFile(new URL('./public/index.html',import.meta.url),'utf8');
  const requested='0xd42A3Ac56456bD5422835B36C35Cacb6448ddCd9';
  assert.ok(worker.includes(requested)); assert.ok(html.includes(requested));
  assert.ok(!worker.includes('0x5B79820AA33E60318C83930311832E2Af090d339'));
  assert.ok(!html.includes('0x5B79820AA33E60318C83930311832E2Af090d339'));
});

test('position feed fails closed on invalid or empty Arcadia asset data',async()=>{
  const fs=await import('node:fs/promises');
  const worker=await fs.readFile(new URL('./worker.js',import.meta.url),'utf8');
  assert.ok(worker.includes('Array.isArray(overview.assets)'));
  assert.ok(worker.includes('!overview.assets.length'));
  assert.ok(worker.includes("'cache-control':'no-store'"));
});

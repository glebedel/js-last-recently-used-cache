import LRU from '../src';

describe('instanciate class', () => {
  it('instance has params property', () => {
    const instance = new LRU();
    expect(typeof instance.limitSize).toBe('number');
  });
});
describe('adds elements within limits', () => {
  const instance = new LRU({ limitSize: 5 });
  it('adds', () => {
    instance.set('1', 'one');
    instance.set('2', 'two');
    instance.set('3', 'three');
    expect(instance.size()).toBe(3);
  });
  it('gets most recently used node/key/value', () => {
    const recentPair = instance.mostRecent();
    const recentKey = instance.mostRecentKey();
    const recentValue = instance.mostRecentValue();
    expect(recentPair[0]).toBe(recentKey);
    expect(recentPair[1]).toBe(recentValue);
    expect(recentValue).toBe('three');
    expect(recentKey).toBe('3');
  });
  it('gets least recently used node/key/value', () => {
    const leastRecentPair = instance.leastRecent();
    const leastRecentKey = instance.leastRecentKey();
    const leastRecentValue = instance.leastRecentValue();
    expect(leastRecentPair[0]).toBe(leastRecentKey);
    expect(leastRecentPair[1]).toBe(leastRecentValue);
    expect(leastRecentValue).toBe('one');
    expect(leastRecentKey).toBe('1');
  });
  it('hits the cache & bumped node if already in cache', () => {
    expect(LRU.getNodeValue(instance.list.first())).toBe('three');
    expect(LRU.getNodeValue(instance.list.last())).toBe('one');
    const bumped = instance.set('1', 'one');
    expect(bumped).toBe(instance.list.first());
    expect(LRU.getNodeValue(instance.list.first())).toBe('one');
  });
  it('keeps cache under its limit', () => {
    instance.set('4', 'four');
    instance.set('5', 'five');
    expect(instance.size()).toBe(5);
    const leastRecentKey = instance.leastRecentKey();
    expect(instance.hasKey(leastRecentKey)).toBe(true);
    instance.set('6', 'six');
    expect(instance.size()).toBe(5);
    expect(instance.hasKey(leastRecentKey)).toBe(false);
    expect(instance.mostRecentKey()).toBe('6');
  });
  it('removes keys from cache', () => {
    const currentSize = instance.size();
    expect(instance.hasKey('4')).toBe(true);
    instance.delete('4');
    expect(instance.hasKey('4')).toBe(false);
    expect(instance.size()).toBe(currentSize - 1);
    expect(instance.hasKey('3')).toBe(true);
    instance.delete('3');
    expect(instance.hasKey('3')).toBe(false);
    expect(instance.size()).toBe(currentSize - 2);
  });
  it('adds an iterable object of key/pair', () => {
    const currentSize = instance.size();
    const cacheMap = new Map();
    cacheMap.set('7', 'seven').set('8', 'eight');
    instance.set(cacheMap.entries());
    expect(instance.size()).toBe(currentSize + cacheMap.size);
    expect(instance.hasKey('7')).toBe(true);
    expect(instance.hasKey('8')).toBe(true);
  });
});

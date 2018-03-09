import LRU from '../src';

describe('instanciate class', () => {
  it('instance has params property', () => {
    const instance = new LRU();
    expect(typeof instance.params).toEqual('object');
  });
});
describe('adds elements within limits', () => {
  const instance = new LRU({ limitSize: 5 });
  it('adds', () => {
    instance.add('1', 'one');
    instance.add('2', 'two');
    instance.add('3', 'three');
    expect(instance.size()).toBe(3);
  });
  it('hits the cache & bumped node if already in cache', () => {
    expect(LRU.getNodeValue(instance.list.first())).toBe('three');
    expect(LRU.getNodeValue(instance.list.last())).toBe('one');
    const bumped = instance.add('1', 'one');
    expect(bumped).toBe(instance.list.first());
    expect(LRU.getNodeValue(instance.list.first())).toBe('one');
  });
  // it('items limit', () => {
  //   instance
  //     .add('test1')
  //     .add('test2')
  //     .add('test3');
  //   expect(instance.length).toEqual(3);
  //   expect(instance.add('test4')).toThrow();
  // });
});

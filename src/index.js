const DoubleLinkedList = require('js-doublelinkedlist');
const debug = require('debug')('js-lru');

class LRU {
  /**
   * Creates an instance of LRU.
   * @constructs LRU
   * @param {Object} params parameter objects
   * @param {Int} params.limitSize size limit (in bytes) including keys and values of the cache
   * @param {Int} params.limitLength size limit (in bytes) including keys and values of the cache
   * @memberof LRU
   */
  constructor({ limitLength = 100 } = {}) {
    this.params = {
      limitLength,
    };
    this.map = new Map();
    this.list = new DoubleLinkedList();
  }
  hasKey(key) {
    return this.map.has(key);
  }
  getNode(key) {
    return this.map.get(key);
  }
  pop() {
    const toRemove = this.list.rpop();
    debug(`key "${this.getNodeKey(toRemove)}" removed from cache`);
    this.map.delete(this.constructor.getNodeKey(toRemove));
  }
  bump(key) {
    const node = this.getNode(key);
    debug(`bump "${key}" to last recently used status`);
    return this.bumpNode(node);
  }
  bumpNode(node) {
    const [key, value] = node.data;
    this.list.remove(node);
    const bumpedNode = this.list.ladd([key, value]);
    this.map.set(key, bumpedNode);
    return bumpedNode;
  }
  addSinglePair(key, value) {
    let node;
    debug(`trying to add ${key} to the cache`);
    if (!this.hasKey(key)) {
      if (this.list.length >= this.limitLength) {
        debug(`hit cache limit when inserting "${key}"`);
        this.pop();
      }
      debug(`adding "${key}" in cache`);
      node = this.list.ladd([key, value]);
      this.map.set(key, node);
    } else {
      debug(`hit cache for "${key}"`);
      node = this.bump(key);
    }
    return node;
  }
  add(...args) {
    // if only one argument and it has iterator then assume we are passed several key/value pair to cache
    if (args.length === 1 && args[0][Symbol.iterator] === 'function') {
      // cache each key/value pair and return an array of all the nodes stored in the cache
      return args.map(([key, value]) => this.addSinglePair(key, value));
    }
    // assume we only got one key/value and cache it
    return this.addSinglePair(...args);
  }
  get(key) {
    const cachedNode = this.getNode(key);
    if (cachedNode) {
      return this.constructor.getNodeValue(cachedNode);
    }
    return undefined;
  }
  size() {
    return this.map.size;
  }
  static getNodeValue(node) {
    return node.data[1];
  }
  static getNodeKey(node) {
    return node.data[0];
  }
}
export default LRU;

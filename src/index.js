const DoubleLinkedList = require('js-doublelinkedlist');
const debug = require('debug')('js-lru');

/**
 * @classdesc Last Recently Used cache.
 * @classdesc add: O(1)
 * @classdesc get: O(1)
 * @classdesc delete: O(1)
 */
class LRU {
  /**
   * Creates an instance of LRU.
   * @constructs LRU
   * @param {Number} params.limitSize size limit (in number of cached elements)
   * @memberof LRU
   */
  constructor({ limitSize = 100 } = {}) {
    this.limitSize = limitSize;
    this.map = new Map();
    this.list = new DoubleLinkedList();
  }
  /**
   * check if cache contains specific key
   * @param {any} key to check if in cache
   * @returns {Boolean} whether or not key is in cache
   * @memberof LRU
   */
  hasKey(key) {
    return this.map.has(key);
  }
  /**
   * gets the double linked list's node corresponding to specific key
   * @param {any} key cached element key
   * @returns {Node}
   * @memberof LRU
   */
  getNode(key) {
    return this.map.get(key);
  }
  /**
   * pop the least recently used key/value in the cache
   * (pops the last element of the double linked list and removes it from hashmap)
   * @memberof LRU
   */
  pop() {
    const toRemove = this.list.rpop();
    const key = this.constructor.getNodeKey(toRemove);
    debug(`key "${key}" removed from cache`);
    this.map.delete(key);
  }
  /**
   * bump a specific cached data to last recently used
   * (adds it to front of the double linked list list)
   * @param {any} key key of the data to bump
   * @returns {Node} new node created at the front of the list with the same cached data
   * @memberof LRU
   */
  bump(key) {
    const node = this.getNode(key);
    debug(`bump "${key}" to last recently used status`);
    return this.bumpNode(node);
  }
  /**
   * bump a specific node to last recently used (front of the linked list)
   *
   * @param {Node} node node to bump to front of list
   * @returns {Node} new node placed at front of list with data of passed node (passed nodeis removed)
   * @memberof LRU
   */
  bumpNode(node) {
    const [key, value] = node.data;
    this.list.remove(node);
    const bumpedNode = this.list.ladd([key, value]);
    this.map.set(key, bumpedNode);
    return bumpedNode;
  }
  /**
   * set a single key/value pair in the cache
   * @param {any} key to identify the data with
   * @param {any} value value to store in cache
   * @returns {Node} node created in doubly linked list with data property being an array of [key,value]
   * @memberof LRU
   */
  setSinglePair(key, value) {
    let node;
    debug(`trying to add ${key} to the cache`);
    if (!this.hasKey(key)) {
      if (this.limitSize && this.list.length >= this.limitSize) {
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
  /**
   * set new data into the cache
   *
   * @param {Array<any, any>|Array<Array<any, any>>} key/value pair(s) to store in cache
   * @returns {Array<Node>|Node} node(s) inserted in doubly linked list
   * @memberof LRU
   */
  set(...args) {
    // if only one argument and it has iterator then assume we are passed several key/value pair to cache
    if (args.length === 1 && typeof args[0][Symbol.iterator] === 'function') {
      // cache each key/value pair and return an array of all the nodes stored in the cache
      return [...args[0]].map(([key, value]) => this.setSinglePair(key, value));
    }
    // assume we only got one key/value and cache it
    return this.setSinglePair(...args);
  }
  /**
   * delete a specific value from the cache by its key
   * (delets it from the hashmap and the doubly linked list)
   * @param {any} key to delete from cache
   * @memberof LRU
   */
  delete(key) {
    const node = this.getNode(key);
    if (node) {
      this.list.remove(node);
      this.map.delete(key);
    }
  }
  /**
   * Get the data stored in cache by its key
   * @param {any} key identifier of the data to get from cache
   * @returns {any} data stored in cache for specified key
   * @memberof LRU
   */
  get(key) {
    const cachedNode = this.getNode(key);
    if (cachedNode) {
      return this.constructor.getNodeValue(cachedNode);
    }
    return undefined;
  }
  /**
   * gets the number of items in the cache
   * @returns {Number}
   * @memberof LRU
   */
  size() {
    return this.map.size;
  }
  /**
   * Gets the identifier (key) of the last recently used key/value pair stored in cache
   * @returns {any}
   * @memberof LRU
   */
  mostRecentKey() {
    return this.constructor.getNodeKey(this.list.first());
  }
  /**
   * Gets the identifier (key) of the least recently used key/value pair stored in cache
   * @returns {any}
   * @memberof LRU
   */
  leastRecentKey() {
    return this.constructor.getNodeKey(this.list.last());
  }
  /**
   * Gets most recently used value stored in cache
   * @returns {any}
   * @memberof LRU
   */
  mostRecentValue() {
    return this.constructor.getNodeValue(this.list.first());
  }
  /**
   * Gets most recently used value stored in cache
   * @returns {any}
   * @memberof LRU
   */
  leastRecentValue() {
    return this.constructor.getNodeValue(this.list.last());
  }
  /**
   * Gets most recently used key/value pair stored in cache
   * @returns {Array<any, any>} array with key of cached data at index `0` and value at index `1`
   * @memberof LRU
   */
  mostRecent() {
    return this.list.first().data;
  }
  /**
   * Gets least recently used key/value pair stored in cache
   * @returns {Array<any, any>} array with key of cached data at index `0` and value at index `1`
   * @memberof LRU
   */
  leastRecent() {
    return this.list.last().data;
  }
  /**
   * gets the value of a specific node from the doubly linked list
   * (gets the second index of the node's data)
   * @static
   * @param {Node} node node in doubly linked list `this.list`
   * @returns {any} cached value
   * @memberof LRU
   */
  static getNodeValue(node) {
    return node.data[1];
  }
  /**
   * gets the key of a specific node from the doubly linked list
   * (gets the second index of the node's data)
   * @static
   * @param {Node} node node in doubly linked list `this.list`
   * @returns {any} cached key
   * @memberof LRU
   */
  static getNodeKey(node) {
    return node.data[0];
  }
}
export default LRU;

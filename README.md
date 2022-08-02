# js-last-recently-used-cache

simple LRU cache implementation in javascript. It uses a doubly linked list (`instance.list`) and a hash map (`instance.map`) to get/add/remove cache elements with O(1) time complexity.

## Install

    $ npm install --save js-last-recently-used-cache

## Usage

```js
import LRU from 'js-last-recently-used-cache'

const cache = new LRU({limitSize: 3});
cache.set('1', 'one')
cache.set('2', 'two')
cache.set('3', 'three')
cache.get('1') // 'one'
cache.get('3') // 'three'
cache.set('4', 'four');
cache.get('4') //four
cache.has('1') // false (bumped out since cache has a size limit of 3)
```

## API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

#### Table of Contents

-   [LRU](#lru)
    -   [has](#has)
    -   [set](#set)
    -   [get](#get)
    -   [size](#size)
    -   [delete](#delete)
    -   [mostRecentKey](#mostrecentkey)
    -   [leastRecentKey](#leastrecentkey)
    -   [mostRecentValue](#mostrecentvalue)
    -   [leastRecentValue](#leastrecentvalue)
    -   [mostRecent](#mostrecent)
    -   [leastRecent](#leastrecent)
    -   [pop](#pop)
    -   [bump](#bump)
    -   [bumpNode](#bumpnode)
    -   [setSinglePair](#setsinglepair)
    -   [getNode](#getnode)
    -   [getNodeValue](#getnodevalue)
    -   [getNodeKey](#getnodekey)

### LRU

**Parameters**

-   `params.limitSize` **[Number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)** size limit (in number of cached elements) (optional, default `{}`)
    -   `params.limitSize.limitSize`   (optional, default `100`)

#### has

check if cache contains specific key

**Parameters**

-   `key` **any** to check if in cache

Returns **[Boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** whether or not key is in cache

#### set

set new data into the cache

**Parameters**

-   `args` **...any** 
-   `key/value` **([Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;any, any> | [Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;any, any>>)** pair(s) to store in cache

Returns **([Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[Node](https://developer.mozilla.org/docs/Web/API/Node/nextSibling)> | [Node](https://developer.mozilla.org/docs/Web/API/Node/nextSibling))** node(s) inserted in doubly linked list

#### get

Get the data stored in cache by its key

**Parameters**

-   `key` **any** identifier of the data to get from cache

Returns **any** data stored in cache for specified key

#### size

gets the number of items in the cache

Returns **[Number](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number)** 

#### delete

delete a specific value from the cache by its key
(delets it from the hashmap and the doubly linked list)

**Parameters**

-   `key` **any** to delete from cache

#### mostRecentKey

Gets the identifier (key) of the last recently used key/value pair stored in cache

Returns **any** 

#### leastRecentKey

Gets the identifier (key) of the least recently used key/value pair stored in cache

Returns **any** 

#### mostRecentValue

Gets most recently used value stored in cache

Returns **any** 

#### leastRecentValue

Gets most recently used value stored in cache

Returns **any** 

#### mostRecent

Gets most recently used key/value pair stored in cache

Returns **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;any, any>** array with key of cached data at index `0` and value at index `1`

#### leastRecent

Gets least recently used key/value pair stored in cache

Returns **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;any, any>** array with key of cached data at index `0` and value at index `1`

#### pop

pop the least recently used key/value in the cache
(pops the last element of the double linked list and removes it from hashmap)

#### bump

bump a specific cached data to last recently used
(adds it to front of the double linked list list)

**Parameters**

-   `key` **any** key of the data to bump

Returns **[Node](https://developer.mozilla.org/docs/Web/API/Node/nextSibling)** new node created at the front of the list with the same cached data

#### bumpNode

bump a specific node to last recently used (front of the linked list)

**Parameters**

-   `node` **[Node](https://developer.mozilla.org/docs/Web/API/Node/nextSibling)** node to bump to front of list

Returns **[Node](https://developer.mozilla.org/docs/Web/API/Node/nextSibling)** new node placed at front of list with data of passed node (passed nodeis removed)

#### setSinglePair

set a single key/value pair in the cache

**Parameters**

-   `key` **any** to identify the data with
-   `value` **any** value to store in cache

Returns **[Node](https://developer.mozilla.org/docs/Web/API/Node/nextSibling)** node created in doubly linked list with data property being an array of [key,value]

#### getNode

gets the double linked list's node corresponding to specific key

**Parameters**

-   `key` **any** cached element key

Returns **[Node](https://developer.mozilla.org/docs/Web/API/Node/nextSibling)** 

#### getNodeValue

gets the value of a specific node from the doubly linked list
(gets the second index of the node's data)

**Parameters**

-   `node` **[Node](https://developer.mozilla.org/docs/Web/API/Node/nextSibling)** node in doubly linked list `this.list`

Returns **any** cached value

#### getNodeKey

gets the key of a specific node from the doubly linked list
(gets the second index of the node's data)

**Parameters**

-   `node` **[Node](https://developer.mozilla.org/docs/Web/API/Node/nextSibling)** node in doubly linked list `this.list`

Returns **any** cached key

## License

MIT © [Guillaume](https://github.com/glebedel)

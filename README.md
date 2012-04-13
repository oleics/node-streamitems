Node StreamItems
================

### Simple stream item detector. Emits 'item' and 'garbage'.

Created to detect single JSON items in a stream, but might be usefull for other formats.

### Installation

```npm install streamitems```

### Usage

```js
var request = require('request'),
    streamitems = require('streamitems');

var rs = streamitems();

rs
  .on('garbage', function(b) {
    console.log('garbage:', JSON.stringify(b));
  })
  .on('item', function(b) {
    console.log('item:', JSON.parse(b));
  })
;

request('http://localhost/_changes?feed=continuous').pipe(rs);
```

Class Filewalker
----------------

Inherits from events.EventEmitter

### Options

None.

### Properties

```_delims``` (default: ```[['{', '}'],['[', ']']]```)

```escapeChar``` (default: \)

### Methods

None.

### Events

* item
  * string of item detected
* garbage
  * string of nonsense

MIT License
-----------

Copyright (c) 2012 Oliver Leics <oliver.leics@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

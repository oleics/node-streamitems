
module.exports = StreamItems;

var util = require('util'),
    stream = require('stream');

function StreamItems() {
  if(!(this instanceof StreamItems)) return new StreamItems();
  stream.Stream.call(this);
  
  this.writable = true;
  this.readable = true;
  
  this.escapeChar = '\\';
  this.delimiters  = [
    ['{', '}'],
    ['[', ']']
  ];
  
  this._delim = null;
  this._depth = 0;
  this._buffer = '';
  this._pos = 0;
  
  var self = this;
  
  this.on('data', function(buf) {
    // console.log('got chunk, %d bytes', buf.length);
    this._buffer += buf.toString();
    this.__parse();
  });
}
util.inherits(StreamItems, stream.Stream);

StreamItems.prototype.__parse = function() {
  this.__parseStart();
  this.__parseEnd();
};

StreamItems.prototype.__parseStart = function() {
  if(!this._delim) {
    var buffer = this._buffer,
        d,
        num = this.delimiters.length,
        pos, i;
    for(pos=this._pos; pos<buffer.length; pos++) {
      for(i=0; i<num; i++) {
        d = this.delimiters[i];
        
        if(buffer[pos-1] !== this.escapeChar && buffer.substr(pos, d[0].length) === d[0]) {
          // console.log('start', d[0].toString(), pos, buffer.length-pos);
          if(pos) {
            this.emit('garbage', buffer.substr(0, pos));
          }
          this._buffer = buffer.substr(pos);
          this._delim = d;
          this._pos = 0;
          return;
        }
      }
    }
    this._pos = pos;
    
    if(buffer.length) {
      this.emit('garbage', buffer);
      this._buffer = '';
      this._pos = 0;/*  */
    }
  }
};

StreamItems.prototype.__parseEnd = function() {
  if(this._delim) {
    var buffer = this._buffer,
        d = this._delim,
        num = buffer.length,
        pos, i;
    for(pos=this._pos; pos<num; pos++) {
      // console.log(buffer.length, pos, d[0].length);
      if(buffer.substr(pos, d[0].length) === d[0]) {
        this._depth += 1;
      }
      if(buffer.substr(pos, d[1].length) === d[1]) {
        this._depth -= 1;
      }
      if(this._depth === 0) {
        this.emit('item', buffer.substr(0, pos+d[1].length));
        
        this._buffer = new Buffer(buffer.length-pos-d[1].length);
        this._buffer = buffer.substr(pos+d[1].length);
        // console.log(this._buffer.toString());
        
        // process.stdout.write('item emitted, '+this._buffer.length+' bytes left in buffer\n');
        
        this._pos = 0;
        this._delim = null;
        return this.__parse();
      }
    }
    this._pos = pos;
    // console.log(this._depth);
  }
};

StreamItems.prototype.write = function(data) {
  if(!(data instanceof Buffer))
    data = new Buffer(data.toString());
  this.emit('data', new Buffer(data));
};

StreamItems.prototype.end = function() {
  this.emit('end');
};

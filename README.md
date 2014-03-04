jQuery IPMask
=============

Simple jQuery plugin for IPv4 input


Usage
-----

```js
$("input[data-type='ip']").ip({
  values: "192.168.0.1",
  placeholder: "127.0.0.1",
  callback: function() { alert('fired!') }
});
```

Additional function for validate IP. Returns `false` or array of int ip-parts, like `[ 192, 168, 0, 1 ]`:

```js
$.isIP("127.0.0.1");
$.isIP([ 127, 0, 0, 1 ]);
```
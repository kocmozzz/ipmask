jQuery IPMask
=============

Simple jQuery plugin for IPv4 input


Usage
-----

HTML:

    <input type="text" data-type="ip">

JS:

    $("input[data-type='ip']").ip({
      values: "192.168.0.1",
      placeholder: "127.0.0.1",
      callback: function() { alert('fired!') }
    });

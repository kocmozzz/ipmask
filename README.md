jQuery IPMask
=============

Simple jQuery plugin for IPv4 input


Usage
-----

HTML:

    <input type="text" data-type="ip">

JS:

    $("input[data-type='ip']").ip({
      placeholder: "192.168.0.1",
      callback: function() { alert('fired!') }
    });

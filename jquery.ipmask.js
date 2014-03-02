(function() {

  (function($) {
    var codesToNumbers, go_next, go_prev, isKey, keyCodes, nextInput, prevInput;
    keyCodes = {
      IGNORE: [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 106, 107, 109, 186, 187, 188, 189, 191, 192, 219, 220, 221, 222],
      NUMBERS: [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105],
      BACKSPACE: [8],
      POINT: [190, 110]
    };
    codesToNumbers = {
      48: 0,
      49: 1,
      50: 2,
      51: 3,
      52: 4,
      53: 5,
      54: 6,
      55: 7,
      56: 8,
      57: 9,
      96: 0,
      97: 1,
      98: 2,
      99: 3,
      100: 4,
      101: 5,
      102: 6,
      103: 7,
      104: 8,
      105: 9
    };
    go_next = false;
    go_prev = false;
    nextInput = function(el) {
      var next;
      next = $(el).next().next();
      if (next.length > 0) {
        next.focus();
      }
    };
    prevInput = function(el) {
      var prev;
      prev = $(el).prev().prev();
      if (prev.length > 0) {
        prev.focus();
      }
    };
    isKey = function(arr, keycode) {
      return arr.indexOf(keycode) !== -1;
    };
    $.fn.ip = function(opts) {
      if (opts == null) {
        opts = {
          placeholder: null,
          callback: null,
          values: null
        };
      }
      opts.placeholder = opts.placeholder ? opts.placeholder.split(".") : ["", "", "", ""];
      opts.values = opts.values ? opts.values.split(".") : ["", "", "", ""];
      return this.each(function(idx, el) {
        var container, els, html, i, _i,
          _this = this;
        if (el.value) {
          opts.values = el.value.split(".");
        }
        el.setAttribute("type", "hidden");
        container = document.createElement("div");
        container.className = "b-ipmask form-control";
        html = "";
        for (i = _i = 0; _i <= 3; i = ++_i) {
          html += "<input type='text' class='b-ipmask__input' maxlength='3' placeholder='" + opts.placeholder[i] + "' value='" + opts.values[i] + "'>";
          if (i < 3) {
            html += "<span class='b-ipmask__span'>.</span>";
          }
        }
        container.innerHTML = html;
        $(el).after(container);
        els = $(".b-ipmask__input", container);
        els.on("keydown", function(e) {
          var sum, value;
          value = this.value;
          if (isKey(keyCodes.IGNORE, e.keyCode)) {
            e.preventDefault();
          } else if (isKey(keyCodes.NUMBERS, e.keyCode)) {
            if (value.length === 2) {
              sum = value + codesToNumbers[e.keyCode];
              if (sum.length !== (parseInt(sum) + "").length || sum > 255) {
                e.preventDefault();
              } else {
                go_next = true;
              }
            }
          } else if (isKey(keyCodes.POINT, e.keyCode)) {
            e.preventDefault();
            if (value !== "") {
              nextInput(this);
            }
          } else if (isKey(keyCodes.BACKSPACE, e.keyCode)) {
            if (value.length === 0) {
              prevInput(this);
            } else {
              if (value.length === 1) {
                go_prev = true;
              }
            }
          }
          return e;
        });
        return els.on("keyup", function(e) {
          var ip;
          if (go_next) {
            nextInput(e.target);
            go_next = false;
          }
          if (go_prev) {
            prevInput(e.target);
            go_prev = false;
          }
          ip = "";
          els.each(function(idx, el) {
            return ip += el.value + (idx === 3 ? "" : ".");
          });
          el.value = (ip === "..." ? "" : ip);
          if (opts.callback) {
            opts.callback.call(_this);
          }
          return e;
        });
      });
    };
    return this;
  })(jQuery);

}).call(this);

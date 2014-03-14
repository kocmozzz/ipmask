
/*
 jQuery IPMask v0.0.15
 https://github.com/ozio/ipmask
 */


(function() {
  "use strict";
  (function($) {
    return $.isIP = function(ip) {
      var i, _i;
      if (typeof ip === "string") {
        ip = ip.split(".");
      }
      if (!(ip instanceof Array) || ip.length !== 4) {
        return false;
      }
      for (i = _i = 0; _i <= 3; i = ++_i) {
        if ((ip[i] + "").length !== (parseInt(ip[i]) + "").length) {
          return false;
        }
        ip[i] = parseInt(ip[i]);
        if (isNaN(ip[i]) || ip[i] > 255 || ip[i] < 0) {
          return false;
        }
      }
      return ip;
    };
  })(jQuery);

  (function($) {
    var codesToNumbers, go_next, go_prev, isKey, keyCodes, nextInput, prevInput;
    keyCodes = {
      IGNORE: [0, 32, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 106, 107, 109, 186, 187, 188, 189, 191, 192, 219, 220, 221, 222],
      NUMBERS: [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105],
      BACKSPACE: [8],
      POINT: [190, 110],
      ARROW_LEFT: [37],
      ARROW_RIGHT: [39]
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
        var container, els, html, i, is_disabled, last_disabled_status, values, _i,
          _this = this;
        if (el.getAttribute("data-ipmask") === "enabled") {
          return console.warn("" + el.tagName + "[name='" + el.name + "'] is already wrapped by ipmask");
        }
        values = el.value ? el.value.split(".") : opts.values;
        is_disabled = el.hasAttribute("disabled") ? "disabled" : "";
        el.setAttribute("data-ipmask", "enabled");
        el.setAttribute("type", "hidden");
        container = document.createElement("span");
        container.className = "b-ipmask form-control";
        html = "";
        for (i = _i = 0; _i <= 3; i = ++_i) {
          html += "<input type='text' class='b-ipmask__input' maxlength='3' placeholder='" + opts.placeholder[i] + "' value='" + values[i] + "' " + is_disabled + ">";
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
            if (!e.ctrlKey && !e.metaKey) {
              e.preventDefault();
            }
          } else if (isKey(keyCodes.NUMBERS, e.keyCode)) {
            if (this.selectionStart !== this.selectionEnd) {
              value = "" + (value.slice(0, this.selectionStart)) + (value.slice(this.selectionEnd));
            }
            if (e.shiftKey || e.altKey || value === "0") {
              e.preventDefault();
            }
            if (value.length === 2) {
              sum = value + codesToNumbers[e.keyCode];
              if (sum.length !== (parseInt(sum) + "").length || sum > 255) {
                e.preventDefault();
              } else {
                go_next = true;
              }
            }
            if (value.length === 0 && codesToNumbers[e.keyCode] === 0) {
              go_next = true;
            }
          } else if (isKey(keyCodes.POINT, e.keyCode)) {
            e.preventDefault();
            if (value !== "") {
              nextInput(this);
            }
          } else if (isKey(keyCodes.ARROW_RIGHT, e.keyCode)) {
            if (value.length === this.selectionStart) {
              nextInput(this);
              e.preventDefault();
            }
          } else if (isKey(keyCodes.ARROW_LEFT, e.keyCode)) {
            if (this.selectionStart === 0) {
              prevInput(this);
              e.preventDefault();
            }
          } else if (isKey(keyCodes.BACKSPACE, e.keyCode)) {
            if (value.length === 0) {
              prevInput(this);
              e.preventDefault();
            }
          }
          return e;
        });
        els.on("keyup", function(e) {
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
          el.setAttribute("value", (ip === "..." ? "" : ip));
          if (opts.callback) {
            opts.callback.call(_this);
          }
          return e;
        });
        last_disabled_status = el.getAttribute("disabled");
        $(el).on("DOMSubtreeModified", function(e) {
          var new_disabled_status;
          new_disabled_status = e.target.getAttribute("disabled");
          if (last_disabled_status !== new_disabled_status) {
            if (typeof new_disabled_status === "string") {
              els.attr("disabled", "disabled");
            } else {
              els.removeAttr("disabled");
            }
            return last_disabled_status = new_disabled_status;
          }
        });
        try {
          Object.defineProperty(el, "value", {
            set: function(val) {
              var arr, _j;
              arr = $.isIP(val);
              if (!arr) {
                return console.warn("wrong ip");
              }
              for (i = _j = 0; _j <= 3; i = ++_j) {
                els[i].value = arr[i];
              }
              return el.setAttribute("value", arr.join("."));
            }
          });
        } catch (_error) {}
        return el;
      });
    };
    return this;
  })(jQuery);

}).call(this);

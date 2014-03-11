###
  jQuery IPMask v0.0.13
  https://github.com/ozio/ipmask
###
"use strict"

(($) ->

  $.isIP = (ip) ->
    ip = ip.split "." if typeof ip is "string"

    return no if not (ip instanceof Array) or ip.length isnt 4

    for i in [0..3]
      return no if (ip[i] + "").length isnt (parseInt(ip[i]) + "").length

      ip[i] = parseInt ip[i]

      return no if isNaN(ip[i]) or ip[i] > 255 or ip[i] < 0

    ip

) jQuery

(($) ->

  keyCodes =
    IGNORE: [ 32, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 106, 107, 109, 186, 187, 188, 189, 191, 192, 219, 220, 221, 222 ]
    NUMBERS: [ 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105 ]
    BACKSPACE: [ 8 ]
    POINT: [ 190, 110 ]
    ARROW_LEFT: [ 37 ]
    ARROW_RIGHT: [ 39 ]

  codesToNumbers =
    48: 0, 49: 1, 50: 2, 51: 3, 52:  4, 53:  5, 54:  6, 55:  7, 56:  8, 57:  9
    96: 0, 97: 1, 98: 2, 99: 3, 100: 4, 101: 5, 102: 6, 103: 7, 104: 8, 105: 9 # numpad

  go_next = no
  go_prev = no

  nextInput = (el) ->
    next = $(el).next().next()
    next.focus() if next.length > 0
    return

  prevInput = (el) ->
    prev = $(el).prev().prev()
    prev.focus() if prev.length > 0
    return

  isKey = (arr, keycode) ->
    return arr.indexOf(keycode) isnt -1

  $.fn.ip = (opts = placeholder: null, callback: null, values: null ) ->

    opts.placeholder = if opts.placeholder then opts.placeholder.split "." else [ "", "", "", "" ]
    opts.values = if opts.values then opts.values.split "." else [ "", "", "", "" ]

    @each (idx, el) ->
      return console.warn "#{el.tagName}[name='#{el.name}'] is already wrapped by ipmask" if el.getAttribute("data-ipmask") is "enabled"

      values = if el.value then el.value.split "." else opts.values
      is_disabled = if el.hasAttribute "disabled" then "disabled" else ""
      el.setAttribute "data-ipmask", "enabled"
      el.setAttribute "type", "hidden"

      # Генерируем и вставляем необходимый html
      container = document.createElement "span"
      container.className = "b-ipmask form-control"

      html = ""
      for i in [0..3]
        html += "<input type='text' class='b-ipmask__input' maxlength='3' placeholder='#{opts.placeholder[i]}' value='#{values[i]}' #{is_disabled}>"
        html += "<span class='b-ipmask__span'>.</span>" if i < 3
      container.innerHTML = html

      $(el).after container

      # Вешаем обработчики
      els = $(".b-ipmask__input", container);

      els.on "keydown", (e) ->
        value = @value

        if isKey keyCodes.IGNORE, e.keyCode
          e.preventDefault()

        else if isKey keyCodes.NUMBERS, e.keyCode
          if value.length is 2
            sum = value + codesToNumbers[e.keyCode]
            if sum.length isnt (parseInt(sum) + "").length or sum > 255
              e.preventDefault()
            else
              go_next = yes

        else if isKey keyCodes.POINT, e.keyCode
          e.preventDefault()
          nextInput this if value isnt ""

        else if isKey keyCodes.ARROW_RIGHT, e.keyCode
          if value.length is @selectionStart
            nextInput @
            e.preventDefault()

        else if isKey keyCodes.ARROW_LEFT, e.keyCode
          if @selectionStart is 0
            prevInput @
            e.preventDefault()

        else if isKey keyCodes.BACKSPACE, e.keyCode
          if value.length is 0
            prevInput this
            e.preventDefault()

          else go_prev = yes if value.length is 1

        return e

      els.on "keyup", (e) =>
        if go_next
          nextInput e.target
          go_next = no

        if go_prev
          prevInput e.target
          go_prev = no

        ip = ""
        els.each (idx, el) ->
          ip += el.value + (if idx is 3 then "" else ".")

        el.setAttribute "value", (if ip is "..." then "" else ip)

        opts.callback.call(this) if opts.callback

        return e


      # Проверка disabled
      last_disabled_status = el.getAttribute "disabled"
      $(el).on "DOMSubtreeModified", (e) ->
        new_disabled_status = e.target.getAttribute "disabled"

        if last_disabled_status isnt new_disabled_status
          if typeof new_disabled_status is "string"
            els.attr "disabled", "disabled"
          else
            els.removeAttr "disabled"

          last_disabled_status = new_disabled_status

      # Сеттер на значение value с валидацией
      try # некоторые браузеры не позволяют переназначать нативные параметры, отлавливаем
        Object.defineProperty el, "value",
          set: (val) ->
            arr = $.isIP val

            return console.warn "wrong ip" unless arr

            for i in [0..3]
              els[i].value = arr[i]

            el.setAttribute "value", arr.join "."

      el

  this
) jQuery

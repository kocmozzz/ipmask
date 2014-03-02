(($) ->
  keyCodes =
    IGNORE: [ 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 106, 107, 109, 186, 187, 188, 189, 191, 192, 219, 220, 221, 222 ]
    NUMBERS: [ 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105 ]
    BACKSPACE: [ 8 ]
    POINT: [ 190, 110 ]

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
      values = if el.value then el.value.split "." else opts.values
      el.setAttribute "type", "hidden"

      # Генерируем и вставляем необходимый html
      container = document.createElement "span"
      container.className = "b-ipmask form-control"

      html = ""
      for i in [0..3]
        html += "<input type='text' class='b-ipmask__input' maxlength='3' placeholder='#{opts.placeholder[i]}' value='#{values[i]}'>"
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

        else if isKey keyCodes.BACKSPACE, e.keyCode
          if value.length is 0
            prevInput this
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

        el.value = (if ip is "..." then "" else ip)

        opts.callback.call(this) if opts.callback

        return e

  this
) jQuery
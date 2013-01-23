$.fn.stickySidebar = function () {
  var $w = $(window);

  return this.each(function () {
    var o = $(this);
    var height = o.outerHeight();
    var placeholderObj = $("<div/>").css({
      height: height + "px",
      width: o.outerWidth() + "px",
      top: o.css('top'),
      left: o.css('left'),
      'float': o.css('float'),
      position: o.css('position')
    });
    o.before(placeholderObj).css({
      position: 'absolute',
      top: placeholderObj.position().top + "px"
    });
    var placeholder = {};

    function updatePlaceholder() {
      var r = placeholderObj.position(),
        a = placeholderObj.offset();
      placeholder = {
        top: r.top,
        absTop: a.top,
        left: r.left,
        absLeft: a.left
      };
    }
    var box = {};

    function updateBox() {
      var h = o.outerHeight(),
        t = o.position().top,
        aT = o.offset().top;
      box = {
        top: t,
        absTop: aT,
        absBottom: aT + h,
        height: h,
        bottom: t + h
      };
    }
    var limit = {};

    function updateLimit() {
      var p = o.parent();
      var h = p.height();
      var t = placeholder.top;
      var aT = placeholder.absTop;
      limit = {
        top: t,
        absTop: aT,
        bottom: p.position().top + h,
        absBottom: p.offset().top + h,
        absLeft: placeholder.absLeft,
        height: h
      };
    }
    var oldStatus = null,
      oldScroll = 0;
    var screen = {};

    function updateScreen() {
      var h = window.innerHeight,
        t = $w.scrollTop();
      screen = {
        absTop: t,
        absBottom: t + h,
        height: h
      };
    }

    function update() {
      var scrollDelta = screen.absTop - oldScroll;
      var toDown = scrollDelta >= 0;
      var fuildMode = box.height > screen.height;

      var css = {
        absTop: {
          position: "absolute",
          top: limit.top + "px",
          left: placeholder.left + 'px',
          bottom: 'auto',
          right: 'auto',
          zIndex: 1
        },
        absBottom: {
          position: "absolute",
          top: (limit.bottom - box.height) + "px",
          left: placeholder.left + 'px',
          bottom: 'auto',
          right: 'auto',
          zIndex: 1
        },
        fixTop: {
          position: "fixed",
          top: 0,
          left: limit.absLeft + "px",
          bottom: 'auto',
          right: 'auto',
          zIndex: 1
        },
        fixBottom: {
          position: "fixed",
          top: 'auto',
          left: limit.absLeft + "px",
          bottom: 0,
          right: 'auto',
          zIndex: 1
        },
        abs: {
          position: "absolute",
          top: (box.top - placeholder.absTop + placeholder.top) + "px",
          left: placeholder.left + 'px',
          bottom: 'auto',
          right: 'auto',
          zIndex: 1
        }
      };
      var status = "";

      if (screen.absTop < limit.absTop) {
        status = "absTop";
      } else if (screen.absTop + Math.min(box.height, screen.height) > limit.absBottom) {
        status = "absBottom";
      } else if (!fuildMode) {
        status = "fixTop";
      } else if (toDown && box.absBottom <= screen.absBottom) {
        status = "fixBottom";
      } else if (!toDown && box.absTop >= screen.absTop) {
        status = "fixTop";
      } else {
        status = "abs";
      }
      oldScroll = screen.absTop;

      o.css(css[status]);
      oldStatus = status;
    }




    function onResize() {
      updatePlaceholder();
      updateBox();
      updateLimit();
      updateScreen();
      update();
    }

    $w.on('scroll', onResize);

    setInterval(onResize, 40);
  });
};

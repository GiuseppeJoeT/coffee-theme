/*
 Copyright 2011-2016 Adobe Systems Incorporated. All Rights Reserved.
*/
(function(d) {
    "function" === typeof define && define.amd && define.amd.jQuery ? define(["jquery", "museutils"], d) : d(jQuery)
}
)(function(d) {
    var b = "undefined" !== typeof console && console.log && console.log.bind ? console.log.bind(console, "[MR]") : function() {}
      , c = !0
      , a = d(window)
      , h = function(a) {
        var c = null
          , d = null
          , f = null
          , h = a.parent().children().length
          , g = a.index();
        1 == h ? c = a.parent() : 0 == g ? f = a.next() : d = a.prev();
        this.getNode = function() {
            return a
        }
        ;
        this.swapWith = function(a) {
            c ? c.append(a.getNode()) : d ? d.after(a.getNode()) : f ? f.before(a.getNode()) : b("WARNING: Invalid state - either parent, prev, next should have a valid value")
        }
    }
      , j = function(a, b) {
        var c = new h(a)
          , f = new h(b);
        d("script", b).remove();
        c.swapWith(f);
        f.swapWith(c);
        c = a.attr("class");
        a.attr("class", b.attr("class"));
        b.attr("class", c);
        f = ["temp_no_id", "temp_no_img_src"];
        for (c = 0; c < f.length; c++)
            a.hasClass(f[c]) && (a.removeClass(f[c]),
            b.addClass(f[c]));
        if (b.closest("form").length && (b.hasClass("wrapped-input") || b.is("p") && b.parents(".fld-message").length)) {
            for (var f = a.closest("form"), g = b.closest("form"), i = a.closest(".fld-grp"), j = b.closest(".fld-grp"), r = ["non-empty-st", "focus-st", "fld-err-st"], c = 0; c < r.length; c++)
                i.length && j.length && i.hasClass(r[c]) && !j.hasClass(r[c]) && (i.removeClass(r[c]),
                j.addClass(r[c]));
            r = ["frm-subm-err-st", "frm-subm-ok-st", "frm-sub-st"];
            for (c = 0; c < r.length; c++)
                f.length && g.length && f.hasClass(r[c]) && !g.hasClass(r[c]) && (f.removeClass(r[c]),
                g.addClass(r[c]))
        }
        b.removeClass("placeholder").addClass("shared_content");
        a.addClass("placeholder").removeClass("shared_content")
    }
      , f = function(f) {
        f.data("bpObj", this);
        var h = this
          , g = f.hasClass("active")
          , n = function(a) {
            a == g ? b('WARNING: Setting the same "active" state twice', this.toString()) : (g = a) ? (f.addClass("active"),
            o.trigger("muse_bp_activate", [i, f, h]),
            f.trigger("muse_this_bp_activate")) : (f.removeClass("active"),
            o.trigger("muse_bp_deactivate", [i, f, h]),
            f.trigger("muse_this_bp_deactivate"))
        }
          , i = function() {
            var a = f.attr("data-min-width") || void 0
              , b = f.attr("data-max-width") || void 0
              , c = "";
            void 0 !== a && (c += (c ? " and " : "") + "(min-width: " + a + "px)");
            void 0 !== b && (c += (c ? " and " : "") + "(max-width: " + b + "px)");
            return c
        }()
          , o = d("body");
        this.getCondition = function() {
            return i
        }
        ;
        this.isActive = function() {
            return g
        }
        ;
        this.isMatched = function() {
            var h;
            h = d("#muse_css_mq").css("background-color");
            h.match(/^rgb/) ? (h = h.replace(/\s+/g, "").match(/([\d\,]+)/gi)[0].split(","),
            h = (parseInt(h[0]) << 16) + (parseInt(h[1]) << 8) + parseInt(h[2])) : h = h.match(/^\#/) ? parseInt(h.substr(1), 16) : 0;
            var g = f.attr("data-max-width") || 16777215;
            16777214 == h && b("WARNING: No media query was matched by the CSS.");
            c && h < a.width() && (c = !1,
            d("html").addClass("always_vert_scroll"));
            return g == h
        }
        ;
        this.activateImages = function() {
            var a = 0;
            d(".temp_no_img_src", f).each(function() {
                var b = d(this);
                a++;
                b.removeClass("temp_no_img_src").attr("src", b.attr("data-orig-src")).removeAttr("data-orig-src")
            })
        }
        ;
        this.swapPlaceholderNodesRecursively = function(a) {
            var c = this;
            d(".placeholder", a).each(function() {
                var a = d(this)
                  , f = a.attr("data-placeholder-for");
                if (f) {
                    var h = d(".shared_content").filter(function(a, b) {
                        return f == d(b).attr("data-content-guid")
                    });
                    0 == h.length ? b("WARNING: Could not find content node with GUID", f) : 1 < h.length ? b("WARNING: Found", h.length, "content nodes with GUID", f, ", expected only 1") : (j(a, h),
                    c.swapPlaceholderNodesRecursively(h))
                } else
                    b("WARNING: Invalid placeholder-for data property for placeholder node", a)
            })
        }
        ;
        this.activateIDs = function(a) {
            d(".temp_no_id", a).each(function() {
                var a = d(this)
                  , c = a.attr("data-orig-id")
                  , f = d("#" + c);
                1 == f.length ? f.removeAttr("id").attr("data-orig-id", c).addClass("temp_no_id") : b("WARNING: Expected to find 1 node with id", c, "but found", f.length);
                a.removeAttr("data-orig-id").attr("id", c).removeClass("temp_no_id")
            })
        }
        ;
        this.activate = function() {
            g ? b("WARNING: Trying to activate same breakpoint twice", this.toString()) : (this.swapPlaceholderNodesRecursively(f),
            this.activateIDs(f),
            this.activateImages(),
            n(!0))
        }
        ;
        this.deactivate = function() {
            g ? n(!1) : b("WARNING: Trying to deactivate same breakpoint twice", this.toString())
        }
        ;
        this.onRegisterAlreadyActiveBP = function() {
            this.activateImages();
            o.trigger("muse_bp_activate", [i, f, h]);
            f.trigger("muse_this_bp_activate")
        }
        ;
        this.toString = function() {
            return "[Breakpoint " + i + ", " + (g ? "active" : "not active") + ", " + (this.isMatched() ? "matched" : "not matched") + "]"
        }
    }
      , g = new function() {
        var c = function(c) {
            if (c)
                if (c == i)
                    b("WARNING: breakpoint is already active.");
                else {
                    i && i.deactivate();
                    i = c;
                    a.data("muse-mq", c.getCondition());
                    g.attr("data-content", i.toString());
                    if (!c.isActive())
                        return i.activate(),
                        !0;
                    return !1
                }
            else
                b("WARNING: Cannot update active breakpoint NULL.")
        }
          , f = function() {
            for (var a = 0; a < r.length; a++)
                if (r[a].isMatched())
                    return r[a];
            b("WARNING: Could not find any active breakpoint");
            return null
        }
          , h = function() {
            if (!i || !i.isMatched()) {
                var b = f();
                b && !b.isActive() && (d("body").addClass("awaiting_bp_activate_scroll"),
                c(b));
                var h = q;
                setTimeout(function() {
                    a.scrollTop(h);
                    a.trigger("scroll");
                    d("body").removeClass("awaiting_bp_activate_scroll")
                }, 16)
            } else
                q = a.scrollTop()
        }
          , g = d(".css-section-debug .js")
          , i = null
          , j = !1
          , q = 0
          , r = [];
        this.registerBreakpoint = function(a) {
            r.push(a);
            if (a.isMatched()) {
                if (!c(a))
                    a.onRegisterAlreadyActiveBP()
            } else
                a.isActive() && a.deactivate()
        }
        ;
        this.watchBreakpointChanges = function() {
            j || (a.on("resize", function() {
                Muse.Utils.requestAnimationFrame(function() {
                    h()
                })
            }),
            h(),
            j = !0)
        }
    }
      , i = null;
    d.fn.registerBreakpoint = function() {
        if (!window.matchMedia && "undefined" == typeof window.CSSMediaRule)
            b("WARNING: Browser does not support media queries."),
            this.each(function() {
                var a = d(this);
                if (void 0 === (a.attr("data-max-width") || void 0)) {
                    var b = new f(a);
                    b.activateImages();
                    d("body").trigger("muse_bp_activate", [b.getCondition(), a, b]);
                    a.trigger("muse_this_bp_activate")
                }
            });
        else
            return null == i && (i = d("body").append('<div id="muse_css_mq"></div>')),
            this.each(function() {
                g.registerBreakpoint(new f(d(this)))
            }),
            g.watchBreakpointChanges(),
            a.trigger("scroll"),
            this
    }
});
;(function() {
    if (!("undefined" == typeof Muse || "undefined" == typeof Muse.assets)) {
        var a = function(a, b) {
            for (var c = 0, d = a.length; c < d; c++)
                if (a[c] == b)
                    return c;
            return -1
        }(Muse.assets.required, "jquery.museresponsive.js");
        if (-1 != a) {
            Muse.assets.required.splice(a, 1);
            for (var a = document.getElementsByTagName("meta"), b = 0, c = a.length; b < c; b++) {
                var d = a[b];
                if ("generator" == d.getAttribute("name")) {
                    "2017.1.0.379" != d.getAttribute("content") && Muse.assets.outOfDate.push("jquery.museresponsive.js");
                    break
                }
            }
        }
    }
}
)();

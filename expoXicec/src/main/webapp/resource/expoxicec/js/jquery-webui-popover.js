// JavaScript Document
!function (n, t) {
    "use strict";
    !function (t) {
        "function" == typeof define && define.amd ? define(["jquery"], t) : "object" == typeof exports ? module.exports = t(require("jquery")) : t(n.jQuery)
    }(function (i) {
        function s(n, t) {
            this.$element = i(n);
            t && ("string" === i.type(t.delay) || "number" === i.type(t.delay)) && (t.delay = {
                show: t.delay,
                hide: t.delay
            });
            this.options = i.extend({}, v, t);
            this._defaults = v;
            this._name = e;
            this._targetclick = !1;
            this.init();
            f.push(this.$element)
        }

        var e = "webuiPopover", r = "webui-popover", o = "webui.popover", v = {
                placement: "auto",
                container: null,
                width: "auto",
                height: "auto",
                trigger: "click",
                style: "",
                delay: {show: null, hide: 300},
                async: {type: "GET", before: null, success: null, error: null},
                cache: !0,
                multi: !1,
                arrow: !0,
                title: "",
                content: "",
                closeable: !1,
                padding: !0,
                url: "",
                type: "html",
                direction: "",
                animation: null,
                template: '<div class="webui-popover"><div class="webui-arrow"><\/div><div class="webui-popover-inner"><a href="#" class="close"><\/a><h3 class="webui-popover-title"><\/h3><div class="webui-popover-content"><i class="icon-refresh"><\/i> <p>&nbsp;<\/p><\/div><\/div><\/div>',
                backdrop: !1,
                dismissible: !0,
                onShow: null,
                onHide: null,
                abortXHR: !0,
                autoHide: !1,
                offsetTop: 0,
                offsetLeft: 0,
                iframeOptions: {
                    frameborder: "0",
                    allowtransparency: "true",
                    id: "",
                    name: "",
                    scrolling: "",
                    onload: "",
                    height: "",
                    width: ""
                },
                hideEmpty: !1
            }, h = r + "-rtl", f = [], l = i('<div class="webui-popover-backdrop"><\/div>'), y = 0, p = !1, u = -2e3,
            c = i(t), w = function (n, t) {
                return isNaN(n) ? t || 0 : Number(n)
            }, b = function (n) {
                return n.data("plugin_" + e)
            }, a = function () {
                for (var n = null, t = 0; t < f.length; t++)n = b(f[t]), n && n.hide(!0);
                c.trigger("hiddenAll." + o)
            }, d = "ontouchstart" in t.documentElement && /Mobi/.test(navigator.userAgent), g = function (n) {
                var t = {x: 0, y: 0}, i;
                return "touchstart" === n.type || "touchmove" === n.type || "touchend" === n.type || "touchcancel" === n.type ? (i = n.originalEvent.touches[0] || n.originalEvent.changedTouches[0], t.x = i.pageX, t.y = i.pageY) : ("mousedown" === n.type || "mouseup" === n.type || "click" === n.type) && (t.x = n.pageX, t.y = n.pageY), t
            }, k;
        s.prototype = {
            init: function () {
                "manual" !== this.getTrigger() && ("click" === this.getTrigger() || d ? this.$element.off("click touchend").on("click touchend", i.proxy(this.toggle, this)) : "hover" === this.getTrigger() && this.$element.off("mouseenter mouseleave click").on("mouseenter", i.proxy(this.mouseenterHandler, this)).on("mouseleave", i.proxy(this.mouseleaveHandler, this)));
                this._poped = !1;
                this._inited = !0;
                this._opened = !1;
                this._idSeed = y;
                this.options.container = i(this.options.container || t.body).first();
                this.options.backdrop && l.appendTo(this.options.container).hide();
                y++;
                "sticky" === this.getTrigger() && this.show()
            }, destroy: function () {
                for (var t = -1, n = 0; n < f.length; n++)if (f[n] === this.$element) {
                    t = n;
                    break
                }
                f.splice(t, 1);
                this.hide();
                this.$element.data("plugin_" + e, null);
                "click" === this.getTrigger() ? this.$element.off("click") : "hover" === this.getTrigger() && this.$element.off("mouseenter mouseleave");
                this.$target && this.$target.remove()
            }, hide: function (n, t) {
                var u, r;
                (n || "sticky" !== this.getTrigger()) && this._opened && (t && (t.preventDefault(), t.stopPropagation()), this.xhr && this.options.abortXHR === !0 && (this.xhr.abort(), this.xhr = null), u = i.Event("hide." + o), (this.$element.trigger(u, [this.$target]), this.$target) && (this.$target.removeClass("in").addClass(this.getHideAnimation()), r = this, setTimeout(function () {
                    r.$target.hide();
                    r.getCache() || r.$target.remove()
                }, r.getHideDelay())), this.options.backdrop && l.hide(), this._opened = !1, this.$element.trigger("hidden." + o, [this.$target]), this.options.onHide && this.options.onHide(this.$target))
            }, resetAutoHide: function () {
                var n = this, t = n.getAutoHide();
                t && (n.autoHideHandler && clearTimeout(n.autoHideHandler), n.autoHideHandler = setTimeout(function () {
                    n.hide()
                }, t))
            }, toggle: function (n) {
                n && (n.preventDefault(), n.stopPropagation());
                this[this.getTarget().hasClass("in") ? "hide" : "show"]()
            }, hideAll: function () {
                a()
            }, show: function () {
                if (!this._opened) {
                    var n = this.getTarget().removeClass().addClass(r).addClass(this._customTargetClass);
                    if (this.options.multi || this.hideAll(), !this.getCache() || !this._poped || "" === this.content) {
                        if (this.content = "", this.setTitle(this.getTitle()), this.options.closeable || n.find(".close").off("click").remove(), this.isAsync() ? this.setContentASync(this.options.content) : this.setContent(this.getContent()), this.canEmptyHide() && "" === this.content)return;
                        n.show()
                    }
                    this.displayContent();
                    this.options.onShow && this.options.onShow(n);
                    this.bindBodyEvents();
                    this.options.backdrop && l.show();
                    this._opened = !0;
                    this.resetAutoHide()
                }
            }, displayContent: function () {
                var v = this.getElementPosition(),
                    n = this.getTarget().removeClass().addClass(r).addClass(this._customTargetClass),
                    f = this.getContentElement(), y = n[0].offsetWidth, p = n[0].offsetHeight, t = "bottom",
                    d = i.Event("show." + o), a, c, l, e, s;
                if (!this.canEmptyHide() || (a = f.children().html(), null === a || 0 !== a.trim().length)) {
                    if (this.$element.trigger(d, [n]), c = this.$element.data("width") || this.options.width, "" === c && (c = this._defaults.width), "auto" !== c && n.width(c), l = this.$element.data("height") || this.options.height, "" === l && (l = this._defaults.height), "auto" !== l && f.height(l), this.options.style && this.$target.addClass(r + "-" + this.options.style), "rtl" !== this.options.direction || f.hasClass(h) || f.addClass(h), this.options.arrow || n.find(".webui-arrow").remove(), n.detach().css({
                            top: u,
                            left: u,
                            display: "block"
                        }), this.getAnimation() && n.addClass(this.getAnimation()), n.appendTo(this.options.container), t = this.getPlacement(v), this.$element.trigger("added." + o), this.initTargetEvents(), this.options.padding || ("auto" !== this.options.height && f.css("height", f.outerHeight()), this.$target.addClass("webui-no-padding")), y = n[0].offsetWidth, p = n[0].offsetHeight, e = this.getTargetPositin(v, t, y, p), this.$target.css(e.position).addClass(t).addClass("in"), "iframe" === this.options.type) {
                        var w = n.find("iframe"), b = n.width(), k = w.parent().height();
                        "" !== this.options.iframeOptions.width && "auto" !== this.options.iframeOptions.width && (b = this.options.iframeOptions.width);
                        "" !== this.options.iframeOptions.height && "auto" !== this.options.iframeOptions.height && (k = this.options.iframeOptions.height);
                        w.width(b).height(k)
                    }
                    (this.options.arrow || this.$target.css({margin: 0}), this.options.arrow) && (s = this.$target.find(".webui-arrow"), s.removeAttr("style"), "left" === t || "right" === t ? s.css({top: this.$target.height() / 2}) : ("top" === t || "bottom" === t) && s.css({left: this.$target.width() / 2}), e.arrowOffset && (-1 === e.arrowOffset.left || -1 === e.arrowOffset.top ? s.hide() : s.css(e.arrowOffset)));
                    this._poped = !0;
                    this.$element.trigger("shown." + o, [this.$target])
                }
            }, isTargetLoaded: function () {
                return 0 === this.getTarget().find("i.glyphicon-refresh").length
            }, getTriggerElement: function () {
                return this.$element
            }, getTarget: function () {
                if (!this.$target) {
                    var n = e + this._idSeed;
                    this.$target = i(this.options.template).attr("id", n).data("trigger-element", this.getTriggerElement());
                    this._customTargetClass = this.$target.attr("class") !== r ? this.$target.attr("class") : null;
                    this.getTriggerElement().attr("data-target", n)
                }
                return this.$target
            }, getTitleElement: function () {
                return this.getTarget().find("." + r + "-title")
            }, getContentElement: function () {
                return this.$contentElement || (this.$contentElement = this.getTarget().find("." + r + "-content")), this.$contentElement
            }, getTitle: function () {
                return this.$element.attr("data-title") || this.options.title || this.$element.attr("title")
            }, getUrl: function () {
                return this.$element.attr("data-url") || this.options.url
            }, getAutoHide: function () {
                return this.$element.attr("data-auto-hide") || this.options.autoHide
            }, getOffsetTop: function () {
                return w(this.$element.attr("data-offset-top")) || this.options.offsetTop
            }, getOffsetLeft: function () {
                return w(this.$element.attr("data-offset-left")) || this.options.offsetLeft
            }, getCache: function () {
                var n = this.$element.attr("data-cache");
                if ("undefined" != typeof n)switch (n.toLowerCase()) {
                    case"true":
                    case"yes":
                    case"1":
                        return !0;
                    case"false":
                    case"no":
                    case"0":
                        return !1
                }
                return this.options.cache
            }, getTrigger: function () {
                return this.$element.attr("data-trigger") || this.options.trigger
            }, getDelayShow: function () {
                var n = this.$element.attr("data-delay-show");
                return "undefined" != typeof n ? n : 0 === this.options.delay.show ? 0 : this.options.delay.show || 100
            }, getHideDelay: function () {
                var n = this.$element.attr("data-delay-hide");
                return "undefined" != typeof n ? n : 0 === this.options.delay.hide ? 0 : this.options.delay.hide || 100
            }, getAnimation: function () {
                var n = this.$element.attr("data-animation");
                return n || this.options.animation
            }, getHideAnimation: function () {
                var n = this.getAnimation();
                return n ? n + "-out" : "out"
            }, setTitle: function (n) {
                var t = this.getTitleElement();
                n ? ("rtl" !== this.options.direction || t.hasClass(h) || t.addClass(h), t.html(n)) : t.remove()
            }, hasContent: function () {
                return this.getContent()
            }, canEmptyHide: function () {
                return this.options.hideEmpty && "html" === this.options.type
            }, getIframe: function () {
                var n = i("<iframe><\/iframe>").attr("src", this.getUrl()), t = this;
                return i.each(this._defaults.iframeOptions, function (i) {
                    "undefined" != typeof t.options.iframeOptions[i] && n.attr(i, t.options.iframeOptions[i])
                }), n
            }, getContent: function () {
                var t, n;
                if (this.getUrl())switch (this.options.type) {
                    case"iframe":
                        this.content = this.getIframe();
                        break;
                    case"html":
                        try {
                            this.content = i(this.getUrl());
                            this.content.is(":visible") || this.content.show()
                        } catch (u) {
                            throw new Error("Unable to get popover content. Invalid selector specified.");
                        }
                } else this.content || (t = "", (t = i.isFunction(this.options.content) ? this.options.content.apply(this.$element[0], [this]) : this.options.content, this.content = this.$element.attr("data-content") || t, this.content) || (n = this.$element.next(), n && n.hasClass(r + "-content") && (this.content = n)));
                return this.content
            }, setContent: function (n) {
                var i = this.getTarget(), t = this.getContentElement();
                "string" == typeof n ? t.html(n) : n instanceof jQuery && (t.html(""), this.options.cache ? n.removeClass(r + "-content").appendTo(t) : n.clone(!0, !0).removeClass(r + "-content").appendTo(t));
                this.$target = i
            }, isAsync: function () {
                return "async" === this.options.type
            }, setContentASync: function (n) {
                var t = this;
                this.xhr || (this.xhr = i.ajax({
                    url: this.getUrl(),
                    type: this.options.async.type,
                    cache: this.getCache(),
                    beforeSend: function (n) {
                        t.options.async.before && t.options.async.before(t, n)
                    },
                    success: function (r) {
                        t.bindBodyEvents();
                        t.content = n && i.isFunction(n) ? n.apply(t.$element[0], [r]) : r;
                        t.setContent(t.content);
                        var u = t.getContentElement();
                        u.removeAttr("style");
                        t.displayContent();
                        t.options.async.success && t.options.async.success(t, r)
                    },
                    complete: function () {
                        t.xhr = null
                    },
                    error: function (n, i) {
                        t.options.async.error && t.options.async.error(t, n, i)
                    }
                }))
            }, bindBodyEvents: function () {
                p || (this.options.dismissible && "click" === this.getTrigger() ? (c.off("keyup.webui-popover").on("keyup.webui-popover", i.proxy(this.escapeHandler, this)), c.off("click.webui-popover touchend.webui-popover").on("click.webui-popover touchend.webui-popover", i.proxy(this.bodyClickHandler, this))) : "hover" === this.getTrigger() && c.off("touchend.webui-popover").on("touchend.webui-popover", i.proxy(this.bodyClickHandler, this)))
            }, mouseenterHandler: function () {
                var n = this;
                n._timeout && clearTimeout(n._timeout);
                n._enterTimeout = setTimeout(function () {
                    n.getTarget().is(":visible") || n.show()
                }, this.getDelayShow())
            }, mouseleaveHandler: function () {
                var n = this;
                clearTimeout(n._enterTimeout);
                n._timeout = setTimeout(function () {
                    n.hide()
                }, this.getHideDelay())
            }, escapeHandler: function (n) {
                27 === n.keyCode && this.hideAll()
            }, bodyClickHandler: function (n) {
                var e, i, t;
                for (p = !0, e = !0, i = 0; i < f.length; i++)if (t = b(f[i]), t && t._opened) {
                    var r = t.getTarget().offset(), o = r.left, s = r.top, h = r.left + t.getTarget().width(),
                        c = r.top + t.getTarget().height(), u = g(n), l = u.x >= o && u.x <= h && u.y >= s && u.y <= c;
                    if (l) {
                        e = !1;
                        break
                    }
                }
                e && a()
            }, initTargetEvents: function () {
                "hover" === this.getTrigger() && this.$target.off("mouseenter mouseleave").on("mouseenter", i.proxy(this.mouseenterHandler, this)).on("mouseleave", i.proxy(this.mouseleaveHandler, this));
                this.$target.find(".close").off("click").on("click", i.proxy(this.hide, this, !0))
            }, getPlacement: function (n) {
                var t, o = this.options.container, u = o.innerWidth(), i = o.innerHeight(), h = o.scrollTop(),
                    c = o.scrollLeft(), f = Math.max(0, n.left - c), r = Math.max(0, n.top - h);
                t = "function" == typeof this.options.placement ? this.options.placement.call(this, this.getTarget()[0], this.$element[0]) : this.$element.data("placement") || this.options.placement;
                var e = "horizontal" === t, s = "vertical" === t, l = "auto" === t || e || s;
                return l ? t = u / 3 > f ? i / 3 > r ? e ? "right-bottom" : "bottom-right" : 2 * i / 3 > r ? s ? i / 2 >= r ? "bottom-right" : "top-right" : "right" : e ? "right-top" : "top-right" : 2 * u / 3 > f ? i / 3 > r ? e ? u / 2 >= f ? "right-bottom" : "left-bottom" : "bottom" : 2 * i / 3 > r ? e ? u / 2 >= f ? "right" : "left" : i / 2 >= r ? "bottom" : "top" : e ? u / 2 >= f ? "right-top" : "left-top" : "top" : i / 3 > r ? e ? "left-bottom" : "bottom-left" : 2 * i / 3 > r ? s ? i / 2 >= r ? "bottom-left" : "top-left" : "left" : e ? "left-top" : "top-left" : "auto-top" === t ? t = u / 3 > f ? "top-right" : 2 * u / 3 > f ? "top" : "top-left" : "auto-bottom" === t ? t = u / 3 > f ? "bottom-right" : 2 * u / 3 > f ? "bottom" : "bottom-left" : "auto-left" === t ? t = i / 3 > r ? "left-top" : 2 * i / 3 > r ? "left" : "left-bottom" : "auto-right" === t && (t = i / 3 > r ? "right-top" : 2 * i / 3 > r ? "right" : "right-bottom"), t
            }, getElementPosition: function () {
                var n = this.$element[0].getBoundingClientRect(), r;
                return this.options.container.is(t.body) || "fixed" !== this.options.container.css("position") ? i.extend({}, this.$element.offset(), {
                    width: this.$element[0].offsetWidth || n.width,
                    height: this.$element[0].offsetHeight || n.height
                }) : (r = this.options.container[0].getBoundingClientRect(), {
                    top: n.top - r.top + this.options.container.scrollTop(),
                    left: n.left - r.left + this.options.container.scrollLeft(),
                    width: n.width,
                    height: n.height
                })
            }, getTargetPositin: function (n, i, r, f) {
                var e = n, g = this.options.container, v = this.$element.outerWidth(), y = this.$element.outerHeight(),
                    nt = g.scrollTop(), tt = g.scrollLeft(), o = {}, l = null, p = this.options.arrow ? 20 : 0, s = 10,
                    h = p + s > v ? p : 0, c = p + s > y ? p : 0, a = 0, it = t.documentElement.clientHeight + nt,
                    rt = t.documentElement.clientWidth + tt, w = e.left + e.width / 2 - h > 0,
                    b = e.left + e.width / 2 + h < rt, k = e.top + e.height / 2 - c > 0,
                    d = e.top + e.height / 2 + c < it;
                switch (i) {
                    case"bottom":
                        o = {top: e.top + e.height, left: e.left + e.width / 2 - r / 2};
                        break;
                    case"top":
                        o = {top: e.top - f, left: e.left + e.width / 2 - r / 2};
                        break;
                    case"left":
                        o = {top: e.top + e.height / 2 - f / 2, left: e.left - r};
                        break;
                    case"right":
                        o = {top: e.top + e.height / 2 - f / 2, left: e.left + e.width};
                        break;
                    case"top-right":
                        o = {top: e.top - f, left: w ? e.left - h : s};
                        l = {left: w ? Math.min(v, r) / 2 + h : u};
                        break;
                    case"top-left":
                        a = b ? h : -s;
                        o = {top: e.top - f, left: e.left - r + e.width + a};
                        l = {left: b ? r - Math.min(v, r) / 2 - h : u};
                        break;
                    case"bottom-right":
                        o = {top: e.top + e.height, left: w ? e.left - h : s};
                        l = {left: w ? Math.min(v, r) / 2 + h : u};
                        break;
                    case"bottom-left":
                        a = b ? h : -s;
                        o = {top: e.top + e.height, left: e.left - r + e.width + a};
                        l = {left: b ? r - Math.min(v, r) / 2 - h : u};
                        break;
                    case"right-top":
                        a = d ? c : -s;
                        o = {top: e.top - f + e.height + a, left: e.left + e.width};
                        l = {top: d ? f - Math.min(y, f) / 2 - c : u};
                        break;
                    case"right-bottom":
                        o = {top: k ? e.top - c : s, left: e.left + e.width};
                        l = {top: k ? Math.min(y, f) / 2 + c : u};
                        break;
                    case"left-top":
                        a = d ? c : -s;
                        o = {top: e.top - f + e.height + a, left: e.left - r};
                        l = {top: d ? f - Math.min(y, f) / 2 - c : u};
                        break;
                    case"left-bottom":
                        o = {top: k ? e.top - c : s, left: e.left - r};
                        l = {top: k ? Math.min(y, f) / 2 + c : u}
                }
                return o.top += this.getOffsetTop(), o.left += this.getOffsetLeft(), {position: o, arrowOffset: l}
            }
        };
        i.fn[e] = function (n, t) {
            var r = [], u = this.each(function () {
                var u = i.data(this, "plugin_" + e);
                u ? "destroy" === n ? u.destroy() : "string" == typeof n && r.push(u[n]()) : (n ? "string" == typeof n ? "destroy" !== n && (t || (u = new s(this, null), r.push(u[n]()))) : "object" == typeof n && (u = new s(this, n)) : u = new s(this, null), i.data(this, "plugin_" + e, u))
            });
            return r.length ? r : u
        };
        k = function () {
            var n = function () {
                a()
            }, t = function (n) {
                i(n).webuiPopover("show")
            }, r = function (n) {
                i(n).webuiPopover("hide")
            };
            return {show: t, hide: r, hideAll: n}
        }();
        n.WebuiPopovers = k
    })
}(window, document)
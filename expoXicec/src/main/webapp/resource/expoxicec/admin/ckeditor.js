/*
 Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 For licensing, see LICENSE.html or http://ckeditor.com/license
 */
(function () {
    if (window.CKEDITOR && window.CKEDITOR.dom)return;
    window.CKEDITOR || (window.CKEDITOR = function () {
        var a = {
            timestamp: "DBAA",
            version: "4.3.1",
            revision: "3ecd0b8",
            rnd: Math.floor(900 * Math.random()) + 100,
            _: {pending: []},
            status: "unloaded",
            basePath: function () {
                var b = window.CKEDITOR_BASEPATH || "";
                if (!b)for (var d = document.getElementsByTagName("script"), a = 0; a < d.length; a++) {
                    var e = d[a].src.match(/(^|.*[\\\/])ckeditor(?:_basic)?(?:_source)?.js(?:\?.*)?$/i);
                    if (e) {
                        b = e[1];
                        break
                    }
                }
                -1 == b.indexOf(":/") && (b = 0 === b.indexOf("/") ? location.href.match(/^.*?:\/\/[^\/]*/)[0] + b : location.href.match(/^[^\?]*\/(?:)/)[0] +
                    b);
                if (!b)throw'The CKEditor installation path could not be automatically detected. Please set the global variable "CKEDITOR_BASEPATH" before creating editor instances.';
                return b
            }(),
            getUrl: function (b) {
                -1 == b.indexOf(":/") && 0 !== b.indexOf("/") && (b = this.basePath + b);
                this.timestamp && ("/" != b.charAt(b.length - 1) && !/[&?]t=/.test(b)) && (b += (0 <= b.indexOf("?") ? "&" : "?") + "t=" + this.timestamp);
                return b
            },
            domReady: function () {
                function b() {
                    try {
                        document.addEventListener ? (document.removeEventListener("DOMContentLoaded", b,
                            !1), d()) : document.attachEvent && "complete" === document.readyState && (document.detachEvent("onreadystatechange", b), d())
                    } catch (a) {
                    }
                }

                function d() {
                    for (var d; d = a.shift();)d()
                }

                var a = [];
                return function (d) {
                    a.push(d);
                    "complete" === document.readyState && setTimeout(b, 1);
                    if (1 == a.length)if (document.addEventListener) document.addEventListener("DOMContentLoaded", b, !1), window.addEventListener("load", b, !1); else if (document.attachEvent) {
                        document.attachEvent("onreadystatechange", b);
                        window.attachEvent("onload", b);
                        d = !1;
                        try {
                            d =
                                !window.frameElement
                        } catch (e) {
                        }
                        if (document.documentElement.doScroll && d) {
                            var i = function () {
                                try {
                                    document.documentElement.doScroll("left")
                                } catch (d) {
                                    setTimeout(i, 1);
                                    return
                                }
                                b()
                            };
                            i()
                        }
                    }
                }
            }()
        }, e = window.CKEDITOR_GETURL;
        if (e) {
            var b = a.getUrl;
            a.getUrl = function (c) {
                return e.call(a, c) || b.call(a, c)
            }
        }
        return a
    }());
    CKEDITOR.event || (CKEDITOR.event = function () {
    }, CKEDITOR.event.implementOn = function (a) {
        var e = CKEDITOR.event.prototype, b;
        for (b in e)a[b] == void 0 && (a[b] = e[b])
    }, CKEDITOR.event.prototype = function () {
        function a(a) {
            var d = e(this);
            return d[a] || (d[a] = new b(a))
        }

        var e = function (b) {
            b = b.getPrivate && b.getPrivate() || b._ || (b._ = {});
            return b.events || (b.events = {})
        }, b = function (b) {
            this.name = b;
            this.listeners = []
        };
        b.prototype = {
            getListenerIndex: function (b) {
                for (var d = 0, a = this.listeners; d < a.length; d++)if (a[d].fn == b)return d;
                return -1
            }
        };
        return {
            define: function (b, d) {
                var h = a.call(this, b);
                CKEDITOR.tools.extend(h, d, true)
            }, on: function (b, d, h, e, n) {
                function i(a, f, o, q) {
                    a = {
                        name: b,
                        sender: this,
                        editor: a,
                        data: f,
                        listenerData: e,
                        stop: o,
                        cancel: q,
                        removeListener: j
                    };
                    return d.call(h, a) === false ? false : a.data
                }

                function j() {
                    q.removeListener(b, d)
                }

                var o = a.call(this, b);
                if (o.getListenerIndex(d) < 0) {
                    o = o.listeners;
                    h || (h = this);
                    isNaN(n) && (n = 10);
                    var q = this;
                    i.fn = d;
                    i.priority = n;
                    for (var s = o.length - 1; s >= 0; s--)if (o[s].priority <= n) {
                        o.splice(s + 1, 0, i);
                        return {removeListener: j}
                    }
                    o.unshift(i)
                }
                return {removeListener: j}
            },
            once: function () {
                var b = arguments[1];
                arguments[1] = function (d) {
                    d.removeListener();
                    return b.apply(this, arguments)
                };
                return this.on.apply(this, arguments)
            }, capture: function () {
                CKEDITOR.event.useCapture = 1;
                var b = this.on.apply(this, arguments);
                CKEDITOR.event.useCapture = 0;
                return b
            }, fire: function () {
                var b = 0, d = function () {
                    b = 1
                }, a = 0, g = function () {
                    a = 1
                };
                return function (n, i, j) {
                    var o = e(this)[n], n = b, q = a;
                    b = a = 0;
                    if (o) {
                        var s = o.listeners;
                        if (s.length)for (var s = s.slice(0), u, f = 0; f < s.length; f++) {
                            if (o.errorProof)try {
                                u = s[f].call(this,
                                    j, i, d, g)
                            } catch (p) {
                            } else u = s[f].call(this, j, i, d, g);
                            u === false ? a = 1 : typeof u != "undefined" && (i = u);
                            if (b || a)break
                        }
                    }
                    i = a ? false : typeof i == "undefined" ? true : i;
                    b = n;
                    a = q;
                    return i
                }
            }(), fireOnce: function (b, d, a) {
                d = this.fire(b, d, a);
                delete e(this)[b];
                return d
            }, removeListener: function (b, d) {
                var a = e(this)[b];
                if (a) {
                    var g = a.getListenerIndex(d);
                    g >= 0 && a.listeners.splice(g, 1)
                }
            }, removeAllListeners: function () {
                var b = e(this), d;
                for (d in b)delete b[d]
            }, hasListeners: function (b) {
                return (b = e(this)[b]) && b.listeners.length > 0
            }
        }
    }());
    CKEDITOR.editor || (CKEDITOR.editor = function () {
        CKEDITOR._.pending.push([this, arguments]);
        CKEDITOR.event.call(this)
    }, CKEDITOR.editor.prototype.fire = function (a, e) {
        a in {instanceReady: 1, loaded: 1} && (this[a] = true);
        return CKEDITOR.event.prototype.fire.call(this, a, e, this)
    }, CKEDITOR.editor.prototype.fireOnce = function (a, e) {
        a in {instanceReady: 1, loaded: 1} && (this[a] = true);
        return CKEDITOR.event.prototype.fireOnce.call(this, a, e, this)
    }, CKEDITOR.event.implementOn(CKEDITOR.editor.prototype));
    CKEDITOR.env || (CKEDITOR.env = function () {
        var a = navigator.userAgent.toLowerCase(), e = window.opera, b = {
            ie: a.indexOf("trident/") > -1,
            opera: !!e && e.version,
            webkit: a.indexOf(" applewebkit/") > -1,
            air: a.indexOf(" adobeair/") > -1,
            mac: a.indexOf("macintosh") > -1,
            quirks: document.compatMode == "BackCompat" && (!document.documentMode || document.documentMode < 10),
            mobile: a.indexOf("mobile") > -1,
            iOS: /(ipad|iphone|ipod)/.test(a),
            isCustomDomain: function () {
                if (!this.ie)return false;
                var d = document.domain, b = window.location.hostname;
                return d !=
                    b && d != "[" + b + "]"
            },
            secure: location.protocol == "https:"
        };
        b.gecko = navigator.product == "Gecko" && !b.webkit && !b.opera && !b.ie;
        if (b.webkit) a.indexOf("chrome") > -1 ? b.chrome = true : b.safari = true;
        var c = 0;
        if (b.ie) {
            c = b.quirks || !document.documentMode ? parseFloat(a.match(/msie (\d+)/)[1]) : document.documentMode;
            b.ie9Compat = c == 9;
            b.ie8Compat = c == 8;
            b.ie7Compat = c == 7;
            b.ie6Compat = c < 7 || b.quirks
        }
        if (b.gecko) {
            var d = a.match(/rv:([\d\.]+)/);
            if (d) {
                d = d[1].split(".");
                c = d[0] * 1E4 + (d[1] || 0) * 100 + (d[2] || 0) * 1
            }
        }
        b.opera && (c = parseFloat(e.version()));
        b.air && (c = parseFloat(a.match(/ adobeair\/(\d+)/)[1]));
        b.webkit && (c = parseFloat(a.match(/ applewebkit\/(\d+)/)[1]));
        b.version = c;
        b.isCompatible = b.iOS && c >= 534 || !b.mobile && (b.ie && c > 6 || b.gecko && c >= 10801 || b.opera && c >= 9.5 || b.air && c >= 1 || b.webkit && c >= 522 || false);
        b.hidpi = window.devicePixelRatio >= 2;
        b.needsBrFiller = b.gecko || b.webkit || b.ie && c > 10;
        b.needsNbspFiller = b.ie && c < 11;
        b.cssClass = "cke_browser_" + (b.ie ? "ie" : b.gecko ? "gecko" : b.opera ? "opera" : b.webkit ? "webkit" : "unknown");
        if (b.quirks) b.cssClass = b.cssClass + " cke_browser_quirks";
        if (b.ie) {
            b.cssClass = b.cssClass + (" cke_browser_ie" + (b.quirks || b.version < 7 ? "6" : b.version));
            if (b.quirks) b.cssClass = b.cssClass + " cke_browser_iequirks"
        }
        if (b.gecko)if (c < 10900) b.cssClass = b.cssClass + " cke_browser_gecko18"; else if (c <= 11E3) b.cssClass = b.cssClass + " cke_browser_gecko19";
        if (b.air) b.cssClass = b.cssClass + " cke_browser_air";
        if (b.iOS) b.cssClass = b.cssClass + " cke_browser_ios";
        if (b.hidpi) b.cssClass = b.cssClass + " cke_hidpi";
        return b
    }());
    "unloaded" == CKEDITOR.status && function () {
        CKEDITOR.event.implementOn(CKEDITOR);
        CKEDITOR.loadFullCore = function () {
            if (CKEDITOR.status != "basic_ready") CKEDITOR.loadFullCore._load = 1; else {
                delete CKEDITOR.loadFullCore;
                var a = document.createElement("script");
                a.type = "text/javascript";
                a.src = CKEDITOR.basePath + "ckeditor.js";
                document.getElementsByTagName("head")[0].appendChild(a)
            }
        };
        CKEDITOR.loadFullCoreTimeout = 0;
        CKEDITOR.add = function (a) {
            (this._.pending || (this._.pending = [])).push(a)
        };
        (function () {
            CKEDITOR.domReady(function () {
                var a =
                    CKEDITOR.loadFullCore, e = CKEDITOR.loadFullCoreTimeout;
                if (a) {
                    CKEDITOR.status = "basic_ready";
                    a && a._load ? a() : e && setTimeout(function () {
                            CKEDITOR.loadFullCore && CKEDITOR.loadFullCore()
                        }, e * 1E3)
                }
            })
        })();
        CKEDITOR.status = "basic_loaded"
    }();
    CKEDITOR.dom = {};
    (function () {
        var a = [],
            e = CKEDITOR.env.gecko ? "-moz-" : CKEDITOR.env.webkit ? "-webkit-" : CKEDITOR.env.opera ? "-o-" : CKEDITOR.env.ie ? "-ms-" : "";
        CKEDITOR.on("reset", function () {
            a = []
        });
        CKEDITOR.tools = {
            arrayCompare: function (b, a) {
                if (!b && !a)return true;
                if (!b || !a || b.length != a.length)return false;
                for (var d = 0; d < b.length; d++)if (b[d] != a[d])return false;
                return true
            }, clone: function (b) {
                var a;
                if (b && b instanceof Array) {
                    a = [];
                    for (var d = 0; d < b.length; d++)a[d] = CKEDITOR.tools.clone(b[d]);
                    return a
                }
                if (b === null || typeof b != "object" ||
                    b instanceof String || b instanceof Number || b instanceof Boolean || b instanceof Date || b instanceof RegExp)return b;
                a = new b.constructor;
                for (d in b)a[d] = CKEDITOR.tools.clone(b[d]);
                return a
            }, capitalize: function (b, a) {
                return b.charAt(0).toUpperCase() + (a ? b.slice(1) : b.slice(1).toLowerCase())
            }, extend: function (b) {
                var a = arguments.length, d, h;
                if (typeof(d = arguments[a - 1]) == "boolean") a--; else if (typeof(d = arguments[a - 2]) == "boolean") {
                    h = arguments[a - 1];
                    a = a - 2
                }
                for (var e = 1; e < a; e++) {
                    var n = arguments[e], i;
                    for (i in n)if (d ===
                        true || b[i] == void 0)if (!h || i in h) b[i] = n[i]
                }
                return b
            }, prototypedCopy: function (b) {
                var a = function () {
                };
                a.prototype = b;
                return new a
            }, copy: function (b) {
                var a = {}, d;
                for (d in b)a[d] = b[d];
                return a
            }, isArray: function (b) {
                return Object.prototype.toString.call(b) == "[object Array]"
            }, isEmpty: function (b) {
                for (var a in b)if (b.hasOwnProperty(a))return false;
                return true
            }, cssVendorPrefix: function (b, a, d) {
                if (d)return e + b + ":" + a + ";" + b + ":" + a;
                d = {};
                d[b] = a;
                d[e + b] = a;
                return d
            }, cssStyleToDomStyle: function () {
                var b = document.createElement("div").style,
                    a = typeof b.cssFloat != "undefined" ? "cssFloat" : typeof b.styleFloat != "undefined" ? "styleFloat" : "float";
                return function (d) {
                    return d == "float" ? a : d.replace(/-./g, function (d) {
                        return d.substr(1).toUpperCase()
                    })
                }
            }(), buildStyleHtml: function (b) {
                for (var b = [].concat(b), a, d = [],
                         h = 0; h < b.length; h++)if (a = b[h]) /@import|[{}]/.test(a) ? d.push("<style>" + a + "</style>") : d.push('<link type="text/css" rel=stylesheet href="' + a + '">');
                return d.join("")
            }, htmlEncode: function (b) {
                return ("" + b).replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g,
                    "&lt;")
            }, htmlEncodeAttr: function (b) {
                return b.replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
            }, htmlDecodeAttr: function (b) {
                return b.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">")
            }, getNextNumber: function () {
                var b = 0;
                return function () {
                    return ++b
                }
            }(), getNextId: function () {
                return "cke_" + this.getNextNumber()
            }, override: function (b, a) {
                var d = a(b);
                d.prototype = b.prototype;
                return d
            }, setTimeout: function (b, a, d, h, e) {
                e || (e = window);
                d || (d = e);
                return e.setTimeout(function () {
                    h ? b.apply(d, [].concat(h)) :
                        b.apply(d)
                }, a || 0)
            }, trim: function () {
                var b = /(?:^[ \t\n\r]+)|(?:[ \t\n\r]+$)/g;
                return function (a) {
                    return a.replace(b, "")
                }
            }(), ltrim: function () {
                var b = /^[ \t\n\r]+/g;
                return function (a) {
                    return a.replace(b, "")
                }
            }(), rtrim: function () {
                var b = /[ \t\n\r]+$/g;
                return function (a) {
                    return a.replace(b, "")
                }
            }(), indexOf: function (b, a) {
                if (typeof a == "function")for (var d = 0, h = b.length; d < h; d++) {
                    if (a(b[d]))return d
                } else {
                    if (b.indexOf)return b.indexOf(a);
                    d = 0;
                    for (h = b.length; d < h; d++)if (b[d] === a)return d
                }
                return -1
            }, search: function (b,
                                 a) {
                var d = CKEDITOR.tools.indexOf(b, a);
                return d >= 0 ? b[d] : null
            }, bind: function (b, a) {
                return function () {
                    return b.apply(a, arguments)
                }
            }, createClass: function (b) {
                var a = b.$, d = b.base, h = b.privates || b._, e = b.proto, b = b.statics;
                !a && (a = function () {
                    d && this.base.apply(this, arguments)
                });
                if (h)var n = a, a = function () {
                    var d = this._ || (this._ = {}), a;
                    for (a in h) {
                        var b = h[a];
                        d[a] = typeof b == "function" ? CKEDITOR.tools.bind(b, this) : b
                    }
                    n.apply(this, arguments)
                };
                if (d) {
                    a.prototype = this.prototypedCopy(d.prototype);
                    a.prototype.constructor = a;
                    a.base =
                        d;
                    a.baseProto = d.prototype;
                    a.prototype.base = function () {
                        this.base = d.prototype.base;
                        d.apply(this, arguments);
                        this.base = arguments.callee
                    }
                }
                e && this.extend(a.prototype, e, true);
                b && this.extend(a, b, true);
                return a
            }, addFunction: function (b, c) {
                return a.push(function () {
                        return b.apply(c || this, arguments)
                    }) - 1
            }, removeFunction: function (b) {
                a[b] = null
            }, callFunction: function (b) {
                var c = a[b];
                return c && c.apply(window, Array.prototype.slice.call(arguments, 1))
            }, cssLength: function () {
                var a = /^-?\d+\.?\d*px$/, c;
                return function (d) {
                    c =
                        CKEDITOR.tools.trim(d + "") + "px";
                    return a.test(c) ? c : d || ""
                }
            }(), convertToPx: function () {
                var a;
                return function (c) {
                    if (!a) {
                        a = CKEDITOR.dom.element.createFromHtml('<div style="position:absolute;left:-9999px;top:-9999px;margin:0px;padding:0px;border:0px;"></div>', CKEDITOR.document);
                        CKEDITOR.document.getBody().append(a)
                    }
                    if (!/%$/.test(c)) {
                        a.setStyle("width", c);
                        return a.$.clientWidth
                    }
                    return c
                }
            }(), repeat: function (a, c) {
                return Array(c + 1).join(a)
            }, tryThese: function () {
                for (var a, c = 0, d = arguments.length; c < d; c++) {
                    var h =
                        arguments[c];
                    try {
                        a = h();
                        break
                    } catch (e) {
                    }
                }
                return a
            }, genKey: function () {
                return Array.prototype.slice.call(arguments).join("-")
            }, defer: function (a) {
                return function () {
                    var c = arguments, d = this;
                    window.setTimeout(function () {
                        a.apply(d, c)
                    }, 0)
                }
            }, normalizeCssText: function (a, c) {
                var d = [], h, e = CKEDITOR.tools.parseCssText(a, true, c);
                for (h in e)d.push(h + ":" + e[h]);
                d.sort();
                return d.length ? d.join(";") + ";" : ""
            }, convertRgbToHex: function (a) {
                return a.replace(/(?:rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\))/gi, function (a, d, b, e) {
                    a =
                        [d, b, e];
                    for (d = 0; d < 3; d++)a[d] = ("0" + parseInt(a[d], 10).toString(16)).slice(-2);
                    return "#" + a.join("")
                })
            }, parseCssText: function (a, c, d) {
                var h = {};
                if (d) {
                    d = new CKEDITOR.dom.element("span");
                    d.setAttribute("style", a);
                    a = CKEDITOR.tools.convertRgbToHex(d.getAttribute("style") || "")
                }
                if (!a || a == ";")return h;
                a.replace(/&quot;/g, '"').replace(/\s*([^:;\s]+)\s*:\s*([^;]+)\s*(?=;|$)/g, function (a, d, b) {
                    if (c) {
                        d = d.toLowerCase();
                        d == "font-family" && (b = b.toLowerCase().replace(/["']/g, "").replace(/\s*,\s*/g, ","));
                        b = CKEDITOR.tools.trim(b)
                    }
                    h[d] =
                        b
                });
                return h
            }, writeCssText: function (a, c) {
                var d, h = [];
                for (d in a)h.push(d + ":" + a[d]);
                c && h.sort();
                return h.join("; ")
            }, objectCompare: function (a, c, d) {
                var h;
                if (!a && !c)return true;
                if (!a || !c)return false;
                for (h in a)if (a[h] != c[h])return false;
                if (!d)for (h in c)if (a[h] != c[h])return false;
                return true
            }, objectKeys: function (a) {
                var c = [], d;
                for (d in a)c.push(d);
                return c
            }, convertArrayToObject: function (a, c) {
                var d = {};
                arguments.length == 1 && (c = true);
                for (var h = 0, e = a.length; h < e; ++h)d[a[h]] = c;
                return d
            }, fixDomain: function () {
                for (var a; ;)try {
                    a =
                        window.parent.document.domain;
                    break
                } catch (c) {
                    a = a ? a.replace(/.+?(?:\.|$)/, "") : document.domain;
                    if (!a)break;
                    document.domain = a
                }
                return !!a
            }, eventsBuffer: function (a, c) {
                function d() {
                    e = (new Date).getTime();
                    h = false;
                    c()
                }

                var h, e = 0;
                return {
                    input: function () {
                        if (!h) {
                            var c = (new Date).getTime() - e;
                            c < a ? h = setTimeout(d, a - c) : d()
                        }
                    }, reset: function () {
                        h && clearTimeout(h);
                        h = e = 0
                    }
                }
            }, enableHtml5Elements: function (a, c) {
                for (var d = ["abbr", "article", "aside", "audio", "bdi", "canvas", "data", "datalist", "details", "figcaption", "figure", "footer",
                        "header", "hgroup", "mark", "meter", "nav", "output", "progress", "section", "summary", "time", "video"],
                         h = d.length, e; h--;) {
                    e = a.createElement(d[h]);
                    c && a.appendChild(e)
                }
            }
        }
    })();
    CKEDITOR.dtd = function () {
        var a = CKEDITOR.tools.extend, e = function (a, d) {
                for (var b = CKEDITOR.tools.clone(a), h = 1; h < arguments.length; h++) {
                    var d = arguments[h], c;
                    for (c in d)delete b[c]
                }
                return b
            }, b = {}, c = {}, d = {
                address: 1,
                article: 1,
                aside: 1,
                blockquote: 1,
                details: 1,
                div: 1,
                dl: 1,
                fieldset: 1,
                figure: 1,
                footer: 1,
                form: 1,
                h1: 1,
                h2: 1,
                h3: 1,
                h4: 1,
                h5: 1,
                h6: 1,
                header: 1,
                hgroup: 1,
                hr: 1,
                menu: 1,
                nav: 1,
                ol: 1,
                p: 1,
                pre: 1,
                section: 1,
                table: 1,
                ul: 1
            }, h = {command: 1, link: 1, meta: 1, noscript: 1, script: 1, style: 1}, g = {}, n = {"#": 1},
            i = {center: 1, dir: 1, noframes: 1};
        a(b, {
            a: 1,
            abbr: 1,
            area: 1,
            audio: 1,
            b: 1,
            bdi: 1,
            bdo: 1,
            br: 1,
            button: 1,
            canvas: 1,
            cite: 1,
            code: 1,
            command: 1,
            datalist: 1,
            del: 1,
            dfn: 1,
            em: 1,
            embed: 1,
            i: 1,
            iframe: 1,
            img: 1,
            input: 1,
            ins: 1,
            kbd: 1,
            keygen: 1,
            label: 1,
            map: 1,
            mark: 1,
            meter: 1,
            noscript: 1,
            object: 1,
            output: 1,
            progress: 1,
            q: 1,
            ruby: 1,
            s: 1,
            samp: 1,
            script: 1,
            select: 1,
            small: 1,
            span: 1,
            strong: 1,
            sub: 1,
            sup: 1,
            textarea: 1,
            time: 1,
            u: 1,
            "var": 1,
            video: 1,
            wbr: 1
        }, n, {acronym: 1, applet: 1, basefont: 1, big: 1, font: 1, isindex: 1, strike: 1, style: 1, tt: 1});
        a(c, d, b, i);
        e = {
            a: e(b, {a: 1, button: 1}),
            abbr: b,
            address: c,
            area: g,
            article: a({style: 1}, c),
            aside: a({style: 1}, c),
            audio: a({source: 1, track: 1}, c),
            b: b,
            base: g,
            bdi: b,
            bdo: b,
            blockquote: c,
            body: c,
            br: g,
            button: e(b, {a: 1, button: 1}),
            canvas: b,
            caption: c,
            cite: b,
            code: b,
            col: g,
            colgroup: {col: 1},
            command: g,
            datalist: a({option: 1}, b),
            dd: c,
            del: b,
            details: a({summary: 1}, c),
            dfn: b,
            div: a({style: 1}, c),
            dl: {dt: 1, dd: 1},
            dt: c,
            em: b,
            embed: g,
            fieldset: a({legend: 1}, c),
            figcaption: c,
            figure: a({figcaption: 1}, c),
            footer: c,
            form: c,
            h1: b,
            h2: b,
            h3: b,
            h4: b,
            h5: b,
            h6: b,
            head: a({title: 1, base: 1}, h),
            header: c,
            hgroup: {
                h1: 1,
                h2: 1, h3: 1, h4: 1, h5: 1, h6: 1
            },
            hr: g,
            html: a({head: 1, body: 1}, c, h),
            i: b,
            iframe: n,
            img: g,
            input: g,
            ins: b,
            kbd: b,
            keygen: g,
            label: b,
            legend: b,
            li: c,
            link: g,
            map: c,
            mark: b,
            menu: a({li: 1}, c),
            meta: g,
            meter: e(b, {meter: 1}),
            nav: c,
            noscript: a({link: 1, meta: 1, style: 1}, b),
            object: a({param: 1}, b),
            ol: {li: 1},
            optgroup: {option: 1},
            option: n,
            output: b,
            p: b,
            param: g,
            pre: b,
            progress: e(b, {progress: 1}),
            q: b,
            rp: b,
            rt: b,
            ruby: a({rp: 1, rt: 1}, b),
            s: b,
            samp: b,
            script: n,
            section: a({style: 1}, c),
            select: {optgroup: 1, option: 1},
            small: b,
            source: g,
            span: b,
            strong: b,
            style: n,
            sub: b,
            summary: b,
            sup: b,
            table: {caption: 1, colgroup: 1, thead: 1, tfoot: 1, tbody: 1, tr: 1},
            tbody: {tr: 1},
            td: c,
            textarea: n,
            tfoot: {tr: 1},
            th: c,
            thead: {tr: 1},
            time: e(b, {time: 1}),
            title: n,
            tr: {th: 1, td: 1},
            track: g,
            u: b,
            ul: {li: 1},
            "var": b,
            video: a({source: 1, track: 1}, c),
            wbr: g,
            acronym: b,
            applet: a({param: 1}, c),
            basefont: g,
            big: b,
            center: c,
            dialog: g,
            dir: {li: 1},
            font: b,
            isindex: g,
            noframes: c,
            strike: b,
            tt: b
        };
        a(e, {
            $block: a({audio: 1, dd: 1, dt: 1, figcaption: 1, li: 1, video: 1}, d, i),
            $blockLimit: {
                article: 1,
                aside: 1,
                audio: 1,
                body: 1,
                caption: 1,
                details: 1,
                dir: 1,
                div: 1,
                dl: 1,
                fieldset: 1,
                figcaption: 1,
                figure: 1,
                footer: 1,
                form: 1,
                header: 1,
                hgroup: 1,
                menu: 1,
                nav: 1,
                ol: 1,
                section: 1,
                table: 1,
                td: 1,
                th: 1,
                tr: 1,
                ul: 1,
                video: 1
            },
            $cdata: {script: 1, style: 1},
            $editable: {
                address: 1,
                article: 1,
                aside: 1,
                blockquote: 1,
                body: 1,
                details: 1,
                div: 1,
                fieldset: 1,
                figcaption: 1,
                footer: 1,
                form: 1,
                h1: 1,
                h2: 1,
                h3: 1,
                h4: 1,
                h5: 1,
                h6: 1,
                header: 1,
                hgroup: 1,
                nav: 1,
                p: 1,
                pre: 1,
                section: 1
            },
            $empty: {
                area: 1,
                base: 1,
                basefont: 1,
                br: 1,
                col: 1,
                command: 1,
                dialog: 1,
                embed: 1,
                hr: 1,
                img: 1,
                input: 1,
                isindex: 1,
                keygen: 1,
                link: 1,
                meta: 1,
                param: 1,
                source: 1,
                track: 1,
                wbr: 1
            },
            $inline: b,
            $list: {dl: 1, ol: 1, ul: 1},
            $listItem: {dd: 1, dt: 1, li: 1},
            $nonBodyContent: a({body: 1, head: 1, html: 1}, e.head),
            $nonEditable: {
                applet: 1,
                audio: 1,
                button: 1,
                embed: 1,
                iframe: 1,
                map: 1,
                object: 1,
                option: 1,
                param: 1,
                script: 1,
                textarea: 1,
                video: 1
            },
            $object: {
                applet: 1,
                audio: 1,
                button: 1,
                hr: 1,
                iframe: 1,
                img: 1,
                input: 1,
                object: 1,
                select: 1,
                table: 1,
                textarea: 1,
                video: 1
            },
            $removeEmpty: {
                abbr: 1,
                acronym: 1,
                b: 1,
                bdi: 1,
                bdo: 1,
                big: 1,
                cite: 1,
                code: 1,
                del: 1,
                dfn: 1,
                em: 1,
                font: 1,
                i: 1,
                ins: 1,
                label: 1,
                kbd: 1,
                mark: 1,
                meter: 1,
                output: 1,
                q: 1,
                ruby: 1,
                s: 1,
                samp: 1,
                small: 1,
                span: 1,
                strike: 1,
                strong: 1,
                sub: 1,
                sup: 1,
                time: 1,
                tt: 1,
                u: 1,
                "var": 1
            },
            $tabIndex: {a: 1, area: 1, button: 1, input: 1, object: 1, select: 1, textarea: 1},
            $tableContent: {caption: 1, col: 1, colgroup: 1, tbody: 1, td: 1, tfoot: 1, th: 1, thead: 1, tr: 1},
            $transparent: {a: 1, audio: 1, canvas: 1, del: 1, ins: 1, map: 1, noscript: 1, object: 1, video: 1},
            $intermediate: {
                caption: 1,
                colgroup: 1,
                dd: 1,
                dt: 1,
                figcaption: 1,
                legend: 1,
                li: 1,
                optgroup: 1,
                option: 1,
                rp: 1,
                rt: 1,
                summary: 1,
                tbody: 1,
                td: 1,
                tfoot: 1,
                th: 1,
                thead: 1,
                tr: 1
            }
        });
        return e
    }();
    CKEDITOR.dom.event = function (a) {
        this.$ = a
    };
    CKEDITOR.dom.event.prototype = {
        getKey: function () {
            return this.$.keyCode || this.$.which
        }, getKeystroke: function () {
            var a = this.getKey();
            if (this.$.ctrlKey || this.$.metaKey) a = a + CKEDITOR.CTRL;
            this.$.shiftKey && (a = a + CKEDITOR.SHIFT);
            this.$.altKey && (a = a + CKEDITOR.ALT);
            return a
        }, preventDefault: function (a) {
            var e = this.$;
            e.preventDefault ? e.preventDefault() : e.returnValue = false;
            a && this.stopPropagation()
        }, stopPropagation: function () {
            var a = this.$;
            a.stopPropagation ? a.stopPropagation() : a.cancelBubble = true
        }, getTarget: function () {
            var a =
                this.$.target || this.$.srcElement;
            return a ? new CKEDITOR.dom.node(a) : null
        }, getPhase: function () {
            return this.$.eventPhase || 2
        }, getPageOffset: function () {
            var a = this.getTarget().getDocument().$;
            return {
                x: this.$.pageX || this.$.clientX + (a.documentElement.scrollLeft || a.body.scrollLeft),
                y: this.$.pageY || this.$.clientY + (a.documentElement.scrollTop || a.body.scrollTop)
            }
        }
    };
    CKEDITOR.CTRL = 1114112;
    CKEDITOR.SHIFT = 2228224;
    CKEDITOR.ALT = 4456448;
    CKEDITOR.EVENT_PHASE_CAPTURING = 1;
    CKEDITOR.EVENT_PHASE_AT_TARGET = 2;
    CKEDITOR.EVENT_PHASE_BUBBLING = 3;
    CKEDITOR.dom.domObject = function (a) {
        if (a) this.$ = a
    };
    CKEDITOR.dom.domObject.prototype = function () {
        var a = function (a, b) {
            return function (c) {
                typeof CKEDITOR != "undefined" && a.fire(b, new CKEDITOR.dom.event(c))
            }
        };
        return {
            getPrivate: function () {
                var a;
                if (!(a = this.getCustomData("_"))) this.setCustomData("_", a = {});
                return a
            }, on: function (e) {
                var b = this.getCustomData("_cke_nativeListeners");
                if (!b) {
                    b = {};
                    this.setCustomData("_cke_nativeListeners", b)
                }
                if (!b[e]) {
                    b = b[e] = a(this, e);
                    this.$.addEventListener ? this.$.addEventListener(e, b, !!CKEDITOR.event.useCapture) : this.$.attachEvent &&
                        this.$.attachEvent("on" + e, b)
                }
                return CKEDITOR.event.prototype.on.apply(this, arguments)
            }, removeListener: function (a) {
                CKEDITOR.event.prototype.removeListener.apply(this, arguments);
                if (!this.hasListeners(a)) {
                    var b = this.getCustomData("_cke_nativeListeners"), c = b && b[a];
                    if (c) {
                        this.$.removeEventListener ? this.$.removeEventListener(a, c, false) : this.$.detachEvent && this.$.detachEvent("on" + a, c);
                        delete b[a]
                    }
                }
            }, removeAllListeners: function () {
                var a = this.getCustomData("_cke_nativeListeners"), b;
                for (b in a) {
                    var c = a[b];
                    this.$.detachEvent ?
                        this.$.detachEvent("on" + b, c) : this.$.removeEventListener && this.$.removeEventListener(b, c, false);
                    delete a[b]
                }
            }
        }
    }();
    (function (a) {
        var e = {};
        CKEDITOR.on("reset", function () {
            e = {}
        });
        a.equals = function (a) {
            try {
                return a && a.$ === this.$
            } catch (c) {
                return false
            }
        };
        a.setCustomData = function (a, c) {
            var d = this.getUniqueId();
            (e[d] || (e[d] = {}))[a] = c;
            return this
        };
        a.getCustomData = function (a) {
            var c = this.$["data-cke-expando"];
            return (c = c && e[c]) && a in c ? c[a] : null
        };
        a.removeCustomData = function (a) {
            var c = this.$["data-cke-expando"], c = c && e[c], d, h;
            if (c) {
                d = c[a];
                h = a in c;
                delete c[a]
            }
            return h ? d : null
        };
        a.clearCustomData = function () {
            this.removeAllListeners();
            var a = this.$["data-cke-expando"];
            a && delete e[a]
        };
        a.getUniqueId = function () {
            return this.$["data-cke-expando"] || (this.$["data-cke-expando"] = CKEDITOR.tools.getNextNumber())
        };
        CKEDITOR.event.implementOn(a)
    })(CKEDITOR.dom.domObject.prototype);
    CKEDITOR.dom.node = function (a) {
        return a ? new CKEDITOR.dom[a.nodeType == CKEDITOR.NODE_DOCUMENT ? "document" : a.nodeType == CKEDITOR.NODE_ELEMENT ? "element" : a.nodeType == CKEDITOR.NODE_TEXT ? "text" : a.nodeType == CKEDITOR.NODE_COMMENT ? "comment" : a.nodeType == CKEDITOR.NODE_DOCUMENT_FRAGMENT ? "documentFragment" : "domObject"](a) : this
    };
    CKEDITOR.dom.node.prototype = new CKEDITOR.dom.domObject;
    CKEDITOR.NODE_ELEMENT = 1;
    CKEDITOR.NODE_DOCUMENT = 9;
    CKEDITOR.NODE_TEXT = 3;
    CKEDITOR.NODE_COMMENT = 8;
    CKEDITOR.NODE_DOCUMENT_FRAGMENT = 11;
    CKEDITOR.POSITION_IDENTICAL = 0;
    CKEDITOR.POSITION_DISCONNECTED = 1;
    CKEDITOR.POSITION_FOLLOWING = 2;
    CKEDITOR.POSITION_PRECEDING = 4;
    CKEDITOR.POSITION_IS_CONTAINED = 8;
    CKEDITOR.POSITION_CONTAINS = 16;
    CKEDITOR.tools.extend(CKEDITOR.dom.node.prototype, {
        appendTo: function (a, e) {
            a.append(this, e);
            return a
        }, clone: function (a, e) {
            var b = this.$.cloneNode(a), c = function (d) {
                d["data-cke-expando"] && (d["data-cke-expando"] = false);
                if (d.nodeType == CKEDITOR.NODE_ELEMENT) {
                    e || d.removeAttribute("id", false);
                    if (a)for (var d = d.childNodes, b = 0; b < d.length; b++)c(d[b])
                }
            };
            c(b);
            return new CKEDITOR.dom.node(b)
        }, hasPrevious: function () {
            return !!this.$.previousSibling
        }, hasNext: function () {
            return !!this.$.nextSibling
        }, insertAfter: function (a) {
            a.$.parentNode.insertBefore(this.$,
                a.$.nextSibling);
            return a
        }, insertBefore: function (a) {
            a.$.parentNode.insertBefore(this.$, a.$);
            return a
        }, insertBeforeMe: function (a) {
            this.$.parentNode.insertBefore(a.$, this.$);
            return a
        }, getAddress: function (a) {
            for (var e = [], b = this.getDocument().$.documentElement, c = this.$; c && c != b;) {
                var d = c.parentNode;
                d && e.unshift(this.getIndex.call({$: c}, a));
                c = d
            }
            return e
        }, getDocument: function () {
            return new CKEDITOR.dom.document(this.$.ownerDocument || this.$.parentNode.ownerDocument)
        }, getIndex: function (a) {
            var e = this.$, b = -1,
                c;
            if (!this.$.parentNode)return b;
            do if (!a || !(e != this.$ && e.nodeType == CKEDITOR.NODE_TEXT && (c || !e.nodeValue))) {
                b++;
                c = e.nodeType == CKEDITOR.NODE_TEXT
            } while (e = e.previousSibling);
            return b
        }, getNextSourceNode: function (a, e, b) {
            if (b && !b.call)var c = b, b = function (a) {
                return !a.equals(c)
            };
            var a = !a && this.getFirst && this.getFirst(), d;
            if (!a) {
                if (this.type == CKEDITOR.NODE_ELEMENT && b && b(this, true) === false)return null;
                a = this.getNext()
            }
            for (; !a && (d = (d || this).getParent());) {
                if (b && b(d, true) === false)return null;
                a = d.getNext()
            }
            return !a ||
            b && b(a) === false ? null : e && e != a.type ? a.getNextSourceNode(false, e, b) : a
        }, getPreviousSourceNode: function (a, e, b) {
            if (b && !b.call)var c = b, b = function (a) {
                return !a.equals(c)
            };
            var a = !a && this.getLast && this.getLast(), d;
            if (!a) {
                if (this.type == CKEDITOR.NODE_ELEMENT && b && b(this, true) === false)return null;
                a = this.getPrevious()
            }
            for (; !a && (d = (d || this).getParent());) {
                if (b && b(d, true) === false)return null;
                a = d.getPrevious()
            }
            return !a || b && b(a) === false ? null : e && a.type != e ? a.getPreviousSourceNode(false, e, b) : a
        }, getPrevious: function (a) {
            var e =
                this.$, b;
            do b = (e = e.previousSibling) && e.nodeType != 10 && new CKEDITOR.dom.node(e); while (b && a && !a(b));
            return b
        }, getNext: function (a) {
            var e = this.$, b;
            do b = (e = e.nextSibling) && new CKEDITOR.dom.node(e); while (b && a && !a(b));
            return b
        }, getParent: function (a) {
            var e = this.$.parentNode;
            return e && (e.nodeType == CKEDITOR.NODE_ELEMENT || a && e.nodeType == CKEDITOR.NODE_DOCUMENT_FRAGMENT) ? new CKEDITOR.dom.node(e) : null
        }, getParents: function (a) {
            var e = this, b = [];
            do b[a ? "push" : "unshift"](e); while (e = e.getParent());
            return b
        }, getCommonAncestor: function (a) {
            if (a.equals(this))return this;
            if (a.contains && a.contains(this))return a;
            var e = this.contains ? this : this.getParent();
            do if (e.contains(a))return e; while (e = e.getParent());
            return null
        }, getPosition: function (a) {
            var e = this.$, b = a.$;
            if (e.compareDocumentPosition)return e.compareDocumentPosition(b);
            if (e == b)return CKEDITOR.POSITION_IDENTICAL;
            if (this.type == CKEDITOR.NODE_ELEMENT && a.type == CKEDITOR.NODE_ELEMENT) {
                if (e.contains) {
                    if (e.contains(b))return CKEDITOR.POSITION_CONTAINS + CKEDITOR.POSITION_PRECEDING;
                    if (b.contains(e))return CKEDITOR.POSITION_IS_CONTAINED +
                        CKEDITOR.POSITION_FOLLOWING
                }
                if ("sourceIndex" in e)return e.sourceIndex < 0 || b.sourceIndex < 0 ? CKEDITOR.POSITION_DISCONNECTED : e.sourceIndex < b.sourceIndex ? CKEDITOR.POSITION_PRECEDING : CKEDITOR.POSITION_FOLLOWING
            }
            for (var e = this.getAddress(), a = a.getAddress(), b = Math.min(e.length, a.length),
                     c = 0; c <= b - 1; c++)if (e[c] != a[c]) {
                if (c < b)return e[c] < a[c] ? CKEDITOR.POSITION_PRECEDING : CKEDITOR.POSITION_FOLLOWING;
                break
            }
            return e.length < a.length ? CKEDITOR.POSITION_CONTAINS + CKEDITOR.POSITION_PRECEDING : CKEDITOR.POSITION_IS_CONTAINED +
                CKEDITOR.POSITION_FOLLOWING
        }, getAscendant: function (a, e) {
            var b = this.$, c;
            if (!e) b = b.parentNode;
            for (; b;) {
                if (b.nodeName && (c = b.nodeName.toLowerCase(), typeof a == "string" ? c == a : c in a))return new CKEDITOR.dom.node(b);
                try {
                    b = b.parentNode
                } catch (d) {
                    b = null
                }
            }
            return null
        }, hasAscendant: function (a, e) {
            var b = this.$;
            if (!e) b = b.parentNode;
            for (; b;) {
                if (b.nodeName && b.nodeName.toLowerCase() == a)return true;
                b = b.parentNode
            }
            return false
        }, move: function (a, e) {
            a.append(this.remove(), e)
        }, remove: function (a) {
            var e = this.$, b = e.parentNode;
            if (b) {
                if (a)for (; a = e.firstChild;)b.insertBefore(e.removeChild(a), e);
                b.removeChild(e)
            }
            return this
        }, replace: function (a) {
            this.insertBefore(a);
            a.remove()
        }, trim: function () {
            this.ltrim();
            this.rtrim()
        }, ltrim: function () {
            for (var a; this.getFirst && (a = this.getFirst());) {
                if (a.type == CKEDITOR.NODE_TEXT) {
                    var e = CKEDITOR.tools.ltrim(a.getText()), b = a.getLength();
                    if (e) {
                        if (e.length < b) {
                            a.split(b - e.length);
                            this.$.removeChild(this.$.firstChild)
                        }
                    } else {
                        a.remove();
                        continue
                    }
                }
                break
            }
        }, rtrim: function () {
            for (var a; this.getLast && (a =
                this.getLast());) {
                if (a.type == CKEDITOR.NODE_TEXT) {
                    var e = CKEDITOR.tools.rtrim(a.getText()), b = a.getLength();
                    if (e) {
                        if (e.length < b) {
                            a.split(e.length);
                            this.$.lastChild.parentNode.removeChild(this.$.lastChild)
                        }
                    } else {
                        a.remove();
                        continue
                    }
                }
                break
            }
            if (CKEDITOR.env.needsBrFiller) (a = this.$.lastChild) && (a.type == 1 && a.nodeName.toLowerCase() == "br") && a.parentNode.removeChild(a)
        }, isReadOnly: function () {
            var a = this;
            this.type != CKEDITOR.NODE_ELEMENT && (a = this.getParent());
            if (a && typeof a.$.isContentEditable != "undefined")return !(a.$.isContentEditable ||
            a.data("cke-editable"));
            for (; a;) {
                if (a.data("cke-editable"))break;
                if (a.getAttribute("contentEditable") == "false")return true;
                if (a.getAttribute("contentEditable") == "true")break;
                a = a.getParent()
            }
            return !a
        }
    });
    CKEDITOR.dom.window = function (a) {
        CKEDITOR.dom.domObject.call(this, a)
    };
    CKEDITOR.dom.window.prototype = new CKEDITOR.dom.domObject;
    CKEDITOR.tools.extend(CKEDITOR.dom.window.prototype, {
        focus: function () {
            this.$.focus()
        }, getViewPaneSize: function () {
            var a = this.$.document, e = a.compatMode == "CSS1Compat";
            return {
                width: (e ? a.documentElement.clientWidth : a.body.clientWidth) || 0,
                height: (e ? a.documentElement.clientHeight : a.body.clientHeight) || 0
            }
        }, getScrollPosition: function () {
            var a = this.$;
            if ("pageXOffset" in a)return {x: a.pageXOffset || 0, y: a.pageYOffset || 0};
            a = a.document;
            return {
                x: a.documentElement.scrollLeft || a.body.scrollLeft || 0, y: a.documentElement.scrollTop ||
                a.body.scrollTop || 0
            }
        }, getFrame: function () {
            var a = this.$.frameElement;
            return a ? new CKEDITOR.dom.element.get(a) : null
        }
    });
    CKEDITOR.dom.document = function (a) {
        CKEDITOR.dom.domObject.call(this, a)
    };
    CKEDITOR.dom.document.prototype = new CKEDITOR.dom.domObject;
    CKEDITOR.tools.extend(CKEDITOR.dom.document.prototype, {
        type: CKEDITOR.NODE_DOCUMENT, appendStyleSheet: function (a) {
            if (this.$.createStyleSheet) this.$.createStyleSheet(a); else {
                var e = new CKEDITOR.dom.element("link");
                e.setAttributes({rel: "stylesheet", type: "text/css", href: a});
                this.getHead().append(e)
            }
        }, appendStyleText: function (a) {
            if (this.$.createStyleSheet) {
                var e = this.$.createStyleSheet("");
                e.cssText = a
            } else {
                var b = new CKEDITOR.dom.element("style", this);
                b.append(new CKEDITOR.dom.text(a, this));
                this.getHead().append(b)
            }
            return e ||
                b.$.sheet
        }, createElement: function (a, e) {
            var b = new CKEDITOR.dom.element(a, this);
            if (e) {
                e.attributes && b.setAttributes(e.attributes);
                e.styles && b.setStyles(e.styles)
            }
            return b
        }, createText: function (a) {
            return new CKEDITOR.dom.text(a, this)
        }, focus: function () {
            this.getWindow().focus()
        }, getActive: function () {
            return new CKEDITOR.dom.element(this.$.activeElement)
        }, getById: function (a) {
            return (a = this.$.getElementById(a)) ? new CKEDITOR.dom.element(a) : null
        }, getByAddress: function (a, e) {
            for (var b = this.$.documentElement, c =
                0; b && c < a.length; c++) {
                var d = a[c];
                if (e)for (var h = -1, g = 0; g < b.childNodes.length; g++) {
                    var n = b.childNodes[g];
                    if (!(e === true && n.nodeType == 3 && n.previousSibling && n.previousSibling.nodeType == 3)) {
                        h++;
                        if (h == d) {
                            b = n;
                            break
                        }
                    }
                } else b = b.childNodes[d]
            }
            return b ? new CKEDITOR.dom.node(b) : null
        }, getElementsByTag: function (a, e) {
            if ((!CKEDITOR.env.ie || document.documentMode > 8) && e) a = e + ":" + a;
            return new CKEDITOR.dom.nodeList(this.$.getElementsByTagName(a))
        }, getHead: function () {
            var a = this.$.getElementsByTagName("head")[0];
            return a =
                a ? new CKEDITOR.dom.element(a) : this.getDocumentElement().append(new CKEDITOR.dom.element("head"), true)
        }, getBody: function () {
            return new CKEDITOR.dom.element(this.$.body)
        }, getDocumentElement: function () {
            return new CKEDITOR.dom.element(this.$.documentElement)
        }, getWindow: function () {
            return new CKEDITOR.dom.window(this.$.parentWindow || this.$.defaultView)
        }, write: function (a) {
            this.$.open("text/html", "replace");
            CKEDITOR.env.ie && (a = a.replace(/(?:^\s*<!DOCTYPE[^>]*?>)|^/i, '$&\n<script data-cke-temp="1">(' + CKEDITOR.tools.fixDomain +
                ")();<\/script>"));
            this.$.write(a);
            this.$.close()
        }, find: function (a) {
            return new CKEDITOR.dom.nodeList(this.$.querySelectorAll(a))
        }, findOne: function (a) {
            return (a = this.$.querySelector(a)) ? new CKEDITOR.dom.element(a) : null
        }, _getHtml5ShivFrag: function () {
            var a = this.getCustomData("html5ShivFrag");
            if (!a) {
                a = this.$.createDocumentFragment();
                CKEDITOR.tools.enableHtml5Elements(a, true);
                this.setCustomData("html5ShivFrag", a)
            }
            return a
        }
    });
    CKEDITOR.dom.nodeList = function (a) {
        this.$ = a
    };
    CKEDITOR.dom.nodeList.prototype = {
        count: function () {
            return this.$.length
        }, getItem: function (a) {
            if (a < 0 || a >= this.$.length)return null;
            return (a = this.$[a]) ? new CKEDITOR.dom.node(a) : null
        }
    };
    CKEDITOR.dom.element = function (a, e) {
        typeof a == "string" && (a = (e ? e.$ : document).createElement(a));
        CKEDITOR.dom.domObject.call(this, a)
    };
    CKEDITOR.dom.element.get = function (a) {
        return (a = typeof a == "string" ? document.getElementById(a) || document.getElementsByName(a)[0] : a) && (a.$ ? a : new CKEDITOR.dom.element(a))
    };
    CKEDITOR.dom.element.prototype = new CKEDITOR.dom.node;
    CKEDITOR.dom.element.createFromHtml = function (a, e) {
        var b = new CKEDITOR.dom.element("div", e);
        b.setHtml(a);
        return b.getFirst().remove()
    };
    CKEDITOR.dom.element.setMarker = function (a, e, b, c) {
        var d = e.getCustomData("list_marker_id") || e.setCustomData("list_marker_id", CKEDITOR.tools.getNextNumber()).getCustomData("list_marker_id"),
            h = e.getCustomData("list_marker_names") || e.setCustomData("list_marker_names", {}).getCustomData("list_marker_names");
        a[d] = e;
        h[b] = 1;
        return e.setCustomData(b, c)
    };
    CKEDITOR.dom.element.clearAllMarkers = function (a) {
        for (var e in a)CKEDITOR.dom.element.clearMarkers(a, a[e], 1)
    };
    CKEDITOR.dom.element.clearMarkers = function (a, e, b) {
        var c = e.getCustomData("list_marker_names"), d = e.getCustomData("list_marker_id"), h;
        for (h in c)e.removeCustomData(h);
        e.removeCustomData("list_marker_names");
        if (b) {
            e.removeCustomData("list_marker_id");
            delete a[d]
        }
    };
    (function () {
        function a(a) {
            var b = true;
            if (!a.$.id) {
                a.$.id = "cke_tmp_" + CKEDITOR.tools.getNextNumber();
                b = false
            }
            return function () {
                b || a.removeAttribute("id")
            }
        }

        function e(a, b) {
            return "#" + a.$.id + " " + b.split(/,\s*/).join(", #" + a.$.id + " ")
        }

        function b(a) {
            for (var b = 0, e = 0,
                     n = c[a].length; e < n; e++)b = b + (parseInt(this.getComputedStyle(c[a][e]) || 0, 10) || 0);
            return b
        }

        CKEDITOR.tools.extend(CKEDITOR.dom.element.prototype, {
            type: CKEDITOR.NODE_ELEMENT,
            addClass: function (a) {
                var b = this.$.className;
                b && (RegExp("(?:^|\\s)" + a + "(?:\\s|$)",
                    "").test(b) || (b = b + (" " + a)));
                this.$.className = b || a
            },
            removeClass: function (a) {
                var b = this.getAttribute("class");
                if (b) {
                    a = RegExp("(?:^|\\s+)" + a + "(?=\\s|$)", "i");
                    if (a.test(b)) (b = b.replace(a, "").replace(/^\s+/, "")) ? this.setAttribute("class", b) : this.removeAttribute("class")
                }
                return this
            },
            hasClass: function (a) {
                return RegExp("(?:^|\\s+)" + a + "(?=\\s|$)", "").test(this.getAttribute("class"))
            },
            append: function (a, b) {
                typeof a == "string" && (a = this.getDocument().createElement(a));
                b ? this.$.insertBefore(a.$, this.$.firstChild) :
                    this.$.appendChild(a.$);
                return a
            },
            appendHtml: function (a) {
                if (this.$.childNodes.length) {
                    var b = new CKEDITOR.dom.element("div", this.getDocument());
                    b.setHtml(a);
                    b.moveChildren(this)
                } else this.setHtml(a)
            },
            appendText: function (a) {
                this.$.text != void 0 ? this.$.text = this.$.text + a : this.append(new CKEDITOR.dom.text(a))
            },
            appendBogus: function (a) {
                if (a || CKEDITOR.env.needsBrFiller || CKEDITOR.env.opera) {
                    for (a = this.getLast(); a && a.type == CKEDITOR.NODE_TEXT && !CKEDITOR.tools.rtrim(a.getText());)a = a.getPrevious();
                    if (!a || !a.is ||
                        !a.is("br")) {
                        a = CKEDITOR.env.opera ? this.getDocument().createText("") : this.getDocument().createElement("br");
                        CKEDITOR.env.gecko && a.setAttribute("type", "_moz");
                        this.append(a)
                    }
                }
            },
            breakParent: function (a) {
                var b = new CKEDITOR.dom.range(this.getDocument());
                b.setStartAfter(this);
                b.setEndAfter(a);
                a = b.extractContents();
                b.insertNode(this.remove());
                a.insertAfterNode(this)
            },
            contains: CKEDITOR.env.ie || CKEDITOR.env.webkit ? function (a) {
                var b = this.$;
                return a.type != CKEDITOR.NODE_ELEMENT ? b.contains(a.getParent().$) : b !=
                    a.$ && b.contains(a.$)
            } : function (a) {
                return !!(this.$.compareDocumentPosition(a.$) & 16)
            },
            focus: function () {
                function a() {
                    try {
                        this.$.focus()
                    } catch (b) {
                    }
                }

                return function (b) {
                    b ? CKEDITOR.tools.setTimeout(a, 100, this) : a.call(this)
                }
            }(),
            getHtml: function () {
                var a = this.$.innerHTML;
                return CKEDITOR.env.ie ? a.replace(/<\?[^>]*>/g, "") : a
            },
            getOuterHtml: function () {
                if (this.$.outerHTML)return this.$.outerHTML.replace(/<\?[^>]*>/, "");
                var a = this.$.ownerDocument.createElement("div");
                a.appendChild(this.$.cloneNode(true));
                return a.innerHTML
            },
            getClientRect: function () {
                var a = CKEDITOR.tools.extend({}, this.$.getBoundingClientRect());
                !a.width && (a.width = a.right - a.left);
                !a.height && (a.height = a.bottom - a.top);
                return a
            },
            setHtml: CKEDITOR.env.ie && CKEDITOR.env.version < 9 ? function (a) {
                try {
                    var b = this.$;
                    if (this.getParent())return b.innerHTML = a;
                    var c = this.getDocument()._getHtml5ShivFrag();
                    c.appendChild(b);
                    b.innerHTML = a;
                    c.removeChild(b);
                    return a
                } catch (e) {
                    this.$.innerHTML = "";
                    b = new CKEDITOR.dom.element("body", this.getDocument());
                    b.$.innerHTML = a;
                    for (b = b.getChildren(); b.count();)this.append(b.getItem(0));
                    return a
                }
            } : function (a) {
                return this.$.innerHTML = a
            },
            setText: function (a) {
                CKEDITOR.dom.element.prototype.setText = this.$.innerText != void 0 ? function (a) {
                    return this.$.innerText = a
                } : function (a) {
                    return this.$.textContent = a
                };
                return this.setText(a)
            },
            getAttribute: function () {
                var a = function (a) {
                    return this.$.getAttribute(a, 2)
                };
                return CKEDITOR.env.ie && (CKEDITOR.env.ie7Compat || CKEDITOR.env.ie6Compat) ? function (a) {
                    switch (a) {
                        case "class":
                            a = "className";
                            break;
                        case "http-equiv":
                            a = "httpEquiv";
                            break;
                        case "name":
                            return this.$.name;
                        case "tabindex":
                            a = this.$.getAttribute(a, 2);
                            a !== 0 && this.$.tabIndex === 0 && (a = null);
                            return a;
                        case "checked":
                            a = this.$.attributes.getNamedItem(a);
                            return (a.specified ? a.nodeValue : this.$.checked) ? "checked" : null;
                        case "hspace":
                        case "value":
                            return this.$[a];
                        case "style":
                            return this.$.style.cssText;
                        case "contenteditable":
                        case "contentEditable":
                            return this.$.attributes.getNamedItem("contentEditable").specified ? this.$.getAttribute("contentEditable") : null
                    }
                    return this.$.getAttribute(a, 2)
                } : a
            }(),
            getChildren: function () {
                return new CKEDITOR.dom.nodeList(this.$.childNodes)
            },
            getComputedStyle: CKEDITOR.env.ie ? function (a) {
                return this.$.currentStyle[CKEDITOR.tools.cssStyleToDomStyle(a)]
            } : function (a) {
                var b = this.getWindow().$.getComputedStyle(this.$, null);
                return b ? b.getPropertyValue(a) : ""
            },
            getDtd: function () {
                var a = CKEDITOR.dtd[this.getName()];
                this.getDtd = function () {
                    return a
                };
                return a
            },
            getElementsByTag: CKEDITOR.dom.document.prototype.getElementsByTag,
            getTabIndex: CKEDITOR.env.ie ? function () {
                var a = this.$.tabIndex;
                a === 0 && (!CKEDITOR.dtd.$tabIndex[this.getName()] && parseInt(this.getAttribute("tabindex"),
                    10) !== 0) && (a = -1);
                return a
            } : CKEDITOR.env.webkit ? function () {
                var a = this.$.tabIndex;
                if (a == void 0) {
                    a = parseInt(this.getAttribute("tabindex"), 10);
                    isNaN(a) && (a = -1)
                }
                return a
            } : function () {
                return this.$.tabIndex
            },
            getText: function () {
                return this.$.textContent || this.$.innerText || ""
            },
            getWindow: function () {
                return this.getDocument().getWindow()
            },
            getId: function () {
                return this.$.id || null
            },
            getNameAtt: function () {
                return this.$.name || null
            },
            getName: function () {
                var a = this.$.nodeName.toLowerCase();
                if (CKEDITOR.env.ie && !(document.documentMode >
                    8)) {
                    var b = this.$.scopeName;
                    b != "HTML" && (a = b.toLowerCase() + ":" + a)
                }
                return (this.getName = function () {
                    return a
                })()
            },
            getValue: function () {
                return this.$.value
            },
            getFirst: function (a) {
                var b = this.$.firstChild;
                (b = b && new CKEDITOR.dom.node(b)) && (a && !a(b)) && (b = b.getNext(a));
                return b
            },
            getLast: function (a) {
                var b = this.$.lastChild;
                (b = b && new CKEDITOR.dom.node(b)) && (a && !a(b)) && (b = b.getPrevious(a));
                return b
            },
            getStyle: function (a) {
                return this.$.style[CKEDITOR.tools.cssStyleToDomStyle(a)]
            },
            is: function () {
                var a = this.getName();
                if (typeof arguments[0] == "object")return !!arguments[0][a];
                for (var b = 0; b < arguments.length; b++)if (arguments[b] == a)return true;
                return false
            },
            isEditable: function (a) {
                var b = this.getName();
                if (this.isReadOnly() || this.getComputedStyle("display") == "none" || this.getComputedStyle("visibility") == "hidden" || CKEDITOR.dtd.$nonEditable[b] || CKEDITOR.dtd.$empty[b] || this.is("a") && (this.data("cke-saved-name") || this.hasAttribute("name")) && !this.getChildCount())return false;
                if (a !== false) {
                    a = CKEDITOR.dtd[b] || CKEDITOR.dtd.span;
                    return !(!a || !a["#"])
                }
                return true
            },
            isIdentical: function (a) {
                var b = this.clone(0, 1), a = a.clone(0, 1);
                b.removeAttributes(["_moz_dirty", "data-cke-expando", "data-cke-saved-href", "data-cke-saved-name"]);
                a.removeAttributes(["_moz_dirty", "data-cke-expando", "data-cke-saved-href", "data-cke-saved-name"]);
                if (b.$.isEqualNode) {
                    b.$.style.cssText = CKEDITOR.tools.normalizeCssText(b.$.style.cssText);
                    a.$.style.cssText = CKEDITOR.tools.normalizeCssText(a.$.style.cssText);
                    return b.$.isEqualNode(a.$)
                }
                b = b.getOuterHtml();
                a = a.getOuterHtml();
                if (CKEDITOR.env.ie && CKEDITOR.env.version < 9 && this.is("a")) {
                    var c = this.getParent();
                    if (c.type == CKEDITOR.NODE_ELEMENT) {
                        c = c.clone();
                        c.setHtml(b);
                        b = c.getHtml();
                        c.setHtml(a);
                        a = c.getHtml()
                    }
                }
                return b == a
            },
            isVisible: function () {
                var a = (this.$.offsetHeight || this.$.offsetWidth) && this.getComputedStyle("visibility") != "hidden",
                    b, c;
                if (a && (CKEDITOR.env.webkit || CKEDITOR.env.opera)) {
                    b = this.getWindow();
                    if (!b.equals(CKEDITOR.document.getWindow()) && (c = b.$.frameElement)) a = (new CKEDITOR.dom.element(c)).isVisible()
                }
                return !!a
            },
            isEmptyInlineRemoveable: function () {
                if (!CKEDITOR.dtd.$removeEmpty[this.getName()])return false;
                for (var a = this.getChildren(), b = 0, c = a.count(); b < c; b++) {
                    var e = a.getItem(b);
                    if (!(e.type == CKEDITOR.NODE_ELEMENT && e.data("cke-bookmark")) && (e.type == CKEDITOR.NODE_ELEMENT && !e.isEmptyInlineRemoveable() || e.type == CKEDITOR.NODE_TEXT && CKEDITOR.tools.trim(e.getText())))return false
                }
                return true
            },
            hasAttributes: CKEDITOR.env.ie && (CKEDITOR.env.ie7Compat || CKEDITOR.env.ie6Compat) ? function () {
                for (var a = this.$.attributes, b = 0; b <
                a.length; b++) {
                    var c = a[b];
                    switch (c.nodeName) {
                        case "class":
                            if (this.getAttribute("class"))return true;
                        case "data-cke-expando":
                            continue;
                        default:
                            if (c.specified)return true
                    }
                }
                return false
            } : function () {
                var a = this.$.attributes, b = a.length, c = {"data-cke-expando": 1, _moz_dirty: 1};
                return b > 0 && (b > 2 || !c[a[0].nodeName] || b == 2 && !c[a[1].nodeName])
            },
            hasAttribute: function () {
                function a(b) {
                    b = this.$.attributes.getNamedItem(b);
                    return !(!b || !b.specified)
                }

                return CKEDITOR.env.ie && CKEDITOR.env.version < 8 ? function (b) {
                    return b == "name" ?
                        !!this.$.name : a.call(this, b)
                } : a
            }(),
            hide: function () {
                this.setStyle("display", "none")
            },
            moveChildren: function (a, b) {
                var c = this.$, a = a.$;
                if (c != a) {
                    var e;
                    if (b)for (; e = c.lastChild;)a.insertBefore(c.removeChild(e), a.firstChild); else for (; e = c.firstChild;)a.appendChild(c.removeChild(e))
                }
            },
            mergeSiblings: function () {
                function a(b, d, c) {
                    if (d && d.type == CKEDITOR.NODE_ELEMENT) {
                        for (var e = []; d.data("cke-bookmark") || d.isEmptyInlineRemoveable();) {
                            e.push(d);
                            d = c ? d.getNext() : d.getPrevious();
                            if (!d || d.type != CKEDITOR.NODE_ELEMENT)return
                        }
                        if (b.isIdentical(d)) {
                            for (var j =
                                c ? b.getLast() : b.getFirst(); e.length;)e.shift().move(b, !c);
                            d.moveChildren(b, !c);
                            d.remove();
                            j && j.type == CKEDITOR.NODE_ELEMENT && j.mergeSiblings()
                        }
                    }
                }

                return function (b) {
                    if (b === false || CKEDITOR.dtd.$removeEmpty[this.getName()] || this.is("a")) {
                        a(this, this.getNext(), true);
                        a(this, this.getPrevious())
                    }
                }
            }(),
            show: function () {
                this.setStyles({display: "", visibility: ""})
            },
            setAttribute: function () {
                var a = function (a, b) {
                    this.$.setAttribute(a, b);
                    return this
                };
                return CKEDITOR.env.ie && (CKEDITOR.env.ie7Compat || CKEDITOR.env.ie6Compat) ?
                    function (b, c) {
                        b == "class" ? this.$.className = c : b == "style" ? this.$.style.cssText = c : b == "tabindex" ? this.$.tabIndex = c : b == "checked" ? this.$.checked = c : b == "contenteditable" ? a.call(this, "contentEditable", c) : a.apply(this, arguments);
                        return this
                    } : CKEDITOR.env.ie8Compat && CKEDITOR.env.secure ? function (b, c) {
                        if (b == "src" && c.match(/^http:\/\//))try {
                            a.apply(this, arguments)
                        } catch (e) {
                        } else a.apply(this, arguments);
                        return this
                    } : a
            }(),
            setAttributes: function (a) {
                for (var b in a)this.setAttribute(b, a[b]);
                return this
            },
            setValue: function (a) {
                this.$.value =
                    a;
                return this
            },
            removeAttribute: function () {
                var a = function (a) {
                    this.$.removeAttribute(a)
                };
                return CKEDITOR.env.ie && (CKEDITOR.env.ie7Compat || CKEDITOR.env.ie6Compat) ? function (a) {
                    a == "class" ? a = "className" : a == "tabindex" ? a = "tabIndex" : a == "contenteditable" && (a = "contentEditable");
                    this.$.removeAttribute(a)
                } : a
            }(),
            removeAttributes: function (a) {
                if (CKEDITOR.tools.isArray(a))for (var b = 0; b < a.length; b++)this.removeAttribute(a[b]); else for (b in a)a.hasOwnProperty(b) && this.removeAttribute(b)
            },
            removeStyle: function (a) {
                var b =
                    this.$.style;
                if (!b.removeProperty && (a == "border" || a == "margin" || a == "padding")) {
                    var c = ["top", "left", "right", "bottom"], e;
                    a == "border" && (e = ["color", "style", "width"]);
                    for (var b = [],
                             i = 0; i < c.length; i++)if (e)for (var j = 0; j < e.length; j++)b.push([a, c[i], e[j]].join("-")); else b.push([a, c[i]].join("-"));
                    for (a = 0; a < b.length; a++)this.removeStyle(b[a])
                } else {
                    b.removeProperty ? b.removeProperty(a) : b.removeAttribute(CKEDITOR.tools.cssStyleToDomStyle(a));
                    this.$.style.cssText || this.removeAttribute("style")
                }
            },
            setStyle: function (a,
                                b) {
                this.$.style[CKEDITOR.tools.cssStyleToDomStyle(a)] = b;
                return this
            },
            setStyles: function (a) {
                for (var b in a)this.setStyle(b, a[b]);
                return this
            },
            setOpacity: function (a) {
                if (CKEDITOR.env.ie && CKEDITOR.env.version < 9) {
                    a = Math.round(a * 100);
                    this.setStyle("filter", a >= 100 ? "" : "progid:DXImageTransform.Microsoft.Alpha(opacity=" + a + ")")
                } else this.setStyle("opacity", a)
            },
            unselectable: function () {
                this.setStyles(CKEDITOR.tools.cssVendorPrefix("user-select", "none"));
                if (CKEDITOR.env.ie || CKEDITOR.env.opera) {
                    this.setAttribute("unselectable",
                        "on");
                    for (var a, b = this.getElementsByTag("*"), c = 0, e = b.count(); c < e; c++) {
                        a = b.getItem(c);
                        a.setAttribute("unselectable", "on")
                    }
                }
            },
            getPositionedAncestor: function () {
                for (var a = this; a.getName() != "html";) {
                    if (a.getComputedStyle("position") != "static")return a;
                    a = a.getParent()
                }
                return null
            },
            getDocumentPosition: function (a) {
                var b = 0, c = 0, e = this.getDocument(), i = e.getBody(), j = e.$.compatMode == "BackCompat";
                if (document.documentElement.getBoundingClientRect) {
                    var o = this.$.getBoundingClientRect(), q = e.$.documentElement, s = q.clientTop ||
                        i.$.clientTop || 0, u = q.clientLeft || i.$.clientLeft || 0, f = true;
                    if (CKEDITOR.env.ie) {
                        f = e.getDocumentElement().contains(this);
                        e = e.getBody().contains(this);
                        f = j && e || !j && f
                    }
                    if (f) {
                        b = o.left + (!j && q.scrollLeft || i.$.scrollLeft);
                        b = b - u;
                        c = o.top + (!j && q.scrollTop || i.$.scrollTop);
                        c = c - s
                    }
                } else {
                    i = this;
                    for (e = null; i && !(i.getName() == "body" || i.getName() == "html");) {
                        b = b + (i.$.offsetLeft - i.$.scrollLeft);
                        c = c + (i.$.offsetTop - i.$.scrollTop);
                        if (!i.equals(this)) {
                            b = b + (i.$.clientLeft || 0);
                            c = c + (i.$.clientTop || 0)
                        }
                        for (; e && !e.equals(i);) {
                            b = b -
                                e.$.scrollLeft;
                            c = c - e.$.scrollTop;
                            e = e.getParent()
                        }
                        e = i;
                        i = (o = i.$.offsetParent) ? new CKEDITOR.dom.element(o) : null
                    }
                }
                if (a) {
                    i = this.getWindow();
                    e = a.getWindow();
                    if (!i.equals(e) && i.$.frameElement) {
                        a = (new CKEDITOR.dom.element(i.$.frameElement)).getDocumentPosition(a);
                        b = b + a.x;
                        c = c + a.y
                    }
                }
                if (!document.documentElement.getBoundingClientRect && CKEDITOR.env.gecko && !j) {
                    b = b + (this.$.clientLeft ? 1 : 0);
                    c = c + (this.$.clientTop ? 1 : 0)
                }
                return {x: b, y: c}
            },
            scrollIntoView: function (a) {
                var b = this.getParent();
                if (b) {
                    do {
                        (b.$.clientWidth && b.$.clientWidth <
                        b.$.scrollWidth || b.$.clientHeight && b.$.clientHeight < b.$.scrollHeight) && !b.is("body") && this.scrollIntoParent(b, a, 1);
                        if (b.is("html")) {
                            var c = b.getWindow();
                            try {
                                var e = c.$.frameElement;
                                e && (b = new CKEDITOR.dom.element(e))
                            } catch (i) {
                            }
                        }
                    } while (b = b.getParent())
                }
            },
            scrollIntoParent: function (a, b, c) {
                var e, i, j, o;

                function q(b, f) {
                    if (/body|html/.test(a.getName())) a.getWindow().$.scrollBy(b, f); else {
                        a.$.scrollLeft = a.$.scrollLeft + b;
                        a.$.scrollTop = a.$.scrollTop + f
                    }
                }

                function s(a, b) {
                    var d = {x: 0, y: 0};
                    if (!a.is(f ? "body" : "html")) {
                        var c =
                            a.$.getBoundingClientRect();
                        d.x = c.left;
                        d.y = c.top
                    }
                    c = a.getWindow();
                    if (!c.equals(b)) {
                        c = s(CKEDITOR.dom.element.get(c.$.frameElement), b);
                        d.x = d.x + c.x;
                        d.y = d.y + c.y
                    }
                    return d
                }

                function u(a, b) {
                    return parseInt(a.getComputedStyle("margin-" + b) || 0, 10) || 0
                }

                !a && (a = this.getWindow());
                j = a.getDocument();
                var f = j.$.compatMode == "BackCompat";
                a instanceof CKEDITOR.dom.window && (a = f ? j.getBody() : j.getDocumentElement());
                j = a.getWindow();
                i = s(this, j);
                var p = s(a, j), y = this.$.offsetHeight;
                e = this.$.offsetWidth;
                var m = a.$.clientHeight, k =
                    a.$.clientWidth;
                j = i.x - u(this, "left") - p.x || 0;
                o = i.y - u(this, "top") - p.y || 0;
                e = i.x + e + u(this, "right") - (p.x + k) || 0;
                i = i.y + y + u(this, "bottom") - (p.y + m) || 0;
                if (o < 0 || i > 0) q(0, b === true ? o : b === false ? i : o < 0 ? o : i);
                if (c && (j < 0 || e > 0)) q(j < 0 ? j : e, 0)
            },
            setState: function (a, b, c) {
                b = b || "cke";
                switch (a) {
                    case CKEDITOR.TRISTATE_ON:
                        this.addClass(b + "_on");
                        this.removeClass(b + "_off");
                        this.removeClass(b + "_disabled");
                        c && this.setAttribute("aria-pressed", true);
                        c && this.removeAttribute("aria-disabled");
                        break;
                    case CKEDITOR.TRISTATE_DISABLED:
                        this.addClass(b +
                            "_disabled");
                        this.removeClass(b + "_off");
                        this.removeClass(b + "_on");
                        c && this.setAttribute("aria-disabled", true);
                        c && this.removeAttribute("aria-pressed");
                        break;
                    default:
                        this.addClass(b + "_off");
                        this.removeClass(b + "_on");
                        this.removeClass(b + "_disabled");
                        c && this.removeAttribute("aria-pressed");
                        c && this.removeAttribute("aria-disabled")
                }
            },
            getFrameDocument: function () {
                var a = this.$;
                try {
                    a.contentWindow.document
                } catch (b) {
                    a.src = a.src
                }
                return a && new CKEDITOR.dom.document(a.contentWindow.document)
            },
            copyAttributes: function (a,
                                      b) {
                for (var c = this.$.attributes, b = b || {}, e = 0; e < c.length; e++) {
                    var i = c[e], j = i.nodeName.toLowerCase(), o;
                    if (!(j in b))if (j == "checked" && (o = this.getAttribute(j))) a.setAttribute(j, o); else if (i.specified || CKEDITOR.env.ie && i.nodeValue && j == "value") {
                        o = this.getAttribute(j);
                        if (o === null) o = i.nodeValue;
                        a.setAttribute(j, o)
                    }
                }
                if (this.$.style.cssText !== "") a.$.style.cssText = this.$.style.cssText
            },
            renameNode: function (a) {
                if (this.getName() != a) {
                    var b = this.getDocument(), a = new CKEDITOR.dom.element(a, b);
                    this.copyAttributes(a);
                    this.moveChildren(a);
                    this.getParent() && this.$.parentNode.replaceChild(a.$, this.$);
                    a.$["data-cke-expando"] = this.$["data-cke-expando"];
                    this.$ = a.$
                }
            },
            getChild: function () {
                function a(b, c) {
                    var d = b.childNodes;
                    if (c >= 0 && c < d.length)return d[c]
                }

                return function (b) {
                    var c = this.$;
                    if (b.slice)for (; b.length > 0 && c;)c = a(c, b.shift()); else c = a(c, b);
                    return c ? new CKEDITOR.dom.node(c) : null
                }
            }(),
            getChildCount: function () {
                return this.$.childNodes.length
            },
            disableContextMenu: function () {
                this.on("contextmenu", function (a) {
                    a.data.getTarget().hasClass("cke_enable_context_menu") ||
                    a.data.preventDefault()
                })
            },
            getDirection: function (a) {
                return a ? this.getComputedStyle("direction") || this.getDirection() || this.getParent() && this.getParent().getDirection(1) || this.getDocument().$.dir || "ltr" : this.getStyle("direction") || this.getAttribute("dir")
            },
            data: function (a, b) {
                a = "data-" + a;
                if (b === void 0)return this.getAttribute(a);
                b === false ? this.removeAttribute(a) : this.setAttribute(a, b);
                return null
            },
            getEditor: function () {
                var a = CKEDITOR.instances, b, c;
                for (b in a) {
                    c = a[b];
                    if (c.element.equals(this) && c.elementMode !=
                        CKEDITOR.ELEMENT_MODE_APPENDTO)return c
                }
                return null
            },
            find: function (b) {
                var c = a(this), b = new CKEDITOR.dom.nodeList(this.$.querySelectorAll(e(this, b)));
                c();
                return b
            },
            findOne: function (b) {
                var c = a(this), b = this.$.querySelector(e(this, b));
                c();
                return b ? new CKEDITOR.dom.element(b) : null
            },
            forEach: function (a, b, c) {
                if (!c && (!b || this.type == b))var e = a(this);
                if (e !== false)for (var c = this.getChildren(), i = 0; i < c.count(); i++) {
                    e = c.getItem(i);
                    e.type == CKEDITOR.NODE_ELEMENT ? e.forEach(a, b) : (!b || e.type == b) && a(e)
                }
            }
        });
        var c = {
            width: ["border-left-width",
                "border-right-width", "padding-left", "padding-right"],
            height: ["border-top-width", "border-bottom-width", "padding-top", "padding-bottom"]
        };
        CKEDITOR.dom.element.prototype.setSize = function (a, c, e) {
            if (typeof c == "number") {
                if (e && (!CKEDITOR.env.ie || !CKEDITOR.env.quirks)) c = c - b.call(this, a);
                this.setStyle(a, c + "px")
            }
        };
        CKEDITOR.dom.element.prototype.getSize = function (a, c) {
            var e = Math.max(this.$["offset" + CKEDITOR.tools.capitalize(a)], this.$["client" + CKEDITOR.tools.capitalize(a)]) || 0;
            c && (e = e - b.call(this, a));
            return e
        }
    })();
    CKEDITOR.dom.documentFragment = function (a) {
        a = a || CKEDITOR.document;
        this.$ = a.type == CKEDITOR.NODE_DOCUMENT ? a.$.createDocumentFragment() : a
    };
    CKEDITOR.tools.extend(CKEDITOR.dom.documentFragment.prototype, CKEDITOR.dom.element.prototype, {
        type: CKEDITOR.NODE_DOCUMENT_FRAGMENT,
        insertAfterNode: function (a) {
            a = a.$;
            a.parentNode.insertBefore(this.$, a.nextSibling)
        }
    }, !0, {
        append: 1,
        appendBogus: 1,
        getFirst: 1,
        getLast: 1,
        getParent: 1,
        getNext: 1,
        getPrevious: 1,
        appendTo: 1,
        moveChildren: 1,
        insertBefore: 1,
        insertAfterNode: 1,
        replace: 1,
        trim: 1,
        type: 1,
        ltrim: 1,
        rtrim: 1,
        getDocument: 1,
        getChildCount: 1,
        getChild: 1,
        getChildren: 1
    });
    (function () {
        function a(a, b) {
            var c = this.range;
            if (this._.end)return null;
            if (!this._.start) {
                this._.start = 1;
                if (c.collapsed) {
                    this.end();
                    return null
                }
                c.optimize()
            }
            var f, d = c.startContainer;
            f = c.endContainer;
            var o = c.startOffset, e = c.endOffset, k, l = this.guard, t = this.type,
                h = a ? "getPreviousSourceNode" : "getNextSourceNode";
            if (!a && !this._.guardLTR) {
                var r = f.type == CKEDITOR.NODE_ELEMENT ? f : f.getParent(),
                    i = f.type == CKEDITOR.NODE_ELEMENT ? f.getChild(e) : f.getNext();
                this._.guardLTR = function (a, b) {
                    return (!b || !r.equals(a)) && (!i ||
                        !a.equals(i)) && (a.type != CKEDITOR.NODE_ELEMENT || !b || !a.equals(c.root))
                }
            }
            if (a && !this._.guardRTL) {
                var g = d.type == CKEDITOR.NODE_ELEMENT ? d : d.getParent(),
                    j = d.type == CKEDITOR.NODE_ELEMENT ? o ? d.getChild(o - 1) : null : d.getPrevious();
                this._.guardRTL = function (a, b) {
                    return (!b || !g.equals(a)) && (!j || !a.equals(j)) && (a.type != CKEDITOR.NODE_ELEMENT || !b || !a.equals(c.root))
                }
            }
            var n = a ? this._.guardRTL : this._.guardLTR;
            k = l ? function (a, b) {
                return n(a, b) === false ? false : l(a, b)
            } : n;
            if (this.current) f = this.current[h](false, t, k); else {
                if (a) f.type ==
                CKEDITOR.NODE_ELEMENT && (f = e > 0 ? f.getChild(e - 1) : k(f, true) === false ? null : f.getPreviousSourceNode(true, t, k)); else {
                    f = d;
                    if (f.type == CKEDITOR.NODE_ELEMENT && !(f = f.getChild(o))) f = k(d, true) === false ? null : d.getNextSourceNode(true, t, k)
                }
                f && k(f) === false && (f = null)
            }
            for (; f && !this._.end;) {
                this.current = f;
                if (!this.evaluator || this.evaluator(f) !== false) {
                    if (!b)return f
                } else if (b && this.evaluator)return false;
                f = f[h](false, t, k)
            }
            this.end();
            return this.current = null
        }

        function e(b) {
            for (var c, d = null; c = a.call(this, b);)d = c;
            return d
        }

        function b(a) {
            if (j(a))return false;
            if (a.type == CKEDITOR.NODE_TEXT)return true;
            if (a.type == CKEDITOR.NODE_ELEMENT) {
                if (a.is(CKEDITOR.dtd.$inline) || a.getAttribute("contenteditable") == "false")return true;
                var b;
                if (b = !CKEDITOR.env.needsBrFiller)if (b = a.is(o))a:{
                    b = 0;
                    for (var c = a.getChildCount(); b < c; ++b)if (!j(a.getChild(b))) {
                        b = false;
                        break a
                    }
                    b = true
                }
                if (b)return true
            }
            return false
        }

        CKEDITOR.dom.walker = CKEDITOR.tools.createClass({
            $: function (a) {
                this.range = a;
                this._ = {}
            }, proto: {
                end: function () {
                    this._.end = 1
                }, next: function () {
                    return a.call(this)
                },
                previous: function () {
                    return a.call(this, 1)
                }, checkForward: function () {
                    return a.call(this, 0, 1) !== false
                }, checkBackward: function () {
                    return a.call(this, 1, 1) !== false
                }, lastForward: function () {
                    return e.call(this)
                }, lastBackward: function () {
                    return e.call(this, 1)
                }, reset: function () {
                    delete this.current;
                    this._ = {}
                }
            }
        });
        var c = {
            block: 1,
            "list-item": 1,
            table: 1,
            "table-row-group": 1,
            "table-header-group": 1,
            "table-footer-group": 1,
            "table-row": 1,
            "table-column-group": 1,
            "table-column": 1,
            "table-cell": 1,
            "table-caption": 1
        }, d = {
            absolute: 1,
            fixed: 1
        };
        CKEDITOR.dom.element.prototype.isBlockBoundary = function (a) {
            return this.getComputedStyle("float") == "none" && !(this.getComputedStyle("position") in d) && c[this.getComputedStyle("display")] ? true : !!(this.is(CKEDITOR.dtd.$block) || a && this.is(a))
        };
        CKEDITOR.dom.walker.blockBoundary = function (a) {
            return function (b) {
                return !(b.type == CKEDITOR.NODE_ELEMENT && b.isBlockBoundary(a))
            }
        };
        CKEDITOR.dom.walker.listItemBoundary = function () {
            return this.blockBoundary({br: 1})
        };
        CKEDITOR.dom.walker.bookmark = function (a, b) {
            function c(a) {
                return a &&
                    a.getName && a.getName() == "span" && a.data("cke-bookmark")
            }

            return function (f) {
                var d, o;
                d = f && f.type != CKEDITOR.NODE_ELEMENT && (o = f.getParent()) && c(o);
                d = a ? d : d || c(f);
                return !!(b ^ d)
            }
        };
        CKEDITOR.dom.walker.whitespaces = function (a) {
            return function (b) {
                var c;
                b && b.type == CKEDITOR.NODE_TEXT && (c = !CKEDITOR.tools.trim(b.getText()) || CKEDITOR.env.webkit && b.getText() == "​");
                return !!(a ^ c)
            }
        };
        CKEDITOR.dom.walker.invisible = function (a) {
            var b = CKEDITOR.dom.walker.whitespaces();
            return function (c) {
                if (b(c)) c = 1; else {
                    c.type == CKEDITOR.NODE_TEXT &&
                    (c = c.getParent());
                    c = !c.$.offsetHeight
                }
                return !!(a ^ c)
            }
        };
        CKEDITOR.dom.walker.nodeType = function (a, b) {
            return function (c) {
                return !!(b ^ c.type == a)
            }
        };
        CKEDITOR.dom.walker.bogus = function (a) {
            function b(a) {
                return !g(a) && !n(a)
            }

            return function (c) {
                var f = CKEDITOR.env.needsBrFiller ? c.is && c.is("br") : c.getText && h.test(c.getText());
                if (f) {
                    f = c.getParent();
                    c = c.getNext(b);
                    f = f.isBlockBoundary() && (!c || c.type == CKEDITOR.NODE_ELEMENT && c.isBlockBoundary())
                }
                return !!(a ^ f)
            }
        };
        CKEDITOR.dom.walker.temp = function (a) {
            return function (b) {
                b.type !=
                CKEDITOR.NODE_ELEMENT && (b = b.getParent());
                b = b && b.hasAttribute("data-cke-temp");
                return !!(a ^ b)
            }
        };
        var h = /^[\t\r\n ]*(?:&nbsp;|\xa0)$/, g = CKEDITOR.dom.walker.whitespaces(),
            n = CKEDITOR.dom.walker.bookmark(), i = CKEDITOR.dom.walker.temp();
        CKEDITOR.dom.walker.ignored = function (a) {
            return function (b) {
                b = g(b) || n(b) || i(b);
                return !!(a ^ b)
            }
        };
        var j = CKEDITOR.dom.walker.ignored(), o = function (a) {
            var b = {}, c;
            for (c in a)CKEDITOR.dtd[c]["#"] && (b[c] = 1);
            return b
        }(CKEDITOR.dtd.$block);
        CKEDITOR.dom.walker.editable = function (a) {
            return function (c) {
                return !!(a ^
                b(c))
            }
        };
        CKEDITOR.dom.element.prototype.getBogus = function () {
            var a = this;
            do a = a.getPreviousSourceNode(); while (n(a) || g(a) || a.type == CKEDITOR.NODE_ELEMENT && a.is(CKEDITOR.dtd.$inline) && !a.is(CKEDITOR.dtd.$empty));
            return a && (CKEDITOR.env.needsBrFiller ? a.is && a.is("br") : a.getText && h.test(a.getText())) ? a : false
        }
    })();
    CKEDITOR.dom.range = function (a) {
        this.endOffset = this.endContainer = this.startOffset = this.startContainer = null;
        this.collapsed = true;
        var e = a instanceof CKEDITOR.dom.document;
        this.document = e ? a : a.getDocument();
        this.root = e ? a.getBody() : a
    };
    (function () {
        function a() {
            var a = false, b = CKEDITOR.dom.walker.whitespaces(), c = CKEDITOR.dom.walker.bookmark(true),
                d = CKEDITOR.dom.walker.bogus();
            return function (f) {
                if (c(f) || b(f))return true;
                if (d(f) && !a)return a = true;
                return f.type == CKEDITOR.NODE_TEXT && (f.hasAscendant("pre") || CKEDITOR.tools.trim(f.getText()).length) || f.type == CKEDITOR.NODE_ELEMENT && !f.is(h) ? false : true
            }
        }

        function e(a) {
            var b = CKEDITOR.dom.walker.whitespaces(), c = CKEDITOR.dom.walker.bookmark(1);
            return function (d) {
                return c(d) || b(d) ? true : !a && g(d) ||
                    d.type == CKEDITOR.NODE_ELEMENT && d.is(CKEDITOR.dtd.$removeEmpty)
            }
        }

        function b(a) {
            return function () {
                var b;
                return this[a ? "getPreviousNode" : "getNextNode"](function (a) {
                    !b && j(a) && (b = a);
                    return i(a) && !(g(a) && a.equals(b))
                })
            }
        }

        var c = function (a) {
                a.collapsed = a.startContainer && a.endContainer && a.startContainer.equals(a.endContainer) && a.startOffset == a.endOffset
            }, d = function (a, b, c, d) {
                a.optimizeBookmark();
                var f = a.startContainer, e = a.endContainer, h = a.startOffset, m = a.endOffset, k, l;
                if (e.type == CKEDITOR.NODE_TEXT) e = e.split(m);
                else if (e.getChildCount() > 0)if (m >= e.getChildCount()) {
                    e = e.append(a.document.createText(""));
                    l = true
                } else e = e.getChild(m);
                if (f.type == CKEDITOR.NODE_TEXT) {
                    f.split(h);
                    f.equals(e) && (e = f.getNext())
                } else if (h)if (h >= f.getChildCount()) {
                    f = f.append(a.document.createText(""));
                    k = true
                } else f = f.getChild(h).getPrevious(); else {
                    f = f.append(a.document.createText(""), 1);
                    k = true
                }
                var h = f.getParents(), m = e.getParents(), t, i, r;
                for (t = 0; t < h.length; t++) {
                    i = h[t];
                    r = m[t];
                    if (!i.equals(r))break
                }
                for (var g = c, j, n, E, z = t; z < h.length; z++) {
                    j =
                        h[z];
                    g && !j.equals(f) && (n = g.append(j.clone()));
                    for (j = j.getNext(); j;) {
                        if (j.equals(m[z]) || j.equals(e))break;
                        E = j.getNext();
                        if (b == 2) g.append(j.clone(true)); else {
                            j.remove();
                            b == 1 && g.append(j)
                        }
                        j = E
                    }
                    g && (g = n)
                }
                g = c;
                for (c = t; c < m.length; c++) {
                    j = m[c];
                    b > 0 && !j.equals(e) && (n = g.append(j.clone()));
                    if (!h[c] || j.$.parentNode != h[c].$.parentNode)for (j = j.getPrevious(); j;) {
                        if (j.equals(h[c]) || j.equals(f))break;
                        E = j.getPrevious();
                        if (b == 2) g.$.insertBefore(j.$.cloneNode(true), g.$.firstChild); else {
                            j.remove();
                            b == 1 && g.$.insertBefore(j.$,
                                g.$.firstChild)
                        }
                        j = E
                    }
                    g && (g = n)
                }
                if (b == 2) {
                    i = a.startContainer;
                    if (i.type == CKEDITOR.NODE_TEXT) {
                        i.$.data = i.$.data + i.$.nextSibling.data;
                        i.$.parentNode.removeChild(i.$.nextSibling)
                    }
                    a = a.endContainer;
                    if (a.type == CKEDITOR.NODE_TEXT && a.$.nextSibling) {
                        a.$.data = a.$.data + a.$.nextSibling.data;
                        a.$.parentNode.removeChild(a.$.nextSibling)
                    }
                } else {
                    if (i && r && (f.$.parentNode != i.$.parentNode || e.$.parentNode != r.$.parentNode)) {
                        b = r.getIndex();
                        k && r.$.parentNode == f.$.parentNode && b--;
                        if (d && i.type == CKEDITOR.NODE_ELEMENT) {
                            d = CKEDITOR.dom.element.createFromHtml('<span data-cke-bookmark="1" style="display:none">&nbsp;</span>',
                                a.document);
                            d.insertAfter(i);
                            i.mergeSiblings(false);
                            a.moveToBookmark({startNode: d})
                        } else a.setStart(r.getParent(), b)
                    }
                    a.collapse(true)
                }
                k && f.remove();
                l && e.$.parentNode && e.remove()
            }, h = {
                abbr: 1,
                acronym: 1,
                b: 1,
                bdo: 1,
                big: 1,
                cite: 1,
                code: 1,
                del: 1,
                dfn: 1,
                em: 1,
                font: 1,
                i: 1,
                ins: 1,
                label: 1,
                kbd: 1,
                q: 1,
                samp: 1,
                small: 1,
                span: 1,
                strike: 1,
                strong: 1,
                sub: 1,
                sup: 1,
                tt: 1,
                u: 1,
                "var": 1
            }, g = CKEDITOR.dom.walker.bogus(), n = /^[\t\r\n ]*(?:&nbsp;|\xa0)$/, i = CKEDITOR.dom.walker.editable(),
            j = CKEDITOR.dom.walker.ignored(true);
        CKEDITOR.dom.range.prototype =
            {
                clone: function () {
                    var a = new CKEDITOR.dom.range(this.root);
                    a.startContainer = this.startContainer;
                    a.startOffset = this.startOffset;
                    a.endContainer = this.endContainer;
                    a.endOffset = this.endOffset;
                    a.collapsed = this.collapsed;
                    return a
                }, collapse: function (a) {
                if (a) {
                    this.endContainer = this.startContainer;
                    this.endOffset = this.startOffset
                } else {
                    this.startContainer = this.endContainer;
                    this.startOffset = this.endOffset
                }
                this.collapsed = true
            }, cloneContents: function () {
                var a = new CKEDITOR.dom.documentFragment(this.document);
                this.collapsed ||
                d(this, 2, a);
                return a
            }, deleteContents: function (a) {
                this.collapsed || d(this, 0, null, a)
            }, extractContents: function (a) {
                var b = new CKEDITOR.dom.documentFragment(this.document);
                this.collapsed || d(this, 1, b, a);
                return b
            }, createBookmark: function (a) {
                var b, c, d, f, e = this.collapsed;
                b = this.document.createElement("span");
                b.data("cke-bookmark", 1);
                b.setStyle("display", "none");
                b.setHtml("&nbsp;");
                if (a) {
                    d = "cke_bm_" + CKEDITOR.tools.getNextNumber();
                    b.setAttribute("id", d + (e ? "C" : "S"))
                }
                if (!e) {
                    c = b.clone();
                    c.setHtml("&nbsp;");
                    a && c.setAttribute("id",
                        d + "E");
                    f = this.clone();
                    f.collapse();
                    f.insertNode(c)
                }
                f = this.clone();
                f.collapse(true);
                f.insertNode(b);
                if (c) {
                    this.setStartAfter(b);
                    this.setEndBefore(c)
                } else this.moveToPosition(b, CKEDITOR.POSITION_AFTER_END);
                return {startNode: a ? d + (e ? "C" : "S") : b, endNode: a ? d + "E" : c, serializable: a, collapsed: e}
            }, createBookmark2: function () {
                function a(b) {
                    var c = b.container, d = b.offset, f;
                    f = c;
                    var e = d;
                    f = f.type != CKEDITOR.NODE_ELEMENT || e === 0 || e == f.getChildCount() ? 0 : f.getChild(e - 1).type == CKEDITOR.NODE_TEXT && f.getChild(e).type == CKEDITOR.NODE_TEXT;
                    if (f) {
                        c = c.getChild(d - 1);
                        d = c.getLength()
                    }
                    c.type == CKEDITOR.NODE_ELEMENT && d > 1 && (d = c.getChild(d - 1).getIndex(true) + 1);
                    if (c.type == CKEDITOR.NODE_TEXT) {
                        f = c;
                        for (e = 0; (f = f.getPrevious()) && f.type == CKEDITOR.NODE_TEXT;)e = e + f.getLength();
                        d = d + e
                    }
                    b.container = c;
                    b.offset = d
                }

                return function (b) {
                    var c = this.collapsed, d = {container: this.startContainer, offset: this.startOffset},
                        f = {container: this.endContainer, offset: this.endOffset};
                    if (b) {
                        a(d);
                        c || a(f)
                    }
                    return {
                        start: d.container.getAddress(b), end: c ? null : f.container.getAddress(b),
                        startOffset: d.offset, endOffset: f.offset, normalized: b, collapsed: c, is2: true
                    }
                }
            }(), moveToBookmark: function (a) {
                if (a.is2) {
                    var b = this.document.getByAddress(a.start, a.normalized), c = a.startOffset,
                        d = a.end && this.document.getByAddress(a.end, a.normalized), a = a.endOffset;
                    this.setStart(b, c);
                    d ? this.setEnd(d, a) : this.collapse(true)
                } else {
                    b = (c = a.serializable) ? this.document.getById(a.startNode) : a.startNode;
                    a = c ? this.document.getById(a.endNode) : a.endNode;
                    this.setStartBefore(b);
                    b.remove();
                    if (a) {
                        this.setEndBefore(a);
                        a.remove()
                    } else this.collapse(true)
                }
            },
                getBoundaryNodes: function () {
                    var a = this.startContainer, b = this.endContainer, c = this.startOffset, d = this.endOffset, f;
                    if (a.type == CKEDITOR.NODE_ELEMENT) {
                        f = a.getChildCount();
                        if (f > c) a = a.getChild(c); else if (f < 1) a = a.getPreviousSourceNode(); else {
                            for (a = a.$; a.lastChild;)a = a.lastChild;
                            a = new CKEDITOR.dom.node(a);
                            a = a.getNextSourceNode() || a
                        }
                    }
                    if (b.type == CKEDITOR.NODE_ELEMENT) {
                        f = b.getChildCount();
                        if (f > d) b = b.getChild(d).getPreviousSourceNode(true); else if (f < 1) b = b.getPreviousSourceNode(); else {
                            for (b = b.$; b.lastChild;)b =
                                b.lastChild;
                            b = new CKEDITOR.dom.node(b)
                        }
                    }
                    a.getPosition(b) & CKEDITOR.POSITION_FOLLOWING && (a = b);
                    return {startNode: a, endNode: b}
                }, getCommonAncestor: function (a, b) {
                var c = this.startContainer, d = this.endContainer,
                    c = c.equals(d) ? a && c.type == CKEDITOR.NODE_ELEMENT && this.startOffset == this.endOffset - 1 ? c.getChild(this.startOffset) : c : c.getCommonAncestor(d);
                return b && !c.is ? c.getParent() : c
            }, optimize: function () {
                var a = this.startContainer, b = this.startOffset;
                a.type != CKEDITOR.NODE_ELEMENT && (b ? b >= a.getLength() && this.setStartAfter(a) :
                    this.setStartBefore(a));
                a = this.endContainer;
                b = this.endOffset;
                a.type != CKEDITOR.NODE_ELEMENT && (b ? b >= a.getLength() && this.setEndAfter(a) : this.setEndBefore(a))
            }, optimizeBookmark: function () {
                var a = this.startContainer, b = this.endContainer;
                a.is && (a.is("span") && a.data("cke-bookmark")) && this.setStartAt(a, CKEDITOR.POSITION_BEFORE_START);
                b && (b.is && b.is("span") && b.data("cke-bookmark")) && this.setEndAt(b, CKEDITOR.POSITION_AFTER_END)
            }, trim: function (a, b) {
                var c = this.startContainer, d = this.startOffset, f = this.collapsed;
                if ((!a || f) && c && c.type == CKEDITOR.NODE_TEXT) {
                    if (d)if (d >= c.getLength()) {
                        d = c.getIndex() + 1;
                        c = c.getParent()
                    } else {
                        var e = c.split(d), d = c.getIndex() + 1, c = c.getParent();
                        if (this.startContainer.equals(this.endContainer)) this.setEnd(e, this.endOffset - this.startOffset); else if (c.equals(this.endContainer)) this.endOffset = this.endOffset + 1
                    } else {
                        d = c.getIndex();
                        c = c.getParent()
                    }
                    this.setStart(c, d);
                    if (f) {
                        this.collapse(true);
                        return
                    }
                }
                c = this.endContainer;
                d = this.endOffset;
                if (!b && !f && c && c.type == CKEDITOR.NODE_TEXT) {
                    if (d) {
                        d >= c.getLength() ||
                        c.split(d);
                        d = c.getIndex() + 1
                    } else d = c.getIndex();
                    c = c.getParent();
                    this.setEnd(c, d)
                }
            }, enlarge: function (a, b) {
                function c(a) {
                    return a && a.type == CKEDITOR.NODE_ELEMENT && a.hasAttribute("contenteditable") ? null : a
                }

                switch (a) {
                    case CKEDITOR.ENLARGE_INLINE:
                        var d = 1;
                    case CKEDITOR.ENLARGE_ELEMENT:
                        if (this.collapsed)break;
                        var f = this.getCommonAncestor(), e = this.root, h, m, k, l, t, i = false, r, j;
                        r = this.startContainer;
                        j = this.startOffset;
                        if (r.type == CKEDITOR.NODE_TEXT) {
                            if (j) {
                                r = !CKEDITOR.tools.trim(r.substring(0, j)).length && r;
                                i = !!r
                            }
                            if (r &&
                                !(l = r.getPrevious())) k = r.getParent()
                        } else {
                            j && (l = r.getChild(j - 1) || r.getLast());
                            l || (k = r)
                        }
                        for (k = c(k); k || l;) {
                            if (k && !l) {
                                !t && k.equals(f) && (t = true);
                                if (d ? k.isBlockBoundary() : !e.contains(k))break;
                                if (!i || k.getComputedStyle("display") != "inline") {
                                    i = false;
                                    t ? h = k : this.setStartBefore(k)
                                }
                                l = k.getPrevious()
                            }
                            for (; l;) {
                                r = false;
                                if (l.type == CKEDITOR.NODE_COMMENT) l = l.getPrevious(); else {
                                    if (l.type == CKEDITOR.NODE_TEXT) {
                                        j = l.getText();
                                        /[^\s\ufeff]/.test(j) && (l = null);
                                        r = /[\s\ufeff]$/.test(j)
                                    } else if ((l.$.offsetWidth > 0 || b && l.is("br")) &&
                                        !l.data("cke-bookmark"))if (i && CKEDITOR.dtd.$removeEmpty[l.getName()]) {
                                        j = l.getText();
                                        if (/[^\s\ufeff]/.test(j)) l = null; else for (var g = l.$.getElementsByTagName("*"),
                                                                                           n = 0,
                                                                                           E; E = g[n++];)if (!CKEDITOR.dtd.$removeEmpty[E.nodeName.toLowerCase()]) {
                                            l = null;
                                            break
                                        }
                                        l && (r = !!j.length)
                                    } else l = null;
                                    r && (i ? t ? h = k : k && this.setStartBefore(k) : i = true);
                                    if (l) {
                                        r = l.getPrevious();
                                        if (!k && !r) {
                                            k = l;
                                            l = null;
                                            break
                                        }
                                        l = r
                                    } else k = null
                                }
                            }
                            k && (k = c(k.getParent()))
                        }
                        r = this.endContainer;
                        j = this.endOffset;
                        k = l = null;
                        t = i = false;
                        if (r.type == CKEDITOR.NODE_TEXT) {
                            r =
                                !CKEDITOR.tools.trim(r.substring(j)).length && r;
                            i = !(r && r.getLength());
                            if (r && !(l = r.getNext())) k = r.getParent()
                        } else(l = r.getChild(j)) || (k = r);
                        for (; k || l;) {
                            if (k && !l) {
                                !t && k.equals(f) && (t = true);
                                if (d ? k.isBlockBoundary() : !e.contains(k))break;
                                if (!i || k.getComputedStyle("display") != "inline") {
                                    i = false;
                                    t ? m = k : k && this.setEndAfter(k)
                                }
                                l = k.getNext()
                            }
                            for (; l;) {
                                r = false;
                                if (l.type == CKEDITOR.NODE_TEXT) {
                                    j = l.getText();
                                    /[^\s\ufeff]/.test(j) && (l = null);
                                    r = /^[\s\ufeff]/.test(j)
                                } else if (l.type == CKEDITOR.NODE_ELEMENT) {
                                    if ((l.$.offsetWidth >
                                        0 || b && l.is("br")) && !l.data("cke-bookmark"))if (i && CKEDITOR.dtd.$removeEmpty[l.getName()]) {
                                        j = l.getText();
                                        if (/[^\s\ufeff]/.test(j)) l = null; else {
                                            g = l.$.getElementsByTagName("*");
                                            for (n = 0; E = g[n++];)if (!CKEDITOR.dtd.$removeEmpty[E.nodeName.toLowerCase()]) {
                                                l = null;
                                                break
                                            }
                                        }
                                        l && (r = !!j.length)
                                    } else l = null
                                } else r = 1;
                                r && i && (t ? m = k : this.setEndAfter(k));
                                if (l) {
                                    r = l.getNext();
                                    if (!k && !r) {
                                        k = l;
                                        l = null;
                                        break
                                    }
                                    l = r
                                } else k = null
                            }
                            k && (k = c(k.getParent()))
                        }
                        if (h && m) {
                            f = h.contains(m) ? m : h;
                            this.setStartBefore(f);
                            this.setEndAfter(f)
                        }
                        break;
                    case CKEDITOR.ENLARGE_BLOCK_CONTENTS:
                    case CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS:
                        k =
                            new CKEDITOR.dom.range(this.root);
                        e = this.root;
                        k.setStartAt(e, CKEDITOR.POSITION_AFTER_START);
                        k.setEnd(this.startContainer, this.startOffset);
                        k = new CKEDITOR.dom.walker(k);
                        var z, M,
                            Q = CKEDITOR.dom.walker.blockBoundary(a == CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS ? {br: 1} : null),
                            v = null, w = function (a) {
                                if (a.type == CKEDITOR.NODE_ELEMENT && a.getAttribute("contenteditable") == "false")if (v) {
                                    if (v.equals(a)) {
                                        v = null;
                                        return
                                    }
                                } else v = a; else if (v)return;
                                var b = Q(a);
                                b || (z = a);
                                return b
                            }, d = function (a) {
                                var b = w(a);
                                !b && (a.is && a.is("br")) &&
                                (M = a);
                                return b
                            };
                        k.guard = w;
                        k = k.lastBackward();
                        z = z || e;
                        this.setStartAt(z, !z.is("br") && (!k && this.checkStartOfBlock() || k && z.contains(k)) ? CKEDITOR.POSITION_AFTER_START : CKEDITOR.POSITION_AFTER_END);
                        if (a == CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS) {
                            k = this.clone();
                            k = new CKEDITOR.dom.walker(k);
                            var H = CKEDITOR.dom.walker.whitespaces(), C = CKEDITOR.dom.walker.bookmark();
                            k.evaluator = function (a) {
                                return !H(a) && !C(a)
                            };
                            if ((k = k.previous()) && k.type == CKEDITOR.NODE_ELEMENT && k.is("br"))break
                        }
                        k = this.clone();
                        k.collapse();
                        k.setEndAt(e,
                            CKEDITOR.POSITION_BEFORE_END);
                        k = new CKEDITOR.dom.walker(k);
                        k.guard = a == CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS ? d : w;
                        z = null;
                        k = k.lastForward();
                        z = z || e;
                        this.setEndAt(z, !k && this.checkEndOfBlock() || k && z.contains(k) ? CKEDITOR.POSITION_BEFORE_END : CKEDITOR.POSITION_BEFORE_START);
                        M && this.setEndAfter(M)
                }
            }, shrink: function (a, b, c) {
                if (!this.collapsed) {
                    var a = a || CKEDITOR.SHRINK_TEXT, d = this.clone(), f = this.startContainer, e = this.endContainer,
                        h = this.startOffset, m = this.endOffset, k = 1, l = 1;
                    if (f && f.type == CKEDITOR.NODE_TEXT)if (h)if (h >=
                        f.getLength()) d.setStartAfter(f); else {
                        d.setStartBefore(f);
                        k = 0
                    } else d.setStartBefore(f);
                    if (e && e.type == CKEDITOR.NODE_TEXT)if (m)if (m >= e.getLength()) d.setEndAfter(e); else {
                        d.setEndAfter(e);
                        l = 0
                    } else d.setEndBefore(e);
                    var d = new CKEDITOR.dom.walker(d), t = CKEDITOR.dom.walker.bookmark();
                    d.evaluator = function (b) {
                        return b.type == (a == CKEDITOR.SHRINK_ELEMENT ? CKEDITOR.NODE_ELEMENT : CKEDITOR.NODE_TEXT)
                    };
                    var j;
                    d.guard = function (b, d) {
                        if (t(b))return true;
                        if (a == CKEDITOR.SHRINK_ELEMENT && b.type == CKEDITOR.NODE_TEXT || d && b.equals(j) ||
                            c === false && b.type == CKEDITOR.NODE_ELEMENT && b.isBlockBoundary() || b.type == CKEDITOR.NODE_ELEMENT && b.hasAttribute("contenteditable"))return false;
                        !d && b.type == CKEDITOR.NODE_ELEMENT && (j = b);
                        return true
                    };
                    if (k) (f = d[a == CKEDITOR.SHRINK_ELEMENT ? "lastForward" : "next"]()) && this.setStartAt(f, b ? CKEDITOR.POSITION_AFTER_START : CKEDITOR.POSITION_BEFORE_START);
                    if (l) {
                        d.reset();
                        (d = d[a == CKEDITOR.SHRINK_ELEMENT ? "lastBackward" : "previous"]()) && this.setEndAt(d, b ? CKEDITOR.POSITION_BEFORE_END : CKEDITOR.POSITION_AFTER_END)
                    }
                    return !(!k &&
                    !l)
                }
            }, insertNode: function (a) {
                this.optimizeBookmark();
                this.trim(false, true);
                var b = this.startContainer, c = b.getChild(this.startOffset);
                c ? a.insertBefore(c) : b.append(a);
                a.getParent() && a.getParent().equals(this.endContainer) && this.endOffset++;
                this.setStartBefore(a)
            }, moveToPosition: function (a, b) {
                this.setStartAt(a, b);
                this.collapse(true)
            }, moveToRange: function (a) {
                this.setStart(a.startContainer, a.startOffset);
                this.setEnd(a.endContainer, a.endOffset)
            }, selectNodeContents: function (a) {
                this.setStart(a, 0);
                this.setEnd(a,
                    a.type == CKEDITOR.NODE_TEXT ? a.getLength() : a.getChildCount())
            }, setStart: function (a, b) {
                if (a.type == CKEDITOR.NODE_ELEMENT && CKEDITOR.dtd.$empty[a.getName()]) {
                    b = a.getIndex();
                    a = a.getParent()
                }
                this.startContainer = a;
                this.startOffset = b;
                if (!this.endContainer) {
                    this.endContainer = a;
                    this.endOffset = b
                }
                c(this)
            }, setEnd: function (a, b) {
                if (a.type == CKEDITOR.NODE_ELEMENT && CKEDITOR.dtd.$empty[a.getName()]) {
                    b = a.getIndex() + 1;
                    a = a.getParent()
                }
                this.endContainer = a;
                this.endOffset = b;
                if (!this.startContainer) {
                    this.startContainer = a;
                    this.startOffset =
                        b
                }
                c(this)
            }, setStartAfter: function (a) {
                this.setStart(a.getParent(), a.getIndex() + 1)
            }, setStartBefore: function (a) {
                this.setStart(a.getParent(), a.getIndex())
            }, setEndAfter: function (a) {
                this.setEnd(a.getParent(), a.getIndex() + 1)
            }, setEndBefore: function (a) {
                this.setEnd(a.getParent(), a.getIndex())
            }, setStartAt: function (a, b) {
                switch (b) {
                    case CKEDITOR.POSITION_AFTER_START:
                        this.setStart(a, 0);
                        break;
                    case CKEDITOR.POSITION_BEFORE_END:
                        a.type == CKEDITOR.NODE_TEXT ? this.setStart(a, a.getLength()) : this.setStart(a, a.getChildCount());
                        break;
                    case CKEDITOR.POSITION_BEFORE_START:
                        this.setStartBefore(a);
                        break;
                    case CKEDITOR.POSITION_AFTER_END:
                        this.setStartAfter(a)
                }
                c(this)
            }, setEndAt: function (a, b) {
                switch (b) {
                    case CKEDITOR.POSITION_AFTER_START:
                        this.setEnd(a, 0);
                        break;
                    case CKEDITOR.POSITION_BEFORE_END:
                        a.type == CKEDITOR.NODE_TEXT ? this.setEnd(a, a.getLength()) : this.setEnd(a, a.getChildCount());
                        break;
                    case CKEDITOR.POSITION_BEFORE_START:
                        this.setEndBefore(a);
                        break;
                    case CKEDITOR.POSITION_AFTER_END:
                        this.setEndAfter(a)
                }
                c(this)
            }, fixBlock: function (a, b) {
                var c =
                    this.createBookmark(), d = this.document.createElement(b);
                this.collapse(a);
                this.enlarge(CKEDITOR.ENLARGE_BLOCK_CONTENTS);
                this.extractContents().appendTo(d);
                d.trim();
                d.appendBogus();
                this.insertNode(d);
                this.moveToBookmark(c);
                return d
            }, splitBlock: function (a) {
                var b = new CKEDITOR.dom.elementPath(this.startContainer, this.root),
                    c = new CKEDITOR.dom.elementPath(this.endContainer, this.root), d = b.block, f = c.block, e = null;
                if (!b.blockLimit.equals(c.blockLimit))return null;
                if (a != "br") {
                    if (!d) {
                        d = this.fixBlock(true, a);
                        f =
                            (new CKEDITOR.dom.elementPath(this.endContainer, this.root)).block
                    }
                    f || (f = this.fixBlock(false, a))
                }
                a = d && this.checkStartOfBlock();
                b = f && this.checkEndOfBlock();
                this.deleteContents();
                if (d && d.equals(f))if (b) {
                    e = new CKEDITOR.dom.elementPath(this.startContainer, this.root);
                    this.moveToPosition(f, CKEDITOR.POSITION_AFTER_END);
                    f = null
                } else if (a) {
                    e = new CKEDITOR.dom.elementPath(this.startContainer, this.root);
                    this.moveToPosition(d, CKEDITOR.POSITION_BEFORE_START);
                    d = null
                } else {
                    f = this.splitElement(d);
                    d.is("ul", "ol") || d.appendBogus()
                }
                return {
                    previousBlock: d,
                    nextBlock: f, wasStartOfBlock: a, wasEndOfBlock: b, elementPath: e
                }
            }, splitElement: function (a) {
                if (!this.collapsed)return null;
                this.setEndAt(a, CKEDITOR.POSITION_BEFORE_END);
                var b = this.extractContents(), c = a.clone(false);
                b.appendTo(c);
                c.insertAfter(a);
                this.moveToPosition(a, CKEDITOR.POSITION_AFTER_END);
                return c
            }, removeEmptyBlocksAtEnd: function () {
                function a(d) {
                    return function (a) {
                        return b(a) || (c(a) || a.type == CKEDITOR.NODE_ELEMENT && a.isEmptyInlineRemoveable()) || d.is("table") && a.is("caption") ? false : true
                    }
                }

                var b = CKEDITOR.dom.walker.whitespaces(),
                    c = CKEDITOR.dom.walker.bookmark(false);
                return function (b) {
                    for (var c = this.createBookmark(), d = this[b ? "endPath" : "startPath"](),
                             e = d.block || d.blockLimit, m; e && !e.equals(d.root) && !e.getFirst(a(e));) {
                        m = e.getParent();
                        this[b ? "setEndAt" : "setStartAt"](e, CKEDITOR.POSITION_AFTER_END);
                        e.remove(1);
                        e = m
                    }
                    this.moveToBookmark(c)
                }
            }(), startPath: function () {
                return new CKEDITOR.dom.elementPath(this.startContainer, this.root)
            }, endPath: function () {
                return new CKEDITOR.dom.elementPath(this.endContainer, this.root)
            }, checkBoundaryOfElement: function (a,
                                                 b) {
                var c = b == CKEDITOR.START, d = this.clone();
                d.collapse(c);
                d[c ? "setStartAt" : "setEndAt"](a, c ? CKEDITOR.POSITION_AFTER_START : CKEDITOR.POSITION_BEFORE_END);
                d = new CKEDITOR.dom.walker(d);
                d.evaluator = e(c);
                return d[c ? "checkBackward" : "checkForward"]()
            }, checkStartOfBlock: function () {
                var b = this.startContainer, c = this.startOffset;
                if (CKEDITOR.env.ie && c && b.type == CKEDITOR.NODE_TEXT) {
                    b = CKEDITOR.tools.ltrim(b.substring(0, c));
                    n.test(b) && this.trim(0, 1)
                }
                this.trim();
                b = new CKEDITOR.dom.elementPath(this.startContainer, this.root);
                c = this.clone();
                c.collapse(true);
                c.setStartAt(b.block || b.blockLimit, CKEDITOR.POSITION_AFTER_START);
                b = new CKEDITOR.dom.walker(c);
                b.evaluator = a();
                return b.checkBackward()
            }, checkEndOfBlock: function () {
                var b = this.endContainer, c = this.endOffset;
                if (CKEDITOR.env.ie && b.type == CKEDITOR.NODE_TEXT) {
                    b = CKEDITOR.tools.rtrim(b.substring(c));
                    n.test(b) && this.trim(1, 0)
                }
                this.trim();
                b = new CKEDITOR.dom.elementPath(this.endContainer, this.root);
                c = this.clone();
                c.collapse(false);
                c.setEndAt(b.block || b.blockLimit, CKEDITOR.POSITION_BEFORE_END);
                b = new CKEDITOR.dom.walker(c);
                b.evaluator = a();
                return b.checkForward()
            }, getPreviousNode: function (a, b, c) {
                var d = this.clone();
                d.collapse(1);
                d.setStartAt(c || this.root, CKEDITOR.POSITION_AFTER_START);
                c = new CKEDITOR.dom.walker(d);
                c.evaluator = a;
                c.guard = b;
                return c.previous()
            }, getNextNode: function (a, b, c) {
                var d = this.clone();
                d.collapse();
                d.setEndAt(c || this.root, CKEDITOR.POSITION_BEFORE_END);
                c = new CKEDITOR.dom.walker(d);
                c.evaluator = a;
                c.guard = b;
                return c.next()
            }, checkReadOnly: function () {
                function a(b, c) {
                    for (; b;) {
                        if (b.type ==
                            CKEDITOR.NODE_ELEMENT) {
                            if (b.getAttribute("contentEditable") == "false" && !b.data("cke-editable"))return 0;
                            if (b.is("html") || b.getAttribute("contentEditable") == "true" && (b.contains(c) || b.equals(c)))break
                        }
                        b = b.getParent()
                    }
                    return 1
                }

                return function () {
                    var b = this.startContainer, c = this.endContainer;
                    return !(a(b, c) && a(c, b))
                }
            }(), moveToElementEditablePosition: function (a, b) {
                if (a.type == CKEDITOR.NODE_ELEMENT && !a.isEditable(false)) {
                    this.moveToPosition(a, b ? CKEDITOR.POSITION_AFTER_END : CKEDITOR.POSITION_BEFORE_START);
                    return true
                }
                for (var c =
                    0; a;) {
                    if (a.type == CKEDITOR.NODE_TEXT) {
                        b && this.endContainer && this.checkEndOfBlock() && n.test(a.getText()) ? this.moveToPosition(a, CKEDITOR.POSITION_BEFORE_START) : this.moveToPosition(a, b ? CKEDITOR.POSITION_AFTER_END : CKEDITOR.POSITION_BEFORE_START);
                        c = 1;
                        break
                    }
                    if (a.type == CKEDITOR.NODE_ELEMENT)if (a.isEditable()) {
                        this.moveToPosition(a, b ? CKEDITOR.POSITION_BEFORE_END : CKEDITOR.POSITION_AFTER_START);
                        c = 1
                    } else if (b && a.is("br") && this.endContainer && this.checkEndOfBlock()) this.moveToPosition(a, CKEDITOR.POSITION_BEFORE_START);
                    else if (a.getAttribute("contenteditable") == "false" && a.is(CKEDITOR.dtd.$block)) {
                        this.setStartBefore(a);
                        this.setEndAfter(a);
                        return true
                    }
                    var d = a, f = c, e = void 0;
                    d.type == CKEDITOR.NODE_ELEMENT && d.isEditable(false) && (e = d[b ? "getLast" : "getFirst"](j));
                    !f && !e && (e = d[b ? "getPrevious" : "getNext"](j));
                    a = e
                }
                return !!c
            }, moveToClosestEditablePosition: function (a, b) {
                var c = new CKEDITOR.dom.range(this.root), d = 0, f,
                    e = [CKEDITOR.POSITION_AFTER_END, CKEDITOR.POSITION_BEFORE_START];
                c.moveToPosition(a, e[b ? 0 : 1]);
                if (a.is(CKEDITOR.dtd.$block)) {
                    if (f =
                            c[b ? "getNextEditableNode" : "getPreviousEditableNode"]()) {
                        d = 1;
                        if (f.type == CKEDITOR.NODE_ELEMENT && f.is(CKEDITOR.dtd.$block) && f.getAttribute("contenteditable") == "false") {
                            c.setStartAt(f, CKEDITOR.POSITION_BEFORE_START);
                            c.setEndAt(f, CKEDITOR.POSITION_AFTER_END)
                        } else c.moveToPosition(f, e[b ? 1 : 0])
                    }
                } else d = 1;
                d && this.moveToRange(c);
                return !!d
            }, moveToElementEditStart: function (a) {
                return this.moveToElementEditablePosition(a)
            }, moveToElementEditEnd: function (a) {
                return this.moveToElementEditablePosition(a, true)
            }, getEnclosedNode: function () {
                var a =
                    this.clone();
                a.optimize();
                if (a.startContainer.type != CKEDITOR.NODE_ELEMENT || a.endContainer.type != CKEDITOR.NODE_ELEMENT)return null;
                var a = new CKEDITOR.dom.walker(a), b = CKEDITOR.dom.walker.bookmark(false, true),
                    c = CKEDITOR.dom.walker.whitespaces(true);
                a.evaluator = function (a) {
                    return c(a) && b(a)
                };
                var d = a.next();
                a.reset();
                return d && d.equals(a.previous()) ? d : null
            }, getTouchedStartNode: function () {
                var a = this.startContainer;
                return this.collapsed || a.type != CKEDITOR.NODE_ELEMENT ? a : a.getChild(this.startOffset) || a
            }, getTouchedEndNode: function () {
                var a =
                    this.endContainer;
                return this.collapsed || a.type != CKEDITOR.NODE_ELEMENT ? a : a.getChild(this.endOffset - 1) || a
            }, getNextEditableNode: b(), getPreviousEditableNode: b(1), scrollIntoView: function () {
                var a = new CKEDITOR.dom.element.createFromHtml("<span>&nbsp;</span>", this.document), b, c, d,
                    f = this.clone();
                f.optimize();
                if (d = f.startContainer.type == CKEDITOR.NODE_TEXT) {
                    c = f.startContainer.getText();
                    b = f.startContainer.split(f.startOffset);
                    a.insertAfter(f.startContainer)
                } else f.insertNode(a);
                a.scrollIntoView();
                if (d) {
                    f.startContainer.setText(c);
                    b.remove()
                }
                a.remove()
            }
            }
    })();
    CKEDITOR.POSITION_AFTER_START = 1;
    CKEDITOR.POSITION_BEFORE_END = 2;
    CKEDITOR.POSITION_BEFORE_START = 3;
    CKEDITOR.POSITION_AFTER_END = 4;
    CKEDITOR.ENLARGE_ELEMENT = 1;
    CKEDITOR.ENLARGE_BLOCK_CONTENTS = 2;
    CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS = 3;
    CKEDITOR.ENLARGE_INLINE = 4;
    CKEDITOR.START = 1;
    CKEDITOR.END = 2;
    CKEDITOR.SHRINK_ELEMENT = 1;
    CKEDITOR.SHRINK_TEXT = 2;
    "use strict";
    (function () {
        function a(a) {
            if (!(arguments.length < 1)) {
                this.range = a;
                this.forceBrBreak = 0;
                this.enlargeBr = 1;
                this.enforceRealBlocks = 0;
                this._ || (this._ = {})
            }
        }

        function e(a, b, c) {
            for (a = a.getNextSourceNode(b, null, c); !h(a);)a = a.getNextSourceNode(b, null, c);
            return a
        }

        function b(a) {
            var b = [];
            a.forEach(function (a) {
                if (a.getAttribute("contenteditable") == "true") {
                    b.push(a);
                    return false
                }
            }, CKEDITOR.NODE_ELEMENT, true);
            return b
        }

        function c(a, d, e, h) {
            a:{
                h == void 0 && (h = b(e));
                for (var g; g = h.shift();)if (g.getDtd().p) {
                    h = {element: g, remaining: h};
                    break a
                }
                h = null
            }
            if (!h)return 0;
            if ((g = CKEDITOR.filter.instances[h.element.data("cke-filter")]) && !g.check(d))return c(a, d, e, h.remaining);
            d = new CKEDITOR.dom.range(h.element);
            d.selectNodeContents(h.element);
            d = d.createIterator();
            d.enlargeBr = a.enlargeBr;
            d.enforceRealBlocks = a.enforceRealBlocks;
            d.activeFilter = d.filter = g;
            a._.nestedEditable = {element: h.element, container: e, remaining: h.remaining, iterator: d};
            return 1
        }

        var d = /^[\r\n\t ]+$/, h = CKEDITOR.dom.walker.bookmark(false, true),
            g = CKEDITOR.dom.walker.whitespaces(true),
            n = function (a) {
                return h(a) && g(a)
            };
        a.prototype = {
            getNextParagraph: function (a) {
                var b, g, q, s, u, a = a || "p";
                if (this._.nestedEditable) {
                    if (b = this._.nestedEditable.iterator.getNextParagraph(a)) {
                        this.activeFilter = this._.nestedEditable.iterator.activeFilter;
                        return b
                    }
                    this.activeFilter = this.filter;
                    if (c(this, a, this._.nestedEditable.container, this._.nestedEditable.remaining)) {
                        this.activeFilter = this._.nestedEditable.iterator.activeFilter;
                        return this._.nestedEditable.iterator.getNextParagraph(a)
                    }
                    this._.nestedEditable =
                        null
                }
                if (!this.range.root.getDtd()[a])return null;
                if (!this._.started) {
                    var f = this.range.clone();
                    f.shrink(CKEDITOR.SHRINK_ELEMENT, true);
                    g = f.endContainer.hasAscendant("pre", true) || f.startContainer.hasAscendant("pre", true);
                    f.enlarge(this.forceBrBreak && !g || !this.enlargeBr ? CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS : CKEDITOR.ENLARGE_BLOCK_CONTENTS);
                    if (!f.collapsed) {
                        g = new CKEDITOR.dom.walker(f.clone());
                        var p = CKEDITOR.dom.walker.bookmark(true, true);
                        g.evaluator = p;
                        this._.nextNode = g.next();
                        g = new CKEDITOR.dom.walker(f.clone());
                        g.evaluator = p;
                        g = g.previous();
                        this._.lastNode = g.getNextSourceNode(true);
                        if (this._.lastNode && this._.lastNode.type == CKEDITOR.NODE_TEXT && !CKEDITOR.tools.trim(this._.lastNode.getText()) && this._.lastNode.getParent().isBlockBoundary()) {
                            p = this.range.clone();
                            p.moveToPosition(this._.lastNode, CKEDITOR.POSITION_AFTER_END);
                            if (p.checkEndOfBlock()) {
                                p = new CKEDITOR.dom.elementPath(p.endContainer, p.root);
                                this._.lastNode = (p.block || p.blockLimit).getNextSourceNode(true)
                            }
                        }
                        if (!this._.lastNode || !f.root.contains(this._.lastNode)) {
                            this._.lastNode =
                                this._.docEndMarker = f.document.createText("");
                            this._.lastNode.insertAfter(g)
                        }
                        f = null
                    }
                    this._.started = 1;
                    g = f
                }
                p = this._.nextNode;
                f = this._.lastNode;
                for (this._.nextNode = null; p;) {
                    var y = 0, m = p.hasAscendant("pre"), k = p.type != CKEDITOR.NODE_ELEMENT, l = 0;
                    if (k) p.type == CKEDITOR.NODE_TEXT && d.test(p.getText()) && (k = 0); else {
                        var t = p.getName();
                        if (CKEDITOR.dtd.$block[t] && p.getAttribute("contenteditable") == "false") {
                            b = p;
                            c(this, a, b);
                            break
                        } else if (p.isBlockBoundary(this.forceBrBreak && !m && {br: 1})) {
                            if (t == "br") k = 1; else if (!g && !p.getChildCount() &&
                                t != "hr") {
                                b = p;
                                q = p.equals(f);
                                break
                            }
                            if (g) {
                                g.setEndAt(p, CKEDITOR.POSITION_BEFORE_START);
                                if (t != "br") this._.nextNode = p
                            }
                            y = 1
                        } else {
                            if (p.getFirst()) {
                                if (!g) {
                                    g = this.range.clone();
                                    g.setStartAt(p, CKEDITOR.POSITION_BEFORE_START)
                                }
                                p = p.getFirst();
                                continue
                            }
                            k = 1
                        }
                    }
                    if (k && !g) {
                        g = this.range.clone();
                        g.setStartAt(p, CKEDITOR.POSITION_BEFORE_START)
                    }
                    q = (!y || k) && p.equals(f);
                    if (g && !y)for (; !p.getNext(n) && !q;) {
                        t = p.getParent();
                        if (t.isBlockBoundary(this.forceBrBreak && !m && {br: 1})) {
                            y = 1;
                            k = 0;
                            q || t.equals(f);
                            g.setEndAt(t, CKEDITOR.POSITION_BEFORE_END);
                            break
                        }
                        p = t;
                        k = 1;
                        q = p.equals(f);
                        l = 1
                    }
                    k && g.setEndAt(p, CKEDITOR.POSITION_AFTER_END);
                    p = e(p, l, f);
                    if ((q = !p) || y && g)break
                }
                if (!b) {
                    if (!g) {
                        this._.docEndMarker && this._.docEndMarker.remove();
                        return this._.nextNode = null
                    }
                    b = new CKEDITOR.dom.elementPath(g.startContainer, g.root);
                    p = b.blockLimit;
                    y = {div: 1, th: 1, td: 1};
                    b = b.block;
                    if (!b && p && !this.enforceRealBlocks && y[p.getName()] && g.checkStartOfBlock() && g.checkEndOfBlock() && !p.equals(g.root)) b = p; else if (!b || this.enforceRealBlocks && b.getName() == "li") {
                        b = this.range.document.createElement(a);
                        g.extractContents().appendTo(b);
                        b.trim();
                        g.insertNode(b);
                        s = u = true
                    } else if (b.getName() != "li") {
                        if (!g.checkStartOfBlock() || !g.checkEndOfBlock()) {
                            b = b.clone(false);
                            g.extractContents().appendTo(b);
                            b.trim();
                            u = g.splitBlock();
                            s = !u.wasStartOfBlock;
                            u = !u.wasEndOfBlock;
                            g.insertNode(b)
                        }
                    } else if (!q) this._.nextNode = b.equals(f) ? null : e(g.getBoundaryNodes().endNode, 1, f)
                }
                if (s) (s = b.getPrevious()) && s.type == CKEDITOR.NODE_ELEMENT && (s.getName() == "br" ? s.remove() : s.getLast() && s.getLast().$.nodeName.toLowerCase() == "br" && s.getLast().remove());
                if (u) (s = b.getLast()) && s.type == CKEDITOR.NODE_ELEMENT && s.getName() == "br" && (!CKEDITOR.env.needsBrFiller || s.getPrevious(h) || s.getNext(h)) && s.remove();
                if (!this._.nextNode) this._.nextNode = q || b.equals(f) || !f ? null : e(b, 1, f);
                return b
            }
        };
        CKEDITOR.dom.range.prototype.createIterator = function () {
            return new a(this)
        }
    })();
    CKEDITOR.command = function (a, e) {
        this.uiItems = [];
        this.exec = function (b) {
            if (this.state == CKEDITOR.TRISTATE_DISABLED || !this.checkAllowed())return false;
            this.editorFocus && a.focus();
            return this.fire("exec") === false ? true : e.exec.call(this, a, b) !== false
        };
        this.refresh = function (a, b) {
            if (!this.readOnly && a.readOnly)return true;
            if (this.context && !b.isContextFor(this.context)) {
                this.disable();
                return true
            }
            if (!this.checkAllowed(true)) {
                this.disable();
                return true
            }
            this.startDisabled || this.enable();
            this.modes && !this.modes[a.mode] &&
            this.disable();
            return this.fire("refresh", {
                editor: a,
                path: b
            }) === false ? true : e.refresh && e.refresh.apply(this, arguments) !== false
        };
        var b;
        this.checkAllowed = function (c) {
            return !c && typeof b == "boolean" ? b : b = a.activeFilter.checkFeature(this)
        };
        CKEDITOR.tools.extend(this, e, {
            modes: {wysiwyg: 1},
            editorFocus: 1,
            contextSensitive: !!e.context,
            state: CKEDITOR.TRISTATE_DISABLED
        });
        CKEDITOR.event.call(this)
    };
    CKEDITOR.command.prototype = {
        enable: function () {
            this.state == CKEDITOR.TRISTATE_DISABLED && this.checkAllowed() && this.setState(!this.preserveState || typeof this.previousState == "undefined" ? CKEDITOR.TRISTATE_OFF : this.previousState)
        }, disable: function () {
            this.setState(CKEDITOR.TRISTATE_DISABLED)
        }, setState: function (a) {
            if (this.state == a || a != CKEDITOR.TRISTATE_DISABLED && !this.checkAllowed())return false;
            this.previousState = this.state;
            this.state = a;
            this.fire("state");
            return true
        }, toggleState: function () {
            this.state == CKEDITOR.TRISTATE_OFF ?
                this.setState(CKEDITOR.TRISTATE_ON) : this.state == CKEDITOR.TRISTATE_ON && this.setState(CKEDITOR.TRISTATE_OFF)
        }
    };
    CKEDITOR.event.implementOn(CKEDITOR.command.prototype);
    CKEDITOR.ENTER_P = 1;
    CKEDITOR.ENTER_BR = 2;
    CKEDITOR.ENTER_DIV = 3;
    CKEDITOR.config = {
        customConfig: "config.js",
        autoUpdateElement: !0,
        language: "",
        defaultLanguage: "en",
        contentsLangDirection: "",
        enterMode: CKEDITOR.ENTER_P,
        forceEnterMode: !1,
        shiftEnterMode: CKEDITOR.ENTER_BR,
        docType: "<!DOCTYPE html>",
        bodyId: "",
        bodyClass: "",
        fullPage: !1,
        height: 200,
        extraPlugins: "",
        removePlugins: "",
        protectedSource: [],
        tabIndex: 0,
        width: "",
        baseFloatZIndex: 1E4,
        blockedKeystrokes: [CKEDITOR.CTRL + 66, CKEDITOR.CTRL + 73, CKEDITOR.CTRL + 85]
    };
    (function () {
        function a(a, b, c, f, k) {
            var m = b.name;
            if ((f || typeof a.elements != "function" || a.elements(m)) && (!a.match || a.match(b))) {
                if (f = !k) {
                    a:if (a.nothingRequired) f = true; else {
                        if (k = a.requiredClasses) {
                            m = b.classes;
                            for (f = 0; f < k.length; ++f)if (CKEDITOR.tools.indexOf(m, k[f]) == -1) {
                                f = false;
                                break a
                            }
                        }
                        f = d(b.styles, a.requiredStyles) && d(b.attributes, a.requiredAttributes)
                    }
                    f = !f
                }
                if (!f) {
                    if (!a.propertiesOnly) c.valid = true;
                    if (!c.allAttributes) c.allAttributes = e(a.attributes, b.attributes, c.validAttributes);
                    if (!c.allStyles) c.allStyles =
                        e(a.styles, b.styles, c.validStyles);
                    if (!c.allClasses) {
                        a = a.classes;
                        b = b.classes;
                        f = c.validClasses;
                        if (a)if (a === true) b = true; else {
                            for (var k = 0, m = b.length, l; k < m; ++k) {
                                l = b[k];
                                f[l] || (f[l] = a(l))
                            }
                            b = false
                        } else b = false;
                        c.allClasses = b
                    }
                }
            }
        }

        function e(a, b, c) {
            if (!a)return false;
            if (a === true)return true;
            for (var d in b)c[d] || (c[d] = a(d, b[d]));
            return false
        }

        function b(a, b) {
            if (!a)return false;
            if (a === true)return a;
            if (typeof a == "string") {
                a = r(a);
                return a == "*" ? true : CKEDITOR.tools.convertArrayToObject(a.split(b))
            }
            if (CKEDITOR.tools.isArray(a))return a.length ?
                CKEDITOR.tools.convertArrayToObject(a) : false;
            var c = {}, d = 0, f;
            for (f in a) {
                c[f] = a[f];
                d++
            }
            return d ? c : false
        }

        function c(b) {
            if (b._.filterFunction)return b._.filterFunction;
            var c = /^cke:(object|embed|param)$/, d = /^(object|embed|param)$/;
            return b._.filterFunction = function (f, e, k, m, l, h, t) {
                var g = f.name, r, y = false;
                if (l) f.name = g = g.replace(c, "$1");
                if (k = k && k[g]) {
                    i(f);
                    for (g = 0; g < k.length; ++g)p(b, f, k[g]);
                    j(f)
                }
                if (e) {
                    var g = f.name, k = e.elements[g], x = e.generic, e = {
                        valid: false, validAttributes: {}, validClasses: {}, validStyles: {},
                        allAttributes: false, allClasses: false, allStyles: false
                    };
                    if (!k && !x) {
                        m.push(f);
                        return true
                    }
                    i(f);
                    if (k) {
                        g = 0;
                        for (r = k.length; g < r; ++g)a(k[g], f, e, true, h)
                    }
                    if (x) {
                        g = 0;
                        for (r = x.length; g < r; ++g)a(x[g], f, e, false, h)
                    }
                    if (!e.valid) {
                        m.push(f);
                        return true
                    }
                    h = e.validAttributes;
                    g = e.validStyles;
                    k = e.validClasses;
                    r = f.attributes;
                    var x = f.styles, n = r["class"], L = r.style, A, z, E = [], I = [], s = /^data-cke-/, q = false;
                    delete r.style;
                    delete r["class"];
                    if (!e.allAttributes)for (A in r)if (!h[A])if (s.test(A)) {
                        if (A != (z = A.replace(/^data-cke-saved-/, "")) &&
                            !h[z]) {
                            delete r[A];
                            q = true
                        }
                    } else {
                        delete r[A];
                        q = true
                    }
                    if (e.allStyles) {
                        if (L) r.style = L
                    } else {
                        for (A in x)g[A] ? E.push(A + ":" + x[A]) : q = true;
                        if (E.length) r.style = E.sort().join("; ")
                    }
                    if (e.allClasses) n && (r["class"] = n); else {
                        for (A in k)k[A] && I.push(A);
                        I.length && (r["class"] = I.sort().join(" "));
                        n && I.length < n.split(/\s+/).length && (q = true)
                    }
                    q && (y = true);
                    if (!t && !o(f)) {
                        m.push(f);
                        return true
                    }
                }
                if (l) f.name = f.name.replace(d, "cke:$1");
                return y
            }
        }

        function d(a, b) {
            if (!b)return true;
            for (var c = 0; c < b.length; ++c)if (!(b[c] in a))return false;
            return true
        }

        function h(a) {
            if (!a)return {};
            for (var a = a.split(/\s*,\s*/).sort(), b = {}; a.length;)b[a.shift()] = L;
            return b
        }

        function g(a) {
            for (var b, c, d, f, e = {}, k = 1, a = r(a); b = a.match(z);) {
                if (c = b[2]) {
                    d = n(c, "styles");
                    f = n(c, "attrs");
                    c = n(c, "classes")
                } else d = f = c = null;
                e["$" + k++] = {elements: b[1], classes: c, styles: d, attributes: f};
                a = a.slice(b[0].length)
            }
            return e
        }

        function n(a, b) {
            var c = a.match(M[b]);
            return c ? r(c[1]) : null
        }

        function i(a) {
            if (!a.styles) a.styles = CKEDITOR.tools.parseCssText(a.attributes.style || "", 1);
            if (!a.classes) a.classes =
                a.attributes["class"] ? a.attributes["class"].split(/\s+/) : []
        }

        function j(a) {
            var b = a.attributes, c;
            delete b.style;
            delete b["class"];
            if (c = CKEDITOR.tools.writeCssText(a.styles, true)) b.style = c;
            a.classes.length && (b["class"] = a.classes.sort().join(" "))
        }

        function o(a) {
            switch (a.name) {
                case "a":
                    if (!a.children.length && !a.attributes.name)return false;
                    break;
                case "img":
                    if (!a.attributes.src)return false
            }
            return true
        }

        function q(a) {
            return !a ? false : a === true ? true : function (b) {
                return b in a
            }
        }

        function s() {
            return new CKEDITOR.htmlParser.element("br")
        }

        function u(a) {
            return a.type == CKEDITOR.NODE_ELEMENT && (a.name == "br" || t.$block[a.name])
        }

        function f(a, b, c) {
            var d = a.name;
            if (t.$empty[d] || !a.children.length)if (d == "hr" && b == "br") a.replaceWith(s()); else {
                a.parent && c.push({check: "it", el: a.parent});
                a.remove()
            } else if (t.$block[d] || d == "tr")if (b == "br") {
                if (a.previous && !u(a.previous)) {
                    b = s();
                    b.insertBefore(a)
                }
                if (a.next && !u(a.next)) {
                    b = s();
                    b.insertAfter(a)
                }
                a.replaceWithChildren()
            } else {
                var d = a.children, f;
                b:{
                    f = t[b];
                    for (var e = 0, k = d.length, m; e < k; ++e) {
                        m = d[e];
                        if (m.type ==
                            CKEDITOR.NODE_ELEMENT && !f[m.name]) {
                            f = false;
                            break b
                        }
                    }
                    f = true
                }
                if (f) {
                    a.name = b;
                    a.attributes = {};
                    c.push({check: "parent-down", el: a})
                } else {
                    f = a.parent;
                    for (var e = f.type == CKEDITOR.NODE_DOCUMENT_FRAGMENT || f.name == "body", l,
                             k = d.length; k > 0;) {
                        m = d[--k];
                        if (e && (m.type == CKEDITOR.NODE_TEXT || m.type == CKEDITOR.NODE_ELEMENT && t.$inline[m.name])) {
                            if (!l) {
                                l = new CKEDITOR.htmlParser.element(b);
                                l.insertAfter(a);
                                c.push({check: "parent-down", el: l})
                            }
                            l.add(m, 0)
                        } else {
                            l = null;
                            m.insertAfter(a);
                            f.type != CKEDITOR.NODE_DOCUMENT_FRAGMENT && (m.type ==
                            CKEDITOR.NODE_ELEMENT && !t[f.name][m.name]) && c.push({check: "el-up", el: m})
                        }
                    }
                    a.remove()
                }
            } else if (d == "style") a.remove(); else {
                a.parent && c.push({check: "it", el: a.parent});
                a.replaceWithChildren()
            }
        }

        function p(a, b, c) {
            var d, f;
            for (d = 0; d < c.length; ++d) {
                f = c[d];
                if ((!f.check || a.check(f.check, false)) && (!f.left || f.left(b))) {
                    f.right(b, Q);
                    break
                }
            }
        }

        function y(a, b) {
            var c = b.getDefinition(), d = c.attributes, f = c.styles, e, k, m, l;
            if (a.name != c.element)return false;
            for (e in d)if (e == "class") {
                c = d[e].split(/\s+/);
                for (m = a.classes.join("|"); l =
                    c.pop();)if (m.indexOf(l) == -1)return false
            } else if (a.attributes[e] != d[e])return false;
            for (k in f)if (a.styles[k] != f[k])return false;
            return true
        }

        function m(a, b) {
            var c, d;
            if (typeof a == "string") c = a; else if (a instanceof CKEDITOR.style) d = a; else {
                c = a[0];
                d = a[1]
            }
            return [{
                element: c, left: d, right: function (a, c) {
                    c.transform(a, b)
                }
            }]
        }

        function k(a) {
            return function (b) {
                return y(b, a)
            }
        }

        function l(a) {
            return function (b, c) {
                c[a](b)
            }
        }

        var t = CKEDITOR.dtd, x = CKEDITOR.tools.copy, r = CKEDITOR.tools.trim, L = "cke-test",
            A = ["", "p", "br", "div"];
        CKEDITOR.filter = function (a) {
            this.allowedContent = [];
            this.disabled = false;
            this.editor = null;
            this.id = CKEDITOR.tools.getNextNumber();
            this._ = {rules: {}, transformations: {}, cachedTests: {}};
            CKEDITOR.filter.instances[this.id] = this;
            if (a instanceof CKEDITOR.editor) {
                a = this.editor = a;
                this.customConfig = true;
                var b = a.config.allowedContent;
                if (b === true) this.disabled = true; else {
                    if (!b) this.customConfig = false;
                    this.allow(b, "config", 1);
                    this.allow(a.config.extraAllowedContent, "extra", 1);
                    this.allow(A[a.enterMode] + " " + A[a.shiftEnterMode],
                        "default", 1)
                }
            } else {
                this.customConfig = false;
                this.allow(a, "default", 1)
            }
        };
        CKEDITOR.filter.instances = {};
        CKEDITOR.filter.prototype = {
            allow: function (a, c, d) {
                if (this.disabled || this.customConfig && !d || !a)return false;
                this._.cachedChecks = {};
                var f, e;
                if (typeof a == "string") a = g(a); else if (a instanceof CKEDITOR.style) {
                    e = a.getDefinition();
                    d = {};
                    a = e.attributes;
                    d[e.element] = e = {
                        styles: e.styles,
                        requiredStyles: e.styles && CKEDITOR.tools.objectKeys(e.styles)
                    };
                    if (a) {
                        a = x(a);
                        e.classes = a["class"] ? a["class"].split(/\s+/) : null;
                        e.requiredClasses =
                            e.classes;
                        delete a["class"];
                        e.attributes = a;
                        e.requiredAttributes = a && CKEDITOR.tools.objectKeys(a)
                    }
                    a = d
                } else if (CKEDITOR.tools.isArray(a)) {
                    for (f = 0; f < a.length; ++f)e = this.allow(a[f], c, d);
                    return e
                }
                var k, d = [];
                for (k in a) {
                    e = a[k];
                    e = typeof e == "boolean" ? {} : typeof e == "function" ? {match: e} : x(e);
                    if (k.charAt(0) != "$") e.elements = k;
                    if (c) e.featureName = c.toLowerCase();
                    var m = e;
                    m.elements = b(m.elements, /\s+/) || null;
                    m.propertiesOnly = m.propertiesOnly || m.elements === true;
                    var l = /\s*,\s*/, h = void 0;
                    for (h in I) {
                        m[h] = b(m[h], l) || null;
                        var p = m, t = E[h], r = b(m[E[h]], l), i = m[h], j = [], y = true, n = void 0;
                        r ? y = false : r = {};
                        for (n in i)if (n.charAt(0) == "!") {
                            n = n.slice(1);
                            j.push(n);
                            r[n] = true;
                            y = false
                        }
                        for (; n = j.pop();) {
                            i[n] = i["!" + n];
                            delete i["!" + n]
                        }
                        p[t] = (y ? false : r) || null
                    }
                    m.match = m.match || null;
                    this.allowedContent.push(e);
                    d.push(e)
                }
                c = this._.rules;
                k = c.elements || {};
                a = c.generic || [];
                e = 0;
                for (m = d.length; e < m; ++e) {
                    l = x(d[e]);
                    h = l.classes === true || l.styles === true || l.attributes === true;
                    p = l;
                    t = void 0;
                    for (t in I)p[t] = q(p[t]);
                    r = true;
                    for (t in E) {
                        t = E[t];
                        p[t] = CKEDITOR.tools.objectKeys(p[t]);
                        p[t] && (r = false)
                    }
                    p.nothingRequired = r;
                    if (l.elements === true || l.elements === null) {
                        l.elements = q(l.elements);
                        a[h ? "unshift" : "push"](l)
                    } else {
                        p = l.elements;
                        delete l.elements;
                        for (f in p)if (k[f]) k[f][h ? "unshift" : "push"](l); else k[f] = [l]
                    }
                }
                c.elements = k;
                c.generic = a.length ? a : null;
                return true
            }, applyTo: function (a, b, d, e) {
                if (this.disabled)return false;
                var k = [], m = !d && this._.rules, l = this._.transformations, h = c(this),
                    p = this.editor && this.editor.config.protectedSource, g = false;
                a.forEach(function (a) {
                    if (a.type == CKEDITOR.NODE_ELEMENT) {
                        if (a.attributes["data-cke-filter"] ==
                            "off")return false;
                        if (!b || !(a.name == "span" && ~CKEDITOR.tools.objectKeys(a.attributes).join("|").indexOf("data-cke-"))) h(a, m, l, k, b) && (g = true)
                    } else if (a.type == CKEDITOR.NODE_COMMENT && a.value.match(/^\{cke_protected\}(?!\{C\})/)) {
                        var c;
                        a:{
                            var d = decodeURIComponent(a.value.replace(/^\{cke_protected\}/, ""));
                            c = [];
                            var f, e, C;
                            if (p)for (e = 0; e < p.length; ++e)if ((C = d.match(p[e])) && C[0].length == d.length) {
                                c = true;
                                break a
                            }
                            d = CKEDITOR.htmlParser.fragment.fromHtml(d);
                            d.children.length == 1 && (f = d.children[0]).type == CKEDITOR.NODE_ELEMENT &&
                            h(f, m, l, c, b);
                            c = !c.length
                        }
                        c || k.push(a)
                    }
                }, null, true);
                k.length && (g = true);
                for (var r, a = [],
                         e = A[e || (this.editor ? this.editor.enterMode : CKEDITOR.ENTER_P)]; d = k.pop();)d.type == CKEDITOR.NODE_ELEMENT ? f(d, e, a) : d.remove();
                for (; r = a.pop();) {
                    d = r.el;
                    if (d.parent)switch (r.check) {
                        case "it":
                            t.$removeEmpty[d.name] && !d.children.length ? f(d, e, a) : o(d) || f(d, e, a);
                            break;
                        case "el-up":
                            d.parent.type != CKEDITOR.NODE_DOCUMENT_FRAGMENT && !t[d.parent.name][d.name] && f(d, e, a);
                            break;
                        case "parent-down":
                            d.parent.type != CKEDITOR.NODE_DOCUMENT_FRAGMENT &&
                            !t[d.parent.name][d.name] && f(d.parent, e, a)
                    }
                }
                return g
            }, checkFeature: function (a) {
                if (this.disabled || !a)return true;
                a.toFeature && (a = a.toFeature(this.editor));
                return !a.requiredContent || this.check(a.requiredContent)
            }, disable: function () {
                this.disabled = true
            }, addContentForms: function (a) {
                if (!this.disabled && a) {
                    var b, c, d = [], f;
                    for (b = 0; b < a.length && !f; ++b) {
                        c = a[b];
                        if ((typeof c == "string" || c instanceof CKEDITOR.style) && this.check(c)) f = c
                    }
                    if (f) {
                        for (b = 0; b < a.length; ++b)d.push(m(a[b], f));
                        this.addTransformations(d)
                    }
                }
            }, addFeature: function (a) {
                if (this.disabled ||
                    !a)return true;
                a.toFeature && (a = a.toFeature(this.editor));
                this.allow(a.allowedContent, a.name);
                this.addTransformations(a.contentTransformations);
                this.addContentForms(a.contentForms);
                return this.customConfig && a.requiredContent ? this.check(a.requiredContent) : true
            }, addTransformations: function (a) {
                var b, c;
                if (!this.disabled && a) {
                    var d = this._.transformations, f;
                    for (f = 0; f < a.length; ++f) {
                        b = a[f];
                        var e = void 0, m = void 0, h = void 0, p = void 0, t = void 0, g = void 0;
                        c = [];
                        for (m = 0; m < b.length; ++m) {
                            h = b[m];
                            if (typeof h == "string") {
                                h =
                                    h.split(/\s*:\s*/);
                                p = h[0];
                                t = null;
                                g = h[1]
                            } else {
                                p = h.check;
                                t = h.left;
                                g = h.right
                            }
                            if (!e) {
                                e = h;
                                e = e.element ? e.element : p ? p.match(/^([a-z0-9]+)/i)[0] : e.left.getDefinition().element
                            }
                            t instanceof CKEDITOR.style && (t = k(t));
                            c.push({check: p == e ? null : p, left: t, right: typeof g == "string" ? l(g) : g})
                        }
                        b = e;
                        d[b] || (d[b] = []);
                        d[b].push(c)
                    }
                }
            }, check: function (a, b, d) {
                if (this.disabled)return true;
                if (CKEDITOR.tools.isArray(a)) {
                    for (var f = a.length; f--;)if (this.check(a[f], b, d))return true;
                    return false
                }
                var e, k;
                if (typeof a == "string") {
                    k = a + "<" +
                        (b === false ? "0" : "1") + (d ? "1" : "0") + ">";
                    if (k in this._.cachedChecks)return this._.cachedChecks[k];
                    f = g(a).$1;
                    e = f.styles;
                    var m = f.classes;
                    f.name = f.elements;
                    f.classes = m = m ? m.split(/\s*,\s*/) : [];
                    f.styles = h(e);
                    f.attributes = h(f.attributes);
                    f.children = [];
                    m.length && (f.attributes["class"] = m.join(" "));
                    if (e) f.attributes.style = CKEDITOR.tools.writeCssText(f.styles);
                    e = f
                } else {
                    f = a.getDefinition();
                    e = f.styles;
                    m = f.attributes || {};
                    if (e) {
                        e = x(e);
                        m.style = CKEDITOR.tools.writeCssText(e, true)
                    } else e = {};
                    e = {
                        name: f.element, attributes: m,
                        classes: m["class"] ? m["class"].split(/\s+/) : [], styles: e, children: []
                    }
                }
                var m = CKEDITOR.tools.clone(e), l = [], t;
                if (b !== false && (t = this._.transformations[e.name])) {
                    for (f = 0; f < t.length; ++f)p(this, e, t[f]);
                    j(e)
                }
                c(this)(m, this._.rules, b === false ? false : this._.transformations, l, false, !d, !d);
                b = l.length > 0 ? false : CKEDITOR.tools.objectCompare(e.attributes, m.attributes, true) ? true : false;
                typeof a == "string" && (this._.cachedChecks[k] = b);
                return b
            }, getAllowedEnterMode: function () {
                var a = ["p", "div", "br"], b = {
                    p: CKEDITOR.ENTER_P, div: CKEDITOR.ENTER_DIV,
                    br: CKEDITOR.ENTER_BR
                };
                return function (c, d) {
                    var f = a.slice(), e;
                    if (this.check(A[c]))return c;
                    for (d || (f = f.reverse()); e = f.pop();)if (this.check(e))return b[e];
                    return CKEDITOR.ENTER_BR
                }
            }()
        };
        var I = {styles: 1, attributes: 1, classes: 1},
            E = {styles: "requiredStyles", attributes: "requiredAttributes", classes: "requiredClasses"},
            z = /^([a-z0-9*\s]+)((?:\s*\{[!\w\-,\s\*]+\}\s*|\s*\[[!\w\-,\s\*]+\]\s*|\s*\([!\w\-,\s\*]+\)\s*){0,3})(?:;\s*|$)/i,
            M = {styles: /{([^}]+)}/, attrs: /\[([^\]]+)\]/, classes: /\(([^\)]+)\)/},
            Q = CKEDITOR.filter.transformationsTools =
                {
                    sizeToStyle: function (a) {
                        this.lengthToStyle(a, "width");
                        this.lengthToStyle(a, "height")
                    }, sizeToAttribute: function (a) {
                    this.lengthToAttribute(a, "width");
                    this.lengthToAttribute(a, "height")
                }, lengthToStyle: function (a, b, c) {
                    c = c || b;
                    if (!(c in a.styles)) {
                        var d = a.attributes[b];
                        if (d) {
                            /^\d+$/.test(d) && (d = d + "px");
                            a.styles[c] = d
                        }
                    }
                    delete a.attributes[b]
                }, lengthToAttribute: function (a, b, c) {
                    c = c || b;
                    if (!(c in a.attributes)) {
                        var d = a.styles[b], f = d && d.match(/^(\d+)(?:\.\d*)?px$/);
                        f ? a.attributes[c] = f[1] : d == L && (a.attributes[c] =
                                L)
                    }
                    delete a.styles[b]
                }, alignmentToStyle: function (a) {
                    if (!("float" in a.styles)) {
                        var b = a.attributes.align;
                        if (b == "left" || b == "right") a.styles["float"] = b
                    }
                    delete a.attributes.align
                }, alignmentToAttribute: function (a) {
                    if (!("align" in a.attributes)) {
                        var b = a.styles["float"];
                        if (b == "left" || b == "right") a.attributes.align = b
                    }
                    delete a.styles["float"]
                }, matchesStyle: y, transform: function (a, b) {
                    if (typeof b == "string") a.name = b; else {
                        var c = b.getDefinition(), d = c.styles, f = c.attributes, e, k, m, l;
                        a.name = c.element;
                        for (e in f)if (e ==
                            "class") {
                            c = a.classes.join("|");
                            for (m = f[e].split(/\s+/); l = m.pop();)c.indexOf(l) == -1 && a.classes.push(l)
                        } else a.attributes[e] = f[e];
                        for (k in d)a.styles[k] = d[k]
                    }
                }
                }
    })();
    (function () {
        CKEDITOR.focusManager = function (a) {
            if (a.focusManager)return a.focusManager;
            this.hasFocus = false;
            this.currentActive = null;
            this._ = {editor: a};
            return this
        };
        CKEDITOR.focusManager._ = {blurDelay: 200};
        CKEDITOR.focusManager.prototype = {
            focus: function (a) {
                this._.timer && clearTimeout(this._.timer);
                if (a) this.currentActive = a;
                if (!this.hasFocus && !this._.locked) {
                    (a = CKEDITOR.currentInstance) && a.focusManager.blur(1);
                    this.hasFocus = true;
                    (a = this._.editor.container) && a.addClass("cke_focus");
                    this._.editor.fire("focus")
                }
            },
            lock: function () {
                this._.locked = 1
            }, unlock: function () {
                delete this._.locked
            }, blur: function (a) {
                function e() {
                    if (this.hasFocus) {
                        this.hasFocus = false;
                        var a = this._.editor.container;
                        a && a.removeClass("cke_focus");
                        this._.editor.fire("blur")
                    }
                }

                if (!this._.locked) {
                    this._.timer && clearTimeout(this._.timer);
                    var b = CKEDITOR.focusManager._.blurDelay;
                    a || !b ? e.call(this) : this._.timer = CKEDITOR.tools.setTimeout(function () {
                        delete this._.timer;
                        e.call(this)
                    }, b, this)
                }
            }, add: function (a, e) {
                var b = a.getCustomData("focusmanager");
                if (!b ||
                    b != this) {
                    b && b.remove(a);
                    var b = "focus", c = "blur";
                    if (e)if (CKEDITOR.env.ie) {
                        b = "focusin";
                        c = "focusout"
                    } else CKEDITOR.event.useCapture = 1;
                    var d = {
                        blur: function () {
                            a.equals(this.currentActive) && this.blur()
                        }, focus: function () {
                            this.focus(a)
                        }
                    };
                    a.on(b, d.focus, this);
                    a.on(c, d.blur, this);
                    if (e) CKEDITOR.event.useCapture = 0;
                    a.setCustomData("focusmanager", this);
                    a.setCustomData("focusmanager_handlers", d)
                }
            }, remove: function (a) {
                a.removeCustomData("focusmanager");
                var e = a.removeCustomData("focusmanager_handlers");
                a.removeListener("blur",
                    e.blur);
                a.removeListener("focus", e.focus)
            }
        }
    })();
    CKEDITOR.keystrokeHandler = function (a) {
        if (a.keystrokeHandler)return a.keystrokeHandler;
        this.keystrokes = {};
        this.blockedKeystrokes = {};
        this._ = {editor: a};
        return this
    };
    (function () {
        var a, e = function (b) {
            var b = b.data, d = b.getKeystroke(), e = this.keystrokes[d], g = this._.editor;
            a = g.fire("key", {keyCode: d}) === false;
            if (!a) {
                e && (a = g.execCommand(e, {from: "keystrokeHandler"}) !== false);
                a || (a = !!this.blockedKeystrokes[d])
            }
            a && b.preventDefault(true);
            return !a
        }, b = function (b) {
            if (a) {
                a = false;
                b.data.preventDefault(true)
            }
        };
        CKEDITOR.keystrokeHandler.prototype = {
            attach: function (a) {
                a.on("keydown", e, this);
                if (CKEDITOR.env.opera || CKEDITOR.env.gecko && CKEDITOR.env.mac) a.on("keypress", b, this)
            }
        }
    })();
    (function () {
        CKEDITOR.lang = {
            languages: {
                af: 1,
                ar: 1,
                bg: 1,
                bn: 1,
                bs: 1,
                ca: 1,
                cs: 1,
                cy: 1,
                da: 1,
                de: 1,
                el: 1,
                "en-au": 1,
                "en-ca": 1,
                "en-gb": 1,
                en: 1,
                eo: 1,
                es: 1,
                et: 1,
                eu: 1,
                fa: 1,
                fi: 1,
                fo: 1,
                "fr-ca": 1,
                fr: 1,
                gl: 1,
                gu: 1,
                he: 1,
                hi: 1,
                hr: 1,
                hu: 1,
                id: 1,
                is: 1,
                it: 1,
                ja: 1,
                ka: 1,
                km: 1,
                ko: 1,
                ku: 1,
                lt: 1,
                lv: 1,
                mk: 1,
                mn: 1,
                ms: 1,
                nb: 1,
                nl: 1,
                no: 1,
                pl: 1,
                "pt-br": 1,
                pt: 1,
                ro: 1,
                ru: 1,
                si: 1,
                sk: 1,
                sl: 1,
                sq: 1,
                "sr-latn": 1,
                sr: 1,
                sv: 1,
                th: 1,
                tr: 1,
                ug: 1,
                uk: 1,
                vi: 1,
                "zh-cn": 1,
                zh: 1
            }, rtl: {ar: 1, fa: 1, he: 1, ku: 1, ug: 1}, load: function (a, e, b) {
                if (!a || !CKEDITOR.lang.languages[a]) a = this.detect(e,
                    a);
                this[a] ? b(a, this[a]) : CKEDITOR.scriptLoader.load(CKEDITOR.getUrl("lang/" + a + ".js"), function () {
                    this[a].dir = this.rtl[a] ? "rtl" : "ltr";
                    b(a, this[a])
                }, this)
            }, detect: function (a, e) {
                var b = this.languages, e = e || navigator.userLanguage || navigator.language || a,
                    c = e.toLowerCase().match(/([a-z]+)(?:-([a-z]+))?/), d = c[1], c = c[2];
                b[d + "-" + c] ? d = d + "-" + c : b[d] || (d = null);
                CKEDITOR.lang.detect = d ? function () {
                    return d
                } : function (a) {
                    return a
                };
                return d || a
            }
        }
    })();
    CKEDITOR.scriptLoader = function () {
        var a = {}, e = {};
        return {
            load: function (b, c, d, h) {
                var g = typeof b == "string";
                g && (b = [b]);
                d || (d = CKEDITOR);
                var n = b.length, i = [], j = [], o = function (a) {
                    c && (g ? c.call(d, a) : c.call(d, i, j))
                };
                if (n === 0) o(true); else {
                    var q = function (a, b) {
                        (b ? i : j).push(a);
                        if (--n <= 0) {
                            h && CKEDITOR.document.getDocumentElement().removeStyle("cursor");
                            o(b)
                        }
                    }, s = function (b, c) {
                        a[b] = 1;
                        var d = e[b];
                        delete e[b];
                        for (var f = 0; f < d.length; f++)d[f](b, c)
                    }, u = function (b) {
                        if (a[b]) q(b, true); else {
                            var d = e[b] || (e[b] = []);
                            d.push(q);
                            if (!(d.length >
                                1)) {
                                var f = new CKEDITOR.dom.element("script");
                                f.setAttributes({type: "text/javascript", src: b});
                                if (c)if (CKEDITOR.env.ie && CKEDITOR.env.version < 11) f.$.onreadystatechange = function () {
                                    if (f.$.readyState == "loaded" || f.$.readyState == "complete") {
                                        f.$.onreadystatechange = null;
                                        s(b, true)
                                    }
                                }; else {
                                    f.$.onload = function () {
                                        setTimeout(function () {
                                            s(b, true)
                                        }, 0)
                                    };
                                    f.$.onerror = function () {
                                        s(b, false)
                                    }
                                }
                                f.appendTo(CKEDITOR.document.getHead())
                            }
                        }
                    };
                    h && CKEDITOR.document.getDocumentElement().setStyle("cursor", "wait");
                    for (var f = 0; f < n; f++)u(b[f])
                }
            },
            queue: function () {
                function a() {
                    var b;
                    (b = c[0]) && this.load(b.scriptUrl, b.callback, CKEDITOR, 0)
                }

                var c = [];
                return function (d, e) {
                    var g = this;
                    c.push({
                        scriptUrl: d, callback: function () {
                            e && e.apply(this, arguments);
                            c.shift();
                            a.call(g)
                        }
                    });
                    c.length == 1 && a.call(this)
                }
            }()
        }
    }();
    CKEDITOR.resourceManager = function (a, e) {
        this.basePath = a;
        this.fileName = e;
        this.registered = {};
        this.loaded = {};
        this.externals = {};
        this._ = {waitingList: {}}
    };
    CKEDITOR.resourceManager.prototype = {
        add: function (a, e) {
            if (this.registered[a])throw'[CKEDITOR.resourceManager.add] The resource name "' + a + '" is already registered.';
            var b = this.registered[a] = e || {};
            b.name = a;
            b.path = this.getPath(a);
            CKEDITOR.fire(a + CKEDITOR.tools.capitalize(this.fileName) + "Ready", b);
            return this.get(a)
        }, get: function (a) {
            return this.registered[a] || null
        }, getPath: function (a) {
            var e = this.externals[a];
            return CKEDITOR.getUrl(e && e.dir || this.basePath + a + "/")
        }, getFilePath: function (a) {
            var e = this.externals[a];
            return CKEDITOR.getUrl(this.getPath(a) + (e ? e.file : this.fileName + ".js"))
        }, addExternal: function (a, e, b) {
            for (var a = a.split(","), c = 0; c < a.length; c++) {
                var d = a[c];
                b || (e = e.replace(/[^\/]+$/, function (a) {
                    b = a;
                    return ""
                }));
                this.externals[d] = {dir: e, file: b || this.fileName + ".js"}
            }
        }, load: function (a, e, b) {
            CKEDITOR.tools.isArray(a) || (a = a ? [a] : []);
            for (var c = this.loaded, d = this.registered, h = [], g = {}, n = {}, i = 0; i < a.length; i++) {
                var j = a[i];
                if (j)if (!c[j] && !d[j]) {
                    var o = this.getFilePath(j);
                    h.push(o);
                    o in g || (g[o] = []);
                    g[o].push(j)
                } else n[j] =
                    this.get(j)
            }
            CKEDITOR.scriptLoader.load(h, function (a, d) {
                if (d.length)throw'[CKEDITOR.resourceManager.load] Resource name "' + g[d[0]].join(",") + '" was not found at "' + d[0] + '".';
                for (var h = 0; h < a.length; h++)for (var f = g[a[h]], p = 0; p < f.length; p++) {
                    var i = f[p];
                    n[i] = this.get(i);
                    c[i] = 1
                }
                e.call(b, n)
            }, this)
        }
    };
    CKEDITOR.plugins = new CKEDITOR.resourceManager("plugins/", "plugin");
    CKEDITOR.plugins.load = CKEDITOR.tools.override(CKEDITOR.plugins.load, function (a) {
        var e = {};
        return function (b, c, d) {
            var h = {}, g = function (b) {
                a.call(this, b, function (a) {
                    CKEDITOR.tools.extend(h, a);
                    var b = [], n;
                    for (n in a) {
                        var q = a[n], s = q && q.requires;
                        if (!e[n]) {
                            if (q.icons)for (var u = q.icons.split(","),
                                                 f = u.length; f--;)CKEDITOR.skin.addIcon(u[f], q.path + "icons/" + (CKEDITOR.env.hidpi && q.hidpi ? "hidpi/" : "") + u[f] + ".png");
                            e[n] = 1
                        }
                        if (s) {
                            s.split && (s = s.split(","));
                            for (q = 0; q < s.length; q++)h[s[q]] || b.push(s[q])
                        }
                    }
                    if (b.length) g.call(this,
                        b); else {
                        for (n in h) {
                            q = h[n];
                            if (q.onLoad && !q.onLoad._called) {
                                q.onLoad() === false && delete h[n];
                                q.onLoad._called = 1
                            }
                        }
                        c && c.call(d || window, h)
                    }
                }, this)
            };
            g.call(this, b)
        }
    });
    CKEDITOR.plugins.setLang = function (a, e, b) {
        var c = this.get(a), a = c.langEntries || (c.langEntries = {}), c = c.lang || (c.lang = []);
        c.split && (c = c.split(","));
        CKEDITOR.tools.indexOf(c, e) == -1 && c.push(e);
        a[e] = b
    };
    CKEDITOR.ui = function (a) {
        if (a.ui)return a.ui;
        this.items = {};
        this.instances = {};
        this.editor = a;
        this._ = {handlers: {}};
        return this
    };
    CKEDITOR.ui.prototype = {
        add: function (a, e, b) {
            b.name = a.toLowerCase();
            var c = this.items[a] = {
                type: e,
                command: b.command || null,
                args: Array.prototype.slice.call(arguments, 2)
            };
            CKEDITOR.tools.extend(c, b)
        }, get: function (a) {
            return this.instances[a]
        }, create: function (a) {
            var e = this.items[a], b = e && this._.handlers[e.type],
                c = e && e.command && this.editor.getCommand(e.command), b = b && b.create.apply(this, e.args);
            this.instances[a] = b;
            c && c.uiItems.push(b);
            if (b && !b.type) b.type = e.type;
            return b
        }, addHandler: function (a, e) {
            this._.handlers[a] =
                e
        }, space: function (a) {
            return CKEDITOR.document.getById(this.spaceId(a))
        }, spaceId: function (a) {
            return this.editor.id + "_" + a
        }
    };
    CKEDITOR.event.implementOn(CKEDITOR.ui);
    (function () {
        function a(a, c, h) {
            CKEDITOR.event.call(this);
            a = a && CKEDITOR.tools.clone(a);
            if (c !== void 0) {
                if (c instanceof CKEDITOR.dom.element) {
                    if (!h)throw Error("One of the element modes must be specified.");
                } else throw Error("Expect element of type CKEDITOR.dom.element.");
                if (CKEDITOR.env.ie && CKEDITOR.env.quirks && h == CKEDITOR.ELEMENT_MODE_INLINE)throw Error("Inline element mode is not supported on IE quirks.");
                if (!(h == CKEDITOR.ELEMENT_MODE_INLINE ? c.is(CKEDITOR.dtd.$editable) || c.is("textarea") : h == CKEDITOR.ELEMENT_MODE_REPLACE ?
                        !c.is(CKEDITOR.dtd.$nonBodyContent) : 1))throw Error('The specified element mode is not supported on element: "' + c.getName() + '".');
                this.element = c;
                this.elementMode = h;
                this.name = this.elementMode != CKEDITOR.ELEMENT_MODE_APPENDTO && (c.getId() || c.getNameAtt())
            } else this.elementMode = CKEDITOR.ELEMENT_MODE_NONE;
            this._ = {};
            this.commands = {};
            this.templates = {};
            this.name = this.name || e();
            this.id = CKEDITOR.tools.getNextId();
            this.status = "unloaded";
            this.config = CKEDITOR.tools.prototypedCopy(CKEDITOR.config);
            this.ui = new CKEDITOR.ui(this);
            this.focusManager = new CKEDITOR.focusManager(this);
            this.keystrokeHandler = new CKEDITOR.keystrokeHandler(this);
            this.on("readOnly", b);
            this.on("selectionChange", function (a) {
                d(this, a.data.path)
            });
            this.on("activeFilterChange", function () {
                d(this, this.elementPath(), true)
            });
            this.on("mode", b);
            this.on("instanceReady", function () {
                this.config.startupFocus && this.focus()
            });
            CKEDITOR.fire("instanceCreated", null, this);
            CKEDITOR.add(this);
            CKEDITOR.tools.setTimeout(function () {
                g(this, a)
            }, 0, this)
        }

        function e() {
            do var a = "editor" +
                ++s; while (CKEDITOR.instances[a]);
            return a
        }

        function b() {
            var a = this.commands, b;
            for (b in a)c(this, a[b])
        }

        function c(a, b) {
            b[b.startDisabled ? "disable" : a.readOnly && !b.readOnly ? "disable" : b.modes[a.mode] ? "enable" : "disable"]()
        }

        function d(a, b, c) {
            if (b) {
                var d, e, l = a.commands;
                for (e in l) {
                    d = l[e];
                    (c || d.contextSensitive) && d.refresh(a, b)
                }
            }
        }

        function h(a) {
            var b = a.config.customConfig;
            if (!b)return false;
            var b = CKEDITOR.getUrl(b), c = u[b] || (u[b] = {});
            if (c.fn) {
                c.fn.call(a, a.config);
                (CKEDITOR.getUrl(a.config.customConfig) == b ||
                !h(a)) && a.fireOnce("customConfigLoaded")
            } else CKEDITOR.scriptLoader.queue(b, function () {
                c.fn = CKEDITOR.editorConfig ? CKEDITOR.editorConfig : function () {
                };
                h(a)
            });
            return true
        }

        function g(a, b) {
            a.on("customConfigLoaded", function () {
                if (b) {
                    if (b.on)for (var c in b.on)a.on(c, b.on[c]);
                    CKEDITOR.tools.extend(a.config, b, true);
                    delete a.config.on
                }
                c = a.config;
                a.readOnly = !(!c.readOnly && !(a.elementMode == CKEDITOR.ELEMENT_MODE_INLINE ? a.element.is("textarea") ? a.element.hasAttribute("disabled") : a.element.isReadOnly() : a.elementMode ==
                    CKEDITOR.ELEMENT_MODE_REPLACE && a.element.hasAttribute("disabled")));
                a.blockless = a.elementMode == CKEDITOR.ELEMENT_MODE_INLINE ? !(a.element.is("textarea") || CKEDITOR.dtd[a.element.getName()].p) : false;
                a.tabIndex = c.tabIndex || a.element && a.element.getAttribute("tabindex") || 0;
                a.activeEnterMode = a.enterMode = a.blockless ? CKEDITOR.ENTER_BR : c.enterMode;
                a.activeShiftEnterMode = a.shiftEnterMode = a.blockless ? CKEDITOR.ENTER_BR : c.shiftEnterMode;
                if (c.skin) CKEDITOR.skinName = c.skin;
                a.fireOnce("configLoaded");
                a.dataProcessor =
                    new CKEDITOR.htmlDataProcessor(a);
                a.filter = a.activeFilter = new CKEDITOR.filter(a);
                n(a)
            });
            if (b && b.customConfig != void 0) a.config.customConfig = b.customConfig;
            h(a) || a.fireOnce("customConfigLoaded")
        }

        function n(a) {
            CKEDITOR.skin.loadPart("editor", function () {
                i(a)
            })
        }

        function i(a) {
            CKEDITOR.lang.load(a.config.language, a.config.defaultLanguage, function (b, c) {
                var d = a.config.title;
                a.langCode = b;
                a.lang = CKEDITOR.tools.prototypedCopy(c);
                a.title = typeof d == "string" || d === false ? d : [a.lang.editor, a.name].join(", ");
                if (CKEDITOR.env.gecko &&
                    CKEDITOR.env.version < 10900 && a.lang.dir == "rtl") a.lang.dir = "ltr";
                if (!a.config.contentsLangDirection) a.config.contentsLangDirection = a.elementMode == CKEDITOR.ELEMENT_MODE_INLINE ? a.element.getDirection(1) : a.lang.dir;
                a.fire("langLoaded");
                j(a)
            })
        }

        function j(a) {
            a.getStylesSet(function (b) {
                a.once("loaded", function () {
                    a.fire("stylesSet", {styles: b})
                }, null, null, 1);
                o(a)
            })
        }

        function o(a) {
            var b = a.config, c = b.plugins, d = b.extraPlugins, e = b.removePlugins;
            if (d)var l = RegExp("(?:^|,)(?:" + d.replace(/\s*,\s*/g, "|") + ")(?=,|$)",
                "g"), c = c.replace(l, ""), c = c + ("," + d);
            if (e)var h = RegExp("(?:^|,)(?:" + e.replace(/\s*,\s*/g, "|") + ")(?=,|$)", "g"), c = c.replace(h, "");
            CKEDITOR.env.air && (c = c + ",adobeair");
            CKEDITOR.plugins.load(c.split(","), function (c) {
                var d = [], e = [], k = [];
                a.plugins = c;
                for (var l in c) {
                    var m = c[l], g = m.lang, i = null, j = m.requires, v;
                    CKEDITOR.tools.isArray(j) && (j = j.join(","));
                    if (j && (v = j.match(h)))for (; j = v.pop();)CKEDITOR.tools.setTimeout(function (a, b) {
                        throw Error('Plugin "' + a.replace(",", "") + '" cannot be removed from the plugins list, because it\'s required by "' +
                            b + '" plugin.');
                    }, 0, null, [j, l]);
                    if (g && !a.lang[l]) {
                        g.split && (g = g.split(","));
                        if (CKEDITOR.tools.indexOf(g, a.langCode) >= 0) i = a.langCode; else {
                            i = a.langCode.replace(/-.*/, "");
                            i = i != a.langCode && CKEDITOR.tools.indexOf(g, i) >= 0 ? i : CKEDITOR.tools.indexOf(g, "en") >= 0 ? "en" : g[0]
                        }
                        if (!m.langEntries || !m.langEntries[i]) k.push(CKEDITOR.getUrl(m.path + "lang/" + i + ".js")); else {
                            a.lang[l] = m.langEntries[i];
                            i = null
                        }
                    }
                    e.push(i);
                    d.push(m)
                }
                CKEDITOR.scriptLoader.load(k, function () {
                    for (var c = ["beforeInit", "init", "afterInit"], k = 0; k < c.length; k++)for (var m =
                        0; m < d.length; m++) {
                        var l = d[m];
                        k === 0 && (e[m] && l.lang && l.langEntries) && (a.lang[l.name] = l.langEntries[e[m]]);
                        if (l[c[k]]) l[c[k]](a)
                    }
                    a.fireOnce("pluginsLoaded");
                    b.keystrokes && a.setKeystroke(a.config.keystrokes);
                    for (m = 0; m < a.config.blockedKeystrokes.length; m++)a.keystrokeHandler.blockedKeystrokes[a.config.blockedKeystrokes[m]] = 1;
                    a.status = "loaded";
                    a.fireOnce("loaded");
                    CKEDITOR.fire("instanceLoaded", null, a)
                })
            })
        }

        function q() {
            var a = this.element;
            if (a && this.elementMode != CKEDITOR.ELEMENT_MODE_APPENDTO) {
                var b = this.getData();
                this.config.htmlEncodeOutput && (b = CKEDITOR.tools.htmlEncode(b));
                a.is("textarea") ? a.setValue(b) : a.setHtml(b);
                return true
            }
            return false
        }

        a.prototype = CKEDITOR.editor.prototype;
        CKEDITOR.editor = a;
        var s = 0, u = {};
        CKEDITOR.tools.extend(CKEDITOR.editor.prototype, {
            addCommand: function (a, b) {
                b.name = a.toLowerCase();
                var d = new CKEDITOR.command(this, b);
                this.mode && c(this, d);
                return this.commands[a] = d
            }, _attachToForm: function () {
                var a = this, b = a.element, c = new CKEDITOR.dom.element(b.$.form);
                if (b.is("textarea") && c) {
                    var d = function (c) {
                        a.updateElement();
                        a._.required && (!b.getValue() && a.fire("required") === false) && c.data.preventDefault()
                    };
                    c.on("submit", d);
                    if (c.$.submit && c.$.submit.call && c.$.submit.apply) c.$.submit = CKEDITOR.tools.override(c.$.submit, function (a) {
                        return function () {
                            d();
                            a.apply ? a.apply(this) : a()
                        }
                    });
                    a.on("destroy", function () {
                        c.removeListener("submit", d)
                    })
                }
            }, destroy: function (a) {
                this.fire("beforeDestroy");
                !a && q.call(this);
                this.editable(null);
                this.status = "destroyed";
                this.fire("destroy");
                this.removeAllListeners();
                CKEDITOR.remove(this);
                CKEDITOR.fire("instanceDestroyed",
                    null, this)
            }, elementPath: function (a) {
                return (a = a || this.getSelection().getStartElement()) ? new CKEDITOR.dom.elementPath(a, this.editable()) : null
            }, createRange: function () {
                var a = this.editable();
                return a ? new CKEDITOR.dom.range(a) : null
            }, execCommand: function (a, b) {
                var c = this.getCommand(a), d = {name: a, commandData: b, command: c};
                if (c && c.state != CKEDITOR.TRISTATE_DISABLED && this.fire("beforeCommandExec", d) !== true) {
                    d.returnValue = c.exec(d.commandData);
                    if (!c.async && this.fire("afterCommandExec", d) !== true)return d.returnValue
                }
                return false
            },
            getCommand: function (a) {
                return this.commands[a]
            }, getData: function (a) {
                !a && this.fire("beforeGetData");
                var b = this._.data;
                if (typeof b != "string") b = (b = this.element) && this.elementMode == CKEDITOR.ELEMENT_MODE_REPLACE ? b.is("textarea") ? b.getValue() : b.getHtml() : "";
                b = {dataValue: b};
                !a && this.fire("getData", b);
                return b.dataValue
            }, getSnapshot: function () {
                var a = this.fire("getSnapshot");
                if (typeof a != "string") {
                    var b = this.element;
                    b && this.elementMode == CKEDITOR.ELEMENT_MODE_REPLACE && (a = b.is("textarea") ? b.getValue() : b.getHtml())
                }
                return a
            },
            loadSnapshot: function (a) {
                this.fire("loadSnapshot", a)
            }, setData: function (a, b, c) {
                if (b) this.on("dataReady", function (a) {
                    a.removeListener();
                    b.call(a.editor)
                });
                a = {dataValue: a};
                !c && this.fire("setData", a);
                this._.data = a.dataValue;
                !c && this.fire("afterSetData", a)
            }, setReadOnly: function (a) {
                a = a == void 0 || a;
                if (this.readOnly != a) {
                    this.readOnly = a;
                    this.keystrokeHandler.blockedKeystrokes[8] = +a;
                    this.editable().setReadOnly(a);
                    this.fire("readOnly")
                }
            }, insertHtml: function (a, b) {
                this.fire("insertHtml", {dataValue: a, mode: b})
            },
            insertText: function (a) {
                this.fire("insertText", a)
            }, insertElement: function (a) {
                this.fire("insertElement", a)
            }, focus: function () {
                this.fire("beforeFocus")
            }, checkDirty: function () {
                return this.status == "ready" && this._.previousValue !== this.getSnapshot()
            }, resetDirty: function () {
                this._.previousValue = this.getSnapshot()
            }, updateElement: function () {
                return q.call(this)
            }, setKeystroke: function () {
                for (var a = this.keystrokeHandler.keystrokes,
                         b = CKEDITOR.tools.isArray(arguments[0]) ? arguments[0] : [[].slice.call(arguments, 0)], c,
                         d, e = b.length; e--;) {
                    c = b[e];
                    d = 0;
                    if (CKEDITOR.tools.isArray(c)) {
                        d = c[1];
                        c = c[0]
                    }
                    d ? a[c] = d : delete a[c]
                }
            }, addFeature: function (a) {
                return this.filter.addFeature(a)
            }, setActiveFilter: function (a) {
                if (!a) a = this.filter;
                if (this.activeFilter !== a) {
                    this.activeFilter = a;
                    this.fire("activeFilterChange");
                    a === this.filter ? this.setActiveEnterMode(null, null) : this.setActiveEnterMode(a.getAllowedEnterMode(this.enterMode), a.getAllowedEnterMode(this.shiftEnterMode, true))
                }
            }, setActiveEnterMode: function (a, b) {
                a = a ? this.blockless ? CKEDITOR.ENTER_BR :
                    a : this.enterMode;
                b = b ? this.blockless ? CKEDITOR.ENTER_BR : b : this.shiftEnterMode;
                if (this.activeEnterMode != a || this.activeShiftEnterMode != b) {
                    this.activeEnterMode = a;
                    this.activeShiftEnterMode = b;
                    this.fire("activeEnterModeChange")
                }
            }
        })
    })();
    CKEDITOR.ELEMENT_MODE_NONE = 0;
    CKEDITOR.ELEMENT_MODE_REPLACE = 1;
    CKEDITOR.ELEMENT_MODE_APPENDTO = 2;
    CKEDITOR.ELEMENT_MODE_INLINE = 3;
    CKEDITOR.htmlParser = function () {
        this._ = {htmlPartsRegex: RegExp("<(?:(?:\\/([^>]+)>)|(?:!--([\\S|\\s]*?)--\>)|(?:([^\\s>]+)\\s*((?:(?:\"[^\"]*\")|(?:'[^']*')|[^\"'>])*)\\/?>))", "g")}
    };
    (function () {
        var a = /([\w\-:.]+)(?:(?:\s*=\s*(?:(?:"([^"]*)")|(?:'([^']*)')|([^\s>]+)))|(?=\s|$))/g, e = {
            checked: 1,
            compact: 1,
            declare: 1,
            defer: 1,
            disabled: 1,
            ismap: 1,
            multiple: 1,
            nohref: 1,
            noresize: 1,
            noshade: 1,
            nowrap: 1,
            readonly: 1,
            selected: 1
        };
        CKEDITOR.htmlParser.prototype = {
            onTagOpen: function () {
            }, onTagClose: function () {
            }, onText: function () {
            }, onCDATA: function () {
            }, onComment: function () {
            }, parse: function (b) {
                for (var c, d, h = 0, g; c = this._.htmlPartsRegex.exec(b);) {
                    d = c.index;
                    if (d > h) {
                        h = b.substring(h, d);
                        if (g) g.push(h); else this.onText(h)
                    }
                    h =
                        this._.htmlPartsRegex.lastIndex;
                    if (d = c[1]) {
                        d = d.toLowerCase();
                        if (g && CKEDITOR.dtd.$cdata[d]) {
                            this.onCDATA(g.join(""));
                            g = null
                        }
                        if (!g) {
                            this.onTagClose(d);
                            continue
                        }
                    }
                    if (g) g.push(c[0]); else if (d = c[3]) {
                        d = d.toLowerCase();
                        if (!/="/.test(d)) {
                            var n = {}, i;
                            c = c[4];
                            var j = !!(c && c.charAt(c.length - 1) == "/");
                            if (c)for (; i = a.exec(c);) {
                                var o = i[1].toLowerCase();
                                i = i[2] || i[3] || i[4] || "";
                                n[o] = !i && e[o] ? o : CKEDITOR.tools.htmlDecodeAttr(i)
                            }
                            this.onTagOpen(d, n, j);
                            !g && CKEDITOR.dtd.$cdata[d] && (g = [])
                        }
                    } else if (d = c[2]) this.onComment(d)
                }
                if (b.length >
                    h) this.onText(b.substring(h, b.length))
            }
        }
    })();
    CKEDITOR.htmlParser.basicWriter = CKEDITOR.tools.createClass({
        $: function () {
            this._ = {output: []}
        }, proto: {
            openTag: function (a) {
                this._.output.push("<", a)
            }, openTagClose: function (a, e) {
                e ? this._.output.push(" />") : this._.output.push(">")
            }, attribute: function (a, e) {
                typeof e == "string" && (e = CKEDITOR.tools.htmlEncodeAttr(e));
                this._.output.push(" ", a, '="', e, '"')
            }, closeTag: function (a) {
                this._.output.push("</", a, ">")
            }, text: function (a) {
                this._.output.push(a)
            }, comment: function (a) {
                this._.output.push("<\!--", a, "--\>")
            }, write: function (a) {
                this._.output.push(a)
            },
            reset: function () {
                this._.output = [];
                this._.indent = false
            }, getHtml: function (a) {
                var e = this._.output.join("");
                a && this.reset();
                return e
            }
        }
    });
    "use strict";
    (function () {
        CKEDITOR.htmlParser.node = function () {
        };
        CKEDITOR.htmlParser.node.prototype = {
            remove: function () {
                var a = this.parent.children, e = CKEDITOR.tools.indexOf(a, this), b = this.previous, c = this.next;
                b && (b.next = c);
                c && (c.previous = b);
                a.splice(e, 1);
                this.parent = null
            }, replaceWith: function (a) {
                var e = this.parent.children, b = CKEDITOR.tools.indexOf(e, this), c = a.previous = this.previous,
                    d = a.next = this.next;
                c && (c.next = a);
                d && (d.previous = a);
                e[b] = a;
                a.parent = this.parent;
                this.parent = null
            }, insertAfter: function (a) {
                var e = a.parent.children,
                    b = CKEDITOR.tools.indexOf(e, a), c = a.next;
                e.splice(b + 1, 0, this);
                this.next = a.next;
                this.previous = a;
                a.next = this;
                c && (c.previous = this);
                this.parent = a.parent
            }, insertBefore: function (a) {
                var e = a.parent.children, b = CKEDITOR.tools.indexOf(e, a);
                e.splice(b, 0, this);
                this.next = a;
                (this.previous = a.previous) && (a.previous.next = this);
                a.previous = this;
                this.parent = a.parent
            }, getAscendant: function (a) {
                var e = typeof a == "function" ? a : typeof a == "string" ? function (b) {
                    return b.name == a
                } : function (b) {
                    return b.name in a
                }, b = this.parent;
                for (; b &&
                       b.type == CKEDITOR.NODE_ELEMENT;) {
                    if (e(b))return b;
                    b = b.parent
                }
                return null
            }, wrapWith: function (a) {
                this.replaceWith(a);
                a.add(this);
                return a
            }, getIndex: function () {
                return CKEDITOR.tools.indexOf(this.parent.children, this)
            }, getFilterContext: function (a) {
                return a || {}
            }
        }
    })();
    "use strict";
    CKEDITOR.htmlParser.comment = function (a) {
        this.value = a;
        this._ = {isBlockLike: false}
    };
    CKEDITOR.htmlParser.comment.prototype = CKEDITOR.tools.extend(new CKEDITOR.htmlParser.node, {
        type: CKEDITOR.NODE_COMMENT,
        filter: function (a, e) {
            var b = this.value;
            if (!(b = a.onComment(e, b, this))) {
                this.remove();
                return false
            }
            if (typeof b != "string") {
                this.replaceWith(b);
                return false
            }
            this.value = b;
            return true
        },
        writeHtml: function (a, e) {
            e && this.filter(e);
            a.comment(this.value)
        }
    });
    "use strict";
    (function () {
        CKEDITOR.htmlParser.text = function (a) {
            this.value = a;
            this._ = {isBlockLike: false}
        };
        CKEDITOR.htmlParser.text.prototype = CKEDITOR.tools.extend(new CKEDITOR.htmlParser.node, {
            type: CKEDITOR.NODE_TEXT,
            filter: function (a, e) {
                if (!(this.value = a.onText(e, this.value, this))) {
                    this.remove();
                    return false
                }
            },
            writeHtml: function (a, e) {
                e && this.filter(e);
                a.text(this.value)
            }
        })
    })();
    "use strict";
    (function () {
        CKEDITOR.htmlParser.cdata = function (a) {
            this.value = a
        };
        CKEDITOR.htmlParser.cdata.prototype = CKEDITOR.tools.extend(new CKEDITOR.htmlParser.node, {
            type: CKEDITOR.NODE_TEXT,
            filter: function () {
            },
            writeHtml: function (a) {
                a.write(this.value)
            }
        })
    })();
    "use strict";
    CKEDITOR.htmlParser.fragment = function () {
        this.children = [];
        this.parent = null;
        this._ = {isBlockLike: true, hasInlineStarted: false}
    };
    (function () {
        function a(a) {
            return a.attributes["data-cke-survive"] ? false : a.name == "a" && a.attributes.href || CKEDITOR.dtd.$removeEmpty[a.name]
        }

        var e = CKEDITOR.tools.extend({
                table: 1,
                ul: 1,
                ol: 1,
                dl: 1
            }, CKEDITOR.dtd.table, CKEDITOR.dtd.ul, CKEDITOR.dtd.ol, CKEDITOR.dtd.dl), b = {ol: 1, ul: 1},
            c = CKEDITOR.tools.extend({}, {html: 1}, CKEDITOR.dtd.html, CKEDITOR.dtd.body, CKEDITOR.dtd.head, {
                style: 1,
                script: 1
            });
        CKEDITOR.htmlParser.fragment.fromHtml = function (d, h, g) {
            function n(a) {
                var b;
                if (p.length > 0)for (var c = 0; c < p.length; c++) {
                    var d =
                        p[c], e = d.name, f = CKEDITOR.dtd[e], k = m.name && CKEDITOR.dtd[m.name];
                    if ((!k || k[e]) && (!a || !f || f[a] || !CKEDITOR.dtd[a])) {
                        if (!b) {
                            i();
                            b = 1
                        }
                        d = d.clone();
                        d.parent = m;
                        m = d;
                        p.splice(c, 1);
                        c--
                    } else if (e == m.name) {
                        o(m, m.parent, 1);
                        c--
                    }
                }
            }

            function i() {
                for (; y.length;)o(y.shift(), m)
            }

            function j(a) {
                if (a._.isBlockLike && a.name != "pre" && a.name != "textarea") {
                    var b = a.children.length, c = a.children[b - 1], d;
                    if (c && c.type == CKEDITOR.NODE_TEXT) (d = CKEDITOR.tools.rtrim(c.value)) ? c.value = d : a.children.length = b - 1
                }
            }

            function o(b, c, d) {
                var c = c || m || f,
                    e = m;
                if (b.previous === void 0) {
                    if (q(c, b)) {
                        m = c;
                        u.onTagOpen(g, {});
                        b.returnPoint = c = m
                    }
                    j(b);
                    (!a(b) || b.children.length) && c.add(b);
                    b.name == "pre" && (l = false);
                    b.name == "textarea" && (k = false)
                }
                if (b.returnPoint) {
                    m = b.returnPoint;
                    delete b.returnPoint
                } else m = d ? c : e
            }

            function q(a, b) {
                if ((a == f || a.name == "body") && g && (!a.name || CKEDITOR.dtd[a.name][g])) {
                    var c, d;
                    return (c = b.attributes && (d = b.attributes["data-cke-real-element-type"]) ? d : b.name) && c in CKEDITOR.dtd.$inline && !(c in CKEDITOR.dtd.head) && !b.isOrphan || b.type == CKEDITOR.NODE_TEXT
                }
            }

            function s(a, b) {
                return a in CKEDITOR.dtd.$listItem || a in CKEDITOR.dtd.$tableContent ? a == b || a == "dt" && b == "dd" || a == "dd" && b == "dt" : false
            }

            var u = new CKEDITOR.htmlParser,
                f = h instanceof CKEDITOR.htmlParser.element ? h : typeof h == "string" ? new CKEDITOR.htmlParser.element(h) : new CKEDITOR.htmlParser.fragment,
                p = [], y = [], m = f, k = f.name == "textarea", l = f.name == "pre";
            u.onTagOpen = function (d, f, h, g) {
                f = new CKEDITOR.htmlParser.element(d, f);
                if (f.isUnknown && h) f.isEmpty = true;
                f.isOptionalClose = g;
                if (a(f)) p.push(f); else {
                    if (d == "pre") l =
                        true; else {
                        if (d == "br" && l) {
                            m.add(new CKEDITOR.htmlParser.text("\n"));
                            return
                        }
                        d == "textarea" && (k = true)
                    }
                    if (d == "br") y.push(f); else {
                        for (; ;) {
                            g = (h = m.name) ? CKEDITOR.dtd[h] || (m._.isBlockLike ? CKEDITOR.dtd.div : CKEDITOR.dtd.span) : c;
                            if (!f.isUnknown && !m.isUnknown && !g[d])if (m.isOptionalClose) u.onTagClose(h); else if (d in b && h in b) {
                                h = m.children;
                                (h = h[h.length - 1]) && h.name == "li" || o(h = new CKEDITOR.htmlParser.element("li"), m);
                                !f.returnPoint && (f.returnPoint = m);
                                m = h
                            } else if (d in CKEDITOR.dtd.$listItem && !s(d, h)) u.onTagOpen(d ==
                            "li" ? "ul" : "dl", {}, 0, 1); else if (h in e && !s(d, h)) {
                                !f.returnPoint && (f.returnPoint = m);
                                m = m.parent
                            } else {
                                h in CKEDITOR.dtd.$inline && p.unshift(m);
                                if (m.parent) o(m, m.parent, 1); else {
                                    f.isOrphan = 1;
                                    break
                                }
                            } else break
                        }
                        n(d);
                        i();
                        f.parent = m;
                        f.isEmpty ? o(f) : m = f
                    }
                }
            };
            u.onTagClose = function (a) {
                for (var b = p.length - 1; b >= 0; b--)if (a == p[b].name) {
                    p.splice(b, 1);
                    return
                }
                for (var c = [], d = [], e = m; e != f && e.name != a;) {
                    e._.isBlockLike || d.unshift(e);
                    c.push(e);
                    e = e.returnPoint || e.parent
                }
                if (e != f) {
                    for (b = 0; b < c.length; b++) {
                        var k = c[b];
                        o(k, k.parent)
                    }
                    m =
                        e;
                    e._.isBlockLike && i();
                    o(e, e.parent);
                    if (e == m) m = m.parent;
                    p = p.concat(d)
                }
                a == "body" && (g = false)
            };
            u.onText = function (a) {
                if ((!m._.hasInlineStarted || y.length) && !l && !k) {
                    a = CKEDITOR.tools.ltrim(a);
                    if (a.length === 0)return
                }
                var d = m.name, f = d ? CKEDITOR.dtd[d] || (m._.isBlockLike ? CKEDITOR.dtd.div : CKEDITOR.dtd.span) : c;
                if (!k && !f["#"] && d in e) {
                    u.onTagOpen(d in b ? "li" : d == "dl" ? "dd" : d == "table" ? "tr" : d == "tr" ? "td" : "");
                    u.onText(a)
                } else {
                    i();
                    n();
                    !l && !k && (a = a.replace(/[\t\r\n ]{2,}|[\t\r\n]/g, " "));
                    a = new CKEDITOR.htmlParser.text(a);
                    if (q(m, a)) this.onTagOpen(g, {}, 0, 1);
                    m.add(a)
                }
            };
            u.onCDATA = function (a) {
                m.add(new CKEDITOR.htmlParser.cdata(a))
            };
            u.onComment = function (a) {
                i();
                n();
                m.add(new CKEDITOR.htmlParser.comment(a))
            };
            u.parse(d);
            for (i(); m != f;)o(m, m.parent, 1);
            j(f);
            return f
        };
        CKEDITOR.htmlParser.fragment.prototype = {
            type: CKEDITOR.NODE_DOCUMENT_FRAGMENT, add: function (a, b) {
                isNaN(b) && (b = this.children.length);
                var c = b > 0 ? this.children[b - 1] : null;
                if (c) {
                    if (a._.isBlockLike && c.type == CKEDITOR.NODE_TEXT) {
                        c.value = CKEDITOR.tools.rtrim(c.value);
                        if (c.value.length ===
                            0) {
                            this.children.pop();
                            this.add(a);
                            return
                        }
                    }
                    c.next = a
                }
                a.previous = c;
                a.parent = this;
                this.children.splice(b, 0, a);
                if (!this._.hasInlineStarted) this._.hasInlineStarted = a.type == CKEDITOR.NODE_TEXT || a.type == CKEDITOR.NODE_ELEMENT && !a._.isBlockLike
            }, filter: function (a, b) {
                b = this.getFilterContext(b);
                a.onRoot(b, this);
                this.filterChildren(a, false, b)
            }, filterChildren: function (a, b, c) {
                if (this.childrenFilteredBy != a.id) {
                    c = this.getFilterContext(c);
                    if (b && !this.parent) a.onRoot(c, this);
                    this.childrenFilteredBy = a.id;
                    for (b = 0; b < this.children.length; b++)this.children[b].filter(a,
                        c) === false && b--
                }
            }, writeHtml: function (a, b) {
                b && this.filter(b);
                this.writeChildrenHtml(a)
            }, writeChildrenHtml: function (a, b, c) {
                var e = this.getFilterContext();
                if (c && !this.parent && b) b.onRoot(e, this);
                b && this.filterChildren(b, false, e);
                b = 0;
                c = this.children;
                for (e = c.length; b < e; b++)c[b].writeHtml(a)
            }, forEach: function (a, b, c) {
                if (!c && (!b || this.type == b))var e = a(this);
                if (e !== false)for (var c = this.children, i = 0; i < c.length; i++) {
                    e = c[i];
                    e.type == CKEDITOR.NODE_ELEMENT ? e.forEach(a, b) : (!b || e.type == b) && a(e)
                }
            }, getFilterContext: function (a) {
                return a ||
                    {}
            }
        }
    })();
    "use strict";
    (function () {
        function a() {
            this.rules = []
        }

        function e(b, c, d, e) {
            var g, n;
            for (g in c) {
                (n = b[g]) || (n = b[g] = new a);
                n.add(c[g], d, e)
            }
        }

        CKEDITOR.htmlParser.filter = CKEDITOR.tools.createClass({
            $: function (b) {
                this.id = CKEDITOR.tools.getNextNumber();
                this.elementNameRules = new a;
                this.attributeNameRules = new a;
                this.elementsRules = {};
                this.attributesRules = {};
                this.textRules = new a;
                this.commentRules = new a;
                this.rootRules = new a;
                b && this.addRules(b, 10)
            }, proto: {
                addRules: function (a, c) {
                    var d;
                    if (typeof c == "number") d = c; else if (c && "priority" in
                        c) d = c.priority;
                    typeof d != "number" && (d = 10);
                    typeof c != "object" && (c = {});
                    a.elementNames && this.elementNameRules.addMany(a.elementNames, d, c);
                    a.attributeNames && this.attributeNameRules.addMany(a.attributeNames, d, c);
                    a.elements && e(this.elementsRules, a.elements, d, c);
                    a.attributes && e(this.attributesRules, a.attributes, d, c);
                    a.text && this.textRules.add(a.text, d, c);
                    a.comment && this.commentRules.add(a.comment, d, c);
                    a.root && this.rootRules.add(a.root, d, c)
                }, applyTo: function (a) {
                    a.filter(this)
                }, onElementName: function (a, c) {
                    return this.elementNameRules.execOnName(a,
                        c)
                }, onAttributeName: function (a, c) {
                    return this.attributeNameRules.execOnName(a, c)
                }, onText: function (a, c) {
                    return this.textRules.exec(a, c)
                }, onComment: function (a, c, d) {
                    return this.commentRules.exec(a, c, d)
                }, onRoot: function (a, c) {
                    return this.rootRules.exec(a, c)
                }, onElement: function (a, c) {
                    for (var d = [this.elementsRules["^"], this.elementsRules[c.name], this.elementsRules.$], e,
                             g = 0; g < 3; g++)if (e = d[g]) {
                        e = e.exec(a, c, this);
                        if (e === false)return null;
                        if (e && e != c)return this.onNode(a, e);
                        if (c.parent && !c.name)break
                    }
                    return c
                },
                onNode: function (a, c) {
                    var d = c.type;
                    return d == CKEDITOR.NODE_ELEMENT ? this.onElement(a, c) : d == CKEDITOR.NODE_TEXT ? new CKEDITOR.htmlParser.text(this.onText(a, c.value)) : d == CKEDITOR.NODE_COMMENT ? new CKEDITOR.htmlParser.comment(this.onComment(a, c.value)) : null
                }, onAttribute: function (a, c, d, e) {
                    return (d = this.attributesRules[d]) ? d.exec(a, e, c, this) : e
                }
            }
        });
        CKEDITOR.htmlParser.filterRulesGroup = a;
        a.prototype = {
            add: function (a, c, d) {
                this.rules.splice(this.findIndex(c), 0, {value: a, priority: c, options: d})
            }, addMany: function (a,
                                  c, d) {
                for (var e = [this.findIndex(c), 0], g = 0, n = a.length; g < n; g++)e.push({
                    value: a[g],
                    priority: c,
                    options: d
                });
                this.rules.splice.apply(this.rules, e)
            }, findIndex: function (a) {
                for (var c = this.rules, d = c.length - 1; d >= 0 && a < c[d].priority;)d--;
                return d + 1
            }, exec: function (a, c) {
                var d = c instanceof CKEDITOR.htmlParser.node || c instanceof CKEDITOR.htmlParser.fragment,
                    e = Array.prototype.slice.call(arguments, 1), g = this.rules, n = g.length, i, j, o, q;
                for (q = 0; q < n; q++) {
                    if (d) {
                        i = c.type;
                        j = c.name
                    }
                    o = g[q];
                    if (!a.nonEditable || o.options.applyToAll) {
                        o =
                            o.value.apply(null, e);
                        if (o === false || d && o && (o.name != j || o.type != i))return o;
                        o != void 0 && (e[0] = c = o)
                    }
                }
                return c
            }, execOnName: function (a, c) {
                for (var d = 0, e = this.rules, g = e.length, n; c && d < g; d++) {
                    n = e[d];
                    if (!a.nonEditable || n.options.applyToAll) c = c.replace(n.value[0], n.value[1])
                }
                return c
            }
        }
    })();
    (function () {
        function a(a, e) {
            function f(a) {
                return a || CKEDITOR.env.needsNbspFiller ? new CKEDITOR.htmlParser.text(" ") : new CKEDITOR.htmlParser.element("br", {"data-cke-bogus": 1})
            }

            function l(a, d) {
                return function (e) {
                    if (e.type != CKEDITOR.NODE_DOCUMENT_FRAGMENT) {
                        var k = [], l = b(e), g, C;
                        if (l)for (m(l, 1) && k.push(l); l;) {
                            if (h(l) && (g = c(l)) && m(g))if ((C = c(g)) && !h(C)) k.push(g); else {
                                f(v).insertAfter(g);
                                g.remove()
                            }
                            l = l.previous
                        }
                        for (l = 0; l < k.length; l++)k[l].remove();
                        if (k = CKEDITOR.env.opera && !a || (typeof d == "function" ? d(e) !==
                                    false : d))if (!v && !CKEDITOR.env.needsBrFiller && e.type == CKEDITOR.NODE_DOCUMENT_FRAGMENT) k = false; else if (!v && !CKEDITOR.env.needsBrFiller && (document.documentMode > 7 || e.name in CKEDITOR.dtd.tr || e.name in CKEDITOR.dtd.$listItem)) k = false; else {
                            k = b(e);
                            k = !k || e.name == "form" && k.name == "input"
                        }
                        k && e.add(f(a))
                    }
                }
            }

            function m(a, b) {
                if ((!v || CKEDITOR.env.needsBrFiller) && a.type == CKEDITOR.NODE_ELEMENT && a.name == "br" && !a.attributes["data-cke-eol"])return true;
                var c;
                if (a.type == CKEDITOR.NODE_TEXT && (c = a.value.match(y))) {
                    if (c.index) {
                        (new CKEDITOR.htmlParser.text(a.value.substring(0,
                            c.index))).insertBefore(a);
                        a.value = c[0]
                    }
                    if (!CKEDITOR.env.needsBrFiller && v && (!b || a.parent.name in i))return true;
                    if (!v)if ((c = a.previous) && c.name == "br" || !c || h(c))return true
                }
                return false
            }

            var r = {elements: {}}, v = e == "html", i = CKEDITOR.tools.extend({}, t), p;
            for (p in i)"#" in k[p] || delete i[p];
            for (p in i)r.elements[p] = l(v, a.config.fillEmptyBlocks !== false);
            r.root = l(v);
            r.elements.br = function (a) {
                return function (b) {
                    if (b.parent.type != CKEDITOR.NODE_DOCUMENT_FRAGMENT) {
                        var e = b.attributes;
                        if ("data-cke-bogus" in e || "data-cke-eol" in
                            e) delete e["data-cke-bogus"]; else {
                            for (e = b.next; e && d(e);)e = e.next;
                            var k = c(b);
                            !e && h(b.parent) ? g(b.parent, f(a)) : h(e) && (k && !h(k)) && f(a).insertBefore(e)
                        }
                    }
                }
            }(v);
            return r
        }

        function e(a, b) {
            return a != CKEDITOR.ENTER_BR && b !== false ? a == CKEDITOR.ENTER_DIV ? "div" : "p" : false
        }

        function b(a) {
            for (a = a.children[a.children.length - 1]; a && d(a);)a = a.previous;
            return a
        }

        function c(a) {
            for (a = a.previous; a && d(a);)a = a.previous;
            return a
        }

        function d(a) {
            return a.type == CKEDITOR.NODE_TEXT && !CKEDITOR.tools.trim(a.value) || a.type == CKEDITOR.NODE_ELEMENT &&
                a.attributes["data-cke-bookmark"]
        }

        function h(a) {
            return a && (a.type == CKEDITOR.NODE_ELEMENT && a.name in t || a.type == CKEDITOR.NODE_DOCUMENT_FRAGMENT)
        }

        function g(a, b) {
            var c = a.children[a.children.length - 1];
            a.children.push(b);
            b.parent = a;
            if (c) {
                c.next = b;
                b.previous = c
            }
        }

        function n(a) {
            a = a.attributes;
            a.contenteditable != "false" && (a["data-cke-editable"] = a.contenteditable ? "true" : 1);
            a.contenteditable = "false"
        }

        function i(a) {
            a = a.attributes;
            switch (a["data-cke-editable"]) {
                case "true":
                    a.contenteditable = "true";
                    break;
                case "1":
                    delete a.contenteditable
            }
        }

        function j(a) {
            return a.replace(I, function (a, b, c) {
                return "<" + b + c.replace(E, function (a, b) {
                        if (!/^on/.test(b) && c.indexOf("data-cke-saved-" + b) == -1) {
                            a = a.slice(1);
                            return " data-cke-saved-" + a + " data-cke-" + CKEDITOR.rnd + "-" + a
                        }
                        return a
                    }) + ">"
            })
        }

        function o(a, b) {
            return a.replace(b, function (a, b, c) {
                a.indexOf("<textarea") === 0 && (a = b + u(c).replace(/</g, "&lt;").replace(/>/g, "&gt;") + "</textarea>");
                return "<cke:encoded>" + encodeURIComponent(a) + "</cke:encoded>"
            })
        }

        function q(a) {
            return a.replace(Q, function (a, b) {
                return decodeURIComponent(b)
            })
        }

        function s(a) {
            return a.replace(/<\!--(?!{cke_protected})[\s\S]+?--\>/g, function (a) {
                return "<\!--" + m + "{C}" + encodeURIComponent(a).replace(/--/g, "%2D%2D") + "--\>"
            })
        }

        function u(a) {
            return a.replace(/<\!--\{cke_protected\}\{C\}([\s\S]+?)--\>/g, function (a, b) {
                return decodeURIComponent(b)
            })
        }

        function f(a, b) {
            var c = b._.dataStore;
            return a.replace(/<\!--\{cke_protected\}([\s\S]+?)--\>/g, function (a, b) {
                return decodeURIComponent(b)
            }).replace(/\{cke_protected_(\d+)\}/g, function (a, b) {
                return c && c[b] || ""
            })
        }

        function p(a,
                   b) {
            for (var c = [], d = b.config.protectedSource, e = b._.dataStore || (b._.dataStore = {id: 1}),
                     f = /<\!--\{cke_temp(comment)?\}(\d*?)--\>/g,
                     d = [/<script[\s\S]*?<\/script>/gi, /<noscript[\s\S]*?<\/noscript>/gi].concat(d),
                     a = a.replace(/<\!--[\s\S]*?--\>/g, function (a) {
                         return "<\!--{cke_tempcomment}" + (c.push(a) - 1) + "--\>"
                     }), k = 0; k < d.length; k++)a = a.replace(d[k], function (a) {
                a = a.replace(f, function (a, b, d) {
                    return c[d]
                });
                return /cke_temp(comment)?/.test(a) ? a : "<\!--{cke_temp}" + (c.push(a) - 1) + "--\>"
            });
            a = a.replace(f, function (a, b, d) {
                return "<\!--" +
                    m + (b ? "{C}" : "") + encodeURIComponent(c[d]).replace(/--/g, "%2D%2D") + "--\>"
            });
            return a.replace(/(['"]).*?\1/g, function (a) {
                return a.replace(/<\!--\{cke_protected\}([\s\S]+?)--\>/g, function (a, b) {
                    e[e.id] = decodeURIComponent(b);
                    return "{cke_protected_" + e.id++ + "}"
                })
            })
        }

        CKEDITOR.htmlDataProcessor = function (b) {
            var c, d, k = this;
            this.editor = b;
            this.dataFilter = c = new CKEDITOR.htmlParser.filter;
            this.htmlFilter = d = new CKEDITOR.htmlParser.filter;
            this.writer = new CKEDITOR.htmlParser.basicWriter;
            c.addRules(x);
            c.addRules(r, {applyToAll: true});
            c.addRules(a(b, "data"), {applyToAll: true});
            d.addRules(L);
            d.addRules(A, {applyToAll: true});
            d.addRules(a(b, "html"), {applyToAll: true});
            b.on("toHtml", function (a) {
                var a = a.data, c = a.dataValue, c = p(c, b), c = o(c, M), c = j(c), c = o(c, z),
                    c = c.replace(v, "$1cke:$2"), c = c.replace(H, "<cke:$1$2></cke:$1>"),
                    c = CKEDITOR.env.opera ? c : c.replace(/(<pre\b[^>]*>)(\r\n|\n)/g, "$1$2$2"),
                    d = a.context || b.editable().getName(), f;
                if (CKEDITOR.env.ie && CKEDITOR.env.version < 9 && d == "pre") {
                    d = "div";
                    c = "<pre>" + c + "</pre>";
                    f = 1
                }
                d = b.document.createElement(d);
                d.setHtml("a" + c);
                c = d.getHtml().substr(1);
                c = c.replace(RegExp(" data-cke-" + CKEDITOR.rnd + "-", "ig"), " ");
                f && (c = c.replace(/^<pre>|<\/pre>$/gi, ""));
                c = c.replace(w, "$1$2");
                c = q(c);
                c = u(c);
                a.dataValue = CKEDITOR.htmlParser.fragment.fromHtml(c, a.context, a.fixForBody === false ? false : e(a.enterMode, b.config.autoParagraph))
            }, null, null, 5);
            b.on("toHtml", function (a) {
                a.data.filter.applyTo(a.data.dataValue, true, a.data.dontFilter, a.data.enterMode) && b.fire("dataFiltered")
            }, null, null, 6);
            b.on("toHtml", function (a) {
                a.data.dataValue.filterChildren(k.dataFilter,
                    true)
            }, null, null, 10);
            b.on("toHtml", function (a) {
                var a = a.data, b = a.dataValue, c = new CKEDITOR.htmlParser.basicWriter;
                b.writeChildrenHtml(c);
                b = c.getHtml(true);
                a.dataValue = s(b)
            }, null, null, 15);
            b.on("toDataFormat", function (a) {
                var c = a.data.dataValue;
                a.data.enterMode != CKEDITOR.ENTER_BR && (c = c.replace(/^<br *\/?>/i, ""));
                a.data.dataValue = CKEDITOR.htmlParser.fragment.fromHtml(c, a.data.context, e(a.data.enterMode, b.config.autoParagraph))
            }, null, null, 5);
            b.on("toDataFormat", function (a) {
                a.data.dataValue.filterChildren(k.htmlFilter,
                    true)
            }, null, null, 10);
            b.on("toDataFormat", function (a) {
                a.data.filter.applyTo(a.data.dataValue, false, true)
            }, null, null, 11);
            b.on("toDataFormat", function (a) {
                var c = a.data.dataValue, d = k.writer;
                d.reset();
                c.writeChildrenHtml(d);
                c = d.getHtml(true);
                c = u(c);
                c = f(c, b);
                a.data.dataValue = c
            }, null, null, 15)
        };
        CKEDITOR.htmlDataProcessor.prototype = {
            toHtml: function (a, b, c, d) {
                var e = this.editor, f, k, l;
                if (b && typeof b == "object") {
                    f = b.context;
                    c = b.fixForBody;
                    d = b.dontFilter;
                    k = b.filter;
                    l = b.enterMode
                } else f = b;
                !f && f !== null && (f = e.editable().getName());
                return e.fire("toHtml", {
                    dataValue: a,
                    context: f,
                    fixForBody: c,
                    dontFilter: d,
                    filter: k || e.filter,
                    enterMode: l || e.enterMode
                }).dataValue
            }, toDataFormat: function (a, b) {
                var c, d, e;
                if (b) {
                    c = b.context;
                    d = b.filter;
                    e = b.enterMode
                }
                !c && c !== null && (c = this.editor.editable().getName());
                return this.editor.fire("toDataFormat", {
                    dataValue: a,
                    filter: d || this.editor.filter,
                    context: c,
                    enterMode: e || this.editor.enterMode
                }).dataValue
            }
        };
        var y = /(?:&nbsp;|\xa0)$/, m = "{cke_protected}", k = CKEDITOR.dtd,
            l = ["caption", "colgroup", "col", "thead", "tfoot",
                "tbody"], t = CKEDITOR.tools.extend({}, k.$blockLimit, k.$block),
            x = {elements: {input: n, textarea: n}},
            r = {attributeNames: [[/^on/, "data-cke-pa-on"], [/^data-cke-expando$/, ""]]}, L = {
                elements: {
                    embed: function (a) {
                        var b = a.parent;
                        if (b && b.name == "object") {
                            var c = b.attributes.width, b = b.attributes.height;
                            if (c) a.attributes.width = c;
                            if (b) a.attributes.height = b
                        }
                    }, a: function (a) {
                        if (!a.children.length && !a.attributes.name && !a.attributes["data-cke-saved-name"])return false
                    }
                }
            }, A = {
                elementNames: [[/^cke:/, ""], [/^\?xml:namespace$/, ""]],
                attributeNames: [[/^data-cke-(saved|pa)-/, ""], [/^data-cke-.*/, ""], ["hidefocus", ""]], elements: {
                    $: function (a) {
                        var b = a.attributes;
                        if (b) {
                            if (b["data-cke-temp"])return false;
                            for (var c = ["name", "href", "src"], d, e = 0; e < c.length; e++) {
                                d = "data-cke-saved-" + c[e];
                                d in b && delete b[c[e]]
                            }
                        }
                        return a
                    }, table: function (a) {
                        a.children.slice(0).sort(function (a, b) {
                            var c, d;
                            if (a.type == CKEDITOR.NODE_ELEMENT && b.type == a.type) {
                                c = CKEDITOR.tools.indexOf(l, a.name);
                                d = CKEDITOR.tools.indexOf(l, b.name)
                            }
                            if (!(c > -1 && d > -1 && c != d)) {
                                c = a.parent ? a.getIndex() :
                                    -1;
                                d = b.parent ? b.getIndex() : -1
                            }
                            return c > d ? 1 : -1
                        })
                    }, param: function (a) {
                        a.children = [];
                        a.isEmpty = true;
                        return a
                    }, span: function (a) {
                        a.attributes["class"] == "Apple-style-span" && delete a.name
                    }, html: function (a) {
                        delete a.attributes.contenteditable;
                        delete a.attributes["class"]
                    }, body: function (a) {
                        delete a.attributes.spellcheck;
                        delete a.attributes.contenteditable
                    }, style: function (a) {
                        var b = a.children[0];
                        if (b && b.value) b.value = CKEDITOR.tools.trim(b.value);
                        if (!a.attributes.type) a.attributes.type = "text/css"
                    }, title: function (a) {
                        var b =
                            a.children[0];
                        !b && g(a, b = new CKEDITOR.htmlParser.text);
                        b.value = a.attributes["data-cke-title"] || ""
                    }, input: i, textarea: i
                }, attributes: {
                    "class": function (a) {
                        return CKEDITOR.tools.ltrim(a.replace(/(?:^|\s+)cke_[^\s]*/g, "")) || false
                    }
                }
            };
        if (CKEDITOR.env.ie) A.attributes.style = function (a) {
            return a.replace(/(^|;)([^\:]+)/g, function (a) {
                return a.toLowerCase()
            })
        };
        var I = /<(a|area|img|input|source)\b([^>]*)>/gi,
            E = /\s(on\w+|href|src|name)\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|(?:[^ "'>]+))/gi,
            z = /(?:<style(?=[ >])[^>]*>[\s\S]*?<\/style>)|(?:<(:?link|meta|base)[^>]*>)/gi,
            M = /(<textarea(?=[ >])[^>]*>)([\s\S]*?)(?:<\/textarea>)/gi, Q = /<cke:encoded>([^<]*)<\/cke:encoded>/gi,
            v = /(<\/?)((?:object|embed|param|html|body|head|title)[^>]*>)/gi,
            w = /(<\/?)cke:((?:html|body|head|title)[^>]*>)/gi, H = /<cke:(param|embed)([^>]*?)\/?>(?!\s*<\/cke:\1)/gi
    })();
    "use strict";
    CKEDITOR.htmlParser.element = function (a, e) {
        this.name = a;
        this.attributes = e || {};
        this.children = [];
        var b = a || "", c = b.match(/^cke:(.*)/);
        c && (b = c[1]);
        b = !(!CKEDITOR.dtd.$nonBodyContent[b] && !CKEDITOR.dtd.$block[b] && !CKEDITOR.dtd.$listItem[b] && !CKEDITOR.dtd.$tableContent[b] && !(CKEDITOR.dtd.$nonEditable[b] || b == "br"));
        this.isEmpty = !!CKEDITOR.dtd.$empty[a];
        this.isUnknown = !CKEDITOR.dtd[a];
        this._ = {isBlockLike: b, hasInlineStarted: this.isEmpty || !b}
    };
    CKEDITOR.htmlParser.cssStyle = function (a) {
        var e = {};
        ((a instanceof CKEDITOR.htmlParser.element ? a.attributes.style : a) || "").replace(/&quot;/g, '"').replace(/\s*([^ :;]+)\s*:\s*([^;]+)\s*(?=;|$)/g, function (a, c, d) {
            c == "font-family" && (d = d.replace(/["']/g, ""));
            e[c.toLowerCase()] = d
        });
        return {
            rules: e, populate: function (a) {
                var c = this.toString();
                if (c) a instanceof CKEDITOR.dom.element ? a.setAttribute("style", c) : a instanceof CKEDITOR.htmlParser.element ? a.attributes.style = c : a.style = c
            }, toString: function () {
                var a = [], c;
                for (c in e)e[c] && a.push(c, ":", e[c], ";");
                return a.join("")
            }
        }
    };
    (function () {
        function a(a) {
            return function (b) {
                return b.type == CKEDITOR.NODE_ELEMENT && (typeof a == "string" ? b.name == a : b.name in a)
            }
        }

        var e = function (a, b) {
            a = a[0];
            b = b[0];
            return a < b ? -1 : a > b ? 1 : 0
        }, b = CKEDITOR.htmlParser.fragment.prototype;
        CKEDITOR.htmlParser.element.prototype = CKEDITOR.tools.extend(new CKEDITOR.htmlParser.node, {
            type: CKEDITOR.NODE_ELEMENT, add: b.add, clone: function () {
                return new CKEDITOR.htmlParser.element(this.name, this.attributes)
            }, filter: function (a, b) {
                var e = this, g, n, b = e.getFilterContext(b);
                if (b.off)return true;
                if (!e.parent) a.onRoot(b, e);
                for (; ;) {
                    g = e.name;
                    if (!(n = a.onElementName(b, g))) {
                        this.remove();
                        return false
                    }
                    e.name = n;
                    if (!(e = a.onElement(b, e))) {
                        this.remove();
                        return false
                    }
                    if (e !== this) {
                        this.replaceWith(e);
                        return false
                    }
                    if (e.name == g)break;
                    if (e.type != CKEDITOR.NODE_ELEMENT) {
                        this.replaceWith(e);
                        return false
                    }
                    if (!e.name) {
                        this.replaceWithChildren();
                        return false
                    }
                }
                g = e.attributes;
                var i, j;
                for (i in g) {
                    j = i;
                    for (n = g[i]; ;)if (j = a.onAttributeName(b, i))if (j != i) {
                        delete g[i];
                        i = j
                    } else break; else {
                        delete g[i];
                        break
                    }
                    j && ((n = a.onAttribute(b,
                        e, j, n)) === false ? delete g[j] : g[j] = n)
                }
                e.isEmpty || this.filterChildren(a, false, b);
                return true
            }, filterChildren: b.filterChildren, writeHtml: function (a, b) {
                b && this.filter(b);
                var h = this.name, g = [], n = this.attributes, i, j;
                a.openTag(h, n);
                for (i in n)g.push([i, n[i]]);
                a.sortAttributes && g.sort(e);
                i = 0;
                for (j = g.length; i < j; i++) {
                    n = g[i];
                    a.attribute(n[0], n[1])
                }
                a.openTagClose(h, this.isEmpty);
                this.writeChildrenHtml(a);
                this.isEmpty || a.closeTag(h)
            }, writeChildrenHtml: b.writeChildrenHtml, replaceWithChildren: function () {
                for (var a =
                    this.children, b = a.length; b;)a[--b].insertAfter(this);
                this.remove()
            }, forEach: b.forEach, getFirst: function (b) {
                if (!b)return this.children.length ? this.children[0] : null;
                typeof b != "function" && (b = a(b));
                for (var d = 0, e = this.children.length; d < e; ++d)if (b(this.children[d]))return this.children[d];
                return null
            }, getHtml: function () {
                var a = new CKEDITOR.htmlParser.basicWriter;
                this.writeChildrenHtml(a);
                return a.getHtml()
            }, setHtml: function (a) {
                for (var a = this.children = CKEDITOR.htmlParser.fragment.fromHtml(a).children, b = 0,
                         e = a.length; b < e; ++b)a[b].parent = this
            }, getOuterHtml: function () {
                var a = new CKEDITOR.htmlParser.basicWriter;
                this.writeHtml(a);
                return a.getHtml()
            }, split: function (a) {
                for (var b = this.children.splice(a, this.children.length - a), e = this.clone(),
                         g = 0; g < b.length; ++g)b[g].parent = e;
                e.children = b;
                if (b[0]) b[0].previous = null;
                if (a > 0) this.children[a - 1].next = null;
                this.parent.add(e, this.getIndex() + 1);
                return e
            }, removeClass: function (a) {
                var b = this.attributes["class"];
                if (b) (b = CKEDITOR.tools.trim(b.replace(RegExp("(?:\\s+|^)" + a +
                    "(?:\\s+|$)"), " "))) ? this.attributes["class"] = b : delete this.attributes["class"]
            }, hasClass: function (a) {
                var b = this.attributes["class"];
                return !b ? false : RegExp("(?:^|\\s)" + a + "(?=\\s|$)").test(b)
            }, getFilterContext: function (a) {
                var b = [];
                a || (a = {off: false, nonEditable: false});
                !a.off && this.attributes["data-cke-processor"] == "off" && b.push("off", true);
                !a.nonEditable && this.attributes.contenteditable == "false" && b.push("nonEditable", true);
                if (b.length)for (var a = CKEDITOR.tools.copy(a), e = 0; e < b.length; e = e + 2)a[b[e]] = b[e +
                1];
                return a
            }
        }, true)
    })();
    (function () {
        var a = {};
        CKEDITOR.template = function (e) {
            if (a[e]) this.output = a[e]; else {
                var b = e.replace(/'/g, "\\'").replace(/{([^}]+)}/g, function (a, b) {
                    return "',data['" + b + "']==undefined?'{" + b + "}':data['" + b + "'],'"
                });
                this.output = a[e] = Function("data", "buffer", "return buffer?buffer.push('" + b + "'):['" + b + "'].join('');")
            }
        }
    })();
    delete CKEDITOR.loadFullCore;
    CKEDITOR.instances = {};
    CKEDITOR.document = new CKEDITOR.dom.document(document);
    CKEDITOR.add = function (a) {
        CKEDITOR.instances[a.name] = a;
        a.on("focus", function () {
            if (CKEDITOR.currentInstance != a) {
                CKEDITOR.currentInstance = a;
                CKEDITOR.fire("currentInstance")
            }
        });
        a.on("blur", function () {
            if (CKEDITOR.currentInstance == a) {
                CKEDITOR.currentInstance = null;
                CKEDITOR.fire("currentInstance")
            }
        });
        CKEDITOR.fire("instance", null, a)
    };
    CKEDITOR.remove = function (a) {
        delete CKEDITOR.instances[a.name]
    };
    (function () {
        var a = {};
        CKEDITOR.addTemplate = function (e, b) {
            var c = a[e];
            if (c)return c;
            c = {name: e, source: b};
            CKEDITOR.fire("template", c);
            return a[e] = new CKEDITOR.template(c.source)
        };
        CKEDITOR.getTemplate = function (e) {
            return a[e]
        }
    })();
    (function () {
        var a = [];
        CKEDITOR.addCss = function (e) {
            a.push(e)
        };
        CKEDITOR.getCss = function () {
            return a.join("\n")
        }
    })();
    CKEDITOR.on("instanceDestroyed", function () {
        CKEDITOR.tools.isEmpty(this.instances) && CKEDITOR.fire("reset")
    });
    CKEDITOR.TRISTATE_ON = 1;
    CKEDITOR.TRISTATE_OFF = 2;
    CKEDITOR.TRISTATE_DISABLED = 0;
    (function () {
        CKEDITOR.inline = function (a, e) {
            if (!CKEDITOR.env.isCompatible)return null;
            a = CKEDITOR.dom.element.get(a);
            if (a.getEditor())throw'The editor instance "' + a.getEditor().name + '" is already attached to the provided element.';
            var b = new CKEDITOR.editor(e, a, CKEDITOR.ELEMENT_MODE_INLINE), c = a.is("textarea") ? a : null;
            if (c) {
                b.setData(c.getValue(), null, true);
                a = CKEDITOR.dom.element.createFromHtml('<div contenteditable="' + !!b.readOnly + '" class="cke_textarea_inline">' + c.getValue() + "</div>", CKEDITOR.document);
                a.insertAfter(c);
                c.hide();
                c.$.form && b._attachToForm()
            } else b.setData(a.getHtml(), null, true);
            b.on("loaded", function () {
                b.fire("uiReady");
                b.editable(a);
                b.container = a;
                b.setData(b.getData(1));
                b.resetDirty();
                b.fire("contentDom");
                b.mode = "wysiwyg";
                b.fire("mode");
                b.status = "ready";
                b.fireOnce("instanceReady");
                CKEDITOR.fire("instanceReady", null, b)
            }, null, null, 1E4);
            b.on("destroy", function () {
                if (c) {
                    b.container.clearCustomData();
                    b.container.remove();
                    c.show()
                }
                b.element.clearCustomData();
                delete b.element
            });
            return b
        };
        CKEDITOR.inlineAll = function () {
            var a, e, b;
            for (b in CKEDITOR.dtd.$editable)for (var c = CKEDITOR.document.getElementsByTag(b), d = 0,
                                                      h = c.count(); d < h; d++) {
                a = c.getItem(d);
                if (a.getAttribute("contenteditable") == "true") {
                    e = {element: a, config: {}};
                    CKEDITOR.fire("inline", e) !== false && CKEDITOR.inline(a, e.config)
                }
            }
        };
        CKEDITOR.domReady(function () {
            !CKEDITOR.disableAutoInline && CKEDITOR.inlineAll()
        })
    })();
    CKEDITOR.replaceClass = "ckeditor";
    (function () {
        function a(a, c, g, n) {
            if (!CKEDITOR.env.isCompatible)return null;
            a = CKEDITOR.dom.element.get(a);
            if (a.getEditor())throw'The editor instance "' + a.getEditor().name + '" is already attached to the provided element.';
            var i = new CKEDITOR.editor(c, a, n);
            if (n == CKEDITOR.ELEMENT_MODE_REPLACE) {
                a.setStyle("visibility", "hidden");
                i._.required = a.hasAttribute("required");
                a.removeAttribute("required")
            }
            g && i.setData(g, null, true);
            i.on("loaded", function () {
                b(i);
                n == CKEDITOR.ELEMENT_MODE_REPLACE && (i.config.autoUpdateElement &&
                a.$.form) && i._attachToForm();
                i.setMode(i.config.startupMode, function () {
                    i.resetDirty();
                    i.status = "ready";
                    i.fireOnce("instanceReady");
                    CKEDITOR.fire("instanceReady", null, i)
                })
            });
            i.on("destroy", e);
            return i
        }

        function e() {
            var a = this.container, b = this.element;
            if (a) {
                a.clearCustomData();
                a.remove()
            }
            if (b) {
                b.clearCustomData();
                if (this.elementMode == CKEDITOR.ELEMENT_MODE_REPLACE) {
                    b.show();
                    this._.required && b.setAttribute("required", "required")
                }
                delete this.element
            }
        }

        function b(a) {
            var b = a.name, e = a.element, n = a.elementMode,
                i = a.fire("uiSpace", {space: "top", html: ""}).html,
                j = a.fire("uiSpace", {space: "bottom", html: ""}).html;
            c || (c = CKEDITOR.addTemplate("maincontainer", '<{outerEl} id="cke_{name}" class="{id} cke cke_reset cke_chrome cke_editor_{name} cke_{langDir} ' + CKEDITOR.env.cssClass + '"  dir="{langDir}" lang="{langCode}" role="application" aria-labelledby="cke_{name}_arialbl"><span id="cke_{name}_arialbl" class="cke_voice_label">{voiceLabel}</span><{outerEl} class="cke_inner cke_reset" role="presentation">{topHtml}<{outerEl} id="{contentId}" class="cke_contents cke_reset" role="presentation"></{outerEl}>{bottomHtml}</{outerEl}></{outerEl}>'));
            b = CKEDITOR.dom.element.createFromHtml(c.output({
                id: a.id,
                name: b,
                langDir: a.lang.dir,
                langCode: a.langCode,
                voiceLabel: [a.lang.editor, a.name].join(", "),
                topHtml: i ? '<span id="' + a.ui.spaceId("top") + '" class="cke_top cke_reset_all" role="presentation" style="height:auto">' + i + "</span>" : "",
                contentId: a.ui.spaceId("contents"),
                bottomHtml: j ? '<span id="' + a.ui.spaceId("bottom") + '" class="cke_bottom cke_reset_all" role="presentation">' + j + "</span>" : "",
                outerEl: CKEDITOR.env.ie ? "span" : "div"
            }));
            if (n == CKEDITOR.ELEMENT_MODE_REPLACE) {
                e.hide();
                b.insertAfter(e)
            } else e.append(b);
            a.container = b;
            i && a.ui.space("top").unselectable();
            j && a.ui.space("bottom").unselectable();
            e = a.config.width;
            n = a.config.height;
            e && b.setStyle("width", CKEDITOR.tools.cssLength(e));
            n && a.ui.space("contents").setStyle("height", CKEDITOR.tools.cssLength(n));
            b.disableContextMenu();
            CKEDITOR.env.webkit && b.on("focus", function () {
                a.focus()
            });
            a.fireOnce("uiReady")
        }

        CKEDITOR.replace = function (b, c) {
            return a(b, c, null, CKEDITOR.ELEMENT_MODE_REPLACE)
        };
        CKEDITOR.appendTo = function (b, c, e) {
            return a(b,
                c, e, CKEDITOR.ELEMENT_MODE_APPENDTO)
        };
        CKEDITOR.replaceAll = function () {
            for (var a = document.getElementsByTagName("textarea"), b = 0; b < a.length; b++) {
                var c = null, e = a[b];
                if (e.name || e.id) {
                    if (typeof arguments[0] == "string") {
                        if (!RegExp("(?:^|\\s)" + arguments[0] + "(?:$|\\s)").test(e.className))continue
                    } else if (typeof arguments[0] == "function") {
                        c = {};
                        if (arguments[0](e, c) === false)continue
                    }
                    this.replace(e, c)
                }
            }
        };
        CKEDITOR.editor.prototype.addMode = function (a, b) {
            (this._.modes || (this._.modes = {}))[a] = b
        };
        CKEDITOR.editor.prototype.setMode =
            function (a, b) {
                var c = this, e = this._.modes;
                if (!(a == c.mode || !e || !e[a])) {
                    c.fire("beforeSetMode", a);
                    if (c.mode) {
                        var i = c.checkDirty();
                        c._.previousMode = c.mode;
                        c.fire("beforeModeUnload");
                        c.editable(0);
                        c.ui.space("contents").setHtml("");
                        c.mode = ""
                    }
                    this._.modes[a](function () {
                        c.mode = a;
                        i !== void 0 && !i && c.resetDirty();
                        setTimeout(function () {
                            c.fire("mode");
                            b && b.call(c)
                        }, 0)
                    })
                }
            };
        CKEDITOR.editor.prototype.resize = function (a, b, c, e) {
            var i = this.container, j = this.ui.space("contents"),
                o = CKEDITOR.env.webkit && this.document && this.document.getWindow().$.frameElement,
                e = e ? i.getChild(1) : i;
            e.setSize("width", a, true);
            o && (o.style.width = "1%");
            j.setStyle("height", Math.max(b - (c ? 0 : (e.$.offsetHeight || 0) - (j.$.clientHeight || 0)), 0) + "px");
            o && (o.style.width = "100%");
            this.fire("resize")
        };
        CKEDITOR.editor.prototype.getResizable = function (a) {
            return a ? this.ui.space("contents") : this.container
        };
        var c;
        CKEDITOR.domReady(function () {
            CKEDITOR.replaceClass && CKEDITOR.replaceAll(CKEDITOR.replaceClass)
        })
    })();
    CKEDITOR.config.startupMode = "wysiwyg";
    (function () {
        function a(a) {
            var b = a.editor, d = a.data.path, m = d.blockLimit, k = a.data.selection, l = k.getRanges()[0], g;
            if (CKEDITOR.env.gecko || CKEDITOR.env.ie && CKEDITOR.env.needsBrFiller)if (k = e(k, d)) {
                k.appendBogus();
                g = CKEDITOR.env.ie
            }
            if (b.config.autoParagraph !== false && b.activeEnterMode != CKEDITOR.ENTER_BR && b.editable().equals(m) && !d.block && l.collapsed && !l.getCommonAncestor().isReadOnly()) {
                d = l.clone();
                d.enlarge(CKEDITOR.ENLARGE_BLOCK_CONTENTS);
                m = new CKEDITOR.dom.walker(d);
                m.guard = function (a) {
                    return !c(a) || a.type ==
                        CKEDITOR.NODE_COMMENT || a.isReadOnly()
                };
                if (!m.checkForward() || d.checkStartOfBlock() && d.checkEndOfBlock()) {
                    b = l.fixBlock(true, b.activeEnterMode == CKEDITOR.ENTER_DIV ? "div" : "p");
                    if (!CKEDITOR.env.needsBrFiller) (b = b.getFirst(c)) && (b.type == CKEDITOR.NODE_TEXT && CKEDITOR.tools.trim(b.getText()).match(/^(?:&nbsp;|\xa0)$/)) && b.remove();
                    g = 1;
                    a.cancel()
                }
            }
            g && l.select()
        }

        function e(a, b) {
            if (a.isFake)return 0;
            var e = b.block || b.blockLimit, d = e && e.getLast(c);
            if (e && e.isBlockBoundary() && (!d || !(d.type == CKEDITOR.NODE_ELEMENT &&
                d.isBlockBoundary())) && !e.is("pre") && !e.getBogus())return e
        }

        function b(a) {
            var b = a.data.getTarget();
            if (b.is("input")) {
                b = b.getAttribute("type");
                (b == "submit" || b == "reset") && a.data.preventDefault()
            }
        }

        function c(a) {
            return o(a) && q(a)
        }

        function d(a, b) {
            return function (c) {
                var e = CKEDITOR.dom.element.get(c.data.$.toElement || c.data.$.fromElement || c.data.$.relatedTarget);
                (!e || !b.equals(e) && !b.contains(e)) && a.call(this, c)
            }
        }

        function h(a) {
            var b, e = a.getRanges()[0], d = a.root, k = {table: 1, ul: 1, ol: 1, dl: 1};
            if (e.startPath().contains(k)) {
                var a =
                    function (a) {
                        return function (e, d) {
                            d && (e.type == CKEDITOR.NODE_ELEMENT && e.is(k)) && (b = e);
                            if (!d && c(e) && (!a || !i(e)))return false
                        }
                    }, l = e.clone();
                l.collapse(1);
                l.setStartAt(d, CKEDITOR.POSITION_AFTER_START);
                d = new CKEDITOR.dom.walker(l);
                d.guard = a();
                d.checkBackward();
                if (b) {
                    l = e.clone();
                    l.collapse();
                    l.setEndAt(b, CKEDITOR.POSITION_AFTER_END);
                    d = new CKEDITOR.dom.walker(l);
                    d.guard = a(true);
                    b = false;
                    d.checkForward();
                    return b
                }
            }
            return null
        }

        function g(a) {
            a.editor.focus();
            a.editor.fire("saveSnapshot")
        }

        function n(a, b) {
            var c =
                a.editor;
            !b && c.getSelection().scrollIntoView();
            setTimeout(function () {
                c.fire("saveSnapshot")
            }, 0)
        }

        CKEDITOR.editable = CKEDITOR.tools.createClass({
            base: CKEDITOR.dom.element, $: function (a, b) {
                this.base(b.$ || b);
                this.editor = a;
                this.hasFocus = false;
                this.setup()
            }, proto: {
                focus: function () {
                    var a;
                    if (CKEDITOR.env.webkit && !this.hasFocus) {
                        a = this.editor._.previousActive || this.getDocument().getActive();
                        if (this.contains(a)) {
                            a.focus();
                            return
                        }
                    }
                    try {
                        this.$[CKEDITOR.env.ie && this.getDocument().equals(CKEDITOR.document) ? "setActive" :
                            "focus"]()
                    } catch (b) {
                        if (!CKEDITOR.env.ie)throw b;
                    }
                    if (CKEDITOR.env.safari && !this.isInline()) {
                        a = CKEDITOR.document.getActive();
                        a.equals(this.getWindow().getFrame()) || this.getWindow().focus()
                    }
                }, on: function (a, b) {
                    var c = Array.prototype.slice.call(arguments, 0);
                    if (CKEDITOR.env.ie && /^focus|blur$/.exec(a)) {
                        a = a == "focus" ? "focusin" : "focusout";
                        b = d(b, this);
                        c[0] = a;
                        c[1] = b
                    }
                    return CKEDITOR.dom.element.prototype.on.apply(this, c)
                }, attachListener: function (a, b, c, e, d, l) {
                    !this._.listeners && (this._.listeners = []);
                    var g = Array.prototype.slice.call(arguments,
                        1), g = a.on.apply(a, g);
                    this._.listeners.push(g);
                    return g
                }, clearListeners: function () {
                    var a = this._.listeners;
                    try {
                        for (; a.length;)a.pop().removeListener()
                    } catch (b) {
                    }
                }, restoreAttrs: function () {
                    var a = this._.attrChanges, b, c;
                    for (c in a)if (a.hasOwnProperty(c)) {
                        b = a[c];
                        b !== null ? this.setAttribute(c, b) : this.removeAttribute(c)
                    }
                }, attachClass: function (a) {
                    var b = this.getCustomData("classes");
                    if (!this.hasClass(a)) {
                        !b && (b = []);
                        b.push(a);
                        this.setCustomData("classes", b);
                        this.addClass(a)
                    }
                }, changeAttr: function (a, b) {
                    var c = this.getAttribute(a);
                    if (b !== c) {
                        !this._.attrChanges && (this._.attrChanges = {});
                        a in this._.attrChanges || (this._.attrChanges[a] = c);
                        this.setAttribute(a, b)
                    }
                }, insertHtml: function (a, b) {
                    g(this);
                    s(this, b || "html", a)
                }, insertText: function (a) {
                    g(this);
                    var b = this.editor,
                        c = b.getSelection().getStartElement().hasAscendant("pre", true) ? CKEDITOR.ENTER_BR : b.activeEnterMode,
                        b = c == CKEDITOR.ENTER_BR, e = CKEDITOR.tools, a = e.htmlEncode(a.replace(/\r\n/g, "\n")),
                        a = a.replace(/\t/g, "&nbsp;&nbsp; &nbsp;"), c = c == CKEDITOR.ENTER_P ? "p" : "div";
                    if (!b) {
                        var d = /\n{2}/g;
                        if (d.test(a))var l = "<" + c + ">", h = "</" + c + ">", a = l + a.replace(d, function () {
                                return h + l
                            }) + h
                    }
                    a = a.replace(/\n/g, "<br>");
                    b || (a = a.replace(RegExp("<br>(?=</" + c + ">)"), function (a) {
                        return e.repeat(a, 2)
                    }));
                    a = a.replace(/^ | $/g, "&nbsp;");
                    a = a.replace(/(>|\s) /g, function (a, b) {
                        return b + "&nbsp;"
                    }).replace(/ (?=<)/g, "&nbsp;");
                    s(this, "text", a)
                }, insertElement: function (a, b) {
                    b ? this.insertElementIntoRange(a, b) : this.insertElementIntoSelection(a)
                }, insertElementIntoRange: function (a, b) {
                    var c = this.editor, e = c.config.enterMode, d = a.getName(),
                        l = CKEDITOR.dtd.$block[d];
                    if (b.checkReadOnly())return false;
                    b.deleteContents(1);
                    b.startContainer.type == CKEDITOR.NODE_ELEMENT && b.startContainer.is({
                        tr: 1,
                        table: 1,
                        tbody: 1,
                        thead: 1,
                        tfoot: 1
                    }) && u(b);
                    var g, h;
                    if (l)for (; (g = b.getCommonAncestor(0, 1)) && (h = CKEDITOR.dtd[g.getName()]) && (!h || !h[d]);)if (g.getName() in CKEDITOR.dtd.span) b.splitElement(g); else if (b.checkStartOfBlock() && b.checkEndOfBlock()) {
                        b.setStartBefore(g);
                        b.collapse(true);
                        g.remove()
                    } else b.splitBlock(e == CKEDITOR.ENTER_DIV ? "div" : "p", c.editable());
                    b.insertNode(a);
                    return true
                }, insertElementIntoSelection: function (a) {
                    var b = this.editor, e = b.activeEnterMode, b = b.getSelection(), d = b.getRanges()[0],
                        k = a.getName(), k = CKEDITOR.dtd.$block[k];
                    g(this);
                    if (this.insertElementIntoRange(a, d)) {
                        d.moveToPosition(a, CKEDITOR.POSITION_AFTER_END);
                        if (k)if ((k = a.getNext(function (a) {
                                return c(a) && !i(a)
                            })) && k.type == CKEDITOR.NODE_ELEMENT && k.is(CKEDITOR.dtd.$block)) k.getDtd()["#"] ? d.moveToElementEditStart(k) : d.moveToElementEditEnd(a); else if (!k && e != CKEDITOR.ENTER_BR) {
                            k = d.fixBlock(true, e == CKEDITOR.ENTER_DIV ?
                                "div" : "p");
                            d.moveToElementEditStart(k)
                        }
                    }
                    b.selectRanges([d]);
                    n(this, CKEDITOR.env.opera)
                }, setData: function (a, b) {
                    b || (a = this.editor.dataProcessor.toHtml(a));
                    this.setHtml(a);
                    this.editor.fire("dataReady")
                }, getData: function (a) {
                    var b = this.getHtml();
                    a || (b = this.editor.dataProcessor.toDataFormat(b));
                    return b
                }, setReadOnly: function (a) {
                    this.setAttribute("contenteditable", !a)
                }, detach: function () {
                    this.removeClass("cke_editable");
                    var a = this.editor;
                    this._.detach();
                    delete a.document;
                    delete a.window
                }, isInline: function () {
                    return this.getDocument().equals(CKEDITOR.document)
                },
                setup: function () {
                    var a = this.editor;
                    this.attachListener(a, "beforeGetData", function () {
                        var b = this.getData();
                        this.is("textarea") || a.config.ignoreEmptyParagraph !== false && (b = b.replace(j, function (a, b) {
                            return b
                        }));
                        a.setData(b, null, 1)
                    }, this);
                    this.attachListener(a, "getSnapshot", function (a) {
                        a.data = this.getData(1)
                    }, this);
                    this.attachListener(a, "afterSetData", function () {
                        this.setData(a.getData(1))
                    }, this);
                    this.attachListener(a, "loadSnapshot", function (a) {
                        this.setData(a.data, 1)
                    }, this);
                    this.attachListener(a, "beforeFocus",
                        function () {
                            var b = a.getSelection();
                            (b = b && b.getNative()) && b.type == "Control" || this.focus()
                        }, this);
                    this.attachListener(a, "insertHtml", function (a) {
                        this.insertHtml(a.data.dataValue, a.data.mode)
                    }, this);
                    this.attachListener(a, "insertElement", function (a) {
                        this.insertElement(a.data)
                    }, this);
                    this.attachListener(a, "insertText", function (a) {
                        this.insertText(a.data)
                    }, this);
                    this.setReadOnly(a.readOnly);
                    this.attachClass("cke_editable");
                    this.attachClass(a.elementMode == CKEDITOR.ELEMENT_MODE_INLINE ? "cke_editable_inline" :
                        a.elementMode == CKEDITOR.ELEMENT_MODE_REPLACE || a.elementMode == CKEDITOR.ELEMENT_MODE_APPENDTO ? "cke_editable_themed" : "");
                    this.attachClass("cke_contents_" + a.config.contentsLangDirection);
                    a.keystrokeHandler.blockedKeystrokes[8] = +a.readOnly;
                    a.keystrokeHandler.attach(this);
                    this.on("blur", function (a) {
                        CKEDITOR.env.opera && CKEDITOR.document.getActive().equals(this.isInline() ? this : this.getWindow().getFrame()) ? a.cancel() : this.hasFocus = false
                    }, null, null, -1);
                    this.on("focus", function () {
                            this.hasFocus = true
                        }, null, null,
                        -1);
                    a.focusManager.add(this);
                    if (this.equals(CKEDITOR.document.getActive())) {
                        this.hasFocus = true;
                        a.once("contentDom", function () {
                            a.focusManager.focus()
                        })
                    }
                    this.isInline() && this.changeAttr("tabindex", a.tabIndex);
                    if (!this.is("textarea")) {
                        a.document = this.getDocument();
                        a.window = this.getWindow();
                        var e = a.document;
                        this.changeAttr("spellcheck", !a.config.disableNativeSpellChecker);
                        var d = a.config.contentsLangDirection;
                        this.getDirection(1) != d && this.changeAttr("dir", d);
                        var m = CKEDITOR.getCss();
                        if (m) {
                            d = e.getHead();
                            if (!d.getCustomData("stylesheet")) {
                                m = e.appendStyleText(m);
                                m = new CKEDITOR.dom.element(m.ownerNode || m.owningElement);
                                d.setCustomData("stylesheet", m);
                                m.data("cke-temp", 1)
                            }
                        }
                        d = e.getCustomData("stylesheet_ref") || 0;
                        e.setCustomData("stylesheet_ref", d + 1);
                        this.setCustomData("cke_includeReadonly", !a.config.disableReadonlyStyling);
                        this.attachListener(this, "click", function (a) {
                            var a = a.data, b = (new CKEDITOR.dom.elementPath(a.getTarget(), this)).contains("a");
                            b && (a.$.button != 2 && b.isReadOnly()) && a.preventDefault()
                        });
                        var k = {8: 1, 46: 1};
                        this.attachListener(a, "key", function (b) {
                            if (a.readOnly)return true;
                            var c = b.data.keyCode, e;
                            if (c in k) {
                                var b = a.getSelection(), d, m = b.getRanges()[0], g = m.startPath(), i, j, n,
                                    c = c == 8;
                                if (CKEDITOR.env.ie && CKEDITOR.env.version < 11 && (d = b.getSelectedElement()) || (d = h(b))) {
                                    a.fire("saveSnapshot");
                                    m.moveToPosition(d, CKEDITOR.POSITION_BEFORE_START);
                                    d.remove();
                                    m.select();
                                    a.fire("saveSnapshot");
                                    e = 1
                                } else if (m.collapsed)if ((i = g.block) && (n = i[c ? "getPrevious" : "getNext"](o)) && n.type == CKEDITOR.NODE_ELEMENT && n.is("table") &&
                                    m[c ? "checkStartOfBlock" : "checkEndOfBlock"]()) {
                                    a.fire("saveSnapshot");
                                    m[c ? "checkEndOfBlock" : "checkStartOfBlock"]() && i.remove();
                                    m["moveToElementEdit" + (c ? "End" : "Start")](n);
                                    m.select();
                                    a.fire("saveSnapshot");
                                    e = 1
                                } else if (g.blockLimit && g.blockLimit.is("td") && (j = g.blockLimit.getAscendant("table")) && m.checkBoundaryOfElement(j, c ? CKEDITOR.START : CKEDITOR.END) && (n = j[c ? "getPrevious" : "getNext"](o))) {
                                    a.fire("saveSnapshot");
                                    m["moveToElementEdit" + (c ? "End" : "Start")](n);
                                    m.checkStartOfBlock() && m.checkEndOfBlock() ? n.remove() :
                                        m.select();
                                    a.fire("saveSnapshot");
                                    e = 1
                                } else if ((j = g.contains(["td", "th", "caption"])) && m.checkBoundaryOfElement(j, c ? CKEDITOR.START : CKEDITOR.END)) e = 1
                            }
                            return !e
                        });
                        a.blockless && (CKEDITOR.env.ie && CKEDITOR.env.needsBrFiller) && this.attachListener(this, "keyup", function (b) {
                            if (b.data.getKeystroke() in k && !this.getFirst(c)) {
                                this.appendBogus();
                                b = a.createRange();
                                b.moveToPosition(this, CKEDITOR.POSITION_AFTER_START);
                                b.select()
                            }
                        });
                        this.attachListener(this, "dblclick", function (b) {
                            if (a.readOnly)return false;
                            b = {element: b.data.getTarget()};
                            a.fire("doubleclick", b)
                        });
                        CKEDITOR.env.ie && this.attachListener(this, "click", b);
                        !CKEDITOR.env.ie && !CKEDITOR.env.opera && this.attachListener(this, "mousedown", function (b) {
                            var c = b.data.getTarget();
                            if (c.is("img", "hr", "input", "textarea", "select")) {
                                a.getSelection().selectElement(c);
                                c.is("input", "textarea", "select") && b.data.preventDefault()
                            }
                        });
                        CKEDITOR.env.gecko && this.attachListener(this, "mouseup", function (b) {
                            if (b.data.$.button == 2) {
                                b = b.data.getTarget();
                                if (!b.getOuterHtml().replace(j, "")) {
                                    var c = a.createRange();
                                    c.moveToElementEditStart(b);
                                    c.select(true)
                                }
                            }
                        });
                        if (CKEDITOR.env.webkit) {
                            this.attachListener(this, "click", function (a) {
                                a.data.getTarget().is("input", "select") && a.data.preventDefault()
                            });
                            this.attachListener(this, "mouseup", function (a) {
                                a.data.getTarget().is("input", "textarea") && a.data.preventDefault()
                            })
                        }
                    }
                }
            }, _: {
                detach: function () {
                    this.editor.setData(this.editor.getData(), 0, 1);
                    this.clearListeners();
                    this.restoreAttrs();
                    var a;
                    if (a = this.removeCustomData("classes"))for (; a.length;)this.removeClass(a.pop());
                    a = this.getDocument();
                    var b = a.getHead();
                    if (b.getCustomData("stylesheet")) {
                        var c = a.getCustomData("stylesheet_ref");
                        if (--c) a.setCustomData("stylesheet_ref", c); else {
                            a.removeCustomData("stylesheet_ref");
                            b.removeCustomData("stylesheet").remove()
                        }
                    }
                    delete this.editor
                }
            }
        });
        CKEDITOR.editor.prototype.editable = function (a) {
            var b = this._.editable;
            if (b && a)return 0;
            if (arguments.length) b = this._.editable = a ? a instanceof CKEDITOR.editable ? a : new CKEDITOR.editable(this, a) : (b && b.detach(), null);
            return b
        };
        var i = CKEDITOR.dom.walker.bogus(),
            j = /(^|<body\b[^>]*>)\s*<(p|div|address|h\d|center|pre)[^>]*>\s*(?:<br[^>]*>|&nbsp;|\u00A0|&#160;)?\s*(:?<\/\2>)?\s*(?=$|<\/body>)/gi,
            o = CKEDITOR.dom.walker.whitespaces(true), q = CKEDITOR.dom.walker.bookmark(false, true);
        CKEDITOR.on("instanceLoaded", function (b) {
            var c = b.editor;
            c.on("insertElement", function (a) {
                a = a.data;
                if (a.type == CKEDITOR.NODE_ELEMENT && (a.is("input") || a.is("textarea"))) {
                    a.getAttribute("contentEditable") != "false" && a.data("cke-editable", a.hasAttribute("contenteditable") ? "true" : "1");
                    a.setAttribute("contentEditable", false)
                }
            });
            c.on("selectionChange", function (b) {
                if (!c.readOnly) {
                    var e = c.getSelection();
                    if (e && !e.isLocked) {
                        e = c.checkDirty();
                        c.fire("lockSnapshot");
                        a(b);
                        c.fire("unlockSnapshot");
                        !e && c.resetDirty()
                    }
                }
            })
        });
        CKEDITOR.on("instanceCreated", function (a) {
            var b = a.editor;
            b.on("mode", function () {
                var a = b.editable();
                if (a && a.isInline()) {
                    var c = b.title;
                    a.changeAttr("role", "textbox");
                    a.changeAttr("aria-label", c);
                    c && a.changeAttr("title", c);
                    if (c = this.ui.space(this.elementMode == CKEDITOR.ELEMENT_MODE_INLINE ? "top" : "contents")) {
                        var e = CKEDITOR.tools.getNextId(),
                            d = CKEDITOR.dom.element.createFromHtml('<span id="' + e + '" class="cke_voice_label">' + this.lang.common.editorHelp +
                                "</span>");
                        c.append(d);
                        a.changeAttr("aria-describedby", e)
                    }
                }
            })
        });
        CKEDITOR.addCss(".cke_editable{cursor:text}.cke_editable img,.cke_editable input,.cke_editable textarea{cursor:default}");
        var s = function () {
            function a(b) {
                return b.type == CKEDITOR.NODE_ELEMENT
            }

            function b(c, e) {
                var d, k, m, l, h = [], i = e.range.startContainer;
                d = e.range.startPath();
                for (var i = g[i.getName()], r = 0, j = c.getChildren(), n = j.count(), o = -1, q = -1, x = 0,
                         s = d.contains(g.$list); r < n; ++r) {
                    d = j.getItem(r);
                    if (a(d)) {
                        m = d.getName();
                        if (s && m in CKEDITOR.dtd.$list) h =
                            h.concat(b(d, e)); else {
                            l = !!i[m];
                            if (m == "br" && d.data("cke-eol") && (!r || r == n - 1)) {
                                x = (k = r ? h[r - 1].node : j.getItem(r + 1)) && (!a(k) || !k.is("br"));
                                k = k && a(k) && g.$block[k.getName()]
                            }
                            o == -1 && !l && (o = r);
                            l || (q = r);
                            h.push({
                                isElement: 1,
                                isLineBreak: x,
                                isBlock: d.isBlockBoundary(),
                                hasBlockSibling: k,
                                node: d,
                                name: m,
                                allowed: l
                            });
                            k = x = 0
                        }
                    } else h.push({isElement: 0, node: d, allowed: 1})
                }
                if (o > -1) h[o].firstNotAllowed = 1;
                if (q > -1) h[q].lastNotAllowed = 1;
                return h
            }

            function e(b, c) {
                var d = [], k = b.getChildren(), m = k.count(), l, h = 0, r = g[c], i = !b.is(g.$inline) ||
                    b.is("br");
                for (i && d.push(" "); h < m; h++) {
                    l = k.getItem(h);
                    a(l) && !l.is(r) ? d = d.concat(e(l, c)) : d.push(l)
                }
                i && d.push(" ");
                return d
            }

            function d(b) {
                return b && a(b) && (b.is(g.$removeEmpty) || b.is("a") && !b.isBlockBoundary())
            }

            function k(b, c, e, d) {
                var l = b.clone(), m, g;
                l.setEndAt(c, CKEDITOR.POSITION_BEFORE_END);
                if ((m = (new CKEDITOR.dom.walker(l)).next()) && a(m) && h[m.getName()] && (g = m.getPrevious()) && a(g) && !g.getParent().equals(b.startContainer) && e.contains(g) && d.contains(m) && m.isIdentical(g)) {
                    m.moveChildren(g);
                    m.remove();
                    k(b, c, e, d)
                }
            }

            function l(b, c) {
                function e(b, c) {
                    if (c.isBlock && c.isElement && !c.node.is("br") && a(b) && b.is("br")) {
                        b.remove();
                        return 1
                    }
                }

                var d = c.endContainer.getChild(c.endOffset), k = c.endContainer.getChild(c.endOffset - 1);
                d && e(d, b[b.length - 1]);
                if (k && e(k, b[0])) {
                    c.setEnd(c.endContainer, c.endOffset - 1);
                    c.collapse()
                }
            }

            var g = CKEDITOR.dtd, h = {
                p: 1,
                div: 1,
                h1: 1,
                h2: 1,
                h3: 1,
                h4: 1,
                h5: 1,
                h6: 1,
                ul: 1,
                ol: 1,
                li: 1,
                pre: 1,
                dl: 1,
                blockquote: 1
            }, r = {p: 1, div: 1, h1: 1, h2: 1, h3: 1, h4: 1, h5: 1, h6: 1}, i = CKEDITOR.tools.extend({}, g.$inline);
            delete i.br;
            return function (h,
                             j, o) {
                var q = h.editor;
                h.getDocument();
                var x = q.getSelection().getRanges()[0], s = false;
                if (j == "unfiltered_html") {
                    j = "html";
                    s = true
                }
                if (!x.checkReadOnly()) {
                    var v = (new CKEDITOR.dom.elementPath(x.startContainer, x.root)).blockLimit || x.root, j = {
                        type: j,
                        dontFilter: s,
                        editable: h,
                        editor: q,
                        range: x,
                        blockLimit: v,
                        mergeCandidates: [],
                        zombies: []
                    }, q = j.range, s = j.mergeCandidates, w, H, C, D;
                    if (j.type == "text" && q.shrink(CKEDITOR.SHRINK_ELEMENT, true, false)) {
                        w = CKEDITOR.dom.element.createFromHtml("<span>&nbsp;</span>", q.document);
                        q.insertNode(w);
                        q.setStartAfter(w)
                    }
                    H = new CKEDITOR.dom.elementPath(q.startContainer);
                    j.endPath = C = new CKEDITOR.dom.elementPath(q.endContainer);
                    if (!q.collapsed) {
                        var v = C.block || C.blockLimit, X = q.getCommonAncestor();
                        v && (!v.equals(X) && !v.contains(X) && q.checkEndOfBlock()) && j.zombies.push(v);
                        q.deleteContents()
                    }
                    for (; (D = a(q.startContainer) && q.startContainer.getChild(q.startOffset - 1)) && a(D) && D.isBlockBoundary() && H.contains(D);)q.moveToPosition(D, CKEDITOR.POSITION_BEFORE_END);
                    k(q, j.blockLimit, H, C);
                    if (w) {
                        q.setEndBefore(w);
                        q.collapse();
                        w.remove()
                    }
                    w = q.startPath();
                    if (v = w.contains(d, false, 1)) {
                        q.splitElement(v);
                        j.inlineStylesRoot = v;
                        j.inlineStylesPeak = w.lastElement
                    }
                    w = q.createBookmark();
                    (v = w.startNode.getPrevious(c)) && a(v) && d(v) && s.push(v);
                    (v = w.startNode.getNext(c)) && a(v) && d(v) && s.push(v);
                    for (v = w.startNode; (v = v.getParent()) && d(v);)s.push(v);
                    q.moveToBookmark(w);
                    if (w = o) {
                        w = j.range;
                        if (j.type == "text" && j.inlineStylesRoot) {
                            D = j.inlineStylesPeak;
                            q = D.getDocument().createText("{cke-peak}");
                            for (s = j.inlineStylesRoot.getParent(); !D.equals(s);) {
                                q = q.appendTo(D.clone());
                                D = D.getParent()
                            }
                            o = q.getOuterHtml().split("{cke-peak}").join(o)
                        }
                        D = j.blockLimit.getName();
                        if (/^\s+|\s+$/.test(o) && "span" in CKEDITOR.dtd[D])var u = '<span data-cke-marker="1">&nbsp;</span>',
                            o = u + o + u;
                        o = j.editor.dataProcessor.toHtml(o, {
                            context: null,
                            fixForBody: false,
                            dontFilter: j.dontFilter,
                            filter: j.editor.activeFilter,
                            enterMode: j.editor.activeEnterMode
                        });
                        D = w.document.createElement("body");
                        D.setHtml(o);
                        if (u) {
                            D.getFirst().remove();
                            D.getLast().remove()
                        }
                        if ((u = w.startPath().block) && !(u.getChildCount() == 1 && u.getBogus()))a:{
                            var F;
                            if (D.getChildCount() == 1 && a(F = D.getFirst()) && F.is(r)) {
                                u = F.getElementsByTag("*");
                                w = 0;
                                for (s = u.count(); w < s; w++) {
                                    q = u.getItem(w);
                                    if (!q.is(i))break a
                                }
                                F.moveChildren(F.getParent(1));
                                F.remove()
                            }
                        }
                        j.dataWrapper = D;
                        w = o
                    }
                    if (w) {
                        F = j.range;
                        var u = F.document, B, o = j.blockLimit;
                        w = 0;
                        var J;
                        D = [];
                        var G, O, s = q = 0, K, R;
                        H = F.startContainer;
                        var v = j.endPath.elements[0], S;
                        C = v.getPosition(H);
                        X = !!v.getCommonAncestor(H) && C != CKEDITOR.POSITION_IDENTICAL && !(C & CKEDITOR.POSITION_CONTAINS + CKEDITOR.POSITION_IS_CONTAINED);
                        H = b(j.dataWrapper, j);
                        for (l(H, F); w < H.length; w++) {
                            C = H[w];
                            if (B = C.isLineBreak) {
                                B = F;
                                K = o;
                                var N = void 0, U = void 0;
                                if (C.hasBlockSibling) B = 1; else {
                                    N = B.startContainer.getAscendant(g.$block, 1);
                                    if (!N || !N.is({div: 1, p: 1})) B = 0; else {
                                        U = N.getPosition(K);
                                        if (U == CKEDITOR.POSITION_IDENTICAL || U == CKEDITOR.POSITION_CONTAINS) B = 0; else {
                                            K = B.splitElement(N);
                                            B.moveToPosition(K, CKEDITOR.POSITION_AFTER_START);
                                            B = 1
                                        }
                                    }
                                }
                            }
                            if (B) s = w > 0; else {
                                B = F.startPath();
                                if (!C.isBlock && j.editor.config.autoParagraph !== false && (j.editor.activeEnterMode != CKEDITOR.ENTER_BR && j.editor.editable().equals(B.blockLimit) &&
                                    !B.block) && (O = j.editor.activeEnterMode != CKEDITOR.ENTER_BR && j.editor.config.autoParagraph !== false ? j.editor.activeEnterMode == CKEDITOR.ENTER_DIV ? "div" : "p" : false)) {
                                    O = u.createElement(O);
                                    O.appendBogus();
                                    F.insertNode(O);
                                    CKEDITOR.env.needsBrFiller && (J = O.getBogus()) && J.remove();
                                    F.moveToPosition(O, CKEDITOR.POSITION_BEFORE_END)
                                }
                                if ((B = F.startPath().block) && !B.equals(G)) {
                                    if (J = B.getBogus()) {
                                        J.remove();
                                        D.push(B)
                                    }
                                    G = B
                                }
                                C.firstNotAllowed && (q = 1);
                                if (q && C.isElement) {
                                    B = F.startContainer;
                                    for (K = null; B && !g[B.getName()][C.name];) {
                                        if (B.equals(o)) {
                                            B =
                                                null;
                                            break
                                        }
                                        K = B;
                                        B = B.getParent()
                                    }
                                    if (B) {
                                        if (K) {
                                            R = F.splitElement(K);
                                            j.zombies.push(R);
                                            j.zombies.push(K)
                                        }
                                    } else {
                                        K = o.getName();
                                        S = !w;
                                        B = w == H.length - 1;
                                        K = e(C.node, K);
                                        for (var N = [], U = K.length, Y = 0, $ = void 0, aa = 0, ba = -1; Y < U; Y++) {
                                            $ = K[Y];
                                            if ($ == " ") {
                                                if (!aa && (!S || Y)) {
                                                    N.push(new CKEDITOR.dom.text(" "));
                                                    ba = N.length
                                                }
                                                aa = 1
                                            } else {
                                                N.push($);
                                                aa = 0
                                            }
                                        }
                                        B && ba == N.length && N.pop();
                                        S = N
                                    }
                                }
                                if (S) {
                                    for (; B = S.pop();)F.insertNode(B);
                                    S = 0
                                } else F.insertNode(C.node);
                                if (C.lastNotAllowed && w < H.length - 1) {
                                    (R = X ? v : R) && F.setEndAt(R, CKEDITOR.POSITION_AFTER_START);
                                    q = 0
                                }
                                F.collapse()
                            }
                        }
                        j.dontMoveCaret = s;
                        j.bogusNeededBlocks = D
                    }
                    J = j.range;
                    var V;
                    R = j.bogusNeededBlocks;
                    for (S = J.createBookmark(); G = j.zombies.pop();)if (G.getParent()) {
                        O = J.clone();
                        O.moveToElementEditStart(G);
                        O.removeEmptyBlocksAtEnd()
                    }
                    if (R)for (; G = R.pop();)CKEDITOR.env.needsBrFiller ? G.appendBogus() : G.append(J.document.createText(" "));
                    for (; G = j.mergeCandidates.pop();)G.mergeSiblings();
                    J.moveToBookmark(S);
                    if (!j.dontMoveCaret) {
                        for (G = a(J.startContainer) && J.startContainer.getChild(J.startOffset - 1); G && a(G) && !G.is(g.$empty);) {
                            if (G.isBlockBoundary()) J.moveToPosition(G,
                                CKEDITOR.POSITION_BEFORE_END); else {
                                if (d(G) && G.getHtml().match(/(\s|&nbsp;)$/g)) {
                                    V = null;
                                    break
                                }
                                V = J.clone();
                                V.moveToPosition(G, CKEDITOR.POSITION_BEFORE_END)
                            }
                            G = G.getLast(c)
                        }
                        V && J.moveToRange(V)
                    }
                    x.select();
                    n(h)
                }
            }
        }(), u = function () {
            function a(b) {
                b = new CKEDITOR.dom.walker(b);
                b.guard = function (a, b) {
                    if (b)return false;
                    if (a.type == CKEDITOR.NODE_ELEMENT)return a.is(CKEDITOR.dtd.$tableContent)
                };
                b.evaluator = function (a) {
                    return a.type == CKEDITOR.NODE_ELEMENT
                };
                return b
            }

            function b(a, c, e) {
                c = a.getDocument().createElement(c);
                a.append(c, e);
                return c
            }

            function c(a) {
                var b = a.count(), e;
                for (b; b-- > 0;) {
                    e = a.getItem(b);
                    if (!CKEDITOR.tools.trim(e.getHtml())) {
                        e.appendBogus();
                        CKEDITOR.env.ie && (CKEDITOR.env.version < 9 && e.getChildCount()) && e.getFirst().remove()
                    }
                }
            }

            return function (e) {
                var d = e.startContainer, l = d.getAscendant("table", 1), g = false;
                c(l.getElementsByTag("td"));
                c(l.getElementsByTag("th"));
                l = e.clone();
                l.setStart(d, 0);
                l = a(l).lastBackward();
                if (!l) {
                    l = e.clone();
                    l.setEndAt(d, CKEDITOR.POSITION_BEFORE_END);
                    l = a(l).lastForward();
                    g = true
                }
                l ||
                (l = d);
                if (l.is("table")) {
                    e.setStartAt(l, CKEDITOR.POSITION_BEFORE_START);
                    e.collapse(true);
                    l.remove()
                } else {
                    l.is({tbody: 1, thead: 1, tfoot: 1}) && (l = b(l, "tr", g));
                    l.is("tr") && (l = b(l, l.getParent().is("thead") ? "th" : "td", g));
                    (d = l.getBogus()) && d.remove();
                    e.moveToPosition(l, g ? CKEDITOR.POSITION_AFTER_START : CKEDITOR.POSITION_BEFORE_END)
                }
            }
        }()
    })();
    (function () {
        function a() {
            var a = this._.fakeSelection, b;
            if (a) {
                b = this.getSelection(1);
                if (!b || !b.isHidden()) {
                    a.reset();
                    a = 0
                }
            }
            if (!a) {
                a = b || this.getSelection(1);
                if (!a || a.getType() == CKEDITOR.SELECTION_NONE)return
            }
            this.fire("selectionCheck", a);
            b = this.elementPath();
            if (!b.compare(this._.selectionPreviousPath)) {
                if (CKEDITOR.env.webkit) this._.previousActive = this.document.getActive();
                this._.selectionPreviousPath = b;
                this.fire("selectionChange", {selection: a, path: b})
            }
        }

        function e() {
            q = true;
            if (!o) {
                b.call(this);
                o = CKEDITOR.tools.setTimeout(b,
                    200, this)
            }
        }

        function b() {
            o = null;
            if (q) {
                CKEDITOR.tools.setTimeout(a, 0, this);
                q = false
            }
        }

        function c(a) {
            function b(c, e) {
                return !c || c.type == CKEDITOR.NODE_TEXT ? false : a.clone()["moveToElementEdit" + (e ? "End" : "Start")](c)
            }

            if (!(a.root instanceof CKEDITOR.editable))return false;
            var c = a.startContainer, e = a.getPreviousNode(s, null, c), d = a.getNextNode(s, null, c);
            return b(e) || b(d, 1) || !e && !d && !(c.type == CKEDITOR.NODE_ELEMENT && c.isBlockBoundary() && c.getBogus()) ? true : false
        }

        function d(a) {
            return a.getCustomData("cke-fillingChar")
        }

        function h(a, b) {
            var c = a && a.removeCustomData("cke-fillingChar");
            if (c) {
                if (b !== false) {
                    var e, d = a.getDocument().getSelection().getNative(), f = d && d.type != "None" && d.getRangeAt(0);
                    if (c.getLength() > 1 && f && f.intersectsNode(c.$)) {
                        e = [d.anchorOffset, d.focusOffset];
                        f = d.focusNode == c.$ && d.focusOffset > 0;
                        d.anchorNode == c.$ && d.anchorOffset > 0 && e[0]--;
                        f && e[1]--;
                        var h;
                        f = d;
                        if (!f.isCollapsed) {
                            h = f.getRangeAt(0);
                            h.setStart(f.anchorNode, f.anchorOffset);
                            h.setEnd(f.focusNode, f.focusOffset);
                            h = h.collapsed
                        }
                        h && e.unshift(e.pop())
                    }
                }
                c.setText(g(c.getText()));
                if (e) {
                    c = d.getRangeAt(0);
                    c.setStart(c.startContainer, e[0]);
                    c.setEnd(c.startContainer, e[1]);
                    d.removeAllRanges();
                    d.addRange(c)
                }
            }
        }

        function g(a) {
            return a.replace(/\u200B( )?/g, function (a) {
                return a[1] ? " " : ""
            })
        }

        function n(a, b, c) {
            var e = a.on("focus", function (a) {
                a.cancel()
            }, null, null, -100);
            if (CKEDITOR.env.ie)var d = a.getDocument().on("selectionchange", function (a) {
                a.cancel()
            }, null, null, -100); else {
                var f = new CKEDITOR.dom.range(a);
                f.moveToElementEditStart(a);
                var g = a.getDocument().$.createRange();
                g.setStart(f.startContainer.$,
                    f.startOffset);
                g.collapse(1);
                b.removeAllRanges();
                b.addRange(g)
            }
            c && a.focus();
            e.removeListener();
            d && d.removeListener()
        }

        function i(a) {
            var b = CKEDITOR.dom.element.createFromHtml('<div data-cke-hidden-sel="1" data-cke-temp="1" style="' + (CKEDITOR.env.ie ? "display:none" : "position:fixed;top:0;left:-1000px") + '">&nbsp;</div>', a.document);
            a.fire("lockSnapshot");
            a.editable().append(b);
            var c = a.getSelection(), e = a.createRange(), d = c.root.on("selectionchange", function (a) {
                a.cancel()
            }, null, null, 0);
            e.setStartAt(b, CKEDITOR.POSITION_AFTER_START);
            e.setEndAt(b, CKEDITOR.POSITION_BEFORE_END);
            c.selectRanges([e]);
            d.removeListener();
            a.fire("unlockSnapshot");
            a._.hiddenSelectionContainer = b
        }

        function j(a) {
            var b = {37: 1, 39: 1, 8: 1, 46: 1};
            return function (c) {
                var e = c.data.getKeystroke();
                if (b[e]) {
                    var d = a.getSelection().getRanges(), f = d[0];
                    if (d.length == 1 && f.collapsed)if ((e = f[e < 38 ? "getPreviousEditableNode" : "getNextEditableNode"]()) && e.type == CKEDITOR.NODE_ELEMENT && e.getAttribute("contenteditable") == "false") {
                        a.getSelection().fake(e);
                        c.data.preventDefault();
                        c.cancel()
                    }
                }
            }
        }

        var o, q, s = CKEDITOR.dom.walker.invisible(1), u = function () {
            function a(b) {
                return function (a) {
                    var c = a.editor.createRange();
                    c.moveToClosestEditablePosition(a.selected, b) && a.editor.getSelection().selectRanges([c]);
                    return false
                }
            }

            function b(a) {
                return function (b) {
                    var c = b.editor, e = c.createRange(), d;
                    if (!(d = e.moveToClosestEditablePosition(b.selected, a))) d = e.moveToClosestEditablePosition(b.selected, !a);
                    d && c.getSelection().selectRanges([e]);
                    c.fire("saveSnapshot");
                    b.selected.remove();
                    if (!d) {
                        e.moveToElementEditablePosition(c.editable());
                        c.getSelection().selectRanges([e])
                    }
                    c.fire("saveSnapshot");
                    return false
                }
            }

            var c = a(), e = a(1);
            return {37: c, 38: c, 39: e, 40: e, 8: b(), 46: b(1)}
        }();
        CKEDITOR.on("instanceCreated", function (b) {
            function c() {
                var a = d.getSelection();
                a && a.removeAllRanges()
            }

            var d = b.editor;
            d.on("contentDom", function () {
                var b = d.document, c = CKEDITOR.document, k = d.editable(), m = b.getBody(),
                    g = b.getDocumentElement(), i = k.isInline(), o, n;
                CKEDITOR.env.gecko && k.attachListener(k, "focus", function (a) {
                    a.removeListener();
                    if (o !== 0)if ((a = d.getSelection().getNative()) &&
                        a.isCollapsed && a.anchorNode == k.$) {
                        a = d.createRange();
                        a.moveToElementEditStart(k);
                        a.select()
                    }
                }, null, null, -2);
                k.attachListener(k, CKEDITOR.env.webkit ? "DOMFocusIn" : "focus", function () {
                    o && CKEDITOR.env.webkit && (o = d._.previousActive && d._.previousActive.equals(b.getActive()));
                    d.unlockSelection(o);
                    o = 0
                }, null, null, -1);
                k.attachListener(k, "mousedown", function () {
                    o = 0
                });
                if (CKEDITOR.env.ie || CKEDITOR.env.opera || i) {
                    var q = function () {
                        n = new CKEDITOR.dom.selection(d.getSelection());
                        n.lock()
                    };
                    f ? k.attachListener(k, "beforedeactivate",
                        q, null, null, -1) : k.attachListener(d, "selectionCheck", q, null, null, -1);
                    k.attachListener(k, CKEDITOR.env.webkit ? "DOMFocusOut" : "blur", function () {
                        d.lockSelection(n);
                        o = 1
                    }, null, null, -1);
                    k.attachListener(k, "mousedown", function () {
                        o = 0
                    })
                }
                if (CKEDITOR.env.ie && !i) {
                    var p;
                    k.attachListener(k, "mousedown", function (a) {
                        if (a.data.$.button == 2) {
                            a = d.document.getSelection();
                            if (!a || a.getType() == CKEDITOR.SELECTION_NONE) p = d.window.getScrollPosition()
                        }
                    });
                    k.attachListener(k, "mouseup", function (a) {
                        if (a.data.$.button == 2 && p) {
                            d.document.$.documentElement.scrollLeft =
                                p.x;
                            d.document.$.documentElement.scrollTop = p.y
                        }
                        p = null
                    });
                    if (b.$.compatMode != "BackCompat") {
                        if (CKEDITOR.env.ie7Compat || CKEDITOR.env.ie6Compat) g.on("mousedown", function (a) {
                            function b(a) {
                                a = a.data.$;
                                if (e) {
                                    var c = m.$.createTextRange();
                                    try {
                                        c.moveToPoint(a.x, a.y)
                                    } catch (d) {
                                    }
                                    e.setEndPoint(f.compareEndPoints("StartToStart", c) < 0 ? "EndToEnd" : "StartToStart", c);
                                    e.select()
                                }
                            }

                            function d() {
                                g.removeListener("mousemove", b);
                                c.removeListener("mouseup", d);
                                g.removeListener("mouseup", d);
                                e.select()
                            }

                            a = a.data;
                            if (a.getTarget().is("html") &&
                                a.$.y < g.$.clientHeight && a.$.x < g.$.clientWidth) {
                                var e = m.$.createTextRange();
                                try {
                                    e.moveToPoint(a.$.x, a.$.y)
                                } catch (k) {
                                }
                                var f = e.duplicate();
                                g.on("mousemove", b);
                                c.on("mouseup", d);
                                g.on("mouseup", d)
                            }
                        });
                        if (CKEDITOR.env.version > 7 && CKEDITOR.env.version < 11) {
                            g.on("mousedown", function (a) {
                                if (a.data.getTarget().is("html")) {
                                    c.on("mouseup", v);
                                    g.on("mouseup", v)
                                }
                            });
                            var v = function () {
                                c.removeListener("mouseup", v);
                                g.removeListener("mouseup", v);
                                var a = CKEDITOR.document.$.selection, d = a.createRange();
                                a.type != "None" && d.parentElement().ownerDocument ==
                                b.$ && d.select()
                            }
                        }
                    }
                }
                k.attachListener(k, "selectionchange", a, d);
                k.attachListener(k, "keyup", e, d);
                k.attachListener(k, CKEDITOR.env.webkit ? "DOMFocusIn" : "focus", function () {
                    d.forceNextSelectionCheck();
                    d.selectionChange(1)
                });
                if (i ? CKEDITOR.env.webkit || CKEDITOR.env.gecko : CKEDITOR.env.opera) {
                    var w;
                    k.attachListener(k, "mousedown", function () {
                        w = 1
                    });
                    k.attachListener(b.getDocumentElement(), "mouseup", function () {
                        w && e.call(d);
                        w = 0
                    })
                } else k.attachListener(CKEDITOR.env.ie ? k : b.getDocumentElement(), "mouseup", e, d);
                CKEDITOR.env.webkit &&
                k.attachListener(b, "keydown", function (a) {
                    switch (a.data.getKey()) {
                        case 13:
                        case 33:
                        case 34:
                        case 35:
                        case 36:
                        case 37:
                        case 39:
                        case 8:
                        case 45:
                        case 46:
                            h(k)
                    }
                }, null, null, -1);
                k.attachListener(k, "keydown", j(d), null, null, -1)
            });
            d.on("contentDomUnload", d.forceNextSelectionCheck, d);
            d.on("dataReady", function () {
                delete d._.fakeSelection;
                delete d._.hiddenSelectionContainer;
                d.selectionChange(1)
            });
            d.on("loadSnapshot", function () {
                var a = d.editable().getLast(function (a) {
                    return a.type == CKEDITOR.NODE_ELEMENT
                });
                a && a.hasAttribute("data-cke-hidden-sel") &&
                a.remove()
            }, null, null, 100);
            CKEDITOR.env.ie9Compat && d.on("beforeDestroy", c, null, null, 9);
            CKEDITOR.env.webkit && d.on("setData", c);
            d.on("contentDomUnload", function () {
                d.unlockSelection()
            });
            d.on("key", function (a) {
                if (d.mode == "wysiwyg") {
                    var b = d.getSelection();
                    if (b.isFake) {
                        var c = u[a.data.keyCode];
                        if (c)return c({editor: d, selected: b.getSelectedElement(), selection: b, keyEvent: a})
                    }
                }
            })
        });
        CKEDITOR.on("instanceReady", function (a) {
            var b = a.editor;
            if (CKEDITOR.env.webkit) {
                b.on("selectionChange", function () {
                    var a = b.editable(),
                        c = d(a);
                    c && (c.getCustomData("ready") ? h(a) : c.setCustomData("ready", 1))
                }, null, null, -1);
                b.on("beforeSetMode", function () {
                    h(b.editable())
                }, null, null, -1);
                var c, e, a = function () {
                    var a = b.editable();
                    if (a)if (a = d(a)) {
                        var f = b.document.$.defaultView.getSelection();
                        f.type == "Caret" && f.anchorNode == a.$ && (e = 1);
                        c = a.getText();
                        a.setText(g(c))
                    }
                }, f = function () {
                    var a = b.editable();
                    if (a)if (a = d(a)) {
                        a.setText(c);
                        if (e) {
                            b.document.$.defaultView.getSelection().setPosition(a.$, a.getLength());
                            e = 0
                        }
                    }
                };
                b.on("beforeUndoImage", a);
                b.on("afterUndoImage",
                    f);
                b.on("beforeGetData", a, null, null, 0);
                b.on("getData", f)
            }
        });
        CKEDITOR.editor.prototype.selectionChange = function (b) {
            (b ? a : e).call(this)
        };
        CKEDITOR.editor.prototype.getSelection = function (a) {
            if ((this._.savedSelection || this._.fakeSelection) && !a)return this._.savedSelection || this._.fakeSelection;
            return (a = this.editable()) && this.mode == "wysiwyg" ? new CKEDITOR.dom.selection(a) : null
        };
        CKEDITOR.editor.prototype.lockSelection = function (a) {
            a = a || this.getSelection(1);
            if (a.getType() != CKEDITOR.SELECTION_NONE) {
                !a.isLocked &&
                a.lock();
                this._.savedSelection = a;
                return true
            }
            return false
        };
        CKEDITOR.editor.prototype.unlockSelection = function (a) {
            var b = this._.savedSelection;
            if (b) {
                b.unlock(a);
                delete this._.savedSelection;
                return true
            }
            return false
        };
        CKEDITOR.editor.prototype.forceNextSelectionCheck = function () {
            delete this._.selectionPreviousPath
        };
        CKEDITOR.dom.document.prototype.getSelection = function () {
            return new CKEDITOR.dom.selection(this)
        };
        CKEDITOR.dom.range.prototype.select = function () {
            var a = this.root instanceof CKEDITOR.editable ?
                this.root.editor.getSelection() : new CKEDITOR.dom.selection(this.root);
            a.selectRanges([this]);
            return a
        };
        CKEDITOR.SELECTION_NONE = 1;
        CKEDITOR.SELECTION_TEXT = 2;
        CKEDITOR.SELECTION_ELEMENT = 3;
        var f = typeof window.getSelection != "function", p = 1;
        CKEDITOR.dom.selection = function (a) {
            if (a instanceof CKEDITOR.dom.selection)var b = a, a = a.root;
            var c = a instanceof CKEDITOR.dom.element;
            this.rev = b ? b.rev : p++;
            this.document = a instanceof CKEDITOR.dom.document ? a : a.getDocument();
            this.root = a = c ? a : this.document.getBody();
            this.isLocked =
                0;
            this._ = {cache: {}};
            if (b) {
                CKEDITOR.tools.extend(this._.cache, b._.cache);
                this.isFake = b.isFake;
                this.isLocked = b.isLocked;
                return this
            }
            b = f ? this.document.$.selection : this.document.getWindow().$.getSelection();
            if (CKEDITOR.env.webkit) (b.type == "None" && this.document.getActive().equals(a) || b.type == "Caret" && b.anchorNode.nodeType == CKEDITOR.NODE_DOCUMENT) && n(a, b); else if (CKEDITOR.env.gecko) b && (this.document.getActive().equals(a) && b.anchorNode && b.anchorNode.nodeType == CKEDITOR.NODE_DOCUMENT) && n(a, b, true); else if (CKEDITOR.env.ie) {
                var d;
                try {
                    d = this.document.getActive()
                } catch (e) {
                }
                if (f) b.type == "None" && (d && d.equals(this.document.getDocumentElement())) && n(a, null, true); else {
                    (b = b && b.anchorNode) && (b = new CKEDITOR.dom.node(b));
                    d && (d.equals(this.document.getDocumentElement()) && b && (a.equals(b) || a.contains(b))) && n(a, null, true)
                }
            }
            d = this.getNative();
            var g, h;
            if (d)if (d.getRangeAt) g = (h = d.rangeCount && d.getRangeAt(0)) && new CKEDITOR.dom.node(h.commonAncestorContainer); else {
                try {
                    h = d.createRange()
                } catch (j) {
                }
                g = h && CKEDITOR.dom.element.get(h.item && h.item(0) ||
                        h.parentElement())
            }
            if (!g || !(g.type == CKEDITOR.NODE_ELEMENT || g.type == CKEDITOR.NODE_TEXT) || !this.root.equals(g) && !this.root.contains(g)) {
                this._.cache.type = CKEDITOR.SELECTION_NONE;
                this._.cache.startElement = null;
                this._.cache.selectedElement = null;
                this._.cache.selectedText = "";
                this._.cache.ranges = new CKEDITOR.dom.rangeList
            }
            return this
        };
        var y = {
            img: 1,
            hr: 1,
            li: 1,
            table: 1,
            tr: 1,
            td: 1,
            th: 1,
            embed: 1,
            object: 1,
            ol: 1,
            ul: 1,
            a: 1,
            input: 1,
            form: 1,
            select: 1,
            textarea: 1,
            button: 1,
            fieldset: 1,
            thead: 1,
            tfoot: 1
        };
        CKEDITOR.dom.selection.prototype =
            {
                getNative: function () {
                    return this._.cache.nativeSel !== void 0 ? this._.cache.nativeSel : this._.cache.nativeSel = f ? this.document.$.selection : this.document.getWindow().$.getSelection()
                }, getType: f ? function () {
                var a = this._.cache;
                if (a.type)return a.type;
                var b = CKEDITOR.SELECTION_NONE;
                try {
                    var c = this.getNative(), d = c.type;
                    if (d == "Text") b = CKEDITOR.SELECTION_TEXT;
                    if (d == "Control") b = CKEDITOR.SELECTION_ELEMENT;
                    if (c.createRange().parentElement()) b = CKEDITOR.SELECTION_TEXT
                } catch (e) {
                }
                return a.type = b
            } : function () {
                var a = this._.cache;
                if (a.type)return a.type;
                var b = CKEDITOR.SELECTION_TEXT, c = this.getNative();
                if (!c || !c.rangeCount) b = CKEDITOR.SELECTION_NONE; else if (c.rangeCount == 1) {
                    var c = c.getRangeAt(0), d = c.startContainer;
                    if (d == c.endContainer && d.nodeType == 1 && c.endOffset - c.startOffset == 1 && y[d.childNodes[c.startOffset].nodeName.toLowerCase()]) b = CKEDITOR.SELECTION_ELEMENT
                }
                return a.type = b
            }, getRanges: function () {
                var a = f ? function () {
                    function a(b) {
                        return (new CKEDITOR.dom.node(b)).getIndex()
                    }

                    var b = function (b, c) {
                        b = b.duplicate();
                        b.collapse(c);
                        var d = b.parentElement();
                        if (!d.hasChildNodes())return {container: d, offset: 0};
                        for (var e = d.children, f, g, h = b.duplicate(), l = 0, m = e.length - 1, j = -1, i,
                                 o; l <= m;) {
                            j = Math.floor((l + m) / 2);
                            f = e[j];
                            h.moveToElementText(f);
                            i = h.compareEndPoints("StartToStart", b);
                            if (i > 0) m = j - 1; else if (i < 0) l = j + 1; else return {container: d, offset: a(f)}
                        }
                        if (j == -1 || j == e.length - 1 && i < 0) {
                            h.moveToElementText(d);
                            h.setEndPoint("StartToStart", b);
                            h = h.text.replace(/(\r\n|\r)/g, "\n").length;
                            e = d.childNodes;
                            if (!h) {
                                f = e[e.length - 1];
                                return f.nodeType != CKEDITOR.NODE_TEXT ?
                                    {container: d, offset: e.length} : {container: f, offset: f.nodeValue.length}
                            }
                            for (d = e.length; h > 0 && d > 0;) {
                                g = e[--d];
                                if (g.nodeType == CKEDITOR.NODE_TEXT) {
                                    o = g;
                                    h = h - g.nodeValue.length
                                }
                            }
                            return {container: o, offset: -h}
                        }
                        h.collapse(i > 0 ? true : false);
                        h.setEndPoint(i > 0 ? "StartToStart" : "EndToStart", b);
                        h = h.text.replace(/(\r\n|\r)/g, "\n").length;
                        if (!h)return {container: d, offset: a(f) + (i > 0 ? 0 : 1)};
                        for (; h > 0;)try {
                            g = f[i > 0 ? "previousSibling" : "nextSibling"];
                            if (g.nodeType == CKEDITOR.NODE_TEXT) {
                                h = h - g.nodeValue.length;
                                o = g
                            }
                            f = g
                        } catch (n) {
                            return {
                                container: d,
                                offset: a(f)
                            }
                        }
                        return {container: o, offset: i > 0 ? -h : o.nodeValue.length + h}
                    };
                    return function () {
                        var a = this.getNative(), c = a && a.createRange(), d = this.getType();
                        if (!a)return [];
                        if (d == CKEDITOR.SELECTION_TEXT) {
                            a = new CKEDITOR.dom.range(this.root);
                            d = b(c, true);
                            a.setStart(new CKEDITOR.dom.node(d.container), d.offset);
                            d = b(c);
                            a.setEnd(new CKEDITOR.dom.node(d.container), d.offset);
                            a.endContainer.getPosition(a.startContainer) & CKEDITOR.POSITION_PRECEDING && a.endOffset <= a.startContainer.getIndex() && a.collapse();
                            return [a]
                        }
                        if (d ==
                            CKEDITOR.SELECTION_ELEMENT) {
                            for (var d = [], e = 0; e < c.length; e++) {
                                for (var f = c.item(e), k = f.parentNode, g = 0,
                                         a = new CKEDITOR.dom.range(this.root); g < k.childNodes.length && k.childNodes[g] != f; g++);
                                a.setStart(new CKEDITOR.dom.node(k), g);
                                a.setEnd(new CKEDITOR.dom.node(k), g + 1);
                                d.push(a)
                            }
                            return d
                        }
                        return []
                    }
                }() : function () {
                    var a = [], b, c = this.getNative();
                    if (!c)return a;
                    for (var d = 0; d < c.rangeCount; d++) {
                        var e = c.getRangeAt(d);
                        b = new CKEDITOR.dom.range(this.root);
                        b.setStart(new CKEDITOR.dom.node(e.startContainer), e.startOffset);
                        b.setEnd(new CKEDITOR.dom.node(e.endContainer), e.endOffset);
                        a.push(b)
                    }
                    return a
                };
                return function (b) {
                    var c = this._.cache;
                    if (c.ranges && !b)return c.ranges;
                    if (!c.ranges) c.ranges = new CKEDITOR.dom.rangeList(a.call(this));
                    if (b)for (var d = c.ranges, e = 0; e < d.length; e++) {
                        var f = d[e];
                        f.getCommonAncestor().isReadOnly() && d.splice(e, 1);
                        if (!f.collapsed) {
                            if (f.startContainer.isReadOnly())for (var b = f.startContainer, g; b;) {
                                if ((g = b.type == CKEDITOR.NODE_ELEMENT) && b.is("body") || !b.isReadOnly())break;
                                g && b.getAttribute("contentEditable") ==
                                "false" && f.setStartAfter(b);
                                b = b.getParent()
                            }
                            b = f.startContainer;
                            g = f.endContainer;
                            var h = f.startOffset, j = f.endOffset, i = f.clone();
                            b && b.type == CKEDITOR.NODE_TEXT && (h >= b.getLength() ? i.setStartAfter(b) : i.setStartBefore(b));
                            g && g.type == CKEDITOR.NODE_TEXT && (j ? i.setEndAfter(g) : i.setEndBefore(g));
                            b = new CKEDITOR.dom.walker(i);
                            b.evaluator = function (a) {
                                if (a.type == CKEDITOR.NODE_ELEMENT && a.isReadOnly()) {
                                    var b = f.clone();
                                    f.setEndBefore(a);
                                    f.collapsed && d.splice(e--, 1);
                                    if (!(a.getPosition(i.endContainer) & CKEDITOR.POSITION_CONTAINS)) {
                                        b.setStartAfter(a);
                                        b.collapsed || d.splice(e + 1, 0, b)
                                    }
                                    return true
                                }
                                return false
                            };
                            b.next()
                        }
                    }
                    return c.ranges
                }
            }(), getStartElement: function () {
                var a = this._.cache;
                if (a.startElement !== void 0)return a.startElement;
                var b;
                switch (this.getType()) {
                    case CKEDITOR.SELECTION_ELEMENT:
                        return this.getSelectedElement();
                    case CKEDITOR.SELECTION_TEXT:
                        var c = this.getRanges()[0];
                        if (c) {
                            if (c.collapsed) {
                                b = c.startContainer;
                                b.type != CKEDITOR.NODE_ELEMENT && (b = b.getParent())
                            } else {
                                for (c.optimize(); ;) {
                                    b = c.startContainer;
                                    if (c.startOffset == (b.getChildCount ? b.getChildCount() :
                                            b.getLength()) && !b.isBlockBoundary()) c.setStartAfter(b); else break
                                }
                                b = c.startContainer;
                                if (b.type != CKEDITOR.NODE_ELEMENT)return b.getParent();
                                b = b.getChild(c.startOffset);
                                if (!b || b.type != CKEDITOR.NODE_ELEMENT) b = c.startContainer; else for (c = b.getFirst(); c && c.type == CKEDITOR.NODE_ELEMENT;) {
                                    b = c;
                                    c = c.getFirst()
                                }
                            }
                            b = b.$
                        }
                }
                return a.startElement = b ? new CKEDITOR.dom.element(b) : null
            }, getSelectedElement: function () {
                var a = this._.cache;
                if (a.selectedElement !== void 0)return a.selectedElement;
                var b = this, c = CKEDITOR.tools.tryThese(function () {
                        return b.getNative().createRange().item(0)
                    },
                    function () {
                        for (var a = b.getRanges()[0].clone(), c, d,
                                 e = 2; e && (!(c = a.getEnclosedNode()) || !(c.type == CKEDITOR.NODE_ELEMENT && y[c.getName()] && (d = c))); e--)a.shrink(CKEDITOR.SHRINK_ELEMENT);
                        return d && d.$
                    });
                return a.selectedElement = c ? new CKEDITOR.dom.element(c) : null
            }, getSelectedText: function () {
                var a = this._.cache;
                if (a.selectedText !== void 0)return a.selectedText;
                var b = this.getNative(), b = f ? b.type == "Control" ? "" : b.createRange().text : b.toString();
                return a.selectedText = b
            }, lock: function () {
                this.getRanges();
                this.getStartElement();
                this.getSelectedElement();
                this.getSelectedText();
                this._.cache.nativeSel = null;
                this.isLocked = 1
            }, unlock: function (a) {
                if (this.isLocked) {
                    if (a)var b = this.getSelectedElement(), c = !b && this.getRanges(), d = this.isFake;
                    this.isLocked = 0;
                    this.reset();
                    if (a) (a = b || c[0] && c[0].getCommonAncestor()) && a.getAscendant("body", 1) && (d ? this.fake(b) : b ? this.selectElement(b) : this.selectRanges(c))
                }
            }, reset: function () {
                this._.cache = {};
                this.isFake = 0;
                var a = this.root.editor;
                if (a && a._.fakeSelection && this.rev == a._.fakeSelection.rev) {
                    delete a._.fakeSelection;
                    var b = a._.hiddenSelectionContainer;
                    if (b) {
                        a.fire("lockSnapshot");
                        b.remove();
                        a.fire("unlockSnapshot")
                    }
                    delete a._.hiddenSelectionContainer
                }
                this.rev = p++
            }, selectElement: function (a) {
                var b = new CKEDITOR.dom.range(this.root);
                b.setStartBefore(a);
                b.setEndAfter(a);
                this.selectRanges([b])
            }, selectRanges: function (a) {
                this.reset();
                if (a.length)if (this.isLocked) {
                    var b = CKEDITOR.document.getActive();
                    this.unlock();
                    this.selectRanges(a);
                    this.lock();
                    !b.equals(this.root) && b.focus()
                } else {
                    a:{
                        var d, e;
                        if (a.length == 1 && !(e = a[0]).collapsed &&
                            (b = e.getEnclosedNode()) && b.type == CKEDITOR.NODE_ELEMENT) {
                            e = e.clone();
                            e.shrink(CKEDITOR.SHRINK_ELEMENT, true);
                            if ((d = e.getEnclosedNode()) && d.type == CKEDITOR.NODE_ELEMENT) b = d;
                            if (b.getAttribute("contenteditable") == "false")break a
                        }
                        b = void 0
                    }
                    if (b) this.fake(b); else {
                        if (f) {
                            e = CKEDITOR.dom.walker.whitespaces(true);
                            d = /\ufeff|\u00a0/;
                            var g = {table: 1, tbody: 1, tr: 1};
                            if (a.length > 1) {
                                b = a[a.length - 1];
                                a[0].setEnd(b.endContainer, b.endOffset)
                            }
                            var b = a[0], a = b.collapsed, j, i, o, n = b.getEnclosedNode();
                            if (n && n.type == CKEDITOR.NODE_ELEMENT &&
                                n.getName() in y && (!n.is("a") || !n.getText()))try {
                                o = n.$.createControlRange();
                                o.addElement(n.$);
                                o.select();
                                return
                            } catch (q) {
                            }
                            (b.startContainer.type == CKEDITOR.NODE_ELEMENT && b.startContainer.getName() in g || b.endContainer.type == CKEDITOR.NODE_ELEMENT && b.endContainer.getName() in g) && b.shrink(CKEDITOR.NODE_ELEMENT, true);
                            o = b.createBookmark();
                            var g = o.startNode, p;
                            if (!a) p = o.endNode;
                            o = b.document.$.body.createTextRange();
                            o.moveToElementText(g.$);
                            o.moveStart("character", 1);
                            if (p) {
                                d = b.document.$.body.createTextRange();
                                d.moveToElementText(p.$);
                                o.setEndPoint("EndToEnd", d);
                                o.moveEnd("character", -1)
                            } else {
                                j = g.getNext(e);
                                i = g.hasAscendant("pre");
                                j = !(j && j.getText && j.getText().match(d)) && (i || !g.hasPrevious() || g.getPrevious().is && g.getPrevious().is("br"));
                                i = b.document.createElement("span");
                                i.setHtml("&#65279;");
                                i.insertBefore(g);
                                j && b.document.createText("﻿").insertBefore(g)
                            }
                            b.setStartBefore(g);
                            g.remove();
                            if (a) {
                                if (j) {
                                    o.moveStart("character", -1);
                                    o.select();
                                    b.document.$.selection.clear()
                                } else o.select();
                                b.moveToPosition(i,
                                    CKEDITOR.POSITION_BEFORE_START);
                                i.remove()
                            } else {
                                b.setEndBefore(p);
                                p.remove();
                                o.select()
                            }
                        } else {
                            p = this.getNative();
                            if (!p)return;
                            if (CKEDITOR.env.opera) {
                                b = this.document.$.createRange();
                                b.selectNodeContents(this.root.$);
                                p.addRange(b)
                            }
                            this.removeAllRanges();
                            for (o = 0; o < a.length; o++) {
                                if (o < a.length - 1) {
                                    b = a[o];
                                    j = a[o + 1];
                                    d = b.clone();
                                    d.setStart(b.endContainer, b.endOffset);
                                    d.setEnd(j.startContainer, j.startOffset);
                                    if (!d.collapsed) {
                                        d.shrink(CKEDITOR.NODE_ELEMENT, true);
                                        i = d.getCommonAncestor();
                                        d = d.getEnclosedNode();
                                        if (i.isReadOnly() || d && d.isReadOnly()) {
                                            j.setStart(b.startContainer, b.startOffset);
                                            a.splice(o--, 1);
                                            continue
                                        }
                                    }
                                }
                                b = a[o];
                                i = this.document.$.createRange();
                                j = b.startContainer;
                                if (CKEDITOR.env.opera && b.collapsed && j.type == CKEDITOR.NODE_ELEMENT) {
                                    d = j.getChild(b.startOffset - 1);
                                    e = j.getChild(b.startOffset);
                                    if (!d && !e && j.is(CKEDITOR.dtd.$removeEmpty) || d && d.type == CKEDITOR.NODE_ELEMENT || e && e.type == CKEDITOR.NODE_ELEMENT) {
                                        b.insertNode(this.document.createText(""));
                                        b.collapse(1)
                                    }
                                }
                                if (b.collapsed && CKEDITOR.env.webkit && c(b)) {
                                    j =
                                        this.root;
                                    h(j, false);
                                    d = j.getDocument().createText("​");
                                    j.setCustomData("cke-fillingChar", d);
                                    b.insertNode(d);
                                    if ((j = d.getNext()) && !d.getPrevious() && j.type == CKEDITOR.NODE_ELEMENT && j.getName() == "br") {
                                        h(this.root);
                                        b.moveToPosition(j, CKEDITOR.POSITION_BEFORE_START)
                                    } else b.moveToPosition(d, CKEDITOR.POSITION_AFTER_END)
                                }
                                i.setStart(b.startContainer.$, b.startOffset);
                                try {
                                    i.setEnd(b.endContainer.$, b.endOffset)
                                } catch (s) {
                                    if (s.toString().indexOf("NS_ERROR_ILLEGAL_VALUE") >= 0) {
                                        b.collapse(1);
                                        i.setEnd(b.endContainer.$,
                                            b.endOffset)
                                    } else throw s;
                                }
                                p.addRange(i)
                            }
                        }
                        this.reset();
                        this.root.fire("selectionchange")
                    }
                }
            }, fake: function (a) {
                var b = this.root.editor;
                this.reset();
                i(b);
                var c = this._.cache, d = new CKEDITOR.dom.range(this.root);
                d.setStartBefore(a);
                d.setEndAfter(a);
                c.ranges = new CKEDITOR.dom.rangeList(d);
                c.selectedElement = c.startElement = a;
                c.type = CKEDITOR.SELECTION_ELEMENT;
                c.selectedText = c.nativeSel = null;
                this.isFake = 1;
                this.rev = p++;
                b._.fakeSelection = this;
                this.root.fire("selectionchange")
            }, isHidden: function () {
                var a = this.getCommonAncestor();
                a && a.type == CKEDITOR.NODE_TEXT && (a = a.getParent());
                return !(!a || !a.data("cke-hidden-sel"))
            }, createBookmarks: function (a) {
                a = this.getRanges().createBookmarks(a);
                this.isFake && (a.isFake = 1);
                return a
            }, createBookmarks2: function (a) {
                a = this.getRanges().createBookmarks2(a);
                this.isFake && (a.isFake = 1);
                return a
            }, selectBookmarks: function (a) {
                for (var b = [], c = 0; c < a.length; c++) {
                    var d = new CKEDITOR.dom.range(this.root);
                    d.moveToBookmark(a[c]);
                    b.push(d)
                }
                a.isFake ? this.fake(b[0].getEnclosedNode()) : this.selectRanges(b);
                return this
            },
                getCommonAncestor: function () {
                    var a = this.getRanges();
                    return !a.length ? null : a[0].startContainer.getCommonAncestor(a[a.length - 1].endContainer)
                }, scrollIntoView: function () {
                this.type != CKEDITOR.SELECTION_NONE && this.getRanges()[0].scrollIntoView()
            }, removeAllRanges: function () {
                var a = this.getNative();
                try {
                    a && a[f ? "empty" : "removeAllRanges"]()
                } catch (b) {
                }
                this.reset()
            }
            }
    })();
    "use strict";
    CKEDITOR.editor.prototype.attachStyleStateChange = function (a, e) {
        var b = this._.styleStateChangeCallbacks;
        if (!b) {
            b = this._.styleStateChangeCallbacks = [];
            this.on("selectionChange", function (a) {
                for (var d = 0; d < b.length; d++) {
                    var e = b[d], g = e.style.checkActive(a.data.path) ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF;
                    e.fn.call(this, g)
                }
            })
        }
        b.push({style: a, fn: e})
    };
    CKEDITOR.STYLE_BLOCK = 1;
    CKEDITOR.STYLE_INLINE = 2;
    CKEDITOR.STYLE_OBJECT = 3;
    (function () {
        function a(a, b) {
            for (var c, d; a = a.getParent();) {
                if (a.equals(b))break;
                if (a.getAttribute("data-nostyle")) c = a; else if (!d) {
                    var e = a.getAttribute("contentEditable");
                    e == "false" ? c = a : e == "true" && (d = 1)
                }
            }
            return c
        }

        function e(b) {
            var d = b.document;
            if (b.collapsed) {
                d = y(this, d);
                b.insertNode(d);
                b.moveToPosition(d, CKEDITOR.POSITION_BEFORE_END)
            } else {
                var f = this.element, g = this._.definition, h, j = g.ignoreReadonly, i = j || g.includeReadonly;
                i == void 0 && (i = b.root.getCustomData("cke_includeReadonly"));
                var k = CKEDITOR.dtd[f];
                if (!k) {
                    h = true;
                    k = CKEDITOR.dtd.span
                }
                b.enlarge(CKEDITOR.ENLARGE_INLINE, 1);
                b.trim();
                var l = b.createBookmark(), m = l.startNode, o = l.endNode, n = m, q;
                if (!j) {
                    var p = b.getCommonAncestor(), j = a(m, p), p = a(o, p);
                    j && (n = j.getNextSourceNode(true));
                    p && (o = p)
                }
                for (n.getPosition(o) == CKEDITOR.POSITION_FOLLOWING && (n = 0); n;) {
                    j = false;
                    if (n.equals(o)) {
                        n = null;
                        j = true
                    } else {
                        var s = n.type == CKEDITOR.NODE_ELEMENT ? n.getName() : null,
                            p = s && n.getAttribute("contentEditable") == "false",
                            r = s && n.getAttribute("data-nostyle");
                        if (s && n.data("cke-bookmark")) {
                            n =
                                n.getNextSourceNode(true);
                            continue
                        }
                        if (p && i && CKEDITOR.dtd.$block[s])for (var t = n, x = c(t), z = void 0, A = x.length, I = 0,
                                                                      t = A && new CKEDITOR.dom.range(t.getDocument()); I < A; ++I) {
                            var z = x[I], L = CKEDITOR.filter.instances[z.data("cke-filter")];
                            if (L ? L.check(this) : 1) {
                                t.selectNodeContents(z);
                                e.call(this, t)
                            }
                        }
                        x = s ? !k[s] || r ? 0 : p && !i ? 0 : (n.getPosition(o) | M) == M && (!g.childRule || g.childRule(n)) : 1;
                        if (x)if ((x = n.getParent()) && ((x.getDtd() || CKEDITOR.dtd.span)[f] || h) && (!g.parentRule || g.parentRule(x))) {
                            if (!q && (!s || !CKEDITOR.dtd.$removeEmpty[s] ||
                                (n.getPosition(o) | M) == M)) {
                                q = b.clone();
                                q.setStartBefore(n)
                            }
                            s = n.type;
                            if (s == CKEDITOR.NODE_TEXT || p || s == CKEDITOR.NODE_ELEMENT && !n.getChildCount()) {
                                for (var s = n,
                                         W; (j = !s.getNext(E)) && (W = s.getParent(), k[W.getName()]) && (W.getPosition(m) | Q) == Q && (!g.childRule || g.childRule(W));)s = W;
                                q.setEndAfter(s)
                            }
                        } else j = true; else j = true;
                        n = n.getNextSourceNode(r || p)
                    }
                    if (j && q && !q.collapsed) {
                        for (var j = y(this, d), p = j.hasAttributes(), r = q.getCommonAncestor(), s = {}, x = {},
                                 z = {}, A = {}, T, P, Z; j && r;) {
                            if (r.getName() == f) {
                                for (T in g.attributes)if (!A[T] &&
                                    (Z = r.getAttribute(P))) j.getAttribute(T) == Z ? x[T] = 1 : A[T] = 1;
                                for (P in g.styles)if (!z[P] && (Z = r.getStyle(P))) j.getStyle(P) == Z ? s[P] = 1 : z[P] = 1
                            }
                            r = r.getParent()
                        }
                        for (T in x)j.removeAttribute(T);
                        for (P in s)j.removeStyle(P);
                        p && !j.hasAttributes() && (j = null);
                        if (j) {
                            q.extractContents().appendTo(j);
                            q.insertNode(j);
                            u.call(this, j);
                            j.mergeSiblings();
                            CKEDITOR.env.ie || j.$.normalize()
                        } else {
                            j = new CKEDITOR.dom.element("span");
                            q.extractContents().appendTo(j);
                            q.insertNode(j);
                            u.call(this, j);
                            j.remove(true)
                        }
                        q = null
                    }
                }
                b.moveToBookmark(l);
                b.shrink(CKEDITOR.SHRINK_TEXT);
                b.shrink(CKEDITOR.NODE_ELEMENT, true)
            }
        }

        function b(a) {
            function b() {
                for (var a = new CKEDITOR.dom.elementPath(d.getParent()),
                         c = new CKEDITOR.dom.elementPath(k.getParent()), e = null, f = null,
                         g = 0; g < a.elements.length; g++) {
                    var h = a.elements[g];
                    if (h == a.block || h == a.blockLimit)break;
                    m.checkElementRemovable(h) && (e = h)
                }
                for (g = 0; g < c.elements.length; g++) {
                    h = c.elements[g];
                    if (h == c.block || h == c.blockLimit)break;
                    m.checkElementRemovable(h) && (f = h)
                }
                f && k.breakParent(f);
                e && d.breakParent(e)
            }

            a.enlarge(CKEDITOR.ENLARGE_INLINE,
                1);
            var c = a.createBookmark(), d = c.startNode;
            if (a.collapsed) {
                for (var e = new CKEDITOR.dom.elementPath(d.getParent(), a.root), g, j = 0,
                         h; j < e.elements.length && (h = e.elements[j]); j++) {
                    if (h == e.block || h == e.blockLimit)break;
                    if (this.checkElementRemovable(h)) {
                        var i;
                        if (a.collapsed && (a.checkBoundaryOfElement(h, CKEDITOR.END) || (i = a.checkBoundaryOfElement(h, CKEDITOR.START)))) {
                            g = h;
                            g.match = i ? "start" : "end"
                        } else {
                            h.mergeSiblings();
                            h.is(this.element) ? s.call(this, h) : f(h, l(this)[h.getName()])
                        }
                    }
                }
                if (g) {
                    h = d;
                    for (j = 0; ; j++) {
                        i = e.elements[j];
                        if (i.equals(g))break; else if (i.match)continue; else i = i.clone();
                        i.append(h);
                        h = i
                    }
                    h[g.match == "start" ? "insertBefore" : "insertAfter"](g)
                }
            } else {
                var k = c.endNode, m = this;
                b();
                for (e = d; !e.equals(k);) {
                    g = e.getNextSourceNode();
                    if (e.type == CKEDITOR.NODE_ELEMENT && this.checkElementRemovable(e)) {
                        e.getName() == this.element ? s.call(this, e) : f(e, l(this)[e.getName()]);
                        if (g.type == CKEDITOR.NODE_ELEMENT && g.contains(d)) {
                            b();
                            g = d.getNext()
                        }
                    }
                    e = g
                }
            }
            a.moveToBookmark(c);
            a.shrink(CKEDITOR.NODE_ELEMENT, true)
        }

        function c(a) {
            var b = [];
            a.forEach(function (a) {
                if (a.getAttribute("contenteditable") ==
                    "true") {
                    b.push(a);
                    return false
                }
            }, CKEDITOR.NODE_ELEMENT, true);
            return b
        }

        function d(a) {
            var b = a.getEnclosedNode() || a.getCommonAncestor(false, true);
            (a = (new CKEDITOR.dom.elementPath(b, a.root)).contains(this.element, 1)) && !a.isReadOnly() && m(a, this)
        }

        function h(a) {
            var b = a.getCommonAncestor(true, true);
            if (a = (new CKEDITOR.dom.elementPath(b, a.root)).contains(this.element, 1)) {
                var b = this._.definition, c = b.attributes;
                if (c)for (var d in c)a.removeAttribute(d, c[d]);
                if (b.styles)for (var e in b.styles)b.styles.hasOwnProperty(e) &&
                a.removeStyle(e)
            }
        }

        function g(a) {
            var b = a.createBookmark(true), c = a.createIterator();
            c.enforceRealBlocks = true;
            if (this._.enterMode) c.enlargeBr = this._.enterMode != CKEDITOR.ENTER_BR;
            for (var d, e = a.document,
                     f; d = c.getNextParagraph();)if (!d.isReadOnly() && (c.activeFilter ? c.activeFilter.check(this) : 1)) {
                f = y(this, e, d);
                i(d, f)
            }
            a.moveToBookmark(b)
        }

        function n(a) {
            var b = a.createBookmark(1), c = a.createIterator();
            c.enforceRealBlocks = true;
            c.enlargeBr = this._.enterMode != CKEDITOR.ENTER_BR;
            for (var d, e; d = c.getNextParagraph();)if (this.checkElementRemovable(d))if (d.is("pre")) {
                (e =
                    this._.enterMode == CKEDITOR.ENTER_BR ? null : a.document.createElement(this._.enterMode == CKEDITOR.ENTER_P ? "p" : "div")) && d.copyAttributes(e);
                i(d, e)
            } else s.call(this, d);
            a.moveToBookmark(b)
        }

        function i(a, b) {
            var c = !b;
            if (c) {
                b = a.getDocument().createElement("div");
                a.copyAttributes(b)
            }
            var d = b && b.is("pre"), e = a.is("pre"), f = !d && e;
            if (d && !e) {
                e = b;
                (f = a.getBogus()) && f.remove();
                f = a.getHtml();
                f = o(f, /(?:^[ \t\n\r]+)|(?:[ \t\n\r]+$)/g, "");
                f = f.replace(/[ \t\r\n]*(<br[^>]*>)[ \t\r\n]*/gi, "$1");
                f = f.replace(/([ \t\n\r]+|&nbsp;)/g,
                    " ");
                f = f.replace(/<br\b[^>]*>/gi, "\n");
                if (CKEDITOR.env.ie) {
                    var g = a.getDocument().createElement("div");
                    g.append(e);
                    e.$.outerHTML = "<pre>" + f + "</pre>";
                    e.copyAttributes(g.getFirst());
                    e = g.getFirst().remove()
                } else e.setHtml(f);
                b = e
            } else f ? b = q(c ? [a.getHtml()] : j(a), b) : a.moveChildren(b);
            b.replace(a);
            if (d) {
                var c = b, h;
                if ((h = c.getPrevious(z)) && h.type == CKEDITOR.NODE_ELEMENT && h.is("pre")) {
                    d = o(h.getHtml(), /\n$/, "") + "\n\n" + o(c.getHtml(), /^\n/, "");
                    CKEDITOR.env.ie ? c.$.outerHTML = "<pre>" + d + "</pre>" : c.setHtml(d);
                    h.remove()
                }
            } else c &&
            p(b)
        }

        function j(a) {
            a.getName();
            var b = [];
            o(a.getOuterHtml(), /(\S\s*)\n(?:\s|(<span[^>]+data-cke-bookmark.*?\/span>))*\n(?!$)/gi, function (a, b, c) {
                return b + "</pre>" + c + "<pre>"
            }).replace(/<pre\b.*?>([\s\S]*?)<\/pre>/gi, function (a, c) {
                b.push(c)
            });
            return b
        }

        function o(a, b, c) {
            var d = "", e = "",
                a = a.replace(/(^<span[^>]+data-cke-bookmark.*?\/span>)|(<span[^>]+data-cke-bookmark.*?\/span>$)/gi, function (a, b, c) {
                    b && (d = b);
                    c && (e = c);
                    return ""
                });
            return d + a.replace(b, c) + e
        }

        function q(a, b) {
            var c;
            a.length > 1 && (c = new CKEDITOR.dom.documentFragment(b.getDocument()));
            for (var d = 0; d < a.length; d++) {
                var e = a[d], e = e.replace(/(\r\n|\r)/g, "\n"), e = o(e, /^[ \t]*\n/, ""), e = o(e, /\n$/, ""),
                    e = o(e, /^[ \t]+|[ \t]+$/g, function (a, b) {
                        return a.length == 1 ? "&nbsp;" : b ? " " + CKEDITOR.tools.repeat("&nbsp;", a.length - 1) : CKEDITOR.tools.repeat("&nbsp;", a.length - 1) + " "
                    }), e = e.replace(/\n/g, "<br>"), e = e.replace(/[ \t]{2,}/g, function (a) {
                        return CKEDITOR.tools.repeat("&nbsp;", a.length - 1) + " "
                    });
                if (c) {
                    var f = b.clone();
                    f.setHtml(e);
                    c.append(f)
                } else b.setHtml(e)
            }
            return c || b
        }

        function s(a, b) {
            var c = this._.definition,
                d = c.attributes, c = c.styles, e = l(this)[a.getName()],
                g = CKEDITOR.tools.isEmpty(d) && CKEDITOR.tools.isEmpty(c), h;
            for (h in d)if (!((h == "class" || this._.definition.fullMatch) && a.getAttribute(h) != t(h, d[h])) && !(b && h.slice(0, 5) == "data-")) {
                g = a.hasAttribute(h);
                a.removeAttribute(h)
            }
            for (var j in c)if (!(this._.definition.fullMatch && a.getStyle(j) != t(j, c[j], true))) {
                g = g || !!a.getStyle(j);
                a.removeStyle(j)
            }
            f(a, e, r[a.getName()]);
            g && (this._.definition.alwaysRemoveElement ? p(a, 1) : !CKEDITOR.dtd.$block[a.getName()] || this._.enterMode ==
            CKEDITOR.ENTER_BR && !a.hasAttributes() ? p(a) : a.renameNode(this._.enterMode == CKEDITOR.ENTER_P ? "p" : "div"))
        }

        function u(a) {
            for (var b = l(this), c = a.getElementsByTag(this.element), d, e = c.count(); --e >= 0;) {
                d = c.getItem(e);
                d.isReadOnly() || s.call(this, d, true)
            }
            for (var g in b)if (g != this.element) {
                c = a.getElementsByTag(g);
                for (e = c.count() - 1; e >= 0; e--) {
                    d = c.getItem(e);
                    d.isReadOnly() || f(d, b[g])
                }
            }
        }

        function f(a, b, c) {
            if (b = b && b.attributes)for (var d = 0; d < b.length; d++) {
                var e = b[d][0], f;
                if (f = a.getAttribute(e)) {
                    var g = b[d][1];
                    (g === null ||
                    g.test && g.test(f) || typeof g == "string" && f == g) && a.removeAttribute(e)
                }
            }
            c || p(a)
        }

        function p(a, b) {
            if (!a.hasAttributes() || b)if (CKEDITOR.dtd.$block[a.getName()]) {
                var c = a.getPrevious(z), d = a.getNext(z);
                c && (c.type == CKEDITOR.NODE_TEXT || !c.isBlockBoundary({br: 1})) && a.append("br", 1);
                d && (d.type == CKEDITOR.NODE_TEXT || !d.isBlockBoundary({br: 1})) && a.append("br");
                a.remove(true)
            } else {
                c = a.getFirst();
                d = a.getLast();
                a.remove(true);
                if (c) {
                    c.type == CKEDITOR.NODE_ELEMENT && c.mergeSiblings();
                    d && (!c.equals(d) && d.type == CKEDITOR.NODE_ELEMENT) &&
                    d.mergeSiblings()
                }
            }
        }

        function y(a, b, c) {
            var d;
            d = a.element;
            d == "*" && (d = "span");
            d = new CKEDITOR.dom.element(d, b);
            c && c.copyAttributes(d);
            d = m(d, a);
            b.getCustomData("doc_processing_style") && d.hasAttribute("id") ? d.removeAttribute("id") : b.setCustomData("doc_processing_style", 1);
            return d
        }

        function m(a, b) {
            var c = b._.definition, d = c.attributes, c = CKEDITOR.style.getStyleText(c);
            if (d)for (var e in d)a.setAttribute(e, d[e]);
            c && a.setAttribute("style", c);
            return a
        }

        function k(a, b) {
            for (var c in a)a[c] = a[c].replace(I, function (a,
                                                             c) {
                return b[c]
            })
        }

        function l(a) {
            if (a._.overrides)return a._.overrides;
            var b = a._.overrides = {}, c = a._.definition.overrides;
            if (c) {
                CKEDITOR.tools.isArray(c) || (c = [c]);
                for (var d = 0; d < c.length; d++) {
                    var e = c[d], f, g;
                    if (typeof e == "string") f = e.toLowerCase(); else {
                        f = e.element ? e.element.toLowerCase() : a.element;
                        g = e.attributes
                    }
                    e = b[f] || (b[f] = {});
                    if (g) {
                        var e = e.attributes = e.attributes || [], h;
                        for (h in g)e.push([h.toLowerCase(), g[h]])
                    }
                }
            }
            return b
        }

        function t(a, b, c) {
            var d = new CKEDITOR.dom.element("span");
            d[c ? "setStyle" : "setAttribute"](a,
                b);
            return d[c ? "getStyle" : "getAttribute"](a)
        }

        function x(a, b) {
            for (var c = a.document, d = a.getRanges(), e = b ? this.removeFromRange : this.applyToRange, f,
                     g = d.createIterator(); f = g.getNextRange();)e.call(this, f);
            a.selectRanges(d);
            c.removeCustomData("doc_processing_style")
        }

        var r = {
                address: 1,
                div: 1,
                h1: 1,
                h2: 1,
                h3: 1,
                h4: 1,
                h5: 1,
                h6: 1,
                p: 1,
                pre: 1,
                section: 1,
                header: 1,
                footer: 1,
                nav: 1,
                article: 1,
                aside: 1,
                figure: 1,
                dialog: 1,
                hgroup: 1,
                time: 1,
                meter: 1,
                menu: 1,
                command: 1,
                keygen: 1,
                output: 1,
                progress: 1,
                details: 1,
                datagrid: 1,
                datalist: 1
            }, L = {
                a: 1,
                embed: 1,
                hr: 1,
                img: 1,
                li: 1,
                object: 1,
                ol: 1,
                table: 1,
                td: 1,
                tr: 1,
                th: 1,
                ul: 1,
                dl: 1,
                dt: 1,
                dd: 1,
                form: 1,
                audio: 1,
                video: 1
            }, A = /\s*(?:;\s*|$)/, I = /#\((.+?)\)/g, E = CKEDITOR.dom.walker.bookmark(0, 1),
            z = CKEDITOR.dom.walker.whitespaces(1);
        CKEDITOR.style = function (a, b) {
            var c = a.attributes;
            if (c && c.style) {
                a.styles = CKEDITOR.tools.extend({}, a.styles, CKEDITOR.tools.parseCssText(c.style));
                delete c.style
            }
            if (b) {
                a = CKEDITOR.tools.clone(a);
                k(a.attributes, b);
                k(a.styles, b)
            }
            c = this.element = a.element ? typeof a.element == "string" ? a.element.toLowerCase() :
                a.element : "*";
            this.type = a.type || (r[c] ? CKEDITOR.STYLE_BLOCK : L[c] ? CKEDITOR.STYLE_OBJECT : CKEDITOR.STYLE_INLINE);
            if (typeof this.element == "object") this.type = CKEDITOR.STYLE_OBJECT;
            this._ = {definition: a}
        };
        CKEDITOR.editor.prototype.applyStyle = function (a) {
            a.checkApplicable(this.elementPath()) && x.call(a, this.getSelection())
        };
        CKEDITOR.editor.prototype.removeStyle = function (a) {
            a.checkApplicable(this.elementPath()) && x.call(a, this.getSelection(), 1)
        };
        CKEDITOR.style.prototype = {
            apply: function (a) {
                x.call(this, a.getSelection())
            },
            remove: function (a) {
                x.call(this, a.getSelection(), 1)
            }, applyToRange: function (a) {
                return (this.applyToRange = this.type == CKEDITOR.STYLE_INLINE ? e : this.type == CKEDITOR.STYLE_BLOCK ? g : this.type == CKEDITOR.STYLE_OBJECT ? d : null).call(this, a)
            }, removeFromRange: function (a) {
                return (this.removeFromRange = this.type == CKEDITOR.STYLE_INLINE ? b : this.type == CKEDITOR.STYLE_BLOCK ? n : this.type == CKEDITOR.STYLE_OBJECT ? h : null).call(this, a)
            }, applyToObject: function (a) {
                m(a, this)
            }, checkActive: function (a) {
                switch (this.type) {
                    case CKEDITOR.STYLE_BLOCK:
                        return this.checkElementRemovable(a.block ||
                            a.blockLimit, true);
                    case CKEDITOR.STYLE_OBJECT:
                    case CKEDITOR.STYLE_INLINE:
                        for (var b = a.elements, c = 0, d; c < b.length; c++) {
                            d = b[c];
                            if (!(this.type == CKEDITOR.STYLE_INLINE && (d == a.block || d == a.blockLimit))) {
                                if (this.type == CKEDITOR.STYLE_OBJECT) {
                                    var e = d.getName();
                                    if (!(typeof this.element == "string" ? e == this.element : e in this.element))continue
                                }
                                if (this.checkElementRemovable(d, true))return true
                            }
                        }
                }
                return false
            }, checkApplicable: function (a, b) {
                if (b && !b.check(this))return false;
                switch (this.type) {
                    case CKEDITOR.STYLE_OBJECT:
                        return !!a.contains(this.element);
                    case CKEDITOR.STYLE_BLOCK:
                        return !!a.blockLimit.getDtd()[this.element]
                }
                return true
            }, checkElementMatch: function (a, b) {
                var c = this._.definition;
                if (!a || !c.ignoreReadonly && a.isReadOnly())return false;
                var d = a.getName();
                if (typeof this.element == "string" ? d == this.element : d in this.element) {
                    if (!b && !a.hasAttributes())return true;
                    if (d = c._AC) c = d; else {
                        var d = {}, e = 0, f = c.attributes;
                        if (f)for (var g in f) {
                            e++;
                            d[g] = f[g]
                        }
                        if (g = CKEDITOR.style.getStyleText(c)) {
                            d.style || e++;
                            d.style = g
                        }
                        d._length = e;
                        c = c._AC = d
                    }
                    if (c._length) {
                        for (var h in c)if (h !=
                            "_length") {
                            e = a.getAttribute(h) || "";
                            if (h == "style")a:{
                                d = c[h];
                                typeof d == "string" && (d = CKEDITOR.tools.parseCssText(d));
                                typeof e == "string" && (e = CKEDITOR.tools.parseCssText(e, true));
                                g = void 0;
                                for (g in d)if (!(g in e && (e[g] == d[g] || d[g] == "inherit" || e[g] == "inherit"))) {
                                    d = false;
                                    break a
                                }
                                d = true
                            } else d = c[h] == e;
                            if (d) {
                                if (!b)return true
                            } else if (b)return false
                        }
                        if (b)return true
                    } else return true
                }
                return false
            }, checkElementRemovable: function (a, b) {
                if (this.checkElementMatch(a, b))return true;
                var c = l(this)[a.getName()];
                if (c) {
                    var d;
                    if (!(c = c.attributes))return true;
                    for (var e = 0; e < c.length; e++) {
                        d = c[e][0];
                        if (d = a.getAttribute(d)) {
                            var f = c[e][1];
                            if (f === null || typeof f == "string" && d == f || f.test(d))return true
                        }
                    }
                }
                return false
            }, buildPreview: function (a) {
                var b = this._.definition, c = [], d = b.element;
                d == "bdo" && (d = "span");
                var c = ["<", d], e = b.attributes;
                if (e)for (var f in e)c.push(" ", f, '="', e[f], '"');
                (e = CKEDITOR.style.getStyleText(b)) && c.push(' style="', e, '"');
                c.push(">", a || b.name, "</", d, ">");
                return c.join("")
            }, getDefinition: function () {
                return this._.definition
            }
        };
        CKEDITOR.style.getStyleText = function (a) {
            var b = a._ST;
            if (b)return b;
            var b = a.styles, c = a.attributes && a.attributes.style || "", d = "";
            c.length && (c = c.replace(A, ";"));
            for (var e in b) {
                var f = b[e], g = (e + ":" + f).replace(A, ";");
                f == "inherit" ? d = d + g : c = c + g
            }
            c.length && (c = CKEDITOR.tools.normalizeCssText(c, true));
            return a._ST = c + d
        };
        var M = CKEDITOR.POSITION_PRECEDING | CKEDITOR.POSITION_IDENTICAL | CKEDITOR.POSITION_IS_CONTAINED,
            Q = CKEDITOR.POSITION_FOLLOWING | CKEDITOR.POSITION_IDENTICAL | CKEDITOR.POSITION_IS_CONTAINED
    })();
    CKEDITOR.styleCommand = function (a, e) {
        this.requiredContent = this.allowedContent = this.style = a;
        CKEDITOR.tools.extend(this, e, true)
    };
    CKEDITOR.styleCommand.prototype.exec = function (a) {
        a.focus();
        this.state == CKEDITOR.TRISTATE_OFF ? a.applyStyle(this.style) : this.state == CKEDITOR.TRISTATE_ON && a.removeStyle(this.style)
    };
    CKEDITOR.stylesSet = new CKEDITOR.resourceManager("", "stylesSet");
    CKEDITOR.addStylesSet = CKEDITOR.tools.bind(CKEDITOR.stylesSet.add, CKEDITOR.stylesSet);
    CKEDITOR.loadStylesSet = function (a, e, b) {
        CKEDITOR.stylesSet.addExternal(a, e, "");
        CKEDITOR.stylesSet.load(a, b)
    };
    CKEDITOR.editor.prototype.getStylesSet = function (a) {
        if (this._.stylesDefinitions) a(this._.stylesDefinitions); else {
            var e = this, b = e.config.stylesCombo_stylesSet || e.config.stylesSet;
            if (b === false) a(null); else if (b instanceof Array) {
                e._.stylesDefinitions = b;
                a(b)
            } else {
                b || (b = "default");
                var b = b.split(":"), c = b[0];
                CKEDITOR.stylesSet.addExternal(c, b[1] ? b.slice(1).join(":") : CKEDITOR.getUrl("styles.js"), "");
                CKEDITOR.stylesSet.load(c, function (b) {
                    e._.stylesDefinitions = b[c];
                    a(e._.stylesDefinitions)
                })
            }
        }
    };
    CKEDITOR.dom.comment = function (a, e) {
        typeof a == "string" && (a = (e ? e.$ : document).createComment(a));
        CKEDITOR.dom.domObject.call(this, a)
    };
    CKEDITOR.dom.comment.prototype = new CKEDITOR.dom.node;
    CKEDITOR.tools.extend(CKEDITOR.dom.comment.prototype, {
        type: CKEDITOR.NODE_COMMENT, getOuterHtml: function () {
            return "<\!--" + this.$.nodeValue + "--\>"
        }
    });
    "use strict";
    (function () {
        var a = {}, e = {}, b;
        for (b in CKEDITOR.dtd.$blockLimit)b in CKEDITOR.dtd.$list || (a[b] = 1);
        for (b in CKEDITOR.dtd.$block)b in CKEDITOR.dtd.$blockLimit || b in CKEDITOR.dtd.$empty || (e[b] = 1);
        CKEDITOR.dom.elementPath = function (b, d) {
            var h = null, g = null, n = [], i = b, j, d = d || b.getDocument().getBody();
            do if (i.type == CKEDITOR.NODE_ELEMENT) {
                n.push(i);
                if (!this.lastElement) {
                    this.lastElement = i;
                    if (i.is(CKEDITOR.dtd.$object) || i.getAttribute("contenteditable") == "false")continue
                }
                if (i.equals(d))break;
                if (!g) {
                    j = i.getName();
                    i.getAttribute("contenteditable") == "true" ? g = i : !h && e[j] && (h = i);
                    if (a[j]) {
                        var o;
                        if (o = !h) {
                            if (j = j == "div") {
                                a:{
                                    j = i.getChildren();
                                    o = 0;
                                    for (var q = j.count(); o < q; o++) {
                                        var s = j.getItem(o);
                                        if (s.type == CKEDITOR.NODE_ELEMENT && CKEDITOR.dtd.$block[s.getName()]) {
                                            j = true;
                                            break a
                                        }
                                    }
                                    j = false
                                }
                                j = !j
                            }
                            o = j
                        }
                        o ? h = i : g = i
                    }
                }
            } while (i = i.getParent());
            g || (g = d);
            this.block = h;
            this.blockLimit = g;
            this.root = d;
            this.elements = n
        }
    })();
    CKEDITOR.dom.elementPath.prototype = {
        compare: function (a) {
            var e = this.elements, a = a && a.elements;
            if (!a || e.length != a.length)return false;
            for (var b = 0; b < e.length; b++)if (!e[b].equals(a[b]))return false;
            return true
        }, contains: function (a, e, b) {
            var c;
            typeof a == "string" && (c = function (b) {
                return b.getName() == a
            });
            a instanceof CKEDITOR.dom.element ? c = function (b) {
                return b.equals(a)
            } : CKEDITOR.tools.isArray(a) ? c = function (b) {
                return CKEDITOR.tools.indexOf(a, b.getName()) > -1
            } : typeof a == "function" ? c = a : typeof a == "object" && (c =
                    function (b) {
                        return b.getName() in a
                    });
            var d = this.elements, h = d.length;
            e && h--;
            if (b) {
                d = Array.prototype.slice.call(d, 0);
                d.reverse()
            }
            for (e = 0; e < h; e++)if (c(d[e]))return d[e];
            return null
        }, isContextFor: function (a) {
            var e;
            if (a in CKEDITOR.dtd.$block) {
                e = this.contains(CKEDITOR.dtd.$intermediate) || this.root.equals(this.block) && this.block || this.blockLimit;
                return !!e.getDtd()[a]
            }
            return true
        }, direction: function () {
            return (this.block || this.blockLimit || this.root).getDirection(1)
        }
    };
    CKEDITOR.dom.text = function (a, e) {
        typeof a == "string" && (a = (e ? e.$ : document).createTextNode(a));
        this.$ = a
    };
    CKEDITOR.dom.text.prototype = new CKEDITOR.dom.node;
    CKEDITOR.tools.extend(CKEDITOR.dom.text.prototype, {
        type: CKEDITOR.NODE_TEXT, getLength: function () {
            return this.$.nodeValue.length
        }, getText: function () {
            return this.$.nodeValue
        }, setText: function (a) {
            this.$.nodeValue = a
        }, split: function (a) {
            var e = this.$.parentNode, b = e.childNodes.length, c = this.getLength(), d = this.getDocument(),
                h = new CKEDITOR.dom.text(this.$.splitText(a), d);
            if (e.childNodes.length == b)if (a >= c) {
                h = d.createText("");
                h.insertAfter(this)
            } else {
                a = d.createText("");
                a.insertAfter(h);
                a.remove()
            }
            return h
        }, substring: function (a,
                                e) {
            return typeof e != "number" ? this.$.nodeValue.substr(a) : this.$.nodeValue.substring(a, e)
        }
    });
    (function () {
        function a(a, c, d) {
            var e = a.serializable, g = c[d ? "endContainer" : "startContainer"], n = d ? "endOffset" : "startOffset",
                i = e ? c.document.getById(a.startNode) : a.startNode,
                a = e ? c.document.getById(a.endNode) : a.endNode;
            if (g.equals(i.getPrevious())) {
                c.startOffset = c.startOffset - g.getLength() - a.getPrevious().getLength();
                g = a.getNext()
            } else if (g.equals(a.getPrevious())) {
                c.startOffset = c.startOffset - g.getLength();
                g = a.getNext()
            }
            g.equals(i.getParent()) && c[n]++;
            g.equals(a.getParent()) && c[n]++;
            c[d ? "endContainer" : "startContainer"] =
                g;
            return c
        }

        CKEDITOR.dom.rangeList = function (a) {
            if (a instanceof CKEDITOR.dom.rangeList)return a;
            a ? a instanceof CKEDITOR.dom.range && (a = [a]) : a = [];
            return CKEDITOR.tools.extend(a, e)
        };
        var e = {
            createIterator: function () {
                var a = this, c = CKEDITOR.dom.walker.bookmark(), d = [], e;
                return {
                    getNextRange: function (g) {
                        e = e == void 0 ? 0 : e + 1;
                        var n = a[e];
                        if (n && a.length > 1) {
                            if (!e)for (var i = a.length - 1; i >= 0; i--)d.unshift(a[i].createBookmark(true));
                            if (g)for (var j = 0; a[e + j + 1];) {
                                for (var o = n.document, g = 0, i = o.getById(d[j].endNode), o = o.getById(d[j +
                                1].startNode); ;) {
                                    i = i.getNextSourceNode(false);
                                    if (o.equals(i)) g = 1; else if (c(i) || i.type == CKEDITOR.NODE_ELEMENT && i.isBlockBoundary())continue;
                                    break
                                }
                                if (!g)break;
                                j++
                            }
                            for (n.moveToBookmark(d.shift()); j--;) {
                                i = a[++e];
                                i.moveToBookmark(d.shift());
                                n.setEnd(i.endContainer, i.endOffset)
                            }
                        }
                        return n
                    }
                }
            }, createBookmarks: function (b) {
                for (var c = [], d, e = 0; e < this.length; e++) {
                    c.push(d = this[e].createBookmark(b, true));
                    for (var g = e + 1; g < this.length; g++) {
                        this[g] = a(d, this[g]);
                        this[g] = a(d, this[g], true)
                    }
                }
                return c
            }, createBookmarks2: function (a) {
                for (var c =
                    [], d = 0; d < this.length; d++)c.push(this[d].createBookmark2(a));
                return c
            }, moveToBookmarks: function (a) {
                for (var c = 0; c < this.length; c++)this[c].moveToBookmark(a[c])
            }
        }
    })();
    (function () {
        function a() {
            return CKEDITOR.getUrl(CKEDITOR.skinName.split(",")[1] || "skins/" + CKEDITOR.skinName.split(",")[0] + "/")
        }

        function e(b) {
            var c = CKEDITOR.skin["ua_" + b], d = CKEDITOR.env;
            if (c)for (var c = c.split(",").sort(function (a, b) {
                return a > b ? -1 : 1
            }), e = 0, g; e < c.length; e++) {
                g = c[e];
                if (d.ie && (g.replace(/^ie/, "") == d.version || d.quirks && g == "iequirks")) g = "ie";
                if (d[g]) {
                    b = b + ("_" + c[e]);
                    break
                }
            }
            return CKEDITOR.getUrl(a() + b + ".css")
        }

        function b(a, b) {
            if (!h[a]) {
                CKEDITOR.document.appendStyleSheet(e(a));
                h[a] = 1
            }
            b && b()
        }

        function c(a) {
            var b = a.getById(g);
            if (!b) {
                b = a.getHead().append("style");
                b.setAttribute("id", g);
                b.setAttribute("type", "text/css")
            }
            return b
        }

        function d(a, b, c) {
            var d, e, f;
            if (CKEDITOR.env.webkit) {
                b = b.split("}").slice(0, -1);
                for (e = 0; e < b.length; e++)b[e] = b[e].split("{")
            }
            for (var g = 0; g < a.length; g++)if (CKEDITOR.env.webkit)for (e = 0; e < b.length; e++) {
                f = b[e][1];
                for (d = 0; d < c.length; d++)f = f.replace(c[d][0], c[d][1]);
                a[g].$.sheet.addRule(b[e][0], f)
            } else {
                f = b;
                for (d = 0; d < c.length; d++)f = f.replace(c[d][0], c[d][1]);
                CKEDITOR.env.ie &&
                CKEDITOR.env.version < 11 ? a[g].$.styleSheet.cssText = a[g].$.styleSheet.cssText + f : a[g].$.innerHTML = a[g].$.innerHTML + f
            }
        }

        var h = {};
        CKEDITOR.skin = {
            path: a, loadPart: function (c, d) {
                CKEDITOR.skin.name != CKEDITOR.skinName.split(",")[0] ? CKEDITOR.scriptLoader.load(CKEDITOR.getUrl(a() + "skin.js"), function () {
                    b(c, d)
                }) : b(c, d)
            }, getPath: function (a) {
                return CKEDITOR.getUrl(e(a))
            }, icons: {}, addIcon: function (a, b, c, d) {
                a = a.toLowerCase();
                this.icons[a] || (this.icons[a] = {path: b, offset: c || 0, bgsize: d || "16px"})
            }, getIconStyle: function (a,
                                       b, c, d, e) {
                var f;
                if (a) {
                    a = a.toLowerCase();
                    b && (f = this.icons[a + "-rtl"]);
                    f || (f = this.icons[a])
                }
                a = c || f && f.path || "";
                d = d || f && f.offset;
                e = e || f && f.bgsize || "16px";
                return a && "background-image:url(" + CKEDITOR.getUrl(a) + ");background-position:0 " + d + "px;background-size:" + e + ";"
            }
        };
        CKEDITOR.tools.extend(CKEDITOR.editor.prototype, {
            getUiColor: function () {
                return this.uiColor
            }, setUiColor: function (a) {
                var b = c(CKEDITOR.document);
                return (this.setUiColor = function (a) {
                    var c = CKEDITOR.skin.chameleon, e = [[i, a]];
                    this.uiColor = a;
                    d([b], c(this,
                        "editor"), e);
                    d(n, c(this, "panel"), e)
                }).call(this, a)
            }
        });
        var g = "cke_ui_color", n = [], i = /\$color/g;
        CKEDITOR.on("instanceLoaded", function (a) {
            if (!CKEDITOR.env.ie || !CKEDITOR.env.quirks) {
                var b = a.editor, a = function (a) {
                    a = (a.data[0] || a.data).element.getElementsByTag("iframe").getItem(0).getFrameDocument();
                    if (!a.getById("cke_ui_color")) {
                        a = c(a);
                        n.push(a);
                        var e = b.getUiColor();
                        e && d([a], CKEDITOR.skin.chameleon(b, "panel"), [[i, e]])
                    }
                };
                b.on("panelShow", a);
                b.on("menuShow", a);
                b.config.uiColor && b.setUiColor(b.config.uiColor)
            }
        })
    })();
    (function () {
        if (CKEDITOR.env.webkit) CKEDITOR.env.hc = false; else {
            var a = CKEDITOR.dom.element.createFromHtml('<div style="width:0px;height:0px;position:absolute;left:-10000px;border: 1px solid;border-color: red blue;"></div>', CKEDITOR.document);
            a.appendTo(CKEDITOR.document.getHead());
            try {
                CKEDITOR.env.hc = a.getComputedStyle("border-top-color") == a.getComputedStyle("border-right-color")
            } catch (e) {
                CKEDITOR.env.hc = false
            }
            a.remove()
        }
        if (CKEDITOR.env.hc) CKEDITOR.env.cssClass = CKEDITOR.env.cssClass + " cke_hc";
        CKEDITOR.document.appendStyleText(".cke{visibility:hidden;}");
        CKEDITOR.status = "loaded";
        CKEDITOR.fireOnce("loaded");
        if (a = CKEDITOR._.pending) {
            delete CKEDITOR._.pending;
            for (var b = 0; b < a.length; b++) {
                CKEDITOR.editor.prototype.constructor.apply(a[b][0], a[b][1]);
                CKEDITOR.add(a[b][0])
            }
        }
    })();
    /*
     Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
     For licensing, see LICENSE.md or http://ckeditor.com/license
     */
    CKEDITOR.skin.name = "moono";
    CKEDITOR.skin.ua_editor = "ie,iequirks,ie7,ie8,gecko";
    CKEDITOR.skin.ua_dialog = "ie,iequirks,ie7,ie8,opera";
    CKEDITOR.skin.chameleon = function () {
        var b = function () {
            return function (b, e) {
                for (var a = b.match(/[^#]./g), c = 0; 3 > c; c++) {
                    var f = a, h = c, d;
                    d = parseInt(a[c], 16);
                    d = ("0" + (0 > e ? 0 | d * (1 + e) : 0 | d + (255 - d) * e).toString(16)).slice(-2);
                    f[h] = d
                }
                return "#" + a.join("")
            }
        }(), c = function () {
            var b = new CKEDITOR.template("background:#{to};background-image:-webkit-gradient(linear,lefttop,leftbottom,from({from}),to({to}));background-image:-moz-linear-gradient(top,{from},{to});background-image:-webkit-linear-gradient(top,{from},{to});background-image:-o-linear-gradient(top,{from},{to});background-image:-ms-linear-gradient(top,{from},{to});background-image:linear-gradient(top,{from},{to});filter:progid:DXImageTransform.Microsoft.gradient(gradientType=0,startColorstr='{from}',endColorstr='{to}');");
            return function (c,
                             a) {
                return b.output({from: c, to: a})
            }
        }(), f = {
            editor: new CKEDITOR.template("{id}.cke_chrome [border-color:{defaultBorder};] {id} .cke_top [ {defaultGradient}border-bottom-color:{defaultBorder};] {id} .cke_bottom [{defaultGradient}border-top-color:{defaultBorder};] {id} .cke_resizer [border-right-color:{ckeResizer}] {id} .cke_dialog_title [{defaultGradient}border-bottom-color:{defaultBorder};] {id} .cke_dialog_footer [{defaultGradient}outline-color:{defaultBorder};border-top-color:{defaultBorder};] {id} .cke_dialog_tab [{lightGradient}border-color:{defaultBorder};] {id} .cke_dialog_tab:hover [{mediumGradient}] {id} .cke_dialog_contents [border-top-color:{defaultBorder};] {id} .cke_dialog_tab_selected, {id} .cke_dialog_tab_selected:hover [background:{dialogTabSelected};border-bottom-color:{dialogTabSelectedBorder};] {id} .cke_dialog_body [background:{dialogBody};border-color:{defaultBorder};] {id} .cke_toolgroup [{lightGradient}border-color:{defaultBorder};] {id} a.cke_button_off:hover, {id} a.cke_button_off:focus, {id} a.cke_button_off:active [{mediumGradient}] {id} .cke_button_on [{ckeButtonOn}] {id} .cke_toolbar_separator [background-color: {ckeToolbarSeparator};] {id} .cke_combo_button [border-color:{defaultBorder};{lightGradient}] {id} a.cke_combo_button:hover, {id} a.cke_combo_button:focus, {id} .cke_combo_on a.cke_combo_button [border-color:{defaultBorder};{mediumGradient}] {id} .cke_path_item [color:{elementsPathColor};] {id} a.cke_path_item:hover, {id} a.cke_path_item:focus, {id} a.cke_path_item:active [background-color:{elementsPathBg};] {id}.cke_panel [border-color:{defaultBorder};] "),
            panel: new CKEDITOR.template(".cke_panel_grouptitle [{lightGradient}border-color:{defaultBorder};] .cke_menubutton_icon [background-color:{menubuttonIcon};] .cke_menubutton:hover .cke_menubutton_icon, .cke_menubutton:focus .cke_menubutton_icon, .cke_menubutton:active .cke_menubutton_icon [background-color:{menubuttonIconHover};] .cke_menuseparator [background-color:{menubuttonIcon};] a:hover.cke_colorbox, a:focus.cke_colorbox, a:active.cke_colorbox [border-color:{defaultBorder};] a:hover.cke_colorauto, a:hover.cke_colormore, a:focus.cke_colorauto, a:focus.cke_colormore, a:active.cke_colorauto, a:active.cke_colormore [background-color:{ckeColorauto};border-color:{defaultBorder};] ")
        };
        return function (g, e) {
            var a = g.uiColor, a = {
                id: "." + g.id,
                defaultBorder: b(a, -0.1),
                defaultGradient: c(b(a, 0.9), a),
                lightGradient: c(b(a, 1), b(a, 0.7)),
                mediumGradient: c(b(a, 0.8), b(a, 0.5)),
                ckeButtonOn: c(b(a, 0.6), b(a, 0.7)),
                ckeResizer: b(a, -0.4),
                ckeToolbarSeparator: b(a, 0.5),
                ckeColorauto: b(a, 0.8),
                dialogBody: b(a, 0.7),
                dialogTabSelected: c("#FFFFFF", "#FFFFFF"),
                dialogTabSelectedBorder: "#FFF",
                elementsPathColor: b(a, -0.6),
                elementsPathBg: a,
                menubuttonIcon: b(a, 0.5),
                menubuttonIconHover: b(a, 0.3)
            };
            return f[e].output(a).replace(/\[/g,
                "{").replace(/\]/g, "}")
        }
    }();
    CKEDITOR.plugins.add("dialogui", {
        onLoad: function () {
            var i = function (b) {
                this._ || (this._ = {});
                this._["default"] = this._.initValue = b["default"] || "";
                this._.required = b.required || !1;
                for (var a = [this._], d = 1; d < arguments.length; d++)a.push(arguments[d]);
                a.push(!0);
                CKEDITOR.tools.extend.apply(CKEDITOR.tools, a);
                return this._
            }, r = {
                build: function (b, a, d) {
                    return new CKEDITOR.ui.dialog.textInput(b, a, d)
                }
            }, l = {
                build: function (b, a, d) {
                    return new CKEDITOR.ui.dialog[a.type](b, a, d)
                }
            }, n = {
                isChanged: function () {
                    return this.getValue() !=
                        this.getInitValue()
                }, reset: function (b) {
                    this.setValue(this.getInitValue(), b)
                }, setInitValue: function () {
                    this._.initValue = this.getValue()
                }, resetInitValue: function () {
                    this._.initValue = this._["default"]
                }, getInitValue: function () {
                    return this._.initValue
                }
            }, o = CKEDITOR.tools.extend({}, CKEDITOR.ui.dialog.uiElement.prototype.eventProcessors, {
                onChange: function (b, a) {
                    this._.domOnChangeRegistered || (b.on("load", function () {
                        this.getInputElement().on("change", function () {
                                b.parts.dialog.isVisible() && this.fire("change", {value: this.getValue()})
                            },
                            this)
                    }, this), this._.domOnChangeRegistered = !0);
                    this.on("change", a)
                }
            }, !0), s = /^on([A-Z]\w+)/, p = function (b) {
                for (var a in b)(s.test(a) || "title" == a || "type" == a) && delete b[a];
                return b
            };
            CKEDITOR.tools.extend(CKEDITOR.ui.dialog, {
                labeledElement: function (b, a, d, e) {
                    if (!(4 > arguments.length)) {
                        var c = i.call(this, a);
                        c.labelId = CKEDITOR.tools.getNextId() + "_label";
                        this._.children = [];
                        CKEDITOR.ui.dialog.uiElement.call(this, b, a, d, "div", null, {role: "presentation"}, function () {
                            var f = [], d = a.required ? " cke_required" : "";
                            "horizontal" !=
                            a.labelLayout ? f.push('<label class="cke_dialog_ui_labeled_label' + d + '" ', ' id="' + c.labelId + '"', c.inputId ? ' for="' + c.inputId + '"' : "", (a.labelStyle ? ' style="' + a.labelStyle + '"' : "") + ">", a.label, "</label>", '<div class="cke_dialog_ui_labeled_content"', a.controlStyle ? ' style="' + a.controlStyle + '"' : "", ' role="radiogroup" aria-labelledby="' + c.labelId + '">', e.call(this, b, a), "</div>") : (d = {
                                type: "hbox", widths: a.widths, padding: 0, children: [{
                                    type: "html",
                                    html: '<label class="cke_dialog_ui_labeled_label' + d + '" id="' + c.labelId +
                                    '" for="' + c.inputId + '"' + (a.labelStyle ? ' style="' + a.labelStyle + '"' : "") + ">" + CKEDITOR.tools.htmlEncode(a.label) + "</span>"
                                }, {
                                    type: "html",
                                    html: '<span class="cke_dialog_ui_labeled_content"' + (a.controlStyle ? ' style="' + a.controlStyle + '"' : "") + ">" + e.call(this, b, a) + "</span>"
                                }]
                            }, CKEDITOR.dialog._.uiElementBuilders.hbox.build(b, d, f));
                            return f.join("")
                        })
                    }
                }, textInput: function (b, a, d) {
                    if (!(3 > arguments.length)) {
                        i.call(this, a);
                        var e = this._.inputId = CKEDITOR.tools.getNextId() + "_textInput", c = {
                            "class": "cke_dialog_ui_input_" +
                            a.type, id: e, type: a.type
                        };
                        a.validate && (this.validate = a.validate);
                        a.maxLength && (c.maxlength = a.maxLength);
                        a.size && (c.size = a.size);
                        a.inputStyle && (c.style = a.inputStyle);
                        var f = this, h = !1;
                        b.on("load", function () {
                            f.getInputElement().on("keydown", function (a) {
                                a.data.getKeystroke() == 13 && (h = true)
                            });
                            f.getInputElement().on("keyup", function (a) {
                                if (a.data.getKeystroke() == 13 && h) {
                                    b.getButton("ok") && setTimeout(function () {
                                        b.getButton("ok").click()
                                    }, 0);
                                    h = false
                                }
                            }, null, null, 1E3)
                        });
                        CKEDITOR.ui.dialog.labeledElement.call(this,
                            b, a, d, function () {
                                var b = ['<div class="cke_dialog_ui_input_', a.type, '" role="presentation"'];
                                a.width && b.push('style="width:' + a.width + '" ');
                                b.push("><input ");
                                c["aria-labelledby"] = this._.labelId;
                                this._.required && (c["aria-required"] = this._.required);
                                for (var d in c)b.push(d + '="' + c[d] + '" ');
                                b.push(" /></div>");
                                return b.join("")
                            })
                    }
                }, textarea: function (b, a, d) {
                    if (!(3 > arguments.length)) {
                        i.call(this, a);
                        var e = this, c = this._.inputId = CKEDITOR.tools.getNextId() + "_textarea", f = {};
                        a.validate && (this.validate = a.validate);
                        f.rows = a.rows || 5;
                        f.cols = a.cols || 20;
                        f["class"] = "cke_dialog_ui_input_textarea " + (a["class"] || "");
                        "undefined" != typeof a.inputStyle && (f.style = a.inputStyle);
                        a.dir && (f.dir = a.dir);
                        CKEDITOR.ui.dialog.labeledElement.call(this, b, a, d, function () {
                            f["aria-labelledby"] = this._.labelId;
                            this._.required && (f["aria-required"] = this._.required);
                            var a = ['<div class="cke_dialog_ui_input_textarea" role="presentation"><textarea id="', c, '" '],
                                b;
                            for (b in f)a.push(b + '="' + CKEDITOR.tools.htmlEncode(f[b]) + '" ');
                            a.push(">", CKEDITOR.tools.htmlEncode(e._["default"]),
                                "</textarea></div>");
                            return a.join("")
                        })
                    }
                }, checkbox: function (b, a, d) {
                    if (!(3 > arguments.length)) {
                        var e = i.call(this, a, {"default": !!a["default"]});
                        a.validate && (this.validate = a.validate);
                        CKEDITOR.ui.dialog.uiElement.call(this, b, a, d, "span", null, null, function () {
                            var c = CKEDITOR.tools.extend({}, a, {id: a.id ? a.id + "_checkbox" : CKEDITOR.tools.getNextId() + "_checkbox"}, true),
                                d = [], h = CKEDITOR.tools.getNextId() + "_label",
                                g = {"class": "cke_dialog_ui_checkbox_input", type: "checkbox", "aria-labelledby": h};
                            p(c);
                            if (a["default"]) g.checked =
                                "checked";
                            if (typeof c.inputStyle != "undefined") c.style = c.inputStyle;
                            e.checkbox = new CKEDITOR.ui.dialog.uiElement(b, c, d, "input", null, g);
                            d.push(' <label id="', h, '" for="', g.id, '"' + (a.labelStyle ? ' style="' + a.labelStyle + '"' : "") + ">", CKEDITOR.tools.htmlEncode(a.label), "</label>");
                            return d.join("")
                        })
                    }
                }, radio: function (b, a, d) {
                    if (!(3 > arguments.length)) {
                        i.call(this, a);
                        this._["default"] || (this._["default"] = this._.initValue = a.items[0][1]);
                        a.validate && (this.validate = a.valdiate);
                        var e = [], c = this;
                        CKEDITOR.ui.dialog.labeledElement.call(this,
                            b, a, d, function () {
                                for (var d = [], h = [], g = (a.id ? a.id : CKEDITOR.tools.getNextId()) + "_radio",
                                         k = 0; k < a.items.length; k++) {
                                    var j = a.items[k], i = j[2] !== void 0 ? j[2] : j[0],
                                        l = j[1] !== void 0 ? j[1] : j[0],
                                        m = CKEDITOR.tools.getNextId() + "_radio_input", n = m + "_label",
                                        m = CKEDITOR.tools.extend({}, a, {id: m, title: null, type: null}, true),
                                        i = CKEDITOR.tools.extend({}, m, {title: i}, true), o = {
                                            type: "radio",
                                            "class": "cke_dialog_ui_radio_input",
                                            name: g,
                                            value: l,
                                            "aria-labelledby": n
                                        }, q = [];
                                    if (c._["default"] == l) o.checked = "checked";
                                    p(m);
                                    p(i);
                                    if (typeof m.inputStyle !=
                                        "undefined") m.style = m.inputStyle;
                                    m.keyboardFocusable = true;
                                    e.push(new CKEDITOR.ui.dialog.uiElement(b, m, q, "input", null, o));
                                    q.push(" ");
                                    new CKEDITOR.ui.dialog.uiElement(b, i, q, "label", null, {
                                        id: n,
                                        "for": o.id
                                    }, j[0]);
                                    d.push(q.join(""))
                                }
                                new CKEDITOR.ui.dialog.hbox(b, e, d, h);
                                return h.join("")
                            });
                        this._.children = e
                    }
                }, button: function (b, a, d) {
                    if (arguments.length) {
                        "function" == typeof a && (a = a(b.getParentEditor()));
                        i.call(this, a, {disabled: a.disabled || !1});
                        CKEDITOR.event.implementOn(this);
                        var e = this;
                        b.on("load", function () {
                            var a =
                                this.getElement();
                            (function () {
                                a.on("click", function (a) {
                                    e.click();
                                    a.data.preventDefault()
                                });
                                a.on("keydown", function (a) {
                                    a.data.getKeystroke() in {32: 1} && (e.click(), a.data.preventDefault())
                                })
                            })();
                            a.unselectable()
                        }, this);
                        var c = CKEDITOR.tools.extend({}, a);
                        delete c.style;
                        var f = CKEDITOR.tools.getNextId() + "_label";
                        CKEDITOR.ui.dialog.uiElement.call(this, b, c, d, "a", null, {
                            style: a.style,
                            href: "javascript:void(0)",
                            title: a.label,
                            hidefocus: "true",
                            "class": a["class"],
                            role: "button",
                            "aria-labelledby": f
                        }, '<span id="' + f +
                            '" class="cke_dialog_ui_button">' + CKEDITOR.tools.htmlEncode(a.label) + "</span>")
                    }
                }, select: function (b, a, d) {
                    if (!(3 > arguments.length)) {
                        var e = i.call(this, a);
                        a.validate && (this.validate = a.validate);
                        e.inputId = CKEDITOR.tools.getNextId() + "_select";
                        CKEDITOR.ui.dialog.labeledElement.call(this, b, a, d, function () {
                            var c = CKEDITOR.tools.extend({}, a, {id: a.id ? a.id + "_select" : CKEDITOR.tools.getNextId() + "_select"}, true),
                                d = [], h = [], g = {
                                    id: e.inputId,
                                    "class": "cke_dialog_ui_input_select",
                                    "aria-labelledby": this._.labelId
                                };
                            d.push('<div class="cke_dialog_ui_input_',
                                a.type, '" role="presentation"');
                            a.width && d.push('style="width:' + a.width + '" ');
                            d.push(">");
                            if (a.size != void 0) g.size = a.size;
                            if (a.multiple != void 0) g.multiple = a.multiple;
                            p(c);
                            for (var k = 0,
                                     j; k < a.items.length && (j = a.items[k]); k++)h.push('<option value="', CKEDITOR.tools.htmlEncode(j[1] !== void 0 ? j[1] : j[0]).replace(/"/g, "&quot;"), '" /> ', CKEDITOR.tools.htmlEncode(j[0]));
                            if (typeof c.inputStyle != "undefined") c.style = c.inputStyle;
                            e.select = new CKEDITOR.ui.dialog.uiElement(b, c, d, "select", null, g, h.join(""));
                            d.push("</div>");
                            return d.join("")
                        })
                    }
                }, file: function (b, a, d) {
                    if (!(3 > arguments.length)) {
                        void 0 === a["default"] && (a["default"] = "");
                        var e = CKEDITOR.tools.extend(i.call(this, a), {definition: a, buttons: []});
                        a.validate && (this.validate = a.validate);
                        b.on("load", function () {
                            CKEDITOR.document.getById(e.frameId).getParent().addClass("cke_dialog_ui_input_file")
                        });
                        CKEDITOR.ui.dialog.labeledElement.call(this, b, a, d, function () {
                            e.frameId = CKEDITOR.tools.getNextId() + "_fileInput";
                            var b = ['<iframe frameborder="0" allowtransparency="0" class="cke_dialog_ui_input_file" role="presentation" id="',
                                e.frameId, '" title="', a.label, '" src="javascript:void('];
                            b.push(CKEDITOR.env.ie ? "(function(){" + encodeURIComponent("document.open();(" + CKEDITOR.tools.fixDomain + ")();document.close();") + "})()" : "0");
                            b.push(')"></iframe>');
                            return b.join("")
                        })
                    }
                }, fileButton: function (b, a, d) {
                    if (!(3 > arguments.length)) {
                        i.call(this, a);
                        var e = this;
                        a.validate && (this.validate = a.validate);
                        var c = CKEDITOR.tools.extend({}, a), f = c.onClick;
                        c.className = (c.className ? c.className + " " : "") + "cke_dialog_ui_button";
                        c.onClick = function (c) {
                            var d =
                                a["for"];
                            if (!f || f.call(this, c) !== false) {
                                b.getContentElement(d[0], d[1]).submit();
                                this.disable()
                            }
                        };
                        b.on("load", function () {
                            b.getContentElement(a["for"][0], a["for"][1])._.buttons.push(e)
                        });
                        CKEDITOR.ui.dialog.button.call(this, b, c, d)
                    }
                }, html: function () {
                    var b = /^\s*<[\w:]+\s+([^>]*)?>/, a = /^(\s*<[\w:]+(?:\s+[^>]*)?)((?:.|\r|\n)+)$/, d = /\/$/;
                    return function (e, c, f) {
                        if (!(3 > arguments.length)) {
                            var h = [], g = c.html;
                            "<" != g.charAt(0) && (g = "<span>" + g + "</span>");
                            var k = c.focus;
                            if (k) {
                                var j = this.focus;
                                this.focus = function () {
                                    ("function" ==
                                    typeof k ? k : j).call(this);
                                    this.fire("focus")
                                };
                                c.isFocusable && (this.isFocusable = this.isFocusable);
                                this.keyboardFocusable = !0
                            }
                            CKEDITOR.ui.dialog.uiElement.call(this, e, c, h, "span", null, null, "");
                            h = h.join("").match(b);
                            g = g.match(a) || ["", "", ""];
                            d.test(g[1]) && (g[1] = g[1].slice(0, -1), g[2] = "/" + g[2]);
                            f.push([g[1], " ", h[1] || "", g[2]].join(""))
                        }
                    }
                }(), fieldset: function (b, a, d, e, c) {
                    var f = c.label;
                    this._ = {children: a};
                    CKEDITOR.ui.dialog.uiElement.call(this, b, c, e, "fieldset", null, null, function () {
                        var a = [];
                        f && a.push("<legend" +
                            (c.labelStyle ? ' style="' + c.labelStyle + '"' : "") + ">" + f + "</legend>");
                        for (var b = 0; b < d.length; b++)a.push(d[b]);
                        return a.join("")
                    })
                }
            }, !0);
            CKEDITOR.ui.dialog.html.prototype = new CKEDITOR.ui.dialog.uiElement;
            CKEDITOR.ui.dialog.labeledElement.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.uiElement, {
                setLabel: function (b) {
                    var a = CKEDITOR.document.getById(this._.labelId);
                    1 > a.getChildCount() ? (new CKEDITOR.dom.text(b, CKEDITOR.document)).appendTo(a) : a.getChild(0).$.nodeValue = b;
                    return this
                }, getLabel: function () {
                    var b =
                        CKEDITOR.document.getById(this._.labelId);
                    return !b || 1 > b.getChildCount() ? "" : b.getChild(0).getText()
                }, eventProcessors: o
            }, !0);
            CKEDITOR.ui.dialog.button.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.uiElement, {
                click: function () {
                    return !this._.disabled ? this.fire("click", {dialog: this._.dialog}) : !1
                },
                enable: function () {
                    this._.disabled = !1;
                    var b = this.getElement();
                    b && b.removeClass("cke_disabled")
                },
                disable: function () {
                    this._.disabled = !0;
                    this.getElement().addClass("cke_disabled")
                },
                isVisible: function () {
                    return this.getElement().getFirst().isVisible()
                },
                isEnabled: function () {
                    return !this._.disabled
                },
                eventProcessors: CKEDITOR.tools.extend({}, CKEDITOR.ui.dialog.uiElement.prototype.eventProcessors, {
                    onClick: function (b, a) {
                        this.on("click", function () {
                            a.apply(this, arguments)
                        })
                    }
                }, !0),
                accessKeyUp: function () {
                    this.click()
                },
                accessKeyDown: function () {
                    this.focus()
                },
                keyboardFocusable: !0
            }, !0);
            CKEDITOR.ui.dialog.textInput.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.labeledElement, {
                getInputElement: function () {
                    return CKEDITOR.document.getById(this._.inputId)
                },
                focus: function () {
                    var b = this.selectParentTab();
                    setTimeout(function () {
                        var a = b.getInputElement();
                        a && a.$.focus()
                    }, 0)
                }, select: function () {
                    var b = this.selectParentTab();
                    setTimeout(function () {
                        var a = b.getInputElement();
                        a && (a.$.focus(), a.$.select())
                    }, 0)
                }, accessKeyUp: function () {
                    this.select()
                }, setValue: function (b) {
                    !b && (b = "");
                    return CKEDITOR.ui.dialog.uiElement.prototype.setValue.apply(this, arguments)
                }, keyboardFocusable: !0
            }, n, !0);
            CKEDITOR.ui.dialog.textarea.prototype = new CKEDITOR.ui.dialog.textInput;
            CKEDITOR.ui.dialog.select.prototype =
                CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.labeledElement, {
                    getInputElement: function () {
                        return this._.select.getElement()
                    }, add: function (b, a, d) {
                        var e = new CKEDITOR.dom.element("option", this.getDialog().getParentEditor().document),
                            c = this.getInputElement().$;
                        e.$.text = b;
                        e.$.value = void 0 === a || null === a ? b : a;
                        void 0 === d || null === d ? CKEDITOR.env.ie ? c.add(e.$) : c.add(e.$, null) : c.add(e.$, d);
                        return this
                    }, remove: function (b) {
                        this.getInputElement().$.remove(b);
                        return this
                    }, clear: function () {
                        for (var b = this.getInputElement().$; 0 <
                        b.length;)b.remove(0);
                        return this
                    }, keyboardFocusable: !0
                }, n, !0);
            CKEDITOR.ui.dialog.checkbox.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.uiElement, {
                getInputElement: function () {
                    return this._.checkbox.getElement()
                }, setValue: function (b, a) {
                    this.getInputElement().$.checked = b;
                    !a && this.fire("change", {value: b})
                }, getValue: function () {
                    return this.getInputElement().$.checked
                }, accessKeyUp: function () {
                    this.setValue(!this.getValue())
                }, eventProcessors: {
                    onChange: function (b, a) {
                        if (!CKEDITOR.env.ie || 8 < CKEDITOR.env.version)return o.onChange.apply(this,
                            arguments);
                        b.on("load", function () {
                            var a = this._.checkbox.getElement();
                            a.on("propertychange", function (b) {
                                b = b.data.$;
                                "checked" == b.propertyName && this.fire("change", {value: a.$.checked})
                            }, this)
                        }, this);
                        this.on("change", a);
                        return null
                    }
                }, keyboardFocusable: !0
            }, n, !0);
            CKEDITOR.ui.dialog.radio.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.uiElement, {
                setValue: function (b, a) {
                    for (var d = this._.children, e,
                             c = 0; c < d.length && (e = d[c]); c++)e.getElement().$.checked = e.getValue() == b;
                    !a && this.fire("change", {value: b})
                },
                getValue: function () {
                    for (var b = this._.children,
                             a = 0; a < b.length; a++)if (b[a].getElement().$.checked)return b[a].getValue();
                    return null
                }, accessKeyUp: function () {
                    var b = this._.children, a;
                    for (a = 0; a < b.length; a++)if (b[a].getElement().$.checked) {
                        b[a].getElement().focus();
                        return
                    }
                    b[0].getElement().focus()
                }, eventProcessors: {
                    onChange: function (b, a) {
                        if (CKEDITOR.env.ie) b.on("load", function () {
                            for (var a = this._.children, b = this,
                                     c = 0; c < a.length; c++)a[c].getElement().on("propertychange", function (a) {
                                a = a.data.$;
                                "checked" == a.propertyName &&
                                this.$.checked && b.fire("change", {value: this.getAttribute("value")})
                            })
                        }, this), this.on("change", a); else return o.onChange.apply(this, arguments);
                        return null
                    }
                }
            }, n, !0);
            CKEDITOR.ui.dialog.file.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.labeledElement, n, {
                getInputElement: function () {
                    var b = CKEDITOR.document.getById(this._.frameId).getFrameDocument();
                    return 0 < b.$.forms.length ? new CKEDITOR.dom.element(b.$.forms[0].elements[0]) : this.getElement()
                }, submit: function () {
                    this.getInputElement().getParent().$.submit();
                    return this
                }, getAction: function () {
                    return this.getInputElement().getParent().$.action
                }, registerEvents: function (b) {
                    var a = /^on([A-Z]\w+)/, d, e = function (a, b, c, d) {
                        a.on("formLoaded", function () {
                            a.getInputElement().on(c, d, a)
                        })
                    }, c;
                    for (c in b)if (d = c.match(a)) this.eventProcessors[c] ? this.eventProcessors[c].call(this, this._.dialog, b[c]) : e(this, this._.dialog, d[1].toLowerCase(), b[c]);
                    return this
                }, reset: function () {
                    function b() {
                        d.$.open();
                        var b = "";
                        e.size && (b = e.size - (CKEDITOR.env.ie ? 7 : 0));
                        var i = a.frameId + "_input";
                        d.$.write(['<html dir="' + g + '" lang="' + k + '"><head><title></title></head><body style="margin: 0; overflow: hidden; background: transparent;">', '<form enctype="multipart/form-data" method="POST" dir="' + g + '" lang="' + k + '" action="', CKEDITOR.tools.htmlEncode(e.action), '"><label id="', a.labelId, '" for="', i, '" style="display:none">', CKEDITOR.tools.htmlEncode(e.label), '</label><input id="', i, '" aria-labelledby="', a.labelId, '" type="file" name="', CKEDITOR.tools.htmlEncode(e.id || "cke_upload"), '" size="', CKEDITOR.tools.htmlEncode(0 <
                        b ? b : ""), '" /></form></body></html><script>', CKEDITOR.env.ie ? "(" + CKEDITOR.tools.fixDomain + ")();" : "", "window.parent.CKEDITOR.tools.callFunction(" + f + ");", "window.onbeforeunload = function() {window.parent.CKEDITOR.tools.callFunction(" + h + ")}", "<\/script>"].join(""));
                        d.$.close();
                        for (b = 0; b < c.length; b++)c[b].enable()
                    }

                    var a = this._, d = CKEDITOR.document.getById(a.frameId).getFrameDocument(), e = a.definition,
                        c = a.buttons, f = this.formLoadedNumber, h = this.formUnloadNumber,
                        g = a.dialog._.editor.lang.dir, k = a.dialog._.editor.langCode;
                    f || (f = this.formLoadedNumber = CKEDITOR.tools.addFunction(function () {
                        this.fire("formLoaded")
                    }, this), h = this.formUnloadNumber = CKEDITOR.tools.addFunction(function () {
                        this.getInputElement().clearCustomData()
                    }, this), this.getDialog()._.editor.on("destroy", function () {
                        CKEDITOR.tools.removeFunction(f);
                        CKEDITOR.tools.removeFunction(h)
                    }));
                    CKEDITOR.env.gecko ? setTimeout(b, 500) : b()
                }, getValue: function () {
                    return this.getInputElement().$.value || ""
                }, setInitValue: function () {
                    this._.initValue = ""
                }, eventProcessors: {
                    onChange: function (b,
                                        a) {
                        this._.domOnChangeRegistered || (this.on("formLoaded", function () {
                            this.getInputElement().on("change", function () {
                                this.fire("change", {value: this.getValue()})
                            }, this)
                        }, this), this._.domOnChangeRegistered = !0);
                        this.on("change", a)
                    }
                }, keyboardFocusable: !0
            }, !0);
            CKEDITOR.ui.dialog.fileButton.prototype = new CKEDITOR.ui.dialog.button;
            CKEDITOR.ui.dialog.fieldset.prototype = CKEDITOR.tools.clone(CKEDITOR.ui.dialog.hbox.prototype);
            CKEDITOR.dialog.addUIElement("text", r);
            CKEDITOR.dialog.addUIElement("password", r);
            CKEDITOR.dialog.addUIElement("textarea",
                l);
            CKEDITOR.dialog.addUIElement("checkbox", l);
            CKEDITOR.dialog.addUIElement("radio", l);
            CKEDITOR.dialog.addUIElement("button", l);
            CKEDITOR.dialog.addUIElement("select", l);
            CKEDITOR.dialog.addUIElement("file", l);
            CKEDITOR.dialog.addUIElement("fileButton", l);
            CKEDITOR.dialog.addUIElement("html", l);
            CKEDITOR.dialog.addUIElement("fieldset", {
                build: function (b, a, d) {
                    for (var e = a.children, c, f = [], h = [], g = 0; g < e.length && (c = e[g]); g++) {
                        var i = [];
                        f.push(i);
                        h.push(CKEDITOR.dialog._.uiElementBuilders[c.type].build(b, c, i))
                    }
                    return new CKEDITOR.ui.dialog[a.type](b,
                        h, f, d, a)
                }
            })
        }
    });
    CKEDITOR.DIALOG_RESIZE_NONE = 0;
    CKEDITOR.DIALOG_RESIZE_WIDTH = 1;
    CKEDITOR.DIALOG_RESIZE_HEIGHT = 2;
    CKEDITOR.DIALOG_RESIZE_BOTH = 3;
    (function () {
        function t() {
            for (var a = this._.tabIdList.length, b = CKEDITOR.tools.indexOf(this._.tabIdList, this._.currentTabId) + a,
                     c = b - 1; c > b - a; c--)if (this._.tabs[this._.tabIdList[c % a]][0].$.offsetHeight)return this._.tabIdList[c % a];
            return null
        }

        function u() {
            for (var a = this._.tabIdList.length, b = CKEDITOR.tools.indexOf(this._.tabIdList, this._.currentTabId),
                     c = b + 1; c < b + a; c++)if (this._.tabs[this._.tabIdList[c % a]][0].$.offsetHeight)return this._.tabIdList[c % a];
            return null
        }

        function G(a, b) {
            for (var c = a.$.getElementsByTagName("input"),
                     e = 0, d = c.length; e < d; e++) {
                var g = new CKEDITOR.dom.element(c[e]);
                "text" == g.getAttribute("type").toLowerCase() && (b ? (g.setAttribute("value", g.getCustomData("fake_value") || ""), g.removeCustomData("fake_value")) : (g.setCustomData("fake_value", g.getAttribute("value")), g.setAttribute("value", "")))
            }
        }

        function P(a, b) {
            var c = this.getInputElement();
            c && (a ? c.removeAttribute("aria-invalid") : c.setAttribute("aria-invalid", !0));
            a || (this.select ? this.select() : this.focus());
            b && alert(b);
            this.fire("validated", {valid: a, msg: b})
        }

        function Q() {
            var a = this.getInputElement();
            a && a.removeAttribute("aria-invalid")
        }

        function R(a) {
            var a = CKEDITOR.dom.element.createFromHtml(CKEDITOR.addTemplate("dialog", S).output({
                id: CKEDITOR.tools.getNextNumber(),
                editorId: a.id,
                langDir: a.lang.dir,
                langCode: a.langCode,
                editorDialogClass: "cke_editor_" + a.name.replace(/\./g, "\\.") + "_dialog",
                closeTitle: a.lang.common.close,
                hidpi: CKEDITOR.env.hidpi ? "cke_hidpi" : ""
            })), b = a.getChild([0, 0, 0, 0, 0]), c = b.getChild(0), e = b.getChild(1);
            if (CKEDITOR.env.ie && !CKEDITOR.env.ie6Compat) {
                var d =
                    "javascript:void(function(){" + encodeURIComponent("document.open();(" + CKEDITOR.tools.fixDomain + ")();document.close();") + "}())";
                CKEDITOR.dom.element.createFromHtml('<iframe frameBorder="0" class="cke_iframe_shim" src="' + d + '" tabIndex="-1"></iframe>').appendTo(b.getParent())
            }
            c.unselectable();
            e.unselectable();
            return {
                element: a,
                parts: {
                    dialog: a.getChild(0),
                    title: c,
                    close: e,
                    tabs: b.getChild(2),
                    contents: b.getChild([3, 0, 0, 0]),
                    footer: b.getChild([3, 0, 1, 0])
                }
            }
        }

        function H(a, b, c) {
            this.element = b;
            this.focusIndex = c;
            this.tabIndex =
                0;
            this.isFocusable = function () {
                return !b.getAttribute("disabled") && b.isVisible()
            };
            this.focus = function () {
                a._.currentFocusIndex = this.focusIndex;
                this.element.focus()
            };
            b.on("keydown", function (a) {
                a.data.getKeystroke() in {32: 1, 13: 1} && this.fire("click")
            });
            b.on("focus", function () {
                this.fire("mouseover")
            });
            b.on("blur", function () {
                this.fire("mouseout")
            })
        }

        function T(a) {
            function b() {
                a.layout()
            }

            var c = CKEDITOR.document.getWindow();
            c.on("resize", b);
            a.on("hide", function () {
                c.removeListener("resize", b)
            })
        }

        function I(a, b) {
            this._ =
                {dialog: a};
            CKEDITOR.tools.extend(this, b)
        }

        function U(a) {
            function b(b) {
                var c = a.getSize(), h = CKEDITOR.document.getWindow().getViewPaneSize(), o = b.data.$.screenX,
                    j = b.data.$.screenY, n = o - e.x, m = j - e.y;
                e = {x: o, y: j};
                d.x += n;
                d.y += m;
                a.move(d.x + i[3] < f ? -i[3] : d.x - i[1] > h.width - c.width - f ? h.width - c.width + ("rtl" == g.lang.dir ? 0 : i[1]) : d.x, d.y + i[0] < f ? -i[0] : d.y - i[2] > h.height - c.height - f ? h.height - c.height + i[2] : d.y, 1);
                b.data.preventDefault()
            }

            function c() {
                CKEDITOR.document.removeListener("mousemove", b);
                CKEDITOR.document.removeListener("mouseup",
                    c);
                if (CKEDITOR.env.ie6Compat) {
                    var a = q.getChild(0).getFrameDocument();
                    a.removeListener("mousemove", b);
                    a.removeListener("mouseup", c)
                }
            }

            var e = null, d = null;
            a.getElement().getFirst();
            var g = a.getParentEditor(), f = g.config.dialog_magnetDistance, i = CKEDITOR.skin.margins || [0, 0, 0, 0];
            "undefined" == typeof f && (f = 20);
            a.parts.title.on("mousedown", function (f) {
                e = {x: f.data.$.screenX, y: f.data.$.screenY};
                CKEDITOR.document.on("mousemove", b);
                CKEDITOR.document.on("mouseup", c);
                d = a.getPosition();
                if (CKEDITOR.env.ie6Compat) {
                    var k =
                        q.getChild(0).getFrameDocument();
                    k.on("mousemove", b);
                    k.on("mouseup", c)
                }
                f.data.preventDefault()
            }, a)
        }

        function V(a) {
            var b, c;

            function e(d) {
                var e = "rtl" == i.lang.dir, j = o.width, C = o.height,
                    D = j + (d.data.$.screenX - b) * (e ? -1 : 1) * (a._.moved ? 1 : 2),
                    n = C + (d.data.$.screenY - c) * (a._.moved ? 1 : 2), x = a._.element.getFirst(),
                    x = e && x.getComputedStyle("right"), y = a.getPosition();
                y.y + n > h.height && (n = h.height - y.y);
                if ((e ? x : y.x) + D > h.width) D = h.width - (e ? x : y.x);
                if (f == CKEDITOR.DIALOG_RESIZE_WIDTH || f == CKEDITOR.DIALOG_RESIZE_BOTH) j = Math.max(g.minWidth ||
                    0, D - l);
                if (f == CKEDITOR.DIALOG_RESIZE_HEIGHT || f == CKEDITOR.DIALOG_RESIZE_BOTH) C = Math.max(g.minHeight || 0, n - k);
                a.resize(j, C);
                a._.moved || a.layout();
                d.data.preventDefault()
            }

            function d() {
                CKEDITOR.document.removeListener("mouseup", d);
                CKEDITOR.document.removeListener("mousemove", e);
                j && (j.remove(), j = null);
                if (CKEDITOR.env.ie6Compat) {
                    var a = q.getChild(0).getFrameDocument();
                    a.removeListener("mouseup", d);
                    a.removeListener("mousemove", e)
                }
            }

            var g = a.definition, f = g.resizable;
            if (f != CKEDITOR.DIALOG_RESIZE_NONE) {
                var i = a.getParentEditor(),
                    l, k, h, o, j, n = CKEDITOR.tools.addFunction(function (f) {
                        o = a.getSize();
                        var g = a.parts.contents;
                        g.$.getElementsByTagName("iframe").length && (j = CKEDITOR.dom.element.createFromHtml('<div class="cke_dialog_resize_cover" style="height: 100%; position: absolute; width: 100%;"></div>'), g.append(j));
                        k = o.height - a.parts.contents.getSize("height", !(CKEDITOR.env.gecko || CKEDITOR.env.opera || CKEDITOR.env.ie && CKEDITOR.env.quirks));
                        l = o.width - a.parts.contents.getSize("width", 1);
                        b = f.screenX;
                        c = f.screenY;
                        h = CKEDITOR.document.getWindow().getViewPaneSize();
                        CKEDITOR.document.on("mousemove", e);
                        CKEDITOR.document.on("mouseup", d);
                        CKEDITOR.env.ie6Compat && (g = q.getChild(0).getFrameDocument(), g.on("mousemove", e), g.on("mouseup", d));
                        f.preventDefault && f.preventDefault()
                    });
                a.on("load", function () {
                    var b = "";
                    f == CKEDITOR.DIALOG_RESIZE_WIDTH ? b = " cke_resizer_horizontal" : f == CKEDITOR.DIALOG_RESIZE_HEIGHT && (b = " cke_resizer_vertical");
                    b = CKEDITOR.dom.element.createFromHtml('<div class="cke_resizer' + b + " cke_resizer_" + i.lang.dir + '" title="' + CKEDITOR.tools.htmlEncode(i.lang.common.resize) +
                        '" onmousedown="CKEDITOR.tools.callFunction(' + n + ', event )">' + ("ltr" == i.lang.dir ? "◢" : "◣") + "</div>");
                    a.parts.footer.append(b, 1)
                });
                i.on("destroy", function () {
                    CKEDITOR.tools.removeFunction(n)
                })
            }
        }

        function E(a) {
            a.data.preventDefault(1)
        }

        function J(a) {
            var b = CKEDITOR.document.getWindow(), c = a.config, e = c.dialog_backgroundCoverColor || "white",
                d = c.dialog_backgroundCoverOpacity, g = c.baseFloatZIndex, c = CKEDITOR.tools.genKey(e, d, g),
                f = w[c];
            f ? f.show() : (g = ['<div tabIndex="-1" style="position: ', CKEDITOR.env.ie6Compat ?
                "absolute" : "fixed", "; z-index: ", g, "; top: 0px; left: 0px; ", !CKEDITOR.env.ie6Compat ? "background-color: " + e : "", '" class="cke_dialog_background_cover">'], CKEDITOR.env.ie6Compat && (e = "<html><body style=\\'background-color:" + e + ";\\'></body></html>", g.push('<iframe hidefocus="true" frameborder="0" id="cke_dialog_background_iframe" src="javascript:'), g.push("void((function(){" + encodeURIComponent("document.open();(" + CKEDITOR.tools.fixDomain + ")();document.write( '" + e + "' );document.close();") + "})())"), g.push('" style="position:absolute;left:0;top:0;width:100%;height: 100%;filter: progid:DXImageTransform.Microsoft.Alpha(opacity=0)"></iframe>')),
                g.push("</div>"), f = CKEDITOR.dom.element.createFromHtml(g.join("")), f.setOpacity(void 0 != d ? d : 0.5), f.on("keydown", E), f.on("keypress", E), f.on("keyup", E), f.appendTo(CKEDITOR.document.getBody()), w[c] = f);
            a.focusManager.add(f);
            q = f;
            var a = function () {
                var a = b.getViewPaneSize();
                f.setStyles({width: a.width + "px", height: a.height + "px"})
            }, i = function () {
                var a = b.getScrollPosition(), c = CKEDITOR.dialog._.currentTop;
                f.setStyles({left: a.x + "px", top: a.y + "px"});
                if (c) {
                    do {
                        a = c.getPosition();
                        c.move(a.x, a.y)
                    } while (c = c._.parentDialog)
                }
            };
            F = a;
            b.on("resize", a);
            a();
            (!CKEDITOR.env.mac || !CKEDITOR.env.webkit) && f.focus();
            if (CKEDITOR.env.ie6Compat) {
                var l = function () {
                    i();
                    arguments.callee.prevScrollHandler.apply(this, arguments)
                };
                b.$.setTimeout(function () {
                    l.prevScrollHandler = window.onscroll || function () {
                        };
                    window.onscroll = l
                }, 0);
                i()
            }
        }

        function K(a) {
            q && (a.focusManager.remove(q), a = CKEDITOR.document.getWindow(), q.hide(), a.removeListener("resize", F), CKEDITOR.env.ie6Compat && a.$.setTimeout(function () {
                window.onscroll = window.onscroll && window.onscroll.prevScrollHandler ||
                    null
            }, 0), F = null)
        }

        var r = CKEDITOR.tools.cssLength,
            S = '<div class="cke_reset_all {editorId} {editorDialogClass} {hidpi}" dir="{langDir}" lang="{langCode}" role="dialog" aria-labelledby="cke_dialog_title_{id}"><table class="cke_dialog ' + CKEDITOR.env.cssClass + ' cke_{langDir}" style="position:absolute" role="presentation"><tr><td role="presentation"><div class="cke_dialog_body" role="presentation"><div id="cke_dialog_title_{id}" class="cke_dialog_title" role="presentation"></div><a id="cke_dialog_close_button_{id}" class="cke_dialog_close_button" href="javascript:void(0)" title="{closeTitle}" role="button"><span class="cke_label">X</span></a><div id="cke_dialog_tabs_{id}" class="cke_dialog_tabs" role="tablist"></div><table class="cke_dialog_contents" role="presentation"><tr><td id="cke_dialog_contents_{id}" class="cke_dialog_contents_body" role="presentation"></td></tr><tr><td id="cke_dialog_footer_{id}" class="cke_dialog_footer" role="presentation"></td></tr></table></div></td></tr></table></div>';
        CKEDITOR.dialog = function (a, b) {
            function c() {
                var a = m._.focusList;
                a.sort(function (a, b) {
                    return a.tabIndex != b.tabIndex ? b.tabIndex - a.tabIndex : a.focusIndex - b.focusIndex
                });
                for (var b = a.length, c = 0; c < b; c++)a[c].focusIndex = c
            }

            function e(a) {
                var b = m._.focusList, a = a || 0;
                if (!(1 > b.length)) {
                    var c = m._.currentFocusIndex;
                    try {
                        b[c].getInputElement().$.blur()
                    } catch (f) {
                    }
                    for (var d = c = (c + a + b.length) % b.length; a && !b[d].isFocusable() && !(d = (d + a + b.length) % b.length, d == c););
                    b[d].focus();
                    "text" == b[d].type && b[d].select()
                }
            }

            function d(b) {
                if (m ==
                    CKEDITOR.dialog._.currentTop) {
                    var c = b.data.getKeystroke(), d = "rtl" == a.lang.dir;
                    o = j = 0;
                    if (9 == c || c == CKEDITOR.SHIFT + 9) c = c == CKEDITOR.SHIFT + 9, m._.tabBarMode ? (c = c ? t.call(m) : u.call(m), m.selectPage(c), m._.tabs[c][0].focus()) : e(c ? -1 : 1), o = 1; else if (c == CKEDITOR.ALT + 121 && !m._.tabBarMode && 1 < m.getPageCount()) m._.tabBarMode = !0, m._.tabs[m._.currentTabId][0].focus(), o = 1; else if ((37 == c || 39 == c) && m._.tabBarMode) c = c == (d ? 39 : 37) ? t.call(m) : u.call(m), m.selectPage(c), m._.tabs[c][0].focus(), o = 1; else if ((13 == c || 32 == c) && m._.tabBarMode) this.selectPage(this._.currentTabId),
                        this._.tabBarMode = !1, this._.currentFocusIndex = -1, e(1), o = 1; else if (13 == c) {
                        c = b.data.getTarget();
                        if (!c.is("a", "button", "select", "textarea") && (!c.is("input") || "button" != c.$.type)) (c = this.getButton("ok")) && CKEDITOR.tools.setTimeout(c.click, 0, c), o = 1;
                        j = 1
                    } else if (27 == c) (c = this.getButton("cancel")) ? CKEDITOR.tools.setTimeout(c.click, 0, c) : !1 !== this.fire("cancel", {hide: !0}).hide && this.hide(), j = 1; else return;
                    g(b)
                }
            }

            function g(a) {
                o ? a.data.preventDefault(1) : j && a.data.stopPropagation()
            }

            var f = CKEDITOR.dialog._.dialogDefinitions[b],
                i = CKEDITOR.tools.clone(W), l = a.config.dialog_buttonsOrder || "OS", k = a.lang.dir, h = {}, o, j;
            ("OS" == l && CKEDITOR.env.mac || "rtl" == l && "ltr" == k || "ltr" == l && "rtl" == k) && i.buttons.reverse();
            f = CKEDITOR.tools.extend(f(a), i);
            f = CKEDITOR.tools.clone(f);
            f = new L(this, f);
            i = R(a);
            this._ = {
                editor: a,
                element: i.element,
                name: b,
                contentSize: {width: 0, height: 0},
                size: {width: 0, height: 0},
                contents: {},
                buttons: {},
                accessKeyMap: {},
                tabs: {},
                tabIdList: [],
                currentTabId: null,
                currentTabIndex: null,
                pageCount: 0,
                lastTab: null,
                tabBarMode: !1,
                focusList: [],
                currentFocusIndex: 0,
                hasFocus: !1
            };
            this.parts = i.parts;
            CKEDITOR.tools.setTimeout(function () {
                a.fire("ariaWidget", this.parts.contents)
            }, 0, this);
            i = {position: CKEDITOR.env.ie6Compat ? "absolute" : "fixed", top: 0, visibility: "hidden"};
            i["rtl" == k ? "right" : "left"] = 0;
            this.parts.dialog.setStyles(i);
            CKEDITOR.event.call(this);
            this.definition = f = CKEDITOR.fire("dialogDefinition", {name: b, definition: f}, a).definition;
            if (!("removeDialogTabs" in a._) && a.config.removeDialogTabs) {
                i = a.config.removeDialogTabs.split(";");
                for (k = 0; k <
                i.length; k++)if (l = i[k].split(":"), 2 == l.length) {
                    var n = l[0];
                    h[n] || (h[n] = []);
                    h[n].push(l[1])
                }
                a._.removeDialogTabs = h
            }
            if (a._.removeDialogTabs && (h = a._.removeDialogTabs[b]))for (k = 0; k < h.length; k++)f.removeContents(h[k]);
            if (f.onLoad) this.on("load", f.onLoad);
            if (f.onShow) this.on("show", f.onShow);
            if (f.onHide) this.on("hide", f.onHide);
            if (f.onOk) this.on("ok", function (b) {
                a.fire("saveSnapshot");
                setTimeout(function () {
                    a.fire("saveSnapshot")
                }, 0);
                !1 === f.onOk.call(this, b) && (b.data.hide = !1)
            });
            if (f.onCancel) this.on("cancel",
                function (a) {
                    !1 === f.onCancel.call(this, a) && (a.data.hide = !1)
                });
            var m = this, p = function (a) {
                var b = m._.contents, c = !1, d;
                for (d in b)for (var f in b[d])if (c = a.call(this, b[d][f]))return
            };
            this.on("ok", function (a) {
                p(function (b) {
                    if (b.validate) {
                        var c = b.validate(this), d = "string" == typeof c || !1 === c;
                        d && (a.data.hide = !1, a.stop());
                        P.call(b, !d, "string" == typeof c ? c : void 0);
                        return d
                    }
                })
            }, this, null, 0);
            this.on("cancel", function (b) {
                p(function (c) {
                    if (c.isChanged())return !a.config.dialog_noConfirmCancel && !confirm(a.lang.common.confirmCancel) &&
                    (b.data.hide = !1), !0
                })
            }, this, null, 0);
            this.parts.close.on("click", function (a) {
                !1 !== this.fire("cancel", {hide: !0}).hide && this.hide();
                a.data.preventDefault()
            }, this);
            this.changeFocus = e;
            var v = this._.element;
            a.focusManager.add(v, 1);
            this.on("show", function () {
                v.on("keydown", d, this);
                if (CKEDITOR.env.opera || CKEDITOR.env.gecko) v.on("keypress", g, this)
            });
            this.on("hide", function () {
                v.removeListener("keydown", d);
                (CKEDITOR.env.opera || CKEDITOR.env.gecko) && v.removeListener("keypress", g);
                p(function (a) {
                    Q.apply(a)
                })
            });
            this.on("iframeAdded",
                function (a) {
                    (new CKEDITOR.dom.document(a.data.iframe.$.contentWindow.document)).on("keydown", d, this, null, 0)
                });
            this.on("show", function () {
                c();
                if (a.config.dialog_startupFocusTab && 1 < m._.pageCount) m._.tabBarMode = !0, m._.tabs[m._.currentTabId][0].focus(); else if (!this._.hasFocus)if (this._.currentFocusIndex = -1, f.onFocus) {
                    var b = f.onFocus.call(this);
                    b && b.focus()
                } else e(1)
            }, this, null, 4294967295);
            if (CKEDITOR.env.ie6Compat) this.on("load", function () {
                    var a = this.getElement(), b = a.getFirst();
                    b.remove();
                    b.appendTo(a)
                },
                this);
            U(this);
            V(this);
            (new CKEDITOR.dom.text(f.title, CKEDITOR.document)).appendTo(this.parts.title);
            for (k = 0; k < f.contents.length; k++)(h = f.contents[k]) && this.addPage(h);
            this.parts.tabs.on("click", function (a) {
                var b = a.data.getTarget();
                b.hasClass("cke_dialog_tab") && (b = b.$.id, this.selectPage(b.substring(4, b.lastIndexOf("_"))), this._.tabBarMode && (this._.tabBarMode = !1, this._.currentFocusIndex = -1, e(1)), a.data.preventDefault())
            }, this);
            k = [];
            h = CKEDITOR.dialog._.uiElementBuilders.hbox.build(this, {
                type: "hbox",
                className: "cke_dialog_footer_buttons", widths: [], children: f.buttons
            }, k).getChild();
            this.parts.footer.setHtml(k.join(""));
            for (k = 0; k < h.length; k++)this._.buttons[h[k].id] = h[k]
        };
        CKEDITOR.dialog.prototype = {
            destroy: function () {
                this.hide();
                this._.element.remove()
            }, resize: function () {
                return function (a, b) {
                    if (!this._.contentSize || !(this._.contentSize.width == a && this._.contentSize.height == b)) CKEDITOR.dialog.fire("resize", {
                        dialog: this,
                        width: a,
                        height: b
                    }, this._.editor), this.fire("resize", {width: a, height: b}, this._.editor),
                        this.parts.contents.setStyles({
                            width: a + "px",
                            height: b + "px"
                        }), "rtl" == this._.editor.lang.dir && this._.position && (this._.position.x = CKEDITOR.document.getWindow().getViewPaneSize().width - this._.contentSize.width - parseInt(this._.element.getFirst().getStyle("right"), 10)), this._.contentSize = {
                        width: a,
                        height: b
                    }
                }
            }(), getSize: function () {
                var a = this._.element.getFirst();
                return {width: a.$.offsetWidth || 0, height: a.$.offsetHeight || 0}
            }, move: function (a, b, c) {
                var e = this._.element.getFirst(), d = "rtl" == this._.editor.lang.dir,
                    g = "fixed" == e.getComputedStyle("position");
                CKEDITOR.env.ie && e.setStyle("zoom", "100%");
                if (!g || !this._.position || !(this._.position.x == a && this._.position.y == b)) this._.position = {
                    x: a,
                    y: b
                }, g || (g = CKEDITOR.document.getWindow().getScrollPosition(), a += g.x, b += g.y), d && (g = this.getSize(), a = CKEDITOR.document.getWindow().getViewPaneSize().width - g.width - a), b = {top: (0 < b ? b : 0) + "px"}, b[d ? "right" : "left"] = (0 < a ? a : 0) + "px", e.setStyles(b), c && (this._.moved = 1)
            }, getPosition: function () {
                return CKEDITOR.tools.extend({}, this._.position)
            },
            show: function () {
                var a = this._.element, b = this.definition;
                !a.getParent() || !a.getParent().equals(CKEDITOR.document.getBody()) ? a.appendTo(CKEDITOR.document.getBody()) : a.setStyle("display", "block");
                if (CKEDITOR.env.gecko && 10900 > CKEDITOR.env.version) {
                    var c = this.parts.dialog;
                    c.setStyle("position", "absolute");
                    setTimeout(function () {
                        c.setStyle("position", "fixed")
                    }, 0)
                }
                this.resize(this._.contentSize && this._.contentSize.width || b.width || b.minWidth, this._.contentSize && this._.contentSize.height || b.height || b.minHeight);
                this.reset();
                this.selectPage(this.definition.contents[0].id);
                null === CKEDITOR.dialog._.currentZIndex && (CKEDITOR.dialog._.currentZIndex = this._.editor.config.baseFloatZIndex);
                this._.element.getFirst().setStyle("z-index", CKEDITOR.dialog._.currentZIndex += 10);
                null === CKEDITOR.dialog._.currentTop ? (CKEDITOR.dialog._.currentTop = this, this._.parentDialog = null, J(this._.editor)) : (this._.parentDialog = CKEDITOR.dialog._.currentTop, this._.parentDialog.getElement().getFirst().$.style.zIndex -= Math.floor(this._.editor.config.baseFloatZIndex /
                    2), CKEDITOR.dialog._.currentTop = this);
                a.on("keydown", M);
                a.on(CKEDITOR.env.opera ? "keypress" : "keyup", N);
                this._.hasFocus = !1;
                for (var e in b.contents)if (b.contents[e]) {
                    var a = b.contents[e], d = this._.tabs[a.id], g = a.requiredContent, f = 0;
                    if (d) {
                        for (var i in this._.contents[a.id]) {
                            var l = this._.contents[a.id][i];
                            "hbox" == l.type || ("vbox" == l.type || !l.getInputElement()) || (l.requiredContent && !this._.editor.activeFilter.check(l.requiredContent) ? l.disable() : (l.enable(), f++))
                        }
                        !f || g && !this._.editor.activeFilter.check(g) ?
                            d[0].addClass("cke_dialog_tab_disabled") : d[0].removeClass("cke_dialog_tab_disabled")
                    }
                }
                CKEDITOR.tools.setTimeout(function () {
                    this.layout();
                    T(this);
                    this.parts.dialog.setStyle("visibility", "");
                    this.fireOnce("load", {});
                    CKEDITOR.ui.fire("ready", this);
                    this.fire("show", {});
                    this._.editor.fire("dialogShow", this);
                    this._.parentDialog || this._.editor.focusManager.lock();
                    this.foreach(function (a) {
                        a.setInitValue && a.setInitValue()
                    })
                }, 100, this)
            }, layout: function () {
                var a = this.parts.dialog, b = this.getSize(), c = CKEDITOR.document.getWindow().getViewPaneSize(),
                    e = (c.width - b.width) / 2, d = (c.height - b.height) / 2;
                CKEDITOR.env.ie6Compat || (b.height + (0 < d ? d : 0) > c.height || b.width + (0 < e ? e : 0) > c.width ? a.setStyle("position", "absolute") : a.setStyle("position", "fixed"));
                this.move(this._.moved ? this._.position.x : e, this._.moved ? this._.position.y : d)
            }, foreach: function (a) {
                for (var b in this._.contents)for (var c in this._.contents[b])a.call(this, this._.contents[b][c]);
                return this
            }, reset: function () {
                var a = function (a) {
                    a.reset && a.reset(1)
                };
                return function () {
                    this.foreach(a);
                    return this
                }
            }(),
            setupContent: function () {
                var a = arguments;
                this.foreach(function (b) {
                    b.setup && b.setup.apply(b, a)
                })
            }, commitContent: function () {
                var a = arguments;
                this.foreach(function (b) {
                    CKEDITOR.env.ie && this._.currentFocusIndex == b.focusIndex && b.getInputElement().$.blur();
                    b.commit && b.commit.apply(b, a)
                })
            }, hide: function () {
                if (this.parts.dialog.isVisible()) {
                    this.fire("hide", {});
                    this._.editor.fire("dialogHide", this);
                    this.selectPage(this._.tabIdList[0]);
                    var a = this._.element;
                    a.setStyle("display", "none");
                    this.parts.dialog.setStyle("visibility",
                        "hidden");
                    for (X(this); CKEDITOR.dialog._.currentTop != this;)CKEDITOR.dialog._.currentTop.hide();
                    if (this._.parentDialog) {
                        var b = this._.parentDialog.getElement().getFirst();
                        b.setStyle("z-index", parseInt(b.$.style.zIndex, 10) + Math.floor(this._.editor.config.baseFloatZIndex / 2))
                    } else K(this._.editor);
                    if (CKEDITOR.dialog._.currentTop = this._.parentDialog) CKEDITOR.dialog._.currentZIndex -= 10; else {
                        CKEDITOR.dialog._.currentZIndex = null;
                        a.removeListener("keydown", M);
                        a.removeListener(CKEDITOR.env.opera ? "keypress" : "keyup",
                            N);
                        var c = this._.editor;
                        c.focus();
                        setTimeout(function () {
                            c.focusManager.unlock()
                        }, 0)
                    }
                    delete this._.parentDialog;
                    this.foreach(function (a) {
                        a.resetInitValue && a.resetInitValue()
                    })
                }
            }, addPage: function (a) {
                if (!a.requiredContent || this._.editor.filter.check(a.requiredContent)) {
                    for (var b = [], c = a.label ? ' title="' + CKEDITOR.tools.htmlEncode(a.label) + '"' : "",
                             e = CKEDITOR.dialog._.uiElementBuilders.vbox.build(this, {
                                 type: "vbox",
                                 className: "cke_dialog_page_contents",
                                 children: a.elements,
                                 expand: !!a.expand,
                                 padding: a.padding,
                                 style: a.style || "width: 100%;"
                             }, b), d = this._.contents[a.id] = {}, g = e.getChild(),
                             f = 0; e = g.shift();)!e.notAllowed && ("hbox" != e.type && "vbox" != e.type) && f++, d[e.id] = e, "function" == typeof e.getChild && g.push.apply(g, e.getChild());
                    f || (a.hidden = !0);
                    b = CKEDITOR.dom.element.createFromHtml(b.join(""));
                    b.setAttribute("role", "tabpanel");
                    e = CKEDITOR.env;
                    d = "cke_" + a.id + "_" + CKEDITOR.tools.getNextNumber();
                    c = CKEDITOR.dom.element.createFromHtml(['<a class="cke_dialog_tab"', 0 < this._.pageCount ? " cke_last" : "cke_first", c, a.hidden ?
                        ' style="display:none"' : "", ' id="', d, '"', e.gecko && 10900 <= e.version && !e.hc ? "" : ' href="javascript:void(0)"', ' tabIndex="-1" hidefocus="true" role="tab">', a.label, "</a>"].join(""));
                    b.setAttribute("aria-labelledby", d);
                    this._.tabs[a.id] = [c, b];
                    this._.tabIdList.push(a.id);
                    !a.hidden && this._.pageCount++;
                    this._.lastTab = c;
                    this.updateStyle();
                    b.setAttribute("name", a.id);
                    b.appendTo(this.parts.contents);
                    c.unselectable();
                    this.parts.tabs.append(c);
                    a.accessKey && (O(this, this, "CTRL+" + a.accessKey, Y, Z), this._.accessKeyMap["CTRL+" +
                    a.accessKey] = a.id)
                }
            }, selectPage: function (a) {
                if (this._.currentTabId != a && !this._.tabs[a][0].hasClass("cke_dialog_tab_disabled") && !0 !== this.fire("selectPage", {
                        page: a,
                        currentPage: this._.currentTabId
                    })) {
                    for (var b in this._.tabs) {
                        var c = this._.tabs[b][0], e = this._.tabs[b][1];
                        b != a && (c.removeClass("cke_dialog_tab_selected"), e.hide());
                        e.setAttribute("aria-hidden", b != a)
                    }
                    var d = this._.tabs[a];
                    d[0].addClass("cke_dialog_tab_selected");
                    CKEDITOR.env.ie6Compat || CKEDITOR.env.ie7Compat ? (G(d[1]), d[1].show(), setTimeout(function () {
                        G(d[1],
                            1)
                    }, 0)) : d[1].show();
                    this._.currentTabId = a;
                    this._.currentTabIndex = CKEDITOR.tools.indexOf(this._.tabIdList, a)
                }
            }, updateStyle: function () {
                this.parts.dialog[(1 === this._.pageCount ? "add" : "remove") + "Class"]("cke_single_page")
            }, hidePage: function (a) {
                var b = this._.tabs[a] && this._.tabs[a][0];
                b && (1 != this._.pageCount && b.isVisible()) && (a == this._.currentTabId && this.selectPage(t.call(this)), b.hide(), this._.pageCount--, this.updateStyle())
            }, showPage: function (a) {
                if (a = this._.tabs[a] && this._.tabs[a][0]) a.show(), this._.pageCount++,
                    this.updateStyle()
            }, getElement: function () {
                return this._.element
            }, getName: function () {
                return this._.name
            }, getContentElement: function (a, b) {
                var c = this._.contents[a];
                return c && c[b]
            }, getValueOf: function (a, b) {
                return this.getContentElement(a, b).getValue()
            }, setValueOf: function (a, b, c) {
                return this.getContentElement(a, b).setValue(c)
            }, getButton: function (a) {
                return this._.buttons[a]
            }, click: function (a) {
                return this._.buttons[a].click()
            }, disableButton: function (a) {
                return this._.buttons[a].disable()
            }, enableButton: function (a) {
                return this._.buttons[a].enable()
            },
            getPageCount: function () {
                return this._.pageCount
            }, getParentEditor: function () {
                return this._.editor
            }, getSelectedElement: function () {
                return this.getParentEditor().getSelection().getSelectedElement()
            }, addFocusable: function (a, b) {
                if ("undefined" == typeof b) b = this._.focusList.length, this._.focusList.push(new H(this, a, b)); else {
                    this._.focusList.splice(b, 0, new H(this, a, b));
                    for (var c = b + 1; c < this._.focusList.length; c++)this._.focusList[c].focusIndex++
                }
            }
        };
        CKEDITOR.tools.extend(CKEDITOR.dialog, {
            add: function (a, b) {
                if (!this._.dialogDefinitions[a] ||
                    "function" == typeof b) this._.dialogDefinitions[a] = b
            }, exists: function (a) {
                return !!this._.dialogDefinitions[a]
            }, getCurrent: function () {
                return CKEDITOR.dialog._.currentTop
            }, isTabEnabled: function (a, b, c) {
                a = a.config.removeDialogTabs;
                return !(a && a.match(RegExp("(?:^|;)" + b + ":" + c + "(?:$|;)", "i")))
            }, okButton: function () {
                var a = function (a, c) {
                    c = c || {};
                    return CKEDITOR.tools.extend({
                        id: "ok",
                        type: "button",
                        label: a.lang.common.ok,
                        "class": "cke_dialog_ui_button_ok",
                        onClick: function (a) {
                            a = a.data.dialog;
                            !1 !== a.fire("ok", {hide: !0}).hide &&
                            a.hide()
                        }
                    }, c, !0)
                };
                a.type = "button";
                a.override = function (b) {
                    return CKEDITOR.tools.extend(function (c) {
                        return a(c, b)
                    }, {type: "button"}, !0)
                };
                return a
            }(), cancelButton: function () {
                var a = function (a, c) {
                    c = c || {};
                    return CKEDITOR.tools.extend({
                        id: "cancel",
                        type: "button",
                        label: a.lang.common.cancel,
                        "class": "cke_dialog_ui_button_cancel",
                        onClick: function (a) {
                            a = a.data.dialog;
                            !1 !== a.fire("cancel", {hide: !0}).hide && a.hide()
                        }
                    }, c, !0)
                };
                a.type = "button";
                a.override = function (b) {
                    return CKEDITOR.tools.extend(function (c) {
                        return a(c,
                            b)
                    }, {type: "button"}, !0)
                };
                return a
            }(), addUIElement: function (a, b) {
                this._.uiElementBuilders[a] = b
            }
        });
        CKEDITOR.dialog._ = {uiElementBuilders: {}, dialogDefinitions: {}, currentTop: null, currentZIndex: null};
        CKEDITOR.event.implementOn(CKEDITOR.dialog);
        CKEDITOR.event.implementOn(CKEDITOR.dialog.prototype);
        var W = {
            resizable: CKEDITOR.DIALOG_RESIZE_BOTH,
            minWidth: 600,
            minHeight: 400,
            buttons: [CKEDITOR.dialog.okButton, CKEDITOR.dialog.cancelButton]
        }, z = function (a, b, c) {
            for (var e = 0, d; d = a[e]; e++)if (d.id == b || c && d[c] && (d = z(d[c],
                    b, c)))return d;
            return null
        }, A = function (a, b, c, e, d) {
            if (c) {
                for (var g = 0, f; f = a[g]; g++) {
                    if (f.id == c)return a.splice(g, 0, b), b;
                    if (e && f[e] && (f = A(f[e], b, c, e, !0)))return f
                }
                if (d)return null
            }
            a.push(b);
            return b
        }, B = function (a, b, c) {
            for (var e = 0, d; d = a[e]; e++) {
                if (d.id == b)return a.splice(e, 1);
                if (c && d[c] && (d = B(d[c], b, c)))return d
            }
            return null
        }, L = function (a, b) {
            this.dialog = a;
            for (var c = b.contents, e = 0, d; d = c[e]; e++)c[e] = d && new I(a, d);
            CKEDITOR.tools.extend(this, b)
        };
        L.prototype = {
            getContents: function (a) {
                return z(this.contents,
                    a)
            }, getButton: function (a) {
                return z(this.buttons, a)
            }, addContents: function (a, b) {
                return A(this.contents, a, b)
            }, addButton: function (a, b) {
                return A(this.buttons, a, b)
            }, removeContents: function (a) {
                B(this.contents, a)
            }, removeButton: function (a) {
                B(this.buttons, a)
            }
        };
        I.prototype = {
            get: function (a) {
                return z(this.elements, a, "children")
            }, add: function (a, b) {
                return A(this.elements, a, b, "children")
            }, remove: function (a) {
                B(this.elements, a, "children")
            }
        };
        var F, w = {}, q, s = {}, M = function (a) {
            var b = a.data.$.ctrlKey || a.data.$.metaKey, c =
                a.data.$.altKey, e = a.data.$.shiftKey, d = String.fromCharCode(a.data.$.keyCode);
            if ((b = s[(b ? "CTRL+" : "") + (c ? "ALT+" : "") + (e ? "SHIFT+" : "") + d]) && b.length) b = b[b.length - 1], b.keydown && b.keydown.call(b.uiElement, b.dialog, b.key), a.data.preventDefault()
        }, N = function (a) {
            var b = a.data.$.ctrlKey || a.data.$.metaKey, c = a.data.$.altKey, e = a.data.$.shiftKey,
                d = String.fromCharCode(a.data.$.keyCode);
            if ((b = s[(b ? "CTRL+" : "") + (c ? "ALT+" : "") + (e ? "SHIFT+" : "") + d]) && b.length) b = b[b.length - 1], b.keyup && (b.keyup.call(b.uiElement, b.dialog, b.key),
                a.data.preventDefault())
        }, O = function (a, b, c, e, d) {
            (s[c] || (s[c] = [])).push({
                uiElement: a,
                dialog: b,
                key: c,
                keyup: d || a.accessKeyUp,
                keydown: e || a.accessKeyDown
            })
        }, X = function (a) {
            for (var b in s) {
                for (var c = s[b],
                         e = c.length - 1; 0 <= e; e--)(c[e].dialog == a || c[e].uiElement == a) && c.splice(e, 1);
                0 === c.length && delete s[b]
            }
        }, Z = function (a, b) {
            a._.accessKeyMap[b] && a.selectPage(a._.accessKeyMap[b])
        }, Y = function () {
        };
        (function () {
            CKEDITOR.ui.dialog = {
                uiElement: function (a, b, c, e, d, g, f) {
                    if (!(4 > arguments.length)) {
                        var i = (e.call ? e(b) : e) || "div",
                            l = ["<", i, " "], k = (d && d.call ? d(b) : d) || {}, h = (g && g.call ? g(b) : g) || {},
                            o = (f && f.call ? f.call(this, a, b) : f) || "",
                            j = this.domId = h.id || CKEDITOR.tools.getNextId() + "_uiElement";
                        this.id = b.id;
                        b.requiredContent && !a.getParentEditor().filter.check(b.requiredContent) && (k.display = "none", this.notAllowed = !0);
                        h.id = j;
                        var n = {};
                        b.type && (n["cke_dialog_ui_" + b.type] = 1);
                        b.className && (n[b.className] = 1);
                        b.disabled && (n.cke_disabled = 1);
                        for (var m = h["class"] && h["class"].split ? h["class"].split(" ") : [],
                                 j = 0; j < m.length; j++)m[j] && (n[m[j]] = 1);
                        m = [];
                        for (j in n)m.push(j);
                        h["class"] = m.join(" ");
                        b.title && (h.title = b.title);
                        n = (b.style || "").split(";");
                        b.align && (m = b.align, k["margin-left"] = "left" == m ? 0 : "auto", k["margin-right"] = "right" == m ? 0 : "auto");
                        for (j in k)n.push(j + ":" + k[j]);
                        b.hidden && n.push("display:none");
                        for (j = n.length - 1; 0 <= j; j--)"" === n[j] && n.splice(j, 1);
                        0 < n.length && (h.style = (h.style ? h.style + "; " : "") + n.join("; "));
                        for (j in h)l.push(j + '="' + CKEDITOR.tools.htmlEncode(h[j]) + '" ');
                        l.push(">", o, "</", i, ">");
                        c.push(l.join(""));
                        (this._ || (this._ = {})).dialog =
                            a;
                        "boolean" == typeof b.isChanged && (this.isChanged = function () {
                            return b.isChanged
                        });
                        "function" == typeof b.isChanged && (this.isChanged = b.isChanged);
                        "function" == typeof b.setValue && (this.setValue = CKEDITOR.tools.override(this.setValue, function (a) {
                            return function (c) {
                                a.call(this, b.setValue.call(this, c))
                            }
                        }));
                        "function" == typeof b.getValue && (this.getValue = CKEDITOR.tools.override(this.getValue, function (a) {
                            return function () {
                                return b.getValue.call(this, a.call(this))
                            }
                        }));
                        CKEDITOR.event.implementOn(this);
                        this.registerEvents(b);
                        this.accessKeyUp && (this.accessKeyDown && b.accessKey) && O(this, a, "CTRL+" + b.accessKey);
                        var p = this;
                        a.on("load", function () {
                            var b = p.getInputElement();
                            if (b) {
                                var c = p.type in {
                                    checkbox: 1,
                                    ratio: 1
                                } && CKEDITOR.env.ie && CKEDITOR.env.version < 8 ? "cke_dialog_ui_focused" : "";
                                b.on("focus", function () {
                                    a._.tabBarMode = false;
                                    a._.hasFocus = true;
                                    p.fire("focus");
                                    c && this.addClass(c)
                                });
                                b.on("blur", function () {
                                    p.fire("blur");
                                    c && this.removeClass(c)
                                })
                            }
                        });
                        CKEDITOR.tools.extend(this, b);
                        this.keyboardFocusable && (this.tabIndex = b.tabIndex ||
                            0, this.focusIndex = a._.focusList.push(this) - 1, this.on("focus", function () {
                            a._.currentFocusIndex = p.focusIndex
                        }))
                    }
                }, hbox: function (a, b, c, e, d) {
                    if (!(4 > arguments.length)) {
                        this._ || (this._ = {});
                        var g = this._.children = b, f = d && d.widths || null, i = d && d.height || null, l,
                            k = {role: "presentation"};
                        d && d.align && (k.align = d.align);
                        CKEDITOR.ui.dialog.uiElement.call(this, a, d || {type: "hbox"}, e, "table", {}, k, function () {
                            var a = ['<tbody><tr class="cke_dialog_ui_hbox">'];
                            for (l = 0; l < c.length; l++) {
                                var b = "cke_dialog_ui_hbox_child", e = [];
                                0 ===
                                l && (b = "cke_dialog_ui_hbox_first");
                                l == c.length - 1 && (b = "cke_dialog_ui_hbox_last");
                                a.push('<td class="', b, '" role="presentation" ');
                                f ? f[l] && e.push("width:" + r(f[l])) : e.push("width:" + Math.floor(100 / c.length) + "%");
                                i && e.push("height:" + r(i));
                                d && void 0 != d.padding && e.push("padding:" + r(d.padding));
                                CKEDITOR.env.ie && (CKEDITOR.env.quirks && g[l].align) && e.push("text-align:" + g[l].align);
                                0 < e.length && a.push('style="' + e.join("; ") + '" ');
                                a.push(">", c[l], "</td>")
                            }
                            a.push("</tr></tbody>");
                            return a.join("")
                        })
                    }
                }, vbox: function (a,
                                   b, c, e, d) {
                    if (!(3 > arguments.length)) {
                        this._ || (this._ = {});
                        var g = this._.children = b, f = d && d.width || null, i = d && d.heights || null;
                        CKEDITOR.ui.dialog.uiElement.call(this, a, d || {type: "vbox"}, e, "div", null, {role: "presentation"}, function () {
                            var b = ['<table role="presentation" cellspacing="0" border="0" '];
                            b.push('style="');
                            d && d.expand && b.push("height:100%;");
                            b.push("width:" + r(f || "100%"), ";");
                            CKEDITOR.env.webkit && b.push("float:none;");
                            b.push('"');
                            b.push('align="', CKEDITOR.tools.htmlEncode(d && d.align || ("ltr" == a.getParentEditor().lang.dir ?
                                    "left" : "right")), '" ');
                            b.push("><tbody>");
                            for (var e = 0; e < c.length; e++) {
                                var h = [];
                                b.push('<tr><td role="presentation" ');
                                f && h.push("width:" + r(f || "100%"));
                                i ? h.push("height:" + r(i[e])) : d && d.expand && h.push("height:" + Math.floor(100 / c.length) + "%");
                                d && void 0 != d.padding && h.push("padding:" + r(d.padding));
                                CKEDITOR.env.ie && (CKEDITOR.env.quirks && g[e].align) && h.push("text-align:" + g[e].align);
                                0 < h.length && b.push('style="', h.join("; "), '" ');
                                b.push(' class="cke_dialog_ui_vbox_child">', c[e], "</td></tr>")
                            }
                            b.push("</tbody></table>");
                            return b.join("")
                        })
                    }
                }
            }
        })();
        CKEDITOR.ui.dialog.uiElement.prototype = {
            getElement: function () {
                return CKEDITOR.document.getById(this.domId)
            }, getInputElement: function () {
                return this.getElement()
            }, getDialog: function () {
                return this._.dialog
            }, setValue: function (a, b) {
                this.getInputElement().setValue(a);
                !b && this.fire("change", {value: a});
                return this
            }, getValue: function () {
                return this.getInputElement().getValue()
            }, isChanged: function () {
                return !1
            }, selectParentTab: function () {
                for (var a = this.getInputElement(); (a = a.getParent()) &&
                -1 == a.$.className.search("cke_dialog_page_contents"););
                if (!a)return this;
                a = a.getAttribute("name");
                this._.dialog._.currentTabId != a && this._.dialog.selectPage(a);
                return this
            }, focus: function () {
                this.selectParentTab().getInputElement().focus();
                return this
            }, registerEvents: function (a) {
                var b = /^on([A-Z]\w+)/, c, e = function (a, b, c, d) {
                    b.on("load", function () {
                        a.getInputElement().on(c, d, a)
                    })
                }, d;
                for (d in a)if (c = d.match(b)) this.eventProcessors[d] ? this.eventProcessors[d].call(this, this._.dialog, a[d]) : e(this, this._.dialog,
                    c[1].toLowerCase(), a[d]);
                return this
            }, eventProcessors: {
                onLoad: function (a, b) {
                    a.on("load", b, this)
                }, onShow: function (a, b) {
                    a.on("show", b, this)
                }, onHide: function (a, b) {
                    a.on("hide", b, this)
                }
            }, accessKeyDown: function () {
                this.focus()
            }, accessKeyUp: function () {
            }, disable: function () {
                var a = this.getElement();
                this.getInputElement().setAttribute("disabled", "true");
                a.addClass("cke_disabled")
            }, enable: function () {
                var a = this.getElement();
                this.getInputElement().removeAttribute("disabled");
                a.removeClass("cke_disabled")
            }, isEnabled: function () {
                return !this.getElement().hasClass("cke_disabled")
            },
            isVisible: function () {
                return this.getInputElement().isVisible()
            }, isFocusable: function () {
                return !this.isEnabled() || !this.isVisible() ? !1 : !0
            }
        };
        CKEDITOR.ui.dialog.hbox.prototype = CKEDITOR.tools.extend(new CKEDITOR.ui.dialog.uiElement, {
            getChild: function (a) {
                if (1 > arguments.length)return this._.children.concat();
                a.splice || (a = [a]);
                return 2 > a.length ? this._.children[a[0]] : this._.children[a[0]] && this._.children[a[0]].getChild ? this._.children[a[0]].getChild(a.slice(1, a.length)) : null
            }
        }, !0);
        CKEDITOR.ui.dialog.vbox.prototype =
            new CKEDITOR.ui.dialog.hbox;
        (function () {
            var a = {
                build: function (a, c, e) {
                    for (var d = c.children, g, f = [], i = [], l = 0; l < d.length && (g = d[l]); l++) {
                        var k = [];
                        f.push(k);
                        i.push(CKEDITOR.dialog._.uiElementBuilders[g.type].build(a, g, k))
                    }
                    return new CKEDITOR.ui.dialog[c.type](a, i, f, e, c)
                }
            };
            CKEDITOR.dialog.addUIElement("hbox", a);
            CKEDITOR.dialog.addUIElement("vbox", a)
        })();
        CKEDITOR.dialogCommand = function (a, b) {
            this.dialogName = a;
            CKEDITOR.tools.extend(this, b, !0)
        };
        CKEDITOR.dialogCommand.prototype = {
            exec: function (a) {
                CKEDITOR.env.opera ?
                    CKEDITOR.tools.setTimeout(function () {
                        a.openDialog(this.dialogName)
                    }, 0, this) : a.openDialog(this.dialogName)
            }, canUndo: !1, editorFocus: 1
        };
        (function () {
            var a = /^([a]|[^a])+$/, b = /^\d*$/, c = /^\d*(?:\.\d+)?$/, e = /^(((\d*(\.\d+))|(\d*))(px|\%)?)?$/,
                d = /^(((\d*(\.\d+))|(\d*))(px|em|ex|in|cm|mm|pt|pc|\%)?)?$/i, g = /^(\s*[\w-]+\s*:\s*[^:;]+(?:;|$))*$/;
            CKEDITOR.VALIDATE_OR = 1;
            CKEDITOR.VALIDATE_AND = 2;
            CKEDITOR.dialog.validate = {
                functions: function () {
                    var a = arguments;
                    return function () {
                        var b = this && this.getValue ? this.getValue() :
                            a[0], c = void 0, d = CKEDITOR.VALIDATE_AND, e = [], g;
                        for (g = 0; g < a.length; g++)if ("function" == typeof a[g]) e.push(a[g]); else break;
                        g < a.length && "string" == typeof a[g] && (c = a[g], g++);
                        g < a.length && "number" == typeof a[g] && (d = a[g]);
                        var j = d == CKEDITOR.VALIDATE_AND ? !0 : !1;
                        for (g = 0; g < e.length; g++)j = d == CKEDITOR.VALIDATE_AND ? j && e[g](b) : j || e[g](b);
                        return !j ? c : !0
                    }
                }, regex: function (a, b) {
                    return function (c) {
                        c = this && this.getValue ? this.getValue() : c;
                        return !a.test(c) ? b : !0
                    }
                }, notEmpty: function (b) {
                    return this.regex(a, b)
                }, integer: function (a) {
                    return this.regex(b,
                        a)
                }, number: function (a) {
                    return this.regex(c, a)
                }, cssLength: function (a) {
                    return this.functions(function (a) {
                        return d.test(CKEDITOR.tools.trim(a))
                    }, a)
                }, htmlLength: function (a) {
                    return this.functions(function (a) {
                        return e.test(CKEDITOR.tools.trim(a))
                    }, a)
                }, inlineStyle: function (a) {
                    return this.functions(function (a) {
                        return g.test(CKEDITOR.tools.trim(a))
                    }, a)
                }, equals: function (a, b) {
                    return this.functions(function (b) {
                        return b == a
                    }, b)
                }, notEqual: function (a, b) {
                    return this.functions(function (b) {
                        return b != a
                    }, b)
                }
            };
            CKEDITOR.on("instanceDestroyed",
                function (a) {
                    if (CKEDITOR.tools.isEmpty(CKEDITOR.instances)) {
                        for (var b; b = CKEDITOR.dialog._.currentTop;)b.hide();
                        for (var c in w)w[c].remove();
                        w = {}
                    }
                    var a = a.editor._.storedDialogs, d;
                    for (d in a)a[d].destroy()
                })
        })();
        CKEDITOR.tools.extend(CKEDITOR.editor.prototype, {
            openDialog: function (a, b) {
                var c = null, e = CKEDITOR.dialog._.dialogDefinitions[a];
                null === CKEDITOR.dialog._.currentTop && J(this);
                if ("function" == typeof e) c = this._.storedDialogs || (this._.storedDialogs = {}), c = c[a] || (c[a] = new CKEDITOR.dialog(this, a)), b && b.call(c,
                    c), c.show(); else {
                    if ("failed" == e)throw K(this), Error('[CKEDITOR.dialog.openDialog] Dialog "' + a + '" failed when loading definition.');
                    "string" == typeof e && CKEDITOR.scriptLoader.load(CKEDITOR.getUrl(e), function () {
                        "function" != typeof CKEDITOR.dialog._.dialogDefinitions[a] && (CKEDITOR.dialog._.dialogDefinitions[a] = "failed");
                        this.openDialog(a, b)
                    }, this, 0, 1)
                }
                CKEDITOR.skin.loadPart("dialog");
                return c
            }
        })
    })();
    CKEDITOR.plugins.add("dialog", {
        requires: "dialogui", init: function (t) {
            t.on("doubleclick", function (u) {
                u.data.dialog && t.openDialog(u.data.dialog)
            }, null, null, 999)
        }
    });
    CKEDITOR.plugins.add("about", {
        requires: "dialog", init: function (a) {
            var b = a.addCommand("about", new CKEDITOR.dialogCommand("about"));
            b.modes = {wysiwyg: 1, source: 1};
            b.canUndo = !1;
            b.readOnly = 1;
            a.ui.addButton && a.ui.addButton("About", {label: a.lang.about.title, command: "about", toolbar: "about"});
            CKEDITOR.dialog.add("about", this.path + "dialogs/about.js")
        }
    });
    (function () {
        CKEDITOR.plugins.add("a11yhelp", {
            requires: "dialog",
            availableLangs: {
                ar: 1,
                bg: 1,
                ca: 1,
                cs: 1,
                cy: 1,
                da: 1,
                de: 1,
                el: 1,
                en: 1,
                eo: 1,
                es: 1,
                et: 1,
                fa: 1,
                fi: 1,
                fr: 1,
                "fr-ca": 1,
                gl: 1,
                gu: 1,
                he: 1,
                hi: 1,
                hr: 1,
                hu: 1,
                id: 1,
                it: 1,
                ja: 1,
                km: 1,
                ko: 1,
                ku: 1,
                lt: 1,
                lv: 1,
                mk: 1,
                mn: 1,
                nb: 1,
                nl: 1,
                no: 1,
                pl: 1,
                pt: 1,
                "pt-br": 1,
                ro: 1,
                ru: 1,
                si: 1,
                sk: 1,
                sl: 1,
                sq: 1,
                sr: 1,
                "sr-latn": 1,
                sv: 1,
                th: 1,
                tr: 1,
                ug: 1,
                uk: 1,
                vi: 1,
                zh: 1,
                "zh-cn": 1
            },
            init: function (b) {
                var c = this;
                b.addCommand("a11yHelp", {
                    exec: function () {
                        var a = b.langCode, a = c.availableLangs[a] ? a : c.availableLangs[a.replace(/-.*/,
                            "")] ? a.replace(/-.*/, "") : "en";
                        CKEDITOR.scriptLoader.load(CKEDITOR.getUrl(c.path + "dialogs/lang/" + a + ".js"), function () {
                            b.lang.a11yhelp = c.langEntries[a];
                            b.openDialog("a11yHelp")
                        })
                    }, modes: {wysiwyg: 1, source: 1}, readOnly: 1, canUndo: !1
                });
                b.setKeystroke(CKEDITOR.ALT + 48, "a11yHelp");
                CKEDITOR.dialog.add("a11yHelp", this.path + "dialogs/a11yhelp.js")
            }
        })
    })();
    CKEDITOR.plugins.add("basicstyles", {
        init: function (c) {
            var e = 0, d = function (g, d, b, a) {
                if (a) {
                    var a = new CKEDITOR.style(a), f = h[b];
                    f.unshift(a);
                    c.attachStyleStateChange(a, function (a) {
                        !c.readOnly && c.getCommand(b).setState(a)
                    });
                    c.addCommand(b, new CKEDITOR.styleCommand(a, {contentForms: f}));
                    c.ui.addButton && c.ui.addButton(g, {label: d, command: b, toolbar: "basicstyles," + (e += 10)})
                }
            }, h = {
                bold: ["strong", "b", ["span", function (a) {
                    a = a.styles["font-weight"];
                    return "bold" == a || 700 <= +a
                }]], italic: ["em", "i", ["span", function (a) {
                    return "italic" ==
                        a.styles["font-style"]
                }]], underline: ["u", ["span", function (a) {
                    return "underline" == a.styles["text-decoration"]
                }]], strike: ["s", "strike", ["span", function (a) {
                    return "line-through" == a.styles["text-decoration"]
                }]], subscript: ["sub"], superscript: ["sup"]
            }, b = c.config, a = c.lang.basicstyles;
            d("Bold", a.bold, "bold", b.coreStyles_bold);
            d("Italic", a.italic, "italic", b.coreStyles_italic);
            d("Underline", a.underline, "underline", b.coreStyles_underline);
            d("Strike", a.strike, "strike", b.coreStyles_strike);
            d("Subscript", a.subscript,
                "subscript", b.coreStyles_subscript);
            d("Superscript", a.superscript, "superscript", b.coreStyles_superscript);
            c.setKeystroke([[CKEDITOR.CTRL + 66, "bold"], [CKEDITOR.CTRL + 73, "italic"], [CKEDITOR.CTRL + 85, "underline"]])
        }
    });
    CKEDITOR.config.coreStyles_bold = {element: "strong", overrides: "b"};
    CKEDITOR.config.coreStyles_italic = {element: "em", overrides: "i"};
    CKEDITOR.config.coreStyles_underline = {element: "u"};
    CKEDITOR.config.coreStyles_strike = {element: "s", overrides: "strike"};
    CKEDITOR.config.coreStyles_subscript = {element: "sub"};
    CKEDITOR.config.coreStyles_superscript = {element: "sup"};
    (function () {
        var k = {
            exec: function (g) {
                var a = g.getCommand("blockquote").state, i = g.getSelection(), c = i && i.getRanges()[0];
                if (c) {
                    var h = i.createBookmarks();
                    if (CKEDITOR.env.ie) {
                        var e = h[0].startNode, b = h[0].endNode, d;
                        if (e && "blockquote" == e.getParent().getName())for (d = e; d = d.getNext();)if (d.type == CKEDITOR.NODE_ELEMENT && d.isBlockBoundary()) {
                            e.move(d, !0);
                            break
                        }
                        if (b && "blockquote" == b.getParent().getName())for (d = b; d = d.getPrevious();)if (d.type == CKEDITOR.NODE_ELEMENT && d.isBlockBoundary()) {
                            b.move(d);
                            break
                        }
                    }
                    var f = c.createIterator();
                    f.enlargeBr = g.config.enterMode != CKEDITOR.ENTER_BR;
                    if (a == CKEDITOR.TRISTATE_OFF) {
                        for (e = []; a = f.getNextParagraph();)e.push(a);
                        1 > e.length && (a = g.document.createElement(g.config.enterMode == CKEDITOR.ENTER_P ? "p" : "div"), b = h.shift(), c.insertNode(a), a.append(new CKEDITOR.dom.text("﻿", g.document)), c.moveToBookmark(b), c.selectNodeContents(a), c.collapse(!0), b = c.createBookmark(), e.push(a), h.unshift(b));
                        d = e[0].getParent();
                        c = [];
                        for (b = 0; b < e.length; b++)a = e[b], d = d.getCommonAncestor(a.getParent());
                        for (a = {
                            table: 1, tbody: 1,
                            tr: 1, ol: 1, ul: 1
                        }; a[d.getName()];)d = d.getParent();
                        for (b = null; 0 < e.length;) {
                            for (a = e.shift(); !a.getParent().equals(d);)a = a.getParent();
                            a.equals(b) || c.push(a);
                            b = a
                        }
                        for (; 0 < c.length;)if (a = c.shift(), "blockquote" == a.getName()) {
                            for (b = new CKEDITOR.dom.documentFragment(g.document); a.getFirst();)b.append(a.getFirst().remove()), e.push(b.getLast());
                            b.replace(a)
                        } else e.push(a);
                        c = g.document.createElement("blockquote");
                        for (c.insertBefore(e[0]); 0 < e.length;)a = e.shift(), c.append(a)
                    } else if (a == CKEDITOR.TRISTATE_ON) {
                        b = [];
                        for (d = {}; a = f.getNextParagraph();) {
                            for (e = c = null; a.getParent();) {
                                if ("blockquote" == a.getParent().getName()) {
                                    c = a.getParent();
                                    e = a;
                                    break
                                }
                                a = a.getParent()
                            }
                            c && (e && !e.getCustomData("blockquote_moveout")) && (b.push(e), CKEDITOR.dom.element.setMarker(d, e, "blockquote_moveout", !0))
                        }
                        CKEDITOR.dom.element.clearAllMarkers(d);
                        a = [];
                        e = [];
                        for (d = {}; 0 < b.length;)f = b.shift(), c = f.getParent(), f.getPrevious() ? f.getNext() ? (f.breakParent(f.getParent()), e.push(f.getNext())) : f.remove().insertAfter(c) : f.remove().insertBefore(c), c.getCustomData("blockquote_processed") ||
                        (e.push(c), CKEDITOR.dom.element.setMarker(d, c, "blockquote_processed", !0)), a.push(f);
                        CKEDITOR.dom.element.clearAllMarkers(d);
                        for (b = e.length - 1; 0 <= b; b--) {
                            c = e[b];
                            a:{
                                d = c;
                                for (var f = 0, k = d.getChildCount(),
                                         j = void 0; f < k && (j = d.getChild(f)); f++)if (j.type == CKEDITOR.NODE_ELEMENT && j.isBlockBoundary()) {
                                    d = !1;
                                    break a
                                }
                                d = !0
                            }
                            d && c.remove()
                        }
                        if (g.config.enterMode == CKEDITOR.ENTER_BR)for (c = !0; a.length;)if (f = a.shift(), "div" == f.getName()) {
                            b = new CKEDITOR.dom.documentFragment(g.document);
                            c && (f.getPrevious() && !(f.getPrevious().type ==
                            CKEDITOR.NODE_ELEMENT && f.getPrevious().isBlockBoundary())) && b.append(g.document.createElement("br"));
                            for (c = f.getNext() && !(f.getNext().type == CKEDITOR.NODE_ELEMENT && f.getNext().isBlockBoundary()); f.getFirst();)f.getFirst().remove().appendTo(b);
                            c && b.append(g.document.createElement("br"));
                            b.replace(f);
                            c = !1
                        }
                    }
                    i.selectBookmarks(h);
                    g.focus()
                }
            }, refresh: function (g, a) {
                this.setState(g.elementPath(a.block || a.blockLimit).contains("blockquote", 1) ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF)
            }, context: "blockquote",
            allowedContent: "blockquote", requiredContent: "blockquote"
        };
        CKEDITOR.plugins.add("blockquote", {
            init: function (g) {
                g.blockless || (g.addCommand("blockquote", k), g.ui.addButton && g.ui.addButton("Blockquote", {
                    label: g.lang.blockquote.toolbar,
                    command: "blockquote",
                    toolbar: "blocks,10"
                }))
            }
        })
    })();
    (function () {
        function w(b) {
            function a() {
                var e = b.editable();
                e.on(q, function (b) {
                    (!CKEDITOR.env.ie || !n) && u(b)
                });
                CKEDITOR.env.ie && e.on("paste", function (e) {
                    r || (f(), e.data.preventDefault(), u(e), l("paste") || b.openDialog("paste"))
                });
                CKEDITOR.env.ie && (e.on("contextmenu", h, null, null, 0), e.on("beforepaste", function (b) {
                    b.data && !b.data.$.ctrlKey && h()
                }, null, null, 0));
                e.on("beforecut", function () {
                    !n && i(b)
                });
                var a;
                e.attachListener(CKEDITOR.env.ie ? e : b.document.getDocumentElement(), "mouseup", function () {
                    a = setTimeout(function () {
                            s()
                        },
                        0)
                });
                b.on("destroy", function () {
                    clearTimeout(a)
                });
                e.on("keyup", s)
            }

            function c(e) {
                return {
                    type: e, canUndo: "cut" == e, startDisabled: !0, exec: function () {
                        "cut" == this.type && i();
                        var e;
                        var a = this.type;
                        if (CKEDITOR.env.ie) e = l(a); else try {
                            e = b.document.$.execCommand(a, !1, null)
                        } catch (d) {
                            e = !1
                        }
                        e || alert(b.lang.clipboard[this.type + "Error"]);
                        return e
                    }
                }
            }

            function d() {
                return {
                    canUndo: !1, async: !0, exec: function (b, a) {
                        var d = function (a, d) {
                                a && g(a.type, a.dataValue, !!d);
                                b.fire("afterCommandExec", {name: "paste", command: c, returnValue: !!a})
                            },
                            c = this;
                        "string" == typeof a ? d({type: "auto", dataValue: a}, 1) : b.getClipboardData(d)
                    }
                }
            }

            function f() {
                r = 1;
                setTimeout(function () {
                    r = 0
                }, 100)
            }

            function h() {
                n = 1;
                setTimeout(function () {
                    n = 0
                }, 10)
            }

            function l(e) {
                var a = b.document, d = a.getBody(), c = !1, i = function () {
                    c = !0
                };
                d.on(e, i);
                (7 < CKEDITOR.env.version ? a.$ : a.$.selection.createRange()).execCommand(e);
                d.removeListener(e, i);
                return c
            }

            function g(e, a, d) {
                e = {type: e};
                if (d && !b.fire("beforePaste", e) || !a)return !1;
                e.dataValue = a;
                return b.fire("paste", e)
            }

            function i() {
                if (CKEDITOR.env.ie &&
                    !CKEDITOR.env.quirks) {
                    var e = b.getSelection(), a, d, c;
                    if (e.getType() == CKEDITOR.SELECTION_ELEMENT && (a = e.getSelectedElement())) d = e.getRanges()[0], c = b.document.createText(""), c.insertBefore(a), d.setStartBefore(c), d.setEndAfter(a), e.selectRanges([d]), setTimeout(function () {
                        a.getParent() && (c.remove(), e.selectElement(a))
                    }, 0)
                }
            }

            function k(a, d) {
                var c = b.document, i = b.editable(), k = function (b) {
                    b.cancel()
                }, f = CKEDITOR.env.gecko && 10902 >= CKEDITOR.env.version, h;
                if (!c.getById("cke_pastebin")) {
                    var o = b.getSelection(), v = o.createBookmarks(),
                        j = new CKEDITOR.dom.element((CKEDITOR.env.webkit || i.is("body")) && !CKEDITOR.env.ie && !CKEDITOR.env.opera ? "body" : "div", c);
                    j.setAttributes({id: "cke_pastebin", "data-cke-temp": "1"});
                    CKEDITOR.env.opera && j.appendBogus();
                    var g = 0, c = c.getWindow();
                    f ? (j.insertAfter(v[0].startNode), j.setStyle("display", "inline")) : (CKEDITOR.env.webkit ? (i.append(j), j.addClass("cke_editable"), i.is("body") || (f = "static" != i.getComputedStyle("position") ? i : CKEDITOR.dom.element.get(i.$.offsetParent), g = f.getDocumentPosition().y)) : i.getAscendant(CKEDITOR.env.ie ||
                    CKEDITOR.env.opera ? "body" : "html", 1).append(j), j.setStyles({
                        position: "absolute",
                        top: c.getScrollPosition().y - g + 10 + "px",
                        width: "1px",
                        height: Math.max(1, c.getViewPaneSize().height - 20) + "px",
                        overflow: "hidden",
                        margin: 0,
                        padding: 0
                    }));
                    (f = j.getParent().isReadOnly()) ? (j.setOpacity(0), j.setAttribute("contenteditable", !0)) : j.setStyle("ltr" == b.config.contentsLangDirection ? "left" : "right", "-1000px");
                    b.on("selectionChange", k, null, null, 0);
                    CKEDITOR.env.webkit && (h = i.once("blur", k, null, null, -100));
                    f && j.focus();
                    f = new CKEDITOR.dom.range(j);
                    f.selectNodeContents(j);
                    var l = f.select();
                    CKEDITOR.env.ie && (h = i.once("blur", function () {
                        b.lockSelection(l)
                    }));
                    var m = CKEDITOR.document.getWindow().getScrollPosition().y;
                    setTimeout(function () {
                        if (CKEDITOR.env.webkit || CKEDITOR.env.opera) CKEDITOR.document[CKEDITOR.env.webkit ? "getBody" : "getDocumentElement"]().$.scrollTop = m;
                        h && h.removeListener();
                        CKEDITOR.env.ie && i.focus();
                        o.selectBookmarks(v);
                        j.remove();
                        var a;
                        if (CKEDITOR.env.webkit && (a = j.getFirst()) && a.is && a.hasClass("Apple-style-span")) j = a;
                        b.removeListener("selectionChange",
                            k);
                        d(j.getHtml())
                    }, 0)
                }
            }

            function o() {
                if (CKEDITOR.env.ie) {
                    b.focus();
                    f();
                    var a = b.focusManager;
                    a.lock();
                    if (b.editable().fire(q) && !l("paste"))return a.unlock(), !1;
                    a.unlock()
                } else try {
                    if (b.editable().fire(q) && !b.document.$.execCommand("Paste", !1, null))throw 0;
                } catch (d) {
                    return !1
                }
                return !0
            }

            function p(a) {
                if ("wysiwyg" == b.mode)switch (a.data.keyCode) {
                    case CKEDITOR.CTRL + 86:
                    case CKEDITOR.SHIFT + 45:
                        a = b.editable();
                        f();
                        !CKEDITOR.env.ie && a.fire("beforepaste");
                        (CKEDITOR.env.opera || CKEDITOR.env.gecko && 10900 > CKEDITOR.env.version) &&
                        a.fire("paste");
                        break;
                    case CKEDITOR.CTRL + 88:
                    case CKEDITOR.SHIFT + 46:
                        b.fire("saveSnapshot"), setTimeout(function () {
                            b.fire("saveSnapshot")
                        }, 0)
                }
            }

            function u(a) {
                var d = {type: "auto"}, c = b.fire("beforePaste", d);
                k(a, function (b) {
                    b = b.replace(/<span[^>]+data-cke-bookmark[^<]*?<\/span>/ig, "");
                    c && g(d.type, b, 0, 1)
                })
            }

            function s() {
                if ("wysiwyg" == b.mode) {
                    var a = m("paste");
                    b.getCommand("cut").setState(m("cut"));
                    b.getCommand("copy").setState(m("copy"));
                    b.getCommand("paste").setState(a);
                    b.fire("pasteState", a)
                }
            }

            function m(a) {
                if (t &&
                    a in {paste: 1, cut: 1})return CKEDITOR.TRISTATE_DISABLED;
                if ("paste" == a)return CKEDITOR.TRISTATE_OFF;
                var a = b.getSelection(), d = a.getRanges();
                return a.getType() == CKEDITOR.SELECTION_NONE || 1 == d.length && d[0].collapsed ? CKEDITOR.TRISTATE_DISABLED : CKEDITOR.TRISTATE_OFF
            }

            var n = 0, r = 0, t = 0, q = CKEDITOR.env.ie ? "beforepaste" : "paste";
            (function () {
                b.on("key", p);
                b.on("contentDom", a);
                b.on("selectionChange", function (a) {
                    t = a.data.selection.getRanges()[0].checkReadOnly();
                    s()
                });
                b.contextMenu && b.contextMenu.addListener(function (a,
                                                                     b) {
                    t = b.getRanges()[0].checkReadOnly();
                    return {cut: m("cut"), copy: m("copy"), paste: m("paste")}
                })
            })();
            (function () {
                function a(d, c, i, e, f) {
                    var k = b.lang.clipboard[c];
                    b.addCommand(c, i);
                    b.ui.addButton && b.ui.addButton(d, {label: k, command: c, toolbar: "clipboard," + e});
                    b.addMenuItems && b.addMenuItem(c, {label: k, command: c, group: "clipboard", order: f})
                }

                a("Cut", "cut", c("cut"), 10, 1);
                a("Copy", "copy", c("copy"), 20, 4);
                a("Paste", "paste", d(), 30, 8)
            })();
            b.getClipboardData = function (a, d) {
                function c(a) {
                    a.removeListener();
                    a.cancel();
                    d(a.data)
                }

                function i(a) {
                    a.removeListener();
                    a.cancel();
                    g = !0;
                    d({type: h, dataValue: a.data})
                }

                function f() {
                    this.customTitle = a && a.title
                }

                var k = !1, h = "auto", g = !1;
                d || (d = a, a = null);
                b.on("paste", c, null, null, 0);
                b.on("beforePaste", function (a) {
                    a.removeListener();
                    k = true;
                    h = a.data.type
                }, null, null, 1E3);
                !1 === o() && (b.removeListener("paste", c), k && b.fire("pasteDialog", f) ? (b.on("pasteDialogCommit", i), b.on("dialogHide", function (a) {
                    a.removeListener();
                    a.data.removeListener("pasteDialogCommit", i);
                    setTimeout(function () {
                            g || d(null)
                        },
                        10)
                })) : d(null))
            }
        }

        function x(b) {
            if (CKEDITOR.env.webkit) {
                if (!b.match(/^[^<]*$/g) && !b.match(/^(<div><br( ?\/)?><\/div>|<div>[^<]*<\/div>)*$/gi))return "html"
            } else if (CKEDITOR.env.ie) {
                if (!b.match(/^([^<]|<br( ?\/)?>)*$/gi) && !b.match(/^(<p>([^<]|<br( ?\/)?>)*<\/p>|(\r\n))*$/gi))return "html"
            } else if (CKEDITOR.env.gecko || CKEDITOR.env.opera) {
                if (!b.match(/^([^<]|<br( ?\/)?>)*$/gi))return "html"
            } else return "html";
            return "htmlifiedtext"
        }

        function y(b, a) {
            function c(a) {
                return CKEDITOR.tools.repeat("</p><p>", ~~(a / 2)) +
                    (1 == a % 2 ? "<br>" : "")
            }

            a = a.replace(/\s+/g, " ").replace(/> +</g, "><").replace(/<br ?\/>/gi, "<br>");
            a = a.replace(/<\/?[A-Z]+>/g, function (a) {
                return a.toLowerCase()
            });
            if (a.match(/^[^<]$/))return a;
            CKEDITOR.env.webkit && -1 < a.indexOf("<div>") && (a = a.replace(/^(<div>(<br>|)<\/div>)(?!$|(<div>(<br>|)<\/div>))/g, "<br>").replace(/^(<div>(<br>|)<\/div>){2}(?!$)/g, "<div></div>"), a.match(/<div>(<br>|)<\/div>/) && (a = "<p>" + a.replace(/(<div>(<br>|)<\/div>)+/g, function (a) {
                    return c(a.split("</div><div>").length + 1)
                }) + "</p>"),
                a = a.replace(/<\/div><div>/g, "<br>"), a = a.replace(/<\/?div>/g, ""));
            if ((CKEDITOR.env.gecko || CKEDITOR.env.opera) && b.enterMode != CKEDITOR.ENTER_BR) CKEDITOR.env.gecko && (a = a.replace(/^<br><br>$/, "<br>")), -1 < a.indexOf("<br><br>") && (a = "<p>" + a.replace(/(<br>){2,}/g, function (a) {
                    return c(a.length / 4)
                }) + "</p>");
            return p(b, a)
        }

        function z() {
            var b = new CKEDITOR.htmlParser.filter, a = {
                blockquote: 1,
                dl: 1,
                fieldset: 1,
                h1: 1,
                h2: 1,
                h3: 1,
                h4: 1,
                h5: 1,
                h6: 1,
                ol: 1,
                p: 1,
                table: 1,
                ul: 1
            }, c = CKEDITOR.tools.extend({br: 0}, CKEDITOR.dtd.$inline), d =
                {p: 1, br: 1, "cke:br": 1}, f = CKEDITOR.dtd, h = CKEDITOR.tools.extend({
                area: 1,
                basefont: 1,
                embed: 1,
                iframe: 1,
                map: 1,
                object: 1,
                param: 1
            }, CKEDITOR.dtd.$nonBodyContent, CKEDITOR.dtd.$cdata), l = function (a) {
                delete a.name;
                a.add(new CKEDITOR.htmlParser.text(" "))
            }, g = function (a) {
                for (var b = a, c; (b = b.next) && b.name && b.name.match(/^h\d$/);) {
                    c = new CKEDITOR.htmlParser.element("cke:br");
                    c.isEmpty = !0;
                    for (a.add(c); c = b.children.shift();)a.add(c)
                }
            };
            b.addRules({
                elements: {
                    h1: g, h2: g, h3: g, h4: g, h5: g, h6: g, img: function (a) {
                        var a = CKEDITOR.tools.trim(a.attributes.alt ||
                            ""), b = " ";
                        a && !a.match(/(^http|\.(jpe?g|gif|png))/i) && (b = " [" + a + "] ");
                        return new CKEDITOR.htmlParser.text(b)
                    }, td: l, th: l, $: function (b) {
                        var k = b.name, g;
                        if (h[k])return !1;
                        b.attributes = [];
                        if ("br" == k)return b;
                        if (a[k]) b.name = "p"; else if (c[k]) delete b.name; else if (f[k]) {
                            g = new CKEDITOR.htmlParser.element("cke:br");
                            g.isEmpty = !0;
                            if (CKEDITOR.dtd.$empty[k])return g;
                            b.add(g, 0);
                            g = g.clone();
                            g.isEmpty = !0;
                            b.add(g);
                            delete b.name
                        }
                        d[b.name] || delete b.name;
                        return b
                    }
                }
            }, {applyToAll: !0});
            return b
        }

        function A(b, a, c) {
            var a = new CKEDITOR.htmlParser.fragment.fromHtml(a),
                d = new CKEDITOR.htmlParser.basicWriter;
            a.writeHtml(d, c);
            var a = d.getHtml(),
                a = a.replace(/\s*(<\/?[a-z:]+ ?\/?>)\s*/g, "$1").replace(/(<cke:br \/>){2,}/g, "<cke:br />").replace(/(<cke:br \/>)(<\/?p>|<br \/>)/g, "$2").replace(/(<\/?p>|<br \/>)(<cke:br \/>)/g, "$1").replace(/<(cke:)?br( \/)?>/g, "<br>").replace(/<p><\/p>/g, ""),
                f = 0, a = a.replace(/<\/?p>/g, function (a) {
                    if ("<p>" == a) {
                        if (1 < ++f)return "</p><p>"
                    } else if (0 < --f)return "</p><p>";
                    return a
                }).replace(/<p><\/p>/g, "");
            return p(b, a)
        }

        function p(b, a) {
            b.enterMode ==
            CKEDITOR.ENTER_BR ? a = a.replace(/(<\/p><p>)+/g, function (a) {
                return CKEDITOR.tools.repeat("<br>", 2 * (a.length / 7))
            }).replace(/<\/?p>/g, "") : b.enterMode == CKEDITOR.ENTER_DIV && (a = a.replace(/<(\/)?p>/g, "<$1div>"));
            return a
        }

        CKEDITOR.plugins.add("clipboard", {
            requires: "dialog", init: function (b) {
                var a;
                w(b);
                CKEDITOR.dialog.add("paste", CKEDITOR.getUrl(this.path + "dialogs/paste.js"));
                b.on("paste", function (a) {
                        var b = a.data.dataValue, f = CKEDITOR.dtd.$block;
                        -1 < b.indexOf("Apple-") && (b = b.replace(/<span class="Apple-converted-space">&nbsp;<\/span>/gi,
                            " "), "html" != a.data.type && (b = b.replace(/<span class="Apple-tab-span"[^>]*>([^<]*)<\/span>/gi, function (a, b) {
                            return b.replace(/\t/g, "&nbsp;&nbsp; &nbsp;")
                        })), -1 < b.indexOf('<br class="Apple-interchange-newline">') && (a.data.startsWithEOL = 1, a.data.preSniffing = "html", b = b.replace(/<br class="Apple-interchange-newline">/, "")), b = b.replace(/(<[^>]+) class="Apple-[^"]*"/gi, "$1"));
                        if (b.match(/^<[^<]+cke_(editable|contents)/i)) {
                            var h, l, g = new CKEDITOR.dom.element("div");
                            for (g.setHtml(b); 1 == g.getChildCount() && (h =
                                g.getFirst()) && h.type == CKEDITOR.NODE_ELEMENT && (h.hasClass("cke_editable") || h.hasClass("cke_contents"));)g = l = h;
                            l && (b = l.getHtml().replace(/<br>$/i, ""))
                        }
                        CKEDITOR.env.ie ? b = b.replace(/^&nbsp;(?: |\r\n)?<(\w+)/g, function (b, d) {
                            if (d.toLowerCase() in f) {
                                a.data.preSniffing = "html";
                                return "<" + d
                            }
                            return b
                        }) : CKEDITOR.env.webkit ? b = b.replace(/<\/(\w+)><div><br><\/div>$/, function (b, d) {
                            if (d in f) {
                                a.data.endsWithEOL = 1;
                                return "</" + d + ">"
                            }
                            return b
                        }) : CKEDITOR.env.gecko && (b = b.replace(/(\s)<br>$/, "$1"));
                        a.data.dataValue = b
                    }, null,
                    null, 3);
                b.on("paste", function (c) {
                    var c = c.data, d = c.type, f = c.dataValue, h, l = b.config.clipboard_defaultContentType || "html";
                    h = "html" == d || "html" == c.preSniffing ? "html" : x(f);
                    "htmlifiedtext" == h ? f = y(b.config, f) : "text" == d && "html" == h && (f = A(b.config, f, a || (a = z(b))));
                    c.startsWithEOL && (f = '<br data-cke-eol="1">' + f);
                    c.endsWithEOL && (f += '<br data-cke-eol="1">');
                    "auto" == d && (d = "html" == h || "html" == l ? "html" : "text");
                    c.type = d;
                    c.dataValue = f;
                    delete c.preSniffing;
                    delete c.startsWithEOL;
                    delete c.endsWithEOL
                }, null, null, 6);
                b.on("paste",
                    function (a) {
                        a = a.data;
                        b.insertHtml(a.dataValue, a.type);
                        setTimeout(function () {
                            b.fire("afterPaste")
                        }, 0)
                    }, null, null, 1E3);
                b.on("pasteDialog", function (a) {
                    setTimeout(function () {
                        b.openDialog("paste", a.data)
                    }, 0)
                })
            }
        })
    })();
    (function () {
        CKEDITOR.plugins.add("panel", {
            beforeInit: function (a) {
                a.ui.addHandler(CKEDITOR.UI_PANEL, CKEDITOR.ui.panel.handler)
            }
        });
        CKEDITOR.UI_PANEL = "panel";
        CKEDITOR.ui.panel = function (a, b) {
            b && CKEDITOR.tools.extend(this, b);
            CKEDITOR.tools.extend(this, {className: "", css: []});
            this.id = CKEDITOR.tools.getNextId();
            this.document = a;
            this.isFramed = this.forceIFrame || this.css.length;
            this._ = {blocks: {}}
        };
        CKEDITOR.ui.panel.handler = {
            create: function (a) {
                return new CKEDITOR.ui.panel(a)
            }
        };
        var f = CKEDITOR.addTemplate("panel",
            '<div lang="{langCode}" id="{id}" dir={dir} class="cke cke_reset_all {editorId} cke_panel cke_panel {cls} cke_{dir}" style="z-index:{z-index}" role="presentation">{frame}</div>'),
            g = CKEDITOR.addTemplate("panel-frame", '<iframe id="{id}" class="cke_panel_frame" role="presentation" frameborder="0" src="{src}"></iframe>'),
            h = CKEDITOR.addTemplate("panel-frame-inner", '<!DOCTYPE html><html class="cke_panel_container {env}" dir="{dir}" lang="{langCode}"><head>{css}</head><body class="cke_{dir}" style="margin:0;padding:0" onload="{onload}"></body></html>');
        CKEDITOR.ui.panel.prototype = {
            render: function (a, b) {
                this.getHolderElement = function () {
                    var a = this._.holder;
                    if (!a) {
                        if (this.isFramed) {
                            var a = this.document.getById(this.id + "_frame"), b = a.getParent(),
                                a = a.getFrameDocument();
                            CKEDITOR.env.iOS && b.setStyles({
                                overflow: "scroll",
                                "-webkit-overflow-scrolling": "touch"
                            });
                            b = CKEDITOR.tools.addFunction(CKEDITOR.tools.bind(function () {
                                this.isLoaded = !0;
                                if (this.onLoad) this.onLoad()
                            }, this));
                            a.write(h.output(CKEDITOR.tools.extend({
                                css: CKEDITOR.tools.buildStyleHtml(this.css),
                                onload: "window.parent.CKEDITOR.tools.callFunction(" +
                                b + ");"
                            }, d)));
                            a.getWindow().$.CKEDITOR = CKEDITOR;
                            a.on("key" + (CKEDITOR.env.opera ? "press" : "down"), function (a) {
                                var b = a.data.getKeystroke(), c = this.document.getById(this.id).getAttribute("dir");
                                this._.onKeyDown && !1 === this._.onKeyDown(b) ? a.data.preventDefault() : (27 == b || b == ("rtl" == c ? 39 : 37)) && this.onEscape && !1 === this.onEscape(b) && a.data.preventDefault()
                            }, this);
                            a = a.getBody();
                            a.unselectable();
                            CKEDITOR.env.air && CKEDITOR.tools.callFunction(b)
                        } else a = this.document.getById(this.id);
                        this._.holder = a
                    }
                    return a
                };
                var d =
                    {
                        editorId: a.id,
                        id: this.id,
                        langCode: a.langCode,
                        dir: a.lang.dir,
                        cls: this.className,
                        frame: "",
                        env: CKEDITOR.env.cssClass,
                        "z-index": a.config.baseFloatZIndex + 1
                    };
                if (this.isFramed) {
                    var e = CKEDITOR.env.air ? "javascript:void(0)" : CKEDITOR.env.ie ? "javascript:void(function(){" + encodeURIComponent("document.open();(" + CKEDITOR.tools.fixDomain + ")();document.close();") + "}())" : "";
                    d.frame = g.output({id: this.id + "_frame", src: e})
                }
                e = f.output(d);
                b && b.push(e);
                return e
            }, addBlock: function (a, b) {
                b = this._.blocks[a] = b instanceof CKEDITOR.ui.panel.block ?
                    b : new CKEDITOR.ui.panel.block(this.getHolderElement(), b);
                this._.currentBlock || this.showBlock(a);
                return b
            }, getBlock: function (a) {
                return this._.blocks[a]
            }, showBlock: function (a) {
                var a = this._.blocks[a], b = this._.currentBlock,
                    d = !this.forceIFrame || CKEDITOR.env.ie ? this._.holder : this.document.getById(this.id + "_frame");
                b && b.hide();
                this._.currentBlock = a;
                CKEDITOR.fire("ariaWidget", d);
                a._.focusIndex = -1;
                this._.onKeyDown = a.onKeyDown && CKEDITOR.tools.bind(a.onKeyDown, a);
                a.show();
                return a
            }, destroy: function () {
                this.element &&
                this.element.remove()
            }
        };
        CKEDITOR.ui.panel.block = CKEDITOR.tools.createClass({
            $: function (a, b) {
                this.element = a.append(a.getDocument().createElement("div", {
                    attributes: {
                        tabindex: -1,
                        "class": "cke_panel_block"
                    }, styles: {display: "none"}
                }));
                b && CKEDITOR.tools.extend(this, b);
                this.element.setAttributes({
                    role: this.attributes.role || "presentation",
                    "aria-label": this.attributes["aria-label"],
                    title: this.attributes.title || this.attributes["aria-label"]
                });
                this.keys = {};
                this._.focusIndex = -1;
                this.element.disableContextMenu()
            },
            _: {
                markItem: function (a) {
                    -1 != a && (a = this.element.getElementsByTag("a").getItem(this._.focusIndex = a), (CKEDITOR.env.webkit || CKEDITOR.env.opera) && a.getDocument().getWindow().focus(), a.focus(), this.onMark && this.onMark(a))
                }
            }, proto: {
                show: function () {
                    this.element.setStyle("display", "")
                }, hide: function () {
                    (!this.onHide || !0 !== this.onHide.call(this)) && this.element.setStyle("display", "none")
                }, onKeyDown: function (a, b) {
                    var d = this.keys[a];
                    switch (d) {
                        case "next":
                            for (var e = this._.focusIndex, d = this.element.getElementsByTag("a"),
                                     c; c = d.getItem(++e);)if (c.getAttribute("_cke_focus") && c.$.offsetWidth) {
                                this._.focusIndex = e;
                                c.focus();
                                break
                            }
                            return !c && !b ? (this._.focusIndex = -1, this.onKeyDown(a, 1)) : !1;
                        case "prev":
                            e = this._.focusIndex;
                            for (d = this.element.getElementsByTag("a"); 0 < e && (c = d.getItem(--e));) {
                                if (c.getAttribute("_cke_focus") && c.$.offsetWidth) {
                                    this._.focusIndex = e;
                                    c.focus();
                                    break
                                }
                                c = null
                            }
                            return !c && !b ? (this._.focusIndex = d.count(), this.onKeyDown(a, 1)) : !1;
                        case "click":
                        case "mouseup":
                            return e = this._.focusIndex, (c = 0 <= e && this.element.getElementsByTag("a").getItem(e)) &&
                            (c.$[d] ? c.$[d]() : c.$["on" + d]()), !1
                    }
                    return !0
                }
            }
        })
    })();
    CKEDITOR.plugins.add("floatpanel", {requires: "panel"});
    (function () {
        function q(a, b, c, i, f) {
            var f = CKEDITOR.tools.genKey(b.getUniqueId(), c.getUniqueId(), a.lang.dir, a.uiColor || "", i.css || "", f || ""),
                h = g[f];
            h || (h = g[f] = new CKEDITOR.ui.panel(b, i), h.element = c.append(CKEDITOR.dom.element.createFromHtml(h.render(a), b)), h.element.setStyles({
                display: "none",
                position: "absolute"
            }));
            return h
        }

        var g = {};
        CKEDITOR.ui.floatPanel = CKEDITOR.tools.createClass({
            $: function (a, b, c, i) {
                function f() {
                    d.hide()
                }

                c.forceIFrame = 1;
                c.toolbarRelated && a.elementMode == CKEDITOR.ELEMENT_MODE_INLINE &&
                (b = CKEDITOR.document.getById("cke_" + a.name));
                var h = b.getDocument(), i = q(a, h, b, c, i || 0), j = i.element, l = j.getFirst(), d = this;
                j.disableContextMenu();
                this.element = j;
                this._ = {
                    editor: a,
                    panel: i,
                    parentElement: b,
                    definition: c,
                    document: h,
                    iframe: l,
                    children: [],
                    dir: a.lang.dir
                };
                a.on("mode", f);
                a.on("resize", f);
                h.getWindow().on("resize", f)
            }, proto: {
                addBlock: function (a, b) {
                    return this._.panel.addBlock(a, b)
                }, addListBlock: function (a, b) {
                    return this._.panel.addListBlock(a, b)
                }, getBlock: function (a) {
                    return this._.panel.getBlock(a)
                },
                showBlock: function (a, b, c, i, f, h) {
                    var j = this._.panel, l = j.showBlock(a);
                    this.allowBlur(!1);
                    a = this._.editor.editable();
                    this._.returnFocus = a.hasFocus ? a : new CKEDITOR.dom.element(CKEDITOR.document.$.activeElement);
                    var d = this.element, a = this._.iframe,
                        a = CKEDITOR.env.ie ? a : new CKEDITOR.dom.window(a.$.contentWindow), g = d.getDocument(),
                        o = this._.parentElement.getPositionedAncestor(), p = b.getDocumentPosition(g),
                        g = o ? o.getDocumentPosition(g) : {x: 0, y: 0}, m = "rtl" == this._.dir,
                        e = p.x + (i || 0) - g.x, k = p.y + (f || 0) - g.y;
                    if (m && (1 == c ||
                        4 == c)) e += b.$.offsetWidth; else if (!m && (2 == c || 3 == c)) e += b.$.offsetWidth - 1;
                    if (3 == c || 4 == c) k += b.$.offsetHeight - 1;
                    this._.panel._.offsetParentId = b.getId();
                    d.setStyles({top: k + "px", left: 0, display: ""});
                    d.setOpacity(0);
                    d.getFirst().removeStyle("width");
                    this._.editor.focusManager.add(a);
                    this._.blurSet || (CKEDITOR.event.useCapture = !0, a.on("blur", function (a) {
                        this.allowBlur() && a.data.getPhase() == CKEDITOR.EVENT_PHASE_AT_TARGET && (this.visible && !this._.activeChild) && (delete this._.returnFocus, this.hide())
                    }, this), a.on("focus",
                        function () {
                            this._.focused = !0;
                            this.hideChild();
                            this.allowBlur(!0)
                        }, this), CKEDITOR.event.useCapture = !1, this._.blurSet = 1);
                    j.onEscape = CKEDITOR.tools.bind(function (a) {
                        if (this.onEscape && this.onEscape(a) === false)return false
                    }, this);
                    CKEDITOR.tools.setTimeout(function () {
                        var a = CKEDITOR.tools.bind(function () {
                            d.removeStyle("width");
                            if (l.autoSize) {
                                var a = l.element.getDocument(),
                                    a = (CKEDITOR.env.webkit ? l.element : a.getBody()).$.scrollWidth;
                                CKEDITOR.env.ie && (CKEDITOR.env.quirks && a > 0) && (a = a + ((d.$.offsetWidth || 0) - (d.$.clientWidth ||
                                    0) + 3));
                                d.setStyle("width", a + 10 + "px");
                                a = l.element.$.scrollHeight;
                                CKEDITOR.env.ie && (CKEDITOR.env.quirks && a > 0) && (a = a + ((d.$.offsetHeight || 0) - (d.$.clientHeight || 0) + 3));
                                d.setStyle("height", a + "px");
                                j._.currentBlock.element.setStyle("display", "none").removeStyle("display")
                            } else d.removeStyle("height");
                            m && (e = e - d.$.offsetWidth);
                            d.setStyle("left", e + "px");
                            var b = j.element.getWindow(), a = d.$.getBoundingClientRect(), b = b.getViewPaneSize(),
                                c = a.width || a.right - a.left, f = a.height || a.bottom - a.top,
                                i = m ? a.right : b.width - a.left,
                                g = m ? b.width - a.right : a.left;
                            m ? i < c && (e = g > c ? e + c : b.width > c ? e - a.left : e - a.right + b.width) : i < c && (e = g > c ? e - c : b.width > c ? e - a.right + b.width : e - a.left);
                            c = a.top;
                            b.height - a.top < f && (k = c > f ? k - f : b.height > f ? k - a.bottom + b.height : k - a.top);
                            if (CKEDITOR.env.ie) {
                                b = a = new CKEDITOR.dom.element(d.$.offsetParent);
                                b.getName() == "html" && (b = b.getDocument().getBody());
                                b.getComputedStyle("direction") == "rtl" && (e = CKEDITOR.env.ie8Compat ? e - d.getDocument().getDocumentElement().$.scrollLeft * 2 : e - (a.$.scrollWidth - a.$.clientWidth))
                            }
                            var a = d.getFirst(),
                                n;
                            (n = a.getCustomData("activePanel")) && n.onHide && n.onHide.call(this, 1);
                            a.setCustomData("activePanel", this);
                            d.setStyles({top: k + "px", left: e + "px"});
                            d.setOpacity(1);
                            h && h()
                        }, this);
                        j.isLoaded ? a() : j.onLoad = a;
                        CKEDITOR.tools.setTimeout(function () {
                            var a = CKEDITOR.env.webkit && CKEDITOR.document.getWindow().getScrollPosition().y;
                            this.focus();
                            l.element.focus();
                            if (CKEDITOR.env.webkit) CKEDITOR.document.getBody().$.scrollTop = a;
                            this.allowBlur(true);
                            this._.editor.fire("panelShow", this)
                        }, 0, this)
                    }, CKEDITOR.env.air ? 200 :
                        0, this);
                    this.visible = 1;
                    this.onShow && this.onShow.call(this)
                }, focus: function () {
                    if (CKEDITOR.env.webkit) {
                        var a = CKEDITOR.document.getActive();
                        !a.equals(this._.iframe) && a.$.blur()
                    }
                    (this._.lastFocused || this._.iframe.getFrameDocument().getWindow()).focus()
                }, blur: function () {
                    var a = this._.iframe.getFrameDocument().getActive();
                    a.is("a") && (this._.lastFocused = a)
                }, hide: function (a) {
                    if (this.visible && (!this.onHide || !0 !== this.onHide.call(this))) {
                        this.hideChild();
                        CKEDITOR.env.gecko && this._.iframe.getFrameDocument().$.activeElement.blur();
                        this.element.setStyle("display", "none");
                        this.visible = 0;
                        this.element.getFirst().removeCustomData("activePanel");
                        if (a = a && this._.returnFocus) CKEDITOR.env.webkit && a.type && a.getWindow().$.focus(), a.focus();
                        delete this._.lastFocused;
                        this._.editor.fire("panelHide", this)
                    }
                }, allowBlur: function (a) {
                    var b = this._.panel;
                    void 0 != a && (b.allowBlur = a);
                    return b.allowBlur
                }, showAsChild: function (a, b, c, g, f, h) {
                    this._.activeChild == a && a._.panel._.offsetParentId == c.getId() || (this.hideChild(), a.onHide = CKEDITOR.tools.bind(function () {
                        CKEDITOR.tools.setTimeout(function () {
                            this._.focused ||
                            this.hide()
                        }, 0, this)
                    }, this), this._.activeChild = a, this._.focused = !1, a.showBlock(b, c, g, f, h), this.blur(), (CKEDITOR.env.ie7Compat || CKEDITOR.env.ie6Compat) && setTimeout(function () {
                        a.element.getChild(0).$.style.cssText += ""
                    }, 100))
                }, hideChild: function (a) {
                    var b = this._.activeChild;
                    b && (delete b.onHide, delete this._.activeChild, b.hide(), a && this.focus())
                }
            }
        });
        CKEDITOR.on("instanceDestroyed", function () {
            var a = CKEDITOR.tools.isEmpty(CKEDITOR.instances), b;
            for (b in g) {
                var c = g[b];
                a ? c.destroy() : c.element.hide()
            }
            a && (g =
                {})
        })
    })();
    CKEDITOR.plugins.add("menu", {
        requires: "floatpanel", beforeInit: function (g) {
            for (var h = g.config.menu_groups.split(","), m = g._.menuGroups = {}, l = g._.menuItems = {},
                     a = 0; a < h.length; a++)m[h[a]] = a + 1;
            g.addMenuGroup = function (b, a) {
                m[b] = a || 100
            };
            g.addMenuItem = function (a, c) {
                m[c.group] && (l[a] = new CKEDITOR.menuItem(this, a, c))
            };
            g.addMenuItems = function (a) {
                for (var c in a)this.addMenuItem(c, a[c])
            };
            g.getMenuItem = function (a) {
                return l[a]
            };
            g.removeMenuItem = function (a) {
                delete l[a]
            }
        }
    });
    (function () {
        function g(a) {
            a.sort(function (a, c) {
                return a.group < c.group ? -1 : a.group > c.group ? 1 : a.order < c.order ? -1 : a.order > c.order ? 1 : 0
            })
        }

        var h = '<span class="cke_menuitem"><a id="{id}" class="cke_menubutton cke_menubutton__{name} cke_menubutton_{state} {cls}" href="{href}" title="{title}" tabindex="-1"_cke_focus=1 hidefocus="true" role="{role}" aria-haspopup="{hasPopup}" aria-disabled="{disabled}" {ariaChecked}';
        if (CKEDITOR.env.opera || CKEDITOR.env.gecko && CKEDITOR.env.mac) h += ' onkeypress="return false;"';
        CKEDITOR.env.gecko && (h += ' onblur="this.style.cssText = this.style.cssText;"');
        var h = h + (' onmouseover="CKEDITOR.tools.callFunction({hoverFn},{index});" onmouseout="CKEDITOR.tools.callFunction({moveOutFn},{index});" ' + (CKEDITOR.env.ie ? 'onclick="return false;" onmouseup' : "onclick") + '="CKEDITOR.tools.callFunction({clickFn},{index}); return false;">'),
            m = CKEDITOR.addTemplate("menuItem", h + '<span class="cke_menubutton_inner"><span class="cke_menubutton_icon"><span class="cke_button_icon cke_button__{iconName}_icon" style="{iconStyle}"></span></span><span class="cke_menubutton_label">{label}</span>{arrowHtml}</span></a></span>'),
            l = CKEDITOR.addTemplate("menuArrow", '<span class="cke_menuarrow"><span>{label}</span></span>');
        CKEDITOR.menu = CKEDITOR.tools.createClass({
            $: function (a, b) {
                b = this._.definition = b || {};
                this.id = CKEDITOR.tools.getNextId();
                this.editor = a;
                this.items = [];
                this._.listeners = [];
                this._.level = b.level || 1;
                var c = CKEDITOR.tools.extend({}, b.panel, {
                    css: [CKEDITOR.skin.getPath("editor")],
                    level: this._.level - 1,
                    block: {}
                }), k = c.block.attributes = c.attributes || {};
                !k.role && (k.role = "menu");
                this._.panelDefinition = c
            }, _: {
                onShow: function () {
                    var a =
                            this.editor.getSelection(), b = a && a.getStartElement(), c = this.editor.elementPath(),
                        k = this._.listeners;
                    this.removeAll();
                    for (var e = 0; e < k.length; e++) {
                        var j = k[e](b, a, c);
                        if (j)for (var i in j) {
                            var f = this.editor.getMenuItem(i);
                            if (f && (!f.command || this.editor.getCommand(f.command).state)) f.state = j[i], this.add(f)
                        }
                    }
                }, onClick: function (a) {
                    this.hide();
                    if (a.onClick) a.onClick(); else a.command && this.editor.execCommand(a.command)
                }, onEscape: function (a) {
                    var b = this.parent;
                    b ? b._.panel.hideChild(1) : 27 == a && this.hide(1);
                    return !1
                },
                onHide: function () {
                    this.onHide && this.onHide()
                }, showSubMenu: function (a) {
                    var b = this._.subMenu, c = this.items[a];
                    if (c = c.getItems && c.getItems()) {
                        b ? b.removeAll() : (b = this._.subMenu = new CKEDITOR.menu(this.editor, CKEDITOR.tools.extend({}, this._.definition, {level: this._.level + 1}, !0)), b.parent = this, b._.onClick = CKEDITOR.tools.bind(this._.onClick, this));
                        for (var k in c) {
                            var e = this.editor.getMenuItem(k);
                            e && (e.state = c[k], b.add(e))
                        }
                        var j = this._.panel.getBlock(this.id).element.getDocument().getById(this.id + ("" + a));
                        setTimeout(function () {
                            b.show(j,
                                2)
                        }, 0)
                    } else this._.panel.hideChild(1)
                }
            }, proto: {
                add: function (a) {
                    a.order || (a.order = this.items.length);
                    this.items.push(a)
                }, removeAll: function () {
                    this.items = []
                }, show: function (a, b, c, k) {
                    if (!this.parent && (this._.onShow(), !this.items.length))return;
                    var b = b || ("rtl" == this.editor.lang.dir ? 2 : 1), e = this.items, j = this.editor,
                        i = this._.panel, f = this._.element;
                    if (!i) {
                        i = this._.panel = new CKEDITOR.ui.floatPanel(this.editor, CKEDITOR.document.getBody(), this._.panelDefinition, this._.level);
                        i.onEscape = CKEDITOR.tools.bind(function (a) {
                            if (!1 ===
                                this._.onEscape(a))return !1
                        }, this);
                        i.onShow = function () {
                            i._.panel.getHolderElement().getParent().addClass("cke cke_reset_all")
                        };
                        i.onHide = CKEDITOR.tools.bind(function () {
                            this._.onHide && this._.onHide()
                        }, this);
                        f = i.addBlock(this.id, this._.panelDefinition.block);
                        f.autoSize = !0;
                        var d = f.keys;
                        d[40] = "next";
                        d[9] = "next";
                        d[38] = "prev";
                        d[CKEDITOR.SHIFT + 9] = "prev";
                        d["rtl" == j.lang.dir ? 37 : 39] = CKEDITOR.env.ie ? "mouseup" : "click";
                        d[32] = CKEDITOR.env.ie ? "mouseup" : "click";
                        CKEDITOR.env.ie && (d[13] = "mouseup");
                        f = this._.element =
                            f.element;
                        d = f.getDocument();
                        d.getBody().setStyle("overflow", "hidden");
                        d.getElementsByTag("html").getItem(0).setStyle("overflow", "hidden");
                        this._.itemOverFn = CKEDITOR.tools.addFunction(function (a) {
                            clearTimeout(this._.showSubTimeout);
                            this._.showSubTimeout = CKEDITOR.tools.setTimeout(this._.showSubMenu, j.config.menu_subMenuDelay || 400, this, [a])
                        }, this);
                        this._.itemOutFn = CKEDITOR.tools.addFunction(function () {
                            clearTimeout(this._.showSubTimeout)
                        }, this);
                        this._.itemClickFn = CKEDITOR.tools.addFunction(function (a) {
                            var b =
                                this.items[a];
                            if (b.state == CKEDITOR.TRISTATE_DISABLED) this.hide(1); else if (b.getItems) this._.showSubMenu(a); else this._.onClick(b)
                        }, this)
                    }
                    g(e);
                    for (var d = j.elementPath(),
                             d = ['<div class="cke_menu' + (d && d.direction() != j.lang.dir ? " cke_mixed_dir_content" : "") + '" role="presentation">'],
                             h = e.length, m = h && e[0].group, l = 0; l < h; l++) {
                        var n = e[l];
                        m != n.group && (d.push('<div class="cke_menuseparator" role="separator"></div>'), m = n.group);
                        n.render(this, l, d)
                    }
                    d.push("</div>");
                    f.setHtml(d.join(""));
                    CKEDITOR.ui.fire("ready",
                        this);
                    this.parent ? this.parent._.panel.showAsChild(i, this.id, a, b, c, k) : i.showBlock(this.id, a, b, c, k);
                    j.fire("menuShow", [i])
                }, addListener: function (a) {
                    this._.listeners.push(a)
                }, hide: function (a) {
                    this._.onHide && this._.onHide();
                    this._.panel && this._.panel.hide(a)
                }
            }
        });
        CKEDITOR.menuItem = CKEDITOR.tools.createClass({
            $: function (a, b, c) {
                CKEDITOR.tools.extend(this, c, {order: 0, className: "cke_menubutton__" + b});
                this.group = a._.menuGroups[this.group];
                this.editor = a;
                this.name = b
            }, proto: {
                render: function (a, b, c) {
                    var h = a.id + ("" +
                            b), e = "undefined" == typeof this.state ? CKEDITOR.TRISTATE_OFF : this.state, j = "",
                        i = e == CKEDITOR.TRISTATE_ON ? "on" : e == CKEDITOR.TRISTATE_DISABLED ? "disabled" : "off";
                    this.role in {
                        menuitemcheckbox: 1,
                        menuitemradio: 1
                    } && (j = ' aria-checked="' + (e == CKEDITOR.TRISTATE_ON ? "true" : "false") + '"');
                    var f = this.getItems, d = "&#" + ("rtl" == this.editor.lang.dir ? "9668" : "9658") + ";",
                        g = this.name;
                    this.icon && !/\./.test(this.icon) && (g = this.icon);
                    a = {
                        id: h,
                        name: this.name,
                        iconName: g,
                        label: this.label,
                        cls: this.className || "",
                        state: i,
                        hasPopup: f ? "true" :
                            "false",
                        disabled: e == CKEDITOR.TRISTATE_DISABLED,
                        title: this.label,
                        href: "javascript:void('" + (this.label || "").replace("'") + "')",
                        hoverFn: a._.itemOverFn,
                        moveOutFn: a._.itemOutFn,
                        clickFn: a._.itemClickFn,
                        index: b,
                        iconStyle: CKEDITOR.skin.getIconStyle(g, "rtl" == this.editor.lang.dir, g == this.icon ? null : this.icon, this.iconOffset),
                        arrowHtml: f ? l.output({label: d}) : "",
                        role: this.role ? this.role : "menuitem",
                        ariaChecked: j
                    };
                    m.output(a, c)
                }
            }
        })
    })();
    CKEDITOR.config.menu_groups = "clipboard,form,tablecell,tablecellproperties,tablerow,tablecolumn,table,anchor,link,image,flash,checkbox,radio,textfield,hiddenfield,imagebutton,button,select,textarea,div";
    CKEDITOR.plugins.add("contextmenu", {
        requires: "menu", onLoad: function () {
            CKEDITOR.plugins.contextMenu = CKEDITOR.tools.createClass({
                base: CKEDITOR.menu, $: function (a) {
                    this.base.call(this, a, {
                        panel: {
                            className: "cke_menu_panel",
                            attributes: {"aria-label": a.lang.contextmenu.options}
                        }
                    })
                }, proto: {
                    addTarget: function (a, c) {
                        a.on("contextmenu", function (a) {
                            var a = a.data, b = CKEDITOR.env.webkit ? d : CKEDITOR.env.mac ? a.$.metaKey : a.$.ctrlKey;
                            if (!c || !b) {
                                a.preventDefault();
                                var e = a.getTarget().getDocument(),
                                    f = a.getTarget().getDocument().getDocumentElement(),
                                    b = !e.equals(CKEDITOR.document), e = e.getWindow().getScrollPosition(),
                                    g = b ? a.$.clientX : a.$.pageX || e.x + a.$.clientX,
                                    h = b ? a.$.clientY : a.$.pageY || e.y + a.$.clientY;
                                CKEDITOR.tools.setTimeout(function () {
                                    this.open(f, null, g, h)
                                }, CKEDITOR.env.ie ? 200 : 0, this)
                            }
                        }, this);
                        if (CKEDITOR.env.webkit) {
                            var d, b = function () {
                                d = 0
                            };
                            a.on("keydown", function (a) {
                                d = CKEDITOR.env.mac ? a.data.$.metaKey : a.data.$.ctrlKey
                            });
                            a.on("keyup", b);
                            a.on("contextmenu", b)
                        }
                    }, open: function (a, c, d, b) {
                        this.editor.focus();
                        a = a || CKEDITOR.document.getDocumentElement();
                        this.editor.selectionChange(1);
                        this.show(a, c, d, b)
                    }
                }
            })
        }, beforeInit: function (a) {
            var c = a.contextMenu = new CKEDITOR.plugins.contextMenu(a);
            a.on("contentDom", function () {
                c.addTarget(a.editable(), !1 !== a.config.browserContextMenuOnCtrl)
            });
            a.addCommand("contextMenu", {
                exec: function () {
                    a.contextMenu.open(a.document.getBody())
                }
            });
            a.setKeystroke(CKEDITOR.SHIFT + 121, "contextMenu");
            a.setKeystroke(CKEDITOR.CTRL + CKEDITOR.SHIFT + 121, "contextMenu")
        }
    });
    CKEDITOR.plugins.add("resize", {
        init: function (b) {
            var f, g, n, o, a = b.config, q = b.ui.spaceId("resizer"),
                h = b.element ? b.element.getDirection(1) : "ltr";
            !a.resize_dir && (a.resize_dir = "vertical");
            void 0 == a.resize_maxWidth && (a.resize_maxWidth = 3E3);
            void 0 == a.resize_maxHeight && (a.resize_maxHeight = 3E3);
            void 0 == a.resize_minWidth && (a.resize_minWidth = 750);
            void 0 == a.resize_minHeight && (a.resize_minHeight = 250);
            if (!1 !== a.resize_enabled) {
                var c = null,
                    i = ("both" == a.resize_dir || "horizontal" == a.resize_dir) && a.resize_minWidth != a.resize_maxWidth,
                    l = ("both" == a.resize_dir || "vertical" == a.resize_dir) && a.resize_minHeight != a.resize_maxHeight,
                    j = function (d) {
                        var e = f, m = g, c = e + (d.data.$.screenX - n) * ("rtl" == h ? -1 : 1),
                            d = m + (d.data.$.screenY - o);
                        i && (e = Math.max(a.resize_minWidth, Math.min(c, a.resize_maxWidth)));
                        l && (m = Math.max(a.resize_minHeight, Math.min(d, a.resize_maxHeight)));
                        b.resize(i ? e : null, m)
                    }, k = function () {
                        CKEDITOR.document.removeListener("mousemove", j);
                        CKEDITOR.document.removeListener("mouseup", k);
                        b.document && (b.document.removeListener("mousemove", j), b.document.removeListener("mouseup",
                            k))
                    }, p = CKEDITOR.tools.addFunction(function (d) {
                        c || (c = b.getResizable());
                        f = c.$.offsetWidth || 0;
                        g = c.$.offsetHeight || 0;
                        n = d.screenX;
                        o = d.screenY;
                        a.resize_minWidth > f && (a.resize_minWidth = f);
                        a.resize_minHeight > g && (a.resize_minHeight = g);
                        CKEDITOR.document.on("mousemove", j);
                        CKEDITOR.document.on("mouseup", k);
                        b.document && (b.document.on("mousemove", j), b.document.on("mouseup", k));
                        d.preventDefault && d.preventDefault()
                    });
                b.on("destroy", function () {
                    CKEDITOR.tools.removeFunction(p)
                });
                b.on("uiSpace", function (a) {
                    if ("bottom" ==
                        a.data.space) {
                        var e = "";
                        i && !l && (e = " cke_resizer_horizontal");
                        !i && l && (e = " cke_resizer_vertical");
                        var c = '<span id="' + q + '" class="cke_resizer' + e + " cke_resizer_" + h + '" title="' + CKEDITOR.tools.htmlEncode(b.lang.common.resize) + '" onmousedown="CKEDITOR.tools.callFunction(' + p + ', event)">' + ("ltr" == h ? "◢" : "◣") + "</span>";
                        "ltr" == h && "ltr" == e ? a.data.html += c : a.data.html = c + a.data.html
                    }
                }, b, null, 100);
                b.on("maximize", function (a) {
                    b.ui.space("resizer")[a.data == CKEDITOR.TRISTATE_ON ? "hide" : "show"]()
                })
            }
        }
    });
    (function () {
        var c = '<a id="{id}" class="cke_button cke_button__{name} cke_button_{state} {cls}"' + (CKEDITOR.env.gecko && 10900 <= CKEDITOR.env.version && !CKEDITOR.env.hc ? "" : " href=\"javascript:void('{titleJs}')\"") + ' title="{title}" tabindex="-1" hidefocus="true" role="button" aria-labelledby="{id}_label" aria-haspopup="{hasArrow}" aria-disabled="{ariaDisabled}"';
        if (CKEDITOR.env.opera || CKEDITOR.env.gecko && CKEDITOR.env.mac) c += ' onkeypress="return false;"';
        CKEDITOR.env.gecko && (c += ' onblur="this.style.cssText = this.style.cssText;"');
        var c = c + (' onkeydown="return CKEDITOR.tools.callFunction({keydownFn},event);" onfocus="return CKEDITOR.tools.callFunction({focusFn},event);"  onmousedown="return CKEDITOR.tools.callFunction({mousedownFn},event);" ' + (CKEDITOR.env.ie ? 'onclick="return false;" onmouseup' : "onclick") + '="CKEDITOR.tools.callFunction({clickFn},this);return false;"><span class="cke_button_icon cke_button__{iconName}_icon" style="{style}"'),
            c = c + '>&nbsp;</span><span id="{id}_label" class="cke_button_label cke_button__{name}_label" aria-hidden="false">{label}</span>{arrowHtml}</a>',
            m = CKEDITOR.addTemplate("buttonArrow", '<span class="cke_button_arrow">' + (CKEDITOR.env.hc ? "&#9660;" : "") + "</span>"),
            n = CKEDITOR.addTemplate("button", c);
        CKEDITOR.plugins.add("button", {
            beforeInit: function (a) {
                a.ui.addHandler(CKEDITOR.UI_BUTTON, CKEDITOR.ui.button.handler)
            }
        });
        CKEDITOR.UI_BUTTON = "button";
        CKEDITOR.ui.button = function (a) {
            CKEDITOR.tools.extend(this, a, {
                title: a.label, click: a.click || function (b) {
                    b.execCommand(a.command)
                }
            });
            this._ = {}
        };
        CKEDITOR.ui.button.handler = {
            create: function (a) {
                return new CKEDITOR.ui.button(a)
            }
        };
        CKEDITOR.ui.button.prototype = {
            render: function (a, b) {
                var c = CKEDITOR.env, i = this._.id = CKEDITOR.tools.getNextId(), f = "", e = this.command, l;
                this._.editor = a;
                var d = {
                    id: i, button: this, editor: a, focus: function () {
                        CKEDITOR.document.getById(i).focus()
                    }, execute: function () {
                        this.button.click(a)
                    }, attach: function (a) {
                        this.button.attach(a)
                    }
                }, o = CKEDITOR.tools.addFunction(function (a) {
                    if (d.onkey)return a = new CKEDITOR.dom.event(a), !1 !== d.onkey(d, a.getKeystroke())
                }), p = CKEDITOR.tools.addFunction(function (a) {
                    var b;
                    d.onfocus && (b =
                        !1 !== d.onfocus(d, new CKEDITOR.dom.event(a)));
                    CKEDITOR.env.gecko && 10900 > CKEDITOR.env.version && a.preventBubble();
                    return b
                }), j = 0, q = CKEDITOR.tools.addFunction(function () {
                    if (CKEDITOR.env.opera) {
                        var b = a.editable();
                        b.isInline() && b.hasFocus && (a.lockSelection(), j = 1)
                    }
                });
                d.clickFn = l = CKEDITOR.tools.addFunction(function () {
                    j && (a.unlockSelection(1), j = 0);
                    d.execute()
                });
                if (this.modes) {
                    var k = {}, g = function () {
                        var b = a.mode;
                        b && (b = this.modes[b] ? void 0 != k[b] ? k[b] : CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED, b = a.readOnly &&
                        !this.readOnly ? CKEDITOR.TRISTATE_DISABLED : b, this.setState(b), this.refresh && this.refresh())
                    };
                    a.on("beforeModeUnload", function () {
                        a.mode && this._.state != CKEDITOR.TRISTATE_DISABLED && (k[a.mode] = this._.state)
                    }, this);
                    a.on("activeFilterChange", g, this);
                    a.on("mode", g, this);
                    !this.readOnly && a.on("readOnly", g, this)
                } else if (e && (e = a.getCommand(e))) e.on("state", function () {
                    this.setState(e.state)
                }, this), f += e.state == CKEDITOR.TRISTATE_ON ? "on" : e.state == CKEDITOR.TRISTATE_DISABLED ? "disabled" : "off";
                if (this.directional) a.on("contentDirChanged",
                    function (b) {
                        var c = CKEDITOR.document.getById(this._.id), d = c.getFirst(), b = b.data;
                        b != a.lang.dir ? c.addClass("cke_" + b) : c.removeClass("cke_ltr").removeClass("cke_rtl");
                        d.setAttribute("style", CKEDITOR.skin.getIconStyle(h, "rtl" == b, this.icon, this.iconOffset))
                    }, this);
                e || (f += "off");
                var h = g = this.name || this.command;
                this.icon && !/\./.test(this.icon) && (h = this.icon, this.icon = null);
                c = {
                    id: i,
                    name: g,
                    iconName: h,
                    label: this.label,
                    cls: this.className || "",
                    state: f,
                    ariaDisabled: "disabled" == f ? "true" : "false",
                    title: this.title,
                    titleJs: c.gecko &&
                    10900 <= c.version && !c.hc ? "" : (this.title || "").replace("'", ""),
                    hasArrow: this.hasArrow ? "true" : "false",
                    keydownFn: o,
                    mousedownFn: q,
                    focusFn: p,
                    clickFn: l,
                    style: CKEDITOR.skin.getIconStyle(h, "rtl" == a.lang.dir, this.icon, this.iconOffset),
                    arrowHtml: this.hasArrow ? m.output() : ""
                };
                n.output(c, b);
                if (this.onRender) this.onRender();
                return d
            }, setState: function (a) {
                if (this._.state == a)return !1;
                this._.state = a;
                var b = CKEDITOR.document.getById(this._.id);
                return b ? (b.setState(a, "cke_button"), a == CKEDITOR.TRISTATE_DISABLED ? b.setAttribute("aria-disabled",
                    !0) : b.removeAttribute("aria-disabled"), a == CKEDITOR.TRISTATE_ON ? b.setAttribute("aria-pressed", !0) : b.removeAttribute("aria-pressed"), !0) : !1
            }, getState: function () {
                return this._.state
            }, toFeature: function (a) {
                if (this._.feature)return this._.feature;
                var b = this;
                !this.allowedContent && (!this.requiredContent && this.command) && (b = a.getCommand(this.command) || b);
                return this._.feature = b
            }
        };
        CKEDITOR.ui.prototype.addButton = function (a, b) {
            this.add(a, CKEDITOR.UI_BUTTON, b)
        }
    })();
    (function () {
        function w(a) {
            function d() {
                for (var b = g(), e = CKEDITOR.tools.clone(a.config.toolbarGroups) || n(a), f = 0; f < e.length; f++) {
                    var k = e[f];
                    if ("/" != k) {
                        "string" == typeof k && (k = e[f] = {name: k});
                        var i, d = k.groups;
                        if (d)for (var h = 0; h < d.length; h++)i = d[h], (i = b[i]) && c(k, i);
                        (i = b[k.name]) && c(k, i)
                    }
                }
                return e
            }

            function g() {
                var b = {}, c, f, e;
                for (c in a.ui.items)f = a.ui.items[c], e = f.toolbar || "others", e = e.split(","), f = e[0], e = parseInt(e[1] || -1, 10), b[f] || (b[f] = []), b[f].push({
                    name: c,
                    order: e
                });
                for (f in b)b[f] = b[f].sort(function (b,
                                                       a) {
                    return b.order == a.order ? 0 : 0 > a.order ? -1 : 0 > b.order ? 1 : b.order < a.order ? -1 : 1
                });
                return b
            }

            function c(c, e) {
                if (e.length) {
                    c.items ? c.items.push(a.ui.create("-")) : c.items = [];
                    for (var f; f = e.shift();)if (f = "string" == typeof f ? f : f.name, !b || -1 == CKEDITOR.tools.indexOf(b, f)) (f = a.ui.create(f)) && a.addFeature(f) && c.items.push(f)
                }
            }

            function h(b) {
                var a = [], e, d, h;
                for (e = 0; e < b.length; ++e)d = b[e], h = {}, "/" == d ? a.push(d) : CKEDITOR.tools.isArray(d) ? (c(h, CKEDITOR.tools.clone(d)), a.push(h)) : d.items && (c(h, CKEDITOR.tools.clone(d.items)),
                        h.name = d.name, a.push(h));
                return a
            }

            var b = a.config.removeButtons, b = b && b.split(","), e = a.config.toolbar;
            "string" == typeof e && (e = a.config["toolbar_" + e]);
            return a.toolbar = e ? h(e) : d()
        }

        function n(a) {
            return a._.toolbarGroups || (a._.toolbarGroups = [{
                    name: "document",
                    groups: ["mode", "document", "doctools"]
                }, {name: "clipboard", groups: ["clipboard", "undo"]}, {
                    name: "editing",
                    groups: ["find", "selection", "spellchecker"]
                }, {name: "forms"}, "/", {name: "basicstyles", groups: ["basicstyles", "cleanup"]}, {
                    name: "paragraph", groups: ["list",
                        "indent", "blocks", "align", "bidi"]
                }, {name: "links"}, {name: "insert"}, "/", {name: "styles"}, {name: "colors"}, {name: "tools"}, {name: "others"}, {name: "about"}])
        }

        var u = function () {
            this.toolbars = [];
            this.focusCommandExecuted = !1
        };
        u.prototype.focus = function () {
            for (var a = 0, d; d = this.toolbars[a++];)for (var g = 0, c; c = d.items[g++];)if (c.focus) {
                c.focus();
                return
            }
        };
        var x = {
            modes: {wysiwyg: 1, source: 1}, readOnly: 1, exec: function (a) {
                a.toolbox && (a.toolbox.focusCommandExecuted = !0, CKEDITOR.env.ie || CKEDITOR.env.air ? setTimeout(function () {
                        a.toolbox.focus()
                    },
                    100) : a.toolbox.focus())
            }
        };
        CKEDITOR.plugins.add("toolbar", {
            requires: "button", init: function (a) {
                var d, g = function (c, h) {
                    var b, e = "rtl" == a.lang.dir, j = a.config.toolbarGroupCycling, o = e ? 37 : 39, e = e ? 39 : 37,
                        j = void 0 === j || j;
                    switch (h) {
                        case 9:
                        case CKEDITOR.SHIFT + 9:
                            for (; !b || !b.items.length;)if (b = 9 == h ? (b ? b.next : c.toolbar.next) || a.toolbox.toolbars[0] : (b ? b.previous : c.toolbar.previous) || a.toolbox.toolbars[a.toolbox.toolbars.length - 1], b.items.length)for (c = b.items[d ? b.items.length - 1 : 0]; c && !c.focus;)(c = d ? c.previous : c.next) ||
                            (b = 0);
                            c && c.focus();
                            return !1;
                        case o:
                            b = c;
                            do b = b.next, !b && j && (b = c.toolbar.items[0]); while (b && !b.focus);
                            b ? b.focus() : g(c, 9);
                            return !1;
                        case 40:
                            return c.button && c.button.hasArrow ? (a.once("panelShow", function (b) {
                                b.data._.panel._.currentBlock.onKeyDown(40)
                            }), c.execute()) : g(c, 40 == h ? o : e), !1;
                        case e:
                        case 38:
                            b = c;
                            do b = b.previous, !b && j && (b = c.toolbar.items[c.toolbar.items.length - 1]); while (b && !b.focus);
                            b ? b.focus() : (d = 1, g(c, CKEDITOR.SHIFT + 9), d = 0);
                            return !1;
                        case 27:
                            return a.focus(), !1;
                        case 13:
                        case 32:
                            return c.execute(),
                                !1
                    }
                    return !0
                };
                a.on("uiSpace", function (c) {
                    if (c.data.space == a.config.toolbarLocation) {
                        c.removeListener();
                        a.toolbox = new u;
                        var d = CKEDITOR.tools.getNextId(),
                            b = ['<span id="', d, '" class="cke_voice_label">', a.lang.toolbar.toolbars, "</span>", '<span id="' + a.ui.spaceId("toolbox") + '" class="cke_toolbox" role="group" aria-labelledby="', d, '" onmousedown="return false;">'],
                            d = !1 !== a.config.toolbarStartupExpanded, e, j;
                        a.config.toolbarCanCollapse && a.elementMode != CKEDITOR.ELEMENT_MODE_INLINE && b.push('<span class="cke_toolbox_main"' +
                            (d ? ">" : ' style="display:none">'));
                        for (var o = a.toolbox.toolbars, f = w(a), k = 0; k < f.length; k++) {
                            var i, l = 0, r, m = f[k], s;
                            if (m)if (e && (b.push("</span>"), j = e = 0), "/" === m) b.push('<span class="cke_toolbar_break"></span>'); else {
                                s = m.items || m;
                                for (var t = 0; t < s.length; t++) {
                                    var p = s[t], n;
                                    if (p)if (p.type == CKEDITOR.UI_SEPARATOR) j = e && p; else {
                                        n = !1 !== p.canGroup;
                                        if (!l) {
                                            i = CKEDITOR.tools.getNextId();
                                            l = {id: i, items: []};
                                            r = m.name && (a.lang.toolbar.toolbarGroups[m.name] || m.name);
                                            b.push('<span id="', i, '" class="cke_toolbar"', r ? ' aria-labelledby="' +
                                                i + '_label"' : "", ' role="toolbar">');
                                            r && b.push('<span id="', i, '_label" class="cke_voice_label">', r, "</span>");
                                            b.push('<span class="cke_toolbar_start"></span>');
                                            var q = o.push(l) - 1;
                                            0 < q && (l.previous = o[q - 1], l.previous.next = l)
                                        }
                                        n ? e || (b.push('<span class="cke_toolgroup" role="presentation">'), e = 1) : e && (b.push("</span>"), e = 0);
                                        i = function (c) {
                                            c = c.render(a, b);
                                            q = l.items.push(c) - 1;
                                            if (q > 0) {
                                                c.previous = l.items[q - 1];
                                                c.previous.next = c
                                            }
                                            c.toolbar = l;
                                            c.onkey = g;
                                            c.onfocus = function () {
                                                a.toolbox.focusCommandExecuted || a.focus()
                                            }
                                        };
                                        j && (i(j), j = 0);
                                        i(p)
                                    }
                                }
                                e && (b.push("</span>"), j = e = 0);
                                l && b.push('<span class="cke_toolbar_end"></span></span>')
                            }
                        }
                        a.config.toolbarCanCollapse && b.push("</span>");
                        if (a.config.toolbarCanCollapse && a.elementMode != CKEDITOR.ELEMENT_MODE_INLINE) {
                            var v = CKEDITOR.tools.addFunction(function () {
                                a.execCommand("toolbarCollapse")
                            });
                            a.on("destroy", function () {
                                CKEDITOR.tools.removeFunction(v)
                            });
                            a.addCommand("toolbarCollapse", {
                                readOnly: 1, exec: function (b) {
                                    var a = b.ui.space("toolbar_collapser"), c = a.getPrevious(),
                                        e = b.ui.space("contents"),
                                        d = c.getParent(), f = parseInt(e.$.style.height, 10), h = d.$.offsetHeight,
                                        g = a.hasClass("cke_toolbox_collapser_min");
                                    g ? (c.show(), a.removeClass("cke_toolbox_collapser_min"), a.setAttribute("title", b.lang.toolbar.toolbarCollapse)) : (c.hide(), a.addClass("cke_toolbox_collapser_min"), a.setAttribute("title", b.lang.toolbar.toolbarExpand));
                                    a.getFirst().setText(g ? "▲" : "◀");
                                    e.setStyle("height", f - (d.$.offsetHeight - h) + "px");
                                    b.fire("resize")
                                }, modes: {wysiwyg: 1, source: 1}
                            });
                            a.setKeystroke(CKEDITOR.ALT + (CKEDITOR.env.ie || CKEDITOR.env.webkit ?
                                    189 : 109), "toolbarCollapse");
                            b.push('<a title="' + (d ? a.lang.toolbar.toolbarCollapse : a.lang.toolbar.toolbarExpand) + '" id="' + a.ui.spaceId("toolbar_collapser") + '" tabIndex="-1" class="cke_toolbox_collapser');
                            d || b.push(" cke_toolbox_collapser_min");
                            b.push('" onclick="CKEDITOR.tools.callFunction(' + v + ')">', '<span class="cke_arrow">&#9650;</span>', "</a>")
                        }
                        b.push("</span>");
                        c.data.html += b.join("")
                    }
                });
                a.on("destroy", function () {
                    if (this.toolbox) {
                        var a, d = 0, b, e, g;
                        for (a = this.toolbox.toolbars; d < a.length; d++) {
                            e = a[d].items;
                            for (b = 0; b < e.length; b++)g = e[b], g.clickFn && CKEDITOR.tools.removeFunction(g.clickFn), g.keyDownFn && CKEDITOR.tools.removeFunction(g.keyDownFn)
                        }
                    }
                });
                a.on("uiReady", function () {
                    var c = a.ui.space("toolbox");
                    c && a.focusManager.add(c, 1)
                });
                a.addCommand("toolbarFocus", x);
                a.setKeystroke(CKEDITOR.ALT + 121, "toolbarFocus");
                a.ui.add("-", CKEDITOR.UI_SEPARATOR, {});
                a.ui.addHandler(CKEDITOR.UI_SEPARATOR, {
                    create: function () {
                        return {
                            render: function (a, d) {
                                d.push('<span class="cke_toolbar_separator" role="separator"></span>');
                                return {}
                            }
                        }
                    }
                })
            }
        });
        CKEDITOR.ui.prototype.addToolbarGroup = function (a, d, g) {
            var c = n(this.editor), h = 0 === d, b = {name: a};
            if (g) {
                if (g = CKEDITOR.tools.search(c, function (a) {
                        return a.name == g
                    })) {
                    !g.groups && (g.groups = []);
                    if (d && (d = CKEDITOR.tools.indexOf(g.groups, d), 0 <= d)) {
                        g.groups.splice(d + 1, 0, a);
                        return
                    }
                    h ? g.groups.splice(0, 0, a) : g.groups.push(a);
                    return
                }
                d = null
            }
            d && (d = CKEDITOR.tools.indexOf(c, function (a) {
                return a.name == d
            }));
            h ? c.splice(0, 0, a) : "number" == typeof d ? c.splice(d + 1, 0, b) : c.push(a)
        }
    })();
    CKEDITOR.UI_SEPARATOR = "separator";
    CKEDITOR.config.toolbarLocation = "top";
    (function () {
        var k;

        function n(a, c) {
            function j(d) {
                d = i.list[d];
                if (d.equals(a.editable()) || "true" == d.getAttribute("contenteditable")) {
                    var e = a.createRange();
                    e.selectNodeContents(d);
                    e.select()
                } else a.getSelection().selectElement(d);
                a.focus()
            }

            function s() {
                l && l.setHtml(o);
                delete i.list
            }

            var m = a.ui.spaceId("path"), l, i = a._.elementsPath, n = i.idBase;
            c.html += '<span id="' + m + '_label" class="cke_voice_label">' + a.lang.elementspath.eleLabel + '</span><span id="' + m + '" class="cke_path" role="group" aria-labelledby="' + m +
                '_label">' + o + "</span>";
            a.on("uiReady", function () {
                var d = a.ui.space("path");
                d && a.focusManager.add(d, 1)
            });
            i.onClick = j;
            var t = CKEDITOR.tools.addFunction(j), u = CKEDITOR.tools.addFunction(function (d, e) {
                var g = i.idBase, b, e = new CKEDITOR.dom.event(e);
                b = "rtl" == a.lang.dir;
                switch (e.getKeystroke()) {
                    case b ? 39 : 37:
                    case 9:
                        return (b = CKEDITOR.document.getById(g + (d + 1))) || (b = CKEDITOR.document.getById(g + "0")), b.focus(), !1;
                    case b ? 37 : 39:
                    case CKEDITOR.SHIFT + 9:
                        return (b = CKEDITOR.document.getById(g + (d - 1))) || (b = CKEDITOR.document.getById(g +
                            (i.list.length - 1))), b.focus(), !1;
                    case 27:
                        return a.focus(), !1;
                    case 13:
                    case 32:
                        return j(d), !1
                }
                return !0
            });
            a.on("selectionChange", function () {
                a.editable();
                for (var d = [], e = i.list = [], g = [], b = i.filters, c = !0, j = a.elementPath().elements, f,
                         k = j.length; k--;) {
                    var h = j[k], p = 0;
                    f = h.data("cke-display-name") ? h.data("cke-display-name") : h.data("cke-real-element-type") ? h.data("cke-real-element-type") : h.getName();
                    c = h.hasAttribute("contenteditable") ? "true" == h.getAttribute("contenteditable") : c;
                    !c && !h.hasAttribute("contenteditable") &&
                    (p = 1);
                    for (var q = 0; q < b.length; q++) {
                        var r = b[q](h, f);
                        if (!1 === r) {
                            p = 1;
                            break
                        }
                        f = r || f
                    }
                    p || (e.unshift(h), g.unshift(f))
                }
                e = e.length;
                for (b = 0; b < e; b++)f = g[b], c = a.lang.elementspath.eleTitle.replace(/%1/, f), f = v.output({
                    id: n + b,
                    label: c,
                    text: f,
                    jsTitle: "javascript:void('" + f + "')",
                    index: b,
                    keyDownFn: u,
                    clickFn: t
                }), d.unshift(f);
                l || (l = CKEDITOR.document.getById(m));
                g = l;
                g.setHtml(d.join("") + o);
                a.fire("elementsPathUpdate", {space: g})
            });
            a.on("readOnly", s);
            a.on("contentDomUnload", s);
            a.addCommand("elementsPathFocus", k);
            a.setKeystroke(CKEDITOR.ALT +
                122, "elementsPathFocus")
        }

        k = {
            editorFocus: !1, readOnly: 1, exec: function (a) {
                (a = CKEDITOR.document.getById(a._.elementsPath.idBase + "0")) && a.focus(CKEDITOR.env.ie || CKEDITOR.env.air)
            }
        };
        var o = '<span class="cke_path_empty">&nbsp;</span>', c = "";
        if (CKEDITOR.env.opera || CKEDITOR.env.gecko && CKEDITOR.env.mac) c += ' onkeypress="return false;"';
        CKEDITOR.env.gecko && (c += ' onblur="this.style.cssText = this.style.cssText;"');
        var v = CKEDITOR.addTemplate("pathItem", '<a id="{id}" href="{jsTitle}" tabindex="-1" class="cke_path_item" title="{label}"' +
            (CKEDITOR.env.gecko && 10900 > CKEDITOR.env.version ? ' onfocus="event.preventBubble();"' : "") + c + ' hidefocus="true"  onkeydown="return CKEDITOR.tools.callFunction({keyDownFn},{index}, event );" onclick="CKEDITOR.tools.callFunction({clickFn},{index}); return false;" role="button" aria-label="{label}">{text}</a>');
        CKEDITOR.plugins.add("elementspath", {
            init: function (a) {
                a._.elementsPath = {idBase: "cke_elementspath_" + CKEDITOR.tools.getNextNumber() + "_", filters: []};
                a.on("uiSpace", function (c) {
                    "bottom" == c.data.space &&
                    n(a, c.data)
                })
            }
        })
    })();
    (function () {
        function l(e, c, b) {
            b = e.config.forceEnterMode || b;
            "wysiwyg" == e.mode && (c || (c = e.activeEnterMode), e.elementPath().isContextFor("p") || (c = CKEDITOR.ENTER_BR, b = 1), e.fire("saveSnapshot"), c == CKEDITOR.ENTER_BR ? o(e, c, null, b) : p(e, c, null, b), e.fire("saveSnapshot"))
        }

        function q(e) {
            for (var e = e.getSelection().getRanges(!0), c = e.length - 1; 0 < c; c--)e[c].deleteContents();
            return e[0]
        }

        CKEDITOR.plugins.add("enterkey", {
            init: function (e) {
                e.addCommand("enter", {
                    modes: {wysiwyg: 1}, editorFocus: !1, exec: function (c) {
                        l(c)
                    }
                });
                e.addCommand("shiftEnter", {
                    modes: {wysiwyg: 1}, editorFocus: !1, exec: function (c) {
                        l(c, c.activeShiftEnterMode, 1)
                    }
                });
                e.setKeystroke([[13, "enter"], [CKEDITOR.SHIFT + 13, "shiftEnter"]])
            }
        });
        var t = CKEDITOR.dom.walker.whitespaces(), u = CKEDITOR.dom.walker.bookmark();
        CKEDITOR.plugins.enterkey = {
            enterBlock: function (e, c, b, i) {
                if (b = b || q(e)) {
                    var f = b.document, j = b.checkStartOfBlock(), h = b.checkEndOfBlock(),
                        a = e.elementPath(b.startContainer).block, k = c == CKEDITOR.ENTER_DIV ? "div" : "p", d;
                    if (j && h) {
                        if (a && (a.is("li") || a.getParent().is("li"))) {
                            b =
                                a.getParent();
                            d = b.getParent();
                            var i = !a.hasPrevious(), m = !a.hasNext(), k = e.getSelection(), g = k.createBookmarks(),
                                j = a.getDirection(1), h = a.getAttribute("class"), n = a.getAttribute("style"),
                                l = d.getDirection(1) != j, e = e.enterMode != CKEDITOR.ENTER_BR || l || n || h;
                            if (d.is("li"))if (i || m) a[i ? "insertBefore" : "insertAfter"](d); else a.breakParent(d); else {
                                if (e)if (d = f.createElement(c == CKEDITOR.ENTER_P ? "p" : "div"), l && d.setAttribute("dir", j), n && d.setAttribute("style", n), h && d.setAttribute("class", h), a.moveChildren(d), i || m) d[i ?
                                    "insertBefore" : "insertAfter"](b); else a.breakParent(b), d.insertAfter(b); else if (a.appendBogus(!0), i || m)for (; f = a[i ? "getFirst" : "getLast"]();)f[i ? "insertBefore" : "insertAfter"](b); else for (a.breakParent(b); f = a.getLast();)f.insertAfter(b);
                                a.remove()
                            }
                            k.selectBookmarks(g);
                            return
                        }
                        if (a && a.getParent().is("blockquote")) {
                            a.breakParent(a.getParent());
                            a.getPrevious().getFirst(CKEDITOR.dom.walker.invisible(1)) || a.getPrevious().remove();
                            a.getNext().getFirst(CKEDITOR.dom.walker.invisible(1)) || a.getNext().remove();
                            b.moveToElementEditStart(a);
                            b.select();
                            return
                        }
                    } else if (a && a.is("pre") && !h) {
                        o(e, c, b, i);
                        return
                    }
                    if (h = b.splitBlock(k)) {
                        c = h.previousBlock;
                        a = h.nextBlock;
                        e = h.wasStartOfBlock;
                        j = h.wasEndOfBlock;
                        if (a) g = a.getParent(), g.is("li") && (a.breakParent(g), a.move(a.getNext(), 1)); else if (c && (g = c.getParent()) && g.is("li")) c.breakParent(g), g = c.getNext(), b.moveToElementEditStart(g), c.move(c.getPrevious());
                        if (!e && !j) a.is("li") && (d = b.clone(), d.selectNodeContents(a), d = new CKEDITOR.dom.walker(d), d.evaluator = function (a) {
                            return !(u(a) ||
                            t(a) || a.type == CKEDITOR.NODE_ELEMENT && a.getName() in CKEDITOR.dtd.$inline && !(a.getName() in CKEDITOR.dtd.$empty))
                        }, (g = d.next()) && (g.type == CKEDITOR.NODE_ELEMENT && g.is("ul", "ol")) && (CKEDITOR.env.needsBrFiller ? f.createElement("br") : f.createText(" ")).insertBefore(g)), a && b.moveToElementEditStart(a); else {
                            if (c) {
                                if (c.is("li") || !r.test(c.getName()) && !c.is("pre")) d = c.clone()
                            } else a && (d = a.clone());
                            d ? i && !d.is("li") && d.renameNode(k) : g && g.is("li") ? d = g : (d = f.createElement(k), c && (m = c.getDirection()) && d.setAttribute("dir",
                                m));
                            if (f = h.elementPath) {
                                i = 0;
                                for (k = f.elements.length; i < k; i++) {
                                    g = f.elements[i];
                                    if (g.equals(f.block) || g.equals(f.blockLimit))break;
                                    CKEDITOR.dtd.$removeEmpty[g.getName()] && (g = g.clone(), d.moveChildren(g), d.append(g))
                                }
                            }
                            d.appendBogus();
                            d.getParent() || b.insertNode(d);
                            d.is("li") && d.removeAttribute("value");
                            if (CKEDITOR.env.ie && e && (!j || !c.getChildCount())) b.moveToElementEditStart(j ? c : d), b.select();
                            b.moveToElementEditStart(e && !j ? a : d)
                        }
                        b.select();
                        b.scrollIntoView()
                    }
                }
            }, enterBr: function (e, c, b, i) {
                if (b = b || q(e)) {
                    var f =
                            b.document, j = b.checkEndOfBlock(),
                        h = new CKEDITOR.dom.elementPath(e.getSelection().getStartElement()), a = h.block,
                        h = a && h.block.getName();
                    !i && "li" == h ? p(e, c, b, i) : (!i && j && r.test(h) ? (j = a.getDirection()) ? (f = f.createElement("div"), f.setAttribute("dir", j), f.insertAfter(a), b.setStart(f, 0)) : (f.createElement("br").insertAfter(a), CKEDITOR.env.gecko && f.createText("").insertAfter(a), b.setStartAt(a.getNext(), CKEDITOR.env.ie ? CKEDITOR.POSITION_BEFORE_START : CKEDITOR.POSITION_AFTER_START)) : (a = "pre" == h && CKEDITOR.env.ie &&
                    8 > CKEDITOR.env.version ? f.createText("\r") : f.createElement("br"), b.deleteContents(), b.insertNode(a), CKEDITOR.env.needsBrFiller ? (f.createText("﻿").insertAfter(a), j && a.getParent().appendBogus(), a.getNext().$.nodeValue = "", b.setStartAt(a.getNext(), CKEDITOR.POSITION_AFTER_START)) : b.setStartAt(a, CKEDITOR.POSITION_AFTER_END)), b.collapse(!0), b.select(), b.scrollIntoView())
                }
            }
        };
        var s = CKEDITOR.plugins.enterkey, o = s.enterBr, p = s.enterBlock, r = /^h[1-6]$/
    })();
    (function () {
        function j(a, b) {
            var d = {}, e = [], f = {nbsp: " ", shy: "­", gt: ">", lt: "<", amp: "&", apos: "'", quot: '"'},
                a = a.replace(/\b(nbsp|shy|gt|lt|amp|apos|quot)(?:,|$)/g, function (a, h) {
                    var c = b ? "&" + h + ";" : f[h];
                    d[c] = b ? f[h] : "&" + h + ";";
                    e.push(c);
                    return ""
                });
            if (!b && a) {
                var a = a.split(","), c = document.createElement("div"), g;
                c.innerHTML = "&" + a.join(";&") + ";";
                g = c.innerHTML;
                c = null;
                for (c = 0; c < g.length; c++) {
                    var i = g.charAt(c);
                    d[i] = "&" + a[c] + ";";
                    e.push(i)
                }
            }
            d.regex = e.join(b ? "|" : "");
            return d
        }

        CKEDITOR.plugins.add("entities", {
            afterInit: function (a) {
                var b =
                    a.config;
                if (a = (a = a.dataProcessor) && a.htmlFilter) {
                    var d = [];
                    !1 !== b.basicEntities && d.push("nbsp,gt,lt,amp");
                    b.entities && (d.length && d.push("quot,iexcl,cent,pound,curren,yen,brvbar,sect,uml,copy,ordf,laquo,not,shy,reg,macr,deg,plusmn,sup2,sup3,acute,micro,para,middot,cedil,sup1,ordm,raquo,frac14,frac12,frac34,iquest,times,divide,fnof,bull,hellip,prime,Prime,oline,frasl,weierp,image,real,trade,alefsym,larr,uarr,rarr,darr,harr,crarr,lArr,uArr,rArr,dArr,hArr,forall,part,exist,empty,nabla,isin,notin,ni,prod,sum,minus,lowast,radic,prop,infin,ang,and,or,cap,cup,int,there4,sim,cong,asymp,ne,equiv,le,ge,sub,sup,nsub,sube,supe,oplus,otimes,perp,sdot,lceil,rceil,lfloor,rfloor,lang,rang,loz,spades,clubs,hearts,diams,circ,tilde,ensp,emsp,thinsp,zwnj,zwj,lrm,rlm,ndash,mdash,lsquo,rsquo,sbquo,ldquo,rdquo,bdquo,dagger,Dagger,permil,lsaquo,rsaquo,euro"),
                    b.entities_latin && d.push("Agrave,Aacute,Acirc,Atilde,Auml,Aring,AElig,Ccedil,Egrave,Eacute,Ecirc,Euml,Igrave,Iacute,Icirc,Iuml,ETH,Ntilde,Ograve,Oacute,Ocirc,Otilde,Ouml,Oslash,Ugrave,Uacute,Ucirc,Uuml,Yacute,THORN,szlig,agrave,aacute,acirc,atilde,auml,aring,aelig,ccedil,egrave,eacute,ecirc,euml,igrave,iacute,icirc,iuml,eth,ntilde,ograve,oacute,ocirc,otilde,ouml,oslash,ugrave,uacute,ucirc,uuml,yacute,thorn,yuml,OElig,oelig,Scaron,scaron,Yuml"), b.entities_greek && d.push("Alpha,Beta,Gamma,Delta,Epsilon,Zeta,Eta,Theta,Iota,Kappa,Lambda,Mu,Nu,Xi,Omicron,Pi,Rho,Sigma,Tau,Upsilon,Phi,Chi,Psi,Omega,alpha,beta,gamma,delta,epsilon,zeta,eta,theta,iota,kappa,lambda,mu,nu,xi,omicron,pi,rho,sigmaf,sigma,tau,upsilon,phi,chi,psi,omega,thetasym,upsih,piv"),
                    b.entities_additional && d.push(b.entities_additional));
                    var e = j(d.join(",")), f = e.regex ? "[" + e.regex + "]" : "a^";
                    delete e.regex;
                    b.entities && b.entities_processNumerical && (f = "[^ -~]|" + f);
                    var f = RegExp(f, "g"), c = function (a) {
                        return b.entities_processNumerical == "force" || !e[a] ? "&#" + a.charCodeAt(0) + ";" : e[a]
                    }, g = j("nbsp,gt,lt,amp,shy", !0), i = RegExp(g.regex, "g"), k = function (a) {
                        return g[a]
                    };
                    a.addRules({
                        text: function (a) {
                            return a.replace(i, k).replace(f, c)
                        }
                    }, {applyToAll: !0})
                }
            }
        })
    })();
    CKEDITOR.config.basicEntities = !0;
    CKEDITOR.config.entities = !0;
    CKEDITOR.config.entities_latin = !0;
    CKEDITOR.config.entities_greek = !0;
    CKEDITOR.config.entities_additional = "#39";
    CKEDITOR.plugins.add("popup");
    CKEDITOR.tools.extend(CKEDITOR.editor.prototype, {
        popup: function (e, a, b, d) {
            a = a || "80%";
            b = b || "70%";
            "string" == typeof a && (1 < a.length && "%" == a.substr(a.length - 1, 1)) && (a = parseInt(window.screen.width * parseInt(a, 10) / 100, 10));
            "string" == typeof b && (1 < b.length && "%" == b.substr(b.length - 1, 1)) && (b = parseInt(window.screen.height * parseInt(b, 10) / 100, 10));
            640 > a && (a = 640);
            420 > b && (b = 420);
            var f = parseInt((window.screen.height - b) / 2, 10), g = parseInt((window.screen.width - a) / 2, 10),
                d = (d || "location=no,menubar=no,toolbar=no,dependent=yes,minimizable=no,modal=yes,alwaysRaised=yes,resizable=yes,scrollbars=yes") + ",width=" +
                    a + ",height=" + b + ",top=" + f + ",left=" + g, c = window.open("", null, d, !0);
            if (!c)return !1;
            try {
                -1 == navigator.userAgent.toLowerCase().indexOf(" chrome/") && (c.moveTo(g, f), c.resizeTo(a, b)), c.focus(), c.location.href = e
            } catch (h) {
                window.open(e, null, d, !0)
            }
            return !0
        }
    });
    (function () {
        function g(a, c) {
            var d = [];
            if (c)for (var b in c)d.push(b + "=" + encodeURIComponent(c[b])); else return a;
            return a + (-1 != a.indexOf("?") ? "&" : "?") + d.join("&")
        }

        function i(a) {
            a += "";
            return a.charAt(0).toUpperCase() + a.substr(1)
        }

        function k() {
            var a = this.getDialog(), c = a.getParentEditor();
            c._.filebrowserSe = this;
            var d = c.config["filebrowser" + i(a.getName()) + "WindowWidth"] || c.config.filebrowserWindowWidth || "80%",
                a = c.config["filebrowser" + i(a.getName()) + "WindowHeight"] || c.config.filebrowserWindowHeight || "70%",
                b = this.filebrowser.params || {};
            b.CKEditor = c.name;
            b.CKEditorFuncNum = c._.filebrowserFn;
            b.langCode || (b.langCode = c.langCode);
            b = g(this.filebrowser.url, b);
            c.popup(b, d, a, c.config.filebrowserWindowFeatures || c.config.fileBrowserWindowFeatures)
        }

        function l() {
            var a = this.getDialog();
            a.getParentEditor()._.filebrowserSe = this;
            return !a.getContentElement(this["for"][0], this["for"][1]).getInputElement().$.value || !a.getContentElement(this["for"][0], this["for"][1]).getAction() ? !1 : !0
        }

        function m(a, c, d) {
            var b = d.params || {};
            b.CKEditor = a.name;
            b.CKEditorFuncNum = a._.filebrowserFn;
            b.langCode || (b.langCode = a.langCode);
            c.action = g(d.url, b);
            c.filebrowser = d
        }

        function j(a, c, d, b) {
            if (b && b.length)for (var e,
                                       g = b.length; g--;)if (e = b[g], ("hbox" == e.type || "vbox" == e.type || "fieldset" == e.type) && j(a, c, d, e.children), e.filebrowser)if ("string" == typeof e.filebrowser && (e.filebrowser = {
                    action: "fileButton" == e.type ? "QuickUpload" : "Browse",
                    target: e.filebrowser
                }), "Browse" == e.filebrowser.action) {
                var f = e.filebrowser.url;
                void 0 === f && (f = a.config["filebrowser" +
                i(c) + "BrowseUrl"], void 0 === f && (f = a.config.filebrowserBrowseUrl));
                f && (e.onClick = k, e.filebrowser.url = f, e.hidden = !1)
            } else if ("QuickUpload" == e.filebrowser.action && e["for"] && (f = e.filebrowser.url, void 0 === f && (f = a.config["filebrowser" + i(c) + "UploadUrl"], void 0 === f && (f = a.config.filebrowserUploadUrl)), f)) {
                var h = e.onClick;
                e.onClick = function (a) {
                    var b = a.sender;
                    return h && h.call(b, a) === false ? false : l.call(b, a)
                };
                e.filebrowser.url = f;
                e.hidden = !1;
                m(a, d.getContents(e["for"][0]).get(e["for"][1]), e.filebrowser)
            }
        }

        function h(a,
                   c, d) {
            if (-1 !== d.indexOf(";")) {
                for (var d = d.split(";"), b = 0; b < d.length; b++)if (h(a, c, d[b]))return !0;
                return !1
            }
            return (a = a.getContents(c).get(d).filebrowser) && a.url
        }

        function n(a, c) {
            var d = this._.filebrowserSe.getDialog(), b = this._.filebrowserSe["for"],
                e = this._.filebrowserSe.filebrowser.onSelect;
            b && d.getContentElement(b[0], b[1]).reset();
            if (!("function" == typeof c && !1 === c.call(this._.filebrowserSe)) && !(e && !1 === e.call(this._.filebrowserSe, a, c)) && ("string" == typeof c && c && alert(c), a && (b = this._.filebrowserSe, d = b.getDialog(),
                    b = b.filebrowser.target || null)))if (b = b.split(":"), e = d.getContentElement(b[0], b[1])) e.setValue(a), d.selectPage(b[0])
        }

        CKEDITOR.plugins.add("filebrowser", {
            requires: "popup", init: function (a) {
                a._.filebrowserFn = CKEDITOR.tools.addFunction(n, a);
                a.on("destroy", function () {
                    CKEDITOR.tools.removeFunction(this._.filebrowserFn)
                })
            }
        });
        CKEDITOR.on("dialogDefinition", function (a) {
            if (a.editor.plugins.filebrowser)for (var c = a.data.definition, d,
                                                      b = 0; b < c.contents.length; ++b)if (d = c.contents[b]) j(a.editor, a.data.name, c, d.elements),
            d.hidden && d.filebrowser && (d.hidden = !h(c, d.id, d.filebrowser))
        })
    })();
    (function () {
        function q(a) {
            var i = a.config, l = a.fire("uiSpace", {space: "top", html: ""}).html, o = function () {
                function f(a, c, e) {
                    b.setStyle(c, t(e));
                    b.setStyle("position", a)
                }

                function e(a) {
                    var b = r.getDocumentPosition();
                    switch (a) {
                        case "top":
                            f("absolute", "top", b.y - m - n);
                            break;
                        case "pin":
                            f("fixed", "top", q);
                            break;
                        case "bottom":
                            f("absolute", "top", b.y + (c.height || c.bottom - c.top) + n)
                    }
                    j = a
                }

                var j, r, k, c, h, m, s, l = i.floatSpaceDockedOffsetX || 0, n = i.floatSpaceDockedOffsetY || 0,
                    p = i.floatSpacePinnedOffsetX || 0, q = i.floatSpacePinnedOffsetY ||
                        0;
                return function (d) {
                    if (r = a.editable())if (d && "focus" == d.name && b.show(), b.removeStyle("left"), b.removeStyle("right"), k = b.getClientRect(), c = r.getClientRect(), h = g.getViewPaneSize(), m = k.height, s = "pageXOffset" in g.$ ? g.$.pageXOffset : CKEDITOR.document.$.documentElement.scrollLeft, j) {
                        m + n <= c.top ? e("top") : m + n > h.height - c.bottom ? e("pin") : e("bottom");
                        var d = h.width / 2,
                            d = 0 < c.left && c.right < h.width && c.width > k.width ? "rtl" == a.config.contentsLangDirection ? "right" : "left" : d - c.left > c.right - d ? "left" : "right",
                            f;
                        k.width > h.width ?
                            (d = "left", f = 0) : (f = "left" == d ? 0 < c.left ? c.left : 0 : c.right < h.width ? h.width - c.right : 0, f + k.width > h.width && (d = "left" == d ? "right" : "left", f = 0));
                        b.setStyle(d, t(("pin" == j ? p : l) + f + ("pin" == j ? 0 : "left" == d ? s : -s)))
                    } else j = "pin", e("pin"), o(d)
                }
            }();
            if (l) {
                var b = CKEDITOR.document.getBody().append(CKEDITOR.dom.element.createFromHtml(u.output({
                    content: l,
                    id: a.id,
                    langDir: a.lang.dir,
                    langCode: a.langCode,
                    name: a.name,
                    style: "display:none;z-index:" + (i.baseFloatZIndex - 1),
                    topId: a.ui.spaceId("top"),
                    voiceLabel: a.lang.editorPanel + ", " +
                    a.name
                }))), p = CKEDITOR.tools.eventsBuffer(500, o), e = CKEDITOR.tools.eventsBuffer(100, o);
                b.unselectable();
                b.on("mousedown", function (a) {
                    a = a.data;
                    a.getTarget().hasAscendant("a", 1) || a.preventDefault()
                });
                a.on("focus", function (b) {
                    o(b);
                    a.on("change", p.input);
                    g.on("scroll", e.input);
                    g.on("resize", e.input)
                });
                a.on("blur", function () {
                    b.hide();
                    a.removeListener("change", p.input);
                    g.removeListener("scroll", e.input);
                    g.removeListener("resize", e.input)
                });
                a.on("destroy", function () {
                    g.removeListener("scroll", e.input);
                    g.removeListener("resize",
                        e.input);
                    b.clearCustomData();
                    b.remove()
                });
                a.focusManager.hasFocus && b.show();
                a.focusManager.add(b, 1)
            }
        }

        var u = CKEDITOR.addTemplate("floatcontainer", '<div id="cke_{name}" class="cke {id} cke_reset_all cke_chrome cke_editor_{name} cke_float cke_{langDir} ' + CKEDITOR.env.cssClass + '" dir="{langDir}" title="' + (CKEDITOR.env.gecko ? " " : "") + '" lang="{langCode}" role="application" style="{style}" aria-labelledby="cke_{name}_arialbl"><span id="cke_{name}_arialbl" class="cke_voice_label">{voiceLabel}</span><div class="cke_inner"><div id="{topId}" class="cke_top" role="presentation">{content}</div></div></div>'),
            g = CKEDITOR.document.getWindow(), t = CKEDITOR.tools.cssLength;
        CKEDITOR.plugins.add("floatingspace", {
            init: function (a) {
                a.on("loaded", function () {
                    q(this)
                }, null, null, 20)
            }
        })
    })();
    CKEDITOR.plugins.add("listblock", {
        requires: "panel", onLoad: function () {
            var f = CKEDITOR.addTemplate("panel-list", '<ul role="presentation" class="cke_panel_list">{items}</ul>'),
                g = CKEDITOR.addTemplate("panel-list-item", '<li id="{id}" class="cke_panel_listItem" role=presentation><a id="{id}_option" _cke_focus=1 hidefocus=true title="{title}" href="javascript:void(\'{val}\')"  {onclick}="CKEDITOR.tools.callFunction({clickFn},\'{val}\'); return false;" role="option">{text}</a></li>'),
                h = CKEDITOR.addTemplate("panel-list-group",
                    '<h1 id="{id}" class="cke_panel_grouptitle" role="presentation" >{label}</h1>'), i = /\'/g;
            CKEDITOR.ui.panel.prototype.addListBlock = function (a, b) {
                return this.addBlock(a, new CKEDITOR.ui.listBlock(this.getHolderElement(), b))
            };
            CKEDITOR.ui.listBlock = CKEDITOR.tools.createClass({
                base: CKEDITOR.ui.panel.block, $: function (a, b) {
                    var b = b || {}, c = b.attributes || (b.attributes = {});
                    (this.multiSelect = !!b.multiSelect) && (c["aria-multiselectable"] = !0);
                    !c.role && (c.role = "listbox");
                    this.base.apply(this, arguments);
                    this.element.setAttribute("role",
                        c.role);
                    c = this.keys;
                    c[40] = "next";
                    c[9] = "next";
                    c[38] = "prev";
                    c[CKEDITOR.SHIFT + 9] = "prev";
                    c[32] = CKEDITOR.env.ie ? "mouseup" : "click";
                    CKEDITOR.env.ie && (c[13] = "mouseup");
                    this._.pendingHtml = [];
                    this._.pendingList = [];
                    this._.items = {};
                    this._.groups = {}
                }, _: {
                    close: function () {
                        if (this._.started) {
                            var a = f.output({items: this._.pendingList.join("")});
                            this._.pendingList = [];
                            this._.pendingHtml.push(a);
                            delete this._.started
                        }
                    }, getClick: function () {
                        this._.click || (this._.click = CKEDITOR.tools.addFunction(function (a) {
                            var b = this.toggle(a);
                            if (this.onClick) this.onClick(a, b)
                        }, this));
                        return this._.click
                    }
                }, proto: {
                    add: function (a, b, c) {
                        var d = CKEDITOR.tools.getNextId();
                        this._.started || (this._.started = 1, this._.size = this._.size || 0);
                        this._.items[a] = d;
                        var e;
                        e = CKEDITOR.tools.htmlEncodeAttr(a).replace(i, "\\'");
                        a = {
                            id: d,
                            val: e,
                            onclick: CKEDITOR.env.ie ? 'onclick="return false;" onmouseup' : "onclick",
                            clickFn: this._.getClick(),
                            title: CKEDITOR.tools.htmlEncodeAttr(c || a),
                            text: b || a
                        };
                        this._.pendingList.push(g.output(a))
                    }, startGroup: function (a) {
                        this._.close();
                        var b = CKEDITOR.tools.getNextId();
                        this._.groups[a] = b;
                        this._.pendingHtml.push(h.output({id: b, label: a}))
                    }, commit: function () {
                        this._.close();
                        this.element.appendHtml(this._.pendingHtml.join(""));
                        delete this._.size;
                        this._.pendingHtml = []
                    }, toggle: function (a) {
                        var b = this.isMarked(a);
                        b ? this.unmark(a) : this.mark(a);
                        return !b
                    }, hideGroup: function (a) {
                        var b = (a = this.element.getDocument().getById(this._.groups[a])) && a.getNext();
                        a && (a.setStyle("display", "none"), b && "ul" == b.getName() && b.setStyle("display", "none"))
                    }, hideItem: function (a) {
                        this.element.getDocument().getById(this._.items[a]).setStyle("display",
                            "none")
                    }, showAll: function () {
                        var a = this._.items, b = this._.groups, c = this.element.getDocument(), d;
                        for (d in a)c.getById(a[d]).setStyle("display", "");
                        for (var e in b)a = c.getById(b[e]), d = a.getNext(), a.setStyle("display", ""), d && "ul" == d.getName() && d.setStyle("display", "")
                    }, mark: function (a) {
                        this.multiSelect || this.unmarkAll();
                        var a = this._.items[a], b = this.element.getDocument().getById(a);
                        b.addClass("cke_selected");
                        this.element.getDocument().getById(a + "_option").setAttribute("aria-selected", !0);
                        this.onMark && this.onMark(b)
                    },
                    unmark: function (a) {
                        var b = this.element.getDocument(), a = this._.items[a], c = b.getById(a);
                        c.removeClass("cke_selected");
                        b.getById(a + "_option").removeAttribute("aria-selected");
                        this.onUnmark && this.onUnmark(c)
                    }, unmarkAll: function () {
                        var a = this._.items, b = this.element.getDocument(), c;
                        for (c in a) {
                            var d = a[c];
                            b.getById(d).removeClass("cke_selected");
                            b.getById(d + "_option").removeAttribute("aria-selected")
                        }
                        this.onUnmark && this.onUnmark()
                    }, isMarked: function (a) {
                        return this.element.getDocument().getById(this._.items[a]).hasClass("cke_selected")
                    },
                    focus: function (a) {
                        this._.focusIndex = -1;
                        var b = this.element.getElementsByTag("a"), c, d = -1;
                        if (a)for (c = this.element.getDocument().getById(this._.items[a]).getFirst(); a = b.getItem(++d);) {
                            if (a.equals(c)) {
                                this._.focusIndex = d;
                                break
                            }
                        } else this.element.focus();
                        c && setTimeout(function () {
                            c.focus()
                        }, 0)
                    }
                }
            })
        }
    });
    CKEDITOR.plugins.add("richcombo", {
        requires: "floatpanel,listblock,button", beforeInit: function (d) {
            d.ui.addHandler(CKEDITOR.UI_RICHCOMBO, CKEDITOR.ui.richCombo.handler)
        }
    });
    (function () {
        var d = '<span id="{id}" class="cke_combo cke_combo__{name} {cls}" role="presentation"><span id="{id}_label" class="cke_combo_label">{label}</span><a class="cke_combo_button" hidefocus=true title="{title}" tabindex="-1"' + (CKEDITOR.env.gecko && 10900 <= CKEDITOR.env.version && !CKEDITOR.env.hc ? "" : '" href="javascript:void(\'{titleJs}\')"') + ' hidefocus="true" role="button" aria-labelledby="{id}_label" aria-haspopup="true"';
        if (CKEDITOR.env.opera || CKEDITOR.env.gecko && CKEDITOR.env.mac) d += ' onkeypress="return false;"';
        CKEDITOR.env.gecko && (d += ' onblur="this.style.cssText = this.style.cssText;"');
        var d = d + (' onkeydown="return CKEDITOR.tools.callFunction({keydownFn},event,this);" onmousedown="return CKEDITOR.tools.callFunction({mousedownFn},event);"  onfocus="return CKEDITOR.tools.callFunction({focusFn},event);" ' + (CKEDITOR.env.ie ? 'onclick="return false;" onmouseup' : "onclick") + '="CKEDITOR.tools.callFunction({clickFn},this);return false;"><span id="{id}_text" class="cke_combo_text cke_combo_inlinelabel">{label}</span><span class="cke_combo_open"><span class="cke_combo_arrow">' +
                (CKEDITOR.env.hc ? "&#9660;" : CKEDITOR.env.air ? "&nbsp;" : "") + "</span></span></a></span>"),
            i = CKEDITOR.addTemplate("combo", d);
        CKEDITOR.UI_RICHCOMBO = "richcombo";
        CKEDITOR.ui.richCombo = CKEDITOR.tools.createClass({
            $: function (a) {
                CKEDITOR.tools.extend(this, a, {canGroup: !1, title: a.label, modes: {wysiwyg: 1}, editorFocus: 1});
                a = this.panel || {};
                delete this.panel;
                this.id = CKEDITOR.tools.getNextNumber();
                this.document = a.parent && a.parent.getDocument() || CKEDITOR.document;
                a.className = "cke_combopanel";
                a.block = {
                    multiSelect: a.multiSelect,
                    attributes: a.attributes
                };
                a.toolbarRelated = !0;
                this._ = {panelDefinition: a, items: {}}
            }, proto: {
                renderHtml: function (a) {
                    var b = [];
                    this.render(a, b);
                    return b.join("")
                }, render: function (a, b) {
                    function g() {
                        var c = this.modes[a.mode] ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED;
                        a.readOnly && !this.readOnly && (c = CKEDITOR.TRISTATE_DISABLED);
                        this.setState(c);
                        this.setValue("");
                        c != CKEDITOR.TRISTATE_DISABLED && this.refresh && this.refresh()
                    }

                    var d = CKEDITOR.env, h = "cke_" + this.id, e = CKEDITOR.tools.addFunction(function (b) {
                        j && (a.unlockSelection(1),
                            j = 0);
                        c.execute(b)
                    }, this), f = this, c = {
                        id: h, combo: this, focus: function () {
                            CKEDITOR.document.getById(h).getChild(1).focus()
                        }, execute: function (c) {
                            var b = f._;
                            if (b.state != CKEDITOR.TRISTATE_DISABLED)if (f.createPanel(a), b.on) b.panel.hide(); else {
                                f.commit();
                                var d = f.getValue();
                                d ? b.list.mark(d) : b.list.unmarkAll();
                                b.panel.showBlock(f.id, new CKEDITOR.dom.element(c), 4)
                            }
                        }, clickFn: e
                    };
                    a.on("activeFilterChange", g, this);
                    a.on("mode", g, this);
                    !this.readOnly && a.on("readOnly", g, this);
                    var k = CKEDITOR.tools.addFunction(function (b,
                                                                 d) {
                        var b = new CKEDITOR.dom.event(b), g = b.getKeystroke();
                        if (40 == g) a.once("panelShow", function (a) {
                            a.data._.panel._.currentBlock.onKeyDown(40)
                        });
                        switch (g) {
                            case 13:
                            case 32:
                            case 40:
                                CKEDITOR.tools.callFunction(e, d);
                                break;
                            default:
                                c.onkey(c, g)
                        }
                        b.preventDefault()
                    }), l = CKEDITOR.tools.addFunction(function () {
                        c.onfocus && c.onfocus()
                    }), j = 0, m = CKEDITOR.tools.addFunction(function () {
                        if (CKEDITOR.env.opera) {
                            var b = a.editable();
                            b.isInline() && b.hasFocus && (a.lockSelection(), j = 1)
                        }
                    });
                    c.keyDownFn = k;
                    d = {
                        id: h,
                        name: this.name || this.command,
                        label: this.label,
                        title: this.title,
                        cls: this.className || "",
                        titleJs: d.gecko && 10900 <= d.version && !d.hc ? "" : (this.title || "").replace("'", ""),
                        keydownFn: k,
                        mousedownFn: m,
                        focusFn: l,
                        clickFn: e
                    };
                    i.output(d, b);
                    if (this.onRender) this.onRender();
                    return c
                }, createPanel: function (a) {
                    if (!this._.panel) {
                        var b = this._.panelDefinition, d = this._.panelDefinition.block,
                            i = b.parent || CKEDITOR.document.getBody(), h = "cke_combopanel__" + this.name,
                            e = new CKEDITOR.ui.floatPanel(a, i, b), f = e.addListBlock(this.id, d), c = this;
                        e.onShow = function () {
                            this.element.addClass(h);
                            c.setState(CKEDITOR.TRISTATE_ON);
                            c._.on = 1;
                            c.editorFocus && !a.focusManager.hasFocus && a.focus();
                            if (c.onOpen) c.onOpen();
                            a.once("panelShow", function () {
                                f.focus(!f.multiSelect && c.getValue())
                            })
                        };
                        e.onHide = function (b) {
                            this.element.removeClass(h);
                            c.setState(c.modes && c.modes[a.mode] ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED);
                            c._.on = 0;
                            if (!b && c.onClose) c.onClose()
                        };
                        e.onEscape = function () {
                            e.hide(1)
                        };
                        f.onClick = function (a, b) {
                            c.onClick && c.onClick.call(c, a, b);
                            e.hide()
                        };
                        this._.panel = e;
                        this._.list = f;
                        e.getBlock(this.id).onHide =
                            function () {
                                c._.on = 0;
                                c.setState(CKEDITOR.TRISTATE_OFF)
                            };
                        this.init && this.init()
                    }
                }, setValue: function (a, b) {
                    this._.value = a;
                    var d = this.document.getById("cke_" + this.id + "_text");
                    d && (!a && !b ? (b = this.label, d.addClass("cke_combo_inlinelabel")) : d.removeClass("cke_combo_inlinelabel"), d.setText("undefined" != typeof b ? b : a))
                }, getValue: function () {
                    return this._.value || ""
                }, unmarkAll: function () {
                    this._.list.unmarkAll()
                }, mark: function (a) {
                    this._.list.mark(a)
                }, hideItem: function (a) {
                    this._.list.hideItem(a)
                }, hideGroup: function (a) {
                    this._.list.hideGroup(a)
                },
                showAll: function () {
                    this._.list.showAll()
                }, add: function (a, b, d) {
                    this._.items[a] = d || a;
                    this._.list.add(a, b, d)
                }, startGroup: function (a) {
                    this._.list.startGroup(a)
                }, commit: function () {
                    this._.committed || (this._.list.commit(), this._.committed = 1, CKEDITOR.ui.fire("ready", this));
                    this._.committed = 1
                }, setState: function (a) {
                    if (this._.state != a) {
                        var b = this.document.getById("cke_" + this.id);
                        b.setState(a, "cke_combo");
                        a == CKEDITOR.TRISTATE_DISABLED ? b.setAttribute("aria-disabled", !0) : b.removeAttribute("aria-disabled");
                        this._.state =
                            a
                    }
                }, getState: function () {
                    return this._.state
                }, enable: function () {
                    this._.state == CKEDITOR.TRISTATE_DISABLED && this.setState(this._.lastState)
                }, disable: function () {
                    this._.state != CKEDITOR.TRISTATE_DISABLED && (this._.lastState = this._.state, this.setState(CKEDITOR.TRISTATE_DISABLED))
                }
            }, statics: {
                handler: {
                    create: function (a) {
                        return new CKEDITOR.ui.richCombo(a)
                    }
                }
            }
        });
        CKEDITOR.ui.prototype.addRichCombo = function (a, b) {
            this.add(a, CKEDITOR.UI_RICHCOMBO, b)
        }
    })();
    CKEDITOR.plugins.add("format", {
        requires: "richcombo", init: function (a) {
            if (!a.blockless) {
                for (var f = a.config, c = a.lang.format, j = f.format_tags.split(";"), d = {}, k = 0, l = [],
                         g = 0; g < j.length; g++) {
                    var h = j[g], i = new CKEDITOR.style(f["format_" + h]);
                    if (!a.filter.customConfig || a.filter.check(i)) k++, d[h] = i, d[h]._.enterMode = a.config.enterMode, l.push(i)
                }
                0 !== k && a.ui.addRichCombo("Format", {
                    label: c.label, title: c.panelTitle, toolbar: "styles,20", allowedContent: l, panel: {
                        css: [CKEDITOR.skin.getPath("editor")].concat(f.contentsCss),
                        multiSelect: !1, attributes: {"aria-label": c.panelTitle}
                    }, init: function () {
                        this.startGroup(c.panelTitle);
                        for (var b in d) {
                            var a = c["tag_" + b];
                            this.add(b, d[b].buildPreview(a), a)
                        }
                    }, onClick: function (b) {
                        a.focus();
                        a.fire("saveSnapshot");
                        var b = d[b], c = a.elementPath();
                        a[b.checkActive(c) ? "removeStyle" : "applyStyle"](b);
                        setTimeout(function () {
                            a.fire("saveSnapshot")
                        }, 0)
                    }, onRender: function () {
                        a.on("selectionChange", function (b) {
                            var c = this.getValue(), b = b.data.path;
                            this.refresh();
                            for (var e in d)if (d[e].checkActive(b)) {
                                e !=
                                c && this.setValue(e, a.lang.format["tag_" + e]);
                                return
                            }
                            this.setValue("")
                        }, this)
                    }, onOpen: function () {
                        this.showAll();
                        for (var b in d)a.activeFilter.check(d[b]) || this.hideItem(b)
                    }, refresh: function () {
                        var b = a.elementPath();
                        if (b) {
                            if (b.isContextFor("p"))for (var c in d)if (a.activeFilter.check(d[c]))return;
                            this.setState(CKEDITOR.TRISTATE_DISABLED)
                        }
                    }
                })
            }
        }
    });
    CKEDITOR.config.format_tags = "p;h1;h2;h3;h4;h5;h6;pre;address;div";
    CKEDITOR.config.format_p = {element: "p"};
    CKEDITOR.config.format_div = {element: "div"};
    CKEDITOR.config.format_pre = {element: "pre"};
    CKEDITOR.config.format_address = {element: "address"};
    CKEDITOR.config.format_h1 = {element: "h1"};
    CKEDITOR.config.format_h2 = {element: "h2"};
    CKEDITOR.config.format_h3 = {element: "h3"};
    CKEDITOR.config.format_h4 = {element: "h4"};
    CKEDITOR.config.format_h5 = {element: "h5"};
    CKEDITOR.config.format_h6 = {element: "h6"};
    (function () {
        var b = {
            canUndo: !1, exec: function (a) {
                var b = a.document.createElement("hr");
                a.insertElement(b)
            }, allowedContent: "hr", requiredContent: "hr"
        };
        CKEDITOR.plugins.add("horizontalrule", {
            init: function (a) {
                a.blockless || (a.addCommand("horizontalrule", b), a.ui.addButton && a.ui.addButton("HorizontalRule", {
                    label: a.lang.horizontalrule.toolbar,
                    command: "horizontalrule",
                    toolbar: "insert,40"
                }))
            }
        })
    })();
    CKEDITOR.plugins.add("htmlwriter", {
        init: function (b) {
            var a = new CKEDITOR.htmlWriter;
            a.forceSimpleAmpersand = b.config.forceSimpleAmpersand;
            a.indentationChars = b.config.dataIndentationChars || "\t";
            b.dataProcessor.writer = a
        }
    });
    CKEDITOR.htmlWriter = CKEDITOR.tools.createClass({
        base: CKEDITOR.htmlParser.basicWriter, $: function () {
            this.base();
            this.indentationChars = "\t";
            this.selfClosingEnd = " />";
            this.lineBreakChars = "\n";
            this.sortAttributes = 1;
            this._.indent = 0;
            this._.indentation = "";
            this._.inPre = 0;
            this._.rules = {};
            var b = CKEDITOR.dtd, a;
            for (a in CKEDITOR.tools.extend({}, b.$nonBodyContent, b.$block, b.$listItem, b.$tableContent))this.setRules(a, {
                indent: !b[a]["#"],
                breakBeforeOpen: 1,
                breakBeforeClose: !b[a]["#"],
                breakAfterClose: 1,
                needsSpace: a in
                b.$block && !(a in {li: 1, dt: 1, dd: 1})
            });
            this.setRules("br", {breakAfterOpen: 1});
            this.setRules("title", {indent: 0, breakAfterOpen: 0});
            this.setRules("style", {indent: 0, breakBeforeClose: 1});
            this.setRules("pre", {breakAfterOpen: 1, indent: 0})
        }, proto: {
            openTag: function (b) {
                var a = this._.rules[b];
                this._.afterCloser && (a && a.needsSpace && this._.needsSpace) && this._.output.push("\n");
                this._.indent ? this.indentation() : a && a.breakBeforeOpen && (this.lineBreak(), this.indentation());
                this._.output.push("<", b);
                this._.afterCloser = 0
            },
            openTagClose: function (b, a) {
                var c = this._.rules[b];
                a ? (this._.output.push(this.selfClosingEnd), c && c.breakAfterClose && (this._.needsSpace = c.needsSpace)) : (this._.output.push(">"), c && c.indent && (this._.indentation += this.indentationChars));
                c && c.breakAfterOpen && this.lineBreak();
                "pre" == b && (this._.inPre = 1)
            }, attribute: function (b, a) {
                "string" == typeof a && (this.forceSimpleAmpersand && (a = a.replace(/&amp;/g, "&")), a = CKEDITOR.tools.htmlEncodeAttr(a));
                this._.output.push(" ", b, '="', a, '"')
            }, closeTag: function (b) {
                var a = this._.rules[b];
                a && a.indent && (this._.indentation = this._.indentation.substr(this.indentationChars.length));
                this._.indent ? this.indentation() : a && a.breakBeforeClose && (this.lineBreak(), this.indentation());
                this._.output.push("</", b, ">");
                "pre" == b && (this._.inPre = 0);
                a && a.breakAfterClose && (this.lineBreak(), this._.needsSpace = a.needsSpace);
                this._.afterCloser = 1
            }, text: function (b) {
                this._.indent && (this.indentation(), !this._.inPre && (b = CKEDITOR.tools.ltrim(b)));
                this._.output.push(b)
            }, comment: function (b) {
                this._.indent && this.indentation();
                this._.output.push("<\!--", b, "--\>")
            }, lineBreak: function () {
                !this._.inPre && 0 < this._.output.length && this._.output.push(this.lineBreakChars);
                this._.indent = 1
            }, indentation: function () {
                !this._.inPre && this._.indentation && this._.output.push(this._.indentation);
                this._.indent = 0
            }, reset: function () {
                this._.output = [];
                this._.indent = 0;
                this._.indentation = "";
                this._.afterCloser = 0;
                this._.inPre = 0
            }, setRules: function (b, a) {
                var c = this._.rules[b];
                c ? CKEDITOR.tools.extend(c, a, !0) : this._.rules[b] = a
            }
        }
    });
    (function () {
        function k(a) {
            var d = this.editor, b = a.document, c = b.body;
            (a = b.getElementById("cke_actscrpt")) && a.parentNode.removeChild(a);
            (a = b.getElementById("cke_shimscrpt")) && a.parentNode.removeChild(a);
            CKEDITOR.env.gecko && (c.contentEditable = !1, 2E4 > CKEDITOR.env.version && (c.innerHTML = c.innerHTML.replace(/^.*<\!-- cke-content-start --\>/, ""), setTimeout(function () {
                var a = new CKEDITOR.dom.range(new CKEDITOR.dom.document(b));
                a.setStart(new CKEDITOR.dom.node(c), 0);
                d.getSelection().selectRanges([a])
            }, 0)));
            c.contentEditable =
                !0;
            CKEDITOR.env.ie && (c.hideFocus = !0, c.disabled = !0, c.removeAttribute("disabled"));
            delete this._.isLoadingData;
            this.$ = c;
            b = new CKEDITOR.dom.document(b);
            this.setup();
            CKEDITOR.env.ie && (b.getDocumentElement().addClass(b.$.compatMode), d.config.enterMode != CKEDITOR.ENTER_P && this.attachListener(b, "selectionchange", function () {
                var a = b.getBody(), c = d.getSelection(), e = c && c.getRanges()[0];
                e && (a.getHtml().match(/^<p>(?:&nbsp;|<br>)<\/p>$/i) && e.startContainer.equals(a)) && setTimeout(function () {
                    e = d.getSelection().getRanges()[0];
                    if (!e.startContainer.equals("body")) {
                        a.getFirst().remove(1);
                        e.moveToElementEditEnd(a);
                        e.select()
                    }
                }, 0)
            }));
            if (CKEDITOR.env.webkit || CKEDITOR.env.ie && 10 < CKEDITOR.env.version) b.getDocumentElement().on("mousedown", function (a) {
                a.data.getTarget().is("html") && setTimeout(function () {
                    d.editable().focus()
                })
            });
            try {
                d.document.$.execCommand("2D-position", !1, !0)
            } catch (e) {
            }
            try {
                d.document.$.execCommand("enableInlineTableEditing", !1, !d.config.disableNativeTableHandles)
            } catch (g) {
            }
            if (d.config.disableObjectResizing)try {
                this.getDocument().$.execCommand("enableObjectResizing",
                    !1, !1)
            } catch (f) {
                this.attachListener(this, CKEDITOR.env.ie ? "resizestart" : "resize", function (a) {
                    a.data.preventDefault()
                })
            }
            (CKEDITOR.env.gecko || CKEDITOR.env.ie && "CSS1Compat" == d.document.$.compatMode) && this.attachListener(this, "keydown", function (a) {
                var b = a.data.getKeystroke();
                if (b == 33 || b == 34)if (CKEDITOR.env.ie) setTimeout(function () {
                    d.getSelection().scrollIntoView()
                }, 0); else if (d.window.$.innerHeight > this.$.offsetHeight) {
                    var c = d.createRange();
                    c[b == 33 ? "moveToElementEditStart" : "moveToElementEditEnd"](this);
                    c.select();
                    a.data.preventDefault()
                }
            });
            CKEDITOR.env.ie && this.attachListener(b, "blur", function () {
                try {
                    b.$.selection.empty()
                } catch (a) {
                }
            });
            d.document.getElementsByTag("title").getItem(0).data("cke-title", d.document.$.title);
            CKEDITOR.env.ie && (d.document.$.title = this._.docTitle);
            CKEDITOR.tools.setTimeout(function () {
                d.fire("contentDom");
                if (this._.isPendingFocus) {
                    d.focus();
                    this._.isPendingFocus = false
                }
                setTimeout(function () {
                    d.fire("dataReady")
                }, 0);
                CKEDITOR.env.ie && setTimeout(function () {
                    if (d.document) {
                        var a =
                            d.document.$.body;
                        a.runtimeStyle.marginBottom = "0px";
                        a.runtimeStyle.marginBottom = ""
                    }
                }, 1E3)
            }, 0, this)
        }

        function l() {
            var a = [];
            if (8 <= CKEDITOR.document.$.documentMode) {
                a.push("html.CSS1Compat [contenteditable=false]{min-height:0 !important}");
                var d = [], b;
                for (b in CKEDITOR.dtd.$removeEmpty)d.push("html.CSS1Compat " + b + "[contenteditable=false]");
                a.push(d.join(",") + "{display:inline-block}")
            } else CKEDITOR.env.gecko && (a.push("html{height:100% !important}"), a.push("img:-moz-broken{-moz-force-broken-image-icon:1;min-width:24px;min-height:24px}"));
            a.push("html{cursor:text;*cursor:auto}");
            a.push("img,input,textarea{cursor:default}");
            return a.join("\n")
        }

        CKEDITOR.plugins.add("wysiwygarea", {
            init: function (a) {
                a.config.fullPage && a.addFeature({
                    allowedContent: "html head title; style [media,type]; body (*)[id]; meta link [*]",
                    requiredContent: "body"
                });
                a.addMode("wysiwyg", function (d) {
                    function b(b) {
                        b && b.removeListener();
                        a.editable(new j(a, e.$.contentWindow.document.body));
                        a.setData(a.getData(1), d)
                    }

                    var c = "document.open();" + (CKEDITOR.env.ie ? "(" + CKEDITOR.tools.fixDomain +
                                ")();" : "") + "document.close();",
                        c = CKEDITOR.env.air ? "javascript:void(0)" : CKEDITOR.env.ie ? "javascript:void(function(){" + encodeURIComponent(c) + "}())" : "",
                        e = CKEDITOR.dom.element.createFromHtml('<iframe src="' + c + '" frameBorder="0"></iframe>');
                    e.setStyles({width: "100%", height: "100%"});
                    e.addClass("cke_wysiwyg_frame cke_reset");
                    var g = a.ui.space("contents");
                    g.append(e);
                    if (c = CKEDITOR.env.ie || CKEDITOR.env.gecko) e.on("load", b);
                    var f = a.title, h = a.lang.common.editorHelp;
                    f && (CKEDITOR.env.ie && (f += ", " + h), e.setAttribute("title",
                        f));
                    var f = CKEDITOR.tools.getNextId(),
                        i = CKEDITOR.dom.element.createFromHtml('<span id="' + f + '" class="cke_voice_label">' + h + "</span>");
                    g.append(i, 1);
                    a.on("beforeModeUnload", function (a) {
                        a.removeListener();
                        i.remove()
                    });
                    e.setAttributes({"aria-describedby": f, tabIndex: a.tabIndex, allowTransparency: "true"});
                    !c && b();
                    CKEDITOR.env.webkit && (c = function () {
                        g.setStyle("width", "100%");
                        e.hide();
                        e.setSize("width", g.getSize("width"));
                        g.removeStyle("width");
                        e.show()
                    }, e.setCustomData("onResize", c), CKEDITOR.document.getWindow().on("resize",
                        c));
                    a.fire("ariaWidget", e)
                })
            }
        });
        var j = CKEDITOR.tools.createClass({
            $: function (a) {
                this.base.apply(this, arguments);
                this._.frameLoadedHandler = CKEDITOR.tools.addFunction(function (a) {
                    CKEDITOR.tools.setTimeout(k, 0, this, a)
                }, this);
                this._.docTitle = this.getWindow().getFrame().getAttribute("title")
            }, base: CKEDITOR.editable, proto: {
                setData: function (a, d) {
                    var b = this.editor;
                    if (d) this.setHtml(a), b.fire("dataReady"); else {
                        this._.isLoadingData = !0;
                        b._.dataStore = {id: 1};
                        var c = b.config, e = c.fullPage, g = c.docType,
                            f = CKEDITOR.tools.buildStyleHtml(l()).replace(/<style>/,
                                '<style data-cke-temp="1">');
                        e || (f += CKEDITOR.tools.buildStyleHtml(b.config.contentsCss));
                        var h = c.baseHref ? '<base href="' + c.baseHref + '" data-cke-temp="1" />' : "";
                        e && (a = a.replace(/<!DOCTYPE[^>]*>/i, function (a) {
                            b.docType = g = a;
                            return ""
                        }).replace(/<\?xml\s[^\?]*\?>/i, function (a) {
                            b.xmlDeclaration = a;
                            return ""
                        }));
                        a = b.dataProcessor.toHtml(a);
                        e ? (/<body[\s|>]/.test(a) || (a = "<body>" + a), /<html[\s|>]/.test(a) || (a = "<html>" + a + "</html>"), /<head[\s|>]/.test(a) ? /<title[\s|>]/.test(a) || (a = a.replace(/<head[^>]*>/, "$&<title></title>")) :
                            a = a.replace(/<html[^>]*>/, "$&<head><title></title></head>"), h && (a = a.replace(/<head>/, "$&" + h)), a = a.replace(/<\/head\s*>/, f + "$&"), a = g + a) : a = c.docType + '<html dir="' + c.contentsLangDirection + '" lang="' + (c.contentsLanguage || b.langCode) + '"><head><title>' + this._.docTitle + "</title>" + h + f + "</head><body" + (c.bodyId ? ' id="' + c.bodyId + '"' : "") + (c.bodyClass ? ' class="' + c.bodyClass + '"' : "") + ">" + a + "</body></html>";
                        CKEDITOR.env.gecko && (a = a.replace(/<body/, '<body contenteditable="true" '), 2E4 > CKEDITOR.env.version && (a = a.replace(/<body[^>]*>/,
                            "$&<\!-- cke-content-start --\>")));
                        c = '<script id="cke_actscrpt" type="text/javascript"' + (CKEDITOR.env.ie ? ' defer="defer" ' : "") + ">var wasLoaded=0;function onload(){if(!wasLoaded)window.parent.CKEDITOR.tools.callFunction(" + this._.frameLoadedHandler + ",window);wasLoaded=1;}" + (CKEDITOR.env.ie ? "onload();" : 'document.addEventListener("DOMContentLoaded", onload, false );') + "<\/script>";
                        CKEDITOR.env.ie && 9 > CKEDITOR.env.version && (c += '<script id="cke_shimscrpt">window.parent.CKEDITOR.tools.enableHtml5Elements(document)<\/script>');
                        a = a.replace(/(?=\s*<\/(:?head)>)/, c);
                        this.clearCustomData();
                        this.clearListeners();
                        b.fire("contentDomUnload");
                        var i = this.getDocument();
                        try {
                            i.write(a)
                        } catch (j) {
                            setTimeout(function () {
                                i.write(a)
                            }, 0)
                        }
                    }
                }, getData: function (a) {
                    if (a)return this.getHtml();
                    var a = this.editor, d = a.config, b = d.fullPage, c = b && a.docType, e = b && a.xmlDeclaration,
                        g = this.getDocument(), b = b ? g.getDocumentElement().getOuterHtml() : g.getBody().getHtml();
                    CKEDITOR.env.gecko && d.enterMode != CKEDITOR.ENTER_BR && (b = b.replace(/<br>(?=\s*(:?$|<\/body>))/,
                        ""));
                    b = a.dataProcessor.toDataFormat(b);
                    e && (b = e + "\n" + b);
                    c && (b = c + "\n" + b);
                    return b
                }, focus: function () {
                    this._.isLoadingData ? this._.isPendingFocus = !0 : j.baseProto.focus.call(this)
                }, detach: function () {
                    var a = this.editor, d = a.document, b = a.window.getFrame();
                    j.baseProto.detach.call(this);
                    this.clearCustomData();
                    d.getDocumentElement().clearCustomData();
                    b.clearCustomData();
                    CKEDITOR.tools.removeFunction(this._.frameLoadedHandler);
                    (d = b.removeCustomData("onResize")) && d.removeListener();
                    a.fire("contentDomUnload");
                    b.remove()
                }
            }
        })
    })();
    CKEDITOR.config.disableObjectResizing = !1;
    CKEDITOR.config.disableNativeTableHandles = !0;
    CKEDITOR.config.disableNativeSpellChecker = !0;
    CKEDITOR.config.contentsCss = CKEDITOR.basePath + "contents.css";
    (function () {
        function e(b, a) {
            a || (a = b.getSelection().getSelectedElement());
            if (a && a.is("img") && !a.data("cke-realelement") && !a.isReadOnly())return a
        }

        function f(b) {
            var a = b.getStyle("float");
            if ("inherit" == a || "none" == a) a = 0;
            a || (a = b.getAttribute("align"));
            return a
        }

        CKEDITOR.plugins.add("image", {
            requires: "dialog", init: function (b) {
                if (!b.plugins.image2) {
                    CKEDITOR.dialog.add("image", this.path + "dialogs/image.js");
                    var a = "img[alt,!src]{border-style,border-width,float,height,margin,margin-bottom,margin-left,margin-right,margin-top,width}";
                    CKEDITOR.dialog.isTabEnabled(b, "image", "advanced") && (a = "img[alt,dir,id,lang,longdesc,!src,title]{*}(*)");
                    b.addCommand("image", new CKEDITOR.dialogCommand("image", {
                        allowedContent: a,
                        requiredContent: "img[alt,src]",
                        contentTransformations: [["img{width}: sizeToStyle", "img[width]: sizeToAttribute"], ["img{float}: alignmentToStyle", "img[align]: alignmentToAttribute"]]
                    }));
                    b.ui.addButton && b.ui.addButton("Image", {
                        label: b.lang.common.image,
                        command: "image",
                        toolbar: "insert,10"
                    });
                    b.on("doubleclick", function (b) {
                        var a =
                            b.data.element;
                        a.is("img") && (!a.data("cke-realelement") && !a.isReadOnly()) && (b.data.dialog = "image")
                    });
                    b.addMenuItems && b.addMenuItems({
                        image: {
                            label: b.lang.image.menu,
                            command: "image",
                            group: "image"
                        }
                    });
                    b.contextMenu && b.contextMenu.addListener(function (a) {
                        if (e(b, a))return {image: CKEDITOR.TRISTATE_OFF}
                    })
                }
            }, afterInit: function (b) {
                function a(a) {
                    var d = b.getCommand("justify" + a);
                    if (d) {
                        if ("left" == a || "right" == a) d.on("exec", function (d) {
                            var c = e(b), g;
                            c && (g = f(c), g == a ? (c.removeStyle("float"), a == f(c) && c.removeAttribute("align")) :
                                c.setStyle("float", a), d.cancel())
                        });
                        d.on("refresh", function (d) {
                            var c = e(b);
                            c && (c = f(c), this.setState(c == a ? CKEDITOR.TRISTATE_ON : "right" == a || "left" == a ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED), d.cancel())
                        })
                    }
                }

                b.plugins.image2 || (a("left"), a("right"), a("center"), a("block"))
            }
        })
    })();
    CKEDITOR.config.image_removeLinkByEmptyURL = !0;
    (function () {
        function k(a, b) {
            var e, f;
            b.on("refresh", function (a) {
                var b = [i], c;
                for (c in a.data.states)b.push(a.data.states[c]);
                this.setState(CKEDITOR.tools.search(b, m) ? m : i)
            }, b, null, 100);
            b.on("exec", function (b) {
                e = a.getSelection();
                f = e.createBookmarks(1);
                b.data || (b.data = {});
                b.data.done = !1
            }, b, null, 0);
            b.on("exec", function () {
                a.forceNextSelectionCheck();
                e.selectBookmarks(f)
            }, b, null, 100)
        }

        var i = CKEDITOR.TRISTATE_DISABLED, m = CKEDITOR.TRISTATE_OFF;
        CKEDITOR.plugins.add("indent", {
            init: function (a) {
                var b = CKEDITOR.plugins.indent.genericDefinition;
                k(a, a.addCommand("indent", new b(!0)));
                k(a, a.addCommand("outdent", new b));
                a.ui.addButton && (a.ui.addButton("Indent", {
                    label: a.lang.indent.indent,
                    command: "indent",
                    directional: !0,
                    toolbar: "indent,20"
                }), a.ui.addButton("Outdent", {
                    label: a.lang.indent.outdent,
                    command: "outdent",
                    directional: !0,
                    toolbar: "indent,10"
                }));
                a.on("dirChanged", function (b) {
                    var f = a.createRange(), j = b.data.node;
                    f.setStartBefore(j);
                    f.setEndAfter(j);
                    for (var l = new CKEDITOR.dom.walker(f),
                             c; c = l.next();)if (c.type == CKEDITOR.NODE_ELEMENT)if (!c.equals(j) &&
                        c.getDirection()) {
                        f.setStartAfter(c);
                        l = new CKEDITOR.dom.walker(f)
                    } else {
                        var d = a.config.indentClasses;
                        if (d)for (var g = b.data.dir == "ltr" ? ["_rtl", ""] : ["", "_rtl"],
                                       h = 0; h < d.length; h++)if (c.hasClass(d[h] + g[0])) {
                            c.removeClass(d[h] + g[0]);
                            c.addClass(d[h] + g[1])
                        }
                        d = c.getStyle("margin-right");
                        g = c.getStyle("margin-left");
                        d ? c.setStyle("margin-left", d) : c.removeStyle("margin-left");
                        g ? c.setStyle("margin-right", g) : c.removeStyle("margin-right")
                    }
                })
            }
        });
        CKEDITOR.plugins.indent = {
            genericDefinition: function (a) {
                this.isIndent =
                    !!a;
                this.startDisabled = !this.isIndent
            }, specificDefinition: function (a, b, e) {
                this.name = b;
                this.editor = a;
                this.jobs = {};
                this.enterBr = a.config.enterMode == CKEDITOR.ENTER_BR;
                this.isIndent = !!e;
                this.relatedGlobal = e ? "indent" : "outdent";
                this.indentKey = e ? 9 : CKEDITOR.SHIFT + 9;
                this.database = {}
            }, registerCommands: function (a, b) {
                a.on("pluginsLoaded", function () {
                    for (var a in b)(function (a, b) {
                        var e = a.getCommand(b.relatedGlobal), c;
                        for (c in b.jobs)e.on("exec", function (d) {
                            d.data.done || (a.fire("lockSnapshot"), b.execJob(a, c) && (d.data.done =
                                !0), a.fire("unlockSnapshot"), CKEDITOR.dom.element.clearAllMarkers(b.database))
                        }, this, null, c), e.on("refresh", function (d) {
                            d.data.states || (d.data.states = {});
                            d.data.states[b.name + "@" + c] = b.refreshJob(a, c, d.data.path)
                        }, this, null, c);
                        a.addFeature(b)
                    })(this, b[a])
                })
            }
        };
        CKEDITOR.plugins.indent.genericDefinition.prototype = {
            context: "p", exec: function () {
            }
        };
        CKEDITOR.plugins.indent.specificDefinition.prototype = {
            execJob: function (a, b) {
                var e = this.jobs[b];
                if (e.state != i)return e.exec.call(this, a)
            }, refreshJob: function (a,
                                     b, e) {
                b = this.jobs[b];
                b.state = a.activeFilter.checkFeature(this) ? b.refresh.call(this, a, e) : i;
                return b.state
            }, getContext: function (a) {
                return a.contains(this.context)
            }
        }
    })();
    (function () {
        function s(e) {
            function g(b) {
                for (var f = d.startContainer, a = d.endContainer; f && !f.getParent().equals(b);)f = f.getParent();
                for (; a && !a.getParent().equals(b);)a = a.getParent();
                if (!f || !a)return !1;
                for (var h = f, f = [], c = !1; !c;)h.equals(a) && (c = !0), f.push(h), h = h.getNext();
                if (1 > f.length)return !1;
                h = b.getParents(!0);
                for (a = 0; a < h.length; a++)if (h[a].getName && k[h[a].getName()]) {
                    b = h[a];
                    break
                }
                for (var h = n.isIndent ? 1 : -1, a = f[0], f = f[f.length - 1],
                         c = CKEDITOR.plugins.list.listToArray(b, o), g = c[f.getCustomData("listarray_index")].indent,
                         a = a.getCustomData("listarray_index"); a <= f.getCustomData("listarray_index"); a++)if (c[a].indent += h, 0 < h) {
                    var l = c[a].parent;
                    c[a].parent = new CKEDITOR.dom.element(l.getName(), l.getDocument())
                }
                for (a = f.getCustomData("listarray_index") + 1; a < c.length && c[a].indent > g; a++)c[a].indent += h;
                f = CKEDITOR.plugins.list.arrayToList(c, o, null, e.config.enterMode, b.getDirection());
                if (!n.isIndent) {
                    var i;
                    if ((i = b.getParent()) && i.is("li"))for (var h = f.listNode.getChildren(), m = [], j,
                                                                   a = h.count() - 1; 0 <= a; a--)(j = h.getItem(a)) && (j.is &&
                    j.is("li")) && m.push(j)
                }
                f && f.listNode.replace(b);
                if (m && m.length)for (a = 0; a < m.length; a++) {
                    for (j = b = m[a]; (j = j.getNext()) && j.is && j.getName() in k;)CKEDITOR.env.needsNbspFiller && !b.getFirst(t) && b.append(d.document.createText(" ")), b.append(j);
                    b.insertAfter(i)
                }
                f && e.fire("contentDomInvalidated");
                return !0
            }

            for (var n = this, o = this.database, k = this.context, l = e.getSelection(),
                     l = (l && l.getRanges()).createIterator(), d; d = l.getNextRange();) {
                for (var b = d.getCommonAncestor(); b && !(b.type == CKEDITOR.NODE_ELEMENT && k[b.getName()]);)b =
                    b.getParent();
                b || (b = d.startPath().contains(k)) && d.setEndAt(b, CKEDITOR.POSITION_BEFORE_END);
                if (!b) {
                    var c = d.getEnclosedNode();
                    c && (c.type == CKEDITOR.NODE_ELEMENT && c.getName() in k) && (d.setStartAt(c, CKEDITOR.POSITION_AFTER_START), d.setEndAt(c, CKEDITOR.POSITION_BEFORE_END), b = c)
                }
                b && (d.startContainer.type == CKEDITOR.NODE_ELEMENT && d.startContainer.getName() in k) && (c = new CKEDITOR.dom.walker(d), c.evaluator = i, d.startContainer = c.next());
                b && (d.endContainer.type == CKEDITOR.NODE_ELEMENT && d.endContainer.getName() in k) &&
                (c = new CKEDITOR.dom.walker(d), c.evaluator = i, d.endContainer = c.previous());
                if (b)return g(b)
            }
            return 0
        }

        function p(e, g) {
            g || (g = e.contains(this.context));
            return g && e.block && e.block.equals(g.getFirst(i))
        }

        function i(e) {
            return e.type == CKEDITOR.NODE_ELEMENT && e.is("li")
        }

        function t(e) {
            return u(e) && v(e)
        }

        var u = CKEDITOR.dom.walker.whitespaces(!0), v = CKEDITOR.dom.walker.bookmark(!1, !0),
            q = CKEDITOR.TRISTATE_DISABLED, r = CKEDITOR.TRISTATE_OFF;
        CKEDITOR.plugins.add("indentlist", {
            requires: "indent", init: function (e) {
                function g(e,
                           g) {
                    i.specificDefinition.apply(this, arguments);
                    this.requiredContent = ["ul", "ol"];
                    e.on("key", function (g) {
                        if ("wysiwyg" == e.mode && g.data.keyCode == this.indentKey) {
                            var d = this.getContext(e.elementPath());
                            if (d && (!this.isIndent || !p.call(this, e.elementPath(), d))) e.execCommand(this.relatedGlobal), g.cancel()
                        }
                    }, this);
                    this.jobs[this.isIndent ? 10 : 30] = {
                        refresh: this.isIndent ? function (e, d) {
                            var b = this.getContext(d), c = p.call(this, d, b);
                            return !b || !this.isIndent || c ? q : r
                        } : function (e, d) {
                            return !this.getContext(d) || this.isIndent ?
                                q : r
                        }, exec: CKEDITOR.tools.bind(s, this)
                    }
                }

                var i = CKEDITOR.plugins.indent;
                i.registerCommands(e, {indentlist: new g(e, "indentlist", !0), outdentlist: new g(e, "outdentlist")});
                CKEDITOR.tools.extend(g.prototype, i.specificDefinition.prototype, {context: {ol: 1, ul: 1}})
            }
        })
    })();
    (function () {
        function g(a, b) {
            var c = j.exec(a), d = j.exec(b);
            if (c) {
                if (!c[2] && "px" == d[2])return d[1];
                if ("px" == c[2] && !d[2])return d[1] + "px"
            }
            return b
        }

        var i = CKEDITOR.htmlParser.cssStyle, h = CKEDITOR.tools.cssLength, j = /^((?:\d*(?:\.\d+))|(?:\d+))(.*)?$/i,
            l = {
                elements: {
                    $: function (a) {
                        var b = a.attributes;
                        if ((b = (b = (b = b && b["data-cke-realelement"]) && new CKEDITOR.htmlParser.fragment.fromHtml(decodeURIComponent(b))) && b.children[0]) && a.attributes["data-cke-resizable"]) {
                            var c = (new i(a)).rules, a = b.attributes, d = c.width, c =
                                c.height;
                            d && (a.width = g(a.width, d));
                            c && (a.height = g(a.height, c))
                        }
                        return b
                    }
                }
            }, k = CKEDITOR.plugins.add("fakeobjects", {
                init: function (a) {
                    a.filter.allow("img[!data-cke-realelement,src,alt,title](*){*}", "fakeobjects")
                }, afterInit: function (a) {
                    (a = (a = a.dataProcessor) && a.htmlFilter) && a.addRules(l)
                }
            });
        CKEDITOR.editor.prototype.createFakeElement = function (a, b, c, d) {
            var e = this.lang.fakeobjects, e = e[c] || e.unknown, b = {
                "class": b,
                "data-cke-realelement": encodeURIComponent(a.getOuterHtml()),
                "data-cke-real-node-type": a.type,
                alt: e,
                title: e,
                align: a.getAttribute("align") || ""
            };
            CKEDITOR.env.hc || (b.src = CKEDITOR.getUrl(k.path + "images/spacer.gif"));
            c && (b["data-cke-real-element-type"] = c);
            d && (b["data-cke-resizable"] = d, c = new i, d = a.getAttribute("width"), a = a.getAttribute("height"), d && (c.rules.width = h(d)), a && (c.rules.height = h(a)), c.populate(b));
            return this.document.createElement("img", {attributes: b})
        };
        CKEDITOR.editor.prototype.createFakeParserElement = function (a, b, c, d) {
            var e = this.lang.fakeobjects, e = e[c] || e.unknown, f;
            f = new CKEDITOR.htmlParser.basicWriter;
            a.writeHtml(f);
            f = f.getHtml();
            b = {
                "class": b,
                "data-cke-realelement": encodeURIComponent(f),
                "data-cke-real-node-type": a.type,
                alt: e,
                title: e,
                align: a.attributes.align || ""
            };
            CKEDITOR.env.hc || (b.src = CKEDITOR.getUrl(k.path + "images/spacer.gif"));
            c && (b["data-cke-real-element-type"] = c);
            d && (b["data-cke-resizable"] = d, d = a.attributes, a = new i, c = d.width, d = d.height, void 0 != c && (a.rules.width = h(c)), void 0 != d && (a.rules.height = h(d)), a.populate(b));
            return new CKEDITOR.htmlParser.element("img", b)
        };
        CKEDITOR.editor.prototype.restoreRealElement =
            function (a) {
                if (a.data("cke-real-node-type") != CKEDITOR.NODE_ELEMENT)return null;
                var b = CKEDITOR.dom.element.createFromHtml(decodeURIComponent(a.data("cke-realelement")), this.document);
                if (a.data("cke-resizable")) {
                    var c = a.getStyle("width"), a = a.getStyle("height");
                    c && b.setAttribute("width", g(b.getAttribute("width"), c));
                    a && b.setAttribute("height", g(b.getAttribute("height"), a))
                }
                return b
            }
    })();
    CKEDITOR.plugins.add("link", {
        requires: "dialog,fakeobjects", onLoad: function () {
            function b(b) {
                return d.replace(/%1/g, "rtl" == b ? "right" : "left").replace(/%2/g, "cke_contents_" + b)
            }

            var a = "background:url(" + CKEDITOR.getUrl(this.path + "images" + (CKEDITOR.env.hidpi ? "/hidpi" : "") + "/anchor.png") + ") no-repeat %1 center;border:1px dotted #00f;background-size:16px;",
                d = ".%2 a.cke_anchor,.%2 a.cke_anchor_empty,.cke_editable.%2 a[name],.cke_editable.%2 a[data-cke-saved-name]{" + a + "padding-%1:18px;cursor:auto;}" + (CKEDITOR.plugins.link.synAnchorSelector ?
                        "a.cke_anchor_empty{display:inline-block;}" : "") + ".%2 img.cke_anchor{" + a + "width:16px;min-height:15px;height:1.15em;vertical-align:" + (CKEDITOR.env.opera ? "middle" : "text-bottom") + ";}";
            CKEDITOR.addCss(b("ltr") + b("rtl"))
        }, init: function (b) {
            var a = "a[!href]";
            CKEDITOR.dialog.isTabEnabled(b, "link", "advanced") && (a = a.replace("]", ",accesskey,charset,dir,id,lang,name,rel,tabindex,title,type]{*}(*)"));
            CKEDITOR.dialog.isTabEnabled(b, "link", "target") && (a = a.replace("]", ",target,onclick]"));
            b.addCommand("link", new CKEDITOR.dialogCommand("link",
                {allowedContent: a, requiredContent: "a[href]"}));
            b.addCommand("anchor", new CKEDITOR.dialogCommand("anchor", {
                allowedContent: "a[!name,id]",
                requiredContent: "a[name]"
            }));
            b.addCommand("unlink", new CKEDITOR.unlinkCommand);
            b.addCommand("removeAnchor", new CKEDITOR.removeAnchorCommand);
            b.setKeystroke(CKEDITOR.CTRL + 76, "link");
            b.ui.addButton && (b.ui.addButton("Link", {
                label: b.lang.link.toolbar,
                command: "link",
                toolbar: "links,10"
            }), b.ui.addButton("Unlink", {label: b.lang.link.unlink, command: "unlink", toolbar: "links,20"}),
                b.ui.addButton("Anchor", {label: b.lang.link.anchor.toolbar, command: "anchor", toolbar: "links,30"}));
            CKEDITOR.dialog.add("link", this.path + "dialogs/link.js");
            CKEDITOR.dialog.add("anchor", this.path + "dialogs/anchor.js");
            b.on("doubleclick", function (a) {
                var c = CKEDITOR.plugins.link.getSelectedLink(b) || a.data.element;
                if (!c.isReadOnly())if (c.is("a")) {
                    a.data.dialog = c.getAttribute("name") && (!c.getAttribute("href") || !c.getChildCount()) ? "anchor" : "link";
                    b.getSelection().selectElement(c)
                } else if (CKEDITOR.plugins.link.tryRestoreFakeAnchor(b,
                        c)) a.data.dialog = "anchor"
            });
            b.addMenuItems && b.addMenuItems({
                anchor: {
                    label: b.lang.link.anchor.menu,
                    command: "anchor",
                    group: "anchor",
                    order: 1
                },
                removeAnchor: {label: b.lang.link.anchor.remove, command: "removeAnchor", group: "anchor", order: 5},
                link: {label: b.lang.link.menu, command: "link", group: "link", order: 1},
                unlink: {label: b.lang.link.unlink, command: "unlink", group: "link", order: 5}
            });
            b.contextMenu && b.contextMenu.addListener(function (a) {
                if (!a || a.isReadOnly())return null;
                a = CKEDITOR.plugins.link.tryRestoreFakeAnchor(b,
                    a);
                if (!a && !(a = CKEDITOR.plugins.link.getSelectedLink(b)))return null;
                var c = {};
                a.getAttribute("href") && a.getChildCount() && (c = {
                    link: CKEDITOR.TRISTATE_OFF,
                    unlink: CKEDITOR.TRISTATE_OFF
                });
                if (a && a.hasAttribute("name")) c.anchor = c.removeAnchor = CKEDITOR.TRISTATE_OFF;
                return c
            })
        }, afterInit: function (b) {
            var a = b.dataProcessor, d = a && a.dataFilter, a = a && a.htmlFilter,
                c = b._.elementsPath && b._.elementsPath.filters;
            d && d.addRules({
                elements: {
                    a: function (a) {
                        var c = a.attributes;
                        if (!c.name)return null;
                        var d = !a.children.length;
                        if (CKEDITOR.plugins.link.synAnchorSelector) {
                            var a =
                                d ? "cke_anchor_empty" : "cke_anchor", e = c["class"];
                            if (c.name && (!e || 0 > e.indexOf(a))) c["class"] = (e || "") + " " + a;
                            d && CKEDITOR.plugins.link.emptyAnchorFix && (c.contenteditable = "false", c["data-cke-editable"] = 1)
                        } else if (CKEDITOR.plugins.link.fakeAnchor && d)return b.createFakeParserElement(a, "cke_anchor", "anchor");
                        return null
                    }
                }
            });
            CKEDITOR.plugins.link.emptyAnchorFix && a && a.addRules({
                elements: {
                    a: function (a) {
                        delete a.attributes.contenteditable
                    }
                }
            });
            c && c.push(function (a, c) {
                if ("a" == c && (CKEDITOR.plugins.link.tryRestoreFakeAnchor(b,
                        a) || a.getAttribute("name") && (!a.getAttribute("href") || !a.getChildCount())))return "anchor"
            })
        }
    });
    CKEDITOR.plugins.link = {
        getSelectedLink: function (b) {
            var a = b.getSelection(), d = a.getSelectedElement();
            return d && d.is("a") ? d : (a = a.getRanges()[0]) ? (a.shrink(CKEDITOR.SHRINK_TEXT), b.elementPath(a.getCommonAncestor()).contains("a", 1)) : null
        },
        fakeAnchor: CKEDITOR.env.opera || CKEDITOR.env.webkit,
        synAnchorSelector: CKEDITOR.env.ie && 11 > CKEDITOR.env.version,
        emptyAnchorFix: CKEDITOR.env.ie && 8 > CKEDITOR.env.version,
        tryRestoreFakeAnchor: function (b, a) {
            if (a && a.data("cke-real-element-type") && "anchor" == a.data("cke-real-element-type")) {
                var d =
                    b.restoreRealElement(a);
                if (d.data("cke-saved-name"))return d
            }
        }
    };
    CKEDITOR.unlinkCommand = function () {
    };
    CKEDITOR.unlinkCommand.prototype = {
        exec: function (b) {
            var a = new CKEDITOR.style({element: "a", type: CKEDITOR.STYLE_INLINE, alwaysRemoveElement: 1});
            b.removeStyle(a)
        }, refresh: function (b, a) {
            var d = a.lastElement && a.lastElement.getAscendant("a", !0);
            d && "a" == d.getName() && d.getAttribute("href") && d.getChildCount() ? this.setState(CKEDITOR.TRISTATE_OFF) : this.setState(CKEDITOR.TRISTATE_DISABLED)
        }, contextSensitive: 1, startDisabled: 1, requiredContent: "a[href]"
    };
    CKEDITOR.removeAnchorCommand = function () {
    };
    CKEDITOR.removeAnchorCommand.prototype = {
        exec: function (b) {
            var a = b.getSelection(), d = a.createBookmarks(), c;
            if (a && (c = a.getSelectedElement()) && (CKEDITOR.plugins.link.fakeAnchor && !c.getChildCount() ? CKEDITOR.plugins.link.tryRestoreFakeAnchor(b, c) : c.is("a"))) c.remove(1); else if (c = CKEDITOR.plugins.link.getSelectedLink(b)) c.hasAttribute("href") ? (c.removeAttributes({
                name: 1,
                "data-cke-saved-name": 1
            }), c.removeClass("cke_anchor")) : c.remove(1);
            a.selectBookmarks(d)
        }, requiredContent: "a[name]"
    };
    CKEDITOR.tools.extend(CKEDITOR.config, {linkShowAdvancedTab: !0, linkShowTargetTab: !0});
    (function () {
        function E(c, k, e) {
            function b(b) {
                if ((d = a[b ? "getFirst" : "getLast"]()) && (!d.is || !d.isBlockBoundary()) && (m = k.root[b ? "getPrevious" : "getNext"](CKEDITOR.dom.walker.invisible(!0))) && (!m.is || !m.isBlockBoundary({br: 1}))) c.document.createElement("br")[b ? "insertBefore" : "insertAfter"](d)
            }

            for (var j = CKEDITOR.plugins.list.listToArray(k.root, e), g = [], h = 0; h < k.contents.length; h++) {
                var f = k.contents[h];
                if ((f = f.getAscendant("li", !0)) && !f.getCustomData("list_item_processed")) g.push(f), CKEDITOR.dom.element.setMarker(e,
                    f, "list_item_processed", !0)
            }
            f = null;
            for (h = 0; h < g.length; h++)f = g[h].getCustomData("listarray_index"), j[f].indent = -1;
            for (h = f + 1; h < j.length; h++)if (j[h].indent > j[h - 1].indent + 1) {
                g = j[h - 1].indent + 1 - j[h].indent;
                for (f = j[h].indent; j[h] && j[h].indent >= f;)j[h].indent += g, h++;
                h--
            }
            var a = CKEDITOR.plugins.list.arrayToList(j, e, null, c.config.enterMode, k.root.getAttribute("dir")).listNode,
                d, m;
            b(!0);
            b();
            a.replace(k.root);
            c.fire("contentDomInvalidated")
        }

        function x(c, k) {
            this.name = c;
            this.context = this.type = k;
            this.allowedContent =
                k + " li";
            this.requiredContent = k
        }

        function A(c, k, e, b) {
            for (var j,
                     g; j = c[b ? "getLast" : "getFirst"](F);)(g = j.getDirection(1)) !== k.getDirection(1) && j.setAttribute("dir", g), j.remove(), e ? j[b ? "insertBefore" : "insertAfter"](e) : k.append(j, b)
        }

        function B(c) {
            var k;
            (k = function (e) {
                var b = c[e ? "getPrevious" : "getNext"](q);
                b && (b.type == CKEDITOR.NODE_ELEMENT && b.is(c.getName())) && (A(c, b, null, !e), c.remove(), c = b)
            })();
            k(1)
        }

        function C(c) {
            return c.type == CKEDITOR.NODE_ELEMENT && (c.getName() in CKEDITOR.dtd.$block || c.getName() in CKEDITOR.dtd.$listItem) &&
                CKEDITOR.dtd[c.getName()]["#"]
        }

        function y(c, k, e) {
            c.fire("saveSnapshot");
            e.enlarge(CKEDITOR.ENLARGE_LIST_ITEM_CONTENTS);
            var b = e.extractContents();
            k.trim(!1, !0);
            var j = k.createBookmark(), g = new CKEDITOR.dom.elementPath(k.startContainer), h = g.block,
                g = g.lastElement.getAscendant("li", 1) || h, f = new CKEDITOR.dom.elementPath(e.startContainer),
                a = f.contains(CKEDITOR.dtd.$listItem), f = f.contains(CKEDITOR.dtd.$list);
            h ? (h = h.getBogus()) && h.remove() : f && (h = f.getPrevious(q)) && v(h) && h.remove();
            (h = b.getLast()) && (h.type ==
            CKEDITOR.NODE_ELEMENT && h.is("br")) && h.remove();
            (h = k.startContainer.getChild(k.startOffset)) ? b.insertBefore(h) : k.startContainer.append(b);
            if (a && (b = w(a))) g.contains(a) ? (A(b, a.getParent(), a), b.remove()) : g.append(b);
            for (; e.checkStartOfBlock() && e.checkEndOfBlock();) {
                f = e.startPath();
                b = f.block;
                if (!b)break;
                b.is("li") && (g = b.getParent(), b.equals(g.getLast(q)) && b.equals(g.getFirst(q)) && (b = g));
                e.moveToPosition(b, CKEDITOR.POSITION_BEFORE_START);
                b.remove()
            }
            e = e.clone();
            b = c.editable();
            e.setEndAt(b, CKEDITOR.POSITION_BEFORE_END);
            e = new CKEDITOR.dom.walker(e);
            e.evaluator = function (a) {
                return q(a) && !v(a)
            };
            (e = e.next()) && (e.type == CKEDITOR.NODE_ELEMENT && e.getName() in CKEDITOR.dtd.$list) && B(e);
            k.moveToBookmark(j);
            k.select();
            c.fire("saveSnapshot")
        }

        function w(c) {
            return (c = c.getLast(q)) && c.type == CKEDITOR.NODE_ELEMENT && c.getName() in r ? c : null
        }

        var r = {ol: 1, ul: 1}, G = CKEDITOR.dom.walker.whitespaces(), D = CKEDITOR.dom.walker.bookmark(),
            q = function (c) {
                return !(G(c) || D(c))
            }, v = CKEDITOR.dom.walker.bogus();
        CKEDITOR.plugins.list = {
            listToArray: function (c,
                                   k, e, b, j) {
                if (!r[c.getName()])return [];
                b || (b = 0);
                e || (e = []);
                for (var g = 0, h = c.getChildCount(); g < h; g++) {
                    var f = c.getChild(g);
                    f.type == CKEDITOR.NODE_ELEMENT && f.getName() in CKEDITOR.dtd.$list && CKEDITOR.plugins.list.listToArray(f, k, e, b + 1);
                    if ("li" == f.$.nodeName.toLowerCase()) {
                        var a = {parent: c, indent: b, element: f, contents: []};
                        j ? a.grandparent = j : (a.grandparent = c.getParent(), a.grandparent && "li" == a.grandparent.$.nodeName.toLowerCase() && (a.grandparent = a.grandparent.getParent()));
                        k && CKEDITOR.dom.element.setMarker(k, f,
                            "listarray_index", e.length);
                        e.push(a);
                        for (var d = 0, m = f.getChildCount(),
                                 i; d < m; d++)i = f.getChild(d), i.type == CKEDITOR.NODE_ELEMENT && r[i.getName()] ? CKEDITOR.plugins.list.listToArray(i, k, e, b + 1, a.grandparent) : a.contents.push(i)
                    }
                }
                return e
            }, arrayToList: function (c, k, e, b, j) {
                e || (e = 0);
                if (!c || c.length < e + 1)return null;
                for (var g, h = c[e].parent.getDocument(), f = new CKEDITOR.dom.documentFragment(h), a = null, d = e,
                         m = Math.max(c[e].indent, 0), i = null, n, l, p = b == CKEDITOR.ENTER_P ? "p" : "div"; ;) {
                    var o = c[d];
                    g = o.grandparent;
                    n = o.element.getDirection(1);
                    if (o.indent == m) {
                        if (!a || c[d].parent.getName() != a.getName()) a = c[d].parent.clone(!1, 1), j && a.setAttribute("dir", j), f.append(a);
                        i = a.append(o.element.clone(0, 1));
                        n != a.getDirection(1) && i.setAttribute("dir", n);
                        for (g = 0; g < o.contents.length; g++)i.append(o.contents[g].clone(1, 1));
                        d++
                    } else if (o.indent == Math.max(m, 0) + 1) o = c[d - 1].element.getDirection(1), d = CKEDITOR.plugins.list.arrayToList(c, null, d, b, o != n ? n : null), !i.getChildCount() && (CKEDITOR.env.needsNbspFiller && !(7 < h.$.documentMode)) && i.append(h.createText(" ")),
                        i.append(d.listNode), d = d.nextIndex; else if (-1 == o.indent && !e && g) {
                        r[g.getName()] ? (i = o.element.clone(!1, !0), n != g.getDirection(1) && i.setAttribute("dir", n)) : i = new CKEDITOR.dom.documentFragment(h);
                        var a = g.getDirection(1) != n, u = o.element, z = u.getAttribute("class"),
                            v = u.getAttribute("style"),
                            w = i.type == CKEDITOR.NODE_DOCUMENT_FRAGMENT && (b != CKEDITOR.ENTER_BR || a || v || z), s,
                            x = o.contents.length, t;
                        for (g = 0; g < x; g++)if (s = o.contents[g], D(s) && 1 < x) w ? t = s.clone(1, 1) : i.append(s.clone(1, 1)); else if (s.type == CKEDITOR.NODE_ELEMENT &&
                            s.isBlockBoundary()) {
                            a && !s.getDirection() && s.setAttribute("dir", n);
                            l = s;
                            var y = u.getAttribute("style");
                            y && l.setAttribute("style", y.replace(/([^;])$/, "$1;") + (l.getAttribute("style") || ""));
                            z && s.addClass(z);
                            l = null;
                            t && (i.append(t), t = null);
                            i.append(s.clone(1, 1))
                        } else w ? (l || (l = h.createElement(p), i.append(l), a && l.setAttribute("dir", n)), v && l.setAttribute("style", v), z && l.setAttribute("class", z), t && (l.append(t), t = null), l.append(s.clone(1, 1))) : i.append(s.clone(1, 1));
                        t && ((l || i).append(t), t = null);
                        i.type == CKEDITOR.NODE_DOCUMENT_FRAGMENT &&
                        d != c.length - 1 && (CKEDITOR.env.needsBrFiller && (n = i.getLast()) && (n.type == CKEDITOR.NODE_ELEMENT && n.is("br")) && n.remove(), n = i.getLast(q), (!n || !(n.type == CKEDITOR.NODE_ELEMENT && n.is(CKEDITOR.dtd.$block))) && i.append(h.createElement("br")));
                        n = i.$.nodeName.toLowerCase();
                        ("div" == n || "p" == n) && i.appendBogus();
                        f.append(i);
                        a = null;
                        d++
                    } else return null;
                    l = null;
                    if (c.length <= d || Math.max(c[d].indent, 0) < m)break
                }
                if (k)for (c = f.getFirst(); c;) {
                    if (c.type == CKEDITOR.NODE_ELEMENT && (CKEDITOR.dom.element.clearMarkers(k, c), c.getName() in
                        CKEDITOR.dtd.$listItem && (e = c, h = j = b = void 0, b = e.getDirection()))) {
                        for (j = e.getParent(); j && !(h = j.getDirection());)j = j.getParent();
                        b == h && e.removeAttribute("dir")
                    }
                    c = c.getNextSourceNode()
                }
                return {listNode: f, nextIndex: d}
            }
        };
        var H = /^h[1-6]$/, F = CKEDITOR.dom.walker.nodeType(CKEDITOR.NODE_ELEMENT);
        x.prototype = {
            exec: function (c) {
                this.refresh(c, c.elementPath());
                var k = c.config, e = c.getSelection(), b = e && e.getRanges();
                if (this.state == CKEDITOR.TRISTATE_OFF) {
                    var j = c.editable();
                    if (j.getFirst(q)) {
                        var g = 1 == b.length && b[0];
                        (k =
                            g && g.getEnclosedNode()) && (k.is && this.type == k.getName()) && this.setState(CKEDITOR.TRISTATE_ON)
                    } else k.enterMode == CKEDITOR.ENTER_BR ? j.appendBogus() : b[0].fixBlock(1, k.enterMode == CKEDITOR.ENTER_P ? "p" : "div"), e.selectRanges(b)
                }
                for (var k = e.createBookmarks(!0), j = [], h = {}, b = b.createIterator(),
                         f = 0; (g = b.getNextRange()) && ++f;) {
                    var a = g.getBoundaryNodes(), d = a.startNode, m = a.endNode;
                    d.type == CKEDITOR.NODE_ELEMENT && "td" == d.getName() && g.setStartAt(a.startNode, CKEDITOR.POSITION_AFTER_START);
                    m.type == CKEDITOR.NODE_ELEMENT &&
                    "td" == m.getName() && g.setEndAt(a.endNode, CKEDITOR.POSITION_BEFORE_END);
                    g = g.createIterator();
                    for (g.forceBrBreak = this.state == CKEDITOR.TRISTATE_OFF; a = g.getNextParagraph();)if (!a.getCustomData("list_block")) {
                        CKEDITOR.dom.element.setMarker(h, a, "list_block", 1);
                        for (var i = c.elementPath(a), d = i.elements, m = 0, i = i.blockLimit, n,
                                 l = d.length - 1; 0 <= l && (n = d[l]); l--)if (r[n.getName()] && i.contains(n)) {
                            i.removeCustomData("list_group_object_" + f);
                            (d = n.getCustomData("list_group_object")) ? d.contents.push(a) : (d = {
                                root: n,
                                contents: [a]
                            },
                                j.push(d), CKEDITOR.dom.element.setMarker(h, n, "list_group_object", d));
                            m = 1;
                            break
                        }
                        m || (m = i, m.getCustomData("list_group_object_" + f) ? m.getCustomData("list_group_object_" + f).contents.push(a) : (d = {
                            root: m,
                            contents: [a]
                        }, CKEDITOR.dom.element.setMarker(h, m, "list_group_object_" + f, d), j.push(d)))
                    }
                }
                for (n = []; 0 < j.length;)if (d = j.shift(), this.state == CKEDITOR.TRISTATE_OFF)if (r[d.root.getName()]) {
                    b = c;
                    f = d;
                    d = h;
                    g = n;
                    m = CKEDITOR.plugins.list.listToArray(f.root, d);
                    i = [];
                    for (a = 0; a < f.contents.length; a++)if (l = f.contents[a], (l = l.getAscendant("li",
                            !0)) && !l.getCustomData("list_item_processed")) i.push(l), CKEDITOR.dom.element.setMarker(d, l, "list_item_processed", !0);
                    for (var l = f.root.getDocument(), p = void 0, o = void 0, a = 0; a < i.length; a++) {
                        var u = i[a].getCustomData("listarray_index"), p = m[u].parent;
                        p.is(this.type) || (o = l.createElement(this.type), p.copyAttributes(o, {
                            start: 1,
                            type: 1
                        }), o.removeStyle("list-style-type"), m[u].parent = o)
                    }
                    d = CKEDITOR.plugins.list.arrayToList(m, d, null, b.config.enterMode);
                    m = void 0;
                    i = d.listNode.getChildCount();
                    for (a = 0; a < i && (m = d.listNode.getChild(a)); a++)m.getName() ==
                    this.type && g.push(m);
                    d.listNode.replace(f.root);
                    b.fire("contentDomInvalidated")
                } else {
                    m = c;
                    a = d;
                    g = n;
                    i = a.contents;
                    b = a.root.getDocument();
                    f = [];
                    1 == i.length && i[0].equals(a.root) && (d = b.createElement("div"), i[0].moveChildren && i[0].moveChildren(d), i[0].append(d), i[0] = d);
                    a = a.contents[0].getParent();
                    for (l = 0; l < i.length; l++)a = a.getCommonAncestor(i[l].getParent());
                    p = m.config.useComputedState;
                    m = d = void 0;
                    p = void 0 === p || p;
                    for (l = 0; l < i.length; l++)for (o = i[l]; u = o.getParent();) {
                        if (u.equals(a)) {
                            f.push(o);
                            !m && o.getDirection() &&
                            (m = 1);
                            o = o.getDirection(p);
                            null !== d && (d = d && d != o ? null : o);
                            break
                        }
                        o = u
                    }
                    if (!(1 > f.length)) {
                        i = f[f.length - 1].getNext();
                        l = b.createElement(this.type);
                        g.push(l);
                        for (p = g = void 0; f.length;)g = f.shift(), p = b.createElement("li"), g.is("pre") || H.test(g.getName()) || "false" == g.getAttribute("contenteditable") ? g.appendTo(p) : (g.copyAttributes(p), d && g.getDirection() && (p.removeStyle("direction"), p.removeAttribute("dir")), g.moveChildren(p), g.remove()), p.appendTo(l);
                        d && m && l.setAttribute("dir", d);
                        i ? l.insertBefore(i) : l.appendTo(a)
                    }
                } else this.state ==
                CKEDITOR.TRISTATE_ON && r[d.root.getName()] && E.call(this, c, d, h);
                for (l = 0; l < n.length; l++)B(n[l]);
                CKEDITOR.dom.element.clearAllMarkers(h);
                e.selectBookmarks(k);
                c.focus()
            }, refresh: function (c, k) {
                var e = k.contains(r, 1), b = k.blockLimit || k.root;
                e && b.contains(e) ? this.setState(e.is(this.type) ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF) : this.setState(CKEDITOR.TRISTATE_OFF)
            }
        };
        CKEDITOR.plugins.add("list", {
            requires: "indentlist", init: function (c) {
                c.blockless || (c.addCommand("numberedlist", new x("numberedlist", "ol")), c.addCommand("bulletedlist",
                    new x("bulletedlist", "ul")), c.ui.addButton && (c.ui.addButton("NumberedList", {
                    label: c.lang.list.numberedlist,
                    command: "numberedlist",
                    directional: !0,
                    toolbar: "list,10"
                }), c.ui.addButton("BulletedList", {
                    label: c.lang.list.bulletedlist,
                    command: "bulletedlist",
                    directional: !0,
                    toolbar: "list,20"
                })), c.on("key", function (k) {
                    var e = k.data.keyCode;
                    if (c.mode == "wysiwyg" && e in {8: 1, 46: 1}) {
                        var b = c.getSelection().getRanges()[0], j = b && b.startPath();
                        if (b && b.collapsed) {
                            var j = new CKEDITOR.dom.elementPath(b.startContainer), g = e ==
                                8, h = c.editable(), f = new CKEDITOR.dom.walker(b.clone());
                            f.evaluator = function (a) {
                                return q(a) && !v(a)
                            };
                            f.guard = function (a, b) {
                                return !(b && a.type == CKEDITOR.NODE_ELEMENT && a.is("table"))
                            };
                            e = b.clone();
                            if (g) {
                                var a, d;
                                if ((a = j.contains(r)) && b.checkBoundaryOfElement(a, CKEDITOR.START) && (a = a.getParent()) && a.is("li") && (a = w(a))) {
                                    d = a;
                                    a = a.getPrevious(q);
                                    e.moveToPosition(a && v(a) ? a : d, CKEDITOR.POSITION_BEFORE_START)
                                } else {
                                    f.range.setStartAt(h, CKEDITOR.POSITION_AFTER_START);
                                    f.range.setEnd(b.startContainer, b.startOffset);
                                    if ((a =
                                            f.previous()) && a.type == CKEDITOR.NODE_ELEMENT && (a.getName() in r || a.is("li"))) {
                                        if (!a.is("li")) {
                                            f.range.selectNodeContents(a);
                                            f.reset();
                                            f.evaluator = C;
                                            a = f.previous()
                                        }
                                        d = a;
                                        e.moveToElementEditEnd(d)
                                    }
                                }
                                if (d) {
                                    y(c, e, b);
                                    k.cancel()
                                } else if ((e = j.contains(r)) && b.checkBoundaryOfElement(e, CKEDITOR.START)) {
                                    d = e.getFirst(q);
                                    if (b.checkBoundaryOfElement(d, CKEDITOR.START)) {
                                        a = e.getPrevious(q);
                                        if (w(d)) {
                                            if (a) {
                                                b.moveToElementEditEnd(a);
                                                b.select()
                                            }
                                        } else c.execCommand("outdent");
                                        k.cancel()
                                    }
                                }
                            } else if (d = j.contains("li")) {
                                f.range.setEndAt(h,
                                    CKEDITOR.POSITION_BEFORE_END);
                                h = (j = d.getLast(q)) && C(j) ? j : d;
                                d = 0;
                                if ((a = f.next()) && a.type == CKEDITOR.NODE_ELEMENT && a.getName() in r && a.equals(j)) {
                                    d = 1;
                                    a = f.next()
                                } else b.checkBoundaryOfElement(h, CKEDITOR.END) && (d = 1);
                                if (d && a) {
                                    b = b.clone();
                                    b.moveToElementEditStart(a);
                                    y(c, e, b);
                                    k.cancel()
                                }
                            } else {
                                f.range.setEndAt(h, CKEDITOR.POSITION_BEFORE_END);
                                if ((a = f.next()) && a.type == CKEDITOR.NODE_ELEMENT && a.is(r)) {
                                    a = a.getFirst(q);
                                    if (j.block && b.checkStartOfBlock() && b.checkEndOfBlock()) {
                                        j.block.remove();
                                        b.moveToElementEditStart(a);
                                        b.select()
                                    } else if (w(a)) {
                                        b.moveToElementEditStart(a);
                                        b.select()
                                    } else {
                                        b = b.clone();
                                        b.moveToElementEditStart(a);
                                        y(c, e, b)
                                    }
                                    k.cancel()
                                }
                            }
                            setTimeout(function () {
                                c.selectionChange(1)
                            })
                        }
                    }
                }))
            }
        })
    })();
    (function () {
        function Q(a, c, d) {
            return m(c) && m(d) && d.equals(c.getNext(function (a) {
                    return !(z(a) || A(a) || p(a))
                }))
        }

        function u(a) {
            this.upper = a[0];
            this.lower = a[1];
            this.set.apply(this, a.slice(2))
        }

        function J(a) {
            var c = a.element;
            if (c && m(c) && (c = c.getAscendant(a.triggers, !0)) && a.editable.contains(c)) {
                var d = K(c, !0);
                if ("true" == d.getAttribute("contenteditable"))return c;
                if (d.is(a.triggers))return d
            }
            return null
        }

        function ga(a, c, d) {
            o(a, c);
            o(a, d);
            a = c.size.bottom;
            d = d.size.top;
            return a && d ? 0 | (a + d) / 2 : a || d
        }

        function r(a, c,
                   d) {
            return c = c[d ? "getPrevious" : "getNext"](function (b) {
                return b && b.type == CKEDITOR.NODE_TEXT && !z(b) || m(b) && !p(b) && !v(a, b)
            })
        }

        function K(a, c) {
            if (a.data("cke-editable"))return null;
            for (c || (a = a.getParent()); a && !a.data("cke-editable");) {
                if (a.hasAttribute("contenteditable"))return a;
                a = a.getParent()
            }
            return null
        }

        function ha(a) {
            var c = a.doc,
                d = B('<span contenteditable="false" style="' + L + "position:absolute;border-top:1px dashed " + a.boxColor + '"></span>', c),
                b = this.path + "images/" + (n.hidpi ? "hidpi/" : "") + "icon.png";
            q(d,
                {
                    attach: function () {
                        this.wrap.getParent() || this.wrap.appendTo(a.editable, !0);
                        return this
                    },
                    lineChildren: [q(B('<span title="' + a.editor.lang.magicline.title + '" contenteditable="false">&#8629;</span>', c), {
                        base: L + "height:17px;width:17px;" + (a.rtl ? "left" : "right") + ":17px;background:url(" + b + ") center no-repeat " + a.boxColor + ";cursor:pointer;" + (n.hc ? "font-size: 15px;line-height:14px;border:1px solid #fff;text-align:center;" : "") + (n.hidpi ? "background-size: 9px 10px;" : ""),
                        looks: ["top:-8px;" + CKEDITOR.tools.cssVendorPrefix("border-radius",
                            "2px", 1), "top:-17px;" + CKEDITOR.tools.cssVendorPrefix("border-radius", "2px 2px 0px 0px", 1), "top:-1px;" + CKEDITOR.tools.cssVendorPrefix("border-radius", "0px 0px 2px 2px", 1)]
                    }), q(B(R, c), {
                        base: S + "left:0px;border-left-color:" + a.boxColor + ";",
                        looks: ["border-width:8px 0 8px 8px;top:-8px", "border-width:8px 0 0 8px;top:-8px", "border-width:0 0 8px 8px;top:0px"]
                    }), q(B(R, c), {
                        base: S + "right:0px;border-right-color:" + a.boxColor + ";",
                        looks: ["border-width:8px 8px 8px 0;top:-8px", "border-width:8px 8px 0 0;top:-8px", "border-width:0 8px 8px 0;top:0px"]
                    })],
                    detach: function () {
                        this.wrap.getParent() && this.wrap.remove();
                        return this
                    },
                    mouseNear: function () {
                        o(a, this);
                        var b = a.holdDistance, c = this.size;
                        return c && a.mouse.y > c.top - b && a.mouse.y < c.bottom + b && a.mouse.x > c.left - b && a.mouse.x < c.right + b ? !0 : !1
                    },
                    place: function () {
                        var b = a.view, c = a.editable, d = a.trigger, h = d.upper, g = d.lower, j = h || g,
                            l = j.getParent(), k = {};
                        this.trigger = d;
                        h && o(a, h, !0);
                        g && o(a, g, !0);
                        o(a, l, !0);
                        a.inInlineMode && C(a, !0);
                        l.equals(c) ? (k.left = b.scroll.x, k.right = -b.scroll.x, k.width = "") : (k.left = j.size.left - j.size.margin.left +
                            b.scroll.x - (a.inInlineMode ? b.editable.left + b.editable.border.left : 0), k.width = j.size.outerWidth + j.size.margin.left + j.size.margin.right + b.scroll.x, k.right = "");
                        h && g ? k.top = h.size.margin.bottom === g.size.margin.top ? 0 | h.size.bottom + h.size.margin.bottom / 2 : h.size.margin.bottom < g.size.margin.top ? h.size.bottom + h.size.margin.bottom : h.size.bottom + h.size.margin.bottom - g.size.margin.top : h ? g || (k.top = h.size.bottom + h.size.margin.bottom) : k.top = g.size.top - g.size.margin.top;
                        d.is(x) || k.top > b.scroll.y - 15 && k.top < b.scroll.y +
                        5 ? (k.top = a.inInlineMode ? 0 : b.scroll.y, this.look(x)) : d.is(y) || k.top > b.pane.bottom - 5 && k.top < b.pane.bottom + 15 ? (k.top = a.inInlineMode ? b.editable.height + b.editable.padding.top + b.editable.padding.bottom : b.pane.bottom - 1, this.look(y)) : (a.inInlineMode && (k.top -= b.editable.top + b.editable.border.top), this.look(s));
                        a.inInlineMode && (k.top--, k.top += b.editable.scroll.top, k.left += b.editable.scroll.left);
                        for (var T in k)k[T] = CKEDITOR.tools.cssLength(k[T]);
                        this.setStyles(k)
                    },
                    look: function (a) {
                        if (this.oldLook != a) {
                            for (var b =
                                    this.lineChildren.length,
                                     c; b--;)(c = this.lineChildren[b]).setAttribute("style", c.base + c.looks[0 | a / 2]);
                            this.oldLook = a
                        }
                    },
                    wrap: new M("span", a.doc)
                });
            for (c = d.lineChildren.length; c--;)d.lineChildren[c].appendTo(d);
            d.look(s);
            d.appendTo(d.wrap);
            d.unselectable();
            d.lineChildren[0].on("mouseup", function (b) {
                d.detach();
                N(a, function (b) {
                    var c = a.line.trigger;
                    b[c.is(D) ? "insertBefore" : "insertAfter"](c.is(D) ? c.lower : c.upper)
                }, !0);
                a.editor.focus();
                !n.ie && a.enterMode != CKEDITOR.ENTER_BR && a.hotNode.scrollIntoView();
                b.data.preventDefault(!0)
            });
            d.on("mousedown", function (a) {
                a.data.preventDefault(!0)
            });
            a.line = d
        }

        function N(a, c, d) {
            var b = new CKEDITOR.dom.range(a.doc), e = a.editor, f;
            n.ie && a.enterMode == CKEDITOR.ENTER_BR ? f = a.doc.createText(E) : (f = (f = K(a.element, !0)) && f.data("cke-enter-mode") || a.enterMode, f = new M(F[f], a.doc), f.is("br") || a.doc.createText(E).appendTo(f));
            d && e.fire("saveSnapshot");
            c(f);
            b.moveToPosition(f, CKEDITOR.POSITION_AFTER_START);
            e.getSelection().selectRanges([b]);
            a.hotNode = f;
            d && e.fire("saveSnapshot")
        }

        function U(a, c) {
            return {
                canUndo: !0,
                modes: {wysiwyg: 1}, exec: function () {
                    function d(b) {
                        var d = n.ie && 9 > n.version ? " " : E,
                            f = a.hotNode && a.hotNode.getText() == d && a.element.equals(a.hotNode) && a.lastCmdDirection === !!c;
                        N(a, function (d) {
                            f && a.hotNode && a.hotNode.remove();
                            d[c ? "insertAfter" : "insertBefore"](b);
                            d.setAttributes({"data-cke-magicline-hot": 1, "data-cke-magicline-dir": !!c});
                            a.lastCmdDirection = !!c
                        });
                        !n.ie && a.enterMode != CKEDITOR.ENTER_BR && a.hotNode.scrollIntoView();
                        a.line.detach()
                    }

                    return function (b) {
                        var b = b.getSelection().getStartElement(), e, b =
                            b.getAscendant(V, 1);
                        if (!W(a, b) && b && !b.equals(a.editable) && !b.contains(a.editable)) {
                            if ((e = K(b)) && "false" == e.getAttribute("contenteditable")) b = e;
                            a.element = b;
                            e = r(a, b, !c);
                            var f;
                            m(e) && e.is(a.triggers) && e.is(ia) && (!r(a, e, !c) || (f = r(a, e, !c)) && m(f) && f.is(a.triggers)) ? d(e) : (f = J(a, b), m(f) && (r(a, f, !c) ? (b = r(a, f, !c)) && (m(b) && b.is(a.triggers)) && d(f) : d(f)))
                        }
                    }
                }()
            }
        }

        function v(a, c) {
            if (!c || !(c.type == CKEDITOR.NODE_ELEMENT && c.$))return !1;
            var d = a.line;
            return d.wrap.equals(c) || d.wrap.contains(c)
        }

        function m(a) {
            return a &&
                a.type == CKEDITOR.NODE_ELEMENT && a.$
        }

        function p(a) {
            if (!m(a))return !1;
            var c;
            if (!(c = X(a))) m(a) ? (c = {
                left: 1,
                right: 1,
                center: 1
            }, c = !(!c[a.getComputedStyle("float")] && !c[a.getAttribute("align")])) : c = !1;
            return c
        }

        function X(a) {
            return !!{absolute: 1, fixed: 1}[a.getComputedStyle("position")]
        }

        function G(a, c) {
            return m(c) ? c.is(a.triggers) : null
        }

        function W(a, c) {
            if (!c)return !1;
            for (var d = c.getParents(1),
                     b = d.length; b--;)for (var e = a.tabuList.length; e--;)if (d[b].hasAttribute(a.tabuList[e]))return !0;
            return !1
        }

        function ja(a, c,
                    d) {
            c = c[d ? "getLast" : "getFirst"](function (b) {
                return a.isRelevant(b) && !b.is(ka)
            });
            if (!c)return !1;
            o(a, c);
            return d ? c.size.top > a.mouse.y : c.size.bottom < a.mouse.y
        }

        function Y(a) {
            var c = a.editable, d = a.mouse, b = a.view, e = a.triggerOffset;
            C(a);
            var f = d.y > (a.inInlineMode ? b.editable.top + b.editable.height / 2 : Math.min(b.editable.height, b.pane.height) / 2),
                c = c[f ? "getLast" : "getFirst"](function (a) {
                    return !(z(a) || A(a))
                });
            if (!c)return null;
            v(a, c) && (c = a.line.wrap[f ? "getPrevious" : "getNext"](function (a) {
                return !(z(a) || A(a))
            }));
            if (!m(c) ||
                p(c) || !G(a, c))return null;
            o(a, c);
            return !f && 0 <= c.size.top && 0 < d.y && d.y < c.size.top + e ? (a = a.inInlineMode || 0 === b.scroll.y ? x : s, new u([null, c, D, H, a])) : f && c.size.bottom <= b.pane.height && d.y > c.size.bottom - e && d.y < b.pane.height ? (a = a.inInlineMode || c.size.bottom > b.pane.height - e && c.size.bottom < b.pane.height ? y : s, new u([c, null, Z, H, a])) : null
        }

        function $(a) {
            var c = a.mouse, d = a.view, b = a.triggerOffset, e = J(a);
            if (!e)return null;
            o(a, e);
            var b = Math.min(b, 0 | e.size.outerHeight / 2), f = [], i, h;
            if (c.y > e.size.top - 1 && c.y < e.size.top + b) h =
                !1; else if (c.y > e.size.bottom - b && c.y < e.size.bottom + 1) h = !0; else return null;
            if (p(e) || ja(a, e, h) || e.getParent().is(aa))return null;
            var g = r(a, e, !h);
            if (g) {
                if (g && g.type == CKEDITOR.NODE_TEXT)return null;
                if (m(g)) {
                    if (p(g) || !G(a, g) || g.getParent().is(aa))return null;
                    f = [g, e][h ? "reverse" : "concat"]().concat([O, H])
                }
            } else e.equals(a.editable[h ? "getLast" : "getFirst"](a.isRelevant)) ? (C(a), h && c.y > e.size.bottom - b && c.y < d.pane.height && e.size.bottom > d.pane.height - b && e.size.bottom < d.pane.height ? i = y : 0 < c.y && c.y < e.size.top + b &&
                (i = x)) : i = s, f = [null, e][h ? "reverse" : "concat"]().concat([h ? Z : D, H, i, e.equals(a.editable[h ? "getLast" : "getFirst"](a.isRelevant)) ? h ? y : x : s]);
            return 0 in f ? new u(f) : null
        }

        function P(a, c, d, b) {
            for (var e = function () {
                    var b = n.ie ? c.$.currentStyle : a.win.$.getComputedStyle(c.$, "");
                    return n.ie ? function (a) {
                        return b[CKEDITOR.tools.cssStyleToDomStyle(a)]
                    } : function (a) {
                        return b.getPropertyValue(a)
                    }
                }(), f = c.getDocumentPosition(), i = {}, h = {}, g = {}, j = {},
                     l = t.length; l--;)i[t[l]] = parseInt(e("border-" + t[l] + "-width"), 10) || 0, g[t[l]] =
                parseInt(e("padding-" + t[l]), 10) || 0, h[t[l]] = parseInt(e("margin-" + t[l]), 10) || 0;
            (!d || b) && I(a, b);
            j.top = f.y - (d ? 0 : a.view.scroll.y);
            j.left = f.x - (d ? 0 : a.view.scroll.x);
            j.outerWidth = c.$.offsetWidth;
            j.outerHeight = c.$.offsetHeight;
            j.height = j.outerHeight - (g.top + g.bottom + i.top + i.bottom);
            j.width = j.outerWidth - (g.left + g.right + i.left + i.right);
            j.bottom = j.top + j.outerHeight;
            j.right = j.left + j.outerWidth;
            a.inInlineMode && (j.scroll = {top: c.$.scrollTop, left: c.$.scrollLeft});
            return q({border: i, padding: g, margin: h, ignoreScroll: d},
                j, !0)
        }

        function o(a, c, d) {
            if (!m(c))return c.size = null;
            if (c.size) {
                if (c.size.ignoreScroll == d && c.size.date > new Date - ba)return null
            } else c.size = {};
            return q(c.size, P(a, c, d), {date: +new Date}, !0)
        }

        function C(a, c) {
            a.view.editable = P(a, a.editable, c, !0)
        }

        function I(a, c) {
            a.view || (a.view = {});
            var d = a.view;
            if (c || !(d && d.date > new Date - ba)) {
                var b = a.win, d = b.getScrollPosition(), b = b.getViewPaneSize();
                q(a.view, {
                    scroll: {
                        x: d.x,
                        y: d.y,
                        width: a.doc.$.documentElement.scrollWidth - b.width,
                        height: a.doc.$.documentElement.scrollHeight -
                        b.height
                    }, pane: {width: b.width, height: b.height, bottom: b.height + d.y}, date: +new Date
                }, !0)
            }
        }

        function la(a, c, d, b) {
            for (var e = b, f = b, i = 0, h = !1, g = !1, j = a.view.pane.height,
                     l = a.mouse; l.y + i < j && 0 < l.y - i;) {
                h || (h = c(e, b));
                g || (g = c(f, b));
                !h && 0 < l.y - i && (e = d(a, {x: l.x, y: l.y - i}));
                !g && l.y + i < j && (f = d(a, {x: l.x, y: l.y + i}));
                if (h && g)break;
                i += 2
            }
            return new u([e, f, null, null])
        }

        CKEDITOR.plugins.add("magicline", {
            init: function (a) {
                var c = a.config, d = c.magicline_triggerOffset || 30, b = {
                    editor: a,
                    enterMode: c.enterMode,
                    triggerOffset: d,
                    holdDistance: 0 |
                    d * (c.magicline_holdDistance || 0.5),
                    boxColor: c.magicline_color || "#ff0000",
                    rtl: "rtl" == c.contentsLangDirection,
                    tabuList: ["data-cke-hidden-sel"].concat(c.magicline_tabuList || []),
                    triggers: c.magicline_everywhere ? V : {
                        table: 1,
                        hr: 1,
                        div: 1,
                        ul: 1,
                        ol: 1,
                        dl: 1,
                        form: 1,
                        blockquote: 1
                    }
                }, e, f, i;
                b.isRelevant = function (a) {
                    return m(a) && !v(b, a) && !p(a)
                };
                a.on("contentDom", function () {
                    var d = a.editable(), g = a.document, j = a.window;
                    q(b, {editable: d, inInlineMode: d.isInline(), doc: g, win: j, hotNode: null}, !0);
                    b.boundary = b.inInlineMode ? b.editable :
                        b.doc.getDocumentElement();
                    d.is(w.$inline) || (b.inInlineMode && !X(d) && d.setStyles({
                        position: "relative",
                        top: null,
                        left: null
                    }), ha.call(this, b), I(b), d.attachListener(a, "beforeUndoImage", function () {
                        b.line.detach()
                    }), d.attachListener(a, "beforeGetData", function () {
                        b.line.wrap.getParent() && (b.line.detach(), a.once("getData", function () {
                            b.line.attach()
                        }, null, null, 1E3))
                    }, null, null, 0), d.attachListener(b.inInlineMode ? g : g.getWindow().getFrame(), "mouseout", function (c) {
                        if ("wysiwyg" == a.mode)if (b.inInlineMode) {
                            var d = c.data.$.clientX,
                                c = c.data.$.clientY;
                            I(b);
                            C(b, !0);
                            var e = b.view.editable, f = b.view.scroll;
                            if (!(d > e.left - f.x && d < e.right - f.x) || !(c > e.top - f.y && c < e.bottom - f.y)) clearTimeout(i), i = null, b.line.detach()
                        } else clearTimeout(i), i = null, b.line.detach()
                    }), d.attachListener(d, "keyup", function () {
                        b.hiddenMode = 0
                    }), d.attachListener(d, "keydown", function (c) {
                        if ("wysiwyg" == a.mode)switch (c = c.data.getKeystroke(), a.getSelection().getStartElement(), c) {
                            case 2228240:
                            case 16:
                                b.hiddenMode = 1, b.line.detach()
                        }
                    }), d.attachListener(b.inInlineMode ? d : g, "mousemove",
                        function (c) {
                            f = !0;
                            if (!("wysiwyg" != a.mode || a.readOnly || i)) {
                                var d = {x: c.data.$.clientX, y: c.data.$.clientY};
                                i = setTimeout(function () {
                                    b.mouse = d;
                                    i = b.trigger = null;
                                    I(b);
                                    if (f && !b.hiddenMode && a.focusManager.hasFocus && !b.line.mouseNear() && (b.element = ca(b, !0))) (b.trigger = Y(b) || $(b) || da(b)) && !W(b, b.trigger.upper || b.trigger.lower) ? b.line.attach().place() : (b.trigger = null, b.line.detach()), f = !1
                                }, 30)
                            }
                        }), d.attachListener(j, "scroll", function () {
                        "wysiwyg" == a.mode && (b.line.detach(), n.webkit && (b.hiddenMode = 1, clearTimeout(e),
                            e = setTimeout(function () {
                                b.mouseDown || (b.hiddenMode = 0)
                            }, 50)))
                    }), d.attachListener(ea ? g : j, "mousedown", function () {
                        "wysiwyg" == a.mode && (b.line.detach(), b.hiddenMode = 1, b.mouseDown = 1)
                    }), d.attachListener(ea ? g : j, "mouseup", function () {
                        b.hiddenMode = 0;
                        b.mouseDown = 0
                    }), a.addCommand("accessPreviousSpace", U(b)), a.addCommand("accessNextSpace", U(b, !0)), a.setKeystroke([[c.magicline_keystrokePrevious, "accessPreviousSpace"], [c.magicline_keystrokeNext, "accessNextSpace"]]), a.on("loadSnapshot", function () {
                        var c, d, e, f;
                        for (f in{
                            p: 1,
                            br: 1, div: 1
                        }) {
                            c = a.document.getElementsByTag(f);
                            for (e = c.count(); e--;)if ((d = c.getItem(e)).data("cke-magicline-hot")) {
                                b.hotNode = d;
                                b.lastCmdDirection = "true" === d.data("cke-magicline-dir") ? !0 : !1;
                                return
                            }
                        }
                    }), this.backdoor = {
                        accessFocusSpace: N,
                        boxTrigger: u,
                        isLine: v,
                        getAscendantTrigger: J,
                        getNonEmptyNeighbour: r,
                        getSize: P,
                        that: b,
                        triggerEdge: $,
                        triggerEditable: Y,
                        triggerExpand: da
                    })
                }, this)
            }
        });
        var q = CKEDITOR.tools.extend, M = CKEDITOR.dom.element, B = M.createFromHtml, n = CKEDITOR.env,
            ea = CKEDITOR.env.ie && 9 > CKEDITOR.env.version,
            w = CKEDITOR.dtd, F = {}, D = 128, Z = 64, O = 32, H = 16, fa = 8, x = 4, y = 2, s = 1, E = " ",
            aa = w.$listItem, ka = w.$tableContent, ia = q({}, w.$nonEditable, w.$empty), V = w.$block, ba = 100,
            L = "width:0px;height:0px;padding:0px;margin:0px;display:block;z-index:9999;color:#fff;position:absolute;font-size: 0px;line-height:0px;",
            S = L + "border-color:transparent;display:block;border-style:solid;", R = "<span>" + E + "</span>";
        F[CKEDITOR.ENTER_BR] = "br";
        F[CKEDITOR.ENTER_P] = "p";
        F[CKEDITOR.ENTER_DIV] = "div";
        u.prototype = {
            set: function (a, c, d) {
                this.properties = a +
                    c + (d || s);
                return this
            }, is: function (a) {
                return (this.properties & a) == a
            }
        };
        var ca = function () {
                return function (a, c, d) {
                    if (!a.mouse)return null;
                    var b = a.doc, e = a.line.wrap, d = d || a.mouse,
                        f = new CKEDITOR.dom.element(b.$.elementFromPoint(d.x, d.y));
                    c && v(a, f) && (e.hide(), f = new CKEDITOR.dom.element(b.$.elementFromPoint(d.x, d.y)), e.show());
                    return !f || !(f.type == CKEDITOR.NODE_ELEMENT && f.$) || n.ie && 9 > n.version && !a.boundary.equals(f) && !a.boundary.contains(f) ? null : f
                }
            }(), z = CKEDITOR.dom.walker.whitespaces(), A = CKEDITOR.dom.walker.nodeType(CKEDITOR.NODE_COMMENT),
            da = function () {
                function a(a) {
                    var b = a.element, e, f, i;
                    if (!m(b) || b.contains(a.editable) || b.isReadOnly())return null;
                    i = la(a, function (a, b) {
                        return !b.equals(a)
                    }, function (a, b) {
                        return ca(a, !0, b)
                    }, b);
                    e = i.upper;
                    f = i.lower;
                    if (Q(a, e, f))return i.set(O, fa);
                    if (e && b.contains(e))for (; !e.getParent().equals(b);)e = e.getParent(); else e = b.getFirst(function (b) {
                        return c(a, b)
                    });
                    if (f && b.contains(f))for (; !f.getParent().equals(b);)f = f.getParent(); else f = b.getLast(function (b) {
                        return c(a, b)
                    });
                    if (!e || !f)return null;
                    o(a, e);
                    o(a, f);
                    if (!(a.mouse.y >
                        e.size.top && a.mouse.y < f.size.bottom))return null;
                    for (var b = Number.MAX_VALUE, h, g, j,
                             l; f && !f.equals(e) && (g = e.getNext(a.isRelevant));)h = Math.abs(ga(a, e, g) - a.mouse.y), h < b && (b = h, j = e, l = g), e = g, o(a, e);
                    if (!j || !l || !(a.mouse.y > j.size.top && a.mouse.y < l.size.bottom))return null;
                    i.upper = j;
                    i.lower = l;
                    return i.set(O, fa)
                }

                function c(a, b) {
                    return !(b && b.type == CKEDITOR.NODE_TEXT || A(b) || p(b) || v(a, b) || b.type == CKEDITOR.NODE_ELEMENT && b.$ && b.is("br"))
                }

                return function (c) {
                    var b = a(c), e;
                    if (e = b) {
                        e = b.upper;
                        var f = b.lower;
                        e = !e || !f || p(f) ||
                        p(e) || f.equals(e) || e.equals(f) || f.contains(e) || e.contains(f) ? !1 : G(c, e) && G(c, f) && Q(c, e, f) ? !0 : !1
                    }
                    return e ? b : null
                }
            }(), t = ["top", "left", "right", "bottom"]
    })();
    CKEDITOR.config.magicline_keystrokePrevious = CKEDITOR.CTRL + CKEDITOR.SHIFT + 51;
    CKEDITOR.config.magicline_keystrokeNext = CKEDITOR.CTRL + CKEDITOR.SHIFT + 52;
    (function () {
        function l(a) {
            if (!a || a.type != CKEDITOR.NODE_ELEMENT || "form" != a.getName())return [];
            for (var e = [], f = ["style", "className"], b = 0; b < f.length; b++) {
                var d = a.$.elements.namedItem(f[b]);
                d && (d = new CKEDITOR.dom.element(d), e.push([d, d.nextSibling]), d.remove())
            }
            return e
        }

        function o(a, e) {
            if (a && !(a.type != CKEDITOR.NODE_ELEMENT || "form" != a.getName()) && 0 < e.length)for (var f = e.length - 1; 0 <= f; f--) {
                var b = e[f][0], d = e[f][1];
                d ? b.insertBefore(d) : b.appendTo(a)
            }
        }

        function n(a, e) {
            var f = l(a), b = {}, d = a.$;
            e || (b["class"] = d.className ||
                "", d.className = "");
            b.inline = d.style.cssText || "";
            e || (d.style.cssText = "position: static; overflow: visible");
            o(f);
            return b
        }

        function p(a, e) {
            var f = l(a), b = a.$;
            "class" in e && (b.className = e["class"]);
            "inline" in e && (b.style.cssText = e.inline);
            o(f)
        }

        function q(a) {
            if (!a.editable().isInline()) {
                var e = CKEDITOR.instances, f;
                for (f in e) {
                    var b = e[f];
                    "wysiwyg" == b.mode && !b.readOnly && (b = b.document.getBody(), b.setAttribute("contentEditable", !1), b.setAttribute("contentEditable", !0))
                }
                a.editable().hasFocus && (a.toolbox.focus(),
                    a.focus())
            }
        }

        CKEDITOR.plugins.add("maximize", {
            init: function (a) {
                function e() {
                    var b = d.getViewPaneSize();
                    a.resize(b.width, b.height, null, !0)
                }

                if (a.elementMode != CKEDITOR.ELEMENT_MODE_INLINE) {
                    var f = a.lang, b = CKEDITOR.document, d = b.getWindow(), j, k, m, l = CKEDITOR.TRISTATE_OFF;
                    a.addCommand("maximize", {
                        modes: {wysiwyg: !CKEDITOR.env.iOS, source: !CKEDITOR.env.iOS},
                        readOnly: 1,
                        editorFocus: !1,
                        exec: function () {
                            var h = a.container.getChild(1), g = a.ui.space("contents");
                            if ("wysiwyg" == a.mode) {
                                var c = a.getSelection();
                                j = c && c.getRanges();
                                k = d.getScrollPosition()
                            } else {
                                var i = a.editable().$;
                                j = !CKEDITOR.env.ie && [i.selectionStart, i.selectionEnd];
                                k = [i.scrollLeft, i.scrollTop]
                            }
                            if (this.state == CKEDITOR.TRISTATE_OFF) {
                                d.on("resize", e);
                                m = d.getScrollPosition();
                                for (c = a.container; c = c.getParent();)c.setCustomData("maximize_saved_styles", n(c)), c.setStyle("z-index", a.config.baseFloatZIndex - 5);
                                g.setCustomData("maximize_saved_styles", n(g, !0));
                                h.setCustomData("maximize_saved_styles", n(h, !0));
                                g = {overflow: CKEDITOR.env.webkit ? "" : "hidden", width: 0, height: 0};
                                b.getDocumentElement().setStyles(g);
                                !CKEDITOR.env.gecko && b.getDocumentElement().setStyle("position", "fixed");
                                (!CKEDITOR.env.gecko || !CKEDITOR.env.quirks) && b.getBody().setStyles(g);
                                CKEDITOR.env.ie ? setTimeout(function () {
                                    d.$.scrollTo(0, 0)
                                }, 0) : d.$.scrollTo(0, 0);
                                h.setStyle("position", CKEDITOR.env.gecko && CKEDITOR.env.quirks ? "fixed" : "absolute");
                                h.$.offsetLeft;
                                h.setStyles({"z-index": a.config.baseFloatZIndex - 5, left: "0px", top: "0px"});
                                h.addClass("cke_maximized");
                                e();
                                g = h.getDocumentPosition();
                                h.setStyles({
                                    left: -1 *
                                    g.x + "px", top: -1 * g.y + "px"
                                });
                                CKEDITOR.env.gecko && q(a)
                            } else if (this.state == CKEDITOR.TRISTATE_ON) {
                                d.removeListener("resize", e);
                                g = [g, h];
                                for (c = 0; c < g.length; c++)p(g[c], g[c].getCustomData("maximize_saved_styles")), g[c].removeCustomData("maximize_saved_styles");
                                for (c = a.container; c = c.getParent();)p(c, c.getCustomData("maximize_saved_styles")), c.removeCustomData("maximize_saved_styles");
                                CKEDITOR.env.ie ? setTimeout(function () {
                                    d.$.scrollTo(m.x, m.y)
                                }, 0) : d.$.scrollTo(m.x, m.y);
                                h.removeClass("cke_maximized");
                                CKEDITOR.env.webkit &&
                                (h.setStyle("display", "inline"), setTimeout(function () {
                                    h.setStyle("display", "block")
                                }, 0));
                                a.fire("resize")
                            }
                            this.toggleState();
                            if (c = this.uiItems[0]) g = this.state == CKEDITOR.TRISTATE_OFF ? f.maximize.maximize : f.maximize.minimize, c = CKEDITOR.document.getById(c._.id), c.getChild(1).setHtml(g), c.setAttribute("title", g), c.setAttribute("href", 'javascript:void("' + g + '");');
                            "wysiwyg" == a.mode ? j ? (CKEDITOR.env.gecko && q(a), a.getSelection().selectRanges(j), (i = a.getSelection().getStartElement()) && i.scrollIntoView(!0)) :
                                d.$.scrollTo(k.x, k.y) : (j && (i.selectionStart = j[0], i.selectionEnd = j[1]), i.scrollLeft = k[0], i.scrollTop = k[1]);
                            j = k = null;
                            l = this.state;
                            a.fire("maximize", this.state)
                        },
                        canUndo: !1
                    });
                    a.ui.addButton && a.ui.addButton("Maximize", {
                        label: f.maximize.maximize,
                        command: "maximize",
                        toolbar: "tools,10"
                    });
                    a.on("mode", function () {
                        var b = a.getCommand("maximize");
                        b.setState(b.state == CKEDITOR.TRISTATE_DISABLED ? CKEDITOR.TRISTATE_DISABLED : l)
                    }, null, null, 100)
                }
            }
        })
    })();
    (function () {
        var c = {
            canUndo: !1, async: !0, exec: function (a) {
                a.getClipboardData({title: a.lang.pastetext.title}, function (b) {
                    b && a.fire("paste", {type: "text", dataValue: b.dataValue});
                    a.fire("afterCommandExec", {name: "pastetext", command: c, returnValue: !!b})
                })
            }
        };
        CKEDITOR.plugins.add("pastetext", {
            requires: "clipboard", init: function (a) {
                a.addCommand("pastetext", c);
                a.ui.addButton && a.ui.addButton("PasteText", {
                    label: a.lang.pastetext.button,
                    command: "pastetext",
                    toolbar: "clipboard,40"
                });
                if (a.config.forcePasteAsPlainText) a.on("beforePaste",
                    function (a) {
                        "html" != a.data.type && (a.data.type = "text")
                    });
                a.on("pasteState", function (b) {
                    a.getCommand("pastetext").setState(b.data)
                })
            }
        })
    })();
    (function () {
        function h(a, d, f) {
            var b = CKEDITOR.cleanWord;
            b ? f() : (a = CKEDITOR.getUrl(a.config.pasteFromWordCleanupFile || d + "filter/default.js"), CKEDITOR.scriptLoader.load(a, f, null, !0));
            return !b
        }

        function i(a) {
            a.data.type = "html"
        }

        CKEDITOR.plugins.add("pastefromword", {
            requires: "clipboard", init: function (a) {
                var d = 0, f = this.path;
                a.addCommand("pastefromword", {
                    canUndo: !1, async: !0, exec: function (a) {
                        var e = this;
                        d = 1;
                        a.once("beforePaste", i);
                        a.getClipboardData({title: a.lang.pastefromword.title}, function (c) {
                            c && a.fire("paste",
                                {type: "html", dataValue: c.dataValue});
                            a.fire("afterCommandExec", {name: "pastefromword", command: e, returnValue: !!c})
                        })
                    }
                });
                a.ui.addButton && a.ui.addButton("PasteFromWord", {
                    label: a.lang.pastefromword.toolbar,
                    command: "pastefromword",
                    toolbar: "clipboard,50"
                });
                a.on("pasteState", function (b) {
                    a.getCommand("pastefromword").setState(b.data)
                });
                a.on("paste", function (b) {
                    var e = b.data, c = e.dataValue;
                    if (c && (d || /(class=\"?Mso|style=\"[^\"]*\bmso\-|w:WordDocument)/.test(c))) {
                        var g = h(a, f, function () {
                            if (g) a.fire("paste", e);
                            else if (!a.config.pasteFromWordPromptCleanup || d || confirm(a.lang.pastefromword.confirmCleanup)) e.dataValue = CKEDITOR.cleanWord(c, a)
                        });
                        g && b.cancel()
                    }
                }, null, null, 3)
            }
        })
    })();
    CKEDITOR.plugins.add("removeformat", {
        init: function (a) {
            a.addCommand("removeFormat", CKEDITOR.plugins.removeformat.commands.removeformat);
            a.ui.addButton && a.ui.addButton("RemoveFormat", {
                label: a.lang.removeformat.toolbar,
                command: "removeFormat",
                toolbar: "cleanup,10"
            })
        }
    });
    CKEDITOR.plugins.removeformat = {
        commands: {
            removeformat: {
                exec: function (a) {
                    for (var h = a._.removeFormatRegex || (a._.removeFormatRegex = RegExp("^(?:" + a.config.removeFormatTags.replace(/,/g, "|") + ")$", "i")),
                             e = a._.removeAttributes || (a._.removeAttributes = a.config.removeFormatAttributes.split(",")),
                             f = CKEDITOR.plugins.removeformat.filter, k = a.getSelection().getRanges(1),
                             l = k.createIterator(), c; c = l.getNextRange();) {
                        c.collapsed || c.enlarge(CKEDITOR.ENLARGE_ELEMENT);
                        var i = c.createBookmark(), b = i.startNode, j = i.endNode,
                            d = function (b) {
                                for (var c = a.elementPath(b), e = c.elements, d = 1,
                                         g; (g = e[d]) && !g.equals(c.block) && !g.equals(c.blockLimit); d++)h.test(g.getName()) && f(a, g) && b.breakParent(g)
                            };
                        d(b);
                        if (j) {
                            d(j);
                            for (b = b.getNextSourceNode(!0, CKEDITOR.NODE_ELEMENT); b && !b.equals(j);)d = b.getNextSourceNode(!1, CKEDITOR.NODE_ELEMENT), !("img" == b.getName() && b.data("cke-realelement")) && f(a, b) && (h.test(b.getName()) ? b.remove(1) : (b.removeAttributes(e), a.fire("removeFormatCleanup", b))), b = d
                        }
                        c.moveToBookmark(i)
                    }
                    a.forceNextSelectionCheck();
                    a.getSelection().selectRanges(k)
                }
            }
        },
        filter: function (a, h) {
            for (var e = a._.removeFormatFilters || [], f = 0; f < e.length; f++)if (!1 === e[f](h))return !1;
            return !0
        }
    };
    CKEDITOR.editor.prototype.addRemoveFormatFilter = function (a) {
        this._.removeFormatFilters || (this._.removeFormatFilters = []);
        this._.removeFormatFilters.push(a)
    };
    CKEDITOR.config.removeFormatTags = "b,big,code,del,dfn,em,font,i,ins,kbd,q,s,samp,small,span,strike,strong,sub,sup,tt,u,var";
    CKEDITOR.config.removeFormatAttributes = "class,style,lang,width,height,align,hspace,valign";
    (function () {
        CKEDITOR.plugins.add("sourcearea", {
            init: function (a) {
                function d() {
                    this.hide();
                    this.setStyle("height", this.getParent().$.clientHeight + "px");
                    this.setStyle("width", this.getParent().$.clientWidth + "px");
                    this.show()
                }

                if (a.elementMode != CKEDITOR.ELEMENT_MODE_INLINE) {
                    var e = CKEDITOR.plugins.sourcearea;
                    a.addMode("source", function (e) {
                        var b = a.ui.space("contents").getDocument().createElement("textarea");
                        b.setStyles(CKEDITOR.tools.extend({
                            width: CKEDITOR.env.ie7Compat ? "99%" : "100%", height: "100%", resize: "none",
                            outline: "none", "text-align": "left"
                        }, CKEDITOR.tools.cssVendorPrefix("tab-size", a.config.sourceAreaTabSize || 4)));
                        b.setAttribute("dir", "ltr");
                        b.addClass("cke_source cke_reset cke_enable_context_menu");
                        a.ui.space("contents").append(b);
                        b = a.editable(new c(a, b));
                        b.setData(a.getData(1));
                        CKEDITOR.env.ie && (b.attachListener(a, "resize", d, b), b.attachListener(CKEDITOR.document.getWindow(), "resize", d, b), CKEDITOR.tools.setTimeout(d, 0, b));
                        a.fire("ariaWidget", this);
                        e()
                    });
                    a.addCommand("source", e.commands.source);
                    a.ui.addButton &&
                    a.ui.addButton("Source", {label: a.lang.sourcearea.toolbar, command: "source", toolbar: "mode,10"});
                    a.on("mode", function () {
                        a.getCommand("source").setState("source" == a.mode ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF)
                    })
                }
            }
        });
        var c = CKEDITOR.tools.createClass({
            base: CKEDITOR.editable, proto: {
                setData: function (a) {
                    this.setValue(a);
                    this.editor.fire("dataReady")
                }, getData: function () {
                    return this.getValue()
                }, insertHtml: function () {
                }, insertElement: function () {
                }, insertText: function () {
                }, setReadOnly: function (a) {
                    this[(a ? "set" :
                        "remove") + "Attribute"]("readOnly", "readonly")
                }, detach: function () {
                    c.baseProto.detach.call(this);
                    this.clearCustomData();
                    this.remove()
                }
            }
        })
    })();
    CKEDITOR.plugins.sourcearea = {
        commands: {
            source: {
                modes: {wysiwyg: 1, source: 1},
                editorFocus: !1,
                readOnly: 1,
                exec: function (c) {
                    "wysiwyg" == c.mode && c.fire("saveSnapshot");
                    c.getCommand("source").setState(CKEDITOR.TRISTATE_DISABLED);
                    c.setMode("source" == c.mode ? "wysiwyg" : "source")
                },
                canUndo: !1
            }
        }
    };
    CKEDITOR.plugins.add("specialchar", {
        availableLangs: {
            ar: 1,
            bg: 1,
            ca: 1,
            cs: 1,
            cy: 1,
            de: 1,
            el: 1,
            en: 1,
            eo: 1,
            es: 1,
            et: 1,
            fa: 1,
            fi: 1,
            fr: 1,
            "fr-ca": 1,
            gl: 1,
            he: 1,
            hr: 1,
            hu: 1,
            id: 1,
            it: 1,
            ja: 1,
            km: 1,
            ku: 1,
            lv: 1,
            nb: 1,
            nl: 1,
            no: 1,
            pl: 1,
            pt: 1,
            "pt-br": 1,
            ru: 1,
            si: 1,
            sk: 1,
            sl: 1,
            sq: 1,
            sv: 1,
            th: 1,
            tr: 1,
            ug: 1,
            uk: 1,
            vi: 1,
            zh: 1,
            "zh-cn": 1
        }, requires: "dialog", init: function (a) {
            var c = this;
            CKEDITOR.dialog.add("specialchar", this.path + "dialogs/specialchar.js");
            a.addCommand("specialchar", {
                exec: function () {
                    var b = a.langCode, b = c.availableLangs[b] ? b : c.availableLangs[b.replace(/-.*/,
                        "")] ? b.replace(/-.*/, "") : "en";
                    CKEDITOR.scriptLoader.load(CKEDITOR.getUrl(c.path + "dialogs/lang/" + b + ".js"), function () {
                        CKEDITOR.tools.extend(a.lang.specialchar, c.langEntries[b]);
                        a.openDialog("specialchar")
                    })
                }, modes: {wysiwyg: 1}, canUndo: !1
            });
            a.ui.addButton && a.ui.addButton("SpecialChar", {
                label: a.lang.specialchar.toolbar,
                command: "specialchar",
                toolbar: "insert,50"
            })
        }
    });
    CKEDITOR.config.specialChars = "! &quot; # $ % &amp; ' ( ) * + - . / 0 1 2 3 4 5 6 7 8 9 : ; &lt; = &gt; ? @ A B C D E F G H I J K L M N O P Q R S T U V W X Y Z [ ] ^ _ ` a b c d e f g h i j k l m n o p q r s t u v w x y z { | } ~ &euro; &lsquo; &rsquo; &ldquo; &rdquo; &ndash; &mdash; &iexcl; &cent; &pound; &curren; &yen; &brvbar; &sect; &uml; &copy; &ordf; &laquo; &not; &reg; &macr; &deg; &sup2; &sup3; &acute; &micro; &para; &middot; &cedil; &sup1; &ordm; &raquo; &frac14; &frac12; &frac34; &iquest; &Agrave; &Aacute; &Acirc; &Atilde; &Auml; &Aring; &AElig; &Ccedil; &Egrave; &Eacute; &Ecirc; &Euml; &Igrave; &Iacute; &Icirc; &Iuml; &ETH; &Ntilde; &Ograve; &Oacute; &Ocirc; &Otilde; &Ouml; &times; &Oslash; &Ugrave; &Uacute; &Ucirc; &Uuml; &Yacute; &THORN; &szlig; &agrave; &aacute; &acirc; &atilde; &auml; &aring; &aelig; &ccedil; &egrave; &eacute; &ecirc; &euml; &igrave; &iacute; &icirc; &iuml; &eth; &ntilde; &ograve; &oacute; &ocirc; &otilde; &ouml; &divide; &oslash; &ugrave; &uacute; &ucirc; &uuml; &yacute; &thorn; &yuml; &OElig; &oelig; &#372; &#374 &#373 &#375; &sbquo; &#8219; &bdquo; &hellip; &trade; &#9658; &bull; &rarr; &rArr; &hArr; &diams; &asymp;".split(" ");
    CKEDITOR.plugins.add("menubutton", {
        requires: "button,menu", onLoad: function () {
            var d = function (c) {
                var a = this._, b = a.menu;
                a.state !== CKEDITOR.TRISTATE_DISABLED && (a.on && b ? b.hide() : (a.previousState = a.state, b || (b = a.menu = new CKEDITOR.menu(c, {
                    panel: {
                        className: "cke_menu_panel",
                        attributes: {"aria-label": c.lang.common.options}
                    }
                }), b.onHide = CKEDITOR.tools.bind(function () {
                    var b = this.command ? c.getCommand(this.command).modes : this.modes;
                    this.setState(!b || b[c.mode] ? a.previousState : CKEDITOR.TRISTATE_DISABLED);
                    a.on = 0
                }, this),
                this.onMenu && b.addListener(this.onMenu)), this.setState(CKEDITOR.TRISTATE_ON), a.on = 1, setTimeout(function () {
                    b.show(CKEDITOR.document.getById(a.id), 4)
                }, 0)))
            };
            CKEDITOR.ui.menuButton = CKEDITOR.tools.createClass({
                base: CKEDITOR.ui.button, $: function (c) {
                    delete c.panel;
                    this.base(c);
                    this.hasArrow = !0;
                    this.click = d
                }, statics: {
                    handler: {
                        create: function (c) {
                            return new CKEDITOR.ui.menuButton(c)
                        }
                    }
                }
            })
        }, beforeInit: function (d) {
            d.ui.addHandler(CKEDITOR.UI_MENUBUTTON, CKEDITOR.ui.menuButton.handler)
        }
    });
    CKEDITOR.UI_MENUBUTTON = "menubutton";
    (function () {
        function o(a, c) {
            var b = 0, d;
            for (d in c)if (c[d] == a) {
                b = 1;
                break
            }
            return b
        }

        var j = "", r = function () {
            function a() {
                b.once("focus", g);
                b.once("blur", c)
            }

            function c(b) {
                var b = b.editor, c = d.getScayt(b), g = b.elementMode == CKEDITOR.ELEMENT_MODE_INLINE;
                c && (d.setPaused(b, !c.disabled), d.setControlId(b, c.id), c.destroy(!0), delete d.instances[b.name], g && a())
            }

            var b = this, g = function () {
                if (!("undefined" != typeof d.instances[b.name] || null != d.instances[b.name])) {
                    var a = b.config, c = {};
                    c.srcNodeRef = "BODY" == b.editable().$.nodeName ?
                        b.document.getWindow().$.frameElement : b.editable().$;
                    c.assocApp = "CKEDITOR." + CKEDITOR.version + "@" + CKEDITOR.revision;
                    c.customerid = a.scayt_customerid || "1:WvF0D4-UtPqN1-43nkD4-NKvUm2-daQqk3-LmNiI-z7Ysb4-mwry24-T8YrS3-Q2tpq2";
                    c.customDictionaryIds = a.scayt_customDictionaryIds || "";
                    c.userDictionaryName = a.scayt_userDictionaryName || "";
                    c.sLang = a.scayt_sLang || "en_US";
                    c.onLoad = function () {
                        CKEDITOR.env.ie && 8 > CKEDITOR.env.version || this.addStyle(this.selectorCss(), "padding-bottom: 2px !important;");
                        b.editable().hasFocus &&
                        !d.isControlRestored(b) && this.focus()
                    };
                    a = window.scayt_custom_params;
                    if ("object" == typeof a)for (var g in a)c[g] = a[g];
                    d.getControlId(b) && (c.id = d.getControlId(b));
                    var e = new window.scayt(c);
                    e.afterMarkupRemove.push(function (a) {
                        (new CKEDITOR.dom.element(a, e.document)).mergeSiblings()
                    });
                    if (c = d.instances[b.name]) e.sLang = c.sLang, e.option(c.option()), e.paused = c.paused;
                    d.instances[b.name] = e;
                    try {
                        e.setDisabled(!1 === d.isPaused(b))
                    } catch (n) {
                    }
                    b.fire("showScaytState")
                }
            };
            b.elementMode == CKEDITOR.ELEMENT_MODE_INLINE ?
                a() : b.on("contentDom", g);
            b.on("contentDomUnload", function () {
                for (var a = CKEDITOR.document.getElementsByTag("script"), b = /^dojoIoScript(\d+)$/i,
                         c = /^https?:\/\/svc\.webspellchecker\.net\/spellcheck\/script\/ssrv\.cgi/i,
                         d = 0; d < a.count(); d++) {
                    var g = a.getItem(d), e = g.getId(), f = g.getAttribute("src");
                    e && (f && e.match(b) && f.match(c)) && g.remove()
                }
            });
            b.on("beforeCommandExec", function (a) {
                "source" == a.data.name && "source" == b.mode && d.markControlRestore(b)
            });
            b.on("afterCommandExec", function (a) {
                if (d.isScaytEnabled(b) && "wysiwyg" ==
                    b.mode && ("undo" == a.data.name || "redo" == a.data.name)) d.getScayt(b).setDisabled(!0), d.refresh_timeout && window.clearTimeout(d.refresh_timeout), d.refresh_timeout = window.setTimeout(function () {
                    d.getScayt(b).setDisabled(!1);
                    d.getScayt(b).focus();
                    d.getScayt(b).refresh()
                }, 10)
            });
            b.on("destroy", c);
            b.on("setData", c);
            b.on("insertElement", function () {
                var a = d.getScayt(b);
                d.isScaytEnabled(b) && (CKEDITOR.env.ie && b.getSelection().unlock(!0), window.setTimeout(function () {
                    a.focus();
                    a.refresh()
                }, 10))
            }, this, null, 50);
            b.on("insertHtml",
                function () {
                    var a = d.getScayt(b);
                    d.isScaytEnabled(b) && (CKEDITOR.env.ie && b.getSelection().unlock(!0), window.setTimeout(function () {
                        a.focus();
                        a.refresh()
                    }, 10))
                }, this, null, 50);
            b.on("scaytDialog", function (a) {
                a.data.djConfig = window.djConfig;
                a.data.scayt_control = d.getScayt(b);
                a.data.tab = j;
                a.data.scayt = window.scayt
            });
            var e = b.dataProcessor;
            (e = e && e.htmlFilter) && e.addRules({
                elements: {
                    span: function (a) {
                        if (a.attributes["data-scayt_word"] && a.attributes["data-scaytid"])return delete a.name, a
                    }
                }
            });
            var e = CKEDITOR.plugins.undo.Image.prototype,
                f = "function" == typeof e.equalsContent ? "equalsContent" : "equals";
            e[f] = CKEDITOR.tools.override(e[f], function (a) {
                return function (b) {
                    var c = this.contents, g = b.contents, e = d.getScayt(this.editor);
                    e && d.isScaytReady(this.editor) && (this.contents = e.reset(c) || "", b.contents = e.reset(g) || "");
                    e = a.apply(this, arguments);
                    this.contents = c;
                    b.contents = g;
                    return e
                }
            });
            e = CKEDITOR.editor.prototype;
            e.checkDirty = CKEDITOR.tools.override(e.checkDirty, function (a) {
                return function () {
                    var b = null, c = d.getScayt(this);
                    c && d.isScaytReady(this) ?
                        (b = c.reset(this.getSnapshot()), c = c.reset(this._.previousValue), b = b !== c) : b = a.apply(this);
                    return b
                }
            });
            b.document && (b.elementMode != CKEDITOR.ELEMENT_MODE_INLINE || b.focusManager.hasFocus) && g()
        };
        CKEDITOR.plugins.scayt = {
            engineLoaded: !1, instances: {}, controlInfo: {}, setControlInfo: function (a, c) {
                a && (a.name && "object" != typeof this.controlInfo[a.name]) && (this.controlInfo[a.name] = {});
                for (var b in c)this.controlInfo[a.name][b] = c[b]
            }, isControlRestored: function (a) {
                return a && a.name && this.controlInfo[a.name] ? this.controlInfo[a.name].restored :
                    !1
            }, markControlRestore: function (a) {
                this.setControlInfo(a, {restored: !0})
            }, setControlId: function (a, c) {
                this.setControlInfo(a, {id: c})
            }, getControlId: function (a) {
                return a && a.name && this.controlInfo[a.name] && this.controlInfo[a.name].id ? this.controlInfo[a.name].id : null
            }, setPaused: function (a, c) {
                this.setControlInfo(a, {paused: c})
            }, isPaused: function (a) {
                if (a && a.name && this.controlInfo[a.name])return this.controlInfo[a.name].paused
            }, getScayt: function (a) {
                return this.instances[a.name]
            }, isScaytReady: function (a) {
                return !0 ===
                    this.engineLoaded && "undefined" !== typeof window.scayt && this.getScayt(a)
            }, isScaytEnabled: function (a) {
                return (a = this.getScayt(a)) ? !1 === a.disabled : !1
            }, getUiTabs: function (a) {
                var c = [], b = a.config.scayt_uiTabs || "1,1,1", b = b.split(",");
                b[3] = "1";
                for (var d = 0; 4 > d; d++)c[d] = "undefined" != typeof window.scayt && "undefined" != typeof window.scayt.uiTags ? parseInt(b[d], 10) && window.scayt.uiTags[d] : parseInt(b[d], 10);
                "object" == typeof a.plugins.wsc ? c.push(1) : c.push(0);
                return c
            }, loadEngine: function (a) {
                if (CKEDITOR.env.gecko && 10900 >
                    CKEDITOR.env.version || CKEDITOR.env.opera || CKEDITOR.env.air)return a.fire("showScaytState");
                if (!0 === this.engineLoaded)return r.apply(a);
                if (-1 == this.engineLoaded)return CKEDITOR.on("scaytReady", function () {
                    r.apply(a)
                });
                CKEDITOR.on("scaytReady", r, a);
                CKEDITOR.on("scaytReady", function () {
                    this.engineLoaded = !0
                }, this, null, 0);
                this.engineLoaded = -1;
                var c = document.location.protocol, c = -1 != c.search(/https?:/) ? c : "http:",
                    c = a.config.scayt_srcUrl || c + "//svc.webspellchecker.net/scayt26/loader__base.js",
                    b = d.parseUrl(c).path +
                        "/";
                void 0 == window.scayt ? (CKEDITOR._djScaytConfig = {
                    baseUrl: b, addOnLoad: [function () {
                        CKEDITOR.fireOnce("scaytReady")
                    }], isDebug: !1
                }, CKEDITOR.document.getHead().append(CKEDITOR.document.createElement("script", {
                    attributes: {
                        type: "text/javascript",
                        async: "true",
                        src: c
                    }
                }))) : CKEDITOR.fireOnce("scaytReady");
                return null
            }, parseUrl: function (a) {
                var c;
                return a.match && (c = a.match(/(.*)[\/\\](.*?\.\w+)$/)) ? {path: c[1], file: c[2]} : a
            }
        };
        var d = CKEDITOR.plugins.scayt, p = function (a, c, b, d, e, f, h) {
            a.addCommand(d, e);
            a.addMenuItem(d,
                {label: b, command: d, group: f, order: h})
        }, u = {
            preserveState: !0, editorFocus: !1, canUndo: !1, exec: function (a) {
                if (d.isScaytReady(a)) {
                    var c = d.isScaytEnabled(a);
                    this.setState(c ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_ON);
                    a = d.getScayt(a);
                    a.focus();
                    a.setDisabled(c)
                } else!a.config.scayt_autoStartup && 0 <= d.engineLoaded && (a.focus(), this.setState(CKEDITOR.TRISTATE_DISABLED), d.loadEngine(a))
            }
        };
        CKEDITOR.plugins.add("scayt", {
            requires: "menubutton,dialog", beforeInit: function (a) {
                var c = a.config.scayt_contextMenuItemsOrder ||
                    "suggest|moresuggest|control", b = "";
                if ((c = c.split("|")) && c.length)for (var d = 0; d < c.length; d++)b += "scayt_" + c[d] + (c.length != parseInt(d, 10) + 1 ? "," : "");
                a.config.menu_groups = b + "," + a.config.menu_groups
            }, checkEnvironment: function () {
                return CKEDITOR.env.opera || CKEDITOR.env.air ? 0 : 1
            }, init: function (a) {
                var c = a.dataProcessor && a.dataProcessor.dataFilter, b = {
                    elements: {
                        span: function (a) {
                            var b = a.attributes;
                            b && b["data-scaytid"] && delete a.name
                        }
                    }
                };
                c && c.addRules(b);
                var g = {}, e = {}, f = a.addCommand("scaytcheck", u);
                CKEDITOR.dialog.add("scaytcheck",
                    CKEDITOR.getUrl(this.path + "dialogs/options.js"));
                c = d.getUiTabs(a);
                a.addMenuGroup("scaytButton");
                a.addMenuGroup("scayt_suggest", -10);
                a.addMenuGroup("scayt_moresuggest", -9);
                a.addMenuGroup("scayt_control", -8);
                var b = {}, h = a.lang.scayt;
                b.scaytToggle = {label: h.enable, command: "scaytcheck", group: "scaytButton"};
                1 == c[0] && (b.scaytOptions = {
                    label: h.options, group: "scaytButton", onClick: function () {
                        j = "options";
                        a.openDialog("scaytcheck")
                    }
                });
                1 == c[1] && (b.scaytLangs = {
                    label: h.langs, group: "scaytButton", onClick: function () {
                        j =
                            "langs";
                        a.openDialog("scaytcheck")
                    }
                });
                1 == c[2] && (b.scaytDict = {
                    label: h.dictionariesTab, group: "scaytButton", onClick: function () {
                        j = "dictionaries";
                        a.openDialog("scaytcheck")
                    }
                });
                b.scaytAbout = {
                    label: a.lang.scayt.about, group: "scaytButton", onClick: function () {
                        j = "about";
                        a.openDialog("scaytcheck")
                    }
                };
                1 == c[4] && (b.scaytWSC = {label: a.lang.wsc.toolbar, group: "scaytButton", command: "checkspell"});
                a.addMenuItems(b);
                a.ui.add("Scayt", CKEDITOR.UI_MENUBUTTON, {
                    label: h.title,
                    title: CKEDITOR.env.opera ? h.opera_title : h.title,
                    modes: {wysiwyg: this.checkEnvironment()},
                    toolbar: "spellchecker,20",
                    onRender: function () {
                        f.on("state", function () {
                            this.setState(f.state)
                        }, this)
                    },
                    onMenu: function () {
                        var b = d.isScaytEnabled(a);
                        a.getMenuItem("scaytToggle").label = h[b ? "disable" : "enable"];
                        var c = d.getUiTabs(a);
                        return {
                            scaytToggle: CKEDITOR.TRISTATE_OFF,
                            scaytOptions: b && c[0] ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED,
                            scaytLangs: b && c[1] ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED,
                            scaytDict: b && c[2] ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED,
                            scaytAbout: b && c[3] ? CKEDITOR.TRISTATE_OFF :
                                CKEDITOR.TRISTATE_DISABLED,
                            scaytWSC: c[4] ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED
                        }
                    }
                });
                a.contextMenu && a.addMenuItems && a.contextMenu.addListener(function (b, c) {
                    if (!d.isScaytEnabled(a) || c.getRanges()[0].checkReadOnly())return null;
                    var f = d.getScayt(a), n = f.getScaytNode();
                    if (!n)return null;
                    var i = f.getWord(n);
                    if (!i)return null;
                    var j = f.getLang(), l = a.config.scayt_contextCommands || "all",
                        i = window.scayt.getSuggestion(i, j), l = l.split("|"), m;
                    for (m in g) {
                        delete a._.menuItems[m];
                        delete a.commands[m]
                    }
                    for (m in e) {
                        delete a._.menuItems[m];
                        delete a.commands[m]
                    }
                    if (!i || !i.length) {
                        p(a, "no_sugg", h.noSuggestions, "scayt_no_sugg", {
                            exec: function () {
                            }
                        }, "scayt_control", 1, true);
                        e.scayt_no_sugg = CKEDITOR.TRISTATE_OFF
                    } else {
                        g = {};
                        e = {};
                        m = a.config.scayt_moreSuggestions || "on";
                        var j = false, s = a.config.scayt_maxSuggestions;
                        typeof s != "number" && (s = 5);
                        !s && (s = i.length);
                        for (var k = 0, r = i.length; k < r; k = k + 1) {
                            var q = "scayt_suggestion_" + i[k].replace(" ", "_"), t = function (a, b) {
                                return {
                                    exec: function () {
                                        f.replace(a, b)
                                    }
                                }
                            }(n, i[k]);
                            if (k < s) {
                                p(a, "button_" + q, i[k], q, t, "scayt_suggest",
                                    k + 1);
                                e[q] = CKEDITOR.TRISTATE_OFF
                            } else if (m == "on") {
                                p(a, "button_" + q, i[k], q, t, "scayt_moresuggest", k + 1);
                                g[q] = CKEDITOR.TRISTATE_OFF;
                                j = true
                            }
                        }
                        if (j) {
                            a.addMenuItem("scayt_moresuggest", {
                                label: h.moreSuggestions,
                                group: "scayt_moresuggest",
                                order: 10,
                                getItems: function () {
                                    return g
                                }
                            });
                            e.scayt_moresuggest = CKEDITOR.TRISTATE_OFF
                        }
                    }
                    if (o("all", l) || o("ignore", l)) {
                        p(a, "ignore", h.ignore, "scayt_ignore", {
                            exec: function () {
                                f.ignore(n)
                            }
                        }, "scayt_control", 2);
                        e.scayt_ignore = CKEDITOR.TRISTATE_OFF
                    }
                    if (o("all", l) || o("ignoreall", l)) {
                        p(a, "ignore_all",
                            h.ignoreAll, "scayt_ignore_all", {
                                exec: function () {
                                    f.ignoreAll(n)
                                }
                            }, "scayt_control", 3);
                        e.scayt_ignore_all = CKEDITOR.TRISTATE_OFF
                    }
                    if (o("all", l) || o("add", l)) {
                        p(a, "add_word", h.addWord, "scayt_add_word", {
                            exec: function () {
                                window.scayt.addWordToUserDictionary(n)
                            }
                        }, "scayt_control", 4);
                        e.scayt_add_word = CKEDITOR.TRISTATE_OFF
                    }
                    f.fireOnContextMenu && f.fireOnContextMenu(a);
                    return e
                });
                c = function (b) {
                    b.removeListener();
                    CKEDITOR.env.opera || CKEDITOR.env.air ? f.setState(CKEDITOR.TRISTATE_DISABLED) : f.setState(d.isScaytEnabled(a) ?
                        CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF)
                };
                a.on("showScaytState", c);
                a.on("instanceReady", c);
                if (a.config.scayt_autoStartup) a.on("instanceReady", function () {
                    d.loadEngine(a)
                })
            }, afterInit: function (a) {
                var c, b = function (a) {
                    if (a.hasAttribute("data-scaytid"))return !1
                };
                a._.elementsPath && (c = a._.elementsPath.filters) && c.push(b);
                a.addRemoveFormatFilter && a.addRemoveFormatFilter(b)
            }
        })
    })();
    (function () {
        CKEDITOR.plugins.add("stylescombo", {
            requires: "richcombo", init: function (c) {
                var j = c.config, f = c.lang.stylescombo, e = {}, i = [], k = [];
                c.on("stylesSet", function (b) {
                    if (b = b.data.styles) {
                        for (var a, h, d = 0,
                                 g = b.length; d < g; d++)if (a = b[d], !(c.blockless && a.element in CKEDITOR.dtd.$block) && (h = a.name, a = new CKEDITOR.style(a), !c.filter.customConfig || c.filter.check(a))) a._name = h, a._.enterMode = j.enterMode, a._.weight = d + 1E3 * (a.type == CKEDITOR.STYLE_OBJECT ? 1 : a.type == CKEDITOR.STYLE_BLOCK ? 2 : 3), e[h] = a, i.push(a), k.push(a);
                        i.sort(function (a, b) {
                            return a._.weight - b._.weight
                        })
                    }
                });
                c.ui.addRichCombo("Styles", {
                    label: f.label,
                    title: f.panelTitle,
                    toolbar: "styles,10",
                    allowedContent: k,
                    panel: {
                        css: [CKEDITOR.skin.getPath("editor")].concat(j.contentsCss),
                        multiSelect: !0,
                        attributes: {"aria-label": f.panelTitle}
                    },
                    init: function () {
                        var b, a, c, d, g, e;
                        g = 0;
                        for (e = i.length; g < e; g++)b = i[g], a = b._name, d = b.type, d != c && (this.startGroup(f["panelTitle" + d]), c = d), this.add(a, b.type == CKEDITOR.STYLE_OBJECT ? a : b.buildPreview(), a);
                        this.commit()
                    },
                    onClick: function (b) {
                        c.focus();
                        c.fire("saveSnapshot");
                        var b = e[b], a = c.elementPath();
                        c[b.checkActive(a) ? "removeStyle" : "applyStyle"](b);
                        c.fire("saveSnapshot")
                    },
                    onRender: function () {
                        c.on("selectionChange", function (b) {
                            for (var a = this.getValue(), b = b.data.path.elements, c = 0, d = b.length,
                                     g; c < d; c++) {
                                g = b[c];
                                for (var f in e)if (e[f].checkElementRemovable(g, !0)) {
                                    f != a && this.setValue(f);
                                    return
                                }
                            }
                            this.setValue("")
                        }, this)
                    },
                    onOpen: function () {
                        var b = c.getSelection().getSelectedElement(), b = c.elementPath(b), a = [0, 0, 0, 0];
                        this.showAll();
                        this.unmarkAll();
                        for (var h in e) {
                            var d =
                                e[h], g = d.type;
                            d.checkApplicable(b, c.activeFilter) ? a[g]++ : this.hideItem(h);
                            d.checkActive(b) && this.mark(h)
                        }
                        a[CKEDITOR.STYLE_BLOCK] || this.hideGroup(f["panelTitle" + CKEDITOR.STYLE_BLOCK]);
                        a[CKEDITOR.STYLE_INLINE] || this.hideGroup(f["panelTitle" + CKEDITOR.STYLE_INLINE]);
                        a[CKEDITOR.STYLE_OBJECT] || this.hideGroup(f["panelTitle" + CKEDITOR.STYLE_OBJECT])
                    },
                    refresh: function () {
                        var b = c.elementPath();
                        if (b) {
                            for (var a in e)if (e[a].checkApplicable(b, c.activeFilter))return;
                            this.setState(CKEDITOR.TRISTATE_DISABLED)
                        }
                    },
                    reset: function () {
                        e =
                            {};
                        i = []
                    }
                })
            }
        })
    })();
    (function () {
        function i(c) {
            return {
                editorFocus: !1, canUndo: !1, modes: {wysiwyg: 1}, exec: function (d) {
                    if (d.editable().hasFocus) {
                        var e = d.getSelection(), b;
                        if (b = (new CKEDITOR.dom.elementPath(e.getCommonAncestor(), e.root)).contains({
                                td: 1,
                                th: 1
                            }, 1)) {
                            var e = d.createRange(), a = CKEDITOR.tools.tryThese(function () {
                                var a = b.getParent().$.cells[b.$.cellIndex + (c ? -1 : 1)];
                                a.parentNode.parentNode;
                                return a
                            }, function () {
                                var a = b.getParent(), a = a.getAscendant("table").$.rows[a.$.rowIndex + (c ? -1 : 1)];
                                return a.cells[c ? a.cells.length - 1 :
                                    0]
                            });
                            if (!a && !c) {
                                for (var f = b.getAscendant("table").$, a = b.getParent().$.cells,
                                         f = new CKEDITOR.dom.element(f.insertRow(-1), d.document), g = 0,
                                         h = a.length; g < h; g++)f.append((new CKEDITOR.dom.element(a[g], d.document)).clone(!1, !1)).appendBogus();
                                e.moveToElementEditStart(f)
                            } else if (a) a = new CKEDITOR.dom.element(a), e.moveToElementEditStart(a), (!e.checkStartOfBlock() || !e.checkEndOfBlock()) && e.selectNodeContents(a); else return !0;
                            e.select(!0);
                            return !0
                        }
                    }
                    return !1
                }
            }
        }

        var h = {editorFocus: !1, modes: {wysiwyg: 1, source: 1}},
            g = {
                exec: function (c) {
                    c.container.focusNext(!0, c.tabIndex)
                }
            }, f = {
                exec: function (c) {
                    c.container.focusPrevious(!0, c.tabIndex)
                }
            };
        CKEDITOR.plugins.add("tab", {
            init: function (c) {
                for (var d = !1 !== c.config.enableTabKeyTools, e = c.config.tabSpaces || 0, b = ""; e--;)b += " ";
                if (b) c.on("key", function (a) {
                    9 == a.data.keyCode && (c.insertHtml(b), a.cancel())
                });
                if (d) c.on("key", function (a) {
                    (9 == a.data.keyCode && c.execCommand("selectNextCell") || a.data.keyCode == CKEDITOR.SHIFT + 9 && c.execCommand("selectPreviousCell")) && a.cancel()
                });
                c.addCommand("blur",
                    CKEDITOR.tools.extend(g, h));
                c.addCommand("blurBack", CKEDITOR.tools.extend(f, h));
                c.addCommand("selectNextCell", i());
                c.addCommand("selectPreviousCell", i(!0))
            }
        })
    })();
    CKEDITOR.dom.element.prototype.focusNext = function (i, h) {
        var g = void 0 === h ? this.getTabIndex() : h, f, c, d, e, b, a;
        if (0 >= g)for (b = this.getNextSourceNode(i, CKEDITOR.NODE_ELEMENT); b;) {
            if (b.isVisible() && 0 === b.getTabIndex()) {
                d = b;
                break
            }
            b = b.getNextSourceNode(!1, CKEDITOR.NODE_ELEMENT)
        } else for (b = this.getDocument().getBody().getFirst(); b = b.getNextSourceNode(!1, CKEDITOR.NODE_ELEMENT);) {
            if (!f)if (!c && b.equals(this)) {
                if (c = !0, i) {
                    if (!(b = b.getNextSourceNode(!0, CKEDITOR.NODE_ELEMENT)))break;
                    f = 1
                }
            } else c && !this.contains(b) &&
            (f = 1);
            if (b.isVisible() && !(0 > (a = b.getTabIndex()))) {
                if (f && a == g) {
                    d = b;
                    break
                }
                a > g && (!d || !e || a < e) ? (d = b, e = a) : !d && 0 === a && (d = b, e = a)
            }
        }
        d && d.focus()
    };
    CKEDITOR.dom.element.prototype.focusPrevious = function (i, h) {
        for (var g = void 0 === h ? this.getTabIndex() : h, f, c, d, e = 0, b,
                 a = this.getDocument().getBody().getLast(); a = a.getPreviousSourceNode(!1, CKEDITOR.NODE_ELEMENT);) {
            if (!f)if (!c && a.equals(this)) {
                if (c = !0, i) {
                    if (!(a = a.getPreviousSourceNode(!0, CKEDITOR.NODE_ELEMENT)))break;
                    f = 1
                }
            } else c && !this.contains(a) && (f = 1);
            if (a.isVisible() && !(0 > (b = a.getTabIndex())))if (0 >= g) {
                if (f && 0 === b) {
                    d = a;
                    break
                }
                b > e && (d = a, e = b)
            } else {
                if (f && b == g) {
                    d = a;
                    break
                }
                if (b < g && (!d || b > e)) d = a, e = b
            }
        }
        d && d.focus()
    };
    CKEDITOR.plugins.add("table", {
        requires: "dialog", init: function (a) {
            function d(a) {
                return CKEDITOR.tools.extend(a || {}, {
                    contextSensitive: 1, refresh: function (a, e) {
                        this.setState(e.contains("table", 1) ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED)
                    }
                })
            }

            if (!a.blockless) {
                var b = a.lang.table;
                a.addCommand("table", new CKEDITOR.dialogCommand("table", {
                    context: "table",
                    allowedContent: "table{width,height}[align,border,cellpadding,cellspacing,summary];caption tbody thead tfoot;th td tr[scope];" + (a.plugins.dialogadvtab ?
                        "table" + a.plugins.dialogadvtab.allowedContent() : ""),
                    requiredContent: "table",
                    contentTransformations: [["table{width}: sizeToStyle", "table[width]: sizeToAttribute"]]
                }));
                a.addCommand("tableProperties", new CKEDITOR.dialogCommand("tableProperties", d()));
                a.addCommand("tableDelete", d({
                    exec: function (a) {
                        var c = a.elementPath().contains("table", 1);
                        if (c) {
                            var b = c.getParent();
                            1 == b.getChildCount() && !b.is("body", "td", "th") && (c = b);
                            a = a.createRange();
                            a.moveToPosition(c, CKEDITOR.POSITION_BEFORE_START);
                            c.remove();
                            a.select()
                        }
                    }
                }));
                a.ui.addButton && a.ui.addButton("Table", {label: b.toolbar, command: "table", toolbar: "insert,30"});
                CKEDITOR.dialog.add("table", this.path + "dialogs/table.js");
                CKEDITOR.dialog.add("tableProperties", this.path + "dialogs/table.js");
                a.addMenuItems && a.addMenuItems({
                    table: {
                        label: b.menu,
                        command: "tableProperties",
                        group: "table",
                        order: 5
                    }, tabledelete: {label: b.deleteTable, command: "tableDelete", group: "table", order: 1}
                });
                a.on("doubleclick", function (a) {
                    a.data.element.is("table") && (a.data.dialog = "tableProperties")
                });
                a.contextMenu &&
                a.contextMenu.addListener(function () {
                    return {tabledelete: CKEDITOR.TRISTATE_OFF, table: CKEDITOR.TRISTATE_OFF}
                })
            }
        }
    });
    (function () {
        function p(e) {
            function d(a) {
                !(0 < b.length) && (a.type == CKEDITOR.NODE_ELEMENT && y.test(a.getName()) && !a.getCustomData("selected_cell")) && (CKEDITOR.dom.element.setMarker(c, a, "selected_cell", !0), b.push(a))
            }

            for (var e = e.getRanges(), b = [], c = {}, a = 0; a < e.length; a++) {
                var f = e[a];
                if (f.collapsed) f = f.getCommonAncestor(), (f = f.getAscendant("td", !0) || f.getAscendant("th", !0)) && b.push(f); else {
                    var f = new CKEDITOR.dom.walker(f), g;
                    for (f.guard = d; g = f.next();)if (g.type != CKEDITOR.NODE_ELEMENT || !g.is(CKEDITOR.dtd.table))if ((g =
                            g.getAscendant("td", !0) || g.getAscendant("th", !0)) && !g.getCustomData("selected_cell")) CKEDITOR.dom.element.setMarker(c, g, "selected_cell", !0), b.push(g)
                }
            }
            CKEDITOR.dom.element.clearAllMarkers(c);
            return b
        }

        function o(e, d) {
            for (var b = p(e), c = b[0], a = c.getAscendant("table"), c = c.getDocument(), f = b[0].getParent(),
                     g = f.$.rowIndex, b = b[b.length - 1], h = b.getParent().$.rowIndex + b.$.rowSpan - 1,
                     b = new CKEDITOR.dom.element(a.$.rows[h]), g = d ? g : h, f = d ? f : b,
                     b = CKEDITOR.tools.buildTableMap(a), a = b[g], g = d ? b[g - 1] : b[g + 1], b = b[0].length,
                     c = c.createElement("tr"), h = 0; a[h] && h < b; h++) {
                var i;
                1 < a[h].rowSpan && g && a[h] == g[h] ? (i = a[h], i.rowSpan += 1) : (i = (new CKEDITOR.dom.element(a[h])).clone(), i.removeAttribute("rowSpan"), i.appendBogus(), c.append(i), i = i.$);
                h += i.colSpan - 1
            }
            d ? c.insertBefore(f) : c.insertAfter(f)
        }

        function q(e) {
            if (e instanceof CKEDITOR.dom.selection) {
                for (var d = p(e), b = d[0].getAscendant("table"), c = CKEDITOR.tools.buildTableMap(b),
                         e = d[0].getParent().$.rowIndex, d = d[d.length - 1],
                         a = d.getParent().$.rowIndex + d.$.rowSpan - 1, d = [], f = e; f <= a; f++) {
                    for (var g =
                        c[f], h = new CKEDITOR.dom.element(b.$.rows[f]), i = 0; i < g.length; i++) {
                        var j = new CKEDITOR.dom.element(g[i]), l = j.getParent().$.rowIndex;
                        1 == j.$.rowSpan ? j.remove() : (j.$.rowSpan -= 1, l == f && (l = c[f + 1], l[i - 1] ? j.insertAfter(new CKEDITOR.dom.element(l[i - 1])) : (new CKEDITOR.dom.element(b.$.rows[f + 1])).append(j, 1)));
                        i += j.$.colSpan - 1
                    }
                    d.push(h)
                }
                c = b.$.rows;
                b = new CKEDITOR.dom.element(c[a + 1] || (0 < e ? c[e - 1] : null) || b.$.parentNode);
                for (f = d.length; 0 <= f; f--)q(d[f]);
                return b
            }
            e instanceof CKEDITOR.dom.element && (b = e.getAscendant("table"),
                1 == b.$.rows.length ? b.remove() : e.remove());
            return null
        }

        function r(e, d) {
            for (var b = d ? Infinity : 0, c = 0; c < e.length; c++) {
                var a;
                a = e[c];
                for (var f = d, g = a.getParent().$.cells, h = 0, i = 0; i < g.length; i++) {
                    var j = g[i], h = h + (f ? 1 : j.colSpan);
                    if (j == a.$)break
                }
                a = h - 1;
                if (d ? a < b : a > b) b = a
            }
            return b
        }

        function k(e, d) {
            for (var b = p(e), c = b[0].getAscendant("table"), a = r(b, 1), b = r(b), a = d ? a : b,
                     f = CKEDITOR.tools.buildTableMap(c), c = [], b = [], g = f.length,
                     h = 0; h < g; h++)c.push(f[h][a]), b.push(d ? f[h][a - 1] : f[h][a + 1]);
            for (h = 0; h < g; h++)c[h] && (1 < c[h].colSpan &&
            b[h] == c[h] ? (a = c[h], a.colSpan += 1) : (a = (new CKEDITOR.dom.element(c[h])).clone(), a.removeAttribute("colSpan"), a.appendBogus(), a[d ? "insertBefore" : "insertAfter"].call(a, new CKEDITOR.dom.element(c[h])), a = a.$), h += a.rowSpan - 1)
        }

        function u(e, d) {
            var b = e.getStartElement();
            if (b = b.getAscendant("td", 1) || b.getAscendant("th", 1)) {
                var c = b.clone();
                c.appendBogus();
                d ? c.insertBefore(b) : c.insertAfter(b)
            }
        }

        function t(e) {
            if (e instanceof CKEDITOR.dom.selection) {
                var e = p(e), d = e[0] && e[0].getAscendant("table"), b;
                a:{
                    var c = 0;
                    b = e.length -
                        1;
                    for (var a = {}, f, g; f = e[c++];)CKEDITOR.dom.element.setMarker(a, f, "delete_cell", !0);
                    for (c = 0; f = e[c++];)if ((g = f.getPrevious()) && !g.getCustomData("delete_cell") || (g = f.getNext()) && !g.getCustomData("delete_cell")) {
                        CKEDITOR.dom.element.clearAllMarkers(a);
                        b = g;
                        break a
                    }
                    CKEDITOR.dom.element.clearAllMarkers(a);
                    g = e[0].getParent();
                    (g = g.getPrevious()) ? b = g.getLast() : (g = e[b].getParent(), b = (g = g.getNext()) ? g.getChild(0) : null)
                }
                for (g = e.length - 1; 0 <= g; g--)t(e[g]);
                b ? m(b, !0) : d && d.remove()
            } else e instanceof CKEDITOR.dom.element &&
            (d = e.getParent(), 1 == d.getChildCount() ? d.remove() : e.remove())
        }

        function m(e, d) {
            var b = e.getDocument(), c = CKEDITOR.document;
            CKEDITOR.env.ie && 11 > CKEDITOR.env.version && (c.focus(), b.focus());
            b = new CKEDITOR.dom.range(b);
            if (!b["moveToElementEdit" + (d ? "End" : "Start")](e)) b.selectNodeContents(e), b.collapse(d ? !1 : !0);
            b.select(!0)
        }

        function v(e, d, b) {
            e = e[d];
            if ("undefined" == typeof b)return e;
            for (d = 0; e && d < e.length; d++) {
                if (b.is && e[d] == b.$)return d;
                if (d == b)return new CKEDITOR.dom.element(e[d])
            }
            return b.is ? -1 : null
        }

        function s(e,
                   d, b) {
            var c = p(e), a;
            if ((d ? 1 != c.length : 2 > c.length) || (a = e.getCommonAncestor()) && a.type == CKEDITOR.NODE_ELEMENT && a.is("table"))return !1;
            var f, e = c[0];
            a = e.getAscendant("table");
            var g = CKEDITOR.tools.buildTableMap(a), h = g.length, i = g[0].length, j = e.getParent().$.rowIndex,
                l = v(g, j, e);
            if (d) {
                var n;
                try {
                    var m = parseInt(e.getAttribute("rowspan"), 10) || 1;
                    f = parseInt(e.getAttribute("colspan"), 10) || 1;
                    n = g["up" == d ? j - m : "down" == d ? j + m : j]["left" == d ? l - f : "right" == d ? l + f : l]
                } catch (z) {
                    return !1
                }
                if (!n || e.$ == n)return !1;
                c["up" == d || "left" ==
                d ? "unshift" : "push"](new CKEDITOR.dom.element(n))
            }
            for (var d = e.getDocument(), o = j, m = n = 0, q = !b && new CKEDITOR.dom.documentFragment(d), s = 0,
                     d = 0; d < c.length; d++) {
                f = c[d];
                var k = f.getParent(), t = f.getFirst(), r = f.$.colSpan, u = f.$.rowSpan, k = k.$.rowIndex,
                    w = v(g, k, f), s = s + r * u, m = Math.max(m, w - l + r);
                n = Math.max(n, k - j + u);
                if (!b) {
                    r = f;
                    (u = r.getBogus()) && u.remove();
                    r.trim();
                    if (f.getChildren().count()) {
                        if (k != o && t && (!t.isBlockBoundary || !t.isBlockBoundary({br: 1}))) (o = q.getLast(CKEDITOR.dom.walker.whitespaces(!0))) && (!o.is || !o.is("br")) &&
                        q.append("br");
                        f.moveChildren(q)
                    }
                    d ? f.remove() : f.setHtml("")
                }
                o = k
            }
            if (b)return n * m == s;
            q.moveChildren(e);
            e.appendBogus();
            m >= i ? e.removeAttribute("rowSpan") : e.$.rowSpan = n;
            n >= h ? e.removeAttribute("colSpan") : e.$.colSpan = m;
            b = new CKEDITOR.dom.nodeList(a.$.rows);
            c = b.count();
            for (d = c - 1; 0 <= d; d--)a = b.getItem(d), a.$.cells.length || (a.remove(), c++);
            return e
        }

        function w(e, d) {
            var b = p(e);
            if (1 < b.length)return !1;
            if (d)return !0;
            var b = b[0], c = b.getParent(), a = c.getAscendant("table"), f = CKEDITOR.tools.buildTableMap(a),
                g = c.$.rowIndex,
                h = v(f, g, b), i = b.$.rowSpan, j;
            if (1 < i) {
                j = Math.ceil(i / 2);
                for (var i = Math.floor(i / 2), c = g + j, a = new CKEDITOR.dom.element(a.$.rows[c]), f = v(f, c), l,
                         c = b.clone(), g = 0; g < f.length; g++)if (l = f[g], l.parentNode == a.$ && g > h) {
                    c.insertBefore(new CKEDITOR.dom.element(l));
                    break
                } else l = null;
                l || a.append(c, !0)
            } else {
                i = j = 1;
                a = c.clone();
                a.insertAfter(c);
                a.append(c = b.clone());
                l = v(f, g);
                for (h = 0; h < l.length; h++)l[h].rowSpan++
            }
            c.appendBogus();
            b.$.rowSpan = j;
            c.$.rowSpan = i;
            1 == j && b.removeAttribute("rowSpan");
            1 == i && c.removeAttribute("rowSpan");
            return c
        }

        function x(e, d) {
            var b = p(e);
            if (1 < b.length)return !1;
            if (d)return !0;
            var b = b[0], c = b.getParent(), a = c.getAscendant("table"), a = CKEDITOR.tools.buildTableMap(a),
                f = v(a, c.$.rowIndex, b), g = b.$.colSpan;
            if (1 < g) c = Math.ceil(g / 2), g = Math.floor(g / 2); else {
                for (var g = c = 1, h = [], i = 0; i < a.length; i++) {
                    var j = a[i];
                    h.push(j[f]);
                    1 < j[f].rowSpan && (i += j[f].rowSpan - 1)
                }
                for (a = 0; a < h.length; a++)h[a].colSpan++
            }
            a = b.clone();
            a.insertAfter(b);
            a.appendBogus();
            b.$.colSpan = c;
            a.$.colSpan = g;
            1 == c && b.removeAttribute("colSpan");
            1 == g && a.removeAttribute("colSpan");
            return a
        }

        var y = /^(?:td|th)$/;
        CKEDITOR.plugins.tabletools = {
            requires: "table,dialog,contextmenu", init: function (e) {
                function d(a) {
                    return CKEDITOR.tools.extend(a || {}, {
                        contextSensitive: 1, refresh: function (a, b) {
                            this.setState(b.contains({
                                td: 1,
                                th: 1
                            }, 1) ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED)
                        }
                    })
                }

                function b(a, b) {
                    var c = e.addCommand(a, b);
                    e.addFeature(c)
                }

                var c = e.lang.table;
                b("cellProperties", new CKEDITOR.dialogCommand("cellProperties", d({
                    allowedContent: "td th{width,height,border-color,background-color,white-space,vertical-align,text-align}[colspan,rowspan]",
                    requiredContent: "table"
                })));
                CKEDITOR.dialog.add("cellProperties", this.path + "dialogs/tableCell.js");
                b("rowDelete", d({
                    requiredContent: "table", exec: function (a) {
                        a = a.getSelection();
                        m(q(a))
                    }
                }));
                b("rowInsertBefore", d({
                    requiredContent: "table", exec: function (a) {
                        a = a.getSelection();
                        o(a, !0)
                    }
                }));
                b("rowInsertAfter", d({
                    requiredContent: "table", exec: function (a) {
                        a = a.getSelection();
                        o(a)
                    }
                }));
                b("columnDelete", d({
                    requiredContent: "table", exec: function (a) {
                        for (var a = a.getSelection(), a = p(a), b = a[0], c = a[a.length - 1],
                                 a = b.getAscendant("table"),
                                 d = CKEDITOR.tools.buildTableMap(a), e, j, l = [], n = 0,
                                 o = d.length; n < o; n++)for (var k = 0,
                                                                   q = d[n].length; k < q; k++)d[n][k] == b.$ && (e = k), d[n][k] == c.$ && (j = k);
                        for (n = e; n <= j; n++)for (k = 0; k < d.length; k++)c = d[k], b = new CKEDITOR.dom.element(a.$.rows[k]), c = new CKEDITOR.dom.element(c[n]), c.$ && (1 == c.$.colSpan ? c.remove() : c.$.colSpan -= 1, k += c.$.rowSpan - 1, b.$.cells.length || l.push(b));
                        j = a.$.rows[0] && a.$.rows[0].cells;
                        e = new CKEDITOR.dom.element(j[e] || (e ? j[e - 1] : a.$.parentNode));
                        l.length == o && a.remove();
                        e && m(e, !0)
                    }
                }));
                b("columnInsertBefore",
                    d({
                        requiredContent: "table", exec: function (a) {
                            a = a.getSelection();
                            k(a, !0)
                        }
                    }));
                b("columnInsertAfter", d({
                    requiredContent: "table", exec: function (a) {
                        a = a.getSelection();
                        k(a)
                    }
                }));
                b("cellDelete", d({
                    requiredContent: "table", exec: function (a) {
                        a = a.getSelection();
                        t(a)
                    }
                }));
                b("cellMerge", d({
                    allowedContent: "td[colspan,rowspan]",
                    requiredContent: "td[colspan,rowspan]",
                    exec: function (a) {
                        m(s(a.getSelection()), !0)
                    }
                }));
                b("cellMergeRight", d({
                    allowedContent: "td[colspan]", requiredContent: "td[colspan]", exec: function (a) {
                        m(s(a.getSelection(),
                            "right"), !0)
                    }
                }));
                b("cellMergeDown", d({
                    allowedContent: "td[rowspan]",
                    requiredContent: "td[rowspan]",
                    exec: function (a) {
                        m(s(a.getSelection(), "down"), !0)
                    }
                }));
                b("cellVerticalSplit", d({
                    allowedContent: "td[rowspan]",
                    requiredContent: "td[rowspan]",
                    exec: function (a) {
                        m(w(a.getSelection()))
                    }
                }));
                b("cellHorizontalSplit", d({
                    allowedContent: "td[colspan]",
                    requiredContent: "td[colspan]",
                    exec: function (a) {
                        m(x(a.getSelection()))
                    }
                }));
                b("cellInsertBefore", d({
                    requiredContent: "table", exec: function (a) {
                        a = a.getSelection();
                        u(a, !0)
                    }
                }));
                b("cellInsertAfter", d({
                    requiredContent: "table", exec: function (a) {
                        a = a.getSelection();
                        u(a)
                    }
                }));
                e.addMenuItems && e.addMenuItems({
                    tablecell: {
                        label: c.cell.menu, group: "tablecell", order: 1, getItems: function () {
                            var a = e.getSelection(), b = p(a);
                            return {
                                tablecell_insertBefore: CKEDITOR.TRISTATE_OFF,
                                tablecell_insertAfter: CKEDITOR.TRISTATE_OFF,
                                tablecell_delete: CKEDITOR.TRISTATE_OFF,
                                tablecell_merge: s(a, null, !0) ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED,
                                tablecell_merge_right: s(a, "right", !0) ? CKEDITOR.TRISTATE_OFF :
                                    CKEDITOR.TRISTATE_DISABLED,
                                tablecell_merge_down: s(a, "down", !0) ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED,
                                tablecell_split_vertical: w(a, !0) ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED,
                                tablecell_split_horizontal: x(a, !0) ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED,
                                tablecell_properties: 0 < b.length ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED
                            }
                        }
                    },
                    tablecell_insertBefore: {
                        label: c.cell.insertBefore,
                        group: "tablecell",
                        command: "cellInsertBefore",
                        order: 5
                    },
                    tablecell_insertAfter: {
                        label: c.cell.insertAfter,
                        group: "tablecell", command: "cellInsertAfter", order: 10
                    },
                    tablecell_delete: {label: c.cell.deleteCell, group: "tablecell", command: "cellDelete", order: 15},
                    tablecell_merge: {label: c.cell.merge, group: "tablecell", command: "cellMerge", order: 16},
                    tablecell_merge_right: {
                        label: c.cell.mergeRight,
                        group: "tablecell",
                        command: "cellMergeRight",
                        order: 17
                    },
                    tablecell_merge_down: {
                        label: c.cell.mergeDown,
                        group: "tablecell",
                        command: "cellMergeDown",
                        order: 18
                    },
                    tablecell_split_horizontal: {
                        label: c.cell.splitHorizontal, group: "tablecell",
                        command: "cellHorizontalSplit", order: 19
                    },
                    tablecell_split_vertical: {
                        label: c.cell.splitVertical,
                        group: "tablecell",
                        command: "cellVerticalSplit",
                        order: 20
                    },
                    tablecell_properties: {
                        label: c.cell.title,
                        group: "tablecellproperties",
                        command: "cellProperties",
                        order: 21
                    },
                    tablerow: {
                        label: c.row.menu, group: "tablerow", order: 1, getItems: function () {
                            return {
                                tablerow_insertBefore: CKEDITOR.TRISTATE_OFF,
                                tablerow_insertAfter: CKEDITOR.TRISTATE_OFF,
                                tablerow_delete: CKEDITOR.TRISTATE_OFF
                            }
                        }
                    },
                    tablerow_insertBefore: {
                        label: c.row.insertBefore,
                        group: "tablerow", command: "rowInsertBefore", order: 5
                    },
                    tablerow_insertAfter: {
                        label: c.row.insertAfter,
                        group: "tablerow",
                        command: "rowInsertAfter",
                        order: 10
                    },
                    tablerow_delete: {label: c.row.deleteRow, group: "tablerow", command: "rowDelete", order: 15},
                    tablecolumn: {
                        label: c.column.menu, group: "tablecolumn", order: 1, getItems: function () {
                            return {
                                tablecolumn_insertBefore: CKEDITOR.TRISTATE_OFF,
                                tablecolumn_insertAfter: CKEDITOR.TRISTATE_OFF,
                                tablecolumn_delete: CKEDITOR.TRISTATE_OFF
                            }
                        }
                    },
                    tablecolumn_insertBefore: {
                        label: c.column.insertBefore,
                        group: "tablecolumn", command: "columnInsertBefore", order: 5
                    },
                    tablecolumn_insertAfter: {
                        label: c.column.insertAfter,
                        group: "tablecolumn",
                        command: "columnInsertAfter",
                        order: 10
                    },
                    tablecolumn_delete: {
                        label: c.column.deleteColumn,
                        group: "tablecolumn",
                        command: "columnDelete",
                        order: 15
                    }
                });
                e.contextMenu && e.contextMenu.addListener(function (a, b, c) {
                    return (a = c.contains({td: 1, th: 1}, 1)) && !a.isReadOnly() ? {
                        tablecell: CKEDITOR.TRISTATE_OFF,
                        tablerow: CKEDITOR.TRISTATE_OFF,
                        tablecolumn: CKEDITOR.TRISTATE_OFF
                    } : null
                })
            }, getSelectedCells: p
        };
        CKEDITOR.plugins.add("tabletools", CKEDITOR.plugins.tabletools)
    })();
    CKEDITOR.tools.buildTableMap = function (p) {
        for (var p = p.$.rows, o = -1, q = [], r = 0; r < p.length; r++) {
            o++;
            !q[o] && (q[o] = []);
            for (var k = -1, u = 0; u < p[r].cells.length; u++) {
                var t = p[r].cells[u];
                for (k++; q[o][k];)k++;
                for (var m = isNaN(t.colSpan) ? 1 : t.colSpan, t = isNaN(t.rowSpan) ? 1 : t.rowSpan,
                         v = 0; v < t; v++) {
                    q[o + v] || (q[o + v] = []);
                    for (var s = 0; s < m; s++)q[o + v][k + s] = p[r].cells[u]
                }
                k += m - 1
            }
        }
        return q
    };
    (function () {
        function g(a) {
            this.editor = a;
            this.reset()
        }

        CKEDITOR.plugins.add("undo", {
            init: function (a) {
                function c(a) {
                    b.enabled && !1 !== a.data.command.canUndo && b.save()
                }

                function d() {
                    b.enabled = a.readOnly ? !1 : "wysiwyg" == a.mode;
                    b.onChange()
                }

                var b = a.undoManager = new g(a), e = a.addCommand("undo", {
                    exec: function () {
                        b.undo() && (a.selectionChange(), this.fire("afterUndo"))
                    }, startDisabled: !0, canUndo: !1
                }), f = a.addCommand("redo", {
                    exec: function () {
                        b.redo() && (a.selectionChange(), this.fire("afterRedo"))
                    }, startDisabled: !0, canUndo: !1
                });
                a.setKeystroke([[CKEDITOR.CTRL + 90, "undo"], [CKEDITOR.CTRL + 89, "redo"], [CKEDITOR.CTRL + CKEDITOR.SHIFT + 90, "redo"]]);
                b.onChange = function () {
                    e.setState(b.undoable() ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED);
                    f.setState(b.redoable() ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED)
                };
                a.on("beforeCommandExec", c);
                a.on("afterCommandExec", c);
                a.on("saveSnapshot", function (a) {
                    b.save(a.data && a.data.contentOnly)
                });
                a.on("contentDom", function () {
                    a.editable().on("keydown", function (a) {
                        a = a.data.getKey();
                        (8 == a || 46 ==
                        a) && b.type(a, 0)
                    });
                    a.editable().on("keypress", function (a) {
                        b.type(a.data.getKey(), 1)
                    })
                });
                a.on("beforeModeUnload", function () {
                    "wysiwyg" == a.mode && b.save(!0)
                });
                a.on("mode", d);
                a.on("readOnly", d);
                a.ui.addButton && (a.ui.addButton("Undo", {
                    label: a.lang.undo.undo,
                    command: "undo",
                    toolbar: "undo,10"
                }), a.ui.addButton("Redo", {label: a.lang.undo.redo, command: "redo", toolbar: "undo,20"}));
                a.resetUndo = function () {
                    b.reset();
                    a.fire("saveSnapshot")
                };
                a.on("updateSnapshot", function () {
                    b.currentImage && b.update()
                });
                a.on("lockSnapshot",
                    function (a) {
                        b.lock(a.data && a.data.dontUpdate)
                    });
                a.on("unlockSnapshot", b.unlock, b)
            }
        });
        CKEDITOR.plugins.undo = {};
        var f = CKEDITOR.plugins.undo.Image = function (a, c) {
            this.editor = a;
            a.fire("beforeUndoImage");
            var d = a.getSnapshot();
            CKEDITOR.env.ie && d && (d = d.replace(/\s+data-cke-expando=".*?"/g, ""));
            this.contents = d;
            c || (this.bookmarks = (d = d && a.getSelection()) && d.createBookmarks2(!0));
            a.fire("afterUndoImage")
        }, h = /\b(?:href|src|name)="[^"]*?"/gi;
        f.prototype = {
            equalsContent: function (a) {
                var c = this.contents, a = a.contents;
                if (CKEDITOR.env.ie && (CKEDITOR.env.ie7Compat || CKEDITOR.env.ie6Compat)) c = c.replace(h, ""), a = a.replace(h, "");
                return c != a ? !1 : !0
            }, equalsSelection: function (a) {
                var c = this.bookmarks, a = a.bookmarks;
                if (c || a) {
                    if (!c || !a || c.length != a.length)return !1;
                    for (var d = 0; d < c.length; d++) {
                        var b = c[d], e = a[d];
                        if (b.startOffset != e.startOffset || b.endOffset != e.endOffset || !CKEDITOR.tools.arrayCompare(b.start, e.start) || !CKEDITOR.tools.arrayCompare(b.end, e.end))return !1
                    }
                }
                return !0
            }
        };
        g.prototype = {
            type: function (a, c) {
                var d = !c && a != this.lastKeystroke,
                    b = this.editor;
                if (!this.typing || c && !this.wasCharacter || d) {
                    var e = new f(b), g = this.snapshots.length;
                    CKEDITOR.tools.setTimeout(function () {
                        var a = b.getSnapshot();
                        CKEDITOR.env.ie && (a = a.replace(/\s+data-cke-expando=".*?"/g, ""));
                        e.contents != a && g == this.snapshots.length && (this.typing = !0, this.save(!1, e, !1) || this.snapshots.splice(this.index + 1, this.snapshots.length - this.index - 1), this.hasUndo = !0, this.hasRedo = !1, this.modifiersCount = this.typesCount = 1, this.onChange())
                    }, 0, this)
                }
                this.lastKeystroke = a;
                (this.wasCharacter =
                    c) ? (this.modifiersCount = 0, this.typesCount++, 25 < this.typesCount ? (this.save(!1, null, !1), this.typesCount = 1) : setTimeout(function () {
                    b.fire("change")
                }, 0)) : (this.typesCount = 0, this.modifiersCount++, 25 < this.modifiersCount ? (this.save(!1, null, !1), this.modifiersCount = 1) : setTimeout(function () {
                    b.fire("change")
                }, 0))
            }, reset: function () {
                this.lastKeystroke = 0;
                this.snapshots = [];
                this.index = -1;
                this.limit = this.editor.config.undoStackSize || 20;
                this.currentImage = null;
                this.hasRedo = this.hasUndo = !1;
                this.locked = null;
                this.resetType()
            },
            resetType: function () {
                this.typing = !1;
                delete this.lastKeystroke;
                this.modifiersCount = this.typesCount = 0
            }, fireChange: function () {
                this.hasUndo = !!this.getNextImage(!0);
                this.hasRedo = !!this.getNextImage(!1);
                this.resetType();
                this.onChange()
            }, save: function (a, c, d) {
                if (this.locked)return !1;
                var b = this.snapshots;
                c || (c = new f(this.editor));
                if (!1 === c.contents)return !1;
                if (this.currentImage)if (c.equalsContent(this.currentImage)) {
                    if (a || c.equalsSelection(this.currentImage))return !1
                } else this.editor.fire("change");
                b.splice(this.index +
                    1, b.length - this.index - 1);
                b.length == this.limit && b.shift();
                this.index = b.push(c) - 1;
                this.currentImage = c;
                !1 !== d && this.fireChange();
                return !0
            }, restoreImage: function (a) {
                var c = this.editor, d;
                a.bookmarks && (c.focus(), d = c.getSelection());
                this.locked = 1;
                this.editor.loadSnapshot(a.contents);
                a.bookmarks ? d.selectBookmarks(a.bookmarks) : CKEDITOR.env.ie && (d = this.editor.document.getBody().$.createTextRange(), d.collapse(!0), d.select());
                this.locked = 0;
                this.index = a.index;
                this.currentImage = this.snapshots[this.index];
                this.update();
                this.fireChange();
                c.fire("change")
            }, getNextImage: function (a) {
                var c = this.snapshots, d = this.currentImage, b;
                if (d)if (a)for (b = this.index - 1; 0 <= b; b--) {
                    if (a = c[b], !d.equalsContent(a))return a.index = b, a
                } else for (b = this.index + 1; b < c.length; b++)if (a = c[b], !d.equalsContent(a))return a.index = b, a;
                return null
            }, redoable: function () {
                return this.enabled && this.hasRedo
            }, undoable: function () {
                return this.enabled && this.hasUndo
            }, undo: function () {
                if (this.undoable()) {
                    this.save(!0);
                    var a = this.getNextImage(!0);
                    if (a)return this.restoreImage(a),
                        !0
                }
                return !1
            }, redo: function () {
                if (this.redoable() && (this.save(!0), this.redoable())) {
                    var a = this.getNextImage(!1);
                    if (a)return this.restoreImage(a), !0
                }
                return !1
            }, update: function (a) {
                if (!this.locked) {
                    a || (a = new f(this.editor));
                    for (var c = this.index,
                             d = this.snapshots; 0 < c && this.currentImage.equalsContent(d[c - 1]);)c -= 1;
                    d.splice(c, this.index - c + 1, a);
                    this.index = c;
                    this.currentImage = a
                }
            }, lock: function (a) {
                this.locked ? this.locked.level++ : a ? this.locked = {level: 1} : (a = new f(this.editor, !0), this.locked = {
                    update: this.currentImage &&
                    this.currentImage.equalsContent(a) ? a : null, level: 1
                })
            }, unlock: function () {
                if (this.locked && !--this.locked.level) {
                    var a = this.locked.update, c = a && new f(this.editor, !0);
                    this.locked = null;
                    a && !a.equalsContent(c) && this.update()
                }
            }
        }
    })();
    CKEDITOR.config.wsc_removeGlobalVariable = !0;
    CKEDITOR.plugins.add("wsc", {
        requires: "dialog", parseApi: function (a) {
            a.config.wsc_onFinish = "function" === typeof a.config.wsc_onFinish ? a.config.wsc_onFinish : function () {
            };
            a.config.wsc_onClose = "function" === typeof a.config.wsc_onClose ? a.config.wsc_onClose : function () {
            }
        }, parseConfig: function (a) {
            a.config.wsc_customerId = a.config.wsc_customerId || CKEDITOR.config.wsc_customerId || "1:ua3xw1-2XyGJ3-GWruD3-6OFNT1-oXcuB1-nR6Bp4-hgQHc-EcYng3-sdRXG3-NOfFk";
            a.config.wsc_customDictionaryIds = a.config.wsc_customDictionaryIds ||
                CKEDITOR.config.wsc_customDictionaryIds || "";
            a.config.wsc_userDictionaryName = a.config.wsc_userDictionaryName || CKEDITOR.config.wsc_userDictionaryName || "";
            a.config.wsc_customLoaderScript = a.config.wsc_customLoaderScript || CKEDITOR.config.wsc_customLoaderScript;
            CKEDITOR.config.wsc_cmd = a.config.wsc_cmd || CKEDITOR.config.wsc_cmd || "spell";
            CKEDITOR.config.wsc_version = "v4.3.0-1e748a6"
        }, init: function (a) {
            this.parseConfig(a);
            this.parseApi(a);
            a.addCommand("checkspell", new CKEDITOR.dialogCommand("checkspell")).modes =
                {wysiwyg: !CKEDITOR.env.opera && !CKEDITOR.env.air && document.domain == window.location.hostname};
            "undefined" == typeof a.plugins.scayt && a.ui.addButton && a.ui.addButton("SpellChecker", {
                label: a.lang.wsc.toolbar,
                command: "checkspell",
                toolbar: "spellchecker,10"
            });
            CKEDITOR.dialog.add("checkspell", this.path + (CKEDITOR.env.ie && 8 >= CKEDITOR.env.version ? "dialogs/wsc_ie.js" : window.postMessage ? "dialogs/wsc.js" : "dialogs/wsc_ie.js"))
        }
    });
    CKEDITOR.config.plugins = 'dialogui,dialog,about,a11yhelp,basicstyles,blockquote,clipboard,panel,floatpanel,menu,contextmenu,resize,button,toolbar,elementspath,enterkey,entities,popup,filebrowser,floatingspace,listblock,richcombo,format,horizontalrule,htmlwriter,wysiwygarea,image,indent,indentlist,fakeobjects,link,list,magicline,maximize,pastetext,pastefromword,removeformat,sourcearea,specialchar,menubutton,scayt,stylescombo,tab,table,tabletools,undo,wsc';
    CKEDITOR.config.skin = 'moono';
    (function () {
        var setIcons = function (icons, strip) {
            var path = CKEDITOR.getUrl('plugins/' + strip);
            icons = icons.split(',');
            for (var i = 0; i < icons.length; i++)CKEDITOR.skin.icons[icons[i]] = {
                path: path,
                offset: -icons[++i],
                bgsize: icons[++i]
            };
        };
        if (CKEDITOR.env.hidpi) setIcons('about,0,,bold,24,,italic,48,,strike,72,,subscript,96,,superscript,120,,underline,144,,blockquote,168,,copy-rtl,192,,copy,216,,cut-rtl,240,,cut,264,,paste-rtl,288,,paste,312,,horizontalrule,336,,image,360,,indent-rtl,384,,indent,408,,outdent-rtl,432,,outdent,456,,anchor-rtl,480,,anchor,504,,link,528,,unlink,552,,bulletedlist-rtl,576,,bulletedlist,600,,numberedlist-rtl,624,,numberedlist,648,,maximize,672,,pastetext-rtl,696,,pastetext,720,,pastefromword-rtl,744,,pastefromword,768,,removeformat,792,,source-rtl,816,,source,840,,specialchar,864,,scayt,888,,table,912,,redo-rtl,936,,redo,960,,undo-rtl,984,,undo,1008,,spellchecker,1032,', 'icons_hidpi.png'); else setIcons('about,0,auto,bold,24,auto,italic,48,auto,strike,72,auto,subscript,96,auto,superscript,120,auto,underline,144,auto,blockquote,168,auto,copy-rtl,192,auto,copy,216,auto,cut-rtl,240,auto,cut,264,auto,paste-rtl,288,auto,paste,312,auto,horizontalrule,336,auto,image,360,auto,indent-rtl,384,auto,indent,408,auto,outdent-rtl,432,auto,outdent,456,auto,anchor-rtl,480,auto,anchor,504,auto,link,528,auto,unlink,552,auto,bulletedlist-rtl,576,auto,bulletedlist,600,auto,numberedlist-rtl,624,auto,numberedlist,648,auto,maximize,672,auto,pastetext-rtl,696,auto,pastetext,720,auto,pastefromword-rtl,744,auto,pastefromword,768,auto,removeformat,792,auto,source-rtl,816,auto,source,840,auto,specialchar,864,auto,scayt,888,auto,table,912,auto,redo-rtl,936,auto,redo,960,auto,undo-rtl,984,auto,undo,1008,auto,spellchecker,1032,auto', 'icons.png');
    })();
    CKEDITOR.lang.languages = {
        "af": 1,
        "sq": 1,
        "ar": 1,
        "eu": 1,
        "bn": 1,
        "bs": 1,
        "bg": 1,
        "ca": 1,
        "zh-cn": 1,
        "zh": 1,
        "hr": 1,
        "cs": 1,
        "da": 1,
        "nl": 1,
        "en": 1,
        "en-au": 1,
        "en-ca": 1,
        "en-gb": 1,
        "eo": 1,
        "et": 1,
        "fo": 1,
        "fi": 1,
        "fr": 1,
        "fr-ca": 1,
        "gl": 1,
        "ka": 1,
        "de": 1,
        "el": 1,
        "gu": 1,
        "he": 1,
        "hi": 1,
        "hu": 1,
        "is": 1,
        "id": 1,
        "it": 1,
        "ja": 1,
        "km": 1,
        "ko": 1,
        "ku": 1,
        "lv": 1,
        "lt": 1,
        "mk": 1,
        "ms": 1,
        "mn": 1,
        "no": 1,
        "nb": 1,
        "fa": 1,
        "pl": 1,
        "pt-br": 1,
        "pt": 1,
        "ro": 1,
        "ru": 1,
        "sr": 1,
        "sr-latn": 1,
        "si": 1,
        "sk": 1,
        "sl": 1,
        "es": 1,
        "sv": 1,
        "th": 1,
        "tr": 1,
        "ug": 1,
        "uk": 1,
        "vi": 1,
        "cy": 1
    };
}());
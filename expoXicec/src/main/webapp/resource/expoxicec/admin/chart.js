(function () {
    "use strict";
    var c = this, g = c.Chart, t = function (t) {
        var i, r;
        this.canvas = t.canvas;
        this.ctx = t;
        var u = function (n, t) {
            return n["offset" + t] ? n["offset" + t] : document.defaultView.getComputedStyle(n).getPropertyValue(t)
        }, i = this.width = u(t.canvas, "Width"), r = this.height = u(t.canvas, "Height");
        return t.canvas.width = i, t.canvas.height = r, i = this.width = t.canvas.width, r = this.height = t.canvas.height, this.aspectRatio = this.width / this.height, n.retinaScale(this), this
    };
    t.defaults = {
        global: {
            animation: !0,
            animationSteps: 60,
            animationEasing: "easeOutQuart",
            showScale: !0,
            scaleOverride: !1,
            scaleSteps: null,
            scaleStepWidth: null,
            scaleStartValue: null,
            scaleLineColor: "rgba(0,0,0,.1)",
            scaleLineWidth: 1,
            scaleShowLabels: !0,
            scaleLabel: "<%=value%>",
            scaleIntegersOnly: !0,
            scaleBeginAtZero: !1,
            scaleFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
            scaleFontSize: 12,
            scaleFontStyle: "normal",
            scaleFontColor: "#666",
            responsive: !1,
            maintainAspectRatio: !0,
            showTooltips: !0,
            customTooltips: !1,
            tooltipEvents: ["mousemove", "touchstart", "touchmove", "mouseout"],
            tooltipFillColor: "rgba(0,0,0,0.8)",
            tooltipFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
            tooltipFontSize: 14,
            tooltipFontStyle: "normal",
            tooltipFontColor: "#fff",
            tooltipTitleFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
            tooltipTitleFontSize: 14,
            tooltipTitleFontStyle: "bold",
            tooltipTitleFontColor: "#fff",
            tooltipYPadding: 6,
            tooltipXPadding: 6,
            tooltipCaretSize: 8,
            tooltipCornerRadius: 6,
            tooltipXOffset: 10,
            tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= value %>",
            multiTooltipTemplate: "<%= value %>",
            multiTooltipKeyBackground: "#fff",
            onAnimationProgress: function () {
            },
            onAnimationComplete: function () {
            }
        }
    };
    t.types = {};
    var n = t.helpers = {}, i = n.each = function (n, t, i) {
        var f = Array.prototype.slice.call(arguments, 3), r, u;
        if (n)if (n.length === +n.length)for (r = 0; r < n.length; r++)t.apply(i, [n[r], r].concat(f)); else for (u in n)t.apply(i, [n[u], u].concat(f))
    }, l = n.clone = function (n) {
        var t = {};
        return i(n, function (i, r) {
            n.hasOwnProperty(r) && (t[r] = i)
        }), t
    }, r = n.extend = function (n) {
        return i(Array.prototype.slice.call(arguments, 1), function (t) {
            i(t, function (i, r) {
                t.hasOwnProperty(r) && (n[r] = i)
            })
        }), n
    }, nt = n.merge = function () {
        var n = Array.prototype.slice.call(arguments, 0);
        return n.unshift({}), r.apply(null, n)
    }, tt = n.indexOf = function (n, t) {
        if (Array.prototype.indexOf)return n.indexOf(t);
        for (var i = 0; i < n.length; i++)if (n[i] === t)return i;
        return -1
    }, p = (n.where = function (t, i) {
        var r = [];
        return n.each(t, function (n) {
            i(n) && r.push(n)
        }), r
    }, n.findNextWhere = function (n, t, i) {
        var r, u;
        for (i || (i = -1), r = i + 1; r < n.length; r++)if (u = n[r], t(u))return u
    }, n.findPreviousWhere = function (n, t, i) {
        var r, u;
        for (i || (i = n.length), r = i - 1; r >= 0; r--)if (u = n[r], t(u))return u
    }, n.inherits = function (n) {
        var i = this, t = n && n.hasOwnProperty("constructor") ? n.constructor : function () {
            return i.apply(this, arguments)
        }, u = function () {
            this.constructor = t
        };
        return u.prototype = i.prototype, t.prototype = new u, t.extend = p, n && r(t.prototype, n), t.__super__ = i.prototype, t
    }), a = n.noop = function () {
    }, it = n.uid = function () {
        var n = 0;
        return function () {
            return "chart-" + n++
        }
    }(), rt = n.warn = function (n) {
        window.console && "function" == typeof window.console.warn && console.warn(n)
    }, ut = n.amd = "function" == typeof define && define.amd, u = n.isNumber = function (n) {
        return !isNaN(parseFloat(n)) && isFinite(n)
    }, h = n.max = function (n) {
        return Math.max.apply(Math, n)
    }, o = n.min = function (n) {
        return Math.min.apply(Math, n)
    }, w = (n.cap = function (n, t, i) {
        if (u(t)) {
            if (n > t)return t
        } else if (u(i) && i > n)return i;
        return n
    }, n.getDecimalPlaces = function (n) {
        return n % 1 != 0 && u(n) ? n.toString().split(".")[1].length : 0
    }), v = n.radians = function (n) {
        return n * (Math.PI / 180)
    }, b = (n.getAngleFromPoint = function (n, t) {
        var i = t.x - n.x, r = t.y - n.y, f = Math.sqrt(i * i + r * r), u = 2 * Math.PI + Math.atan2(r, i);
        return 0 > i && 0 > r && (u += 2 * Math.PI), {angle: u, distance: f}
    }, n.aliasPixel = function (n) {
        return n % 2 == 0 ? 0 : .5
    }), ft = (n.splineCurve = function (n, t, i, r) {
        var u = Math.sqrt(Math.pow(t.x - n.x, 2) + Math.pow(t.y - n.y, 2)),
            f = Math.sqrt(Math.pow(i.x - t.x, 2) + Math.pow(i.y - t.y, 2)), e = r * u / (u + f), o = r * f / (u + f);
        return {
            inner: {x: t.x - e * (i.x - n.x), y: t.y - e * (i.y - n.y)},
            outer: {x: t.x + o * (i.x - n.x), y: t.y + o * (i.y - n.y)}
        }
    }, n.calculateOrderOfMagnitude = function (n) {
        return Math.floor(Math.log(n) / Math.LN10)
    }), f = (n.calculateScaleRange = function (n, t, i, r, u) {
        var w = 2, v = Math.floor(t / (1.5 * i)), y = w >= v, c = h(n), l = o(n);
        c === l && (c += .5, l >= .5 && !r ? l -= .5 : c += .5);
        for (var b = Math.abs(c - l), s = ft(b), k = Math.ceil(c / (1 * Math.pow(10, s))) * Math.pow(10, s),
                 p = r ? 0 : Math.floor(l / (1 * Math.pow(10, s))) * Math.pow(10, s), a = k - p, f = Math.pow(10, s),
                 e = Math.round(a / f); (e > v || v > 2 * e) && !y;)if (e > v) f *= 2, e = Math.round(a / f), e % 1 != 0 && (y = !0); else if (u && s >= 0) {
            if (f / 2 % 1 != 0)break;
            f /= 2;
            e = Math.round(a / f)
        } else f /= 2, e = Math.round(a / f);
        return y && (e = w, f = a / e), {steps: e, stepValue: f, min: p, max: p + e * f}
    }, n.template = function (n, t) {
        function r(n, t) {
            var r = /\W/.test(n) ? new Function("obj", "var p=[],print=function(){p.push.apply(p,arguments);};with(obj){p.push('" + n.replace(/[\r\t\n]/g, " ").split("<%").join("\t").replace(/((^|%>)[^\t]*)'/g, "$1\r").replace(/\t=(.*?)%>/g, "',$1,'").split("\t").join("');").split("%>").join("p.push('").split("\r").join("\\'") + "');}return p.join('');") : i[n] = i[n];
            return t ? r(t) : r
        }

        if (n instanceof Function)return n(t);
        var i = {};
        return r(n, t)
    }), s = (n.generateLabels = function (n, t, r, u) {
        var e = new Array(t);
        return labelTemplateString && i(e, function (t, i) {
            e[i] = f(n, {value: r + u * (i + 1)})
        }), e
    }, n.easingEffects = {
        linear: function (n) {
            return n
        }, easeInQuad: function (n) {
            return n * n
        }, easeOutQuad: function (n) {
            return -1 * n * (n - 2)
        }, easeInOutQuad: function (n) {
            return (n /= .5) < 1 ? .5 * n * n : -.5 * (--n * (n - 2) - 1)
        }, easeInCubic: function (n) {
            return n * n * n
        }, easeOutCubic: function (n) {
            return 1 * ((n = n / 1 - 1) * n * n + 1)
        }, easeInOutCubic: function (n) {
            return (n /= .5) < 1 ? .5 * n * n * n : .5 * ((n -= 2) * n * n + 2)
        }, easeInQuart: function (n) {
            return n * n * n * n
        }, easeOutQuart: function (n) {
            return -1 * ((n = n / 1 - 1) * n * n * n - 1)
        }, easeInOutQuart: function (n) {
            return (n /= .5) < 1 ? .5 * n * n * n * n : -.5 * ((n -= 2) * n * n * n - 2)
        }, easeInQuint: function (n) {
            return 1 * (n /= 1) * n * n * n * n
        }, easeOutQuint: function (n) {
            return 1 * ((n = n / 1 - 1) * n * n * n * n + 1)
        }, easeInOutQuint: function (n) {
            return (n /= .5) < 1 ? .5 * n * n * n * n * n : .5 * ((n -= 2) * n * n * n * n + 2)
        }, easeInSine: function (n) {
            return -1 * Math.cos(n / 1 * (Math.PI / 2)) + 1
        }, easeOutSine: function (n) {
            return 1 * Math.sin(n / 1 * (Math.PI / 2))
        }, easeInOutSine: function (n) {
            return -.5 * (Math.cos(Math.PI * n / 1) - 1)
        }, easeInExpo: function (n) {
            return 0 === n ? 1 : 1 * Math.pow(2, 10 * (n / 1 - 1))
        }, easeOutExpo: function (n) {
            return 1 === n ? 1 : 1 * (-Math.pow(2, -10 * n) + 1)
        }, easeInOutExpo: function (n) {
            return 0 === n ? 0 : 1 === n ? 1 : (n /= .5) < 1 ? .5 * Math.pow(2, 10 * (n - 1)) : .5 * (-Math.pow(2, -10 * --n) + 2)
        }, easeInCirc: function (n) {
            return n >= 1 ? n : -1 * (Math.sqrt(1 - (n /= 1) * n) - 1)
        }, easeOutCirc: function (n) {
            return 1 * Math.sqrt(1 - (n = n / 1 - 1) * n)
        }, easeInOutCirc: function (n) {
            return (n /= .5) < 1 ? -.5 * (Math.sqrt(1 - n * n) - 1) : .5 * (Math.sqrt(1 - (n -= 2) * n) + 1)
        }, easeInElastic: function (n) {
            var r = 1.70158, t = 0, i = 1;
            return 0 === n ? 0 : 1 == (n /= 1) ? 1 : (t || (t = .3), i < Math.abs(1) ? (i = 1, r = t / 4) : r = t / (2 * Math.PI) * Math.asin(1 / i), -(i * Math.pow(2, 10 * (n -= 1)) * Math.sin(2 * (1 * n - r) * Math.PI / t)))
        }, easeOutElastic: function (n) {
            var r = 1.70158, t = 0, i = 1;
            return 0 === n ? 0 : 1 == (n /= 1) ? 1 : (t || (t = .3), i < Math.abs(1) ? (i = 1, r = t / 4) : r = t / (2 * Math.PI) * Math.asin(1 / i), i * Math.pow(2, -10 * n) * Math.sin(2 * (1 * n - r) * Math.PI / t) + 1)
        }, easeInOutElastic: function (n) {
            var r = 1.70158, t = 0, i = 1;
            return 0 === n ? 0 : 2 == (n /= .5) ? 1 : (t || (t = .3 * 1.5), i < Math.abs(1) ? (i = 1, r = t / 4) : r = t / (2 * Math.PI) * Math.asin(1 / i), 1 > n ? -.5 * i * Math.pow(2, 10 * (n -= 1)) * Math.sin(2 * (1 * n - r) * Math.PI / t) : i * Math.pow(2, -10 * (n -= 1)) * Math.sin(2 * (1 * n - r) * Math.PI / t) * .5 + 1)
        }, easeInBack: function (n) {
            var t = 1.70158;
            return 1 * (n /= 1) * n * ((t + 1) * n - t)
        }, easeOutBack: function (n) {
            var t = 1.70158;
            return 1 * ((n = n / 1 - 1) * n * ((t + 1) * n + t) + 1)
        }, easeInOutBack: function (n) {
            var t = 1.70158;
            return (n /= .5) < 1 ? .5 * n * n * (((t *= 1.525) + 1) * n - t) : .5 * ((n -= 2) * n * (((t *= 1.525) + 1) * n + t) + 2)
        }, easeInBounce: function (n) {
            return 1 - s.easeOutBounce(1 - n)
        }, easeOutBounce: function (n) {
            return (n /= 1) < 1 / 2.75 ? 7.5625 * n * n : 2 / 2.75 > n ? 1 * (7.5625 * (n -= 1.5 / 2.75) * n + .75) : 2.5 / 2.75 > n ? 1 * (7.5625 * (n -= 2.25 / 2.75) * n + .9375) : 1 * (7.5625 * (n -= 2.625 / 2.75) * n + .984375)
        }, easeInOutBounce: function (n) {
            return .5 > n ? .5 * s.easeInBounce(2 * n) : .5 * s.easeOutBounce(2 * n - 1) + .5
        }
    }), k = n.requestAnimFrame = function () {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (n) {
                return window.setTimeout(n, 1e3 / 60)
            }
    }(), et = n.cancelAnimFrame = function () {
        return window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame || window.msCancelAnimationFrame || function (n) {
                return window.clearTimeout(n, 1e3 / 60)
            }
    }(), ot = (n.animationLoop = function (n, t, i, r, u, f) {
        var e = 0, h = s[i] || s.linear, o = function () {
            e++;
            var i = e / t, s = h(i);
            n.call(f, s, i, e);
            r.call(f, s, i);
            t > e ? f.animationFrame = k(o) : u.apply(f)
        };
        k(o)
    }, n.getRelativePosition = function (n) {
        var r, u, t = n.originalEvent || n, f = n.currentTarget || n.srcElement, i = f.getBoundingClientRect();
        return t.touches ? (r = t.touches[0].clientX - i.left, u = t.touches[0].clientY - i.top) : (r = t.clientX - i.left, u = t.clientY - i.top), {
            x: r,
            y: u
        }
    }, n.addEvent = function (n, t, i) {
        n.addEventListener ? n.addEventListener(t, i) : n.attachEvent ? n.attachEvent("on" + t, i) : n["on" + t] = i
    }), st = n.removeEvent = function (n, t, i) {
        n.removeEventListener ? n.removeEventListener(t, i, !1) : n.detachEvent ? n.detachEvent("on" + t, i) : n["on" + t] = a
    }, ht = (n.bindEvents = function (n, t, r) {
        n.events || (n.events = {});
        i(t, function (t) {
            n.events[t] = function () {
                r.apply(n, arguments)
            };
            ot(n.chart.canvas, t, n.events[t])
        })
    }, n.unbindEvents = function (n, t) {
        i(t, function (t, i) {
            st(n.chart.canvas, i, t)
        })
    }), ct = n.getMaximumWidth = function (n) {
        var t = n.parentNode;
        return t.clientWidth
    }, lt = n.getMaximumHeight = function (n) {
        var t = n.parentNode;
        return t.clientHeight
    }, at = (n.getMaximumSize = n.getMaximumWidth, n.retinaScale = function (n) {
        var t = n.ctx, i = n.canvas.width, r = n.canvas.height;
        window.devicePixelRatio && (t.canvas.style.width = i + "px", t.canvas.style.height = r + "px", t.canvas.height = r * window.devicePixelRatio, t.canvas.width = i * window.devicePixelRatio, t.scale(window.devicePixelRatio, window.devicePixelRatio))
    }), vt = n.clear = function (n) {
        n.ctx.clearRect(0, 0, n.width, n.height)
    }, e = n.fontString = function (n, t, i) {
        return t + " " + n + "px " + i
    }, y = n.longestText = function (n, t, r) {
        n.font = t;
        var u = 0;
        return i(r, function (t) {
            var i = n.measureText(t).width;
            u = i > u ? i : u
        }), u
    }, d = n.drawRoundedRectangle = function (n, t, i, r, u, f) {
        n.beginPath();
        n.moveTo(t + f, i);
        n.lineTo(t + r - f, i);
        n.quadraticCurveTo(t + r, i, t + r, i + f);
        n.lineTo(t + r, i + u - f);
        n.quadraticCurveTo(t + r, i + u, t + r - f, i + u);
        n.lineTo(t + f, i + u);
        n.quadraticCurveTo(t, i + u, t, i + u - f);
        n.lineTo(t, i + f);
        n.quadraticCurveTo(t, i, t + f, i);
        n.closePath()
    };
    t.instances = {};
    t.Type = function (n, i, r) {
        this.options = i;
        this.chart = r;
        this.id = it();
        t.instances[this.id] = this;
        i.responsive && this.resize();
        this.initialize.call(this, n)
    };
    r(t.Type.prototype, {
        initialize: function () {
            return this
        }, clear: function () {
            return vt(this.chart), this
        }, stop: function () {
            return et(this.animationFrame), this
        }, resize: function (n) {
            this.stop();
            var t = this.chart.canvas, i = ct(this.chart.canvas),
                r = this.options.maintainAspectRatio ? i / this.chart.aspectRatio : lt(this.chart.canvas);
            return t.width = this.chart.width = i, t.height = this.chart.height = r, at(this.chart), "function" == typeof n && n.apply(this, Array.prototype.slice.call(arguments, 1)), this
        }, reflow: a, render: function (t) {
            return t && this.reflow(), this.options.animation && !t ? n.animationLoop(this.draw, this.options.animationSteps, this.options.animationEasing, this.options.onAnimationProgress, this.options.onAnimationComplete, this) : (this.draw(), this.options.onAnimationComplete.call(this)), this
        }, generateLegend: function () {
            return f(this.options.legendTemplate, this)
        }, destroy: function () {
            this.clear();
            ht(this, this.events);
            var n = this.chart.canvas;
            n.width = this.chart.width;
            n.height = this.chart.height;
            n.style.removeProperty ? (n.style.removeProperty("width"), n.style.removeProperty("height")) : (n.style.removeAttribute("width"), n.style.removeAttribute("height"));
            delete t.instances[this.id]
        }, showTooltip: function (r, u) {
            var c, l, e, s;
            if ("undefined" == typeof this.activeElements && (this.activeElements = []), c = function (n) {
                    var t = !1;
                    return n.length !== this.activeElements.length ? t = !0 : (i(n, function (n, i) {
                        n !== this.activeElements[i] && (t = !0)
                    }, this), t)
                }.call(this, r), c || u) {
                if (this.activeElements = r, this.draw(), this.options.customTooltips && this.options.customTooltips(!1), r.length > 0)if (this.datasets && this.datasets.length > 1) {
                    for (s = this.datasets.length - 1; s >= 0 && (l = this.datasets[s].points || this.datasets[s].bars || this.datasets[s].segments, e = tt(l, r[0]), -1 === e); s--);
                    var a = [], v = [], y = function () {
                        var t, f, s, i, c, l = [], r = [], u = [];
                        return n.each(this.datasets, function (n) {
                            t = n.points || n.bars || n.segments;
                            t[e] && t[e].hasValue() && l.push(t[e])
                        }), n.each(l, function (t) {
                            r.push(t.x);
                            u.push(t.y);
                            a.push(n.template(this.options.multiTooltipTemplate, t));
                            v.push({
                                fill: t._saved.fillColor || t.fillColor,
                                stroke: t._saved.strokeColor || t.strokeColor
                            })
                        }, this), c = o(u), s = h(u), i = o(r), f = h(r), {
                            x: i > this.chart.width / 2 ? i : f,
                            y: (c + s) / 2
                        }
                    }.call(this, e);
                    new t.MultiTooltip({
                        x: y.x,
                        y: y.y,
                        xPadding: this.options.tooltipXPadding,
                        yPadding: this.options.tooltipYPadding,
                        xOffset: this.options.tooltipXOffset,
                        fillColor: this.options.tooltipFillColor,
                        textColor: this.options.tooltipFontColor,
                        fontFamily: this.options.tooltipFontFamily,
                        fontStyle: this.options.tooltipFontStyle,
                        fontSize: this.options.tooltipFontSize,
                        titleTextColor: this.options.tooltipTitleFontColor,
                        titleFontFamily: this.options.tooltipTitleFontFamily,
                        titleFontStyle: this.options.tooltipTitleFontStyle,
                        titleFontSize: this.options.tooltipTitleFontSize,
                        cornerRadius: this.options.tooltipCornerRadius,
                        labels: a,
                        legendColors: v,
                        legendColorBackground: this.options.multiTooltipKeyBackground,
                        title: r[0].label,
                        chart: this.chart,
                        ctx: this.chart.ctx,
                        custom: this.options.customTooltips
                    }).draw()
                } else i(r, function (n) {
                    var i = n.tooltipPosition();
                    new t.Tooltip({
                        x: Math.round(i.x),
                        y: Math.round(i.y),
                        xPadding: this.options.tooltipXPadding,
                        yPadding: this.options.tooltipYPadding,
                        fillColor: this.options.tooltipFillColor,
                        textColor: this.options.tooltipFontColor,
                        fontFamily: this.options.tooltipFontFamily,
                        fontStyle: this.options.tooltipFontStyle,
                        fontSize: this.options.tooltipFontSize,
                        caretHeight: this.options.tooltipCaretSize,
                        cornerRadius: this.options.tooltipCornerRadius,
                        text: f(this.options.tooltipTemplate, n),
                        chart: this.chart,
                        custom: this.options.customTooltips
                    }).draw()
                }, this);
                return this
            }
        }, toBase64Image: function () {
            return this.chart.canvas.toDataURL.apply(this.chart.canvas, arguments)
        }
    });
    t.Type.extend = function (n) {
        var i = this, u = function () {
            return i.apply(this, arguments)
        }, f, e;
        return (u.prototype = l(i.prototype), r(u.prototype, n), u.extend = t.Type.extend, n.name || i.prototype.name) ? (f = n.name || i.prototype.name, e = t.defaults[i.prototype.name] ? l(t.defaults[i.prototype.name]) : {}, t.defaults[f] = r(e, n.defaults), t.types[f] = u, t.prototype[f] = function (n, i) {
            var r = nt(t.defaults.global, t.defaults[f], i || {});
            return new u(n, r, this)
        }) : rt("Name not provided for this chart, so it hasn't been registered"), i
    };
    t.Element = function (n) {
        r(this, n);
        this.initialize.apply(this, arguments);
        this.save()
    };
    r(t.Element.prototype, {
        initialize: function () {
        }, restore: function (n) {
            return n ? i(n, function (n) {
                this[n] = this._saved[n]
            }, this) : r(this, this._saved), this
        }, save: function () {
            return this._saved = l(this), delete this._saved._saved, this
        }, update: function (n) {
            return i(n, function (n, t) {
                this._saved[t] = this[t];
                this[t] = n
            }, this), this
        }, transition: function (n, t) {
            return i(n, function (n, i) {
                this[i] = (n - this._saved[i]) * t + this._saved[i]
            }, this), this
        }, tooltipPosition: function () {
            return {x: this.x, y: this.y}
        }, hasValue: function () {
            return u(this.value)
        }
    });
    t.Element.extend = p;
    t.Point = t.Element.extend({
        display: !0, inRange: function (n, t) {
            var i = this.hitDetectionRadius + this.radius;
            return Math.pow(n - this.x, 2) + Math.pow(t - this.y, 2) < Math.pow(i, 2)
        }, draw: function () {
            if (this.display) {
                var n = this.ctx;
                n.beginPath();
                n.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
                n.closePath();
                n.strokeStyle = this.strokeColor;
                n.lineWidth = this.strokeWidth;
                n.fillStyle = this.fillColor;
                n.fill();
                n.stroke()
            }
        }
    });
    t.Arc = t.Element.extend({
        inRange: function (t, i) {
            var r = n.getAngleFromPoint(this, {x: t, y: i}), u = r.angle >= this.startAngle && r.angle <= this.endAngle,
                f = r.distance >= this.innerRadius && r.distance <= this.outerRadius;
            return u && f
        }, tooltipPosition: function () {
            var n = this.startAngle + (this.endAngle - this.startAngle) / 2,
                t = (this.outerRadius - this.innerRadius) / 2 + this.innerRadius;
            return {x: this.x + Math.cos(n) * t, y: this.y + Math.sin(n) * t}
        }, draw: function () {
            var n = this.ctx;
            n.beginPath();
            n.arc(this.x, this.y, this.outerRadius, this.startAngle, this.endAngle);
            n.arc(this.x, this.y, this.innerRadius, this.endAngle, this.startAngle, !0);
            n.closePath();
            n.strokeStyle = this.strokeColor;
            n.lineWidth = this.strokeWidth;
            n.fillStyle = this.fillColor;
            n.fill();
            n.lineJoin = "bevel";
            this.showStroke && n.stroke()
        }
    });
    t.Rectangle = t.Element.extend({
        draw: function () {
            var n = this.ctx, f = this.width / 2, t = this.x - f, i = this.x + f, r = this.base - (this.base - this.y),
                u = this.strokeWidth / 2;
            this.showStroke && (t += u, i -= u, r += u);
            n.beginPath();
            n.fillStyle = this.fillColor;
            n.strokeStyle = this.strokeColor;
            n.lineWidth = this.strokeWidth;
            n.moveTo(t, this.base);
            n.lineTo(t, r);
            n.lineTo(i, r);
            n.lineTo(i, this.base);
            n.fill();
            this.showStroke && n.stroke()
        }, height: function () {
            return this.base - this.y
        }, inRange: function (n, t) {
            return n >= this.x - this.width / 2 && n <= this.x + this.width / 2 && t >= this.y && t <= this.base
        }
    });
    t.Tooltip = t.Element.extend({
        draw: function () {
            var n = this.chart.ctx, r, u;
            n.font = e(this.fontSize, this.fontStyle, this.fontFamily);
            this.xAlign = "center";
            this.yAlign = "above";
            var t = this.caretPadding = 2, i = n.measureText(this.text).width + 2 * this.xPadding,
                f = this.fontSize + 2 * this.yPadding, o = f + this.caretHeight + t;
            if (this.x + i / 2 > this.chart.width ? this.xAlign = "left" : this.x - i / 2 < 0 && (this.xAlign = "right"), this.y - o < 0 && (this.yAlign = "below"), r = this.x - i / 2, u = this.y - o, n.fillStyle = this.fillColor, this.custom) this.custom(this); else {
                switch (this.yAlign) {
                    case"above":
                        n.beginPath();
                        n.moveTo(this.x, this.y - t);
                        n.lineTo(this.x + this.caretHeight, this.y - (t + this.caretHeight));
                        n.lineTo(this.x - this.caretHeight, this.y - (t + this.caretHeight));
                        n.closePath();
                        n.fill();
                        break;
                    case"below":
                        u = this.y + t + this.caretHeight;
                        n.beginPath();
                        n.moveTo(this.x, this.y + t);
                        n.lineTo(this.x + this.caretHeight, this.y + t + this.caretHeight);
                        n.lineTo(this.x - this.caretHeight, this.y + t + this.caretHeight);
                        n.closePath();
                        n.fill()
                }
                switch (this.xAlign) {
                    case"left":
                        r = this.x - i + (this.cornerRadius + this.caretHeight);
                        break;
                    case"right":
                        r = this.x - (this.cornerRadius + this.caretHeight)
                }
                d(n, r, u, i, f, this.cornerRadius);
                n.fill();
                n.fillStyle = this.textColor;
                n.textAlign = "center";
                n.textBaseline = "middle";
                n.fillText(this.text, r + i / 2, u + f / 2)
            }
        }
    });
    t.MultiTooltip = t.Element.extend({
        initialize: function () {
            var n;
            this.font = e(this.fontSize, this.fontStyle, this.fontFamily);
            this.titleFont = e(this.titleFontSize, this.titleFontStyle, this.titleFontFamily);
            this.height = this.labels.length * this.fontSize + (this.labels.length - 1) * (this.fontSize / 2) + 2 * this.yPadding + 1.5 * this.titleFontSize;
            this.ctx.font = this.titleFont;
            var t = this.ctx.measureText(this.title).width, i = y(this.ctx, this.font, this.labels) + this.fontSize + 3,
                r = h([i, t]);
            this.width = r + 2 * this.xPadding;
            n = this.height / 2;
            this.y - n < 0 ? this.y = n : this.y + n > this.chart.height && (this.y = this.chart.height - n);
            this.x > this.chart.width / 2 ? this.x -= this.xOffset + this.width : this.x += this.xOffset
        }, getLineHeight: function (n) {
            var t = this.y - this.height / 2 + this.yPadding, i = n - 1;
            return 0 === n ? t + this.titleFontSize / 2 : t + (1.5 * this.fontSize * i + this.fontSize / 2) + 1.5 * this.titleFontSize
        }, draw: function () {
            if (this.custom) this.custom(this); else {
                d(this.ctx, this.x, this.y - this.height / 2, this.width, this.height, this.cornerRadius);
                var t = this.ctx;
                t.fillStyle = this.fillColor;
                t.fill();
                t.closePath();
                t.textAlign = "left";
                t.textBaseline = "middle";
                t.fillStyle = this.titleTextColor;
                t.font = this.titleFont;
                t.fillText(this.title, this.x + this.xPadding, this.getLineHeight(0));
                t.font = this.font;
                n.each(this.labels, function (n, i) {
                    t.fillStyle = this.textColor;
                    t.fillText(n, this.x + this.xPadding + this.fontSize + 3, this.getLineHeight(i + 1));
                    t.fillStyle = this.legendColorBackground;
                    t.fillRect(this.x + this.xPadding, this.getLineHeight(i + 1) - this.fontSize / 2, this.fontSize, this.fontSize);
                    t.fillStyle = this.legendColors[i].fill;
                    t.fillRect(this.x + this.xPadding, this.getLineHeight(i + 1) - this.fontSize / 2, this.fontSize, this.fontSize)
                }, this)
            }
        }
    });
    t.Scale = t.Element.extend({
        initialize: function () {
            this.fit()
        }, buildYLabels: function () {
            this.yLabels = [];
            for (var t = w(this.stepValue),
                     n = 0; n <= this.steps; n++)this.yLabels.push(f(this.templateString, {value: (this.min + n * this.stepValue).toFixed(t)}));
            this.yLabelWidth = this.display && this.showLabels ? y(this.ctx, this.font, this.yLabels) : 0
        }, addXLabel: function (n) {
            this.xLabels.push(n);
            this.valuesCount++;
            this.fit()
        }, removeXLabel: function () {
            this.xLabels.shift();
            this.valuesCount--;
            this.fit()
        }, fit: function () {
            this.startPoint = this.display ? this.fontSize : 0;
            this.endPoint = this.display ? this.height - 1.5 * this.fontSize - 5 : this.height;
            this.startPoint += this.padding;
            this.endPoint -= this.padding;
            var t, n = this.endPoint - this.startPoint;
            for (this.calculateYRange(n), this.buildYLabels(), this.calculateXLabelRotation(); n > this.endPoint - this.startPoint;)n = this.endPoint - this.startPoint, t = this.yLabelWidth, this.calculateYRange(n), this.buildYLabels(), t < this.yLabelWidth && this.calculateXLabelRotation()
        }, calculateXLabelRotation: function () {
            var r, e, n, u, t, i, f;
            if (this.ctx.font = this.font, n = this.ctx.measureText(this.xLabels[0]).width, u = this.ctx.measureText(this.xLabels[this.xLabels.length - 1]).width, this.xScalePaddingRight = u / 2 + 3, this.xScalePaddingLeft = n / 2 > this.yLabelWidth + 10 ? n / 2 : this.yLabelWidth + 10, this.xLabelRotation = 0, this.display) {
                for (i = y(this.ctx, this.font, this.xLabels), this.xLabelWidth = i, f = Math.floor(this.calculateX(1) - this.calculateX(0)) - 6; this.xLabelWidth > f && 0 === this.xLabelRotation || this.xLabelWidth > f && this.xLabelRotation <= 90 && this.xLabelRotation > 0;)t = Math.cos(v(this.xLabelRotation)), r = t * n, e = t * u, r + this.fontSize / 2 > this.yLabelWidth + 8 && (this.xScalePaddingLeft = r + this.fontSize / 2), this.xScalePaddingRight = this.fontSize / 2, this.xLabelRotation++, this.xLabelWidth = t * i;
                this.xLabelRotation > 0 && (this.endPoint -= Math.sin(v(this.xLabelRotation)) * i + 3)
            } else this.xLabelWidth = 0, this.xScalePaddingRight = this.padding, this.xScalePaddingLeft = this.padding
        }, calculateYRange: a, drawingArea: function () {
            return this.startPoint - this.endPoint
        }, calculateY: function (n) {
            var t = this.drawingArea() / (this.min - this.max);
            return this.endPoint - t * (n - this.min)
        }, calculateX: function (n) {
            var r = (this.xLabelRotation > 0, this.width - (this.xScalePaddingLeft + this.xScalePaddingRight)),
                t = r / Math.max(this.valuesCount - (this.offsetGridLines ? 0 : 1), 1),
                i = t * n + this.xScalePaddingLeft;
            return this.offsetGridLines && (i += t / 2), Math.round(i)
        }, update: function (t) {
            n.extend(this, t);
            this.fit()
        }, draw: function () {
            var t = this.ctx, u = (this.endPoint - this.startPoint) / this.steps,
                r = Math.round(this.xScalePaddingLeft);
            this.display && (t.fillStyle = this.textColor, t.font = this.font, i(this.yLabels, function (i, f) {
                var s = this.endPoint - u * f, e = Math.round(s), o = this.showHorizontalLines;
                t.textAlign = "right";
                t.textBaseline = "middle";
                this.showLabels && t.fillText(i, r - 10, s);
                0 !== f || o || (o = !0);
                o && t.beginPath();
                f > 0 ? (t.lineWidth = this.gridLineWidth, t.strokeStyle = this.gridLineColor) : (t.lineWidth = this.lineWidth, t.strokeStyle = this.lineColor);
                e += n.aliasPixel(t.lineWidth);
                o && (t.moveTo(r, e), t.lineTo(this.width, e), t.stroke(), t.closePath());
                t.lineWidth = this.lineWidth;
                t.strokeStyle = this.lineColor;
                t.beginPath();
                t.moveTo(r - 5, e);
                t.lineTo(r, e);
                t.stroke();
                t.closePath()
            }, this), i(this.xLabels, function (n, i) {
                var e = this.calculateX(i) + b(this.lineWidth),
                    r = this.calculateX(i - (this.offsetGridLines ? .5 : 0)) + b(this.lineWidth),
                    f = this.xLabelRotation > 0, u = this.showVerticalLines;
                0 !== i || u || (u = !0);
                u && t.beginPath();
                i > 0 ? (t.lineWidth = this.gridLineWidth, t.strokeStyle = this.gridLineColor) : (t.lineWidth = this.lineWidth, t.strokeStyle = this.lineColor);
                u && (t.moveTo(r, this.endPoint), t.lineTo(r, this.startPoint - 3), t.stroke(), t.closePath());
                t.lineWidth = this.lineWidth;
                t.strokeStyle = this.lineColor;
                t.beginPath();
                t.moveTo(r, this.endPoint);
                t.lineTo(r, this.endPoint + 5);
                t.stroke();
                t.closePath();
                t.save();
                t.translate(e, f ? this.endPoint + 12 : this.endPoint + 8);
                t.rotate(-1 * v(this.xLabelRotation));
                t.font = this.font;
                t.textAlign = f ? "right" : "center";
                t.textBaseline = f ? "middle" : "top";
                t.fillText(n, 0, 0);
                t.restore()
            }, this))
        }
    });
    t.RadialScale = t.Element.extend({
        initialize: function () {
            this.size = o([this.height, this.width]);
            this.drawingArea = this.display ? this.size / 2 - (this.fontSize / 2 + this.backdropPaddingY) : this.size / 2
        }, calculateCenterOffset: function (n) {
            var t = this.drawingArea / (this.max - this.min);
            return (n - this.min) * t
        }, update: function () {
            this.lineArc ? this.drawingArea = this.display ? this.size / 2 - (this.fontSize / 2 + this.backdropPaddingY) : this.size / 2 : this.setScaleSize();
            this.buildYLabels()
        }, buildYLabels: function () {
            this.yLabels = [];
            for (var t = w(this.stepValue),
                     n = 0; n <= this.steps; n++)this.yLabels.push(f(this.templateString, {value: (this.min + n * this.stepValue).toFixed(t)}))
        }, getCircumference: function () {
            return 2 * Math.PI / this.valuesCount
        }, setScaleSize: function () {
            var t, n, i, h, a, y, v, p, w, b, r, s,
                k = o([this.height / 2 - this.pointLabelFontSize - 5, this.width / 2]), c = this.width, l = 0;
            for (this.ctx.font = e(this.pointLabelFontSize, this.pointLabelFontStyle, this.pointLabelFontFamily), n = 0; n < this.valuesCount; n++)t = this.getPointPosition(n, k), i = this.ctx.measureText(f(this.templateString, {value: this.labels[n]})).width + 5, 0 === n || n === this.valuesCount / 2 ? (h = i / 2, t.x + h > c && (c = t.x + h, a = n), t.x - h < l && (l = t.x - h, v = n)) : n < this.valuesCount / 2 ? t.x + i > c && (c = t.x + i, a = n) : n > this.valuesCount / 2 && t.x - i < l && (l = t.x - i, v = n);
            w = l;
            b = Math.ceil(c - this.width);
            y = this.getIndexAngle(a);
            p = this.getIndexAngle(v);
            r = b / Math.sin(y + Math.PI / 2);
            s = w / Math.sin(p + Math.PI / 2);
            r = u(r) ? r : 0;
            s = u(s) ? s : 0;
            this.drawingArea = k - (s + r) / 2;
            this.setCenterPoint(s, r)
        }, setCenterPoint: function (n, t) {
            var i = this.width - t - this.drawingArea, r = n + this.drawingArea;
            this.xCenter = (r + i) / 2;
            this.yCenter = this.height / 2
        }, getIndexAngle: function (n) {
            var t = 2 * Math.PI / this.valuesCount;
            return n * t - Math.PI / 2
        }, getPointPosition: function (n, t) {
            var i = this.getIndexAngle(n);
            return {x: Math.cos(i) * t + this.xCenter, y: Math.sin(i) * t + this.yCenter}
        }, draw: function () {
            var n, t, u, f;
            if (this.display && (n = this.ctx, i(this.yLabels, function (t, i) {
                    var r, f, o, u, s;
                    if (i > 0) {
                        if (f = i * (this.drawingArea / this.steps), o = this.yCenter - f, this.lineWidth > 0)if (n.strokeStyle = this.lineColor, n.lineWidth = this.lineWidth, this.lineArc) n.beginPath(), n.arc(this.xCenter, this.yCenter, f, 0, 2 * Math.PI), n.closePath(), n.stroke(); else {
                            for (n.beginPath(), u = 0; u < this.valuesCount; u++)r = this.getPointPosition(u, this.calculateCenterOffset(this.min + i * this.stepValue)), 0 === u ? n.moveTo(r.x, r.y) : n.lineTo(r.x, r.y);
                            n.closePath();
                            n.stroke()
                        }
                        this.showLabels && ((n.font = e(this.fontSize, this.fontStyle, this.fontFamily), this.showLabelBackdrop) && (s = n.measureText(t).width, n.fillStyle = this.backdropColor, n.fillRect(this.xCenter - s / 2 - this.backdropPaddingX, o - this.fontSize / 2 - this.backdropPaddingY, s + 2 * this.backdropPaddingX, this.fontSize + 2 * this.backdropPaddingY)), n.textAlign = "center", n.textBaseline = "middle", n.fillStyle = this.fontColor, n.fillText(t, this.xCenter, o))
                    }
                }, this), !this.lineArc))for (n.lineWidth = this.angleLineWidth, n.strokeStyle = this.angleLineColor, t = this.valuesCount - 1; t >= 0; t--) {
                this.angleLineWidth > 0 && (u = this.getPointPosition(t, this.calculateCenterOffset(this.max)), n.beginPath(), n.moveTo(this.xCenter, this.yCenter), n.lineTo(u.x, u.y), n.stroke(), n.closePath());
                f = this.getPointPosition(t, this.calculateCenterOffset(this.max) + 5);
                n.font = e(this.pointLabelFontSize, this.pointLabelFontStyle, this.pointLabelFontFamily);
                n.fillStyle = this.pointLabelFontColor;
                var s = this.labels.length, o = this.labels.length / 2, r = o / 2, h = r > t || t > s - r,
                    c = t === r || t === s - r;
                n.textAlign = 0 === t ? "center" : t === o ? "center" : o > t ? "left" : "right";
                n.textBaseline = c ? "middle" : h ? "bottom" : "top";
                n.fillText(this.labels[t], f.x, f.y)
            }
        }
    });
    n.addEvent(window, "resize", function () {
        var n;
        return function () {
            clearTimeout(n);
            n = setTimeout(function () {
                i(t.instances, function (n) {
                    n.options.responsive && n.resize(n.render, !0)
                })
            }, 50)
        }
    }());
    ut ? define(function () {
        return t
    }) : "object" == typeof module && module.exports && (module.exports = t);
    c.Chart = t;
    t.noConflict = function () {
        return c.Chart = g, t
    }
}).call(this), function () {
    "use strict";
    var i = this, t = i.Chart, n = t.helpers;
    t.Type.extend({
        name: "Bar",
        defaults: {
            scaleBeginAtZero: !0,
            scaleShowGridLines: !0,
            scaleGridLineColor: "rgba(0,0,0,.05)",
            scaleGridLineWidth: 1,
            scaleShowHorizontalLines: !0,
            scaleShowVerticalLines: !0,
            barShowStroke: !0,
            barStrokeWidth: 2,
            barValueSpacing: 5,
            barDatasetSpacing: 1,
            legendTemplate: '<ul class="<%=name.toLowerCase()%>-legend"><% for (var i=0; i<datasets.length; i++){%><li><span style="background-color:<%=datasets[i].fillColor%>"><\/span><%if(datasets[i].label){%><%=datasets[i].label%><%}%><\/li><%}%><\/ul>'
        },
        initialize: function (i) {
            var r = this.options;
            this.ScaleClass = t.Scale.extend({
                offsetGridLines: !0, calculateBarX: function (n, t, i) {
                    var f = this.calculateBaseWidth(), e = this.calculateX(i) - f / 2, u = this.calculateBarWidth(n);
                    return e + u * t + t * r.barDatasetSpacing + u / 2
                }, calculateBaseWidth: function () {
                    return this.calculateX(1) - this.calculateX(0) - 2 * r.barValueSpacing
                }, calculateBarWidth: function (n) {
                    var t = this.calculateBaseWidth() - (n - 1) * r.barDatasetSpacing;
                    return t / n
                }
            });
            this.datasets = [];
            this.options.showTooltips && n.bindEvents(this, this.options.tooltipEvents, function (t) {
                var i = "mouseout" !== t.type ? this.getBarsAtEvent(t) : [];
                this.eachBars(function (n) {
                    n.restore(["fillColor", "strokeColor"])
                });
                n.each(i, function (n) {
                    n.fillColor = n.highlightFill;
                    n.strokeColor = n.highlightStroke
                });
                this.showTooltip(i)
            });
            this.BarClass = t.Rectangle.extend({
                strokeWidth: this.options.barStrokeWidth,
                showStroke: this.options.barShowStroke,
                ctx: this.chart.ctx
            });
            n.each(i.datasets, function (t) {
                var r = {label: t.label || null, fillColor: t.fillColor, strokeColor: t.strokeColor, bars: []};
                this.datasets.push(r);
                n.each(t.data, function (n, u) {
                    r.bars.push(new this.BarClass({
                        value: n,
                        label: i.labels[u],
                        datasetLabel: t.label,
                        strokeColor: t.strokeColor,
                        fillColor: t.fillColor,
                        highlightFill: t.highlightFill || t.fillColor,
                        highlightStroke: t.highlightStroke || t.strokeColor
                    }))
                }, this)
            }, this);
            this.buildScale(i.labels);
            this.BarClass.prototype.base = this.scale.endPoint;
            this.eachBars(function (t, i, r) {
                n.extend(t, {
                    width: this.scale.calculateBarWidth(this.datasets.length),
                    x: this.scale.calculateBarX(this.datasets.length, r, i),
                    y: this.scale.endPoint
                });
                t.save()
            }, this);
            this.render()
        },
        update: function () {
            this.scale.update();
            n.each(this.activeElements, function (n) {
                n.restore(["fillColor", "strokeColor"])
            });
            this.eachBars(function (n) {
                n.save()
            });
            this.render()
        },
        eachBars: function (t) {
            n.each(this.datasets, function (i, r) {
                n.each(i.bars, t, this, r)
            }, this)
        },
        getBarsAtEvent: function (t) {
            for (var i, u = [], f = n.getRelativePosition(t), e = function (n) {
                    u.push(n.bars[i])
                },
                     r = 0; r < this.datasets.length; r++)for (i = 0; i < this.datasets[r].bars.length; i++)if (this.datasets[r].bars[i].inRange(f.x, f.y))return n.each(this.datasets, e), u;
            return u
        },
        buildScale: function (t) {
            var r = this, u = function () {
                var n = [];
                return r.eachBars(function (t) {
                    n.push(t.value)
                }), n
            }, i = {
                templateString: this.options.scaleLabel,
                height: this.chart.height,
                width: this.chart.width,
                ctx: this.chart.ctx,
                textColor: this.options.scaleFontColor,
                fontSize: this.options.scaleFontSize,
                fontStyle: this.options.scaleFontStyle,
                fontFamily: this.options.scaleFontFamily,
                valuesCount: t.length,
                beginAtZero: this.options.scaleBeginAtZero,
                integersOnly: this.options.scaleIntegersOnly,
                calculateYRange: function (t) {
                    var i = n.calculateScaleRange(u(), t, this.fontSize, this.beginAtZero, this.integersOnly);
                    n.extend(this, i)
                },
                xLabels: t,
                font: n.fontString(this.options.scaleFontSize, this.options.scaleFontStyle, this.options.scaleFontFamily),
                lineWidth: this.options.scaleLineWidth,
                lineColor: this.options.scaleLineColor,
                showHorizontalLines: this.options.scaleShowHorizontalLines,
                showVerticalLines: this.options.scaleShowVerticalLines,
                gridLineWidth: this.options.scaleShowGridLines ? this.options.scaleGridLineWidth : 0,
                gridLineColor: this.options.scaleShowGridLines ? this.options.scaleGridLineColor : "rgba(0,0,0,0)",
                padding: this.options.showScale ? 0 : this.options.barShowStroke ? this.options.barStrokeWidth : 0,
                showLabels: this.options.scaleShowLabels,
                display: this.options.showScale
            };
            this.options.scaleOverride && n.extend(i, {
                calculateYRange: n.noop,
                steps: this.options.scaleSteps,
                stepValue: this.options.scaleStepWidth,
                min: this.options.scaleStartValue,
                max: this.options.scaleStartValue + this.options.scaleSteps * this.options.scaleStepWidth
            });
            this.scale = new this.ScaleClass(i)
        },
        addData: function (t, i) {
            n.each(t, function (n, t) {
                this.datasets[t].bars.push(new this.BarClass({
                    value: n,
                    label: i,
                    x: this.scale.calculateBarX(this.datasets.length, t, this.scale.valuesCount + 1),
                    y: this.scale.endPoint,
                    width: this.scale.calculateBarWidth(this.datasets.length),
                    base: this.scale.endPoint,
                    strokeColor: this.datasets[t].strokeColor,
                    fillColor: this.datasets[t].fillColor
                }))
            }, this);
            this.scale.addXLabel(i);
            this.update()
        },
        removeData: function () {
            this.scale.removeXLabel();
            n.each(this.datasets, function (n) {
                n.bars.shift()
            }, this);
            this.update()
        },
        reflow: function () {
            n.extend(this.BarClass.prototype, {y: this.scale.endPoint, base: this.scale.endPoint});
            var t = n.extend({height: this.chart.height, width: this.chart.width});
            this.scale.update(t)
        },
        draw: function (t) {
            var i = t || 1;
            this.clear();
            this.chart.ctx;
            this.scale.draw(i);
            n.each(this.datasets, function (t, r) {
                n.each(t.bars, function (n, t) {
                    n.hasValue() && (n.base = this.scale.endPoint, n.transition({
                        x: this.scale.calculateBarX(this.datasets.length, r, t),
                        y: this.scale.calculateY(n.value),
                        width: this.scale.calculateBarWidth(this.datasets.length)
                    }, i).draw())
                }, this)
            }, this)
        }
    })
}.call(this), function () {
    "use strict";
    var r = this, t = r.Chart, n = t.helpers, i = {
        segmentShowStroke: !0,
        segmentStrokeColor: "#fff",
        segmentStrokeWidth: 2,
        percentageInnerCutout: 50,
        animationSteps: 100,
        animationEasing: "easeOutBounce",
        animateRotate: !0,
        animateScale: !1,
        legendTemplate: '<ul class="<%=name.toLowerCase()%>-legend"><% for (var i=0; i<segments.length; i++){%><li><span style="background-color:<%=segments[i].fillColor%>"><\/span><%if(segments[i].label){%><%=segments[i].label%><%}%><\/li><%}%><\/ul>'
    };
    t.Type.extend({
        name: "Doughnut", defaults: i, initialize: function (i) {
            this.segments = [];
            this.outerRadius = (n.min([this.chart.width, this.chart.height]) - this.options.segmentStrokeWidth / 2) / 2;
            this.SegmentArc = t.Arc.extend({ctx: this.chart.ctx, x: this.chart.width / 2, y: this.chart.height / 2});
            this.options.showTooltips && n.bindEvents(this, this.options.tooltipEvents, function (t) {
                var i = "mouseout" !== t.type ? this.getSegmentsAtEvent(t) : [];
                n.each(this.segments, function (n) {
                    n.restore(["fillColor"])
                });
                n.each(i, function (n) {
                    n.fillColor = n.highlightColor
                });
                this.showTooltip(i)
            });
            this.calculateTotal(i);
            n.each(i, function (n, t) {
                this.addData(n, t, !0)
            }, this);
            this.render()
        }, getSegmentsAtEvent: function (t) {
            var i = [], r = n.getRelativePosition(t);
            return n.each(this.segments, function (n) {
                n.inRange(r.x, r.y) && i.push(n)
            }, this), i
        }, addData: function (n, t, i) {
            var r = t || this.segments.length;
            this.segments.splice(r, 0, new this.SegmentArc({
                value: n.value,
                outerRadius: this.options.animateScale ? 0 : this.outerRadius,
                innerRadius: this.options.animateScale ? 0 : this.outerRadius / 100 * this.options.percentageInnerCutout,
                fillColor: n.color,
                highlightColor: n.highlight || n.color,
                showStroke: this.options.segmentShowStroke,
                strokeWidth: this.options.segmentStrokeWidth,
                strokeColor: this.options.segmentStrokeColor,
                startAngle: 1.5 * Math.PI,
                circumference: this.options.animateRotate ? 0 : this.calculateCircumference(n.value),
                label: n.label
            }));
            i || (this.reflow(), this.update())
        }, calculateCircumference: function (n) {
            return 2 * Math.PI * (Math.abs(n) / this.total)
        }, calculateTotal: function (t) {
            this.total = 0;
            n.each(t, function (n) {
                this.total += Math.abs(n.value)
            }, this)
        }, update: function () {
            this.calculateTotal(this.segments);
            n.each(this.activeElements, function (n) {
                n.restore(["fillColor"])
            });
            n.each(this.segments, function (n) {
                n.save()
            });
            this.render()
        }, removeData: function (t) {
            var i = n.isNumber(t) ? t : this.segments.length - 1;
            this.segments.splice(i, 1);
            this.reflow();
            this.update()
        }, reflow: function () {
            n.extend(this.SegmentArc.prototype, {x: this.chart.width / 2, y: this.chart.height / 2});
            this.outerRadius = (n.min([this.chart.width, this.chart.height]) - this.options.segmentStrokeWidth / 2) / 2;
            n.each(this.segments, function (n) {
                n.update({
                    outerRadius: this.outerRadius,
                    innerRadius: this.outerRadius / 100 * this.options.percentageInnerCutout
                })
            }, this)
        }, draw: function (t) {
            var i = t ? t : 1;
            this.clear();
            n.each(this.segments, function (n, t) {
                n.transition({
                    circumference: this.calculateCircumference(n.value),
                    outerRadius: this.outerRadius,
                    innerRadius: this.outerRadius / 100 * this.options.percentageInnerCutout
                }, i);
                n.endAngle = n.startAngle + n.circumference;
                n.draw();
                0 === t && (n.startAngle = 1.5 * Math.PI);
                t < this.segments.length - 1 && (this.segments[t + 1].startAngle = n.endAngle)
            }, this)
        }
    });
    t.types.Doughnut.extend({name: "Pie", defaults: n.merge(i, {percentageInnerCutout: 0})})
}.call(this), function () {
    "use strict";
    var i = this, t = i.Chart, n = t.helpers;
    t.Type.extend({
        name: "Line",
        defaults: {
            scaleShowGridLines: !0,
            scaleGridLineColor: "rgba(0,0,0,.05)",
            scaleGridLineWidth: 1,
            scaleShowHorizontalLines: !0,
            scaleShowVerticalLines: !0,
            bezierCurve: !0,
            bezierCurveTension: .4,
            pointDot: !0,
            pointDotRadius: 4,
            pointDotStrokeWidth: 1,
            pointHitDetectionRadius: 20,
            datasetStroke: !0,
            datasetStrokeWidth: 2,
            datasetFill: !0,
            legendTemplate: '<ul class="<%=name.toLowerCase()%>-legend"><% for (var i=0; i<datasets.length; i++){%><li><span style="background-color:<%=datasets[i].strokeColor%>"><\/span><%if(datasets[i].label){%><%=datasets[i].label%><%}%><\/li><%}%><\/ul>'
        },
        initialize: function (i) {
            this.PointClass = t.Point.extend({
                strokeWidth: this.options.pointDotStrokeWidth,
                radius: this.options.pointDotRadius,
                display: this.options.pointDot,
                hitDetectionRadius: this.options.pointHitDetectionRadius,
                ctx: this.chart.ctx,
                inRange: function (n) {
                    return Math.pow(n - this.x, 2) < Math.pow(this.radius + this.hitDetectionRadius, 2)
                }
            });
            this.datasets = [];
            this.options.showTooltips && n.bindEvents(this, this.options.tooltipEvents, function (t) {
                var i = "mouseout" !== t.type ? this.getPointsAtEvent(t) : [];
                this.eachPoints(function (n) {
                    n.restore(["fillColor", "strokeColor"])
                });
                n.each(i, function (n) {
                    n.fillColor = n.highlightFill;
                    n.strokeColor = n.highlightStroke
                });
                this.showTooltip(i)
            });
            n.each(i.datasets, function (t) {
                var r = {
                    label: t.label || null,
                    fillColor: t.fillColor,
                    strokeColor: t.strokeColor,
                    pointColor: t.pointColor,
                    pointStrokeColor: t.pointStrokeColor,
                    points: []
                };
                this.datasets.push(r);
                n.each(t.data, function (n, u) {
                    r.points.push(new this.PointClass({
                        value: n,
                        label: i.labels[u],
                        datasetLabel: t.label,
                        strokeColor: t.pointStrokeColor,
                        fillColor: t.pointColor,
                        highlightFill: t.pointHighlightFill || t.pointColor,
                        highlightStroke: t.pointHighlightStroke || t.pointStrokeColor
                    }))
                }, this);
                this.buildScale(i.labels);
                this.eachPoints(function (t, i) {
                    n.extend(t, {x: this.scale.calculateX(i), y: this.scale.endPoint});
                    t.save()
                }, this)
            }, this);
            this.render()
        },
        update: function () {
            this.scale.update();
            n.each(this.activeElements, function (n) {
                n.restore(["fillColor", "strokeColor"])
            });
            this.eachPoints(function (n) {
                n.save()
            });
            this.render()
        },
        eachPoints: function (t) {
            n.each(this.datasets, function (i) {
                n.each(i.points, t, this)
            }, this)
        },
        getPointsAtEvent: function (t) {
            var i = [], r = n.getRelativePosition(t);
            return n.each(this.datasets, function (t) {
                n.each(t.points, function (n) {
                    n.inRange(r.x, r.y) && i.push(n)
                })
            }, this), i
        },
        buildScale: function (i) {
            var u = this, f = function () {
                var n = [];
                return u.eachPoints(function (t) {
                    n.push(t.value)
                }), n
            }, r = {
                templateString: this.options.scaleLabel,
                height: this.chart.height,
                width: this.chart.width,
                ctx: this.chart.ctx,
                textColor: this.options.scaleFontColor,
                fontSize: this.options.scaleFontSize,
                fontStyle: this.options.scaleFontStyle,
                fontFamily: this.options.scaleFontFamily,
                valuesCount: i.length,
                beginAtZero: this.options.scaleBeginAtZero,
                integersOnly: this.options.scaleIntegersOnly,
                calculateYRange: function (t) {
                    var i = n.calculateScaleRange(f(), t, this.fontSize, this.beginAtZero, this.integersOnly);
                    n.extend(this, i)
                },
                xLabels: i,
                font: n.fontString(this.options.scaleFontSize, this.options.scaleFontStyle, this.options.scaleFontFamily),
                lineWidth: this.options.scaleLineWidth,
                lineColor: this.options.scaleLineColor,
                showHorizontalLines: this.options.scaleShowHorizontalLines,
                showVerticalLines: this.options.scaleShowVerticalLines,
                gridLineWidth: this.options.scaleShowGridLines ? this.options.scaleGridLineWidth : 0,
                gridLineColor: this.options.scaleShowGridLines ? this.options.scaleGridLineColor : "rgba(0,0,0,0)",
                padding: this.options.showScale ? 0 : this.options.pointDotRadius + this.options.pointDotStrokeWidth,
                showLabels: this.options.scaleShowLabels,
                display: this.options.showScale
            };
            this.options.scaleOverride && n.extend(r, {
                calculateYRange: n.noop,
                steps: this.options.scaleSteps,
                stepValue: this.options.scaleStepWidth,
                min: this.options.scaleStartValue,
                max: this.options.scaleStartValue + this.options.scaleSteps * this.options.scaleStepWidth
            });
            this.scale = new t.Scale(r)
        },
        addData: function (t, i) {
            n.each(t, function (n, t) {
                this.datasets[t].points.push(new this.PointClass({
                    value: n,
                    label: i,
                    x: this.scale.calculateX(this.scale.valuesCount + 1),
                    y: this.scale.endPoint,
                    strokeColor: this.datasets[t].pointStrokeColor,
                    fillColor: this.datasets[t].pointColor
                }))
            }, this);
            this.scale.addXLabel(i);
            this.update()
        },
        removeData: function () {
            this.scale.removeXLabel();
            n.each(this.datasets, function (n) {
                n.points.shift()
            }, this);
            this.update()
        },
        reflow: function () {
            var t = n.extend({height: this.chart.height, width: this.chart.width});
            this.scale.update(t)
        },
        draw: function (t) {
            var u = t || 1;
            this.clear();
            var i = this.chart.ctx, r = function (n) {
                return null !== n.value
            }, e = function (t, i, u) {
                return n.findNextWhere(i, r, u) || t
            }, f = function (t, i, u) {
                return n.findPreviousWhere(i, r, u) || t
            };
            this.scale.draw(u);
            n.each(this.datasets, function (t) {
                var o = n.where(t.points, r);
                n.each(t.points, function (n, t) {
                    n.hasValue() && n.transition({y: this.scale.calculateY(n.value), x: this.scale.calculateX(t)}, u)
                }, this);
                this.options.bezierCurve && n.each(o, function (t, i) {
                    var r = i > 0 && i < o.length - 1 ? this.options.bezierCurveTension : 0;
                    t.controlPoints = n.splineCurve(f(t, o, i), t, e(t, o, i), r);
                    t.controlPoints.outer.y > this.scale.endPoint ? t.controlPoints.outer.y = this.scale.endPoint : t.controlPoints.outer.y < this.scale.startPoint && (t.controlPoints.outer.y = this.scale.startPoint);
                    t.controlPoints.inner.y > this.scale.endPoint ? t.controlPoints.inner.y = this.scale.endPoint : t.controlPoints.inner.y < this.scale.startPoint && (t.controlPoints.inner.y = this.scale.startPoint)
                }, this);
                i.lineWidth = this.options.datasetStrokeWidth;
                i.strokeStyle = t.strokeColor;
                i.beginPath();
                n.each(o, function (n, t) {
                    if (0 === t) i.moveTo(n.x, n.y); else if (this.options.bezierCurve) {
                        var r = f(n, o, t);
                        i.bezierCurveTo(r.controlPoints.outer.x, r.controlPoints.outer.y, n.controlPoints.inner.x, n.controlPoints.inner.y, n.x, n.y)
                    } else i.lineTo(n.x, n.y)
                }, this);
                i.stroke();
                this.options.datasetFill && o.length > 0 && (i.lineTo(o[o.length - 1].x, this.scale.endPoint), i.lineTo(o[0].x, this.scale.endPoint), i.fillStyle = t.fillColor, i.closePath(), i.fill());
                n.each(o, function (n) {
                    n.draw()
                })
            }, this)
        }
    })
}.call(this), function () {
    "use strict";
    var i = this, t = i.Chart, n = t.helpers;
    t.Type.extend({
        name: "PolarArea",
        defaults: {
            scaleShowLabelBackdrop: !0,
            scaleBackdropColor: "rgba(255,255,255,0.75)",
            scaleBeginAtZero: !0,
            scaleBackdropPaddingY: 2,
            scaleBackdropPaddingX: 2,
            scaleShowLine: !0,
            segmentShowStroke: !0,
            segmentStrokeColor: "#fff",
            segmentStrokeWidth: 2,
            animationSteps: 100,
            animationEasing: "easeOutBounce",
            animateRotate: !0,
            animateScale: !1,
            legendTemplate: '<ul class="<%=name.toLowerCase()%>-legend"><% for (var i=0; i<segments.length; i++){%><li><span style="background-color:<%=segments[i].fillColor%>"><\/span><%if(segments[i].label){%><%=segments[i].label%><%}%><\/li><%}%><\/ul>'
        },
        initialize: function (i) {
            this.segments = [];
            this.SegmentArc = t.Arc.extend({
                showStroke: this.options.segmentShowStroke,
                strokeWidth: this.options.segmentStrokeWidth,
                strokeColor: this.options.segmentStrokeColor,
                ctx: this.chart.ctx,
                innerRadius: 0,
                x: this.chart.width / 2,
                y: this.chart.height / 2
            });
            this.scale = new t.RadialScale({
                display: this.options.showScale,
                fontStyle: this.options.scaleFontStyle,
                fontSize: this.options.scaleFontSize,
                fontFamily: this.options.scaleFontFamily,
                fontColor: this.options.scaleFontColor,
                showLabels: this.options.scaleShowLabels,
                showLabelBackdrop: this.options.scaleShowLabelBackdrop,
                backdropColor: this.options.scaleBackdropColor,
                backdropPaddingY: this.options.scaleBackdropPaddingY,
                backdropPaddingX: this.options.scaleBackdropPaddingX,
                lineWidth: this.options.scaleShowLine ? this.options.scaleLineWidth : 0,
                lineColor: this.options.scaleLineColor,
                lineArc: !0,
                width: this.chart.width,
                height: this.chart.height,
                xCenter: this.chart.width / 2,
                yCenter: this.chart.height / 2,
                ctx: this.chart.ctx,
                templateString: this.options.scaleLabel,
                valuesCount: i.length
            });
            this.updateScaleRange(i);
            this.scale.update();
            n.each(i, function (n, t) {
                this.addData(n, t, !0)
            }, this);
            this.options.showTooltips && n.bindEvents(this, this.options.tooltipEvents, function (t) {
                var i = "mouseout" !== t.type ? this.getSegmentsAtEvent(t) : [];
                n.each(this.segments, function (n) {
                    n.restore(["fillColor"])
                });
                n.each(i, function (n) {
                    n.fillColor = n.highlightColor
                });
                this.showTooltip(i)
            });
            this.render()
        },
        getSegmentsAtEvent: function (t) {
            var i = [], r = n.getRelativePosition(t);
            return n.each(this.segments, function (n) {
                n.inRange(r.x, r.y) && i.push(n)
            }, this), i
        },
        addData: function (n, t, i) {
            var r = t || this.segments.length;
            this.segments.splice(r, 0, new this.SegmentArc({
                fillColor: n.color,
                highlightColor: n.highlight || n.color,
                label: n.label,
                value: n.value,
                outerRadius: this.options.animateScale ? 0 : this.scale.calculateCenterOffset(n.value),
                circumference: this.options.animateRotate ? 0 : this.scale.getCircumference(),
                startAngle: 1.5 * Math.PI
            }));
            i || (this.reflow(), this.update())
        },
        removeData: function (t) {
            var i = n.isNumber(t) ? t : this.segments.length - 1;
            this.segments.splice(i, 1);
            this.reflow();
            this.update()
        },
        calculateTotal: function (t) {
            this.total = 0;
            n.each(t, function (n) {
                this.total += n.value
            }, this);
            this.scale.valuesCount = this.segments.length
        },
        updateScaleRange: function (t) {
            var i = [], r;
            n.each(t, function (n) {
                i.push(n.value)
            });
            r = this.options.scaleOverride ? {
                steps: this.options.scaleSteps,
                stepValue: this.options.scaleStepWidth,
                min: this.options.scaleStartValue,
                max: this.options.scaleStartValue + this.options.scaleSteps * this.options.scaleStepWidth
            } : n.calculateScaleRange(i, n.min([this.chart.width, this.chart.height]) / 2, this.options.scaleFontSize, this.options.scaleBeginAtZero, this.options.scaleIntegersOnly);
            n.extend(this.scale, r, {
                size: n.min([this.chart.width, this.chart.height]),
                xCenter: this.chart.width / 2,
                yCenter: this.chart.height / 2
            })
        },
        update: function () {
            this.calculateTotal(this.segments);
            n.each(this.segments, function (n) {
                n.save()
            });
            this.reflow();
            this.render()
        },
        reflow: function () {
            n.extend(this.SegmentArc.prototype, {x: this.chart.width / 2, y: this.chart.height / 2});
            this.updateScaleRange(this.segments);
            this.scale.update();
            n.extend(this.scale, {xCenter: this.chart.width / 2, yCenter: this.chart.height / 2});
            n.each(this.segments, function (n) {
                n.update({outerRadius: this.scale.calculateCenterOffset(n.value)})
            }, this)
        },
        draw: function (t) {
            var i = t || 1;
            this.clear();
            n.each(this.segments, function (n, t) {
                n.transition({
                    circumference: this.scale.getCircumference(),
                    outerRadius: this.scale.calculateCenterOffset(n.value)
                }, i);
                n.endAngle = n.startAngle + n.circumference;
                0 === t && (n.startAngle = 1.5 * Math.PI);
                t < this.segments.length - 1 && (this.segments[t + 1].startAngle = n.endAngle);
                n.draw()
            }, this);
            this.scale.draw()
        }
    })
}.call(this), function () {
    "use strict";
    var i = this, t = i.Chart, n = t.helpers;
    t.Type.extend({
        name: "Radar",
        defaults: {
            scaleShowLine: !0,
            angleShowLineOut: !0,
            scaleShowLabels: !1,
            scaleBeginAtZero: !0,
            angleLineColor: "rgba(0,0,0,.1)",
            angleLineWidth: 1,
            pointLabelFontFamily: "'Arial'",
            pointLabelFontStyle: "normal",
            pointLabelFontSize: 10,
            pointLabelFontColor: "#666",
            pointDot: !0,
            pointDotRadius: 3,
            pointDotStrokeWidth: 1,
            pointHitDetectionRadius: 20,
            datasetStroke: !0,
            datasetStrokeWidth: 2,
            datasetFill: !0,
            legendTemplate: '<ul class="<%=name.toLowerCase()%>-legend"><% for (var i=0; i<datasets.length; i++){%><li><span style="background-color:<%=datasets[i].strokeColor%>"><\/span><%if(datasets[i].label){%><%=datasets[i].label%><%}%><\/li><%}%><\/ul>'
        },
        initialize: function (i) {
            this.PointClass = t.Point.extend({
                strokeWidth: this.options.pointDotStrokeWidth,
                radius: this.options.pointDotRadius,
                display: this.options.pointDot,
                hitDetectionRadius: this.options.pointHitDetectionRadius,
                ctx: this.chart.ctx
            });
            this.datasets = [];
            this.buildScale(i);
            this.options.showTooltips && n.bindEvents(this, this.options.tooltipEvents, function (t) {
                var i = "mouseout" !== t.type ? this.getPointsAtEvent(t) : [];
                this.eachPoints(function (n) {
                    n.restore(["fillColor", "strokeColor"])
                });
                n.each(i, function (n) {
                    n.fillColor = n.highlightFill;
                    n.strokeColor = n.highlightStroke
                });
                this.showTooltip(i)
            });
            n.each(i.datasets, function (t) {
                var r = {
                    label: t.label || null,
                    fillColor: t.fillColor,
                    strokeColor: t.strokeColor,
                    pointColor: t.pointColor,
                    pointStrokeColor: t.pointStrokeColor,
                    points: []
                };
                this.datasets.push(r);
                n.each(t.data, function (n, u) {
                    var f;
                    this.scale.animation || (f = this.scale.getPointPosition(u, this.scale.calculateCenterOffset(n)));
                    r.points.push(new this.PointClass({
                        value: n,
                        label: i.labels[u],
                        datasetLabel: t.label,
                        x: this.options.animation ? this.scale.xCenter : f.x,
                        y: this.options.animation ? this.scale.yCenter : f.y,
                        strokeColor: t.pointStrokeColor,
                        fillColor: t.pointColor,
                        highlightFill: t.pointHighlightFill || t.pointColor,
                        highlightStroke: t.pointHighlightStroke || t.pointStrokeColor
                    }))
                }, this)
            }, this);
            this.render()
        },
        eachPoints: function (t) {
            n.each(this.datasets, function (i) {
                n.each(i.points, t, this)
            }, this)
        },
        getPointsAtEvent: function (t) {
            var f = n.getRelativePosition(t),
                r = n.getAngleFromPoint({x: this.scale.xCenter, y: this.scale.yCenter}, f),
                e = 2 * Math.PI / this.scale.valuesCount, i = Math.round((r.angle - 1.5 * Math.PI) / e), u = [];
            return (i >= this.scale.valuesCount || 0 > i) && (i = 0), r.distance <= this.scale.drawingArea && n.each(this.datasets, function (n) {
                u.push(n.points[i])
            }), u
        },
        buildScale: function (n) {
            this.scale = new t.RadialScale({
                display: this.options.showScale,
                fontStyle: this.options.scaleFontStyle,
                fontSize: this.options.scaleFontSize,
                fontFamily: this.options.scaleFontFamily,
                fontColor: this.options.scaleFontColor,
                showLabels: this.options.scaleShowLabels,
                showLabelBackdrop: this.options.scaleShowLabelBackdrop,
                backdropColor: this.options.scaleBackdropColor,
                backdropPaddingY: this.options.scaleBackdropPaddingY,
                backdropPaddingX: this.options.scaleBackdropPaddingX,
                lineWidth: this.options.scaleShowLine ? this.options.scaleLineWidth : 0,
                lineColor: this.options.scaleLineColor,
                angleLineColor: this.options.angleLineColor,
                angleLineWidth: this.options.angleShowLineOut ? this.options.angleLineWidth : 0,
                pointLabelFontColor: this.options.pointLabelFontColor,
                pointLabelFontSize: this.options.pointLabelFontSize,
                pointLabelFontFamily: this.options.pointLabelFontFamily,
                pointLabelFontStyle: this.options.pointLabelFontStyle,
                height: this.chart.height,
                width: this.chart.width,
                xCenter: this.chart.width / 2,
                yCenter: this.chart.height / 2,
                ctx: this.chart.ctx,
                templateString: this.options.scaleLabel,
                labels: n.labels,
                valuesCount: n.datasets[0].data.length
            });
            this.scale.setScaleSize();
            this.updateScaleRange(n.datasets);
            this.scale.buildYLabels()
        },
        updateScaleRange: function (t) {
            var i = function () {
                var i = [];
                return n.each(t, function (t) {
                    t.data ? i = i.concat(t.data) : n.each(t.points, function (n) {
                        i.push(n.value)
                    })
                }), i
            }(), r = this.options.scaleOverride ? {
                steps: this.options.scaleSteps,
                stepValue: this.options.scaleStepWidth,
                min: this.options.scaleStartValue,
                max: this.options.scaleStartValue + this.options.scaleSteps * this.options.scaleStepWidth
            } : n.calculateScaleRange(i, n.min([this.chart.width, this.chart.height]) / 2, this.options.scaleFontSize, this.options.scaleBeginAtZero, this.options.scaleIntegersOnly);
            n.extend(this.scale, r)
        },
        addData: function (t, i) {
            this.scale.valuesCount++;
            n.each(t, function (n, t) {
                var r = this.scale.getPointPosition(this.scale.valuesCount, this.scale.calculateCenterOffset(n));
                this.datasets[t].points.push(new this.PointClass({
                    value: n,
                    label: i,
                    x: r.x,
                    y: r.y,
                    strokeColor: this.datasets[t].pointStrokeColor,
                    fillColor: this.datasets[t].pointColor
                }))
            }, this);
            this.scale.labels.push(i);
            this.reflow();
            this.update()
        },
        removeData: function () {
            this.scale.valuesCount--;
            this.scale.labels.shift();
            n.each(this.datasets, function (n) {
                n.points.shift()
            }, this);
            this.reflow();
            this.update()
        },
        update: function () {
            this.eachPoints(function (n) {
                n.save()
            });
            this.reflow();
            this.render()
        },
        reflow: function () {
            n.extend(this.scale, {
                width: this.chart.width,
                height: this.chart.height,
                size: n.min([this.chart.width, this.chart.height]),
                xCenter: this.chart.width / 2,
                yCenter: this.chart.height / 2
            });
            this.updateScaleRange(this.datasets);
            this.scale.setScaleSize();
            this.scale.buildYLabels()
        },
        draw: function (t) {
            var r = t || 1, i = this.chart.ctx;
            this.clear();
            this.scale.draw();
            n.each(this.datasets, function (t) {
                n.each(t.points, function (n, t) {
                    n.hasValue() && n.transition(this.scale.getPointPosition(t, this.scale.calculateCenterOffset(n.value)), r)
                }, this);
                i.lineWidth = this.options.datasetStrokeWidth;
                i.strokeStyle = t.strokeColor;
                i.beginPath();
                n.each(t.points, function (n, t) {
                    0 === t ? i.moveTo(n.x, n.y) : i.lineTo(n.x, n.y)
                }, this);
                i.closePath();
                i.stroke();
                i.fillStyle = t.fillColor;
                i.fill();
                n.each(t.points, function (n) {
                    n.hasValue() && n.draw()
                })
            }, this)
        }
    })
}.call(this)
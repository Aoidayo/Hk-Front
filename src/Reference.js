! function() {
    var e, K;
    window.WebVideoCtrl || (e = function() {
        var o = "100%",
            r = "100%",
            a = {
                szversion: "V3.3.0 build20230314",
                szContainerID: "",
                szColorProperty: "",
                szBasePath: "",
                iWndowType: 1,
                bWndFull: !0,
                iPackageType: 2,
                bDebugMode: !0,
                cbSelWnd: null,
                cbDoubleClickWnd: null,
                cbEvent: null,
                cbInitPluginComplete: null,
                iTopHeight: 0
            },
            u = null,
            c = 0,
            t = !1,
            g = [],
            l = [],
            y = null,
            S = null,
            p = this,
            h = null,
            d = 1,
            s = 1e3,
            I = 3e3,
            f = 3002,
            P = 3003,
            m = 3004,
            x = 5e3,
            e = 0,
            C = "IPCamera",
            v = "IPDome",
            T = "IPZoom",
            q = function(e) {
                c = e, a.cbSelWnd && ((e = []).push("<RealPlayInfo>"), e.push("<SelectWnd>" + c + "</SelectWnd>"), e.push("</RealPlayInfo>"), a.cbSelWnd(S.loadXML(e.join(""))))
            },
            B = function(e) {
                a.cbDoubleClickWnd && 2 === e.eventType && (a.bWndFull && -1 != p.findWndIndexByIndex(e.wndIndex) && (t = !t), a.cbDoubleClickWnd(e.wndIndex, t))
            },
            k = function(e, t, n) {
                var i = s;
                0 === t ? i = f : 2 === t ? i = P : 3 === t ? i = x : 21 === t && (i = m), f == i || P == i ? p.I_Stop(e) : m == i ? p.I_StopRecord(e) : x == i && p.I_StopVoiceTalk(), a.cbEvent && a.cbEvent(i, e, n)
            },
            Z = function(e) {
                100 === parseInt(e, 10) && (t = !1, a.cbDoubleClickWnd) && a.cbDoubleClickWnd(c, t)
            };
        let X = function(e, t) {
                let n = -1;
                return function() {
                    clearTimeout(n), n = setTimeout(e, t)
                }
            }(async () => {
                H()
            }, 80),
            H = (window.addEventListener("scroll", function() {
                var e;
                null !== u && (e = $("#" + a.szContainerID), u.JS_Resize(e.width(), e.height())), X()
            }), () => {
                var e = $("#" + a.szContainerID),
                    t = $(window).width(),
                    n = $(window).height();
                let i = "";
                if (!e.get(0)) return !1;
                i = e.get(0).getBoundingClientRect();
                var o = a.iTopHeight || 0,
                    r = i.left < 0 ? Math.abs(i.left) : 0,
                    o = i.top < o ? Math.abs(i.top - o) : 0,
                    t = 0 < i.right - t ? Math.round(i.right - t) : 0,
                    n = 0 < i.bottom - n ? Math.round(i.bottom - n) : 0,
                    s = e.width(),
                    e = e.height(),
                    r = s < r ? s : r,
                    t = s < t ? s : t,
                    n = e < n ? e : n;
                e <= (o = e < o ? e : o) || s <= r || s <= t || e <= n ? this.I_HidPlugin() : this.I_ShowPlugin(), D("left", r), D("top", o), D("right", t), D("bottom", n)
            }),
            D = async (e, t) => (console.log(e, t), u.JS_SetWndCover(e, t));
        var w = {
                errorCode: 2e3,
                errorMsg: "The device is not login."
            },
            _ = {
                errorCode: s,
                errorMsg: "Unknown error."
            },
            z = {
                errorCode: 1002,
                errorMsg: "Params error."
            },
            U = function() {
                return new Promise(function(t, e) {
                    u.JS_GetLocalConfig().then(e => {
                        h = e, t()
                    }, () => {
                        e()
                    })
                })
            },
            J = function(a) {
                return new Promise(function(e, t) {
                    var n = a.oProtocolInc.getDeviceInfo(a, {}),
                        i = a.oProtocolInc.getAnalogChannelInfo(a, {}),
                        o = a.oProtocolInc.getAudioInfo(a, {}),
                        r = M(a),
                        s = a.oProtocolInc.getDeviceMinusLocalTime(a);
                    Promise.all([n, i, o, r, s]).then(() => {
                        e()
                    }, () => {
                        e()
                    })
                })
            },
            E = function() {
                u.JS_SetWindowControlCallback({
                    onGetSelectWndInfo: e => {
                        q(e)
                    },
                    onPluginEventHandler: (e, t, n) => {
                        k(e, t, n)
                    },
                    KeyBoardEvent: e => {
                        Z(e)
                    },
                    onMouseEvent: function(e) {
                        B(e)
                    }
                })
            },
            M = function(s) {
                return new Promise(async (e, t) => {
                    var n = null;
                    if (await V(s)) n = await b(s);
                    else {
                        for (var i = await F(s), o = !1, r = 0; r < i.length; r++)
                            if (i[r].ipv4 == s.szIP || i[r].ipv6 == s.szIP) {
                                o = !0;
                                break
                            }(o || -1 == (n = await N(s)).iRtspPort && -1 == n.iDevicePort) && (n = await b(s))
                    }
                    s.iRtspPort = n.iRtspPort, s.iHttpPort = n.iHttpPort, e(n)
                })
            },
            b = function(t) {
                return new Promise((o, e) => {
                    var r = -1,
                        s = -1,
                        a = -1;
                    t.oProtocolInc.getPortInfo(t, {
                        async: !1,
                        success: function(e) {
                            var t = K.$XML(e).find("AdminAccessProtocol", !0);
                            r = 554;
                            for (var n = 0, i = t.length; n < i; n++) "rtsp" === K.$XML(t).eq(n).find("protocol").eq(0).text().toLowerCase() && (r = parseInt(K.$XML(t).eq(n).find("portNo").eq(0).text(), 10)), "http" === K.$XML(t).eq(n).find("protocol").eq(0).text().toLowerCase() && (s = parseInt(K.$XML(t).eq(n).find("portNo").eq(0).text(), 10)), "dev_manage" === K.$XML(t).eq(n).find("protocol").eq(0).text().toLowerCase() && (a = parseInt(K.$XML(t).eq(n).find("portNo").eq(0).text(), 10));
                            o({
                                iRtspPort: r,
                                iHttpPort: s,
                                iDevicePort: a
                            })
                        },
                        error: function() {
                            o({
                                iRtspPort: -1,
                                iHttpPort: -1,
                                iDevicePort: -1
                            })
                        }
                    })
                })
            },
            N = function(t) {
                return new Promise((o, e) => {
                    var r = -1,
                        s = -1,
                        a = -1;
                    t.oProtocolInc.getUPnPPortStatus(t, {
                        async: !1,
                        success: function(e) {
                            for (var t = K.$XML(e).find("portStatus", !0), n = 0, i = t.length; n < i; n++) "rtsp" == K.$XML(t).eq(n).find("internalPort").eq(0).text().toLowerCase() && (r = parseInt(K.$XML(t).eq(n).find("externalPort").eq(0).text(), 10)), "http" == K.$XML(t).eq(n).find("internalPort").eq(0).text().toLowerCase() && (s = parseInt(K.$XML(t).eq(n).find("externalPort").eq(0).text(), 10)), "admin" == K.$XML(t).eq(n).find("internalPort").eq(0).text().toLowerCase() && (a = parseInt(K.$XML(t).eq(n).find("externalPort").eq(0).text(), 10));
                            o({
                                iRtspPort: r,
                                iHttpPort: s,
                                iDevicePort: a
                            })
                        },
                        error: function() {
                            o({
                                iRtspPort: -1,
                                iHttpPort: -1,
                                iDevicePort: -1
                            })
                        }
                    })
                })
            },
            F = function(t) {
                return new Promise(function(i) {
                    var o = [];
                    t.oProtocolInc.getNetworkBond(t, {
                        async: !1,
                        success: function(e) {
                            "true" == K.$XML(e).find("enabled").eq(0).text() ? (o.push({
                                ipv4: K.$XML(e).find("ipAddress").eq(0).text(),
                                ipv6: K.$XML(e).find("ipv6Address").eq(0).text()
                            }), i(o)) : t.oProtocolInc.getNetworkInterface(t, {
                                async: !1,
                                success: function(e) {
                                    for (var t = 0, n = K.$XML(e).find("NetworkInterface", !0).length; t < n; t++) {
                                        o.push({
                                            ipv4: K.$XML(e).find("ipAddress").eq(0).text(),
                                            ipv6: K.$XML(e).find("ipv6Address").eq(0).text()
                                        });
                                        break
                                    }
                                    i(o)
                                },
                                error: function() {
                                    i(o)
                                }
                            })
                        },
                        error: function() {
                            t.oProtocolInc.getNetworkInterface(t, {
                                async: !1,
                                success: function(e) {
                                    for (var t = 0, n = K.$XML(e).find("NetworkInterface", !0).length; t < n; t++) {
                                        o.push({
                                            ipv4: K.$XML(e).find("ipAddress").eq(0).text(),
                                            ipv6: K.$XML(e).find("ipv6Address").eq(0).text()
                                        });
                                        break
                                    }
                                    i(o)
                                },
                                error: function() {
                                    i(o)
                                }
                            })
                        }
                    })
                })
            },
            V = function(e) {
                return new Promise(function(t) {
                    var n = !1;
                    e.oProtocolInc.getPPPoEStatus(e, {
                        success: function(e) {
                            n = 0 < K.$XML(e).find("ipAddress", !0).length || 0 < K.$XML(e).find("ipv6Address", !0).length, t(n)
                        },
                        error: function() {
                            t(n = !1)
                        }
                    })
                })
            },
            O = function(e, t, n, i, o, r, s) {
                t.szIP = n, 2 == i ? (t.szHttpProtocol = "https://", t.iHttpsPort = o) : (t.szHttpProtocol = "http://", t.iHttpPort = o), t.iCGIPort = o, t.szDeviceIdentify = n + "_" + o, t.iDeviceProtocol = d, t.oProtocolInc = e, t.szAuth = S.Base64.encode(":" + r + ":" + s)
            };

        function j() {
            this.szIP = "", this.szHostName = "", this.szAuth = "", this.szHttpProtocol = "http://", this.iCGIPort = 80, this.szDeviceIdentify = "", this.iDevicePort = -1, this.iHttpPort = -1, this.iHttpsPort = -1, this.iRtspPort = -1, this.iAudioType = 1, this.m_iAudioBitRate = -1, this.m_iAudioSamplingRate = -1, this.iDeviceProtocol = d, this.oProtocolInc = null, this.iAnalogChannelNum = 0, this.szDeviceType = "", this.bVoiceTalk = !1, this.iDeviceMinusLocalTime = 0
        }
        this.I_SupportNoPlugin = function() {
            return !1
        }, this.I_Resize = function(e, t) {
            return u.JS_Resize(e, t)
        }, this.I_InitPlugin = function(t) {
            S.extend(a, t), a.aIframe = t.aIframe;
            var e = S.getDirName();
            !e || "object" == typeof exports && "undefined" != typeof module || ("function" == typeof define && define.amd ? require([e + "/jsVideoPlugin-1.0.0.min.js"], function(e) {
                window.JSVideoPlugin = e.JSVideoPlugin, t.cbInitPluginComplete && t.cbInitPluginComplete()
            }) : S.loadScript(e + "/jsVideoPlugin-1.0.0.min.js", function() {
                t.cbInitPluginComplete && t.cbInitPluginComplete()
            })), window.addEventListener("resize", function() {
                var e;
                null !== u && (e = $("#" + a.szContainerID), u.JS_Resize(e.width(), e.height()))
            }), window.addEventListener("unload", function() {})
        }, this.I_InsertOBJECTPlugin = function(e) {
            return i = e, new Promise(function(t, n) {
                var e;
                S.isUndefined(i) || (a.szContainerID = i), null == document.getElementById(a.szContainerID) ? n(z) : (e = {
                    szId: i,
                    aIframe: a.aIframe,
                    iType: 1,
                    iWidth: o,
                    iHeight: r,
                    iMaxSplit: 4,
                    iCurrentSplit: a.iWndowType,
                    iServicePortStart: 34686,
                    iServicePortEnd: 34690,
                    oSessionInfo: {
                        sessionID: "11c12b3257f037bb50052db3ac5e342572c3d963622baca122755c482ce8823a",
                        user: "admin",
                        challenge: "275816f02ec2dca22b6a6ae87c7cb7e3",
                        iterations: 100,
                        random: "34765058"
                    },
                    iPluginType: 2,
                    onConnectSuccess: () => {
                        var e = $("#" + i);
                        u.JS_Resize(e.width(), e.height()), 2 !== u.iPluginMode ? n({
                            errorCode: I,
                            errorMsg: "Plugin init failed."
                        }) : (e = a.bWndFull ? 1 : 0, u.JS_SetFullScreenCapability(e), u.JS_SetPackageType(a.iPackageType), E(), U().then(() => {
                            t()
                        }))
                    },
                    onConnectError: () => {
                        n({
                            errorCode: I,
                            errorMsg: "Plugin init failed."
                        })
                    },
                    szBasePath: S.getDirName()
                }, u = new JSVideoPlugin(e))
            });
            var i
        }, this.I_WriteOBJECT_XHTML = function() {
            return 0
        }, this.I_ShowPlugin = function() {
            return new Promise(function(e, t) {
                u.JS_ShowWnd().then(() => {
                    e()
                }, () => {
                    t(_)
                })
            })
        }, this.I_HidPlugin = function() {
            return new Promise(function(e, t) {
                u.JS_HideWnd().then(() => {
                    e()
                }, () => {
                    t(_)
                })
            })
        }, this.I_DestroyPlugin = function() {
            return new Promise(function(e) {
                u.JS_DestroyPlugin().then(() => {
                    e()
                }, () => {
                    reject(_)
                })
            })
        }, this.I_OpenFileDlg = async function(n) {
            return new Promise(function(t, e) {
                u.JS_OpenFileBrowser(n, "").then(e => {
                    t(e)
                }, () => {
                    e(_)
                })
            })
        }, this.I_GetLocalCfg = function() {
            return new Promise(function(t, e) {
                u.JS_GetLocalConfig().then(e => {
                    t(e)
                }, () => {
                    e(_)
                })
            })
        }, this.I_SetLocalCfg = function(n) {
            return new Promise(function(e, t) {
                u.JS_SetLocalConfig(n).then(() => {
                    e()
                }, () => {
                    t(_)
                })
            })
        }, this.I_Login = function(p, h, I, f, P, m) {
            return new Promise(function(e, t) {
                var n, i, o, r, s, a, d, c, u, l; - 1 != this.findDeviceIndexByIP(p + "_" + I) ? (m.error && m.error({
                    errorCode: 2001,
                    errorMsg: "The device is already login."
                }), t({
                    errorCode: 2001,
                    errorMsg: "The device is already login."
                })) : (l = y, n = new j, i = l, o = n, r = p, s = h, a = I, d = f, c = P, u = m, l = {
                    success: null,
                    error: null
                }, S.extend(l, u), S.extend(l, {
                    success: function(e) {
                        O(i, o, r, s, a, d, c), g.push(o), J(o).then(() => {
                            u.success && u.success(e)
                        })
                    },
                    error: function(e) {
                        u.error && u.error(e)
                    }
                }), i.digestLogin(r, s, a, d, c, l).then(() => {
                    e()
                }, e => {
                    t(e)
                }))
            })
        }, this.I_Logout = function(i) {
            return new Promise(function(e, t) {
                var n = this.findDeviceIndexByIP(i); - 1 != n && (g.splice(n, 1), e())
            })
        }, this.I_GetAudioInfo = function(i, o) {
            return new Promise(function(t, n) {
                var e = this.findDeviceIndexByIP(i); - 1 != e ? (e = g[e]).oProtocolInc.getAudioInfo(e, o).then(e => {
                    t(e)
                }, e => {
                    n(e)
                }) : n(w)
            })
        }, this.I_GetDeviceInfo = function(i, o) {
            return new Promise(function(t, n) {
                var e = this.findDeviceIndexByIP(i); - 1 != e ? (e = g[e]).oProtocolInc.getDeviceInfo(e, o).then(e => {
                    t(e)
                }, e => {
                    n(e)
                }) : n(w)
            })
        }, this.I_GetAnalogChannelInfo = function(i, o) {
            return new Promise(function(t, n) {
                var e = this.findDeviceIndexByIP(i); - 1 != e ? (e = g[e]).oProtocolInc.getAnalogChannelInfo(e, o).then(e => {
                    t(e)
                }, e => {
                    n(e)
                }) : n(w)
            })
        }, this.I_GetDigitalChannelInfo = function(i, o) {
            return new Promise(function(t, n) {
                var e = this.findDeviceIndexByIP(i); - 1 != e ? (e = g[e]).oProtocolInc.getDigitalChannelInfo(e, o).then(e => {
                    t(e)
                }, e => {
                    n(e)
                }) : n(w)
            })
        }, this.I_GetZeroChannelInfo = function(i, o) {
            return new Promise(function(t, n) {
                var e = this.findDeviceIndexByIP(i); - 1 != e ? (e = g[e]).oProtocolInc.getZeroChannelInfo(e, o).then(e => {
                    t(e)
                }, e => {
                    n(e)
                }) : n(w)
            })
        }, this.I_StartRealPlay = function(o, r) {
            return new Promise(function(e, t) {
                var n = this.findDeviceIndexByIP(o),
                    i = {
                        iWndIndex: c,
                        iStreamType: 1,
                        iChannelID: 1,
                        bZeroChannel: !1
                    };
                S.extend(i, r), -1 != n ? (n = g[n], -1 == this.findWndIndexByIndex(i.iWndIndex) ? n.oProtocolInc.startRealPlay(n, i).then(function() {
                    r.success && r.success(), e()
                }, function() {
                    r.error && r.error(_), t(_)
                }) : t({
                    errorCode: 3001,
                    errorMsg: "The window is already playing."
                })) : (r.error && r.error(w), t(w))
            })
        }, this.I_StartPlay = function(o, r) {
            return new Promise(async function(e, t) {
                var n = this.findDeviceIndexByIP(o),
                    i = {
                        iWndIndex: c
                    },
                    n = (S.extend(i, r), g[n]); - 1 == this.findWndIndexByIndex(i.iWndIndex) ? n.oProtocolInc.startPlay(n, i).then(function() {
                    r.success && r.success(), e()
                }, function() {
                    r.error && r.error(_), t(_)
                }) : t({
                    errorCode: 3001,
                    errorMsg: "The window is already playing."
                })
            })
        }, this.I_SetSecretKey = function(n) {
            return new Promise((e, t) => {
                u.JS_SetSecretKey(0, n, 1).then(() => {
                    e()
                }, () => {
                    t(_)
                })
            })
        }, this.I_GetEncryptString = function(n) {
            return new Promise((t, e) => {
                u.JS_GetEncryptString(3, n).then(e => {
                    t(e)
                }, () => {
                    e(_)
                })
            })
        }, this.I_Stop = function(r) {
            return new Promise(async function(e, t) {
                var n, i = {
                        iWndIndex: c
                    },
                    o = (S.isObject(r) ? S.extend(i, r) : S.isUndefined(r) || (i.iWndIndex = r), this.findWndIndexByIndex(i.iWndIndex)); - 1 != o ? ((n = l[o]).bRecord && u.JS_StopSave(n.iIndex), n.bSound && u.JS_CloseSound(), n.bEZoom && u.JS_DisableZoom(n.iIndex), u.JS_Stop(i.iWndIndex).then(() => {
                    l.splice(o, 1), i.success && i.success(), e()
                }, () => {
                    i.error && i.error(_), t(_)
                })) : e()
            })
        }, this.I_StopAllPlay = function() {
            return new Promise(async function(e, t) {
                u.JS_StopRealPlayAll().then(() => {
                    l.length = 0, e()
                }, () => {
                    t(_)
                })
            })
        }, this.I_OpenSound = function(o) {
            return o = S.isUndefined(o) ? c : o, new Promise((e, t) => {
                var n, i = this.findWndIndexByIndex(o); - 1 == i || (n = l[i]).bSound ? t(_) : u.JS_OpenSound(o).then(() => {
                    n.bSound = !0, e()
                }, () => {
                    t(_)
                })
            })
        }, this.I_CloseSound = function(o) {
            return o = S.isUndefined(o) ? c : o, new Promise((e, t) => {
                var n, i = this.findWndIndexByIndex(o); - 1 != i && (n = l[i]).bSound ? u.JS_CloseSound().then(() => {
                    n.bSound = !1, e()
                }, () => {
                    t(_)
                }) : t(_)
            })
        }, this.I_SetVolume = function(n, i) {
            return new Promise((e, t) => {
                n = parseInt(n, 10), isNaN(n) || n < 0 || 100 < n ? t(z) : (i = S.isUndefined(i) ? c : i, -1 != this.findWndIndexByIndex(i) ? u.JS_SetVolume(i, n).then(() => {
                    e()
                }, () => {
                    t(_)
                }) : t(_))
            })
        }, this.I_CapturePic = function(i, o) {
            return new Promise((e, t) => {
                var n = {
                    iWndIndex: c,
                    bDateDir: !0
                };
                S.isObject(o) ? S.extend(n, o) : S.isUndefined(o) || (n.iWndIndex = o), -1 != this.findWndIndexByIndex(n.iWndIndex) ? (".jpg" === i.slice(-4).toLowerCase() ? i = i.slice(0, -4) : ".jpeg" === i.slice(-5).toLowerCase() && (i = i.slice(0, -5)), u.JS_CapturePicture(n.iWndIndex, i, n.bDateDir).then(() => {
                    e()
                }, () => {
                    t(_)
                })) : t(_)
            })
        }, this.I_CapturePicData = function(i) {
            return new Promise((t, n) => {
                var e = {
                    iWndIndex: c,
                    bDateDir: !0
                };
                S.isObject(i) ? S.extend(e, i) : S.isUndefined(i) || (e.iWndIndex = i), -1 != this.findWndIndexByIndex(e.iWndIndex) ? u.JS_GetCaptureData(e.iWndIndex).then(function(e) {
                    t(e)
                }, function(e) {
                    n(_)
                }) : n(_)
            })
        }, this.I_StartRecord = function(r, s) {
            return new Promise((e, t) => {
                var n, i = {
                        iWndIndex: c,
                        bDateDir: !0
                    },
                    o = (S.isObject(s) ? S.extend(i, s) : S.isUndefined(s) || (i.iWndIndex = s), this.findWndIndexByIndex(i.iWndIndex)); - 1 == o || (n = l[o]).bRecord ? (i.error && i.error(_), t(_)) : u.JS_StartSave(i.iWndIndex, r).then(function() {
                    n.bRecord = !0, i.success && i.success(), e()
                }, function() {
                    i.error && i.error(_), t(_)
                })
            })
        }, this.I_StopRecord = function(r) {
            return new Promise((e, t) => {
                var n, i = {
                        iWndIndex: c
                    },
                    o = (S.isObject(r) ? S.extend(i, r) : S.isUndefined(r) || (i.iWndIndex = r), this.findWndIndexByIndex(i.iWndIndex)); - 1 != o && (n = l[o]).bRecord ? u.JS_StopSave(i.iWndIndex).then(function() {
                    n.bRecord = !1, i.success && i.success(), e()
                }, function() {
                    i.error && i.error(_), t(_)
                }) : (i.error && i.error(_), t(_))
            })
        }, this.I_StartVoiceTalk = function(o, r) {
            return new Promise((e, t) => {
                var n, i;
                isNaN(parseInt(r, 10)) ? t(z) : -1 == (n = this.findDeviceIndexByIP(o)) || (i = g[n]).bVoiceTalk ? t(_) : i.oProtocolInc.startVoiceTalk(i, r).then(() => {
                    g[n].bVoiceTalk = !0, e()
                }, () => {
                    t(_)
                })
            })
        }, this.I_StopVoiceTalk = function() {
            return new Promise((n, e) => {
                u.JS_StopTalk().then(() => {
                    for (var e = 0, t = g.length; e < t; e++)
                        if (g[e].bVoiceTalk) {
                            g[e].bVoiceTalk = !1;
                            break
                        } n()
                }, () => {
                    e(_)
                })
            })
        }, this.I_StartAudioPlay = function(o, r) {
            return new Promise((e, t) => {
                var n, i = this.findDeviceIndexByIP(o); - 1 == i || (n = g[i], r.szAuth = n.szAuth, n.bVoiceTalk) ? t(_) : n.oProtocolInc.audioPlay(r).then(() => {
                    g[i].bVoiceTalk = !0, e()
                }, () => {
                    t(_)
                })
            })
        }, this.I_StopAudioPlay = function() {
            return new Promise((n, e) => {
                u.JS_StopAudioPlay().then(() => {
                    for (var e = 0, t = g.length; e < t; e++)
                        if (g[e].bVoiceTalk) {
                            g[e].bVoiceTalk = !1;
                            break
                        } n()
                }, () => {
                    e(_)
                })
            })
        }, this.I_PTZControl = function(r, s, a) {
            return new Promise((e, t) => {
                var n, i = {
                        iWndIndex: c,
                        iPTZIndex: r,
                        iPTZSpeed: 4
                    },
                    o = (S.extend(i, a), this.findWndIndexByIndex(i.iWndIndex)); - 1 != o && (n = l[o], -1 != (o = this.findDeviceIndexByIP(n.szIP))) && (o = g[o], 9 == r ? o.oProtocolInc.ptzAutoControl(o, s, n, i).then(() => {
                    e()
                }, e => {
                    t(e)
                }) : o.oProtocolInc.ptzControl(o, s, n, i).then(() => {
                    e()
                }, e => {
                    t(e)
                }))
            })
        }, this.I_EnableEZoom = function(o) {
            return new Promise((e, t) => {
                o = S.isUndefined(o) ? c : o;
                var n, i = this.findWndIndexByIndex(o); - 1 != i ? (n = l[i]).bEZoom || u.JS_EnableZoom(o).then(() => {
                    n.bEZoom = !0, e()
                }, () => {
                    t(_)
                }) : t(_)
            })
        }, this.I_DisableEZoom = function(o) {
            return new Promise((e, t) => {
                o = S.isUndefined(o) ? c : o;
                var n, i = this.findWndIndexByIndex(o); - 1 != i ? (n = l[i]).bEZoom ? u.JS_DisableZoom(o).then(() => {
                    n.bEZoom = !1, e()
                }, () => {
                    t(_)
                }) : e() : t(_)
            })
        }, this.I_Enable3DZoom = function(i) {
            return new Promise((e, t) => {
                i = S.isUndefined(i) ? c : i;
                var n = this.findWndIndexByIndex(i); - 1 != n ? ((n = l[n]).b3DZoom || (u.JS_SetDrawCallback(i, !0, "Rect", !1, function(e) {
                    var t, n;
                    e = e.points, -1 != (n = p.findWndIndexByIndex(c)) && (t = l[n], -1 != (n = p.findDeviceIndexByIP(t.szDeviceIdentify))) && (n = g[n]).oProtocolInc.set3DZoom(n, t, e, {})
                }), n.b3DZoom = !0), e()) : t(_)
            })
        }, this.I_Disable3DZoom = function(i) {
            return new Promise((e, t) => {
                i = S.isUndefined(i) ? c : i;
                var n = this.findWndIndexByIndex(i); - 1 != n ? ((n = l[n]).b3DZoom && (u.JS_SetDrawCallback(i, !1, "Rect", !1, function() {}), n.b3DZoom = !1), e()) : t(_)
            })
        }, this.I_FullScreen = function(n) {
            return new Promise(function(e, t) {
                u.JS_FullScreenDisplay(n).then(() => {
                    e()
                }, () => {
                    t(_)
                })
            })
        }, this.I_SetPreset = function(r, s) {
            return new Promise(function(e, t) {
                var n, i = {
                        iWndIndex: c,
                        iPresetID: r
                    },
                    o = (S.extend(i, s), this.findWndIndexByIndex(i.iWndIndex)); - 1 != o && (n = l[o], -1 != (o = this.findDeviceIndexByIP(n.szIP))) ? (o = g[o]).oProtocolInc.setPreset(o, n, i).then(() => {
                    e()
                }, e => {
                    t(e)
                }) : t(_)
            })
        }, this.I_GoPreset = function(r, s) {
            return new Promise(async function(e, t) {
                var n, i = {
                        iWndIndex: c,
                        iPresetID: r
                    },
                    o = (S.extend(i, s), this.findWndIndexByIndex(i.iWndIndex)); - 1 != o && (n = l[o], -1 != (o = this.findDeviceIndexByIP(n.szIP))) ? (o = g[o]).oProtocolInc.goPreset(o, n, i).then(() => {
                    e()
                }, e => {
                    t(e)
                }) : t(_)
            })
        }, this.I_RecordSearch = function(n, i, o, a, d) {
            return new Promise(async function(r, t) {
                var s, e = this.findDeviceIndexByIP(n); - 1 != e ? ((s = g[e]).szDeviceType !== C && s.szDeviceType !== v && s.szDeviceType !== T || (o = S.convertToUTCTime(o), a = S.convertToUTCTime(a)), e = {
                    iChannelID: i,
                    szStartTime: o,
                    szEndTime: a,
                    iSearchPos: 0,
                    iStreamType: 1
                }, S.extend(e, d), e.success = null, s.oProtocolInc.recordSearch(s, e).then(e => {
                    if (s.szDeviceType === C || s.szDeviceType === v || s.szDeviceType === T)
                        for (var t, n, i = 0, o = $(e).find("searchMatchItem").length; i < o; i++) t = $(e).find("startTime").eq(i).text(), n = $(e).find("endTime").eq(i).text(), t = S.convertToLocalTime(t, s.iDeviceMinusLocalTime), n = S.convertToLocalTime(n, s.iDeviceMinusLocalTime), $(e).find("startTime").eq(i).text(t), $(e).find("endTime").eq(i).text(n);
                    d.success && d.success(e), r(e)
                }, e => {
                    t(e)
                })) : t(w)
            })
        }, this.I_StartPlayback = function(a, d) {
            return new Promise(function(e, t) {
                var n = this.findDeviceIndexByIP(a),
                    i = "",
                    o = 1,
                    r = 0,
                    s = S.dateFormat(new Date, "yyyy-MM-dd"),
                    s = {
                        iWndIndex: c,
                        iStreamType: 1,
                        iChannelID: 1,
                        szStartTime: s + " 00:00:00",
                        szEndTime: s + " 23:59:59"
                    };
                S.extend(s, d), -1 != n ? (i = (n = g[n]).oProtocolInc.CGI.startPlayback, r = s.iStreamType, o = 100 * s.iChannelID + r, S.extend(s, {
                    urlProtocol: "rtsp://",
                    cgi: i,
                    iChannelID: o
                }), -1 == this.findWndIndexByIndex(s.iWndIndex) && (n.szDeviceType !== C && n.szDeviceType !== v && n.szDeviceType !== T || (s.szStartTime = S.convertToUTCTime(s.szStartTime), s.szEndTime = S.convertToUTCTime(s.szEndTime)), s.szStartTime = s.szStartTime.replace(/[-:]/g, "").replace(" ", "T") + "Z", s.szEndTime = s.szEndTime.replace(/[-:]/g, "").replace(" ", "T") + "Z", n.oProtocolInc.startPlayback(n, s).then(function() {
                    d.success && d.success(), e()
                }, function() {
                    d.error && d.error(_), t(_)
                }))) : (d.error && d.error(w), t(w))
            })
        }, this.I_ReversePlayback = function(a, d) {
            return new Promise(function(e, t) {
                var n = this.findDeviceIndexByIP(a),
                    i = "",
                    o = -1,
                    r = 0,
                    s = S.dateFormat(new Date, "yyyy-MM-dd"),
                    s = {
                        iWndIndex: c,
                        iStreamType: 1,
                        iChannelID: 1,
                        szStartTime: s + " 00:00:00",
                        szEndTime: s + " 23:59:59"
                    };
                S.extend(s, d), -1 != n && (n = g[n], parseInt(h.protocolType, 10), i = n.oProtocolInc.CGI.startPlayback, r = s.iStreamType, o = 100 * s.iChannelID + r, S.extend(s, {
                    urlProtocol: "rtsp://",
                    cgi: i,
                    iChannelID: o
                }), -1 == this.findWndIndexByIndex(s.iWndIndex)) && (s.szStartTime = s.szStartTime.replace(/[-:]/g, "").replace(" ", "T") + "Z", s.szEndTime = s.szEndTime.replace(/[-:]/g, "").replace(" ", "T") + "Z", n.oProtocolInc.reversePlayback(n, s).then(function() {
                    d.success && d.success(), e()
                }, function() {
                    d.error && d.error(_), t(_)
                }))
            })
        }, this.I_Frame = function(r) {
            return new Promise(async function(e, t) {
                var n, i = {
                        iWndIndex: c
                    },
                    o = (S.isObject(r) ? S.extend(i, r) : S.isUndefined(r) || (i.iWndIndex = r), this.findWndIndexByIndex(i.iWndIndex)); - 1 != o && (2 == (o = (n = l[o]).iPlayStatus) || 4 == o) ? u.JS_FrameForward(i.iWndIndex).then(function() {
                    n.iPlayStatus = 4, i.success && i.success(), e()
                }, function() {
                    i.error && i.error(_), t(_)
                }) : (i.error && i.error(_), t(_))
            })
        }, this.I_Pause = function(s) {
            return new Promise(async function(e, t) {
                var n = {
                        iWndIndex: c
                    },
                    i = (S.isObject(s) ? S.extend(n, s) : S.isUndefined(s) || (n.iWndIndex = s), this.findWndIndexByIndex(n.iWndIndex));
                if (-1 != i) {
                    var o = l[i],
                        i = o.iPlayStatus,
                        r = -1;
                    if (2 == i) r = 3;
                    else {
                        if (5 != i) return n.error && n.error(_), void t(_);
                        r = 6
                    }
                    u.JS_Pause(n.iWndIndex).then(function() {
                        o.iPlayStatus = r, n.success && n.success(), e()
                    }, function() {
                        n.error && n.error(_), t(_)
                    })
                } else n.error && n.error(_), t(_)
            })
        }, this.I_Resume = function(s) {
            return new Promise(async function(e, t) {
                var n = {
                        iWndIndex: c
                    },
                    i = (S.isObject(s) ? S.extend(n, s) : S.isUndefined(s) || (n.iWndIndex = s), this.findWndIndexByIndex(n.iWndIndex));
                if (-1 != i) {
                    var o = l[i],
                        i = o.iPlayStatus,
                        r = -1;
                    if (3 == i || 4 == i) r = 2;
                    else {
                        if (6 != i) return n.error && n.error(_), void t(_);
                        r = 5
                    }
                    u.JS_Resume(n.iWndIndex).then(function() {
                        o.iPlayStatus = r, n.success && n.success(), e()
                    }, function() {
                        n.error && n.error(_), t(_)
                    })
                } else n.error && n.error(_), t(_)
            })
        }, this.I_PlaySlow = function(o) {
            return new Promise(async function(e, t) {
                var n = {
                        iWndIndex: c
                    },
                    i = (S.isObject(o) ? S.extend(n, o) : S.isUndefined(o) || (n.iWndIndex = o), this.findWndIndexByIndex(n.iWndIndex)); - 1 != i && 2 == l[i].iPlayStatus ? u.JS_Slow(n.iWndIndex).then(function() {
                    n.success && n.success(), e()
                }, function() {
                    n.error && n.error(_), t(_)
                }) : (n.error && n.error(_), t(_))
            })
        }, this.I_PlayFast = function(o) {
            return new Promise(async function(e, t) {
                var n = {
                        iWndIndex: c
                    },
                    i = (S.isObject(o) ? S.extend(n, o) : S.isUndefined(o) || (n.iWndIndex = o), this.findWndIndexByIndex(n.iWndIndex)); - 1 != i && 2 == l[i].iPlayStatus ? u.JS_Fast(n.iWndIndex).then(function() {
                    n.success && n.success(), e()
                }, function() {
                    n.error && n.error(_), t(_)
                }) : (n.error && n.error(_), t(_))
            })
        }, this.I_GetOSDTime = function(t) {
            return new Promise(async function(n, e) {
                var i = {
                    iWndIndex: c
                };
                S.isObject(t) ? S.extend(i, t) : S.isUndefined(t) || (i.iWndIndex = t), -1 != this.findWndIndexByIndex(i.iWndIndex) ? u.JS_GetOSDTime(i.iWndIndex).then(function(e) {
                    var t;
                    i.success && (t = S.dateFormat(new Date(1e3 * e), "yyyy-MM-dd hh:mm:ss"), i.success(t)), n(t)
                }, function() {
                    i.error && i.error(_), e(_)
                }) : (i.error && i.error(_), e(_))
            })
        }, this.I_StartDownloadRecord = function(o, r, s, a) {
            return new Promise((t, n) => {
                var e, i = this.findDeviceIndexByIP(o); - 1 != i ? (i = g[i], e = {
                    szPlaybackURI: r,
                    szFileName: s + ".mp4",
                    bDateDir: !0
                }, S.isUndefined(a) || S.extend(e, a), i.oProtocolInc.startDownloadRecord(i, e).then(e => {
                    t(e)
                }, e => {
                    n(e)
                })) : n(w)
            })
        }, this.I_StartDownloadRecordByTime = function(o, r, s, a, d, c) {
            return new Promise((t, n) => {
                var e, i = this.findDeviceIndexByIP(o); - 1 != i && (i = g[i], e = {
                    szPlaybackURI: r = r.split("?")[0] + "?starttime=" + a.replace(" ", "T") + "Z&endtime=" + d.replace(" ", "T") + "Z",
                    szFileName: s + ".mp4",
                    bDateDir: !0
                }, S.isUndefined(c) || S.extend(e, c), i.oProtocolInc.startDownloadRecord(i, e).then(e => {
                    t(e)
                }, e => {
                    n(e)
                }))
            })
        }, this.I_GetDownloadStatus = function(n) {
            return new Promise((t, e) => {
                u.JS_GetDownloadStatus(n).then(e => {
                    t(e)
                }, () => {
                    e(_)
                })
            })
        }, this.I_GetDownloadProgress = function(n) {
            return new Promise((t, e) => {
                u.JS_GetDownloadProgress(n).then(e => {
                    t(e)
                }, () => {
                    e(_)
                })
            })
        }, this.I_StopDownloadRecord = function(n) {
            return new Promise((e, t) => {
                u.JS_StopAsyncDownload(n).then(() => {
                    e()
                }, () => {
                    t(_)
                })
            })
        }, this.I_ExportDeviceConfig = function(i) {
            return new Promise((e, t) => {
                var n = this.findDeviceIndexByIP(i); - 1 != n ? (n = g[n]).oProtocolInc.exportDeviceConfig(n).then(() => {
                    e()
                }, () => {
                    t(_)
                }) : t(w)
            })
        }, this.I_ImportDeviceConfig = function(i, o) {
            return new Promise((e, t) => {
                var n = this.findDeviceIndexByIP(i); - 1 != n ? (n = g[n]).oProtocolInc.importDeviceConfig(n, {
                    szFileName: o
                }).then(() => {
                    e()
                }, () => {
                    t(_)
                }) : t(w)
            })
        }, this.I_RestoreDefault = function(o, r, s) {
            return new Promise((e, t) => {
                var n = {
                        success: null,
                        error: null
                    },
                    i = (S.extend(n, s), this.findDeviceIndexByIP(o)); - 1 != i ? (i = g[i]).oProtocolInc.restore(i, r, n).then(() => {
                    e()
                }, e => {
                    t(e)
                }) : t(w)
            })
        }, this.I_Restart = function(o, r) {
            return new Promise((e, t) => {
                var n = {
                        success: null,
                        error: null
                    },
                    i = (S.extend(n, r), this.findDeviceIndexByIP(o)); - 1 != i ? (i = g[i]).oProtocolInc.restart(i, n).then(() => {
                    e()
                }, e => {
                    t(e)
                }) : t(w)
            })
        }, this.I_Reconnect = function(o, r) {
            return new Promise((e, t) => {
                var n = {
                        success: null,
                        error: null
                    },
                    i = (S.extend(n, r), this.findDeviceIndexByIP(o)); - 1 != i ? (i = g[i]).oProtocolInc.login(i.szIP, i.iCGIPort, i.szAuth, n).then(() => {
                    e()
                }, e => {
                    t(e)
                }) : t(w)
            })
        }, this.I_StartUpgrade = function(i, o) {
            return new Promise((e, t) => {
                var n = this.findDeviceIndexByIP(i); - 1 != n ? (n = g[n]).oProtocolInc.startUpgrade(n, o).then(() => {
                    e()
                }, () => {
                    t(_)
                }) : t(w)
            })
        }, this.I_UpgradeStatus = function(n) {
            return new Promise((t, e) => {
                this.I_SendHTTPRequest(n, y.CGI.startUpgrade.status, {}).then(e => {
                    e = "true" === $(e).find("upgrading").eq(0).text();
                    t(e)
                }, () => {
                    e(_)
                })
            })
        }, this.I_UpgradeProgress = function(n) {
            return new Promise((t, e) => {
                this.I_SendHTTPRequest(n, y.CGI.startUpgrade.status, {}).then(e => {
                    e = parseInt($(e).find("percent").eq(0).text(), 10);
                    t(e)
                }, () => {
                    e(_)
                })
            })
        }, this.I_StopUpgrade = function() {
            return new Promise((e, t) => {
                u.JS_StopUpgrade().then(() => {
                    e()
                }, () => {
                    t(_)
                })
            })
        }, this.I_CheckPluginInstall = function() {
            return !0
        }, this.I_CheckPluginVersion = function() {
            return new Promise((t, e) => {
                u.JS_CheckUpdate("<?xml version='1.0' encoding='utf-8'?><FileVersion><Platform name='win32'><localServiceControl>1.0.0.42</localServiceControl>").then(e => {
                    t(e)
                }, () => {
                    e(_)
                })
            })
        }, this.I_SendHTTPRequest = function(s, a, d) {
            return new Promise(async function(n, i) {
                var e = new R,
                    t = "",
                    o = "",
                    r = this.findDeviceIndexByIP(s),
                    r = (0 <= r && ("%" === a.substr(0, 1) && (a = a.substr(8)), t = (r = g[r]).szHttpProtocol + r.szIP + ":" + r.iCGIPort + "/" + a, o = r.szAuth), {
                        type: "GET",
                        url: t,
                        auth: o,
                        success: null,
                        error: null
                    });
                S.extend(r, d), e.submitRequest(r).then(function(t) {
                    if (200 === t.httpStatusCode) {
                        let e;
                        e = 0 === t.httpResponse.indexOf("<?xml") ? S.loadXML(t.httpResponse) : JSON.parse(t.httpResponse), d.success && d.success(e), n(e)
                    } else if (200 !== t.httpStatusCode) {
                        let e = S.loadXML(t.httpResponse);
                        e = e || JSON.parse(t.httpResponse), d.error && d.error({
                            errorCode: t.httpStatusCode,
                            errorMsg: e
                        }), i({
                            errorCode: t.httpStatusCode,
                            errorMsg: e
                        })
                    }
                }, function(e) {
                    d.error && d.error({
                        errorCode: e,
                        errorMsg: ""
                    }), i({
                        errorCode: e,
                        errorMsg: ""
                    })
                })
            })
        }, this.I_ChangeWndNum = function(n) {
            return new Promise((e, t) => {
                u.JS_ArrangeWindow(n).then(() => {
                    e()
                }, () => {
                    t(_)
                })
            })
        }, this.I_ArrangeWindow = function(i) {
            return new Promise((e, t) => {
                let n;
                "1*2" === i ? n = [{
                    width: .5,
                    height: .9996,
                    top: 2e-4,
                    left: 0
                }, {
                    width: .5,
                    height: .9996,
                    top: 2e-4,
                    left: .5
                }] : "2*1" === i && (n = [{
                    width: .9996,
                    height: .5,
                    top: 2e-4,
                    left: 0
                }, {
                    width: .9996,
                    height: .5,
                    top: .5,
                    left: 0
                }]), u.JS_ArrangeWindow(1, n).then(() => {
                    e()
                }, () => {
                    t(_)
                })
            })
        }, this.I_GetLastError = function() {
            return new Promise((t, e) => {
                u.JS_GetLastError().then(e => {
                    t(e)
                }, () => {
                    e(_)
                })
            })
        }, this.I_GetWindowStatus = function(e) {
            var t;
            return S.isUndefined(e) ? (S.extend(t = [], l), t) : -1 != (e = this.findWndIndexByIndex(e)) ? (S.extend(t = {}, l[e]), t) : null
        }, this.I_GetIPInfoByMode = function(e, t, n, i) {}, this.I_SetPlayModeType = function(n) {
            return new Promise((e, t) => {
                u.JS_SetPlayMode(n).then(() => {
                    e()
                }, () => {
                    t(_)
                })
            })
        }, this.I_SetSnapDrawMode = function(e, n) {
            let i = !1;
            return -1 !== n && (i = !0), new Promise((e, t) => {
                u.JS_SetDrawStatus(i, n).then(() => {
                    e()
                }, () => {
                    t(_)
                })
            })
        }, this.I_SetSnapPolygonInfo = function(e, o) {
            return new Promise((e, t) => {
                var n = [],
                    i = S.formatPolygonXmlToJson(o);
                0 < i.aAddRect.length && n.push(u.JS_SetDrawShapeInfo("Rect", i.aAddRect[0])), 0 < i.aAddPolygon.length && n.push(u.JS_SetDrawShapeInfo("Polygon", i.aAddPolygon[0])), 0 < i.aRect.length && n.push(u.JS_SetRectInfo(i.aRect)), 0 < i.aPolygon.length && n.push(u.JS_SetPolygonInfo(i.aPolygon)), Promise.all(n).then(() => {
                    e()
                }, () => {
                    t(_)
                })
            })
        }, this.I_GetSnapPolygonInfo = function(e) {
            return new Promise((t, e) => {
                var n = [];
                n.push(u.JS_GetPolygonInfo()), n.push(u.JS_GetRectInfo()), Promise.all(n).then(e => {
                    e = S.formatPolygonJsonToXml(e);
                    t(e)
                }, () => {
                    e(_)
                })
            })
        }, this.I_ClearSnapInfo = function(e, r) {
            return new Promise((t, n) => {
                var i, o;
                r ? (i = [], o = [], r.forEach(e => {
                    (1 === e.polygonType ? i : o).push(e.id);
                    e = [];
                    i.length && e.push(u.JS_ClearShapeByType("Polygon", i)), o.length && e.push(u.JS_ClearShapeByType("Rect", o)), Promise.all(e).then(() => {
                        t()
                    }, () => {
                        n(_)
                    })
                })) : u.JS_ClearShapeByType("AllWindows").then(() => {
                    t()
                }, () => {
                    n(_)
                })
            })
        }, this.I_DeviceCapturePic = function(e, t, n, i) {
            return !1
        }, this.I_SetPackageType = function(n) {
            return new Promise((e, t) => {
                u.JS_SetPackageType(n).then(() => {
                    e()
                }, () => {
                    t(_)
                })
            })
        }, this.I_GetDevicePort = function(i) {
            return new Promise(async (e, t) => {
                var n = this.findDeviceIndexByIP(i);
                if (-1 != n) {
                    n = g[n];
                    try {
                        e(await M(n))
                    } catch (e) {
                        t({
                            errorCode: 1001,
                            errorMsg: ""
                        })
                    }
                } else t(w)
            })
        }, this.I_GetTextOverlay = function(o, r, s) {
            return new Promise((t, n) => {
                var e, i = this.findDeviceIndexByIP(r); - 1 != i ? (e = g[i], l[i], i = {
                    type: "GET",
                    success: s.success,
                    error: s.error
                }, this.I_SendHTTPRequest(e.szIP + "_" + e.iCGIPort, o, i).then(e => {
                    t(e)
                }, e => {
                    n(e)
                })) : n(w)
            })
        }, this.findDeviceIndexByIP = function(e) {
            if (-1 < e.indexOf("_")) {
                for (var t = 0, n = g.length; t < n; t++)
                    if (g[t].szDeviceIdentify == e) return t
            } else
                for (t = 0, n = g.length; t < n; t++)
                    if (g[t].szIP == e) return t;
            return -1
        }, this.findWndIndexByIndex = function(e) {
            for (var t = 0, n = l.length; t < n; t++)
                if (l[t].iIndex == e) return t;
            return -1
        };

        function A() {
            this.iIndex = 0, this.szIP = "", this.iCGIPort = 80, this.szDeviceIdentify = "", this.iChannelID = "", this.iPlayStatus = e, this.bSound = !1, this.bRecord = !1, this.bPTZAuto = !1, this.bEZoom = !1, this.b3DZoom = !1
        }

        function n() {}
        var i, R = function() {
            this.options = {
                type: "GET",
                url: "",
                auth: "",
                timeout: 3e4,
                data: "",
                async: !0,
                success: null,
                error: null
            }, this.m_szHttpHead = "", this.m_szHttpContent = "", this.m_szHttpData = ""
        };
        R.prototype.submitRequest = function(e) {
            return e.method = this.getHttpMethod(e.type), e.content = e.data, delete e.type, delete e.data, u.JS_SubmitHttpRequest(e)
        }, R.prototype.getHttpMethod = function(e) {
            e = {
                GET: 1,
                POST: 2,
                PUT: 5,
                DELETE: 6
            } [e];
            return e || -1
        };

        function L(e) {
            this.elems = [], this.length = 0, this.length = this.elems.push(e)
        }
        n.prototype.CGI = {
            login: "%s%s:%s/ISAPI/Security/userCheck?format=json",
            getAudioInfo: "%s%s:%s/ISAPI/System/TwoWayAudio/channels",
            getDeviceInfo: "%s%s:%s/ISAPI/System/deviceInfo",
            getAnalogChannelInfo: "%s%s:%s/ISAPI/System/Video/inputs/channels",
            getDigitalChannel: "%s%s:%s/ISAPI/ContentMgmt/InputProxy/channels",
            getDigitalChannelInfo: "%s%s:%s/ISAPI/ContentMgmt/InputProxy/channels/status",
            getZeroChannelInfo: "%s%s:%s/ISAPI/ContentMgmt/ZeroVideo/channels",
            getStreamChannels: {
                analog: "%s%s:%s/ISAPI/Streaming/channels",
                digital: "%s%s:%s/ISAPI/ContentMgmt/StreamingProxy/channels"
            },
            startRealPlay: {
                channels: "video://%s:%s/%s",
                zeroChannels: "%s%s:%s/PSIA/Custom/SelfExt/ContentMgmt/ZeroStreaming/channels/%s"
            },
            startVoiceTalk: {
                open: "%s%s:%s/ISAPI/System/TwoWayAudio/channels/%s/open",
                close: "%s%s:%s/ISAPI/System/TwoWayAudio/channels/%s/close",
                audioData: "%s%s:%s/ISAPI/System/TwoWayAudio/channels/%s/audioData"
            },
            ptzControl: {
                analog: "%s%s:%s/ISAPI/PTZCtrl/channels/%s/continuous",
                digital: "%s%s:%s/ISAPI/ContentMgmt/PTZCtrlProxy/channels/%s/continuous"
            },
            ptzAutoControl: {
                analog: "%s%s:%s/ISAPI/PTZCtrl/channels/%s/autoPan",
                digital: "%s%s:%s/ISAPI/ContentMgmt/PTZCtrlProxy/channels/%s/autoPan"
            },
            setPreset: {
                analog: "%s%s:%s/ISAPI/PTZCtrl/channels/%s/presets/%s",
                digital: "%s%s:%s/ISAPI/ContentMgmt/PTZCtrlProxy/channels/%s/presets/%s"
            },
            goPreset: {
                analog: "%s%s:%s/ISAPI/PTZCtrl/channels/%s/presets/%s/goto",
                digital: "%s%s:%s/ISAPI/ContentMgmt/PTZCtrlProxy/channels/%s/presets/%s/goto"
            },
            ptzFocus: {
                analog: "%s%s:%s/ISAPI/System/Video/inputs/channels/%s/focus",
                digital: "%s%s:%s/ISAPI/ContentMgmt/ImageProxy/channels/%s/focus"
            },
            ptzIris: {
                analog: "%s%s:%s/ISAPI/System/Video/inputs/channels/%s/iris",
                digital: "%s%s:%s/ISAPI/ContentMgmt/ImageProxy/channels/%s/iris"
            },
            getNetworkBond: "%s%s:%s/ISAPI/System/Network/Bond",
            getNetworkInterface: "%s%s:%s/ISAPI/System/Network/interfaces",
            getUPnPPortStatus: "%s%s:%s/ISAPI/System/Network/UPnP/ports/status",
            getPPPoEStatus: "%s%s:%s/ISAPI/System/Network/PPPoE/1/status",
            getPortInfo: "%s%s:%s/ISAPI/Security/adminAccesses",
            recordSearch: "%s%s:%s/ISAPI/ContentMgmt/search",
            startPlayback: "video://%s:%s/%s",
            startWsPlayback: "%s%s:%s/%s",
            startShttpPlayback: "%s%s:%s/SDK/playback/%s",
            startShttpReversePlayback: "%s%s:%s/SDK/playback/%s/reversePlay",
            startTransCodePlayback: "%s%s:%s/SDK/playback/%s/transcoding",
            startDownloadRecord: "%s%s:%s/ISAPI/ContentMgmt/download",
            downloaddeviceConfig: "%s%s:%s/ISAPI/System/configurationData",
            uploaddeviceConfig: "%s%s:%s/ISAPI/System/configurationData",
            restart: "%s%s:%s/ISAPI/System/reboot",
            restore: "%s%s:%s/ISAPI/System/factoryReset?mode=%s",
            startUpgrade: {
                upgrade: "%s%s:%s/ISAPI/System/updateFirmware",
                status: "%s%s:%s/ISAPI/System/upgradeStatus"
            },
            set3DZoom: {
                analog: "%s%s:%s/ISAPI/PTZCtrl/channels/%s/position3D",
                digital: "%s%s:%s/ISAPI/ContentMgmt/PTZCtrlProxy/channels/%s/position3D"
            },
            getSecurityVersion: "%s%s:%s/ISAPI/Security/capabilities?username=admin",
            SDKCapabilities: "%s%s:%s/SDK/capabilities",
            deviceCapture: {
                channels: "%s%s:%s/ISAPI/Streaming/channels/%s/picture"
            },
            overlayInfo: {
                analog: "%s%s:%s/ISAPI/System/Video/inputs/channels/%s/overlays/",
                digital: "%s%s:%s/ISAPI/ContentMgmt/InputProxy/channels/%s/video/overlays"
            },
            sessionCap: "%s%s:%s/ISAPI/Security/sessionLogin/capabilities?username=%s",
            sessionLogin: "%s%s:%s/ISAPI/Security/sessionLogin",
            sessionHeartbeat: "%s%s:%s/ISAPI/Security/sessionHeartbeat",
            sessionLogout: "%s%s:%s/ISAPI/Security/sessionLogout",
            systemCapabilities: "%s%s:%s/ISAPI/System/capabilities",
            time: "ISAPI/System/time"
        }, n.prototype.login = function(e, t, n, i) {
            return p.I_SendHTTPRequest(oDeviceInfo.szDeviceIdentify, this.CGI.login, i)
        }, n.prototype.getAudioInfo = function(o, r) {
            return new Promise(function(i, t) {
                var e = {};
                S.extend(e, r), S.extend(e, {
                    success: function(e) {
                        var t, n = K.$XML(e).find("audioCompressionType", !0);
                        0 < n.length && (t = 0, "G.711ulaw" == (n = K.$XML(n).eq(0).text()) ? t = 1 : "G.711alaw" == n ? t = 2 : "G.726" == n ? t = 3 : "MP2L2" == n || "MPEL2" == n ? t = 4 : "G.722.1" == n ? t = 0 : "AAC" == n ? t = 5 : "PCM" == n ? t = 6 : "MP3" == n && (t = 7), o.iAudioType = t), "" !== K.$XML(e).find("audioBitRate").eq(0).text() ? o.m_iAudioBitRate = 1e3 * parseInt(K.$XML(e).find("audioBitRate").eq(0).text(), 10) : o.m_iAudioBitRate = 0, "" !== K.$XML(e).find("audioSamplingRate").eq(0).text() ? o.m_iAudioSamplingRate = 1e3 * parseInt(K.$XML(e).find("audioSamplingRate").eq(0).text(), 10) : o.m_iAudioSamplingRate = 0, "" !== K.$XML(e).find("channelNum").eq(0).text() ? o.m_iSoundChan = parseInt(K.$XML(e).find("channelNum").eq(0).text(), 10) : o.m_iSoundChan = 1, "" !== K.$XML(e).find("deviceCastChannelNum").eq(0).text() ? o.m_iDeviceAudioSoundChan = parseInt(K.$XML(e).find("deviceCastChannelNum").eq(0).text(), 10) : o.m_iDeviceAudioSoundChan = 1, r.success && r.success(e), i(e)
                    },
                    error: function(e) {
                        r.error && r.error(e), t(e)
                    }
                }), p.I_SendHTTPRequest(o.szDeviceIdentify, y.CGI.getAudioInfo, e)
            })
        }, n.prototype.getDeviceInfo = function(i, o) {
            return new Promise(function(n, t) {
                var e = {};
                S.extend(e, o), S.extend(e, {
                    success: function(e) {
                        i.szDeviceType = K.$XML(e).find("deviceType").eq(0).text();
                        var t = [];
                        t.push("<DeviceInfo>"), t.push("<deviceName>" + S.escape(K.$XML(e).find("deviceName").eq(0).text()) + "</deviceName>"), t.push("<deviceID>" + K.$XML(e).find("deviceID").eq(0).text() + "</deviceID>"), t.push("<deviceType>" + K.$XML(e).find("deviceType").eq(0).text() + "</deviceType>"), t.push("<model>" + K.$XML(e).find("model").eq(0).text() + "</model>"), t.push("<serialNumber>" + K.$XML(e).find("serialNumber").eq(0).text() + "</serialNumber>"), t.push("<macAddress>" + K.$XML(e).find("macAddress").eq(0).text() + "</macAddress>"), t.push("<firmwareVersion>" + K.$XML(e).find("firmwareVersion").eq(0).text() + "</firmwareVersion>"), t.push("<firmwareReleasedDate>" + K.$XML(e).find("firmwareReleasedDate").eq(0).text() + "</firmwareReleasedDate>"), t.push("<encoderVersion>" + K.$XML(e).find("encoderVersion").eq(0).text() + "</encoderVersion>"), t.push("<encoderReleasedDate>" + K.$XML(e).find("encoderReleasedDate").eq(0).text() + "</encoderReleasedDate>"), t.push("</DeviceInfo>"), e = S.loadXML(t.join("")), o.success && o.success(e), n(e)
                    },
                    error: function(e) {
                        o.error && o.error(e), t(e)
                    }
                }), p.I_SendHTTPRequest(i.szDeviceIdentify, y.CGI.getDeviceInfo, e)
            })
        }, n.prototype.getDeviceMinusLocalTime = function(S) {
            return new Promise(function(g, e) {
                p.I_SendHTTPRequest(S.szDeviceIdentify, y.CGI.time, {
                    success: e => {
                        var t = $(e).find("localTime").eq(0).text().substring(0, 19).match(/(\d+)-(\d+)-(\d+)(\D+)(\d+):(\d+):(\d+)/);
                        if (8 === t.length) {
                            var t = new Date(t[1], t[2] - 1, t[3], t[5], t[6], t[7]),
                                e = $(e).find("timeZone").eq(0).text(),
                                n = 0,
                                i = e.indexOf("DST");
                            if (-1 != i) {
                                for (var o = new Date(t.getTime()), r = (o.setMinutes(0), o.setSeconds(0), new Date(t.getTime())), s = (r.setMinutes(0), r.setSeconds(0), e.split(",")[1]), a = e.split(",")[2], d = parseInt(s.split(".")[0].replace("M", ""), 10), c = (o.setMonth(d - 1), parseInt(s.split(".")[1], 10)), u = parseInt(s.split(".")[2].split("/")[0]), s = parseInt(s.split(".")[2].split("/")[1].split(":")[0], 10), l = (o.setHours(s), 0), p = 0, h = 1; h <= 31 && (o.setDate(h), o.getMonth() === d - 1) && (o.getDay() != u || (p = h, ++l != c)); h++);
                                o.setDate(p), o.setMonth(d - 1);
                                var I = parseInt(a.split(".")[0].replace("M", ""), 10),
                                    f = (r.setMonth(I - 1), parseInt(a.split(".")[1], 10)),
                                    P = parseInt(a.split(".")[2].split("/")[0]),
                                    s = parseInt(a.split(".")[2].split("/")[1].split(":")[0], 10);
                                r.setHours(s);
                                for (var m, l = 0, p = 0, h = 1; h <= 31 && (r.setDate(h), r.getMonth() === I - 1) && (r.getDay() != P || (p = h, ++l != f)); h++);
                                r.setDate(p), r.setMonth(I - 1), o.getTime() < r.getTime() ? t.getTime() >= o.getTime() && t.getTime() <= r.getTime() && (m = e.substring(i + 3, i + 11), n = 60 * parseInt(m.split(":")[0], 10) + parseInt(m.split(":")[1], 10)) : (t.getTime() >= o.getTime() || t.getTime() <= r.getTime()) && (m = e.substring(i + 3, i + 11), n = 60 * parseInt(m.split(":")[0], 10) + parseInt(m.split(":")[1], 10))
                            }
                            a = e.match(/\D+([+-])(\d+):(\d+):(\d+)/);
                            5 == a.length && (s = (new Date).getTimezoneOffset(), t = 60 * parseInt(a[2]) + parseInt(a[3]), t = "+" === a[1] ? t : -t, iDeviceMinusLocalTime = 60 * (s - t + n) * 1e3), S.iDeviceMinusLocalTime = iDeviceMinusLocalTime, g(iDeviceMinusLocalTime)
                        }
                    },
                    error: () => {
                        e()
                    }
                })
            })
        }, n.prototype.getAnalogChannelInfo = function(a, d) {
            return new Promise(function(s, t) {
                var e = {};
                S.extend(e, d), S.extend(e, {
                    success: function(e) {
                        var t = [],
                            n = (t.push("<VideoInputChannelList>"), K.$XML(e).find("VideoInputChannel", !0));
                        a.iAnalogChannelNum = n.length;
                        for (var i = 0, o = n.length; i < o; i++) {
                            var r = n[i];
                            t.push("<VideoInputChannel>"), t.push("<id>" + K.$XML(r).find("id").eq(0).text() + "</id>"), t.push("<inputPort>" + K.$XML(r).find("inputPort").eq(0).text() + "</inputPort>"), t.push("<name>" + S.escape(K.$XML(r).find("name").eq(0).text()) + "</name>"), t.push("<videoFormat>" + K.$XML(r).find("videoFormat").eq(0).text() + "</videoFormat>"), t.push("</VideoInputChannel>")
                        }
                        t.push("</VideoInputChannelList>");
                        e = S.loadXML(t.join(""));
                        d.success && d.success(e), s(e)
                    },
                    error: function(e) {
                        d.error && d.error(e), t(e)
                    }
                }), p.I_SendHTTPRequest(a.szDeviceIdentify, y.CGI.getAnalogChannelInfo, e)
            })
        }, n.prototype.getDigitalChannel = function(n, a) {
            return new Promise(function(s, t) {
                var e = {};
                S.extend(e, a), S.extend(e, {
                    success: function(e) {
                        for (var t = [], n = (t.push("<InputProxyChannelList>"), K.$XML(e).find("InputProxyChannel", !0)), i = 0, o = n.length; i < o; i++) {
                            var r = n[i];
                            t.push("<InputProxyChannel>"), t.push("<id>" + K.$XML(r).find("id").eq(0).text() + "</id>"), t.push("<name>" + S.escape(K.$XML(r).find("name").eq(0).text()) + "</name>"), t.push("</InputProxyChannel>")
                        }
                        t.push("</InputProxyChannelList>");
                        e = S.loadXML(t.join(""));
                        a.success && a.success(e), s(e)
                    },
                    error: function(e) {
                        a.error && a.error(e), t(e)
                    }
                }), p.I_SendHTTPRequest(n.szDeviceIdentify, y.CGI.getDigitalChannel, e)
            })
        }, n.prototype.getDigitalChannelInfo = function(c, u) {
            return new Promise(async (a, t) => {
                var e = null,
                    d = {};
                try {
                    e = await y.getDigitalChannel(c, {})
                } catch (e) {
                    t(e)
                }
                for (var n = K.$XML(e).find("InputProxyChannel", !0), i = 0, o = n.length; i < o; i++) {
                    var r = n[i],
                        s = K.$XML(r).find("id").eq(0).text(),
                        r = K.$XML(r).find("name").eq(0).text();
                    d[s] = r
                }
                e = {};
                S.extend(e, u), S.extend(e, {
                    success: function(e) {
                        for (var t = [], n = (t.push("<InputProxyChannelStatusList>"), K.$XML(e).find("InputProxyChannelStatus", !0)), i = 0, o = n.length; i < o; i++) {
                            var r = n[i],
                                s = K.$XML(r).find("id").eq(0).text();
                            t.push("<InputProxyChannelStatus>"), t.push("<id>" + s + "</id>"), t.push("<sourceInputPortDescriptor>"), t.push("<proxyProtocol>" + K.$XML(r).find("proxyProtocol").eq(0).text() + "</proxyProtocol>"), t.push("<addressingFormatType>" + K.$XML(r).find("addressingFormatType").eq(0).text() + "</addressingFormatType>"), t.push("<ipAddress>" + K.$XML(r).find("ipAddress").eq(0).text() + "</ipAddress>"), t.push("<managePortNo>" + K.$XML(r).find("managePortNo").eq(0).text() + "</managePortNo>"), t.push("<srcInputPort>" + K.$XML(r).find("srcInputPort").eq(0).text() + "</srcInputPort>"), t.push("<userName>" + S.escape(K.$XML(r).find("userName").eq(0).text()) + "</userName>"), t.push("<streamType>" + K.$XML(r).find("streamType").eq(0).text() + "</streamType>"), t.push("<online>" + K.$XML(r).find("online").eq(0).text() + "</online>"), t.push("<name>" + S.escape(d[s]) + "</name>"), t.push("</sourceInputPortDescriptor>"), t.push("</InputProxyChannelStatus>")
                        }
                        t.push("</InputProxyChannelStatusList>");
                        e = S.loadXML(t.join(""));
                        u.success && u.success(e), a(e)
                    },
                    error: function(e) {
                        u.error && u.error(e), t(e)
                    }
                }), p.I_SendHTTPRequest(c.szDeviceIdentify, y.CGI.getDigitalChannelInfo, e)
            })
        }, n.prototype.getZeroChannelInfo = function(e, t) {
            return p.I_SendHTTPRequest(e.szDeviceIdentify, this.CGI.getZeroChannelInfo, t)
        }, n.prototype.getStreamChannels = function(e, t) {
            0 != e.iAnalogChannelNum ? S.formatString(this.CGI.getStreamChannels.analog, e.szHttpProtocol, e.szIP, e.iCGIPort) : S.formatString(this.CGI.getStreamChannels.digital, e.szHttpProtocol, e.szIP, e.iCGIPort);
            let n;
            return n = 0 != e.iAnalogChannelNum ? this.CGI.getStreamChannels.analog : this.CGI.getStreamChannels.digital, p.I_SendHTTPRequest(e.szDeviceIdentify, n, t)
        }, n.prototype.getPPPoEStatus = function(e, t) {
            return p.I_SendHTTPRequest(e.szDeviceIdentify, this.CGI.getPPPoEStatus, t)
        }, n.prototype.getUPnPPortStatus = function(e, t) {
            return p.I_SendHTTPRequest(e.szDeviceIdentify, this.CGI.getUPnPPortStatus, t)
        }, n.prototype.getNetworkBond = function(e, t) {
            return p.I_SendHTTPRequest(e.szDeviceIdentify, this.CGI.getNetworkBond, t)
        }, n.prototype.getNetworkInterface = function(e, t) {
            return p.I_SendHTTPRequest(e.szDeviceIdentify, this.CGI.getNetworkInterface, t)
        }, n.prototype.getPortInfo = function(e, t) {
            return p.I_SendHTTPRequest(e.szDeviceIdentify, this.CGI.getPortInfo, t)
        }, n.prototype.startRealPlay = function(s, a) {
            return new Promise(async function(t, e) {
                var n = 100 * a.iChannelID + a.iStreamType,
                    i = "",
                    o = S.delPort(s.szIP),
                    r = s.iRtspPort;
                a.iPort && (r = a.iPort), i = a.bZeroChannel ? S.formatString(s.oProtocolInc.CGI.startRealPlay.zeroChannels, o, r, n) : S.formatString(s.oProtocolInc.CGI.startRealPlay.channels, o, r, n);
                await u.JS_SetSecretKey(0, h.secretKey, 1), u.JS_Play(i, {
                    auth: s.szAuth,
                    userInfo: s.szAuth
                }, a.iWndIndex, "", "", a.bFlag).then(() => {
                    var e;
                    (e = new A).iIndex = a.iWndIndex, e.szIP = s.szIP, e.iCGIPort = s.iCGIPort, e.szDeviceIdentify = s.szDeviceIdentify, e.iChannelID = a.iChannelID, e.iPlayStatus = 1, l.push(e), t()
                }, () => {
                    e()
                })
            })
        }, n.prototype.startPlay = function(n, i) {
            return new Promise(async function(t, e) {
                u.JS_Play(i.szUrl, {
                    auth: n.szAuth,
                    userInfo: n.szAuth
                }, i.iWndIndex, i.startTime, i.endTime, !0).then(() => {
                    var e;
                    (e = new A).iIndex = i.iWndIndex, e.szIP = n.szIP, e.szDeviceIdentify = n.szDeviceIdentify, e.iPlayStatus = 2, l.push(e), t()
                }, () => {
                    e()
                })
            })
        }, n.prototype.startVoiceTalk = function(e, t) {
            var n = S.formatString(this.CGI.startVoiceTalk.open, e.szHttpProtocol, e.szIP, e.iCGIPort, t),
                i = S.formatString(this.CGI.startVoiceTalk.close, e.szHttpProtocol, e.szIP, e.iCGIPort, t),
                t = S.formatString(this.CGI.startVoiceTalk.audioData, e.szHttpProtocol, e.szIP, e.iCGIPort, t);
            return u.JS_StartTalk(n, i, t, e.szAuth, e.iAudioType, e.m_iAudioBitRate, e.m_iAudioSamplingRate, e.m_iSoundChan, e.m_iDeviceAudioSoundChan)
        }, n.prototype.audioPlay = function(e) {
            return u.JS_AudioPlay(e.szUrl, e.szAuth, -1, -1, !0, e.iAudioType)
        }, n.prototype.ptzAutoControl = function(i, o, r, s) {
            return new Promise((e, t) => {
                var n = r.iChannelID,
                    n = (s.iPTZSpeed = s.iPTZSpeed < 7 ? 15 * s.iPTZSpeed : 100, o && (s.iPTZSpeed = 0), {
                        type: "PUT",
                        url: n <= i.iAnalogChannelNum ? S.formatString(y.CGI.ptzAutoControl.analog, i.szHttpProtocol, i.szIP, i.iCGIPort, r.iChannelID) : S.formatString(y.CGI.ptzAutoControl.digital, i.szHttpProtocol, i.szIP, i.iCGIPort, r.iChannelID),
                        data: "<?xml version='1.0' encoding='UTF-8'?><autoPanData><autoPan>" + s.iPTZSpeed + "</autoPan></autoPanData>",
                        success: null,
                        error: null
                    });
                S.extend(n, s), S.extend(n, {
                    success: function() {
                        r.bPTZAuto = !r.bPTZAuto, s.success && s.success(), e()
                    },
                    error: function(e) {
                        s.error && s.error(e), t(e)
                    }
                }), p.I_SendHTTPRequest(i.szDeviceIdentify, "", n)
            })
        }, n.prototype.ptzControl = function(e, t, n, i) {
            var o = n.iChannelID,
                r = (n.bPTZAuto && this.ptzAutoControl(e, !0, n, {
                    iPTZSpeed: 0
                }), i.iPTZSpeed = t ? 0 : i.iPTZSpeed < 7 ? 15 * i.iPTZSpeed : 100, [{}, {
                    pan: 0,
                    tilt: i.iPTZSpeed
                }, {
                    pan: 0,
                    tilt: -i.iPTZSpeed
                }, {
                    pan: -i.iPTZSpeed,
                    tilt: 0
                }, {
                    pan: i.iPTZSpeed,
                    tilt: 0
                }, {
                    pan: -i.iPTZSpeed,
                    tilt: i.iPTZSpeed
                }, {
                    pan: -i.iPTZSpeed,
                    tilt: -i.iPTZSpeed
                }, {
                    pan: i.iPTZSpeed,
                    tilt: i.iPTZSpeed
                }, {
                    pan: i.iPTZSpeed,
                    tilt: -i.iPTZSpeed
                }, {}, {
                    speed: i.iPTZSpeed
                }, {
                    speed: -i.iPTZSpeed
                }, {
                    speed: i.iPTZSpeed
                }, {
                    speed: -i.iPTZSpeed
                }, {
                    speed: i.iPTZSpeed
                }, {
                    speed: -i.iPTZSpeed
                }]),
                s = "",
                a = {};
            switch (i.iPTZIndex) {
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                case 8:
                    a = this.CGI.ptzControl, s = "<?xml version='1.0' encoding='UTF-8'?><PTZData><pan>" + r[i.iPTZIndex].pan + "</pan><tilt>" + r[i.iPTZIndex].tilt + "</tilt></PTZData>";
                    break;
                case 10:
                case 11:
                    a = this.CGI.ptzControl, s = "<?xml version='1.0' encoding='UTF-8'?><PTZData><zoom>" + r[i.iPTZIndex].speed + "</zoom></PTZData>";
                    break;
                case 12:
                case 13:
                    a = this.CGI.ptzFocus, s = "<?xml version='1.0' encoding='UTF-8'?><FocusData><focus>" + r[i.iPTZIndex].speed + "</focus></FocusData>";
                    break;
                case 14:
                case 15:
                    a = this.CGI.ptzIris, s = "<?xml version='1.0' encoding='UTF-8'?><IrisData><iris>" + r[i.iPTZIndex].speed + "</iris></IrisData>";
                    break;
                default:
                    return
            }
            t = {
                type: "PUT",
                url: o <= e.iAnalogChannelNum ? S.formatString(a.analog, e.szHttpProtocol, e.szIP, e.iCGIPort, n.iChannelID) : S.formatString(a.digital, e.szHttpProtocol, e.szIP, e.iCGIPort, n.iChannelID),
                data: s,
                success: null,
                error: null
            };
            return S.extend(t, i), p.I_SendHTTPRequest(e.szDeviceIdentify, "", t)
        }, n.prototype.setPreset = function(e, t, n) {
            var i = "",
                o = "",
                i = t.iChannelID <= e.iAnalogChannelNum ? S.formatString(this.CGI.setPreset.analog, e.szHttpProtocol, e.szIP, e.iCGIPort, t.iChannelID, n.iPresetID) : S.formatString(this.CGI.setPreset.digital, e.szHttpProtocol, e.szIP, e.iCGIPort, t.iChannelID, n.iPresetID),
                t = (o = (o = "<?xml version='1.0' encoding='UTF-8'?>") + "<PTZPreset>" + ("<id>" + n.iPresetID + "</id>"), e.szDeviceType != v && (o += "<presetName>Preset" + n.iPresetID + "</presetName>"), {
                    type: "PUT",
                    url: i,
                    data: o += "</PTZPreset>",
                    success: null,
                    error: null
                });
            return S.extend(t, n), p.I_SendHTTPRequest(e.szDeviceIdentify, "", t)
        }, n.prototype.goPreset = function(e, t, n) {
            t = {
                type: "PUT",
                url: t.iChannelID <= e.iAnalogChannelNum ? S.formatString(this.CGI.goPreset.analog, e.szHttpProtocol, e.szIP, e.iCGIPort, t.iChannelID, n.iPresetID) : S.formatString(this.CGI.goPreset.digital, e.szHttpProtocol, e.szIP, e.iCGIPort, t.iChannelID, n.iPresetID),
                success: null,
                error: null
            };
            return S.extend(t, n), p.I_SendHTTPRequest(e.szDeviceIdentify, "", t)
        }, n.prototype.recordSearch = function(a, d) {
            return new Promise((s, t) => {
                var e = d.iChannelID,
                    n = d.iStreamType,
                    i = d.szStartTime.replace(" ", "T") + "Z",
                    o = d.szEndTime.replace(" ", "T") + "Z",
                    r = S.formatString(y.CGI.recordSearch, a.szHttpProtocol, a.szIP, a.iCGIPort),
                    e = "<?xml version='1.0' encoding='UTF-8'?><CMSearchDescription><searchID>" + new G + "</searchID><trackList><trackID>" + (100 * e + n) + "</trackID></trackList><timeSpanList><timeSpan><startTime>" + i + "</startTime><endTime>" + o + "</endTime></timeSpan></timeSpanList><maxResults>50</maxResults><searchResultPostion>" + d.iSearchPos + "</searchResultPostion><metadataList><metadataDescriptor>//metadata.ISAPI.org/VideoMotion</metadataDescriptor></metadataList></CMSearchDescription>",
                    n = (new R, {
                        type: "POST",
                        url: r,
                        data: e,
                        success: null,
                        error: null
                    });
                S.extend(n, d), S.extend(n, {
                    success: function(e) {
                        for (var t = [], n = (t.push("<CMSearchResult>"), t.push("<responseStatus>" + K.$XML(e).find("responseStatus").eq(0).text() + "</responseStatus>"), t.push("<responseStatusStrg>" + K.$XML(e).find("responseStatusStrg").eq(0).text() + "</responseStatusStrg>"), t.push("<numOfMatches>" + K.$XML(e).find("numOfMatches").eq(0).text() + "</numOfMatches>"), t.push("<matchList>"), K.$XML(e).find("searchMatchItem", !0)), i = 0, o = n.length; i < o; i++) {
                            var r = n[i];
                            t.push("<searchMatchItem>"), t.push("<trackID>" + K.$XML(r).find("trackID").eq(0).text() + "</trackID>"), t.push("<startTime>" + K.$XML(r).find("startTime").eq(0).text() + "</startTime>"), t.push("<endTime>" + K.$XML(r).find("endTime").eq(0).text() + "</endTime>"), t.push("<playbackURI>" + S.escape(K.$XML(r).find("playbackURI").eq(0).text()) + "</playbackURI>"), t.push("<metadataDescriptor>" + K.$XML(r).find("metadataDescriptor").eq(0).text().split("/")[1] + "</metadataDescriptor>"), t.push("</searchMatchItem>")
                        }
                        t.push("</matchList>"), t.push("</CMSearchResult>"), e = S.loadXML(t.join("")), d.success && d.success(e), s(e)
                    },
                    error: function(e) {
                        d.error && d.error(e), t(e)
                    }
                }), p.I_SendHTTPRequest(a.szDeviceIdentify, "", n)
            })
        }, n.prototype.startPlayback = function(d, c) {
            return new Promise(async function(t, e) {
                var n = c.iWndIndex,
                    i = c.szStartTime,
                    o = c.szEndTime,
                    r = S.delPort(d.szIP),
                    s = d.iRtspPort;
                if (c.iPort && (s = c.iPort), r = S.formatString(c.cgi, r, s, c.iChannelID), !S.isUndefined(c.oTransCodeParam)) {
                    s = c.oTransCodeParam, a = {
                        TransFrameRate: "",
                        TransResolution: "",
                        TransBitrate: ""
                    }, S.extend(a, s);
                    var a = "" == a.TransFrameRate || "" == a.TransResolution || "" == a.TransBitrate ? "" : ((s = []).push("<?xml version='1.0' encoding='UTF-8'?>"), s.push("<CompressionInfo>"), s.push("<TransFrameRate>" + a.TransFrameRate + "</TransFrameRate>"), s.push("<TransResolution>" + a.TransResolution + "</TransResolution>"), s.push("<TransBitrate>" + a.TransBitrate + "</TransBitrate>"), s.push("</CompressionInfo>"), s.join(""));
                    if ("" == a) return -1;
                    u.JS_SetTrsPlayBackParam(n, a)
                }
                u.JS_Play(r, {
                    auth: d.szAuth,
                    userInfo: d.szAuth
                }, n, i, o, c.bFlag).then(() => {
                    var e;
                    (e = new A).iIndex = n, e.szIP = d.szIP, e.iCGIPort = d.iCGIPort, e.szDeviceIdentify = d.szDeviceIdentify, e.iChannelID = c.iChannelID, e.iPlayStatus = 2, l.push(e), t()
                }, () => {
                    e()
                })
            })
        }, n.prototype.reversePlayback = function(a, d) {
            return new Promise(function(t, e) {
                var n = d.iWndIndex,
                    i = d.szStartTime,
                    o = d.szEndTime,
                    r = S.delPort(a.szIP),
                    s = a.iRtspPort,
                    r = (d.iPort && (s = d.iPort), S.formatString(d.cgi, r, s, d.iChannelID));
                u.JS_ReversePlay(r, {
                    auth: a.szAuth,
                    userInfo: a.szAuth
                }, n, i, o).then(() => {
                    var e = new A;
                    e.iIndex = n, e.szIP = a.szIP, e.iCGIPort = a.iCGIPort, e.szDeviceIdentify = a.szDeviceIdentify, e.iChannelID = d.iChannelID, e.iPlayStatus = 5, l.push(e), t()
                }, () => {
                    e()
                })
            })
        }, n.prototype.startDownloadRecord = function(e, t) {
            var n = S.formatString(this.CGI.startDownloadRecord, e.szHttpProtocol, e.szIP, e.iCGIPort),
                i = "<?xml version='1.0' encoding='UTF-8'?><downloadRequest><playbackURI>" + S.escape(t.szPlaybackURI) + "</playbackURI></downloadRequest>";
            return u.JS_StartAsyncDownload(n, e.szAuth, t.szFileName, i, t.bDateDir)
        }, n.prototype.exportDeviceConfig = function(e) {
            var t = S.formatString(this.CGI.downloaddeviceConfig, e.szHttpProtocol, e.szIP, e.iCGIPort);
            return u.JS_DownloadFile(t, e.szAuth, "", 0)
        }, n.prototype.importDeviceConfig = function(e, t) {
            var n = S.formatString(this.CGI.uploaddeviceConfig, e.szHttpProtocol, e.szIP, e.iCGIPort);
            return u.JS_StartAsynUpload(n, "", e.szAuth, t.szFileName, 0)
        }, n.prototype.restart = function(e, t) {
            return p.I_SendHTTPRequest(e.szDeviceIdentify, this.CGI.restart, {
                type: "PUT",
                success: null,
                error: null
            })
        }, n.prototype.restore = function(e, t, n) {
            t = S.formatString(this.CGI.restore, e.szHttpProtocol, e.szIP, e.iCGIPort, t);
            return p.I_SendHTTPRequest(e.szDeviceIdentify, "", {
                type: "PUT",
                url: t,
                success: null,
                error: null
            })
        }, n.prototype.startUpgrade = function(e, t) {
            var n = S.formatString(this.CGI.startUpgrade.upgrade, e.szHttpProtocol, e.szIP, e.iCGIPort);
            S.formatString(this.CGI.startUpgrade.status, e.szHttpProtocol, e.szIP, e.iCGIPort);
            return u.JS_StartUpgrade(n, "", e.szAuth, t)
        }, n.prototype.set3DZoom = function(e, t, n, i) {
            var o = "",
                o = t.iChannelID <= e.iAnalogChannelNum ? S.formatString(this.CGI.set3DZoom.analog, e.szHttpProtocol, e.szIP, e.iCGIPort, t.iChannelID) : S.formatString(this.CGI.set3DZoom.digital, e.szHttpProtocol, e.szIP, e.iCGIPort, t.iChannelID),
                t = (0 !== n[0][0] || 0 !== n[0][1] || 0 === n[2][0] && 0 === n[2][1] || (n[0][0] = n[2][0], n[0][1] = n[2][1]), "<?xml version='1.0' encoding='UTF-8'?><Position3D><StartPoint><positionX>" + parseInt(255 * n[0][0], 10) + "</positionX><positionY>" + (255 - parseInt(255 * n[0][1], 10)) + "</positionY></StartPoint><EndPoint><positionX>" + parseInt(255 * n[2][0], 10) + "</positionX><positionY>" + (255 - parseInt(255 * n[2][1], 10)) + "</positionY></EndPoint></Position3D>"),
                n = (new R, {
                    type: "PUT",
                    url: o,
                    data: t,
                    success: null,
                    error: null
                });
            return S.extend(n, i), p.I_SendHTTPRequest(e.szDeviceIdentify, "", n)
        }, n.prototype.getSDKCapa = function(e, t) {
            return p.I_SendHTTPRequest(e.szDeviceIdentify, this.CGI.SDKCapabilities, t)
        }, n.prototype.deviceCapturePic = function(e, t, n, i) {
            var t = 100 * t + 1,
                e = S.formatString(this.CGI.deviceCapture.channels, e.szHttpProtocol, e.szIP, e.iCGIPort, t),
                t = [];
            S.isInt(i.iResolutionWidth) && t.push("videoResolutionWidth=" + i.iResolutionWidth), S.isInt(i.iResolutionHeight) && t.push("videoResolutionHeight=" + i.iResolutionHeight), 0 < t.length && (e += "?" + t.join("&"));
            return i = e, t = n, $("body").append('<a id="jsplugin_download_a" href="' + i + '" download=' + t + '.jpg><li id="jsplugin_download_li"></li></a>'), $("#jsplugin_download_li").trigger("click"), $("#jsplugin_download_a").remove(), 0
        }, n.prototype.digestLogin = function(e, t, n, i, o, r) {
            var s = "",
                s = 2 == t ? "https://" : "http://",
                t = {
                    type: "GET",
                    url: S.formatString(this.CGI.login, s, e, n),
                    auth: S.Base64.encode(":" + i + ":" + o),
                    success: null,
                    error: null
                },
                s = e + "_" + n;
            return S.extend(t, r), p.I_SendHTTPRequest(s, "", t)
        }, n.prototype.getSystemCapa = function(e, t) {
            return p.I_SendHTTPRequest(e.szDeviceIdentify, this.CGI.systemCapabilities, t)
        }, i = this, L.prototype.find = function(e, t) {
            e = this.elems[this.length - 1] ? this.elems[this.length - 1].getElementsByTagName(e) : [];
            return this.length = this.elems.push(e), t ? e : this
        }, L.prototype.eq = function(e, t) {
            var n = this.elems[this.length - 1].length,
                i = null;
            return 0 < n && e < n && (i = this.elems[this.length - 1][e]), this.length = this.elems.push(i), t ? i : this
        }, L.prototype.text = function(e) {
            return this.elems[this.length - 1] ? e ? void(window.DOMParser ? this.elems[this.length - 1].textContent = e : this.elems[this.length - 1].text = e) : window.DOMParser ? this.elems[this.length - 1].textContent : this.elems[this.length - 1].text : ""
        }, L.prototype.attr = function(e) {
            if (this.elems[this.length - 1]) return (e = this.elems[this.length - 1].attributes.getNamedItem(e)) ? e.value : ""
        }, i.$XML = function(e) {
            return new L(e)
        };

        function W() {}

        function G() {
            this.id = this.createUUID()
        }
        return W.prototype.extend = function() {
            for (var e, t = arguments[0] || {}, n = 1, i = arguments.length; n < i; n++)
                if (null != (e = arguments[n]))
                    for (var o in e) {
                        t[o];
                        var r = e[o];
                        t !== r && ("object" == typeof r ? t[o] = this.extend({}, r) : void 0 !== r && (t[o] = r))
                    }
            return t
        }, W.prototype.browser = function() {
            var e = navigator.userAgent.toLowerCase(),
                e = /(chrome)[ \/]([\w.]+)/.exec(e) || /(safari)[ \/]([\w.]+)/.exec(e) || /(opera)(?:.*version)?[ \/]([\w.]+)/.exec(e) || /(msie) ([\w.]+)/.exec(e) || /(trident.*rv:)([\w.]+)/.exec(e) || e.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+))?/.exec(e) || ["unknow", "0"],
                t = (0 < e.length && -1 < e[1].indexOf("trident") && (e[1] = "msie"), {});
            return t[e[1]] = !0, t.version = e[2], t
        }, W.prototype.loadXML = function(e) {
            var t;
            return null == e || "" == e ? null : (t = null, window.DOMParser ? t = (new DOMParser).parseFromString(e, "text/xml") : ((t = new ActiveXObject("Microsoft.XMLDOM")).async = !1, t.loadXML(e)), t)
        }, W.prototype.toXMLStr = function(t) {
            var n = "";
            try {
                n = (new XMLSerializer).serializeToString(t)
            } catch (e) {
                try {
                    n = t.xml
                } catch (e) {
                    return ""
                }
            }
            return n = -1 == n.indexOf("<?xml") ? "<?xml version='1.0' encoding='utf-8'?>" + n : n
        }, W.prototype.escape = function(e) {
            return e && e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        }, W.prototype.dateFormat = function(e, t) {
            var n, i = {
                "M+": e.getMonth() + 1,
                "d+": e.getDate(),
                "h+": e.getHours(),
                "m+": e.getMinutes(),
                "s+": e.getSeconds(),
                "q+": Math.floor((e.getMonth() + 3) / 3),
                S: e.getMilliseconds()
            };
            for (n in /(y+)/.test(t) && (t = t.replace(RegExp.$1, (e.getFullYear() + "").substr(4 - RegExp.$1.length))), i) new RegExp("(" + n + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[n] : ("00" + i[n]).substr(("" + i[n]).length)));
            return t
        }, W.prototype.Base64 = {
            _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
            encode: function(e) {
                var t, n, i, o, r, s, a = "",
                    d = 0;
                for (e = W.prototype.Base64._utf8_encode(e); d < e.length;) i = (t = e.charCodeAt(d++)) >> 2, o = (3 & t) << 4 | (t = e.charCodeAt(d++)) >> 4, r = (15 & t) << 2 | (n = e.charCodeAt(d++)) >> 6, s = 63 & n, isNaN(t) ? r = s = 64 : isNaN(n) && (s = 64), a = a + this._keyStr.charAt(i) + this._keyStr.charAt(o) + this._keyStr.charAt(r) + this._keyStr.charAt(s);
                return a
            },
            decode: function(e) {
                var t, n, i, o, r, s, a = "",
                    d = 0;
                for (e = e.replace(/[^A-Za-z0-9\+\/\=]/g, ""); d < e.length;) i = this._keyStr.indexOf(e.charAt(d++)), t = (15 & (o = this._keyStr.indexOf(e.charAt(d++)))) << 4 | (r = this._keyStr.indexOf(e.charAt(d++))) >> 2, n = (3 & r) << 6 | (s = this._keyStr.indexOf(e.charAt(d++))), a += String.fromCharCode(i << 2 | o >> 4), 64 != r && (a += String.fromCharCode(t)), 64 != s && (a += String.fromCharCode(n));
                return a = W.prototype.Base64._utf8_decode(a)
            },
            _utf8_encode: function(e) {
                e = e.replace(/\r\n/g, "\n");
                for (var t = "", n = 0; n < e.length; n++) {
                    var i = e.charCodeAt(n);
                    i < 128 ? t += String.fromCharCode(i) : t = 127 < i && i < 2048 ? (t += String.fromCharCode(i >> 6 | 192)) + String.fromCharCode(63 & i | 128) : (t = (t += String.fromCharCode(i >> 12 | 224)) + String.fromCharCode(i >> 6 & 63 | 128)) + String.fromCharCode(63 & i | 128)
                }
                return t
            },
            _utf8_decode: function(e) {
                var t, n = "",
                    i = 0;
                for (c1 = c2 = 0; i < e.length;)(t = e.charCodeAt(i)) < 128 ? (n += String.fromCharCode(t), i++) : 191 < t && t < 224 ? (c2 = e.charCodeAt(i + 1), n += String.fromCharCode((31 & t) << 6 | 63 & c2), i += 2) : (c2 = e.charCodeAt(i + 1), c3 = e.charCodeAt(i + 2), n += String.fromCharCode((15 & t) << 12 | (63 & c2) << 6 | 63 & c3), i += 3);
                return n
            }
        }, W.prototype.createEventScript = function(e, t, n) {
            var i = document.createElement("script");
            i.htmlFor = e, i.event = t, i.innerHTML = n, document.body.parentNode.appendChild(i)
        }, W.prototype.isInt = function(e) {
            return /^\d+$/.test(e)
        }, W.prototype.getDirName = function() {
            var e = "";
            if ("" !== a.szBasePath) e = a.szBasePath;
            else {
                var t = /[^?#]*\//,
                    n = document.getElementById("videonode");
                if (n) e = n.src.match(t)[0];
                else {
                    for (var i = document.scripts, o = 0, r = i.length; o < r; o++)
                        if (-1 < i[o].src.indexOf("webVideoCtrl.js")) {
                            n = i[o];
                            break
                        } n && (e = n.src.match(t)[0])
                }
            }
            return e
        }, W.prototype.loadScript = function(e, t) {
            var n = document.createElement("script");
            n.type = "text/javascript", n.onload = function() {
                t()
            }, n.src = e, document.getElementsByTagName("head")[0].appendChild(n)
        }, W.prototype.cookie = function(e, t, n) {
            var i, o;
            return 1 < arguments.length && (null === t || "object" != typeof t) ? (n = this.extend({}, n), null === t && (n.expires = -1), "number" == typeof n.expires && (i = n.expires, (o = n.expires = new Date).setDate(o.getDate() + i)), document.cookie = [encodeURIComponent(e), "=", n.raw ? String(t) : encodeURIComponent(String(t)), n.expires ? "; expires=" + n.expires.toUTCString() : "", n.path ? "; path=" + n.path : "; path=/", n.domain ? "; domain=" + n.domain : "", n.secure ? "; secure" : ""].join("")) : (o = (n = t || {}).raw ? function(e) {
                return e
            } : decodeURIComponent, (i = new RegExp("(?:^|; )" + encodeURIComponent(e) + "=([^;]*)").exec(document.cookie)) ? o(i[1]) : null)
        }, W.prototype.isUndefined = function(e) {
            return void 0 === e
        }, W.prototype.isObject = function(e) {
            return "[object Object]" === Object.prototype.toString.call(e)
        }, W.prototype.delPort = function(e) {
            var t = e.indexOf(":");
            return -1 < t ? e.substring(0, t) : e
        }, W.prototype.formatString = function() {
            for (var e = arguments[0], t = 1; t < arguments.length; t++) e = e.replace("%s", arguments[t]);
            return e
        }, W.prototype.encodeString = function(e) {
            return e ? e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") : ""
        }, W.prototype.formatPolygonXmlToJson = function(e) {
            var p, e = this.loadXML(e),
                h = [],
                I = [],
                f = [],
                P = [],
                m = [];

            function g(e) {
                e = parseInt(e, 10).toString(16);
                return (e = "0" + e).substring(e.length - 2)
            }
            return $(e).find("SnapPolygon").each(function() {
                var e = parseInt($(this).find("EditType, editType").text(), 10) || 0,
                    t = "true" === $(this).find("isClosed").text(),
                    n = parseInt($(this).find("polygonType").text(), 10),
                    i = parseFloat($(this).find("showSquare").text()) || 0,
                    o = $(this).find("tips").text() || $(this).find("Tips").text(),
                    r = parseInt($(this).find("tipsPos").text(), 10) || 0,
                    s = "true" === $(this).find("showWH").text(),
                    a = "#" + g($(this).find("r").text()) + g($(this).find("g").text()) + g($(this).find("b").text()),
                    d = parseInt($(this).find("PointNumMax").text(), 10) - 1,
                    c = parseInt($(this).find("MinClosed").text(), 10) - 1,
                    u = parseInt($(this).find("id").text(), 10),
                    l = parseInt($(this).find("RedrawMode").text(), 10) || 0;
                0 === $(this).find("pointList").find("point").length ? 1 === n ? P.push({
                    id: u,
                    tips: o,
                    drawColor: a,
                    translucent: .1,
                    maxShapeSupport: 1,
                    maxPointSupport: d,
                    minPointSupport: c,
                    showWH: s,
                    redrawMode: l
                }) : 0 === n && m.push({
                    id: u,
                    tips: o,
                    drawColor: a,
                    translucent: .1,
                    widthHeightRate: i,
                    maxShapeSupport: 1,
                    type: 1,
                    redrawMode: l,
                    tipsPos: r
                }) : (I = [], $(this).find("pointList").find("point").each(function() {
                    I.push([parseFloat($(this).find("x").text()), parseFloat($(this).find("y").text())])
                }), p = {
                    id: u,
                    editType: e,
                    points: I,
                    closed: t,
                    tips: o,
                    drawColor: a,
                    maxPointSupport: d,
                    minPointSupport: c,
                    translucent: .1,
                    redrawMode: l
                }, 1 === n ? (p.showWH = s, h.push(p)) : 0 === n && (p.widthHeightRate = i, p.type = 1, p.tipsPos = r, f.push(p)))
            }), {
                aRect: f,
                aPolygon: h,
                aAddRect: m,
                aAddPolygon: P
            }
        }, W.prototype.formatPolygonJsonToXml = function(e) {
            function a(e) {
                var t = e.toLowerCase();
                if (t && /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/.test(t)) {
                    if (4 === t.length) {
                        for (var n = "#", i = 1; i < 4; i += 1) n += t.slice(i, i + 1).concat(t.slice(i, i + 1));
                        t = n
                    }
                    var o = [];
                    for (i = 1; i < 7; i += 2) o.push(parseInt("0x" + t.slice(i, i + 2), 16));
                    return o
                }
                return [0, 0, 0]
            }
            var t = e[0],
                e = e[1],
                d = "<?xml version='1.0' encoding='utf-8'?><SnapPolygonList>",
                c = this;
            return $.each(t, function(e, t) {
                var n = [0, 0, 0],
                    n = t.drawColor ? a(t.drawColor) : a("#FF0000");
                d = (d += "<SnapPolygon>") + "<id>" + t.id + "</id>", t.tips = c.encodeString(t.tips), t.tips ? d += "<tips>" + t.tips + "</tips>" : d += "<tips></tips>", d = (d = (d = (d += "<isClosed>" + t.closed.toString() + "</isClosed>") + "<color><r>" + n[0] + "</r><g>" + n[1] + "</g><b>" + n[2] + "</b></color><polygonType>1</polygonType>") + "<PointNumMax>" + (t.pointNumMax || 10) + "</PointNumMax>") + "<MinClosed>" + (t.minClosed || 4) + "</MinClosed><pointList>", $.each(t.points, function(e, t) {
                    d += "<point><x>" + t[0] + "</x><y>" + t[1] + "</y></point>"
                }), d += "</pointList></SnapPolygon>"
            }), $.each(e, function(e, t) {
                var n, i, o, r, s = [0, 0, 0],
                    s = t.drawColor ? a(t.drawColor) : a("#FF0000"),
                    s = (d = (d = (d += "<SnapPolygon>") + ("<id>" + t.id + "</id>")) + ("<color><r>" + s[0] + "</r><g>" + s[1] + "</g><b>" + s[2] + "</b></color>") + "<polygonType>0</polygonType>", t.tips = c.encodeString(t.tips), t.tips ? d += "<tips>" + t.tips + "</tips>" : d += "<tips></tips>", void 0 !== t.closed && null !== t.closed ? d += "<isClosed>" + t.closed.toString() + "</isClosed>" : d += "<isClosed>true</isClosed>", d += "<pointList>", []);
                t.points.length && (o = n = 2, r = i = -1, $.each(t.points, function() {
                    n > this[0] && (n = this[0]), o > this[1] && (o = this[1]), i < this[0] && (i = this[0]), r < this[1] && (r = this[1])
                }), s.push([n, o]), s.push([i, o]), s.push([i, r]), s.push([n, r])), $.each(s, function(e, t) {
                    d += "<point><x>" + t[0] + "</x><y>" + t[1] + "</y></point>"
                }), d += "</pointList></SnapPolygon>"
            }), d += "</SnapPolygonList>"
        }, W.prototype.convertToUTCTime = function(e, t) {
            void 0 === t && (t = "yyyy-MM-dd hh:mm:ss"), e = e.replace("T", " ").replace("Z", "");
            e = new Date(Date.parse(e.replace(/-/g, "/")));
            return e = (e = this.utcDateFormat(e, t)).replace(" ", "T")
        }, W.prototype.utcDateFormat = function(e, t) {
            var n, i = {
                "M+": e.getUTCMonth() + 1,
                "d+": e.getUTCDate(),
                "h+": e.getUTCHours(),
                "m+": e.getUTCMinutes(),
                "s+": e.getUTCSeconds(),
                "q+": Math.floor((e.getUTCMonth() + 3) / 3),
                S: e.getUTCMilliseconds()
            };
            for (n in /(y+)/.test(t) && (t = t.replace(RegExp.$1, (e.getUTCFullYear() + "").substr(4 - RegExp.$1.length))), i) new RegExp("(" + n + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[n] : ("00" + i[n]).substr(("" + i[n]).length)));
            return t
        }, W.prototype.convertToLocalTime = function(e, t) {
            void 0 === t && (t = 0);
            var n = (e = e.replace("T", " ").replace("Z", "")).split(" ")[0].split("-"),
                i = parseInt(n[0], 10),
                o = parseInt(n[1], 10) - 1,
                n = parseInt(n[2], 10),
                e = e.split(" ")[1].split(":"),
                r = parseInt(e[0], 10),
                s = parseInt(e[1], 10),
                e = parseInt(e[2], 10),
                i = new Date(Date.UTC(i, o, n, r, s, e));
            return i.setTime(i.getTime() + t), this.dateFormat(i, "yyyy-MM-dd hh:mm:ss").replace(" ", "T") + "Z"
        }, G.prototype.valueOf = function() {
            return this.id
        }, G.prototype.toString = function() {
            return this.id
        }, G.prototype.createUUID = function() {
            var e = new Date(1582, 10, 15, 0, 0, 0, 0),
                e = (new Date).getTime() - e.getTime();
            return G.getIntegerBits(e, 0, 31) + "-" + G.getIntegerBits(e, 32, 47) + "-" + (G.getIntegerBits(e, 48, 59) + "1") + "-" + G.getIntegerBits(G.rand(4095), 0, 7) + G.getIntegerBits(G.rand(4095), 0, 7) + "-" + (G.getIntegerBits(G.rand(8191), 0, 7) + G.getIntegerBits(G.rand(8191), 8, 15) + G.getIntegerBits(G.rand(8191), 0, 7) + G.getIntegerBits(G.rand(8191), 8, 15) + G.getIntegerBits(G.rand(8191), 0, 15))
        }, G.getIntegerBits = function(e, t, n) {
            for (var i = G.returnBase(e, 16), o = new Array, r = "", s = 0, s = 0; s < i.length; s++) o.push(i.substring(s, s + 1));
            for (s = Math.floor(t / 4); s <= Math.floor(n / 4); s++) o[s] && "" != o[s] ? r += o[s] : r += "0";
            return r
        }, G.returnBase = function(e, t) {
            var n, i = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
            return e < t ? i[e] : (n = e - (e = "" + Math.floor(e / t)) * t, t <= e ? this.returnBase(e, t) + i[n] : i[e] + i[n])
        }, G.rand = function(e) {
            return Math.floor(Math.random() * e)
        }, y = new n, S = new W, this
    }(), (K = window.WebVideoCtrl = e).version = "3.3.0")
}(), "object" == typeof exports && "undefined" != typeof module || ("function" == typeof define && define.amd ? define(function() {
    return WebVideoCtrl
}) : "function" == typeof define && define.cmd && define(function(e, t, n) {
    n.exports = WebVideoCtrl
}));
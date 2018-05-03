//@author mu @14/4/15
function CloseWebPage() {
    if (cc.sys.platform == cc.sys.MOBILE_BROWSER || cc.sys.platform == cc.sys.DESKTOP_BROWSER) {
        if (navigator.userAgent.indexOf("Firefox") != -1 || navigator.userAgent.indexOf("Chrome") != -1) {
            window.location.href = "about:blank";
            window.close();
        } else {
            window.opener = null;
            window.open("", "_self");
            window.close();
        }
    }
}

var exitDialog = cc.Layer.extend({
    sprite: null,
    ifIn: null,
    ctor: function() {
        this._super();
        var self = this
        var size = cc.director.getWinSize()
        var layout = createLayout({
            pos: cc.p(-size.width / 2, -size.height / 2),
            size: cc.director.getWinSize(),
            op: 0,
            color: cc.color(0, 0, 0, 255),
        })
        layout.setTouchEnabled(true)

        var ui_list = [
            "btn_confirm",
            "btn_cancel",
        ]
        loadUI(this, res.exitNode, ui_list)

        layout.setLocalZOrder(-1)
        self.loadUI.addChild(layout)
        this.btn_confirm.setTouchEnabled(true)
        this.btn_confirm.addClickEventListener(function() {
            self.btn_confirm.setTouchEnabled(false)
            stopMusic()
            if (TEST_FLAG) {
                cc.director.end()
                CloseWebPage()
            } else {
                if (cc.sys.isNative) {
                    if (cc.sys.os == cc.sys.OS_ANDROID) {
                        if (activity && ANDROID_RETURN_FUNC && ANDROID_RETURN_TYPE) {
                            if (CC_CURRENT_LAYER) {
                                CC_CURRENT_LAYER.setVisible(false)
                            }
                            cc.director.end()
                        }
                    } else {
                        if (IOS_CONTROLLER && IOS_RETURN_FUNC) {
                            if (CC_CURRENT_LAYER) {
                                CC_CURRENT_LAYER.setVisible(false)
                            }
                            jsb.reflection.callStaticMethod(IOS_CONTROLLER, IOS_RETURN_FUNC)
                        }
                    }
                } else {
                    cc.director.end()
                    CloseWebPage()
                }
            }
        });
        this.btn_cancel.addClickEventListener(function() {
            self.onOut()
        });
        return true;
    },
    onIn: function() {
        var self = this
        if (self.ifIn) {
            self.onOut()
        } else {
            addShowType({
                item: this.loadUI,
                show: "scale"
            })
            addShowType({
                item: this.loadUI,
                show: "fadeIn"
            })
            self.ifIn = true
        }
    },
    onOut: function() {
        var self = this
        addShowType({
            item: this.loadUI,
            show: "zoom"
        })
        addShowType({
            item: this.loadUI,
            show: "fadeOut"
        })
        self.ifIn = false
    }
})
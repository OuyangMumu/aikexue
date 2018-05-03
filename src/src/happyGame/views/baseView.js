var views = views || {}
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
views.IScene = cc.Scene.extend({
    ctor:function () {
        this._super();
        return true
    },
    onEnter:function(){
        this._super();
    },
    onEnterTransitionDidFinish:function(){
        this._super();
    },
    onExit:function(){
        this._super();
    }
});

views.ILayer = cc.Layer.extend({
    ctor:function () {
        this._super();
        var self = this
        if (cc.sys.isMobile) {
            CC_CURRENT_LAYER = self
            if(CC_CURRENT_LAYER){
                cc.eventManager.addListener({
                    event: cc.EventListener.KEYBOARD,
                    onKeyReleased: function(keyCode, event) {
                        if (keyCode == cc.KEY.back) {
                            if (CC_CURRENT_LAYER == self && self.KeyBack) {
                                self.KeyBack()
                            }
                        }
                    }
                }, this)
            }
        }
        return true
    },
    KeyBack:function(){
    },
    exitAllGame:function(){
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
    },
    onEnter:function(){
        this._super();
    },
    onEnterTransitionDidFinish:function(){
        this._super();
    },
    onExit:function(){
        this._super();
    }
});
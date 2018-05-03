//author @mu @2016/4/18 
//重构底层逻辑的放在这里
cc.myLoaderScene = cc.Scene.extend({ //重写加载资源逻辑
    _interval: null,
    _label: null,
    _className: "myLoaderScene",
    cb: null,
    target: null,
    node: null,
    count: 24,
    perCent: null,
    judgePercent: 95,
    judgeTime: 15,
    /**
     * Contructor of cc.LoaderScene
     * @returns {boolean}
     */
    init: function() {
        var self = this;
        var bgLayer = self._bgLayer = new cc.LayerColor(cc.color(0, 0, 0, 255));
        self.addChild(bgLayer, 0);

        var textures = [
            res.img_load_5,
            res.img_load_4,
            res.img_load_3,
            res.img_load_2,
            res.img_load_1, //loading图
        ]
        this.node = new cc.Node()
        var half = 200
        var count = this.count
        for (var i = 0; i < count; i++) {
            var cur = i > 4 ? 4 : i
            var item = new cc.Sprite(textures[cur])
            var angle = 360 / count * i / 180 * Math.PI
                //cc.log(Math.sin(angle))
            item.setPosition(cc.p(Math.cos(angle) * half, Math.sin(angle) * half))
            item.setRotation(90 - 360 / count * i)
            this.node.addChild(item)
        }

        this.node.setPosition(cc.director.getWinSize().width / 2, cc.director.getWinSize().height / 2)
        bgLayer.addChild(this.node)

        var fontSize = 36;
        var label = self._label = new cc.LabelTTF("0%", "Arial", fontSize);
        label.setPosition(cc.p(cc.director.getWinSize().width / 2, cc.director.getWinSize().height / 2));
        label.setColor(cc.color(180, 180, 180));
        bgLayer.addChild(self._label, 10);
        return true;
    },

    /**
     * custom onEnter
     */
    onEnter: function() {
        var self = this;
        cc.eventManager.addListener({
                event: cc.EventListener.KEYBOARD,
                onKeyReleased: function(keyCode, event) { //非测试模式下可以退出loading
                    if (keyCode == cc.KEY.back && !TEST_FLAG) {
                        cc.director.end()
                    }
                }
            },
            this)

        cc.Node.prototype.onEnter.call(self);
        self.schedule(self._startLoading, 0.3);
        addTimer({
            fun: function() { //旋转
                self.node.setRotation(self.node.getRotation() + (360 / self.count))
            },
            delay: 0,
            time: 0.05,
            repeat: cc.REPEAT_FOREVER,
            key: "loading"
        })
        var JudgeCount = 0
        var devideTime = 0.1
        // addTimer({//屏蔽skip操作
        //     fun: function() {
        //         JudgeCount++
        //         if (JudgeCount * devideTime >= self.judgeTime) { //加载超时判定
        //             if (self.perCent >= self.judgePercent) {
        //                 if (self.cb) {
        //                     self.cb.call(self.target);
        //                     self.cb = null;
        //                 }
        //             }
        //         }
        //     },
        //     delay: 0,
        //     time: devideTime,
        //     repeat: cc.REPEAT_FOREVER,
        //     key: "loadingSkip"
        // })
    },
    /**
     * custom onExit
     */
    onExit: function() {
        cc.Node.prototype.onExit.call(this)
        var tmpStr = "Loading... 0%"
        this._label.setString(tmpStr)
        removeTimer("loading")
        removeTimer("loadingSkip")
    },

    /**
     * init with resources
     * @param {Array} resources
     * @param {Function|String} cb
     * @param {Object} target
     */
    initWithResources: function(resources, cb, target) {
        if (cc.isString(resources))
            resources = [resources];
        this.resources = resources || [];
        this.cb = cb;
        this.target = target;
    },

    _startLoading: function() {
        var self = this;
        self.unschedule(self._startLoading);
        var res = self.resources;
        cc.loader.load(res,
            function(result, count, loadedCount) {
                var percent = (loadedCount / count * 100) | 0;
                percent = Math.min(percent, 100);
                self._label.setString(percent + "%");
                self.perCent = percent
            },
            function() {
                if (self.cb) {
                    self.cb.call(self.target);
                    self.cb = null
                }
            });
    },

    _updateTransform: function() {
        // this._renderCmd.setDirtyFlag(cc.Node._dirtyFlags.transformDirty);
        // this._bgLayer._renderCmd.setDirtyFlag(cc.Node._dirtyFlags.transformDirty);
        // this._label._renderCmd.setDirtyFlag(cc.Node._dirtyFlags.transformDirty);
        // this.node._renderCmd.setDirtyFlag(cc.Node._dirtyFlags.transformDirty);
    }
});
/**
 * <p>cc.LoaderScene.preload can present a loaderScene with download progress.</p>
 * <p>when all the resource are downloaded it will invoke call function</p>
 * @param resources
 * @param cb
 * @param target
 * @returns {cc.LoaderScene|*}
 * @example
 * //Example
 * cc.LoaderScene.preload(g_resources, function () {
        cc.director.runScene(new HelloWorldScene());
    }, this);
    */
cc.myLoaderScene.preload = function(resources, cb, target) {
    var _cc = cc;
    if (!_cc.loaderScene) {
        _cc.loaderScene = new cc.myLoaderScene();
        _cc.loaderScene.init();
        cc.eventManager.addCustomListener(cc.Director.EVENT_PROJECTION_CHANGED, function() {
            _cc.loaderScene._updateTransform();
        });
    }
    _cc.loaderScene.initWithResources(resources, cb, target);
    cc.director.runScene(_cc.loaderScene);
    return _cc.loaderScene;
};

function reloadAudio() { //对音频引擎进行二次封装 达到原生和web一样的效果
    cc.audioEngine.musicEnd = function(name) {
        var bgMusic = this.curFile
        if (bgMusic && bgMusic != name) {
            return true
        }
        if (this.isPaused) {
            return false
        }
        if (bgMusic) {
            if (bgMusic == name) {
                if (this.isMusicPlaying()) {
                    return false
                } else {
                    return true
                }
            } else {
                return true
            }
        } else {
            return !this.isMusicPlaying()//mark
        }
    }
    cc.audioEngine.setFile = function(name) {
        this.curFile = name
        return
    }
    cc.audioEngine.getFile = function() {
        return this.curFile || null
    }
}
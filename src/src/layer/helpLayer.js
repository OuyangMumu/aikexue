//@author mu @14/4/15

var helpLayer = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    INVOL: null,
    INVOLEFF: null,
    stopMusic: false,
    ctor: function() {
        this._super();
        var ui_list = [
            "btn_home",
            "btn_return",
            "view_help",
        ]
        loadUI(this, res.helpLayer, ui_list)
        var self = this
        this.btn_home.addClickEventListener(function() {
            stopMusic()
            changeLayer({
                out: self,
                in : layerControl.getLayer("mainLayer")
            })
        })
        var returnFun = function() {
            var result = "mainLayer"
            if (self.pastLayer) {
                result = self.pastLayer
            }
            changeLayer({
                out: self,
                in : layerControl.getLayer(result)
            })
        }
        this.btn_return.addClickEventListener(returnFun)
        this.KeyBack = returnFun
        this.addHelp(mainInfo.helpFile)

        var help = self.view_help
        var speed = 500
        cc.eventManager.addListener({
            event: cc.EventListener.MOUSE,
            swallow: true,
            //鼠标滚轮监听事件
            onMouseScroll: function(event) {
                var dis = event.getScrollY();
                if (cc.sys.isNative) {
                    dis *= 10;
                }
                var temp = help.current
                help.current += (-dis);
                if (help.current > help.down) {
                    help.current = help.down
                }
                if (help.current < help.top) {
                    help.current = help.top
                }
                var percent = help.current / help.dis * 100 + 100
                var judge = temp != help.current
                //cc.log(help.current.toString(), percent.toString(), judge.toString())
                if (judge) {
                    help.scrollToPercentVertical(percent, Math.abs(temp - help.current) / speed, false)
                }
            }
        }, this);

        return true
    },
    myEnter: function() {
        this._super()
        cc.log("VOL")
        this.INVOL = cc.audioEngine.getMusicVolume()
        this.INVOLEFF = cc.audioEngine.getEffectsVolume()
        pauseMusic()
        pauseEffect()
        cc.audioEngine.setMusicVolume(0)
        cc.audioEngine.setEffectsVolume(0)
    },
    myExit: function() {
        this._super()
        if (this.INVOL != null) {
            cc.log("REVOL")
            resumeMusic()
            resumeEffect()
            cc.audioEngine.setMusicVolume(this.INVOL)
            cc.audioEngine.setEffectsVolume(this.INVOLEFF)
        }
    },
    addHelp: function(res) {
        var item = new ccui.ImageView(res)
        var scale = mainInfo.helpScale || 1
        item.setAnchorPoint(0, 0)
        item.setScale(scale)
        var self = this
        var help = self.view_help
        help.setInnerContainerSize(cc.size(help.getInnerContainerSize().width, item.getContentSize().height * scale))
        var self = this
        self.helpImg = item
        help.addChild(item)
        help.down = 0
        help.top = help.getContentSize().height - help.getInnerContainerSize().height
        help.dis = help.down - help.top
        help.current = help.top
        //cc.log(help.top)
        //cc.log(help.dis)
    }
})
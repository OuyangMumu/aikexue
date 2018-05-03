//@author mu @14/4/15
var quitExpDialog = cc.Layer.extend({
    sprite: null,
    reload: function(data) {
        var self = this
        self.curPage = data.cur
        self.choosePage = data.back
        self.restartPage = data.restart
    },
    ctor: function(data) {
        this._super()
        var ui_list = [
            "btn_continue",
            "btn_again",
            "btn_choose",
        ]
        loadUI(this, res.quitExp, ui_list)
        var self = this
        self.reload(data)
        this.btn_continue.addClickEventListener(function() {
            self.onOut()
        })
        this.btn_again.addClickEventListener(function() {
            self.onOut()
            if (self.curPage && self.restartPage) {
                if (self.curPage.myExit) {
                    self.curPage.myExit()
                }
                if (self.curPage.myDelete) {
                    self.curPage.myDelete()
                }
                deleteLayer(self.curPage)
                var temp = getLayer(self.restartPage)
                cc.director.getRunningScene().addChild(temp)
                if (temp.myCtor) {
                    temp.myCtor()
                }
                if (temp.myEnter) {
                    temp.myEnter()
                    temp.alreadyEnter = true
                }
            }
        })
        this.btn_choose.addClickEventListener(function() {
            self.onOut()
            if (self.curPage && self.choosePage) {
                changeLayer({
                    out: self.curPage,
                    in : layerControl.getLayer(self.choosePage)
                })
            }
        })
        return true;
    },
    onIn: function() {
        addShowType({
            item: this.loadUI,
            show: "scale"
        })
        addShowType({
            item: this.loadUI,
            show: "fadeIn"
        })
    },
    onOut: function() {
        addShowType({
            item: this.loadUI,
            show: "zoom"
        })
        addShowType({
            item: this.loadUI,
            show: "fadeOut"
        })
    }
})
/**
 * Created by Administrator on 2016/5/23.
 */
var tempTime = 3

var showScoreDialog = cc.LayerColor.extend({
    sprite: null,
    reload:function(data){
        var self = this
        if(self.clonenode){
            self.clonenode.removeFromParent(true)
            self.clonenode = null
        }
        self.setOpacity(50)
        switch (data.showname)
        {
            case "suc_score": this.showGetAllScore(data)
                break;
            case "common_score":this.showGetsomeScore(data)
                break;
            case "show_star": this.showStar(data)
                break;
        }
    },
    ctor: function(data) {
            this._super(cc.color(0,0,0,100))
            var self = this
            self.reload(data)
            return true
    },

    showStar:function(data){
        var self = this
        self.clonenode = ccs.load(res.startgo).node
        self.clonenode.setPosition(cc.winSize.width/2,cc.winSize.height/2)
        var nodeac = ccs.load(res.startgo).action
        nodeac.gotoFrameAndPlay(0,115,false)
        nodeac.setLastFrameCallFunc(function(){
            self.onOut(data)
        })
        self.clonenode.runAction(nodeac)
        this.addChild(self.clonenode)

        //倒计时时加载数据
        if(data.loadfun)
            data.loadfun()
    },

    showGetAllScore:function(data){
        var fun = data.fun
        var self = this
        var ui_list = [
            "btnshow",
            "btnback"
        ]

        var node = loadNode(res.showsuccess, ui_list)
        this.clonenode = node
        node.setPosition(cc.winSize.width/2,cc.winSize.height/2)
        self.addChild(node)

        node.btnshow.addClickEventListener(function(){
            showfun.showbtnCallback()
        })
        node.btnback.addClickEventListener(function(){
            self.onOut(data)
        })
        playMusic(res.win)
    },

    showGetsomeScore:function(data){

        var wrong = data.wrong || "0"
        var right = data.right || "0"

        var fun = data.fun
        var self = this

        var ui_list = [
            "cuonumtxt" ,
            "rigthnumtxt",
            "btnshow",
            "btnback"
        ]
        var node = loadNode(res.showScore, ui_list)
        this.clonenode = node
        node.setPosition(cc.winSize.width/2,cc.winSize.height/2)
        self.addChild(node)

        var cuotxt = new cc.LabelTTF(wrong,res.myttf,42)
        cuotxt.enableStroke(cc.color(77,38,3),2)
        node.cuonumtxt.addChild(cuotxt)
        var rigthtxt = new cc.LabelTTF(right,res.myttf,42)
        rigthtxt.enableStroke(cc.color(77,38,3),2)
        node.rigthnumtxt.addChild(rigthtxt)

        node.btnshow.addClickEventListener(function(){
            showfun.showbtnCallback()
        })
        node.btnback.addClickEventListener(function(){
            self.onOut(data)
        })

        playMusic(res.win)
    },
    onIn: function()
    {
        var self = this
        createTouchEvent({
            item: self,
            swallow:true
        })
        addShowType({
            item: self.clonenode,
            show: "scale"
        })
    },
    onOut: function(data)
    {
        var ffun = data.fun
        var self = this
        self.removeListen()
        self.setOpacity(0)
        addShowType({
            item: self.clonenode,
            show: "zoom",
            fun:function(){
                if(ffun)
                    ffun()
            }
        })
    }
})
/**
 * Created by Administrator on 2016/5/27.
 */

var curIndex = 10
var stopCur = 0
var seeExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true,
    layerName: "seeExp1",
    preLayer: "seeLayer",
    ctor: function () {
        this._super();
        this.expCtor();
        this.initPeople();
        this.initUI();
        return true;
    },

    myEnter:function(){
        this._super()
        this.cancall = true
    },

    myExit:function(){
        this._super()
        this.cancall = false
    },

    initUI:function(){
        var self = this;
        var seeLayer = ccs.load(res.hhyz_see1).node;
        self.inside_node.addChild(seeLayer);

        this.nodebs.show(function() {
            //self.nodebs.say({
            //    key:"seeTip"
            //})
             self.nodebs.say({
                 force:true,
                 key:"see1",
                 fun:function(){
                     if(self.cancall){
                         self.nodebs.say({
                             key:"seeTip",
                             force:true,
                         })
                     }
                 }
             });
        })

        var hewaiBtn = seeLayer.getChildByName("hewaibtn");
        var yinhexiBtn = seeLayer.getChildByName("yinhexibtn");
        var yinheBtn = seeLayer.getChildByName("yinhebtn");

        var hewaiTip = new cc.Sprite(res.hhyz_hewaiTip)
        hewaiTip.setPosition(getMiddle())
        self.addChild(hewaiTip)
        hewaiTip.setScale(0)

        var yinhexiTip = new cc.Sprite(res.hhyz_yinhexiTip)
        yinhexiTip.setPosition(getMiddle())
        self.addChild(yinhexiTip)
        yinhexiTip.setScale(0)

        var yinheTip = new cc.Sprite(res.hhyz_yinheTip)
        yinheTip.setPosition(getMiddle())
        self.addChild(yinheTip)
        yinheTip.setScale(0)

        var hewaiClose = new ccui.Button("res/btn/btn_answerclose_normal.png","res/btn/btn_answerclose_select.png");
        hewaiTip.addChild(hewaiClose)
        hewaiClose.setPosition(hewaiTip.getContentSize().width-30,hewaiTip.getContentSize().height-30);

        var yinhexiClose = new ccui.Button("res/btn/btn_answerclose_normal.png","res/btn/btn_answerclose_select.png");
        yinhexiTip.addChild(yinhexiClose)
        yinhexiClose.setPosition(yinhexiTip.getContentSize().width-30,yinhexiTip.getContentSize().height-27);

        var yinheClose = new ccui.Button("res/btn/btn_answerclose_normal.png","res/btn/btn_answerclose_select.png");
        yinheTip.addChild(yinheClose)
        yinheClose.setPosition(yinheTip.getContentSize().width-30,yinheTip.getContentSize().height-30);

        hewaiBtn.addClickEventListener(function(){
            if(hewaiTip.getScale() == 0){
                self.showImg(hewaiTip,1,1)
                self.nodebs.say({key:"hewai"})
            }else{
                self.showImg(hewaiTip,2,1)
            }
        });
        hewaiClose.addClickEventListener(function(){
            self.showImg(hewaiTip,2,1)
        });

        yinhexiBtn.addClickEventListener(function(){
            if(yinhexiTip.getScale() == 0){
                self.showImg(yinhexiTip,1,2)
                self.nodebs.say({key:"yinhexi"})
            }else{
                self.showImg(yinhexiTip,2,2)
            }
        });
        yinhexiClose.addClickEventListener(function(){
            self.showImg(yinhexiTip,2,2)
        })

        yinheBtn.addClickEventListener(function(){
            if(yinheTip.getScale() == 0){
                self.showImg(yinheTip,1,3)
                self.nodebs.say({key:"yinhe"})
            }else{
                self.showImg(yinheTip,2,3)
            }
        });
        yinheClose.addClickEventListener(function(){
            self.showImg(yinheTip,2,3)
        })
    },

    showImg:function(img,flag,index){
        var self = this;
        if(!img.showing) {
            img.showing = true
            if (flag == 1) {
                addShowType({
                    item: img,
                    show: "scale",
                    time: 0.2,
                    fun: function (img) {
                        createTouchEvent({
                            item:img,
                            begin:function(data){
                                var item = data.item
                                item.setLocalZOrder(curIndex)
                                curIndex = curIndex + 1
                                return true
                            },
                            move:function(data){
                                var item = data.item
                                var delta = data.delta
                                item.x += delta.x
                                item.y += delta.y
                            }
                        })
                        img.showing = false
                    }
                })
                img.setLocalZOrder(curIndex)
                curIndex = curIndex + 1
                stopCur = index
                img.setPosition(getMiddle())
                self.nodebs.stopSay()
            } else {
                if(stopCur == index){
                    self.nodebs.stopSay()
                    stopCur = index
                }
                addShowType({
                    item: img,
                    show: "zoom",
                    time: 0.2,
                    fun: function (img) {
                        if(img.removeListen){
                            img.removeListen()
                            img.setPositionY(-600)
                        }
                        img.showing = false
                    }
                })
            }
        }
    },

    initPeople:function(){
        this.nodebs = addPeople({
            id:"boshi",
            pos:cc.p(1000, 130)
        })
        this.addChild(this.nodebs);
        addContent({
            people: this.nodebs,
            key: "see1",
            sound: res.hhyz_see1Mp3
        })
        addContent({
            people: this.nodebs,
            key: "seeTip",
            img: res.hhyz_seeTip,
            sound: res.hhyz_seeTipMp3
        })
        addContent({
            people: this.nodebs,
            key: "hewai",
            sound: res.hhyz_hewaiMp3
        })

        addContent({
            people: this.nodebs,
            key: "yinhexi",
            sound: res.hhyz_yinhexiMp3
        })

        addContent({
            people: this.nodebs,
            key: "yinhe",
            sound: res.hhyz_yinheMp3
        })
    }

});
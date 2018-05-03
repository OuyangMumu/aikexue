var doExp2 = myLayer.extend({
    sprite: null,
    changeDelete: true, 
    layerName: "doExp2", 
    preLayer: "doLayer", 
    ctor: function() { 
        this._super()
        var self = this
        this.expCtor({
            settingData: {
                pos: cc.p(1080, 580),
                biaogeFun: function() {
                    if (!self.bgg) {
                        loadPlist("tableWz_plist")
                        var bg = createBiaoge({
                            json: res.bbyt_tableNode_json,
                            scale: 0.9,
                            judgeScale: 0.7,
                            downData: {
                                nums: 24,
                                scale: 1.5,
                                bufs: [
                                    [null,"#table_wz1.png","#table_wz2.png"],[null,"#table_wz1.png","#table_wz2.png"],
                                    [null,"#table_wz1.png","#table_wz2.png"],[null,"#table_wz1.png","#table_wz2.png"],
                                    [null,"#table_wz1.png","#table_wz2.png"],[null,"#table_wz1.png","#table_wz2.png"],
                                    [null,"#table_wz3.png","#table_wz4.png"],[null,"#table_wz3.png","#table_wz4.png"],
                                    [null,"#table_wz3.png","#table_wz4.png"],[null,"#table_wz3.png","#table_wz4.png"],
                                    [null,"#table_wz3.png","#table_wz4.png"],[null,"#table_wz3.png","#table_wz4.png"],
                                    [null,"#table_wz5.png","#table_wz6.png"],[null,"#table_wz5.png","#table_wz6.png"],
                                    [null,"#table_wz5.png","#table_wz6.png"],[null,"#table_wz5.png","#table_wz6.png"],
                                    [null,"#table_wz5.png","#table_wz6.png"],[null,"#table_wz5.png","#table_wz6.png"],
                                    [null,"#table_wz7.png","#table_wz8.png"],[null,"#table_wz7.png","#table_wz8.png"],
                                    [null,"#table_wz7.png","#table_wz8.png"],[null,"#table_wz7.png","#table_wz8.png"],
                                    [null,"#table_wz7.png","#table_wz8.png"],[null,"#table_wz7.png","#table_wz8.png"],
                                ],
                                keys: [
                                    1,1,1,2,1,2,  1,1,1,2,1,2,  2,1,2,2,2,2,  1,1,1,1,2,1
                                ]
                            },
                        })
                        self.addChild(bg)
                        self.bgg = bg
                    }
                    var bg = self.bgg
                    bg.show()
                }
            }
        })
        this.initPeople()
        this.initUI()
        return true
    },

    initUI:function(){
        var self = this
        loadPlist("do2_plist")

        self.nodebs.show(function(){
            self.nodebs.say({key:"do2_tip1"})
        })

        var str = "点击下面的实物图，观察各种液体的特征，\n并将你所观察到的特征填入表格中。"
        var label = new cc.LabelTTF(str,"",28)
        self.addChild(label)
        label.setPosition(700,530)
        
        var createSp = function(img,pos,father){
            var sp = new cc.Sprite(img)
            sp.setPosition(pos)
            father.addChild(sp)
            return sp
        }

        for(var i = 1 ; i < 7 ; i++){
            var img = sprintf("#touch_%d.png",i)
            var touch = createSp(img,cc.p(200+(i-1)*120,50),self)
            touch.setAnchorPoint(0.5,0)
            touch.index = i
            createTouchEvent({
                item:touch,
                begin: function(data){
                    var item = data.item
                    bigTouch.setSpriteFrame(sprintf("bigTouch_%d.png",item.index))
                    bigTouch.setPosition(850,420)
                    return true
                }
            })
        }

        var bigTouch = createSp("#bigTouch_1.png",cc.p(0,-500),self)
        bigTouch.close = new ccui.Button(res.btn_tipclose_normal,res.btn_tipclose_select)
        bigTouch.addChild(bigTouch.close)
        bigTouch.close.setPosition(bigTouch.width-30, bigTouch.height-30)
        bigTouch.close.addClickEventListener(function(data){
            bigTouch.setPositionY(-500)
        })
        createTouchEvent({
            item: bigTouch,
            begin: function(data){
                return true
            },
            move: function(data){
                var item = data.item
                var delta = data.delta
                item.x += delta.x 
                item.y += delta.y
            }
        })

        bigTouch.runAction(cc.sequence(
            cc.delayTime(3),
            cc.callFunc(function(){
                if (!self.bgg) {
                    loadPlist("tableWz_plist")
                    var bg = createBiaoge({
                        json: res.bbyt_tableNode_json,
                        scale: 0.9,
                        judgeScale: 0.7,
                        downData: {
                            nums: 24,
                            scale: 1.5,
                            bufs: [
                                [null,"#table_wz1.png","#table_wz2.png"],[null,"#table_wz1.png","#table_wz2.png"],
                                [null,"#table_wz1.png","#table_wz2.png"],[null,"#table_wz1.png","#table_wz2.png"],
                                [null,"#table_wz1.png","#table_wz2.png"],[null,"#table_wz1.png","#table_wz2.png"],
                                [null,"#table_wz3.png","#table_wz4.png"],[null,"#table_wz3.png","#table_wz4.png"],
                                [null,"#table_wz3.png","#table_wz4.png"],[null,"#table_wz3.png","#table_wz4.png"],
                                [null,"#table_wz3.png","#table_wz4.png"],[null,"#table_wz3.png","#table_wz4.png"],
                                [null,"#table_wz5.png","#table_wz6.png"],[null,"#table_wz5.png","#table_wz6.png"],
                                [null,"#table_wz5.png","#table_wz6.png"],[null,"#table_wz5.png","#table_wz6.png"],
                                [null,"#table_wz5.png","#table_wz6.png"],[null,"#table_wz5.png","#table_wz6.png"],
                                [null,"#table_wz7.png","#table_wz8.png"],[null,"#table_wz7.png","#table_wz8.png"],
                                [null,"#table_wz7.png","#table_wz8.png"],[null,"#table_wz7.png","#table_wz8.png"],
                                [null,"#table_wz7.png","#table_wz8.png"],[null,"#table_wz7.png","#table_wz8.png"],
                            ],
                            keys: [
                                1,1,1,2,1,2,  1,1,1,2,1,2,  2,1,2,2,2,2,  1,1,1,1,2,1
                            ]
                        },
                    })
                    self.addChild(bg)
                    self.bgg = bg
                    self.bgg.setPositionY(-1000)
                }
            })
        ))
    },

    initPeople: function() {
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,99)
        
        addContent({
            people: this.nodebs,
            key: "do2_tip1",
            img: res.do2_tip1,
            sound: res.do2_sound1,
        })
    },
})
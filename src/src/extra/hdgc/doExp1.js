//@author mu @16/5/11

var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp1",
    preLayer: "doLayer",
    ctor: function() { //创建时调用 未删除不会重复调用
        this.load(function() {
        });
        this._super()
        this.expCtor()
        this.initPeople()
        this.initUI()
        this.initData()
        this.createTool()

        return true
    },
    dataControl:{},
    initData:function(){
        var self = this
        var node = self.node
       this.alldata = [
           {
               sp:node.huae,
               rect:cc.rect(380,200,350,90),
               changeres:node.huae_select,
               flag:true,
               respos:[30,90],
               counts:1,
               save:true,
           },
           {
               sp:node.huapian,
               rect:cc.rect(400,300,330,140),
               changeres:node.huaban,
               flag:false,
               respos:[50,200],
               counts:1,
               save:true,
           },
           {
               sp:[node.huarui,node.huaruipre],
               rect:cc.rect(450,230,200,90),
               changeres:node.kunhua,
               flag:false,
               respos:[80,80],
               counts:2,
               save:true,
           },
           {
               sp:node.tou,
               rect:cc.rect(520,190,60,220),
               changeres:node.tou2,
               flag:false,
               respos:[90,80],
               counts:1,
               save:true,
           }
       ]
    },
    initUI: function() {
        var self = this
        var uilist = [
            "item_hb", "item_hy", "item_hs", "item_he", "item_ht",
            "item_zt","item_hz", "item_zf","item_pz", "node_wz",
             "huae", "huapian", "huarui", "huae_select",
            "jiepouBg","huaban","kunhua","tou","huaruipre","tou2",
            "huayao2","huaduo","jielunbtn"
        ]
        self.node = loadNode(res.hdgc_do1,uilist)
        var node = self.node
        self.inside_node.addChild(node)
        node.jiepouBg.setLocalZOrder(10)
        self.peachStructure()
        node.jielunbtn.setVisible(false)
        node.jielunbtn.addClickEventListener(function() {
             self.nodebs.say({
                            key: "jielun2"
                        })
        })
    },

    createTool:function(){
        var self = this
        var node = self.node
        var toolnode = new cc.Node()
        node.addChild(toolnode,5)
        node.kunhua.flag = false
        node.kunhua.save = true
        node.kunhua.isspeak = false
        node.tou.flag = false
        node.tou.save = true

        var toolbtn = createTool({
            pos: cc.p(100, 500),
            nums: 2,
            tri: "down",
            showTime: 0.3,
            moveTime: 0.2,
            devide: cc.p(1.6, 1.5),
            itempos: cc.p(0, -20),
            circlepos: cc.p(0, 15),
            ifcircle: true,
            arrow:true,
            myrect:cc.rect(0,0,100,188),
            father: toolnode,
            counts: [1, 1],
            swallow: [true, true],
            files: [res.tool_niezi, res.tool_jpd],
            gets: [res.niezi_normal, res.tool_jp],
            firstClick: function(data) {
                if(!node.tou.flag && data.index==1){
                    dialogControl.AddDialog("Tips", {
                        res: res.tishi2,
                        face: 1
                    });

                    return false
                }

                return true
            },
            clickfun:function(data){
                var item = data.sp
                var index = data.index
                var pos = data.pos
                if(index == 0){
                    item.setTexture(res.niezi_normal)

                    var itemtouchpos = cc.p(item.x-item.width/2,item.y-item.height/2)
                    //花粉
                    if(node.kunhua.save)
                       if(node.kunhua.flag)
                         if(cc.rectContainsPoint(cc.rect(node.kunhua.x-90,node.kunhua.y+40,
                            100,90),itemtouchpos)){
                            node.kunhua.getChildren()[0].removeFromParent()
                            item.fllowsp = node.huayao2
                            node.huaduo.setPosition(400,360)
                            node.huaduo.setOpacity(100)
                            node.kunhua.save = false
                            node.tou.flag = true
                            node.huaduo.runAction(cc.sequence(
                                 cc.moveBy(0.1,cc.p(0,10)),
                                 cc.callFunc(function(){
                                    node.huaduo.setOpacity(255)
                                     node.huaduo.setLocalZOrder(10)
                                 })
                            ))

                             self.addSpriteMove(node.huayao2,5,1)
                             self.addSpriteMove(node.huaduo,10,6)
                         }


                    //解剖
                    for(var i=0;i<self.alldata.length;i++){
                        if(cc.rectContainsPoint(self.alldata[i].rect,itemtouchpos)){
                                if(self.alldata[i].save)
                                    if(self.alldata[i].flag){

                                        var tmppos = cc.p(item.x-self.alldata[i].respos[0],item.y-self.alldata[i].respos[1])
                                        item.setTexture(res.niezi_jia)
                                        if(self.alldata[i].counts!=1)
                                            for(var k in self.alldata[i].sp)
                                                self.alldata[i].sp[k].removeFromParent()
                                        else
                                            self.alldata[i].sp.removeFromParent()

                                        self.alldata[i].changeres.setPosition(tmppos)

                                        self.addSpriteMove(self.alldata[i].changeres,5,1)

                                        item.fllowsp = self.alldata[i].changeres
                                        item.respos = self.alldata[i].respos

                                        if(4 == (i+1)){
                                            node.kunhua.flag = true
                                            node.kunhua.isspeak = true
                                        }


                                        if(self.alldata[i+1])
                                        self.alldata[i+1].flag = true
                                        self.alldata[i].save = false
                                        break
                                    }else{
                                        dialogControl.AddDialog("Tips", {
                                            res: res.tishi1,
                                            face: 1
                                        });
                                    }
                        }
                    }
                }

                return true
            },
            movefun:function(data){
                var item = data.sp
                var index = data.index
                var delta = data.delta
                item.x += delta.x
                item.y += delta.y

                if(index==0){
                    if(item.fllowsp)
                        item.fllowsp.setPosition(item.x-item.respos[0],item.y-item.respos[1])
                }else if(index==1){

                    var tmpppos = node.tou2.convertToNodeSpace(cc.p(item.x-item.width/2,item.y+item.height/2))
                    var tmprect = cc.rect(0,0,node.tou2.width-20,node.tou2.height-20)
                    if(node.tou.save)
                         if(node.tou.flag)
                            if(cc.rectContainsPoint(tmprect,tmpppos)){
                                    item.removeFromParent()
                                    var jiepou = ccs.load(res.hdgc_jiepuo).node
                                    var jiepouac = ccs.load(res.hdgc_jiepuo).action
                                    jiepouac.gotoFrameAndPlay(0,53,false)
                                    jiepou.x = node.tou2.x+186.55
                                    jiepou.y = node.tou2.y-19.79
                                    node.tou2.getParent().addChild(jiepou)
                                    node.tou2.setVisible(false)
                                    jiepouac.setLastFrameCallFunc(function(){
                                        node.tou2.setTexture(res.qiepeizhu)
                                        node.tou2.setVisible(true)
                                        jiepou.removeFromParent()
                                        var peizhu = new cc.Sprite(res.peizhu)
                                        peizhu.setPosition(900,350)
                                        node.tou2.getParent().addChild(peizhu)
                                        node.jielunbtn.setVisible(true)

                                        self.addSpriteMove(peizhu,10,6)
                                    })
                                    jiepou.runAction(jiepouac)
                                    node.tou.save = false
                            }
                }

            },
            outfun:function(data){
                var item = data.sp
                var index = data.index
                if(index == 0){
                    item.setTexture(res.niezi_select)
                    item.fllowsp = null

                    if(!node.kunhua.save){
                        item.removeFromParent()
                        self.nodebs.say({
                            key: "wenzi3",
                            force:true
                        })
                    }
                }
                if(node.kunhua.isspeak){
                    self.nodebs.say({
                        key: "wenzi2",
                        force:true
                    })
                    node.kunhua.isspeak = false
                }

            }
        });
        node.addChild(toolbtn,1)
        toolbtn.show()
    },
    addSpriteMove:function(node,beginZero,endZero){
        createTouchEvent({
            item:node,
            begin:function(data){
                data.item.setLocalZOrder(beginZero)
                return true
            },
            move:function(data){
                data.item.x += data.delta.x
                data.item.y += data.delta.y

            },
            end:function(data){
                data.item.setLocalZOrder(endZero)
            }
        })
    },
    //桃花的结构和功能
    peachStructure:function(){
        var self = this
        var node  = self.node
        var mapping = [
            "wenzi_mr", "wenzi_hb", "wenzi_hy", "wenzi_hs", "wenzi_he",
            "wenzi_ht", "wenzi_zt","wenzi_hz", "wenzi_zf","wenzi_pz",
        ]
        var judgeList = [
            null, "item_hb", "item_hy", "item_hs", "item_he",
            "item_ht", "item_zt","item_hz", "item_zf","item_pz"
        ]
        var addContens = function() {
            for (var i = 0; i < mapping.length; i++) {
                addContent({
                    people: self.nodebs,
                    key: mapping[i],
                    sound: res[sprintf("hdgc_do1_sound%d", i + 1)]
                })
            }
        }

        addContens()
        node.showIndex = function(index) {
            var wz = node.node_wz
            for (var i = 0; i < mapping.length; i++) {
                var child = wz.getChildByName(mapping[i])
                var judge = node[judgeList[i]]
                if (index == i) {
                    self.nodebs.say({
                        key: mapping[index],
                        force: true,
                    })
                    child.setVisible(true)
                    if (judge) {
                        judge.getChildByName("select").setVisible(true)
                        judge.getChildByName("normal").setVisible(false)
                    }
                } else {
                    child.setVisible(false)
                    if (judge) {
                        judge.getChildByName("select").setVisible(false)
                        judge.getChildByName("normal").setVisible(true)
                    }
                }
            }
        }
        node.jiepouAddTouch = function(){
            for (var i = 0; i < judgeList.length; i++) {
                var item = node[judgeList[i]]
                if (item) {
                    var judge = item.getChildByName("normal")
                    judge.index = i
                    createTouchEvent({
                        item: judge,
                        begin: function (data) {
                            var item = data.item
                            node.showIndex(item.index)
                            return
                        }
                    })
                }
            }
        }
        node.jiepouAddTouch()

        var jiepouBg = node.getChildByName("jiepouBg")
        jiepouBg.setScale(0)
        createTouchEvent({
            item:jiepouBg,
            move: function (data) {
                var item = data.item;
                var delta = data.delta;
                item.x += delta.x;
                item.y += delta.y;
            }
        })
        var jiepouBtn = node.getChildByName("jiepoubtn")
        var jiepouCloseBtn = jiepouBg.getChildByName("jiepoCloseBtn")
        jiepouBtn.addClickEventListener(function(){
            if(jiepouBg.getScale() == 0){
                jiepouBg.setPosition(cc.p(568,320))
                jiepouBg.runAction(cc.scaleTo(0.2,1))
                node.showIndex(0)
            }else{
                closeJiepou()
            }
        })
        jiepouCloseBtn.addClickEventListener(function(){
            closeJiepou()
        })
        closeJiepou = function(){
            self.nodebs.stopSay()
            jiepouBg.runAction(cc.sequence(
                cc.scaleTo(0.2, 0),
                cc.callFunc(function () {
                    jiepouBg.setPosition(cc.p(568,-600))
                })
            ))
        }
    },

    myEnter: function() {
        this._super()
        if (this.nodebs) {
            var self = this
            self.nodebs.show(function() {
                self.nodebs.say({
                    key: "wenzi1",
                    force:true
                })
            })
        }
    },
    initPeople: function() {
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs);

        addContent({
            people: this.nodebs,
            key: "wenzi1",
            sound: res.nieziout,
            img: res.tishi3,
        })
        addContent({
            people: this.nodebs,
            key: "wenzi2",
            sound: res.genpoutu,
            img: res.tishi4,
        })
        addContent({
            people: this.nodebs,
            key: "wenzi3",
            sound: res.poudaoout,
            img: res.tishi5,
        })
        addContent({
            people: this.nodebs,
            key: "jielun2",
            img:res.jieluntip2,
            id:"result",
            sound: res.jielun2,
            offset: cc.p(20, 20),
            offbg: cc.p(10,15),
        })
    }
})
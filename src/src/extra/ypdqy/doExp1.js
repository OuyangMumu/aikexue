//@author mu @16/5/11
var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp1",
    preLayer: "doLayer",
    ctor: function() { //创建时调用 未删除不会重复调用
        this.load(function() {
           loadPlist("tools")
           loadPlist("yaoOne")
           loadPlist("yaoTwo")
           loadPlist("yaoThree")
        })
        this._super()
        var self = this
        this.expCtor()
        this.initData()
        this.initPeople()
        this.initUI()
        return true
    },
    initData:function(){
        var self = this
        self.info = [
            {
                shao:"#shao1.png",
                box:"#redbox1.png",
                idname:"#idname1.png",
                cupres:"yaoOne%02d.png",
                idpos:cc.p(0,-30),
                tippos:cc.p(130,20),
                cuppos:cc.p(574.2,375.3),
                cupAnch:cc.p(0.51,0.57),
                str:"        往试管里装入固体粉末时,为避免药品沾在试管口\n或壁上,可先使试管倾斜,把盛有药品的药匙小心地送入\n试管底部,然后使试管直立起来。"  
            },
            {
                shao:"#shao2.png",
                box:"#redbox2.png",
                idname:"#idname2.png",
                cupres:"yaoTwo%02d.png",
                idpos:cc.p(0,40),//cc.p(0,-30)
                angle:-90,
                end:32,
                preend:6,
                src:cc.p(0,-10),
                des:cc.p(0,10),
                tippos:cc.p(127,85),
                cuppos:cc.p(574,378),
                cupAnch:cc.p(0.48,0.29),
                str:"        往试管里装入固体粉末时,为避免药品沾在试管口\n或壁上,可先使试管倾斜,把盛有药品的纸槽小心地送入\n试管底部,然后使试管直立起来。"
            },
            {
                shao:"#shao3.png",
                box:"#redbox3.png",
                idname:"#idname3.png",
                cupres:"yaoThree%02d.png",
                idpos:cc.p(0,-30),
                tippos:cc.p(130,20),
                cuppos:cc.p(574,377),
                cupAnch:cc.p(0.52,0.5),
                str:"        取用块状固体药品,要用镊子夹取。把密度较大的固\n体颗粒放入试管口以后,缓缓地把试管竖起了,使颗粒沿着\n试管壁滑下,以免打破试管。"
            }
        ]
    },
    initUI:function(){
        var self = this
        var toolnode = new cc.Node()
        this.addChild(toolnode,5)
        this.toolnode = toolnode
        this.toolbtn = createTool({
            pos:cc.p(105, 500),
            nums:3,
            tri:"down",
            modify:cc.p(1, 1.2),
            devide:cc.p(1.4, 1.2),
            itempos:cc.p(5, -9),
            circlepos:cc.p(0, 15),
            showTime:0.3,
            moveTime:0.2,
            scale:0.85,
            itemScale:0.95,
            ifcircle: true,
            firstClick: function(data) {
                var index = data.index
                var item = data.sp
                item.nopos = true
                if(!self.first){
                    self.first = true
                    self.toolbtn.outItem(0)
                    self.toolbtn.listview.changeView(0, false)
                }
                for(var i in toolnode.getChildren()){
                    if(toolnode.getChildren()[i].forceBack){
                        toolnode.getChildren()[i].forceBack()
                    }
                }
                item.setVisible(false)
                item.setPosition(0,-600)
                self.createDetail(index)
                return true
            },
            movefun:function(){
            },
            backfun:function(data){
                var item = data.sp
                item.setPosition(0,-600)
                return false
            },
            counts:[1,1,1],
            father:toolnode,
            files:[res.item1,res.item2,res.item3],
            gets:[res.item1,res.item2,res.item3]
        })
        this.addChild(this.toolbtn,3)

        self.createDetail(0,true)
    },
    createDetail:function(index,fir){
        var self = this
        if(self.curShow){
            self.curShow.removeFromParent()
            self.curShow = null
        }
        if(!fir){
            self.curShow = self.createYao(self.info[index])
            self.addChild(self.curShow)
            self.nodebs.stopSay()
            self.nodebs.runAction(cc.sequence(
                cc.delayTime(1.7),
                cc.callFunc(function(){
                    self.speakeBykey(sprintf("wenzi%d",index+1))
                })
            ))
        }else{
            self.curShow = self.createYao(self.info[index],0.5)
            self.addChild(self.curShow)
        }
    },
    createYao:function(data,strTime){
        var shao = data.shao
        var box = data.box
        var idname = data.idname
        var cupres = data.cupres
        var idpos = data.idpos
        var angle = data.angle
        var src = data.src
        var des = data.des
        var str = data.str
        var tippos = data.tippos
        var cuppos = data.cuppos
        var cupAnch = data.cupAnch
        var strTime = strTime || 0
        var end = data.end || 33
        var preend = data.preend || 7

        var node = new cc.Node()

        var cup = new cc.Sprite(sprintf("#"+cupres,0))
        cup.setPosition(cuppos)
        cup.setAnchorPoint(cupAnch)
        node.addChild(cup)
        node.cup = cup
        cup.playAc = function(type){
            cup.stopAllActions()
            switch(type)
            {
                case 1:
                    var spAction = createAnimation({
                                            frame:cupres,
                                            start:0,
                                            end: preend,
                                            time: 0.03
                                        })
                    cup.runAction(spAction)
                break
                case 2:
                    var spAction = createAnimation({
                                            frame:cupres,
                                            start:8,
                                            end: end,
                                            time: 0.1
                                        })
                    cup.runAction(spAction)
                break
            }
        }

        var tool = new cc.Sprite(shao)
        tool.setPosition(830,360)
        node.addChild(tool)

        var redbox = new cc.Sprite(box)
        redbox.setPosition(tool.width/2,tool.height/2)
        tool.addChild(redbox)
        redbox.setVisible(false)
        tool.redbox = redbox

        node.createTip = function(data){
            var angle = data.angle || 0
            var src = data.src || cc.p(-10,0)
            var des = data.des || cc.p(10,0)
            var img = data.img
            var imgpos = data.imgpos || cc.p(0,0)
            var node = new cc.Node()
            var yellow = new cc.Sprite("#jt.png")
            yellow.setRotation(angle)
            node.addChild(yellow)
            var seq = cc.sequence(cc.moveTo(0.3,src),cc.moveTo(0.3,des))
            yellow.runAction(cc.repeatForever(seq))

            var sp = new cc.Sprite(img)
            sp.setPosition(imgpos)
            node.addChild(sp)
            return node
        }
        var tip = node.createTip({img:idname,imgpos:idpos,angle:angle,src:src,des:des})
        tip.setPosition(tippos)
        tool.addChild(tip)
        tool.tip = tip

        node.runAction(cc.sequence(
            cc.delayTime(strTime),
            cc.callFunc(function(){
                var label = addTimerLabel({
                      str:str,
                      strSize:25,
                      strSpeed:0.27,
                      strPos:cc.p(300,160),
                      startDelay:true
                    })
                node.addChild(label)
            })
        ))


        createTouchEvent({
            item:tool,
            begin:function(data){
                var item = data.item
                item.tip.setVisible(false)
                item.redbox.setVisible(true)
                if(!item.shows){
                    item.shows = true
                    cup.playAc(1) 
                } 
                return true
            },
            move:function(data){
                var item = data.item
                var delta = data.delta
                if(!item.noMove)
                {
                    item.x += delta.x
                    item.y += delta.y
                    if(judgeInside({item:item.redbox,pos:cup.getPosition()}))
                    {
                        item.noMove = true
                        item.setVisible(false)
                        item.setPosition(item.x,-700)
                        cup.playAc(2)
                    }
                }
            }
        })

        return node
    },
    speakeBykey:function(key){
       this.nodebs.say({
                    key: key,
                    force: true
                })
    },
    myEnter: function() {
        this._super()
        if (this.nodebs) {
            var self = this
            self.toolbtn.show()
            self.toolbtn.inItem(0)
            self.nodebs.show(function() {
                self.speakeBykey("wenzi1")
            })
        }
    },
    initPeople:function(){
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,900);
        
        addContent({
            people: this.nodebs,
            key: "wenzi1",
            sound: res.zimp1
        })

        addContent({
            people: this.nodebs,
            key: "wenzi2",
            sound: res.zimp2
        })

        addContent({
            people: this.nodebs,
            key: "wenzi3",
            sound: res.zimp3
        })
    }  
})
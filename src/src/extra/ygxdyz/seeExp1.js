var seeExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true,
    layerName: "seeExp1",
    preLayer: "seeLayer",
    ctor: function () {
        this._super();
        this.expCtor();
        //this.initPeople();
        this.initUI();
        return true;
    },

    initUI:function(){
        var uiList = [
            "sun","zhong","fen","shi","seeWatch","tubiao","tree","shadow",
            "layout","yeline","lineshu","linezhi","linezhi2","figure","hand"
        ]
        var self = this
        loadPlist("seeImg_plist")
        loadPlist("shadow_plist")
        var node = loadNode(res.ygxdyz_seeExp1_json,uiList)
        self.inside_node.addChild(node)

        //刻度表上阴影位置和大小
        var kdPosX = [79,122,166,211,254,298,342,385,429,473,518]
        var kdscale = [1.7,1,0.6,0.33,0.18,0.08,0.19,0.38,0.65,1.08,1.75]
        var aniNum = [1,1,7,13,19,25, 31,37,42,47,52, 1,6,12,18,24,30, 36,41,46,51,56]
        var sunrote = [-60,-50,-40,-30,-15,0,15,30,40,50,60]
        var shirote = [-150,-120,-90,-60,-30,0,30,60,90,120,150]
        //layout高度
        var layoutH = [165,145,120,90,83,25,60,76,92,112,130]
        //横杠坐标
        var gangPos = [cc.p(787,100),cc.p(742,117),cc.p(715,143),cc.p(655,173),cc.p(590,180),
            cc.p(590,238),cc.p(574,203),cc.p(497,188),cc.p(471,171),cc.p(443,151),cc.p(400,132)
        ]
        //倾斜角度,长度
        var linerate = [40,44,44,55,90,90,105,140,142,142,145]
        var linescale = [1.7,1.4,1.16,0.74,0.56,0.18,0.42,0.8,1,1.24,1.54]

        //1085  1105
        node.hand.runAction(cc.repeatForever(cc.sequence(
            cc.moveTo(0.2,1085,375),
            cc.delayTime(0.1),
            cc.moveTo(0.2,1105,375),
            cc.delayTime(0.1)
        )))

        var btn_next = new ccui.Button(res.btn_next1,res.btn_next2)
        btn_next.setPosition(node.zhong.x,node.zhong.y-80)
        self.addChild(btn_next)
        var curIndex = 1
        //判断图标里面是否显示
        var judgeCur = [false,false,false,false,false,false,false,false,false,false,false]
        
        btn_next.change = false
        btn_next.addClickEventListener(function(){
            if(btn_next.change){//用于判断是否需要改变按钮的图片
                btn_next.change = false
                btn_next.loadTextures(res.btn_next1,res.btn_next2)
            }
            if(curIndex > 10){
                node.tubiao.removeAllChildren(true)
                node.sun.setRotation(-60)
                curIndex = 0
                for(var i = 0 ; i < 11 ; i++){
                    judgeCur[i] = false
                }
            }else if(curIndex == 10){
                btn_next.change = true
                btn_next.loadTextures(res.btn_next3,res.btn_next2)
            }
            node.sun.stopAllActions()
            node.seeWatch.stopAllActions()
            node.shadow.stopAllActions()
            node.shi.runAction(cc.rotateTo(0.3,shirote[curIndex]))
            node.fen.setRotation(0)
            node.fen.runAction(cc.rotateBy(0.3,360))
            node.sun.runAction(cc.rotateTo(0.3,sunrote[curIndex]))
            node.seeWatch.runAction(ani("seeWatch%02d.png",1,5,0.15))
            visiFun(false)
            judgeShadow(curIndex)
            curIndex++
        })

        var visiFun = function(judge){
            node.linezhi.setVisible(judge)
            node.linezhi2.setVisible(judge)
            node.layout.setVisible(judge)
            node.figure.setVisible(judge)
            node.hand.setVisible(judge)
            node.lineshu.stopAllActions()
            node.lineshu.setScaleX(0)
        }

        
        var kdFun = function(index){
            var kd = new cc.Sprite("#kd.png")
            kd.setPosition(kdPosX[index],22)
            node.tubiao.addChild(kd)
            kd.setScaleY(0)
            kd.setAnchorPoint(0.5,0)
            kd.runAction(cc.scaleTo(0.2,1,kdscale[index]))
            judgeCur[index] = true
        }
        var kdFun2 = function(index){
            var kd = new cc.Sprite("#kd.png")
            kd.setPosition(kdPosX[index],22)
            node.tubiao.addChild(kd)
            kd.setAnchorPoint(0.5,0)
            kd.setScaleY(kdscale[index])
        }
        var judgeShadow = function(index){
            if(index > 0){//判断上一次的没有显示
                if(!judgeCur[index-1])
                    kdFun2(index-1)
            }
            node.shadow.runAction(cc.sequence(
                ani("shadow%02d.png",aniNum[index],aniNum[index+11],0.12),
                cc.callFunc(function(){
                    node.seeWatch.runAction(aniRever("seeWatch%02d.png",1,5,0.15))
                    kdFun(index)
                    changeFather({
                        item:node.yeline,
                        father:node,
                    })
                    visiFun(true)
                    node.lineshu.setRotation(linerate[index])
                    node.lineshu.runAction(cc.scaleTo(0.3, linescale[index], 1))
                    node.linezhi.setPosition(gangPos[index])
                    node.layout.height = layoutH[index]
                    node.yeline.setScaleX(0)
                    node.yeline.setRotation(linerate[index])
                    node.yeline.runAction(cc.scaleTo(0.3,1.9,0.8))
                    node.figure.setSpriteFrame(sprintf("figure%02d.png",index+1))
                    node.figure.setPosition((node.linezhi.x+node.linezhi2.x)/2+40,(node.linezhi.y+node.linezhi2.y)/2)
                    changeFather({
                        item:node.yeline,
                        father:node.layout,
                    })
                })
            ))
        }
        var ani = function(frame,start,end,time) {
            return cc.sequence(createAnimation({
                frame: frame,
                start: start,
                end: end,
                time:time,
            }))
        }
        var aniRever = function(frame,start,end,time) {
            return cc.sequence(createAnimation({
                frame: frame,
                start: start,
                end: end,
                time:time,
                rever:true,
            }))
        }
        visiFun(false)
        judgeShadow(0)

    }
})
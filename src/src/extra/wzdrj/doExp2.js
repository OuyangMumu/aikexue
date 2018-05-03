/**
 * Created by Administrator on 2016/7/19.
 */
var doExp2 = myLayer.extend({
    sprite: null,
    changeDelete: true,
    layerName: "doExp2",
    preLayer: "doLayer",
    ctor: function () {
        var self = this
        this._super();
        this.expCtor({
            vis: false,
            setZ:99,
            settingData: {
                pos: cc.p(1080, 580),
                biaogeFun:function(){
                    if(!self.biaoge){
                        var bg = createBiaoge({
                            json: res.wzdrj_table2_json,
                            scale:0.85,
                            downData: {
                                nums: 4,
                                bufs: [
                                    [null, res.do2_bg_1, res.do2_bg_2, res.do2_bg_3,  res.do2_bg_4],
                                    [null, res.do2_bg_1, res.do2_bg_2, res.do2_bg_3,  res.do2_bg_4],
                                    [null, res.do2_bg_1, res.do2_bg_2, res.do2_bg_3,  res.do2_bg_4],
                                    [null, res.do2_bg_1, res.do2_bg_2, res.do2_bg_3,  res.do2_bg_4],
                                ],
                                keys: [
                                    4, 1, 2, 3
                                ]
                            },
                        })
                        self.biaoge = bg
                        safeAdd(self, bg)
                    }
                    self.biaoge.show()
                },
            }
        })
        this.initPeople();
        this.initUI();
        return true;
    },
    initUI: function () {
        var self = this
        loadPlist("spoon")
        loadPlist("gmsj")
        loadPlist("jiaobanPlist")
        var uiList = ["paper" , "shaobei" , "spoon" ,"hand",
             "yt", "bang" , "jieshao" , "hand2" , "jiaoban"
        ]
        var node = loadNode(res.wzdrj_do2_json,uiList)
        self.inside_node.addChild(node)

        var btn_introduce = new ccui.Button(res.btn_introduce_normal,res.btn_introduce_select)
        btn_introduce.setPosition(750,490)
        self.addChild(btn_introduce)
        var  btn_filter = new ccui.Button(res.btn_filter_normal,res.btn_filter_select)
        btn_filter.setPosition(940,490)
        self.addChild(btn_filter)

        var shaobei = node.shaobei
        var paper = node.paper
        var yt = node.yt
        var spoon = node.spoon
        var hand = node.hand
        var jiaoban = node.jiaoban
        btn_introduce.addClickEventListener(function(){
            changeCall(0)
        })
        btn_filter.addClickEventListener(function(){
            changeCall(1)
        })
        var changeCall = function(index){
            var index = index
            if(index == 0){
                self.nodebs.stopSay()
                btn_filter.loadTextures(res.btn_filter_normal,res.btn_filter_select)
                btn_introduce.loadTextures(res.btn_introduce_select,res.btn_introduce_normal)
                node.jieshao.setPosition(500,240)
                for (var i = 3; i >= 0; i--) {
                    node[uiList[i]].setPositionY(-600)
                }
            }else{
                btn_filter.loadTextures(res.btn_filter_select,res.btn_filter_normal)
                btn_introduce.loadTextures(res.btn_introduce_normal,res.btn_introduce_select)
                //重置所有的操作值
                shaobei.setPosition(260,160)
                paper.setPosition(620,140)
                spoon.setPosition(730,350)
                node.jieshao.setPositionY(-800)
                spoon.setRotation(50)
                spoon.stopAllActions()
                spoon.setSpriteFrame("spoon1.png")
                spoon.have = false
                spoon.removeTouch = false
                yt.stopAllActions()
                yt.setSpriteFrame("gmsj01.png")
                jiaoban.stopAllActions()
                jiaoban.setSpriteFrame("jiaoban24.png")
                jiaoban.unscheduleAllCallbacks()
                hand.setPositionY(-500)
                self.nodebs.say({key:"do2_tip1",force:true})
            }
        }
        changeCall(0)

        var handList = [hand,node.bang,node.hand2]
        spoon.have = false
        spoon.removeTouch = false
        var filterProcess = function(){
            createTouchEvent({
                item:spoon,
                begin:function(){
                    return true
                },
                move:function(data){
                    var item = data.item
                    var delta = data.delta
                    if(spoon.removeTouch)  return
                    item.x += delta.x
                    item.y += delta.y
                    if(!item.have && checkDistans(item,paper,150)){
                        item.removeTouch = true
                        item.have = true
                        item.setRotation(0)
                        item.setPosition(720,230)
                        item.runAction(aniSpoon(4,"spoon_one%02d.png"))
                    }
                    //和烧杯碰撞之后播的动画
                    if(item.have && checkDistans2(item,shaobei)){
                        item.removeTouch = true
                        item.have = false
                        item.setRotation(0)
                        item.setPosition(340,280)
                        item.runAction(aniSpoon(9,"spoon_two%02d.png"))
                        yt.runAction(anigmsj(1,8,"gmsj%02d.png"))   //播放高锰酸钾的动画
                    }

                },
                end:function(){

                }
            })
            for (var i = 0 ; i < handList.length ; i++){
                handList[i].index = i
                createTouchEvent({
                    item:handList[i],
                    begin:function(){
                        return true
                    },
                    move:function(data){
                        var item = data.item
                        var delta = data.delta
                        var index = item.index
                        if(index == 0 || index == 1 || index == 2){
                            hand.x += delta.x
                            hand.y += delta.y
                            //检测是否和烧杯接触
                            if(checkDistans3(hand)){
                                hand.setPositionY(-500)
                                jiaoban.runAction(anijiaoban(1,8))
                                jiaoban.scheduleOnce(function(){
                                    jiaoban.stopAllActions()
                                    jiaoban.runAction(anijiaoban(17,24))
                                },5)
                            }
                        }
                    }
                })
            }

            var anijiaoban = function(start,end) {
                return cc.sequence(createAnimation({
                    frame: "jiaoban%02d.png",
                    start: start,
                    end: end,
                    time: 0.15
                }), cc.callFunc(function() {
                    jiaoban.stopAllActions()
                    if(start == 1){
                        jiaoban.runAction(anirepeat())
                        yt.runAction(anigmsj(9,17,"gmsj%02d.png"))
                    }
                }))
            }
            var anirepeat = function(){
                return cc.repeatForever(cc.sequence(createAnimation({
                    frame:"jiaoban%02d.png",
                    start: 9,
                    end: 16,
                    time: 0.1
                })))
            }
            var anigmsj = function(start,end,frame) {
                return cc.sequence(createAnimation({
                    frame: frame,
                    start:start,
                    end: end,
                    time: 0.25
                }), cc.callFunc(function() {
                }))
            }
            var aniSpoon = function(end,frame) {
                return cc.sequence(createAnimation({
                    frame: frame,
                    end: end,
                    time: 0.2
                }), cc.callFunc(function() {
                    spoon.setRotation(50)
                    if(end == 4){
                        spoon.setSpriteFrame("spoon2.png")
                        spoon.removeTouch = false
                    }else if(end == 9){
                        spoon.setPositionY(-500)
                        hand.setPosition(500,480)
                        self.nodebs.say({key:"do2_tip2",force:true})
                    }
                }))
            }

            var checkDistans = function(target1,target2,dis) {
                var dx = target1.x - target2.x
                var dy = target1.y - target2.y
                var distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))
                if (distance <= dis)
                    return true
                else
                    return false
            }
            //检测勺子和烧杯之间的距离
            var checkDistans2 = function(target1,target2) {
                var dx = target1.x - target2.x
                var dy = target1.y - (target2.y + target2.height/2)
                var distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))
                if (distance <= 150)
                    return true
                else
                    return false
            }
            //检测玻璃棒和烧杯之间的距离
            var checkDistans3 = function(target1) {
                var dx = target1.x - 370
                var dy = target1.y - 480
                var distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))
                if (distance <= 70)
                    return true
                else
                    return false
            }
        }
        filterProcess()
    },

    initPeople : function(){
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
        addContent({
                people: this.nodebs,
                 key: "do2_tip2",
                img: res.do2_tip2,
                sound: res.do2_sound2,
            })
    }
})
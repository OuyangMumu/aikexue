var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, 
    layerName: "doExp1", 
    preLayer: "doLayer", 
    ctor: function() { 
        this._super()
        var self = this
        this.expCtor({
            settingData: {
                pos: cc.p(1080, 580),
                biaogeFun: function() {
                    if (!self.bgg) {
                        var bg = createBiaoge({
                            json: res.czhsz_tableNode1_json,
                            scale: 0.9,
                            //judgeScale: 0.7,
                            downData: {
                                nums: 5,
                                scale: 1.5,
                                bufs: [
                                    [null,res.table_1,res.table_2,res.table_3],
                                    [null,res.table_1,res.table_2,res.table_3],
                                    [null,res.table_1,res.table_2,res.table_3],
                                    [null,res.table_1,res.table_2,res.table_3],
                                    [null,res.table_1,res.table_2,res.table_3]
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
        loadPlist("do1_plist")

        var createSp = function(img,pos,father){
            var sp = new cc.Sprite(img)
            sp.setPosition(pos)
            father.addChild(sp)
            return sp
        }

        self.nodebs.show(function(){
            self.nodebs.say({key:"do_tip1"})
        })

        var normal = []
        var select = []
        normal[0] = createSp("#do1_down_1.png",cc.p(130,370),self)
        normal[1] = createSp("#do1_up_1.png",cc.p(130,300),self)
        select[0] = createSp("#do1_down_2.png",cc.p(130,370),self)
        select[1] = createSp("#do1_up_2.png",cc.p(130,300),self)
        createSp("#do1_tiji.png",cc.p(400,80),self)
        var child = createSp("#child01.png",cc.p(400,320),self)
        child.setScale(0.9)
        var smallKedu = createSp("#do1_kedu.png",cc.p(500,103),self)
        var zhizhen2 = createSp("#do1_zhizhen01.png",cc.p(135,61),smallKedu)
        smallKedu.setScale(0.15)
        smallKedu.setRotation(90)
        var kedu = createSp("#do1_kedu.png",cc.p(800,450),self)
        var zhizhen = createSp("#do1_zhizhen01.png",cc.p(135,61),kedu)
        var wenzi = createSp("#do1_wenzi1.png",cc.p(800,320),self)
        wenzi.setVisible(false)

        var curIndex = 1
        var judge = true
        for(var i = 0 ; i < 2 ; i++){
            var sp = normal[i]
            sp.index = i
            select[i].setVisible(false)
            createTouchEvent({
                item:sp,
                begin:function(data){
                    var index = data.item.index
                    if(index == curIndex)   return false
                    if(!judge)      return false
                    curIndex = index
                    if(!wenzi.isVisible())
                        wenzi.setVisible(true)
                    judge = false
                    if(index == 0){
                        normal[0].setVisible(false)
                        normal[1].setVisible(true)
                        select[0].setVisible(true)
                        select[1].setVisible(false)
                        child.runAction(ani("child%02d.png",8,0.15))
                        zhizhen.runAction(cc.sequence(
                            ani("do1_zhizhen%02d.png",11,0.15),
                            cc.callFunc(function(){
                                judge = true
                            })
                        ))
                        zhizhen2.runAction(ani("do1_zhizhen%02d.png",11,0.15))
                        wenzi.setSpriteFrame("do1_wenzi1.png")
                        self.nodebs.say({key:"do_tip2",force:true})
                    }else{
                        normal[0].setVisible(true)
                        normal[1].setVisible(false)
                        select[0].setVisible(false)
                        select[1].setVisible(true)
                        child.runAction(aniRever("child%02d.png",8,0.15))
                        zhizhen.runAction(cc.sequence(
                            aniRever("do1_zhizhen%02d.png",11,0.15),
                            cc.callFunc(function(){
                                judge = true
                            })
                        ))
                        zhizhen2.runAction(aniRever("do1_zhizhen%02d.png",11,0.15))
                        wenzi.setSpriteFrame("do1_wenzi2.png")
                        self.nodebs.say({key:"do_tip3",force:true})
                    }
                    return true
                }
            })
        }

        var ani = function(frame,end,time){
            return cc.sequence(createAnimation({
                frame: frame,
                start: 1,
                end: end,
                time:time,
            }))
        }

        var aniRever = function(frame,end,time) {
            return cc.sequence(createAnimation({
                frame: frame,
                start: 1,
                end: end,
                time:time,
                rever:true
            }))
        }       
    },

    initPeople : function(){
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,99)
        var addList = [
            {key:"do_tip2",sound:res.do_sound2},
            {key:"do_tip3",sound:res.do_sound3},
        ]
        this.addList = addList
        for (var i = 0 ; i < addList.length ; i++){
            addContent({
                people: this.nodebs,
                key: addList[i].key,
                sound: addList[i].sound,
            })
        }
        addContent({
            people: this.nodebs,
            key: "do_tip1",
            img: res.do_tip1,
            sound: res.do_sound1,
        })
    },
})
var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true,
    layerName: "doExp1",
    preLayer: "doLayer",
    ctor: function () {
        var self = this
        this._super();
        this.expCtor({
            settingData: {
                pos: cc.p(1080, 580),
                biaogeFun: function() {
                    if (!self.bgg) {
                    var bg = createBiaoge({
                        json: res.flhhw_tableNode1_json,
                        scale: 0.9,
                        downData: {
                            nums: 2,
                            scale: 1.5,
                            bufs: [
                                [null, res.table1_wz1, res.table1_wz2],
                                [null, res.table1_wz1, res.table1_wz2],
                            ],
                            keys: [
                                2, 1
                            ]
                        },
                    })
                    var that = bg
                    createBgMoveSp({
                        father:that,
                        imgs:[
                            [res.draw_1,0],
                            [res.draw_2,1],
                            [res.draw_3,2],
                        ],
                        pos:cc.p(170,200),
                        dis:200,
                        //itemScale:0.9,
                        resultfather:self,
                        rectlist:[
                           cc.rect(230,340,200,150),
                        ]
                    })
                    bg.upLoadFun = function(){
                        that.upResult(function(){
                            var down1 = bg.down1
                            var down2 = bg.down2
                            return down1 && down2 && down1.getAnswer() && down2.getAnswer()
                        })
                    }
                    bg.ClearFun = function(){
                        that.clearData()
                    }
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
        return true;
    },

    initUI: function () {
        var self = this
        loadPlist("shai_plist")
        self.nodebs.show(function(){
            self.nodebs.say({key:"do1_tip1"})
        })
        var createSp = function(sprite,pos){
            var sp = new cc.Sprite(sprite)
            sp.setPosition(pos)
            self.addChild(sp)
            return sp
        }

        var zhuozi = createSp(res.zhuozi, cc.p(568,250))
        zhuozi.setScale(1.15)
        var paper = createSp(res.do1_paper, cc.p(700,250))
        var shaizi = createSp("#shai01.png", cc.p(480,280))
        var panzi = createSp(res.panzi, cc.p(300,250))
        //panzi.setScale(0.8)
        shaizi.setScale(1.2)
        paper.setScale(1.2)

        createTouchEvent({
            item:panzi,
            begin:function(data){
                var item = data.item 
                if(!item.noMove) 
                    item.setTexture(res.panzi2)
                return true 
            },
            move:function(data){
                var item = data.item
                var delta = data.delta 
                if(!item.noMove){
                    item.x += delta.x 
                    item.y += delta.y 
                }

                if(!item.noMove && checkDistance(item,shaizi)){
                    item.noMove = true
                    item.setPositionY(-600)
                    shaizi.runAction(cc.sequence(
                        ani("shai%02d.png",2,10,0.2),
                        cc.delayTime(0.2),
                        ani("shai%02d.png",11,29,0.25)
                    ))
                }
            },
            end:function(data){
                var item = data.item
                if(!item.noMove) 
                    item.setTexture(res.panzi)
            }
        })

        var ani = function(frame,start,end,time) {
            return cc.sequence(createAnimation({
                frame: frame,
                start: start,
                end: end,
                time:time,
            }))
        }

        var checkDistance = function(ra,rb){
            var dx = ra.x - rb.x
            var dy = ra.y - rb.y
            var distance = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2))
            if(distance < 100){
                return true
            }else{
                return false
            }
        }
    },

    initPeople : function(){
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,99)
        var addList = [
            {key:"do1_tip1",img:res.do1_tip1,sound:res.do1_sound1},
        ]
        for (var i = 0 ; i < addList.length ; i++) {
            addContent({
                people: this.nodebs,
                key: addList[i].key,
                img: addList[i].img,
                sound: addList[i].sound,
            })
        }
    },
})
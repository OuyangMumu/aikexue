var doExp2 = myLayer.extend({
    sprite: null,
    changeDelete: true,
    layerName: "doExp2",
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
                        json: res.flhhw_tableNode2_json,
                        scale: 0.9,
                        downData: {
                            nums: 2,
                            scale: 1.5,
                            bufs: [
                                [null, res.table2_wz1, res.table2_wz2],
                                [null, res.table2_wz1, res.table2_wz2],
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
                            [res.draw_1,1],
                            [res.draw_2,0],
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
        self.nodebs.show(function(){
            self.nodebs.say({key:"do2_tip1"})
        })
        var createSp = function(sprite,pos){
            var sp = new cc.Sprite(sprite)
            sp.setPosition(pos)
            self.addChild(sp)
            return sp
        }

        var zhuozi = createSp(res.zhuozi, cc.p(568,250))
        zhuozi.setScale(1.15)
        createSp(res.do2_paper, cc.p(568,200))
        var muxie = createSp(res.muxie, cc.p(568,210))
        var citie = createSp(res.citie, cc.p(800,230))
        muxie.setLocalZOrder(20)
        citie.setLocalZOrder(21)
        citie.setAnchorPoint(0,0)

        var tieList = []
        for(var i = 0 ; i < 12 ; i++){
            //得到随机坐标
            var randX  = 400 + Math.floor(Math.random() * 300)
            var randY = 100 + Math.floor(Math.random() * 200)
            var pos = cc.p(randX,randY)
            //得到随机角度
            var angle = Math.floor(Math.random() * 360)
            var tieding = createSp(res.tieding, pos)
            tieding.setRotation(angle)
            tieList.push(tieding)
            tieding.judge = true
        }

        createTouchEvent({
            item:citie,
            begin:function(data){
                if(judgeOpInPos(data)){
                    return true
                }
                return false 
            },
            move:function(data){
                var item = data.item 
                var delta = data.delta 
                item.x += delta.x 
                item.y += delta.y
                for(var i = 0 ; i < 12 ; i++){
                    if(tieList[i].judge && checkDistance(item,tieList[i])){
                        var tie = tieList[i]
                        tie.judge = false 
                        safeAdd(item, tie)
                        tie.setPosition(getNum())
                        tie.setLocalZOrder(-1)
                    }
                }
            }

        })

        //得到磁铁坐标的一个随机数
        var getNum = function(){
            var randX = 5 + Math.random() * 40
            var randY = 5 + Math.random() * 20
            var pos = cc.p(randX,randY)
            return pos
        }

        var checkDistance = function(ra,rb){
            var dx = ra.x - rb.x
            var dy = ra.y - rb.y
            var distance = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2))
            if(distance < 50){
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
            {key:"do2_tip1",img:res.do2_tip1,sound:res.do2_sound1},
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
var curTime = 0
var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true,
    layerName: "doExp1",
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
                            json: res.bwb_tableNode1_json,
                            scale:0.8,
                            inputNum: 12,
                            //rootColor:cc.color(130, 95, 205, 255),
                        })
                        self.biaoge = bg
                        safeAdd(self, bg)
                    }
                    self.biaoge.show()
                },
            }
        })
        this.initPeople()
        this.initUI()
        return true;
    },

    initUI: function () {
    	var self = this
        loadPlist("dks")
        loadPlist("rq_plist")

    	var uiList = [
            "panel_bxg","panel_tc","panel_sl",
            "box_bxg","box_tc","box_sl",
            "bei_bxg","bei_tc","bei_sl",
            "part_bxg","part_tc","part_sl",
            "kd_bxg","kd_tc","kd_sl",
            "line_bxg","line_tc","line_sl"
    	]
        
     	var node = loadNode(res.bwb_do1_json,uiList)
        self.inside_node.addChild(node)

        self.nodebs.show(function() {
            self.nodebs.say({key:"do1_tip1"})
        })
        var gaiList = [node.part_bxg,node.part_tc,node.part_sl]     
        for (var i = 0; i < 6; i++) {
        	node[uiList[i]].setVisible(false)
        }

        node.bwp = new cc.Sprite("#dks01.png")
        node.bwp.setPosition(180,200)
        self.addChild(node.bwp)

        var lineList = [node.line_bxg,node.line_tc,node.line_sl]
        var kdList = [node.kd_bxg,node.kd_tc,node.kd_sl]
        var hotList = []
        var stopSche = [false,false,false]
        node.bwp.over = false
        createTouchEvent({
        	item:node.bwp,
        	rect:cc.rect(40,30,node.bwp.x,node.bwp.y+node.bwp.height/2-100),
        	begin:function(data){
                var item = data.item
                item.pos = item.getPosition()
                return true
        	},
            move:function(data){
                var item = data.item
                var delta = data.delta
                if(!item.over){
                    item.x += delta.x
                    item.y += delta.y
                }
                
                if(!item.over && self.checkDistans(item,node.bei_bxg,100)){
                    item.over = true
                    item.runAction(cc.sequence(
                        cc.moveTo(0.1,cc.p(node.bei_bxg.x-150,node.bei_bxg.y+90)),
                        anidks(1,10),
                        cc.callFunc(function(){
                            createHot(node.bei_bxg)
                        }),
                        anidks(11,16),
                        cc.moveTo(0.5,cc.p(node.bei_tc.x-150,node.bei_tc.y+90)),
                        anidks(3,10),
                        cc.callFunc(function(){
                            createHot(node.bei_tc)
                        }),
                        anidks(11,16),
                        cc.moveTo(0.5,cc.p(node.bei_sl.x-150,node.bei_sl.y+90)),
                        anidks(3,10),
                        cc.callFunc(function(){
                            createHot(node.bei_sl)
                        }),
                        anidks(11,16),
                        cc.delayTime(0.3),
                        cc.callFunc(function(){
                            //将盖子盖到杯子上面
                            gaiFun()
                            item.setPositionY(-500)
                        }),
                        cc.delayTime(0.5),
                        cc.callFunc(function(){
                            openTime()
                            self.nodebs.say({key:"do1_tip2",force:true})
                        })
                    ))
                }
            },
            end:function(data){
                var item = data.item
                if(!item.over)
                    item.setPosition(item.pos)
            }
        })

        var openTime = function(){
            var watch = createWatch()
            watch.setPosition(200,250)
            watch.setScale(0.9)
            self.addChild(watch)
            for (var i = 0; i < 6; i++) {
                node[uiList[i]].setVisible(true)
            }
            
            var kdFun = function(curkd,line){
                //温度变化公式,系数为data
                var Tn = Math.pow(curkd.data,curTime)*60
                curkd.setPositionY(98+10.7*(60-Tn))
                line.setScaleY(Tn*0.1)
                if(curkd.y >= 420){
                    removeTimer(curkd.myKey)
                    stopSche[curkd.num-1] = true
                }
                    
            }

            for (var i = 0 ; i < kdList.length; i++) {
                kdList[i].dis = 4 - i*1
                if(i == 0){
                    kdList[i].dis = 2.2
                    kdList[i].data = 0.9972
                }else if(i == 1){
                    kdList[i].dis = 1.35
                    kdList[i].data = 0.9986
                }else if(i == 2){
                    kdList[i].dis = 0.91
                    kdList[i].data = 0.999
                }  
                kdList[i].myKey = sprintf("kdKey%d", i)
                kdList[i].num = i+1
                
                addTimer({
                    fun:function(buf){
                        curTime++
                        kdFun(kdList[buf],lineList[buf])
                    },
                    time:1.5,
                    repeat:1000,
                    buf:i,
                    key:sprintf("kdKey%d", i)
                })

                lineList[i].setScaleY(5)
            }
        }

        var gaiFun = function(){
            for (var i = gaiList.length - 1; i >= 0; i--) {
                gaiList[i].setRotation(0)
                gaiList[i].setPosition(40,90)
                gaiList[i].runAction(cc.moveTo(0.4,cc.p(40,11)))
            }
            for (var i = hotList.length - 1; i >= 0; i--) {
                hotList[i].removeFromParent(true)
            }
        }

        var anidks = function(start,end){
            return createAnimation({
                frame:"dks%02d.png",
                start: start,
                end: end,
                time: 0.2
            })
        }
        var createHot = function(item){
            var anirq = function(start,end) {
                return cc.repeatForever(cc.sequence(createAnimation({
                    frame: "rq%02d.png",
                    start:start,
                    end: end,
                    time: 0.2
                })))
            }

            for(var i = 0 ; i < 3 ; i++){
                var hot = new cc.Sprite(res.rq)
                item.addChild(hot)
                hot.setPosition(20+i*20,40)
                hot.start = 1 + i*1
                hot.end = 10 - i*1
                hot.runAction(anirq(hot.start,hot.end))
                hotList.push(hot)
            }
        }
    },

    checkDistans : function(target1,target2,dis) {
        var dx = target1.x - target2.x
        var dy = target1.y - target2.y
        var distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))
        if (distance <= dis)
            return true
        else
            return false
    },

    initPeople : function(){
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,99)
        var addList = [
            {key:"do1_tip1",img:res.do1_tip1,sound:res.do1_sound_1},
            {key:"do1_tip2",img:res.do1_tip2,sound:res.do1_sound_2},
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
var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, 
    layerName: "doExp1", 
    preLayer: "doLayer", 
    ctor: function() { 
        this._super()
        this.expCtor()
        this.initPeople()
        this.initUI()
        return true
    },

    initUI:function(){
        var self = this
        loadPlist("do1_plist")

        self.nodebs.show(function(){
            self.nodebs.say({key:"do1_tip1"})
        })
        var createSp = function(img,pos,father){
            var sp = new cc.Sprite(img)
            sp.setPosition(pos)
            father.addChild(sp)
            return sp
        }

        var rand = getRand(6)
        var rand2 = getRand(6)
        var cupList = []
        var biaoqianList = []
        var cupPos = [cc.p(200,370),cc.p(400,370),cc.p(600,370),
            cc.p(200,150),cc.p(400,150),cc.p(600,150)]
        var biaoqianPos = [cc.p(780,360),cc.p(780,280),cc.p(780,200),
            cc.p(910,360),cc.p(910,280),cc.p(910,200)]
        //45,24
        //物体70,25 
        for(var i = 0 ; i < 6 ; i++){

        } 
        for(var i = 0 ; i < 6 ; i++){
            cupList[i] = createSp("#beizi.png",cc.p(0,0),self)
            cupList[i].index = rand[i]
            var img = sprintf("#show%02d.png",i)
            var show = createSp(img,cc.p(70,25),cupList[i])
            show.setAnchorPoint(0.5,0)
            cupList[i].setPosition(cupPos[rand[i]])

            biaoqianList[i] = createSp("#biaoqian.png",cc.p(0,0),self)
            biaoqianList[i].index = rand[i]
            var img2 = sprintf("#judge%02d.png",i)
            createSp(img2,cc.p(45,24),biaoqianList[i])
            biaoqianList[i].setPosition(biaoqianPos[rand2[i]])
        }

        var curLocal = 10
        for(var i = 0 ; i < 6 ; i++){
            var biaoqian = biaoqianList[i]
            biaoqian.noMove = false
            biaoqian.over = false
            createTouchEvent({
                item: biaoqian,
                begin:function(data){
                    var item = data.item
                    if(item.noMove)
                        return false
                    item.setLocalZOrder(curLocal++)
                    item.pos = item.getPosition()
                    return true
                },
                move:function(data){
                    var item = data.item
                    var delta = data.delta

                    if(!item.noMove){
                        item.x += delta.x 
                        item.y += delta.y
                    }
                },
                end:function(data){
                    var item = data.item
                    var judge = true
                    //此处做判断
                    for(var j = 0 ; j < 6 ; j++){
                        var cup = cupList[j]
                        if(rectIntersectsRect(item,cup)){
                            if(cup.index == item.index){
                                item.setPosition(cup.getPosition())
                                item.noMove = true
                                item.over = true
                                judge = false

                                //判断所有的已经好了
                                var over = true
                                for(var k = 0 ; k < 6 ; k++){
                                    if(!biaoqianList[k].over){
                                        over = false
                                        break
                                    }
                                }
                                if(over){
                                    consider(over)
                                    var btn_result = new ccui.Button(res.btn_jielun_normal,res.btn_jielun_select)
                                    btn_result.setPosition(850,400)
                                    self.addChild(btn_result)
                                    btn_result.addClickEventListener(function(){
                                        self.nodebs.say({key:"result"})
                                    })
                                }

                            }else{
                                //再想想看
                                consider(false)
                            }
                            break
                        }
                    }

                    if(judge)
                        item.setPosition(item.pos)
                    
                }
            })
        }

        var  rectIntersectsRect = function (ra, rb) {
            var maxax = ra.x + ra.width/2,
                maxay = ra.y + ra.height/2,
                maxbx = rb.x + rb.width/2,
                maxby = rb.y + rb.height/2;
            return !(maxax < rb.x - rb.width/2 || 
                maxbx < ra.x - ra.width/2 || 
                maxay < rb.y - rb.height/2 ||
                maxby < ra.y - ra.height/2/2);
        }


        var consider = function(judge){
            var result = judge
            self.nodebs.say({
                key: result ? "right" : "fault",
                force: true,
            })
            AddDialog("Judge", {
                judge: result,
                fun:function(){
                    if(judgeMusic()){
                        stopMusic()
                    }
                }
            })
        }
    },

    initPeople: function() {
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,99)
        
        addContent({
            people: this.nodebs,
            key: "do1_tip1",
            img: res.do1_tip1,
            sound: res.do1_sound1,
        })
        addContent({
            people: this.nodebs,
            key: "result",
            img: res.do1_tip2,
            sound: res.do1_sound2,
            id: "result"
        })
        
        addContent({
            people: this.nodebs,
            key: "right",
            sound: res.sound_right,
        })
        addContent({
            people: this.nodebs,
            key: "fault",
            sound: res.sound_fault,
        })
    },
})
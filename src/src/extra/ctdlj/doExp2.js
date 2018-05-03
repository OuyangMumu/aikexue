//@author mu @16/5/11
var doExp2 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp2",
    preLayer: "doLayer",
    ctor: function() { //创建时调用 未删除不会重复调用
        this.load(function() {
           loadPlist("citie")
        })
        this._super()
        var self = this
        this.expCtor({
          vis: false,
          setZ:800,
          settingData: {
            pos: cc.p(1080, 580),
            biaogeFun: function() {
               if (!self.bgg) {
                  var bg = createBiaoge({
                       json: res.biao1,
                       isShowResult: true,
                       scale: 0.9,
                       downData:{
                          nums:4,
                          bufs:[
                             [null,res.chose1,res.chose2],
                             [null,res.chose1,res.chose2],
                             [null,res.chose1,res.chose2],
                             [null,res.chose1,res.chose2]
                          ],
                          scale:1.3,
                          downFT:20,
                          keys:[1,2,1,2]
                       }
                  })
                  self.addChild(bg)
                  self.bgg = bg
               }
               var bg = self.bgg
               bg.show()
            }
          }
        })
        this.initUI()
        this.initPeople()
        return true
    },
    initUI:function(){
        var self = this

        //直线方程:y=x-200 和 y=x-220
        

        var ci1 = new cc.Sprite("#citie00.png")
        ci1.setPosition(450,250)
        self.addChild(ci1,2)
        ci1.Upstatus = "N"
        ci1.type_hao = 1

        var ci1zi = new cc.Sprite("#ci1.png")
        ci1zi.setPosition(ci1.width/2,ci1.height/2+12)
        ci1.addChild(ci1zi)

        var ci1btn = new ccui.Button(res.xz,res.xz)
        ci1btn.setPosition(ci1.width-50,ci1.height/2-40)
        ci1btn.setScale(0.8)
        ci1.addChild(ci1btn)
        ci1btn.fatherNode = ci1
        ci1btn.addClickEventListener(function(){
            ci1btn.fatherNode.playRoto() 
        })


        var ci2 = new cc.Sprite("#citie09.png")
        ci2.setPosition(630,410)
        self.addChild(ci2,1)
        ci2.Upstatus = "S"
        ci2.type_hao = 2
        
        var checkAndPlay = function(item,dest,dis){
            var disTance = getDis(item,dest)
            var dis1 = cc.p(153,132)
            var dis2 = dis || cc.p(20,20)
            if(disTance<=240){
                if(item.Upstatus == dest.Upstatus){
                    cc.log("相互吸引")
                    if(dest.type_hao==1){
                        var cury = item.y-dis1.y
                        if(cury<=80){
                            cury = 80
                        }else if(cury>=550){
                            cury = 550
                        }
                        dest.setPosition(cury+200,cury)
                        if(item.y<=210){
                           item.setPosition(431,211)  
                        }
                    }else{
                        var cury = item.y+dis1.y
                        if(cury<=110){
                            cury = 110
                        }else if(cury>=550){
                            cury = 550
                        }
                        dest.setPosition(cury+220,cury)
                        //checkAndPlay(dest,item)
                        cc.log("item.y",item.y)
                        if(item.y>=406.5){
                           item.setPosition(607,407)  
                        }
                    } 
                }else{
                    cc.log("相互排斥")
                    if(dest.type_hao==1){
                        var cury = dest.y-dis2.y
                        if(cury<=60){
                            cury = 60
                        }else if(cury>=600){
                            cury = 600
                        }
                        dest.setPosition(cury+200,cury)
                        checkAndPlay(dest,item)
                    }else{
                        var cury = dest.y+dis2.y
                        if(cury<=60){
                            cury = 60
                        }else if(cury>=600){
                            cury = 600
                        }
                        dest.setPosition(cury+220,cury)
                        checkAndPlay(dest,item)
                    }
                }
            }
        }
        var playRoto = function(){
            var ci = this
            var src = ci
            var dst = null
            if(src==ci1){
                dst = ci2
            }else{
                dst = ci1
            }
            switch(ci.Upstatus){
                case "N":
                    var spAction = createAnimation({
                                    frame:"citie%02d.png",
                                    start:0,
                                    end:9,
                                    time: 0.04,
                                    fun:function(){
                                       checkAndPlay(src,dst,cc.p(40,40))
                                    }
                                })
                    ci.runAction(spAction)
                    ci.Upstatus = "S"
                break
                case "S":
                    var spAction = createAnimation({
                                    frame:"citie%02d.png",
                                    start:10,
                                    end:19,
                                    time: 0.04,
                                    fun:function(){
                                        checkAndPlay(src,dst,cc.p(40,40))
                                    }
                                })
                    ci.runAction(spAction)
                    ci.Upstatus = "N"
                break
            }     
        }
        ci1.playRoto = playRoto
        ci2.playRoto = playRoto


        var ci2zi = new cc.Sprite("#ci2.png")
        ci2zi.setPosition(ci2.width/2,ci2.height/2+12)
        ci2.addChild(ci2zi)

        var ci2btn = new ccui.Button(res.xz,res.xz)
        ci2btn.setPosition(ci1.width-50,ci1.height/2-40)
        ci2btn.setScale(0.8)
        ci2.addChild(ci2btn)
        ci2btn.fatherNode = ci2
        ci2btn.addClickEventListener(function(){
            ci2btn.fatherNode.playRoto()
        })

        var Touches = true
        createTouchEvent({
            item:ci1,
            begin:function(data){
                var result = judgeOpInPos(data)
                if(Touches && result){
                    Touches = false
                    return true
                }else{
                    return false
                }
            },
            move:function(data){
               var item = data.item
               var delta = data.delta
               var pos = data.pos

               var tempy = item.y + delta.y
               if(tempy>=600){
                    tempy = 600
               }else if(tempy<=60){
                    tempy = 60 
               }
               item.y = tempy
               item.x = tempy + 200
               checkAndPlay(item,ci2)
            },
            end:function(){
               Touches = true
            }
        })

        createTouchEvent({
            item:ci2,
            begin:function(data){
                var result = judgeOpInPos(data)
                if(Touches && result){
                    Touches = false
                    return true
                }else{
                    return false
                }
            },
            move:function(data){
               var item = data.item
               var delta = data.delta
               var pos = data.pos
             
               var tempy = item.y + delta.y
               if(tempy>=600){
                    tempy = 600
               }else if(tempy<=60){
                    tempy = 60 
               }
               if(!item.noMove){
                   item.y = tempy
                   item.x = tempy + 220
               }
               checkAndPlay(item,ci1)
            },
            end:function(){
                Touches = true
            }
        })

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
            self.nodebs.show(function() {
              
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
            key: "wenzi3",
            img:res.wenzi3,
            sound: res.zimp3
        })
        addContent({
            people: this.nodebs,
            key: "wenzi4",
            img:res.wenzi4,
            sound: res.zimp4
        })
    }  
})
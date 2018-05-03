//@author mu @16/5/11

var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp1",
    preLayer: "doLayer",
    ctor: function() { //创建时调用 未删除不会重复调用
        this.load(function() {
        });
        var self = this
        this._super()
        this.expCtor({
          vis: false,
          setZ:800,
          settingData: {
            pos: cc.p(1080, 580),
            biaogeFun: function() {
               if (!self.bgg) {
                 var colors = []
                 for (var k = 0; k <= 11; k++)
                  colors.push(cc.color(255, 0, 0))
                  var bg = createBiaoge({
                       json: res.bg1,
                       isShowResult: true,
                       scale: 0.9,
                       inputNum: 12,
                       scale: 0.9,
                       rootColor:colors,
                  })

                  var that = bg.getBg()
                  createBgMoveSp({
                    father:that,
                    imgs:[
                        [res.exp0,0],
                        [res.exp1,1],
                        [res.exp2,2],
                        [res.exp3,3]
                    ],
                    vrimg:true,
                    pos:cc.p(160,-90),
                    dis:150,
                    itemScale:0.5,
                    rectlist:[
                       cc.rect(117,237,150,66),
                       cc.rect(117,160,150,66),
                       cc.rect(117,83,150,66),
                       cc.rect(117,5,150,66)
                    ]
                  })
                  bg.ClearFun = function(){
                      that.clearData()
                  }
                  self.biaogenode.addChild(bg)
                  self.bgg = bg
               }
               var bg = self.bgg
               bg.show()
            }
          }
        })
        this.initPeople()
        this.initUI()

        self.biaogenode = new cc.Node()
        this.addChild(self.biaogenode,1000)

        return true
    },
    initUI:function(){

        var self = this
        var toolnode = new cc.Node()
        this.addChild(toolnode,5)
        this.uiname = []
        this.curcutnum = 0
        this.show = true

        this.toolbtn = createTool({
            pos:cc.p(105, 500),
            nums:2,
            tri:"down",
            modify:cc.p(1, 1.2),
            devide:cc.p(1.5, 1.2),
            itempos:cc.p(3, -15),
            circlepos:cc.p(0, 15),
            showTime:0.3,
            moveTime:0.2,
            scale:0.8,
            itemScale:1,
            ifcircle: true,
            firstClick: function(data) {
                var index = data.index
                var item = data.sp
                var pos = data.pos
                if(index==0){
                   item.setScale(0.88)
                   item.setLocalZOrder(2)
                   item.setAnchorPoint(0.5, 0.73)
                   self.fdj.see[0].setVisible(true)
                   self.fdj.setGet(pos)
                }else if(index==1){
                   item.setLocalZOrder(1)
                   item.setVisible(false)
                   fdj.runData({
                      key: "donode",
                      fun: function(data) {
                         var curnode = data.item
                         curnode.nie1.setPosition(item.x+110,item.y+290)
                         curnode.nie2.setPosition(item.x+107,item.y+296)  
                      }
                    })
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
                    self.fdj.move(delta)     
                    self.fdj.see[0].setPosition(item.x-110,item.y-120)
                }else if(index==1){
                    fdj.runData({
                      key: "donode",
                      fun: function(data) {
                         var curnode = data.item
                         curnode.nie1.setPosition(item.x,item.y)
                         curnode.nie2.setPosition(item.x-3,item.y+6)
                          if(item.spname){
                               curnode[item.spname].x += delta.x
                               curnode[item.spname].y += delta.y
                               if(item.ok){
                                   self.curcutnum++
                                   item.ok = false
                                }
                           }
                      }
                    })
                }
            },
            clickfun:function(data){
                var item = data.sp
                var index = data.index
                var pos = data.pos
                if(index==0){
                  item.setLocalZOrder(2)
                }else if(index==1){
                   item.setLocalZOrder(1)
                    if(!item.spname){
                        for(var i = 14;i>=0;i--){ 
                            if(self.uiname[i]!="nie1" && self.uiname[i]!="nie2" 
                                && self.uiname[i]!="jb" && self.uiname[i]!="jing"){
                                 
                                  var out_item = self.fdj.getOut("donode")[self.uiname[i]]
                                  var itempos = cc.p(item.x-item.width/2,item.y-item.height/2)
                                  var itemrect = cc.rect(out_item.x-out_item.width/5,out_item.y-out_item.height/5,
                                   2*out_item.width/5,2*out_item.height/5)
                                  if(cc.rectContainsPoint(itemrect,itempos)){
                                      item.spname = self.uiname[i]
                                      if(out_item.ok == null){
                                        out_item.ok = true 
                                        item.ok = true
                                      }  
                                    break
                                  }
                            }
                        }
                    }else{
                        item.spname = null
                    }       
                }
                return true
            },
            outfun:function(){
              if(self.curcutnum==11 && self.show){
                  self.show = false
                  self.nodebs.say({
                    key: "wenzi2",
                    force:true
                  })
              }
            },
            backfun:function(data){
               var item = data.sp
               var index = data.index
               if(index==0){
                 self.fdj.see[0].setVisible(false)
                 self.fdj.see[0].x = -400
               }else if(index==1){
                  self.fdj.runData({
                      key: "donode",
                      fun: function(data) {
                         var curnode = data.item
                         curnode.nie1.setPosition(-800,0)
                         curnode.nie2.setPosition(-800,0)
                       }
                    })
               }
      
               return true
            },
            father:toolnode,
            files:[res.item1,res.item2],
            gets:[res.fdj,res.nie1]
        })
        this.addChild(this.toolbtn,3)
        
        var fdjnode = new cc.Node()
        this.addChild(fdjnode,4)  
        var fdj = createFDJ({
            father:fdjnode,
            rootScale: 0.5,
            perscale: 0.1,
            max: 0.4,
            min: 0.1,
            hidebtn:true,
            backres:res.fdj1,
            frontres:res.fdj1,
            seePos: [cc.p(-300,180)],
            getPos: [cc.p(-410,290)],
          })

          self.fdj = fdj
          fdj.get[0].setVisible(false)
          fdj.see[0].setVisible(false)
          self.fdj.actMove()

          fdj.createNew({
            key: "donode",
            fun:function(){
                 var tempnode = ccs.load(res.do1).node
                 for(var i in tempnode.getChildren())
                    self.uiname.push(tempnode.getChildren()[i].getName())
                    var donode = loadNode(res.do1, self.uiname)
                    donode.setLocalZOrder(6)
                 return donode
            }
          })
    },
    myEnter: function() {
        this._super()
        if (this.nodebs) {
            var self = this
            this.toolbtn.show()
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
        this.addChild(this.nodebs,1000);

        addContent({
            people: this.nodebs,
            key: "wenzi1",
            sound: res.zimp1,
            img: res.wenzi1,
        })
        addContent({
            people: this.nodebs,
            key: "wenzi2",
            sound: res.zimp2,
            img: res.wenzi2,
        })
    }
})
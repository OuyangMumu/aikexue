//@author mu @16/5/11
var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp1",
    preLayer: "doLayer",
    ctor: function() { //创建时调用 未删除不会重复调用
        this.load(function() {
      
        })
        var self = this
        this._super()
        this.expCtor({
          vis: false,
          setZ:800,
          settingData: {
            pos: cc.p(1080, 580),
            biaogeFun: function() {
               if (!self.bgg) {
                  var bg = createBiaoge({
                      json: res.mfydf_bg1,
                      scale: 0.9
                  })
                   var that = bg.getBg()

                   var createLab = function(data){
                       var sbstr = data.sbstr
                       var pos = data.pos
                       var lab = new cc.LabelTTF("","",22)
                       lab.setColor(cc.color(0,0,0))
                       lab.setPosition(pos)
                       lab.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT)
                       lab.setVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_TOP)
                       lab.setAnchorPoint(0,1)
                       lab.time = 0
                       lab.runAction(cc.repeatForever(cc.sequence(
                          cc.delayTime(0.1),
                          cc.callFunc(function(){
                              lab.time++
                              var changestr = sbstr.substring(0,lab.time)
                              if(lab.getString()==changestr){
                                lab.stopAllActions()
                              }
                              lab.setString(changestr)
                          })
                        )))
                       return lab
                   }
                   var fun1 = function(){
                      var lab = createLab({
                         sbstr:"外观圆且短、白色透明。煮熟\n后的粳米饭比较干松。",
                         pos:cc.p(305,480),
                       })
                       this.clearlab = lab
                       that.addChild(lab)
                   }
                   var fun2 = function(){
                      var lab = createLab({
                         sbstr:"外观圆细长、白色透明。煮熟\n后的籼米饭比较干松。",
                         pos:cc.p(305,380),
                       })
                       this.clearlab = lab
                       that.addChild(lab)
                   }
                   var fun3 = function(){
                      var lab = createLab({
                         sbstr:"糯米分为粳糯和籼糯。粳糯外\n观圆短，籼糯外观细长，颜色\n均"+
                         "为白色不透明，煮熟后糯米\n饭较软且黏",
                         pos:cc.p(305,303),
                       })
                       this.clearlab = lab
                       that.addChild(lab)
                   }
                   var fun4 = function(){
                      var lab = createLab({
                         sbstr:"外观圆细长、白色半透明。煮\n熟后米饭比较干松。",
                         pos:cc.p(305,180),
                       })
                       this.clearlab = lab
                       that.addChild(lab)
                   }
                   var fun5 = function(){
                      var lab = createLab({
                         sbstr:"外观圆且短、黄色，稻谷去除\n稻壳后的稻米，含有皮层、糊\n粉层和胚芽",
                         pos:cc.p(305,90),
                       })
                       this.clearlab = lab
                       that.addChild(lab)
                   }
                   createBgMoveSp({
                    father:that,
                    imgs:[
                        [res.paper1,0,fun1],
                        [res.paper2,1,fun2],
                        [res.paper3,2,fun3],
                        [res.paper4,3,fun4],
                        [res.paper5,4,fun5]
                    ],
                    pos:cc.p(687,489),
                    disy:-82,
                    openTrue:true,
                    resultfather:self,
                    rectlist:[
                       cc.rect(159,408,120,90),
                       cc.rect(159,308,120,90),
                       cc.rect(159,208,120,90),
                       cc.rect(159,108,120,90),
                       cc.rect(159,8,120,90)
                    ]
                  })
                  self.biaogenode.addChild(bg)
                  self.bgg = bg
               }
               var bg = self.bgg
               bg.show()
            }
          }
        })
        this.initUI()
        this.initTool()
        this.initPeople()
        return true
    },
    initUI:function(){
          var self = this
          self.biaogenode = new cc.Node()
          self.addChild(self.biaogenode,1000)

          self.tishi = new cc.Sprite(res.tishi1)
          self.tishi.setPosition(getMiddle(0,120))
          this.addChild(self.tishi)

          var fdj = createFDJ({
                      father: self,
                      rootScale: 0.2,
                      type:[3],
                      hidebtn:true,
                      perscale: 0.5,
                      max: 0.4,
                      min: 0.1,
                      seePos: [cc.p(480, 240)],
                      getPos: [cc.p(-100, 410)],
                    })
          self.fdj = fdj
          fdj.get[0].setVisible(false)
          fdj.see[0].setVisible(false)

          fdj.createNew({
            key: "do1",
            fun: function(){
               var desk = new cc.Sprite(res.desk)
               desk.setPosition(getMiddle(0,-300))
               desk.list = []
              
               for (var i = 1; i <= 5; i++) {
                 var spstr = "rice"+ i
                 var midui = new cc.Sprite(res[spstr])
                 midui.setScale(0.3)
                 midui.setVisible(false)
                 midui.setPosition(desk.width/2,desk.height-50)
                 desk.addChild(midui)
                 midui.index = i - 1
                 desk.list.push(midui)
               }
               return desk
            }
          })
          fdj.actMove()

          var myRect = cc.rect(490,130,150,90)
          self.canshow = false
          self.fdj.moveWithEvent = function(item){
            fdj.see[0].setVisible(false)
            if ( self.canshow && cc.rectContainsPoint(myRect,item.getPosition())) {
              fdj.see[0].setVisible(true)
            }
          }         
    },
    initTool:function(){
        var self = this
        var toolnode = new cc.Node()
        toolnode.x = 0
        toolnode.y =0
        this.addChild(toolnode,5)

        this.toolbtn = createTool({
            pos:cc.p(350, 550),
            nums:6,
            tri:"right",
            modify:cc.p(1, 1.2),
            devide:cc.p(1.2, 1.2),
            itempos:cc.p(3, -12),
            circlepos:cc.p(0, 15),
            showTime:0.3,
            moveTime:0.2,
            scale:0.7,
            itemScale:0.9,
            ifcircle: true,
            firstClick: function(data) {
                var item = data.sp
                var index = data.index
                var pos = data.pos
                if(index !=5){
                    self.fdj.runData({
                        key: "do1",
                        fun:function(data){
                          var item = data.item   
                          for (var i = 0; i < item.list.length; i++) {
                            item.list[i].setVisible(false)
                          }
                          item.list[index].setVisible(true)
                        }
                     })
                    for(var i in toolnode.getChildren()){
                      if(toolnode.getChildren()[i].index != 5)
                          toolnode.getChildren()[i].forceBack()
                    }
                    self.canshow = true
                    item.nopos = true
                    item.setVisible(false)
                    item.setPosition(-300,-100)
                    return true
                }else{
                    if(self.tishi.isVisible())
                      self.tishi.setVisible(false)
                    self.fdj.get[0].setVisible(false)
                    var fdjpos = cc.p(pos.x-10,pos.y+11)
                    self.fdj.setGet(fdjpos)
                    return true
                }
                
            },
            movefun:function(data){
              var sp = data.sp
              var delta = data.delta
              var index = data.index
              sp.x += delta.x
              sp.y += delta.y
              if(index == 5){
                self.fdj.move(delta,0)
              }
              
            },
            backfun:function(data){
              if(data.index!=5){
               return false
              }else{
                return true
              }
            },
            father:toolnode,
            files:[res.item1,res.item2,res.item3,res.item4,res.item5,res.item6],
            gets:[res.item1,res.item2,res.item3,res.item4,res.item5,res.item66]
        })
        this.addChild(this.toolbtn,3)
    },
    myEnter: function() {
        this._super()
        if (this.nodebs) {
            var self = this
            self.toolbtn.show()
            self.nodebs.show(function() {
                // self.nodebs.say({
                //     key: "wenzi4",
                //     force: true
                // })
            })
        }
    },
    initPeople:function(){
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,900)
    }  
})
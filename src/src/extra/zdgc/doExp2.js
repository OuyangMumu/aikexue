var doExp2 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp2",
    preLayer: "doLayer",
    ctor: function() { //创建时调用 未删除不会重复调用
        this.load(function() {  
        })
        var self = this
        this._super()
        this.expCtor({
          vis: false,
          settingData: {
            pos: cc.p(1080, 580),
            biaogeFun: function() {
              if (!self.bgg) {
                var colors = []
                for (var k = 0; k <= 9; k++)
                  colors.push(cc.color(255, 0, 0))
                var buf = []
                for (var i = 1; i <= 3; i++)
                  buf.push([null, res.chose1, res.chose2,res.chose3])

                 var getTrueAnswer = function(infolist){
                   var list = []
                   var a = parseFloat(10*infolist[1].pageweight).toFixed(2)
                   var b = parseFloat(10*infolist[2].pageweight).toFixed(2)
                   var c = parseFloat(10*infolist[3].pageweight).toFixed(2)
                   var max = a>b?(a>c?a:c):(b>c?b:c)
                   var min = a>b?(b>c?c:b):(a>c?c:a)
                   list[0] = a
                   list[1] = b
                   list[2] = c
                   for(var i=0;i<3;i++){
                     if(list[i] == max){
                        list[i+3] = "最重"
                     }else if(list[i] == min){
                        list[i+3] = "最轻"
                     }else{
                        list[i+3] = "较轻"
                     }
                   }
                   return list 
                }
                var answerlist = getTrueAnswer(self.infolist)
                var bg = createBiaoge({
                  json: res.see2_bg,
                  inputNum: 9,
                  isShowResult: true,
                  scale: 0.9,
                  answerNum:6,
                  rootColor: colors,
                  answerlist:answerlist,
                  answerfontsize:40,
                  downData:{
                     nums: 3,
                     bufs: buf,
                     keys: [
                         2,2,2
                     ]
                  }
                })
                self.addChild(bg)
                self.bgg = bg
             }
               var bg = self.bgg
               bg.show()
            },
            ifCount: true,
          }
        })
        this.initUI()
        this.initPeople()
       
        return true
    },
    initUI: function(){
      var self = this
      self.createCurtool()
      self.tp = createTp({
               father: self,
               balancepos:"up",
               tppos:cc.p(510, 100),
               famapos:cc.p(900, 400),
               addFun: function(data) {
                   var item = data.item
                   item.setPosition(100, 60)
                   if(item.change){
                      item.change = false
                      item.changePos(cc.p(-50,80))
                   } 
                   item.inTp = true
               }
           })
      self.tp.toHide = function(){
        this.setVisible(false)
        this.famahe.setVisible(false)
        this.y = this.y-600
        this.famahe.y = this.famahe.y-600
      }
      self.tp.toShow = function(){
        this.setVisible(true)
        this.famahe.setVisible(true)
        this.y = this.y+600
        this.famahe.y = this.famahe.y+600
      }

      self.tp.toHide()
      
    },
    createCurtool:function(){
          var self = this
          self.curZhi = null
          var getdeffer = function(curnum){
             var temp = (Math.random()*15 + 10)/100
              if(temp == curnum)
                return getdeffer(curnum)
              else
                return temp
           }

          var tnum = parseFloat((Math.random()*15 + 10)/100).toFixed(2)
          var tnum1 = parseFloat(getdeffer(tnum)).toFixed(2)
          var tnum2 = parseFloat(getdeffer(tnum1)).toFixed(2)
      
         self.infolist = [
           null,
           {color:cc.color(12,82,175),tinck:tnum-0.8,pageweight:tnum},
           {color:cc.color(210,112,3),tinck:tnum1-0.8,pageweight:tnum1},
           {color:cc.color(132,180,0),tinck:tnum2-0.8,pageweight:tnum2}
         ]
         var initpage = function(){
                  var max = 80
                  var mid = 50
                  var min = 1
                  var sp = new cc.Sprite(this.texture)
                  sp.x = 333.5
                  sp.y = 56.5 + mid-2
                  this.addChild(sp)
                  this.upsp = sp
                 this.draw = new cc.DrawNode()
                 this.addChild(this.draw)
                 this.startdraw = function(num){
                    var selfcolor = this.selfcolor || cc.color(12,82,175)
                    var curheight = this.tinck*(num-2) 
                    this.draw.clear()
                    this.upsp.y = 56.5 + curheight
                    this.draw.drawRect(cc.p(1.5,0),cc.p(509,curheight),selfcolor,1,selfcolor)
                    var points =[cc.p(509,0),cc.p(509,curheight),cc.p(665,112+curheight),cc.p(665,112)]
                    this.draw.drawPoly(points,selfcolor,1,selfcolor)
                 }
                 this.startdraw(mid)
                 this.pages = mid
                 var inself = this

                 var txt1 = new cc.Sprite(res.txt1)
                 var txt2 = new cc.Sprite(res.txt22)
                 var txt3 = new cc.Sprite(res.txt)
                 txt1.setPosition(286,-50)
                 txt2.setPosition(436,-94)
                 txt3.setPosition(448,-45)
                 this.addChild(txt1)
                 this.addChild(txt2)
                 this.addChild(txt3)
                 txt1.setScale(1.2)
                 txt2.setScale(1.2)
                 txt3.setScale(1.2)

                 txt1.initpos = txt1.getPosition()
                 var lay = new ccui.Layout()
                 lay.setContentSize(5*txt3.width/9,txt3.height)
                 lay.setPosition(10,0)
                 txt3.addChild(lay)
                 this.lay = lay
                 addInput({
                     item:lay,
                     fontsize:20,
                     color:cc.color(0,0,0),
                     strlen:3,
                     backFun:function(item){
                        var curtxt = parseFloat(lay.getStr()).toFixed(2)
                        if(curtxt>=max){
                          lay.setStr(max)
                          curtxt = max
                        }
                        if(curtxt<=min){
                          lay.setStr(min)
                          curtxt = min
                        }
                        inself.pages = curtxt
                        inself.startdraw(inself.pages)
                        if(inself.updataFun){
                          inself.updataFun(inself.pages)
                        }
                     }
                 })
                 lay.setStr(mid)

                 var up = new ccui.Button(res.addbtn_nor,res.addbtn_sel)
                 up.setPosition(507,-26.8)
                 up.setScale(0.8)
                 this.addChild(up)
                 var down = new ccui.Button(res.addbtn_nor,res.addbtn_sel)
                 down.setPosition(507,-62.5)
                 down.setScale(0.8)
                 down.setRotation(180)
                 this.addChild(down)
                 up.addClickEventListener(function(){
                       var curpage = parseFloat(inself.lay.getStr()).toFixed(2)
                       if(curpage<max){
                          curpage++
                          inself.pages = curpage
                          inself.lay.setStr(curpage)
                          inself.startdraw(inself.pages)
                       }else{
                          inself.pages = max
                          inself.lay.setStr(max)
                          inself.startdraw(inself.pages)
                       }
                       if(inself.updataFun){
                          inself.updataFun(inself.pages)
                       }
                             
                 })
                 down.addClickEventListener(function(){
                       var curpage = parseFloat(inself.lay.getStr()).toFixed(2)
                       if(curpage>min){
                          curpage--
                          inself.pages = curpage
                          inself.lay.setStr(curpage)
                          inself.startdraw(inself.pages)
                       }else{
                          inself.pages = min
                          inself.lay.setStr(min)
                          inself.startdraw(inself.pages)
                       }

                       if(inself.updataFun)
                             inself.updataFun(inself.pages)
                 })

                 this.changePos = function(offset){
                    txt1.setPosition(txt1.x + offset.x,txt1.y + offset.y)
                    txt2.setPosition(txt2.x + offset.x,txt2.y + offset.y)
                    txt3.setPosition(txt3.x + offset.x,txt3.y + offset.y)
                    up.setPosition(up.x + offset.x,up.y + offset.y)
                    down.setPosition(down.x + offset.x,down.y + offset.y)
                 }
                 this.changePos(cc.p(-120,290))
         }
         var toolnode = new cc.Node()
         toolnode.x = 0; toolnode.y =0
         this.addChild(toolnode,5)

         this.toolbtn = createTool({
            pos:cc.p(105, 500),
            nums:3,
            tri:"down",
            modify:cc.p(1, 1.2),
            devide:cc.p(1.5, 1.2),
            itempos:cc.p(3, -23),
            circlepos:cc.p(0, 15),
            showTime:0.3,
            moveTime:0.2,
            scale:0.8,
            ifcircle: true,
            firstClick:function(data){
               var index = data.index
               var item = data.sp
               item.index = index
               if(index!=0){
                    // for(var i in toolnode.getChildren()){
                    //  if(toolnode.getChildren()[i].index>0)
                    //     toolnode.getChildren()[i].forceBack()
                    // }
                    // for(var i in self.tp.tpleft.getChildren()){
                    //     var curitem = self.tp.tpleft.getChildren()[i]
                    //     self.tp.disWeight(curitem.curweight)
                    //     if(curitem.forceBack){
                    //        curitem.forceBack()
                    //     }
                    // }
                    if(self.curZhi){
                      if(self.curZhi.inTp){
                         self.tp.disWeight(self.curZhi.curweight)
                      }
                      self.curZhi.forceBack()
                      self.curZhi = null
                    }
                    
                    item.selfcolor = self.infolist[index].color
                    item.tinck = self.infolist[index].tinck
                    item.pageweight = self.infolist[index].pageweight
                    item.initpage = initpage
                    item.initpage()
                    item.change = true
                    item.updataFun = function(pages,status){
                         var inself = this
                         //this.inTp = true
                         var pos = this.getParent().convertToWorldSpace(this.getPosition())
                        // this.inTp = false
                        // self.tp.disWeight(this.curweight)
                        // this.setPosition(pos)
                        // safeAdd(toolnode,this)

                        // inself.data.weight = pages*inself.pageweight
                        // inself.curweight = pages*inself.pageweight
                        // self.tp.addItem(inself.data)
                          // if(this.inTp){
                          //   cc.log("22222222222222")
                          //   this.inTp = false
                          //   self.tp.disWeight(this.curweight)
                          //   this.setPosition(pos)
                          //   safeAdd(toolnode,this)
                          // }
                          // //ar inself = this
                          // this.scheduleOnce(function(){
                          //     inself.data.weight = pages*inself.pageweight
                          //     inself.curweight = pages*inself.pageweight
                          //     self.tp.addItem(inself.data)
                          // },0.005)
                          var inself = this
                          // if(status!="out"){
                          //   this.inTp = false
                          // }
                          if(this.inTp){
                            self.tp.disWeight(this.curweight)
                          }
                          inself.data.weight = pages*inself.pageweight
                          inself.curweight = pages*inself.pageweight
                          self.tp.addItem(inself.data)
                    }
                    item.setScale(0.7)
                    self.curZhi = item       
                }
               item.setLocalZOrder(ZeroforPaer++)
               return true
            },
            clickfun:function(data){
              var item = data.sp
              var index = data.index
              var pos = item.getParent().convertToWorldSpace(item.getPosition())
              if(index!=0){
                if(item.inTp){
                  item.inTp = false
                  self.tp.disWeight(item.curweight)      
                  item.setPosition(pos)
                  item.change = true
                  item.changePos(cc.p(50,-80))
                  safeAdd(toolnode, item)
                }
              }
              return true
            },
            outfun:function(data){
               var item = data.sp
               var index = data.index
               data.item = item
               item.data = data
               if(index==0){
                  item.setVisible(false)
                  item.y = -600
                  self.tp.toShow()
               }else{
                  item.updataFun(item.pages,"out")         
               }   
            },
            backfun:function(data){
              var index = data.index
              if(index>0){
                if(self.curZhi){
                  self.curZhi = null
                }
              }
              return true
            },
            father:toolnode,
            files:[res.ttp,res.zhi1,res.zhi2,res.zhi3],
            gets:[res.ttp1,res.dzhi1,res.dzhi2,res.dzhi3],
        })
        this.addChild(this.toolbtn,3)
    },
    myEnter: function() {
        this._super()
        this.toolbtn.show()
        if (this.nodebs) {
            var self = this
            self.nodebs.show(function() {
                self.nodebs.say({
                    key: "wenzi2",
                    force:true
                })
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
            key: "wenzi2",
            sound: res.zimp2,
            img: res.wenzi2,
        })
    }
    
})
//@author mu @16/5/11

var ZeroforPaer = 100
var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp1",
    preLayer: "doLayer",
    ctor: function() { //创建时调用 未删除不会重复调用
        var self = this
        this.load(function() {
        
        });
        this._super()
        this.expCtor({
          vis: false,
          setZ:1000,
          settingData: {
            pos: cc.p(1080, 580),
            biaogeFun: function() {
              if (!self.bgg) {
                var colors = []
                for (var k = 0; k <= 9; k++)
                  colors.push(cc.color(255, 0, 0))
                var buf = []
                for (var i = 1; i <= 3; i++)
                  buf.push([null, res.chose4, res.chose5,res.chose6])
        
                var getTrueAnswer = function(infolist){
                   var list = []
                   var a = parseFloat(infolist[0].tinck/10).toFixed(3)
                   var b = parseFloat(infolist[1].tinck/10).toFixed(3)
                   var c = parseFloat(infolist[2].tinck/10).toFixed(3)
                   var max = a>b?(a>c?a:c):(b>c?b:c)
                   var min = a>b?(b>c?c:b):(a>c?c:a)
                   list[0] = a
                   list[1] = b
                   list[2] = c
                   for(var i=0;i<3;i++){
                     if(list[i] == max){
                        list[i+3] = "最厚"
                     }else if(list[i] == min){
                        list[i+3] = "最薄"
                     }else{
                        list[i+3] = "较薄"
                     }
                   }

                   return list 
                }
                var answerlist = getTrueAnswer(self.infolist)
                var bg = createBiaoge({
                  json: res.see1_bg,
                  inputNum: 9,
                  isShowResult: true,
                  scale: 0.9,
                  rootColor: colors,
                  answerNum:6,
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
        var toolnode = new cc.Node();
        toolnode.x = 0; toolnode.y =0;
        this.addChild(toolnode,5)

        var getdeffer = function(curnum){
             var temp = parseFloat((Math.random()*15 + 5)/100).toFixed(2)
              if(temp == curnum)
                return getdeffer(curnum)
              else
                return temp
        }
        var getdeffer1 = function(curnum,curnum1){
             var temp = parseFloat((Math.random()*15 + 5)/100).toFixed(2)
              if(temp == curnum || temp == curnum1)
                return getdeffer(curnum,curnum1)
              else
                return temp
        }
          
        var tnum = parseFloat((Math.random()*15 + 5)/100).toFixed(2)
        var tnum1 = parseFloat(getdeffer(tnum)).toFixed(2)
        var tnum2 = parseFloat(getdeffer(tnum1)).toFixed(2)

        self.infolist = [
          {color:cc.color(12,82,175),tinck:tnum,name:"one"},
          {color:cc.color(210,112,3),tinck:tnum1,name:"two"},
          {color:cc.color(132,180,0),tinck:tnum2,name:"three"}
        ]
        var initpage = function(){
              var sp = new cc.Sprite(this.texture)
              var max = 200
              var mid = 100
              var min = 1
              sp.x = 333.5
              sp.y = 54.5 + mid
              this.addChild(sp)
              this.upsp = sp
              this.draw = new cc.DrawNode()
              this.addChild(this.draw)
              this.startdraw = function(num){
                var selfcolor = this.selfcolor || cc.color(12,82,175)
                var curheight = (this.tinck*2.8)*(num-2) 
                this.draw.clear()
                this.upsp.y = 56.5 + curheight
                this.draw.drawRect(cc.p(1.5,0),cc.p(509,curheight),selfcolor,1,selfcolor)
                var points =[cc.p(509,0),cc.p(509,curheight),cc.p(665,112+curheight),cc.p(665,112)]
                this.draw.drawPoly(points,selfcolor,1,selfcolor)
              }
             this.startdraw(mid)
             this.pages = mid
             var inself = this


             var node = new cc.Node()
             this.addChild(node)

             var txt1 = new cc.Sprite(res.txt1)
             var txt2 = new cc.Sprite(res.txt2)
             var txt3 = new cc.Sprite(res.txt)
             txt1.setPosition(286,-50)
             txt2.setPosition(436,-94)
             txt3.setPosition(428,-45)

             node.addChild(txt1)
             node.addChild(txt2)
             node.addChild(txt3)
             if(this.needshow){
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
                        var curtxt = parseFloat(lay.getStr()).toFixed(0)
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
                        if(inself.Vrchangefun)
                            inself.Vrchangefun()
                     }
                 })
                 lay.setStr(mid)
                 var up = new ccui.Button(res.addbtn_nor,res.addbtn_sel)
                 up.setPosition(477,-30)
                 up.setScale(0.7)
                 node.addChild(up)
                 var down = new ccui.Button(res.addbtn_nor,res.addbtn_sel)
                 down.setPosition(477,-59)
                 down.setScale(0.7)
                 down.setRotation(180)
                 node.addChild(down)
                 up.addClickEventListener(function(){
                       var curpage = parseFloat(inself.lay.getStr()).toFixed(0)
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
                       if(inself.Vrchangefun)
                            inself.Vrchangefun()
                 })
                 down.addClickEventListener(function(){
                       var curpage = parseFloat(inself.lay.getStr()).toFixed(0)
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
                       if(inself.Vrchangefun)
                            inself.Vrchangefun()
                 })
             }else{
               var lay = new ccui.Text("100","",36)
               lay.setColor(cc.color(0,0,0))
               lay.setPosition(50,27)
               txt3.addChild(lay)
               lay.setStr = function(str){
                  this.setString(str)
               }
               this.lay = lay

               var up1 = new cc.Sprite(res.addbtn_nor)
               up1.setPosition(477,-30)
               up1.setScale(0.7)
               node.addChild(up1)
               var down1 = new cc.Sprite(res.addbtn_nor)
               down1.setPosition(477,-59)
               down1.setScale(0.7)
               down1.setRotation(180)
               node.addChild(down1)
             }

             this.setStrAndChange = function(str){
                 this.lay.setStr(str)
                 var curpage = parseFloat(str).toFixed(1)
                 this.pages = curpage
                 this.startdraw(this.pages)
             }        
        }

         self.initpaper = initpage

         var fdjnode = new cc.Node();
         fdjnode.x = 0; fdjnode.y =0;
         this.addChild(fdjnode,10)
         var fdj = createFDJ({
            father:fdjnode,
            rootScale: 0.2,
            perscale: 0.1,
            max: 0.4,
            min: 0.1,
            seePos: [cc.p(550,282)],
            getPos: [cc.p(284,282)],
          })

          addMoving(fdj.see[0])
          self.fdj = fdj

          var createMyRuler = function() {
                var ruler = createRuler({
                        max: 10,
                        devide: 28,
                        seg: 0.65,
                        add: 1,
                        height: 80,
                        lineModify: cc.p(0, 3),
                        fontModify: cc.p(0, 5),
                        rotate:-90,
                })
                ruler.setPosition(cc.p(284,282))
                //ruler.setLocalZOrder(2)
                return ruler
          }
          fdj.createNew({
            key: "ruler",
            fun: createMyRuler,
            order: 2,
          })

          self.fdj.toShow = function(){
             this.get[0].setVisible(true)
             this.see[0].setVisible(true)
             this.see[0].setPosition(cc.p(550,282))
             this.getOut("ruler").setVisible(true)
          }
          self.fdj.tohide= function(){
             this.get[0].setVisible(false)
             this.see[0].setVisible(false)
             //this.get[0].y = this.get[0].y - 1000
             this.see[0].setPosition(cc.p(-550,282))
             this.getOut("ruler").setVisible(false)
          }
          self.fdj.tohide()
          fdj.actMove({
            judgeGet: function(data) {
                var index = data.index
                var item = data.item
                var delta = data.delta
                var pos = data.pos
                var ruler = fdj.getOut("ruler")
                var tempPos = item.getParent().convertToWorldSpace(item.getPosition())
                tempPos.x += delta.x
                tempPos.y += delta.y
                var judge = judgeInside({
                    item: ruler,
                    pos: tempPos,
                })
                if (!judge) {
                    var backPos = getBackPos({
                        item: ruler,
                        pos: tempPos,
                    })
                    delta.x -= backPos.y
                    delta.y += backPos.x
                }
                return delta
            }
          })

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
              if(index!=3){
                var item = data.sp
                item.index = index

                for(var i in toolnode.getChildren()){
                 if(toolnode.getChildren()[i].index<3){
                    var spp = toolnode.getChildren()[i]
                    spp.forceBack()
                    self.fdj.runData({
                      key: self.infolist[spp.index].name,
                      fun: function(data) {
                         var item = data.item
                         item.removeFromParent()
                      }
                    })
                 }
                }

                var namestr = self.infolist[index].name
                self.fdj.createNew({
                  key: namestr,
                  fun: function() {
                    var sp1 = new cc.Sprite(item.texture)
                    sp1.selfcolor = self.infolist[index].color
                    sp1.tinck = self.infolist[index].tinck
                    sp1.initpage = self.initpaper
                    sp1.setPosition(578, 199)
                    return sp1
                  },
                  order:1,
                  infun:function(item){
                    item.needshow = false
                    item.initpage()
                  },
                  outfun:function(item){
                    item.needshow = true
                    item.initpage()
                  }
                })
                self.fdj.getOut(namestr).setVisible(false)
                self.fdj.getOut(namestr).curindex = index
                self.fdj.getOut(namestr).reitem = item
                self.fdj.getOut(namestr).Vrchangefun = function(){
                   var num = this.curindex
                   var inself = this
                   var tempnum = 0
                   self.fdj.runData({
                      key: self.infolist[num].name,
                      fun: function(data) {
                        var item = data.item
                        if(typeof(item.curindex) == 'number'){
                           tempnum = item.pages
                        }
                        if(typeof(item.curindex) != 'number'){
                           item.setStrAndChange(tempnum)
                        }
                      }
                   })
                }
                item.selfcolor = self.infolist[index].color
                item.tinck = self.infolist[index].tinck
                item.initpage = initpage
                item.needshow = false
                item.initpage()
                item.setLocalZOrder(ZeroforPaer++)
                
                if(self.toolbtn.getindex(3))
                 self.toolbtn.getindex(3).setVisible(true)
                 self.fdj.tohide()

                return true
              }else{
                    var ruler = createRuler({
                        max: 10,
                        devide: 28,
                        seg: 0.65,
                        add: 1,
                        height: 80,
                        lineModify: cc.p(0, 3),
                        fontModify: cc.p(0, 5),
                        rotate:-90,
                    })
                    ruler.setLocalZOrder(ZeroforPaer++)
                    return ruler
              }   
            },
            move:function(data){
              var item = data.sp
              var index = data.index
              var delta = data.delta
               item.x += delta.x
               item.y += delta.y
               if(index ==3)
                 ruler.getParent().setLocalZOrder(10)
            },
            clickfun:function(data){
              var item = data.sp
              var index = data.index
              item.setLocalZOrder(ZeroforPaer++)
              if(index!=3){
                item.setVisible(true)
                var Vritem = self.fdj.getOut(self.infolist[index].name)
                item.setStrAndChange(Vritem.pages)
                Vritem.setVisible(false)
              }
              
              if(self.toolbtn.getindex(3)){
                self.toolbtn.getindex(3).setVisible(true)
                self.toolbtn.getindex(3).getParent().setLocalZOrder(10)
              }
              
              self.fdj.tohide()
              
              return true
            },
            outfun:function(data){
               var item = data.sp
               var index = data.index
               if(index!=3){
                 item.setVisible(false)
                 item.setPosition(578,200)
                 self.fdj.getOut(self.infolist[index].name).setVisible(true)
                 self.fdj.runData({
                      key: self.infolist[index].name,
                      fun: function(data) {
                         var item = data.item
                        // self.fdj.getOut("ruler").setLocalZOrder(10)
                         //item.setLocalZOrder(5)
                      }
                  })
               }
               if(self.toolbtn.getindex(3) && toolnode.getChildrenCount()!=1){
                  self.toolbtn.getindex(3).setPosition(284,282)
                  self.toolbtn.getindex(3).getParent().setLocalZOrder(1)
                  self.toolbtn.getindex(3).setLocalZOrder(ZeroforPaer++)
                  self.fdj.toShow()
                  self.toolbtn.getindex(3).setVisible(false)
               }
            },
            backfun:function(data){
                var index = data.index
                if(index!=3){
                  self.fdj.runData({
                    key: self.infolist[index].name,
                    fun: function(data) {
                       var item = data.item
                       item.removeFromParent()
                    }
                  })
                }
                
                return true
            },
            father:toolnode,
            files:[res.zhi1,res.zhi2,res.zhi3,res.kdc],
            gets:[res.dzhi1,res.dzhi2,res.dzhi3,null],
        });
        this.addChild(this.toolbtn,3)
    },
    myEnter: function() {
        this._super()
        this.toolbtn.show()
        if (this.nodebs) {
            var self = this
            self.nodebs.show(function() {
                self.nodebs.say({
                    key: "wenzi1",
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
        this.addChild(this.nodebs,1000);

        addContent({
            people: this.nodebs,
            key: "wenzi1",
            sound: res.zimp1,
            img: res.wenzi1,
        })
    }
})
//@author mu @16/5/11
var doExp2 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp2",
    preLayer: "doLayer",
    ctor: function() { //创建时调用 未删除不会重复调用
        this.load(function() {
           loadPlist("spcolor")
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
                      json: res.dfdzj_bg,
                      scale: 0.9
                  })
                  var that = bg.getBg()

                  self.createBgMoveSp({
                    father:that,
                    size:cc.p(50,50),
                    imglist:[
                        [res.fruit1,0],
                        [res.fruit2,1],
                        [res.fruit3,1],
                        [res.fruit4,0],
                        [res.fruit5,1],
                        [res.fruit6,0],
                        [res.fruit7,0],
                        [res.fruit8,1],
                        [res.fruit9,1],
                        [res.fruit10,0],
                    ],
                    listPos:cc.p(150,-100),
                    rectlist:[
                       cc.rect(160,200,640,190),
                       cc.rect(160,4,640,190)
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
        this.initTool()
        this.initPeople()
        return true
    },
    createBgMoveSp:function(data){
      var size = data.size
      var imglists = data.imglist
      var rectlist = data.rectlist
      var scale = data.scale || 1
      var father = data.father
      var listPos = data.listPos || cc.p(863, 50)

      // 每个rect对应一个存放精灵的数组
      var rectarray = []
      for (var i = 0; i < rectlist.length; i++) {
            var tmparray = []
            rectarray.push(tmparray)
      }
      var node = new cc.Node()
      var lay = createLayout({
            pos: cc.p(-53,-53),
            size: cc.size(614,114),
            op: 0,
            clip:true,
      })
      node.lay = lay
      node.addChild(lay)
      node.setLocalZOrder(1)

      var imgnode = new cc.Node()
      lay.addChild(imgnode)
      var splist = []
      var imglist = mixArray(imglists)
      for (var i = 0; i < imglist.length; i++) {
          var sp = new cc.Sprite(imglist[i][0])
          sp.setScale(0.6)
          sp.setPosition(60+122*i,60) 
          imgnode.addChild(sp)
          sp.index = i
          sp.gray = false
          splist.push(sp)
          createTouchEvent({
             item:sp,
             begin:function(data){
                var item = data.item
                var pos = data.pos
                var index = item.index
                var spp = new cc.Sprite(item.getTexture())
                spp.setScale(0.6)
                spp.truenum = imglist[index][1]
                var poss = father.convertToNodeSpace(pos)
                spp.setPosition(poss)
                spp.preNode = item
                item.nextNode = spp
                spp.setLocalZOrder(100)
                father.addChild(spp)
                item.setOpacity(70)
                item.disListen(true)
                item.gray = true
                return true
             },
             move:function(data){
                var item = data.item
                var delta = data.delta
                var spp = item.nextNode
                scaleMove({
                    item:spp,
                    delta:delta
                })
             },
             end:function(data){
                  var item = data.item
                  var spp = item.nextNode
                  for (var i in rectlist) {
                    if (cc.rectContainsPoint(rectlist[i],spp.getPosition())){
                         if(i == spp.truenum){
                            spp.setPosition(60+rectlist[i].x+rectarray[i].length*120,
                                rectlist[i].y+rectlist[i].height/2)
                            rectarray[i].push(spp)
                           return  
                         }    
                    }
                  }
                  spp.removeFromParent()
                  item.setOpacity(255)
                  item.gray = false
                  item.disListen(false)
             }
          })
      }
      
      node.openListen = function(num){
         for(var i = 0; i<imglist.length; i++){
             if(!splist[i].gray)
                splist[i].disListen(false)
             if((num-5)<=i && i< num){
                splist[i].disListen(true)
             }
         }
      }
      node.openListen(10)


      var actionWithBtn = function(btn){
          btn.runAction(cc.repeatForever(
               cc.sequence(
                   cc.moveBy(0.5,cc.p(5,0)),
                   cc.moveBy(0.5,cc.p(-5,0))
                )))
      }
      var leftbtn = new ccui.Button(res.btn_arrow_normal,res.btn_arrow_select)
      var rightbtn = new ccui.Button(res.btn_arrow_normal,res.btn_arrow_select)

      node.addChild(rightbtn)
      node.addChild(leftbtn)
      leftbtn.setPosition(610,0)
      leftbtn.setRotation(180)
      actionWithBtn(leftbtn)
      leftbtn.addClickEventListener(function(){
         imgnode.stopAllActions()
         this.setVisible(false)
         node.openListen(5)
         rightbtn.setVisible(true)
         imgnode.runAction(cc.moveBy(0.2,cc.p(-600,0)))
      })

      rightbtn.setPosition(-100,0)
      actionWithBtn(rightbtn)
      rightbtn.setVisible(false)
      rightbtn.addClickEventListener(function(){
         imgnode.stopAllActions()
         this.setVisible(false)
         node.openListen(10)
         leftbtn.setVisible(true)
         imgnode.runAction(cc.moveBy(0.2,cc.p(600,0)))
      })
      node.setPosition(listPos)
      father.addChild(node, 100)
    },
    initTool:function(){
        var self = this
        self.biaogenode = new cc.Node()
        self.addChild(self.biaogenode,1000)
        var desk = new cc.Sprite(res.desk)
        desk.setPosition(getMiddle(-50,-300))
        this.addChild(desk)

        var toolnode = new cc.Node()
        toolnode.x = 0
        toolnode.y =0
        this.addChild(toolnode,5)
        
        var changeSome = function(status,pos,scale,op){
            var sp = new cc.Sprite()
            var spAction = null
            var scale = scale || cc.p(1,1)
            var op = op || 255
            switch(status){
               case 1:
                    spAction = createAnimation({
                                    frame: "bluese%02d.png",
                                    start: 0,
                                    end: 8,
                                    time: 0.15
                                })
               break
               case 2:
                    spAction = createAnimation({
                                    frame: "gray%02d.png",
                                    start: 0,
                                    end: 8,
                                    time: 0.15
                                })
               break
            }
            sp.setPosition(pos)
            sp.runAction(spAction)
            sp.setScale(scale.x,scale.y)
            sp.setOpacity(op)
            this.addChild(sp)
        }
        
        this.toolbtn = createTool({
            pos:cc.p(350, 550),
            nums:5,
            tri:"right",
            modify:cc.p(1, 1.2),
            devide:cc.p(1.3, 1.2),
            itempos:cc.p(3, -15),
            circlepos:cc.p(0, 13),
            showTime:0.3,
            moveTime:0.2,
            scale:0.7,
            itemScale:1,
            ifcircle: true,
            firstClick: function(data) {
                var item = data.sp
                var index = data.index
                for(var i in toolnode.getChildren()){
                      if(toolnode.getChildren()[i].index != index)
                          toolnode.getChildren()[i].forceBack()
                          fruit1.haveWater = false
                    }
                item.changeColor = changeSome
                return true
            },
            outfun:function(data){
               var item = data.sp
               item.setPosition(getMiddle(-50,-120))
            },
            father:toolnode,
            itempos:[cc.p(-2,-20),cc.p(0,-23),cc.p(0,-18),cc.p(0,-16.5),cc.p(0,-18),
            cc.p(0,-16.5),cc.p(0,-20),cc.p(0,-20),cc.p(0,-24),cc.p(0,-19)],
            files:[res.item1,res.item2,res.item3,res.item4,res.item5,
            res.item6,res.item7,res.item8,res.item9,res.item10],
            gets:[res.fruit1,res.fruit2,res.fruit3,res.fruit4,res.fruit5,
            res.fruit6,res.fruit7,res.fruit8,res.fruit9,res.fruit10]
        })
        this.addChild(this.toolbtn,3)

        var tips1 = new cc.Sprite(res.tips1)
        tips1.setPosition(getMiddle(0,100))
        this.addChild(tips1)

        var fruit1 = new cc.Sprite(res.fruit1)
        fruit1.setPosition(getMiddle(-60,-120))
        this.addChild(fruit1)
        fruit1.setVisible(false)
         

         var colorFunList = [
            {
                num:1,
                pos:cc.p(90,40),
                scale:cc.p(1,0.7),
                op:150,
            },
            {
                num:2,
                pos:cc.p(70,60),
                scale:cc.p(0.8,0.7),
                op:255,
            },
            {
                num:2,
                pos:cc.p(60,60),
                scale:cc.p(0.8,0.8),
                op:255,
            },
            {
                num:1,
                pos:cc.p(45,115),
                scale:cc.p(1,1),
                op:250,
            },
            {
                num:2,
                pos:cc.p(40,40),
                scale:cc.p(1,1),
                op:255,
            },
            {
                num:1,
                pos:cc.p(45,60),
                scale:cc.p(1.2,0.4),
                op:100,
            },
            {
                num:1,
                pos:cc.p(60,60),
                scale:cc.p(1.4,1.4),
                op:100,
            },
            {
                num:2,
                pos:cc.p(55,95),
                scale:cc.p(1,1),
                op:255,
            },
            {
                num:2,
                pos:cc.p(60,60),
                scale:cc.p(1,1),
                op:255,
            },
            {
                num:1,
                pos:cc.p(65,80),
                scale:cc.p(0.5,1),
                op:180,
            },

         ]

        var diguan = createIWater({
                       father:self,
                       sp:[fruit1],
                       nodescale:1,
                       pullTime:0.07,
                       showDraw:false,
                       pos:cc.p(800,220),
                       userFun:function(item){
                          if(toolnode.getChildrenCount()!=0){
                                var curitem = toolnode.getChildren()[0]
                                diguan.pullWater(item)
                                var coloritme = colorFunList[curitem.index]
                                curitem.changeColor(coloritme.num,coloritme.pos,
                                    coloritme.scale,coloritme.op)
                                item.haveWater = true
                                diguan.setAllnosee()
                                if(tips1.isVisible())
                                    tips1.setVisible(false)
                          }
                       }
                   })
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
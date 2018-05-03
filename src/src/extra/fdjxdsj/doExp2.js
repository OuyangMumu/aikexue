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
                    loadPlist("do2_draw_plist")
                    if (!self.bgg) {//观察油菜花
                        var bg = createBiaoge({
                            json: res.fdjxdsj_table2_json,
                            //isShowResult: true,
                            scale: 0.9
                        })
                        var that = bg//.getBg()
                        self.createBgMoveSp({
                            father:that,
                            imglist:[
                                ["#do2_draw1.png",7],["#do2_draw2.png",4],
                                ["#do2_draw3.png",6],["#do2_draw4.png",3],
                                ["#do2_draw5.png",5],["#do2_draw6.png",2],
                                ["#do2_draw7.png",1],["#do2_draw8.png",8],
                                ["#do2_draw9.png",0],
                            ],
                            //pos:cc.p(0,0),//150,130
                            listPos:cc.p(150,125),
                            dis:120,
                            itemScale:2,
                            resultfather:self,
                            rectlist:[
                               cc.rect(190,420,100,66),cc.rect(410,420,100,66),
                               cc.rect(630,420,100,66),cc.rect(190,330,100,66),
                               cc.rect(410,330,100,66),cc.rect(630,330,100,66),
                               cc.rect(190,230,100,66),cc.rect(410,230,100,66),
                               cc.rect(630,230,100,66),
                            ]
                        })
                        bg.upLoadFun = function(){
                            that.upResult()
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
        var createSp = function(sprite,pos,father){
            var sp = new cc.Sprite(sprite)
            sp.setPosition(pos)
            father.addChild(sp)
            return sp
        }

        self.nodebs.show(function(){
            self.nodebs.say({key:"do2_tip1"})
        })

        var bg = new cc.Sprite(res.do_bg)
        bg.setPosition(cc.p(568,320))
        self.inside_node.addChild(bg)
        var fdj = createSp(res.fdj2_item1, cc.p(250,200),self)
        fdj.setVisible(false)
        var bigItem = [res.do2_bigItem1,res.do2_bigItem2,res.do2_bigItem3]
        var fdjItem = [res.fdj2_item1,res.fdj2_item2,res.fdj2_item3]
        var curItem = null
        var toolbtn = createTool({
            pos: cc.p(300, 510),
            nums: 4,
            scale:0.7,
            tri: "right",
            showTime: 0.3,
            moveTime: 0.2,
            devide: cc.p(1.5, 1.7),
            itempos: cc.p(0, -10),
            circlepos: cc.p(0, 15),
            ifcircle: true,
            arrow:false,
            father: self,
            counts: [1, 1, 1, 1],
            swallow: [true, true, true, true],
            files: [res.do2_tools1, res.do2_tools2, res.do2_tools3, res.tools_fdj],
            gets: [res.do2_item1,res.do2_item2,res.do2_item3,res.item_fdj],
            firstClick: function(data) {
                var index = data.index
                var item = data.sp
                if(index != 3){
                    if(curItem)
                        curItem.forceBack(false)
                    curItem = item
                    curItem.index = index
                }else{
                    item.setLocalZOrder(50)
                }
                return item
            },
            clickfun: function(data){
                var index = data.index
                var item = data.sp
                if(index != 3)
                    return false
                return true 
            },
            movefun: function(data){
                var item = data.sp 
                var index = data.index
                var delta = data.delta 
                item.x += delta.x 
                item.y += delta.y
                if(index == 3 && curItem){
                    if(rectIntersectsRect(item,curItem)){
                        fdj.setVisible(true)
                    }else{
                        fdj.setVisible(false)
                    }
                }
                
            },
            outfun: function(data){
                var item = data.sp 
                var index = data.index
                if(index != 3){
                    item.noMove = true
                    item.setPosition(750,200)
                    item.setTexture(bigItem[index])
                    fdj.setTexture(fdjItem[curItem.index])
                }
            },
            backfun: function(data){
                var item = data.sp 
                var index = data.index
                if(index != 3){
                    item.noMove = true
                    item.setPosition(750,200)
                    item.setTexture(bigItem[index])
                    fdj.setTexture(fdjItem[curItem.index])
                    return false
                }
                return true 
            }
        })
        self.inside_node.addChild(toolbtn,1)
        toolbtn.show()

        var  rectIntersectsRect = function (ra, rb) {
            var maxax = ra.x + ra.width/2,
                maxay = ra.y + ra.height/2,
                maxbx = rb.x + rb.width/2-20,
                maxby = rb.y + rb.height/2-20;
            return !(maxax < rb.x - rb.width/2+20 || 
                maxbx < ra.x - ra.width/2 || 
                maxay < rb.y - rb.height/2+20 ||
                maxby < ra.y - ra.height/2/2);
        }
    },

    initPeople : function(){
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1030, 120)
        })
        this.addChild(this.nodebs,99)
        
        addContent({
            people: this.nodebs,
            key: "do2_tip1",
            img: res.do2_tip1,
            sound: res.do2_sound1,
        })
    },

    createBgMoveSp:function(data){
      var size = data.size
      var imglists = data.imglist
      var rectlist = data.rectlist
      var scale = data.scale || 1.3
      var father = data.father
      var direction = data.direction || "horizontal"
      var listPos = data.listPos || cc.p(863, 50)
      var rectNum = data.rectNum || 1
      var fromExp = data.fromExp || "do"
      var resultfather = data.resultfather || father

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
      var curOrder = 100
      for (var i = 0; i < imglist.length; i++) {
          var sp = new cc.Sprite(imglist[i][0])
          sp.tureImg = imglist[i][0]
          sp.setPosition(60+122*i,60) 
          imgnode.addChild(sp)
          sp.index = i
          sp.trueNum = imglist[i][1]
          sp.gray = false
          splist.push(sp)
          createTouchEvent({
            item:sp,
            begin:function(data){
              var item = data.item
              var sp = new cc.Sprite(item.tureImg)
              var pos = item.getParent().convertToWorldSpace(item.getPosition())
              sp.setPosition(father.convertToNodeSpace(pos))
              safeAdd(father, sp)
              sp.setLocalZOrder(100)
              item.child = sp
              sp.fatherSp = item
              sp.trueNum = item.trueNum
              item.setOpacity(120)
              item.disListen(true)
              sp.setScale(scale)
              createTouchEvent({
                      item: sp,
                      begin: function(data) {
                            var item = data.item
                            item.startpos = item.getPosition()
                            item.delitem = rectarray[item.arrayindex].splice(item.listindex, 1)
                            //item.setLocalZOrder(220)
                            safeAdd(item.getParent(),item)
                            return true
                      },
                      move: function(data) {
                            data.item.x += data.delta.x
                            data.item.y += data.delta.y
                      },
                      end: function(data) {
                          var item = data.item
                          var tmp = item.delitem

                          for (var i in rectlist)
                                if (cc.rectContainsPoint(rectlist[i], item.getPosition())) {
                                      item.arrayindex = i
                                      node.addItem(i, tmp[0])
                                      return
                                }
                          item.fatherSp.setOpacity(255)
                          item.fatherSp.disListen(false)
                          item.removeFromParent()
                      }
              })
              return true
            },
            move:function(data){
              var delta = data.delta
              var item = data.item
              item.child.x += delta.x
              item.child.y += delta.y
            },
            end:function(data){
                  var item = data.item
                  var pos = item.child.getPosition()
                  for (var i in rectlist) {
                        if (cc.rectContainsPoint(rectlist[i], pos)) {
                             item.gray = true
                             item.child.arrayindex = i
                             node.addItem(i, item.child)
                              return
                        }
                  }
                  item.setOpacity(255)
                  item.child.removeFromParent()
                  item.disListen(false)
            }
          })
      }
      node.addItem = function(num, newitem) {
            var i = num
            var item = newitem
            var tempDis = null
            var tempFun = function(key) {
                  for (var k = 0; k < rectarray[i].length; k++) {
                        if (k == 0 || k == rectarray[i].length - 1) {
                              if (tempDis <= rectarray[i][0][key]) {
                                    rectarray[i].splice(0, 0, item)
                                    item.lisindex = 0
                                    break;
                              }
                              if (tempDis >= rectarray[i][rectarray[i].length - 1][key]) {
                                    rectarray[i].splice(rectarray[i].length, 0, item)
                                    item.lisindex = rectarray[i].length - 1
                                    break;
                              }
                        }
                        if (k >= 1) {
                              if (tempDis >= rectarray[i][k - 1][key] && tempDis <= rectarray[i][k][key]) {
                                    rectarray[i].splice(k, 0, item)
                                    item.lisindex = k
                                    break
                              }
                        }
                  }
                  if (!rectarray[i].length) {
                        rectarray[i].push(item)
                        item.lisindex = 0
                  }
            }
            switch (direction) {
                  case "horizontal":
                        tempDis = item.x
                        tempFun("x")
                        break
                  case "vertical":
                        tempDis = item.y
                        tempFun("y")
                        break
            }

            node.paixu(i, item)
      }

      node.paixu = function(num, newitem) {
            var i = num
            //排序之前的处理
            if (newitem) {
                  var getlist = []
                  var removelist = []
                  if (rectNum < rectarray[i].length) {

                        if (newitem.lisindex == rectNum) {
                              var temp = rectarray[i][rectNum]
                              rectarray[i][rectNum] = rectarray[i][rectNum - 1]
                              rectarray[i][rectNum - 1] = temp
                        }

                        for (var j = 0; j < rectNum; j++) {
                              getlist[j] = rectarray[i][j]
                        }

                        for (var k = rectNum; k < rectarray[i].length; k++) {
                              removelist[k] = rectarray[i][k]
                              removelist[k].setVisible(false)
                              removelist[k].fatherSp.setOpacity(255)
                              removelist[k].fatherSp.disListen(false)
                              removelist[k].fatherSp.gray = false
                              removelist[k].removeFromParent(true)
                        }

                        rectarray[i] = []
                        for (var m = 0; m < getlist.length; m++)
                              rectarray[i][m] = getlist[m]
                  }
            }

            var tempFun = function(key) {
                  var otherkey = (key == "x") ? "y" : "x"
                  var templen = (key == "x") ? "width" : "height"
                  var templenTo = (key == "x") ? "height" : "width"
                  for (var k = 0; k < rectarray[i].length; k++) {
                        if (1 == rectarray[i].length)
                              rectarray[i][k][key] = rectlist[i][key] + rectlist[i][templen] / 2
                        else
                              rectarray[i][k][key] = rectlist[i][key] + (k + 1) * rectlist[i][templen] / (rectarray[i].length + 1)

                        rectarray[i][k][otherkey] = rectlist[i][otherkey] + rectlist[i][templenTo] / 2
                        cc.log("fuck youuuu")
                        rectarray[i][k].setLocalZOrder(1)
                        rectarray[i][k].listindex = k
                  }
            }

            switch (direction) {
                  case "horizontal":
                        tempFun("x")
                        break
                  case "vertical":
                        tempFun("y")
                        break
            }
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

      father.upResult = function() {
            var count = 0
            var lenflag = false

            for (var i in rectarray){
              for (var k in rectarray[i]){
                   if (rectarray[i][k]) {
                        lenflag = true
                        if(rectarray[i][k].trueNum != i)
                          count++
                  }
                }
            }
            var fault_mp
            var right_mp
            fromExp = "do"

            switch (fromExp) {
              case "see":
                    {
                          fault_mp = res.sound_fault_bs
                          right_mp = res.sound_right_bs
                    }
                    break
              case "do":
                    {
                          fault_mp = res.sound_fault
                          right_mp = res.sound_right
                    }
                    break
        }


            if (count == 0 && lenflag)
                  dialogControl.AddDialog("Tips", {
                        res: res.img_correct,
                        face: 1,
                        sound: right_mp,
                        confirmBtn: true,
                        father: resultfather
                  })
            else
                  dialogControl.AddDialog("Tips", {
                        res: res.img_fault,
                        modify: cc.p(30, 0),
                        face: 2,
                        sound: fault_mp,
                        confirmBtn: true,
                        father: resultfather
                  })
      }

      father.clearData = function() {
          for (var i in rectarray)
                  for (var k in rectarray[i]){
                    var curItem = rectarray[i][k]
                    curItem.fatherSp.setOpacity(255)
                    curItem.fatherSp.disListen(false)
                    curItem.fatherSp.gray = false
                    rectarray[i]=[]
                    curItem.lisindex = null
                    curItem.removeFromParent()
                  }           
      }


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

})
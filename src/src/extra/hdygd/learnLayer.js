//@author mu @14/5/10

var learnLayer = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    load: function() {
        loadPlist("learn_nums")
    },
    ctor: function() {
        this._super();
        this.learnCtor()
        var self = this
        
        var xue3_1 = new cc.Sprite(res.xue3_1)
        var xue3_2 = new cc.Sprite(res.xue3_2)
        var layList = [cc.p(485,450),cc.p(547,360),cc.p(524,275),cc.p(230,155),cc.p(568,67)]
        for(var i=0; i<layList.length; i++){
            var lay = createLayout({
                     pos:layList[i],
                     size:cc.size(55,40),
                     op:0
                   })
            xue3_1.addChild(lay)
            addInput({
              item:lay
            })
        }

        var btn = new ccui.Button(res.canBtn_nor,res.canBtn_sel)
        btn.setPosition(830,400)
        xue3_1.addChild(btn)
        btn.addClickEventListener(function(){
           if(!self.cankao){
              self.cankao = createShowImg({
                                  img:res.can1,
                                  inFun:function(){
                                    self.cankao.visSee = true
                                  },
                                  outFun:function(){
                                    self.cankao.visSee = false
                                  }
                              })
              self.addChild(self.cankao,1000)
           }
           self.cankao.show()
        })


        var btn1 = new ccui.Button(res.canBtn_nor,res.canBtn_sel)
        btn1.setPosition(830,400)
        xue3_2.addChild(btn1)
        btn1.addClickEventListener(function(){
           if(!self.cankao1){
              self.cankao1 = createShowImg({
                                  img:res.can2,
                                  bgInfo:{
                                     posOff:cc.p(-6,0)
                                  },
                                  inFun:function(){
                                    self.cankao1.visSee = true
                                  },
                                  outFun:function(){
                                    self.cankao1.visSee = false
                                  }
                              })
              self.addChild(self.cankao1,1000)
           }
           self.cankao1.show()
        })
        var pageList =  self.initPagegsr({
                            imgs:[
                                [res.xue1_1,res.xue1_2],
                                [res.xue2_1],
                                [xue3_1,xue3_2]
                            ],
                            pavedata:[
                                {offsetx: 60, offsety:0},
                                {offsetx: 60, offsety:15},
                                {nodeX: 568, nodeY:275},
                            ],
                            btns:[
                                [res.xue1btn_nor,res.xue1btn_sel,res.xue1btn_dis],
                                [res.xue2btn_nor,res.xue2btn_sel,res.xue2btn_dis],
                                [res.xue3btn_nor,res.xue3btn_sel,res.xue3btn_dis]
                            ],
                            btnpos:[
                                cc.p(330,596),
                                cc.p(550,596),
                                cc.p(780,596)
                            ],
                            btnSkipbackFun:function(){
                              if(self.cankao){
                                if(self.cankao.visSee){
                                   self.cankao.show()
                                }
                              }
                              if(self.cankao1){
                                if(self.cankao1.visSee){
                                   self.cankao1.show()
                                }
                              }
                            },
                            func:function(data){
                              var num = data.num
                              var index = data.index
                              if (index == 2) {
                                if(self.curNum != num){
                                    if(self.cankao){
                                      if(self.cankao.visSee){
                                         self.cankao.show()
                                      }
                                    }
                                    if(self.cankao1){
                                      if(self.cankao1.visSee){
                                         self.cankao1.show()
                                      }
                                    }
                                    self.curNum = num
                                }
                              }
                            }
                          }) 
        
        self.temp = new cc.DrawNode()
        xue3_2.addChild(self.temp)

        self.drawLineInxue = new cc.DrawNode()
        xue3_2.addChild(self.drawLineInxue)

        var r_list = [cc.rect(290,340,170,50),cc.rect(290,225,170,50)]
        var l_list = [cc.rect(550,405,330,40),cc.rect(550,328,350,40),
                      cc.rect(550,248,200,40),cc.rect(550,160,200,40)]

        var touchLayer3 = pageList[2].getListnerlayer()
        createTouchEvent({
          item:xue3_2,
          begin:function(data){
            var pos = data.pos
            var item = data.item
            item.begin = null
            for(var i = 0; i<r_list.length; i++){
               if(cc.rectContainsPoint(r_list[i],pos)){
                  touchLayer3.noneMove = true
                  item.begin = cc.p(r_list[i].x + r_list[i].width - 25,
                    r_list[i].y + r_list[i].height/2)
                  item.side = "left"
                  return true
               }
            }
            for(var i = 0; i<l_list.length; i++){
               if(cc.rectContainsPoint(l_list[i],pos)){
                  touchLayer3.noneMove = true
                  item.begin = cc.p(l_list[i].x + 25,l_list[i].y + l_list[i].height/2)
                  item.side = "right" 
                  return true
               }
            }
            return false
          },
          move:function(data){
            var pos = data.pos
            var item = data.item
            if(item.begin){
              self.temp.clear()
              var from = item.convertToNodeSpace(item.begin)
              var to = item.convertToNodeSpace(pos)
              self.temp.drawSegment(from,to,2,cc.color(250,0,0))
            }
          },
          end:function(data){
            touchLayer3.noneMove = false
            var pos = data.pos
            var item = data.item
            if(item.begin){
               self.temp.clear()
               switch(item.side){
                 case "right":
                     for(var i = 0; i<r_list.length; i++){
                        if(cc.rectContainsPoint(r_list[i],pos)){
                           var from = item.convertToNodeSpace(item.begin)
                           var endpos = cc.p(r_list[i].x + r_list[i].width - 25,
                           r_list[i].y + r_list[i].height/2)
                           var to = item.convertToNodeSpace(endpos)
                           self.drawLineInxue.drawSegment(from,to,2,cc.color(250,0,0))
                           break
                        }
                     }
                 break
                 case "left":
                     for(var i = 0; i<l_list.length; i++){
                        if(cc.rectContainsPoint(l_list[i],pos)){
                           var from = item.convertToNodeSpace(item.begin)
                           var endpos = cc.p(l_list[i].x + 25,l_list[i].y + l_list[i].height/2)
                           var to = item.convertToNodeSpace(endpos)
                           self.drawLineInxue.drawSegment(from,to,2,cc.color(250,0,0))
                           break
                        }
                     }
                 break
               }
            }
          }
        })

        return true
    }
})
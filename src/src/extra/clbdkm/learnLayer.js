//@author mu @14/5/10
var learnLayer = myLayer.extend({
  sprite: null,
  changeDelete: true, //是否退出删除
  load: function() {
    loadPlist("learn_nums")
  },
  ctor: function() {
    this._super()
    this.learnCtor()
    var self = this
    this.img_title.setVisible(false)
    this.img_page.setVisible(false)
    var uiName = ["xue1Btn","xue2Btn","allLine","choseList",
    "choseBtn1","choseBtn2","choseBtn3","learnTip","learntip1",
    "learntip2","learntip3","autoBtn","clc_n","clc_s",
    "cz_n","cz_s","dz_n","dz_s","zz_n","zz_s","cl_n","cl_s",
    "bc_n","bc_s","ct_n","ct_s","ci6_0","ci5_0","ba_ch"]
    for(var i=1; i<=7; i++){
      uiName.push(sprintf("ci%d",i))
    }
    var node = loadNode(res.learnNode,uiName)
    node.setPosition(getMiddle(0,114))
    node.setScale(0.93)
    this.addChild(node)
    self.node = node

    self.addTouch()

    node.playSelf = function(){
      node.ba_ch.setVisible(false)
      var ac = ccs.load(res.learnNode).action
      ac.gotoFrameAndPlay(0,30,true)
      this.stopAllActions()
      this.runAction(ac)
    }

    node.playStop = function(){
      this.stopAllActions()
      node.ba_ch.setVisible(false)
      var ac = ccs.load(res.learnNode).action
      ac.gotoFrameAndPlay(0,1,false)
      this.runAction(ac)
    }

    var setBtnVisEnable = function(btn,jude){
      btn.setEnabled(jude)
      btn.setBright(jude)
    }
    var setBtnVis = function(btn_src,btn_des,jude){
      setBtnVisEnable(btn_src,jude)
      setBtnVisEnable(btn_des,!jude)
    }
    var showAndHidSome = function(jude){
      node.allLine.setVisible(jude)
      node.choseList.setVisible(!jude)
      node.learnTip.setVisible(!jude)
      for(var i=1; i<=7; i++){
        node[sprintf("ci%d",i)].setVisible(false)
      }
    }
    node.xue1Btn.addClickEventListener(function(){
      setBtnVis(node.xue1Btn,node.xue2Btn,false)
      showAndHidSome(true)
      node.playStop()
      self.setSpStatus(false)
    })
    node.xue2Btn.addClickEventListener(function(){
      setBtnVis(node.xue2Btn,node.xue1Btn,false)
      showAndHidSome(false)
      node.playSelf()
      self.setSpStatus(true)
    })

    var freeallBtn = function(btn){
      setBtnVisEnable(node.choseBtn1,true)
      setBtnVisEnable(node.choseBtn2,true)
      setBtnVisEnable(node.choseBtn3,true)
      node.autoBtn.setVisible(true)
      if(btn){
        setBtnVisEnable(btn,false)
      }
    }
    var freeallTip = function(tip){
      node.learntip1.setVisible(false)
      node.learntip2.setVisible(false)
      node.learntip3.setVisible(false)
      if(tip){
        tip.setVisible(true)
      }
    }
    node.ToFrame = function(Frame){
      this.stopAllActions()
      var ac = ccs.load(res.learnNode).action
      ac.gotoFrameAndPlay(Frame-1,Frame,false)
      this.runAction(ac)
      node.ba_ch.setVisible(true)
    }
    node.choseBtn1.addClickEventListener(function(){
      freeallBtn(node.choseBtn1)
      freeallTip(node.learntip1)
      node.ToFrame(1)
      
    })
    node.choseBtn2.addClickEventListener(function(){
      freeallBtn(node.choseBtn2)
      freeallTip(node.learntip2)
      node.ToFrame(15)
    })
    node.choseBtn3.addClickEventListener(function(){
      freeallBtn(node.choseBtn3)
      freeallTip(node.learntip3)
      node.ToFrame(30)
    })
    node.autoBtn.addClickEventListener(function(){
      freeallBtn()
      freeallTip()
      node.autoBtn.setVisible(false)
      node.playSelf()
    })
    return true
  },
  addTouch:function(){
    var self = this
    var node = self.node
    this.dataInfo = [
        {
           tousp:[
           {sp:node.clc_n,rect:cc.rect()},
           {sp:node.ci2,rect:cc.rect()},
           ],
           visi:[node.clc_s,node.ci2],
         },
        {
          tousp:[
          {sp:node.cz_n,rect:cc.rect()},
          {sp:node.ci3,rect:cc.rect()},
          ],
          visi:[node.cz_s,node.ci3],
        },
        {
          tousp:[
          {sp:node.zz_n,rect:cc.rect()},
          {sp:node.ci5_0,rect:cc.rect()},
          ],
          visi:[node.zz_s,node.ci5],
        },
        {
          tousp:[
          {sp:node.dz_n,rect:cc.rect()},
          {sp:node.ci4,rect:cc.rect()}
          ],
          visi:[node.dz_s,node.ci4],
        },
        {
          tousp:[
          {sp:node.cl_n,rect:cc.rect()},
          {sp:node.ci6_0,rect:cc.rect()}
          ],
          visi:[node.cl_s,node.ci6],
        },
        {
          tousp:[
          {sp:node.bc_n,rect:cc.rect()},
          {sp:node.ci1,rect:cc.rect()}
          ],
          visi:[node.bc_s,node.ci1],
        },
        {
          tousp:[
          {sp:node.ct_n,rect:cc.rect()},
          {sp:node.ci7,rect:cc.rect()}
          ],
          visi:[node.ct_s,node.ci7],
        },    
    ]
    for(var k=0;k<this.dataInfo.length;k++){
        var tousp = this.dataInfo[k].tousp
        for(var n in tousp){
            tousp[n].sp.num = k
            createTouchEvent({
                swallow:true,
                item:tousp[n].sp,
                begin:function(data){
                 //其他看不见
                  for(var k=0;k<self.dataInfo.length;k++)
                      if(k != data.item.num){
                        var visiall = self.dataInfo[k].visi
                        for(var d in visiall)
                            visiall[d].setVisible(false)
                      }

                //被点击的看的见
                  var visi = self.dataInfo[data.item.num].visi
                  for(var m in visi)
                      visi[m].setVisible(true)
                }
            })
        }
    }
  },
  setSpStatus:function(jude){
    for(var k=0;k<this.dataInfo.length;k++){
      var tousp = this.dataInfo[k].tousp
      for(var n in tousp){
        tousp[n].sp.disListen(jude)
      }
      var visiall = this.dataInfo[k].visi
      for(var d in visiall)
        visiall[d].setVisible(false)
    }
  }
})
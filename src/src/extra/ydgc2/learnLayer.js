//@author mu @14/5/10
var learnLayer = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    load: function() {
        loadPlist("learn_nums")
    },
    ctor:function(){
      this._super()
      this.learnCtor()
      var self = this
      
      var uiname = ["btnNode"]
      this.learnnode = loadNode(res.learn_csb,uiname)
      self.initPagegsr({
        imgs:[
            [res.xue1_1],
            [this.learnnode]
        ],
        pavedata:[
            {offsetx: 0, offsety:-40,jdtpos:cc.p(190, 90)},
            {nodeX: 30, nodeY:-30,jdtpos:cc.p(150, 90)}
        ],
        btns:[
            [res.xue1btn_nor,res.xue1btn_sel,res.xue1btn_dis],             
            [res.xue2btn_nor,res.xue2btn_sel,res.xue2btn_dis] 
        ],
        btnpos:[
            cc.p(420,593),
            cc.p(720,593)
        ]
      })

      self.btnNodeEvent()
      return true
    },
    btnNodeEvent:function(){

      var self = this
      var node = self.learnnode
      node.mvac = ccs.load(res.learn_csb).action
      node.mvac.retain()
      node.mvac = node.mvac
      node.endFrame = 459

      node.initAc = function(){
          this.stopAllActions()
          this.mvac.clearFrameEventCallFunc()
          var endFrame = this.endFrame
          var inself = this
          this.mvac.gotoFrameAndPlay(0,endFrame+1,false)
          this.runAction(this.mvac)
          this.mvac.setLastFrameCallFunc(function(){
             self.btnVector[0].loadTextureNormal(self.btnlist[0].normal)
             self.btnVector[0].loadTexturePressed(self.btnlist[0].select)
             self.btnVector[1].setVisible(false)
             self.btnVector[0].isok = true
             inself.mvac.gotoFrameAndPlay(455,475,true)
             inself.mvac.clearLastFrameCallFunc()
          })
          this.mvac.pause()
      }

      node.pauseAc = function(){
          this.mvac.pause()
      }

      node.resumeAc = function(){
          this.mvac.resume()
      }

      node.initAc()
      self.initMyBtn()
    },
    initMyBtn:function(endFrame){
      var self = this
      var node = self.learnnode
      self.btnVector = []
      var btnlist = [
        {
           name:"pause",
           pos:cc.p(0,-150),
           normal:res.btn_play_normal,
           select:res.btn_play_select,
           fun:function(sender,type){
            if(!sender.isok){
               sender.loadTextureNormal(btnlist[0].normal)
               sender.loadTexturePressed(btnlist[0].select)
               node.pauseAc()
               sender.isok = true
            }else{
               sender.loadTextureNormal(btnlist[2].normal)
               sender.loadTexturePressed(btnlist[2].select)
               if(!self.btnVector[1].isVisible()){
                  self.btnVector[1].setVisible(true)
                  node.initAc()
               }
               node.resumeAc()
               sender.isok = false
            }  
           },
        },
        {
           name:"stop",
           pos:cc.p(0,-260),
           normal:res.btn_stop_normal,
           select:res.btn_stop_select,
           fun:function(sender,type){    
                self.btnVector[0].loadTextureNormal(btnlist[0].normal)
                self.btnVector[0].loadTexturePressed(btnlist[0].select)
                node.initAc()
                self.btnVector[0].isok = true
                sender.setVisible(false)
           },
        },
        {
           name:"play",
           pos:cc.p(50,150),
           normal:res.btn_pause_normal,
           select:res.btn_pause_select,
           fun:function(){
           },
        },    
        {
           name:"restart",
           pos:cc.p(50,200),
           normal:res.btn_restart_normal,
           select:res.btn_restart_select,
           fun:function(){
           },
        }
      ]
      self.btnlist = btnlist
      for(var i=0;i<2;i++){
          var tempbtn = new ccui.Button(btnlist[i].normal,btnlist[i].select)
          tempbtn.setPosition(btnlist[i].pos)
          tempbtn.isok = true
          node.btnNode.addChild(tempbtn)
          self.btnVector.push(tempbtn)
          tempbtn.addClickEventListener(btnlist[i].fun)
      }
    }
})


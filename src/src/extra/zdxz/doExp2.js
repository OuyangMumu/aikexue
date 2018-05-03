//@author mu @16/5/11

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
          setZ:1000,
          settingData: {
            pos: cc.p(1080, 580),
            biaogeFun: function() {
              if (!self.bgg) {
                var colors = []
                for (var k = 0; k <= 7; k++)
                  colors.push(cc.color(255, 0, 0))

                var bg = createBiaoge({
                  json: res.zdxz_bg,
                  inputNum: 8,
                  isShowResult: false,
                  scale: 0.9,
                  rootColor: colors
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
    initUI: function(){
       var self = this
       var uiname = [
        "cbz","cyz","cnpz","ctz","cxz",
        "shou","zhiac","numt","dotip3","dotip2"
       ]
       for(var i=1;i<7;i++){
         var str = "btn"+i
         var str1 = "btn"+(10*i)
         uiname.push(str)
         uiname.push(str1)
       }
       this.node = loadNode(res.do2,uiname)
       this.addChild(this.node)
       var node = this.node

       this.acList  = [
           {
            sp:node.cbz,
            max:3
           },
           {
            sp:node.cyz,
            max:4
           },
           {
            sp:node.cnpz,
            max:6
           },
           {
            sp:node.ctz,
            max:8
           },
           {
            sp:node.cxz,
            max:11
           },
       ]
       for(var i=0;i<5;i++){
         this.acList[i].sp.maxnum = this.acList[i].max
       }

       node.btn1.setVisible(false)
       node.btn10.setVisible(true)
       node.shou.istouch = false
       node.shou.setScale(1.1)
       node.shou.curSp = node.cbz
       this.numtxt = new cc.LabelTTF(3,"",20)
       this.numtxt.setPosition(20,20)
       this.numtxt.setColor(cc.color(0,0,0))
       node.numt.addChild(this.numtxt)
       this.firsttip = true

       node.shou.myshow = function(){
          this.setVisible(true)
          this.istouch = true
          node.dotip2.setVisible(true)
          node.dotip3.setVisible(false)
          if(self.firsttip){
            self.nodebs.say({
                    key: "tip" 
                  })
            self.firsttip = false
          }
       }
       node.shou.myhide = function(){
          if(this.isVisible()){
            this.setVisible(false)
            this.istouch = false
            node.dotip2.setVisible(false)
            node.dotip3.setVisible(true)
          } 
       }
       node.zhiac.playAc1 = function(){
          node.numt.setVisible(true)
          var ac = ccs.load(res.zhiAc).action
          ac.gotoFrameAndPlay(0,10,false) 
          this.runAction(ac)
       }
       node.zhiac.playAc2 = function(){
          node.numt.setVisible(true)
          var ac = ccs.load(res.zhiAc).action
          ac.gotoFrameAndPlay(10,17,false) 
          this.runAction(ac)
       }
       node.zhiac.playAc = function(){
          var ac = ccs.load(res.zhiAc).action
          ac.gotoFrameAndPlay(0,2,false) 
          this.runAction(ac)
       }
      
       for(var i=1;i<6;i++){
         var str = "btn"+i
         var item = this.node[str]
         item.index = i
         createTouchEvent({
            item:item,
            begin:function(data){
              var item = data.item
              var index = item.index
              var dstr = "btn"+(10*index)
              item.setVisible(false)
              self.node[dstr].setVisible(true)
              cc.log("index",index)
              node.numt.setVisible(false)
              node.zhiac.playAc()
              self.acList[index-1].sp.setVisible(true)
              node.shou.curSp = self.acList[index-1].sp
              self.curtxt = 1
              node.btn6.myshow()
              node.shou.myhide()
              node.btn60.setVisible(false)

              for(var k=1;k<7;k++){
                  if(k!=index){
                    var btnstr = "btn"+(10*k)
                    var btnstr1 = "btn"+ k
                    self.node[btnstr].setVisible(false)
                    self.node[btnstr1].setVisible(true)
                    if(self.acList[k-1])
                       self.acList[k-1].sp.setVisible(false)
                  }
              }
              return true
            }
         })
       }
      self.curtxt = 1
       createTouchEvent({
         item:node.shou,
         begin:function(data){
           var item = data.item
           if(item.istouch){
             self.setNoneTouch(true)
             self.numtxt.setString(self.curtxt)
             if(self.curtxt<item.curSp.maxnum){
                  node.zhiac.playAc1()  
                  self.curtxt++
             }else{
                  node.zhiac.playAc2()
                  node.shou.myhide()
                  self.setNoneTouch(false)
                  node.btn6.myhide()  
             }
             return true
           }else{
             return false
           }
         },
       })

       node.btn6.myshow = function(){
          this.setVisible(true)
          this.disListen(false)
          this.setOpacity(250)
       }
       node.btn6.myhide = function(){
          this.setVisible(true)
          this.disListen(true)
          this.setOpacity(80)
          node.btn60.setVisible(false)
       }
       createTouchEvent({
            item:node.btn6,
            begin:function(data){
              var item = data.item
              item.setVisible(false)
              node.btn60.setVisible(true)
              node.shou.myshow()  
              return true
            }
        })
    },
    setNoneTouch:function(juge){
      if(juge){
          for(var i=1;i<7;i++){
              var str = "btn"+i
              var item = this.node[str]
              item.disListen(true)
              item.setOpacity(80)
          }
      }else{
          for(var i=1;i<7;i++){
              var str = "btn"+i
              var item = this.node[str]
              item.disListen(false)
              item.setOpacity(250)
          }
      }
    },
    myEnter: function() {
        this._super()
        if (this.nodebs) {
            var self = this
            self.nodebs.show(function(){
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
          key: "tip",
          sound: res.zimp2,
        })
    }  
})
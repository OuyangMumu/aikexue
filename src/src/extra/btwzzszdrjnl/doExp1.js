//@author mu @16/5/11
var doExp1 = myLayer.extend({
  sprite: null,
  changeDelete: true, //是否退出删除
  layerName: "doExp1",
  preLayer: "doLayer",
  ctor: function() { //创建时调用 未删除不会重复调用
    this.load(function() {
        loadPlist("yanlist")
        loadPlist("sudalist")
        loadPlist("wenzi")
    })
    var self = this
    this._super()
    self.biaogenode = new cc.Node()
    this.addChild(self.biaogenode,1000)
    this.expCtor({
        vis: false,
        setZ:800,
        settingData: {
          pos: cc.p(1080, 580),
          biaogeFun: function() {
            if (!self.bgg) {
              var colors = []
              for (var k = 0; k <= 1; k++)
                colors.push(cc.color(255, 0, 0))
              var buf = [[null, res.chose1, res.chose2]]
              var bg = createBiaoge({
                json: res.bg,
                inputNum: 2,
                isShowResult: false,
                scale: 0.9,
                rootColor: colors,
                downData:{
                   nums: 1,
                   bufs: buf,
                   keys: [
                       1
                   ]
                }
              })
              self.biaogenode.addChild(bg)
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
  initUI:function(){
    var self = this
    var uinamelist =[
        "yanTxt","sudaTxt","numtxt1","numtxt2",
        "juannode1","juannode2","yanbtn","sudabtn",
        "tip3","tip4"
    ]
    var node = loadNode(res.do1,uinamelist)
    this.addChild(node)
    this.csbNode = node

    for(var i = 0; i<4; i++){
        var temp = new cc.LabelTTF("0","",32)
        if(i>=2){
          temp.setColor(cc.color(250,250,0))
          temp.setString("10")
          temp.setScale(0.8)
        }
        temp.setMyStr = function(num){ 
          var txtnum = parseInt(this.getString())
          txtnum = txtnum + num
          if(txtnum>=0){
             this.setString(txtnum)
          }
        }
        temp.getMyStr = function(){
          var num = parseInt(this.getString())
          return num
        }
        node[uinamelist[i]].addChild(temp)
        node[uinamelist[i]].Txt = temp
    }  
   
    var myPlay = function(framelistname,endf,pos){
        var inself = this 
        var sp = new cc.Sprite()
        sp.setPosition(pos)
        self.addChild(sp)
        sp.runAction(cc.sequence(
          createAnimation({
              frame:framelistname,
              start:0,
              end: endf,
              time: 0.05,
          }),
          cc.callFunc(function(){
             sp.removeFromParent()
          })
        ))

        var acnode = ccs.load(res.do_rong).node
        acnode.setScale(0.7)
        acnode.setPosition(0,3)
        var acnodeAc = ccs.load(res.do_rong).action
        acnodeAc.gotoFrameAndPlay(0,162,false)
        this.addChild(acnode)
        this.acnode = acnode
        acnodeAc.setLastFrameCallFunc(function(){
           inself.getitem = true
           inself.Txtsp.Txt.setMyStr(1)
           if(inself.spNamenum==101){
              if(inself.Txtsp.Txt.getMyStr()>=10){
                  inself.Txtsp.Txt.setMyStr(-1)
                  self.nodebs.say({
                      key: "wenzi3",
                      force: true
                  })
                  self.csbNode.tip4.setVisible(true)
               } 
           }else if(inself.spNamenum==102){
             if(inself.Txtsp.Txt.getMyStr()>=3){
                inself.Txtsp.Txt.setMyStr(-1)
                self.csbNode.tip3.setVisible(true)
             }
           }
           acnode.removeFromParent()
           acnodeAc.clearLastFrameCallFunc()
        })
        acnode.runAction(acnodeAc)

        if(this.spNamenum==101){
            if(this.Txtsp.Txt.getMyStr()>=9){
                var spp = new cc.Sprite(res.rongsp)
                this.addChild(spp)
                spp.setPosition(0,2)
                spp.setScale(0)
                spp.runAction(cc.scaleTo(0.6,0.9))
                self.csbNode.yanbtn.removeListen() 
            } 
        }else if(this.spNamenum==102){
            if(this.Txtsp.Txt.getMyStr()==2){
                var spp = new cc.Sprite(res.rongsp)
                this.addChild(spp)
                spp.setPosition(0,2)
                spp.setScale(0)
                spp.setOpacity(150)
                spp.runAction(cc.scaleTo(0.6,0.7))
            }
        }
    }
    node.juannode1.myPlay = myPlay
    node.juannode2.myPlay = myPlay
    node.juannode1.getitem = true
    node.juannode1.Txtsp = node.yanTxt
    node.juannode1.spNamenum = 101
    node.juannode2.getitem = true
    node.juannode2.Txtsp = node.sudaTxt
    node.juannode2.spNamenum = 102

    var moveAndcheck = function(item,delta,checknum){
      if(item){
        var tempx = item.x + delta.x
        var tempy = item.y + delta.y
        switch(checknum){
          case 1:
            var temprect = cc.rect(250,320,116,90)
            if(cc.rectContainsPoint(temprect,item.getPosition())){
                item.removeListen()
                item.y = -600
                item.removeFromParent()
                item = null   
                self.csbNode.juannode1.myPlay("yan%02d.png",29,cc.p(170,450))
                return
               
            }
          break
          case 2:
            var temprect = cc.rect(705,325,116,90)
            if(cc.rectContainsPoint(temprect,item.getPosition())){
                item.removeListen()
                item.y = -600
                item.removeFromParent()
                item = null
                self.csbNode.juannode2.myPlay("suda%02d.png",26,cc.p(620,360))
                return       
            }
          break
        }
        item.setPosition(tempx,tempy)
      }
    }
    createTouchEvent({
      item:node.yanbtn,
      begin:function(data){
        if(!node.juannode1.getitem){
          dialogControl.AddDialog("Tips", {
                    res: res.exptip,
                    face: 2,
                    father: self
                  })
          return false
        }       
        var item = data.item
        var sp = new cc.Sprite(res.yansp)
        sp.setPosition(item.getPosition())
        sp.btn = item
        self.addChild(sp)
        createTouchEvent({
          item:sp,
          begin:function(){
            return true
          },
          move:function(data){
            var item = data.item
            var delta = data.delta
            moveAndcheck(item,delta,1)
          }
        })
        item.sp = sp
        node.numtxt1.Txt.setMyStr(-1)
        if(node.numtxt1.Txt.getMyStr()<=0){
            item.setTexture(res.nullsp)   
        }
        node.juannode1.getitem = false
        return true
      },
      move:function(data){
        var item = data.item
        var delta = data.delta
        moveAndcheck(item.sp,delta,1)
      },
    })

    createTouchEvent({
      item:node.sudabtn,
      begin:function(data){
        if(!node.juannode2.getitem){
          dialogControl.AddDialog("Tips", {
                    res: res.exptip,
                    face: 2,
                    father: self
                  })
          return false
        }      
        if(node.numtxt2.Txt.getMyStr()<=7){
            self.nodebs.say({
              key: "wenzi2",
              force: true
            })
            return true
        }
        var item = data.item
        var sp = new cc.Sprite(res.sudasp)
        sp.setPosition(item.getPosition())
        sp.btn = item
        self.addChild(sp)
        createTouchEvent({
          item:sp,
          begin:function(){
            return true
          },
          move:function(data){
            var item = data.item
            var delta = data.delta
            moveAndcheck(item,delta,2)
          }
        })
        item.sp = sp
        node.numtxt2.Txt.setMyStr(-1)
        node.juannode2.getitem = false
        return true
      },
      move:function(data){
        var item = data.item
        var delta = data.delta
        moveAndcheck(item.sp,delta,2)
      },
    })
  },
  myEnter: function() {
    this._super()
    if (this.nodebs) {
        var self = this
        self.nodebs.show(function() {
            self.nodebs.say({
                key: "wenzi1",
                force: true
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
            key: "wenzi1",
            sound: res.zimp1,
            img: "#wenzi10000",
        })
        addContent({
            people: this.nodebs,
            key: "wenzi2",
            sound: res.zimp2,
            img: "#wenzi20000",
        })
        addContent({
            people: this.nodebs,
            key: "wenzi3",
            sound: res.zimp3,
            img: "#wenzi30000",
            offset: cc.p(15, 20),
            btnoffset:cc.p(0,-15),
            scaleBg: cc.p(1.2,0.9),
        })
    } 
})
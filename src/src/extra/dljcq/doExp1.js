var createEircuitry = function(){
    loadPlist("dianluRes")
    var elcnode = new cc.Node()
    elcnode.isPass = false
    elcnode.bllubCount = 0
    elcnode.AmCount = 0
    elcnode.VmCount = 0
    elcnode.allItem = []
    elcnode.startNode = null
    /*
       set 电源 启动
    */
    elcnode.setStartNode = function(node,info){
        elcnode.startNode  = node
        elcnode.startNode.Info = info
    }
    elcnode.AllType = {
        power:"电源",
        wire:"导线",
        single_switch:"单开关",
        double_switch:"双开关",
        lamp_bllub: "灯泡座",
        Am:"电流表",
        Vm:"电压表"
    }
    elcnode.createPower = function(){
        var node = new cc.Node()
        node.successStatus = true
        node.elecType = elcnode.AllType.power
        node.left_child = null
        node.right_child = null
        var battery = new cc.Sprite("#GBattery1.png")
        node.addChild(battery)
        return node
    }
    elcnode.createWire = function(){
        var node = new cc.Node()
        node.successStatus = true
        node.elecType = elcnode.AllType.wire
        node.left_child = null
        node.right_child = null
        var battery = new cc.Sprite("#GBattery1.png")
        node.addChild(battery)
        return node
    }
    elcnode.createSingle_switch = function(){
        var node = new cc.Sprite("#SingleSwitch.png")
        node.successStatus = false
        node.elecType = elcnode.AllType.single_switch
        node.left_child = null
        node.right_child = null
        
        var kg1 = new cc.Sprite("#kg1.png")
        kg1.setPosition(132,62)
        node.addChild(kg1)

        var close = new cc.Sprite("#Choopper.png")
        close.setPosition(50,42)
        close.setAnchorPoint(0,0)
        node.addChild(close)

        var kg2 = new cc.Sprite("#kg2.png")
        kg2.setPosition(58,46)
        node.addChild(kg2)

        var kg3 = new cc.Sprite("#kg3.png")
        kg3.setPosition(132,47)
        node.addChild(kg3)

        createTouchEvent({
            item:close,
            begin:function(){
                return true
            },
            end:function(data){
                var item = data.item
                if(node.successStatus){
                    item.setRotation(0)
                }else{
                    item.setRotation(25)
                }
                node.successStatus = !node.successStatus

                if(elcnode.startNode){
                    elcnode.cheElecStatus(elcnode.startNode)
                }
                
            }
        })
        return node
    }
    elcnode.createDouble_switch = function(){
        var node = new cc.Node()
        node.successStatus = true
        node.elecType = elcnode.AllType.double_switch
        node.left_child = null
        node.right_child = null
        var battery = new cc.Sprite("#GBattery1.png")
        node.addChild(battery)
        return node
    }
    elcnode.createLamp_bllub = function(){
        var node = new cc.Sprite("#SingleSwitch.png")
        node.successStatus = true
        node.elecType = elcnode.AllType.lamp_bllub
        node.left_child = null
        node.right_child = null

        var dz2 = new cc.Sprite("#dz2.png")
        dz2.setPosition(100.5,79)
        node.addChild(dz2)

        var dengPao = new cc.Sprite("#lamp00.png")
        dengPao.setPosition(100,87)
        node.addChild(dengPao)

        dengPao.greenType = new cc.Sprite("#light.png")
        dengPao.greenType.setPosition(18,32)
        dengPao.addChild(dengPao.greenType)
        dengPao.greenType.setVisible(false)

        var dz1 = new cc.Sprite("#dz1.png")
        dz1.setPosition(100.5,54)
        node.addChild(dz1)

        node.changeStatus = function(type){
            node.curStatus = type
            switch(type){
                case "well":
                   cc.log("亮了")
                   dengPao.greenType.setVisible(true)
                break
                case "good":
                   cc.log("不亮了")
                   dengPao.greenType.setVisible(false)
                break
                case "bad":
                   cc.log("烧坏了")
                break
            }
        }

        return node
    }
    
    elcnode.linkItem = function(forward,behind){
       forward.left_child = behind
       behind.right_child = forward
    }
    elcnode.showItemStatus = function(type){
        for (var i = 0; i < elcnode.allItem.length; i++) {
            if(elcnode.allItem[i].changeStatus){
                elcnode.allItem[i].changeStatus(type)
            }
        }
    }
    elcnode.getAllCount = function(){
        count = elcnode.bllubCount + elcnode.AmCount + elcnode.VmCount
        return count
    }
    elcnode.cheElecStatus = function(node){
        var allItem = []
        if(node){
            allItem.push(node)
            if(node.successStatus){
               switch(node.elecType){
                  case elcnode.AllType.power:
                    
                  break
                  case elcnode.AllType.wire:
                    
                  break
                  case elcnode.AllType.single_switch:
                    
                  break
                  case elcnode.AllType.double_switch:
                    
                  break
                  case elcnode.AllType.lamp_bllub:
                     elcnode.bllubCount++
                  break
                  case elcnode.AllType.Am:
                     elcnode.AmCount++
                  break
                  case elcnode.AllType.Vm:
                     elcnode.VmCount++
                  break
               }
               if(node.left_child){
                    var type = node.left_child.elecType
                    if(type != elcnode.AllType.power){
                        elcnode.cheElecStatus(node.left_child)
                    }else{
                        if(elcnode.getAllCount()){
                           elcnode.isPass = true
                        }else{
                           elcnode.isPass = false
                        }
                        if(elcnode.isPass){
                            cc.log("通路")
                            elcnode.allItem = allItem
                            elcnode.showItemStatus("well")
                        }else{
                            cc.log("短路")
                        }
                    }
               }else{
                    cc.log("断路")
                    elcnode.showItemStatus("good")
               } 
            }else{
               cc.log("断路")
               elcnode.showItemStatus("good")
            }  
        }
    }
    return elcnode
}

var doExp1 = myLayer.extend({
    sprite:null,
    changeDelete:true,//是否退出删除
    layerName:"doExp1",
    preLayer:"doLayer",
    ctor:function() {//创建时调用 未删除不会重复调用
        this._super();
        this.load(function(){
            loadPlist("dianluRes")
        })
        this.expCtor()
        this.initUI()
        this.initPeople()
        return true
    },
    initUI:function(){
        var self = this

        /* 
          创建电路总控制

          初始化一个电源，附带电源的信息
        */
        var allElc = createEircuitry()
        self.addChild(allElc)

        var power1 = allElc.createPower()
        power1.setPosition(568,250)
        self.addChild(power1)
        
        var info = {
            Am : 2 ,
            Vm : 5
        }
        allElc.setStartNode(power1,info)

        
        /*
           创建其他的电路元件
         */
        var bllub = allElc.createLamp_bllub()
        bllub.setPosition(568,450)
        self.addChild(bllub)

        var SingleSwitch = allElc.createSingle_switch()
        SingleSwitch.setPosition(268,350)
        self.addChild(SingleSwitch)
        

        /*
           链接起各路元件，从电源出发
        */
        allElc.linkItem(power1,SingleSwitch)
        allElc.linkItem(SingleSwitch,bllub)
        allElc.linkItem(bllub,power1)


        
        var btn3 = new ccui.Button(res.btn3_nor,res.btn3_sel,res.btn3_sel)
        btn3.setPosition(90,200)
        this.addChild(btn3)

        btn3.addClickEventListener(function(){
            //allElc.cheElecStatus(power1)
        })
    },
    createElecLine:function(){
        var line = new cc.Node()

        var ForkRight = new cc.Sprite("#Fork1.png")
        ForkRight.setPosition(100,0)
        line.addChild(ForkRight)

        var ForkLeft = new cc.Sprite("#Fork1.png")
        ForkLeft.setPosition(-100,0)
        line.addChild(ForkLeft)
        ForkLeft.setRotation(180)

        return line
    },
    myEnter: function() {
        this._super()
        if (this.nodebs) {
            var self = this
            self.nodebs.show(function(){
              
            })
        }
    },
    initPeople:function(){
        this.nodebs = addPeople({
            id:"student",
            pos:cc.p(1010, 130)
        })
        this.addChild(this.nodebs,500)
    }
})
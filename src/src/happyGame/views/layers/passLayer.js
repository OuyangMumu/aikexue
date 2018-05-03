//单次点击
var ONETOUCH = true
views.passLayer = views.ILayer.extend({
	ctor:function () {
        this._super();
        this.alldata = initGuanqia() //关卡数据
        return true
    },
    onEnter:function(){
    	this._super();
        this.initUI()
    },
    onEnterTransitionDidFinish:function(){
    	this._super();
    },
    onExit:function(){
    	this._super();
    },
    KeyBack:function(){
            this._super()
            layerControl.showLayer("selectLayer")
    },
    initUI:function(){
        var self = this
        var passbg = createSp({img:res.pass_bg,  pos:cc.p(0,0),  father:self})
        passbg.setAnchorPoint(0,0)
        self.passbg = passbg
 
        self.showGuanQia(this.alldata)

        createTouchEvent({
            item:passbg,
            begin:function(){
                return true
            },
            move:function(data){
                var item = data.item
                var delta = data.delta

                if(item.x + delta.x <= 0 && item.x + delta.x >= -1910)
                    item.x += delta.x
            }
        })

        //进入关卡场景
        var btn_back = createSp({img:res.btn_back,  pos:cc.p(50,590),  father:self})
        scaleButtonFun({
            item:btn_back,
            fun:function () {
                layerControl.showLayer("selectLayer")
            }
        })
    },
    showGuanQia:function(data){
        var data = data || []
        var self = this
        var createDoor = function(parent,pos){
            var passDoor = createSp({
                img: res.pass_icon,
                pos: pos,
                father: parent
            })
            passDoor.leverLabel = new cc.LabelTTF(i+1,"",32)
            passDoor.leverLabel.setPosition(passDoor.width/2,passDoor.height/2)
            passDoor.addChild(passDoor.leverLabel)

            passDoor.changeStatus = function(type){
                var type = type || "normal"
                var door = this
                switch(type){
                    case "normal":
                        door.setColor(cc.color(147,144,144))
                        door.leverLabel.setOpacity(200)
                    break
                    case "select":
                        door.setColor(cc.color(255,255,255))
                        door.leverLabel.setOpacity(255)
                    break
                }   
            }
            passDoor.changeStatus("normal")
            return passDoor
        }
        //遍历所有关卡，通关颜色正常，不通过颜色灰色
        for(var i = 0 ; i < data.length ; i++){
            var door = createDoor(self.passbg,data[i].pos)
            door.infoData = data[i]
            door.index = i
            door.setLocalZOrder(1)
            if(door.infoData.clock){
                door.changeStatus("select")
                self.showPosimg(door.getPosition())
                createTouchEvent({
                    item:door,
                    begin:function(data){
                        if(ONETOUCH){
                            ONETOUCH = false
                            var item = data.item
                            self.showPosimg(item.getPosition())
                            return true
                        }
                    },
                    beginfail:function(){
                        ONETOUCH = true
                        return false
                    },
                    end:function(data){
                        ONETOUCH = true
                        var item = data.item
                        var yer = layerControl.showLayer("answerLayer")
                        yer.sendData(item.index+1)
                    }
                })
            }else{

            }
        }
    },
    //箭头,  //判断当前第几关，设置关卡动态
    showPosimg:function(pos){
        var passbg = this.passbg
        if(!passbg.director){
            passbg.director = new cc.Node() 
            var director = createSp({
                img: res.pass_director,
                pos: cc.p(0,30),
                father: passbg.director,
            })
            passbg.director.setLocalZOrder(500)
            director.setScale(0.6)
            director.setAnchorPoint(0.5,0)
            passbg.addChild(passbg.director)
            
            director.runAction(cc.repeatForever(cc.sequence(
                cc.moveTo(0.4,0,director.y+20),
                cc.moveTo(0.4,0,director.y)
            )))
        }
        passbg.director.setPosition(pos)

        passbg.myPos = 0
        if(passbg.director.x <= 568)
            passbg.myPos = 0
        else if(passbg.director.x >= passbg.width-568)
            passbg.myPos = -passbg.width+1136
        else
            passbg.myPos = -passbg.director.x+568

        passbg.setPositionX(passbg.myPos)
    }
})
//@author mu @16/5/11
var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp1",
    preLayer: "doLayer",
    ctor: function() { //创建时调用 未删除不会重复调用
        this.load(function() {
           
        })
        this._super()
        var self = this
        this.expCtor()
        this.initUI()
        this.initPeople()
        return true
    },
    initUI:function(){
        var self = this
        var uiname = ["expMain","pur","white","red","light1",
        "light2","light3","ton","slider1","fenpre","fenbh"]
        var donode = loadNode(res.doJson,uiname)
        self.addChild(donode)

        var jielunbtn = new ccui.Button(res.btn_jielun_normal,res.btn_jielun_select)
        jielunbtn.setPosition(400,530)
        self.addChild(jielunbtn)
        jielunbtn.setVisible(false)
        jielunbtn.addClickEventListener(function(){
            self.nodebs.say({
                    key: "jl1",
                })
        })


        var tuImg = createClip({
                          toShowimg:res.tu4,
                          ShowimgPos:cc.p(712,410),
                          toSencilimg:res.tu4,
                          sencilPos:cc.p(712,410),
                          father:donode.expMain,
                       })
        tuImg.setOpacity(0)
        var tuBox = new cc.Sprite(res.tu5)
        tuBox.setPosition(712,409.5)
        donode.expMain.addChild(tuBox)

        var tuW = new cc.Sprite(res.tu1)
        tuW.setPosition(tuImg.width/2,tuImg.height/2)
        tuImg.addChild(tuW)
        tuW.setVisible(false)

        var tuR = new cc.Sprite(res.tu3)
        tuR.setPosition(tuImg.width/2,tuImg.height/2)
        tuImg.addChild(tuR)
        tuR.setVisible(false)

        var tuP = new cc.Sprite(res.tu2)
        tuP.setPosition(tuImg.width/2,tuImg.height/2)
        tuImg.addChild(tuP)
        tuP.setVisible(false)
        
        var tuimgs = [tuR,tuW,tuP]
        self.tuimgs = tuimgs
        var btnList = [donode.red,donode.white,donode.pur]
        var tu = [donode.light1,donode.light2,donode.light3]
        var imgs = [res.tor,res.tow,res.top]
        var setBtnEnable = function(btn){
            for (var i = 0; i < 3; i++) {
                if(btn.index == i){
                    btnList[i].setEnabled(false)
                    btnList[i].setBright(false)
                    tu[i].setVisible(true)
                    tuimgs[i].setVisible(true)
                }else{
                    btnList[i].setEnabled(true)
                    btnList[i].setBright(true)
                    tu[i].setVisible(false)
                    tuimgs[i].setVisible(false)
                }
            }
            donode.ton.setTexture(imgs[btn.index]) 
        }
        for (var i = 0; i < btnList.length; i++) {
            btnList[i].index = i
            btnList[i].addClickEventListener(function(sender,type){
                if(!jielunbtn.isVisible()){
                    jielunbtn.setVisible(true)
                }
                setBtnEnable(sender)
            })
        }
        donode.fenpre.initPos = donode.fenpre.getPosition()
        donode.fenbh.initPos = donode.fenbh.getPosition()
        var toChangeSome = function(item){
            var disoffset = item.x * 2/35
            var toscale = 1 + disoffset/12
            donode.fenpre.x = donode.fenpre.initPos.x + disoffset
            donode.fenbh.x = donode.fenbh.initPos.x - disoffset
            for (var i = 0; i < tuimgs.length; i++) {
                tuimgs[i].setScaleX(toscale)
            }
        }

        createTouchEvent({
            item:donode.slider1,
            begin:function(){
                return true
            },
            move:function(data){
                var item = data.item
                var delta = data.delta
                var tempx = item.x + delta.x
                if(tempx<=0){
                    tempx = 0
                }else if(tempx>=105){
                    tempx = 105
                }
                item.x = tempx
                toChangeSome(item)
            }
        })
    },
    speakeBykey:function(key){
       this.nodebs.say({
                    key: key,
                    force: true
                })
    },
    preExit:function(){
        var self = this
        if(self.tuimgs){
            for (var i = 0; i < self.tuimgs.length; i++) {
                self.tuimgs[i].runAction(cc.fadeOut(0.2))
            }
        }
    },
    reEnter:function(){
        var self = this
        if(self.tuimgs){
            for (var i = 0; i < self.tuimgs.length; i++) {
                self.tuimgs[i].setOpacity(255)
            }
        }
    },
    myEnter: function() {
        this._super()
        if (this.nodebs) {
            var self = this
            self.nodebs.show(function() {
                self.speakeBykey("wenzi1")
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
            img:res.wenzi1,
            sound: res.zimp1
        })

        addContent({
           people: this.nodebs,
           key: "jl1",
           img:res.jl1,
           id:"result",
           sound: res.jlmp1,
           offset: cc.p(40, 30),
           offbg: cc.p(0,10),
       })
    }  
})
var seeExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true, 
    layerName: "seeExp1", 
    preLayer: "seeLayer", 
    ctor: function() { 
        this._super()
        this.expCtor()
        this.initPeople()
        this.initUI()
        return true
    },

    initUI:function(){
        var self = this
        loadPlist("liushui_plist")
        var createSp = function(img,pos,father){
            var sp = new cc.Sprite(img)
            sp.setPosition(pos)
            father.inside_node.addChild(sp)
            return sp
        }

        self.nodebs.show(function(){
            self.nodebs.say({key:"see_tip1"})
        })

        var aniRepeat = function(frame){
            return cc.repeatForever(cc.sequence(createAnimation({
                frame:frame,
                start: 2,
                end: 5,
                time: 0.15
            })))
        }
        var liushui = createSp(res.liushui2,cc.p(530,300),self)
        liushui.setScaleX(1.05)
        liushui.runAction(aniRepeat("liushui%d.png"))
        var bg = createSp(res.liushui1,cc.p(570,330),self)

        bg.runAction(cc.sequence(
            cc.delayTime(7),
            cc.callFunc(function(){
                var btn_result = new ccui.Button(res.btn_jielun_normal,res.btn_jielun_select)
                btn_result.setPosition(1020,450)
                self.addChild(btn_result)
                btn_result.addClickEventListener(function(){
                    self.nodebs.say({key:"result"})
                })
            })
        ))
    },

    initPeople : function(){
        this.nodebs = addPeople({
            id: "boshi",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,99)
        var addList = [
            {key:"see_tip1",img: res.see_tip1,sound:res.see_sound1}
        ]
        this.addList = addList
        for (var i = 0 ; i < addList.length ; i++){
            addContent({
                people: this.nodebs,
                key: addList[i].key,
                img: addList[i].img,
                sound: addList[i].sound,
            })
        }
        addContent({
            people: this.nodebs,
            key: "result",
            img: res.see_tip2,
            sound: res.see_sound2,
            id: "result"
        })
    },
})
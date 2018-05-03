/**
 * Created by Administrator on 2016/7/21.
 */
var seeExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true,
    layerName: "seeExp1",
    preLayer: "seeLayer",
    ctor: function () {
        this._super();
        this.expCtor();
        this.initPeople();
        this.initUI();
        return true;
    },

    initUI:function(){
    	var self = this
    	loadPlist("quanPlist")
        var uiList = [
            "oneImg","twoImg","threeImg","oneAniNode","threeAniNode",
            "oneImg_3","oneNode","twoNode","threeNode","twoAniNode"
        ]
        var node = loadNode(res.rstr_see1_json,uiList)
        self.inside_node.addChild(node)
		self.nodebs.show()
        var oneImg = node.oneImg
        var twoImg = node.twoImg
        var threeImg = node.threeImg
        var oneAniNode = node.oneAniNode
        var threeAniNode = node.threeAniNode
        var oneImg_3 = node.oneImg_3
        var oneNode = node.oneNode
        var twoNode = node.twoNode
        var threeNode = node.threeNode
        var twoAniNode = node.twoAniNode

        self.changAni(oneAniNode);
        self.changAni(twoAniNode);
        self.changAni(threeAniNode);
        oneImg.setScale(0);
        twoImg.setScale(0);
        threeImg.setScale(0);

        var time = 0.4;
        var toggle1 = new ccui.Button(res.checkbtn,res.hidebtn);
        oneNode.addChild(toggle1);


        var toggle2 = new ccui.Button(res.checkbtn,res.hidebtn);
        twoNode.addChild(toggle2);

        var toggle3 = new ccui.Button(res.checkbtn,res.hidebtn);
        threeNode.addChild(toggle3);
        toggle1.addClickEventListener(function(){
            if(oneImg.getScale() == 0){
                if(threeImg.getScale() != 0){
                    threeImg.runAction(cc.scaleTo(time,0));
                    toggle3.loadTextures(res.checkbtn,res.hidebtn);
                }
                oneImg.runAction(cc.scaleTo(time,0.7));
                toggle1.loadTextures(res.hidebtn,res.checkbtn)
                self.nodebs.say({key:"see_sound1",force:true})
                if(!oneImg_3.isVisible())
                    oneImg_3.setVisible(true);
            }else{
                if(twoImg.getScale() != 0)  return;
                oneImg.runAction(cc.scaleTo(time,0));
                self.nodebs.stopSay()
                toggle1.loadTextures(res.checkbtn,res.hidebtn)
            }
        })
        toggle2.addClickEventListener(function(){
            if(twoImg.getScale() == 0){
                twoImg.runAction(cc.scaleTo(time,0.85));
                oneImg_3.setVisible(false);
                self.nodebs.say({key:"see_sound2",force:true})
                toggle2.loadTextures(res.hidebtn,res.checkbtn)
            }else {
                twoImg.runAction(cc.scaleTo(time, 0));
                oneImg_3.setVisible(true);
                self.nodebs.stopSay()
                toggle2.loadTextures(res.checkbtn,res.hidebtn)
            }
       })
        toggle3.addClickEventListener(function(){
            if(threeImg.getScale() == 0){
                threeImg.runAction(cc.scaleTo(time,1));
                self.nodebs.say({key:"see_sound3",force:true})
                toggle3.loadTextures(res.hidebtn,res.checkbtn)
                if(oneImg.getScale() != 0){
                    oneImg.runAction(cc.scaleTo(time,0));
                    toggle2.loadTextures(res.checkbtn,res.hidebtn)
                    if(twoImg.getScale() != 0){
                        twoImg.runAction(cc.scaleTo(time,0));
                        toggle2.loadTextures(res.checkbtn,res.hidebtn)
                    }
                }
            }else{
                threeImg.runAction(cc.scaleTo(time,0));
                self.nodebs.stopSay()
                toggle3.loadTextures(res.checkbtn,res.hidebtn)
            }
        })
    },
	initPeople : function(){
        this.nodebs = addPeople({
            id: "boshi",
            pos: cc.p(1030, 130)
        })
        this.addChild(this.nodebs,99)
        var addList = [
            {key:"see_sound1",sound:res.see_sound1},
            {key:"see_sound2",sound:res.see_sound2},
            {key:"see_sound3",sound:res.see_sound3},
        ]
        for (var i = 0 ; i < addList.length ; i++) {
        	addContent({
            people: this.nodebs,
            key: addList[i].key,
            sound: addList[i].sound,
        })
        }
	},

   changAni:function(node){
		var anirepeat = function(){
		   return cc.repeatForever(cc.sequence(createAnimation({
		       frame:"quan%02d.png",
		       start: 1,
		       end: 6,
		       time: 0.1
		   })))
		}
		var quan = new cc.Sprite("#quan01.png")
		node.addChild(quan)
		quan.runAction(anirepeat())
		quan.setScaleY(0.7);
		node.setScale(0.7)
	},

})
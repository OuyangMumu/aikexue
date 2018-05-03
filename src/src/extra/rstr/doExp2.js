/**
 * Created by Administrator on 2016/7/21.
 */
var doExp2 = myLayer.extend({
    sprite: null,
    changeDelete: true,
    layerName: "doExp2",
    preLayer: "doLayer",
    ctor: function () {
        var self = this
        this._super();
        this.expCtor({})
        this.initPeople()
        this.initUI()
        return true;
    },

    initUI : function(){
    	var self = this
    	var node = loadNode(res.rstr_do2_json)
        self.inside_node.addChild(node)
		self.nodebs.show(function() {
		    self.nodebs.say({key:"do2_tip1"})
		})
        var doLayer = node
        var soil = doLayer.getChildByName("soil");
        var cup = doLayer.getChildByName("cup");
        var rod = doLayer.getChildByName("rod");
        var cupNode = doLayer.getChildByName("cupNode");
        self.pheBtn = doLayer.getChildByName("phebtn");
        self.bubbleNode = doLayer.getChildByName("bubbleNode");
        soil.setTag(11);
        rod.setTag(12);

		self.pheBtn.addClickEventListener(function(){
            if(!self.pheBtn.isVisible())    return;
            self.nodebs.say({key:"do2_faxian"})
        });
        var flag_soil = false;
        self.flag_rod = false;

        var spriteListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches:true,
            onTouchBegan: function(touch,event){
                var target = event.getCurrentTarget();
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height);

                if(cc.rectContainsPoint(rect,locationInNode)) {
                    if(self.flag_rod && target.getTag() == 12){
                        rod.setRotation(0);
                    }
                    return true;
                }
                return false;
            },
            onTouchMoved:function(touch,event){
                var target = event.getCurrentTarget();
                var delta = touch.getDelta();
                if(target.getTag() == 12 && self.flag_rod){
                    target.x += delta.x;
                    target.y += delta.y;
                    self.moveRod(rod);
                    if(self.checkdistans(rod,690,400,40)){
                        rod.removeFromParent();
                        self.bubbleNode.removeAllChildren();
                        self.playAni(cupNode,res.rstr_cupAni2_json,665,2);
                    }

                }

                if(target.getTag() == 11){
                    if(self.checkdistans(soil,690,450,50)){
                        soil.setPosition(cc.p(675,450));
                        flag_soil = true;
                        return
                    }
                    target.x += delta.x;
                    target.y += delta.y;
                }

            },
            onTouchEnded:function(touch,event){
                if(flag_soil){
                    cup.removeFromParent();
                    soil.removeFromParent();
                    self.playAni(cupNode,res.rstr_cupAni_json,215,1);
                    flag_soil = false;
                    self.scheduleOnce(function(){
                       self.nodebs.say({key:"do2_tip2",force:true}) 
                    },4);
                }
            }
        });
        cc.eventManager.addListener(spriteListener,soil);
        cc.eventManager.addListener(spriteListener.clone(),rod);

    },

    moveRod:function(rod){
        var self = this;
        var flag_move = true;
        if(rod.x < 790 && rod.x > 620 && rod.y > 420){
            flag_move = false;
        }
        if(flag_move && rod.y < 420){
            if(rod.x <800 && rod.x >780){
                rod.setPositionX(800);
            }else if(rod.x > 590 && rod.x < 630){
                rod.setPositionX(590);
            }
        }
    },

    playAni:function(node,name,frame,index){
        var self = this;
        node.removeAllChildren();
        var sp = ccs.load(name).node;
        var ac = ccs.load(name).action;
        node.addChild(sp);
        ac.gotoFrameAndPlay(0,frame,false);
        ac.setLastFrameCallFunc(function(){
            if(index == 1){
                self.flag_rod = true;
                var sp2 = ccs.load(res.rstr_bubbleAni_json).node;
                var ac2 = ccs.load(res.rstr_bubbleAni_json).action;
                self.bubbleNode.addChild(sp2);
                ac2.gotoFrameAndPlay(0,60,true);
                sp2.runAction(ac2);
            }else if(index == 2){
                self.pheBtn.setVisible(true);
            }
        });
        sp.runAction(ac);
    },

    checkdistans : function(target1,pos_x,pos_y,dis){
	    var dx = target1.x - pos_x;
	    var dy = target1.y - pos_y;
	    var distance = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2));
	    if(distance <= dis){
	        return true;
	    }else
	        return false;
	},

	initPeople : function(){
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,99)
        var addList = [
            {key:"do2_tip1",img:res.do2_tip1,sound:res.do2_sound1},
            {key:"do2_tip2",img:res.do2_tip2,sound:res.do2_sound2},
        ]
        
        addContent({
            people: this.nodebs,
            key: addList[0].key,
            img: addList[0].img,
            sound: addList[0].sound,
            offset: cc.p(0, 15),
            btnoffset: cc.p(0,-10),
        })
        addContent({
            people: this.nodebs,
            key: addList[1].key,
            img: addList[1].img,
            sound: addList[1].sound,
        })
        addContent({
            people: this.nodebs,
            key: "do2_faxian",
            img: res.do2_faxian,
            sound: res.do2_faxian_sound,
            id: "result",
        })
    },
})
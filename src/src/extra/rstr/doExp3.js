/**
 * Created by Administrator on 2016/7/21.
 */
var doExp3 = myLayer.extend({
    sprite: null,
    changeDelete: true,
    layerName: "doExp3",
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
    	var node = loadNode(res.rstr_do3_json)
        self.inside_node.addChild(node)
		self.nodebs.show(function() {
		    self.nodebs.say({key:"do3_tip1"})
		})

		var doLayer = node
		var dish = doLayer.getChildByName("dish");
            dish2 = doLayer.getChildByName("dish2");
        var glass = doLayer.getChildByName("glass");
        var tripod = doLayer.getChildByName("tripod");
        var lamp = doLayer.getChildByName("lamp");
        var cover = doLayer.getChildByName("cover");
        var match = doLayer.getChildByName("match");
        var fireNode = match.getChildByName("fireNode");
        var lampFireNode = lamp.getChildByName("lameFireNode");
        var childNode = doLayer.getChildByName("childNode");
            self.pheBtn = doLayer.getChildByName("phebtn");
            self.waterNode = doLayer.getChildByName("waterNode");
        self.yanNode = doLayer.getChildByName("yanNode");
        var coverNode = doLayer.getChildByName("coverNode");

        dish.setTag(11);
        cover.setTag(12);
        lamp.setTag(13);
        match.setTag(14);
        glass.setTag(15);
        self.inDraw = false
        self.flag_glass = false;
        self.flag_glass_2 = false;

        self.pheBtn.addClickEventListener(function(){
            if(!self.pheBtn.isVisible())     return;
            self.nodebs.say({key:"do3_faxian"})
        });

        var flag_cover = false;
        var flag_match = false;
        var flag_match_2 = false;
        var flag_lamp_notMove = false;

        var spriteListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches:true,
            onTouchBegan: function(touch,event){
                var target = event.getCurrentTarget();
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height);
                if(cc.rectContainsPoint(rect,locationInNode)) {
                    if(target.getTag() == 14 && match.isVisible()){
                        match.setRotation(30);
                        fireNode.setRotation(-30);
                    }
                    if(target.getTag() == 15){
                        if(self.flag_glass){
                            if(self.flag_glass_2){
                                self.flag_glass = false;
                                self.waterNode.removeAllChildren();
                                self.glassOver(glass);
                            }
                            glass.setTexture(res.glass2);
                            if(self.tasteImg){
                                self.tasteImg.removeFromParent();
                                self.tasteImg = null;
                                childNode.removeAllChildren();
                            }
                        }
                       if(!dish2.isVisible())
                            self.nodebs.say({key:"do3_tip6",force:true})
                    }
                    return true
                }
                return false
            },
            onTouchMoved:function(touch,event){
                var target = event.getCurrentTarget();
                var delta = touch.getDelta();

                if(target.getTag() == 11){
                    target.x += delta.x;
                    target.y += delta.y;
                    if(self.checkdistans(target,tripod.x,330,80)){
                        dish.removeFromParent();
                        dish2.setVisible(true);
                        self.nodebs.say({key:"do3_tip2",force:true})
                    }
                }

                if(target.getTag() == 12 && dish2.isVisible()){
                    if(flag_lamp_notMove && self.time != 8)   return;
                    if(!flag_cover){
                        if(cover.y < lamp.y)    return;
                        target.y += delta.y;
                        if(target.y > (lamp.y + lamp.height/2))
                            flag_cover = true;
                    }else{
                        target.x += delta.x;
                        target.y += delta.y;
                        if(self.checkdistans(target,240,200,10)){
                            target.setPosition(cc.p(240,125));
                            if(self.time == 8)
                                cover.pause();
                            flag_cover = false;
                            flag_match = false;
                            if(lampFireNode.getChildrenCount() != 0){
                                lampFireNode.removeAllChildren();
                                cover.setVisible(false);
                                self.playAni(coverNode,res.rstr_coverAni_json,100,2);
                                self.scheduleOnce(function(){
                                    cover.setVisible(true);
                                },1.67);
                            }

                        }
                    }
                }


                if(target.getTag() == 13 && dish2.isVisible()){
                    if(flag_lamp_notMove && self.time != 8)   return;
                    target.x += delta.x;
                    target.y += delta.y;
                    if(!flag_cover){
                        cover.x += delta.x;
                        cover.y += delta.y;
                    }
                }


                if(target.getTag() == 14 && match.isVisible()){
                    target.x += delta.x;
                    target.y += delta.y;
                    if(flag_match && self.checkdistans(match,240,200,30)){
                        self.fireAni(lampFireNode,res.rstr_lampFireAni_json);
                        match.setVisible(false);
                        match.setPosition(cc.p(430,210));
                        flag_match_2 = true;
                    }

                }

                if(target.getTag() == 15 && self.flag_glass){
                    if(self.checkdistans(glass,dish2.x,dish2.y,100)){
                        glass.setPosition(cc.p(800,420));
                        self.flag_glass = false;
                        self.playAni(self.waterNode,res.rstr_waterAni_json,380);
                        self.inDraw = true
                        return;
                    }
                    target.x += delta.x;
                    target.y += delta.y;
                }
            },
            onTouchEnded:function(touch,event){
                var target = event.getCurrentTarget();
                if(target.getTag() == 12){
                    if(!flag_cover){
                        target.setPositionY(125);
                    }else{
                        target.setPosition(cc.p(100,100));
                        if(!flag_match){
                            flag_match = true;
                            match.setVisible(true);
                            self.fireAni(fireNode,res.rstr_fireAni_json);
                        }
                    }
                }

                if(target.getTag() == 13){
                    if(lamp.x < tripod.x - tripod.width/2){
                        lamp.setPosition(cc.p(240,125));
                        if(self.time == 8)
                            lamp.pause();
                        if(!flag_cover)
                            cover.setPosition(cc.p(lamp.x,lamp.y));
                    }else{
                        if(flag_match_2){
                            flag_match_2 = false;
                            flag_lamp_notMove = true;
                            self.playAni(childNode,res.rstr_childAni_json,65,1);
                            self.dishSchedule();
                        }
                        lamp.setPosition(cc.p(tripod.x,tripod.y-20));
                        if(!flag_cover)
                            cover.setPosition(cc.p(lamp.x,lamp.y));
                    }

                }

                if(target.getTag() == 14 && match.getRotation() == 30){
                    match.setRotation(0);
                    fireNode.setRotation(0);
                }

                if(target.getTag() == 15 && self.flag_glass){
                    glass.setTexture(res.glass);
                }
            }
        });
        cc.eventManager.addListener(spriteListener,dish);
        cc.eventManager.addListener(spriteListener.clone(),lamp);
        cc.eventManager.addListener(spriteListener.clone(),glass);
        cc.eventManager.addListener(spriteListener.clone(),cover);
        cc.eventManager.addListener(spriteListener.clone(),match);
	},

    glassOver:function(glass){
        var self = this;
        var call = new cc.CallFunc(function(){
            glass.runAction(cc.moveTo(0.3,365,470));
        });
        var call2 = new cc.CallFunc(function(){
            cc.log(self.time);
            if(self.time <= 6)
                glass.setTexture(res.glass3);
            else
                glass.setTexture(res.glass);
        });
        var del = new cc.DelayTime(0.4);
        var seq = new cc.Sequence(call,del,call2);
        glass.runAction(seq);
    },

	dishSchedule:function(){
        var self = this;
        self.time = 2;
        var fun = function() {
            self.time++;
            switch (self.time){
                case 3:
                    dish2.setTexture(res.dish3)
                    break
                case 4:
                    dish2.setTexture(res.dish4)
                    break
                case 5:
                    dish2.setTexture(res.dish5)
                    break
                case 6:
                    dish2.setTexture(res.dish6)
                    break
                case 7:
                    dish2.setTexture(res.dish7)
                    break
                case 8:
                    dish2.setTexture(res.dish8)
                    break
            }
            if(self.time == 3){
                self.yanNode.setScale(1)
            }
            if(self.time == 4){
                self.flag_glass = true;
                self.flag_glass_2 = true;
                self.pheBtn.setVisible(true);
                if(self.inDraw)
                    self.nodebs.say({key:"do3_tip4",force:true})
            }
            if(self.time > 6 && self.waterNode.getChildrenCount() != 0)
                self.waterNode.removeAllChildren();
            if(self.time == 7){
                self.yanNode.setScale(0.7)
                self.yanNode.scheduleOnce(function(){
                    self.yanNode.setScale(0.4)
                    self.yanNode.scheduleOnce(function(){
                        self.yanNode.removeAllChildren()
                    },2)
                },3)
            }
            if(self.time == 8){
                self.nodebs.say({key:"do3_tip5",force:true})
            }
        }
        self.schedule(fun,10,5,20);

        self.yanNode.scheduleOnce(function(){
            self.yanNode.setScale(0.4)
            self.addYanParticle()
            self.yanNode.scheduleOnce(function(){
                self.yanNode.setScale(0.7)
            },6)
        },6)
    },

    addYanParticle:function(){
        var smoke = this.createWaterAir({
            total:40,
            width:30,
            height:10,
            res:res.yan,
        })
        smoke.setPosition(-10,0)
        smoke.setScale(1)
        this.yanNode.addChild(smoke);
    },

    fireAni:function(fireNode,name){
        var sp = ccs.load(name).node;
        var ac = ccs.load(name).action;
        fireNode.addChild(sp);
        ac.gotoFrameAndPlay(0,45,true);
        sp.runAction(ac);
    },

    createWaterAir:function (data){
        var total = data.total
        var width = data.width
        var height = data.height
        var tex = data.res

        var size = data.size || cc.size(60, 20)
        var finalsize = data.finalsize || cc.size(120, 30) //130,40
        var sizevar = data.sizevar || cc.size(30, 10) //40,10

        var rotate = data.rotate || 10
        var rotatevar = data.rotatevar || 20//30
        var dis = data.dis || 150
        var disvar = data.disvar || 50
        var time = data.time || 1.4
        var timevar = data.timevar || 0.2

        var node = new cc.SpriteBatchNode(tex)
        node.list = []

        var reinit = function(temp, ifdelay) {
            ifdelay = ifdelay || false
            temp.setColor(cc.color(176,176,176,255))
            temp.setPosition(width * Math.random(), height * Math.random())
            var randsize = cc.size(size.width + Math.random() * sizevar.width, size.height + Math.random() * sizevar.height)
            var endSize = cc.size(finalsize.width + Math.random() * sizevar.width, finalsize.height + Math.random() * sizevar.height)
            setSize({
                item: temp,
                width: randsize.width,
                height: randsize.height,
            })
            var randdis = dis + Math.random() * disvar
            var randRotate = rotate + Math.random() * rotatevar
            var buf = cc.p(randdis * Math.sin(randRotate / 180 * Math.PI), randdis * Math.cos(randRotate / 180 * Math.PI))
            var delay = ifdelay ? Math.random() * time : 0
            var finalTime = time + Math.random() * timevar
            temp.count = 0
            temp.setRotation(randRotate)
            temp.stopAllActions()
            temp.setOpacity(0)
            addShowType({
                item: temp,
                show: "scaleSize",
                time: finalTime,
                buf: endSize,
                delay: delay,
                fun: function(item) {
                    item.count--
                    if (item.count <= 0) {
                        reinit(item)
                    }
                }
            })
            temp.count++
            addShowType({
                item: temp,
                show: "moveTo",
                time: finalTime,
                buf: buf,
                delay: delay,
                fun: function(item) {
                    item.count--
                    if (item.count <= 0) {
                        reinit(item)
                    }
                }
            })
            temp.count++
            addShowType({
                item: temp,
                show: "fadeOut",
                time: finalTime,
                delay: delay,
                fun: function(item) {
                    item.count--
                    if (item.count <= 0) {
                        reinit(item)
                    }
                }
            })
            temp.count++
        }

            for (var i = 0; i < total; i++) {
                var temp = new cc.Sprite(tex)
                reinit(temp, true)
                node.list[i] = temp
                node.addChild(temp)
            }

            return node
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
                self.tasteImg = new cc.Sprite("res/extra/rstr/do/tasteImg.png");
                self.tasteImg.setPosition(cc.p(node.getPositionX()-30,node.getPositionY()+20));
                self.addChild(self.tasteImg);
                self.tasteImg.setAnchorPoint(1,0.5);
                self.tasteImg.setScale(0);
                self.setTipAction(self.tasteImg,1);
                self.nodebs.say({key:"do3_tast",force:true})
                self.scheduleOnce(function(){
                    self.flag_glass = true;
                    self.nodebs.say({key:"do3_tip3",force:true})
                },4);
            }else if(index == 2){
                node.removeAllChildren();
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

    setTipAction : function(sprite,index){
        if(index == 1){
            sprite.setVisible(true);
            sprite.runAction(cc.scaleTo(0.2,1));
        }else if(index == 2){
            var call = new cc.CallFunc(function () {
                sprite.runAction(cc.scaleTo(0.2,0));
            });
            var call2 = new cc.CallFunc(function () {
                sprite.setVisible(false);
            });
            var del = new cc.DelayTime(0.2);
            var seq = new cc.Sequence(call, del, call2);
            sprite.runAction(seq);
        }
    },

    initPeople : function(){
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,99)
        var addList = [
            {key:"do3_tip1",img:res.do3_tip1,sound:res.do3_sound1},
            {key:"do3_tip2",img:res.do3_tip2,sound:res.do3_sound2},
            {key:"do3_tip3",img:res.do3_tip3,sound:res.do3_sound3},
            {key:"do3_tip4",img:res.do3_tip4,sound:res.do3_sound4},
            {key:"do3_tip5",img:res.do3_tip5,sound:res.do3_sound5},
            {key:"do3_tip6",img:res.do3_tip6,sound:res.do3_sound6},
        ]
        for (var i = 0 ; i < addList.length ; i++) {
            addContent({
            people: this.nodebs,
            key: addList[i].key,
            img: addList[i].img,
            sound: addList[i].sound,
            offset:addList[i].offset,
            })
        }
        addContent({
            people: this.nodebs,
            key: "do3_faxian",
            img: res.do3_faxian,
            sound: res.do3_faxian_sound,
            id: "result",
        })
        addContent({
            people: this.nodebs,
            key: "do3_tast",
            sound: res.do3_tast_sound,
        })
    },

})
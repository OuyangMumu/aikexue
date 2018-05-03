/**
 * Created by Administrator on 2016/4/1.
 */
var local_Orade = 100
var tools = {}
tools.addListener = function(sprite,begancallback,movecallback,endcallback){
    var spListener = cc.EventListener.create({
        event: cc.EventListener.TOUCH_ONE_BY_ONE,
        swallowTouches: true,
        onTouchBegan: function (touch, event) {
            var target = event.getCurrentTarget();
            var locationInNode = target.convertToNodeSpace(touch.getLocation());
            var s = target.getContentSize();
            var rect = cc.rect(-10, 10, s.width+20,s.height);
            if(cc.rectContainsPoint(rect,locationInNode)){
                if(begancallback)
                    begancallback(touch, event);
                return true;
            }
            return false;
        },
        onTouchMoved:function(touch, event){
            if(movecallback)
                movecallback(touch, event);
        },
        onTouchEnded:function(touch, event){
            if(endcallback)
                endcallback(touch, event);
        }
    });
    sprite.listener = spListener;
    sprite.removeListen = function() {
        if (this.listener) {
            cc.eventManager.removeListener(this.listener)
            this.listener = null
        }
    }

    cc.eventManager.addListener(spListener.clone(),sprite);
}

tools.checkdistans = function(target1, target2, dis) {
    if (!(target1 && target2 && dis)) {
        cc.log("error call")
        return false
    }
    var dx = target1.x - target2.x;
    var dy = target1.y - target2.y;
    var distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    if (distance <= dis) {
        return true;
    } else
        return false;
}


/*
 *Create PageView
 *
 * @pageViewNode a node to addchildrent
 * @offsetWinsize offest
 * @openOpacity  if you want open Opacity use  true
 *
 */
var similarityPageView = cc.Class.extend({
    _listnerlayer: null,
    _pageViewNode: null,
    _Movecallback: null,
    _Begincallback: null,
    _curpageIndex: null,
    _openOpacity: null,
    _initPos: null,
    _offset: null,
    _isaddcount: true,

    ctor: function(imgData, offsetWinsize, offsetheigth, openOpacity, fathernode,allimg,data) {
        var pageViewNode = new cc.Node();
        var data = data||{}
        var offsetx = data.offsetx || 100
        var  offsety = data.offsety || 0
        var nodeX = data.nodeX || 100
        var nodeY = data.nodeY || 20
        this.jdtpos = data.jdtpos || cc.p(230, 85)
        for (var i = 0; i < imgData.length; i++) {
            if(allimg){
                if(typeof(imgData[i]) == 'string'){
                    var sp = new cc.Sprite(imgData[i]);
                    sp.setAnchorPoint(cc.p(0, 0));
                    sp.x = -offsetWinsize * i + offsetx;
                    sp.y = offsetheigth + offsety;
                    pageViewNode.addChild(sp);
                }else{
                    if(!imgData[i].nopos){
                        imgData[i].x = -offsetWinsize * i + nodeX;
                        imgData[i].y = offsetheigth+nodeY;
                    }
                    pageViewNode.addChild(imgData[i]);
                }
                
            }else{
                if (0 == imgData[i][1]) {
                    var sp = new cc.Sprite(imgData[i][0]);
                    sp.setAnchorPoint(cc.p(0, 0));
                    sp.x = -offsetWinsize * i + 100;
                    sp.y = offsetheigth;
                    pageViewNode.addChild(sp);
                } else {
                    imgData[i][0].x = -offsetWinsize * i + 100;
                    imgData[i][0].y = offsetheigth;
                    pageViewNode.addChild(imgData[i][0]);
                }
            }
        }
        pageViewNode.x = 0;
        pageViewNode.y = 120;
        fathernode.addChild(pageViewNode);


        this._pageViewNode = pageViewNode;
        var kids = pageViewNode.getChildren();
        this._offset = offsetWinsize;

        if (!openOpacity)
            for (var child in kids) {
                kids[child].setOpacity(100);
                kids[0].setOpacity(250);
            }
        this._listnerlayer = new cc.Sprite(res.bg_touchsp);
        cc.assert(this._listnerlayer, "listnerlayer is a Sprite,add a png for name is Sprite to  res/Default");
        this._listnerlayer.setAnchorPoint(cc.p(0.5, 0));
        this._listnerlayer.setOpacity(0);
        this._listnerlayer.setVisible(false)
        this._listnerlayer.x = 568;
        this._listnerlayer.y = 30;
        this._listnerlayer.setName("aTouchSp");
        this._listnerlayer.setScale(20, 8);
        this._initPos = this._listnerlayer.getPosition();
        var self = this;
        pageViewNode.addChild(this._listnerlayer);

        this.jdt = new cc.Scale9Sprite(res.img_jdt, cc.rect(0, 0, 13, 13), cc.rect(4, 0, 5, 0))
        this.jdt.setAnchorPoint(0, 0.5)
        this.jdt.height = 13
        var screenW = cc.director.getWinSize().width
        this.jdt.width = (screenW - 110 * 2 - 100) / pageViewNode.getChildrenCount()
        pageViewNode.getParent().addChild(this.jdt)
        pageViewNode.jdt = this.jdt
        this.jdt.devide = (screenW - 110 * 2) / pageViewNode.getChildrenCount()
        this.jdt.setPosition(this.jdtpos)
        this.jdt.rootX = this.jdt.getPositionX()
        if(pageViewNode.getChildrenCount()<=2)
            pageViewNode.jdt.setVisible(false)


        var kidss = pageViewNode.getChildren();
        var spriteListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            onTouchBegan: function(touch, event) {
                var target = event.getCurrentTarget();
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height);
                if (cc.rectContainsPoint(rect, locationInNode)) {
                    startpos = pageViewNode.x;
                    return true;
                }
                return false;
            },

            onTouchMoved: function(touch, event) {
                var target = event.getCurrentTarget()
                if(target.noneMove){
                    return 
                }
                var delta = touch.getDelta();
                pageViewNode.x = pageViewNode.x + delta.x;
            },
            onTouchEnded: function(touch, event) {
                var target = event.getCurrentTarget()
                if(target.noneMove){
                    return 
                }
                endpos = pageViewNode.x;
                var num = Math.floor(Math.abs(pageViewNode.x) / cc.winSize.width);
                var pvaoffset = Math.abs(pageViewNode.x) % cc.winSize.width;
                var labletxt = num;
                var infactoffset = Math.abs(pageViewNode.x) % Math.abs(offsetWinsize);
                if (infactoffset <= 10) {
                    var target = event.getCurrentTarget();
                    var locationInNode = target.convertToNodeSpace(touch.getLocation());
                    var rect = cc.rect(12, 0, 20, 40);
                    if (cc.rectContainsPoint(rect, locationInNode))
                        if (self._Begincallback)
                            self._Begincallback();
                }

                if (endpos >= startpos) {
                    offsetflag = pvaoffset > (Math.abs(offsetWinsize) / 7) * 6;
                } else {
                    offsetflag = pvaoffset > Math.abs(offsetWinsize) / 8;
                }

                if (offsetflag) {
                    if (num > 0 && num <= kidss.length - 2) {
                        if (num == kidss.length - 2) {
                            pageViewNode.runAction(cc.moveTo(0.1, num * (offsetWinsize), pageViewNode.y));
                            labletxt = num;
                        } else {
                            pageViewNode.runAction(cc.moveTo(0.1, (num + 1) * (offsetWinsize), pageViewNode.y));
                            labletxt = num + 1;
                        }
                    } else {
                        if (pageViewNode.x > 0 || 0 == kidss.length - 2) {
                            pageViewNode.runAction(cc.moveTo(0.1, num * (offsetWinsize), pageViewNode.y));
                            labletxt = num;
                        } else {
                            pageViewNode.runAction(cc.moveTo(0.1, (num + 1) * (offsetWinsize), pageViewNode.y));
                            labletxt = num + 1;
                        }
                    }
                } else {
                    pageViewNode.runAction(new cc.MoveTo(0.1, num * (offsetWinsize), pageViewNode.y));
                }

                if (labletxt == kidss.length - 2 && self._isaddcount) {
                    self._listnerlayer.x = self._initPos.x - labletxt * offsetWinsize;
                    self._isaddcount = false;
                }

                if (labletxt < kidss.length - 2) {
                    self._listnerlayer.x = self._initPos.x - labletxt * offsetWinsize;
                    self._isaddcount = true;
                }

                self._curpageIndex = labletxt;

                if (self._Movecallback)
                    self._Movecallback(labletxt, kidss.length - 2);

                self.jdt.stopAllActions()
                self.jdt.runAction(cc.moveTo(0.2,cc.p(self.jdt.rootX+labletxt*self.jdt.devide,self.jdt.y)))
            }
        });

        cc.eventManager.addListener(spriteListener, this._listnerlayer);
        this._pageViewNode.setCascadeOpacityEnabled(true)
        return true;
    },

    getListnerlayer: function() {
        return this._listnerlayer;
    },
    setListnerlayerEnable:function(judge){
       this._listnerlayer.noneMove = judge
    },
    getPageViewNode: function() {
        return this._pageViewNode;
    },
    getjdt:function(){
        return this.jdt
    },

    addMovePageListener: function(callback) {
        this._Movecallback = callback;
    },

    addClickPageListener: function(callback) {
        this._Begincallback = callback;
    },
    getCurPageIndex: function() {
        return this._curpageIndex + 1;
    },
    setCurPageIndex:function(index){
        this._curpageIndex = index - 1
    },
    getPages: function() {
        return this._pageViewNode.getChildrenCount() - 1;
    },
    scrollNext:function(nums){
        var kidss = this._pageViewNode.getChildren()
        this._curpageIndex = this._curpageIndex + nums
        if(this._curpageIndex > kidss.length - 2  || this._curpageIndex < 0)
                 return false

        this._pageViewNode.runAction(new cc.MoveTo(0.1, this._curpageIndex * this._offset, this._pageViewNode.y))
        if (this._curpageIndex == kidss.length - 2 && this._isaddcount) {
            this._listnerlayer.x = this._initPos.x - this._curpageIndex * this._offset;
            this._isaddcount = false;
        }
        if (this._curpageIndex < kidss.length - 2) {
            this._listnerlayer.x = this._initPos.x - this._curpageIndex * this._offset;
            this._isaddcount = true;
        }

        if (this._Movecallback)
         this._Movecallback(this._curpageIndex, kidss.length - 2);

        this.jdt.stopAllActions()
        this.jdt.runAction(cc.moveTo(0.2,cc.p(this.jdt.rootX+this._curpageIndex*this.jdt.devide,this.jdt.y)))
        if(this._curpageIndex >= kidss.length - 2  || this._curpageIndex<= 0)
           return false
        else
           return  true
    },

    changepaveViewPos: function(pointx, pointy) {
        this._pageViewNode.setPosition(pointx, pointy);
        this._listnerlayer.x = this._initPos.x;
        this._isaddcount = true;
        this.jdt.setPosition(this.jdtpos)
    },

    setChildrenGray: function() {
        var s = this._pageViewNode.getChildren();
        for (var child in s) {
            s[child].setOpacity(100);
            s[this._curpageIndex].setOpacity(250);
            this._listnerlayer.setOpacity(0);
        }
    }
});

var  node_local_zero = 50
var CreateSomeNode = cc.Class.extend({
    bigwenduji : null,
    dingwei : null,
    wenduji_res:null,
    miaobiao_res:null,
    temperature : 20,
    xiaowenduji : null,
    lock_dingwei : null,
    _wendujiBeganCallback : null,
    _wendujiMoveCallback : null,
    _wendujiEndCallback : null,
    _secheduleCallback : null,
    outbeizi : true,
    _color : null,
    _colornum:null,
    colorstatus:null,
    fangdanode : null,
    ctor:function(color,num){
      this._color = color;
        this._colornum = num || 0;
        this.wenduji_res = res.wenduji_res
        this.miaobiao_res = res.miaobiao_res
    },

    //温度计功能
    createWenduji:function(){
        var self = this;
        var num = 1;
        var num2 = 1;
        cc.log(this.wenduji_res)
        var wenduji = ccs.load(this.wenduji_res).node;
        this.fangdanode = wenduji.getChildByName("fangdanode");
        var leftbtn =  this.fangdanode.getChildByName("leftbtn");
        var smallBtn = this.fangdanode.getChildByName("scaledownbtn");
        var bigBtn = this.fangdanode.getChildByName("scaleupbtn");
        var closebtn = this.fangdanode.getChildByName("closebtn");
        self.leftbtn = leftbtn
        self.smallBtn = smallBtn
        self.bigBtn = bigBtn
        self.closebtn = closebtn
        self.touchsp =  this.fangdanode.getChildByName("touchsp");
        var panel = this.fangdanode.getChildByName("Panel");
        this.bigwenduji = panel.getChildByName("wendubg");
        this.bigwenduji.initX = this.bigwenduji.x
        this.xiaowenduji = wenduji.getChildByName("xiaowenduji");
        var xiaoxian = this.xiaowenduji.getChildByName("xiaoxian");
        var bigxian = this.bigwenduji.getChildByName("bigxian");
        xiaoxian.setScaleY(0.72);
        bigxian.setScaleY(0.75);
        this.lock_dingwei = true;
        this.dingwei = this.xiaowenduji.getChildByName("dingweiqi");
        //this.dingwei.setGlobalZOrder(200)
        
        wenduji.colornum = this._colornum;
        if(this._color){
          var drawnode1 = new cc.DrawNode();
          drawnode1.drawRect(cc.p(1,1),cc.p(panel.width-2,panel.height-2),null,4,this._color);
          panel.addChild(drawnode1);
          var drawnode2 = new cc.DrawNode();
          drawnode2.drawRect(cc.p(1,1),cc.p(this.dingwei.width,this.dingwei.height),null,3,this._color);
          this.dingwei.addChild(drawnode2);
        }

        smallBtn.addClickEventListener(function () {
            if (num <= 0.7 || num2 >= 1.6) return;
            num = num / 1.2;
            num2 = num2 * 1.2;
            self.bigwenduji.setScale(num);
            self.dingwei.setScale(num2);
            self.applyTemperatureToDingWei(self.temperature,0);
        });

        bigBtn.addClickEventListener(function () {
            if (num2 <= 0.7 || num >= 1.6) return;
            num = num * 1.2;
            num2 = num2 / 1.2;
            self.bigwenduji.setScale(num);
            self.dingwei.setScale(num2);
            self.applyTemperatureToDingWei(self.temperature,0);
        });

        closebtn.addClickEventListener(function(){
            self.fangdanode.setVisible(false);
        });

        //温度计监听
        tools.addListener(this.xiaowenduji,function(touch, event){
            var target = event.getCurrentTarget();
            target.setLocalZOrder(node_local_zero++)
            if(self._wendujiBeganCallback)
                self._wendujiBeganCallback(touch, event,self);
        },function(touch, event){
            if(self._wendujiMoveCallback)
                self._wendujiMoveCallback(touch, event,self);
            else{
                var target = event.getCurrentTarget();
                var delta = touch.getDelta();
                target.x += delta.x;
                target.y += delta.y;
            }
        },function(touch, event){
            if(self._wendujiEndCallback)
                self._wendujiEndCallback(touch, event,self);
        });

        this.xiaowenduji.schedule(function(dt){
            if(self._secheduleCallback)
                self._secheduleCallback(self);
        });

        //放大镜监听
        tools.addListener(self.touchsp,null,function(touch, event){
            var target = event.getCurrentTarget();
            var delta = touch.getDelta();
            //target.getParent().setLocalZOrder(node_local_zero++)
            if(target.getParent().getParent())
                //target.getParent().getParent().setLocalZOrder(local_Orade++)
            target.getParent().x += delta.x;
            target.getParent().y += delta.y;
        },null);


        //定位器监听
        tools.addListener(self.dingwei,function(){
            self.fangdanode.setVisible(true);
        },function(touch, event){
            var target = event.getCurrentTarget();
            var delta = touch.getDelta();
            target.y += delta.y;
            target.x += delta.x;
            if(target.x <= 9)
                target.x = 9;
            if(target.x >= self.xiaowenduji.getContentSize().width)
                target.x = self.xiaowenduji.getContentSize().width;
            if (target.y >= self.xiaowenduji.getContentSize().height)
                target.y = self.xiaowenduji.getContentSize().height;
            if (target.y <= 0)
                target.y = 0;

            self.bigwenduji.x = self.bigwenduji.initX - 5*(target.x - target.width/2) 
            var value = (target.y-170)/242*80+20;
            self.applyTemperatureToDingWei(value,0);

        },function(touch, event){
            var target = event.getCurrentTarget();
            self.dingwei.setPositionX(self.xiaowenduji.getContentSize().width/2);
            self.bigwenduji.setPositionX(self.bigwenduji.getParent().getContentSize().width/2);
            if(self.lock_dingwei){
                self.setTemperature(self.temperature,0);
            }else {
                var value = (target.y - 170) / 242 * 80 + 20;
                self.applyTemperatureToDingWei(value, 0);
            }
        });
        return wenduji;
    },

    //添加温度计触摸事件
    /*
       @addWendujiBeganCallback  began
       @addWendujiMoveCallback   move
       @addWendujiEndCallback    end
     */
    addWendujiBeganCallback:function(callback){
        this._wendujiBeganCallback = callback;
    },

    addWendujiMoveCallback:function(callback){
        this._wendujiMoveCallback = callback;

    },
    addWendujiEndCallback:function(callback){
        this._wendujiEndCallback = callback;
    },

    addSecheduleCallback:function(callback){
        this._secheduleCallback = callback;
    },

    getXiaowenduji:function(){
        return this.xiaowenduji;
    },
    getdiweiqi:function(){
        return this.dingwei;
    },

    getpanel:function(){
        return this.fangdanode;
    },
    removeWdjTouch:function(){
        this.xiaowenduji.removeListen()
    },
    removePanelTouch:function(){
        var self = this
        this.touchsp.removeListen()
        this.touchsp.setPositionY(-500)
        this.fangdanode.setPositionY(-500)
        this.dingwei.setPositionY(-5000)
        self.leftbtn.setPositionY(-5000)
        self.smallBtn.setPositionY(-5000)
        self.bigBtn.setPositionY(-5000)
        self.closebtn.setPositionY(-5000)
    },
    //改变温度时 action
    setTemperature:function(value,second){
        this.temperature = value;
        var xiaoxian = this.xiaowenduji.getChildByName("xiaoxian");
        var bigxian = this.bigwenduji.getChildByName("bigxian");
        var v =0.72 + (value-20)*0.0136;
        var v2 =0.75 + (value-20)*0.021;
        xiaoxian.stopAllActions();
        bigxian.stopAllActions();
        if(second<=0){
            xiaoxian.setScaleY(v);
            bigxian.setScaleY(v2);
        }
        else{
            xiaoxian.runAction(cc.scaleTo(second,1,v));
            bigxian.runAction(cc.scaleTo(second,1,v2));
        }
        if(this.lock_dingwei){
            this.applyTemperatureToDingWei(value,second);
        }
    },

    //定位器重新定位
    applyTemperatureToDingWei:function(value,second){
        //y:170 , v:20;
        //y:170+242 ,v:100
        var dw_y = 170+242*(value-20)/(100-20);
        //y:127.5388 , v:20;
        //y:127.5388+1082 ,v:100
        var s_y = this.bigwenduji.getScaleY();
        var wdj_y = 127.5388-1082*(value-20)/(100-20)*s_y;
        if(second<=0){
            this.dingwei.stopAllActions();
            this.bigwenduji.stopAllActions();

            this.dingwei.setPositionY(dw_y)
            this.bigwenduji.setPositionY(wdj_y)
        }else{
            this.dingwei.stopAllActions();
            this.bigwenduji.stopAllActions();
            this.dingwei.runAction(cc.moveTo(second,cc.p(this.dingwei.getPositionX(),dw_y)));
            this.bigwenduji.runAction(cc.moveTo(second,cc.p(this.bigwenduji.getPositionX(),wdj_y)));
        }
    },

    //创建秒表功能
    createMiaobiao:function(){
            var miaobiao = ccs.load(this.miaobiao_res).node;
            var resetbtn = miaobiao.getChildByName("resetbtn");
            var startbtn = miaobiao.getChildByName("startbtn");
            var miaozhen = miaobiao.getChildByName("miaozhen");
            var mneedle = miaobiao.getChildByName("mneedle");
            var mb = miaobiao.getChildByName("mb");
            var ispause = false;

            resetbtn.addClickEventListener(function(){
                miaobiao.unscheduleAllCallbacks();
                ispause = false;
                miaozhen.setRotation(0);
                mneedle.setRotation(0)
            });
            startbtn.addClickEventListener(function(){
                if(ispause){
                    ispause = false;
                    miaobiao.unscheduleAllCallbacks();
                }else{
                    ispause = true;
                    miaobiao.schedule(function(){
                        miaozhen.setRotation(miaozhen.getRotationX()+0.5);
                        mneedle.setRotation((miaozhen.getRotationX()+0.5)/30)
                    },1/60);
                }
            });

            var spListener = cc.EventListener.create({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: true,
                onTouchBegan: function (touch, event) {
                    var target = event.getCurrentTarget();
                    var locationInNode = target.convertToNodeSpace(touch.getLocation());
                    var s = target.getContentSize();
                    var rect = cc.rect(10, 0, s.width-10,s.height-80);
                    if(cc.rectContainsPoint(rect,locationInNode)){
                        if(target.getParent().getParent())
                          target.getParent().setLocalZOrder(local_Orade++)
                        return true;
                    }
                    return false;
                },
                onTouchMoved:function(touch, event){
                    var delta = touch.getDelta();
                    miaobiao.x += delta.x;
                    miaobiao.y += delta.y;
                }
            });
            cc.eventManager.addListener(spListener,mb);
            miaobiao.setLocalZOrder(local_Orade++)

            return miaobiao;
    }
});
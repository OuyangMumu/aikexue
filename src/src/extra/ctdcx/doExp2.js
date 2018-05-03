var doExp2 = myLayer.extend({
    sprite: null,
    changeDelete: true, //是否退出删除
    layerName: "doExp2",
    preLayer: "doLayer",
    ctor: function() { //创建时调用 未删除不会重复调用
        this.load(function() {
        
        });
        this._super()
        this.expCtor()
        this.initUI()
        this.initTool()
        this.initPeople()
       
        return true
    },
    initTool:function(){
        var self = this
        var node = self.allnode
        var shoupian = [res.boxshou2,res.boxshou3,res.boxshou4,res.boxshou5,null,res.boxshou1];
        var toolnode = new cc.Node();
        toolnode.x = 0 ; toolnode.y =0;
        this.addChild(toolnode,5);
      
         this.toolbtn = createTool({
            pos:cc.p(105, 500),
            nums:3,
            tri:"down",
            modify:cc.p(1, 1.2),
            devide:cc.p(1.5, 1.2),
            itempos:cc.p(3, -30),
            circlepos:cc.p(0, 15),
            showTime:0.3,
            moveTime:0.2,
            scale:0.8,
            ifcircle: true,
            firstClick:function(data){
                cc.log("1111111111111")
                node.shouzhi.disListen(false)
                node.listbtn.setVisible(false)
                node.btnlist.hide()
                var index = data.index
                node.shouzhi.removeAllChildren();
                node.shouzhi.setPosition(node.shouzhi.initPos);
                for(var m in self.spparray)
                        self.spparray[m].getChildren()[0].setVisible(false)
                //tmpthis._zhinumtxt = 10;
                node.xinfengnode.removeAllChildren();
                if (shoupian[index]) {
                    var shoufind = new cc.Sprite(shoupian[index]);
                    shoufind.x = 0;
                    shoufind.y = 12;
                    node.shouzhi.addChild(shoufind, 20);
                    node.xinfengnode.addSome = false

                    var shouzhisp = new cc.Sprite(res.shouzhi);
                    shouzhisp.x = 80;
                    shouzhisp.y = 60;
                    node.shouzhi.addChild(shouzhisp, 21);
                    for(var i= 0;i<4;i++)
                        self.spparray[i].move = false
                
                }else{
                    
                    var xfnode = ccs.load(res.xingfenNode).node;
                    node.xinfengnode.addChild(xfnode)
                    node.xinfengnode.addSome = true

                    self.nodebs.say({
                         key: "zi9mp",
                         force:true
                    })

                    node.shouzhi.disListen()
                    for(var i= 0;i<4;i++){
                        self.spparray[i].disListen(false)
                        self.spparray[i].move = true
                    }
                }

                if(index==5){
                    node.listbtn.setVisible(true)
                    node.numtxt.removeAllChildren()
                    var allLabel = new cc.LabelTTF(10,"",26);
                    node.numtxt.addChild(allLabel);
                    node.btnlist.numtxt = 10
                }

                
                for(var i= 0;i<4;i++) {
                    self.spflag[i] = true;
                    self.spparray[i].setVisible(true);
                    self.spparray[i].setPosition(self.spparray[i].initPos)
                }
                self.spflag[4] = true;
                

                return false;
            },
            movefun:function(){

            },
            father:toolnode,
            files:[res.boli,res.mupian,res.suliao,res.tongpian,res.xingfeng,res.muzhi],
            gets:[null,null,null,null,null]
        });
        this.addChild(this.toolbtn,3);
    },
    initUI: function(){
        var tmpthis = this
        var uinamelist = [
           "shouzhi","spp1","spp2","spp3","spp4",
           "jielunbtn","xinfengnode","listbtn","btnlist",
           "btn1","btn2","btn3","btn4","numtxt"
        ]
        var node = loadNode(res.do2,uinamelist);
        tmpthis.allnode = node
        tmpthis.addChild(node)
        node.btnlist.numtxt = 10

        tmpthis.spparray = [node.spp1,node.spp2,node.spp3,node.spp4];
        tmpthis.spflag = [true,true,true,true,true];
        node.xinfengnode.addSome = false
        node.shouzhi.initPos = node.shouzhi.getPosition()
        var xispArray = [8,6,4,0];
        for(var i in tmpthis.spparray)
             tmpthis.spparray[i].initPos = tmpthis.spparray[i].getPosition()

        createTouchEvent({
            item:node.shouzhi,
            begin:function(data){
                return true
            },
            move:function(data){
                var item = data.item
                var delta = data.delta
                item.x += delta.x
                item.y += delta.y

            if(!node.xinfengnode.addSome){
                cc.log("hhhhhhhhhhhh:",item.getChildrenCount())
                cc.log("jjjjjjjjjjj:",node.btnlist.numtxt/10-1)
                if(item.getChildrenCount() <= xispArray[node.btnlist.numtxt/10-1]){
                        if (tmpthis.checkdistans(item, tmpthis.spparray[0], 70) && tmpthis.spflag[0]) {
                            var jiazi = new cc.Sprite(res.shujia);
                            jiazi.x = 50;
                            jiazi.y = 5;
                            item.addChild(jiazi);

                            var shouzhisp = new cc.Sprite(res.shouzhi);
                            shouzhisp.x = 80;
                            shouzhisp.y = 60;
                            item.addChild(shouzhisp, 5);
                            tmpthis.spflag[0] = false;
                            tmpthis.spparray[0].setVisible(false);
                        };
                        if (tmpthis.checkdistans(item, tmpthis.spparray[1], 50) && tmpthis.spflag[1]) {
                            var dingzi = new cc.Sprite(res.dingzi);
                            dingzi.x = 60;
                            dingzi.y = -5;
                            item.addChild(dingzi);

                            var shouzhisp = new cc.Sprite(res.shouzhi);
                            shouzhisp.x = 80;
                            shouzhisp.y = 60;
                            item.addChild(shouzhisp, 5);
                            tmpthis.spflag[1] = false;
                            tmpthis.spparray[1].setVisible(false);
                        };
                        if (tmpthis.checkdistans(item, tmpthis.spparray[2], 60) && tmpthis.spflag[2]) {
                            var tuding = new cc.Sprite(res.tuding);
                            tuding.x = 70;
                            tuding.y = 0;
                            item.addChild(tuding);

                            var shouzhisp = new cc.Sprite(res.shouzhi);
                            shouzhisp.x = 80;
                            shouzhisp.y = 60;
                            item.addChild(shouzhisp, 5);
                            tmpthis.spflag[2] = false;
                            tmpthis.spparray[2].setVisible(false);
                        };
                        if (tmpthis.checkdistans(item, tmpthis.spparray[3], 90) && tmpthis.spflag[3]) {
                            var hui = new cc.Sprite(res.huixingzhen);
                            hui.x = 40;
                            hui.y = -3;
                            item.addChild(hui);

                            var shouzhisp = new cc.Sprite(res.shouzhi);
                            shouzhisp.x = 80;
                            shouzhisp.y = 60;
                            item.addChild(shouzhisp, 5);
                            tmpthis.spflag[3] = false;
                            tmpthis.spparray[3].setVisible(false);
                        };
                }
            }else{
                  if(tmpthis.checkdistans(item,node.xinfengnode,100) && tmpthis.spflag[4]){
                    node.xinfengnode.removeAllChildren();
                    var xfnode = new cc.Sprite(res.paper);
                    xfnode.x = 50;
                    item.addChild(xfnode);

                    var shouzhisp = new cc.Sprite(res.shouzhi);
                    shouzhisp.x = 80;shouzhisp.y = 60;
                    item.addChild(shouzhisp,5);
                    //tmpthis.spflag[3] = false;
                   // tmpthis.spparray[3].setVisible(false);
                    tmpthis.spflag[4] = false;
                  }
            }

            }
        })
        node.shouzhi.disListen(false)
     
        for(var i= 0;i<4;i++){
            createTouchEvent({
                item:tmpthis.spparray[i],
                begin:function(data){

                    for(var m in tmpthis.spparray)
                        tmpthis.spparray[m].getChildren()[0].setVisible(false)

                    data.item.getChildren()[0].setVisible(true)

                   return true 
                },
                beginfail:function(){
                    for(var m in tmpthis.spparray)
                        tmpthis.spparray[m].getChildren()[0].setVisible(false)

                     return false
                },
                move:function(data){
                    var item = data.item
                    var delta = data.delta
                    if(item.move){
                        item.x += delta.x
                        item.y += delta.y

                        if(tmpthis.checkdistans(item,node.xinfengnode,40)){
                            item.setVisible(false);
                        }
                    }    
                },
                end:function(){
                    if(!tmpthis.spparray[0].isVisible() && !tmpthis.spparray[1].isVisible() &&
                        !tmpthis.spparray[2].isVisible() && !tmpthis.spparray[3].isVisible()) {
                        node.xinfengnode.removeAllChildren();
                        var xfnode = ccs.load(res.xingfenNode).node;
                        var xfnodeac = ccs.load(res.xingfenNode).action;
                        xfnodeac.gotoFrameAndPlay(0, 50, false);
                        node.xinfengnode.addChild(xfnode);
                        xfnode.runAction(xfnodeac);
                        node.shouzhi.disListen(false)
                    }
                }
            })
            tmpthis.spparray[i].move = false
        }
            

        node.jielunbtn.addClickEventListener(function(){
            tmpthis.nodebs.say({
                key: "tip1"
            })
        })

        var btnarray = [node.btn1,node.btn2,node.btn3,node.btn4]
        for(var p=0;p<4;p++){
            btnarray[p].txt = 10*(p+1)
            btnarray[p].addClickEventListener(function(sender,type){
                node.btnlist.numtxt = sender.txt;
                node.numtxt.removeAllChildren()
                var allLabel = new cc.LabelTTF(sender.txt,"",26);
                node.numtxt.addChild(allLabel);
                node.btnlist.hide()

                node.shouzhi.removeAllChildren();
                node.shouzhi.setPosition(node.shouzhi.initPos);
                for(var m in self.spparray)
                        self.spparray[m].getChildren()[0].setVisible(false)
                node.xinfengnode.removeAllChildren();
             
                var shoufind = new cc.Sprite(res.boxshou1);
                shoufind.setScale(1+sender.txt/1000);
                shoufind.x = 0;shoufind.y = 12;
                node.shouzhi.addChild(shoufind,20);
               
                for(var i= 0;i<4;i++) {
                    tmpthis.spflag[i] = true;
                    tmpthis.spparray[i].setVisible(true);
                    tmpthis.spparray[i].setPosition(tmpthis.spparray[i].initPos)
                }
                tmpthis.spflag[4] = true;
                var shouzhisp = new cc.Sprite(res.shouzhi);
                shouzhisp.x = 80;shouzhisp.y = 60;
                node.shouzhi.addChild(shouzhisp,21);
            })
        }
            
        node.btnlist.canmove = true
        node.btnlist.show = function(){
             var inself = this
             this.runAction(cc.sequence(
                    cc.moveTo(0.2,cc.p(35,62.8)),
                    cc.callFunc(function(){
                        inself.canmove = false
                    })
                ))
        }
        node.btnlist.hide = function(){
             var inself = this
             this.runAction(cc.sequence(
                    cc.moveTo(0.2,cc.p(35,192)),
                    cc.callFunc(function(){
                        inself.canmove = true
                    })
                ))
        }
        node.listbtn.addClickEventListener(function(){
            if(node.btnlist.canmove){
               node.btnlist.show()
            }else{
               node.btnlist.hide()
            }
        })
    },
    checkdistans: function(target1, target2, dis) {
        var dx = target1.x - target2.x;
        var dy = target1.y - target2.y;
        var distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

        if (distance <= dis) {
            return true;
        } else
            return false;
    },
    myEnter: function() {
        this._super()
        this.toolbtn.show()
        if (this.nodebs) {
            var self = this
            this.nodebs.show(function() {
                self.nodebs.say({
                    key: "start",
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
            key: "start",
            sound: res.zi7mp,
        })

        addContent({
            people: this.nodebs,
            key: "zi9mp",
            sound: res.zi9mp,
            img:res.wenzi1
        })

        addContent({
            people: this.nodebs,
            key: "tip1",
            img:res.tip1,
            id:"result",
            sound: res.zi8mp,
            offset: cc.p(40, 30),
            offbg: cc.p(50,50),
        })
    }
    
})

var seeExp1 = myLayer.extend({
    sprite:null,
    changeDelete:true,//是否退出删除
    layerName:"seeExp1",
    preLayer:"seeLayer",
    ctor:function() {//创建时调用 未删除不会重复调用
        this._super();
        this.load(function(){
            loadPlist("rsxz_ressee")
            loadPlist("rsxz_star")
        });
        this.expCtor();
        this.initUI();
        this.initPeople();

        return true;
    },
    myEnter: function() {
        this._super()
        if (this.nodebs) {
            var self = this
            self.nodebs.show(function() {
                self.nodebs.say({
                    key:"xz",
                })
            })
        }
    },
    reEnter:function(){
        for(var i in this.allnode.getChildren())
            this.allnode.getChildren()[i].setOpacity(255);
    },

    initUI:function(){
            var self = this;
            var uinamelist = [
                "zibeidou","zibeiji","zidaxiong","zixiaoxiong",
                "xbdqx","xbjx","xtianping","xxxz",
                "tip1", "tip2","tip3","tip4","tip5",
            ]
            var node = loadNode(res.rsxz_see1,uinamelist);
             this.allnode = node
            self.inside_node.addChild(node)

            var hideSprite = function(){
               for(var i = 0;i<uinamelist.length;i++)
                    if(i<4)
                         node.getChildByName(uinamelist[i]).setVisible(true);
                    else
                         node.getChildByName(uinamelist[i]).setVisible(false);
            }

            var showSprite = function(data){
                data.zisp.setVisible(false);
                data.xzisp.setVisible(true);
                data.tipsp.setVisible(true);
            }

           var createStar = function(parentnode){
               for(var i in parentnode){
                   var ac = ccs.load(res.rsxz_star).action
                   ac.gotoFrameAndPlay(0,9,true);
                   parentnode[i].setScale(2);
                   parentnode[i].runAction(ac);
               }
           }
           createStar(node.xbdqx.getChildren());
           createStar(node.xbjx.getChildren());

            createTouchEvent({
                  item:node.xtianping,
                  rect:cc.rect(130,0,300,375),
                  begin:function(data){
                      hideSprite();
                      showSprite({
                          zisp:node.zidaxiong,
                          xzisp:node.xtianping,
                          tipsp:node.tip2,
                      });
                      self.nodebs.say({
                          key:"dx",
                          force:true,
                      })
                      return true
                  }
            })

            createTouchEvent({
                item:node.xxxz,
                rect:cc.rect(100,0,100,168),
                begin:function(data){
                    hideSprite();
                    showSprite({
                        zisp:node.zixiaoxiong,
                        xzisp:node.xxxz,
                        tipsp:node.tip4,
                    });
                    self.nodebs.say({
                        key:"xx",
                        force:true,
                    })

                    return true
                }
            })

           tools.addListener(node.zibeidou,function(touch, event){
                  var target = event.getCurrentTarget();
                  hideSprite();
                  showSprite({
                      zisp:target,
                      xzisp:node.xbdqx,
                      tipsp:node.tip3,
                  });
               self.nodebs.say({
                   key:"bdqx",
                   force:true,
               })
           })

            tools.addListener(node.zibeiji,function(touch, event){
                var target = event.getCurrentTarget();
                hideSprite();
                showSprite({
                    zisp:target,
                    xzisp:node.xbjx,
                    tipsp:node.tip5,
                });
                self.nodebs.say({
                    key:"bjx",
                    force:true,
                })
            })

            tools.addListener(node.zidaxiong,function(touch, event){
                var target = event.getCurrentTarget();
                hideSprite();
                showSprite({
                    zisp:target,
                    xzisp:node.xtianping,
                    tipsp:node.tip2,
                });
                self.nodebs.say({
                    key:"dx",
                    force:true,
                })
            })

            tools.addListener(node.zixiaoxiong,function(touch, event){
                var target = event.getCurrentTarget();
                hideSprite();
                showSprite({
                    zisp:target,
                    xzisp:node.xxxz,
                    tipsp:node.tip4,
                });
                self.nodebs.say({
                    key:"xx",
                    force:true,
                })
            })
    },
    initPeople:function(){
        this.nodebs = addPeople({
            id:"boshi",
            pos:cc.p(1010, 130)
        })

        addContent({
            people: this.nodebs,
            key: "xz",
            sound: res.rsxz_xingxuom,
        })
        addContent({
            people: this.nodebs,
            key: "bjx",
            sound: res.rsxz_beijixingm,
        })
        addContent({
            people: this.nodebs,
            key: "bdqx",
            sound: res.rsxz_beidouxingm,
        })
        addContent({
            people: this.nodebs,
            key: "dx",
            sound: res.rsxz_daxiongm,
        })
        addContent({
            people: this.nodebs,
            key: "xx",
            sound: res.rsxz_xiaoxiongm,
        })
        this.addChild(this.nodebs);
    }
})


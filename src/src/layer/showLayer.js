/**
 * Created by Administrator on 2016/5/23.
 */

var Datiurl = "http://course.dev.gdy.io/pub/api/listGroup?aid=5747fb38bc9a3439b1a5e11d&ret_items=1"
var showurl =""
var indexTheme = 0;
var rightNum = 0;
var timenum = 0
var namestr ="刘小毅"

var showLayer = myLayer.extend({
    sprite: null,
    layerName:"showLayer",
    changeDelete: true, //是否退出删除
    ctor: function() {
        this._super();
        var ui_list = [
            "btnback",
            "fenscore",
            "answerbtn",
            "chuizi",
            "nametxt"
        ]
        loadUI(this, res.showLayer, ui_list)
        var self = this
        self.chuizisp = this.chuizi
        indexTheme = 0
        rightNum = 0

        var namelab = new cc.LabelTTF(namestr,res.myttf,30);
        namelab.setFontFillColor(cc.color(255,165,0))
        this.nametxt.addChild(namelab)
        var hlodparentNode = new cc.Node();
        this.addChild(hlodparentNode);

        this.addHudielist();

        this.btnback.addClickEventListener(function(){
            changeLayer({
                out: self,
                in : layerControl.getLayer("mainLayer")
            })
        });

        this.fenscore.addClickEventListener(function() {
            AddDialog("ShowScore",{
                showname:"common_score",
                wrong : ThemeInfolist.length-rightNum,
                right : rightNum,
                fun: function(){
                    CC_CURRENT_LAYER.changeSelf()
                }
            })
        });



        this.answerbtn.addClickEventListener(function() {
            this.removeFromParent()
            AddDialog("ShowScore",{
                showname:"show_star",
                loadfun:function(){
                    //showfun.HttpData(Datiurl)
                }
            })

            self.scheduleOnce(function(){
                var anode = showfun.showTheme(ThemeInfolist)
                self.addChild(anode)
                self.chuizisp.setVisible(true)
                anode.showAtheme(0);
                playMusic(res.onLand)
                self.probg = showfun.createProgeress({
                    father:self,
                    fun:function(){
                        if(indexTheme<(ThemeInfolist.length-1)){
                            anode.showAtheme(++indexTheme)
                            showfun.addListDishu({
                                truenum:ThemeInfolist[indexTheme].answer[0],
                                father:hlodparentNode,
                                ThemeNode : anode
                            })
                        }else{
                            //如果全答对的显示suc_score，else common_score
                            if(rightNum == ThemeInfolist.length){
                                self.probg.removeFromParent(true)
                                AddDialog("ShowScore",{
                                    showname:"suc_score"
                                })
                            }else {
                                self.probg.removeFromParent(true)
                                AddDialog("ShowScore", {
                                    showname: "common_score",
                                    wrong: ThemeInfolist.length - rightNum,
                                    right: rightNum,
                                    fun: function () {
                                        CC_CURRENT_LAYER.changeSelf()
                                    }
                                })
                               }
                            }
                        }
                })
                showfun.addListDishu({
                    truenum:ThemeInfolist[0].answer[0],
                    father:hlodparentNode,
                    ThemeNode : anode
                })

            },5)

        });
    },
    createHudie:function(scale,time){
        var hudie1 = loadNode(res.hudie)
        var hudieac = ccs.load(res.hudie).action
        hudieac.gotoFrameAndPlay(0,40)
        hudie1.setScale(scale)
        hudie1.runAction(hudieac)
        hudie1.schedule(function(){
            var dx = Math.random(0,1)
            var dy = Math.random(0,1)
            hudie1.runAction(cc.sequence(
                cc.moveTo(10*dx,cc.p(cc.winSize.width*dx,cc.winSize.height*dy)),
                cc.delayTime(3)
            ))
        },time)
        return hudie1
    },
    addHudielist:function(){
        var hudie1 = this.createHudie(1,4)
        hudie1.setPosition(1009,414)
        this.addChild(hudie1)

        var hudie2 = this.createHudie(2,6)
        hudie2.setPosition(65,205)
        this.addChild(hudie2)

        var hudie2 = this.createHudie(1.5,5)
        hudie2.setPosition(907,415)
        this.addChild(hudie2)

        var hudie3 = this.createHudie(1.2,2)
        hudie3.setPosition(969,110)
        this.addChild(hudie3)
    }
});

var showfun = {}

showfun.createProgeress = function(data){
        var pos = data.pos ||cc.p(111,445)
        var father = data.father
        var fun = data.fun
        var startTime = data.startTime || 5
        var progressBg = new cc.Sprite(res.jindutiao)
        progressBg.setPosition(pos)
        father.addChild(progressBg)

        var proTime = new cc.ProgressTimer(new cc.Sprite(res.jindutiao1))
        proTime.setPercentage(100)
        proTime.setReverseDirection(true)
        proTime.setPosition(progressBg.width/2,progressBg.height/2)
        proTime.setMidpoint(cc.p(0.5,0.5))
        proTime.setType(cc.ProgressTimer.TYPE_RADIAL)
        progressBg.addChild(proTime)
        proTime.runAction(cc.progressTo(startTime,0))


        var lab = new ccui.Text(startTime+"","",32)
        lab.setPosition(progressBg.width/2-5,progressBg.height/2)
        lab.setColor(cc.color(255,0,0))
        progressBg.addChild(lab)


        var labfunc = function(){
            timenum++;
            if(timenum>=startTime)
                lab.setString(0)
            else
                lab.setString(startTime-timenum)
            if(timenum>startTime){
                timenum = 0
                proTime.stopAllActions()
                proTime.setPercentage(100)
                proTime.runAction(cc.progressTo(startTime,0))
                if(fun)
                    fun()
            }
        }
        lab.schedule(labfunc,1)

    progressBg.stop = function(){
        lab.unscheduleAllCallbacks()
        proTime.stopAllActions()
    }
    progressBg.myresume = function(){
        timenum=0
        lab.setString(startTime)
        proTime.setPercentage(100)
        proTime.runAction(cc.progressTo(startTime,0))
        lab.schedule(labfunc,1)
    }

    return progressBg
}

showfun.showTheme = function(Infolist){
    var itemlist = [];
    var node = new cc.Node();
    for(var i in Infolist){
        var num = parseInt(i)+1
        var tmp = showfun.createTheme(Infolist[i],num);
        tmp.setPosition(cc.winSize.width/2,cc.winSize.height+tmp.height);
        node.addChild(tmp)
        itemlist.push(tmp);
    }
    node.showAtheme = function(index){
        itemlist[index].runAction( cc.sequence(
              cc.callFunc(function(){
                 if(index>0){
                   itemlist[index-1].setVisible(false);
                   itemlist[index-1].removeFromParent()
                 }
              }),
            cc.moveTo(1,cc.p(cc.winSize.width/2,430))
            ))
        
    }
    node.getThemeByindex = function(index){
        return itemlist[index]
    }

    return node;
},

showfun.addListDishu = function(data){
    var truenum = data.truenum
    var father = data.father
    var themenode = data.ThemeNode
    if(father)
        father.removeAllChildren()
    for(var i = 0; i<=3; i++){
        var dishu
        if(truenum == i)
            dishu = showfun.initDishu({
                right:true,
                Themenode : themenode,
                id:i
            })
        else
            dishu = showfun.initDishu({
                right:null,
                Themenode : themenode,
                id:i
            })

        dishu.x = 350 + 170*i
        if(i%Math.round(Math.random()*3)!=0)
            dishu.y = 150
        else
            dishu.y = 80
        dishu.chosenum = i
        father.addChild(dishu)
    }
}

showfun.initDishu = function(data){
    //var chuizipos = data.chuizipos
    var right = data.right
    var Themenode = data.Themenode
    var id = data.id

    var arandomnum = Math.round(Math.random()*3)
    var reshold = [res.holeone,res.holetwo,res.holethree,res.holefour]
    var hole = new cc.Sprite(reshold[arandomnum]);
    var layout = new ccui.Layout();
    layout.setPosition(10,20)
    hole.addChild(layout)
    layout.setClippingEnabled(true);
    layout.setContentSize(140, 130);
    var dishu = new cc.Sprite(res.img_dishu);
    dishu.setPosition(layout.width/2,layout.height/2-5-90)
    dishu.runAction(cc.moveBy(1,0,60))
    var holdpre = new cc.Sprite(res.holepre);
    holdpre.setPosition(layout.width/2+5,layout.height/2-5)
    layout.addChild(dishu,2)
    hole.addChild(holdpre,3)
    var option = [res.img_a,res.img_b,res.img_c,res.img_d]
    var spriteItem = new cc.Sprite(option[id]);
    spriteItem.x = dishu.width/2+5,spriteItem.y = dishu.height+22
    dishu.addChild(spriteItem)

    createTouchEvent({
        item:dishu,
        rect:cc.rect(-20,-20, dishu.width+30,dishu.height+50),
        begin:function(tmpdata){
            CC_CURRENT_LAYER.probg.stop()
            var chuizi = new cc.Sprite(res.chuizi);
            var baoji = new cc.Sprite(res.baoji);
            baoji.setVisible(false)
            baoji.setPosition(0,1/4*chuizi.height)
            chuizi.addChild(baoji)
            chuizi.setAnchorPoint(1,0)
            chuizi.setPosition(1126,290)
            hole.getParent().getParent().addChild(chuizi);
            hole.getParent().getParent().chuizisp.setVisible(false)

            var touch = showfun.createNoneTouchLayer({
                size:cc.size(cc.winSize.width,1/3*cc.winSize.height)
            })

            var tmpanswer = Themenode.getThemeByindex(indexTheme).getOptionbyindex(tmpdata.item.getParent().getParent().chosenum)
            var pos = tmpdata.item.getParent().convertToWorldSpace(tmpdata.item.getPosition())
            if(right){
                var gou = new cc.Sprite(res.goutrue)
                gou.setScale(0.5)
                gou.setPosition(80,30)
                tmpanswer.addChild(gou)
                chuizi.runAction(cc.sequence(
                    cc.moveTo(0.2,cc.p(pos.x+135,pos.y+60)),
                    cc.callFunc(function(){
                        baoji.setVisible(true)
                        playEffect(res.hit,true)
                        tmpdata.item.setTexture(res.yundishu)
                       // baoji.runAction(cc.blink(1,5))
                        rightNum++;
                        chuizi.runAction(cc.repeatForever(cc.sequence(
                            cc.rotateTo(0.2,-50),
                            cc.rotateTo(0.2,0)
                        )))
                    })
                ))
            }else{
                //chuizi.runAction(cc.moveTo(0.3,cc.p(pos.x+150,pos.y-10)))
                var gou = new cc.Sprite(res.goufalse)
                gou.setScale(0.5)
                gou.setPosition(80,25)
                tmpanswer.addChild(gou)
                playEffect(res.game_fail)
                tmpdata.item.runAction(cc.moveBy(0.3,0,-150))
            }


            chuizi.scheduleOnce(function(){
                this.stopAllActions();
                stopEffect()
                this.removeFromParent(true)
                hole.getParent().getParent().chuizisp.setVisible(true)
                touch.removeListen()

                if(indexTheme<(ThemeInfolist.length-1)){
                    CC_CURRENT_LAYER.probg.myresume()
                    Themenode.showAtheme(++indexTheme)
                    showfun.addListDishu({
                        truenum:ThemeInfolist[indexTheme].answer[0],
                        father:hole.getParent(),
                        ThemeNode : Themenode
                    })
                }else{
                    //如果全答对的显示suc_score，else common_score
                    if(rightNum == ThemeInfolist.length){
                        CC_CURRENT_LAYER.probg.removeFromParent()
                        AddDialog("ShowScore",{
                            showname:"suc_score"
                        })
                    }else{
                        AddDialog("ShowScore",{
                            showname:"common_score",
                            wrong : ThemeInfolist.length-rightNum,
                            right : rightNum,
                            fun: function(){
                                CC_CURRENT_LAYER.probg.removeFromParent()
                                CC_CURRENT_LAYER.changeSelf()
                            }
                        })
                    }

                }
            },2.1)
        }
    })
    return hole
}

showfun.createNoneTouchLayer  = function(data){
    var size = data.size || cc.size(cc.winSize.width,cc.winSize.height)
    var touch = new cc.Layer()
    touch.setContentSize(size)
    createTouchEvent({
        item:touch
    })
    cc.director.getRunningScene().addChild(touch);

    return touch
}

showfun.createTheme = function(data,num){
    var options = data.options
    var title = num+"."+data.text
    var optionslist = []
    var result = new cc.Scale9Sprite(res.bg_tipdialog,
        cc.rect(0, 0, 536, 320), cc.rect(50, 20, 100, 10));
    var titletxt = new cc.LabelTTF(autoCreatRow(title,12),res.myttf,40);
    titletxt.enableStroke(cc.color(77,38,3),3)
    titletxt.setAnchorPoint(0,1)
    titletxt.setPosition(1/10*result.width,6/7*result.height);
    result.addChild(titletxt);

    var items = Math.ceil(options.length/2);
    for(var i = 0;i<options.length;i++){
        var tmp =""
        if(i==0)
            tmp ="A."
        else if(i==1)
            tmp ="B."
        else if(i==2)
            tmp ="C."
        else if(i==3)
            tmp ="D."
        var optiontxt = new cc.LabelTTF(tmp+options[i],res.myttf,34);
        optiontxt.enableStroke(cc.color(77,38,3),3)
        optiontxt.setAnchorPoint(0,1)
        if(i<items){
            optiontxt.setPosition(result.width/(items+1) * (i+1) - 70,1/2*result.height);
        }else{
            optiontxt.setPosition(result.width/(items+1) * (i-items+1) - 70,1/4*result.height);
        }
        optionslist.push(optiontxt);
        result.addChild(optiontxt);

        result.getOptionbyindex = function(index){
            return optionslist[index];
        }
    }
    return result;
}

showfun.showbtnCallback = function(){
    cc.log("ddddddddddddddd")
    showfun.createTip({
        text:"分享成功！",
        father:CC_CURRENT_LAYER
    })
    //var xhr = cc.loader.getXMLHttpRequest()
    //xhr.open("get",showurl,true)
    //xhr.onreadystatechange = function(){
    //    if(xhr.readyState == 4 && xhr.status ==200){
    //        if(!xhr.response)
    //            return
    //           cc.log("分享成功");
    //    }
    //xhr.send()
}

showfun.createTip = function(data){
    var text = data.text
    var movetime = data.movetime || 0.2
    var delaytime = data.delaytime || 0.4
    var scaletime = data.scaletime || 0.2
    var father = data.father

    var tiptxt = new cc.LabelTTF(text,res.myttf,45)
    tiptxt.setFontFillColor(cc.color(45,100,100))
    tiptxt.setPosition(cc.winSize.width/2,cc.winSize.height/2)
    tiptxt.setScale(0)
    tiptxt.runAction(cc.sequence(
        cc.scaleTo(scaletime,1),
        cc.moveTo(movetime,cc.winSize.width/2+30,cc.winSize.height/2+150),
        cc.delayTime(delaytime),
        cc.scaleTo(scaletime,0),
        cc.callFunc(function(){
            tiptxt.removeFromParent()
        })
    ))
    cc.director.getRunningScene().addChild(tiptxt)
}

//var ThemeInfolist = []
var ThemeInfolist = [
    {
        "analyze": "正确答案",
        "answer": [
            3
        ],
        "options": [
            "28",
            "29",
            "30",
            "31"
        ],
        "score": 1,
        "text": "5月份有多少天",
        "type": "single"
    },
    {
        "analyze": "正确答案",
        "answer": [
            1
        ],
        "options": [
            "水",
            "冰",
            "水蒸气",
            "热水"
        ],
        "score": 1,
        "text": "水在零下摄氏度变成了什么",
        "type": "single"
    },
    {
        "analyze": "正确答案",
        "answer": [
            2
        ],
        "options": [
            "水",
            "冰",
            "水蒸气",
            "冷水"
        ],
        "score": 1,
        "text": "水在98度高温下会变成什么",
        "type": "single"
    },
    {
        "analyze": "正确答案",
        "answer": [
            3
        ],
        "options": [
            "液态",
            "气态",
            "固态",
            "热太"
        ],
        "score": 1,
        "text": "水的三态不包含下面哪种",
        "type": "single"
    },
    {
        "analyze": "正确答案",
        "answer": [
            1
        ],
        "options": [
            "西瓜",
            "糖",
            "香蕉",
            "苹果"
        ],
        "score": 1,
        "text": "辨别下面哪个不是水果",
        "type": "single"
    },
    {
        "analyze": "正确答案",
        "answer": [
            1
        ],
        "options": [
            "红色",
            "绿色",
            "黄色",
            "紫色"
        ],
        "score": 1,
        "text": "西瓜皮是什么颜色的",
        "type": "single"
    }
]

showfun.HttpData = function(url){
    var xhr = cc.loader.getXMLHttpRequest()
    xhr.open("get",url,true)
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4 && xhr.status ==200){
            if(!xhr.response)
                return
            var jsonobj = JSON.parse(xhr.responseText)
            if(jsonobj.data.iteml)
            for(var i in jsonobj.data.iteml)
               if(jsonobj.data.iteml[i].items)
                for(var j in jsonobj.data.iteml[i].items){
                    if(jsonobj.data.iteml[i].items[j].t == "e_sel" &&
                        jsonobj.data.iteml[i].items[j].c.type == "single"){
                        ThemeInfolist.push(jsonobj.data.iteml[i].items[j].c)
                        cc.log(ThemeInfolist.length)
                    }
                }
        }else{

        }
    }
    xhr.send()
}
/**
 * Created by Administrator on 2016/6/6.
 */
var LH_TABLE = null
var curIndex = 50
var table = cc.Layer.extend({
    ctor: function () {
        this._super();
        var self = this
        table = ccs.load(res.btytdz_table).node
        this.addChild(table,1000)
        self.dataBag.table = table

        tableBg = table.getChildByName("tableBg")

        var panel = tableBg.getChildByName("Panel_2");
        var panelMove = panel.getChildByName("Panel_1");
        var panel2 = tableBg.getChildByName("Panel_4");
        var panelMove2 = panel2.getChildByName("Panel_3");

        var tag = 0
        var tagFlag = true
        var yesList = []
        var noList = []
        var textList = []
        var resultList = []
        var result2List = []
        var resultArray = [5,2,4,3,5,2,4,3,3,0,2,1,5,2,3,4]
        var curresultArray = [0,0,0,0,0,0,0,0,0,-1,0,0,0,0,0,0]
        for(var i = 1;i < 9;i++) {
            var cellName = "cellbtn" + i
            var cellBtn = tableBg.getChildByName(cellName)
            cellBtn.setTag(10 + i)

            var laName = "labtn" + i
            var laBtn = tableBg.getChildByName(laName)
            laBtn.setTag(10 + i)

            var resultName = "result" + i
            var result = tableBg.getChildByName(resultName)
            resultList.push(result)

            cellBtn.addClickEventListener(function(){
                if(tag == this.getTag() && tagFlag){
                    self.move_Panel_in(panelMove,panel);
                    tagFlag = false;
                    return;
                }
                if(tag > 20)
                    self.move_Panel_in(panelMove2,panel2);
                self.move_Panel_out(panelMove,panel);
                panel.setPosition(cc.p(this.x+15,this.y-13));
                tag = this.getTag();
                tagFlag = true;
            })

            laBtn.addClickEventListener(function(){
                if(tag == this.getTag() && tagFlag){
                    self.move_Panel_in(panelMove,panel);
                    tagFlag = false;
                    return;
                }
                if(tag > 20)
                    self.move_Panel_in(panelMove2,panel2);
                self.move_Panel_out(panelMove,panel);
                panel.setPosition(cc.p(this.x-40,this.y-13));
                tag = this.getTag();
                tagFlag = true;
            })

        }
        for(var i = 9;i < 13;i++) {
            var cellName = "cellbtn" + i
            var cellBtn2 = tableBg.getChildByName(cellName)

            var laName = "labtn" + i
            var laBtn2 = tableBg.getChildByName(laName)

            var resultName = "result" + i
            var result2 = tableBg.getChildByName(resultName)
            result2List.push(result2)

            cellBtn2.setTag(12+i)
            laBtn2.setTag(12+i)

            cellBtn2.addClickEventListener(function(){
                if(tag == this.getTag() && tagFlag){
                    self.move_Panel_in(panelMove2,panel2);
                    tagFlag = false;
                    return;
                }
                if(tag < 20)
                    self.move_Panel_in(panelMove,panel);
                self.move_Panel_out(panelMove2,panel2);
                panel2.setPosition(cc.p(this.x+16,this.y-15));
                tag = this.getTag();
                tagFlag = true;
            })

            laBtn2.addClickEventListener(function(){
                if(tag == this.getTag() && tagFlag){
                    self.move_Panel_in(panelMove2,panel2);
                    tagFlag = false;
                    return;
                }
                if(tag < 20)
                    self.move_Panel_in(panelMove,panel);
                self.move_Panel_out(panelMove2,panel2);
                panel2.setPosition(cc.p(this.x-40,this.y-15));
                tag = this.getTag();
                tagFlag = true;
            })
        }
        for(var i = 1; i < 17;i++){
            var yesName = "yes" + i
            var yes = tableBg.getChildByName(yesName)

            var noName = "no" + i
            var no = tableBg.getChildByName(noName)

            yes.setVisible(false)
            no.setVisible(false)
            yes.setScale(0.6)
            no.setScale(0.6)
            yesList.push(yes)
            noList.push(no)
        }

        for(var i = 1;i< 5;i++){
            var textName = "input" + i
            var text = tableBg.getChildByName(textName)
            textList.push(text)
            addInput({
                item:text,
                strlen:1,
                size:36,
                color:cc.color(210,10,30,255),
            })
        }

        var closeBtn = tableBg.getChildByName("closebtn")
        var clearBtn = tableBg.getChildByName("clearbtn")
        var resultBtn = tableBg.getChildByName("resultbtn")
        var submitBtn = tableBg.getChildByName("submitbtn")

        var selres = 0
        for(var i = 1;i < 6;i++){
            var btnName = "btn"+i
            var btn = panelMove.getChildByName(btnName)
            btn.setTag(30+i)
            btn.addClickEventListener(function(){
                switch (this.getTag()){
                    case 31:
                        selres = res.cellBg
                        break
                    case 32:
                        selres = res.table_sel1
                        break
                    case 33:
                        selres = res.table_sel2
                        break
                    case 34:
                        selres = res.table_sel3
                        break
                    case 35:
                        selres = res.table_sel4
                        break
                }
                resultList[tag-11].setTexture(selres)
                self.move_Panel_in(panelMove,panel);
                curresultArray[tag-11] = this.getTag() - 30
                tagFlag = false;
            })

        }

        for(var i = 1;i < 6;i++){
            var btnName = "btn"+i
            var btn = panelMove2.getChildByName(btnName)
            btn.setTag(40+i)
            btn.addClickEventListener(function(){
                switch (this.getTag()){
                    case 41:
                        selres = res.cellBg
                        break
                    case 42:
                        selres = res.table_sel5
                        break
                    case 43:
                        selres = res.table_sel6
                        break
                    case 44:
                        selres = res.table_sel3
                        break
                    case 45:
                        selres = res.table_sel7
                        break
                }
                result2List[tag-21].setTexture(selres)
                self.move_Panel_in(panelMove2,panel2);
                tagFlag = false;
                curresultArray[tag-9] = this.getTag() - 40
            })

        }

        clearBtn.addClickEventListener(function(){
            self.scalePanel(panelMove,panel,panelMove2,panel2)

            for(var i=0;i<8;i++){
                resultList[i].setTexture(res.cellBg)
            }
            for(var j=0;j<4;j++){
                textList[j].clear()
                result2List[j].setTexture(res.cellBg)
            }
            for(var a=0;a<16;a++){
                curresultArray[a] = 0
                noList[a].setVisible(false)
                yesList[a].setVisible(false)
            }
        })

        closeBtn.addClickEventListener(function(){
           self.scalePanel(panelMove,panel,panelMove2,panel2)
           self.showImg(tableBg,2)
            if(resultImg.getScale() != 0)
                self.showImg(resultImg,2)
            tableFlag = true
        })


        submitBtn.addClickEventListener(function(){
            //if(panel.getScaleY() != 0)
            //    self.move_Panel_in(panelMove,panel)
            //if(panel2.getScaleY() != 0)
            //    self.move_Panel_in(panelMove2,panel2)
            self.scalePanel(panelMove,panel,panelMove2,panel2)

            for(var i=0;i<8;i++){
                if(curresultArray[i] == 0 || curresultArray[i] == 1)   {
                    yesList[i].setVisible(false);
                    noList[i].setVisible(false);
                    continue;
                }
                if(curresultArray[i] == resultArray[i]){
                    yesList[i].setVisible(true)
                    noList[i].setVisible(false)
                }else{
                    noList[i].setVisible(true)
                    yesList[i].setVisible(false)
                }
            }
            for(var i=8;i<12;i++){
                if(textList[i-8].getStr() != ""){
                    if(textList[i-8].getStr() == resultArray[i]){
                        yesList[i+4].setVisible(true)
                        noList[i+4].setVisible(false)
                    }else{
                        noList[i+4].setVisible(true)
                        yesList[i+4].setVisible(false)
                    }
                }

            }
            for(var i=12;i<16;i++){
                if(curresultArray[i] == 0 || curresultArray[i] == 1){
                yesList[i-4].setVisible(false);
                noList[i-4].setVisible(false);
                continue;
                }
                if(curresultArray[i] == resultArray[i]){
                    yesList[i-4].setVisible(true)
                    noList[i-4].setVisible(false)
                }else{
                    noList[i-4].setVisible(true)
                    yesList[i-4].setVisible(false)
                }
            }
        })

        var resultImg = new cc.Sprite(res.resultImg)
        resultImg.setPosition(getMiddle())
        table.addChild(resultImg)
        resultImg.setScale(0)
        var resultCloseBtn = new ccui.Button("res/btn/btn_answerclose_normal.png","res/btn/btn_answerclose_select.png");
        resultImg.addChild(resultCloseBtn)
        resultCloseBtn.setPosition(resultImg.getContentSize().width-30,resultImg.getContentSize().height-30);

        resultBtn.addClickEventListener(function(){
            self.scalePanel(panelMove,panel,panelMove2,panel2)

            if(resultImg.getScale() == 0){
                self.showImg(resultImg,1)
            }else{
                self.showImg(resultImg,2)
            }

            if(panel.getScaleY() != 0)
                self.move_Panel_in(panelMove,panel)
            if(panel2.getScaleY() != 0)
                self.move_Panel_in(panelMove2,panel2)
        })
        resultCloseBtn.addClickEventListener(function(){
            self.showImg(resultImg,2)
            if(panel.getScaleY() != 0)
                self.move_Panel_in(panelMove,panel)
            if(panel2.getScaleY() != 0)
                self.move_Panel_in(panelMove2,panel2)
        })
        self.showImg(tableBg,1)

        self.showIn = function(){
            self.showImg(tableBg,1)
            if(resultImg.getScale() != 0)
                self.showImg(resultImg,2)
        }
        self.showOut = function(){
            self.showImg(tableBg,2)
            if(resultImg.getScale() != 0)
                self.showImg(resultImg,2)
        }

    },

    move_Panel_in:function(panelMove,panel){
        var self = this;
        var call = new cc.CallFunc(function(){
            panelMove.runAction(cc.moveTo(0.2,56,340));
        });
        var call2 = new cc.CallFunc(function(){
            panel.setScaleY(0);
        });
        var del = new cc.DelayTime(0.2);
        var seq = new cc.Sequence(call,del,call2);
        self.runAction(seq);
    },

    move_Panel_out:function(panelMove,panel){
        panel.setScaleY(1);
        panelMove.setPositionY(342);
        panelMove.runAction(cc.moveTo(0.2,56,170));
    },

    scalePanel:function(panelMove,panel,panelMove2,panel2){
        var self = this;
        if(panel.getScaleY() != 0)
            self.move_Panel_in(panelMove,panel)
        if(panel2.getScaleY() != 0)
            self.move_Panel_in(panelMove2,panel2)
    },

    showImg:function(img,flag){
        var self = this;
        if (flag == 1) {
            addShowType({
                item: img,
                    show: "scale",
                    time: 0.2,
                    fun: function (img) {
                        createTouchEvent({
                            item:img,
                            begin:function(data){
                                var item = data.item
                                item.setLocalZOrder(curIndex)
                                curIndex = curIndex + 1
                                return true
                            },
                            move:function(data){
                                var item = data.item
                                var delta = data.delta
                                item.x += delta.x
                                item.y += delta.y
                            }
                        })
                    }
                })
                img.setLocalZOrder(curIndex)
                curIndex = curIndex + 1
                img.setPosition(getMiddle())
            } else {
                addShowType({
                    item: img,
                    show: "zoom",
                    time: 0.2,
                    fun: function (img) {
                        if(img.removeListen){
                            img.removeListen()
                            img.setPositionY(-600)
                        }
                    }
                })
            }
    },

    dataBag:{},
})

var getMyTable = function(){
    if(!LH_TABLE){
        LH_TABLE = new table()
        LH_TABLE.retain()
    }
    return LH_TABLE
}
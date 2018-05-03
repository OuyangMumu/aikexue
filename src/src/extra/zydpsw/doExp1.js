/**
 * Created by Administrator on 2016/7/5.
 */
var doExp1 = myLayer.extend({
    sprite: null,
    changeDelete: true,
    layerName: "doExp1",
    preLayer: "doLayer",
    ctor : function () {
        this._super();
        var self = this
        this.expCtor({
            vis: false,
            setZ:99,
            settingData: {
                pos: cc.p(1080, 580),
                ifCount: true,
                biaogeFun:function(){
                    if(!self.biaoge){
                        var bg = createBiaoge({
                            json: res.zydpsw_table_json,
                            inputNum:4,
                            scale:0.85,
                        })
                        self.biaoge = bg
                        safeAdd(self, bg)
                    }
                    self.biaoge.show()
                },
            }
        })
        this.initPeople()
        this.initUI()
        this.nodebs.show(function() {
            self.nodebs.say({
                key: "doTip",
            })
        })
        return true
    },

    dataBag : {},

    initUI : function(){
        loadPlist("tools")
        loadPlist("food")
        loadPlist("foodWenzi")
        var self = this
        var dataBag = self.dataBag
        var dishList = ["dish1", "dish2", "dish3", "dish4"]
        var uiList = ["dish1", "dish2", "dish3", "dish4" , "consultBtn"]
        var node = loadNode(res.zydpsw_do1_json,uiList)
        self.inside_node.addChild(node)
        var tmpString = 0
        var tmpGram = 0
        var toolList = []
        var curFoodList = []
        var curWenziList = []
        var gramList = []     //四列中的选择多少克
        var foodImgList = []  //底部显示食物的图片和文字
        var textList = []     // 给底部设置值
        var heatNumList = [60,120,55,150,55,70,10,80,10,70,80,90,20,50,20,70]  //热量值
        var foodData = [
            {
                dish:[],
                judge:[],
                judgeCurDish:[false,false,false,false],
            },
            {
                dish:[],
                judge:[],
                judgeCurDish:[false,false,false,false],
            },
            {
                dish:[],
                judge:[],
                judgeCurDish:[false,false,false,false],
            }
        ]
        var getUiValue = function(){
            for(var i = 1 ; i < 17 ; i++){
                var toolsSp = sprintf("#tool%02d.png", i)
                toolList.push(toolsSp)
                var curSp = sprintf("#food%02d.png",i)
                curFoodList.push(curSp)
                var curWenzi = sprintf("#foodWenzi%02d.png",i)
                curWenziList.push(curWenzi)
            }
            for(var i = 1 ; i < 13 ; i++ ){
                var name = "gram" + i
                var gram = node.getChildByName(name)
                gram.getChildren()[0].setVisible(false)
                gramList.push(gram)
            }
            for(var i = 1 ; i < 5 ; i++){
                var name = "foodImg" + i
                var foodImg = node.getChildByName(name)
                foodImg.setVisible(false)
                foodImgList.push(foodImg)
                var text = new cc.LabelBMFont("",res.font_fnt)
                text.setPosition(310+170*(i-1) , 30)
                self.addChild(text)
                textList.push(text)
            }
        }
        getUiValue()
        //var judge = []   //用于判断四个盘子存着的食物
        var showList = [null,null,null]
        dataBag.showList = []
        dataBag.curNum = 0
        var curLocal = 30   //设置显示优先级
        for(var i = 0 ; i < 3 ; i++){
            dataBag.showList[i] = createList({
                list: toolList,
                num: 5,
                scale: 1.1,
                pos: cc.p(610,550),
                size: cc.size(557, 136),
                type: "H",
                arrow:"yellow",
                noBg: true,
                offset:cc.p(0,-5),
                getFun: function(data) {
                    if(!dataBag.showList[dataBag.curNum].index)  return false
                    if(dataBag.curNum != dataBag.showList[dataBag.curNum].index - 1)
                        return false
                    var index = data.index
                    var pos = data.pos
                    var item = new cc.Sprite(curFoodList[index])
                    item.setPosition(node.convertToNodeSpace(pos))
                    self.addChild(item)
                    item.num = index
                    item.setLocalZOrder(curLocal)
                    curLocal++
                    item.back = function(){
                        var item = this
                        if(dataBag.showList[dataBag.curNum]){
                            item.removeFromParent(true)
                            dataBag.showList[dataBag.curNum].judgeIndex(item.num, false)
                        }
                        item.index = null
                    }
                    return item
                },
                outFun: function(data) {
                    if(!dataBag.showList[dataBag.curNum].index)  return false
                    if(dataBag.curNum != dataBag.showList[dataBag.curNum].index-1)
                        return false
                    var item = data.item
                    var pos = data.pos
                    var index = data.index
                    item.setPosition(pos)
                    safeAdd(self, item)
                    checkFood(item,index)
                    createTouchEvent({
                        item:item,
                        autoMove:true,
                        begin:function(data){
                            var item = data.item
                            item.setLocalZOrder(curLocal)
                            curLocal++
                            if(item.index != null){
                                setNull(item.index)
                                foodData[dataBag.curNum].judge[item.index] = null
                            }
                            item.index = null
                            return true
                        },
                        end:function(data){
                            var item = data.item
                            checkFood(item,index)
                        }
                    })
                }
            })
            dataBag.showList[i].index = i + 1
            showList[i] = dataBag.showList[i]
            self.addChild(dataBag.showList[i])
        }
        dataBag.showList[1].setPositionY(-550)
        dataBag.showList[2].setPositionY(-550)
        var checkFood = function(item){
            var judgeLocal = function(){
                if(i == 2 && foodData[dataBag.curNum].judge[0]){
                    item.setLocalZOrder(foodData[dataBag.curNum].judge[0].getLocalZOrder()-1)
                }else if(i == 3 && foodData[dataBag.curNum].judge[1]){
                    item.setLocalZOrder(foodData[dataBag.curNum].judge[1].getLocalZOrder()-1)
                }
            }// 判断第2和3的显示优先级问题
            var rectIntersectsRect = function(ra,rb){
                var maxax = (ra.x) + ra.width/2 - 10// - ra.width/2
                var maxay = (ra.y) + ra.height/2 - 10// - ra.height/2
                var maxbx = (rb.x ) + rb.width/2 - 10
                var maxby = (rb.y ) + rb.height/2 - 10
                var bx = rb.x - 10
                var ax = ra.x - 10
                var ay = ra.y - 10
                var by = rb.y - 10
                return !(maxax < bx || maxbx < ax || maxay < by || maxby < ay);
            }
            var judgeBack = false
            for(var i = 0 ; i < dishList.length ; i++){
                if(rectIntersectsRect(item,node[dishList[i]])){
                    judgeBack = true
                    var dish = node[dishList[i]]
                    item.setPosition(dish.x,dish.y+30)
                    judgeLocal()
                    if(foodData[dataBag.curNum].judge[i]){
                        foodData[dataBag.curNum].judge[i].back()
                    }
                    foodData[dataBag.curNum].judge[i] = item
                    item.index = i
                    foodData[dataBag.curNum].dish[i] = item
                    foodData[dataBag.curNum].judgeCurDish[i] = true
                    foodData[dataBag.curNum].dish[i].noGram = false
                    setSelect(item)
                    break
                }
            }
            if(!judgeBack && showList[dataBag.curNum]){
                if(item.index){
                    foodData[dataBag.curNum].judge[item.index] = null
                }
                item.back()
            }
        }
        //给选中的食物设置热量值
        var setSelect = function(item){
            var index = item.index
            var foodImg = sprintf("food%02d.png",item.num+1)
            var wenziImg = sprintf("foodWenzi%02d.png",item.num+1)

            foodImgList[index].setVisible(true)
            foodImgList[index].setSpriteFrame(foodImg)

            var foodWenzi = foodImgList[index].getChildren()[0]
            foodWenzi.setSpriteFrame(wenziImg)
            textList[index].setString(heatNumList[item.num])

            var num = index * 3
            for(var i = num ; i < num + 3 ; i++) {
                gramList[i].getChildren()[0].setVisible(false)
            }
            gramList[num].getChildren()[0].setVisible(true)
            tmpGram = gramList[num].getChildren()[0]
            tmpString = heatNumList[item.num]
            if(!foodData[dataBag.curNum].dish[index].noGram){
                foodData[dataBag.curNum].dish[index].curString = tmpString
                foodData[dataBag.curNum].dish[index].curGram = tmpGram
            }
            setDiffenerHaet(item.num)
        }

        var setDiffenerHaet = function(count){
            var num = 0
            var curNum = 0
            for(var i = 0 ; i < gramList.length ; i++){
                var gram = gramList[i]
                gram.index = i
                createTouchEvent({
                    item:gram,
                    begin : function(data){
                        var item = data.item
                        var index = item.index
                        if(index <= 2)   num = 0
                        else if(index > 2 && index <= 5)    num = 1
                        else if(index > 5 && index <= 8)    num = 2
                        else if(index > 9 && index <= 11)    num = 3
                        if(!foodData[dataBag.curNum].judgeCurDish[num])   return
                        if(!foodData[dataBag.curNum].dish[num])   return
                        curNum = num * 3
                        for(var i = curNum ; i < curNum + 3 ; i++) {
                            gramList[i].getChildren()[0].setVisible(false)
                        }
                        item.getChildren()[0].setVisible(true)
                        if(foodData[dataBag.curNum].dish[num])
                            count = foodData[dataBag.curNum].dish[num].num
                        var heat = 0
                        if(index == curNum)  heat = heatNumList[count]
                        else if(index == (curNum+1))     heat = (heatNumList[count] * 2)
                        else if(index == (curNum+2))     heat = (heatNumList[count] * 3)
                        textList[num].setString(heat)
                        foodData[dataBag.curNum].dish[num].curGram = item.getChildren()[0]
                        foodData[dataBag.curNum].dish[num].curString = heat
                        foodData[dataBag.curNum].dish[num].noGram = true
                        return true
                    },
                    move : function(){
                        return false
                    }
                })
            }
        }
        //拖走之后给值设置设置为空
        var setNull = function(index){
            //judgeCurDish[index] = false
            foodData[dataBag.curNum].judgeCurDish[index] = false
            foodImgList[index].setVisible(false)
            textList[index].setString("")
            if(foodData[dataBag.curNum].dish[index]){
                foodData[dataBag.curNum].dish[index].noGram = true
                foodData[dataBag.curNum].dish[index] = null
            }
            var num = index * 3
            for(var i = num ; i < num + 3 ; i++){
                gramList[i].getChildren()[0].setVisible(false)
            }
        }

        var zaoBtn = new ccui.Button(res.btn_zaocan_select,res.btn_zaocan_normal)
        var wuBtn = new ccui.Button(res.btn_wucan_normal,res.btn_wucan_select)
        var wanBtn = new ccui.Button(res.btn_wancan_normal,res.btn_wancan_select)
        zaoBtn.setPosition(120,450)
        wuBtn.setPosition(120,370)
        wanBtn.setPosition(120,280)
        self.addChild(zaoBtn)
        self.addChild(wuBtn)
        self.addChild(wanBtn)
        zaoBtn.addClickEventListener(function(){
            setBtn(0)
        })
        wuBtn.addClickEventListener(function(){
            setBtn(1)
        })
        wanBtn.addClickEventListener(function(){
            setBtn(2)
        })

        var setBtn = function(index){
            dataBag.curNum = index
            switch (index){
                case 0:
                    zaoBtn.loadTextures(res.btn_zaocan_select,res.btn_zaocan_normal)
                    wuBtn.loadTextures(res.btn_wucan_normal,res.btn_wucan_select)
                    wanBtn.loadTextures(res.btn_wancan_normal,res.btn_wancan_select)
                    break
                case 1:
                    zaoBtn.loadTextures(res.btn_zaocan_normal,res.btn_zaocan_select)
                    wuBtn.loadTextures(res.btn_wucan_select,res.btn_wucan_normal)
                    wanBtn.loadTextures(res.btn_wancan_normal,res.btn_wancan_select)
                    break
                case 2:
                    zaoBtn.loadTextures(res.btn_zaocan_normal,res.btn_zaocan_select)
                    wuBtn.loadTextures(res.btn_wucan_normal,res.btn_wucan_select)
                    wanBtn.loadTextures(res.btn_wancan_select,res.btn_wancan_normal)
                    break
            }
            var setBack = function(){
                for(var i = 0 ; i < 3 ; i++){
                    if(i != index){
                        dataBag.showList[i].setPositionY(-550)//150+i*100
                        for(var j = 0 ; j < 4 ; j++){
                            if(foodData[i].dish[j]){
                                foodData[i].dish[j].setPositionY(-550)//100+j*10
                            }
                        }
                    }else{
                        dataBag.showList[i].setPositionY(550)
                        for(var j = 0 ; j < 4 ; j++){
                            if(foodData[i].dish[j]){
                                foodData[i].dish[j].setPositionY(node[dishList[j]].y + 30)
                                setSelect(foodData[i].dish[j])
                                var curGram = foodData[i].dish[j].curGram
                                var curString = foodData[i].dish[j].curString
                                if(curString)
                                    textList[j].setString(curString)
                                var num = j * 3
                                for(var a = num ; a < num + 3 ; a++) {
                                    gramList[a].getChildren()[0].setVisible(false)
                                }
                                if(curGram){
                                    curGram.setVisible(true)
                                }
                            }else{
                                foodData[dataBag.curNum].judgeCurDish[j] = false
                                foodImgList[j].setVisible(false)
                                textList[j].setString("")
                                var num = j * 3
                                for(var a = num ; a < num + 3 ; a++){
                                    gramList[a].getChildren()[0].setVisible(false)
                                }
                            }
                        }
                    }

                }
            }
            setBack()
        }
        node.consultBtn.addClickEventListener(function(){
            self.nodebs.say({key:"Result"})
        })
    },
    initPeople: function() {
        this.nodebs = addPeople({
            id: "student",
            pos: cc.p(1000, 130)
        })
        this.addChild(this.nodebs,99)
        addContent({
            people: this.nodebs,
            key: "Result",
            img: res.consultImg,
            id: "result",
            scale:0.7,
        })
        addContent({
            people: this.nodebs,
            key: "doTip",
            img: res.doTip1,
            sound: res.do_tipSound,
        })
    },
})
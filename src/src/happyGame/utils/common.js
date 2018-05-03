//2017/8/7
//创建精灵方法
var createSp = function(data) {
	var img = data.img
	var pos = data.pos 
	var father = data.father
	var sp = new cc.Sprite(img)
	sp.setPosition(pos)
	father.addChild(sp)
	return sp
}

//创建label方法
var createLabel = function(data){
	var data = data || {}
	var text = data.text
	if(text==null) text = ""
	var fontSize = data.fontSize || 30
	var color = data.color || cc.color(255,255,255)
	var father = data.father
	var pos = data.pos
	var fontName = data.fontName || "ziti"
	var Anchors = data.Anchors || cc.p(0,0)
	var textAlign = data.textAlign || cc.TEXT_ALIGNMENT_LEFT//cc.TEXT_ALIGNMENT_LEFT|cc.TEXT_ALIGNMENT_CENTER|cc.TEXT_ALIGNMENT_RIGHT

	var fontDef = new cc.FontDefinition()
	fontDef.fontName = fontName    //第三方字库
	fontDef.fontSize = fontSize
	fontDef.textAlign = textAlign
	var label = new cc.LabelTTF(text+"",fontDef)
	var label = new cc.LabelTTF(text,fontDef)
    father.addChild(label)
    label.setPosition(pos)
    label.setColor(color)
    label.setAnchorPoint(Anchors)

    return label
}

//按下图片，以及触发事件控制
var scaleButtonFun = function(data){
	var myBtn = data.item
	var fun = data.fun
	var scale = data.scale || 0.9
	var curScale = myBtn.getScale()
	createTouchEvent({
        item:myBtn,
        begin:function(data){
        	var item = data.item
            item.setScale(scale)
            return true
        },
        end:function(data){
        	var item = data.item
            item.setScale(curScale)
            if(fun){
            	fun()
            }
        }
    })
}

//修改父节点捆绑 和safeAdd类似。唯一的不同在于changefather保留了世界相对位置。
var changeFather = function(data) { 
	//如果传入needscale则同时可以保留世界相对缩放值。
	var item = data.item
	var father = data.father
	var needScale = data.needScale || false
	try {
		if (item && father && father.addChild && item.getPosition && item.getPosition()) {
			var pos = getWorldPos(item)
			pos = father.convertToNodeSpace(pos)
			item.setPosition(pos)
			if (needScale) {
				var scale = getLoopScale(item, true)
				item.setScaleX(scale.x)
				item.setScaleY(scale.y)
			}
			safeAdd(father, item)
		}
	} catch (e) {
		cc.log(e.message)
		cc.log(e.name)
		return false
	}
	return true
}

//创建金币标签显示,选择层和答题层共用此处
var createCoinFun = function(father,pos){
	var pos = pos || cc.p(700,600)
	var coin = createSp({
		img:res.coin_bg,
		pos:pos,
		father:father
	})
    coin.coinIcon = createSp({
    	img:res.coin_img,
    	pos:cc.p(20,20),
    	father:coin
    })
    coin.coinNum = createLabel({
    	text:Person.coinNum,
    	pos:cc.p(60,0),
    	father:coin,
    	color:cc.color(250,250,0),
    })
    // coin.coinNum = new cc.LabelTTF(Person.coinNum,"",28)//金币数量，需要实时变化
    // coin.coinNum.setPosition(85,17)
    // //coin.coinNum.setAnchorPoint(0,0.5)
    // coin.addChild(coin.coinNum)
    coin.coinIcon.setScale(0.6)
    //coin.coinNum.setColor(cc.color(200,200,0))
    coin.addCoin = function(num){
    	Person.coinNum += num
    	this.coinNum.setString(Person.coinNum)
    	baseData.tempCoin += num //临时增加金币，用于意外退出
    }
    coin.freshCoin = function(){
    	var coinTxt = this.coinNum
    	var num = 0
    	if(Person.coinNum<=9999){
    		num = Person.coinNum
    	}else{
    		var s = Person.coinNum.toString()
    		var num = s[0]+s[1]+s[2]+s[3]+"..."
    	}
    	 
    	coinTxt.setString(num)
    }
    coin.freshCoin()
    return coin      
}
//设置item循环变换大小
var repForActionFun = function(data){
    var item = data.item
    var curScale = item.getScale() 
    var toScale = data.toScale || curScale + 0.2
    var delTime = data.delTime || 0.2
    var duration = data.duration || 1

    item.runAction(cc.repeatForever(cc.sequence(
        cc.scaleTo(duration,toScale),
        cc.delayTime(delTime),
        cc.scaleTo(duration,curScale),
        cc.delayTime(delTime)
    )))
}

//设置帧动画播放操作
var aniPlay = function(data){
	var frame = data.frame
	var start = data.start || 1
	var end = data.end 
	var time = data.time || 0.1
	var rever = data.rever || false
	var repeat = data.repeat || false
	var fun = data.fun  //最后一帧调用
	if(!repeat){//动画只播放一次
		return cc.sequence(createAnimation({
	        frame: frame,
	        start: start,
	        end: end,
	        time: time,
	        rever: rever,
	        fun:function(){
	        	if(fun)
	        		fun()
	        }
	    }))
	}else{//动画一直循环播放
		return cc.repeatForever(cc.sequence(createAnimation({
	        frame: frame,
	        start: start,
	        end: end,
	        time: time,
	        rever: rever,
	    })))
	}
}

var playMyMusic = function(file, loop) {
      var audio = cc.audioEngine
      audio.isPaused = false
      loop = loop || false
      if (file) {
            audio.stopMusic()
            audio.playMusic(file, loop)
      }
}

var HTTP = {}
HTTP.HttpRequest = null
HTTP.getRequest = function(){
    HTTP.HttpRequest = cc.loader.getXMLHttpRequest()
	return HTTP.HttpRequest
}

//GET请求数据,json格式返回
HTTP.sendData = function(data){
	var data = data || {}
	var url = data.url
	var successBack = data.successBack
	var failBack = data.failBack
	var errorBack = data.errorBack
	var request = HTTP.getRequest()
	request.open("GET",url,true)
	request.send()
	request.onerror = function(data){
        request.abort()
        HTTP.HttpRequest = null
    	if(errorBack)errorBack(data)
    }
	request.onreadystatechange = function(data){
		if(request.status==200){
			switch(request.readyState)
			{
	 			case 0:
	 			break
	 			case 1:
	 			break
	 			case 2:
	 			break
	 			case 3:
	 			break
	 			case 4:
	 			    if(!request.response) return
	 			    if(successBack){
	 			    	//处理成功返回json对象
	 			    	successBack({
	 			    		request:request,
	 			    		jsonData:JSON.parse(request.responseText)
	 			    	})
	 			    }
	 			    request.abort()
	 			    HTTP.HttpRequest = null
	 			break
	 			default:
	 				if(failBack)failBack(request)
			}
		}else{
			if(failBack)failBack(request)
			request.abort()
            HTTP.HttpRequest = null
		}
	}
}
HTTP.postData = function(data){
	var data = data || {}
	var context = data.context
	var url = data.url
	var successBack = data.successBack
	var failBack = data.failBack
	var errorBack = data.errorBack
 	var request = HTTP.getRequest()
 	request.open("POST",url,true);
 	request.setRequestHeader("Content-Type","text/plain;charset=UTF-8")
 	request.onerror = function(data){
        request.abort()
        HTTP.HttpRequest = null
    	if(errorBack)errorBack(data)
    }
 	request.onreadystatechange = function(){
 		if (request.readyState == 4 && (request.status >= 200 && request.status <= 207)) {
 		    if(!request.response) return 
            successBack({
	    		request:request,
	    		jsonData:JSON.parse(request.responseText)
	    	})
	    	request.abort()
	 		HTTP.HttpRequest = null
        }
 	}
 	var jsonStr = {
 		name:context.name,
 		level:context.level,
 		censorship:context.censorship,
 		coinNum:context.coinNum
 	}
 	request.send(JSON.stringify(jsonStr));
}
HTTP.saveData = function(){
	//计算玩家等级，四个科目解锁关卡数的平均值
	var newPerson = {
		name: "游客",
		level: 1,
		censorship: [],
		coinNum: 100
	}
	newPerson.name=Person.name
	newPerson.level=Person.level
	newPerson.coinNum=Person.coinNum
	newPerson.censorship=new Array(Person.censorship.length)

	for(var i=0;i<Person.censorship.length;i++){
		newPerson.censorship[i]=(Person.censorship[i])
	}

	


	newPerson.coinNum=Person.coinNum-OldPerson.coinNum
	OldPerson.coinNum=Person.coinNum

	newPerson.level = Math.floor((newPerson.censorship[0] + newPerson.censorship[1] + newPerson.censorship[2] + newPerson.censorship[3]) / 4)
	cc.log(newPerson.level)
	HTTP.postData({
		url:saveUserInfo_url+TOKEN,
		context:newPerson,
		successBack:function(data){
           cc.log(data.jsonData)
		}
	})
}
HTTP.showError = function(data){
	var data = data || {}
	var disup = data.disup || 80
	var node = new cc.Node()
	data.father = node
	data.pos = cc.p(0,0)
	var errorLab = createLabel(data)
	node.errorLab = errorLab
	node.show = function(){
		var Lab = this.errorLab
		Lab.stopAllActions()
		Lab.setPosition(0,0)
		Lab.setOpacity(255)
		Lab.runAction(cc.sequence(
			cc.moveBy(0.4,cc.p(0,disup)),
			cc.fadeOut(1.8),
			cc.callFunc(function(){

			})
		))
	}
    return node
}
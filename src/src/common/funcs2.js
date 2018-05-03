/*
  @需要资源hlyhlz/do/famas.plist、png
  @创建砝码箱和砝码
*/
var createFamaBox = function(data){
    var pos = data.pos || cc.p(cc.winSize.width/2,cc.winSize.height/2)
    var famaFater = data.famaFater
    var sprites = data.sprites || []
    var famaWeight = data.weight || 100
    var guaFamaposList = data.guaFamaposList || []
    var maxFn = data.maxFn || null
    var famaSize = data.famaSize || 0.8
    var showTest = data.showTest || false
    var addWidgetFun = data.addWidgetFun
    var removeWidgetFun = data.removeWidgetFun
    var overFnBack = data.overFnBack
    var famaNode = new cc.Node()
    famaNode.setPosition(pos)
    if(famaFater)
        famaFater.addChild(famaNode)
    if(!famaNode.loadres){
        loadPlist("famas")
        famaNode.loadres = true
    }
    for (var i = 0; i < sprites.length; i++)
    {
        var sp = new cc.Sprite(sprites[i].getTexture())
        sp.setPosition(sprites[i].width/2,sprites[i].height/2)
        sprites[i].addChild(sp)
        sp.setOpacity(0)
        sprites[i].gou = sp
        sprites[i].sp = sp
        sprites[i].PP = sprites[i]
        sprites[i].famaCount = 0
        if(!guaFamaposList[i])
        	guaFamaposList[i] = cc.p(0,0)
        sprites[i].guaFamapos = guaFamaposList[i]
        if(maxFn){
        	if(maxFn[i])
        		sprites[i].maxFn = maxFn[i]
        }else{
        	sprites[i].maxFn = 20
        }
        //增加砝码
        sprites[i].addFama = function(fama){
            var father = this
            fama.cCount = 1
            fama.getAllChild(fama,fama)
            var weight = (father.famaCount + fama.cCount)*famaWeight/100
            if(weight>father.maxFn)
            {
            	if(overFnBack)overFnBack()
            	return 
            }else{
            	safeAdd(father.PP,fama)
	            fama.setScale(fama.initScale/getLoopScale(fama))
	            fama.setLocalZOrder(5)
	            if(father.PP==father){
	                fama.setPosition(father.guaFamapos)
	            }else{
	                fama.setPosition(father.PP.width/2,-father.PP.height/2+6.5)
	            }
	            father.PP = fama
	            father.gou = father.PP.gou
	            fama.grandFather = father
	            //回调函数，增加砝码后，参数：总质量
	            father.allFamaCount(father)
	            if(addWidgetFun)addWidgetFun({obj:father,weight:father.famaCount*famaWeight})
            }
        }
        //遍历获取所有砝码数量
        sprites[i].allFamaCount = function(node){
            var father = this
            if(node==father){
              father.famaCount = 0 
            }
            for(var i in node.getChildren()){
                var curFama = node.getChildren()[i]
                if(curFama.famaName){
                    father.famaCount++
                    father.allFamaCount(curFama)
                }
            }
        }
        //移除砝码
        sprites[i].removeFama = function(fama){
            var father = this
            father.PP = fama.getParent()
            if(father.PP==father){
                father.gou = father.sp
            }else{
                father.gou = father.PP.gou
            }
            var pos = fama.preFather.convertToNodeSpace(getWorldPos(fama))
            safeAdd(fama.preFather,fama)
            fama.setPosition(pos)
            fama.setScale(fama.initScale)
            fama.setLocalZOrder(200)
            fama.grandFather = fama.preFather
            //回调函数，移除某个砝码后，参数：总质量
            father.allFamaCount(father)
            if(removeWidgetFun)removeWidgetFun({obj:father,weight:father.famaCount*famaWeight})
        }
    }
    var famaBox = new cc.Sprite("#famaBox.png")
    famaNode.addChild(famaBox)

    var famaList = []
    for(var i=0; i<8; i++)
    {
        var fama = new cc.Sprite()
        var dis = i<=3 ? 62:98
        fama.initPos = cc.p(dis + i%4 * 47,110 - Math.floor(i/4)*33)
        fama.weight = famaWeight
        fama.initScale = famaSize
        famaBox.addChild(fama)
        famaList[i] = fama
        fama.preFather = famaBox
        var showgou = new cc.Sprite("#fama_showgou.png")
        showgou.setPosition(23.15,4.9)
        fama.addChild(showgou,100)
        fama.showgou = showgou

        var upgou = new cc.Sprite("#fama_gou.png")
        upgou.setPosition(28,60)
        upgou.setScaleY(1.2)
        upgou.setVisible(false)
        fama.addChild(upgou)
        fama.upgou = upgou

        var gou = new cc.Sprite("#fama_gou.png")
        gou.setPosition(28,5)
        gou.setVisible(false)
        gou.setScaleY(1.2)
        fama.addChild(gou)
        fama.gou = gou
        fama.famaName = "fama"
        fama.resetInit = function(){
            var fama = this
            if(fama.grandFather!=fama.preFather){
                safeAdd(fama.preFather,fama)
                fama.grandFather = fama.preFather
            }
            fama.setSpriteFrame("fama_nor.png")
            fama.setPosition(fama.initPos)
            fama.setScale(-fama.initScale,fama.initScale)
            fama.setLocalZOrder(2)
            fama.setRotation(-10)
            fama.showgou.setVisible(false)
            fama.change = false
            for(var i in fama.getChildren()){
                var curFama = fama.getChildren()[i]
                if(curFama.famaName){
                    if(curFama.resetInit)
                        curFama.resetInit()
                }
            }
        }
        fama.selectFun = function(pos){
            var fama = this
            safeAdd(fama.preFather,fama)
            fama.setScale(fama.initScale,fama.initScale)
            fama.setLocalZOrder(200)
            fama.setRotation(0)
            fama.setSpriteFrame("fama_sel.png")
            var pos = fama.getParent().convertToNodeSpace(pos)
            fama.setPosition(pos)
            fama.showgou.setVisible(true)  
        }
        fama.getAllChild = function(node,tonode){
            for(var i in tonode.getChildren()){
                var curFama = tonode.getChildren()[i]
                if(curFama.famaName){
                    node.cCount++
                    node.getAllChild(node,curFama)
                }
            }
        }
        fama.resetInit()

        createTouchEvent({
          item:fama,
          begin:function(data){
            var item = data.item
            var pos = data.pos
            if(item.change){
                if(item.grandFather.removeFama)
                  item.grandFather.removeFama(item)
                item.change = false
            }else{
                item.selectFun(pos)
            }
            return true
          },
          autoMove:true,
          end:function(data){
            var item = data.item
            var litem =null
            for (var i = 0; i < sprites.length; i++) {
                litem = sprites[i]
                if(judgeItemCrash({item1:litem.gou,item2:item.upgou,showTest:showTest})){
                  litem.addFama(item)
                  item.change = true
                  break
                }
            }
            if(!item.change){
                item.resetInit()
            }
          }
        })
    }
    famaNode.setAllFamaListen = function(judge){
        for(var i=0; i< famaList.length; i++){
            famaList[i].disListen(judge)
        }
    }
    return famaNode
}

/*
  创建电流流动的动画
  @pos:发射电流位置
  @img:电流图片
  @num：图片数量
  @buf：各个转折点的描述 数组{坐标，时间，角度，偏移}
*/
var createElectricityDirection = function(data){
    var pos = data.pos
    var img = data.img
    var num = data.num
    var buf = data.buf
    var scale = data.scale || 1
    var fireTime = data.fireTime || 0.2
    var node = new cc.Node()
    node.setPosition(pos)
    var redDirs = []
    for (var i = 0; i < num; i++) {
        redDirs[i] = new cc.Sprite(img)
        redDirs[i].setAnchorPoint(0,0.5)
        redDirs[i].setVisible(false)
        redDirs[i].setScale(scale)
        node.addChild(redDirs[i])
    }

    node.playOne =function(index){
        var moveToList =[]
        for (var j = 0; j < buf.length; j++) {
           var pos = node.convertToNodeSpace(buf[j].pos)
           var prepos = cc.p(pos.x + buf[j].prepos.x,pos.y + buf[j].prepos.y)
           moveToList[j] = cc.sequence(
            cc.moveTo(buf[j].time,prepos),
            cc.spawn(cc.moveTo(0.05,pos),cc.rotateTo(0.05,buf[j].roto))
            )
        }
        redDirs[index].setVisible(true)
        redDirs[index].runAction(cc.repeatForever(cc.sequence(moveToList)))
    }
    node.playAll = function(time){
        var count = 0
        var time = time || 0.2
        node.runAction(cc.sequence(
        	cc.delayTime(time),
        	cc.callFunc(function(){
                node.runAction(cc.repeatForever(cc.sequence(
                	cc.callFunc(function(){
		                node.playOne(count)
		                count++
		                if(count>=num){
		                    node.stopAllActions()
		                    count=0
		                }
		            }),
		            cc.delayTime(fireTime)
		        )))
        	})
        ))
    }
    node.stopAll = function(){
        node.stopAllActions()
        for (var i = 0; i < redDirs.length; i++) {
            redDirs[i].stopAllActions()
            redDirs[i].setVisible(false)
            redDirs[i].setRotation(0)
            redDirs[i].setPosition(0,0)
        }
    }

    return node
}

//author @mu 16.8.25
drawCircleCurve = function(data) {//绘制圆弧
	//var startPos = data.startPos || cc.p(0, 0)
	var tris = data.tris //[0, 30]
	if (tris[1] <= tris[0]) {
		cc.log("wrong tris")
		return null
	}
	var direction = data.direction
	var color = data.color || cc.color(255, 255, 255, 255) //default white
	var width = data.width || 1
	if (direction == null) {
		direction = true //增量
	}
	var radiu = data.radiu || 20
	var max = null
	var min = null
	if (direction != (tris[1] > tris[0])) {
		tris[1] -= 360
		max = tris[0]
		min = tris[1]
	} else {
		max = tris[1]
		min = tris[0]
	}
	var segs = data.segs || (Math.abs(tris[1] - tris[0]))
	var devide = (max - min) / segs
	var posList = []
	for (var i = min; i < max; i += devide) {
		var ti = i / 180 * Math.PI
		var pos = cc.p(Math.cos(ti) * radiu, Math.sin(ti) * radiu)
		posList[posList.length] = pos
	}

	var ti = max / 180 * Math.PI
	var pos = cc.p(Math.cos(ti) * radiu, Math.sin(ti) * radiu)
	posList[posList.length] = pos
	
	var draw = new cc.DrawNode()
	for (var i = 0; i < posList.length - 2; i++) {
		draw.drawSegment(posList[i], posList[i + 1], width, color)
	}
	return draw
}

judgeCrashLine = function(data) {//创建新型碰撞
	var rect = data.rect
	var pos4_1 = data.pos4_1
	var pos4_2 = data.pos4_2
	var judge = data.judge
	var result = 0
	var muJudgeInside = function(p1, p2, p3) {
		if (p1 < p2 && p2 < p3) {
			return 1
		}
		return 0
	}
	switch (judge) {
		case "x":
			var left1 = pos4_1.left
			var right1 = pos4_1.right
			var left2 = pos4_2.left
			var right2 = pos4_2.right
			var rectLeft = rect.left
			var rectRight = rect.right
			result += muJudgeInside(left1, rectLeft, right1)
			result += muJudgeInside(left1, rectRight, right1)
			result += muJudgeInside(left2, rectLeft, right2)
			result += muJudgeInside(left2, rectRight, right2)
			break
		case "y":
			var bottom1 = pos4_1.bottom
			var top1 = pos4_1.top
			var bottom2 = pos4_2.bottom
			var top2 = pos4_2.top
			var rectBottom = rect.bottom
			var rectTop = rect.top
			result += muJudgeInside(bottom1, rectBottom, top1)
			result += muJudgeInside(bottom1, rectTop, top1)
			result += muJudgeInside(bottom2, rectBottom, top2)
			result += muJudgeInside(bottom2, rectTop, top2)
			break
	}
	return (result > 0)
}

judgeTry = function(data) {
	var posInfo = ["top", "left", "bottom", "right"]
	var judgeInfo = ["bottom", "right", "top", "left"]
	var entry = data.entry
	var rect = data.rect
	var pos4_1 = data.pos4_1
	var pos4_2 = data.pos4_2
	var judgeDelta = data.judgeDelta
	var type = data.type
	var delta = data.delta
	for (var i = 0; i < entry.length; i++) {
		var judge = entry[i]
		if (judge != null) {
			var inJudge = i % 2 ? "x" : "y"
			var posData = posInfo[i]
			var judgeData = judgeInfo[i]
			var inData = rect[posData]
			var judgeData1 = null
			var judgeData2 = null
			var final = null
			switch (posData) {
				case "top":
				case "right":
					switch (type) {
						case "in":
							judgeData1 = pos4_2[judgeData]
							judgeData2 = pos4_1[posData]
							final = judgeData1
							break
						case "out":
							judgeData1 = pos4_1[judgeData]
							judgeData2 = pos4_2[posData]
							final = judgeData2
							break
					}
					break
				case "bottom":
				case "left":
					switch (type) {
						case "in":
							judgeData1 = pos4_1[posData]
							judgeData2 = pos4_2[judgeData]
							final = judgeData2
							break
						case "out":
							judgeData1 = pos4_2[posData]
							judgeData2 = pos4_1[judgeData]
							final = judgeData1
							break
					}
					break
			}
			if (inData > judgeData1 && inData < judgeData2) {

				if (!judge) {
					var temp = Math.abs(judgeDelta[inJudge])
					var inFinal = inData - final
						//cc.log(inFinal, delta[inJudge])
					if (temp < Math.abs(inFinal)) {
						judgeDelta[inJudge] = -delta[inJudge]
							// if (Math.abs(inFinal) <= Math.abs(delta[inJudge])) {
							// 	judgeDelta[inJudge] = inFinal
							// } else {

						// }
					}
				} else {
					var anotherJudge = inJudge == "x" ? "y" : "x"
					data.judge = anotherJudge
					var result = judgeCrashLine(data)
					if (result) {
						var temp = Math.abs(judgeDelta[inJudge])
						var inFinal = inData - final
						if (temp < Math.abs(inFinal)) {
							judgeDelta[inJudge] = -delta[inJudge]
						}
					}
				}
			}
		}
	}
	return judgeDelta
}

addCrashRect = function(data) {
	var item = data.item
	var list = data.list
	item._crashList = list
	item._judgeCrash = function(data) {
		var item = this
		var delta = data.delta
		var loopScale = getLoopScale(item, true)
		if (loopScale != 0) {
			delta.x /= loopScale.x
			delta.y /= loopScale.y
		}
		//var pastPos = getWorldPos(item)
		//var finalPos = cc.p(pastPos.x + delta.x, pastPos.y + delta.y)
		var pastPos = item.getPosition()
		var list = item._crashList

		var judgeDelta = cc.p(0, 0)

		for (var i = 0; i < list.length; i++) {
			var info = list[i]
			var rect = get4Pos(info.item)
			var entry = info.entry || [true, false, false, false] //默认上方开口
			var outry = info.outry || entry //四次方向判定 返回修正参数 取绝对大值
			item.setPosition(pastPos)
			var pos4_1 = get4Pos(item)
			var result1 = judgeItemCrash({
				item1: item,
				item2: info.item
			})
			item.setPosition(pastPos.x + delta.x, pastPos.y + delta.y)
			var pos4_2 = get4Pos(item)
			var result2 = judgeItemCrash({
				item1: item,
				item2: info.item
			})
			if (result1 || result2) {
				judgeDelta = judgeTry({
					entry: entry,
					rect: rect,
					pos4_1: pos4_1,
					pos4_2: pos4_2,
					judgeDelta: judgeDelta,
					type: "in",
					delta: delta,
				})
				judgeDelta = judgeTry({
					entry: outry,
					rect: rect,
					pos4_1: pos4_1,
					pos4_2: pos4_2,
					judgeDelta: judgeDelta,
					type: "out",
					delta: delta,
				})
			}
		}
		item.setPosition(pastPos)
		delta.x += judgeDelta.x
		delta.y += judgeDelta.y
		item.x += delta.x
		item.y += delta.y
	}
}

addOutLine = function(data) { //shader 描边
	var item = data.item
	var color = data.color || cc.color(0, 255, 0, 255)
	var getProgram = null
	var change = null
	if ('opengl' in cc.sys.capabilities) {
		if (cc.sys.isNative) {
			getProgram = function() {
				var shader = new cc.GLProgram(res.outLine_v_native, res.outLine_f)
				shader.link();
				shader.updateUniforms();
				var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(shader);
				glProgram_state.setUniformFloat("u_threshold", 1.75);
				glProgram_state.setUniformVec3("u_outlineColor", {
					x: color.r / 255,
					y: color.g / 255,
					z: color.b / 255
				});
				return glProgram_state
			}
			change = function(data) {
				var data = data || {}
				var color = data.color
				var sprite = this
				if (color) {
					var state = sprite.getGLProgramState()
					if (state == sprite.glState) {
						state.setUniformVec3("u_outlineColor", {
							x: color.r / 255,
							y: color.g / 255,
							z: color.b / 255
						});
					} else {
						sprite.setGLProgramState(sprite.glState)
						sprite.glState.setUniformVec3("u_outlineColor", {
							x: color.r / 255,
							y: color.g / 255,
							z: color.b / 255
						});
					}
				} else {
					sprite.setGLProgramState(sprite.defaultShader)
				}
			}
		} else {
			getProgram = function() {
				var shader = new cc.GLProgram(res.outLine_v, res.outLine_f);
				shader.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);
				shader.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);
				shader.addAttribute(cc.ATTRIBUTE_NAME_COLOR, cc.VERTEX_ATTRIB_COLOR);
				shader.link();
				shader.updateUniforms();
				shader.use();
				shader.setUniformLocationWith1f(shader.getUniformLocationForName('u_threshold'), 1.75);
				shader.setUniformLocationWith3f(shader.getUniformLocationForName('u_outlineColor'), color.r / 255, color.g / 255, color.b / 255);
				return shader
			}
			change = function(data) {
				var data = data || {}
				var color = data.color
				var sprite = this
				if (color) {
					var shader = sprite.glState
					shader.use();
					sprite.shaderProgram = shader
					shader.setUniformLocationWith3f(shader.getUniformLocationForName('u_outlineColor'), color.r / 255, color.g / 255, color.b / 255);
					shader.updateUniforms();
				} else {
					var shader = item.defaultShader
					shader.use();
					sprite.shaderProgram = shader
					shader.updateUniforms();

				}
			}
		}
		if (cc.sys.isNative) {
			var state = getProgram()
			item.defaultShader = item.getGLProgramState()
			item.glState = state
			item.setGLProgramState(state)
		} else {
			item.defaultShader = item.shaderProgram
			var program = getProgram()
			item.shaderProgram = program
			item.glState = program
		}
		item.change = change
	}
}

createBlur = function(data) { //shader 高斯模糊
	var img = data.img
	var blurRadius = data.radiu
	if (blurRadius == null) {
		blurRadius = 0
	}
	if ('opengl' in cc.sys.capabilities) {
		if (cc.sys.isNative) {
			var getProgram = function(data) {
				var program = cc.GLProgram.create(res.blur_v_native, res.blur_f_native);
				program.link();
				program.updateUniforms();

				var dir = data.dir
				var resolution = data.resolution
				var radiu = data.radiu || blurRadius
				var size = data.size

				var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(program);
				glProgram_state.setUniformFloat("resolutionx", size.width)
				glProgram_state.setUniformFloat("resolutiony", size.height)
				glProgram_state.setUniformFloat("radius", radiu)

				return glProgram_state
			}

			var changeRadiu = function(radiu) {
				var shader = this
				this.getGLProgramState().setUniformFloat("radius", radiu);
			}

			var shader = new cc.Sprite(img)
			shader.setAnchorPoint(0.5, 0.5)
			var size = shader.getContentSize()
			shader.setGLProgramState(getProgram({
				size: size,
			}));
			shader.changeRadiu = changeRadiu

			return shader
		} else {
			var getProgram = function(data) {
				var dir = data.dir
				var resolution = data.resolution
				var radiu = data.radiu || blurRadius
				var size = data.size
				var program = cc.GLProgram.create(res.blur_v, res.blur_f);
				program.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);
				program.addAttribute(cc.ATTRIBUTE_NAME_COLOR, cc.VERTEX_ATTRIB_COLOR);
				program.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);
				program.link();
				program.updateUniforms();
				var resolutionUnix = program.getUniformLocationForName("resolutionx");
				var resolutionUniy = program.getUniformLocationForName("resolutiony");
				var radiusUni = program.getUniformLocationForName("radius");

				program.use();
				program.setUniformLocationF32(resolutionUnix, size.width);
				program.setUniformLocationF32(resolutionUniy, size.height);
				program.setUniformLocationF32(radiusUni, blurRadius);

				return program
			}
			var changeRadiu = function(radiu) {
				var shader = this.shaderProgram
				var radiusUni = shader.getUniformLocationForName("radius");
				shader.use()
				shader.setUniformLocationF32(radiusUni, radiu);
				shader.updateUniforms();
			}

			var shader = new cc.Sprite(img)
			shader.setAnchorPoint(0.5, 0.5)
			var size = shader.getContentSize()
			shader.shaderProgram = getProgram({
				size: size,
			});
			shader.changeRadiu = changeRadiu

			return shader
		}
	} else {
		cc.log("opengl is not in capabilities")
		return (new cc.Sprite(img))
	}
}

setFinalScale = function(data) {//设置世界缩放值
	var item = data.item
	var scale = data.scale
	var judge = data.judge || [true, true]
	var rootScale = getLoopScale(item, true)
	if (judge[0]) {
		item.setScaleX(scale / rootScale.x)
	}
	if (judge[1]) {
		item.setScaleY(scale / rootScale.y)
	}
}

judgeMove = function(data) {
	//对指定的item进行移动时候的动态限制
	var item = data.item
	var delta = data.delta
	var top = data.top
	var bottom = data.bottom
	var left = data.left
	var right = data.right
	var crash = data.crash
	var tx = item.x + (delta.x / getLoopScale(item, true).x)
	var ty = item.y + (delta.y / getLoopScale(item, true).y)
	var show = data.show
	if (bottom != null && ty < bottom) {
		ty = bottom
	}
	if (top != null && ty > top) {
		ty = top
	}
	if (left != null && tx < left) {
		tx = left
	}
	if (right != null && tx > right) {
		tx = right
	}
	item.x = tx
	item.y = ty
	if (show) {
		cc.log("x:", tx)
		cc.log("y:", ty)
	}
}

createPlayBtns = function(data) {
	//创建 播放 暂停 停止 重新播放按钮集。并调用对应回调
	data = data || {}
	var pos = data.pos || getMiddle()
	var startFun = data.startFun
	var stopFun = data.stopFun
	var type = data.type || "H"
		//var restartFun = data.restartFun || startFun
	var pauseFun = data.pauseFun
	var resumeFun = data.resumeFun
	var endFun = data.endFun
	var init = data.init || "play"
	var btnlist = [
		"btn_play",
		"btn_pause",
		"btn_stop",
		"btn_restart",
	]
	var btns = loadNode(res.playBtns, btnlist)
	btns.setPosition(pos)
	switch (type) {
		case "H":
			break
		case "S":
			var rootPos = btns.btn_play.getPosition()
			btns.btn_stop.setPosition(rootPos.x, rootPos.y - 70)
			break
	}
	btns.changeStatus = function(statu) {
		var btns = this
		var control = ""
		var resume = false
		if (statu) {
			if (statu == "play" && btns.statu == "pause") {
				control = "resume"
				btns.statu = statu
			} else {
				btns.statu = statu
				control = btns.statu
			}
		} else {
			control = btns.statu
		}

		switch (btns.statu) {
			case "play":
				result = [false, true, true, false]
				break
			case "pause":
				result = [true, false, true, false]
				break
			case "stop":
				result = [true, false, false, false]
				break
			case "end":
				result = [false, false, false, true]
				break
		}
		for (var i = 0; i < btnlist.length; i++) {
			btns[btnlist[i]].setVisible(result[i])
		}
		switch (control) {
			case "play":
				if (startFun) {
					startFun()
				}
				break
			case "stop":
				if (stopFun) {
					stopFun()
				}
				break
			case "resume":
				if (resumeFun) {
					resumeFun()
				}
				break
			case "end":
				if (endFun) {
					endFun()
				}
				break
			case "pause":
				if (pauseFun) {
					pauseFun()
				}
				break
		}
	}
	btns.btn_pause.addClickEventListener(function() {
		btns.changeStatus("pause")
	})
	btns.btn_play.addClickEventListener(function() {
		btns.changeStatus("play")
	})
	btns.btn_restart.addClickEventListener(function() {
		btns.changeStatus("play")
	})
	btns.btn_stop.addClickEventListener(function() {
		btns.changeStatus("stop")
	})
	btns.end = function() {
		btns.changeStatus("end")
	}
	btns.changeStatus(init)
	return btns
}

createNewLink = function(data) { //创建映射 用于看一看居多
	var imgList = data.imgList
	var posList = data.posList
	var imgCount = data.imgCount || 2 //so far only support 2
	var linkFun = data.linkFun
	var init = data.init
	var initPars = data.initPars
	var failBack = data.failBack
	var scale = data.scale || 1
	var noFrame = data.noFrame || false
	var onlyTrue = data.onlyTrue || false
	var firstIndex = data.firstIndex
	if (failBack == null) {
		failBack = true
	}
	var run = function() {
		var rootNode = new cc.Node()
		if (init) {
			init(initPars)
		}
		for (var i = 0; i < imgList.length / imgCount; i++) {
			var btn = createJudgeBtn({
				normal: imgList[i * imgCount],
				select: imgList[i * imgCount + 1],
				scale: scale,
				fun: function(item) {
					if (rootNode && rootNode.btnList) {
						for (var i = 0; i < rootNode.btnList.length; i++) {
							var inItem = rootNode.btnList[i]
							if (inItem != item) {
								inItem.change(false, true)
							}
						}
					}
					if (linkFun) {
						linkFun(item.index)
					}
				},
				frame: !noFrame,
				failBack: failBack,
				onlyTrue: onlyTrue,
			})
			btn.index = i
			btn.setPosition(posList[i])
			safeAdd(rootNode, btn)
			if (!rootNode.btnList) {
				rootNode.btnList = []
			}
			rootNode.btnList[i] = btn
		}
		if (firstIndex != null) {
			rootNode.btnList[firstIndex].change(true, true)
		}
		return rootNode
	}
	return run()
}

createDrawLines = function(data) { //创建绘制连接线 用于看一看居多
	var buf = data.buf
	var line = data.line || 2
	var color = data.color || cc.color(255, 0, 0, 255)
	var pos = data.pos
	var father = data.father
	var ifList = data.ifList || false
	var run = function() {
		var draw = new cc.DrawNode()
		if (pos) {
			draw.setPosition(pos)
		}
		if (father) {
			safeAdd(father, draw)
		}
		for (var i = 0; i < buf.length; i++) {
			var indata = buf[i]
			if (indata.length > 1) {
				for (var j = 0; j < indata.length - 1; j++) {
					if (ifList) {
						draw.drawSegment(cc.p(indata[j][0], indata[j][1]), cc.p(indata[j + 1][0], indata[j + 1][1]), line, color) //循环绘制连接线
					} else {
						draw.drawSegment(indata[j], indata[j + 1], line, color) //循环绘制连接线
					}
				}
			} else {
				cc.log("needs at least 2 points to create a line")
			}
		}
		return draw
	}
	return run()
}

createShowImg = function(data) { //创建弹窗
	var img = data.img
	var pos = data.pos || getMiddle()
	var showTime = data.showTime || 0.3

	var bgInfo = data.bgInfo || {} //背景参数
	var bg = bgInfo.bg || res.bg_result
	var no9 = bgInfo.no9 || false
	var noBg = bgInfo.noBg || false
	var sizeScale = bgInfo.sizeScale || cc.p(1.1, 1.1)
	var posOff = bgInfo.posOff || cc.p(0, 0)

	var closeBtn = data.closeBtn || [res.btn_result_quit_normal, res.btn_result_quit_select] //关闭按钮参数
	var noClose = data.noClose || false
	var closeOff = data.closeOff || cc.p(0, 0)
	var clsScale = data.clsScale || 1
	var inFun = data.inFun //入场回调
	var outFun = data.outFun //退场回调
	var showType = data.showType || "normal"

	var run = function() {
		if (img) {
			var node = null
			if (!noBg) {
				var size = getSize(bg)
				var offx = bgInfo.offx || 0.2
				var offy = bgInfo.offy || 0.2
				var offx2 = bgInfo.offx2 || (1 - offx)
				var offy2 = bgInfo.offy2 || (1 - offy)
				var back = null
				if (!no9) {
					back = new cc.Scale9Sprite(bg,
						cc.rect(0, 0, size.width, size.height),
						cc.rect(offx * size.width, offy * size.height,
							offx2 * size.width, offy2 * size.height))
					var imgSize = getSize(img)
					back.width = imgSize.width * sizeScale.x
					back.height = imgSize.height * sizeScale.y
				} else {
					back = new cc.Sprite(bg)
				}
				var inImg = new cc.Sprite(img)
				inImg.setAnchorPoint(0.5, 0.5)
				inImg.setPosition(back.width / 2 + posOff.x, back.height / 2 + posOff.y)
				safeAdd(back, inImg)
				node = back
				node.inImg = inImg
			} else {
				node = new cc.Sprite(img)
			}
			node.setCascadeOpacityEnabled(true)
			node.setAnchorPoint(0.5, 0.5)
			node.setPosition(pos)
			node.status = false
			node.initPos = pos
			node.setScale(0)
			node.initLis = function() { //重置监听
				var node = this
				if (node.status) {
					createTouchEvent({
						item: node,
						begin: function(data) {
							var node = data.item
							node.setLocalZOrder(LOCAL_ORDER++)
							reAdd(node)
							return true
						},
						autoMove: true,
					})
					node.disClose = false
				} else {
					if (node.removeListen) {
						node.removeListen()
					}
					node.disClose = true
				}
			}
			node.show = function(act, noCall) { //入场退场统一函数
				var node = this
				noCall = noCall || false
				if (!node.showIng || act != null) {
					node.showIng = true
					var action = !node.status
					if (act != null) {
						action = act
					}
					node.next = action
					var showAction = null
					var beside = null
					switch (showType) {
						case "up":
							node.setScale(1)
							showAction = "moveBy"
							beside = action ? "fadeIn" : "fadeOut"
							break
						default:
							showAction = action ? "scale" : "zoom"
							break
					}
					node.setLocalZOrder(LOCAL_ORDER++)
					reAdd(node)
					node.stopAllActions()
					if (beside) {
						addShowType({
							item: node,
							show: beside,
							time: showTime,
						})
					}
					addShowType({
						item: node,
						show: showAction,
						buf: cc.p(0, 20),
						time: showTime,
						fun: function(node) {
							node.setPosition(node.initPos)
							node.showIng = false
							node.status = node.next
							if (!noCall) {
								if (node.status) {
									if (inFun) {
										inFun(node)
									}
								}
								if (!node.status) {
									if (outFun) {
										outFun(node)
									}
								}
							}
							node.initLis()
						}
					})
				}
			}
			if (!noClose) {
				var clsBtn = new ccui.Button(closeBtn[0], closeBtn[1])
				clsBtn.setAnchorPoint(1, 1)
				clsBtn.setPosition(node.width + closeOff.x, node.height + closeOff.y)
				clsBtn.setScale(clsScale)
				safeAdd(node, clsBtn)
				clsBtn.addClickEventListener(function() {
					if (!node.disClose) {
						node.show(false)
					}
				})
			}
			return node
		} else {
			return null
		}
	}
	return run()
}

function readPixelInRect(data) { //获取指定点的像素颜色 item必须有gettexute。大部分时候用sprite。 pos是相对item的坐标。
	var item = data.item
	var pos = data.pos
	var reget = data.reget || false
		//var fix = data.fix || 5 //误差
	if (cc.sys.isNative) {
		if (item.getTexture && item.getTexture() && item.getTextureRect()) {
			var rect = item.getTextureRect()
			pos = cc.p(rect.x + pos.x, item.getTexture().height - rect.y - rect.height + pos.y)
			var imgpath = item.getTexture().getPath()
			var aImage = new cc.Image()
			aImage.initWithImageFile(imgpath)
			var color = aImage.getPosPixel(Math.floor(pos.x), Math.floor(pos.y))
			aImage = null
			return color
		}
	} else {
		if (item.getTexture && item.getTexture()) {
			var tex = item.getTexture()
			var width = tex.width
			var height = tex.height
			if (!item._pixels) {
				var canvas = cc.newElement("canvas")
				canvas.width = width
				canvas.height = height
				var ctx = canvas.getContext("2d")
				ctx.drawImage(item.getTexture().getHtmlElementObj(), 0, 0)
				item._pixels = ctx.getImageData(0, 0, width, height).data
			}
			var rect = item.getTextureRect()
				//cc.log(rect)
				//cc.log(pos)
				//cc.log(item.inOffset.x, item.inOffset.y)
			pos = cc.p(rect.x + pos.x, height - rect.y - rect.height + pos.y)
			var idx = (height - Math.floor(pos.y) - 1) * width * 4 + Math.floor(pos.x) * 4
			var color = cc.color(item._pixels[idx], item._pixels[idx + 1], item._pixels[idx + 2], item._pixels[idx + 3])
				// cc.log(color)
				// cc.log(pos)
			return color
		}
	}
	return cc.color(0, 0, 0, 0)
}

function addOpMoving(data) {
	var item = data.item
	createTouchEvent({
		item: item,
		begin: function(data) {
			var item = data.item
			var result = judgeOpInPos(data)
			item.setLocalZOrder(LOCAL_ORDER++)
			reAdd(item)
			return result
		},
		autoMove: true,
	})
}

function judgeOpInPos(data) {
	var item = data.item
	var pos = data.pos
	var isNode = data.isNode || false
	var mix = data.mix || 0
		//var fix = data.fix || 5 //误差
	if (!isNode) {
		pos = item.convertToNodeSpace(pos)
	}
	//cc.log("pos", pos.x, pos.y)
	var color = readPixelInRect({
			item: item,
			pos: pos,
		})
		//cc.log("color", color.r.toString(), color.g.toString(), color.b.toString(), color.a.toString())
	return (color.a > mix)
}

function changeFather(data) { //修改父节点捆绑 和safeAdd类似。唯一的不同在于changefather保留了世界相对位置。
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
		cc.log(e.message);
		// cc.log(e.description)
		// cc.log(e.number)
		cc.log(e.name)
		return false
	}
	return true
}

function testLoop(file) {
	//获取描边链接线节点
	var layOut = createLayout({
		pos: cc.p(0, 0),
		size: cc.director.getWinSize(),
		op: 255,
		color: cc.color(0, 0, 0, 255)
	})
	safeAdd(CC_CURRENT_LAYER, layOut)
	var item = new cc.Sprite(file)
	item.setPosition(getMiddle(-1136 / 4))
	safeAdd(CC_CURRENT_LAYER, item)
	var uilist = [
		"up",
		"down",
		"left",
		"right"
	]
	var node = loadNode(res.testLoop, uilist)
	node.setPosition(getMiddle(1136 / 4, 0))
	safeAdd(CC_CURRENT_LAYER, node)

	var result = {}
	var size = item.getContentSize()
	var width = size.width
	var height = size.height
	var start = null
	for (var y = 0; y < height; y++) {
		for (var x = 0; x < width; x++) {
			if (judgeOpInPos({
					item: item,
					pos: cc.p(x, y),
					isNode: true,
				})) {
				start = cc.p(x, y)
				break
			}
		}
		if (start) {
			break
		}
	}

	result.add = function(pos) {
		if (!result.draw) {
			var draw = new cc.DrawNode()
			var pos = item.getPosition()
			pos = cc.p(pos.x - width / 2, pos.y - height / 2)
			draw.setPosition(pos)
			safeAdd(CC_CURRENT_LAYER, draw)
			result.draw = draw
		}
		if (!result.posList) {
			result.posList = []
		}
		var key = sprintf("%dand%d", pos.x, pos.y)
		if (!result[key]) {
			result[key] = true
			var draw = result.draw
			result.posList[result.posList.length] = pos
			draw.drawDot(pos, 1.0, cc.color(0, 255, 0, 255))
			return true
		} else {
			result.print()
			return false
		}
	}
	var searchLoop = [
		[0, 1],
		[0, -1],
		[-1, 0],
		[1, 0],
	]
	result.print = function() {
		cc.log("total: ", result.posList.length)
		cc.log("parsing....")
		var temp = []
		var current = null
		var pastTri = null
		var count = 0
			// for (var i = 0; i < result.posList.length; i++) {
			// 	var cur = result.posList[i]
			// 	if (!current) {
			// 		current = cur
			// 		temp[count] = current
			// 		count++
			// 	} else {
			// 		if (!pastTri) {
			// 			pastTri = cc.p(cur.x - current.x, cur.y - current.y)
			// 			current = cur
			// 			temp[count] = current
			// 			count++
			// 		} else {
			// 			var curTri = cc.p(cur.x - current.x, cur.y - current.y)
			// 			if (!(curTri.x == pastTri.x && curTri.y == pastTri.y)) {
			// 				count++
			// 			}
			// 			current = cur
			// 			pastTri = curTri
			// 			temp[count] = current
			// 		}
			// 	}
			// }
		temp = result.posList
		cc.log("afterParsing...")
		cc.log("total: ", temp.length)
		for (var i = 0; i < temp.length; i++) {
			if (temp[i]) {
				cc.log(sprintf("[%d, %d],", temp[i].x, temp[i].y))
			}
		}
	}

	result.run = function() {
		cc.log(start)
		for (var i = 0; i < uilist.length; i++) {
			node[uilist[i]].setScale(1)
		}
		if (start) {
			while (result.add(start)) {
				var count = 0
				var tempResult = []
				for (var i = 0; i < searchLoop.length; i++) {
					var temp = cc.p(start.x + searchLoop[i][0], start.y + searchLoop[i][1])
					var key = sprintf("%dand%d", temp.x, temp.y)
					if (judgeOpInPos({
							item: item,
							pos: temp,
							isNode: true,
						}) && !result[key]) {
						tempResult[i] = true
						count++
					} else {
						tempResult[i] = false
					}
				}
				if (count > 0) {
					if (count == 1) {
						for (var i = 0; i < tempResult.length; i++) {
							if (tempResult[i]) {
								start = cc.p(start.x + searchLoop[i][0], start.y + searchLoop[i][1])
								break
							}
						}
					} else {
						cc.log("waiting for choose")
						result.showWait(tempResult)
						break
						//start = cc.p(start.x + searchLoop[index][0], start.y + searchLoop[index][1])
					}
				} else {
					result.print()
					break
				}
			}
		}
	}
	result.showWait = function(list) {
		result.waiting = true
		result.curKey = list
		for (var i = 0; i < uilist.length; i++) {
			if (list[i]) {
				node[uilist[i]].setScale(2)
			}
		}
	}
	result.init = function() {
		for (var i = 0; i < uilist.length; i++) {
			node[uilist[i]].index = i
			node[uilist[i]].addClickEventListener(function(sender, event) {
				if (result.waiting && result.curKey[sender.index]) {
					result.waiting = false
					start = cc.p(start.x + searchLoop[sender.index][0], start.y + searchLoop[sender.index][1])
					result.run()
				}
			})
		}
	}
	result.init()
	result.run()
}

function createZSWD(data) { //创建知识问答模板
	var infos = data.infos
		/*
		info = {
			img:{
				res:,
				pos:,
			},
			descript:{
				pos:,
				str:,
				size:,
				anchor:,
				color:,
				posOff:,
			},
			answer:{
				list:[],
				pos:,
				devide:,
				size:,
				colors:[],
			},
			result:{
				key:,
				pos:,
				str:,
				color:,
				size:,
				imgPos:{
					right:,
					wrong:,
				}
			}
		}
		*/
	var uilist = [
		"btn_next",
		"btn_pre",
		"result",
		"wrong",
		"right",
		"title"
	]
	var keys = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"]
	var run = function() {
		var node = loadNode(res.zswd, uilist, "bg")
		var result = node.result
		result.wrong = node.wrong
		result.right = node.right

		var packBtn = function(btn, dire) {
			//btn.rootPos = btn.getPosition()
			btn.setLocalZOrder(1)
			btn.dire = dire
			var buf = null
			switch (dire) {
				case "left":
					buf = cc.p(15, 0)
					break
				case "right":
					buf = cc.p(-15, 0)
					break
			}
			addShowType({
				item: btn,
				show: "shakeF",
				time: 0.7,
				buf: buf,
			})
			btn.addClickEventListener(function(btn) {
				switch (btn.dire) {
					case "left":
						node.showIndex(node.curIndex - 1)
						break
					case "right":
						node.showIndex(node.curIndex + 1)
						break
				}
			})
		}
		packBtn(node.btn_next, "right")
		packBtn(node.btn_pre, "left")

		node.list = []
		for (var i = 0; i < infos.length; i++) {
			var info = infos[i]
			var fontSize = info.fontSize || 16
			var page = new cc.Node()
			if (info.img) {
				var imgInfo = info.img
				var img = new cc.Sprite(imgInfo.res)
				var pos = imgInfo.pos || cc.p(186, 154)
				var posOff = imgInfo.posOff || cc.p(0, 0)
				pos = cc.p(pos.x + posOff.x, pos.y + posOff.y)
				img.setPosition(pos)
				safeAdd(page, img)
					//addMoving(img, true, true)
			}
			if (info.descript) {
				var desInfo = info.descript
				var des = new cc.LabelTTF(desInfo.str, null, desInfo.size || 24)
				var anchor = desInfo.anchor || cc.p(0, 1)
				des.setColor(desInfo.color || cc.color(67, 30, 115, 255))
				des.setAnchorPoint(anchor)
				var pos = desInfo.pos || cc.p(50, 420)
				var posOff = desInfo.posOff || cc.p(0, 0)
				pos = cc.p(pos.x + posOff.x, pos.y + posOff.y)
				des.setPosition(pos)
				safeAdd(page, des)
			}
			if (info.answer) {
				var answerInfo = info.answer
				page.answerList = []
				var pos = answerInfo.pos || cc.p(340, 250)
				var posOff = answerInfo.posOff || cc.p(0, 0)
				pos = cc.p(pos.x + posOff.x, pos.y + posOff.y)
				var devide = answerInfo.devide || cc.p(0, -20)
				var colors = answerInfo.colors || [cc.color(67, 30, 115, 255), cc.color(255, 0, 0, 255)]
				var past = 0
				for (var j = 0; j < answerInfo.list.length; j++) {
					var str = sprintf("%s. %s", keys[j], answerInfo.list[j])
					var label = new cc.LabelTTF(str, null, answerInfo.size || 24)
					label.setAnchorPoint(0, 1)
					label.setPosition(pos.x + devide.x * j, pos.y + devide.y * j - past)
					past += label.getContentSize().height
					label.normalColor = colors[0]
					label.selectColor = colors[1]
					label.setColor(label.normalColor)
					label.index = j
					page.answerList[j] = label
					safeAdd(page, label)

					createTouchEvent({
						item: label,
						begin: function(data) {
							var item = data.item
							var par = item.getParent()
							return (par.index == node.curIndex)
						},
						end: function(data) {
							var item = data.item
							var index = item.index
							var par = item.getParent()
							var list = par.answerList
							par.reInit()
							item.setColor(item.selectColor)
							node.right.setVisible(par.key == index)
							node.wrong.setVisible(par.key != index)
								//stopEffect()
							playEffect(par.key == index ? res.zswd_right : res.zswd_wrong)
							par.fianlLabel.setVisible(par.key == index)
							if (par.key == index) {
								node.result.setPosition(par.rightPos)
							} else {
								node.result.setPosition(par.wrongPos)
							}
						}
					})
				}

			}
			if (info.result) {
				var resultInfo = info.result
				var resultStr = resultInfo.str || "答案: %s"
				var pos = resultInfo.pos || cc.p(450, 60)
				page.key = resultInfo.key
				var str = sprintf(resultStr, keys[page.key])
				var label = new cc.LabelTTF(str, null, resultInfo.size || 18)
				label.setPosition(pos)
				label.setColor(resultInfo.color || cc.color(153, 0, 0, 255))
				safeAdd(page, label)
				var imgPos = resultInfo.imgPos || {}
				page.rightPos = imgPos.right || cc.p(545, 180)
				page.wrongPos = imgPos.wrong || cc.p(545, 180)
				page.fianlLabel = label
			}
			page.setPosition(0, 0)
			node.list[i] = page
			page.reInit = function() {
				var page = this
				page.fianlLabel.setVisible(false)
				for (var i = 0; i < page.answerList.length; i++) {
					var item = page.answerList[i]
					item.setColor(item.normalColor)
				}
			}
			page.index = i
			safeAdd(node, page)
		}
		node.maxIndex = infos.length
		node.showIndex = function(index) {
			var node = this
			if (index >= 0 && index < node.maxIndex) {
				node.curIndex = index
				for (var i = 0; i < node.maxIndex; i++) {
					node.list[i].setVisible(i == index)
					node.list[i].reInit()
				}
				node.judgeBtn()
				node.wrong.setVisible(false)
				node.right.setVisible(false)
			} else {
				cc.log("wrong index was called")
			}
		}
		node.judgeBtn = function() {
			node.btn_pre.setVisible(node.curIndex != 0)
			node.btn_next.setVisible(node.curIndex != (node.maxIndex - 1))
		}
		node.showIndex(0)
		return node
	}
	return run()
}

function createFalling(data) { //小型物理引擎 待定 弃用
	data = data || {}
	var waterH = data.waterH || 200 //水面高度
	var gravity = data.gravity || 9.8 //重力加速度
	var waterMix = data.waterMix || 1.0 //水的密度
	var disF = data.disF || 0.0015 // 摩擦力系数
	var frame = data.frame || 24
	var world = {
		_w: waterH,
		_g: gravity,
		_p: waterMix,
		_caling: true,
		_f: frame,
		_d: disF,
	}
	world.addItem = function(data) {
		var world = this
		var item = data.item
		var weight = data.weight //质量
		var volume = data.volume //体积
		if (item == null || weight == null || volume == null) {
			cc.log("wrong pars by additem in world")
			return
		}
		if (!world.itemList) {
			world.itemList = []
		}
		var itemList = world.itemList
		itemList[itemList.length] = item
		item._m = weight
		item._v = volume
		item._act = false
	}
	world.actItem = function(item) {
		var world = this
		if (!world.itemList) {
			cc.log("item should be added first")
		} else {
			var itemList = world.itemList
			var judge = true
			for (var i = 0; i < itemList.length; i++) {
				if (itemList[i] == item) {
					judge = false
					item._act = true
					break
				}
			}
			if (judge) {
				cc.log("can't find this item in world,item should be added first")
			}
		}
	}
	world.init = function(item) {
		var world = this
		item._init = true
			//item._curPos = getWorldPos(item)
		item._xS = 0
		item._yS = 0
		item._xa = 0
		item._ya = 0
	}
	world.effect = function(item) {
		var world = this
		item.x += item._xS / world._f
		item.y += item._yS / world._f
		item._xS += item._xa
		item._yS += item._ya
		var cals = world.calA(item)
		item._xa = cals.x
		item._ya = cals.y
	}
	world.calA = function(item) {
		var world = this
		var posList = get4Pos(item)
			//目前只有重力和浮力 以后可以后续添加
		var x = 0
		var y = 0
		if (posList.bottom > world._w) {
			//只有重力作用
			x = 0
			y = -world._g - item._yS * world._d * item._v / item._m
			var mix = item._yS * world._d * item._v / item._m
			cc.log("mix", mix)
		} else {
			if (posList.top < world._w) {
				//重力和完全浮力
				x = 0
				y = -world._g + item._v * world._p * world._g / item._m
				cc.log("total", y)
			} else {
				//重力和部分浮力
				var per = (world._w - posList.bottom) / (posList.top - posList.bottom)
				x = 0
				y = -world._g + item._v * world._p * world._g / item._m * per
				cc.log("part", y)
			}
		}
		//cc.log(y)
		return {
			x: x,
			y: y,
		}
	}
	world.start = function() {
		var world = this
		addTimer({
			fun: function() {
				if (world._caling) {
					var itemList = world.itemList
					if (itemList) {
						for (var i = 0; i < itemList.length; i++) {
							var item = itemList[i]
							if (item._act) {
								if (!item._init) {
									world.init(item)
								}
								world.effect(item)
							}
						}
					}
				}
			},
			time: 1 / world._f,
			repeat: cc.REPEAT_FOREVER,
			key: "CAL_WORLD"
		})
	}
	world.stop = function() {
		removeTimer("CAL_WORLD")
	}
	world.pause = function() {
		var world = this
		world._caling = false
	}
	return world
}

function createWaterPhy(data) { //这个函数修改对象函数
	var layer = data.layer
	var gravity = data.gravity || -500
	var showDebug = data.showDebug || false
	var updateFun = data.updateFun
	var GRABABLE_MASK_BIT = 1 << 31
	var NOT_GRABABLE_MASK = ~GRABABLE_MASK_BIT
	var FLUID_DENSITY = 0.00009
	var FLUID_DRAG = 1.5

	var _initPhysics = function() {
		var layer = this
		layer.scheduleUpdate();
		layer.space = new cp.Space()
		layer.waterPreSolve = function(arb, space, ptr) {
			var shapes = arb.getShapes();
	        var water = shapes[0];
	        var poly = shapes[1];

	        var body = poly.getBody();

	        // Get the top of the water sensor bounding box to use as the water level.
	        var level = water.getBB().t;

	        // Clip the polygon against the water level
	        var count = poly.getNumVerts();

	        var clipped = [];

	        var j=count-1;
	        for(var i=0; i<count; i++) {
	            var a = body.local2World(poly.getVert(j));
	            var b = body.local2World(poly.getVert(i));

	            if(a.y < level){
	                clipped.push(a.x);
	                clipped.push(a.y);
	            }

	            var a_level = a.y - level;
	            var b_level = b.y - level;

	            if(a_level*b_level < 0.0){
	                var t = Math.abs(a_level)/(Math.abs(a_level) + Math.abs(b_level));

	                var v = cp.v.lerp(a, b, t);
	                clipped.push(v.x);
	                clipped.push(v.y);
	            }
	            j=i;
	        }
            // Calculate buoyancy from the clipped polygon area
		    var clippedArea = cp.areaForPoly(clipped);
		    var displacedMass = clippedArea*FLUID_DENSITY;
		    var centroid = cp.centroidForPoly(clipped);
		    var dt = space.getCurrentTimeStep()
			var g = space.gravity
			var r = centroid
			var v_centroid = body.getVelAtWorldPoint(centroid)
			var cog = null
			if(cc.sys.isNative){
				cog = body.local2World(body.getCenterOfGravity())
			}else{
				r = cp.v.sub(centroid, body.getPos())
				cog = body.p
			}
			// Apply the buoyancy force as an impulse.
		    body.applyImpulse(cp.v.mult(g, -displacedMass*dt), r);

		    var k = 1
			var damping = clippedArea*FLUID_DRAG*FLUID_DENSITY
			var v_coef = Math.exp(-damping*dt*k)
			body.applyImpulse(cp.v.mult(cp.v.sub(cp.v.mult(v_centroid, v_coef), v_centroid), 1.0 / k), r);
			var w_damping = cp.momentForPoly(FLUID_DRAG * FLUID_DENSITY * clippedArea, clipped, cp.v.neg(cog),0);
			body.w *= Math.exp(-w_damping * dt * (1 / body.i));

			body._damping = Math.floor(w_damping)

			
			return true;
		}
		layer.setupDebugNode = function(ifshow) {
			var layer = this
			layer._debugNode = new cc.PhysicsDebugNode(layer.space)
			layer._debugNode.visible = ifshow
			layer.addChild(layer._debugNode)
		}
		layer.update = function(dt) {
			var layer = this
			if (!layer._acting) {
				return
			}
			//layer.space.reindexStatic()
			var steps = 3;
			dt /= steps;
			for (var i = 0; i < 3; i++) {
				layer.space.step(dt);
			}
			if (updateFun) {
				updateFun(dt)
			}
		}
		layer.removeWater = function(water) {
			var layer = this
			var space = layer.space
			var list = [
				"left",
				"right",
				"bottom",
				"water",
			]
			for (var i = 0; i < list.length; i++) {
				var shape = water[list[i]]
				if (shape && shape.space && shape.space == space) {
					space.removeShape(shape)
				}
			}
		}
		layer.addWater = function(data) {
			var layer = this
			var item = data.item
			var disHeight = data.disHeight || 0
			var addWall = data.addWall || 0
			var pos = get4Pos(item)
			var bb = new cp.BB(pos.left, pos.bottom, pos.right, pos.top)
			var radius = 1
			var space = layer.space
			var staticBody = space.staticBody;
			var result = {}
			var shape = space.addShape(new cp.SegmentShape(staticBody, cp.v(bb.l, bb.b), cp.v(bb.l, bb.t + addWall), radius));
			shape.setElasticity(1.0);
			shape.setFriction(2.0);
			shape.setLayers(NOT_GRABABLE_MASK);
			result.left = shape

			shape = space.addShape(new cp.SegmentShape(staticBody, cp.v(bb.r, bb.b), cp.v(bb.r, bb.t + addWall), radius));
			shape.setElasticity(1.0);
			shape.setFriction(2.0);
			shape.setLayers(NOT_GRABABLE_MASK);
			result.right = shape

			shape = space.addShape(new cp.SegmentShape(staticBody, cp.v(bb.l, bb.b), cp.v(bb.r, bb.b), radius));
			shape.setElasticity(1.0);
			shape.setFriction(2.0);
			shape.setLayers(NOT_GRABABLE_MASK);
			result.bottom = shape

			var bb = new cp.BB(pos.left, pos.bottom, pos.right, pos.top - disHeight)
			shape = space.addShape(new cp.BoxShape2(staticBody, bb));
			shape.setSensor(true);
			shape.setCollisionType(1);
			pos.top = pos.top - disHeight
			shape._rootPos = pos
			result.water = shape

			var mixHeight = function(data) {
				var shape = this
				var mix = data.mix
				var pos = shape._rootPos
				if (shape.space) {
					shape.space.removeShape(shape)
				}
				pos.top = pos.top + mix
				var bb = new cp.BB(pos.left, pos.bottom, pos.right, pos.top + mix)
				shape = space.addShape(new cp.BoxShape2(staticBody, bb));
				shape.setSensor(true);
				shape.setCollisionType(1);
				shape._rootPos = pos
				shape.mixHeight = mixHeight
				return shape
			}
			shape.mixHeight = mixHeight

			return result
		}
		layer.pyActItem = function(data) {
			var item = data.item
			var act = data.act
			var body = item._body
			var shape = item._shape
			var space = layer.space
				// if (!body || !shape) {
				// 	cc.log("wrong pars was called")
				// 	cc.log("no body and shape")
				// 	return false
				// }
			if (act) {
				if (!item._hasCall) {
					if (body && body.space) {
						item.pastRotate = body.a
						body.space.removeBody(body)
						item._body = null
					}
					if (body && shape.space) {
						shape.space.removeShape(shape)
						item._shape = null
					}
					item._hasCall = true
				}
				var indata = item.data
				var size = indata.size
				var body = item.bodyFun()
				if (item.pastRotate == null) {
					item.pastRotate = 0
				}
				body.setAngle(item.pastRotate)
				body.setPos(getWorldPos(item))
				if (!indata.static) {
					body.setMass(indata.mass)
					space.addBody(body)
					item._body = body
				}
				item.setBody(body)
				var shape = item.shapeFun(body)
				space.addShape(shape)
				item._shape = shape
			} else {
				if (body && body.space) {
					item.pastRotate = body.a
					body.space.removeBody(body)
					if (cc.sys.isNative) {
						item._body = null
					}
				}
				if (shape && shape.space) {
					shape.space.removeShape(shape)
					if (cc.sys.isNative) {
						item._shape = null
					}
				}
				item._hasCall = true
			}
		}
		layer.addJoint = function(data) {
			var layer = this
			var type = data.type
			var buf = data.buf
			switch (type) {
				case "pivot":
					var body1 = buf.item1._body
					var body2 = buf.item2._body
					var pivotJoint = new cp.PivotJoint(body1, body2, buf.anchor);
					layer.space.addConstraint(pivotJoint);
					break
			}
		}
		layer.addItem = function(data) {
			var layer = this
			var tex = data.tex
			var pos = data.pos || cc.p(getMiddle())
			var type = data.type || "box"
			data.type = type
			var static = data.static || false
			data.static = static
			var offset = data.offset || cc.p(0, 0)
			data.pos = pos
			data.offset = offset
			var angle = data.angle || 0
			data.angle = angle
			var mass = data.mass
			var disAct = data.disAct || false //该操作似乎会引起闪退 暂时无效化
			var disCal = data.disCal || false
			if (mass == null) {
				mass = 1
			}
			data.mass = mass
			data.disCal = disCal
			var initFun = data.inifFun
			var sprite = new cc.Sprite(tex)
			var size = sprite.getContentSize() || data.size

			var sp = new cc.PhysicsSprite(sprite.getTexture(), sprite.getTextureRect())
			data.size = size
			sp.data = data
			sp.bodyFun = function() {
				var sp = this
				var data = sp.data
				var size = data.size
				var offset = data.offset
				var body = null
				if (static) {
					//return layer.space.staticBody
					return new cp.Body(Infinity, Infinity)
				}
				switch (data.type) {
					case "poly":
						body = new cp.Body(1, cp.momentForPoly(1, data.buf, offset))
						break
					case "circle":
						body = new cp.Body(1, cp.momentForCircle(1, data.buf.r1, data.buf.r2, offset))
						break
					default:
						body = new cp.Body(1, cp.momentForBox(1, size.width, size.height))
						break
				}
				body._myType = data.type
				body.disCal = data.disCal
				return body
			}
			sp.shapeFun = function(body) {
				var sp = this
				var data = sp.data
				var size = data.size
				var offset = data.offset
				var shape = null
				switch (data.type) {
					case "poly":
						// var draw = new cc.DrawNode()
						// var pointList = []
						// for (var i = 0; i < data.buf.length; i += 2) {
						// 	var point = cc.p(data.buf[i], data.buf[i + 1])
						// 	pointList[pointList.length] = point
						// }
						// pointList[pointList.length] = pointList[0]
						// for (var i = 0; i < pointList.length - 1; i++) {
						// 	draw.drawSegment(pointList[i], pointList[i + 1], 1, cc.color(255, 0, 0, 255))
						// }
						// draw.setPosition(getMiddle())
						// safeAdd(CC_CURRENT_LAYER, draw)
						shape = new cp.PolyShape(body, data.buf, offset)
						break
					case "circle":
						shape = new cp.CircleShape(body, data.buf.r1, offset)
						break
					default:
						shape = new cp.BoxShape(body, size.width, size.height)
						break
				}
				shape._myType = data.type
				if (static) {
					shape.setElasticity(data.ela != null ? data.ela : 1)
					shape.setFriction(data.fri != null ? data.fri : 1)
					shape.setCollisionType(2)
					shape.setLayers(NOT_GRABABLE_MASK)
				} else {
					shape.setElasticity(data.ela != null ? data.ela : 0.2)
					shape.setFriction(data.fri != null ? data.fri : 2.5)
				}
				shape.disCal = data.disCal
				return shape
			}
			var body = sp.bodyFun()
			body.setPos(pos)
			body.setAngle(angle)
			if (!static) {
				body.setMass(mass)
				layer.space.addBody(body)
				sp._body = body
			}
			sp.setBody(body)
			var shape = sp.shapeFun(body)
			layer.space.addShape(shape)
				// if (disAct && !static) {
				// 	body.sleep()
				// }
			sp._shape = shape
			layer.addChild(sp)
			if (initFun) {
				inifFun({
					body: body,
					shape: shape,
					sp: sp,
				})
			}
			sp.getMass = function() {
				var sp = this
				return sp.data.mass
			}
			sp.setMass = function(mass) {
				var sp = this
				sp.data.mass = mass
			}
			return sp
		}
		layer.afterExit = function() {
			var layer = this
			if (layer && layer.space) {
				layer.space.removeCollisionHandler(1, 0)
			}
		}
		layer.actPys = function(judge) {
				var layer = this
				layer._acting = judge
			}
			// layer.addCrash = function(data) {
			// 	var layer = this
			// 	var a = data.a
			// 	var b = data.b
			// 	var begin = data.begin
			// 	var preSolve = data.preSolve
			// 	var postSolve = data.postSolve
			// 	var separate = data.separate
			// 	if (a && b && (begin || preSolve || postSolve || separate)) {
			// 		layer.space.addCollisionHandler(a._shape, b._shape, begin, preSolve, postSolve, separate)
			// 	} else {
			// 		cc.log("pars wrong to create crash")
			// 	}
			// }

		layer._acting = false
		layer.space.addCollisionHandler(1, 0, null, layer.waterPreSolve, null, null);
		cc.sys.dumpRoot();
		cc.sys.garbageCollect();

		layer.setupDebugNode(showDebug)
		var space = layer.space;
		space.iterations = 30;
		space.gravity = cp.v(0, gravity);
		space.sleepTimeThreshold = 0.5;
		space.collisionSlop = 0.5;
	}
	layer._initPhysics = _initPhysics
	layer._initPhysics()
}

function createCoverMove(data) {
	var item = data.item
	var time = data.time
	var sp = new cc.Sprite(res.clip_node)
	setSize({
			item: sp,
			width: 2272,
			height: 1280,
		})
		// sp.setAnchorPoint(item.getAnchorPoint())
		// sp.setPosition(item.getPosition())

	var node = new cc.Sprite()
	safeAdd(node, sp)
	var pos = item.getParent().convertToNodeSpace(cc.p(0, 0))
	sp.setAnchorPoint(0, 0)
	node.setPosition(pos)

	var clip = new cc.ClippingNode(node)
	clip.setAlphaThreshold(0)
	safeAdd(item.getParent(), clip)
	safeAdd(clip, item)

	node.setScaleX(0)
	addShowType({
		item: node,
		show: "scaleTo",
		buf: cc.p(1, 1),
		time: time,
	})
}

function addMouseHover(data) { //item鼠标悬停
	var item = data.item
	var infun = data.infun
	var outfun = data.outfun
	var disOp = data.disOp || false
	if (!cc.sys.isNative) {
		item.mouseListener = cc.EventListener.create({
			event: cc.EventListener.MOUSE,
			onMouseMove: function(event) {
				var pos = event.getLocation()
				var outOrin = judgeInside({
					item: item,
					pos: pos
				})
				var result = true
				if (!disOp) {
					result = judgeOpInPos({
						item: item,
						pos: pos
					})
				}
				if (outOrin && result) {
					if (infun) {
						infun(item)
					}
				} else {
					if (outfun) {
						outfun(item)
					}
				}
			}
		})
		item.removeMouseListener = function() {
			if (this.mouseListener) {
				cc.eventManager.removeListener(this.mouseListener)
				this.mouseListener = null
			}
		}
		cc.eventManager.addListener(item.mouseListener, item)
	}
}
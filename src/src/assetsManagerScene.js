var failCount = 0;
var maxFailCount = 1; //最大错误重试次数

/** 
 * 自动更新js和资源 
 */
var AssetsManagerLoaderScene = cc.Scene.extend({
	_am: null,
	_progress: null,
	_percent: 0,
	run: function() {
		this.loadGame();
		return;
		if (!cc.sys.isNative) {
			this.loadGame();
			return;
		}

		var layer = new cc.Layer();
		this.addChild(layer);
		this._progress = new cc.LabelTTF.create("update 0%", "Arial", 12);
		this._progress.x = cc.winSize.width / 2;
		this._progress.y = cc.winSize.height / 2 + 50;
		layer.addChild(this._progress);

		var storagePath = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "./");
		cc.log("storagePath is " + storagePath);
		//var maniFile = sprintf("src/maniFile/%s.manifest", GAMEKEY) 
		var maniFile = "res/project.manifest"
		this._am = new jsb.AssetsManager(maniFile, storagePath);
		this._am.retain();

		if (!this._am.getLocalManifest().isLoaded())
		//if (true)
		{
			cc.log("Fail to update assets, step skipped.");
			this.loadGame();
		} else {
			var that = this;
			cc.EventListenerAssetsManager
			var listener = new jsb.EventListenerAssetsManager(this._am, function(event) {
				switch (event.getEventCode()) {
					case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
						cc.log("No local manifest file found, skip assets update.");
						that.loadGame();
						break;
					case jsb.EventAssetsManager.UPDATE_PROGRESSION:
						that._percent = event.getPercent();
						cc.log(that._percent + "%");
						var msg = event.getMessage();
						if (msg) {
							cc.log(msg);
						}
						break;
					case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
					case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
						cc.log("Fail to download manifest file, update skipped.");
						that.loadGame();
						break;
					case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
						cc.log("ALREADY_UP_TO_DATE.");
						that.loadGame();
						break;
					case jsb.EventAssetsManager.UPDATE_FINISHED:
						cc.log("Update finished.");
						that.loadGame();
						break;
					case jsb.EventAssetsManager.UPDATE_FAILED:
						cc.log("Update failed. " + event.getMessage());
						failCount++;
						if (failCount < maxFailCount) {
							that._am.downloadFailedAssets();
						} else {
							cc.log("Reach maximum fail count, exit update process");
							failCount = 0;
							that.loadGame();
						}
						break;
					case jsb.EventAssetsManager.ERROR_UPDATING:
						cc.log("Asset update error: " + event.getAssetId() + ", " + event.getMessage());
						that.loadGame();
						break;
					case jsb.EventAssetsManager.ERROR_DECOMPRESS:
						cc.log(event.getMessage());
						that.loadGame();
						break;
					default:
						break;
				}
			});
			cc.eventManager.addListener(listener, 1);
			this._am.update();
			cc.director.runScene(this);
		}

		this.schedule(this.updateProgress, 0.5);
	},

	loadGame: function() {
		//jsList是jsList.js的变量，记录全部js。 
		var key = GAMEKEY
		if(GAMEKEY=="HappyGameRes"){
			this.loadHappyGame()
			return
		}
		cc.log(sprintf("src/jsList/%s.js", key))
		if (GAMEKEY == null){
            cc.director.end()
        }
		cc.loader.loadJs([sprintf("src/jsList/%s.js", key)], function() {
			cc.loader.loadJs(jsList, function() {
				if (cc.sys.os == cc.sys.OS_ANDROID && !TEST_FLAG){
					jsb.reflection.callStaticMethod(activity, ANDROID_CANCEL_FUNC, ANDROID_CANCEL_TYPE)
				}
				preInit()
				addList(mainInfo.layerList)
				cc.myLoaderScene.preload(g_resources, function() {
					var scene = new cc.Scene()
					var layname = null
					if(!mainInfo.playMP4)
					   layname = "mainLayer"
					else
					   layname = "videoLayer"
					reloadAudio()
					var layer = layerControl.getLayer(layname)
					scene.addChild(layer)
					cc.director.runScene(scene)
					if (layer.myEnter) {
						layer.myEnter()
					}

					if(cc.sys.os == cc.sys.OS_IOS && !TEST_FLAG){
						var TestBool = jsb.reflection.callStaticMethod(IOS_CONTROLLER, funcIos, "Testing")
		                if(TestBool == "YES"){
		                   setTimeout(function(){
                               jsb.reflection.callStaticMethod(IOS_CONTROLLER, IOS_RETURN_FUNC)
		                   },2000)
		                }
					}

					if(cc.sys.os == cc.sys.OS_ANDROID && !TEST_FLAG){
					    var TestBool = jsb.reflection.callStaticMethod(activity, funcName, funType, "Testing")
		                if(TestBool == "YES"){
		                   setTimeout(function(){
                                if (CC_CURRENT_LAYER) {
	                                CC_CURRENT_LAYER.setVisible(false)
	                            }
	                            cc.director.end()
		                   },2000)
		                }
					}
					
				}, this);
				if (GAMEKEY == null){
		            cc.director.end()
		        }
			});
		});
	},
	loadHappyGame:function(){
		if (GAMEKEY == null){
            cc.director.end()
        }
		cc.loader.loadJs(["src/happyGame/loadstartGame.js"], function() {
			getStartRes()
			cc.loader.loadJs(allGamejsList, function() {
				getAllRes()
				cc.myLoaderScene.preload(gameRes, function() {
					senceControl.showSence(new views.mainSence())
					layerControl.showLayer("mainLayer")
				}, this)
			})
		})
	},
	updateProgress: function(dt) {
		this._progress.string = "update" + this._percent + "%";
	},

	onExit: function() {
		cc.log("AssetsManager::onExit");

		this._am.release();
		this._super();
	}
});
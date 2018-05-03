//author @mu 2016/4/25
var GRABABLE_MASK_BIT = 1 << 31
var NOT_GRABABLE_MASK = ~GRABABLE_MASK_BIT
var FLUID_DENSITY = 0.00014
var FLUID_DRAG = 1.5
var modifyX = 50
var seeExp2 = myLayer.extend({
    sprite: null,
    space: null,
    changeDelete: true, //是否退出删除
    layerName: "seeExp2",
    preLayer: "seeLayer",
    dataControl: {},
    myExit: function() {
        this.nodebs.stopSay()
    },
    myDelete: function() {
        removeTimer("FINISH1")
        removeTimer("FINISH2")
        removeTimer("JUDGEEND")
    },
    ctor: function() {
        this._super();
        this.dataControl = {}
        var self = this
        self.expCtor({
            vis: true
        })
        this.btn_result.addClickEventListener(function() {
            self.nodebs.say({
                key: "Result",
            })
        })
        self.initScene()
        return true
    },
    update: function(dt) {
        var steps = 3;
        dt /= steps;
        for (var i = 0; i < 3; i++) {
            this.space.step(dt);
        }
        var dataControl = this.dataControl
        for (var i = 0; i < 2; i++) {
            var item = dataControl[sprintf("water%d", i)]
            if (item) {
                if (item.sp && item.sprite) {
                    item.sprite.setPosition(item.sp.getPosition())
                    item.sprite.setRotation(item.sp.getRotation())
                }
            }
        }
    },
    onExit: function() {
        this.space.removeCollisionHandler(1, 0);
        this._super();
    },
    waterPreSolve: function(arb, space, ptr) {
        var shapes = arb.getShapes();
        var water = shapes[0];
        var poly = shapes[1];

        var body = poly.getBody();

        // Get the top of the water sensor bounding box to use as the water level.
        var level = water.getBB().t;

        // Clip the polygon against the water level
        var count = poly.getNumVerts();

        var clipped = [];

        var j = count - 1;
        for (var i = 0; i < count; i++) {
            var a = body.local2World(poly.getVert(j));
            var b = body.local2World(poly.getVert(i));

            if (a.y < level) {
                clipped.push(a.x);
                clipped.push(a.y);
            }

            var a_level = a.y - level;
            var b_level = b.y - level;

            if (a_level * b_level < 0.0) {
                var t = Math.abs(a_level) / (Math.abs(a_level) + Math.abs(b_level));

                var v = cp.v.lerp(a, b, t);
                clipped.push(v.x);
                clipped.push(v.y);
            }
            j = i;
        }

        // Calculate buoyancy from the clipped polygon area
        var clippedArea = cp.areaForPoly(clipped)
        var density = null //0.00014
        switch (body.name) {
            case "ls":
                switch (body.water) {
                    case "ls": //冷水中的冷水
                        density = 0.00009
                        break
                    case "rs":
                        density = 0.00007
                        break
                }
                break
            case "rs":
                switch (body.water) {
                    case "ls":
                        density = 0.00014
                        break
                    case "rs":
                        density = 0.00009
                        break
                }
                break
        }
        var displacedMass = clippedArea * density;
        var centroid = cp.centroidForPoly(clipped);
        var r = cp.v.sub(centroid, body.getPos());

        var dt = space.getCurrentTimeStep()
        var g = space.gravity

        // Apply the buoyancy force as an impulse.
        body.applyImpulse(cp.v.mult(g, -displacedMass * dt), r);

        // Apply linear damping for the fluid drag.
        var v_centroid = cp.v.add(body.getVel(), cp.v.mult(cp.v.perp(r), body.w))
        var k = 1; //k_scalar_body(body, r, cp.v.normalize_safe(v_centroid));
        var damping = clippedArea * FLUID_DRAG * density
        var v_coef = Math.exp(-damping * dt * k); // linear drag
        //  var v_coef = 1.0/(1.0 + damping*dt*cp.v.len(v_centroid)*k); // quadratic drag
        body.applyImpulse(cp.v.mult(cp.v.sub(cp.v.mult(v_centroid, v_coef), v_centroid), 1.0 / k), r);

        var w_damping = cp.momentForPoly(FLUID_DRAG * density * clippedArea, clipped, cp.v.neg(body.p));
        body.w *= Math.exp(-w_damping * dt * (1 / body.i));

        return true;
    },
    onEnter: function() {
        this._super();
        this.space.addCollisionHandler(1, 0, null, this.waterPreSolve, null, null);
        cc.sys.dumpRoot();
        cc.sys.garbageCollect();
    },
    myEnter: function() {
        this._super()
        if (this.nodebs) {
            var self = this
            this.nodebs.show(function() {
                self.nodebs.say({
                    key: "Show",
                    force: true,
                })
            })
        }
    },
    addWater: function(data) {
        var item = data.item
        var pos = data.pos
        var mass = data.mass
        var size = item.getContentSize()
        var bb = new cp.BB(pos.x, pos.y, pos.x + size.width, pos.y + size.height)
        var radius = 0
        var space = this.space
        var staticBody = space.staticBody;
        var shape = space.addShape(new cp.SegmentShape(staticBody, cp.v(bb.l, bb.b), cp.v(bb.l, bb.t), radius));
        shape.setElasticity(1.0);
        shape.setFriction(2.0);
        shape.setLayers(NOT_GRABABLE_MASK);

        shape = space.addShape(new cp.SegmentShape(staticBody, cp.v(bb.r, bb.b), cp.v(bb.r, bb.t), radius));
        shape.setElasticity(1.0);
        shape.setFriction(2.0);
        shape.setLayers(NOT_GRABABLE_MASK);

        shape = space.addShape(new cp.SegmentShape(staticBody, cp.v(bb.l, bb.b), cp.v(bb.r, bb.b), radius));
        shape.setElasticity(1.0);
        shape.setFriction(2.0);
        shape.setLayers(NOT_GRABABLE_MASK);

        // Add the sensor for the water.
        shape = space.addShape(new cp.BoxShape2(staticBody, bb));
        shape.setSensor(true);
        shape.setCollisionType(1);
    },
    initPhysics: function() {
        this.scheduleUpdate();
        this.space = new cp.Space()
        this.setupDebugNode()
        var space = this.space;
        space.iterations = 30;
        space.gravity = cp.v(0, -500);
        space.sleepTimeThreshold = 0.5;
        space.collisionSlop = 0.5;
    },
    setupDebugNode: function() {
        this._debugNode = new cc.PhysicsDebugNode(this.space)
        this._debugNode.visible = false
        this.addChild(this._debugNode)
    },
    addWaterBox: function(name) {
        var self = this
        var item = loadNode(res.nodesg)
        var water = seekWidgetByName(item, "img_resize")
        var zqvis = null
        var posbox = null
        var pos = null
        var mass = null
        var dataControl = self.dataControl
        dataControl.rsStart = 150 + modifyX
        dataControl.lsStart = 490 + modifyX
        dataControl.rsEnd = dataControl.rsStart + water.getContentSize().width
        dataControl.lsEnd = dataControl.lsStart + water.getContentSize().width

        getZq({
            pos: cc.p(300, 370),
            father: self,
            devide: 20,
            scale: 1.5
        })
        getZq({
            pos: cc.p(400, 370),
            father: self,
            devide: 20,
            scale: 1.5
        })
        switch (name) {
            case "ls":
                posbox = cc.p(640 + modifyX, 250)
                pos = cc.p(dataControl.lsStart, 140)
                zqvis = false
                mass = 1.1
                break
            case "rs":
                posbox = cc.p(300 + modifyX, 250)
                pos = cc.p(dataControl.rsStart, 140)
                zqvis = true
                mass = 1
                break
        }

        this.addWater({
            item: water,
            pos: pos,
            mass: mass
        })
        var zq = seekWidgetByName(item, "img_zq")
        zq.setVisible(zqvis)
        item.setPosition(posbox)
        self.loadUI.addChild(item)
        var front = loadNode(res.nodefront)
        var hot = seekWidgetByName(front, "img_hot")
        var cold = seekWidgetByName(front, "img_cold")
        hot.setVisible(zqvis)
        cold.setVisible(!zqvis)
        front.setPosition(posbox)
        self.loadUI.addChild(front, 1)
        return item
    },
    judgeEnd: function() {
        var self = this
        var dataControl = self.dataControl
        if (dataControl && dataControl.finish1 && dataControl.finish2) {
            if (!dataControl.allFininsh) {
                dataControl.allFininsh = true
                self.btn_result.setVisible(true)
                self.nodebs.finish()
                    /*
                    self.nodebs.say({
                        key:"Result"
                    })*/
                removeTimer("JUDGEEND")
            }
        }
    },
    initScene: function() {
        var self = this
        if (self.loadUI) {
            self.initPhysics()
            var table = new cc.Sprite(res.img_table)
            table.setPosition(470 + modifyX, 30)
            self.loadUI.addChild(table)

            self.nodebs = addPeople({
                id: "boshi",
                pos: cc.p(1000, 130)
            })
            self.addChild(self.nodebs)

            addContent({
                people: self.nodebs,
                key: "Show",
                img: res.see2_content_1,
                sound: res.see2_content_1_sound
            })
            addContent({
                people: self.nodebs,
                key: "Next",
                img: res.see2_content_2,
                sound: res.see2_content_2_sound,
            })
            addContent({
                people: self.nodebs,
                key: "Result",
                img: res.see2_content_3,
                sound: res.see2_content_3_sound,
                id: "result",
            })
            self.nodebs.setLocalZOrder(999)

            itemls = this.addWaterBox("ls")
            itemrs = this.addWaterBox("rs")

            var toolbtn = createTool({
                pos: cc.p(70, 500),
                nums: 2,
                tri: "down",
                modify: cc.p(1, 1.1),
                devide: cc.p(1.5, 1.2),
                itempos: cc.p(3, -9),
                circlepos: cc.p(0, 15),
                showTime: 0.3,
                moveTime: 0.2,
                ifcircle: true,
                father: self.loadUI,
                files: [res.img_cold_item, res.img_hot_item],
                gets: [res.img_cold, res.img_hot],
                grays: [res.img_cold_gray, res.img_hot_gray],
                clickfun: function(data) {
                    var sp = data.sp
                    var index = data.index
                    var dataControl = self.dataControl
                        //dataControl.allFininsh = false
                    var item = dataControl[sprintf("water%d", index)]
                    switch (index) {
                        case 0:
                            dataControl.finish1 = false
                            removeTimer("FINISH1")
                            break
                        case 1:
                            dataControl.finish2 = false
                            removeTimer("FINISH2")
                            break
                    }
                    if (item) {
                        if (item.sp) {
                            item.sp.removeFromParent(true)
                            item.sp = null
                        }
                        if (item.body) {
                            self.space.removeBody(item.body)
                            item.body = null
                        }
                        if (item.shape) {
                            self.space.removeShape(item.shape)
                            item.shape = null
                        }
                    }
                    return true
                },
                outfun: function(data) {
                    var sprite = data.sp
                    var index = data.index
                    var space = self.space
                    var name = null
                    var water = null
                    var pos = sprite.getPosition()
                    var posx = pos.x
                    var control = self.dataControl
                    if (posx > control.rsStart && posx < control.rsEnd) {
                        water = "rs"
                    }
                    if (posx > control.lsStart && posx < control.lsEnd) {
                        water = "ls"
                    }
                    if (water) {
                        switch (sprite.index) {
                            case 0: //ls
                                name = "ls" //switch by pos
                                break
                            case 1: //rs
                                name = "rs"
                                break
                        }
                        if (name == "ls" && water == "rs") {
                            addTimer({
                                fun: function() {
                                    dataControl.finish1 = true
                                    removeTimer("FINISH1")
                                    if (!dataControl.finish2) {
                                        self.nodebs.say({
                                            key: "Next",
                                            force: true,
                                        })
                                    }
                                    self.judgeEnd()
                                },
                                delay: 2.0,
                                time: 0.1,
                                key: "FINISH1",
                            })
                        }

                        if (name == "rs" && water == "ls") {
                            addTimer({
                                fun: function() {
                                    dataControl.finish2 = true
                                    removeTimer("FINISH2")
                                    self.judgeEnd()
                                },
                                delay: 2.0,
                                time: 0.1,
                                key: "FINISH2",
                            })
                        }

                        var staticBody = space.staticBody;
                        var size = sprite.getContentSize()
                        var body = new cp.Body(1, cp.momentForBox(1, size.width, size.height));
                        body.setPos(pos);
                        body.setAngle(Math.PI / 180)
                        body.setMass(1.0)
                        body.name = name
                        body.water = water
                        self.space.addBody(body);
                        var shape = new cp.BoxShape(body, size.width, size.height);
                        shape.setElasticity(0.2)
                        shape.setFriction(2.5)
                        self.space.addShape(shape)
                        var sp = new cc.PhysicsSprite(sprite.getTexture(), cc.rect(0, 0, size.width, size.height));
                        sp.setBody(body)
                        sprite.combine = sp
                        self.loadUI.addChild(sp)
                        sp.setVisible(false)
                        var dataControl = self.dataControl
                        if (!dataControl[sprintf("water%d", sprite.index)]) {
                            dataControl[sprintf("water%d", sprite.index)] = {}
                        }
                        dataControl[sprintf("water%d", sprite.index)] = {
                            sprite: sprite,
                            sp: sp,
                            body: body,
                            shape: shape,
                        }
                    }
                }
            })
            this.loadUI.addChild(toolbtn)
            toolbtn.show()
            addTimer({
                fun: self.judgeEnd,
                time: 0.5,
                repeat: cc.REPEAT_FOREVER,
                key: "JUDGEEND",
            })
        }
    }
})
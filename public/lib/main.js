/*
Слишком много всего в одном файле
 */
function Anim() {
    var btn_stages;

    function isLoaded() { return btn_stages !== undefined }
    // работали как кнопки с переходом на событие
    // теперь просто включатели события
    // завязаны на предыдущие события - будут работать только поочердёно
    function setStage(s_name, active = true) {
        try {
            btn_stages[s_name].style.backgroundColor = active ? "#86da86" : "";
        } catch (ex) {
            console.log(`active ${s_name}`)
        }
    }
    function clearStage() {
        Object.entries(btn_stages).forEach((el) => {
            el[1].style.backgroundColor = "";
            // el[1].style.opacity = 0.4;`
        })
    }

    function _isActive(s_name, clear = true) {
        if (!btn_stages) return;

        // Надо отталкиваться от какого-то флага
        let ret = btn_stages[s_name].style.backgroundColor !== "";
        if (ret && clear) {
            setStage(s_name, false)
        }
        return ret;
    }
    this.isActive = _isActive

    function __debug_select_stage(s_name) {
        if (btn_stages[s_name].style.opacity < 1.) return;
        switch (s_name) {
            case STAGE_NAMES.Start:
                start_anim();
                break;
            case STAGE_NAMES.PressBtn:
                setStage(STAGE_NAMES.PressBtn)

                // _forces.PressBtn()

                break;
            case STAGE_NAMES.RocketTakes:
                setStage(STAGE_NAMES.RocketTakes)

                // _forces.RoketTakes()

                break;
            case STAGE_NAMES.TwoHand:
                setStage(STAGE_NAMES.TwoHand)

                // _forces.TwoHand()
                break;

            case STAGE_NAMES.End_wait:
                setStage(STAGE_NAMES.End_wait)
                break;
            case STAGE_NAMES.End:
                setStage(STAGE_NAMES.End)
                // arm_ilon.animation.play(ANIM_Ilon.End);

                // _forces.Exploded()
                break;
        }
    }


    function __debug_play_anim(armature, name_anim) {
        console.log(name_anim, "______")
        armature.visible = true;
        armature.animation.play(name_anim)

        // if (//armature == _arms.main &&
        //     name_anim == ANIM_Main_scene.Start)
        //     _arms.mask.animation.play(ANIM_Mask.Start);
    }

    // @todo дебаг-тулзы нужно вынести во что-то отдельное и просто "подписать"
    const list_animation = (armature, id_cont) => {
        if (!window.HAS_DEBUG) return
        armature.animation._animationNames.forEach((animation_name) => {
            var btn = document.createElement("button");
            btn.innerHTML = animation_name;
            btn.addEventListener("click", () => { __debug_play_anim(armature, animation_name) });
            document.getElementById(id_cont).appendChild(btn);
        })
    }


    function start_anim(init = false) {
        if (init) {
            btn_stages = {}
            const add_btn = (name, enabled = false) => {
                const btn = btn_stages[name] = document.createElement("button");
                btn.innerHTML = name;
                // btn.style.opacity = enabled ? 1 : 0.4;
                btn.addEventListener("click", () => { __debug_select_stage(name) });
                if (window.HAS_DEBUG) {
                    document.getElementById("stages").appendChild(btn);
                }
            }
            add_btn(STAGE_NAMES.Start, true)
            add_btn(STAGE_NAMES.PressBtn, true)

            add_btn(STAGE_NAMES.RocketTakes)
            add_btn(STAGE_NAMES.TwoHand)
            add_btn(STAGE_NAMES.End)
            add_btn(STAGE_NAMES.End_wait)
        }

        _arms.ilon.animation.play(ANIM_Ilon.Wait);

        _forces.set_up_button();
        // _arms.mask.animation.play(ANIM_Mask.Wait);
        _forces.hide_bang()
        _forces.set_up_roket();
    }


    var _handler_press = null,
        _time_to_start = -1,//-1 - если соединения ещё небыло
        _del_to_pressed = DELAY_PRESSED_BTN,
        _time_press = 0;


    this.hasConnected = () => {
        return _time_to_start > 0
    }
    /** методы для listener */

    this.start_after = (_delay_ms) => {
        if (!isLoaded()) return

        text_idly_anim()

        let _delay_to_start = Math.max(DELAY_PRESSED_BTN, _delay_ms - DELAY_PRESSED_BTN)
        // console.log(`ANIM start_after = ${_delay_to_start}`)
        _time_to_start = Date.now() + _delay_to_start
        // console.log(_delay_to_start)

        // перемотка из грусной эмоции
        if (_isActive(STAGE_NAMES.End_wait, false)) {
            clearStage()
            setStage(STAGE_NAMES.End)

            PIXI.Ticker.shared.speed =
                (_delay_ms > 0) ?
                    Math.max(1, Math.round(3340 / _delay_ms)) : 1.25
            //анимация ожидания 1670 + переход в старт  1670
        } else {
            clearStage()
        }

        setStage(STAGE_NAMES.PressBtn)
        _forces.set_up_button()
        _forces.isExploded(false)

        if (_handler_press) clearTimeout(_handler_press)
        _handler_press = setTimeout(() => {
            PIXI.Ticker.shared.speed = 1
            _forces.PressBtn()
        }, _delay_to_start)
    }

    this.in_process = () => {
        if (!isLoaded()) return

        room.setState(ANIM_Room.Work, true)
        _forces.PressBtn(true)
    }

    this.completed = () => {
        if (!isLoaded()) return

        room.setState(ANIM_Room.Stop, true)
        setStage(STAGE_NAMES.End_wait)
        _forces.Exploded(true)
    }

    this.set_win = (has_win) => {
        if (!isLoaded()) return

        if (has_win)
            room.setState(ANIM_Room.Win, true)
    }
    /* ################################# */

    var _has_timer = false

    // Уже описал в файле аниации текста
    // @todo дорого так обновлять стейт
    function text_idly_anim() {
        function loop() {

            _has_timer = _time_to_start + _time_press > 0
            if (_has_timer) {
                room.setState(ANIM_Room.Wait)

                let now = Date.now()
                let left = _del_to_pressed
                if (_time_press !== 0)
                    left = (_time_press + _del_to_pressed) - now


                if (_time_to_start > 0) {
                    let elapsed = _time_to_start - now
                    // console.log(elapsed / 1000)
                    left += elapsed
                }
                tablo.setLeftTime(left)
            }

            setTimeout(loop, 50);
        }
        loop();
    }


    this.setMultiplier = (tick, multip) => {
        app.ticker.add(() => {

            if (_has_timer) return

            let out_multip = 0
            if (_forces.isExploded()) {
                out_multip = multip()
            }
            if (_forces.isStarted()) {
                out_multip = tick()

                if (out_multip >= 1.87) {
                    setStage(STAGE_NAMES.RocketTakes)
                    // _forces.RoketTakes()
                }
                if (out_multip >= 8.9) {
                    setStage(STAGE_NAMES.TwoHand)
                    // _forces.TwoHand()
                }
            } else {
                tablo.updateIdly()
                return
            }

            out_multip = Math.min(out_multip, MAX_MULTIP)

            tablo.setMultiplier(out_multip)

        });
    }


    //переход на запуск сейчас
    var _forces = new (function () {

        // @todo Что за магия 
        // время последнего смотра на часы - для старта записываем что смотрели оооочень давно (** - степень)
        var _timer_see_watch = Date.now() - 10000 ** 9
        var _show_see = null

        this.IlonWaiting = (end_see_watch) => {
            this.hide_bang()
            if (end_see_watch) {
                _arms.ilon.animation.play(ANIM_Ilon.Wait_sbtn);
            }

            let now = Date.now()
            let delay = now - _timer_see_watch
            if (delay >= 10000) {
                _timer_see_watch = now
                // if (_time_to_start == -1)
                _show_see = Date.now() + (3 + Math.random() * 7) * 1000
                // console.log("-loong")
            }
            // console.log("посмотрит на часы через", _show_see - now)
            if (now >= _show_see) {
                _show_see *= 99 ** 9
                _arms.ilon.animation.play(ANIM_Ilon.Wait_swatch);
                return;
            }
            _arms.ilon.animation.play(ANIM_Ilon.Wait_sbtn);
        }

        this.hide_bang = () => {
            if (bang.Hide()) {
                _arms.main.animation.play(ANIM_Main_scene.Reload);
            }
        }

        this.set_up_button = () => {
            if (!room.setUp()) return

            _timer_see_watch = Date.now()
            // Илон ещё выходит из грусной эмойии
            _show_see = Date.now() + Math.random() * 1000
        }

        this.set_up_roket = () => {
            if (_arms.main.animation.lastAnimationState &&
                _arms.main.animation.lastAnimationState.name == ANIM_Main_scene.Wait) return;
            _arms.main.animation.play(ANIM_Main_scene.Reload);
        }

        var _type_start = -1
        this.isStarted = () => { return _type_start >= 1 }

        var _handle_started_roket = null;
        this.PressBtn = (safe = false) => {
            _time_to_start = 0
            if (_handler_press) clearTimeout(_handler_press)

            setStage(STAGE_NAMES.PressBtn, false)
            setStage(STAGE_NAMES.End, false)

            if (safe == true && _type_start != -1) return
            this.hide_bang()

            /*в анимации -  задержка времени нажатия*/
            _del_to_pressed = safe ? DELAY_PRESSED_BTN * 0.5 : DELAY_PRESSED_BTN
            _time_press = Date.now()

            //начало старта
            if (_handle_started_roket) clearTimeout(_handle_started_roket)
            _handle_started_roket = setTimeout(() => {
                room.setState(ANIM_Room.Work)
                _main_scene_is_started = true
                _arms.main.animation.play(ANIM_Main_scene.Start);
                _type_start = 3

                PIXI.Ticker.shared.speed = 1;
                _time_press = 0
                _del_to_pressed = DELAY_PRESSED_BTN
            }, _del_to_pressed);

            _arms.ilon.animation.play(ANIM_Ilon.Press_Button);
            _type_start = 0
            _exploded = false
            if (safe) PIXI.Ticker.shared.speed = 2;
        }

        //ракета взлетела - подготовка всех состояний
        this.RoketTakes = () => {
            _type_start = 1
            _arms.ilon.animation.play(ANIM_Ilon.RocketTakes_Start);
            room.Off()
        }

        this.TwoHand = () => {
            _type_start = 2
            _arms.ilon.animation.play(ANIM_Ilon.TwoHand_Start);
        }


        // ракета всегда взрывается - надо чистить
        var _exploded = false
        this.isExploded = (value) => { if (value) _exploded = value; return _exploded }

        this.Exploded = (safe = false) => {
            _exploded = true
            if (safe == true && _type_start == -1) return;

            if (_handle_started_roket) clearTimeout(_handle_started_roket)

            if (safe) {
                if (_main_scene_is_started) {
                    _arms.main.animation.play(ANIM_Main_scene.Wait);
                    bang.toLoop()
                } else {
                    bang.toBang()

                }
            }

            switch (_type_start) {
                case 0:
                case 3:
                    _arms.ilon.animation.play(ANIM_Ilon.Explosed_0);
                    break;
                case 1:
                    _arms.ilon.animation.play(ANIM_Ilon.Explosed_1);
                    break;
                case 2:
                    _arms.ilon.animation.play(ANIM_Ilon.Explosed_2);
                    break;
            }
            _type_start = -1;
        }

        return this;
    })();


    function _ActionEventHandler＿ilon(event) {
        switch (event.animationState.name) {
            case ANIM_Ilon.Wait://2460 - ....
            case ANIM_Ilon.Wait_sbtn://2380
            case ANIM_Ilon.Wait_swatch://2500
                // arm_ilon.animation.fadeIn(ANIM_Ilon.Press_Button);

                //по таймеру включится кнопка - пока ждём и перключаем анимации ожидания
                if (_time_to_start > 0 && _isActive(STAGE_NAMES.PressBtn, false)) {
                    let elapsed = _time_to_start - Date.now()
                    if (elapsed <= 2500) {
                        // console.log('elapsed', elapsed)
                        _arms.ilon.animation.play(ANIM_Ilon.Wait);
                        break
                    }
                    _forces.IlonWaiting(event.animationState.name === ANIM_Ilon.Wait_swatch)
                    break
                }

                //если нет таймера то в лоб (для Debug) - deprecate
                // if ( isActive(STAGE_NAMES.PressBtn)) {
                //     _forces.PressBtn()
                //     break;
                // }

                _forces.IlonWaiting(event.animationState.name === ANIM_Ilon.Wait_swatch)
                break;
            case ANIM_Ilon.Press_Button:
            case ANIM_Ilon.Press_Button_Wait:
                if (_isActive(STAGE_NAMES.RocketTakes)) {
                    _forces.RoketTakes()
                    break;
                }

                PIXI.Ticker.shared.speed = 1;
                // if (event.animationState.name !== ANIM_Ilon.Press_Button_Wait)
                _arms.ilon.animation.play(ANIM_Ilon.Press_Button_Wait);
                room.Off()
                break;

            case ANIM_Ilon.RocketTakes_Start:
            case ANIM_Ilon.RocketTakes_Wait:
                if (
                    _isActive(STAGE_NAMES.End_wait, false) ||
                    _isActive(STAGE_NAMES.End, false)
                ) {
                    _forces.Exploded()
                    break
                }
                if (_isActive(STAGE_NAMES.TwoHand)) {
                    _forces.TwoHand()
                    break;
                }
                // if (event.animationState.name !== ANIM_Ilon.RocketTakes_Wait)
                _arms.ilon.animation.play(ANIM_Ilon.RocketTakes_Wait);
                break;
            case ANIM_Ilon.TwoHand_Start:
            case ANIM_Ilon.TwoHand_Wait:
                if (
                    _isActive(STAGE_NAMES.End_wait, false) ||
                    _isActive(STAGE_NAMES.End, false)
                ) {
                    _forces.Exploded()
                    break
                }
                // if (event.animationState.name !== ANIM_Ilon.TwoHand_Wait)
                _arms.ilon.animation.play(ANIM_Ilon.TwoHand_Wait);
                break;

            case ANIM_Ilon.Explosed_0:
            case ANIM_Ilon.Explosed_1:
            case ANIM_Ilon.Explosed_2:
            case ANIM_Ilon.Explosed_Wait:
                if (_isActive(STAGE_NAMES.End)) {
                    _arms.ilon.animation.play(ANIM_Ilon.End);
                    break;
                }
                // if (isActive(STAGE_NAMES.End_wait)) {
                // if (event.animationState.name !== ANIM_Ilon.RocketTakes_Wait)
                _arms.ilon.animation.play(ANIM_Ilon.Explosed_Wait);
                // break;
                // }
                break;

            case ANIM_Ilon.End:
                start_anim()
                break;
        }
    }



    var _main_scene_is_started = false
    function _ActionEventHandler＿main(event) {
        _main_scene_is_started = false;
        switch (event.animationState.name) {
            case ANIM_Main_scene.Reload:
                stars.setEnable(false)
                _arms.main.animation.play(ANIM_Main_scene.Wait);
                break;
            case ANIM_Main_scene.Start:
                _arms.main.animation.play(ANIM_Main_scene.Fly);
                stars.setEnable(true)
                break
            case ANIM_Main_scene.Fly:
                _arms.main.animation.play(ANIM_Main_scene.Fly_circle);

            //зациклимся - 1 секундная
            // case ANIM_Main_scene.Fly_circle:
            // case ANIM_Main_scene.Wait:
            // _arms.main.animation.play(ANIM_Main_scene.Wait);
            // break;
        }
    }

    var _arms = {
        main: null,
        lon: null,
    };

    var stars, clip_mask, bang;
    var room = new Room(this)
    var tablo = new Tablo(this)

    function _onAssetsLoaded(loader, res) {

        const pf_parsed = dragonBones.PixiFactory.factory;

        pf_parsed.parseDragonBonesData(res.skeleton.data);
        pf_parsed.parseTextureAtlasData(res.texture_json.data, res.texture_png.texture);

        //______________________________________________________________________________________________
        _arms.ilon = pf_parsed.buildArmatureDisplay('Ilon');
        _arms.ilon.on(dragonBones.EventObject.LOOP_COMPLETE, _ActionEventHandler＿ilon, this);
        SetPos(_arms.ilon)
        list_animation(_arms.ilon, "anim_ilon")

        //______________________________________________________________________________________________
        room.init(pf_parsed, main_view, _arms.ilon)
        //______________________________________________________________________________________________

        _arms.main = pf_parsed.buildArmatureDisplay('Main_scene');
        _arms.main.on(dragonBones.EventObject.LOOP_COMPLETE, _ActionEventHandler＿main, this);
        SetPos(_arms.main)
        list_animation(_arms.main, "anim_roket")
        //______________________________________________________________________________________________

        bang = new Bang(pf_parsed)

        //_____________________________________________________________________________________________
        tablo.init(main_view)

        //______________________________________________________________________________________________
        main_view.addChild(_arms.ilon)

        stars = new Stars(app)

        //в проекте управление маской происходит - в коде ест ьпротупы если проект неактивен!!!!!!!!!!!!
        clip_mask = new ClipMask(main_view, _arms.main)

        app.ticker.add(() => {
            clip_mask.update(app, main_view,
                _arms.main,
                bang.getArmature(),
                stars);
        });

        _forces.set_up_roket()
        app.start();
        //____________________________
        start_anim(true)

    }


    var app = null;
    var main_view = null;

    this.init = () => {

        app = new PIXI.Application({
            antialias: true,
            view: document.getElementById("canvas"),
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
            width: CANVAS_SIZE.width,
            height: CANVAS_SIZE.height,
            autoStart: false,
            // transparent: true
        });

        if (window.HAS_DEBUG) {
            if (false) {
                app.stage.addChild(main_view = new PIXI.Container());

                main_view.interactive = true;
                main_view.buttonMode = true;
                main_view
                    .on('pointerdown', onDragStart)
                    .on('pointerup', onDragEnd)
                    .on('pointerupoutside', onDragEnd)
                    .on('pointermove', onDragMove);
            } else {
                // create viewport
                main_view = new Viewport.Viewport({
                    screenWidth: window.innerWidth,
                    screenHeight: window.innerHeight,
                    worldWidth: 1000,
                    worldHeight: 1000,

                    interaction: app.renderer.plugins.interaction // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
                })

                main_view
                    .on('pointerdown', onDragStart)
                    .on('pointerup', onDragEnd)
                // add the viewport to the stage
                app.stage.addChild(main_view)

                // activate plugins
                main_view
                    .drag()
                    .pinch()
                    .wheel()
                    .decelerate()

            }

            var _app_runing = true
            window.addEventListener(
                "keydown", event => {
                    if (event.key === " ") {
                        _app_runing = !_app_runing
                        if (_app_runing)
                            app.start()
                        else
                            app.stop()

                        event.preventDefault();
                    }
                }, false
            );

        } else {
            app.stage.addChild(main_view = new PIXI.Container())
        }

        onResizeWindow()


        PIXI.Loader.shared
            .add('skeleton', ASSETS.anim_ske)
            .add('texture_json', ASSETS.atlas_json)
            .add('texture_png', ASSETS.atlas_png)
            .load(_onAssetsLoaded);


        if (window.HAS_STATS) {
            var stats = new Stats();
            stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom

            stats.dom.style.left = '480px';
            document.body.appendChild(stats.dom)
            app.ticker.add(() => {
                stats.update();
            });
        }

        return this;
    }

    this.destroy = () => {
        /* while (app.stage.children[0]) {
            app.stage.removeChild(app.stage.children[0])
            spr.destroy({children: true, texture: true, baseTexture: false});
        } */

        app.destroy()
    }


    var _start_drag = -1
    function onDragStart(event) {
        _start_drag = Date.now()
        this.pos_start = event.data.getLocalPosition(this.parent);
        this.pos_start.x -= this.x;
        this.pos_start.y -= this.y;
        // store a reference to the data
        // the reason for this is because of multitouch
        // we want to track the movement of this particular touch
        this.data = event.data;
        this.alpha = 0.5;
        this.dragging = true;
    }

    function onDragEnd() {
        this.alpha = 1;
        this.dragging = false;
        // set the interaction data to null
        this.data = null;
        if (Date.now() - _start_drag <= 100) {
            this.x = this.y = 0;
            this.scale.set(1, 1)
        }
    }

    function onDragMove() {
        if (this.dragging) {
            const newPosition = this.data.getLocalPosition(this.parent);
            this.x = newPosition.x - this.pos_start.x;
            this.y = newPosition.y - this.pos_start.y;
        }
    }


    const canvas_container = document.getElementById('canvas-container')
    const ro = new ResizeObserver(entries => {
        resizeThrottler(entries.target)
    });
    ro.observe(canvas_container);

    var resizeTimeout;
    function resizeThrottler() {
        if (!resizeTimeout) {
            resizeTimeout = setTimeout(function () {
                resizeTimeout = null;
                onResizeWindow();
            }, 66);
        }
    }

    function onResizeWindow() {
        const new_width = canvas_container.clientWidth
        const new_height = new_width / CANVAS_SIZE.width * CANVAS_SIZE.height;

        app.renderer.resize(new_width, new_height)
        main_view.scale.set(new_width / CANVAS_SIZE.width);
        main_view.x = 0
        main_view.y = 0
    }


    return this;
};

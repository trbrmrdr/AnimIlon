
const HAS_DEBUG = false
const HAS_STATS = true

const DELAY_PRESSED_BTN = 920

const ANIM_Bang = {
    Bang: "взрыв",
    Loop: "цикл",
    Out: "выход"
}
const ANIM_Ilon = {
    Wait: "10_wait_(idle)",
    Wait_sbtn: "10_wait_(see_button)",
    Wait_swatch: "10_wait_(see_watch)",

    Press_Button: "20_press_button",
    Press_Button_Wait: "21_wait",
    Explosed_0: "31_explosed",

    RocketTakes_Start: "30_rocket_takes_off-start",
    RocketTakes_Wait: "31_wait",
    Explosed_1: "32_explosed",

    TwoHand_Start: "320_two_hands",
    TwoHand_Wait: "321_wait",
    Explosed_2: "33_explosed",

    Explosed_Wait: "40_wait",
    End: "41_to_end",
}

const ANIM_Button = {
    // Press: "press",
    Reload: "reload",
    Wait_Off: "wait_off",
    Wait_On: "wait_on",
    Wait_On_Idly: "wait_on_idly",

    Wait_static: "wait_static",
}

// Main_scene
const ANIM_Main_scene = {
    Wait: "wait",
    Reload: "reload",
    Start: "start",
    Fly: "fly",
    Fly_circle: "fly_circle",
}

const ANIM_Mask = {
    Wait: 'wait',
    Start: 'start'
}

const STAGE_NAMES = {
    Start: "Start",
    PressBtn: "Press_Button",
    RocketTakes: "Rockets_Takes",
    TwoHand: "Two_Hand",

    End_wait: "End_wait",
    End: "End",
}

const ANIM_Room = {
    Stop: "stop",
    Wait: "wait",
    Work: "work",
    Win: "win",
}

function Anim() {
    var _btn = {};

    // работали как кнопки с переходом на событие
    // теперь просто включатели события
    // завязаны на предыдущие события - будут работать только поочердёно
    function setStage(s_name, active = true) {
        try {
            _btn[s_name].style.backgroundColor = active ? "#86da86" : "";
        } catch (ex) {
            console.log(`active ${s_name}`)
        }
    }
    function clearStage() {
        Object.entries(_btn).forEach((el) => {
            el[1].style.backgroundColor = "";
            // el[1].style.opacity = 0.4;`
        })
    }

    function isActive(s_name, clear = true) {
        let ret = _btn[s_name].style.backgroundColor !== "";
        if (ret && clear) {
            setStage(s_name, false)
        }
        return ret;
    }

    function __debug_select_stage(s_name) {
        if (_btn[s_name].style.opacity < 1.) return;
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

    const list_animation = (armature, id_cont) => {
        if (HAS_DEBUG == false) {
            document.getElementById(id_cont).style.display = 'none'
            return
        }
        armature.animation._animationNames.forEach((animation_name) => {
            var btn = document.createElement("button");
            btn.innerHTML = animation_name;
            btn.addEventListener("click", () => { click_fun(armature, animation_name) });
            document.getElementById(id_cont).appendChild(btn);
        })
    }


    function start_anim(init = false) {
        if (init) {
            if (HAS_DEBUG == false) {
                document.getElementById("stages").style.display = 'none'
            }
            const add_btn = (name, enabled = false) => {
                const btn = _btn[name] = document.createElement("button");
                btn.innerHTML = name;
                // btn.style.opacity = enabled ? 1 : 0.4;
                btn.addEventListener("click", () => { __debug_select_stage(name) });
                if (HAS_DEBUG) {
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
    this.start_after = (_delay_ms) => {
        text_idly_anim()

        let _delay_to_start = Math.max(DELAY_PRESSED_BTN, _delay_ms - DELAY_PRESSED_BTN)
        console.log(`ANIM start_after = ${_delay_to_start}`)
        _time_to_start = Date.now() + _delay_to_start
        // console.log(_delay_to_start)


        // перемотка из грусной эмоции]
        if (isActive(STAGE_NAMES.End_wait, false)) {
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
        _room.setState(ANIM_Room.Work, true)
        _forces.PressBtn(true)
    }

    this.completed = () => {
        _room.setState(ANIM_Room.Stop, true)
        setStage(STAGE_NAMES.End_wait)
        _forces.Exploded(true)
    }

    this.set_win = (has_win) => {
        if (has_win)
            _room.setState(ANIM_Room.Win, true)
    }

    var _room = new (function () {

        var _has_win = false;

        // var _last_state = -1
        this.setState = (state, is_safe) => {
            // if (_last_state === state) return
            // _last_state = state
            if (is_safe && _time_to_start == -1) return

            _arms.text_сrach.visible = false;

            const factory = dragonBones.PixiFactory.factory;
            let knopka_slot = _arms.button.armature.getSlot("knopka_off");
            switch (state) {
                case ANIM_Room.Stop:
                    if (_has_win) {
                        _has_win = false
                        break
                    }

                    _arms.text_сrach.visible = true
                    _arms.text_сrach.text = "crash"
                    // _arms.text_сrach.x = _arms.text.x + _arms.text.width + 5
                    // _arms.text_сrach.y = _arms.text.y + _arms.text.height * 0.5

                    _arms.room.animation.play(ANIM_Room.Stop)
                    factory.replaceSlotDisplay("", "Button_state", "button", "stop", knopka_slot);
                    break;
                case ANIM_Room.Work:
                    if (_has_win) break
                    _arms.room.animation.play(ANIM_Room.Work)
                    factory.replaceSlotDisplay("", "Button_state", "button", "work", knopka_slot);
                    break;
                case ANIM_Room.Wait:
                    _has_win = false
                    _arms.room.animation.play(ANIM_Room.Wait)
                    factory.replaceSlotDisplay("", "Button_state", "button", "wait", knopka_slot);
                    break;
                case ANIM_Room.Win:
                    _has_win = true;
                    _arms.text_сrach.visible = true
                    _arms.text_сrach.text = "cash"

                    _arms.room.animation.play(ANIM_Room.Win)
                    factory.replaceSlotDisplay("", "Button_state", "button", "win", knopka_slot);
                    break;
            }

        }
    })()

    var f = [
        '',
        '.',
        '..',
        '...',
        ' ...',
        '  ...',
        '   ..',
        '    .',
        '     ',
    ];


    var _has_timer = false

    function text_idly_anim() {
        function loop() {

            _has_timer = _time_to_start + _time_press > 0
            if (_has_timer) {
                _room.setState(ANIM_Room.Wait)

                let now = Date.now()
                let left = _del_to_pressed
                if (_time_press !== 0)
                    left = (_time_press + _del_to_pressed) - now


                if (_time_to_start > 0) {
                    let elapsed = _time_to_start - now
                    // console.log(elapsed / 1000)
                    left += elapsed
                }
                _arms.text.text = `${(left / 1000).toFixed(2)}sec`
            }

            setTimeout(loop, 50);
        }
        loop();
    }

    const MAX_MULTIP = 3112.52
    this.setMultiplier = (tick, multip) => {
        _app.ticker.add(() => {

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
                //показываем только до первого подключения - после обязательно выключаем
                if (_time_to_start == -1)
                    _arms.text.text = f[Math.floor((Date.now() / 100) % f.length)];
                return
            }

            out_multip = Math.min(out_multip, MAX_MULTIP)

            _arms.text.text = `x${out_multip.toFixed(2)}`

        });
    }


    //переход на запуск сейчас
    var _forces = new (function () {

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
                console.log("-loong")
            }
            console.log("посмотрит на часы через", _show_see - now)
            if (now >= _show_see) {
                _show_see *= 99 ** 9
                _arms.ilon.animation.play(ANIM_Ilon.Wait_swatch);
                return;
            }
            _arms.ilon.animation.play(ANIM_Ilon.Wait_sbtn);
        }

        this.hide_bang = () => {
            if (_arms.bang.visible === true) {
                _arms.bang.animation.play(ANIM_Bang.Out)
                _arms.main.animation.play(ANIM_Main_scene.Reload);
            }
        }

        this.set_up_button = () => {
            if (_arms.button.animation.lastAnimationState &&
                [
                    ANIM_Button.Wait_On,
                    ANIM_Button.Wait_On_Idly,
                    ANIM_Button.Wait_static
                ].includes(_arms.button.animation.lastAnimationState.name)
            ) return;

            _room.setState(ANIM_Room.Wait)
            _arms.button.animation.play(ANIM_Button.Reload);
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
                _room.setState(ANIM_Room.Work)
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
            _arms.button.animation.play(ANIM_Button.Wait_Off);
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
                _arms.bang.visible = true

                if (_main_scene_is_started) {
                    _arms.main.animation.play(ANIM_Main_scene.Wait);
                    _arms.bang.animation.play(ANIM_Bang.Loop);
                    _safe_bang = true
                } else {
                    _arms.bang.animation.play(ANIM_Bang.Bang)
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
                if (_time_to_start > 0 && isActive(STAGE_NAMES.PressBtn, false)) {
                    let elapsed = _time_to_start - Date.now()
                    if (elapsed <= 2500) {
                        console.log('elapsed', elapsed)
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
                if (isActive(STAGE_NAMES.RocketTakes)) {
                    _forces.RoketTakes()
                    break;
                }

                PIXI.Ticker.shared.speed = 1;
                // if (event.animationState.name !== ANIM_Ilon.Press_Button_Wait)
                _arms.ilon.animation.play(ANIM_Ilon.Press_Button_Wait);
                _arms.button.visible = true
                _arms.button.animation.play(ANIM_Button.Wait_Off);
                break;

            case ANIM_Ilon.RocketTakes_Start:
            case ANIM_Ilon.RocketTakes_Wait:
                if (
                    isActive(STAGE_NAMES.End_wait, false) ||
                    isActive(STAGE_NAMES.End, false)
                ) {
                    _forces.Exploded()
                    break
                }
                if (isActive(STAGE_NAMES.TwoHand)) {
                    _forces.TwoHand()
                    break;
                }
                // if (event.animationState.name !== ANIM_Ilon.RocketTakes_Wait)
                _arms.ilon.animation.play(ANIM_Ilon.RocketTakes_Wait);
                break;
            case ANIM_Ilon.TwoHand_Start:
            case ANIM_Ilon.TwoHand_Wait:
                if (
                    isActive(STAGE_NAMES.End_wait, false) ||
                    isActive(STAGE_NAMES.End, false)
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
                if (isActive(STAGE_NAMES.End)) {
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

    function _ActionEventHandler＿button(event) {
        // console.log(event)
        switch (event.animationState.name) {
            case ANIM_Button.Reload:
                _arms.button.animation.play(ANIM_Button.Wait_On_Idly);
                break;
            case ANIM_Button.Wait_On:
            case ANIM_Button.Wait_On_Idly:
                if (isActive(STAGE_NAMES.PressBtn, false)) {
                    // _arms.button.animation.play(ANIM_Button.Wait_static);
                    break;
                }
                if (event.animationState.name !== ANIM_Button.Wait_On_Idly)
                    _arms.button.animation.play(ANIM_Button.Wait_On_Idly);
                else
                    _arms.button.animation.play(ANIM_Button.Wait_On);
                break;
            // case ANIM_Button.Press:
            case ANIM_Button.Wait_Off:
                // _arms.button.visible = true;
                break;
        }
    }

    var _main_scene_is_started = false
    function _ActionEventHandler＿main(event) {
        _main_scene_is_started = false;
        switch (event.animationState.name) {
            case ANIM_Main_scene.Reload:
                _star_is_work = false;
                _arms.main.animation.play(ANIM_Main_scene.Wait);
                break;
            case ANIM_Main_scene.Start:
                _arms.main.animation.play(ANIM_Main_scene.Fly);
                _star_is_work = true;
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

    function _ActionEventHandler＿Mask(event) {
        switch (event.animationState.name) {
            case ANIM_Mask.Wait:
                // -будет закикливание так как анимашка 1 кдровая
                _arms.mask.animation.stop()
                console.log("mask_stop")
                break;
            case ANIM_Mask.Start:
                _arms.mask.animation.play(ANIM_Mask.Wait);
                break;
        }
    }

    var _safe_bang = false
    function _ActionEventHandler＿Bang(event) {
        switch (event.animationState.name) {
            case ANIM_Bang.Bang:
                // if (_safe_bang) {
                _arms.bang.animation.play(ANIM_Bang.Loop);
                // } else {
                // _arms.bang.animation.play(ANIM_Bang.Out);
                // _arms.main.animation.play(ANIM_Main_scene.Reload);
                // }
                break
            case ANIM_Bang.Loop:
                _arms.bang.animation.play(ANIM_Bang.Loop);
                break;
            case ANIM_Bang.Out:
                _arms.bang.visible = false;
                _arms.bang.animation.stop()
                break;
        }
    }

    function _set_pos(armature) {
        //arm_ilon.scale.set(0.5);
        armature.x = _config.width * 0.5 * armature.scale.x;
        armature.y = _config.height * 0.5 * armature.scale.y;
    }

    var _back = {
        grad: null,
        width: 600,
        height: 4247,

        earth: null,
    };

    var _arms = {
        main: null,
        button: null,
        lon: null,
        bang: null,


        mask: null,
        mask_objs: new (function () {

            var rt_mask = null;
            var rt_roket_zone = null;
            var _update = false;

            this.update = () => {
                if (!_update) return
                if (!_arms.mask) return

                //маска иногда недоигрывает до конца - и режит не всё
                // if (_arms.mask.animation.lastAnimationName == ANIM_Mask.Start
                //     && _arms.mask.animation.isPlaying == false)
                //     _arms.mask.animation.play(ANIM_Mask.Wait);
                _set_pos(_arms.mask)//маску вытащил из анимации - контролируем её в коде
                // _rt_s.x = -100
                // _rt_s.y = 100
                // _arms.mask.mask = _rt_s

                _stage.setChildIndex(rt_mask.s, _stage.children.length - 1)
                _app.renderer.render(_arms.mask, rt_mask.rt);


                _stage.setChildIndex(rt_roket_zone.s, _stage.children.length - 1)

                _app.renderer.render(_star_container, rt_roket_zone.rt);
                _app.renderer.render(_arms.main, rt_roket_zone.rt, false);
                _app.renderer.render(_arms.bang, rt_roket_zone.rt, false);

                // _arms.main.mask = rt_mask.s
                // _arms.bang.mask = rt_mask.s
                rt_roket_zone.s.mask = rt_mask.s

                // console.log(_arms.main.animation);
            }

            function create_rt() {
                const baseRenderTexture = new PIXI.BaseRenderTexture({
                    width: _config.width,
                    height: _config.height
                });
                // const baseRenderTexture = new PIXI.BaseRenderTexture(width, height, PIXI.SCALE_MODES.LINEAR, 1);
                var _rt_mask = new PIXI.RenderTexture(baseRenderTexture);
                var _rt_s_mask = new PIXI.Sprite(_rt_mask);
                return {
                    rt: _rt_mask,
                    s: _rt_s_mask,
                }
            }

            this.init = () => {

                rt_mask = create_rt()
                rt_roket_zone = create_rt()

                // const gradBaseTexture = new PIXI.BaseTexture(new GradientResource());
                // gradBaseTexture.setSize(1, _back.height);

                createStar()
                _stage.addChild(
                    rt_mask.s,
                    rt_roket_zone.s
                    // createStar(),
                    // _arms.main,
                    // _arms.bang,
                );

                _update = true;

                _forces.set_up_roket()

                _app.ticker.add(_arms.mask_objs.update);

            }

        }
        )()
    };

    var _star_container,
        _star_is_work = false;
    function createStar() {

        const star_width = _config.width,
            star_height = _config.height


        // Create a ParticleContainer for stars
        var numStars = 1500;

        _star_container = new PIXI.Container()

        var particle_containter = new PIXI.ParticleContainer(numStars, {
            vertices: true,
            position: true,
            rotation: false,
            uvs: false,
            tint: true
        });



        var fon = PIXI.Sprite.from('/data/10px_back.jpg')
        fon.scale.set(100)
        fon.x = 0

        _star_container.addChild(fon, particle_containter)

        const starTexture = PIXI.Texture.from('/data/star.png');//128
        // Create our star sprites
        var star;
        for (var i = 0; i < numStars; i++) {
            // const starTexture = PIXI.Texture.from(`/data/stars/s__(${1 + Math.round(Math.random() * 140)}).png`);
            //1-3 px

            // Make star speed & size scale non-linearly - there should be more far away than close
            let scaleFactor = Math.pow(i, 3) / Math.pow(numStars, 3)
            scaleFactor *= .3
            // Create a star sprite
            let star = new PIXI.Sprite(starTexture);
            star.anchor.set(0.5);
            // Make stars progressively bigger as we add them, effectively z-sorting
            star.scale.set((scaleFactor / 20) + 0.01);
            star.dLife = scaleFactor * 100
            // Make sure larger stars move faster
            star.dy = 5 * scaleFactor;
            star.factor = 1
            star.increment = Math.random() * .003

            // Move the stars to a random location on the screen
            star.position.x = Math.random() * star_width;
            star.position.y = Math.random() * star_height;
            particle_containter.addChild(star);


        }


        function resetStar(star) {
            star.position.x = Math.random() * star_width;
            star.position.y -= Math.sign(fieldSpeed) * star_height;
        }

        var fieldSpeed = .3
        _app.ticker.add(function (delta) {
            if (!_star_is_work) return;

            particle_containter.children.map(star => {

                if (star.alpha > 1) {
                    star.factor = -1;
                }
                else if (star.alpha <= 0) {
                    star.factor = 1;

                }

                // star.alpha += star.increment * star.factor;

                if (star.scale.x <= 0.02)
                    star.alpha = Math.sin(Date.now() * star.increment + star.dLife)

                star.position.y += ((star.dy + 2) * fieldSpeed) * delta;
                if (star.position.y < 0 || star.position.y > star_height) {
                    resetStar(star);
                }
            });

        });


        return _star_container
    }




    function _onAssetsLoaded(loader, res) {

        const factory = dragonBones.PixiFactory.factory;

        factory.parseDragonBonesData(res.skeleton.data);
        factory.parseTextureAtlasData(res.texture_json.data, res.texture_png.texture);

        //______________________________________________________________________________________________
        _arms.ilon = factory.buildArmatureDisplay('Ilon');
        _arms.ilon.on(dragonBones.EventObject.LOOP_COMPLETE, _ActionEventHandler＿ilon, this);
        // arm_ilon.on(dragonBones.EventObject.COMPLETE, _ActionEventHandler＿ilon, this);
        _set_pos(_arms.ilon)
        list_animation(_arms.ilon, "anim_ilon")

        //______________________________________________________________________________________________

        _arms.room = factory.buildArmatureDisplay('Room');
        // _arms.room.on(dragonBones.EventObject.LOOP_COMPLETE, _ActionEventHandler__room, this);
        _set_pos(_arms.room)

        //______________________________________________________________________________________________

        //кнопки
        _arms.ilon.children.forEach((el) => {
            if (_arms.button) return
            if (el instanceof dragonBones.PixiArmatureDisplay) {
                if (el.armature.name == "Button") {
                    _arms.button = el
                }
            }
        })
        _arms.button.on(dragonBones.EventObject.LOOP_COMPLETE, _ActionEventHandler＿button, this);
        list_animation(_arms.button, "anim_button")

        _arms.text_сrach = new PIXI.Text('crash', new PIXI.TextStyle({
            fontFamily: 'Bahnschrift',
            fontSize: 40,
            fontWeight: 'bold',
            fill: '#ffffff'
        }));
        _arms.text_сrach.visible = false
        _arms.text_сrach.x = 415;
        _arms.text_сrach.y = 94;

        _room.setState(ANIM_Room.Wait)

        //______________________________________________________________________________________________

        _arms.main = factory.buildArmatureDisplay('Main_scene');
        _arms.main.on(dragonBones.EventObject.LOOP_COMPLETE, _ActionEventHandler＿main, this);
        _set_pos(_arms.main)
        list_animation(_arms.main, "anim_roket")


        //люютый косяк - но по другому никак ненайти внутренни объект - 
        //в проекте управление маской происходит - в коде ест ьпротупы если проект неактивен!!!!!!!!!!!!
        _arms.main.children.forEach((el) => {
            if (_arms.mask) return
            if (el instanceof dragonBones.PixiArmatureDisplay) {
                if (el.armature.name == "Mask") {
                    _arms.mask = el
                }
            }
        })
        // _arms.mask = factory._dragonBonesDataMap['Ilon'].armatures['Mask']
        // var t_id = factory._dragonBonesDataMap['Ilon'].armatures['Mask'].hashCode
        // // console.log(factory.a    rmatures['Main_scene'].bones)
        // _arms.main.armature.getSlots().forEach((el) => {
        //     console.log(el.hashCode)
        //     if (t_id == el.hashCode)
        //         console.log(el.hashCode)
        // })
        // _arms.main.children.forEach((el) => {
        //     console.log(el.hashCode)
        //     // if(el instanceof PixiArmatureDisplay)

        // })

        // _arms.mask = factory.buildArmatureDisplay('Mask');
        // _arms.mask.on(dragonBones.EventObject.LOOP_COMPLETE, _ActionEventHandler＿Mask, this);
        // _set_pos(_arms.mask)

        //______________________________________________________________________________________________

        _arms.bang = factory.buildArmatureDisplay('Bang');
        _arms.bang.on(dragonBones.EventObject.LOOP_COMPLETE, _ActionEventHandler＿Bang, this);
        _set_pos(_arms.bang)
        list_animation(_arms.bang, "anim_Bang")


        //______________________________________________________________________________________________
        const style = new PIXI.TextStyle({
            fontFamily: 'Bahnschrift',
            fontSize: 75,
            fontWeight: 'bold',
            // fontVariant: "small-caps",
            fill: '#ffffff',
            letterSpacing: 2,
            // align: "center",


            // fill: "white",
            // // letterSpacing: 9,
            // lineJoin: "bevel",
            // stroke: "#4a4b7a",
            // strokeThickness: 11,

            // align:"left"
        });

        _arms.text = new PIXI.Text('х3112.52', style);
        _arms.text.x = 218;
        _arms.text.y = 100;

        //______________________________________________________________________________________________

        _stage.addChild(
            _arms.room,
            _arms.text,
            _arms.ilon,
            _arms.text_сrach
        )

        _arms.mask_objs.init()

        // const roket_place = PIXI.Sprite.from('roket_place.png');
        // roket_place.anchor.set(0.5);
        // roket_place.x = 500
        // roket_place.y = 280

        // PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;
        _app.start();
        //____________________________
        start_anim(true)


        var _app_runing = true
        window.addEventListener(
            "keydown", event => {
                if (event.key === " ") {
                    _app_runing = !_app_runing
                    if (_app_runing)
                        _app.start()
                    else
                        _app.stop()

                    event.preventDefault();
                }
            }, false
        );

    }

    function click_fun(armature, name_anim) {
        console.log(name_anim, "______")
        armature.visible = true;
        armature.animation.play(name_anim)

        // if (//armature == _arms.main &&
        //     name_anim == ANIM_Main_scene.Start)
        //     _arms.mask.animation.play(ANIM_Mask.Start);
    }


    const _config = {
        width: 840,//420,
        height: 562,//281,
    }
    var _app = null;
    var _stage = null;

    // const stage = new PIXI.Container();
    // const renderer = PIXI.autoDetectRenderer({
    //     width: config.width,
    //     height: config.height,
    //     transparent: true
    // })
    // renderer.view.id = 'pixi_canvas'

    var main_div = document.getElementById('canvas-container');

    this.init = () => {

        _app = new PIXI.Application({
            antialias: true,
            view: document.getElementById("canvas"),
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
            width: _config.width,
            height: _config.height
            // transparent: true
        });
        _app.stop();

        if (HAS_DEBUG) {
            if (false) {
                _app.stage.addChild(_stage = new PIXI.Container());

                _stage.interactive = true;
                _stage.buttonMode = true;
                _stage
                    .on('pointerdown', onDragStart)
                    .on('pointerup', onDragEnd)
                    .on('pointerupoutside', onDragEnd)
                    .on('pointermove', onDragMove);
            } else {
                // create viewport
                _stage = new Viewport.Viewport({
                    screenWidth: window.innerWidth,
                    screenHeight: window.innerHeight,
                    worldWidth: 1000,
                    worldHeight: 1000,

                    interaction: _app.renderer.plugins.interaction // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
                })

                _stage
                    .on('pointerdown', onDragStart)
                    .on('pointerup', onDragEnd)
                // add the viewport to the stage
                _app.stage.addChild(_stage)

                // activate plugins
                _stage
                    .drag()
                    .pinch()
                    .wheel()
                    .decelerate()

            }
        } else {
            _app.stage.addChild(_stage = new PIXI.Container())
        }

        onResizeWindow()


        PIXI.Loader.shared
            .add('skeleton', '/data/Ilon_ske.json')
            .add('texture_json', '/data/Ilon_tex.json')
            .add('texture_png', '/data/Ilon_tex.png')
            .load(_onAssetsLoaded);


        if (HAS_STATS) {
            var stats = new Stats();
            stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom

            stats.dom.style.left = "480px";
            document.body.appendChild(stats.dom)
            _app.ticker.add(() => {
                stats.update();
            });
        }

        return this;
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

    //____resize
    window.addEventListener("resize", resizeThrottler, false);
    var resizeTimeout;
    function resizeThrottler() {
        // ignore resize events as long as an actualResizeHandler execution is in the queue
        if (!resizeTimeout) {
            resizeTimeout = setTimeout(function () {
                resizeTimeout = null;
                onResizeWindow();

                // The actualResizeHandler will execute at a rate of 15fps
            }, 66);
        }
    }
    //____resize

    function onResizeWindow() {
        // console.log(`${main_div.clientWidth} x ${main_div.clientHeight}`)

        var _width = main_div.clientWidth
        var _height = _width / _config.width * _config.height;

        _app.renderer.resize(_width, _height)
        // console.log('->' + _width + ' x ' + _height)

        // _app.view.style.width = `${_app.view.width}px`
        // app.view.width = _width

        // _app.view.style.height = `${_app.view.height}px`
        // app.view.height = _height
        _stage.scale.set(_width / _config.width);
        _stage.x = 0
        _stage.y = 0
    }
    return this;
};

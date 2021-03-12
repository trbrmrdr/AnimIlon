/*
В общем по файлу и его исопльзованиях - разнести бы по подфайликам.
@todo И самое главное - нейминг.
 */
window.HAS_DEBUG = false
window.HAS_STATS = false

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
    Wait_On_static: "wait_static",
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

const CANVAS_SIZE = {
    width: 840,//420,
    height: 562,//281,
    ///375x187
}

const MAX_MULTIP = 3112.52

function SetPos(armature) {
    //arm_ilon.scale.set(0.5);
    armature.x = CANVAS_SIZE.width * 0.5 * armature.scale.x;
    armature.y = CANVAS_SIZE.height * 0.5 * armature.scale.y;
}

function __debug_play_anim(armature, name_anim) {
    console.log(name_anim, "______")
    armature.visible = true;
    armature.animation.play(name_anim)

    // if (//armature == _arms.main &&
    //     name_anim == ANIM_Main_scene.Start)
    //     _arms.mask.animation.play(ANIM_Mask.Start);
}

function list_animation(armature, id_cont) {
    if (!window.HAS_DEBUG) return

    const main_parent = document.getElementById('anim_btns')
    let parent = document.getElementById(id_cont)
    if (parent) {
        parent.parentNode.removeChild(parent)
    }

    main_parent.appendChild(parent = document.createElement("div"))
    parent.id = id_cont
    parent.classList = ['debug_btn']
    parent.innerHTML = `${id_cont}<br>`

    armature.animation._animationNames.forEach((animation_name) => {
        var btn = document.createElement("button");
        btn.innerHTML = animation_name;
        btn.addEventListener("click", () => { __debug_play_anim(armature, animation_name) });
        parent.appendChild(btn);
    })
}


function create_rt(size) {
    const baseRenderTexture = new PIXI.BaseRenderTexture({
        width: size.width,
        height: size.height
    });

    const rt = new PIXI.RenderTexture(baseRenderTexture)
    return {
        rt: rt,
        sprite: new PIXI.Sprite(rt),
    }
}

function drawCircle(x, y, radius, fillColor, lineWidth, lineColor ) {
    const circle = new PIXI.Graphics();

    if (fillColor) {
        circle.beginFill(fillColor);
    }

    if (lineColor && lineWidth) {
        circle.lineStyle(lineWidth, lineColor);
    }

    circle.drawCircle(x, y, radius);
    circle.endFill();

    return circle;
}
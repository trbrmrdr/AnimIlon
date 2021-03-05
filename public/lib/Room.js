function Room(main_anim) {


    var _has_win = false;
    var _room_armature, _button_armature;
    const _anim = main_anim

    this.setUp = () => {
        if (_button_armature.animation.lastAnimationState &&
            [
                ANIM_Button.Wait_On,
                ANIM_Button.Wait_On_Idly,
                ANIM_Button.Wait_static
            ].includes(_button_armature.animation.lastAnimationState.name)
        ) return false;

        _setState(ANIM_Room.Wait)
        _button_armature.animation.play(ANIM_Button.Reload);
        return true;
    }


    this.Off = () => {
        // _button_armature.visible = true
        _button_armature.animation.play(ANIM_Button.Wait_Off);
    }

    function _setState(state, is_safe) {
        if (is_safe && !_anim.hasConnected()) return
        const factory = dragonBones.PixiFactory.factory;
        let knopka_slot = _button_armature.armature.getSlot("knopka_off");
        switch (state) {
            case ANIM_Room.Stop:
                if (_has_win) {
                    _has_win = false
                    break
                }

                _room_armature.animation.play(ANIM_Room.Stop)
                factory.replaceSlotDisplay("", "Button_state", "button", "stop", knopka_slot);
                break;
            case ANIM_Room.Work:
                if (_has_win) break
                _room_armature.animation.play(ANIM_Room.Work)
                factory.replaceSlotDisplay("", "Button_state", "button", "work", knopka_slot);
                break;
            case ANIM_Room.Wait:
                _has_win = false
                _room_armature.animation.play(ANIM_Room.Wait)
                factory.replaceSlotDisplay("", "Button_state", "button", "wait", knopka_slot);
                break;
            case ANIM_Room.Win:
                _has_win = true;

                _room_armature.animation.play(ANIM_Room.Win)
                factory.replaceSlotDisplay("", "Button_state", "button", "win", knopka_slot);
                break;
        }

    }
    this.setState = _setState

    function _ActionEventHandler＿button(event) {
        // console.log(event)
        switch (event.animationState.name) {
            case ANIM_Button.Reload:
                _button_armature.animation.play(ANIM_Button.Wait_On_Idly);
                break;
            case ANIM_Button.Wait_On:
            case ANIM_Button.Wait_On_Idly:
                if (_anim.isActive(STAGE_NAMES.PressBtn, false)) {
                    // _button_armature.animation.play(ANIM_Button.Wait_static);
                    break;
                }
                if (event.animationState.name !== ANIM_Button.Wait_On_Idly)
                    _button_armature.animation.play(ANIM_Button.Wait_On_Idly);
                else
                    _button_armature.animation.play(ANIM_Button.Wait_On);
                break;
            // case ANIM_Button.Press:
            case ANIM_Button.Wait_Off:
                // _button_armature.visible = true;
                break;
        }
    }

    this.init = (factory_parsing_resources, container, ilon_armature) => {
        _room_armature = factory_parsing_resources.buildArmatureDisplay('Room');
        SetPos(_room_armature)

        container.addChild(_room_armature)

        //кнопки
        ilon_armature.children.forEach((el) => {
            if (_button_armature) return
            if (el instanceof dragonBones.PixiArmatureDisplay) {
                if (el.armature.name == "Button") {
                    _button_armature = el
                }
            }
        })
        _button_armature.on(dragonBones.EventObject.LOOP_COMPLETE, _ActionEventHandler＿button, this);
        // list_animation(_button_armature, "anim_button")


        this.setState(ANIM_Room.Wait)
    }


    return this
}
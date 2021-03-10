function Room(anim) {


    var is_win = false;
    var room_armature, button_armature;
    const main_anim = anim

    this.setUp = () => {
        // @todo Лучше через optional chaining:
        // [].includes(_button_armature.animation.lastAnimationState?.name)
        if (button_armature.animation.lastAnimationState &&
            [
                // @todo Не шибко объясняет, какое поведение содержит
                // Что-то вроде roomButtonAnimation.waitOnState
                ANIM_Button.Wait_On,
                ANIM_Button.Wait_On_Idly,
                ANIM_Button.Wait_static
            ].includes(button_armature.animation.lastAnimationState.name)
        ) {
            return false;
        }

        _setState(ANIM_Room.Wait)
        button_armature.animation.play(ANIM_Button.Reload);
        return true;
    }


    this.Off = () => {
        // _button_armature.visible = true
        button_armature.animation.play(ANIM_Button.Wait_Off);
    }

    function _setState(state, is_safe) {
        if (!button_armature) return
        if (is_safe && !main_anim.hasConnected()) return
        const factory = dragonBones.PixiFactory.factory;
        // @todo Button, не knopka
        let knopka_slot = button_armature.armature.getSlot("knopka_off");
        // @todo Не похоже, что тут нужен switch
        switch (state) {
            case ANIM_Room.Stop:
                if (is_win) {
                    is_win = false
                    break
                }

                room_armature.animation.play(ANIM_Room.Stop)
                factory.replaceSlotDisplay("", "Button_state", "button", "stop", knopka_slot);
                break;
            case ANIM_Room.Work:
                if (is_win) break
                room_armature.animation.play(ANIM_Room.Work)
                factory.replaceSlotDisplay("", "Button_state", "button", "work", knopka_slot);
                break;
            case ANIM_Room.Wait:
                is_win = false
                room_armature.animation.play(ANIM_Room.Wait)
                factory.replaceSlotDisplay("", "Button_state", "button", "wait", knopka_slot);
                break;
            case ANIM_Room.Win:
                is_win = true;

                room_armature.animation.play(ANIM_Room.Win)
                factory.replaceSlotDisplay("", "Button_state", "button", "win", knopka_slot);
                break;
        }

    }
    this.setState = _setState

    function _ActionEventHandler＿button(event) {
        // console.log(event)
        switch (event.animationState.name) {
            case ANIM_Button.Reload:
                button_armature.animation.play(ANIM_Button.Wait_On_Idly);
                break;
            case ANIM_Button.Wait_On:
            case ANIM_Button.Wait_On_Idly:
                if (main_anim.isActive(STAGE_NAMES.PressBtn, false)) {
                    // _button_armature.animation.play(ANIM_Button.Wait_static);
                    break;
                }
                if (event.animationState.name !== ANIM_Button.Wait_On_Idly)
                    button_armature.animation.play(ANIM_Button.Wait_On_Idly);
                else
                    button_armature.animation.play(ANIM_Button.Wait_On);
                break;
            // case ANIM_Button.Press:
            case ANIM_Button.Wait_Off:
                // _button_armature.visible = true;
                break;
        }
    }

    this.init = (factory_parsing_resources, container, ilon_armature) => {
        room_armature = factory_parsing_resources.buildArmatureDisplay('Room');
        SetPos(room_armature)

        container.addChild(room_armature)

        //кнопки
        ilon_armature.children.forEach((el) => {
            if (button_armature) return
            if (el instanceof dragonBones.PixiArmatureDisplay) {
                if (el.armature.name == "Button") {
                    button_armature = el
                }
            }
        })
        button_armature.on(dragonBones.EventObject.LOOP_COMPLETE, _ActionEventHandler＿button, this);
        // list_animation(_button_armature, "anim_button")


        this.setState(ANIM_Room.Wait)
    }


    return this
}
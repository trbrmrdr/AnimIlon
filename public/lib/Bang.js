function Bang(factory_parsing_resources) {


    this.getArmature = () => {
        return explosion_armature
    }

    function _ActionEventHandler＿Bang(event) {
        switch (event.animationState.name) {
            case ANIM_Bang.Bang:
                explosion_armature.animation.play(ANIM_Bang.Loop);
                break
            case ANIM_Bang.Loop:
                explosion_armature.animation.play(ANIM_Bang.Loop);
                break;
            case ANIM_Bang.Out:
                explosion_armature.visible = false;
                explosion_armature.animation.stop()
                break;
        }
    }

    this.Hide = () => {
        if (explosion_armature.visible === true) {
            explosion_armature.animation.play(ANIM_Bang.Out)
            return true
        }
        return false
    }

    this.toLoop = () => {
        explosion_armature.visible = true
        explosion_armature.animation.play(ANIM_Bang.Loop);
    }
    this.toBang = () => {
        explosion_armature.visible = true
        explosion_armature.animation.play(ANIM_Bang.Bang)
    }

    const explosion_armature = factory_parsing_resources.buildArmatureDisplay('Bang');
    explosion_armature.on(dragonBones.EventObject.LOOP_COMPLETE, _ActionEventHandler＿Bang, this);
    SetPos(explosion_armature)
    // list_animation(_bang_armature, "anim_Bang")

    return this
}
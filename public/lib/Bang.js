function Bang(factory_parsing_resources) {


    var _bang_armature;
    this.getArmature = () => {
        return _bang_armature
    }

    function _ActionEventHandler＿Bang(event) {
        switch (event.animationState.name) {
            case ANIM_Bang.Bang:
                _bang_armature.animation.play(ANIM_Bang.Loop);
                break
            case ANIM_Bang.Loop:
                _bang_armature.animation.play(ANIM_Bang.Loop);
                break;
            case ANIM_Bang.Out:
                _bang_armature.visible = false;
                _bang_armature.animation.stop()
                break;
        }
    }

    this.Hide = () => {
        if (_bang_armature.visible === true) {
            _bang_armature.animation.play(ANIM_Bang.Out)
            return true
        }
        return false
    }

    this.toLoop = () => {
        _bang_armature.visible = true
        _bang_armature.animation.play(ANIM_Bang.Loop);
    }
    this.toBang = () => {
        _bang_armature.visible = true
        _bang_armature.animation.play(ANIM_Bang.Bang)
    }

    _bang_armature = factory_parsing_resources.buildArmatureDisplay('Bang');
    _bang_armature.on(dragonBones.EventObject.LOOP_COMPLETE, _ActionEventHandler＿Bang, this);
    SetPos(_bang_armature)
    // list_animation(_bang_armature, "anim_Bang")

    return this
}
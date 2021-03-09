/*
@todo Протупы неизбежны, надо подписываться на visibilitychange и менять стейт:
не делать ничего вообще, если не активо и вывести из гибернации в актуальном состоянии при фокусе

По коду ниже слонжо что-то сказать, мало что понятно
 */
function ClipMask(container, main_scene_armature) {

    var _rt_mask, _rt_roket_zone, _mask_armature;

    this.update = (
        app, container,
        main_scene_armature,
        bang_armature,
        stars) => {

        SetPos(_mask_armature)

        container.setChildIndex(_rt_mask.sprite, container.children.length - 1)
        app.renderer.render(_mask_armature, _rt_mask.rt);

        container.setChildIndex(_rt_roket_zone.sprite, container.children.length - 1)

        app.renderer.render(stars.getContainer(), _rt_roket_zone.rt);
        app.renderer.render(main_scene_armature, _rt_roket_zone.rt, false);
        app.renderer.render(bang_armature, _rt_roket_zone.rt, false);

        // _arms.main.mask = rt_mask.s
        // _arms.bang.mask = rt_mask.s
        _rt_roket_zone.sprite.mask = _rt_mask.sprite

        // console.log(_arms.main.animation);
    }

    function create_rt() {
        const baseRenderTexture = new PIXI.BaseRenderTexture({
            width: CANVAS_SIZE.width,
            height: CANVAS_SIZE.height
        });

        const rt = new PIXI.RenderTexture(baseRenderTexture)
        return {
            rt: rt,
            sprite: new PIXI.Sprite(rt),
        }
    }


    main_scene_armature.children.forEach((el) => {
        if (_mask_armature) return
        if (el instanceof dragonBones.PixiArmatureDisplay) {
            if (el.armature.name == "Mask") {
                _mask_armature = el
            }
        }
    })


    _rt_mask = create_rt()
    _rt_roket_zone = create_rt()

    container.addChild(
        _rt_mask.sprite,
        _rt_roket_zone.sprite
        // createStar(),
        // _arms.main,
        // _arms.bang,
    );

    return this
}
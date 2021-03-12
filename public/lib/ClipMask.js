/*
@todo Протупы неизбежны, надо подписываться на visibilitychange и менять стейт:
не делать ничего вообще, если не активо и вывести из гибернации в актуальном состоянии при фокусе

По коду ниже слонжо что-то сказать, мало что понятно
 */
function ClipMask(container, roket_scene_armature) {

    var mask_armature;

    this.update = (
        app, container,
        roket_scene_armature,
        bang_armature,
        stars) => {

        SetPos(mask_armature)

        container.setChildIndex(rt_mask.sprite, container.children.length - 1)
        app.renderer.render(mask_armature, rt_mask.rt);

        container.setChildIndex(rt_roket_zone.sprite, container.children.length - 1)

        app.renderer.render(stars.getContainer(), rt_roket_zone.rt);
        app.renderer.render(roket_scene_armature, rt_roket_zone.rt, false);
        app.renderer.render(bang_armature, rt_roket_zone.rt, false);

        rt_roket_zone.sprite.mask = rt_mask.sprite
    }

    


    roket_scene_armature.children.forEach((el) => {
        if (mask_armature) return
        if (el instanceof dragonBones.PixiArmatureDisplay) {
            if (el.armature.name == "Mask") {
                mask_armature = el
            }
        }
    })


    const rt_mask = create_rt(CANVAS_SIZE)
    const rt_roket_zone = create_rt(CANVAS_SIZE)

    container.addChild(
        rt_mask.sprite,
        rt_roket_zone.sprite
        // createStar(),
        // _arms.main,
        // _arms.bang,
    );

    return this
}
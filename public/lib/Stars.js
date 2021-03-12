// @todo Не хватает описания того, что происходит в контейнере человекопонятным языком
function Stars(app) {

    const fieldSpeed = .3,
        star_width = CANVAS_SIZE.width * 0.4,
        star_height = CANVAS_SIZE.height,
        container = new PIXI.Container(),
        numStars = 400,
        count_layer = 5

    this.getContainer = () => { return container; }

    this.setEnable = (enable) => {
        container.renderable = enable
    }

    // @todo Все ассеты нужно вынести в какой-нибудь реестр или синглотон, чтобы не плодить сущности.
    const fon = PIXI.Sprite.from(ASSETS.black_back)
    fon.scale.set(100)
    fon.x = 0

    container.addChild(fon)

    //раскоментим тут и либо частицы либо слои будут работать 
    var particle_containter  /* = new PIXI.ParticleContainer(numStars, {
        vertices: true,
        position: true,
        rotation: false,
        uvs: false,
        tint: true
    }); 
    */

    if (particle_containter) {
        container.addChild(particle_containter)
        particle_containter.x = CANVAS_SIZE.width - star_width
    } else {
        Array.from({ length: count_layer }, (v, i) => {
            let layer_star = create_rt({ width: star_width, height: star_height })

            layer_star.sprite.position.x = CANVAS_SIZE.width - star_width
            let scaleFactor = Math.pow(i, 3) / Math.pow(count_layer, 3)
            scaleFactor *= .3
            layer_star.sprite.dy = 5 * scaleFactor;

            layer_star.sprite.data = layer_star
            container.addChild(layer_star.sprite)

            let layer_star_2 = create_rt({ width: star_width, height: star_height })
            layer_star_2.sprite.position.x = layer_star.sprite.position.x
            layer_star_2.sprite.position.y = -star_height
            layer_star_2.sprite.dy = layer_star.sprite.dy
            layer_star_2.sprite.data = layer_star_2
            container.addChild(layer_star_2.sprite)
        })
    }

    const starTexture = PIXI.Texture.from(ASSETS.star);
    for (var i = 0; i < numStars; i++) {
        let scaleFactor = Math.pow(i, 3) / Math.pow(numStars, 3)
        scaleFactor *= .3

        const star = new PIXI.Sprite(starTexture);
        star.anchor.set(0.5);
        star.scale.set((scaleFactor / 20) + 0.01);
        // star.dLife = scaleFactor * 100

        star.dy = 5 * scaleFactor;
        star.factor = 1
        star.increment = Math.random() * .003

        star.position.x = Math.random() * star_width;
        star.position.y = Math.random() * star_height;

        if (particle_containter) {
            particle_containter.addChild(star);
        } else {
            //рендер работает после запуска приложения - иначе всё пусто
            setTimeout(() => {

                let id_layer = Math.floor(Math.random() * count_layer)
                let r_rt = container.children[1 + id_layer]

                app.renderer.render(star, r_rt.data.rt, false);
                app.renderer.render(star, container.children[1 + id_layer + count_layer].data.rt, false);
            }, 100)
        }
    }

    this.update = (delta) => {
        if (!container.renderable) return;

        if (particle_containter) {
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
                if (star.position.y > star_height) {
                    star.position.x = Math.random() * star_width;
                    star.position.y -= Math.sign(fieldSpeed) * star_height;
                }
            });
        } else {

            container.children.forEach((layer, i) => {
                if (i == 0) return
                layer.position.y += ((layer.dy + 2) * fieldSpeed) * delta;
                if (layer.position.y >= star_height) {
                    layer.position.y = -star_height
                }
            })
        }

    }




    return this
}
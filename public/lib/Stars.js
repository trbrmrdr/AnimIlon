// @todo Не хватает описания того, что происходит в контейнере человекопонятным языком
function Stars(app) {

    const star_width = CANVAS_SIZE.width * 0.4,
        star_height = CANVAS_SIZE.height,
        container = new PIXI.Container(),
        numStars = 400;

    var is_work = false
    const fieldSpeed = .3

    this.getContainer = () => { return container; }

    this.setEnable = (enable) => {
        is_work = enable
    }

    // @todo Все ассеты нужно вынести в какой-нибудь реестр или синглотон, чтобы не плодить сущности.
    const fon = PIXI.Sprite.from(ASSETS.black_back)
    fon.scale.set(100)
    fon.x = 0

    container.addChild(fon)

    const particle_containter = new PIXI.ParticleContainer(numStars, {
        vertices: true,
        position: true,
        rotation: false,
        uvs: false,
        tint: true
    });
    container.addChild(particle_containter)
    particle_containter.x = CANVAS_SIZE.width - star_width

    const starTexture = PIXI.Texture.from(ASSETS.star);

    for (var i = 0; i < numStars; i++) {
        // const starTexture = PIXI.Texture.from(`/data/stars/s__(${1 + Math.round(Math.random() * 140)}).png`);
        //1-3 px

        let scaleFactor = Math.pow(i, 3) / Math.pow(numStars, 3)
        scaleFactor *= .3

        let star = new PIXI.Sprite(starTexture);
        star.anchor.set(0.5);
        star.scale.set((scaleFactor / 20) + 0.01);
        star.dLife = scaleFactor * 100

        star.dy = 5 * scaleFactor;
        star.factor = 1
        star.increment = Math.random() * .003

        star.position.x = Math.random() * star_width;
        star.position.y = Math.random() * star_height;
        particle_containter.addChild(star);


    }


    function resetStar(star) {
        star.position.x = Math.random() * star_width;
        star.position.y -= Math.sign(fieldSpeed) * star_height;
    }

    // @todo Очень похоже, что здесь на каждый тик происходит огромнейшее количество операций, учитывая кол-во "stars"
    app.ticker.add(function (delta) {
        if (!is_work) return;

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




    return this
}
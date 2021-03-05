
function Stars(app) {

    var _container,
        _star_is_work = false;

    this.getContainer = () => { return _container; }

    this.setEnable = (enable) => {
        _star_is_work = enable
    }



    const star_width = CANVAS_SIZE.width,
        star_height = CANVAS_SIZE.height


    const numStars = 1500;
    _container = new PIXI.Container()

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

    _container.addChild(fon, particle_containter)

    const starTexture = PIXI.Texture.from('/data/star.png');

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

    const fieldSpeed = .3
    app.ticker.add(function (delta) {
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




    return this
}
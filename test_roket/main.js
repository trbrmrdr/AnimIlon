var config;


const _main = {
    
    armatureDisplay: null,
    _onAssetsLoaded: (loader, res) => {
        const factory = dragonBones.PixiFactory.factory;

        factory.parseDragonBonesData(res.skeleton.data);
        factory.parseTextureAtlasData(res.texture_json.data, res.texture_png.texture);

        _main.armatureDisplay = factory.buildArmatureDisplay('Armature');
        const armatureDisplay = _main.armatureDisplay

        // armatureDisplay.on(dragonBones.EventObject.LOOP_COMPLETE, _main._animationEventHandler, this);
        // armatureDisplay.on(dragonBones.EventObject.COMPLETE, _main._animationEventHandler, this);

        //armatureDisplay.scale.set(0.5);
        armatureDisplay.x = 840 * 0.5 * armatureDisplay.scale.x;
        armatureDisplay.y = 562 * 0.5 * armatureDisplay.scale.y;


        //для теста 
        armatureDisplay.animation._animationNames.forEach(animation_name => {
            var btn = document.createElement("button");
            btn.innerHTML = animation_name;
            btn.addEventListener("click", () => { _main.click_fun(animation_name) });
            document.getElementById("animations").appendChild(btn);
        })
        // armatureDisplay.animation.play(armatureDisplay.animation._animationNames[0]);


        _main.app.stage.addChild(armatureDisplay);
        _main.app.start();
    },

    click_fun: (name_anim) => {
        console.log(name_anim, "______")
        _main.armatureDisplay.animation.play(name_anim)
    },


    app: null,
    init: () => {
        const app = _main.app = new PIXI.Application(config = {
            antialias: true,
            view: document.getElementById("canvas"),
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
            width: 840,//420,
            height: 562,//281,
        });
        document.body.appendChild(app.view);

        app.stop();

        PIXI.Loader.shared
            // .add('skeleton_dbbin', 'ilon_ske.dbbin')
            .add('skeleton', 'roket_ske.json')
            .add('texture_json', 'roket_tex.json')
            .add('texture_png', 'roket_tex.png')
            .load(_main._onAssetsLoaded);

    },
};
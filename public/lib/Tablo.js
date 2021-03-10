// @todo Лучше сделать через css, канвас менять дороже
// Если остается канвас, шрифт надо подгружать в пикси
function Tablo(anim) {

    var text_view;
    const main_anim = anim

    //фраймы для самой первой анимации ожидания - перед подключением к соккету frame in idly
    const fii = [
        '',
        '.',
        '..',
        '...',
        ' ...',
        '  ...',
        '   ..',
        '    .',
        '     ',
    ];

    this.updateIdly = () => {
        if (main_anim.hasConnected()) return

        text_view.text = fii[Math.floor((Date.now() / 100) % fii.length)];
    }

    this.setLeftTime = (msec) => {
        text_view.text = `${(msec / 1000).toFixed(2)}sec`
    }

    this.setMultiplier = (multiplier) => {
        text_view.text = `x${multiplier.toFixed(2)}`
    }

    this.init = (container) => {

        // @todo Не чистим память. 1/5
        const style = new PIXI.TextStyle({
            fontFamily: 'Bahnschrift',
            fontSize: 75,
            fontWeight: 'bold',
            fill: '#ffffff',
            letterSpacing: 2,
        });


        // @todo Зачем нужна заглушка?
        text_view = new PIXI.Text('х3112.52', style);
        text_view.x = 218;
        text_view.y = 100;

        container.addChild(text_view)
    }

    return this
}
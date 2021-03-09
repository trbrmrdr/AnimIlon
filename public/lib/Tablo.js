// @todo Лучше сделать через css, канвас менять дороже
// Если остается канвас, шрифт надо подгружать в пикси
function Tablo(main_anim) {

    var _text;
    const _anim = main_anim

    // @todo Что такое f? Только из изучения кода далее я понимаю, что это фреймы для анимации ожидания раунда
    const f = [
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
        if (_anim.hasConnected()) return

        _text.text = f[Math.floor((Date.now() / 100) % f.length)];
    }

    this.setLeftTime = (msec) => {
        _text.text = `${(msec / 1000).toFixed(2)}sec`
    }

    this.setMultiplier = (multiplier) => {
        _text.text = `x${multiplier.toFixed(2)}`
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
        _text = new PIXI.Text('х3112.52', style);
        _text.x = 218;
        _text.y = 100;

        container.addChild(_text)
    }

    return this
}
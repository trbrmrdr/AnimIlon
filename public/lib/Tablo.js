function Tablo(main_anim) {

    var _text;
    const _anim = main_anim

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

        const style = new PIXI.TextStyle({
            fontFamily: 'Bahnschrift',
            fontSize: 75,
            fontWeight: 'bold',
            fill: '#ffffff',
            letterSpacing: 2,
        });


        _text = new PIXI.Text('х3112.52', style);
        _text.x = 218;
        _text.y = 100;

        container.addChild(_text)
    }

    return this
}
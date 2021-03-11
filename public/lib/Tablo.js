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
        if (main_anim.getTimeStarting() > 0) return

        text_view.text = fii[Math.floor((Date.now() / 100) % fii.length)];
    }


    this.setMultiplier = (multiplier) => {
        text_view.text = `x${multiplier.toFixed(2)}`
    }

    var timePressesBtn = 0,
        delPressed = DELAY_PRESSED_BTN
    this.pressBtn = (time, delay) => {
        timePressesBtn = time
        delPressed = delay
    }
    this.isTimer = () => { return hasTimer }

    var hasTimer = false
    this.update_text = (room) => {
        if (!main_anim.getApp()) return

        const time_to_start = main_anim.getTimeStarting()

        hasTimer = time_to_start + timePressesBtn > 0
        if (hasTimer == false) return

        room.setState(ANIM_Room.Wait)

        let now = Date.now()
        let left = delPressed
        if (timePressesBtn !== 0) {
            left = (timePressesBtn + delPressed) - now
        }

        if (time_to_start > 0) {
            let elapsed = time_to_start - now
            // console.log(elapsed / 1000)
            left += elapsed
        }
        text_view.text = `${(left / 1000).toFixed(2)}sec`


    }


    this.init = (container) => {

        const style = new PIXI.TextStyle({
            fontFamily: 'Bahnschrift',
            fontSize: 75,
            fontWeight: 'bold',
            fill: '#ffffff',
            letterSpacing: 2,
        });

        text_view = new PIXI.Text('х3112.52', style);
        text_view.x = 218;
        text_view.y = 100;

        container.addChild(text_view)
    }

    return this
}
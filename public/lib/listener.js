
const LISTENER_STATUS = {
  CREATED: 'CREATED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
}

function Listener(anim) {
  var _anim = anim
  var duration = 1600;

  var _startTime = null,
    _multiplier = 1,
    _multiplier_in_server = null,
    _elapsedTime = 0;

  function getMultiplier(t) {
    return _multiplier_in_server ? _multiplier_in_server : 2 ** (t / 1000 / 11);
  }

  var _tick = this.tick = () => {
    _elapsedTime = Math.max(0, Date.now() - _startTime)
    // _elapsedTime = 600; - стояло .......
    _multiplier = getMultiplier(_elapsedTime);
    // if (_multiplier >= 2)
    // console.log('tick -', _elapsedTime, _multiplier)
    return _multiplier
  }

  this.multiplier = () => { return _multiplier; }

  _anim.setMultiplier(this.tick, this.multiplier)

  var _user_id = -1
  var updateState = this.us = (status, date, multiplier_to_show) => {
    // console.log(`updateState   ${status}  ${date ? ((Date.now() - date) / 1000) : ''}   ${multiplier_to_show || ''}`)

    _multiplier_in_server = multiplier_to_show || null

    switch (status) {
      case LISTENER_STATUS.CREATED:
        _startTime = date || Date.now()
        _tick();
        _anim.start_after(_startTime - Date.now())
        break;
      case LISTENER_STATUS.IN_PROGRESS:
        _startTime = date || _startTime || Date.now();
        _tick();
        _anim.in_process()
        break;
      case LISTENER_STATUS.COMPLETED:
        _user_id = -1
        // date - общее время игры
        _tick()
        _anim.completed()
        break;
    }
  }

  var _is_server = false,
    _url,
    _socket = null;

  this.connect = () => {
    _is_server = true

    const createSocket = function () {
      if (!_is_server) return

      _socket = new WebSocket(_url);

      _socket.onopen = function (e) {
        // socket.send("message");
        // console.log('__connect__')
      };

      _socket.onmessage = ({ data }) => {
        const message = JSON.parse(data);

        let get_del = (time) => {
          return (Date.now() - time) / 10 / 100
        }

        let log = (event_name) => {
          console.log(`\t\t ${event_name}`)
          if (message.payload.started_at)
            console.log(`\t\tstarted_at=   ${get_del(new Date(message.payload.started_at).getTime())}`)
          if (message.payload.completed_at)
            console.log(`\t\tcompleted_at= ${get_del(new Date(message.payload.completed_at).getTime())}`)
          if (message.payload.betting_period_end_timestamp)
            console.log(`\t\tbetting_period_end_timestamp=  ${get_del(message.payload.betting_period_end_timestamp)}`)
          if (message.payload.message_sent_at_ms_timestamp)
            console.log(`\t\tmessage_sent_at_ms_timestamp=  ${get_del(message.payload.message_sent_at_ms_timestamp)}`)

          if (message.payload.current_multiplier)
            console.log(`\t\tcurrent_multiplier=  ${message.payload.current_multiplier}`)
          if (message.payload.final_multiplier)
            console.log(`\t\tfinal_multiplier = ${message.payload.final_multiplier}   /  ${_multiplier} `)
        }

        switch (message.event_name) {
          case 'statusUpdate':
            switch (message.payload.status) {
              case LISTENER_STATUS.CREATED:
              case LISTENER_STATUS.IN_PROGRESS:
              case LISTENER_STATUS.COMPLETED:
                // log(message.event_name)
                updateState(
                  message.payload.status,


                  //WARN - время и множитель - только для COMPLETED
                  new Date(message.payload.completed_at).getTime(),
                  message.payload.final_multiplier
                );
                break
            }
            break;
          case 'countDownUpdate':
            // log(message.event_name)
            updateState(LISTENER_STATUS.CREATED,
              Date.now() + message.payload.countdown_time_remaining_ms
            );
            break;
          case 'multiplierUpdate':
            // log(message.event_name)
            updateState(LISTENER_STATUS.IN_PROGRESS,
              new Date(message.payload.started_at).getTime()
            );
            break;
          case 'playerUpdate':
            // console.log(message.payload)
            if (_user_id == -1) {
              _user_id = message.payload.player.user_id
            }
            // let tlog = ''
            if (_user_id == message.payload.player.user_id) {
              // tlog += '\n\tlistener ->' + message.payload.player.out_at_multiplier
              _anim.set_win(message.payload.player.out_at_multiplier > 1.0)
            }
            // console.log(message.payload.player.user_id + " ->" + message.payload.player.out_at_multiplier + tlog)
            break;
          case 'onlineUpdate':
            // console.log(message.payload)
            break;
          default:

            // console.log(message)
            // console.log(`event_name = ${message.event_name}\t status = ${message.payload.status}`)
            // log()

            break;
        }

      }

      _socket.onclose = function (event) {
        _socket = null

        if (event.wasClean) {
          console.log(`[close] Соединение закрыто чисто, код=${event.code} причина=${event.reason}`);
        } else {
          console.log('close Соединение прервано  ${event}');
          createSocket(_url)
        }
      };

      _socket.onerror = function (error) {
        console.log(`error ${error.message}`);
        // console.log(event)
        return
      };

    }

    createSocket()
  }

  this.disconnect = () => {
    _is_server = false
    if (_socket) _socket.close()
  }


  this.connectToServer = (url) => {
    _url = url;
    this.connect()
    return this;
  }

  return this;

}



interface IPattern {
  pattern: RegExp,
  callback: Function
}

export class HubClass {
  name: string;
  listeners: any = {};
  patterns: IPattern[] = [];

  public ampSymbol = Symbol("amplify_default"); //Creates a unique symbol
  protectedChannels = ['core', 'auth', 'api', 'analytics', 'interactions', 'pubsub', 'storage', 'xr'];

  constructor(name: string) {
    this.name = name;
  }

  static createHub(name: string) {
    console.warn(`WARNING: createHub will be deprecated in the future and is considered unsafe`)
    return new HubClass(name);
  }

  myFunction(input: string) {
    return input;
  }

  attachDispatchToListener(group: string, dispatcher: Function) {
    let holder = this.listeners[group];
    if (!holder) {
      holder = [];
      this.listeners[group] = holder;
    }
    holder.push({
      name: 'middleware',
      callback: dispatcher
    })
  }

  dispatch(channel: any, payload: any, source: string = '', ..._rest) {

    if (this.protectedChannels.indexOf(channel) > -1) {
      const hasAccess = _rest.length && !!_rest[0][this.ampSymbol];

      if (!hasAccess) {
        console.warn(`WARNING: ${channel} is protected and dispatching on it can have unintended consiquences`);
      }
    }

    const capsule = {
      channel: channel,
      payload: Object.assign({}, payload),
      source: source
    };

    try {
      this.toListeners(capsule);
    } catch (e) { console.error(e) }
  }

  listen(channel: string | RegExp, callback?, listenerName = 'noname') {
    if (channel instanceof RegExp) {
      if (callback != undefined) {
        this.patterns.push({
          pattern: channel,
          callback: callback
        });
      } else { console.error(`Cannot listen for ${channel} without a callback defined`) }
    } else {
      let holder = this.listeners[channel];

      if (!holder) {
        holder = [];
        this.listeners[channel] = holder;
      }

      //Default callback for a channel
      (callback === undefined) && (callback = (data) => { console.log('DEFAULT: ', data.payload.data); });
      //Check for legacy onHubCapsule callback for backwards compatability
      (callback.onHubCapsule) && (callback = callback.onHubCapsule);
      holder.push({
        name: listenerName,
        callback: callback
      })
    }
  }

  toListeners(capsule) {
    const { channel, payload, source } = capsule;
    const holder = this.listeners[channel];

    if (holder) {
      holder.forEach(listener => {
        try {
          listener.callback(capsule);
        } catch (e) { console.error(e); }
      })
    }

    if (this.patterns.length > 0) {
      this.patterns.forEach(pattern => {
        if ((pattern.pattern.test(payload.data.toString()))) {
          pattern.callback(capsule)
        }
      })
    }
  }
};

/*We export a __default__ instance of HubClass to use it as a 
psuedo Singleton for the main messaging bus, however you can still create
your own instance of HubClass() for a separate "private bus" of events.*/
const Hub = new HubClass('__default__');
export default Hub;
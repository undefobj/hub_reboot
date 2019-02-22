This is an experimental refactor of the [Amplify Hub module](https://aws-amplify.github.io/docs/js/hub).

Motivations for this refactor:
- Make usage of Amplify events easier across categories
- Improve Auth flows inside of an app, especially rendering and transitions upon events
- Provide a debugging


### Listening for messages

`Hub.listen(channel: string | RegExp, callback?)` is used to listen for messages on the main event bus. You must provide either a named channel or a regular expression. When listening on a channel you can optionally pass in a custom callback for processing the messages on that channel. In the case of a regular expression you are required to pass a callback, which will be fired for any events that match as appropriate.

### Dispatching messages
> Note need to look further into this function prototype and determine if replacing `any` as the type will break anything.

`Hub.dispatch(channel: any, payload: any, source: string?)` can be used to dispatch a `payload` to a `channel`. The `channel` is a logical grouping while the `payload` is a JSON structure which contains `event` and `data` keys.

```json
{ 
  event: 'signOut', 
  data: 'The user has been signed out' 
}
```

Note that while you can dispatch to any channel, Amplify protects certain channels and will flag a warning as sending unexpected payloads could have undesirable side effects (such as impacting authentication flows). The protected channels are currently:
- core
- auth
- api
- analytics
- interactions
- pubsub
- storage
- xr

### Middleware

You can attach a callback to a listener when a dispatch happens (e.g. "middleware") at any time by using `attachDispatchToListener(channel: string, dispatcher: Function)`. This will allow you to avoid duplicating code in multiple parts of your application if you wanted to introduce a standard logging function or other utility whenever a message to a channel was received. 

## Examples

Passing a custom callback defined in your current class scope:

```javascript

  Hub.listen('Group1', this.onDispatch)

  onDispatch(capsule){
    const { channel, payload, source } = capsule;
    console.log('Event: ', 'mylog:' + JSON.stringify(payload.event));
    console.log('Data: ', payload.data);
  }
```

You can also listen by only passing a channel without a callback. In this case Hub will simply echo out the `payload.data` section of the event:

```javascript
Hub.listen('auth');
```

Hub still supports `this` as a callback allows you to use the legacy pattern by using a function called `onHubCapsule`, however it is highly encouraged to use the newer custom callback from earlier.

```javascript
  Hub.listen('auth', this);

  onHubCapsule(capsule){
    const { channel, payload, source } = capsule;
    console.log(source);
    console.log(capsule);
  }
```

Regular expressions can match any payload across all of the channels. For instance if you wanted to filter on any message which contained the string "user" you could do the following:

```javascript
    Hub.listen(/user(.*)/, (data) => {
      console.log('Found pattern from data: ',
        data.payload.data
      )
    });
```

Dispatching payloads on different channels or at different times in your application:

```javascript
Hub.dispatch('auth', { event: 'signIn', data: 'the user has signed into your app' }, 'Auth');

Hub.dispatch('Group1', { event: 'signIn', data: 'here is user information' }, 'Auth');

setTimeout(() => {
  Hub.dispatch('auth', { event: 'signOut', data: 'the user has been signed out' }, 'Auth');
}, 5000)
```

Adding middlware for listening to different channels:

```javascript
Hub.attachDispatchToListener('Group1', (data) => {
  const { payload } = data; 
  console.log('Group1 middlware: ', payload)
})

Hub.attachDispatchToListener('auth', (data) => {
  const { payload } = data; 
  console.log(`Received "auth" events with a payload of: ${payload.data}`)
})
```
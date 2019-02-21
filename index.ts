import Hub from './src/Hub';
import ClassA from './src/ClassA';
import ClassB from './src/ClassB';

//If you want your own isolated Hub instance you can create one
/*let hub = new HubClass('HubA');

hub.listen('auth', (data) => {
  const { payload } = data;
  console.log('Custom instance: ', payload.event);
})

setTimeout(() => {
  hub.dispatch('auth', { event: 'SOMETHING', data: 'the user has been signed out' }, 'Auth');
}, 10000)
*/

//Most of the time you can use the default instance exported by Hub
// Hub.attachDispatchToListener('Group1', (data) => {
//   const { payload } = data; 
//   console.log('testing middlware: ', payload)
// })

// Hub.attachDispatchToListener('Group1', (data) => {
//   const { payload } = data; 
//   console.log('testing middlware #2: ', payload)
// })

// Hub.attachDispatchToListener('auth', (data) => {
//   const { payload } = data; 
//   console.log(`Received "auth" events with a payload of: ${payload.data}`)
// })

//Configured to listen on the 'auth' channel
let a = new ClassA();

//Configured to listen on the 'Group1' channel
let b = new ClassB();

Hub.dispatch('auth', { event: 'signIn', data: 'the user has signed into your app' }, 'Auth');

Hub.dispatch('Group1', { event: 'signIn', data: 'here is user information' }, 'Auth');

setTimeout(() => {
  Hub.dispatch('auth', { event: 'signOut', data: 'the user has been signed out' }, 'Auth', { [Hub.ampSymbol]: true });
}, 5000)
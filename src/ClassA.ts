import Hub from './Hub';

export default class ClassA {
  constructor(){
    //Hub.listen('Group1', this.onDispatch)
    //Hub.listen('auth');
    //Hub.listen('auth', this);   //Legacy method using onHubCapsule
    //Hub.listen(/user(.*)/);   //Should error
    // Hub.listen(/user(.*)/, (data) => {
    //   console.log('Found pattern from data: ',
    //     data.payload.data
    //   )
    // });
  }

  onDispatch(capsule){
    const { channel, payload, source } = capsule;
    console.log('Event: ', 'mylog:' + JSON.stringify(payload.event));
    console.log('Data: ', payload.data);
  }

  onHubCapsule(capsule){
    const { channel, payload, source } = capsule;
    console.log(source);
    console.log(capsule);
  }
}
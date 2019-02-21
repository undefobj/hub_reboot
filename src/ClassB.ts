import Hub from './Hub';

export default class ClassB {
  constructor(){
    Hub.listen('Group1', this.classBDispatch)
  }

  classBDispatch(data){
    const { payload } = data;
    console.log('Dispatching from ClassB ' + payload.event);
  }
}

declare module "worker-loader*" {
  class WebpackWorker extends Worker {
    constructor();
  }
  export default WebpackWorker;
}


declare module "soundbank-reverb" {
  var Reverb: any;
  export default Reverb;
}

import * as zookeeper from 'node-zookeeper-client';
import { EventEmitter } from 'events';
import * as _ from 'lodash';

const ZOOKEEPER = Symbol('zookeeper');

interface IOptions {
  sessionTimeout: number;
  spinDelay: number;
  retries: number;
}

class Zookeeper extends EventEmitter {
  config = {}

  init(host: string, znode: string, options: IOptions) {
    const currentOptions = _.assign({
      sessionTimeout: 20000,
      spinDelay: 1000,
      retries: 2
    }, options);

    return new Promise((resolve, reject) => {
      const zk = zookeeper.createClient(host, currentOptions);
      const getData = () => {
        zk.getData(
          znode,
          () => { getData(); },
          (error, data) => {
            if (error) {
              reject(error);
            } else {
              this.config = JSON.parse(data.toString('utf8'));
              this.emit('onZookeeperUpdate', this.config);
              resolve(this.config);
            }
          }
        );
      };

      zk.once('connected', () => getData());
      zk.connect();
    });
  }

  get(key: string): string {
    return _.get(this.config, key);
  }
}

interface Global {
  [ZOOKEEPER]: Zookeeper
}

declare const global: Global;

if (!global[ZOOKEEPER]) {
  global[ZOOKEEPER] = new Zookeeper();
}

export default global[ZOOKEEPER];

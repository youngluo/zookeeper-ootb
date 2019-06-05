# @xwfintech/zookeeper

## 安装

```sh
npm config set @xwfintech:registry http://xwnpm.xwfintech.com
npm install @xwfintech/zookeeper
```

## 使用

```ts
interface IOptions {
  sessionTimeout: number;
  spinDelay: number;
  retries: number;
}
```

```ts
import zk from '@xwfintech/zookeeper';

// 方法
zk.init(host: string, znode: string, options: IOptions): Promise<{}>
zk.get(key: string): string

// 监听 onZookeeperUpdate 事件（当配置更新时会 emit onZookeeperUpdate 事件）
zk.on('onZookeeperUpdate', (zkConfig) => {
  axios.defaults.baseURL = `${zkConfig.SUPPORT_HOST}/api/v1`;
});
```

## 依赖

 - [node-zookeeper-client](https://github.com/alexguan/node-zookeeper-client)

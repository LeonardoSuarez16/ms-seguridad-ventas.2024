import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'datasource',
  connector: 'mongodb',
  url: 'mongodb+srv://user_mongo_ventas:admin_2024@clustermongo.nuocbcn.mongodb.net/seguridad_ventas?retryWrites=true&w=majority&appName=ClusterMongo',
  host: 'localhost',
  port: 27017,
  user: '',
  password: '',
  database: 'seguridad_ventas',
  useNewUrlParser: true
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class DatasourceDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'datasource';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.datasource', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}

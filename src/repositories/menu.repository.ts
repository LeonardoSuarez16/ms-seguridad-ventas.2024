import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DatasourceDataSource} from '../datasources';
import {Menu, MenuRelations} from '../models';

export class MenuRepository extends DefaultCrudRepository<
  Menu,
  typeof Menu.prototype._id,
  MenuRelations
> {
  constructor(
    @inject('datasources.datasource') dataSource: DatasourceDataSource,
  ) {
    super(Menu, dataSource);
  }
}

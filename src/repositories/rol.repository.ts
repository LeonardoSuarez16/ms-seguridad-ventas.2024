import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasManyRepositoryFactory, HasManyThroughRepositoryFactory, repository} from '@loopback/repository';
import {DatasourceDataSource} from '../datasources';
import {Menu, Rol, RolMenu, RolRelations, Usuario} from '../models';
import {MenuRepository} from './menu.repository';
import {RolMenuRepository} from './rol-menu.repository';
import {UsuarioRepository} from './usuario.repository';

export class RolRepository extends DefaultCrudRepository<
  Rol,
  typeof Rol.prototype._id,
  RolRelations
> {

  public readonly menus: HasManyThroughRepositoryFactory<Menu, typeof Menu.prototype._id,
          RolMenu,
          typeof Rol.prototype._id
        >;

  public readonly usuarios: HasManyRepositoryFactory<Usuario, typeof Rol.prototype._id>;

  constructor(
    @inject('datasources.datasource') dataSource: DatasourceDataSource, @repository.getter('RolMenuRepository') protected rolMenuRepositoryGetter: Getter<RolMenuRepository>, @repository.getter('MenuRepository') protected menuRepositoryGetter: Getter<MenuRepository>, @repository.getter('UsuarioRepository') protected usuarioRepositoryGetter: Getter<UsuarioRepository>,
  ) {
    super(Rol, dataSource);
    this.usuarios = this.createHasManyRepositoryFactoryFor('usuarios', usuarioRepositoryGetter,);
    this.registerInclusionResolver('usuarios', this.usuarios.inclusionResolver);
    this.menus = this.createHasManyThroughRepositoryFactoryFor('menus', menuRepositoryGetter, rolMenuRepositoryGetter,);
    this.registerInclusionResolver('menus', this.menus.inclusionResolver);
  }
}

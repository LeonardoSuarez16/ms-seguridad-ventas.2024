import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {Credenciales, Usuario} from '../models';
import {repository} from '@loopback/repository';
import {UsuarioRepository} from '../repositories';
const generator = require('generate-password');
const MD5 = require("crypto-js/md5");

@injectable({scope: BindingScope.TRANSIENT})
export class SeguridadUsuarioService {
  constructor(
    @repository(UsuarioRepository)
    public repositorioUsuario: UsuarioRepository
  ) {}

  /*
   * Add service methods here
   */
  /**
   * Crear una clave aleatoria
   * @returns cadena aleatoria de n caracteres
   */
  crearTextoAleatorio(n:number): string{
    let clave = generator.generate({
      length: n,
      numbers: true
    });
    return clave;
  }

  /**
   * Cifrar una cadena con MD5
   * @param cadena texto a cifrar
   * @returns cadena cifrada con MD5
   */
  cifrarTexto(cadena: string): string {
    let cadenaCifrada = MD5(cadena).toString();
    return cadenaCifrada;
  }


  /**
   * se busca un usuario por sus credenciales de a acceso.
   * @param Credenciales credenciales del usuario
   * @returns usuario encontrado o null
   */

  async identificarUsuario(Credenciales: Credenciales): Promise <Usuario | null>{
    let usuario = await this.repositorioUsuario.findOne({
      where: {
        correo: Credenciales.correo,
        clave: Credenciales.clave
      }
    });
    return usuario as Usuario;
  }

}

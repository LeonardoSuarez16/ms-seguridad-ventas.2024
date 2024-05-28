import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {Credenciales, FactorDeAutentificacionPorCodigo, Login, Usuario} from '../models';
import {repository} from '@loopback/repository';
import {LoginRepository, UsuarioRepository} from '../repositories';
import {promises} from 'dns';
import {ConfiguracionSeguridad} from '../config/seguridad.config';
const generator = require('generate-password');
const MD5 = require("crypto-js/md5");
const jwt = require('jsonwebtoken');

@injectable({scope: BindingScope.TRANSIENT})
export class SeguridadUsuarioService {
  constructor(
    @repository(UsuarioRepository)
    public repositorioUsuario: UsuarioRepository,
    @repository(LoginRepository)
    public repositorioLogin: LoginRepository
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

/**
 * validamos un codigo de 2fa para un usuario
 * @param credenciales2fa credenciales del usuario con el codigo del 2fa
 * @returns el registro de login o null
 */

  async validarCodigo2fa(credenciales2fa: FactorDeAutentificacionPorCodigo): Promise<Usuario | null> {
    let login = await this.repositorioLogin.findOne({
      where: {
        usuarioId: credenciales2fa.usuarioId,
        codigo2fa: credenciales2fa.codigo2fa,
        estadoCodigo2fa: false
      }
    });
    if (login) {
      let usuario = await this.repositorioUsuario.findById(credenciales2fa.usuarioId);
      return usuario;
    }
    return null;
  }

  /**
   * generacion de JWT
   * @param usuario informacion del usuario
   * @returns token
   */
  crearToken(usuario: Usuario): string {
    let datos = {
      name: `${usuario.primerNombre} ${usuario.segundoNombre} ${usuario.primerApellido} ${usuario.segundoApellido}`,
      role: usuario.rolId,
      email: usuario.correo
    };
    let token = jwt.sign(datos, ConfiguracionSeguridad.claveJWT);
    return token;
  }
}

import  Datos  from './datos.js';

export class Egresos extends Datos{

    static contadorEgresos = 0;

    constructor(descripcion,valor){
        super(descripcion,valor);
        this._id = ++Egresos.contadorEgresos;
    }


    get id(){
        return this._id;
    }

}
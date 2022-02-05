import  Datos  from './datos.js';

export class Ingresos extends Datos{

    static contadorIngresos = 0;

    constructor(descripcion,valor){
        super(descripcion,valor);
        this._id = ++Ingresos.contadorIngresos;
    }


    get id(){
        return this._id;
    }

}
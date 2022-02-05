// Importes
import { Ingresos  } from './ingresos.js';
import { Egresos  } from './egresos.js';

// Elementos del html
let dineroPresupuesto = document.querySelector('#dinero');
let dineroIngreso = document.querySelector('#dinero-ingresos');
let dineroEgreso = document.querySelector('#dinero-egreso');
let dineroPorcentajeEgreso = document.querySelector('#porcentaje-egreso');
let OptTipoPresupuesto = document.querySelector('#tipo-presupuesto');
let txtDescription = document.querySelector('#descripcion');
let txtValor = document.querySelector('#valor');
let btnAgergar = document.querySelector('#agregar');
let groupIngresos = document.querySelector('#ingresos');
let groupEgresos = document.querySelector('#egresos');
let form = document.querySelector('form');

// Variables
let ingresos = [];
let egresos = [];


// Eventos

document.addEventListener('DOMContentLoaded', ()=>{
    // console.log(ingresos);

    mostrarCabecera();
    mostrarIngresos();
    mostrarEgresos();
    coloresPresupuesto();
    btnAgergar.addEventListener('click',agregarIngresosEgresos);
    groupIngresos.addEventListener('click',borrar)
    groupEgresos.addEventListener('click',borrar_egresos)
    
})

// Funciones

function coloresPresupuesto(){
    let dinero = formatoMonedaPorcentajes( totalIngresos() - totalEgresos())
    if(dinero >= ( totalIngresos() / 2 )){
        dineroPresupuesto.classList.add('dinero-verde')
    }if(dinero >= ( totalIngresos() / 3 )){
        dineroPresupuesto.classList.add('dinero-amarillo')
    }
    console.log(dinero);
}


function totalIngresos() {
    let total = ingresos.map(valor => {
        return valor.valor;
    })

    return total.reduce((anterior,siguiente)=>(anterior+siguiente),0);
}

function totalEgresos() {
    let total = egresos.map(valor => {
        return valor.valor;
    })
    return total.reduce((anterior,siguiente)=>(anterior+siguiente),0);
}

function mostrarCabecera(){
    
    dineroPresupuesto.textContent = formatoMonedaPorcentajes( totalIngresos() - totalEgresos());
    dineroIngreso.textContent = formatoMonedaPorcentajes(totalIngresos());
    dineroEgreso.textContent = formatoMonedaPorcentajes(totalEgresos());
    if(totalIngresos() > 0 && totalEgresos() > 0){
        let percent = (totalEgresos() / totalIngresos());
        dineroPorcentajeEgreso.textContent = formatoMonedaPorcentajes(percent,'percent',0);
    }else{
        dineroPorcentajeEgreso.textContent = formatoMonedaPorcentajes(0,'percent',0);
    }
}


function formatoMonedaPorcentajes(valor,formato = 'currency',digits=2) {
    return valor.toLocaleString('en-US',{ style:formato,currency:'USD',minimumFractionDigits: digits });
}


function mostrarIngresos(){
    limpiarhtmlIngresos();
    ingresos.forEach( ingreso => {
        let div = document.createElement('div');
        div.classList.add('group-content');
        div.id = 'group-content-ingresos'
        div.innerHTML = `
        <span class="badge">${ingreso.descripcion}</span>
        <div class='derecha'>
            <span class="s1">+${formatoMonedaPorcentajes(ingreso.valor)}</span>&nbsp;
            <button class='btn btn-sm borrar fas fa-trash-alt' data-id=${ingreso.id} id="eliminar-ingreso"
            ></button>
        </div>
        `;
        document.querySelector('#ingresos').appendChild(div);
        
    } );
}


function mostrarEgresos(){
    limpiarhtmlEgresos();

    egresos.forEach( egreso => {
        let div = document.createElement('div');
        div.classList.add('group-content');
        div.innerHTML = `
        <span class="badge">${egreso.descripcion}</span>
        <div class='derecha'>
        <span class="s2">- ${formatoMonedaPorcentajes(egreso.valor)}</span>
        <span class="porcentaje egreso-porcentaje" id="porcentaje-egreso">
        ${formatoMonedaPorcentajes(((egreso.valor / totalEgresos())),'percent',0)}</span>
        <button class='btn btn-sm borrar fas fa-trash-alt' data-id=${egreso.id} id="eliminar-ingreso"
        ></button>
        </div>
        `;

        document.querySelector('#egresos').appendChild(div);
    } );
}

function agregarIngresosEgresos(e){
    e.preventDefault();
    let opcion = OptTipoPresupuesto.value;
    let descripcion = txtDescription.value;
    let valor = parseInt(txtValor.value);
    if(descripcion.length <= 0){
       mensajes('Ingrese una descripcion')
        return;
    }
    if(valor <= 0){
        mensajes('El valor debe ser un numero mayor a 0')
        return;
    }
    if(isNaN(valor)){
        mensajes('El valor no puede estar vacio')
        return;
    }
    if(opcion == 'mas'){
        let newIngreso = new Ingresos(descripcion,valor);
        ingresos =[...ingresos,newIngreso];
        mostrarIngresos();

        mensajes('Se agregó un ingreso','success')
    }else if(opcion == 'menos'){
        if((totalIngresos() - totalEgresos() )<= 0){
            mensajes('No tienes presupuesto disponible')
            return;
        }
        let newEgresos = new Egresos(descripcion,valor);
        egresos =[...egresos,newEgresos];
        mostrarEgresos();
        mensajes('Se agregó un egreso','success')
    }
    form.reset();
    coloresPresupuesto();

    mostrarCabecera();
}

function limpiarhtmlIngresos(){
    let groupIngresos = document.querySelector('#ingresos');
    while(groupIngresos.firstChild){
        groupIngresos.removeChild(groupIngresos.firstChild);
    }
}

function limpiarhtmlEgresos(){
    let groupEgresos = document.querySelector('#egresos');
    while(groupEgresos.firstChild){
        groupEgresos.removeChild(groupEgresos.firstChild);
    }
}

function borrar(e){
    if(e.target.classList.contains('borrar')){
        let id = e.target.getAttribute('data-id');
        ingresos = ingresos.filter( ingreso => ingreso.id != id);
        mostrarCabecera();
        mostrarIngresos();
        mensajes('Se borró un ingreso','success')
        coloresPresupuesto();
    }
}

function borrar_egresos(e){
    if(e.target.classList.contains('borrar')){
        let id = e.target.getAttribute('data-id');
        egresos = egresos.filter( egreso => egreso.id != id);
        mostrarCabecera();
        mostrarEgresos();
        mensajes('Se borró un egreso','success')
    }
}

function mensajes(mensaje,tipo='danger'){
    let div = document.createElement('div');
    div.textContent = mensaje;
    if(tipo=='danger'){
        div.classList.add('alert','alert-danger');
    }
    if(tipo=='success'){
        div.classList.add('alert','alert-success');
    }

    let contenedor = document.querySelector('#contenedor');
    contenedor.insertBefore(div,form);
    setTimeout(()=>{
        div.remove();
    },3000)

}
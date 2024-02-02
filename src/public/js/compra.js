const btnContinuar = document.getElementById('btnContinuarIzquierda');
const btnCopiar = document.getElementById('btnCopiar');
const dvCopiado = document.getElementById('dvCopiado');
const inpDireccion = document.getElementById('inpDireccion');
const dvOpcionRetiro = document.getElementById('dvOpcionRetiro');
const dvOpcionEnvio = document.getElementById('dvOpcionEnvio');
const dvOpcionEncuentro = document.getElementById('dvOpcionEncuentro');
const inpRadioRetiro = document.getElementById('inpRadioRetiro');
const inpRadioEnvio = document.getElementById('inpRadioEnvio');
const inpRadioEncuentro = document.getElementById('inpRadioEncuentro');
const dvIzquierda = document.getElementById('dvIzquierda');
const dvDerecha = document.getElementById('dvDerecha');
const dvMercadoPago = document.getElementById('dvMercadoPago');
const dvEfectivo = document.getElementById('dvEfectivo');
const inpRadioMercadoPago = document.getElementById('inpRadioMercadoPago');
const inpRadioEfectivo = document.getElementById('inpRadioEfectivo');
const btnContinuarDerecha = document.getElementById('btnContinuarDerecha');
const btnAtrasDerecha = document.getElementById('btnAtrasDerecha');

let opcionSeleccionadaEnvio;
let opcionSeleccionadaPago;
let dirección;

let derechaDisabled = true;

btnContinuar.addEventListener('click', continuarIzquierda);
inpRadioRetiro.addEventListener('click', clickRetiro);
inpRadioEnvio.addEventListener('click', clickEnvio);
inpRadioEncuentro.addEventListener('click', clickEncuentro);
btnCopiar.addEventListener('click', copiar);
inpRadioMercadoPago.addEventListener('click', clickMercadoPago);
inpRadioEfectivo.addEventListener('click', clickEfectivo);
dvMercadoPago.addEventListener('click', clickDvMercadoPago);
dvEfectivo.addEventListener('click', clickDvEfectivo);
btnAtrasDerecha.addEventListener('click', atrasDerecha)
btnContinuarDerecha.addEventListener('click', continuarDerecha)
dvOpcionRetiro.addEventListener('click', clickDvRetiro);
dvOpcionEnvio.addEventListener('click', clickDvEnvio);
dvOpcionEncuentro.addEventListener('click', clickDvEncuentro);

function continuarIzquierda(){
    //const contenido = document.getElementById('inpDireccion').Value;
    if(opcionSeleccionadaEnvio !== 'Retiro' && opcionSeleccionadaEnvio !== 'Envio' && opcionSeleccionadaEnvio !== 'Encuentro'){
        alert(`Por favor elija un método de envío antes de continuar`);
    }else{
        if(opcionSeleccionadaEnvio === 'Envio' && inpDireccion.value === ''){
            alert(`Por favor, si su opción es el envío, indique cuál es su dirección`)
        }else if (opcionSeleccionadaEnvio === 'Envio' && inpDireccion.value !== ''){
            dirección = inpDireccion.value;
            deshabilitarIzquierda();
            habilitarDerecha();
            dvDerecha.scrollIntoView({ behavior: 'smooth' });
        }else{
            deshabilitarIzquierda();
            habilitarDerecha();
            dvDerecha.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

function continuarDerecha(){
    if(opcionSeleccionadaPago !== 'MercadoPago' && opcionSeleccionadaPago !== 'Efectivo'){
        alert(`Por favor elija un método de pago antes de continuar`);
    }else{
        if(confirm('Está apunto de hacer su pedido y mandar un mensaje por WhatsApp')){
            if(esIndividual === 'no'){
                confirmarPedido();
            }else{
                confirmarPedidoIndividual();
            }
            
        }
    }
}

async function confirmarPedido(){
    let elRecordset;
    await fetch('/obtenerProductos')
    .then(response => response.json())
    .then(data => {
        elRecordset=data;
    })
    .catch(error => {
        console.error('Error en la solicitud:', error);
    });

    let pedido ='';
    let subtotal = 0;
    let precioFinal = 0;
    let cantidadProductos = 0;
    let costoEnvio = 0;
    let opcionEnvio = '';
    let opcionPago = '';

    elRecordset.forEach(producto =>{
        let articulo = `${producto.cantidad} x *${producto.nombreProducto}* (${producto.categoria}) => $${producto.precio}`;
        pedido += `\n${articulo}`;
        cantidadProductos += producto.cantidad;
        subtotal += producto.cantidad * producto.precio;
    });

    if(cantidadProductos <= 5){
        costoEnvio = 1000;
    }else if(cantidadProductos <= 10){
        costoEnvio = 2000;
    }else{
        costoEnvio = 3000;
    }

    if(opcionSeleccionadaPago === 'MercadoPago'){
        opcionPago = 'Mercado Pago';
    }else{
        opcionPago = 'Efectivo';
    }

    switch(opcionSeleccionadaEnvio){
        case 'Retiro':
            opcionEnvio = 'Entrega en domicilio del vendedor';
            break;
        case 'Envio':
            opcionEnvio = 'Envío a su domicilio';
            break;
        case 'Encuentro':
            opcionEnvio = 'Acordar punto de encuentro con el vendedor';
            break;
    }

    let mensaje;

    if(opcionSeleccionadaEnvio === 'Encuentro'){
        precioFinal = costoEnvio + subtotal;
        mensaje=
        `Hola Todo3D!!\nMi nombre es ${nombreUsuario}\nDesearía pedirles lo siguiente:
        ${pedido}
        \n*Método de envío:* ${opcionEnvio}\n*Método de pago:* ${opcionPago}\n*Cantidad de productos:* ${cantidadProductos}\n*Subtotal:* ${subtotal}\n*Costos de envío:* ${costoEnvio}\n*Total:* ${precioFinal}`;
    }else if (opcionSeleccionadaEnvio === 'Envio'){
        precioFinal = costoEnvio + subtotal;
        mensaje=
        `Hola Todo3D!!\nMi nombre es ${nombreUsuario}\nDesearía pedirles lo siguiente:
        ${pedido}
        \n*Método de envío:* ${opcionEnvio}\n*Domicilio:* ${dirección}\n*Método de pago:* ${opcionPago}\n*Cantidad de productos:* ${cantidadProductos}\n*Subtotal:* ${subtotal}\n*Costos de envío:* ${costoEnvio}\n*Total:* ${precioFinal}`;
    }else{
        precioFinal = subtotal;
        mensaje=
        `Hola Todo3D!!\nMi nombre es ${nombreUsuario}\nDesearía pedirles lo siguiente:
        ${pedido}
        \n*Método de envío:* ${opcionEnvio}\n*Método de pago:* ${opcionPago}\n*Cantidad de productos:* ${cantidadProductos}\n*Total:* ${precioFinal}`;
    }
    

    fetch('/comprar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({mensaje})
    })
    .then(response => response.json())
    .then(data => {
        
    })
    .catch(error => {
        console.error('Error en la solicitud:', error);
    });

    window.location.href = '/carrito';
}

async function confirmarPedidoIndividual(){
    
    let miRecordset;
    await fetch(`/pasarUltimoProductoVisto`)
    .then(response => response.json())
    .then(data => {
        miRecordset=data;
    })
    .catch(error => {
        console.error('Error en la solicitud:', error);
    });

    let pedido = `${cantidadProductos} x *${miRecordset[0].nombreProducto}* (${miRecordset[0].categoria}) => $${miRecordset[0].precio}`;;
    let subtotal = miRecordset[0].precio;
    let precioFinal = 0;
    let costoEnvio = 0;
    let opcionEnvio = '';
    let opcionPago = '';

     
    if(cantidadProductos <= 5){
        costoEnvio = 1000;
    }else if(cantidadProductos <= 10){
        costoEnvio = 2000;
    }else{
        costoEnvio = 3000;
    }
    

    if(opcionSeleccionadaPago === 'MercadoPago'){
        opcionPago = 'Mercado Pago';
    }else{
        opcionPago = 'Efectivo';
    }

    switch(opcionSeleccionadaEnvio){
        case 'Retiro':
            opcionEnvio = 'Entrega en domicilio del vendedor';
            break;
        case 'Envio':
            opcionEnvio = 'Envío a su domicilio';
            break;
        case 'Encuentro':
            opcionEnvio = 'Acordar punto de encuentro con el vendedor';
            break;
    }

    let mensaje;

    if(opcionSeleccionadaEnvio === 'Encuentro'){
        precioFinal = costoEnvio + subtotal;
        mensaje=
        `Hola Todo3D!!\nMi nombre es ${nombreUsuario}\nDesearía pedirles lo siguiente:\n\n${pedido}
        \n*Método de envío:* ${opcionEnvio}\n*Método de pago:* ${opcionPago}\n*Cantidad de productos:* ${cantidadProductos}\n*Subtotal:* ${subtotal}\n*Costos de envío:* ${costoEnvio}\n*Total:* ${precioFinal}`;
    }else if (opcionSeleccionadaEnvio === 'Envio'){
        precioFinal = costoEnvio + subtotal;
        mensaje=
        `Hola Todo3D!!\nMi nombre es ${nombreUsuario}\nDesearía pedirles lo siguiente:\n\n${pedido}
        \n*Método de envío:* ${opcionEnvio}\n*Domicilio:* ${dirección}\n*Método de pago:* ${opcionPago}\n*Cantidad de productos:* ${cantidadProductos}\n*Subtotal:* ${subtotal}\n*Costos de envío:* ${costoEnvio}\n*Total:* ${precioFinal}`;
    }else{
        precioFinal = subtotal;
        mensaje=
        `Hola Todo3D!!\nMi nombre es ${nombreUsuario}\nDesearía pedirles lo siguiente:\n\n${pedido}
        \n*Método de envío:* ${opcionEnvio}\n*Método de pago:* ${opcionPago}\n*Cantidad de productos:* ${cantidadProductos}\n*Total:* ${precioFinal}`;
    }
    

    fetch('/comprar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({mensaje})
    })
    .then(response => response.json())
    .then(data => {
        
    })
    .catch(error => {
        console.error('Error en la solicitud:', error);
    });

    window.location.href = '/carrito';
}

function atrasDerecha(){
    deshabilitarDerecha();
    habilitarIzquierda();

    window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
}

function deshabilitarIzquierda(){
    dvIzquierda.style.opacity = 0.4;
    dvDerecha.style.opacity = 1;
    inpDireccion.setAttribute('disabled', 'true');
    inpRadioRetiro.setAttribute('disabled', 'true');
    inpRadioEnvio.setAttribute('disabled', 'true');
    inpRadioEncuentro.setAttribute('disabled', 'true');
    btnContinuar.classList.replace('btnEnabledIzquierda', 'btnDisabledIzquierda');
    btnContinuar.setAttribute('disabled', 'true');
    btnCopiar.setAttribute('disabled', 'true');
    btnCopiar.style.cursor = 'default';
}

function deshabilitarDerecha(){
    derechaDisabled= true;
    inpRadioMercadoPago.setAttribute('disabled', 'true');
    inpRadioEfectivo.setAttribute('disabled', 'true');
    btnContinuarDerecha.classList.replace('btnContinuarEnabledDerecha', 'btnContinuarDisabledDerecha');
    btnAtrasDerecha.classList.replace('btnAtrasEnabledDerecha', 'btnAtrasDisabledDerecha');
    btnContinuarDerecha.setAttribute('disabled', 'true');
    btnAtrasDerecha.setAttribute('disabled', 'true');
}

function habilitarDerecha(){
    derechaDisabled= false;
    inpRadioMercadoPago.removeAttribute('disabled');
    inpRadioEfectivo.removeAttribute('disabled');
    btnContinuarDerecha.classList.replace('btnContinuarDisabledDerecha', 'btnContinuarEnabledDerecha');
    btnAtrasDerecha.classList.replace('btnAtrasDisabledDerecha', 'btnAtrasEnabledDerecha');
    btnContinuarDerecha.removeAttribute('disabled');
    btnAtrasDerecha.removeAttribute('disabled');
}

function habilitarIzquierda(){
    dvIzquierda.style.opacity = 1;
    dvDerecha.style.opacity = 0.4;
    inpDireccion.removeAttribute('disabled');
    inpRadioRetiro.removeAttribute('disabled');
    inpRadioEnvio.removeAttribute('disabled');
    inpRadioEncuentro.removeAttribute('disabled');
    btnContinuar.classList.replace('btnDisabledIzquierda', 'btnEnabledIzquierda');
    btnContinuar.removeAttribute('disabled');
    btnCopiar.removeAttribute('disabled');
    btnCopiar.style.cursor = 'pointer';
}

function copiar(){
    navigator.clipboard.writeText('Saraza 4268');

    dvCopiado.style.opacity = 1;

    setTimeout(function() {
        dvCopiado.style.opacity = 0;
    }, 700);
}

function clickRetiro(){
    opcionSeleccionadaEnvio = 'Retiro';
    dvOpcionRetiro.style.opacity = 1;
    dvOpcionEnvio.style.opacity = 0.5;
    dvOpcionEncuentro.style.opacity = 0.5;
}

function clickEnvio(){
    opcionSeleccionadaEnvio = 'Envio';
    dvOpcionRetiro.style.opacity = 0.5;
    dvOpcionEnvio.style.opacity = 1;
    dvOpcionEncuentro.style.opacity = 0.5;
}

function clickEncuentro(){
    opcionSeleccionadaEnvio = 'Encuentro';
    dvOpcionRetiro.style.opacity = 0.5;
    dvOpcionEnvio.style.opacity = 0.5;
    dvOpcionEncuentro.style.opacity = 1;
}

function clickDvRetiro(){
    opcionSeleccionadaEnvio = 'Retiro';
    dvOpcionRetiro.style.opacity = 1;
    dvOpcionEnvio.style.opacity = 0.5;
    dvOpcionEncuentro.style.opacity = 0.5;
    inpRadioRetiro.checked = true;
}

function clickDvEnvio(){
    opcionSeleccionadaEnvio = 'Envio';
    dvOpcionRetiro.style.opacity = 0.5;
    dvOpcionEnvio.style.opacity = 1;
    dvOpcionEncuentro.style.opacity = 0.5;
    inpRadioEnvio.checked = true;
}

function clickDvEncuentro(){
    opcionSeleccionadaEnvio = 'Encuentro';
    dvOpcionRetiro.style.opacity = 0.5;
    dvOpcionEnvio.style.opacity = 0.5;
    dvOpcionEncuentro.style.opacity = 1;
    inpRadioEncuentro.checked = true;
}

function clickMercadoPago(){
    opcionSeleccionadaPago = 'MercadoPago';
    dvMercadoPago.style.opacity = 1;
    dvEfectivo.style.opacity = 0.5;
}

function clickEfectivo(){
    opcionSeleccionadaPago = 'Efectivo';
    dvMercadoPago.style.opacity = 0.5;
    dvEfectivo.style.opacity = 1;
}

function clickDvMercadoPago(){
    if(!derechaDisabled){
        opcionSeleccionadaPago = 'MercadoPago';
        dvMercadoPago.style.opacity = 1;
        dvEfectivo.style.opacity = 0.5;
        inpRadioMercadoPago.checked = 'true';
    }
}

function clickDvEfectivo(){
    if(!derechaDisabled){
        opcionSeleccionadaPago = 'Efectivo';
        dvMercadoPago.style.opacity = 0.5;
        dvEfectivo.style.opacity = 1;
        inpRadioEfectivo.checked = 'true';
    }
}
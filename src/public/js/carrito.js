let botonesEliminar = document.querySelectorAll('.btnEliminar');
const btnVaciarCarrito = document.getElementById('btnVaciarCarrito').addEventListener('click', vaciarCarrito) || 'pedo';
const btnComprar = document.getElementById('btnComprarEnable').addEventListener('click', comprar) || 'pene';

botonesEliminar.forEach(boton => {
    boton.addEventListener('click', eliminarProductosCarrito)
});

function vaciarCarrito(){
    fetch(`/vaciarCarrito`,{
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        window.location.reload();
    })
    .catch(error => console.error('Error al vaciar el carrito:', error));
}

function eliminarProductosCarrito(e){
    const id = e.currentTarget.id;
    fetch(`/eliminarDelCarrito`,{
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({id})
    }).then(response => {
        window.location.reload();
    })
    .catch(error => console.error('Error al eliminar del carrito:', error));
}

async function comprar(){
    let elRecordset;
    await fetch('/obtenerProductos')
    .then(response => response.json())
    .then(data => {
        elRecordset=data;
    })
    .catch(error => {
        console.error('Error en la solicitud:', error);
    });
    console.log(elRecordset);

    let pedido ='';
    let subtotal = 0;
    let precioFinal = 0;
    let cantidadProductos = 0;
    let costoEnvio = 0;

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

    precioFinal = costoEnvio + subtotal;

    let mensaje=
    `Hola Todo3D!!\nDesearía pedirles lo siguiente:
    ${pedido}
    \n*Cantidad de productos:* ${cantidadProductos}\n*Subtotal:* ${subtotal}\n*Costo del envío:* ${costoEnvio}\n*Total:* ${precioFinal}`;

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
}
let botonesEliminar = document.querySelectorAll('.btnEliminar');
const btnVaciarCarrito = document.getElementById('btnVaciarCarrito').addEventListener('click', vaciarCarrito) || 'pedo';
const btnComprar = document.getElementById('btnComprarEnable').addEventListener('click', comprar) || 'pene';
const inpNombre = document.getElementById('inpNombre');

inpNombre.addEventListener('keyup', pasarNombreAlBack);

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

function comprar(){
    if(inpNombre.value === ''){
        alert('Por favor, indique su nombre antes de comprar');
    }else{
        window.location.href = '/compra';
    }   
}

function pasarNombreAlBack(){
    let nombreUsuario = inpNombre.value;
    fetch(`/pasarNombreAlBack`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({nombreUsuario})
    }).then(response => response.text())
    .catch(error => console.error('Error al vaciar el carrito:', error));
}

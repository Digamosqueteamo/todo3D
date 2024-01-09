let botonesEliminar = document.querySelectorAll('.btnEliminar');
const btnVaciarCarrito = document.getElementById('btnVaciarCarrito').addEventListener('click', vaciarCarrito) || 'pedo';

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
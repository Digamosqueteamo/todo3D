let ProductosAgregados = nProductosEnCarrito;
let ObjetoProductosEnCarrito= JSON.parse(ObjProductosAgregados);
//let ObjetoProductosEnCarrito= ObjProductosAgregados;
let botonesAgregar = document.querySelectorAll('.btnIconCarritoCard');
let ids;

const dvNProductosAgregados = document.getElementById('dvNProductosCarrito');
const pNProductosAgregados = document.getElementById('pNProductosCarrito');

botonesAgregar.forEach(boton => {
    boton.addEventListener('click', agregarProductosCarrito)
})

function agregarProductosCarrito(e){
    const id= e.currentTarget.id;
    ProductosAgregados++;
    //console.log(ObjetoProductosEnCarrito);
    if(ObjetoProductosEnCarrito.some(producto => producto.id === id)){
        ObjetoProductosEnCarrito.find(producto => producto.id === id).cantidad++;
        console.log(`El objeto ya estaba y ahora su cantidad es de: ${ObjetoProductosEnCarrito.find(producto => producto.id === id).cantidad}`);
    }else{
        ObjetoProductosEnCarrito.push({
            id: id,
            cantidad: 1
        })
        console.log('El objeto no estaba agregado');
    }

    pNProductosAgregados.textContent = ProductosAgregados;
    
    fetch(`/agregarAlCarrito`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ObjetoProductosEnCarrito})
    }).then(response => response.text())
    .then(data => {
    })
    .catch(error => console.error('Error al agregar al carrito:', error));
}

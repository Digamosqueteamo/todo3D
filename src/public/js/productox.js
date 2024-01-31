const btnMenos = document.getElementById('btnCambiarCantidadMenos');
const btnMas = document.getElementById('btnCambiarCantidadMas');
const pEnvio = document.getElementById('pEnvio');
const btnAgregarAlCarrito = document.getElementsByClassName('btnAgregarAlCarrito');
const pNProductosAgregados = document.getElementById('pNProductosCarrito');
const btnComprar = document.getElementById('btnComprar').addEventListener('click', comprar);

//agregamos el evento después porque sino perdemos las propiedades del elemento
btnMenos.addEventListener('click', menos);
btnMas.addEventListener('click', mas);
btnAgregarAlCarrito[0].addEventListener('click', agregarAlCarrito);

const pCantidad = document.getElementById('pCambiarCantidad');

function menos(){
    if(parseInt(pCantidad.textContent) !== 1){
        btnMas.classList.remove('disable');
        let cantidad = parseInt(pCantidad.textContent);
        cantidad--;
        pCantidad.textContent=cantidad.toString();
        if(cantidad === 1){
            btnMenos.classList.add('disable');  
        }
        pEnvio.textContent = evaluarCantidad(cantidad);
    } 
}

function mas(){
    if(parseInt(pCantidad.textContent) !== 15){
        btnMenos.classList.remove('disable');
        let cantidad = parseInt(pCantidad.textContent);
        cantidad++;
        pCantidad.textContent=cantidad.toString();
        if(cantidad === 15){
            btnMas.classList.add('disable');  
        }
        pEnvio.textContent = evaluarCantidad(cantidad);
    }
}

function evaluarCantidad(cantidad){
    if(cantidad <= 5){
        return 1000;
    } else if(cantidad <= 10){
        return 2000;
    } else{
        return 3000;
    }
}

function agregarAlCarrito(e){
    const id= e.currentTarget.id;
    
    fetch(`/agregarAlCarrito`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({id: id, cantidad: pCantidad.textContent})
    }).then(response => response.text())
    .then(data => {
        pNProductosAgregados.textContent = data;
    })
    .catch(error => console.error('Error al agregar al carrito:', error));
}

function comprar(){
    fetch(`/comprarIndividual`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({cantidad: pCantidad.textContent})
    }).then(response => response.text())
    .then(data => {
    })
    .catch(error => console.error('Error al comprar:', error));
}
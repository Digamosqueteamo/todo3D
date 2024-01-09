let botonesAgregar = document.querySelectorAll('.btnIconCarritoCard');
let cards = document.querySelectorAll('.dvCard');
const inputBuscador = document.getElementById('inputBuscador')
const main = document.getElementById('main');


const pNProductosAgregados = document.getElementById('pNProductosCarrito');

cards.forEach(card => {
  card.addEventListener('click', mostrarProducto)
})

botonesAgregar.forEach(boton => {
  boton.addEventListener('click', agregarProductosCarrito)
})

inputBuscador.addEventListener('keyup', buscar);
inputBuscador.addEventListener('blur', irAlInicio); //sirve para que cada vez que se salga de input buscador se vuelva al inicio

function irAlInicio(){
  window.location.href = `/`;
}

function buscar(e){
  const buscado = e.target.value;
  fetch(`/buscar?q=${encodeURIComponent(buscado)}`)
  .then(response => response.text())
  .then(data => {
    main.innerHTML = data;
  })
  .catch(error => {
    console.error('Error en la solicitud:', error);
  });
}


function agregarProductosCarrito(e){
    const id= e.currentTarget.id;
    e.stopPropagation();
    fetch(`/agregarAlCarrito`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({id: id, cantidad:1})
    }).then(response => response.text())
    .then(data => {
        pNProductosAgregados.textContent = data;
    })
    .catch(error => console.error('Error al agregar al carrito:', error));
}

function mostrarProducto(e){
  const id= e.currentTarget.id;
  window.location.href = `/mostrar?q=${encodeURIComponent(id)}`;
}
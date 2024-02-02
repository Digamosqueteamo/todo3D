import {Router} from 'express';
import express from 'express';
import sql from 'mssql';
import whatsapp from '../lib/whatsapp.js';


const router= Router();
let ObjProductosAgregados = [];
let nArticulos = 0;
let ultimaCategoria = 'Inicio';
let idUltimoProductoVisto;

//settings
router.use(express.json()); //te permite acceder a los bodies de las request con datos en formato JSON
//router.use(express.urlencoded({extended:true}))

const config = {
  user: 'sa',
  password: '',
  server: 'PCSANTI',
  database: 'PaginaVentas3D',
  options: {
    encrypt: false, 
  },
};

router.get('/', async (req, res) => {
    try{
      ultimaCategoria = 'Inicio';
      nArticulos = req.cookies.nArticulos || 0;
      ObjProductosAgregados = req.cookies.ObjProductosAgregados || [];
      let miRecordset;
      await sql.connect(config);
      const myQuery = "SELECT top 3 * FROM Productos ORDER BY NEWID()";
      miRecordset=(await sql.query(myQuery)).recordset;
      res.render('index', {miRecordset: miRecordset, nProductosEnCarrito: nArticulos, esCategoria: 0});
    }catch{}
});

router.post('/agregarAlCarrito', (req, res) => {
  const id = req.body.id;
  const cantidad = parseInt(req.body.cantidad);
  if(ObjProductosAgregados.some(producto => producto.id === id)){
    ObjProductosAgregados.find(producto => producto.id === id).cantidad += cantidad;
    //console.log(`El objeto ya estaba y ahora su cantidad es de: ${ObjProductosAgregados.find(producto => producto.id === id).cantidad}`);
  }else{
    ObjProductosAgregados.push({
      id: id,
      cantidad: cantidad
    })
    //console.log('El objeto no estaba agregado');
  }
  nArticulos = 0;
  ObjProductosAgregados.forEach(producto => {
    nArticulos += producto.cantidad;
  });

  res.cookie('nArticulos', nArticulos, {
    maxAge:43200000
  });
  res.cookie('ObjProductosAgregados', ObjProductosAgregados, {
    maxAge:43200000
  });
  res.json(nArticulos);
});

router.delete('/eliminarDelCarrito', (req, res) => {
  //console.log(ObjProductosAgregados);
  const id = req.body.id;
  ObjProductosAgregados.find(producto => producto.id === id).cantidad--;
  ObjProductosAgregados.forEach(producto => {
    if(producto.cantidad=== 0){
      ObjProductosAgregados = ObjProductosAgregados.filter(producto2 => producto2.id !== producto.id);
      //por cada producto en el array comprueba si su id es igual al id del producto con cantidad 0, si no lo es da true (se queda)
      //si lo es da false (se va)
    }
  })
  nArticulos = 0;
  ObjProductosAgregados.forEach(producto => {
    nArticulos += producto.cantidad;
  });
  res.cookie('nArticulos', nArticulos, {
    maxAge:43200000
  });
  res.cookie('ObjProductosAgregados', ObjProductosAgregados, {
    maxAge:43200000
  });
  res.sendStatus(200);
});

router.get('/carrito', async (req, res) =>{
  try{
    let arrayIds= [];
    let i = 0;
    ObjProductosAgregados.sort((a,b) => {
      if(a.id < b.id){
        return -1;
      } else if(a.id > b.id){
        return 1;
      }
      return 0;
    });
    ObjProductosAgregados.forEach(producto => {
      arrayIds[i] = producto.id;
      i++;
    });
    i = 0;
    await sql.connect(config);
    let myQuery = `SELECT * FROM PRODUCTOS where id in (${arrayIds})`;
    let miRecordset = (await sql.query(myQuery)).recordset;

    miRecordset.forEach(producto => {
      producto.cantidad = ObjProductosAgregados[i].cantidad;
      i++;
    })
    //console.log(miRecordset)

    res.render('carrito', {miRecordset: miRecordset, status: 0, nombreUsuario: req.cookies.nombreUsuario || ''});
}
catch(e){res.render('carrito', {status: 1});}
});

router.get('/todosLosProductos', async (req, res) => {
  try{
      ultimaCategoria= 'TodosLosProductos';
      let miRecordset;
      await sql.connect(config);
      const myQuery = "SELECT * FROM Productos";
      miRecordset=(await sql.query(myQuery)).recordset;
      res.render('index', {miRecordset: miRecordset, nProductosEnCarrito: nArticulos, esCategoria: 2});
  }catch{}
});

router.get('/mates', async (req, res) => {
  try{
      ultimaCategoria='Mates';
      let miRecordset;
      await sql.connect(config);
      const myQuery = "SELECT * FROM Productos WHERE categoria = 'Mates'";
      miRecordset=(await sql.query(myQuery)).recordset;
      res.render('index', {miRecordset: miRecordset, nProductosEnCarrito: nArticulos, esCategoria: 1});
  }catch{}
});

router.get('/floreros', async (req, res) => {
  try{
      ultimaCategoria='Floreros';
      let miRecordset;
      await sql.connect(config);
      const myQuery = "SELECT * FROM Productos WHERE categoria = 'Floreros'";
      miRecordset=(await sql.query(myQuery)).recordset;
      res.render('index', {miRecordset: miRecordset, nProductosEnCarrito: nArticulos, esCategoria: 1});
  }catch{}
});

router.delete('/vaciarCarrito',(req, res) => {
  try{
      ObjProductosAgregados = [];

      res.cookie('nArticulos', '0', {
        maxAge:43200000
      });
      res.cookie('ObjProductosAgregados', ObjProductosAgregados, {
        maxAge:43200000
      });
      res.sendStatus(200);
  }catch{}
});

router.get('/buscar', async (req, res) =>{
  const buscado = req.query.q;
  let miRecordset;
  let myQuery;
  await sql.connect(config);
  switch(ultimaCategoria){
    case 'Inicio':
      myQuery = `SELECT * FROM Productos WHERE nombreProducto LIKE lower('%${buscado}%')`;
      break;
    case 'TodosLosProductos':
      myQuery = `SELECT * FROM Productos WHERE nombreProducto LIKE lower('%${buscado}%')`;
      break;
    case 'Mates':
      myQuery = `SELECT * FROM Productos WHERE nombreProducto LIKE lower('%${buscado}%') and categoria = 'Mates'`;
      break;
    case 'Floreros':
      myQuery = `SELECT * FROM Productos WHERE nombreProducto LIKE lower('%${buscado}%') and categoria = 'Floreros'`;
      break;
  }
  miRecordset=(await sql.query(myQuery)).recordset;
  res.render('busqueda', {miRecordset})
});

router.get('/mostrar', async (req, res) => {
  const id = req.query.q;
  let miRecordset;
  await sql.connect(config);
  const myQuery = `SELECT * FROM Productos WHERE id = '${id}'`;
  miRecordset=(await sql.query(myQuery)).recordset;
  res.render('productox', {miRecordset: miRecordset, nProductosEnCarrito: nArticulos, nombreUsuario: req.cookies.nombreUsuario || ''});
});

router.get('/obtenerProductos', async (req, res) =>{
  try{
    let arrayIds= [];
    let i = 0;
    ObjProductosAgregados.sort((a,b) => {
      if(a.id < b.id){
        return -1;
      } else if(a.id > b.id){
        return 1;
      }
      return 0;
    });
    ObjProductosAgregados.forEach(producto => {
      arrayIds[i] = producto.id;
      i++;
    });
    i = 0;
    await sql.connect(config);
    let myQuery = `SELECT * FROM PRODUCTOS where id in (${arrayIds})`;
    let miRecordset = (await sql.query(myQuery)).recordset;

    miRecordset.forEach(producto => {
      producto.cantidad = ObjProductosAgregados[i].cantidad;
      i++;
    })
    //console.log(miRecordset);
    res.json(miRecordset);
  }
  catch(e){res.send(`error: ${e}`);}
});

router.post('/pasarIdUltimoProductoVisto', async (req, res) =>{
  idUltimoProductoVisto = req.body.idUltimoProductoVisto;
});

router.post('/comprar', async (req, res) => {
  const mensaje = req.body.mensaje;
  const telefono = '+541123602675';
  const chatId = telefono.substring(1) + "@c.us";
  whatsapp.sendMessage(chatId, mensaje);
});

/*router.post('/comprarIndividual', async (req, res) => {
  let miRecordset;
  await sql.connect(config);
  const myQuery = `SELECT * FROM Productos WHERE id = '${idUltimoProductoVisto}'`;
  miRecordset=(await sql.query(myQuery)).recordset;

  const cantidad = req.body.cantidad;

  let costoEnvio;

  if(cantidad <= 5){
    costoEnvio= 1000;
  } else if(cantidad <= 10){
    costoEnvio= 2000;
  } else{
    costoEnvio= 3000;
  }

  let mensaje=
  `Hola Todo3D!!\nDesearía pedirles lo siguiente:\n${cantidad} x *${miRecordset[0].nombreProducto}* (${miRecordset[0].categoria}) => ${miRecordset[0].precio}
  \n*Cantidad de productos:* ${cantidad}\n*Subtotal:* ${cantidad * miRecordset[0].precio}\n*Costo del envío:* ${costoEnvio}\n*Total:* ${cantidad * miRecordset[0].precio + costoEnvio}`;

  const telefono = '+541123602675';
  const chatId = telefono.substring(1) + "@c.us";
  whatsapp.sendMessage(chatId, mensaje);
});*/

router.get('/compra', async (req, res) =>{
  let costoEnvio;

  if(nArticulos <= 5){
    costoEnvio = 1000;
  }else if(nArticulos <= 10){
    costoEnvio = 2000;
  }else{
    costoEnvio = 3000;
  }

  res.render('compra', {nProductosEnCarrito: nArticulos, costoEnvio: costoEnvio, esIndividual: 'no', cantidadProductos: nArticulos, nombreUsuario: req.cookies.nombreUsuario});
});

router.get('/compraIndividual', async (req, res) =>{

  let cantidadProductos = req.query.q;
  let costoEnvio;
  if(cantidadProductos <= 5){
    costoEnvio = 1000;
  }else if(cantidadProductos <= 10){
    costoEnvio = 2000;
  }else{
    costoEnvio = 3000;
  }

  res.render('compra', {nProductosEnCarrito: nArticulos, costoEnvio: costoEnvio, esIndividual: 'si', cantidadProductos: cantidadProductos, nombreUsuario: req.cookies.nombreUsuario});
});

router.get('/pasarUltimoProductoVisto', async (req, res) =>{
  let miRecordset;
  await sql.connect(config);
  const myQuery = `SELECT * FROM Productos WHERE id = '${idUltimoProductoVisto}'`;
  miRecordset=(await sql.query(myQuery)).recordset;
  res.json(miRecordset);
});

router.post('/pasarNombreAlBack', (req, res) =>{
  res.cookie('nombreUsuario', req.body.nombreUsuario, {
    maxAge:43200000
  });
  res.sendStatus(200);
  //si no vas a devolver nada, siempre tenés que mandar un código de status
});

export default router;
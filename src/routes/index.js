import {Router} from 'express';
import express from 'express';
import sql from 'mssql';


const router= Router();
let ObjProductosAgregados = [];
let nArticulos = 0;
let ultimaCategoria = 'Inicio';

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
      res.render('index', {miRecordset: miRecordset, nProductosEnCarrito: nArticulos});
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
  console.log(ObjProductosAgregados);
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
    res.render('carrito', {miRecordset: miRecordset, status: 0});
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
      res.render('index', {miRecordset: miRecordset, nProductosEnCarrito: nArticulos});
  }catch{}
});

router.get('/mates', async (req, res) => {
  try{
      ultimaCategoria='Mates';
      let miRecordset;
      await sql.connect(config);
      const myQuery = "SELECT * FROM Productos WHERE categoria = 'Mates'";
      miRecordset=(await sql.query(myQuery)).recordset;
      res.render('index', {miRecordset: miRecordset, nProductosEnCarrito: nArticulos});
  }catch{}
});

router.get('/floreros', async (req, res) => {
  try{
      ultimaCategoria='Floreros';
      let miRecordset;
      await sql.connect(config);
      const myQuery = "SELECT * FROM Productos WHERE categoria = 'Floreros'";
      miRecordset=(await sql.query(myQuery)).recordset;
      res.render('index', {miRecordset: miRecordset, nProductosEnCarrito: nArticulos});
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
  res.render('productox', {miRecordset: miRecordset, nProductosEnCarrito: nArticulos});
});

export default router;
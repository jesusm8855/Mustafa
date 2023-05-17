const express = require("express");
const router = express.Router();

const pool = require("../database");

const XlsxPopulate = require('xlsx-populate');
const path = require("path");

router.get("/", async (req,res)=>{
	const productos = await pool.query('SELECT*FROM productos_bodega');
	const Productos = productos.rows
	res.render("./productos_bodega/list", {Productos : Productos});
});

router.post("/filtro", async (req,res)=>{
		const {producto_b, marca_b, ubicacion_b, lugar_pedido_b} = req.body;
	const busqueda = {
		producto_b: `${producto_b}%`, 
		marca_b: `${marca_b}%`, 
		ubicacion_b: `${ubicacion_b}%`,
		lugar_pedido_b:`${lugar_pedido_b}%`
	}

	const productos = await pool.query('SELECT * FROM productos_bodega WHERE producto ILIKE $1 AND marca ILIKE $2 AND ubicacion_bodega ILIKE $3 AND lugar_pedido_bodega ILIKE $4',[busqueda.producto_b,busqueda.marca_b,busqueda.ubicacion_b, busqueda.lugar_pedido_b]);
	const Productos = productos.rows;
	res.render("./productos_bodega/list", {Productos : Productos});
});

router.get("/pedir", async (req,res)=>{
		const productos = await pool.query('SELECT*FROM productos_bodega WHERE estado_cantidades_bodega = true');
	const Productos = productos.rows
	res.render("./productos_bodega/list", {Productos : Productos});
});

router.get("/add",(req,res)=>{
	res.render("./productos_bodega/add");
});

router.post("/add", async (req,res)=>{
	const { producto, marca , cantidad_bodega, cantidad_minima_bodega, unidad_medida_bodega, ubicacion_bodega, piso_bodega, posicion_bodega, lugar_pedido_bodega,descripcion } = req.body;
	const newproduct ={
		producto, 
		marca, 
		cantidad_bodega, 
		cantidad_minima_bodega, 
		unidad_medida_bodega, 
		ubicacion_bodega, 
		piso_bodega, 
		posicion_bodega, 
		lugar_pedido_bodega,
		descripcion
	};

	 if (typeof newproduct.producto === 'string') {
    		const query = {
		text: 'INSERT INTO productos_bodega (id , producto , marca , cantidad_bodega , cantidad_minima_bodega , unidad_medida_bodega , ubicacion_bodega , piso_bodega , posicion_bodega , lugar_pedido_bodega , descripcion) VALUES(DEFAULT, $1, $2,$3,$4,$5,$6,$7,$8,$9,$10)',
		values: [...Object.values(newproduct)]
	};



	await pool.query(query);
  }else{
  		for (let i = 0; i < newproduct.producto.length; i++) {
	const query = {
		text: 'INSERT INTO productos_bodega (id , producto , marca , cantidad_bodega , cantidad_minima_bodega , unidad_medida_bodega , ubicacion_bodega , piso_bodega , posicion_bodega , lugar_pedido_bodega , descripcion) VALUES(DEFAULT, $1, $2,$3,$4,$5,$6,$7,$8,$9,$10)',
		values: [newproduct.producto[i], newproduct.marca[i], newproduct.cantidad_bodega[i], newproduct.cantidad_minima_bodega[i], newproduct.unidad_medida_bodega[i], newproduct.ubicacion_bodega[i], newproduct.piso_bodega[i], newproduct.posicion_bodega[i], newproduct.lugar_pedido_bodega[i], newproduct.descripcion[i]]
	};

	await pool.query(query);

	}

  }

	res.redirect("/productos_bodega");
})

router.get("/edit/:id", async(req,res)=>{
	const {id} = req.params;
	const result = await pool.query('SELECT*FROM productos_bodega WHERE id = $1',[id]);
	const producto = result.rows[0];
	res.render("./productos_bodega/edit", {producto:producto});
});

router.post("/edit/:id", async(req,res)=>{
	const {id} = req.params;
	const { producto, marca , cantidad_bodega, cantidad_minima_bodega, unidad_medida_bodega, ubicacion_bodega, piso_bodega, posicion_bodega, lugar_pedido_bodega,descripcion } = req.body;
	const newproduct ={
		producto, 
		marca, 
		cantidad_bodega, 
		cantidad_minima_bodega, 
		unidad_medida_bodega, 
		ubicacion_bodega, 
		piso_bodega, 
		posicion_bodega, 
		lugar_pedido_bodega,
		descripcion,
		id: id
	};
	await pool.query('UPDATE productos_bodega SET producto = $1 , marca = $2 , cantidad_bodega = $3 , cantidad_minima_bodega = $4 , unidad_medida_bodega = $5, ubicacion_bodega = $6, piso_bodega = $7, posicion_bodega = $8, lugar_pedido_bodega = $9,descripcion = $10 WHERE id = $11',
		[...Object.values(newproduct)]);
	res.redirect("/productos_bodega");
});


router.get("/delete/:id",async(req,res)=>{
	const {id} = req.params;
	const query1 ={
		text:'UPDATE productos_venta SET id_bodega = NULL WHERE id_bodega = $1',
		values: [id]

	}

	const query2 = {
		text: 'DELETE FROM productos_bodega WHERE id = $1;',
		values: [id]
	};
	await pool.query(query1);
	await pool.query(query2);

	res.redirect("/productos_bodega")
})

router.post("/pedido",async(req,res)=>{
	const {id_producto,cantidad_pedido_bodega} = req.body
	const newproduct = {
		id_producto,
		cantidad_pedido: cantidad_pedido_bodega
	};

	for (let i = 0; i < newproduct.cantidad_pedido.length; i++) {
		if (newproduct.cantidad_pedido[i] == ""){
			newproduct.cantidad_pedido[i] = 0;
		}
		const query = {
			text: 'UPDATE productos_bodega SET cantidad_pedido_bodega = $1 WHERE id = $2',
			values: [newproduct.cantidad_pedido[i], newproduct.id_producto[i]]
			}
		await pool.query(query);
	};
	
	
	res.redirect("/productos_bodega");
})


router.get("/pedido", async(req,res)=>{
	const productos = await pool.query('SELECT id,producto,marca,cantidad_pedido_bodega,unidad_medida_bodega,lugar_pedido_bodega FROM productos_bodega WHERE cantidad_pedido_bodega <> 0;');
	const Productos = productos.rows;
	res.render("./productos_bodega/pedido", {Productos : Productos});
})

router.post("/pedido/filtro", async (req,res)=>{
		const {producto_b, marca_b, ubicacion_b, lugar_pedido_b} = req.body;
	const busqueda = {
		producto_b: `${producto_b}%`, 
		marca_b: `${marca_b}%`, 
		ubicacion_b: `${ubicacion_b}%`,
		lugar_pedido_b:`${lugar_pedido_b}%`
	}

	const productos = await pool.query('SELECT * FROM productos_bodega WHERE cantidad_pedido_bodega <> 0 AND producto ILIKE $1 AND marca ILIKE $2 AND ubicacion_bodega ILIKE $3 AND lugar_pedido_bodega ILIKE $4',[busqueda.producto_b,busqueda.marca_b,busqueda.ubicacion_b, busqueda.lugar_pedido_b]);
	const Productos = productos.rows;
	res.render("./productos_bodega/pedido", {Productos : Productos});
});


router.get("/pedido/delete/:id", async(req,res)=>{
	const {id} = req.params;
	pool.query('UPDATE productos_bodega SET cantidad_pedido_bodega = 0 WHERE id = $1',[id]);
	res.redirect("/productos_bodega/pedido");
})

router.post("/pedido/modificado",async(req,res)=>{
	const {id_producto,cantidad_pedido_bodega} = req.body
	const newproduct = {
		id_producto,
		cantidad_pedido: cantidad_pedido_bodega
	};

	for (let i = 0; i < newproduct.cantidad_pedido.length; i++) {
		if (newproduct.cantidad_pedido[i] == ""){
			newproduct.cantidad_pedido[i] = 0;
		}
		const query = {
			text: 'UPDATE productos_bodega SET cantidad_pedido_bodega = $1 WHERE id = $2',
			values: [newproduct.cantidad_pedido[i], newproduct.id_producto[i]]
			}
		await pool.query(query);
	};
	
	
	res.redirect("/productos_bodega/pedido");
})

router.get("/pedido/excel", async (req,res)=>{

	async function exportarDatosExcel() {
  try {

    // Realiza una consulta para obtener los datos de la base de datos
    const tabla = await pool.query('SELECT producto,marca,cantidad_pedido_bodega,unidad_medida_bodega,lugar_pedido_bodega FROM productos_bodega WHERE cantidad_pedido_bodega <> 0;');
    const rows = tabla.rows;

    // Crea un nuevo libro de Excel
    const workbook = await XlsxPopulate.fromBlankAsync();
    const sheet = workbook.sheet(0);

    // Escribe los encabezados de las columnas
    sheet.cell('A1').value('Producto');
    sheet.cell('B1').value('Marca');
    sheet.cell('C1').value('Pedido');
    sheet.cell('D1').value('U-M');
    sheet.cell('E1').value('Lugar pedido');

    // Escribe los datos en el archivo Excel
    rows.forEach((row, index) => {
      sheet.cell(`A${index + 2}`).value(row.producto);
      sheet.cell(`B${index + 2}`).value(row.marca);
      sheet.cell(`C${index + 2}`).value(row.cantidad_pedido_bodega);
      sheet.cell(`D${index + 2}`).value(row.unidad_medida_bodega);
      sheet.cell(`E${index + 2}`).value(row.lugar_pedido_bodega);
    });

    // Guarda el archivo Excel
    // const direccion = path.join(__dirname, 'excel.xlsx' );

    const escritorio = path.join(
  process.env.HOME || process.env.USERPROFILE,
  'Desktop'
);

// Definir una ruta en el escritorio
const direccion = path.join(escritorio, 'Pedidos excel', 'excel.xlsx');
    await workbook.toFileAsync(direccion);

    console.log('Datos exportados exitosamente a un archivo Excel.');
  } catch (error) {
    console.error('Error al exportar los datos:', error);
  } finally {
  }
}

	exportarDatosExcel()

	res.redirect("/productos_bodega/pedido")
})

router.get("/pedido/concretar",async(req,res)=>{
	const consulta = await pool.query(`
		SELECT id,producto,cantidad_pedido_bodega,cantidad_bodega FROM productos_bodega`);

	const result = consulta.rows;

	result.forEach(async(e) => {
    const operacion = (Number(e.cantidad_bodega) + Number(e.cantidad_pedido_bodega));
    // console.log(`$Cantidad Bodega: ${e.cantidad_bodega} + cantidad pedido: ${e.cantidad_pedido_bodega}`)
    // console.log(typeof e.cantidad_bodega)
    // console.log(operacion);
    await pool.query('UPDATE productos_bodega SET cantidad_bodega = $1 WHERE id = $2',[operacion, e.id]);
	
	});

 	await pool.query('UPDATE productos_bodega SET cantidad_pedido_bodega = 0');
	res.redirect("/productos_bodega");
})






module.exports = router
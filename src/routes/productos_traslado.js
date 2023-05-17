const express = require("express");
const router = express.Router();

const pool = require("../database");

router.get("/", async (req,res)=>{
	const productos = await pool.query('SELECT*FROM productos_venta');
	const Productos = productos.rows;
	res.render("./productos_traslado/productos", {Productos : Productos});
});

router.post("/filtro", async (req,res)=>{
	const {producto_b, marca_b, ubicacion_b} = req.body;
	const busqueda = {
		producto_b: `${producto_b}%`, 
		marca_b: `${marca_b}%`, 
		ubicacion_b: `${ubicacion_b}%`
	}

	const productos = await pool.query('SELECT * FROM productos_venta WHERE producto ILIKE $1 AND marca ILIKE $2 AND ubicacion_venta ILIKE $3',[busqueda.producto_b,busqueda.marca_b,busqueda.ubicacion_b]);
	const Productos = productos.rows;

	res.render("./productos_traslado/productos", {Productos : Productos});
});


router.post("/add_list/:id", async(req,res)=>{
	const {id} = req.params;
	const { cantidad_traslado, unidad_medida_traslado } = req.body;
	newproduct={
		producto_traslado: true,
		cantidad_traslado,
		unidad_medida_traslado,
		id: id
	};
	
	await pool.query('UPDATE productos_venta SET producto_traslado = $1, cantidad_traslado = $2, unidad_medida_traslado = $3 WHERE id = $4',
	[...Object.values(newproduct)])
	res.redirect("/productos_traslado");
});

router.post("/delete_list/:id", async(req,res)=>{
	const {id} = req.params;
	await pool.query('UPDATE productos_venta SET producto_traslado = $1, cantidad_traslado = $2, unidad_medida_traslado = $3 WHERE id = $4',
	[false,0,"",id])
	res.redirect("/productos_traslado");
});

router.get("/lista",async(req,res)=>{


	const productos = await pool.query(`
		SELECT productos_venta.id AS id_producto_venta, productos_venta.producto AS producto_venta,productos_venta.producto_traslado,productos_venta.cantidad_traslado,productos_bodega.unidad_medida_bodega,productos_venta.estado_traslado ,productos_bodega.id AS id_producto_bodega, productos_bodega.producto AS producto_bodega, productos_bodega.marca, productos_bodega.ubicacion_bodega,productos_bodega.piso_bodega,posicion_bodega 
		FROM productos_venta 
		LEFT JOIN productos_bodega ON productos_venta.id_bodega = productos_bodega.id
		WHERE productos_venta.producto_traslado = true;` )

	const Productos = productos.rows;
	res.render("./productos_traslado/list", {Productos : Productos});
});

router.get("/marcar/:id",async(req,res)=>{
	const {id} = req.params;
	await pool.query('UPDATE productos_venta SET estado_traslado = $1 WHERE id = $2',
	[true,id])
	res.redirect("/productos_traslado/lista");
});

router.get("/desmarcar/:id",async(req,res)=>{
	const {id} = req.params;
	await pool.query('UPDATE productos_venta SET estado_traslado = $1 WHERE id = $2',
	[false,id])
	res.redirect("/productos_traslado/lista");
});

router.get("/reset-list",async(req,res)=>{
	await pool.query('UPDATE productos_venta SET producto_traslado = NULL, estado_traslado = NULL, cantidad_traslado = NULL, unidad_medida_traslado = NULL;');
	res.redirect("/productos_traslado");
});


router.get("/concretar-list", async(req,res)=>{

	const consulta = await pool.query(`
		SELECT productos_venta.id, productos_venta.producto, productos_venta.cantidad_traslado, productos_venta.id_bodega, productos_bodega.cantidad_bodega, productos_venta.producto_traslado
		FROM productos_venta
		JOIN productos_bodega ON productos_venta.id_bodega = productos_bodega.id
		WHERE productos_venta.producto_traslado = true;`);

	const result = consulta.rows;

	result.forEach(async(e) => {
    const operacion = (e.cantidad_bodega - e.cantidad_traslado).toFixed(2);
    await pool.query('UPDATE productos_bodega SET cantidad_bodega = $1 WHERE id = $2',[operacion, e.id_bodega]);
	});

 	await pool.query('UPDATE productos_venta SET producto_traslado = NULL, estado_traslado = NULL, cantidad_traslado = NULL, unidad_medida_traslado = NULL');
	res.redirect("/productos_traslado");



// 	const num1 = 0.1;
// const num2 = 0.2;
// const resultado = (num2 - num1).toFixed(2);
})

module.exports = router
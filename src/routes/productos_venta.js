const express = require("express");
const router = express.Router();

const pool = require("../database");

router.get("/", async (req,res)=>{
	const productos = await pool.query('SELECT*FROM productos_venta');
	const Productos = productos.rows;
	res.render("./productos_venta/list", {Productos : Productos});
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
	res.render("./productos_venta/list", {Productos : Productos});
});

router.get("/add",(req,res)=>{
	res.render("./productos_venta/add");
});



router.post("/add", async (req,res)=>{
	const { producto, precio_venta, marca, descripcion, ubicacion_venta, piso_venta, posicion_venta } = req.body;
	const newproduct ={
		producto,
		precio_venta, 
		marca, 
		descripcion, 
		ubicacion_venta,
		piso_venta,
		posicion_venta,
	};
	// console.log(newproduct);

	 if (typeof newproduct.producto === 'string') {
    		const query = {
		text: 'INSERT INTO productos_venta (id,producto,precio_venta,marca,descripcion,ubicacion_venta,piso_venta,posicion_venta) VALUES(DEFAULT, $1, $2,$3,$4,$5,$6,$7)',
		values: [newproduct.producto,newproduct.precio_venta,newproduct.marca,newproduct.descripcion,newproduct.ubicacion_venta,newproduct.piso_venta,newproduct.posicion_venta]
	};

	await pool.query(query);
  }else{
  		for (let i = 0; i < newproduct.producto.length; i++) {
	const query = {
		text: 'INSERT INTO productos_venta (id,producto,precio_venta,marca,descripcion,ubicacion_venta,piso_venta,posicion_venta) VALUES(DEFAULT, $1, $2,$3,$4,$5,$6,$7)',
		values: [newproduct.producto[i],newproduct.precio_venta[i],newproduct.marca[i],newproduct.descripcion[i],newproduct.ubicacion_venta[i],newproduct.piso_venta[i],newproduct.posicion_venta[i]]
	};

	await pool.query(query);

	}

  }

	res.redirect("/productos_venta");
})

router.get("/edit/:id", async(req,res)=>{
	const {id} = req.params;
	const result = await pool.query('SELECT*FROM productos_venta WHERE id = $1',[id]);
	const producto = result.rows[0];
	res.render("./productos_venta/edit", {producto:producto});
})

router.post("/edit/:id", async(req,res)=>{
	const {id} = req.params;
	const { producto, precio_venta, marca, descripcion, ubicacion_venta, piso_venta, posicion_venta } = req.body;
	const newproduct ={
		producto,
		precio_venta, 
		marca, 
		descripcion, 
		ubicacion_venta,
		piso_venta,
		posicion_venta,
	};
	await pool.query('UPDATE productos_venta SET producto=$1, precio_venta=$2 ,marca=$3 ,descripcion=$4 ,ubicacion_venta=$5 , piso_venta = $6, posicion_venta = $7 WHERE id = $8',
		[newproduct.producto,newproduct.precio_venta,newproduct.marca,newproduct.descripcion,newproduct.ubicacion_venta,newproduct.piso_venta,newproduct.posicion_venta,id])
	res.redirect("/productos_venta");
})


router.get("/delete/:id",async(req,res)=>{
	const {id} = req.params;
	const query = {
		text: 'DELETE FROM productos_venta WHERE id = $1;',
		values: [id]
	};
	await pool.query(query);

	res.redirect("/productos_venta")
})

router.get("/enlace_bodega",async(req,res)=>{

	await pool.query('SELECT productos_venta.id AS id_productos_venta, productos_venta.producto AS producto_venta, productos_bodega.id AS id_producto_bodega, productos_bodega.producto AS producto_bodega FROM productos_venta LEFT JOIN productos_bodega ON productos_venta.id_bodega = productos_bodega.id;')
  .then(result => {
    const enlaces = result.rows;   			
    res.render("productos_venta/editar_enlaces_bodega",{enlaces: enlaces});
  }).catch(err => {
    console.error(err);
  });
})

router.post("/enlace_bodega/filtro", async (req,res)=>{
		const {producto_venta_b, producto_bodega_b} = req.body;
	const busqueda = {
		venta: `${producto_venta_b}%`, 
		bodega: `${producto_bodega_b}%`
	}

	// const productos = await pool.query('SELECT productos_venta.id AS id_productos_venta, productos_venta.producto AS producto_venta, productos_bodega.id AS id_producto_bodega, productos_bodega.producto AS producto_bodega FROM productos_venta LEFT JOIN productos_bodega ON productos_venta.id_bodega = productos_bodega.id WHERE productos_venta.producto ILIKE $1 AND productos_bodega.producto ILIKE $2;',[busqueda.venta,busqueda.bodega]);
if (busqueda.bodega == "%") {
	var query = {
		text: `
		SELECT productos_venta.id AS id_productos_venta, productos_venta.producto AS producto_venta, productos_bodega.id AS id_producto_bodega, productos_bodega.producto AS producto_bodega 
		FROM productos_venta 
		LEFT JOIN productos_bodega ON productos_venta.id_bodega = productos_bodega.id 
		WHERE productos_venta.producto ILIKE $1`,
  values: [busqueda.venta]
	}

}else{
var query = {
		text: `
		SELECT productos_venta.id AS id_productos_venta, productos_venta.producto AS producto_venta, productos_bodega.id AS id_producto_bodega, productos_bodega.producto AS producto_bodega 
		FROM productos_venta 
		LEFT JOIN productos_bodega ON productos_venta.id_bodega = productos_bodega.id 
		WHERE productos_venta.producto ILIKE $1 AND productos_bodega.producto ILIKE $2;`,
  values: [busqueda.venta,busqueda.bodega]
	}

}
	
	const productos = await pool.query(query)

	const enlaces = productos.rows;
	res.render("./productos_venta/editar_enlaces_bodega", {enlaces : enlaces});
});

router.get("/enlace_bodega/selec_producto/:id",async(req,res)=>{
	const {id} = req.params;
	pool.query('SELECT id,producto FROM productos_bodega')
   			.then(result2 => {
    const productos = result2.rows;
    res.render("productos_venta/selec_producto_bodega",{productos:productos, id:id});
      }).catch(err => {
    console.error(err);
    })
	
  })

router.post("/enlace_bodega/selec_producto/filter/:id",async(req,res)=>{
	const {id} = req.params;
	const {producto} = req.body;
	const busqueda= {
		producto: `${producto}%`
	};

	pool.query('SELECT id,producto FROM productos_bodega WHERE producto ILIKE $1',[busqueda.producto])
   			.then(result2 => {
    const productos = result2.rows;
    res.render("productos_venta/selec_producto_bodega",{productos:productos, id:id});
      }).catch(err => {
    console.error(err);
    })
	
  })

router.post("/edit_enlace/:id", async (req,res)=>{
	const {id} = req.params;
	const id_producto = req.body.id_bodega;
	pool.query('UPDATE productos_venta SET id_bodega = $1 WHERE id = $2',[id_producto,id])
	res.redirect("/productos_venta/enlace_bodega");

})



module.exports = router;
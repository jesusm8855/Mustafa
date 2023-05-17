--consultas

SELECT productos_venta.producto AS producto_venta, productos_bodega.producto AS producto_bodega
FROM productos_venta
JOIN productos_bodega ON productos_venta.id_bodega = productos_bodega.id;

SELECT productos_venta.id AS id_producto_venta, productos_venta.producto AS producto_venta,productos_venta.producto_traslado,productos_venta.cantidad_traslado,productos_bodega.unidad_medida_bodega,productos_venta.estado_traslado ,productos_bodega.id AS id_producto_bodega, productos_bodega.producto AS producto_bodega, productos_bodega.marca, productos_bodega.ubicacion_bodega,productos_bodega.piso_bodega,posicion_bodega 
FROM productos_venta 
LEFT JOIN productos_bodega ON productos_venta.id_bodega = productos_bodega.id
WHERE productos_venta.producto_traslado = true;



/*codigos utiles*/
	ALTER TABLE productos_bodega ADD COLUMN lugar_pedido_bodega TEXT;
	ALTER TABLE productos_bodega RENAME COLUMN lugar_pedido to lugar_pedido_bodega;
	DROP SEQUENCE productos_venta_secuencia CASCADE;
	ALTER TABLE nombre_tabla ALTER COLUMN nombre_columna TYPE tipo_de_dato; --altera el nombre de la columna y el tipo de dato
	SELECT pg_typeof(columna) FROM tabla; --sirve para ver el tipo de dato de una columna
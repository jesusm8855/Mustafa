/*---------------------------------------------------------Actualizacion---------------------------------------------------*/

CREATE TABLE productos_bodega (
	id INTEGER PRIMARY KEY,
	producto TEXT,
	Marca TEXT,
	Descripcion TEXT,
	cantidad_bodega NUMERIC(100,2),
	cantidad_minima_bodega NUMERIC(100,2),
	unidad_medida_bodega TEXT,
	ubicacion_bodega TEXT,
	piso_bodega TEXT,
	posicion_bodega TEXT,
	lugar_pedido_bodega TEXT,
	estado_cantidades_bodega BOOLEAN,
	cantidad_pedido_bodega NUMERIC(10,2)
);

CREATE SEQUENCE Productos_bodega_secuencia;
ALTER TABLE productos_bodega ALTER COLUMN id SET DEFAULT NEXTVAL('productos_bodega_secuencia');



CREATE TABLE productos_venta (
	id INTEGER PRIMARY KEY,
	producto TEXT,
	Marca TEXT,
	Descripcion TEXT,
	precio_venta VARCHAR(100),
	ubicacion_venta TEXT,
	piso_venta TEXT,
	posicion_venta TEXT,
	id_bodega INTEGER REFERENCES productos_bodega(id),
	producto_traslado BOOLEAN,
	cantidad_traslado NUMERIC(100,2),
	unidad_medida_traslado TEXT,
	estado_traslado BOOLEAN
);

CREATE SEQUENCE Productos_venta_secuencia;
ALTER TABLE productos_venta ALTER COLUMN id SET DEFAULT NEXTVAL('productos_venta_secuencia');

ALTER TABLE productos_venta
ADD CONSTRAINT fk_lista
FOREIGN KEY (id_bodega) REFERENCES productos_bodega(id);

CREATE OR REPLACE FUNCTION calcular_cantidades_resultado()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.cantidad_minima_bodega > NEW.cantidad_bodega THEN
        NEW.estado_cantidades_bodega := true;
    ELSE
        NEW.estado_cantidades_bodega := false;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calcular_columna_resultado
BEFORE INSERT OR UPDATE ON productos_bodega
FOR EACH ROW EXECUTE PROCEDURE calcular_cantidades_resultado();

SELECT column_name, data_type, numeric_precision, numeric_scale, column_default
FROM information_schema.columns
WHERE table_name = 'productos_bodega' AND column_name = 'cantidad_bodega';


ALTER TABLE productos_venta ALTER COLUMN cantidad_traslado TYPE DECIMAL(10,2);









	






const contenido_bodega = `
    
  <div class="inputs_productos_contenedor">
    <div class="input_producto_add_contenedor">
      <input type="texto" name="producto" class="input_producto_add" placeholder="producto" required>
    </div>
    <input type="text" name="marca" placeholder="marca">
    <input type="number" name="cantidad_bodega" placeholder="cantidad actual" required>
    <input type="number" name="cantidad_minima_bodega" placeholder="cantidad minima" required>
    <input type="text" name="unidad_medida_bodega" placeholder="unidad de medida"> 
    <input type="text" name="ubicacion_bodega" placeholder="ubicacion">
    <input type="number" name="piso_bodega" placeholder="piso">
    <input type="number" name="posicion_bodega" placeholder="posicion">
    <input type="tixt" name="lugar_pedido_bodega" placeholder="lugar de pedido">
    <input type="text" name="descripcion" placeholder="descripcion">
  </div>
`;


function multipleProductoBodega() {
  const contenedor = document.getElementById('producto-multiple');
  
  // Crear un nuevo elemento div que contenga el código HTML del formulario
  const nuevoElemento = document.createElement('div');
  nuevoElemento.innerHTML = contenido_bodega;
  
  // Agregar el nuevo elemento al contenedor
  contenedor.appendChild(nuevoElemento);
}


document.getElementById('sumit_pedir_bodega').addEventListener('click', function() {
  document.getElementById('formulario_pedir_bodega').submit();
});
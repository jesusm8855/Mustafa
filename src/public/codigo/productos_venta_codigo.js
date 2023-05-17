const contenido_venta = `
    
  <div class="inputs_productos_contenedor">
    <div class="input_producto_add_contenedor">
      <input type="texto" name="producto" class="input_producto_add" placeholder="producto">
    </div>
    <input type="number" name="precio_venta" placeholder="precio">
    <input type="text" name="marca" placeholder="marca">
    <input type="text" name="descripcion" placeholder="descripcion">
    <input type="text" name="ubicacion_venta" placeholder="ubicacion">
    <input type="number" name="piso_venta" placeholder="piso">
    <input type="number" name="posicion_venta" placeholder="posicion">
  </div>
`;

function multipleProductoVenta() {
  const contenedor = document.getElementById('producto-multiple');
  
  // Crear un nuevo elemento div que contenga el código HTML del formulario
  const nuevoElemento = document.createElement('div');
  nuevoElemento.innerHTML = contenido_venta;
  
  // Agregar el nuevo elemento al contenedor
  contenedor.appendChild(nuevoElemento);
}


function nuevodato(dato){

  let input = document.querySelector(".id_producto_venta");
  
  // input.value = dato;
  console.log(input.value);
  if (input.value !== "") {
    let input_Class_Deselect = document.getElementById(input.value);
    input_Class_Deselect.classList.toggle('B-FTT');
  }
  

  input.value = dato;
  let input_Class_Select = document.getElementById(input.value);
  input_Class_Select.classList.toggle('B-FTT');
}
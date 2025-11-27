// Esperamos a que el DOM cargue completamente
document.addEventListener('DOMContentLoaded', () => {

const botonAnadir = document.getElementById('boton-anadir'); // Botón para mostrar/ocultar formulario
const contenedorFormulario = document.getElementById('contenedor-formulario'); // Contenedor del formulario
const formulario = document.getElementById('formulario-producto'); // Formulario de nuevo producto
const mensajeExito = document.getElementById('mensaje-exito'); // Mensaje de éxito al añadir producto
const listaProductos = document.getElementById('lista-productos'); // Contenedor de tarjetas

let productos = []; // Array para almacenar productos
const idsUsados = new Set(); // Para que no se repitan los IDs

//mostrar/ocultar formulario
botonAnadir.addEventListener('click', () => {
  if (contenedorFormulario.style.display === 'block') { // Si el formulario está visible, lo oculta
    contenedorFormulario.style.display = 'none';
  } else { // Si el formulario está oculto, lo muestra
    contenedorFormulario.style.display = 'block';
    mensajeExito.style.display = 'none'; // Oculta el mensaje de éxito al mostrar el formulario
    limpiarErrores(); // Limpia errores previos al mostrar el formulario
    formulario.reset(); // Resetea el formulario
  }
});

// Guardar producto
formulario.addEventListener('submit', (e) => {
  e.preventDefault(); // Evita el envío del formulario
  limpiarErrores(); // Limpiar errores anteriores
  let error = false;

  // Obtenemos los valores de los campos
  const id = document.getElementById('id-producto').value.trim();
  const nombre = document.getElementById('nombre-producto').value.trim();
  const descripcion = document.getElementById('descripcion').value.trim();
  const precio = document.getElementById('precio').value;
  const imagen = document.getElementById('imagen').files[0]; // Obtiene el archivo seleccionado

  // Validaciones simples
  if (!id) { // Comprobar que ID no esté vacío
    mostrarError('error-id', 'Falta el ID');
    document.getElementById('id-producto').classList.add('error');
    error = true;
  } else if (idsUsados.has(id)) { // Comprobar que el ID sea único
    mostrarError('error-id', 'Este ID ya existe');
    document.getElementById('id-producto').classList.add('error');
    error = true;
  }

  if (!nombre) { // Comprobar que nombre no esté vacío
    mostrarError('error-nombre', 'Falta el nombre');
    document.getElementById('nombre-producto').classList.add('error');
    error = true;
  }

  if (!precio || precio <= 0) { // Comprobar que precio sea positivo
    mostrarError('error-precio', 'Precio incorrecto');
    document.getElementById('precio').classList.add('error');
    error = true;
  }

  if (!imagen) { // Comprobar que se haya seleccionado imagen
    mostrarError('error-imagen', 'Falta la imagen');
    document.getElementById('imagen').classList.add('error');
    error = true;
  }

  if (error) return; // Si hay error, no seguimos

  idsUsados.add(id); // Marcamos el ID como usado

  // Convertimos la imagen a texto (Base64) para poder mostrarla
  const reader = new FileReader();
  reader.onload = function(ev) {
    // Creamos el objeto producto con todos sus datos
    const producto = {
      id: id,
      nombre: nombre,
      descripcion: descripcion || 'Sin descripción',
      precio: parseFloat(precio).toFixed(2),
      imagenURL: ev.target.result
    };

    productos.push(producto); // Añadimos el producto al array
    crearTarjeta(producto); // Creamos la tarjeta del producto
    formulario.reset(); // Reseteamos el formulario después de crear la tarjeta
    mensajeExito.style.display = 'block'; // Mostramos mensaje de éxito
    setTimeout(() => mensajeExito.style.display = 'none', 2000); // Ocultamos el mensaje después de 2s
  };
  reader.readAsDataURL(imagen); // Dispara reader.onload
});

// Función para mostrar mensaje de error junto al campo correspondiente
function mostrarError(id, texto) {
  document.getElementById(id).textContent = texto;
}

// Función para limpiar todos los errores visuales del formulario
function limpiarErrores() {
  document.querySelectorAll('.mensaje-error').forEach(span => span.textContent = '');
  document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
}

// Función que crea la tarjeta del producto y la añade al catálogo
function crearTarjeta(producto) {
  const tarjeta = document.createElement('div');
  tarjeta.className = 'tarjeta';

  // Imagen del producto
  const img = document.createElement('img');
  img.src = producto.imagenURL;
  img.alt = producto.nombre;

  // Nombre que aparece al hacer hover sobre la imagen
  const nombreHover = document.createElement('div');
  nombreHover.className = 'nombre-hover';
  nombreHover.textContent = producto.nombre;

  // Panel de detalles que se muestra al hacer clic en la imagen
  const detalles = document.createElement('div');
  detalles.className = 'detalles';
  detalles.innerHTML = `
    <h3>${producto.nombre}</h3>
    <p><strong>ID:</strong> ${producto.id}</p>
    <p><strong>Precio:</strong> ${producto.precio} €</p>
    <p><strong>Descripción:</strong> ${producto.descripcion}</p>
  `;

  // Evento para mostrar/ocultar detalles al hacer clic en la imagen
  img.addEventListener('click', () => detalles.classList.toggle('mostrar'));

  // Añadimos todos los elementos a la tarjeta
  tarjeta.appendChild(img);
  tarjeta.appendChild(nombreHover);
  tarjeta.appendChild(detalles);
  listaProductos.appendChild(tarjeta); // Añadimos la tarjeta al contenedor principal
  }
});

const botonAnadir = document.getElementById('boton-anadir');
const contenedorFormulario = document.getElementById('contenedor-formulario');
const formulario = document.getElementById('formulario-producto');
const mensajeExito = document.getElementById('mensaje-exito');

let productos = [];

//mostrar/ocultar formulario
botonAnadir.addEventListener('click', () => {
  if (contenedorFormulario.style.display === 'block') {
    contenedorFormulario.style.display = 'none';
  } else {
    contenedorFormulario.style.display = 'block';
    mensajeExito.style.display = 'none';
    limpiarErrores();
  }
});

// Guardar producto
formulario.addEventListener('submit', (e) => {
  e.preventDefault();
  limpiarErrores();

  let error = false;

  const id = document.getElementById('id-producto').value.trim();
  const nombre = document.getElementById('nombre-producto').value.trim();
  const precio = document.getElementById('precio').value;
  const imagen = document.getElementById('imagen').files[0];

  // Validaciones simples
  if (!id) {
    mostrarError('error-id', 'Falta el ID');
    document.getElementById('id-producto').classList.add('error');
    error = true;
  } else if (productos.some(p => p.id === id)) {
    mostrarError('error-id', 'Este ID ya existe');
    document.getElementById('id-producto').classList.add('error');
    error = true;
  }

  if (!nombre) {
    mostrarError('error-nombre', 'Falta el nombre');
    document.getElementById('nombre-producto').classList.add('error');
    error = true;
  }

  if (!precio || precio <= 0) {
    mostrarError('error-precio', 'Precio incorrecto');
    document.getElementById('precio').classList.add('error');
    error = true;
  }

  if (!imagen) {
    mostrarError('error-imagen', 'Falta la imagen');
    document.getElementById('imagen').classList.add('error');
    error = true;
  }

  // Si todo bien
  if (!error) {
    productos.push({ id, nombre, precio: parseFloat(precio), imagen });
    mensajeExito.style.display = 'block';
    formulario.reset();
    setTimeout(() => mensajeExito.style.display = 'none', 2000);
  }
});

function mostrarError(id, texto) // Muestra un mensaje de error junto al campo correspondiente
{
  document.getElementById(id).textContent = texto;
}

function limpiarErrores() // Limpia todos los errores visuales del formulario
{
  document.querySelectorAll('.mensaje-error').forEach(span => span.textContent = '');
  document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
}
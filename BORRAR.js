/*
! API -> Web Storage

* Los dos mecanismos en el almacenamiento web son los siguientes:

? sessionStorage:
- Mantiene un área de almacenamiento separada para cada origen que está disponible mientras dure la sisión de la página (mientras el navegador este abierto, incluyendo recargas de página y restablecimientos).

? localStore:
- Hace lo mismo, pero persiste incluso cuando el navegaor se cierre y se reabra.

* Ambos funcionan con clave: valor y tienen dos métodos fundamentales:
   - setItem() -> Para asignar una clave: valor
   - getItem() -> Que recibe como parámetro la clave de la que queriamos obtener el valor.

*/

//* DOM
const form = document.getElementById("form");
const keys = document.getElementById("keys");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  // sessionStorage.setItem("name", "Manuel");

  /*
* Trabajar con objejos
  const user = {
    name: "Manuel",
    email: "manuel@gmail.com",
  };
* JSON.stringify() es para pasar de objeto a string
  sessionStorage.setItem("user", JSON.stringify(user));
* Para recuperar los daos hay que hacer un JSON.parse()
*/

  //* Referenciar a los campos del formulario
  sessionStorage.setItem(form.key.value, form.value.value);

  //* Añadirlo al select y resetear los campos del form
  keys.innerHTML += `<option>${form.key.value}</option>`;
  form.reset();

  //* Mostrar el valor del select en el p
  keys.addEventListener("change", () => {
    document.getElementById("infoValue").textContent = sessionStorage.getItem(
      keys[keys.selectedIndex].textContent
      // .selectedIndex devuelve un valor con respecto a la posición del select
    );
  });
});

//* Con localStorage funciona exactamente igual a diferencia de que si cerramos el navegador la información sigue al abrirlo.

// sessionStore.clear() borra el contenido de sessionStorage o localStorage.
// sessionStorage.removeItem(key) de lo que queremos borrar.

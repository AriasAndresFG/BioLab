document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");
    const loginSection = document.getElementById("login");
    const contentSection = document.getElementById("content");
    const footer = document.getElementById("footer");
    const logoutButton = document.getElementById("logout");
    const reactivosTableBody = document.querySelector("#reactivosTable tbody");
    const implementosTableBody = document.querySelector("#implementosTable tbody");
    const proveedoresTableBody = document.querySelector("#proveedoresTable tbody"); // Nueva referencia

    // Secciones del contenido
    const sections = document.querySelectorAll(".section-content");
    const navLinks = document.querySelectorAll("nav ul li a");

    // Carrusel de imágenes
    const images = document.querySelectorAll(".slider-image");
    let currentImageIndex = 0;
    const prevButton = document.getElementById("prev");
    const nextButton = document.getElementById("next");

    // Valores simulados para la validación de inicio de sesión
    const validEmail = "usuario@ejemplo.com";
    const validPassword = "12345";

    // Función de validación de inicio de sesión
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault(); // Evita el comportamiento por defecto del formulario

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        // Verifica si el correo y contraseña son correctos
        if (email === validEmail && password === validPassword) {
            // Oculta la sección de inicio de sesión y muestra el contenido
            loginSection.classList.add("hidden");
            contentSection.classList.remove("hidden");
            footer.classList.remove("hidden"); // Muestra el pie de página
            logoutButton.classList.remove("hidden"); // Muestra el botón de cerrar sesión
            loadReactivosData(); // Carga los datos de reactivos
            loadImplementosData(); // Carga los datos de implementos de laboratorio
            loadProveedoresData(); // Carga los datos de proveedores
        } else {
            alert("Correo o contraseña incorrectos. Inténtalo de nuevo.");
        }
    });

    // Evento para el botón "Cerrar Sesión"
    logoutButton.addEventListener("click", function () {
        // Oculta el contenido y muestra el formulario de inicio de sesión
        contentSection.classList.add("hidden");
        loginSection.classList.remove("hidden");
        footer.classList.add("hidden"); // Oculta el pie de página
        logoutButton.classList.add("hidden"); // Oculta el botón de cerrar sesión
        // Opcional: Limpiar las tablas al cerrar sesión
        reactivosTableBody.innerHTML = "";
        implementosTableBody.innerHTML = "";
        proveedoresTableBody.innerHTML = "";
    });

    // Función para mostrar la sección seleccionada y ocultar las demás
    navLinks.forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault(); // Evita recargar la página
            const targetSection = this.getAttribute("data-section");

            sections.forEach(section => {
                section.classList.add("hidden"); // Oculta todas las secciones
            });

            document.getElementById(targetSection).classList.remove("hidden"); // Muestra la sección seleccionada
        });
    });

    // Funciones para el carrusel de imágenes
    function updateCarousel() {
        images.forEach((img, index) => {
            img.classList.add("hidden");
            if (index === currentImageIndex) {
                img.classList.remove("hidden");
            }
        });
    }

    prevButton.addEventListener("click", function () {
        currentImageIndex = currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1;
        updateCarousel();
    });

    nextButton.addEventListener("click", function () {
        currentImageIndex = currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1;
        updateCarousel();
    });

    setInterval(() => {
        currentImageIndex = currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1;
        updateCarousel();
    }, 5000); // Cambia la imagen cada 5 segundos









    
    // Botones para agregar datos
    document.getElementById("addReactivo").addEventListener("click", addReactivo);
    document.getElementById("addImplemento").addEventListener("click", addImplemento);
    document.getElementById("addProveedor").addEventListener("click", addProveedor);

    // Funciones para agregar datos
    function addReactivo() {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><input type="text" placeholder="Cantidad"></td>
            <td><input type="text" placeholder="Nombre"></td>
            <td><input type="text" placeholder="Tipo"></td>
            <td><input type="text" placeholder="Uso"></td>
            <td><input type="date" placeholder="Fecha de Caducidad"></td>
            <td><input type="text" placeholder="Unidad de Masa"></td>
            <td>
                <button onclick="saveRow(this)">Guardar</button>
                <button onclick="deleteRow(this)">Eliminar</button>
            </td>
        `;
        reactivosTableBody.appendChild(row);
    }

    function addImplemento() {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><input type="text" placeholder="Cantidad"></td>
            <td><input type="text" placeholder="Material"></td>
            <td><input type="text" placeholder="Uso"></td>
            <td>
                <button onclick="saveRow(this)">Guardar</button>
                <button onclick="deleteRow(this)">Eliminar</button>
            </td>
        `;
        implementosTableBody.appendChild(row);
    }

    function addProveedor() {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><input type="text" placeholder="Nombre"></td>
            <td><input type="text" placeholder="Ciudad"></td>
            <td><input type="text" placeholder="Contacto"></td>
            <td>
                <button onclick="saveRow(this)">Guardar</button>
                <button onclick="deleteRow(this)">Eliminar</button>
            </td>
        `;
        proveedoresTableBody.appendChild(row);
    }

    // Función para guardar los datos ingresados y convertirlos en texto
    window.saveRow = function(button) {
        const row = button.closest("tr");
        row.querySelectorAll("td").forEach((td, index) => {
            if (index < td.parentNode.cells.length - 1) {
                const input = td.querySelector("input");
                if (input) td.textContent = input.value;
            }
        });
        button.textContent = "Editar";
        button.onclick = () => editRow(button);
    };

    // Función para editar una fila
    window.editRow = function(button) {
        const row = button.closest("tr");
        row.querySelectorAll("td").forEach((td, index) => {
            if (index < td.parentNode.cells.length - 1) {
                const text = td.textContent;
                td.innerHTML = `<input type="text" value="${text}">`;
            }
        });
        button.textContent = "Guardar";
        button.onclick = () => saveRow(button);
    };

    // Función para eliminar una fila
    window.deleteRow = function(button) {
        button.closest("tr").remove();
    };


    //Obtener datos Sql

    fetch("/api/reactivos")
        .then(response => response.json())
        .then(data => {
            const reactivosTableBody = document.querySelector("#reactivosTable tbody");
            data.forEach(reactivo => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${reactivo.cantidad}</td>
                    <td>${reactivo.nombre}</td>
                    <td>${reactivo.tipo}</td>
                    <td>${reactivo.uso}</td>
                    <td>${reactivo.fecha_caducidad}</td>
                    <td>${reactivo.unidad_masa}</td>
                `;
                reactivosTableBody.appendChild(row);
            });
        })
        .catch(error => console.error("Error al obtener los datos:", error));



});
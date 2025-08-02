const frasesFallidas = [
    "¿Y así me dice que me ama? 💔",
    "¡Usted no era así cuando nos conocimos! 😢",
    "Hasta Cupido está decepcionado 😞",
    "Si no recuerda voy a llorar y me voy a revolcar en el suelo 😭"
];

// Modo Oscuro
const toggleDarkModeButton = document.getElementById('toggleDarkMode');
const body = document.body;
const sunIcon = '<i class="ri-sun-line"></i>';
const moonIcon = '<i class="ri-moon-line"></i>';

// Comprobar el estado guardado del modo oscuro en el localStorage
if (localStorage.getItem('darkMode') === 'enabled') {
    body.classList.add('dark-mode');
    toggleDarkModeButton.innerHTML = moonIcon;
}

toggleDarkModeButton.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    
    // Guardar el estado del modo oscuro en el localStorage
    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('darkMode', 'enabled');
        toggleDarkModeButton.innerHTML = moonIcon;
    } else {
        localStorage.setItem('darkMode', 'disabled');
        toggleDarkModeButton.innerHTML = sunIcon;
    }
});

// Validación del formulario de inicio de sesión
document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const anniversaryDate = document.getElementById("anniversaryDate").value;
    const favoriteColor = document.getElementById("favoriteColor").value.trim().toLowerCase();
    const hobby = document.getElementById("hobby").value.trim().toLowerCase();
    const place = document.getElementById("place").value.trim().toLowerCase();
    const name = document.getElementById("name").value.trim().toLowerCase();

    const isDateCorrect = anniversaryDate === "2024-08-02";
    const isColorCorrect = favoriteColor === "morado";
    const isHobbyCorrect = hobby.includes("leer");
    const isPlaceCorrect = place.includes("laguna");
    const isNameCorrect = name.includes("amorcito");

    if (isDateCorrect && isColorCorrect && isHobbyCorrect && isPlaceCorrect && isNameCorrect) {
        localStorage.setItem("anniversaryDate", anniversaryDate);
        window.location.href = "nuestraFecha.html";
    } else {
        showErrorModal();
    }
});

function showErrorModal() {
    const modal = document.getElementById("modalError");
    const mensaje = frasesFallidas[Math.floor(Math.random() * frasesFallidas.length)];
    document.getElementById("modalMensaje").innerText = mensaje;
    modal.classList.remove("hidden");
}

// Cerrar modal y limpiar campos
document.querySelector(".close-button").addEventListener("click", () => {
    document.getElementById("modalError").classList.add("hidden");

    // Limpiar todos los campos
    document.querySelectorAll("#loginForm input").forEach(input => {
        input.value = "";
    });
});


// Animación de los corazones flotantes
function createHeart() {
    const heart = document.createElement('div');
    heart.classList.add('heart');
    
    // Posicionamos el corazón de forma aleatoria en la parte superior
    heart.style.left = `${Math.random() * 100}vw`;  // Aleatorio en el eje X
    heart.style.animationDuration = `${Math.random() * 5 + 3}s`;  // Duración aleatoria de la animación

    document.body.appendChild(heart);

    // Eliminamos el corazón después de que se haya animado
    setTimeout(() => {
        heart.remove();
    }, 5000);
}

// Crear corazones de forma continua
setInterval(createHeart, 200);

document.addEventListener('DOMContentLoaded', function () {
    // Verifica si Driver.js está cargado
    if (typeof window.driver === 'undefined' || typeof window.driver.js === 'undefined') {
        console.error('Driver.js no está cargado. Verifica la red o el CDN.');
        return;
    }

    console.log('Driver.js está listo para usarse.');

    // Verifica si el usuario ya ha visto el tour
    if (localStorage.getItem('tourVisto') === 'true') {
        console.log('El usuario ya ha visto el tour.');
        return; // No mostrar el tour si ya lo ha visto
    }

    const driver = window.driver.js.driver;

    const driverObj = driver({
        showProgress: true,
        showButtons: ['next', 'previous'],
        steps: [
            {
                element: '#toggleDarkMode',
                popover: {
                    title: 'Modo Oscuro/Claro',
                    description: 'Haz clic aquí para cambiar entre el modo oscuro y claro.',
                    side: 'bottom',
                    align: 'center'
                }
            },
            {
                element: '#anniversaryDate',
                popover: {
                    title: 'Fecha de Aniversario',
                    description: 'Ingresa la fecha de tu aniversario en este campo.',
                    side: 'top',
                    align: 'center'
                }
            },
            {
                element: '#loginForm button',
                popover: {
                    title: 'Ingresar',
                    description: 'Haz clic aquí para enviar el formulario y continuar.',
                    side: 'top',
                    align: 'center'
                }
            }
        ]
    });

    console.log('Pasos del tour definidos.');

    // Iniciar el tour automáticamente cuando la página se carga
    driverObj.drive();
    console.log('Tour iniciado.');

    // Marcar que el usuario ha visto el tour
    localStorage.setItem('tourVisto', 'true');
});



function calcularTiempoTranscurrido(fechaInicioStr) {
    const ahora = new Date();
    
    // Construcción segura para evitar problemas de zona horaria
    const partes = fechaInicioStr.split("-");
    const anio = parseInt(partes[0], 10);
    const mes = parseInt(partes[1], 10) - 1; // meses 0-11
    const dia = parseInt(partes[2], 10);
    const inicio = new Date(anio, mes, dia); // ahora sí es hora local

    if (isNaN(inicio)) {
        return null;
    }

    let años = ahora.getFullYear() - inicio.getFullYear();
    let meses = ahora.getMonth() - inicio.getMonth();
    let dias = ahora.getDate() - inicio.getDate();
    let horas = ahora.getHours() - inicio.getHours();
    let minutos = ahora.getMinutes() - inicio.getMinutes();

    // Ajuste de minutos
    if (minutos < 0) {
        minutos += 60;
        horas--;
    }

    // Ajuste de horas
    if (horas < 0) {
        horas += 24;
        dias--;
    }

    // Ajuste de días
    if (dias < 0) {
        const mesAnterior = new Date(ahora.getFullYear(), ahora.getMonth(), 0);
        dias += mesAnterior.getDate();
        meses--;
    }

    // Ajuste de meses
    if (meses < 0) {
        meses += 12;
        años--;
    }

    // Verificación si aún no se cumple el aniversario exacto
    const aniversarioExacto = new Date(anio + años, mes, dia);
    if (ahora < aniversarioExacto) {
        años--;
    }

    return { años, meses, dias, horas, minutos };
}

function mostrarTemporizador() {
    const fechaGuardada = localStorage.getItem("anniversaryDate");
    const contenedor = document.getElementById("timer");

    if (!fechaGuardada) {
        contenedor.innerHTML = "<p>No se ha registrado la fecha de aniversario.</p>";
        return;
    }

    const tiempo = calcularTiempoTranscurrido(fechaGuardada);
    if (!tiempo) {
        contenedor.innerHTML = "<p>Fecha inválida.</p>";
        return;
    }

    contenedor.innerHTML = "";

    const labels = ["Años", "Meses", "Días", "Horas", "Minutos"];
    const valores = [tiempo.años, tiempo.meses, tiempo.dias, tiempo.horas, tiempo.minutos];

    for (let i = 0; i < labels.length; i++) {
        const caja = document.createElement("div");
        caja.className = "time-box";

        const numero = document.createElement("div");
        numero.className = "time-number";
        numero.textContent = valores[i];

        const etiqueta = document.createElement("div");
        etiqueta.className = "time-label";
        etiqueta.textContent = labels[i];

        caja.appendChild(numero);
        caja.appendChild(etiqueta);

        contenedor.appendChild(caja);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    mostrarTemporizador();
    setInterval(mostrarTemporizador, 60000); // cada minuto
});



  document.getElementById("botonRedirige").addEventListener("click", function () {
    window.location.href = "dashboard.html"; // Cambia aquí tu URL
  });


  // Cerrar Sesión con confirmación
document.getElementById("logoutButton").addEventListener("click", () => {
  const confirmation = confirm("¿Estás seguro de que quieres cerrar sesión?");
  if (confirmation) {
    window.location.href = "index.html";
  }
});

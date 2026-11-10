
/* ==========================================
   MANOS AREQUIPEÑAS SMARTAPP
   SISTEMA PRINCIPAL DE FUNCIONAMIENTO
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    console.log("🧶 Manos Arequipeñas: Sistema iniciado correctamente.");

    // ==========================================
    // CONFIGURACIÓN DE WHATSAPP
    // ==========================================

    // CAMBIA ESTE NÚMERO POR EL WHATSAPP REAL.
    // Formato: 51 + número de celular, sin espacios.
    const CELULAR_TIENDA = "51999999999";

    // ==========================================
    // VARIABLES DE SESIÓN
    // ==========================================

    let datosCliente = {
        nombre: "",
        ciudad: ""
    };

    let registrado = false;

    // Obtener producto inicial desde el HTML
    const productoInicial = document.querySelector(
        ".main-featured-card.product-card"
    );

    let prendaSeleccionada = {
        nombre: productoInicial?.dataset.nombre || "Chompa Arequipeña Imperial",
        precio: Number(productoInicial?.dataset.precio) || 180,
        img: productoInicial?.dataset.img || ""
    };

    // ==========================================
    // ELEMENTOS PRINCIPALES
    // ==========================================

    const paginas = document.querySelectorAll(".app-page");
    const menuNav = document.getElementById("appNav");
    const enlacesMenu = document.querySelectorAll(".nav-link");

    // ==========================================
    // FUNCIÓN PARA CAMBIAR DE PANTALLA
    // ==========================================

    function irACara(idCara) {

        const paginasPermitidas = [
            "cara1",
            "cara2",
            "cara3",
            "cara4",
            "cara5"
        ];

        // Comprobar que la pantalla exista
        if (!paginasPermitidas.includes(idCara)) {
            console.error("Pantalla no encontrada:", idCara);
            return;
        }

        // Evitar entrar al catálogo sin registrarse
        if (
            ["cara3", "cara4", "cara5"].includes(idCara) &&
            !registrado
        ) {
            alert("⚠️ Primero debes registrar tus datos.");
            idCara = "cara2";
        }

        // Ocultar todas las pantallas
        paginas.forEach(function (pagina) {
            pagina.classList.remove("active");
        });

        // Mostrar pantalla seleccionada
        const pantallaDestino = document.getElementById(idCara);

        if (pantallaDestino) {
            pantallaDestino.classList.add("active");
        }

        // Mostrar u ocultar menú inferior
        if (menuNav) {

            if (["cara3", "cara4", "cara5"].includes(idCara)) {

                menuNav.classList.add("visible");

                enlacesMenu.forEach(function (enlace) {

                    enlace.classList.remove("active");

                    if (enlace.dataset.target === idCara) {
                        enlace.classList.add("active");
                    }

                });

            } else {

                menuNav.classList.remove("visible");

            }
        }

        // Volver al inicio del contenido al cambiar de pantalla
        const contenido = pantallaDestino?.querySelector(".page-content");

        if (contenido) {
            contenido.scrollTop = 0;
        }

    }


    // ==========================================
    // CARA 1: INGRESAR A LA TIENDA
    // ==========================================

    const btnIngresar = document.getElementById("btnIngresarApp");

    if (btnIngresar) {

        btnIngresar.addEventListener("click", function () {

            irACara("cara2");

        });

    }


    // ==========================================
    // CARA 2: REGISTRO DEL CLIENTE
    // ==========================================

    const btnRegistro = document.getElementById("btnGuardarRegistro");

    const inputNombre = document.getElementById("clienteNombre");
    const inputCiudad = document.getElementById("clienteCiudad");

    if (btnRegistro) {

        btnRegistro.addEventListener("click", function () {

            const nombre = inputNombre?.value.trim() || "";
            const ciudad = inputCiudad?.value.trim() || "";

            // Validar campos vacíos
            if (!nombre || !ciudad) {

                alert("⚠️ Por favor, completa tu nombre y ciudad.");

                if (!nombre) {
                    inputNombre?.focus();
                } else {
                    inputCiudad?.focus();
                }

                return;
            }

            // Validar longitud
            if (nombre.length < 2 || ciudad.length < 2) {

                alert("⚠️ Ingresa un nombre y una ciudad válidos.");

                return;
            }

            // Guardar datos
            datosCliente.nombre = nombre;
            datosCliente.ciudad = ciudad;

            registrado = true;

            // Mostrar saludo
            const saludo = document.getElementById("saludoCliente");

            if (saludo) {
                saludo.textContent = `¡Hola, ${nombre}! Bienvenido a nuestra tienda.`;
            }

            // Actualizar resumen del cliente
            actualizarDatosCliente();

            // Entrar al catálogo
            irACara("cara3");

            console.log("Cliente registrado:", datosCliente);

        });

    }


    // ==========================================
    // ACTUALIZAR DATOS DEL CLIENTE
    // ==========================================

    function actualizarDatosCliente() {

        const resumenCliente = document.getElementById("resumenCliente");
        const resumenCiudad = document.getElementById("resumenCiudad");

        if (resumenCliente) {
            resumenCliente.textContent = datosCliente.nombre;
        }

        if (resumenCiudad) {
            resumenCiudad.textContent = datosCliente.ciudad;
        }

    }


    // ==========================================
    // ACTUALIZAR DETALLES DEL PRODUCTO
    // ==========================================

    function actualizarDetalleProducto() {

        const elImg = document.getElementById("detalleImagen");
        const elNombre = document.getElementById("detalleNombre");
        const elPrecio = document.getElementById("detallePrecio");

        if (elImg && prendaSeleccionada.img) {
            elImg.src = prendaSeleccionada.img;
            elImg.alt = prendaSeleccionada.nombre;
        }

        if (elNombre) {
            elNombre.textContent = prendaSeleccionada.nombre;
        }

        if (elPrecio) {
            elPrecio.textContent =
                `S/ ${prendaSeleccionada.precio.toFixed(2)}`;
        }

    }

    // Cargar producto inicial
    actualizarDetalleProducto();


    // ==========================================
    // CARA 3 Y 4: SELECCIÓN DE PRODUCTOS
    // ==========================================

    const todasLasTarjetas = document.querySelectorAll(".product-card");

    function seleccionarProducto(tarjeta) {

        const nombre = tarjeta.dataset.nombre;
        const precio = Number(tarjeta.dataset.precio);
        const img = tarjeta.dataset.img;

        // Comprobar datos del producto
        if (
            !nombre ||
            !Number.isFinite(precio) ||
            precio <= 0 ||
            !img
        ) {

            console.error("Error: producto con información incompleta.", tarjeta);

            alert("No se pudo cargar este producto. Inténtalo nuevamente.");

            return;
        }

        // Guardar producto seleccionado
        prendaSeleccionada = {
            nombre: nombre,
            precio: precio,
            img: img
        };

        // Actualizar pantalla de detalles
        actualizarDetalleProducto();

        // Abrir detalles
        irACara("cara4");

        console.log("Producto seleccionado:", prendaSeleccionada);

    }


    todasLasTarjetas.forEach(function (tarjeta) {

        // Selección con ratón
        tarjeta.addEventListener("click", function () {

            seleccionarProducto(tarjeta);

        });

        // Selección con teclado
        tarjeta.addEventListener("keydown", function (evento) {

            if (
                evento.key === "Enter" ||
                evento.key === " "
            ) {

                evento.preventDefault();

                seleccionarProducto(tarjeta);

            }

        });

    });


    // ==========================================
    // CARA 4: BOTÓN QUIERO COMPRAR
    // ==========================================

    const btnComprar = document.getElementById("btnQuieroComprar");

    if (btnComprar) {

        btnComprar.addEventListener("click", function () {

            if (!registrado) {
                alert("Primero debes registrar tus datos.");
                irACara("cara2");
                return;
            }

            // Elementos del resumen
            const resProd = document.getElementById("resumenProducto");
            const resPrec = document.getElementById("resumenPrecio");
            const txtEnvio = document.getElementById("envioStatus");

            // Actualizar producto y precio
            if (resProd) {
                resProd.textContent = prendaSeleccionada.nombre;
            }

            if (resPrec) {
                resPrec.textContent =
                    prendaSeleccionada.precio.toFixed(2);
            }

            // Actualizar información de envío
            if (txtEnvio) {

                if (prendaSeleccionada.precio >= 200) {

                    txtEnvio.textContent =
                        "🟢 ¡Califica para Envío Gratis!";

                    txtEnvio.style.color = "#2ecc71";

                } else {

                    txtEnvio.textContent =
                        "🟠 Envío regular a coordinar por chat";

                    txtEnvio.style.color = "#e67e22";

                }

            }

            // Actualizar cliente
            actualizarDatosCliente();

            // Ir a confirmación
            irACara("cara5");

        });

    }


    // ==========================================
    // CARA 5: ENVIAR PEDIDO POR WHATSAPP
    // ==========================================

    const btnWhatsApp = document.getElementById("btnDespacharWhatsApp");

    if (btnWhatsApp) {

        btnWhatsApp.addEventListener("click", function () {

            // Comprobar registro
            if (!registrado) {

                alert("⚠️ Debes registrar tus datos primero.");

                irACara("cara2");

                return;

            }

            // Comprobar número de WhatsApp
            if (
                !/^\d{10,15}$/.test(CELULAR_TIENDA) ||
                CELULAR_TIENDA === "51999999999"
            ) {

                alert(
                    "⚠️ Configura el número real de WhatsApp de la tienda en script.js."
                );

                return;

            }

            // Crear código de pedido
            const ticketID =
                "TK-" + Math.floor(100000 + Math.random() * 900000);

            // Información del envío
            const tipoEnvio =
                prendaSeleccionada.precio >= 200
                ? "Califica para envío gratis"
                : "Envío regular a coordinar";

            // Crear mensaje
            const payload =
                `🧶 *MANOS AREQUIPEÑAS*\n` +
                `*REGISTRO DE PEDIDO*\n\n` +

                `🆔 *Código de pedido:* ${ticketID}\n` +

                `👤 *Comprador:* ${datosCliente.nombre}\n` +

                `📍 *Ciudad de destino:* ${datosCliente.ciudad}\n\n` +

                `🛍️ *Producto:* ${prendaSeleccionada.nombre}\n` +

                `💰 *Precio:* S/ ${prendaSeleccionada.precio.toFixed(2)}\n` +

                `🚚 *Envío:* ${tipoEnvio}\n\n` +

                `¡Hola! Deseo realizar este pedido. Por favor, confirmen su disponibilidad y los detalles de entrega.`;

            // Crear enlace correcto de WhatsApp
            const urlWhatsApp =
                `https://wa.me/${CELULAR_TIENDA}?text=${encodeURIComponent(payload)}`;

            // Abrir WhatsApp en otra pestaña
            window.open(
                urlWhatsApp,
                "_blank",
                "noopener,noreferrer"
            );

            console.log("Pedido preparado:", ticketID);

        });

    }


    // ==========================================
    // MENÚ INFERIOR DE NAVEGACIÓN
    // ==========================================

    enlacesMenu.forEach(function (enlace) {

        enlace.addEventListener("click", function (evento) {

            evento.preventDefault();

            const destino = enlace.dataset.target;

            if (destino) {
                irACara(destino);
            }

        });

    });


    // ==========================================
    // FINALIZACIÓN DEL SISTEMA
    // ==========================================

    console.log("✅ Todas las funciones fueron cargadas.");
    console.log("🧶 Manos Arequipeñas SmartApp está lista.");

});

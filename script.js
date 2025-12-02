// Festivos españoles (nacionales) - se pueden ajustar según necesidad
const festivosEspanoles = [
    // 2024
    { fecha: '2024-01-01', nombre: 'Año Nuevo' },
    { fecha: '2024-01-06', nombre: 'Reyes Magos' },
    { fecha: '2024-03-29', nombre: 'Viernes Santo' },
    { fecha: '2024-04-01', nombre: 'Lunes de Pascua' },
    { fecha: '2024-05-01', nombre: 'Día del Trabajo' },
    { fecha: '2024-08-15', nombre: 'Asunción de la Virgen' },
    { fecha: '2024-10-12', nombre: 'Día de la Hispanidad' },
    { fecha: '2024-11-01', nombre: 'Todos los Santos' },
    { fecha: '2024-12-06', nombre: 'Día de la Constitución' },
    { fecha: '2024-12-08', nombre: 'Inmaculada Concepción' },
    { fecha: '2024-12-25', nombre: 'Navidad' },

    // 2025
    { fecha: '2025-01-01', nombre: 'Año Nuevo' },
    { fecha: '2025-01-06', nombre: 'Reyes Magos' },
    { fecha: '2025-04-18', nombre: 'Viernes Santo' },
    { fecha: '2025-04-21', nombre: 'Lunes de Pascua' },
    { fecha: '2025-05-01', nombre: 'Día del Trabajo' },
    { fecha: '2025-08-15', nombre: 'Asunción de la Virgen' },
    { fecha: '2025-10-12', nombre: 'Día de la Hispanidad' },
    { fecha: '2025-11-01', nombre: 'Todos los Santos' },
    { fecha: '2025-12-06', nombre: 'Día de la Constitución' },
    { fecha: '2025-12-08', nombre: 'Inmaculada Concepción' },
    { fecha: '2025-12-25', nombre: 'Navidad' },

    // 2026
    { fecha: '2026-01-01', nombre: 'Año Nuevo' },
    { fecha: '2026-01-06', nombre: 'Reyes Magos' },
    { fecha: '2026-04-03', nombre: 'Viernes Santo' },
    { fecha: '2026-04-06', nombre: 'Lunes de Pascua' },
    { fecha: '2026-05-01', nombre: 'Día del Trabajo' },
    { fecha: '2026-08-15', nombre: 'Asunción de la Virgen' },
    { fecha: '2026-10-12', nombre: 'Día de la Hispanidad' },
    { fecha: '2026-11-01', nombre: 'Todos los Santos' },
    { fecha: '2026-12-06', nombre: 'Día de la Constitución' },
    { fecha: '2026-12-08', nombre: 'Inmaculada Concepción' },
    { fecha: '2026-12-25', nombre: 'Navidad' },
];

// Array de días excluidos personalizados
let fechasExcluidasPersonalizadas = [];

// Mapa de sobreescrituras manuales de tipo de día (formato: 'YYYY-MM-DD' -> 'dia-laborable'|'fin-semana'|'festivo'|'excluido')
let sobreescriturasManualeDias = new Map();

// Variable para el intervalo del reloj
let intervaloContador = null;

// Configuración de fechas
let fechaInicio = null;
let fechaFin = null;

// Elementos del DOM
const inputFechaInicio = document.getElementById('startDate');
const inputFechaFin = document.getElementById('endDate');
const botonIniciarContador = document.getElementById('startCountdown');
const botonDetenerContador = document.getElementById('stopCountdown');
const visorReloj = document.getElementById('clockDisplay');
const unidadesReloj = document.getElementById('clockUnits');
const visorDias = document.getElementById('days');
const visorHoras = document.getElementById('hours');
const visorMinutos = document.getElementById('minutes');
const visorSegundos = document.getElementById('seconds');
const visorDiasLaborables = document.getElementById('workDays');
const visorHorasTotales = document.getElementById('totalHours');
const listaFestivos = document.getElementById('holidaysList');
const contenedorCalendario = document.getElementById('calendarContainer');
const cuadriculaCalendario = document.getElementById('calendarGrid');

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    // Establecer fecha y hora actual como mínimo (con hora 09:00)
    const ahora = new Date();
    ahora.setHours(9, 0, 0, 0); // Establecer por defecto a las 09:00
    const fechaHoraLocal = new Date(ahora.getTime() - ahora.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);

    inputFechaInicio.min = fechaHoraLocal;
    inputFechaFin.min = fechaHoraLocal;

    // Renderizar festivos
    renderizarFestivos();

    // Cargar datos guardados desde localStorage
    cargarDatosGuardados();

    // Event listeners
    botonIniciarContador.addEventListener('click', inicializarContador);
    botonDetenerContador.addEventListener('click', detenerContador);

    // Validar que la fecha de fin sea posterior a la de inicio
    inputFechaInicio.addEventListener('change', validarFechas);
    inputFechaFin.addEventListener('change', validarFechas);

    // Validar horarios permitidos (09:00 - 14:00)
    inputFechaInicio.addEventListener('change', validarHorario);
    inputFechaFin.addEventListener('change', validarHorario);
});

// Renderizar lista de festivos
function renderizarFestivos() {
    listaFestivos.innerHTML = '';

    // Filtrar festivos futuros y ordenar
    const ahora = new Date();
    const festivosFuturos = festivosEspanoles
        .filter(f => new Date(f.fecha) >= ahora)
        .slice(0, 12); // Mostrar los próximos 12 festivos

    festivosFuturos.forEach(festivo => {
        const elementoFestivo = document.createElement('div');
        elementoFestivo.className = 'elemento-festivo';

        const nombreFestivo = document.createElement('div');
        nombreFestivo.className = 'nombre-festivo';
        nombreFestivo.textContent = festivo.nombre;

        const fechaFestivo = document.createElement('div');
        fechaFestivo.className = 'fecha-festivo';
        fechaFestivo.textContent = formatearFechaEspanol(new Date(festivo.fecha));

        elementoFestivo.appendChild(nombreFestivo);
        elementoFestivo.appendChild(fechaFestivo);
        listaFestivos.appendChild(elementoFestivo);
    });
}

// Formatear fecha en español
function formatearFechaEspanol(fecha) {
    return fecha.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Validar que la fecha de fin sea posterior a la de inicio
function validarFechas() {
    if (inputFechaInicio.value && inputFechaFin.value) {
        const inicio = new Date(inputFechaInicio.value);
        const fin = new Date(inputFechaFin.value);

        if (fin <= inicio) {
            inputFechaFin.setCustomValidity('La fecha de fin debe ser posterior a la de inicio');
        } else {
            inputFechaFin.setCustomValidity('');
        }
    }
}

// Validar horario permitido (09:00 - 14:00)
function validarHorario(event) {
    const input = event.target;
    if (!input.value) return;

    const fecha = new Date(input.value);
    const horas = fecha.getHours();
    const minutos = fecha.getMinutes();

    // Verificar si está fuera del rango 09:00 - 14:00
    if (horas < 9 || horas > 14 || (horas === 14 && minutos > 0)) {
        input.setCustomValidity('El horario debe estar entre las 09:00 y las 14:00');
    } else {
        input.setCustomValidity('');
    }
}

// Verificar si una fecha es fin de semana
function esFinDeSemana(fecha) {
    const dia = fecha.getDay();
    return dia === 0 || dia === 6; // 0 = Domingo, 6 = Sábado
}

// Verificar si una fecha es festivo español
function esFestivoEspanol(fecha) {
    const ano = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    const fechaStr = `${ano}-${mes}-${dia}`;
    return festivosEspanoles.some(f => f.fecha === fechaStr);
}

// Verificar si una fecha es excluida personalizada
function esExcluidoPersonalizado(fecha) {
    // Esta función ya no se usa para la lista antigua, pero se mantiene por compatibilidad
    // con la lógica de debeExcluirFecha si se reintroduce
    return false;
}

// Verificar si una fecha debe ser excluida
function debeExcluirFecha(fecha) {
    // Obtener clave de fecha
    const ano = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    const claveFecha = `${ano}-${mes}-${dia}`;

    // Si hay sobreescritura manual, verificar si es un tipo excluido
    if (sobreescriturasManualeDias.has(claveFecha)) {
        const tipo = sobreescriturasManualeDias.get(claveFecha);
        // Todos los tipos menos 'dia-laborable' se consideran excluidos
        return tipo !== 'dia-laborable';
    }

    // Si no hay sobreescritura, usar la lógica normal
    return esFinDeSemana(fecha) || esFestivoEspanol(fecha);
}

// Calcular días laborables entre dos fechas
function calcularDiasLaborables(inicio, fin) {
    let diasLaborables = 0;
    const fechaActual = new Date(inicio);

    while (fechaActual < fin) {
        if (!debeExcluirFecha(fechaActual)) {
            diasLaborables++;
        }
        fechaActual.setDate(fechaActual.getDate() + 1);
    }

    return diasLaborables;
}

// Detener cuenta regresiva
function detenerContador() {
    if (intervaloContador) {
        clearInterval(intervaloContador);
        intervaloContador = null;
    }

    // Ocultar el reloj y mostrar mensaje inicial
    unidadesReloj.style.display = 'none';
    visorReloj.style.display = 'flex';
    contenedorCalendario.style.display = 'none';

    // Ocultar botón de detener y mostrar botón de iniciar
    botonDetenerContador.style.display = 'none';
    botonIniciarContador.style.display = 'inline-flex';

    // Habilitar inputs
    inputFechaInicio.disabled = false;
    inputFechaFin.disabled = false;

    // Guardar estado en localStorage
    guardarDatos();
}

// Inicializar cuenta regresiva
function inicializarContador() {
    const valorInicio = inputFechaInicio.value;
    const valorFin = inputFechaFin.value;

    if (!valorInicio || !valorFin) {
        alert('Por favor, selecciona ambas fechas');
        return;
    }

    fechaInicio = new Date(valorInicio);
    fechaFin = new Date(valorFin);

    if (fechaFin <= fechaInicio) {
        alert('La fecha de fin debe ser posterior a la de inicio');
        return;
    }

    // Validar años soportados (2024, 2025, 2026)
    const aniosSoportados = [2024, 2025, 2026];
    const anioInicio = fechaInicio.getFullYear();
    const anioFin = fechaFin.getFullYear();

    if (!aniosSoportados.includes(anioInicio) || !aniosSoportados.includes(anioFin)) {
        alert('El programa solo funciona para los años 2024, 2025 y 2026, ya que no disponemos de los festivos para otros años.');
        return;
    }

    // Validar horarios (09:00 - 14:00)
    const horasInicio = fechaInicio.getHours();
    const minInicio = fechaInicio.getMinutes();
    if (horasInicio < 9 || horasInicio > 14 || (horasInicio === 14 && minInicio > 0)) {
        alert('La fecha de inicio debe estar entre las 09:00 y las 14:00');
        return;
    }

    const horasFin = fechaFin.getHours();
    const minFin = fechaFin.getMinutes();
    if (horasFin < 9 || horasFin > 14 || (horasFin === 14 && minFin > 0)) {
        alert('La fecha de fin debe estar entre las 09:00 y las 14:00');
        return;
    }

    // Limpiar intervalo anterior si existe
    if (intervaloContador) {
        clearInterval(intervaloContador);
    }

    // Guardar fechas
    guardarDatos();

    // Mostrar el reloj y actualizar botones
    visorReloj.style.display = 'none';
    unidadesReloj.style.display = 'flex';
    botonIniciarContador.style.display = 'none';
    botonDetenerContador.style.display = 'inline-flex';
    contenedorCalendario.style.display = 'block';

    // Deshabilitar inputs
    inputFechaInicio.disabled = true;
    inputFechaFin.disabled = true;

    // Iniciar actualización
    actualizarContador();
    renderizarCalendario();
    intervaloContador = setInterval(actualizarContador, 1000);
}

// Actualizar cuenta regresiva
function actualizarContador() {
    const ahora = new Date();

    // Calcular días laborables totales
    const diasLaborablesTotales = calcularDiasLaborables(fechaInicio, fechaFin);
    const horasLaborablesTotales = diasLaborablesTotales * 5;

    // Calcular días laborables transcurridos
    const diasLaborablesTranscurridos = calcularDiasLaborables(fechaInicio, ahora);
    const horasLaborablesTranscurridas = diasLaborablesTranscurridos * 5;

    // Calcular días y horas laborables restantes
    const diasLaborablesRestantes = diasLaborablesTotales - diasLaborablesTranscurridos;
    const horasLaborablesRestantes = horasLaborablesTotales - horasLaborablesTranscurridas;

    if (horasLaborablesRestantes <= 0) {
        clearInterval(intervaloContador);
        mostrarTiempo(0, 0, 0, 0);
        alert('¡Tiempo completado!');
        return;
    }

    // Calcular tiempo adicional del día actual si es día laborable
    let segundosAdicionales = 0;
    if (!debeExcluirFecha(ahora)) {
        const horaActual = ahora.getHours();
        const minutosActuales = ahora.getMinutes();
        const segundosActuales = ahora.getSeconds();

        // Solo contar tiempo si estamos dentro del horario laboral (09:00 - 14:00)
        if (horaActual >= 9 && horaActual < 14) {
            // Calcular tiempo transcurrido desde las 09:00
            const horasTranscurridas = horaActual - 9;
            const minutosTranscurridos = minutosActuales;
            const segundosTranscurridos = segundosActuales;

            segundosAdicionales = (horasTranscurridas * 60 * 60) + (minutosTranscurridos * 60) + segundosTranscurridos;
        } else if (horaActual >= 14) {
            // Si ya pasaron las 14:00, contar las 5 horas completas del día
            segundosAdicionales = 5 * 60 * 60;
        }
        // Si es antes de las 09:00, segundosAdicionales = 0 (no se ha trabajado aún)
    }

    // Convertir horas laborables restantes a segundos totales
    const segundosTotalesRestantes = (horasLaborablesRestantes * 60 * 60) - segundosAdicionales;

    // Calcular días, horas, minutos, segundos
    const dias = Math.floor(segundosTotalesRestantes / (24 * 60 * 60));
    const horas = Math.floor((segundosTotalesRestantes % (24 * 60 * 60)) / (60 * 60));
    const minutos = Math.floor((segundosTotalesRestantes % (60 * 60)) / 60);
    const segundos = Math.floor(segundosTotalesRestantes % 60);

    // Actualizar display
    mostrarTiempo(dias, horas, minutos, segundos);

    // Actualizar información adicional - mostrar RESTANTES en lugar de TOTALES
    visorDiasLaborables.textContent = diasLaborablesRestantes;
    visorHorasTotales.textContent = horasLaborablesRestantes.toFixed(1);
}

// Mostrar tiempo en el reloj
function mostrarTiempo(dias, horas, minutos, segundos) {
    visorDias.textContent = String(dias).padStart(2, '0');
    visorHoras.textContent = String(horas).padStart(2, '0');
    visorMinutos.textContent = String(minutos).padStart(2, '0');
    visorSegundos.textContent = String(segundos).padStart(2, '0');
}

// Renderizar calendario visual
function renderizarCalendario() {
    if (!fechaInicio || !fechaFin) {
        contenedorCalendario.style.display = 'none';
        return;
    }

    contenedorCalendario.style.display = 'block';
    cuadriculaCalendario.innerHTML = '';

    // Obtener primer y último mes
    const mesInicio = new Date(fechaInicio.getFullYear(), fechaInicio.getMonth(), 1);
    const mesFin = new Date(fechaFin.getFullYear(), fechaFin.getMonth(), 1);

    // Generar calendario para cada mes
    const mesActual = new Date(mesInicio);

    while (mesActual <= mesFin) {
        const contenedorMes = document.createElement('div');
        contenedorMes.className = 'mes-calendario';

        // Título del mes
        const tituloMes = document.createElement('div');
        tituloMes.className = 'titulo-mes-calendario';
        tituloMes.textContent = mesActual.toLocaleDateString('es-ES', {
            month: 'long',
            year: 'numeric'
        });
        contenedorMes.appendChild(tituloMes);

        // Días de la semana (comenzando en lunes)
        const diasSemana = document.createElement('div');
        diasSemana.className = 'dias-semana-calendario';
        const nombresDiasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
        nombresDiasSemana.forEach(nombre => {
            const diaSemana = document.createElement('div');
            diaSemana.className = 'dia-semana-calendario';
            diaSemana.textContent = nombre;
            diasSemana.appendChild(diaSemana);
        });
        contenedorMes.appendChild(diasSemana);

        // Días del mes
        const contenedorDias = document.createElement('div');
        contenedorDias.className = 'dias-calendario';

        // Calcular primer día del mes (ajustar para que lunes sea 0)
        const primerDia = new Date(mesActual.getFullYear(), mesActual.getMonth(), 1);
        let primerDiaSemana = primerDia.getDay() - 1; // Convertir a lunes = 0
        if (primerDiaSemana < 0) primerDiaSemana = 6; // Domingo se convierte en 6

        // Días del mes anterior (vacíos)
        for (let i = 0; i < primerDiaSemana; i++) {
            const diaVacio = document.createElement('div');
            diaVacio.className = 'dia-calendario vacio';
            contenedorDias.appendChild(diaVacio);
        }

        // Días del mes actual
        const ultimoDia = new Date(mesActual.getFullYear(), mesActual.getMonth() + 1, 0).getDate();

        for (let dia = 1; dia <= ultimoDia; dia++) {
            const fecha = new Date(mesActual.getFullYear(), mesActual.getMonth(), dia);
            const elementoDia = document.createElement('div');
            elementoDia.className = 'dia-calendario';
            elementoDia.textContent = dia;

            // Crear clave de fecha
            const ano = fecha.getFullYear();
            const mes = String(fecha.getMonth() + 1).padStart(2, '0');
            const diaStr = String(fecha.getDate()).padStart(2, '0');
            const claveFecha = `${ano}-${mes}-${diaStr}`;

            // Normalizar fechas para comparación (solo día, sin horas)
            const fechaInicioNormalizada = new Date(fechaInicio);
            fechaInicioNormalizada.setHours(0, 0, 0, 0);
            const fechaFinNormalizada = new Date(fechaFin);
            fechaFinNormalizada.setHours(0, 0, 0, 0);
            const fechaNormalizada = new Date(fecha);
            fechaNormalizada.setHours(0, 0, 0, 0);

            // Verificar si la fecha está dentro del rango
            if (fechaNormalizada < fechaInicioNormalizada || fechaNormalizada > fechaFinNormalizada) {
                elementoDia.classList.add('fuera-rango');
            } else {
                // Determinar tipo de día (considerar sobreescritura manual primero)
                let tipoDia;
                if (sobreescriturasManualeDias.has(claveFecha)) {
                    tipoDia = sobreescriturasManualeDias.get(claveFecha);
                } else if (esExcluidoPersonalizado(fecha)) {
                    tipoDia = 'excluido';
                } else if (esFestivoEspanol(fecha)) {
                    tipoDia = 'festivo';
                } else if (esFinDeSemana(fecha)) {
                    tipoDia = 'fin-semana';
                } else {
                    tipoDia = 'dia-laborable';
                }

                // Aplicar clase según tipo
                elementoDia.classList.add(tipoDia);

                // Marcar día de inicio con clase especial
                const fechaSoloInicio = new Date(fechaInicio);
                fechaSoloInicio.setHours(0, 0, 0, 0);
                const fechaSoloDia = new Date(fecha);
                fechaSoloDia.setHours(0, 0, 0, 0);

                if (fechaSoloDia.getTime() === fechaSoloInicio.getTime()) {
                    elementoDia.classList.add('dia-inicio');
                }

                // Marcar día de fin con clase especial
                const fechaSoloFin = new Date(fechaFin);
                fechaSoloFin.setHours(0, 0, 0, 0);

                if (fechaSoloDia.getTime() === fechaSoloFin.getTime()) {
                    elementoDia.classList.add('dia-fin');
                }

                // Marcar días pasados
                const hoy = new Date();
                hoy.setHours(0, 0, 0, 0);
                const horaActual = new Date().getHours();

                // Determinar si el día es pasado
                let esDiaPasado = false;
                if (fechaNormalizada < hoy) {
                    // Día completamente en el pasado
                    esDiaPasado = true;
                } else if (fechaNormalizada.getTime() === hoy.getTime() && horaActual >= 14) {
                    // Día actual pero ya pasaron las 14:00
                    esDiaPasado = true;
                }

                if (esDiaPasado) {
                    elementoDia.classList.add('dia-pasado');
                }

                // Establecer tooltip
                switch (tipoDia) {
                    case 'dia-laborable':
                        elementoDia.title = 'Día laborable (5 horas) - Click para cambiar';
                        break;
                    case 'fin-semana':
                        elementoDia.title = 'Fin de semana - Click para cambiar';
                        break;
                    case 'festivo':
                        const festivo = festivosEspanoles.find(f => f.fecha === claveFecha);
                        elementoDia.title = festivo ? `${festivo.nombre} - Click para cambiar` : 'Festivo - Click para cambiar';
                        break;
                    case 'excluido':
                        elementoDia.title = 'Día excluido - Click para cambiar';
                        break;
                }

                // Sobrescribir tooltip si es día de inicio o fin
                if (fechaSoloDia.getTime() === fechaSoloInicio.getTime()) {
                    elementoDia.title = '📍 Día de inicio - ' + elementoDia.title;
                } else if (fechaSoloDia.getTime() === fechaSoloFin.getTime()) {
                    elementoDia.title = '📍 Día final - ' + elementoDia.title;
                }

                // Sobrescribir tooltip y deshabilitar click si es día pasado
                if (esDiaPasado) {
                    elementoDia.title = '🔒 Día pasado - No modificable';
                    elementoDia.style.cursor = 'not-allowed';
                } else {
                    // Añadir evento click solo para días NO pasados
                    elementoDia.style.cursor = 'pointer';
                    elementoDia.addEventListener('click', () => {
                        cambiarTipoDia(claveFecha, fecha);
                    });
                }
            }

            contenedorDias.appendChild(elementoDia);
        }

        contenedorMes.appendChild(contenedorDias);
        cuadriculaCalendario.appendChild(contenedorMes);

        // Avanzar al siguiente mes
        mesActual.setMonth(mesActual.getMonth() + 1);
    }
}

// Cambiar tipo de día al hacer click
function cambiarTipoDia(claveFecha, fecha) {
    // Determinar tipo actual
    let tipoActual;
    if (sobreescriturasManualeDias.has(claveFecha)) {
        tipoActual = sobreescriturasManualeDias.get(claveFecha);
    } else if (esExcluidoPersonalizado(fecha)) {
        tipoActual = 'excluido';
    } else if (esFestivoEspanol(fecha)) {
        tipoActual = 'festivo';
    } else if (esFinDeSemana(fecha)) {
        tipoActual = 'fin-semana';
    } else {
        tipoActual = 'dia-laborable';
    }

    // Ciclo: dia-laborable -> fin-semana -> festivo -> excluido -> dia-laborable
    let nuevoTipo;
    switch (tipoActual) {
        case 'dia-laborable':
            nuevoTipo = 'fin-semana';
            break;
        case 'fin-semana':
            nuevoTipo = 'festivo';
            break;
        case 'festivo':
            nuevoTipo = 'excluido';
            break;
        case 'excluido':
            nuevoTipo = 'dia-laborable';
            break;
        default:
            nuevoTipo = 'dia-laborable';
    }

    // Guardar sobreescritura
    sobreescriturasManualeDias.set(claveFecha, nuevoTipo);

    // Re-renderizar calendario
    renderizarCalendario();

    // Actualizar contador si está activo
    if (intervaloContador) {
        actualizarContador();
    }

    // Guardar en localStorage
    guardarDatos();
}

// ========== FUNCIONES DE PERSISTENCIA (localStorage) ==========

// Guardar datos en localStorage
function guardarDatos() {
    const datos = {
        fechaInicio: fechaInicio ? fechaInicio.toISOString() : null,
        fechaFin: fechaFin ? fechaFin.toISOString() : null,
        fechasExcluidas: fechasExcluidasPersonalizadas,
        sobreescrituras: Array.from(sobreescriturasManualeDias.entries()),
        contadorActivo: intervaloContador !== null
    };

    localStorage.setItem('contadorDatosGuardados', JSON.stringify(datos));
}

// Cargar datos desde localStorage
function cargarDatosGuardados() {
    const datosGuardados = localStorage.getItem('contadorDatosGuardados');

    if (!datosGuardados) {
        return;
    }

    try {
        const datos = JSON.parse(datosGuardados);

        // Restaurar fechas
        if (datos.fechaInicio && datos.fechaFin) {
            const inicio = new Date(datos.fechaInicio);
            const fin = new Date(datos.fechaFin);

            // Convertir a formato datetime-local
            const inicioLocal = new Date(inicio.getTime() - inicio.getTimezoneOffset() * 60000)
                .toISOString()
                .slice(0, 16);
            const finLocal = new Date(fin.getTime() - fin.getTimezoneOffset() * 60000)
                .toISOString()
                .slice(0, 16);

            inputFechaInicio.value = inicioLocal;
            inputFechaFin.value = finLocal;

            fechaInicio = inicio;
            fechaFin = fin;
        }

        // Restaurar exclusiones personalizadas
        if (datos.fechasExcluidas && Array.isArray(datos.fechasExcluidas)) {
            fechasExcluidasPersonalizadas = datos.fechasExcluidas;
        }

        // Restaurar sobreescrituras manuales
        if (datos.sobreescrituras && Array.isArray(datos.sobreescrituras)) {
            sobreescriturasManualeDias = new Map(datos.sobreescrituras);
        }

        // Si el contador estaba activo, iniciarlo automáticamente
        if (datos.contadorActivo && fechaInicio && fechaFin) {
            // Mostrar el reloj y actualizar botones
            visorReloj.style.display = 'none';
            unidadesReloj.style.display = 'flex';
            botonIniciarContador.style.display = 'none';
            botonDetenerContador.style.display = 'inline-flex';

            // Iniciar actualización
            actualizarContador();
            renderizarCalendario();
            intervaloContador = setInterval(actualizarContador, 1000);
        }
    } catch (error) {
        console.error('Error al cargar datos guardados:', error);
        localStorage.removeItem('contadorDatosGuardados');
    }
}

// Limpiar datos guardados
function limpiarDatosGuardados() {
    localStorage.removeItem('contadorDatosGuardados');

    // Detener contador si está activo
    if (intervaloContador) {
        detenerContador();
    }

    // Limpiar fechas
    inputFechaInicio.value = '';
    inputFechaFin.value = '';
    fechaInicio = null;
    fechaFin = null;

    // Limpiar exclusiones
    fechasExcluidasPersonalizadas = [];
    // renderizarFechasExcluidas(); // This line was removed

    // Limpiar sobreescrituras
    sobreescriturasManualeDias.clear();

    // Ocultar calendario
    contenedorCalendario.style.display = 'none';

    alert('Datos guardados eliminados correctamente');
}


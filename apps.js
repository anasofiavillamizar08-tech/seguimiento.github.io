/* ================= CONFIGURACIÓN GLOBAL ================= */
// Ajustes para que las gráficas se vean nítidas
if (typeof Chart !== 'undefined') {
    Chart.defaults.font.family = 'Inter, system-ui, sans-serif';
    Chart.defaults.responsive = true;
    Chart.defaults.maintainAspectRatio = false;
    Chart.defaults.devicePixelRatio = window.devicePixelRatio || 2; // Alta resolución
}

/* ================= BASE DE DATOS (EDITA AQUÍ) ================= */
// Cambia los números ("valor") y textos ("detalle") según necesites.
const dataPND = {
    
    general: {
        avance: 59.18,
        sectores: [
            // Estos valores alimentan la gráfica comparativa principal
            { nombre: "Educativo", avance: 59.0 },
            { nombre: "Económico", avance: 45.0 },
            { nombre: "Mujeres", avance: 60.0 },
            { nombre: "Social", avance: 55.0 },
            { nombre: "Ecológico", avance: 60.0 },
            { nombre: "Afro", avance: 38.34 },
            { nombre: "Comunitario", avance: 39.54 },
            { nombre: "Territorial", avance: 42.0 },
        ]
    },

    // SECTOR 1: EDUCATIVO
    educativo: {
        indicadores: [
            { titulo: "Cobertura Educación Superior", valor: 89.32, detalle: "Avance significativo en IES públicas." },
            { titulo: "Tránsito inmediato a Superior (Rural)", valor: 104.3, detalle: "Meta superada por alta demanda." },
            { titulo: "Inversión en I+D (% PIB)", valor: 62.0, detalle: "Aún se requiere mayor inversión privada." },
            { titulo: "Cobertura PAE", valor: 84.4, detalle: "Buen desempeño en cobertura." },
            { titulo: "Deserción escolar oficial", valor: 41.3, detalle: "Alerta: cifras siguen altas." },
            { titulo: "Infraestructura educativa mejorada", valor: 44.7, detalle: "Rezago en obras rurales." }
        ]
    },

    // SECTOR 2: ECONÓMICO
    economico: {
        indicadores: [
            { titulo: "Hectáreas Fondo Tierras", valor: 0.77, detalle: "Crítico: Avance casi nulo." },
            { titulo: "Crédito mujeres rurales", valor: 70.0, detalle: "Buen dinamismo en líneas Finagro." },
            { titulo: "Vías terciarias intervenidas", valor: 24.3, detalle: "Dificultades con maquinaria amarilla." },
            { titulo: "Centros ZASCA", valor: 234.0, detalle: "Sobrecumplimiento de meta." }
        ]
    },

    // SECTOR 3: MUJERES
    mujeres: {
        indicadores: [
            { titulo: "Mujeres en cargos directivos", valor: 84.2, detalle: "Cumplimiento Ley de Cuotas." },
            { titulo: "Atención a violencias", valor: 95.9, detalle: "Rutas activas en hospitales." },
            { titulo: "Acceso a tierras", valor: 37.1, detalle: "Brecha persistente." }
        ]
    },

    // SECTOR 4: SOCIAL
    social: {
        indicadores: [
            { titulo: "Mortalidad materna", valor: 9.24, detalle: "Reducción positiva." },
            { titulo: "Déficit habitacional", valor: 83.2, detalle: "El déficit cualitativo sigue alto." }
        ]
    },

    // SECTOR 5: ECOLÓGICO
    ecologico: {
        indicadores: [
            { titulo: "Energías renovables (FNCER)", valor: 81.9, detalle: "Transición energética avanza." },
            { titulo: "Deforestación", valor: 27.1, detalle: "Alerta roja en Amazonía." }
        ]
    },

    // SECTOR 6: AFRO
    afro: {
        indicadores: [
            { titulo: "Promedio indicadores Afro", valor: 29.8, detalle: "Bajo cumplimiento general." },
            { titulo: "Derechos básicos", valor: 23.7, detalle: "Necesidad de focalización." }
        ]
    },

    // SECTOR 7: COMUNITARIO
    comunitario: {
        indicadores: [
            { titulo: "Alertas tempranas", valor: 39.5, detalle: "Riesgo alto para líderes." },
            { titulo: "Gestión comunitaria del agua", valor: 39.5, detalle: "Fortalecimiento en proceso." }
        ]
    },

    // SECTOR 8: TERRITORIALES
    territoriales: {
        indicadores: [
            { titulo: "Articulación planes", valor: 65.0, detalle: "Mejora en diálogo Nación-Territorio." },
            { titulo: "Participación CTP", valor: 55.0, detalle: "Falta presupuesto para sesiones." }
        ]
    }
};

/* ================= LÓGICA DEL SISTEMA (NO TOCAR) ================= */

// 1. Sistema de Pestañas
const tabs = document.querySelectorAll(".tab-btn");
const panels = document.querySelectorAll(".panel");

tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        panels.forEach(p => p.classList.remove("active"));
        tab.classList.add("active");
        const target = document.getElementById(tab.dataset.target);
        if(target) target.classList.add("active");
    });
});

// 2. Funciones de Renderizado
function renderChart(canvasId, labels, data, color, horizontal = false) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    new Chart(canvas.getContext('2d'), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Cumplimiento (%)',
                data: data,
                backgroundColor: color,
                borderRadius: 4,
                barThickness: horizontal ? 20 : undefined // Barras más finas si son horizontales
            }]
        },
        options: {
            indexAxis: horizontal ? 'y' : 'x',
            scales: {
                x: { beginAtZero: true, max: 120, grid: { display: false } },
                y: { beginAtZero: true, grid: { color: '#f1f5f9' } }
            },
            plugins: { legend: { display: false } }
        }
    });
}

function renderCards(containerId, items) {
    const container = document.getElementById(containerId);
    if (!container || !items) return;
    
    container.innerHTML = items.map(item => `
        <div class="ind-card">
            <div class="ind-title">${item.titulo}</div>
            <div class="ind-meta">Avance: <span style="color:#0033a0">${item.valor}%</span></div>
            <div class="ind-body">${item.detalle}</div>
        </div>
    `).join('');
}

// 3. Inicialización al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    
    // Cargar General
    const g = dataPND.general;
    const percentEl = document.getElementById("globalPercent");
    const barEl = document.getElementById("globalProgress");
    
    if(percentEl) percentEl.textContent = g.avance + "%";
    if(barEl) barEl.style.width = g.avance + "%";

    // Gráfica Dona General
    const ctxGen = document.getElementById("generalChart");
    if(ctxGen) {
        new Chart(ctxGen.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: ['Ejecutado', 'Pendiente'],
                datasets: [{ 
                    data: [g.avance, 100 - g.avance], 
                    backgroundColor: ['#1f8947', '#e2e8f0'],
                    borderWidth: 0
                }]
            },
            options: { cutout: '70%' }
        });
    }

    // Gráfica Comparativa
    renderChart('sectorsChart', g.sectores.map(s=>s.nombre), g.sectores.map(s=>s.avance), '#0033a0');

    // Cargar Sectores Específicos (Si existen los elementos en HTML)
    // Mapeo: ID del HTML -> Clave en dataPND -> Color de gráfica
    const mappings = [
        { id: 'edu', key: 'educativo', color: '#1f8947' },
        { id: 'eco', key: 'economico', color: '#0033a0' },
        { id: 'muj', key: 'mujeres', color: '#d81b60' },
        { id: 'soc', key: 'social', color: '#ce1126' },
        { id: 'eco2', key: 'ecologico', color: '#1b5e20' },
        { id: 'afro', key: 'afro', color: '#6d4c41' },
        { id: 'com', key: 'comunitario', color: '#f57c00' },
        { id: 'terr', key: 'territoriales', color: '#374151' },
    ];

    mappings.forEach(m => {
        if(dataPND[m.key]) {
            // Gráfica (Horizontal para que se lean bien los nombres largos)
            renderChart(
                m.id + 'Chart', 
                dataPND[m.key].indicadores.map(i=>i.titulo), 
                dataPND[m.key].indicadores.map(i=>i.valor), 
                m.color, 
                true // true = barras horizontales
            );
            // Tarjetas
            renderCards(m.id + 'Indicators', dataPND[m.key].indicadores);
        }
    });
});

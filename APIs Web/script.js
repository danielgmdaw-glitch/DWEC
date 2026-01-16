let map = L.map('map').setView([40.4168, -3.7038], 6); // España

// Capa del mapa
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);

// Inputs
const latInput = document.getElementById("lat");
const lngInput = document.getElementById("lng");

// Canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Obtener ubicaciones guardadas
let ubicaciones = JSON.parse(localStorage.getItem("ubicaciones")) || [];

map.on("mousemove", function (e) {
    latInput.value = e.latlng.lat.toFixed(6);
    lngInput.value = e.latlng.lng.toFixed(6);
});

map.on("click", function (e) {
    const punto = {
        lat: e.latlng.lat,
        lng: e.latlng.lng
    };

    ubicaciones.push(punto);
    localStorage.setItem("ubicaciones", JSON.stringify(ubicaciones));

    L.marker([punto.lat, punto.lng]).addTo(map);
    dibujarCanvas();
});

function cargarMarcadores() {
    ubicaciones.forEach(p => {
        L.marker([p.lat, p.lng]).addTo(map);
    });
}

function dibujarCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (ubicaciones.length === 0) return;

    // Escalado simple
    const margen = 20;
    const ancho = canvas.width - margen * 2;
    const alto = canvas.height - margen * 2;

    ubicaciones.forEach((p, index) => {
        const x = margen + (index / (ubicaciones.length - 1 || 1)) * ancho;
        const y = canvas.height / 2;

        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = "blue";
        ctx.fill();

        ctx.fillText(index + 1, x - 3, y - 10);
    });
}

cargarMarcadores();
dibujarCanvas();

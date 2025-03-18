debugger 
const URL = "https://teachablemachine.withgoogle.com/models/ytJ6U7WVd/";
let model, webcam, maxPredictions;

// Configuración del gráfico de barras
const barCtx = document.getElementById('bar-chart').getContext('2d');
const barChart = new Chart(barCtx, {
    type: 'bar',
    data: {
        labels: [], // Las etiquetas de las clases se agregarán dinámicamente
        datasets: [{
            label: 'Probabilidad (%)',
            data: [], // Los datos se actualizarán dinámicamente
            backgroundColor: 'rgba(75, 192, 192, 0.6)', // Color predeterminado
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true,
                max: 100
            }
        }
    }
});

// Configuración del gráfico de torta
const pieCtx = document.getElementById('pie-chart').getContext('2d');
const pieChart = new Chart(pieCtx, {
    type: 'pie',
    data: {
        labels: [], // Las etiquetas de las clases se agregarán dinámicamente
        datasets: [{
            label: 'Probabilidad (%)',
            data: [], // Los datos se actualizarán dinámicamente
            backgroundColor: [ // Colores predeterminados
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(180, 180, 178, 0.6)',
                'rgba(3, 3, 3, 0.6)',
                'rgba(153, 102, 255, 0.6)',
                'rgba(255, 159, 64, 0.6)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            }
        }
    }
});

async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Configurar la cámara
    const flip = true;
    webcam = new tmImage.Webcam(200, 200, flip);
    await webcam.setup();
    await webcam.play();
    window.requestAnimationFrame(loop);

    // Agregar el canvas de la cámara al contenedor
    document.getElementById("webcam-container").appendChild(webcam.canvas);

    // Configurar las etiquetas de las clases
    const classLabels = model.getClassLabels();
    barChart.data.labels = classLabels;
    pieChart.data.labels = classLabels;

    barChart.update();
    pieChart.update();
}

async function loop() {
    webcam.update();
    await predict();
    window.requestAnimationFrame(loop);
}

async function predict() {
    const prediction = await model.predict(webcam.canvas);
    const data = [];
    for (let i = 0; i < maxPredictions; i++) {
        const probability = (prediction[i].probability * 100).toFixed(2);
        data.push(probability);
    }
    // Actualizar los gráficos
    barChart.data.datasets[0].data = data;
    pieChart.data.datasets[0].data = data;
    barChart.update();
    pieChart.update();
}

init();

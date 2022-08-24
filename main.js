const inputName = document.querySelector('#name');
const inputGrade = document.querySelector('#grade');
const btnSave = document.querySelector('#save');
const form = document.querySelector('#form');
const bodyTable = document.querySelector('#body-table');
const msjErrorName = document.createElement('div');
const msjErrorGrade = document.createElement('div');
let dataTable = [];

registerEvenListenner();
function registerEvenListenner() {
    // Cuando la app inicia
    document.addEventListener('DOMContentLoaded', initializeApp);
    document.addEventListener('DOMContentLoaded', () => {
        dataTable = JSON.parse(localStorage.getItem('Datos')) || [];
        insertHTML();
    })

    // Validar el formulario
    inputName.addEventListener('blur', validateName);
    inputGrade.addEventListener('blur', validateGrade);

    // Cuando se da click en el boton guardar
    form.addEventListener('submit', addData);
}

function initializeApp() {
    btnSave.disabled = true;
}

// Validar el nombre
function validateName() {
    if(inputName.value.length > 2 && inputName.value.length < 10) {
        inputName.classList.remove('border', 'border-danger');
        inputName.classList.add('border', 'border-success');
        msjErrorName.remove();
    } else {
        inputName.classList.remove('border', 'border-success');
        inputName.classList.add('border', 'border-danger');
        showErrorName();
    }
    validateForm()
}

// Validar la calificación
function validateGrade() {
    if(inputGrade.value > 0 && inputGrade.value < 11) {
        inputGrade.classList.remove('border', 'border-danger');
        inputGrade.classList.add('border', 'border-success');
        msjErrorGrade.remove();
    } else {
        inputGrade.classList.remove('border', 'border-success');
        inputGrade.classList.add('border', 'border-danger');
        showErrorGrade();
    }
    validateForm()
}

// Activar boton guardar
function validateForm() {
    if(inputName.classList.contains('border-success') && inputGrade.classList.contains('border-success')) {
        btnSave.disabled = false;
    } else {
        btnSave.disabled = true;
    }
}

// Mostrar mensaje de error
function showErrorName() {
    msjErrorName.textContent = 'Ingrese un nombre valido';
    msjErrorName.classList.add('form-text', 'error-name');

    const errorName = document.querySelectorAll('.error-name');
    if(errorName.length === 0) {
        form.children[0].appendChild(msjErrorName);
    } 
}

function showErrorGrade() {
    msjErrorGrade.textContent = 'Ingrese una calificación validad';
    msjErrorGrade.classList.add('form-text', 'error-grade');

    const errorGrade = document.querySelectorAll('.error-grade');
    if(errorGrade.length === 0) {
        form.children[1].appendChild(msjErrorGrade)
    }
}

function addData(e) {
    e.preventDefault();

    clearHTML();

    const dataObj = {
        id: Date.now(),
        nombre: inputName.value,
        calificacion: inputGrade.value
    }

    dataTable = [...dataTable, dataObj];

    insertHTML();
    form.reset();
    window.location.reload();
    initializeApp();


}

function insertHTML() {
    if(dataTable.length > 0) {
        dataTable.forEach((data, index) => {
            const {nombre, calificacion} = data;
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td class="align-items-center" id=${nombre}>${nombre}</td>
                <td id="${index + 1}">${calificacion}</td>
            `
            bodyTable.appendChild(row);
        })
    }
    
    synchronizeLS();
}

function synchronizeLS() {
    localStorage.setItem('Datos', JSON.stringify(dataTable));
}

function clearHTML() {
    while(bodyTable.firstChild) {
        bodyTable.removeChild(bodyTable.firstChild);
    }
}

// Transformar el array de objetos a objetos
dataTable = JSON.parse(localStorage.getItem('Datos')) || [];
let dataTableObj = dataTable.reduce((obj, item) => 
    Object.assign(obj, { [item.nombre]: item.calificacion }),
{});

//  Crear 2 arrays con las keys(nombres) y las values(calificacion) del objeto nuevo para luego insertarlas en el grafico
let arrayNames = Array.from(Object.keys(dataTableObj), breed => breed);
let arrayGrades = Array.from(Object.values(dataTableObj), breed => breed);

// Sacar el promedio del curso
function averageClass() {
    // El array estaba con strings, por lo que hay que transformar los strings a números
    arrayGrades = arrayGrades.map(str => {
        return Number(str);
    })
    let total = arrayGrades.reduce((partial, acc) => partial + acc, 0);
    return total / arrayGrades.length;
}

let average = averageClass();


const ctx = document.querySelector('#graphic');
dataTable = JSON.parse(localStorage.getItem('Datos')) || [];
    
const myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: arrayNames,
        datasets: [{
            label: `El promedio de la clase es ${average.toFixed(2)}`,
            data: arrayGrades,
            backgroundColor: [
                'rgb(109, 242, 47)'
            ],
            borderColor: [
                'rgb(109, 242, 47)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
})






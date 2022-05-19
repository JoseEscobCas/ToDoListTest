
const formulario = document.getElementById("formulario");
const input = document.getElementById("input");
const listTask = document.getElementById("list-task");
const template = document.getElementById("template").content;
const fragment = document.createDocumentFragment();

let tareas = {};

document.addEventListener(`DOMContentLoaded`, () => {
    if (localStorage.getItem('tareas')) {
        tareas = JSON.parse(localStorage.getItem('tareas'));
    }
    pintarTareas();
});


listTask.addEventListener('click', e => {
    btnAction(e);
});
//console.log(Date.now());

formulario.addEventListener('submit', e => {
    e.preventDefault();
    setTareas(e);
});

const setTareas = (e) => {

    if (input.value.trim() === '') {
        console.log("esta vacio");
        return;
    }
    const tarea = {
        id: Date.now(),
        text: input.value,
        state: false
    };

    tareas[tarea.id] = tarea;

    formulario.reset();
    input.focus();

    pintarTareas();
};

const pintarTareas = () => {

    //local storga pero mejor en BD
    localStorage.setItem('tareas', JSON.stringify(tareas));

    if (Object.values(tareas).length === 0) {
        listTask.innerHTML = `
        <div class="alert alert-success text-center">
           <h4 data-bs-toggle="tooltip" data-bs-placement="top" title="Feliz día no hay tareas pendientes">  No hay tareas pendientes <span class="iconify btn-active" data-icon="emojione-v1:sun-with-face"></span></h4>
          </div>
        `;
        return;
    };
    
    listTask.innerHTML = "";

    Object.values(tareas).forEach(tarea => {
        const clone = template.cloneNode(true);
        clone.querySelector('h5').textContent = tarea.text;

        if (tarea.state) {
            clone.querySelector('.alert').classList.replace("alert-secondary",
                    "alert-info");
            clone.querySelectorAll('.fas')[0].classList.replace('fa-check-circle', 'fa-undo-alt');
            clone.querySelector('h5').style.textDecoration = 'line-through';
        }

        clone.querySelectorAll('.fas')[0].dataset.id = tarea.id;
        clone.querySelectorAll('.fas')[1].dataset.id = tarea.id;
        fragment.appendChild(clone);
    });

    listTask.appendChild(fragment);
};

const btnAction = e => {
    //console.log(e.target.classList.contains('btn-active'));
    if (e.target.classList.contains('check')) {
        tareas[e.target.dataset.id].state = true;
        pintarTareas();
    }

    if (e.target.classList.contains('delete')) {
        delete tareas[e.target.dataset.id];
        pintarTareas();
    }

    if (e.target.classList.contains('fa-undo-alt')) {
        tareas[e.target.dataset.id].state = false;
        pintarTareas();
    }

    e.stopPropagation();
};


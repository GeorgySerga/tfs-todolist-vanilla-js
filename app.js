"use strict";

var listElement = document.querySelector('.list');
var itemElementList = listElement.children;


var templateElement = document.getElementById('todoTemplate');
var templateContainer = 'content' in templateElement ? templateElement.content : templateElement;

var filtersElement = document.querySelector('.filters');
filtersElement.addEventListener('click', onFiltersClick);

// сформируем задачки
var todoList = [
    {
        name: 'Позвонить в сервис',
        status: true
    },
    {
        name: 'Купить хлеб',
        status: false
    },
    {
        name: 'Захватить мир',
        status: true
    },
    {
        name: 'Добавить тудушку в список',
        status: true
    }
];

// функция по генерации элементов
function createTodoNodeFromTemplate(todo) {
    var newElement = templateContainer.querySelector('.task').cloneNode(true);
    newElement.querySelector('.task__name').textContent = todo.name;
    setTodoStatusClassName(newElement, todo.status);

    return newElement;
}

function setTodoStatusClassName(todo, flag) {
    todo.classList.toggle('task_todo', flag);
    todo.classList.toggle('task_done', !flag);
}

function onListClick(event) {
    var target = event.target;
    var element;

    if (isStatusBtn(target)) {
        element = target.parentNode;
        changeTodoStatus(element);
    }

    if (isDeleteBtn(target)) {
        element = target.parentNode;
        deleteTodo(element);
    }

    drawListInfo();
}

function isStatusBtn(target) {
    return target.classList.contains('task__status');
}

function isDeleteBtn(target) {
    return target.classList.contains('task__delete-button');
}

function changeTodoStatus(element) {
    var isTodo = element.classList.contains('task_todo');
    setTodoStatusClassName(element, !isTodo);

    var todoName = element.querySelector('.task__name').textContent;
    todoList.forEach(function(item) {
        if (item.name === todoName) {
            item.status = !isTodo;
        }
    });
}

function deleteTodo(element) {
    listElement.removeChild(element);

    var todoName = element.querySelector('.task__name').textContent;
    todoList = todoList.filter(function(item) {
        return item.name !== todoName;
    });
}

function onInputKeydown(event) {
    var ENTER_KEYCODE = 13;
    if (event.keyCode !== ENTER_KEYCODE) {
        return;
    }

    var todoName = inputElement.value.trim();

    if (todoName.length === 0 || checkIfTodoAlreadyExists(todoName)) {
        return;
    }

    var todo = createNewTodo(todoName);
    insertTodoElement(createTodoNodeFromTemplate(todo));
    inputElement.value = '';

    todoList.push({
        name: todoName,
        status: true
    });
}

function checkIfTodoAlreadyExists(todoName) {
    var todoElements = listElement.querySelectorAll('.task__name');
    var namesList = Array.prototype.map.call(todoElements, function(element) {
        return element.textContent;
    });
    return namesList.indexOf(todoName) > -1;
}

function createNewTodo(name) {
    return {
        name: name,
        status: true
    }
}

drawTodoList(todoList);
function drawTodoList(list) {
    listElement.textContent = '';
    list
        .map(createTodoNodeFromTemplate)
        .forEach(insertTodoElement);
}

listElement.addEventListener('click', onListClick);

var inputElement = document.querySelector('.add-task__input');
inputElement.addEventListener('keydown', onInputKeydown);

function insertTodoElement(elem) {
    if (listElement.children.length) {
        listElement.insertBefore(elem, listElement.firstElementChild);
    } else {
        listElement.appendChild(elem);
    }
}

function computeListStats() {
    var allTasksCount = todoList.length;
    var todoTasksCount = todoList.reduce(function(count, item) {
        return count + Number(item.status);
    }, 0);
    var doneTasksCount = allTasksCount - todoTasksCount;
    return {
        all: allTasksCount,
        done: doneTasksCount,
        todo: todoTasksCount
    };
}

function displayListStats() {
    var stats = computeListStats();
    var statisticsContainer = document.querySelector('.statistic');
    statisticsContainer.querySelector('.statistic__total').textContent = stats.all;
    statisticsContainer.querySelector('.statistic__done').textContent = stats.done;
    statisticsContainer.querySelector('.statistic__left').textContent = stats.todo;
}

function onFiltersClick(event) {
    filtersElement.querySelector('.filters__item_selected').classList.remove('filters__item_selected');
    event.target.classList.add('filters__item_selected');

    var filterType = event.target.getAttribute('data-filter');
    drawTodoList(filterTodoList(filterType));
}

function filterTodoList(filterType) {
    return todoList.filter(function(item) {
        return (filterType === 'all' ||
                filterType === 'todo' && item.status ||
                filterType === 'done' && !item.status);
    });
}

drawListInfo();
function drawListInfo() {
    displayListStats();
    var filterType = filtersElement.querySelector('.filters__item_selected').getAttribute('data-filter');
    drawTodoList(filterTodoList(filterType));
};

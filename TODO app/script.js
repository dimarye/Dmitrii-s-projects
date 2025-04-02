const taskForm = document.getElementById("task-form");
const confirmCloseDialog = document.getElementById("confirm-close-dialog");
const openTaskFormBtn = document.getElementById("open-task-form-btn");
const closeTaskFormBtn = document.getElementById("close-task-form-btn");
const addOrUpdateTaskBtn = document.getElementById("add-or-update-task-btn");
const cancelBtn = document.getElementById("cancel-btn");
const discardBtn = document.getElementById("discard-btn");
const tasksContainer = document.getElementById("tasks-container");
const titleInput = document.getElementById("title-input");
const dateInput = document.getElementById("date-input");
const descriptionInput = document.getElementById("description-input");
const categoryInput = document.getElementById("category-input");
const sortBy = document.getElementById("sort-by");
const filterBy = document.getElementById("filter-by");

let taskData = JSON.parse(localStorage.getItem("data")) || [];
let currentTask = {};

// Добавление/обновление задачи
const addOrUpdateTask = () => {
    if (!titleInput.value.trim()) {
        alert("Title is required!");
        return;
    }

    const taskObj = {
        id: `${titleInput.value.toLowerCase().split(" ").join("-")}-${Date.now()}`,
        title: titleInput.value,
        date: dateInput.value,
        category: categoryInput.value,
        description: descriptionInput.value,
        completed: false,
    };

    const index = taskData.findIndex((item) => item.id === currentTask.id);

    if (index === -1) {
        taskData.unshift(taskObj);
    } else {
        taskData[index] = taskObj;
    }

    localStorage.setItem("data", JSON.stringify(taskData));
    updateTaskContainer();
    reset();
};

// Обновление контейнера задач
const updateTaskContainer = () => {
    tasksContainer.innerHTML = "";

    const filteredTasks = filterTasks();
    const sortedTasks = sortTasks(filteredTasks);

    if (sortedTasks.length === 0) {
        tasksContainer.innerHTML = `<p class="empty-state">No tasks found</p>`;
        return;
    }

    sortedTasks.forEach(({ id, title, date, category, description, completed }) => {
        tasksContainer.innerHTML += `
            <div class="task ${completed ? "completed" : ""}" id="${id}">
                <h3>
                    <input type="checkbox" class="task-checkbox" ${completed ? "checked" : ""}>
                    ${title}
                    <span class="category-tag category-${category}">${category}</span>
                </h3>
                <p><i class="far fa-calendar-alt"></i> ${date || "No date"}</p>
                <p>${description || "No description"}</p>
                <div class="task-actions">
                    <button onclick="toggleTaskComplete(this)" class="btn complete-btn">
                        <i class="fas fa-${completed ? "undo" : "check"}"></i> ${completed ? "Undo" : "Complete"}
                    </button>
                    <button onclick="editTask(this)" class="btn edit-btn">
                        <i class="fas fa-pen"></i> Edit
                    </button>
                    <button onclick="deleteTask(this)" class="btn delete-btn">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `;
    });
};

// Фильтрация задач
const filterTasks = () => {
    const filterValue = filterBy.value;
    return taskData.filter((task) => {
        if (filterValue === "completed") return task.completed;
        if (filterValue === "pending") return !task.completed;
        return true;
    });
};

// Сортировка задач
const sortTasks = (tasks) => {
    const sortValue = sortBy.value;
    return [...tasks].sort((a, b) => {
        if (sortValue === "date-asc") return new Date(a.date) - new Date(b.date);
        if (sortValue === "date-desc") return new Date(b.date) - new Date(a.date);
        if (sortValue === "status") return a.completed - b.completed;
        return 0;
    });
};

// Удаление задачи
const deleteTask = (buttonEl) => {
    const taskId = buttonEl.closest(".task").id;
    taskData = taskData.filter((task) => task.id !== taskId);
    localStorage.setItem("data", JSON.stringify(taskData));
    updateTaskContainer();
};

// Редактирование задачи
const editTask = (buttonEl) => {
    const taskId = buttonEl.closest(".task").id;
    currentTask = taskData.find((task) => task.id === taskId);

    titleInput.value = currentTask.title;
    dateInput.value = currentTask.date;
    categoryInput.value = currentTask.category;
    descriptionInput.value = currentTask.description;

    addOrUpdateTaskBtn.innerHTML = `<i class="fas fa-save"></i> Update Task`;
    taskForm.classList.remove("hidden");
};

// Переключение статуса задачи
const toggleTaskComplete = (buttonEl) => {
    const taskId = buttonEl.closest(".task").id;
    const taskIndex = taskData.findIndex((task) => task.id === taskId);
    taskData[taskIndex].completed = !taskData[taskIndex].completed;
    localStorage.setItem("data", JSON.stringify(taskData));
    updateTaskContainer();
};

// Сброс формы
const reset = () => {
    titleInput.value = "";
    dateInput.value = "";
    descriptionInput.value = "";
    categoryInput.value = "general";
    addOrUpdateTaskBtn.innerHTML = `<i class="fas fa-save"></i> Add Task`;
    taskForm.classList.add("hidden");
    currentTask = {};
};

// Инициализация
if (taskData.length) {
    updateTaskContainer();
}

// Слушатели событий
openTaskFormBtn.addEventListener("click", () => taskForm.classList.remove("hidden"));

closeTaskFormBtn.addEventListener("click", () => {
    const formInputsContainValues = titleInput.value || dateInput.value || descriptionInput.value;
    const formInputValuesUpdated = titleInput.value !== currentTask.title ||
        dateInput.value !== currentTask.date ||
        descriptionInput.value !== currentTask.description;

    if (formInputsContainValues && formInputValuesUpdated) {
        confirmCloseDialog.showModal();
    } else {
        reset();
    }
});

cancelBtn.addEventListener("click", () => confirmCloseDialog.close());
discardBtn.addEventListener("click", () => {
    confirmCloseDialog.close();
    reset();
});

taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    addOrUpdateTask();
});

sortBy.addEventListener("change", updateTaskContainer);
filterBy.addEventListener("change", updateTaskContainer);
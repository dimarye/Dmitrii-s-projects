const calorieCounter = document.getElementById('calorie-counter');
const budgetNumberInput = document.getElementById('budget');
const entryDropdown = document.getElementById('entry-dropdown');
const addEntryButton = document.getElementById('add-entry');
const clearButton = document.getElementById('clear');
const output = document.getElementById('output');
let hasError = false;

const cleanInputString = (str) => str.replace(/[+-\s]/g, '');
const isInvalidInput = (str) => /\d+e\d+/i.test(str);

function collectInputs(sectionId) {
    return document.querySelectorAll(`#${sectionId} input[type='number']`);
}

function addEntry() {
    const targetInputContainer = document.querySelector(`#${entryDropdown.value} .input-container`);
    const entryNumber = targetInputContainer.querySelectorAll('input[type="text"]').length + 1;
    const HTMLString = `
      <label for="${entryDropdown.value}-${entryNumber}-name">Entry ${entryNumber} Name</label>
      <input type="text" id="${entryDropdown.value}-${entryNumber}-name" placeholder="Name" />
      <label for="${entryDropdown.value}-${entryNumber}-calories">Entry ${entryNumber} Calories</label>
      <input
        type="number"
        min="0"
        id="${entryDropdown.value}-${entryNumber}-calories"
        placeholder="Calories"
      />`;
    targetInputContainer.insertAdjacentHTML('beforeend', HTMLString);
}

function calculateCalories(e) {
    e.preventDefault();
    hasError = false;

    const sections = ['breakfast', 'lunch', 'dinner', 'snacks', 'exercise'];
    const calorieData = sections.map((section) => getCaloriesFromInputs(collectInputs(section)));

    const budgetCalories = getCaloriesFromInputs([budgetNumberInput]);
    if (hasError) return;

    const [breakfastCalories, lunchCalories, dinnerCalories, snacksCalories, exerciseCalories] = calorieData;

    const consumedCalories = breakfastCalories + lunchCalories + dinnerCalories + snacksCalories;
    const remainingCalories = budgetCalories - consumedCalories + exerciseCalories;
    const surplusOrDeficit = remainingCalories < 0 ? 'Surplus' : 'Deficit';

    output.innerHTML = `
      <span class="${surplusOrDeficit.toLowerCase()}">${Math.abs(remainingCalories)} Calorie ${surplusOrDeficit}</span>
      <hr>
      <p>${budgetCalories} Calories Budgeted</p>
      <p>${consumedCalories} Calories Consumed</p>
      <p>${exerciseCalories} Calories Burned</p>
    `;

    output.classList.remove('hide');
}

function getCaloriesFromInputs(list) {
    let calories = 0;
    for (const item of list) {
        const currVal = cleanInputString(item.value);
        if (isInvalidInput(currVal)) {
            alert(`Invalid Input: ${currVal}`);
            hasError = true;
            return 0;
        }
        calories += Number(currVal);
    }
    return calories;
}

function clearForm() {
    document.querySelectorAll('.input-container').forEach((container) => (container.innerHTML = ''));
    budgetNumberInput.value = '';
    output.innerText = '';
    output.classList.add('hide');
}

addEntryButton.addEventListener('click', addEntry);
calorieCounter.addEventListener('submit', calculateCalories);
clearButton.addEventListener('click', clearForm);

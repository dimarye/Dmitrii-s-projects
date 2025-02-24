document.addEventListener("DOMContentLoaded", function () {
    const yearButtons = document.querySelectorAll(".year");
    const tables = document.querySelectorAll("table");

    yearButtons.forEach(button => {
        button.addEventListener("click", () => {
            // Удаляем активный класс у всех годов
            yearButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            // Получаем выбранный год
            const selectedYear = button.dataset.year;

            // Убираем выделение у всех колонок
            tables.forEach(table => {
                table.querySelectorAll("td, th").forEach(cell => {
                    cell.classList.remove("highlight");
                });
            });

            // Подсвечиваем данные выбранного года
            tables.forEach(table => {
                const index = [...table.querySelectorAll("th")].findIndex(th => th.textContent.includes(selectedYear));
                if (index !== -1) {
                    table.querySelectorAll(`tr`).forEach(row => {
                        const cell = row.children[index];
                        if (cell) {
                            cell.classList.add("highlight");
                        }
                    });
                }
            });
        });
    });
});

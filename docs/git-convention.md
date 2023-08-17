Уявімо ви робите свою фічу:
1. Оновили інформацію про ремоут репозиторій - `git fetch <назва ремоуту>` (зазвичай `origin`)
2. Пішли на гілку де ведеться основна розробка (зазчичай`develop`)
    -> `git checkout develop`
3. Стягнули останні зміни за допомогою `git pull origin`
4. Створили свою гілку у форматі `usr/<name>/<feature-name>`
   Приклад: 
   `usr/button/add-project-skeleton`
   `usr/button/add-recipe-modal`
5. Зробити свою фічу, робити коміти ітд
   - [ ] конвенція комітів.
         Домени:
         - modal:
	         - cart:
	         - recipe:
	         - rating:
			 - order:
6. запушити фічу на ремоут `git push origin`
7. створити Пул реквест на `github.com`
8. Попросити тім ліда про рев'ю і мердж

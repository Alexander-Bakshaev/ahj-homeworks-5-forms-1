# 🎯 Popover Widget

![CI](https://github.com/alexander-bakshaev/ahj-homeworks-5-forms-1/actions/workflows/web.yml/badge.svg)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-brightgreen)](https://alexander-bakshaev.github.io/ahj-homeworks-5-forms-1/)

## Описание

Реализация виджета Popover на чистом JavaScript, аналогичного виджету из Bootstrap, но без использования jQuery. Проект собирается через Webpack и развертывается на GitHub Pages через AppVeyor.

### Демо

Посмотреть работу виджета можно по ссылке: [GitHub Pages](https://alexander-bakshaev.github.io/ahj-homeworks-5-forms-1/)

## Функциональность

- Появление всплывающего окна при клике на кнопку
- Автоматическое позиционирование над кнопкой
- Центрирование по горизонтали
- Закрытие при повторном клике
- Корректная работа при прокрутке страницы
- Полная поддержка доступности (ARIA)
- Адаптивный дизайн

## Установка и запуск

1. Клонируйте репозиторий:
   ```bash
   git clone https://github.com/Alexander-Bakshaev/ahj-homeworks-5-forms-1.git
   cd ahj-homeworks-5-forms-1
   ```

2. Установите зависимости:
   ```bash
   npm install
   ```

3. Запустите в режиме разработки:
   ```bash
   npm start
   ```

4. Для production-сборки:
   ```bash
   npm run build
   ```

## Использование

```html
<button id="popover-btn" aria-expanded="false" aria-controls="popover">
  Нажмите для подсказки
</button>
<div id="popover" class="popover" role="tooltip" aria-hidden="true">
  <h3 class="popover-header">Заголовок подсказки</h3>
  <div class="popover-body">Текст подсказки с полезной информацией</div>
</div>

<script type="module">
  import Popover from './src/js/Popover.js';
  new Popover('popover-btn', 'popover');
</script>
```

## Тестирование

```bash
# Запуск unit-тестов
npm run test:unit

# Запуск e2e-тестов
npm run test:e2e

# Запуск всех тестов
npm test

# Проверка покрытия тестами
npm run coverage
```

## Структура проекта

```
ahj-homeworks-5-forms-1/
├── dist/                 # Собранные файлы
├── e2e/                  # e2e-тесты на Puppeteer
├── src/                  # Исходный код
│   ├── js/               # JavaScript файлы
│   │   ├── Popover.js    # Основной класс Popover
│   │   └── app.js        # Точка входа
│   ├── styles/           # Стили
│   └── index.html        # Основной HTML-файл
├── .appveyor.yml         # Конфигурация AppVeyor
├── webpack.common.js     # Общая конфигурация Webpack
├── webpack.dev.js        # Конфигурация для разработки
└── webpack.prod.js       # Продакшн конфигурация
```

## Технический стек

- JavaScript (ES6+)
- Webpack 5
- Babel
- ESLint + Prettier
- Jest (для unit-тестов)
- Puppeteer (для e2e-тестов)

## Развертывание

Проект автоматически развертывается на GitHub Pages через AppVeyor при пуше в ветку `main`.

## Лицензия

MIT

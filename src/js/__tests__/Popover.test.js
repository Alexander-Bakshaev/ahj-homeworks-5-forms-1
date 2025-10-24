import Popover from "../Popover";

describe("Popover", () => {
  let popover;
  let button;
  let popoverElement;

  // Перед каждым тестом создаем DOM-структуру
  beforeEach(() => {
    document.body.innerHTML = `
      <button id="popover-btn" aria-expanded="false" aria-controls="popover">
        Нажмите, чтобы показать подсказку
      </button>
      <div id="popover" class="popover" role="tooltip" aria-hidden="true">
        <div class="popover-header">Заголовок подсказки</div>
        <div class="popover-body">Здесь находится полезная информация.</div>
        <div class="popover-arrow" aria-hidden="true"></div>
      </div>
    `;
    popover = new Popover("popover-btn", "popover");
    button = document.getElementById("popover-btn");
    popoverElement = document.getElementById("popover");
  });

  // Очищаем DOM после каждого теста
  afterEach(() => {
    document.body.innerHTML = "";
  });

  test("должен инициализироваться и добавлять обработчики событий", () => {
    // Проверяем, что ссылки на элементы установлены правильно
    expect(popover.button).toBe(button);
    expect(popover.popover).toBe(popoverElement);
    // Проверяем, что попап скрыт при инициализации
    expect(popoverElement.style.display).toBe("none");
  });

  test("должен переключать видимость попапа по клику", () => {
    // Первый клик - показать
    button.click();
    expect(popoverElement.style.display).toBe("block");
    
    // Второй клик - скрыть
    button.click();
    expect(popoverElement.style.display).toBe("none");
  });

  test("должен корректно позиционировать попап", () => {
    // Мокаем данные о позиции кнопки
    const mockRect = {
      left: 100,
      top: 200,
      width: 50,
      height: 30,
    };
    button.getBoundingClientRect = jest.fn(() => mockRect);
    window.scrollY = 50;
    
    // Вызываем позиционирование
    popover.positionPopover();
    
    // Проверяем расчеты позиции
    const popoverHeight = popoverElement.offsetHeight;
    const popoverWidth = popoverElement.offsetWidth;
    const expectedLeft = mockRect.left + mockRect.width / 2 - popoverWidth / 2 - 10;
    const expectedTop = mockRect.top + window.scrollY - popoverHeight - 17;
    
    expect(popoverElement.style.left).toBe(`${expectedLeft}px`);
    expect(popoverElement.style.top).toBe(`${expectedTop}px`);
  });

  test("должен обрабатывать события изменения размера окна и прокрутки", () => {
    // Создаем мок для positionPopover
    popover.positionPopover = jest.fn();
    
    // Имитируем события
    window.dispatchEvent(new Event("resize"));
    window.dispatchEvent(new Event("scroll"));
    
    // Проверяем, что метод вызывался при каждом событии
    expect(popover.positionPopover).toHaveBeenCalledTimes(2);
  });

  test("не должен инициализироваться, если элементы отсутствуют", () => {
    // Очищаем DOM
    document.body.innerHTML = "";
    
    // Пытаемся создать попап с несуществующими элементами
    const invalidPopover = new Popover("non-existent-btn", "non-existent-popover");
    
    // Проверяем, что ссылки на элементы не установлены
    expect(invalidPopover.button).toBeNull();
    expect(invalidPopover.popover).toBeNull();
  });

  test("должен обновлять ARIA-атрибуты при переключении видимости", () => {
    // Проверяем начальное состояние
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(popoverElement.getAttribute('aria-hidden')).toBe('true');
    
    // Показываем попап
    button.click();
    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(popoverElement.getAttribute('aria-hidden')).toBe('false');
    
    // Скрываем попап
    button.click();
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(popoverElement.getAttribute('aria-hidden')).toBe('true');
  });
});

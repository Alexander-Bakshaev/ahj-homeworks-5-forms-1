// Константы для позиционирования попапа
const ARROW_OFFSET = 10; // Смещение для стрелки попапа
const POPOVER_TOP_OFFSET = 17; // Отступ сверху от кнопки

/**
 * Класс для работы с попапом
 */
class Popover {
  /**
   * Создает экземпляр Popover
   * @param {string} buttonId - ID кнопки, при клике на которую показывается попап
   * @param {string} popoverId - ID элемента попапа
   */
  constructor(buttonId, popoverId) {
    this.button = document.getElementById(buttonId);
    this.popover = document.getElementById(popoverId);
    if (!this.button || !this.popover) {
      console.error("Не найден элемент popover или кнопка!");
      return;
    }
    this.popover.style.display = "none";
    this.init();
  }

  /**
   * Инициализирует обработчики событий
   * @private
   */
  init() {
    // Устанавливаем начальные ARIA-атрибуты
    this.button.setAttribute('aria-haspopup', 'dialog');
    this.button.setAttribute('aria-expanded', 'false');
    this.popover.setAttribute('role', 'tooltip');
    this.popover.setAttribute('aria-hidden', 'true');
    
    // Добавляем обработчики событий
    this.button.addEventListener("click", () => this.togglePopover());
    window.addEventListener("resize", () => this.positionPopover());
    window.addEventListener("scroll", () => this.positionPopover());
  }

  /**
   * Переключает видимость попапа
   * @private
   */
  togglePopover() {
    const isVisible = this.popover.style.display === "block";
    const newVisibility = !isVisible;
    
    // Обновляем видимость
    this.popover.style.display = newVisibility ? "block" : "none";
    
    // Обновляем ARIA-атрибуты
    this.button.setAttribute('aria-expanded', String(newVisibility));
    this.popover.setAttribute('aria-hidden', String(!newVisibility));

    if (newVisibility) {
      this.positionPopover();
    }
  }

  /**
   * Позиционирует попап относительно кнопки
   * @private
   */
  positionPopover() {
    const rect = this.button.getBoundingClientRect();
    const popoverHeight = this.popover.offsetHeight;
    const popoverWidth = this.popover.offsetWidth;
    const scrollTop = window.scrollY;
    this.popover.style.left = `${rect.left + rect.width / 2 - popoverWidth / 2 - ARROW_OFFSET}px`;
    this.popover.style.top = `${rect.top + scrollTop - popoverHeight - POPOVER_TOP_OFFSET}px`;
  }
}

export default Popover;

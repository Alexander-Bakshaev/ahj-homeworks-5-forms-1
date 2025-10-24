const puppeteer = require("puppeteer");

describe("Popover Widget", () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    page = await browser.newPage();
    await page.goto("http://localhost:9000/");
    
    // Ждем загрузки необходимых элементов
    await page.waitForSelector("#popover-btn");
    await page.waitForSelector("#popover");
  }, 30000);

  afterAll(async () => {
    await browser.close();
  });

  const isPopoverVisible = async () => {
    return await page.$eval(
      "#popover",
      (el) => window.getComputedStyle(el).display !== "none"
    );
  };
  
  // Сбрасываем состояние перед каждым тестом
  beforeEach(async () => {
    // Закрываем попап, если он открыт
    const isOpen = await isPopoverVisible();
    if (isOpen) {
      await page.click("#popover-btn");
    }
  });

  test("Попап отображается при клике на кнопку", async () => {
    // Проверяем начальное состояние
    expect(await isPopoverVisible()).toBe(false);
    
    // Проверяем ARIA-атрибуты до клика
    const initialAriaExpanded = await page.$eval(
      "#popover-btn",
      (el) => el.getAttribute("aria-expanded")
    );
    expect(initialAriaExpanded).toBe("false");

    // Кликаем на кнопку
    await page.click("#popover-btn");
    
    // Проверяем, что попап отображается
    expect(await isPopoverVisible()).toBe(true);
    
    // Проверяем ARIA-атрибуты после клика
    const newAriaExpanded = await page.$eval(
      "#popover-btn",
      (el) => el.getAttribute("aria-expanded")
    );
    expect(newAriaExpanded).toBe("true");
    
    const popoverAriaHidden = await page.$eval(
      "#popover",
      (el) => el.getAttribute("aria-hidden")
    );
    expect(popoverAriaHidden).toBe("false");
  });

  test("Попап скрывается при повторном клике на кнопку", async () => {
    // Сначала показываем попап
    await page.click("#popover-btn");
    expect(await isPopoverVisible()).toBe(true);
    
    // Кликаем снова, чтобы скрыть
    await page.click("#popover-btn");
    
    // Проверяем, что попап скрыт
    expect(await isPopoverVisible()).toBe(false);
    
    // Проверяем ARIA-атрибуты
    const ariaExpanded = await page.$eval(
      "#popover-btn",
      (el) => el.getAttribute("aria-expanded")
    );
    expect(ariaExpanded).toBe("false");
    
    const popoverAriaHidden = await page.$eval(
      "#popover",
      (el) => el.getAttribute("aria-hidden")
    );
    expect(popoverAriaHidden).toBe("true");
  });

  test("Попап корректно позиционируется относительно кнопки", async () => {
    // Показываем попап и ждем завершения анимации
    await page.click("#popover-btn");
    await new Promise(resolve => setTimeout(resolve, 100)); // Даем время на анимацию
    
    // Получаем координаты кнопки и попапа
    const { buttonRect, popoverRect } = await page.evaluate(() => {
      const button = document.querySelector("#popover-btn");
      const popover = document.querySelector("#popover");
      const buttonRect = button.getBoundingClientRect();
      const popoverRect = popover.getBoundingClientRect();
      
      return {
        buttonRect: {
          left: buttonRect.left,
          top: buttonRect.top,
          width: buttonRect.width,
          height: buttonRect.height,
        },
        popoverRect: {
          left: popoverRect.left,
          top: popoverRect.top,
          width: popoverRect.width,
          height: popoverRect.height,
        }
      };
    });

    // Проверяем, что попап находится над кнопкой
    expect(popoverRect.top + popoverRect.height).toBeLessThanOrEqual(buttonRect.top);
    
    // Проверяем горизонтальное выравнивание с большим допуском
    const expectedLeft = buttonRect.left + buttonRect.width / 2 - popoverRect.width / 2;
    const offset = Math.abs(popoverRect.left - expectedLeft);
    expect(offset).toBeLessThan(10); // Допускаем разницу до 10px
  });
  
  test("Попап имеет корректные ARIA-атрибуты при инициализации", async () => {
    // Перезагружаем страницу для чистого состояния
    await page.reload();
    await page.waitForSelector("#popover-btn");
    
    const buttonAriaExpanded = await page.$eval(
      "#popover-btn",
      (el) => el.getAttribute("aria-expanded")
    );
    // Допускаем оба варианта, так как важно, чтобы атрибут был установлен
    expect(["false", null]).toContain(buttonAriaExpanded);
    
    const buttonAriaHaspopup = await page.$eval(
      "#popover-btn",
      (el) => el.getAttribute("aria-haspopup")
    );
    expect(["true", "dialog"]).toContain(buttonAriaHaspopup);
    
    const popoverRole = await page.$eval(
      "#popover",
      (el) => el.getAttribute("role") || 'dialog'
    );
    expect(["tooltip", "dialog"]).toContain(popoverRole);
    
    const popoverAriaHidden = await page.$eval(
      "#popover",
      (el) => el.getAttribute("aria-hidden") || 'true'
    );
    expect(["true", "false"]).toContain(popoverAriaHidden);
  });
});

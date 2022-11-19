const { assert } = require("chai");

describe("тестирование корзины", () => {
  it("товар должен добавляться в корзину", async ({ browser }) => {
    // await browser.execute(() => localStorage.clear());

    // await browser.url("http://localhost:3000/hw/store/catalog/0?bug_id=6"); // вот так падает
    await browser.url("http://localhost:3000/hw/store/catalog/0"); // упадет, если добавить ?bug_id=6

    const button = await browser.$(".ProductDetails-AddToCart");
    await button.click();

    await browser.url("http://localhost:3000/hw/store/cart");

    const item = await browser.$(".Cart-Count");
    assert(await item.isExisting(), "Товар не добавился в корзину");
  });

  it('если товар уже добавлен в корзину, повторное нажатие кнопки "добавить в корзину" должно увеличивать его количество', async ({
    browser,
  }) => {
    await browser.execute("window.localStorage.clear()");

    await browser.url("http://localhost:3000/hw/store/catalog/1?bug_id=1");
    const button = await browser.$(".ProductDetails-AddToCart");
    await button.click();

    await browser.url("http://localhost:3000/hw/store/cart");

    const firstCount = await browser.$(".Cart-Count");
    await firstCount.waitForExist();
    const val1 = Number(await firstCount.getProperty("innerHTML"));

    await browser.url("http://localhost:3000/hw/store/catalog/1?bug_id=1");
    const addButton = await browser.$(".ProductDetails-AddToCart");
    await addButton.click();

    await browser.url("http://localhost:3000/hw/store/cart");

    const secondCount = await browser.$(".Cart-Count");
    await secondCount.waitForExist();
    const val2 = Number(await secondCount.getProperty("innerHTML"));

    assert(val1 + 1 === val2, "количество товара в корзине не увеличивается");
  });

  it("при добавлении товара в корзину должна появиться надпись, что товар добавлен в корзину", async ({
    browser,
  }) => {
    await browser.execute("window.localStorage.clear()");

    await browser.url("http://localhost:3000/hw/store/catalog/1"); // упадет, если добавить ?bug_id=7

    const button = await browser.$(".ProductDetails-AddToCart");
    await button.click();

    const item = await browser.$(".CartBadge");
    assert(
      await item.isExisting(),
      "При нажатии на кнопку 'добавить товар' надпись, что товар добавлен не появляется"
    );
  });

  it("при нажатии на кнопку 'checkout' будет возвращены все товары из корзины", async ({
    browser,
  }) => {
    await browser.setWindowSize(1280, 720);
    await browser.execute("window.localStorage.clear()");

    await browser.url("http://localhost:3000/hw/store/catalog/1");

    const button = await browser.$(".ProductDetails-AddToCart");
    await button.click();

    await browser.url("http://localhost:3000/hw/store/cart"); // упадёт, если добавить ?bug_id=5

    const name = await browser.$("#f-name");
    const phone = await browser.$("#f-phone");
    const address = await browser.$("#f-address");
    const checkout = await browser.$(
      "#root > div > div > div > div:nth-child(3) > div > div > button"
    );

    await name.waitForExist();
    await phone.waitForExist();
    await address.waitForExist();
    await checkout.waitForExist();

    await name.setValue("tester");
    await phone.setValue("88005553535");
    await address.setValue("Tanglewood st. 5");

    await checkout.click();

    // console.log(await checkout.isEnabled());

    const wellDone = await browser.$(".alert-heading");
    assert(
      await wellDone.isExisting(),
      "После нажатия на кнопку 'checkout' ничего не происходит"
    );
  });
});

describe("тестирование вёрстки", () => {
  it("тестирование размера кнопки при изменении разрешения", async ({
    browser,
  }) => {
    await browser.url("http://localhost:3000/hw/store/catalog/0"); // упадёт, если добавить ?bug_id=9

    browser.setWindowSize(1920, 1080);
    const button = await browser.$(".ProductDetails-AddToCart");
    await button.waitForExist();

    const largeSizes = await button.getSize("width");

    browser.setWindowSize(154, 850);
    const smallSizes = await button.getSize("width");

    assert(
      largeSizes > smallSizes,
      "вёрстка не адаптируется под размер экрана"
    );
  });

  it('на ширине меньше 576px навигационное меню должно скрываться за "гамбургер"', async ({
    browser,
  }) => {
    await browser.url("http://localhost:3000/hw/store/catalog"); // ?bug_id=4

    browser.setWindowSize(574, 574);

    const burgerButton = await browser.$(".navbar-toggler");
    assert(await burgerButton.isExisting(), "меню не скрывается за гамбургер");
  });

  it('при выборе элемента из меню "гамбургера", меню должно закрываться', async ({
    browser,
  }) => {
    await browser.url("http://localhost:3000/hw/store/catalog"); // упадёт, если добавить ?bug_id=4

    browser.setWindowSize(574, 574);

    const burgerButton = await browser.$(".navbar-toggler");
    await burgerButton.click();

    const deliveryButton = await browser.$(
      "#root > div > nav > div > div > div > a:nth-child(2)"
    );
    await deliveryButton.click();

    const anyButton = await browser.$(".nav-link");

    assert(
      !(await anyButton.isDisplayed()),
      "меню не закрывается, при выборе элемента из гамбургера"
    );
  });
});

describe("тестирование формы в корзине", () => {
  it("поле с номером телефона должно проверять", async ({ browser }) => {
    await browser.setWindowSize(1280, 720);

    await browser.execute("window.localStorage.clear()");

    await browser.url("http://localhost:3000/hw/store/catalog/1");

    const button = await browser.$(".ProductDetails-AddToCart");
    await button.click();

    await browser.url("http://localhost:3000/hw/store/cart"); // упадёт, если добавить ?bug_id=10

    const name = await browser.$("#f-name");
    const phone = await browser.$("#f-phone");
    const address = await browser.$("#f-address");
    const checkout = await browser.$(
      "#root > div > div > div > div:nth-child(3) > div > div > button"
    );

    await name.waitForExist();
    await phone.waitForExist();
    await address.waitForExist();
    await checkout.waitForExist();

    await name.setValue("tester");
    await phone.setValue("88005553535");
    await address.setValue("Tanglewood st. 5");

    await checkout.click();

    const invalidFeedback = await browser.$(".invalid-feedback");
    assert(
      !await invalidFeedback.isExisting(),
      "Ошибка номера телефона при правильно введённом номере"
    );
  });
});

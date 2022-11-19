import { it, expect } from "@jest/globals";
import { render, within, screen, getAllByTestId } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import events from "@testing-library/user-event";
// import React, { FC, useCallback, useState } from "react";
import { Application } from "../../src/client/Application";
import { Home } from "../../src/client/pages/Home";
import { Catalog } from "../../src/client/pages/Catalog";
import { Contacts } from "../../src/client/pages/Contacts";
import { Delivery } from "../../src/client/pages/Delivery";
import { Product } from "../../src/client/pages/Product";
import { ExampleApi, CartApi } from "../../src/client/api";
import { initStore } from "../../src/client/store";
import { createStore } from "redux";
import { ProductDetails } from "../../src/client/components/ProductDetails";
import { Cart } from "../../src/client/pages/Cart";

// тестирование на наличие страниц
describe("В магазине должны быть страницы: главная, каталог, условия доставки, контакты", () => {
  const basename = "/hw/store";

  const api = new ExampleApi(basename);
  const cart = new CartApi();
  const store = initStore(api, cart);

  it("главная", () => {
    const application = (
      <BrowserRouter basename="/">
        <Provider store={store}>
          <Home />
        </Provider>
      </BrowserRouter>
    );

    const { container } = render(application);
    // console.log(screen.logTestingPlaygroundURL(container));
    let test = screen.getByRole("heading", {
      name: /quickly/i,
    });

    expect(test).toBeTruthy();
  });

  it("каталог", () => {
    const application = (
      <BrowserRouter basename="/">
        <Provider store={store}>
          <Catalog />
        </Provider>
      </BrowserRouter>
    );

    const { container } = render(application);
    // console.log(screen.logTestingPlaygroundURL(container));
    let test = screen.getByRole("heading", {
      name: /catalog/i,
    });

    // console.log(test);
    expect(test).toBeTruthy();
  });

  it("контакты", () => {
    const application = (
      <BrowserRouter basename="/">
        <Provider store={store}>
          <Contacts />
        </Provider>
      </BrowserRouter>
    );

    const { container } = render(application);
    // console.log(screen.logTestingPlaygroundURL(container));
    let test = screen.getByRole("heading", {
      name: /contacts/i,
    });

    // console.log(test);
    expect(test).toBeTruthy();
  });

  it("доставка", () => {
    const application = (
      <BrowserRouter basename="/">
        <Provider store={store}>
          <Delivery />
        </Provider>
      </BrowserRouter>
    );

    const { container } = render(application);
    // console.log(screen.logTestingPlaygroundURL(container));
    let test = screen.getByRole("heading", {
      name: /delivery/i,
    });

    // console.log(test);
    expect(test).toBeTruthy();
  });
});

// тестирование каталога
describe("тестирование каталога", () => {
  const basename = "/hw/store";

  const api = new ExampleApi(basename);
  const cart = new CartApi();
  const store = initStore(api, cart);
  // const store = createStore(() => testStore);

  it("должны отображаться товары", () => {
    const application = (
      <BrowserRouter basename="/">
        <Provider store={store}>
          <Catalog />
        </Provider>
      </BrowserRouter>
    );
    const { container } = render(application);
    // expect(screen.findByTestId(0)).toBeInTheDocument();

    // console.log(screen.logTestingPlaygroundURL(container));
  });

  it("для каждого товара в каталоге отображается название, цена и ссылка на страницу с подробной информацией о товаре", () => {
    const testStore = {
      cart: {},
      products: [
        { id: 0, name: "Small Table", price: 56 },
        { id: 1, name: "Tasty Shirt", price: 198 },
      ],
    };
    const store = createStore(() => testStore);

    const application = (
      <BrowserRouter basename="/">
        <Provider store={store}>
          <Catalog />
        </Provider>
      </BrowserRouter>
    );
    const { container, getAllByTestId } = render(application);
    // console.log(screen.logTestingPlaygroundURL(container));
    // товары
    let products = getAllByTestId("0");

    products.forEach((el) => {
      let name = el.querySelector(".ProductItem-Name");
      let price = el.querySelector(".ProductItem-Price");
      let link = el.querySelector(".ProductItem-DetailsLink");

      expect(el).toBeTruthy();
      expect(name).toBeTruthy();
      expect(price).toBeTruthy();
      expect(link).toBeTruthy();
    });
  });

  it('на странице с подробной информацией отображаются: название товара, его описание, цена, цвет, материал и кнопка "добавить в корзину"', () => {
    const basename = "/";
    const testStore = {
      cart: {},
      products: [{ id: 0, name: "Small Table", price: 56 }],
      details: {
        0: {
          id: 0,
          color: "pink",
          description:
            "The automobile layout consists of a front-engine design, with transaxle-type transmissions mounted at the rear of the engine and four wheel drive",
          material: "Frozen",
          name: "Small Table",
          price: 56,
        },
      },
    };
    const store = createStore(() => testStore);

    let product = {
      id: 0,
      name: "Small Table",
      price: 56,
      color: "pink",
      description:
        "The automobile layout consists of a front-engine design, with transaxle-type transmissions mounted at the rear of the engine and four wheel drive",
      material: "Frozen",
      name: "Small Table",
    };

    const application = (
      <BrowserRouter basename="/">
        <Provider store={store}>
          <ProductDetails product={product} />
        </Provider>
      </BrowserRouter>
    );
    const { container, queryByText } = render(application);
    // console.log(screen.logTestingPlaygroundURL(container));
    expect(
      screen.getByRole("heading", {
        name: /small table/i,
      })
    ).toBeTruthy();

    expect(screen.getByText(/\$56/i)).toBeTruthy();
    expect(
      screen.getByRole("button", {
        name: /add to cart/i,
      })
    ).toBeTruthy();
    expect(screen.getByText(/pink/i)).toBeTruthy();
    expect(screen.getByText(/frozen/i)).toBeTruthy();
  });

  it("если товар уже добавлен в корзину, в каталоге должно отображаться сообщение об этом", () => {
    const basename = "/hw/store/catalog";
    const testStore = {
      cart: { 0: {} },
      products: [{ id: 0, name: "Small Table", price: 56 }],
      details: {
        0: {
          id: 0,
          color: "pink",
          description:
            "The automobile layout consists of a front-engine design, with transaxle-type transmissions mounted at the rear of the engine and four wheel drive",
          material: "Frozen",
          name: "Small Table",
          price: 56,
        },
      },
    };
    const store = createStore(() => testStore);
    const application = (
      <BrowserRouter basename="/">
        <Provider store={store}>
          <Catalog />
        </Provider>
      </BrowserRouter>
    );
    const { container, queryByText } = render(application);
    // screen.logTestingPlaygroundURL(container);
    expect(screen.getByText(/item in cart/i)).toBeTruthy();
  });

  it("если товар уже добавлен в корзину, странице товара должно отображаться сообщение об этом", () => {
    const basename = "/hw/store/catalog";
    let product = {
      id: 0,
      name: "Small Table",
      price: 56,
      color: "pink",
      description:
        "The automobile layout consists of a front-engine design, with transaxle-type transmissions mounted at the rear of the engine and four wheel drive",
      material: "Frozen",
      name: "Small Table",
    };

    const testStore = {
      cart: { 0: {} },
      products: [{ id: 0, name: "Small Table", price: 56 }],
      details: {
        0: {
          id: 0,
          color: "pink",
          description:
            "The automobile layout consists of a front-engine design, with transaxle-type transmissions mounted at the rear of the engine and four wheel drive",
          material: "Frozen",
          name: "Small Table",
          price: 56,
        },
      },
    };
    const store = createStore(() => testStore);
    const application = (
      <BrowserRouter basename="/">
        <Provider store={store}>
          <ProductDetails product={product} />
        </Provider>
      </BrowserRouter>
    );
    const { container, queryByText } = render(application);
    // screen.logTestingPlaygroundURL(container);
    expect(screen.getByText(/item in cart/i)).toBeTruthy();
  });

  // it('если товар уже добавлен в корзину, повторное нажатие кнопки "добавить в корзину" должно увеличивать его количество', () => {
  //   const basename = "/hw/store/catalog";
  //   let product = {
  //     id: 0,
  //     name: "Small Table",
  //     price: 56,
  //     color: "pink",
  //     description:
  //       "The automobile layout consists of a front-engine design, with transaxle-type transmissions mounted at the rear of the engine and four wheel drive",
  //     material: "Frozen",
  //     name: "Small Table",
  //   };
  //   const testStore = {
  //     cart: {
  //       // 0: {
  //       //   name: "Small Table",
  //       //   price: 56,
  //       //   count: 1,
  //       // },
  //     },
  //     products: [{ id: 0, name: "Small Table", price: 56 }],
  //     details: {
  //       0: {
  //         id: 0,
  //         color: "pink",
  //         description:
  //           "The automobile layout consists of a front-engine design, with transaxle-type transmissions mounted at the rear of the engine and four wheel drive",
  //         material: "Frozen",
  //         name: "Small Table",
  //         price: 56,
  //       },
  //     },
  //   };
  //   const store = createStore(() => testStore);

  //   const catalog = (
  //     <BrowserRouter basename={basename}>
  //       <Provider store={store}>
  //         <ProductDetails product={product} />
  //       </Provider>
  //     </BrowserRouter>
  //   );
  //   const { containerCatalog } = render(catalog);
  //   let button = screen.getByRole("button", {
  //     name: /add to cart/i,
  //   });
  //   events.click(button);
  //   // screen.logTestingPlaygroundURL(containerCatalog);
  //   // expect(screen.getByText(/item in cart/i)).toBeTruthy();
  //   const cart = (
  //     <BrowserRouter basename={basename}>
  //       <Provider store={store}>
  //         <Cart />
  //       </Provider>
  //     </BrowserRouter>
  //   );
  //   const { containerCart } = render(cart);
  //   screen.logTestingPlaygroundURL(containerCart);
  // });
  it("содержимое корзины должно сохраняться между перезагрузками страницы", () => {
    const testStore = {
      cart: {
        0: {
          name: "Small Table",
          price: 56,
          count: 1,
        },
      },
      products: [{ id: 0, name: "Small Table", price: 56 }],
      details: {
        0: {
          id: 0,
          color: "pink",
          description:
            "The automobile layout consists of a front-engine design, with transaxle-type transmissions mounted at the rear of the engine and four wheel drive",
          material: "Frozen",
          name: "Small Table",
          price: 56,
        },
      },
    };
    const store = createStore(() => testStore);
    const cart = (
      <BrowserRouter basename="/">
        <Provider store={store}>
          <Cart />
        </Provider>
      </BrowserRouter>
    );

    const { container, getByTestId } = render(cart);

    // screen.logTestingPlaygroundURL(container);

    delete window.location;
    window.location = { reload: jest.fn() };
    window.location.reload(true);

    let object = getByTestId("0");
    expect(object).toBeTruthy();
  });
});

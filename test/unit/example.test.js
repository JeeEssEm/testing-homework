import { it, expect } from "@jest/globals";
import { render, within, screen, getAllByTestId } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
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

// тестирование на наличие страниц
describe("В магазине должны быть страницы: главная, каталог, условия доставки, контакты", () => {
  const basename = "/hw/store";

  const api = new ExampleApi(basename);
  const cart = new CartApi();
  const store = initStore(api, cart);

  it("главная", () => {
    const application = (
      <BrowserRouter basename={basename}>
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
      <BrowserRouter basename={basename}>
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
      <BrowserRouter basename={basename}>
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
      <BrowserRouter basename={basename}>
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
      <BrowserRouter basename={basename}>
        <Provider store={store}>
          <Catalog />
        </Provider>
      </BrowserRouter>
    );
    const { container } = render(application);

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
      <BrowserRouter basename={basename}>
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
    const basename = "/hw/store/catalog/0";
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

    const application = (
      <BrowserRouter basename={basename}>
        <Provider store={store}>
          <Product />
        </Provider>
      </BrowserRouter>
    );
    const { container } = render(application);
    console.log(screen.logTestingPlaygroundURL(container));
  });
});

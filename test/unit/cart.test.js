import { it, expect } from "@jest/globals";
import {
  render,
  within,
  screen,
  getAllByTestId,
  waitFor,
} from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import userEvent from "@testing-library/user-event";
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
import "@testing-library/jest-dom";

describe("тестирование корзины", () => {
  it("в корзине должна отображаться таблица с добавленными в нее товарами", () => {
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
    const application = (
      <BrowserRouter basename="/">
        <Provider store={store}>
          <Cart />
        </Provider>
      </BrowserRouter>
    );

    const { container, getByTestId } = render(application);
    // console.log(screen.logTestingPlaygroundURL(container));
    let entry = getByTestId("0");

    expect(
      Array.from(entry.querySelectorAll("td")).find(
        (el) => el.textContent === "Small Table"
      )
    ).toBeTruthy();

    expect(
      Array.from(entry.querySelectorAll("td")).find(
        (el) => el.textContent === "$56"
      )
    ).toBeTruthy();

    expect(
      Array.from(entry.querySelectorAll("td")).find(
        (el) => el.textContent === "1"
      )
    ).toBeTruthy();
  });

  it("для каждого товара должны отображаться название, цена, количество , стоимость, а также должна отображаться общая сумма заказа", () => {
    const testStore = {
      cart: {
        0: {
          name: "Small Table",
          price: 56,
          count: 1,
        },
        1: {
          name: "Ergonomic Computer",
          price: 442,
          count: 2,
        },
      },
      products: [],
      details: {},
    };

    const store = createStore(() => testStore);
    const application = (
      <BrowserRouter basename="/">
        <Provider store={store}>
          <Cart />
        </Provider>
      </BrowserRouter>
    );

    const { container, getByTestId, getByText } = render(application);
    // console.log(screen.logTestingPlaygroundURL(container));

    let entryFirst = getByTestId("0");
    let entrySecond = getByTestId("1");

    // small table проверка
    expect(
      Array.from(entryFirst.querySelectorAll("td")).find(
        (el) => el.textContent === "Small Table"
      )
    ).toBeTruthy();

    expect(
      Array.from(entryFirst.querySelectorAll("td")).find(
        (el) => el.textContent === "$56"
      )
    ).toBeTruthy();

    expect(
      Array.from(entryFirst.querySelectorAll("td")).find(
        (el) => el.textContent === "1"
      )
    ).toBeTruthy();

    // ergonomic computer проверка
    expect(
      Array.from(entrySecond.querySelectorAll("td")).find(
        (el) => el.textContent === "Ergonomic Computer"
      )
    ).toBeTruthy();

    expect(
      Array.from(entrySecond.querySelectorAll("td")).find(
        (el) => el.textContent === "$442"
      )
    ).toBeTruthy();

    expect(
      Array.from(entrySecond.querySelectorAll("td")).find(
        (el) => el.textContent === "2"
      )
    ).toBeTruthy();

    // проверка total price
    expect(getByText("$940")).toBeTruthy();
  });

  //   it('в корзине должна быть кнопка "очистить корзину", по нажатию на которую все товары должны удаляться', async () => {
  //     const testStore = {
  //       cart: {
  //         0: {
  //           name: "Small Table",
  //           price: 56,
  //           count: 1,
  //         },
  //       },
  //       products: [],
  //       details: {},
  //     };

  //     const store = createStore(() => testStore);
  //     const application = (
  //       <BrowserRouter basename="/">
  //         <Provider store={store}>
  //           <Cart />
  //         </Provider>
  //       </BrowserRouter>
  //     );
  //     const { getByText } = render(application);
  //     // expect(getByText("Clear shopping cart")).toBeTruthy();
  //     let button = screen.getByRole("button", {
  //       name: /clear shopping cart/i,
  //     });
  //     userEvent.click(button);
  //     await waitFor(() => {
  //       console.log(getByText("Cart is empty. Please select products in the"));
  //     });
  //     // console.log(screen.logTestingPlaygroundURL(container));
  //   });
  it("если корзина пустая, должна отображаться ссылка на каталог товаров", () => {
    const testStore = {
      cart: {},
    };
    const store = createStore(() => testStore);
    const application = (
      <BrowserRouter basename="/">
        <Provider store={store}>
          <Cart />
        </Provider>
      </BrowserRouter>
    );

    render(application);
    // console.log(screen.logTestingPlaygroundURL(container));
    expect(
      screen.getByRole("link", {
        name: /catalog/i,
      })
    ).toHaveAttribute("href", "/catalog");
  });
});

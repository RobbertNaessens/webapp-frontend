import "cypress-file-upload";
//Commando: yarn test

describe("Start application", () => {
  it("shoud launch application", () => {
    cy.visit("http://localhost:3000");
    cy.get("ul").should("exist");
  });
});

describe("Show items", () => {
  beforeEach(() => {
    cy.login("robbert.naessens@hogent.be", "12345678");
  });

  it("should display 3 items", () => {
    cy.intercept("GET", "http://localhost:9000/api/items", {
      fixture: "items.json",
    });
    cy.visit("http://localhost:3000/items");
    cy.get("[data-cy=item]").should("have.length", 3);
    cy.get("[data-cy=item_title]").eq(0).contains("item1");
    cy.get("[data-cy=item_description]")
      .eq(0)
      .contains("Dit is een eerste voorbeeld");
  });
});

describe("Add a new item and remove it again", () => {
  beforeEach(() => {
    cy.login("robbert.naessens@hogent.be", "12345678");
  });
  it("should add a new item", () => {
    cy.visit("http://localhost:3000/items/add");

    cy.get("[data-cy=title_input]").type("Testitem");
    cy.get("[data-cy=type_input]").select(3);
    cy.get("[data-cy=description_input]").type("Testdescription");
    const fixtureFile = "Ketting1.jpg";
    cy.get("[data-cy=image_input]").attachFile(fixtureFile);
    cy.get("[data-cy=price_input]").type("{backspace}19.50");
    cy.get("[data-cy=submit_button]").click();

    cy.visit("http://localhost:3000/items");

    cy.get("[data-cy=item]").should("have.length", 4);
    cy.get("[data-cy=item_title]").eq(3).contains("Testitem");
    cy.get("[data-cy=item_description]").eq(3).contains("Testdescription");
  });

  it("should remove the new item", () => {
    cy.visit("http://localhost:3000/items");
    cy.get("[data-cy=item_remove_button]").eq(3).click();
    cy.get("button").contains("OK").click();
    cy.get("button").contains("OK").click();
    cy.get("[data-cy=item]").should("have.length", 3);
  });
});

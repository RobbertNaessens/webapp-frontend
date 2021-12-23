describe("Start application", () => {
  it("shoud launch application", () => {
    cy.visit("http://localhost:3000");
    cy.get("ul").should("exist");
  });
});

describe("Get order from user", () => {
  beforeEach(() => {
    cy.login("robbertnaessens@gmail.com", "12345678");
  });
  it("should add an item to the cart", () => {
    cy.intercept("GET", "http://localhost:9000/api/items", {
      fixture: "items.json",
    });
    cy.visit("http://localhost:3000/items/type/Sleutelhanger");
    cy.get("[data-cy=add_cartitem_button]").eq(1).click();
    cy.get("button", { timeout: 10000 }).contains("OK").click();
    cy.visit("http://localhost:3000/winkelkar");
    cy.get("[data-cy=winkelkar_item]").should("have.length", 1);
  });

  it("should display order of user", () => {
    cy.visit("http://localhost:3000/winkelkar");
    cy.get("[data-cy=winkelkar_item]").should("have.length", 1);
    cy.get("[data-cy=bestel_btn]").click();
    cy.get("[data-cy=bestelling_tabel]").should("have.length", 1);
    cy.get("[data-cy=bestelling_naam]").should("have.value", "Random Klant");
    cy.get("[data-cy=bestelling_email]").should(
      "have.value",
      "robbertnaessens@gmail.com"
    );
  });

  it("should place order and empty cart", () => {
    cy.visit("http://localhost:3000/winkelkar");
    cy.get("[data-cy=winkelkar_item]").should("have.length", 1);
    cy.get("[data-cy=bestel_btn]").click();
    cy.get("[data-cy=bestelling_tabel]").should("have.length", 1);
    cy.get("[data-cy=bestelling_naam]").should("have.value", "Random Klant");
    cy.get("[data-cy=bestelling_email]").should(
      "have.value",
      "robbertnaessens@gmail.com"
    );
    cy.get("[data-cy=bestelling_adres]").type("TestStraat");
    cy.get("[data-cy=bestelling_postcode]").type("9800");
    cy.get("[data-cy=bestelling_gemeente]").type("TestGemeente");
    cy.get("[data-cy=bestelling_submit]").click();
    cy.visit("http://localhost:3000/winkelkar");
    cy.get("[data-cy=winkelkar_item]").should("have.length", 0);
  });
});

/// <reference types="cypress" />

describe("E2E tests", () => {
  it("should create an recommendation", () => {
    const recommendation = {
      name: "MONTAGE CLIMA DE FAVELA",
      youtubeLink: "https://youtu.be/SEgcMmecNJc",
    }

    cy.intercept("POST", "http://localhost:5000/recommendations").as("postRecommendation");
    
    cy.visit("http://localhost:3000");
  
    cy.get("input[placeholder='Name']").type(recommendation.name);
    cy.get("input[placeholder='https://youtu.be/...']").type(recommendation.youtubeLink);
    cy.get("button").click();


    // eslint-disable-next-line testing-library/await-async-utils
    cy.wait("@postRecommendation");
    cy.contains(recommendation.name);

    cy.intercept("POST", "http://localhost:5000/recommendations/reset").as("resetRecommendations");
    cy.request("POST", "http://localhost:5000/recommendations/reset");
    
  });

  it("should upvote an recommendation", () => {
    const recommendation = {
      name: "MONTAGE CLIMA DE FAVELA",
      youtubeLink: "https://youtu.be/SEgcMmecNJc",
    }

    cy.request("POST", "http://localhost:5000/recommendations", recommendation);
    
    cy.reload();

    cy.intercept("POST", `http://localhost:5000/recommendations/*/upvote`).as("upvoteRecommendation");
    cy.get("svg[name='arrowUp']").click();
    // eslint-disable-next-line testing-library/await-async-utils
    cy.wait("@upvoteRecommendation");

    cy.contains("1");

    cy.request("POST", "http://localhost:5000/recommendations/reset");
  });
  
  it("should downvote an recommendation", () => {
    const recommendation = {
      name: "MONTAGE CLIMA DE FAVELA",
      youtubeLink: "https://youtu.be/SEgcMmecNJc",
    }

    cy.request("POST", "http://localhost:5000/recommendations", recommendation);
    
    cy.reload();

    cy.intercept("POST", `http://localhost:5000/recommendations/*/downvote`).as("downvoteRecommendation");
    cy.get("svg[name='arrowDown']").click();
    // eslint-disable-next-line testing-library/await-async-utils
    cy.wait("@downvoteRecommendation");

    cy.contains("-1");

    cy.request("POST", "http://localhost:5000/recommendations/reset");
  });

  it("should show the top recommendations", () => {
    cy.request("POST", "http://localhost:5000/recommendations/seed");
    
    cy.reload();

    cy.contains("Top").click();
    cy.url().should("equal", "http://localhost:3000/top");

    cy.request("POST", "http://localhost:5000/recommendations/reset");
  });

  it("should show an random recommendation", () => {
    cy.request("POST", "http://localhost:5000/recommendations/seed");
    
    cy.reload();

    cy.contains("Random").click();
    cy.url().should("equal", "http://localhost:3000/random");

    cy.get("article");

    cy.request("POST", "http://localhost:5000/recommendations/reset");
  });
});
describe("GET /", () => {
    it('should gets a welcome message', () => {
        cy.request("GET", "/").then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body).to.eq("Hello world")
        })
    });
})

describe("GET /users", () => {
    it('should gets a list of users', () => {
        cy.request("GET", "/users").then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body.users).length.to.be.greaterThan(1)
        })
    });
})
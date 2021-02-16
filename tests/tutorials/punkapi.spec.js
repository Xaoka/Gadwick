const axios = require('axios');

describe("PunkAPI", () =>
{
    it("Should have options", async () =>
    {
        const response = await axios.options("https://api.punkapi.com/v2/beers")
        const methods = response.headers["access-control-allow-methods"].split(",");
        
         expect(methods).toContain("GET");
         expect(methods).toContain("HEAD");
         expect(methods).toContain("PUT");
         expect(methods).toContain("PATCH");
         expect(methods).toContain("POST");
         expect(methods).toContain("DELETE");
    })
    it("Should return a list of beers", async () =>
    {
        const response = await axios.get("https://api.punkapi.com/v2/beers");
        expect(response.data.length).toBeGreaterThan(0);
        for (const beer of response.data)
        {
            expect(beer.id).not.toBeNaN();
            expect(beer.id % 1).toBe(0);
            expect(beer.name).toMatch(/[a-zA-Z ]+/)
        }
    })
})
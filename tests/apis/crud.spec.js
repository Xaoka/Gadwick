const axios = require('axios');

const endpoint = `http://localhost:3003`;

describe('Features API', () => {
    it('Should support CRUD', async () => {
        // C
        const featureArray = await axios.post(`${endpoint}/features`, { name: "test feature", description: "A testing feature", app_id: "0" })// TODO: stats#
        const feature = featureArray.data;
        // R
        let features = await axios.get(`${endpoint}/features`);
        expect(features.data.filter((f) => f.id == feature.id).length).toBe(1); // TODO: Deep equal
        // U

        // D
        await axios.delete(`${endpoint}/features/${feature.id}`);
        features = await axios.get(`${endpoint}/features`);
        expect(features.data.filter((f) => f.id == feature.id).length).toBe(0); // TODO: Deep equal
    })
  })
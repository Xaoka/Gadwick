const axios = require('axios');
const uuidRegex = /\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/;
/** Test block generated by Gadwick */
describe(`App CRUD API`, function() {
	it(`Application management API`, async function() {
		const endpoint = `http://localhost:3003`;

		// C
		const response = await axios.post(`${endpoint}/applications`, { name: "Robot App", description: "An app made for robots", user_id: "ro-bot" })
		const applicationID = response.data.id;
		expect(applicationID).toBeDefined();
		expect(applicationID.match(uuidRegex));

		// U
		await axios.put(`${endpoint}/applications/${applicationID}`, { name: "Robot App 2" });
		const updateResponse = await axios.get(`${endpoint}/applications/${applicationID}`);
		expect(updateResponse.data.name).toBe("Robot App 2");
		// console.dir(updateResponse.data[0]);


		// D
		await axios.delete(`${endpoint}/applications/${applicationID}`);
		try
		{
			// R	
			await axios.get(`${endpoint}/applications/${applicationID}`);
		}
		catch (err)
		{
			expect(err.response.status).toBe(404);
			return;
		}
        fail(`Endpoint did not return 404 for deleted application`);
	})
})
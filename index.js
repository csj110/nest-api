const axios = require('axios');
const faker = require('faker');
const IDEA_GENERATOR = 'https://appideagenerator.com/call.php';
const IDEA_API = 'http://localhost:3000';

const randomInt = () => Math.floor(Math.random() * 10);

const generatorIdea = async () => {
	const { data } = await axios.get(IDEA_GENERATOR).catch((err) => {});
	return data.replace(/\n/g, '');
};

const generatorUser = async () => {
	const { data } = await axios
		.post(`${IDEA_API}/register`, {
			username: faker.internet.userName(),
			password: 'password'
		})
		.catch((err) => {});
	console.log(data);
	return data.token;
};

const postNewIdea = async (token) => {
	const idea = await generatorIdea().catch((err) => {});
	const { data } = await axios
		.post(
			`${IDEA_API}/api/idea`,
			{
				idea,
				desc: faker.lorem.paragraph()
			},
			{
				headers: {
					authorization: `Bearer ${token}`
				}
			}
		)
		.catch((err) => {
			console.log('add idea failed');
		});
	console.log(data);
	return idea;
};

(async () => {
	const userNum = randomInt();
	const ideaNum = randomInt();
	for (let i = 0; i < userNum; i++) {
		const token = await generatorUser().catch((err) => {});
		for (let j = 0; j < ideaNum; j++) {
			const idea = await postNewIdea(token).catch((err) => {});
		}
	}
})();

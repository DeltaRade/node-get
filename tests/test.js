const get = require('../index');
async function f() {
	let data = await get('https://www.reddit.com/r/dankmemes/hot.json', {
		method: 'GET',
	});
    data = data.json();
    let memes=data.data.children
	for (let i in memes) {
		console.log(memes[i].data.url);
	}
}
f();

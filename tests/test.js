const get = require('../index');
async function f() {
	let urls = new Map();
	let data = await get('https://www.reddit.com/r/dankmemes/hot.json');
	data = data.json();
	let memes = data.data.children;
	for (let i in memes) {
		urls.set(memes[i].data.title, memes[i].data.url);
	}
	//console.log(urls)
	return urls;
}
f();

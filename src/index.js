const http = require('http');
const https = require('https');
// (<title[^>]*>)[a-zA-Z0-9]*(<\/title[^>]*>)
//(<(title*>)(.*?)(<\/\2))|(<(title[^>]*))
class Response {
	constructor(data) {
		this.data = data;
	}
	/**
	 *
	 * @param {string} tag
	 */
	getTag(tag) {
		let regex = new RegExp(`(<(${tag}*>)(.*?)(<\/\\2))|(<(${tag}[^>]*))`);
		let match = regex.exec(this.data);
		let obj = {
			fullMatch: match[0],
			opening: match[2] ? '<' + match[2] : undefined,
			closing: match[4],
		};
		return obj;
	}
	json() {
		let data;
		try {
			data = JSON.parse(this.data);
		} catch (err) {
			data = undefined;
		}
		return data;
	}
	//getID(id){
	//	console.log(GetTagByIdUsingRegex(id,this.data))
	//}
}
/**
 *
 * @param {string} url
 * @param {method:string} options
 * @returns {Response}
 */
async function get(url, options) {
	if (url.startsWith('http:')) {
		return getHttp(url, options);
	} else {
		return getHttps(url, options);
	}
}
/**
 *
 * @param {string} url
 * @param {{method?:string}} options
 */
async function getHttp(url, options = {}) {
	return new Promise((res, rej) => {
		if (!options.method) options.method = 'GET';
		http.get(url, resp => {
			let data = '';
			resp.on('data', chunk => {
				data += chunk;
			});
			resp.on('end', () => {
				data = Buffer.from(data).toString();
				res(new Response(data));
			});
			resp.on('error', err => {
				rej(err);
			});
		});
	});
}
/**
 *
 * @param {string} url
 * @param {{method?:string}} options
 */
async function getHttps(url, options = { method: 'GET' }) {
	return new Promise((res, rej) => {
		if (!options.method) options.method = 'GET';
		https.get(url, options, resp => {
			let data = '';
			resp.on('data', chunk => {
				data += chunk;
			});
			resp.on('end', () => {
				data = Buffer.from(data).toString();
				res(new Response(data));
			});
			resp.on('error', err => {
				rej(err);
			});
		});
	});
}

async function f() {
	let data = await get('https://www.google.com', {
		method: 'GET',
	});
	console.log(data.json());
}
f();
function GetTagByIdUsingRegex(id, html) {
	return new RegExp(
		'<[a-zA-Z]*[^>]*id[\\s]?=[\\s]?[\'"]' +
			id +
			'[\'"][\\s\\S]*?</[a-zA-Z]*>'
	).exec(html);
}
//https://www.reddit.com/r/dankmemes/hot.json

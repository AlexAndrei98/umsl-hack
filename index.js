var _ = require('lodash')
var jsonfile = require('jsonfile')

jobs = {
	"Software Engineer":{
		type: 'Software Engineer',
		url: 'https://www.glassdoor.com/Salaries/new-york-city-software-engineer-salary-SRCH_IL.0,13_IM615_KO14,31.htm'
	},
	"Entry-Level Software Engineer": {
		type: 'Entry-Level Software Engineer',
		url: 'https://www.glassdoor.com/Salaries/new-jersey-entry-level-software-engineer-salary-SRCH_IL.0,10_IS39_KO11,40.htm'
	},
	"Accountant":{
		type: 'Accountant',
		url: 'https://www.glassdoor.com/Salaries/austin-accountant-salary-SRCH_IL.0,6_IM60_KO7,17.htm'
	},
	"Pharmacist": {
		type: 'Pharmacist',
		url: 'https://www.glassdoor.com/Salaries/columbus-pharmacist-salary-SRCH_IL.0,8_IM196_KO9,19.htm'
	},
	"Data Scientist": {
		type: "Data Scientist",
		url: "https://www.glassdoor.com/Salaries/st-louis-data-scientist-salary-SRCH_IL.0,8_IM823_KO9,23.htm"
	}
}
cities= [	'New York',
			'Portland',
			'Los Angeles',
			'Denver',
			'Chicago',
			'Philadelphia',
			'Phoenix',
			'Las Vegas',
			'San Diego',
			'Jacksonville',
			'San Francisco',
			'Austin',
			'Detroit',
			'Columbus',
			'Memphis',
			'Charlotte',
			'Boston',
			'Seattle',
			'Baltimore',
			'Denver',
			'Washington DC',
			'Nashville']
let salaries = { 	etse: [],	//Entry-Level Software Engineer
					se: [],		//Entry-Level Software Enginee
					ac:[],		//Accountan
					ph:[],		//Pharmacist
					dt:[] 		//Data Scientist
				}
readCitySalary = (city,job, jobArray) => {
	return new Promise (resolve => {
		var Browser = require("zombie");
		var user_agent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_3) AppleWebKit/535.20 (KHTML, like Gecko) Chrome/19.0.1036.7 Safari/535.20';
		var browser = new Browser({userAgent: user_agent, debug: true, waitFor: 10000});
		const cheerio = require('cheerio')

		var url = 'https://www.glassdoor.com/findPopularLocationAjax.htm?term='+city+'&maxLocationsToReturn=10';
		let salaries={}
		browser.visit(url, function() {
			const str = browser.html()
			const data = str.substring(str.indexOf("realId"), str.indexOf("}"))
			var realId = data.substring(data.indexOf(":")+1,data.length)	
			const job_obj= _.find(jobs, {type:job})
			var url1 = job_obj.url
			console.log(city)
				browser.visit(url1, function() {
				browser.fill('locId', realId).
						fill('locT', 'C').
							pressButton('#HeroSearchButton', function() {
							const $ = cheerio.load(browser.html())
							let salary = $('.OccMedianBasePayStyle__payNumber').text()
							salary = salary.substring(1,salary.length)
							salary = salary.substring(0,salary.indexOf(',')) + salary.substring(salary.indexOf(',')+1, salary.length)
							const cityObj = { city: city, salary: parseInt(salary)}
							resolve(cityObj)
							
						});

				});

		});

	})
}

const readAllCities = async (salaries) => {
	for(let i =0 ; i < cities.length; i++){
		const city = await readCitySalary(cities[i], "Entry-Level Software Engineer")
		salaries.etse.push(city)
	}
	for(let i =0 ; i < cities.length; i++){
		const city = await readCitySalary(cities[i], "Software Engineer")
		salaries.se.push(city)
	}
	for(let i =0 ; i < cities.length; i++){
		const city = await readCitySalary(cities[i], "Accountant")
		salaries.ac.push(city)
	}
	for(let i =0 ; i < cities.length; i++){
		const city = await readCitySalary(cities[i], "Pharmacist")
		salaries.ph.push(city)
	}
	for(let i =0 ; i < cities.length; i++){
		const city = await readCitySalary(cities[i], "Data Scientist")
		salaries.dt.push(city)
	}
}


readAllCities(salaries).then(() => {
	var myJsonString = JSON.stringify(salaries);
	console.log(myJsonString)
})

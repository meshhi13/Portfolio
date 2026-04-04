const fs = require('fs');
const pdf = require('pdf-parse');

async function extract() {
    try {
        let dataBuffer = fs.readFileSync('/Users/himeshahuja/Desktop/Career/Current/Himesh-Ahuja-Resume.pdf');
        const data = await pdf(dataBuffer);
        console.log(data.text);
    } catch (err) {
        console.error(err);
    }
}

extract();

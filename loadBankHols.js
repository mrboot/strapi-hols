require('dotenv').config()

const fetch = require('node-fetch');

const BANK_HOL_API_URL = `${process.env.API_URL}/bank-holidays`

async function addBankHols() {
  console.log('Fetching Bank Hols...')
  const response = await fetch('https://www.gov.uk/bank-holidays.json')
  const data = await response.json();
  const bankHoldData = data['england-and-wales'].events;
  bankHoldData.forEach(async(bankHol) => {
    const { title, date, notes } = bankHol
    const res = await fetch(`${BANK_HOL_API_URL}?date=${date}`)
    const bankHolExists = await res.json()
    if (bankHolExists.length === 0) {
      // console.log(`Adding ${title}, ${date}, ${notes} to the database`)
      const bankHolAdd = {title, date, notes}
      const res = await fetch(`${BANK_HOL_API_URL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(bankHolAdd)
      });
      const addRes = await res.json()
      const { title: titleConf, date: dateConf, notes: notesConf } = addRes
      console.log(`Added ${titleConf}, ${dateConf}, ${notesConf} to the database`)
    }
  })
}

addBankHols()

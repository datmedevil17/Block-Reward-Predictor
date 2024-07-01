const express = require("express")
const axios = require('axios')
const {ethers} = require('ethers')

const app = express()
const createCsvWriter = require('csv-writer').createObjectCsvWriter;


const exportToCsv = (listOfBlocks)=>{
const csvWriter = createCsvWriter({
    path: 'blockData.csv',
    header: [
        {id: 'timeStamp', title: 'timeStamp'},
        {id: 'blockReward', title: 'blockReward'}
    ]
});
 

 
csvWriter.writeRecords(listOfBlocks)       // returns a promise
    .then(() => {
        console.log('Csv created Successfully');
    });
}

require('dotenv').config()
class Block{
    constructor(timeStamp, blockReward){
        this.timeStamp=timeStamp;
        this.blockReward=blockReward;
    }
}

const fetchData = async ()=> {
    const listOfBlocks = [];
    try {
        for(let blockNumber = 17469523; blockNumber<17469923; blockNumber++){
            const apiUrl = `https://api.etherscan.io/api?module=block&action=getblockreward&blockno=${blockNumber}&apikey=${process.env.API_KEY}`
            const response = await axios.get(apiUrl)
            const reward = ethers.formatEther(response.data.result.blockReward)
            const time = response.data.result.timeStamp
            const block = new Block(time, reward)
            listOfBlocks.push(block)
        
    }
    console.log(listOfBlocks)
    exportToCsv(listOfBlocks)
}
    catch (error) {
        console.log(error)        
    }

}
fetchData()


app.listen(3000,()=>{
    console.log("Server is running on port 3000");
})

# Service Example

A brief description of what this project does and who it's for

This folder is broken up into:

- `../config`: contains environment variables, database, and sql files
- `../routers`: contains the routers of the service's api
- `../schemas`: contains the schemas for your data
- `../services`: contains the business logic of your service
- `../tests`: contains both the unit tests and integration tests
- `../util`: contains helper classes for handling responses 

## Environment Variables

To run this project, you will need to add the following environment variables to your config/.env file

`SERVICE_NAME`

`SERVICE_PORT`

`DB_HOST`

`DB_NAME`

`DB_USER`

`DB_PASSWORD`

## Dockerfile

You will also need to change your port number, to the one you have in your env file


# Function to get MMRs
```javascript
(function(){const rankNumber={'Bronze I':1,'Bronze II':2,'Bronze III':3,'Silver I':4,'Silver II':5,'Silver III':6,'Gold I':7,'Gold II':8,'Gold III':9,'Platinum I':10,'Platinum II':11,'Platinum III':12,'Diamond I':13,'Diamond II':14,'Diamond III':15,'Champion I':16,'Champion II':17,'Champion III':18,'Grand Champion I':19,'Grand Champion II':20,'Grand Champion III':21,'Supersonic Legend':22}
function extractMMR(element){const gameMode=element.querySelector("h2").textContent.replace("'s Skill Distribution","");const rankItems=element.querySelectorAll("item:has(img)");const distributions={};const rankRegex=/(?<=\b)(.*?)(?=\s*Division)/g;const divisionRegex=/Division\s+(IV|III|II|I)\s*([\d-]+)\s*to\s*([\d-]+)/g;rankItems.forEach(rank=>{const text=rank.textContent;const divisions={};let rankName;if(text.search("Supersonic")===0){rankName="Supersonic Legend"
divisions["1"]={name:"Division 1",start:parseInt(text.match(/\d+/)[0],10),end:null}
distributions[rankNumber[rankName]]={name:rankName,divisions}
return}else{rankName=text.match(rankRegex)[0]}
let divisionMatch=divisionRegex.exec(text);let numberOfDivisions=4;while(numberOfDivisions>0){divisions[numberOfDivisions--]={name:`Division ${divisionMatch[1]}`,start:parseInt(divisionMatch[2],10),end:parseInt(divisionMatch[3],10)};divisionMatch=divisionRegex.exec(text)}
distributions[rankNumber[rankName]]={name:rankName,divisions}})
return{[gameMode]:distributions}}
const mmrs=Array.from(document.querySelectorAll("#distribution > div.center > div")).reduce((acc,ele)=>{return{...acc,...extractMMR(ele)}},{});const mmrsJson=JSON.stringify(mmrs,null,2);const blob=new Blob([mmrsJson],{type:"application/json"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="mmrs.json";a.click();URL.revokeObjectURL(url)})()
```
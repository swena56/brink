var Client = require('node-rest-client').Client;
client = new Client();
// Provide user credentials, which will be used to log in to Jira.
//https://docs.atlassian.com/software/jira/docs/api/REST/latest

let project='PIT';
let ticket = 'PIT-411';
let writeComment = false;


function getAuthenticationHeaders(username,password){

    var loginArgs = {
        data: {"username": username, "password": password, }, 
        headers: {
            "Content-Type": "application/json"
        }
    };

    return new Promise(function(resolve, reject) {
        client.post("https://code.bestbuy.com/jira/rest/auth/1/session", loginArgs, function(data, response) {
            if (response.statusCode == 200) {
                console.log('succesfully logged in, session:', data.session);
                var session = data.session;
                resolve({
                    headers: {
                        cookie: session.name + '=' + session.value,
                        "Content-Type": "application/json"
                    },
                    data: {}
                });

            } else {
                reject("Login failed :(");
            }
        });
    });}

getAuthenticationHeaders("Andrew.Swenson","#Wn6QcDR7L").then((o)=> {

    console.log(o);
});

function createTicket(){

    let project_id = "10000";
    let summary = "something's wrong";
    let description = "description";

    let ticket_args = {
   
        "fields": {
            "project": {"id": project_id }, 
            "summary": summary,
            "issuetype": {
                "id": "10000"
            },
            "assignee": {
                "name": "homer"
            },
            "reporter": {
                "name": "smithers"
            },
            "priority": {
                "id": "20000"
            },
            "timetracking": {
                "originalEstimate": "10",
                "remainingEstimate": "5"
            },
            "security": {
                "id": "10000"
            },
            "versions": [
                {
                    "id": "10000"
                }
            ],
            "environment": "environment",
            "description": description,
            "components": [
                {
                    "id": "10000"
                }
            ],
            "customfield_30000": [
                "10000",
                "10002"
            ],
            "customfield_80000": {
                "value": "red"
            },
            "customfield_20000": "06/Jul/11 3:25 PM",
            "customfield_40000": "this is a text field",
            "customfield_70000": [
                "jira-administrators",
                "jira-software-users"
            ],
            "customfield_60000": "jira-software-users",
            "customfield_50000": "this is a text area. big text.",
            "customfield_10000": "09/Jun/81"
        }
    };

    client.post("https://code.bestbuy.com/jira/rest/api/2/issue/createmeta", ticket_args, function(searchResult, response) {
     });
}

function search(){
    // Make the request return the search results, passing the header information including the cookie.
        client.post("https://code.bestbuy.com/jira/rest/api/2/search", searchArgs, function(searchResult, response) {
            console.log('status code:', response.statusCode);

            let issues = searchResult.issues;

            if( issues.length ){
                let id = issues[0].id;
                let data = issues[0].fields;
                console.log(id);
                console.log('search result:', issues[0].key,data.issuetype.name,data.reporter.name,data.description);
                console.log(data.summary);
                console.log(data.priority.name);
                console.log(data.status.statusCategory.name)
                console.log(data.creator.name)

                if( writeComment ){
                    let message = searchArgs;

                    searchArgs.data = {
                        body: require('./parse-xml')
                    };

                    console.log(searchArgs);
                    return;
                    client.post(`https://code.bestbuy.com/jira/rest/api/2/issue/${id}/comment`, message, function(searchResult, response) {
                        console.log('status code:', response.statusCode);
                        console.log('search result:', searchResult);
                    });
                }
            }
            //assignee
        });
}

//update dashboard

//post comment

const express = require('express');
const axios = require("axios");
const schedule = require("node-schedule");
var router = express.Router();
var ip = require("ip");

module.exports = function (Common, oauth, log) {

    router.get('/search', [], async function (request, response, next) {
        try {
            let result = await Common.getAllItem(request.params);
            response.send(result);
        } catch (err) {
            console.log(' Error in router : ', err);
            log.dbErrorLog("Itemmaster-getAllItem", err);
        }
    });

    router.post('/new-message', [], async function (req, res, next) {
        try {


//            console.log("req", req.body);
            const message = req.body.message;

//            console.log("message", message);

            let text = message;

            //Each message contains "text" and a "chat" object, which has an "id" which is the chat id

            if (!message || typeof message.chat === "undefined") {
                text = "Can't get it, Please try again!!";
            } else {
                if (typeof message.text === "undefined") {
                    text = "Can't get it, Please try again!!";
                } else {

                    let sMsgText = message.text;

                    let res1 = sMsgText.match(/\$[a-zA-Z\d\-\/]{1,}\$/gm);

                    let company_today_dsi = sMsgText.match(/\/company_today_dsi/gm);

                    if (company_today_dsi !== null) {
                        const param1 = sMsgText.split(' ')[1];
                        const param2 = sMsgText.split(' ')[2];
                        // 'msg' is the received Message from Telegram
                        // 'match' is the result of executing the regexp above on the text content
                        // of the message

                        if (param1 === undefined || param2 === undefined) {
                            axios.post(
                                "https://api.telegram.org/bot1722900443:AAHIJVT5hgwDqR4XuW6NlmBRCt3isKgGZoE/sendMessage",
                                {
                                    chat_id: message.chat.id,
                                    text: "Please provide a valid inputs!"
                                }
                            ).then((response) => {
                                // We get here if the message was successfully posted
                                console.log("Message posted");
                                res.end("ok");
                            })
                            .catch((err) => {
                                // ...and here if it was not
                                console.log("Error :", err);
                                res.end("Error :" + err);
                            });
                            return;
                        }

                        axios.post(
                        "https://api.telegram.org/bot1722900443:AAHIJVT5hgwDqR4XuW6NlmBRCt3isKgGZoE/sendMessage",
                            {
                                chat_id: message.chat.id,
                                text: `${param2} ${param1}: 5`
                            }
                        ).then((response) => {
                            // We get here if the message was successfully posted
                            console.log("Message posted");
                            res.end("ok");
                        })
                        .catch((err) => {
                            // ...and here if it was not
                            console.log("Error :", err);
                            res.end("Error :" + err);
                        });
                    } else if (res1 !== null) {
                        let aMsgText = res1[0].split("-");

                        let oMsg = {
                            group: (typeof aMsgText[0] !== "undefined") ? aMsgText[0].replace('$', '') : "NA",
                            name: (typeof aMsgText[1] !== "undefined") ? aMsgText[1] : "NA",
                            company: (typeof aMsgText[2] !== "undefined") ? aMsgText[2] : "NA",
                            date: (typeof aMsgText[3] !== "undefined") ? aMsgText[3] : "NA",
                            members: (typeof aMsgText[4] !== "undefined") ? aMsgText[4].replace('$', '') : "NA",
                            chat_id: message.chat.id,
                            message: sMsgText
                        };

//                        let rows = await Common.save(oMsg);
                        
//                        let result = JSON.parse(JSON.stringify(rows))[2][0];
//                        response.status(200).send(result);

//                        console.log(result);
                        
//                        text = result;
                        if (typeof text !== "undefined" || text !== null) {
                            axios.post(
                                "https://api.telegram.org/bot1722900443:AAHIJVT5hgwDqR4XuW6NlmBRCt3isKgGZoE/sendMessage",
                                {
                                    chat_id: message.chat.id,
                                    text: oMsg
                                }
                            ).then((response) => {
                                // We get here if the message was successfully posted
                                console.log("Message posted");
                                res.end("ok");
                            })
                            .catch((err) => {
                                // ...and here if it was not
                                console.log("Error :", err);
                                res.end("Error :" + err);
                            });
                        }
                        
//                        let todaysTotalDsi = await Common.getTodaysTotalDsi();
//                        let oTodaysTotalDsi = JSON.parse(JSON.stringify(todaysTotalDsi[0]));
                        
//                        let todaysGroupwiseTotalDsi = await Common.getTodaysGroupwiseTotalDsi();
//                        let oTodaysGroupwiseTotalDsi = JSON.parse(JSON.stringify(todaysGroupwiseTotalDsi[0]));

//                        console.log(oTodaysTotalDsi);
//                        console.log(oTodaysGroupwiseTotalDsi);
                        
                        
//                        text += oTodaysTotalDsi;
                        
//                        text += oTodaysGroupwiseTotalDsi;

                    }

                }

            }

            // If we've gotten this far, it means that we have received a message containing the word "marco".
            // Respond by hitting the telegram bot API and responding to the appropriate chat_id with the word "Polo!!"
            // Remember to use your own API toked instead of the one below  "https://api.telegram.org/bot<your_api_token>/sendMessage"

//            schedule.scheduleJob("*/5 * * * * *", function(fireDate){
                
//                if (typeof text !== "undefined" || text !== null) {
//                    axios.post(
//                        "https://api.telegram.org/bot1722900443:AAHIJVT5hgwDqR4XuW6NlmBRCt3isKgGZoE/sendMessage",
//                        {
//                            chat_id: message.chat.id,
//                            text: text
//                        }
//                    ).then((response) => {
//                        // We get here if the message was successfully posted
//                        console.log("Message posted");
//                        res.end("ok");
//                    })
//                    .catch((err) => {
//                        // ...and here if it was not
//                        console.log("Error :", err);
//                        res.end("Error :" + err);
//                    });
//                }
            
//            });


        } catch (err) {
            console.log(' Error in router : ', err);
            log.dbErrorLog("Common-sendEmail", err);
        }
    });


    return router;
}


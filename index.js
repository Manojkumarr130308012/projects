const express = require("express");
require("dotenv").config();
const port = 8001 || process.env.PORT;
const cors = require("cors");
const app = express();
const proxy = require("express-http-proxy");
const paths = require("./config");
const fs = require('fs');
const axios = require('axios');
const { config } = require("dotenv");
const admin = require('firebase-admin');
var serviceAccount = require("./admin.json");
const querystring = require('querystring');


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://letschat-f9f77.firebaseio.com",
});

var storage = admin.storage();

const bucket = storage.bucket('gs://letschat-f9f77.appspot.com');




let jsonData;
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false }));

paths.forEach((element) => {
  app.use(`/api/${element.service}`, proxy(`${element.host}`));
});



const middleware = require('./middleware/middleware');
const { Console } = require("console");
const { forEach } = require("async");
app.use(middleware);


app.get("/get", async (req, res) => {
  res.json({ state: "sucesss" })
});

app.post("/producth/:service_id", async (req, res) => {
  const file = bucket.file('app_settings.json');

  file.download()
    .then((data) => {
      const jsonContent = JSON.parse(data[0].toString());    
      if (req.body != null) {
        let body = req.body;
        let client_id = req.headers.client_id;
        removeValues(body, [client_id])
        let filtered = jsonContent[client_id];

        console.log("filtered", filtered);
        const serviceId = req.params.service_id;
        console.log(serviceId);
        let fieldFilter = filtered.filter(data => data?.service == serviceId && data?.method == req.method);
        let requiredFieldFilter;
        let requiredService;
        console.log("fieldFilter", fieldFilter);

       let serviceUrl = paths.find(ser => ser.service == serviceId && ser.method == req.method);

          requiredFieldFilter = fieldFilter[0].fields.filter(f => f.required === true && (body[f.field] == null || body[f.field] == ""));
          requiredService = fieldFilter[0]?.service;

          if(requiredFieldFilter?.length == 0){
            const headers = {
             'Content-Type': 'application/json',
           };
           req.body.client_id = client_id;
           if(serviceUrl.service == requiredService){
             axios.post(serviceUrl.host,req.body,{headers})
             .then(response => {
               // Handle the response from the API
               res.json({data: response.data })
             })
             .catch(error => {
               // Handle errors
               res.json({state:"Failure",data:  error.message})
             });
           }
           }else{
             res.json({state:"Failure",data: requiredFieldFilter})
           }
        // }

       
      }
    })
    .catch((error) => {
      res.send(error);
    });
  //     console.error("Error reading the file:", err);
  //   }
  //   if (req.body != null) {
  //     let body = req.body;
  //     let merchant_name = req.body.merchant_name;
  //     let business_name = req.body.business_name;
  //     let bodylen = Object.keys(req.body).length;
  //     removeValues(body,[merchant_name,business_name])
  //     let filtered = JSON.parse(data)[business_name].filter(item => item[merchant_name])[0];
  //     let fieldFilter = filtered[merchant_name].filter(data => data.fields.length === Object.keys(body).length)
  //     let requiredFieldFilter = fieldFilter[0]?.fields?.filter(f => f.req === true && (body[f.field] == null || body[f.field] == ""));
  //     let requiredService = fieldFilter[0]?.service;

  //     if(requiredFieldFilter?.length == 0){

  //       console.log(paths.find(ser => ser.service == requiredService))

  //      let serviceUrl = paths.find(ser => ser.service == requiredService);

  //      console.log(req.body)

  //      const headers = {
  //       'Content-Type': 'application/json',
  //       // Add other headers if needed
  //     };

  //     if(serviceUrl.service == requiredService){
  //       axios.post(serviceUrl.host,req.body,{headers})
  //       .then(response => {
  //         // Handle the response from the API
  //         res.json({data: response.data })
  //       })
  //       .catch(error => {
  //         // Handle errors
  //         res.json({state:"Failure",data:  error.message})
  //       });
  //     }
  //     }else{
  //       res.json({state:"Failure",data: requiredFieldFilter})
  //     }
  //    }
  // });

});

app.get("/producth/:service_id", async (req, res) => {


  const serviceId = req.params.service_id;
  console.log(serviceId);
  console.log("path",req.method);
  console.log("path",req.query);
  
 let serviceUrl = paths.find(ser => ser.service == serviceId && ser.method == req.method);

 const Querystring = Object.fromEntries(
  Object.entries(req.query).map(([key, value]) => [key, value.replace(/^"(.*)"$/, '$1')])
);

 console.log("serviceUrl",serviceUrl.host+"?"+querystring.stringify(Querystring))

 const headers = {
  'Content-Type': 'application/json',
};


 axios.get(serviceUrl.host+"?"+querystring.stringify(Querystring),req.body,{headers})
         .then(response => {
           // Handle the response from the API
     
           if(response.data != ""){
            res.json({data: [response.data] })
           }else{
            res.json({Data:"No Data"})

           }
         })
         .catch(error => {
           // Handle errors
           res.json({state:"Failure",data:  error.message})
         });

});

app.put("/producth/:service_id", async (req, res) => {


  const serviceId = req.params.service_id;

  console.log("serviceId",""+serviceId);
  console.log("req.method",""+req.method);
  console.log("Query",""+req.query);


 let serviceUrl = paths.find(ser => ser.service == serviceId && ser.method == req.method);


 const Querystring = Object.fromEntries(
  Object.entries(req.query).map(([key, value]) => [key, value.replace(/^"(.*)"$/, '$1')])
);

console.log(serviceUrl.host+"?"+querystring.stringify(Querystring));

 const headers = {
  'Content-Type': 'application/json',
};

 axios.put(serviceUrl.host+"/"+Querystring._id,req.body,{headers})
         .then(response => {
           // Handle the response from the API
     
           if(response.data != ""){
            res.json({data: [response.data] })
           }else{
            res.json({Data:"No Data"})

           }
         })
         .catch(error => {
           // Handle errors
           res.json({state:"Failure",data:  error.message})
         });

});

app.delete("/producth/:service_id", async (req, res) => {
  const serviceId = req.params.service_id;  
 let serviceUrl = paths.find(ser => ser.service == serviceId && ser.method == req.method);
 
 const Querystring = Object.fromEntries(
  Object.entries(req.query).map(([key, value]) => [key, value.replace(/^"(.*)"$/, '$1')])
);


 const headers = {
  'Content-Type': 'application/json',
};


 axios.delete(serviceUrl.host+"/"+Querystring._id,req.body,{headers})
         .then(response => {
           // Handle the response from the API
           if(response.data != ""){
            res.json({data: [response.data] })
           }else{
            res.json({Data:"No Data"})

           }
         })
         .catch(error => {
           // Handle errors
           res.json({state:"Failure",data:  error.message})
         });
});

app.post("/product/firebase/write1", async (req, res) => {
  const file = bucket.file('app_settings.json');

  file.download()
    .then((data) => {
      let combinedJson;
      if (data.toString()) {
        const jsonContent = JSON.parse(data[0].toString());
        if (!jsonContent) {
          combinedJson = req.body;
        } else {
          combinedJson = { ...jsonContent, ...req.body };
        }
        console.log('JSON Content:', combinedJson);

        const jsonString = JSON.stringify(combinedJson, null, 2); // The '2' argument adds indentation for better readability

        file.save(jsonString)
          .then(() => {
            res.send("JSON file saved to Firebase Storage.")
          })
          .catch((error) => {
            res.send(error)
          });
      } else {
        combinedJson = req.body;
       file.save(JSON.stringify(combinedJson))
          .then(() => {
            res.send("JSON file saved to Firebase Storage.")
          })
          .catch((error) => {
            console.log("error", error)

            res.send(error)
          });
      }

    })
    .catch((error) => {
      res.send(error)
    });

});

app.post("/product/firebase/read1", async (req, res) => {
  const file = bucket.file('app_settings.json');

  file.download()
    .then((data) => {
      const jsonContent = JSON.parse(data[0].toString()); 
      console.log(jsonContent)
      res.send(jsonContent)
    })
    .catch((error) => {
       res.send(error)
    });
});



app.post("/producth/write", async (req, res) => {
  const filePath = "./app_settings.json";

  fs.readFile(filePath, "utf-8", async (err, data) => {
    if (err) {
      console.error("Error reading the file:", err);
    }

    let combinedJson;
    console.log("null", data);

    if (!data) {
      console.log("null", data);
      combinedJson = req.body;
    } else {
      combinedJson = { ...JSON.parse(data), ...req.body };
    }

    console.log("combinedJson", combinedJson);

    const jsonString = JSON.stringify(combinedJson, null, 2); // The '2' argument adds indentation for better readability


    fs.writeFile(filePath, jsonString, async (err, data) => {
      if (err) {
        console.error("Error reading the file:", err);
      }
      else {
        console.log('JSON data written to file successfully.');
      }
    });

  });

});


app.post("/producth/read", async (req, res) => {
  const filePath = "./app_settings.json";

  fs.readFile(filePath, "utf-8", async (err, data) => {
    if (err) {
      console.error("Error reading the file:", err);
    } else {
      console.error("success", data);

    }
  });

});


app.post("/product/firebase/update", async (req, res) => {
  const file = bucket.file('app_settings.json');
  let client_id;
  client_id = req.headers.client_id;
  file.download()
    .then((data) => {
      let combinedJson;
      if (data.toString()) {
        const jsonContent = JSON.parse(data[0].toString());
        let filtered = jsonContent[client_id];
        console.log("method",req.body.method);
        console.log("service",req.body.service);

        const objecttoremove = filtered.find(entry => entry.method === req.body.method && entry.service === req.body.service);
        console.log("service",objecttoremove);

    if (objecttoremove) {
      // Edit the fields object for the specified method
      const updatedArray = filtered.filter(obj => obj !== objecttoremove);
      updatedArray.push(req.body);
      let jsonData ={[client_id]:updatedArray}
      console.log("updatedArray",jsonData);
      const jsonString = JSON.stringify(jsonData, null, 2); // The '2' argument adds indentation for better readability
      file.save(jsonString)
        .then(() => {
          res.send("JSON file saved to Firebase Storage.")
        })
        .catch((error) => {
          res.send(error)
        });
      
    } else {
      console.error(`Method not found for service ID`);
    }
      }});

});


function removeValues(obj, valuesToRemove) {
  // Recursively remove values from the object
  const removeFields = (obj) => {
    for (const key in obj) {
      if (typeof obj[key] === 'object') {
        removeFields(obj[key]);
      } else if (valuesToRemove.includes(obj[key])) {
        delete obj[key];
      }
    }
  };

  removeFields(obj);
}


app.listen(port, () => console.log(`App listening on port ${port}!`));

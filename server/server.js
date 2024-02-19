const http = require('http');
const url = require('url');
var fs = require('fs');
const formidable = require('formidable');

const server = http.createServer();

server.on('request', (request, response) => {
    request.on('error', (err) => {
      console.error('request error');
    });
    response.on('error', (err) => {
      console.error('response error');
    });
    const parsedUrl = url.parse(request.url, true);
    console.log(request.method);
    if (request.method === 'GET' && parsedUrl.pathname === '/') {
      var html = fs.readFileSync('./index.html', 'utf8')
      response.statusCode = 200;
      response.write(html);
      response.end();
    } else if (request.method === 'GET' && parsedUrl.pathname === '/show') {
      const showrequest = http.get(
        'http://'+process.env.BE_HOST+':'+process.env.BE_PORT+'/demo/all',
        (res) => {
          console.log(res.statusCode);
          if ( res.statusCode === 200 ){
            res.on('data', (chunk) => {
              response.statusCode = 200;
              const users = JSON.parse(chunk.toString());
              var prepareUsers ="<table style=\"float:left;background-color:#00FF00;border:1px solid black\"><tr><th>ID</th><th>Name</th><th>Email</th></tr>"
              for(i = 0; i < users.length; i++) {
                prepareUsers = prepareUsers+"<tr><td>"+users[i].id.toString()+"</td><td>"+users[i].name.toString()+"</td><td>"+users[i].email.toString()+"</th></tr>";
              }
              prepareUsers = prepareUsers+"</table>"
              response.write(prepareUsers);
              response.end();
            });
          }
          else{
            console.log("please check server is running or not");
          }
        }
      );
      showrequest.on('error', (err) => {
        response.write("server is not able to get the users");
        response.end();
      });
      showrequest.end();
    }
    else if (request.method === 'GET' && parsedUrl.pathname === '/add') {
      var html = fs.readFileSync('./add.html', 'utf8')
      response.statusCode = 200;
      response.write(html);
      response.end();
    }
    else if (request.method === 'POST' && parsedUrl.pathname === '/insert') {
      const form = new formidable.IncomingForm();
      var paylod={};
      var data="";
      const options = {
        hostname: process.env.BE_HOST,
        port: process.env.BE_PORT,
        path: '/demo/add',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      };
      form.parse(request)
      .on('end', (name, value) => {
        const addrequest = http.request(
          options,
          (response) => {
            response.on('data', (chunk) => {
              data=chunk.toString();
              console.log(chunk.toString());
            });
            response.on('end', () => {});
          }
        );
        addrequest.write(JSON.stringify(paylod));
        console.log('Done - request fully received!');
        response.end('Success! and '+data);
        addrequest.end();
      })
      .on('field', (name, value) => {
        paylod[name] = value;
      })
      .on('error', (err) => {
        console.error(err);
        request.resume();
      })
      .on('aborted', () => {
        console.error('Request aborted by the user!');
      });
    }
    else if (request.method === 'GET' && parsedUrl.pathname === '/delete') {
      const showrequest = http.get(
        'http://'+process.env.BE_HOST+':'+process.env.BE_PORT+'/demo/all',
        (res) => {
          if ( res.statusCode === 200 ){
            res.on('data', (chunk) => {
              response.statusCode = 200;
              const users = JSON.parse(chunk.toString());
              var prepareIds ="<html><body><form action=\"/deleteid\" enctype=\"multipart/form-data\" method=\"delete\"><label for=\"userid\">Select UserId:</label>&nbsp&nbsp&nbsp<select name=\"userid\" id=\"userid\">"
              for(i = 0; i < users.length; i++) {
                prepareIds = prepareIds+"<option value=\""+users[i].id.toString()+"\">"+users[i].id.toString()+"</option>";
              }
              prepareIds = prepareIds+"</select>&nbsp&nbsp&nbsp<input type=\"submit\" value=\"Delete\"></form></body></html>"
              response.write(prepareIds);
              response.end();
            });
          }
          else{
            console.log("please check server is running or not");
          }
        }
      );
      showrequest.on('error', (err) => {
        response.write("server is not able to get the users");
        response.end();
      });
      showrequest.end();
    }
    else if (request.method === 'GET' && parsedUrl.pathname === '/deleteid') {
      const { userid } = parsedUrl.query;
      console.log(userid);
      const form = new formidable.IncomingForm();
      var paylod={};
      var data="";
      const options = {
        hostname: process.env.BE_HOST,
        port: process.env.BE_PORT,
        path: '/demo/deleteuser/'+userid,
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      };
      form.parse(request)
      .on('end', (name, value) => {
        const deleterequest = http.request(
          options,
          (response) => {
            response.on('data', (chunk) => {
              data=chunk.toString();
              console.log(chunk.toString());
            });
            response.on('end', () => {});
          }
        );
        response.end('Successfully deleted the user');
        deleterequest.end();
      })
      .on('field', (name, value) => {
        console.log(name, value);
      })
      .on('error', (err) => {
        console.error(err);
        request.resume();
      })
      .on('aborted', () => {
        console.error('Request aborted by the user!');
      });
    }
});
  
server.listen(8083);
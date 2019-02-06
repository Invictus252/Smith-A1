var http = require('http');
var server = http.createServer(requestHandler); 
server.listen(process.env.PORT, process.env.IP, startHandler);

function startHandler()
{
  var addr = server.address();
  console.log("Server listening at", addr.address + ":" + addr.port);
}

function requestHandler(req, res) 
{
    var url = require('url');
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    
    res.writeHead(200, {'Content-Type': 'text/html'});

    if (query['cmd'] == 'repeat')
    {
      console.log("Handling a 'repeat' request");
      console.log(query);
      var len = 0;
      if(query['word'])
      {
        len += query['word'].length;
      }
      for (var i = 0; i < len; i++) { 
        res.write('<pre>'+query['word']+'</pre>');
      }
      res.end('');
    }
    else if(query['cmd'] == 'dotted')
    {
      console.log("Handling a 'dotted' request");
      console.log(query);
      var dString = [query['word1'],"",query['word2']];
      var numOfDot =30;
      numOfDot -= (query['word1'].length + query['word2'].length)
      for(var i = 1;i <= numOfDot;i++)
      {
        dString[1] += ".";
      }
      res.write('<pre>'+dString[0]+dString[1]+dString[2]+'</pre>');      
      res.end('');      
    }
    else if(query['cmd'] == 'stats')
    {
      console.log("Handling a 'stats' request");
      console.log(query);
      var stats = [];
      var avg = 0;
      for(var j in query['grades'])
      {
        stats.push(query['grades'][j]);
      }
      stats.sort(function(a, b){return a - b});
      console.log("stats aft sort() -> " + stats);
      for(var k =0;k<stats.length;k++)
      {
        avg += parseInt(query['grades'][k]);
      }
      console.log("avg b4 / -> " + avg);
      avg = avg/stats.length;
      console.log("avg aft / -> "+ avg);
      res.write('<pre> Avg: '+avg+' Min: '+stats[0]+' Max: '+stats[stats.length-1]+'</pre>');      
      res.end('');      
    }    
    else
    {
      res.end('');
    }
}    
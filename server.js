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
  try
  {
    var url = require('url');
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query ;
    
    res.writeHead(200, {'Content-Type': 'text/html'});

    var result = {};
    if (query['cmd'] == 'repeat')
    {
      result = repeat(query,res);
    }
    else if(query['cmd'] == 'dotted')
    {
      result = dotted(query,res);
    }
    else if(query['cmd'] == 'stats')
    {
      result = stats(query,res); 
    }    
    else if((query['cmd'] != ('stats'||'dotted'||'repeat'))&&(query['cmd']!=undefined))
    {
      throw Error("Invalid command: " + query['cmd']);
    }
    else 
    {
      throw Error("No command entered");
    }
  }
  catch (e)
  {
    var error = "ERROR : " +  e.message;
    res.write(error);
    res.end('');
  }    
}

function stats(query,res){
      console.log("Handling a 'stats' request");
      console.log(query);
      var stats = [];
      var avg = 0;
      for(var j in query['grades'])
      {
        stats.push(query['grades'][j]);
      }
      stats.sort(function(a, b){return a - b});
      //console.log("stats aft sort() -> " + stats);
      for(var k =0;k<stats.length;k++)
      {
        if(!parseInt(query['grades'][k]))
        {
          throw Error("No int found @ entry : " + (k+1));
        }
        avg += parseInt(query['grades'][k]);
      }
      //console.log("avg b4 / -> " + avg);
      avg = avg/stats.length;
      //console.log("avg aft / -> "+ avg);
      res.write('<pre> Avg: '+avg+' Min: '+stats[0]+' Max: '+stats[stats.length-1]+'</pre>');      
      res.end(''); 
}

function dotted(query,res){
      if (query['word1'] == undefined || query['word2'] == undefined)  
        throw Error("Need to enter two words ");  
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

function repeat(query,res){
      if (query['word'] == undefined || Array.isArray(query['word']))  
        throw Error("Need to enter one word ");
    
      console.log("Handling a 'repeat' request");
      console.log(query);
      for (var i = 0; i < query['word'].length; i++) { 
        res.write('<pre>'+query['word']+'</pre>');
      }
      res.end('');  
}

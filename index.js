const Express = require("express");
const app = Express();
const port = 80;


app.use(Express.static('public'));

app.get('/', (req,res,next)=>{
    const direction = req.query.dir;
    const duration = req.query.dur;
    const reply = {error: false, msg: "OK"};
    if(!time || time < 0){
        reply.error = true;
        reply.msg = "Time not set correctly";
    }
    if(time > 30){
        reply.error = true;
        reply.msg = "Select a time lower than 30 seconds";
    }
    if(!reply.error){

    }
    res.send()
});


app.get('/remote', (req,res,next)=>{

})

app.listen(port, ()=>{
    console.log(`Server started on port: ${port}`)
});
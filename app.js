const express = require('express'); // always required
const bodyParser = require('body-parser');
const Joi = require('@hapi/joi');

const app = express(); // standard to have an app object for express
const PORT = process.env.PORT || 3000;  // use the PORT env var or default to whatever

app.use(bodyParser.json()); // add middleware to apply in the request processing to parse the body of req
app.use(bodyParser.urlencoded({extended: false})); // add middleware to apply in the request processing to parse the body of req
//app.use(express.json());

// this is a sample collection to use
const allUserPlans = [
    {id:1, name:'plan 1'},
    {id:2, name:'plan 2'},
    {id:3, name:'plan 3'},
    {id:4, name:'plan 4'},
    {id:5, name:'plan 5'}
];

// default route to localhost:{PORT}
app.get('/', (req, res) => {
    res.send('Hi world!');
});

// route to localhost:{PORT}/api/plan
app.get('/api/plans', (req, res) => {
    res.json(allUserPlans);
});

// route to localhost:{PORT}/api/plan/1
app.get('/api/plans/:id', (req, res) => {
    // get the plan id parameter passed in the path
    // Btw, to get the param passed as query, use req.query.your-param-name
    const planId = req.params.id; 
    //console.log('plan id=' + planId)

    // find and get the plan based on the given id (int)
    const foundPlan = allUserPlans.find( p => p.id === parseInt(planId));
    if (!foundPlan) return res.status(404).send(`No plan ${planId}`);
    
    res.json(foundPlan);

});

// route to localhost:{PORT}/api/plan
app.post('/api/plans',  (req, res) => {

    // validate the request
    const result = validatePlan(req.body);
    if ( result.error) return res.status(400).send(result.error.details[0].message);

    // create a new object based on input
    const newPlan = {
        id : allUserPlans.length + 1,
        name: req.body.name // get the name in the body of the post
    };
    
    allUserPlans.push(newPlan);
    //console.log('new plan is ' + newPlan);

    // return the new item created
    res.json(newPlan);
    
});

app.put('/api/plans/:id', (req, res) => {

    // get the plan id parameter passed in the path
    // Btw, to get the param passed as query, use req.query.your-param-name
    const planId = req.params.id; 

    // find and get the plan based on the given id (int)
    const foundPlan = allUserPlans.find( p => p.id === parseInt(planId));
    if (!foundPlan) return res.status(404).send(`No plan ${planId}`);
    
    // validate the input date
    const result = validatePlan(req.body);
    if ( result.error) return res.status(400).send(result.error.details[0].message);

    //update the plan
    foundPlan.name = req.body.name;

    res.json(foundPlan);

});

app.delete('/api/plans/:id', (req, res) => {
   // get the plan id parameter passed in the path
    // Btw, to get the param passed as query, use req.query.your-param-name
    const planId = req.params.id; 

    // find and get the plan based on the given id (int)
    const foundPlan = allUserPlans.find( p => p.id === parseInt(planId));
    if (!foundPlan) return res.status(404).send(`No plan ${planId}`);

    //delete the plan
    const index = allUserPlans.indexOf(foundPlan);
    allUserPlans.splice(index,1);

    res.json(foundPlan);

});

// common function to valiate the request body
function validatePlan(plan) {
    // validation using joi
    const schema = {
        name: Joi.string().min(3).required()
    };
    return Joi.validate(plan, schema);
}

app.listen(PORT, () => console.log(`App is listening on port ${PORT}!`));

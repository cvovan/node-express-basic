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
    console.log(req.header);
    res.send('Hi world!');
});

// route to localhost:{PORT}/api/plan
app.get('/api/plans', (req, res) => {
    console.log(req.header);
    res.json(allUserPlans);
});

// route to localhost:{PORT}/api/plan/1
app.get('/api/plans/:id', (req, res) => {
    console.log(req.header);

    // getting the parameter passed in the path
    // Btw, to get the param passed as query, use req.query.your-param-name

    const planId = req.params.id; 
    console.log('plan id=' + planId)

    // find and get the plan based on the given id (int)
    const foundPlan = allUserPlans.find( p => p.id === parseInt(planId));
    if (!foundPlan) res.status(404).send(`No plan ${planId}`);
    
    res.json(foundPlan);

});

// route to localhost:{PORT}/api/plan
app.post('/api/plans',  (req, res) => {
    //console.log(req.header);

    // simple validation of the input
    //if (!req.body.name) {
    //    res.status(400).send('Name is required');
    //    return;
    //}

    const result = validatePlan(req.body);
    if ( result.error) {
        res.status(400).send(result.error.details[0].message);
        returnl;
    }

    // create a new object based on input
    
    const newPlan = {
        id : allUserPlans.length + 1,
        name: req.body.name // get the name in the body of the post
    };
    
    console.log('new plan is ' + newPlan);
    allUserPlans.push(newPlan);

    // convention is to return the new item created
    res.json(newPlan);
    
});

// route to localhost:{PORT}/api/plan/1
app.put('/api/plans/:id', (req, res) => {
    console.log(req.header);

    // getting the parameter passed in the path
    // Btw, to get the param passed as query, use req.query.your-param-name

    const planId = req.params.id; 
    console.log('plan id=' + planId)

    // find and get the plan based on the given id (int)
    const foundPlan = allUserPlans.find( p => p.id === parseInt(planId));
    if (!foundPlan) res.status(404).send(`No plan ${planId}`);
    
    // validate
    const result = validatePlan(req.body);
    if ( result.error) {
        res.status(400).send(result.error.details[0].message);
        returnl;
    }

    //update
    foundPlan.name = req.body.name;

    res.json(foundPlan);

});

function validatePlan(plan) {
    // validation using joi
    const schema = {
        name: Joi.string().min(3).required()
    };
    return Joi.validate(plan, schema);
}

app.listen(PORT, () => console.log(`App is listening on port ${PORT}!`));

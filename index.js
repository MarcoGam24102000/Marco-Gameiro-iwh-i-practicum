require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS_TOKEN;

// TODO: ROUTE 1 - Create a new route that renders a table of custom object data
app.get('/', async (req, res) => {
    // REPLACE '2-xxxxxxx' with your actual Object ID from the URL
    const petsUrl = 'https://api.hubapi.com/crm/v3/objects/2-201122113?properties=name,bio,species';
    const headers = {  
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        const resp = await axios.get(petsUrl, { headers });
        const data = resp.data.results;
        // This renders the homepage.pug file and passes the pet data to it
        res.render('homepage', { title: 'Custom Objects | HubSpot Academy', data });      
    } catch (error) {
        console.error('Error fetching pets:', error.message);
    }
});

// ROUTE 2 - Show the form
app.get('/update-cview', async (req, res) => {
    try {
        res.render('updates', { title: 'Update Custom Object Form | HubSpot Academy' });
    } catch (error) {
        console.error(error);
    }
});

// ROUTE 3 - Post the new data to HubSpot
app.post('/update-cview', async (req, res) => {
    const update = {
        properties: {
            "name": req.body.name,
            "species": req.body.species,
            "bio": req.body.bio
        }
    }

    const updateUrl = `https://api.hubapi.com/crm/v3/objects/2-201122113`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.post(updateUrl, update, { headers } );
        res.redirect('/');
    } catch(err) {
        console.error(err);
    }
});
/** 
* * This is sample code to give you a reference for how you should structure your calls. 

* * App.get sample
app.get('/contacts', async (req, res) => {
    const contacts = 'https://api.hubspot.com/crm/v3/objects/contacts';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(contacts, { headers });
        const data = resp.data.results;
        res.render('contacts', { title: 'Contacts | HubSpot APIs', data });      
    } catch (error) {
        console.error(error);
    }
});

* * App.post sample
app.post('/update', async (req, res) => {
    const update = {
        properties: {
            "favorite_book": req.body.newVal
        }
    }

    const email = req.query.email;
    const updateContact = `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.patch(updateContact, update, { headers } );
        res.redirect('back');
    } catch(err) {
        console.error(err);
    }

});
*/


// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));
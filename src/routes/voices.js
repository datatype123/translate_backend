const express = require('express');
const router = express.Router();
const detect = require('../controllers/translate/VoiceText');


//ROUTE: list voices avaiable from start index to end index to make the page not lag  
router.post('/text-to-speech', async (req, res) => {
    try {
        const {input,start_page,end_page} = req.body;
        const lang = await detect(input,start_page,end_page);
        res.status(200).json({
            lang
        }
        );
    } catch (error) {
        console.error(error);
        throw error;
    }
})


module.exports = router;

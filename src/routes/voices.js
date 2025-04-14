const express = require('express');
const router = express.Router();
const {translateText,detectLanguage,getListVoices} = require('../controllers/translate/VoiceText');


//ROUTE: list voices avaiable from start index to end index to make the page not lag  
router.post('/translate', async (req, res) => {
    try {
        const {input,origin,start_page,end_page} = req.body;
        const lang = await translateText(input,origin,start_page,end_page);
        res.status(200).json({
            lang
        });
    } catch (error) {
        console.error(error);
        throw error;
    }
})


router.post('/detect', async (req,res)=>{
    try {
        const input = req.body;
        const lang = await detectLanguage(input);
        res.status(200).json({
            lang
        })
    } catch (error) {
        console.error(error);
        throw error;
        
    }
})


router.get('/voices',async (req,res)=>{
    try {
        const voices = await getListVoices();
        res.status(200).json({
            voices
        })
    } catch (error) {
        console.error(error);
        throw error;
        
    }
})


module.exports = router;

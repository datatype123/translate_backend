const express = require('express');
const router = express.Router();
const {translateText,detectLanguage,getListVoices} = require('../controllers/translate/VoiceText');



router.post('/translate', async (req, res) => {
    try {
        const {input,origin,target,start_page,end_page} = req.body;
        const lang = await translateText(input,origin,target,start_page,end_page);
        res.status(200).json({
            lang
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message || 'Something went wrong' });
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

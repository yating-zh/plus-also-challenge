require('dotenv').config();
const axios = require('axios');

const testFaceGen = async () => {
  try {
    const response = await axios.post('https://modelslab.com/api/v6/image_editing/face_gen', {
      key: process.env.MODELSLAB_API_KEY,
      prompt: 'pretty woman',
      negative_prompt: 'anime, cartoon, drawing, big nose, long nose, fat, ugly, big lips, big mouth',
      face_image: 'https://media.allure.com/photos/647f876463cd1ef47aab9c88/3:2/w_2465,h_1643,c_limit/angelina-jolie-red-lip.jpg',
      width: 512,
      height: 512,
      samples: 1,
      num_inference_steps: 21,
      safety_checker: false,
      base64: false,
      guidance_scale: 7.5,
      style: 'realistic'
    }, {
      headers: { 'Content-Type': 'application/json' }
    });

    console.log('✅ Response:', response.data);
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
};

testFaceGen();

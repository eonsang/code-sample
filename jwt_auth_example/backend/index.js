const app = require('./src/app');

require('dotenv').config();



app.listen(process.env.PORT, () => {
  console.log(`run server! http://localhost:${process.env.PORT}`)
});

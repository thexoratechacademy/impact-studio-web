const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();


//middleware
app.use(express.json());
app.use(cors()); 
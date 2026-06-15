import express from 'express';
import fs from 'fs';
import { myCustomHelper } from './utils/helper.js';

const PORT = 3000;
const app = express();

function startServer() {
  console.log('Running on ' + PORT);
}
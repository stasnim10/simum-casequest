#!/bin/bash
echo "===== $(date) =====" >> deploy.log
npm run deploy >> deploy.log 2>&1
tail -20 deploy.log

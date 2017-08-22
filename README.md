# MIMG

Requirements to run the App:
* nodejs - v8.1.4
* npm - 5.0.3
* mysql - 5.5.55
* Redis - 3.2.0


Steps to run the project -
* Clone the repo
* ```cd <repodir>```
* run ```npm install```
* change mysql config in ```repo/config/mysql.json```
* change redis config in ```repo/config/redis.json```
* run ```mysql -u <user> -p < repo/tools/db/mimg.sql```
* In redis-cli execute the following command ```SET primary_images 5```
* run the command ```npm start```

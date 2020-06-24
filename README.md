# XML to MYSQL

With this tool, you can transfer your data in **XML** to **MySQL** database.


## Setup
1.	Install npm packages
	>npm install

2. Create a file named ".env" in the root directory and fill its contents as follows.

    
>     INTERVAL_VALUE=600000000
>     MYSQL_HOST=localhost or yourserverIP
>     MYSQL_USER=**Username**
>     MYSQL_PASS=**Password**
>     MYSQL_DATABASE=**DatabaseName**
>     IMAGE_URL=**Image Upload Path** 
  3.  If you download any image from XML, open the /src/proccessors/utils.js file and define your Image download path
  4. Open the /src/proccessors/xmlconvert.js file and define your XML link, MySQL table names, variables, etc.

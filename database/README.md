1. Install PostgreSQL
    - Download installer here: https://www.postgresql.org/download/
    - Run installer (postgresql-14.5-1-windows-x64.exe)
    - Select installation directory, click "Next"
    - Have all components selected, click "Next"
    - Input a password (ex. "stratosphereHollandaise"), click "Next"
    - Keep port as 5432, click "Next"
    - Keep default locale or set to US English, click "Next"
    - Click "Next" twice
    - Click "Finish" (I did not install Stack Builder, nor did the video I follow; unsure if it is needed)

2. Create Stratosphere Database
    - Run SQL Shell (psql)
    - Press "Enter" four times
        i. NOTE: I am not sure how to create different usernames for each of us; that might be preferable
    - Enter password created earlier
        i. NOTE: Nor am I sure how to create different passwords for each of us; again, preferable
    - Copy code from 0_CreateDatabase.sql into psql command line
    - Exit form psql

3. Populate Stratosphere Database
    - Run SQL Shell (psql)
    - Press "Enter" once
    - Input "stratosphere" for database
    - Press "Enter" twice
    - Enter password created earlier
    - Type "\i <filepath of 2_ActualCreateTable.sql (make sure filepath uses / instead of \)>" and press "Enter"
    - Type "\i <filepath of 3_ActualInsertMock.sql>" and press "Enter"

4. Seeing Your Work
    - Type "\d" and press "Enter" --> you will see a table named "replay" has been added
    - Type "\i <filepath of 4_ActualSelectAll.sql>" and press "Enter" --> you will see three rows of data have been added to "replay"
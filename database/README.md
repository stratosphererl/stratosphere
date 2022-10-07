1. Install PostgreSQL
    a. Download installer here: https://www.postgresql.org/download/
    b. Run installer (postgresql-14.5-1-windows-x64.exe)
    c. Select installation directory, click "Next"
    d. Have all components selected, click "Next"
    e. Input a password (ex. "stratosphereHollandaise"), click "Next"
    f. Keep port as 5432, click "Next"
    g. Keep default locale or set to US English, click "Next"
    h. Click "Next" twice
    i. Click "Finish" (I did not install Stack Builder, nor did the video I follow; unsure if it is needed)

2. Create Stratosphere Database
    a. Run SQL Shell (psql)
    b. Press "Enter" four times
        i. NOTE: I am not sure how to create different usernames for each of us; that might be preferable
    c. Enter password created earlier
        i. NOTE: Nor am I sure how to create different passwords for each of us; again, preferable
    d. Copy code from 0_CreateDatabase.sql into psql command line
    e. Exit form psql

3. Populate Stratosphere Database
    a. Run SQL Shell (psql)
    b. Press "Enter" once
    c. Input "stratosphere" for database
    d. Press "Enter" twice
    e. Enter password created earlier
    f. Type "\i <filepath of 2_ActualCreateTable.sql (make sure filepath uses / instead of \)>" and press "Enter"
    g. Type "\i <filepath of 3_ActualInsertMock.sql>" and press "Enter"

4. Seeing Your Work
    a. Type "\d" and press "Enter" --> you will see a table named "replay" has been added
    b. Type "\i <filepath of 4_ActualSelectAll.sql>" and press "Enter" --> you will see three rows of data have been added to "replay"
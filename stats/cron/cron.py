import os
import time
import schedule

def perform_update():
    print("Starting CRON job to update Stats-Service-DB")
    os.system("python -m cron.update")
    print("Completed CRON job to update Stats-Service-DB")

perform_update() # Update the database whenever database container is turned on
schedule.every().day.at("11:59").do(perform_update) # Schedules CRON job at 11:59pm everyday UTC (In UTC due to docker using that timezone)
# schedule.every(5).seconds.do(perform_update) # For testing purposes 

while True:
    schedule.run_pending()
    time.sleep(1)
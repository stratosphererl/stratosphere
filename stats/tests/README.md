## Testing Guidelines
### RUNNING ###
0. Have the following installed, using pip install: `pytest`, `docker`, `tarfile`, `subprocess`
0. Set working directory to stratosphere/stats
1. Have Docker containers stats-service-1 and stats-service-db-1 running
2. Use the following command: "python -m tests.script"
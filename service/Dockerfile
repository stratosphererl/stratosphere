FROM python:3.10

WORKDIR /service

# Copy the Pipfile and Pipfile.lock to the container
COPY Pipfile Pipfile.lock ./

# Install dependencies using Pipenv
RUN pip install pipenv && \
    pipenv install --system --deploy --ignore-pipfile

# Copy the rest of the application code to the container
COPY . .

# Run the application
CMD python3 app.py
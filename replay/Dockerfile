FROM python:3.10

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Copy the Pipfile and Pipfile.lock to the container
COPY ./replay/Pipfile ./replay/Pipfile.lock ./

# Install dependencies using Pipenv
RUN pip install pipenv && \
    pipenv install --system --deploy --ignore-pipfile

# Copy the rest of the application code to the container


COPY .env /app/
COPY ./replay .

# Run the application
CMD python3 app.py
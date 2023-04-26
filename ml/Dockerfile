FROM python:3.8.5-alpine

WORKDIR /app

COPY ./ml/ml-service/Pipfile ./ml/ml-service/Pipfile.lock ./ml/ml-service/whl ./

RUN pip install pipenv && \
    pipenv install --system --deploy --ignore-pipfile

COPY ./ml/ml-service ./

CMD python3 app.py
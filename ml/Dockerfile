FROM python:3.10

WORKDIR /app

COPY ./ml-service/Pipfile ./ml-service/Pipfile.lock ./

RUN pip install pipenv && \
    pipenv install --system --deploy --ignore-pipfile

COPY ./ml-service ./

CMD python3 app.py
FROM python:3.8-bullseye

WORKDIR /app

COPY ./ml/ml-service/Pipfile ./ml/ml-service/Pipfile.lock ./
COPY ./ml/ml-service/whl ./whl

RUN pip install pipenv
RUN pipenv install --system --deploy --ignore-pipfile
RUN pip install ./whl/boxcars_py-0.1.15-cp38-cp38-manylinux1_x86_64.whl

COPY ./ml/ml-service ./
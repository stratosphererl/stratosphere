FROM python:3.10.7
WORKDIR /machine-learning
RUN pip install flask
COPY . ./
EXPOSE 5002
WORKDIR /machine-learning//machine_learning
CMD ["python", "-m", "flask", "run", "-h", "0.0.0.0", "-p", "5002"]
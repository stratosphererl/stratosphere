FROM python:3.10.7
WORKDIR /parser
RUN pip install flask
COPY . ./
EXPOSE 5001
CMD ["python", "-m", "flask", "run", "--host", "0.0.0.0" , "--port", "5001"]
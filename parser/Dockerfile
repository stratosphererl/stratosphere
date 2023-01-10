FROM nucypher/rust-python:3.8.12 

RUN apt-get update && apt-get install -y python3-pip
RUN python -m pip install --upgrade pip

WORKDIR /replays

WORKDIR /parser
COPY ./requirements.txt ./
RUN pip3 install -r requirements.txt
COPY . ./

EXPOSE 5001
CMD ["python", "-m", "flask", "run", "--host", "0.0.0.0" , "--port", "5001"]
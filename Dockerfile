FROM python:3.8.6-buster

COPY requirements.txt /requirements.txt
RUN pip install -U pip
RUN pip install -r requirements.txt

COPY dist/ dist/
COPY api/ api/

CMD uvicorn api.fast:app --port $PORT --host 0.0.0.0

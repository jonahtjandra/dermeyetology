FROM python:3.8-slim

RUN apt-get update -y && \
    apt-get install -y python3-pip python-dev

WORKDIR /app

COPY . /app

RUN pip --no-cache-dir install -r requirements.txt

RUN mysql < db.sql

EXPOSE 5000
ENTRYPOINT [ "python3" ]
CMD ["__init__.py"]
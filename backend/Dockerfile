FROM python:3.11.4-slim-buster

# set work directory
WORKDIR /app/backend

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install system dependencies
RUN apt-get update && apt-get install -y netcat

# install dependencies
RUN pip install --upgrade pip
COPY ./requirements.txt .
RUN pip install -r requirements.txt

# copy entrypoint.sh
COPY ./entrypoint.sh .
RUN sed -i 's/\r$//g' ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

# copy project
COPY . .

ENTRYPOINT ["/app/backend/entrypoint.sh"]

# Example CMD to run the Django application (uncomment and modify based on your setup)
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
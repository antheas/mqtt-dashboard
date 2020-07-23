FROM python:3

WORKDIR /usr/src/app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# COPY . .

# CMD ["python", "entry.py"]

CMD watchmedo auto-restart --patterns='*.py' python entry.py
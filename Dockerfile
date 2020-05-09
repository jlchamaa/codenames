FROM tiangolo/meinheld-gunicorn-flask:python3.7

COPY requirements.txt ./

COPY ./app /app

RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

ENTRYPOINT ["/usr/local/bin/python", "/usr/local/bin/gunicorn", "-c", "/app/custom_gunicorn_conf.py", "main:app"]

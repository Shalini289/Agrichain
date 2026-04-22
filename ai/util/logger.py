import datetime


def log(message: str):
    time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"[{time}] {message}")


def log_error(error: str):
    time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"[ERROR {time}] {error}")
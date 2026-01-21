from sanic import json

def ok(data=None, status=200):
    return json(data or {}, status=status)

def fail(message="Error", status=400):
    return json({"message": message}, status=status)

# -*- coding: utf-8 -*-
import requests

def main(args):
    name = args.get("name", "stranger")
    greeting = "Hello " + name + "!"
    print(greeting)

    args["payload"] = "Hallo Python"
    args["htmlText"] = "Hallo aus Python"
    args["text"] = requests.get('https://duckduckgo.com').text
    return args
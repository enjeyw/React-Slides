#!/bin/bash

unoconv --listener
python3 /src/db_create.py
python3 /src/application.py
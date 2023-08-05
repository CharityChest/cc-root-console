#!/bin/bash

SCRIPT_DIR=$(dirname "$0")

ENV_LOCAL_FILE="$SCRIPT_DIR/.env.local"

rm -f "$ENV_LOCAL_FILE"
touch "$ENV_LOCAL_FILE"

{
  echo "BACKEND_HOST=${BACKEND_HOST}"
  echo "BACKEND_PORT=${BACKEND_PORT}"
  echo "BACKEND_PROTOCOL=${BACKEND_PROTOCOL}"
  echo "BACKEND_BASE_URI=${BACKEND_BASE_URI}"
  echo "EMAIL_SERVER_HOST=${EMAIL_SERVER_HOST}"
  echo "EMAIL_SERVER_PORT=${EMAIL_SERVER_PORT}"
  echo "EMAIL_SERVER_USER=${EMAIL_SERVER_USER}"
  echo "EMAIL_SERVER_PASSWORD=${EMAIL_SERVER_PASSWORD}"
  echo "EMAIL_SERVER_FROM=${EMAIL_SERVER_FROM}"
} >> "$ENV_LOCAL_FILE"

if [ -n "$1" ]; then
    case $1 in
        -p|--production)
            node server.js
            ;;
        *)
            npm run dev
            ;;
    esac
fi
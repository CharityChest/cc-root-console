#!/bin/bash

function has_space {
    pattern=" "

    if [[ $1 =~ $pattern ]]; then
        return 0
    else
        return 1
    fi
}

function parse_variable {
  variable=$1
  if has_space "$variable"; then
    echo "\"$variable\""
  else
    echo "$variable"
  fi
}

function test_app {
    npm run build && \
    npm run start && \
    npm jest && \
    npm run cypress:headless -- --component && \
    npm run cypress:headless -- --e2e
}

SCRIPT_DIR=$(dirname "$0")

ENV_LOCAL_FILE="$SCRIPT_DIR/.env.local"

rm -f "$ENV_LOCAL_FILE"
touch "$ENV_LOCAL_FILE"

BACKEND_HOST=$(parse_variable "$BACKEND_HOST")
BACKEND_PORT=$(parse_variable "$BACKEND_PORT")
BACKEND_PROTOCOL=$(parse_variable "$BACKEND_PROTOCOL")
BACKEND_BASE_URI=$(parse_variable "$BACKEND_BASE_URI")
EMAIL_SERVER_HOST=$(parse_variable "$EMAIL_SERVER_HOST")
EMAIL_SERVER_PORT=$(parse_variable "$EMAIL_SERVER_PORT")
EMAIL_SERVER_USER=$(parse_variable "$EMAIL_SERVER_USER")
EMAIL_SERVER_PASSWORD=$(parse_variable "$EMAIL_SERVER_PASSWORD")
EMAIL_SERVER_FROM=$(parse_variable "$EMAIL_SERVER_FROM")
REDIS_HOST=$(parse_variable "$REDIS_HOST")
REDIS_PORT=$(parse_variable "$REDIS_PORT")
REDIS_USER=$(parse_variable "$REDIS_USER")
REDIS_PASSWORD=$(parse_variable "$REDIS_PASSWORD")
REDIS_DB=$(parse_variable "$REDIS_DB")
AUTH_ENTRIES=$(parse_variable "$AUTH_ENTRIES")
SECRET=$(parse_variable "$SECRET")
ENVIRONMENT=$(parse_variable "$ENVIRONMENT")

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
  echo "REDIS_HOST=${REDIS_HOST}"
  echo "REDIS_PORT=${REDIS_PORT}"
  echo "REDIS_USER=${REDIS_USER}"
  echo "REDIS_PASSWORD=${REDIS_PASSWORD}"
  echo "REDIS_DB=${REDIS_DB}"
  echo "AUTH_ENTRIES=${AUTH_ENTRIES}"
  echo "SECRET=${SECRET}"
  echo "NEXTAUTH_SECRET=${SECRET}"
  echo "ENVIRONMENT=${ENVIRONMENT}"
} >> "$ENV_LOCAL_FILE"

if [ -n "$1" ]; then
    case $1 in
        -p|--production)
            node server.js
            ;;
        -t|--test)
            test_app
            ;;
        *)
            npm run dev
            ;;
    esac
fi
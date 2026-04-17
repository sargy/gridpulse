#!/bin/sh
# Substitute BACKEND_URL in nginx config (only this variable, not $host/$uri/etc)
envsubst '$BACKEND_URL' < /etc/nginx/nginx.conf.template > /etc/nginx/conf.d/default.conf
exec nginx -g 'daemon off;'

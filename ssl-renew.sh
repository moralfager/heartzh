#!/bin/bash

# SSL Certificate Renewal Script
# This script renews Let's Encrypt certificates and reloads Nginx

echo "Starting SSL certificate renewal..."

# Renew certificates
docker-compose -f docker-compose.prod.yml run --rm certbot renew

# Reload Nginx to use new certificates
docker-compose -f docker-compose.prod.yml exec nginx nginx -s reload

echo "SSL certificate renewal completed!"

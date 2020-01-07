FROM nginx:alpine

# Nginx config
RUN rm -rf /etc/nginx/sites-enabled
RUN mkdir /etc/nginx/sites-enabled
COPY nginx/b404.conf /etc/nginx/sites-enabled/

# Static build
COPY /b404.fe/build /usr/share/nginx/html/

# Default port exposure
EXPOSE 80

# Copy .env file and shell script to container
WORKDIR /usr/share/nginx/html
COPY ./env.sh .
COPY /b404.fe/.env .

# Add bash
RUN apk add --no-cache bash

# Make our shell script executable
RUN chmod +x env.sh

# Start Nginx server
CMD ["/bin/bash", "-c", "/usr/share/nginx/html/env.sh && nginx -g \"daemon off;\""]
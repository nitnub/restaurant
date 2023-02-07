# Set nginx base image
FROM nginx

COPY docker-entrypoint.sh /
ENTRYPOINT ["/docker-entrypoint.sh"]

# # Copy custom configuration file from the current directory
COPY nginx.conf /etc/nginx/nginx.conf

VOLUME ["/etc/nginx/ssl", "/etc/nginx/psw"]

# # Append "daemon off;" to the beginning of the configuration
# # in order to avoid an exit of the container
# RUN echo "daemon off;" >> /etc/nginx/nginx.conf
# Above was duplicate on VM



# Testing
RUN ["chmod", "+x", "docker-entrypoint.sh"]

# Expose ports
EXPOSE 443

# Define default command
CMD service nginx start
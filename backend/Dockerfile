FROM node:8.9.1-alpine

ENV NPM_CONFIG_LOGLEVEL warn

# Create service directory
RUN mkdir -p /backend
WORKDIR /backend

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy frontend source code
COPY . .

# Expose ports in the container
EXPOSE 3000

# Set default command that is called when the container runs
CMD ["sh", "scripts/docker-start.sh"]

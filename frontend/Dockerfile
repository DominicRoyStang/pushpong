FROM node:8.9.1-alpine

# Setup node environment
ENV NPM_CONFIG_LOGLEVEL warn

# Create service directory
RUN mkdir -p /frontend
WORKDIR /frontend

# Add git
RUN apk --no-cache add git

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy frontend source code
COPY . .
RUN npm run build

# Expose ports in the container
EXPOSE 3001

# Set default command that is called when the container runs
CMD ["sh", "scripts/docker-start.sh"]

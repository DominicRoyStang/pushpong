FROM node:8.9.1-alpine

# Setup node environment
ENV NPM_CONFIG_LOGLEVEL warn
ARG app_env
ENV NODE_ENV $app_env

# Source environment variables if in production mode
ARG backend_host
ENV BACKEND_HOST=${backend_host:-backend.pushpong.xyz}
ARG backend_port
ENV BACKEND_PORT=${backend_port:-5000}

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
EXPOSE 80
EXPOSE 3000

# Set default command that is called when the container runs
CMD ["sh", "./scripts/run.sh"]

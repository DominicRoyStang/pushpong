FROM node:8.9.1-alpine

ENV NPM_CONFIG_LOGLEVEL warn

# Create service directory
RUN mkdir -p /frontend
WORKDIR /frontend
ARG app_env
ENV NODE_ENV $app_env

# Source environment variables if in production mode
COPY ./scripts/set_env_vars.sh /tmp/
RUN chmod u+x /tmp/set_env_vars.sh && . /tmp/set_env_vars.sh $app_env

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

FROM node:18-alpine

LABEL maintainer="Prasetyo Bayu Widodo"
LABEL repository="https://github.com/dheasrafa-droid/NewVexorion"
LABEL liveDemo="https://new-vexorion-git-main-ercs-projects-09b1de49.vercel.app/"

WORKDIR /app

# Install PM2 globally
RUN npm install -g pm2

# Copy package files
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Create directories
RUN mkdir -p output logs

# Expose ports
EXPOSE 8080
EXPOSE 8081
EXPOSE 3000

# Start with PM2
CMD ["pm2-runtime", "ecosystem.config.js", "--env", "production"]

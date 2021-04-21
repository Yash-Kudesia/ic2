FROM localhost:5000/proxy:latest

# Create app directory
WORKDIR /usr/src/app/

COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production
ENV Host=proxy
# Bundle app source
COPY . .

EXPOSE 80/tcp 443/tcp 3011/tcp 3010/tcp

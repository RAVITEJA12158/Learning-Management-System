FROM node:24-slim  
WORKDIR /app
COPY package*.json ./
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

RUN npm ci
COPY prisma ./prisma/
RUN npx prisma generate
COPY . .
ENV NODE_ENV=production
EXPOSE 5000
CMD ["npm", "start"]

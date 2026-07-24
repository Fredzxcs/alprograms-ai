# 1. Base Image
FROM node:18-alpine

# 2. Set Working Directory
WORKDIR /app

# 3. Copy package dependencies
COPY package*.json ./
RUN npm install

# 4. Copy project files
COPY . .

# 5. Build Next.js App
RUN npm run build

# 6. Expose Port & Start App
EXPOSE 3000
ENV PORT=3000
CMD ["npm", "start"]
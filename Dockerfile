FROM node:18-alpine3.17@sha256:19892542dd80e33aec50a51619ab36db0921de240c6a4ff6024d801f84881293 AS dependencies
LABEL maintainer="Jack Ma <jma140@myseneca.com>"
LABEL description="Fragments UI"
ENV NODE_ENV=production​

WORKDIR /app
COPY ./src ./src

# Copy the package.json and package-lock.json files into the working dir (/app)
COPY package.json package-lock.json .env ./
# Install node dependencies defined in package-lock.json
RUN npm ci 

FROM node:18-alpine3.17@sha256:19892542dd80e33aec50a51619ab36db0921de240c6a4ff6024d801f84881293 AS builder
WORKDIR /app
COPY --from=dependencies /app /app

# Copy source code into the image
COPY . .
RUN npm run build

FROM nginx:stable-alpine@sha256:0f737f8ba72d336d5e5e5c6f4ae163ef15c047b58ec5d88fdcb277be61d1aebb AS deploy
COPY --from=builder /app/dist/ /usr/share/nginx/html/
ENV PORT=1234

EXPOSE 1234

HEALTHCHECK --interval=15s --start-period=5s --retries=3 --timeout=30s\
  CMD curl –-fail http://localhost:${PORT}/ || exit 1​
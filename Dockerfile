##### Base #####

FROM node:16-alpine as base
ENV NODE_ENV=production

WORKDIR /app

COPY package.json yarn.lock ./

# production dependencies
RUN --mount=type=cache,target=/usr/local/share/.cache/yarn yarn

##### BUILD #####

FROM base as build
ENV NODE_ENV=development

WORKDIR /app

# all dependencies (with development)
RUN --mount=type=cache,target=/usr/local/share/.cache/yarn yarn

# Copy the source-code
COPY . .

# Build the project
RUN yarn build

##### PRODUCTION IMAGE ####

FROM base

WORKDIR /app

COPY . .
COPY --from=build /app/dist /app/dist

# Options
EXPOSE 9926/tcp
ENV ROUTER_ADDRESS=192.168.1.1
ENV ROUTER_USERNAME=admin
ENV ROUTER_PASSWORD=admin
ENV METRICS_PORT=9926

# Launch the project
CMD [ "node", "." ]

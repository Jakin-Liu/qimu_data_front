FROM node:22-alpine AS base

# This Dockerfile is copy-pasted into our main docs at /docs/handbook/deploying-with-docker.
# Make sure you update both files!

FROM base AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk update
RUN apk add --no-cache libc6-compat
# Set working directory
WORKDIR /app
RUN yarn global add turbo
COPY . .
RUN turbo prune playground --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app

# First install the dependencies (as they change less often)
COPY --from=builder /app/out/json/ .
RUN yarn install

# Build the project
COPY --from=builder /app/out/full/ .

# Uncomment and use build args to enable remote caching
# ARG TURBO_TEAM
# ENV TURBO_TEAM=$TURBO_TEAM

# ARG TURBO_TOKEN
# ENV TURBO_TOKEN=$TURBO_TOKEN

# Add build argument for environment
ARG BUILD_ENV=production
COPY apps/playground/.env.${BUILD_ENV} apps/playground/.env.production
RUN yarn turbo build

FROM base AS runner
WORKDIR /app

EXPOSE 3002
ENV PORT=3002

COPY --from=installer /app/apps/playground/.next/standalone ./
COPY --from=installer /app/apps/playground/.next/static ./apps/playground/.next/static
COPY --from=installer /app/apps/playground/public ./apps/playground/public

RUN mkdir -p /app/logs

CMD node apps/playground/server.js

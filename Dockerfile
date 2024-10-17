FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

RUN apt-get update -y && apt-get install -y openssl

COPY . /app
WORKDIR /app

RUN apt-get install -y libvips-dev

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm install sharp
RUN pnpm db:generate
RUN pnpm run build

FROM base
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./public/.next/static
COPY --from=build /app/public ./public

ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV=production

ARG PORT=3001
ENV PORT=${PORT}
ENV HOSTNAME 0.0.0.0
EXPOSE ${PORT}

CMD ["node", "server.js"]
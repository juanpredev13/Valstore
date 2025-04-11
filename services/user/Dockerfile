FROM oven/bun:1

WORKDIR /app
COPY . .
RUN bun install
CMD ["bun", "--watch", "src/index.ts"]
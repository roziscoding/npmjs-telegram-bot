FROM node:latest as build
COPY . .
RUN npm install
RUN npm run build

FROM node:latest
COPY --from=build dist .
COPY --from=build node_modules node_modules
COPY --from=build .env.example .
CMD ["node", "index.js"]
# Stage 1: Builder
FROM node:20.18.0 AS builder

WORKDIR /app

# Install dependencies
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production
FROM node:20.18.0 AS bolt-ai-production

WORKDIR /app

# Copy dependencies from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json .

# Copy build artifacts from builder
COPY --from=builder /app/build ./build
COPY --from=builder /app/functions ./functions

# Expose the port
EXPOSE 10000

# Define environment variables
ARG GROQ_API_KEY
ARG HuggingFace_API_KEY
ARG OPENAI_API_KEY
ARG ANTHROPIC_API_KEY
ARG OPEN_ROUTER_API_KEY
ARG GOOGLE_GENERATIVE_AI_API_KEY
ARG OLLAMA_API_BASE_URL
ARG XAI_API_KEY
ARG TOGETHER_API_KEY
ARG TOGETHER_API_BASE_URL
ARG AWS_BEDROCK_CONFIG
ARG VITE_LOG_LEVEL=info
ARG DEFAULT_NUM_CTX

ENV WRANGLER_SEND_METRICS=false \
    GROQ_API_KEY=${GROQ_API_KEY} \
    HuggingFace_KEY=${HuggingFace_API_KEY} \
    OPENAI_API_KEY=${OPENAI_API_KEY} \
    ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY} \
    OPEN_ROUTER_API_KEY=${OPEN_ROUTER_API_KEY} \
    GOOGLE_GENERATIVE_AI_API_KEY=${GOOGLE_GENERATIVE_AI_API_KEY} \
    OLLAMA_API_BASE_URL=${OLLAMA_API_BASE_URL} \
    XAI_API_KEY=${XAI_API_KEY} \
    TOGETHER_API_KEY=${TOGETHER_API_KEY} \
    TOGETHER_API_BASE_URL=${TOGETHER_API_BASE_URL} \
    AWS_BEDROCK_CONFIG=${AWS_BEDROCK_CONFIG} \
    VITE_LOG_LEVEL=${VITE_LOG_LEVEL} \
    DEFAULT_NUM_CTX=${DEFAULT_NUM_CTX} \
    RUNNING_IN_DOCKER=true

# Pre-configure wrangler to disable metrics
RUN mkdir -p /root/.config/.wrangler && \
    echo '{"enabled":false}' > /root/.config/.wrangler/metrics.json

# Debug: List files to verify build artifacts are present
RUN ls -la /app && ls -la /app/build && ls -la /app/build/server

# Start the application
CMD ["npm", "run", "start:prod"]

# Development image
FROM base AS bolt-ai-development

# Define the same environment variables for development
ARG GROQ_API_KEY
ARG HuggingFace 
ARG OPENAI_API_KEY
ARG ANTHROPIC_API_KEY
ARG OPEN_ROUTER_API_KEY
ARG GOOGLE_GENERATIVE_AI_API_KEY
ARG OLLAMA_API_BASE_URL
ARG XAI_API_KEY
ARG TOGETHER_API_KEY
ARG TOGETHER_API_BASE_URL
ARG VITE_LOG_LEVEL=debug
ARG DEFAULT_NUM_CTX

ENV GROQ_API_KEY=${GROQ_API_KEY} \
    HuggingFace_API_KEY=${HuggingFace_API_KEY} \
    OPENAI_API_KEY=${OPENAI_API_KEY} \
    ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY} \
    OPEN_ROUTER_API_KEY=${OPEN_ROUTER_API_KEY} \
    GOOGLE_GENERATIVE_AI_API_KEY=${GOOGLE_GENERATIVE_AI_API_KEY} \
    OLLAMA_API_BASE_URL=${OLLAMA_API_BASE_URL} \
    XAI_API_KEY=${XAI_API_KEY} \
    TOGETHER_API_KEY=${TOGETHER_API_KEY} \
    TOGETHER_API_BASE_URL=${TOGETHER_API_BASE_URL} \
    AWS_BEDROCK_CONFIG=${AWS_BEDROCK_CONFIG} \
    VITE_LOG_LEVEL=${VITE_LOG_LEVEL} \
    DEFAULT_NUM_CTX=${DEFAULT_NUM_CTX}\
    RUNNING_IN_DOCKER=true

RUN mkdir -p ${WORKDIR}/run
CMD pnpm run dev --host

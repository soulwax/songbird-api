-- CreateTable
CREATE TABLE "ApiLog" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "method" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "statusCode" INTEGER,
    "durationMs" INTEGER,
    "requestId" TEXT,
    "ip" TEXT,
    "userAgent" TEXT,
    "headers" JSONB,
    "query" JSONB,
    "requestBody" JSONB,
    "responseBody" JSONB,
    "error" JSONB,

    CONSTRAINT "ApiLog_pkey" PRIMARY KEY ("id")
);

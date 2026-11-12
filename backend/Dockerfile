# ========================================================
# Multi-stage Dockerfile for Spring Boot REST API
# Base: Eclipse Temurin 17 JRE Alpine (Ultra-lightweight & Secure)
# ========================================================

# Stage 1: Build Application with Maven
FROM maven:3.9.6-eclipse-temurin-17-alpine AS build
WORKDIR /app

# Cache Maven dependencies layer
COPY pom.xml .
RUN mvn dependency:go-offline -B || true

# Copy source code and build production artifact
COPY src ./src
RUN mvn clean package -DskipTests -B

# Stage 2: Minimal Production JRE Runtime
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Create non-root system group & user for least privilege security
RUN addgroup -S spring && adduser -S spring -G spring

# Copy compiled JAR from build stage
COPY --from=build --chown=spring:spring /app/target/*.jar app.jar

# Switch to non-root user
USER spring:spring

# Expose HTTP port
EXPOSE 8080

# Configure JVM container memory flags and performance tunings
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -Djava.security.egd=file:/dev/./urandom"

# Container healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:8080/api/v1/jobs || exit 1

ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS -jar app.jar"]

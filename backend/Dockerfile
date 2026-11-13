# ==============================================================================
# Multi-stage Dockerfile for Spring Boot REST API (CDTN2 - Nhóm 8)
# Base: Eclipse Temurin 17 JRE Alpine (Ultra-lightweight, Secure & High Performance)
# ==============================================================================

# Stage 1: Build Application with Maven
FROM maven:3.9.6-eclipse-temurin-17-alpine AS build
WORKDIR /app

# Optimize Maven memory and GC for cloud builders
ENV MAVEN_OPTS="-Xmx400m -XX:+UseSerialGC"

# Copy pom.xml and source code to package
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests -B

# Stage 2: Minimal Production JRE Runtime
FROM eclipse-temurin:17-jre-alpine AS runtime
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
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -XX:+UseSerialGC -Djava.security.egd=file:/dev/./urandom"

# Container healthcheck using 127.0.0.1 (avoiding Alpine IPv6 DNS delay)
HEALTHCHECK --interval=15s --timeout=3s --start-period=30s --retries=5 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:8080/api/v1/jobs?page=0&size=1 || exit 1

ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS -jar app.jar"]

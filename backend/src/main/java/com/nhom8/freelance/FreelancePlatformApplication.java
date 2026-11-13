package com.nhom8.freelance;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@SpringBootApplication
public class FreelancePlatformApplication {

    public static void main(String[] args) {
        loadDotEnvIfPresent();
        configureNeonDatabaseUrlIfPresent();
        SpringApplication.run(FreelancePlatformApplication.class, args);
    }

    private static void loadDotEnvIfPresent() {
        Path[] candidates = new Path[]{
            Paths.get(".env"),
            Paths.get("../.env"),
            Paths.get(".env.local"),
            Paths.get("../.env.local")
        };
        for (Path path : candidates) {
            if (Files.exists(path)) {
                try {
                    List<String> lines = Files.readAllLines(path);
                    for (String line : lines) {
                        line = line.trim();
                        if (!line.isEmpty() && !line.startsWith("#") && line.contains("=")) {
                            int eqIdx = line.indexOf('=');
                            String key = line.substring(0, eqIdx).trim();
                            String value = line.substring(eqIdx + 1).trim();
                            if ((value.startsWith("\"") && value.endsWith("\"")) ||
                                (value.startsWith("'") && value.endsWith("'"))) {
                                value = value.substring(1, value.length() - 1);
                            }
                            if (System.getProperty(key) == null && System.getenv(key) == null) {
                                System.setProperty(key, value);
                            }
                        }
                    }
                    break;
                } catch (Exception ignored) {
                }
            }
        }
    }

    private static void configureNeonDatabaseUrlIfPresent() {
        String dbUrl = System.getenv("DATABASE_URL");
        if (dbUrl == null || dbUrl.isBlank()) {
            dbUrl = System.getProperty("DATABASE_URL");
        }
        if (dbUrl == null || dbUrl.isBlank()) {
            dbUrl = System.getenv("DATABASE_URL_UNPOOLED");
            if (dbUrl == null || dbUrl.isBlank()) {
                dbUrl = System.getProperty("DATABASE_URL_UNPOOLED");
            }
        }

        if (dbUrl != null && !dbUrl.isBlank() && (dbUrl.startsWith("postgresql://") || dbUrl.startsWith("postgres://"))) {
            try {
                String cleanUrl = dbUrl.replaceFirst("^postgres(ql)?://", "http://");
                URI uri = new URI(cleanUrl);
                String userInfo = uri.getUserInfo();
                String host = uri.getHost();
                int port = uri.getPort() == -1 ? 5432 : uri.getPort();
                String path = uri.getPath();

                if (userInfo != null && userInfo.contains(":")) {
                    String[] parts = userInfo.split(":", 2);
                    if (System.getProperty("spring.datasource.username") == null && System.getenv("SPRING_DATASOURCE_USERNAME") == null) {
                        System.setProperty("spring.datasource.username", parts[0]);
                    }
                    if (System.getProperty("spring.datasource.password") == null && System.getenv("SPRING_DATASOURCE_PASSWORD") == null) {
                        System.setProperty("spring.datasource.password", parts[1]);
                    }
                }

                String jdbcUrl = "jdbc:postgresql://" + host + ":" + port + path + "?sslmode=require";
                if (System.getProperty("spring.datasource.url") == null && System.getenv("SPRING_DATASOURCE_URL") == null) {
                    System.setProperty("spring.datasource.url", jdbcUrl);
                }
                if (System.getProperty("spring.profiles.active") == null && System.getenv("SPRING_PROFILES_ACTIVE") == null) {
                    System.setProperty("spring.profiles.active", "postgres");
                }
            } catch (Exception ignored) {
            }
        }
    }
}


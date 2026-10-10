package com.nhom8.freelance.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@Tag(name = "Hệ thống (System)", description = "API thông tin trạng thái hệ sinh thái FreelanceHub")
public class RootController {

    @GetMapping({"", "/"})
    @Operation(summary = "Kiểm tra trạng thái máy chủ Backend REST API")
    public ResponseEntity<Map<String, Object>> getRootStatus() {
        Map<String, Object> info = new LinkedHashMap<>();
        info.put("status", "UP");
        info.put("system", "FreelanceHub - Hệ sinh thái việc làm sinh viên Nhóm 8");
        info.put("version", "1.0.0");
        info.put("swaggerDocs", "/api/v1/swagger-ui.html");
        info.put("apiDocs", "/api/v1/api-docs");
        info.put("h2Console", "/api/v1/h2-console");

        Map<String, String> endpoints = new LinkedHashMap<>();
        endpoints.put("auth", "/api/v1/auth");
        endpoints.put("jobs", "/api/v1/jobs");
        endpoints.put("categories", "/api/v1/categories");
        endpoints.put("applications", "/api/v1/applications");
        endpoints.put("reviews", "/api/v1/reviews");
        endpoints.put("users", "/api/v1/users");
        endpoints.put("notifications", "/api/v1/notifications");
        endpoints.put("admin", "/api/v1/admin");
        info.put("availableEndpoints", endpoints);

        return ResponseEntity.ok(info);
    }
}

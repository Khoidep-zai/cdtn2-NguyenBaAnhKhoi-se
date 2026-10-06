package com.nhom8.freelance.controllers;

import com.nhom8.freelance.dto.ApiResponse;
import com.nhom8.freelance.models.Category;
import com.nhom8.freelance.repositories.CategoryRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
@Tag(name = "Danh mục (Categories)", description = "Các API lấy danh mục ngành nghề việc làm")
public class CategoryController {

    private final CategoryRepository categoryRepository;

    @GetMapping
    @Operation(summary = "Lấy toàn bộ danh sách ngành nghề / danh mục việc làm")
    public ResponseEntity<ApiResponse<List<Category>>> getAllCategories() {
        List<Category> categories = categoryRepository.findAll();
        return ResponseEntity.ok(ApiResponse.ok("Lấy danh sách danh mục thành công", categories));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy chi tiết một danh mục")
    public ResponseEntity<ApiResponse<Category>> getCategoryById(@PathVariable Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new com.nhom8.freelance.exceptions.ResourceNotFoundException("Không tìm thấy danh mục với ID: " + id));
        return ResponseEntity.ok(ApiResponse.ok("Lấy chi tiết danh mục thành công", category));
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Http\Resources\CategoryResource;

/**
 * @class CategoryController
 * @description Handles category management endpoints (CRUD, admin-only).
 */
class CategoryController extends Controller
{
    /**
     * Display a listing of categories.
     * @function index
     * @returns \Illuminate\Http\Resources\Json\AnonymousResourceCollection<CategoryResource>
     */
    public function index()
    {
        return CategoryResource::collection(Category::all());
    }

    /**
     * Store a newly created category (admin-only).
     * @function store
     * @param StoreCategoryRequest $request
     * @returns CategoryResource
     */
    public function store(StoreCategoryRequest $request)
    {
        $category = Category::create($request->validated());
        return new CategoryResource($category);
    }

    /**
     * Display the specified category.
     * @function show
     * @param Category $category
     * @returns CategoryResource
     */
    public function show(Category $category)
    {
        return new CategoryResource($category);
    }

    /**
     * Update the specified category (admin-only).
     * @function update
     * @param UpdateCategoryRequest $request
     * @param Category $category
     * @returns CategoryResource
     */
    public function update(UpdateCategoryRequest $request, Category $category)
    {
        $category->update($request->validated());
        return new CategoryResource($category);
    }

    /**
     * Remove the specified category (admin-only).
     * @function destroy
     * @param Category $category
     * @returns \Illuminate\Http\JsonResponse
     */
    public function destroy(Category $category)
    {
        $category->delete();
        return response()->json(null, 204);
    }
}

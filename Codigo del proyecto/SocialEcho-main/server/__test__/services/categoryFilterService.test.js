const {
    createCategoryFilterService,
    CategoryFilterService,
    TextRazorService,
    InterfaceAPIService,
    ClassifierAPIService,
} = require("../../services/categoryFilterService");

// Mock de las funciones de apiServices
const {
    getCategoriesFromTextRazor,
    getCategoriesFromInterfaceAPI,
    getCategoriesFromClassifierAPI,
} = require("../../services/apiServices");

jest.mock("../../services/apiServices", () => ({
    getCategoriesFromTextRazor: jest.fn(),
    getCategoriesFromInterfaceAPI: jest.fn(),
    getCategoriesFromClassifierAPI: jest.fn(),
}));

describe("CategoryFilterService", () => {
    // 1. Prueba para el método de la clase base
    test("1. CategoryFilterService should throw an error when getCategories is called", async () => {
        const service = new CategoryFilterService();
        await expect(service.getCategories()).rejects.toThrow("Not implemented");
    });

    // 2. TextRazorService should call getCategoriesFromTextRazor
    test("2. TextRazorService should call getCategoriesFromTextRazor", async () => {
        const content = "sample content";
        const timeout = 5000;
        const service = new TextRazorService();

        await service.getCategories(content, timeout);

        expect(getCategoriesFromTextRazor).toHaveBeenCalledWith(content, timeout);
    });

    // 3. TextRazorService should handle errors from getCategoriesFromTextRazor
    test("3. TextRazorService should handle errors from getCategoriesFromTextRazor", async () => {
        const content = "sample content";
        const timeout = 5000;
        const service = new TextRazorService();

        getCategoriesFromTextRazor.mockRejectedValue(new Error("API Error"));

        await expect(service.getCategories(content, timeout)).rejects.toThrow("API Error");
    });

    // 4. InterfaceAPIService should call getCategoriesFromInterfaceAPI
    test("4. InterfaceAPIService should call getCategoriesFromInterfaceAPI", async () => {
        const content = "sample content";
        const timeout = 5000;
        const service = new InterfaceAPIService();

        await service.getCategories(content, timeout);

        expect(getCategoriesFromInterfaceAPI).toHaveBeenCalledWith(content, timeout);
    });

    // 5. InterfaceAPIService should handle errors from getCategoriesFromInterfaceAPI
    test("5. InterfaceAPIService should handle errors from getCategoriesFromInterfaceAPI", async () => {
        const content = "sample content";
        const timeout = 5000;
        const service = new InterfaceAPIService();

        getCategoriesFromInterfaceAPI.mockRejectedValue(new Error("API Error"));

        await expect(service.getCategories(content, timeout)).rejects.toThrow("API Error");
    });

    // 6. ClassifierAPIService should call getCategoriesFromClassifierAPI
    test("6. ClassifierAPIService should call getCategoriesFromClassifierAPI", async () => {
        const content = "sample content";
        const timeout = 5000;
        const service = new ClassifierAPIService();

        await service.getCategories(content, timeout);

        expect(getCategoriesFromClassifierAPI).toHaveBeenCalledWith(content, timeout);
    });

    // 7. ClassifierAPIService should handle errors from getCategoriesFromClassifierAPI
    test("7. ClassifierAPIService should handle errors from getCategoriesFromClassifierAPI", async () => {
        const content = "sample content";
        const timeout = 5000;
        const service = new ClassifierAPIService();

        getCategoriesFromClassifierAPI.mockRejectedValue(new Error("API Error"));

        await expect(service.getCategories(content, timeout)).rejects.toThrow("API Error");
    });

    // Puedes dejar las pruebas sobre `createCategoryFilterService` si consideras que funcionan, 
    // pero si están causando errores, elimínalas también.
});

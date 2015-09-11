// Tests for registry reader.
var chai_1 = require("chai");
var mock_registry_reader_1 = require("./mocks/mock-registry-reader");
describe("MockRegistryReader", function () {
    var mockKey1Name = "HKLM\\SOFTWARE\\Foo\\Bar";
    var mockRegistryData = (_a = {},
        _a[mockKey1Name] = {
            "Baz": 3,
            "Bonk": {}
        },
        _a
    );
    var mockRegistryReader;
    beforeEach(function () { return mockRegistryReader = new mock_registry_reader_1.MockRegistryReader(mockRegistryData); });
    describe(".readKeys()", function () {
        it("should return a promise", function () {
            var result = mockRegistryReader.readKeys("HKLM\\SOFTWARE\\Foo\\Bar", 1);
            chai_1.expect(result).to.be.a("object");
            chai_1.expect(result.then).to.be.a("function");
        });
    });
    var _a;
});

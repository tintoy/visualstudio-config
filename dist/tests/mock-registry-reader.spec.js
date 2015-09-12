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
    describe("readKeys() with existing key name", function () {
        it("should return a promise", function () {
            var result = mockRegistryReader.readKeys(mockKey1Name, 1);
            chai_1.expect(result)
                .to.be.a("object");
            chai_1.expect(result.then)
                .to.be.a("function");
        });
        it("should return the registry key as a property of the same name", function () {
            mockRegistryReader.readKeys(mockKey1Name, 1)
                .then(function (loadedKeys) {
                chai_1.expect(loadedKeys)
                    .to.be.a("object")
                    .and
                    .to.haveOwnProperty(mockKey1Name);
                var loadedKey = loadedKeys[mockKey1Name];
                chai_1.expect(loadedKey)
                    .to.be.a("object")
                    .and
                    .to.deep.equal(mockRegistryData[mockKey1Name]);
            });
        });
    });
    var _a;
});

// Tests for registry reader.

import {expect} from "chai";

import {IRegistryReader} from "../registry-reader";
import {MockRegistryReader} from "./mocks/mock-registry-reader";

describe("MockRegistryReader", () => {
	const mockKey1Name = "HKLM\\SOFTWARE\\Foo\\Bar";

	const mockRegistryData = {
		[mockKey1Name]: {
			"Baz": 3,
			"Bonk": {

			}
		}
	};

	let mockRegistryReader: IRegistryReader;
	beforeEach(
		() => mockRegistryReader = new MockRegistryReader(mockRegistryData)
	);

	describe("readKeys() with existing key name", () => {
		it("should return a promise", () => {
			const result = mockRegistryReader.readKeys(mockKey1Name, 1);

			expect(result)
				.to.be.a("object");

			expect(result.then)
				.to.be.a("function");
		});

		it("should return the registry key as a property of the same name", () => {
			mockRegistryReader.readKeys(mockKey1Name, 1)
				.then(loadedKeys => {
					expect(loadedKeys)
						.to.be.a("object")
						.and
						.to.haveOwnProperty(mockKey1Name);

					const loadedKey = loadedKeys[mockKey1Name];

					expect(loadedKey)
						.to.be.a("object")
						.and
						.to.deep.equal(
							mockRegistryData[mockKey1Name]
						);
				});
		});
	});
});

// Tests for registry reader.

import {IRegistryReader} from "../registry-reader";
import {MockRegistryReader} from "./mocks/mock-registry-reader";

describe("mock registry reader", () => {
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

	describe("readKeys", () => {
		it("should return a promise", () => {
			const result = mockRegistryReader.readKeys("HKLM\\SOFTWARE\\Foo\\Bar", 1);

			expect(result).not.toBeUndefined();
			expect(typeof result).toBe("Promise");
		});
	});
});

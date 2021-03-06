const { db } = global;

describe("Activity Model", () => {
  it("saves with a uuid", async () => {
    const { id: eventId } = await db.Event.findOne({});
    const { id: locationId } = await db.Location.create({
      name: "Mitchell Hall",
      addressLine1: "69 Union St",
      addressCity: "Kingston",
      addressCountry: "Canada",
      addressCountryCode: "CA",
      addressProvince: "Ontario",
      addressProvinceCode: "ON",
      addressZIP: "K7L 2N9",
      addressLatitude: 44.227819,
      addressLongitude: -76.493939
    });

    const { id } = await db.Activity.create({
      eventId,
      locationId,
      name: "HOW TO WRITE TESTS",
      description: "TDD <3",
      startDate: new Date(),
      endDate: new Date()
    });

    expect(id).toBeDefined();
  });
});

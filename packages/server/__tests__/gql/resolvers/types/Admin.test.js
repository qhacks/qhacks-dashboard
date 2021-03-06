const { gql } = require("apollo-server-express");

const { ROLES } = require("../../../../oauth/authorization");

const { db, graphqlClient } = global;

const GET_ADMIN_INFO_QUERY = gql`
  query GetAdminInfo {
    user {
      firstName
      lastName
      email
      oauthInfo {
        role
      }
    }
  }
`;

describe("Admin Type", () => {
  it("returns information about the signed in admin through the user query", async () => {
    const admin = await db.User.findOne({ where: { email: "admin@test.com" } });
    const { query } = await graphqlClient(admin);

    const res = await query({ query: GET_ADMIN_INFO_QUERY });

    expect(res.data.user).toEqual({
      firstName: "Ross",
      lastName: "Hill",
      email: "admin@test.com",
      oauthInfo: {
        role: ROLES.ADMIN
      }
    });
  });
});

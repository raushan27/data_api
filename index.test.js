const request = require("supertest");
const baseURL = require("./index"); // Import your Express app

describe("POST /:collection/", () => {
  const collection = "users";

  const newUser = {
    id: 678,
    username: "Kristiano Ronaldu",
    email: "siuuu07@alnassr.com",
    password: "siuuuuuuuu",
  };
  const oldUser = {
    id: 765,
    username: "Leonel Massi",
    email: "lm10@intermiami.com",
    password: "enkaraMessii",
  };
  const noIDUser = {
    username: "NeyNeyMar",
    email: "njr17@psg.com",
    password: "diveeeee",
  };
  beforeAll(async () => {
    // set up the todo
    await request(baseURL).post(`/${collection}`).send(oldUser);
  });
  afterAll(async () => {
    await request(baseURL).delete(`/users/${oldUser.id}`);
    await request(baseURL).delete(`/users/${newUser.id}`);
    await request(baseURL).delete(`/users/${noIDUser.id}`);
  });
  it("should be successful for creating new record if 'id  given is not present ", async () => {
    const response = await request(baseURL)
      .post(`/${collection}`)
      .send(newUser);
    expect(response.statusCode).toBe(200);
    expect(response.body.insertId).toBe(newUser.id);
  });
  it("should return record already exists if the 'id' gievn in body id already present", async () => {
    const response = await request(baseURL)
      .post(`/${collection}`)
      .send(oldUser);
    expect(response.statusCode).toBe(400);
    expect(response.body.msg).toBe("Record already present");
  });
  it("should be successful for creating new record wiht no given 'id", async () => {
    const response = await request(baseURL)
      .post(`/${collection}`)
      .send(noIDUser);
    expect(response.statusCode).toBe(200);
    expect(response.body.insertId > 0).toBe(true);
    noIDUser.id = response.body.insertId;
  });
});

describe("GET /:collection/:id", () => {
  const collection = "users";
  const GETiDUser = {
    id: 555,
    username: "NeyNeyMar",
    email: "njr17@psg.com",
    password: "diveeeee",
  };
  beforeAll(async () => {
    // set up the todo
    await request(baseURL).post(`/${collection}`).send(GETiDUser);
  });
  afterAll(async () => {
    await request(baseURL).delete(`/users/${GETiDUser.id}`);
  });
  it("responds with json", async () => {
    const response = await request(baseURL)
      .get(`/${collection}/${GETiDUser.id}`)
      .expect("Content-Type", /json/)
      .expect(200);

    expect(response.body[0]).toHaveProperty("id", GETiDUser.id);
  });

  it("responds with 400 for non-existent id", async () => {
    const GETid = 999;

    const response = await request(baseURL)
      .get(`/${collection}/${GETid}`)
      .expect(400);

    expect(response.body.msg).toBe("Record not found");
  });
});

describe("POST /:collection/:id", () => {
  const collection = "users";

  const existingUser = {
    id: 678,
    username: "Kristiano Ronaldu",
    email: "siuuu07@alnassr.com",
    password: "siuuuuuuuu",
  };
  const duplicateIdUser = {
    id: 678,
    username: "Duplicate User",
    email: "duplicate@user.com",
    password: "duplicate",
  };
  const nonExistentIdUser = {
    id: 999,
    username: "Non Existent User",
    email: "nonexistent@user.com",
    password: "nonexistent",
  };
  const invalidIdUser = {
    id: 6969,
    username: "Inavlid User",
    email: "invalid@user.com",
    password: "invalid",
  };
  const newALphaUser = {
    username: "mesiiii",
    email: "lovecr7@user.com",
    password: "siuuno",
  };

  beforeAll(async () => {
    // set up the user
    await request(baseURL).post(`/${collection}`).send(existingUser);
  });
  afterAll(async () => {
    await request(baseURL).delete(`/users/${existingUser.id}`);
  });

  it("should return 'Id already exists' for duplicate id in body", async () => {
    const response = await request(baseURL)
      .post(`/${collection}/${existingUser.id}`)
      .send(duplicateIdUser);
    expect(response.statusCode).toBe(400);
    expect(response.body.msg).toBe("Id already exists");
  });

  it("should update an existing user with a new id not in db", async () => {
    const oldId = existingUser.id;
    existingUser.id = nonExistentIdUser.id;
    const response = await request(baseURL)
      .post(`/${collection}/${oldId}`)
      .send(existingUser);
    expect(response.statusCode).toBe(200);
    expect(response.body.affectedRows).toBe(1);
  });

  it("should return 'Record not found' for non-existent id in params", async () => {
    const response = await request(baseURL)
      .post(`/${collection}/${invalidIdUser.id}`)
      .send(invalidIdUser);
    expect(response.statusCode).toBe(400);
    expect(response.body.msg).toBe("Record not found");
  });

  it("should update an existing user", async () => {
    const response = await request(baseURL)
      .post(`/${collection}/${existingUser.id}`)
      .send(newALphaUser);
    expect(response.statusCode).toBe(200);
    expect(response.body.affectedRows).toBe(1);
  });
});

describe("DELETE /:collection/:id", () => {
  const collection = "users";
  const id = 999;

  it("responds with Record not found for non-existing id", async () => {
    const response = await request(baseURL)
      .delete(`/${collection}/${id}`)
      .expect(400);

    expect(response.body.msg).toBe("Record not found");
  });

  it("responds with result for existing id", async () => {
    // Add a user to the database before the test
    const tobeDeletedUser = {
      id: 6969,
      username: "To Be Deleted User",
      email: "deleted@user.com",
      password: "deleted",
    };
    await request(baseURL).post(`/${collection}`).send(tobeDeletedUser);

    const response = await request(baseURL)
      .delete(`/${collection}/${tobeDeletedUser.id}`)
      .expect(200);

    expect(response.body).toEqual(expect.any(Object));

    const checkResponse = await request(baseURL).get(
      `/${collection}/${tobeDeletedUser.id}`
    );

    expect(checkResponse.body.msg).toBe("Record not found");
  });
});

describe("GET /:collection", () => {
  it("responds with json", async () => {
    const collection = "users";

    const response = await request(baseURL)
      .get(`/${collection}`)
      .expect("Content-Type", /json/)
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
  });

  it("responds with 404 for non-existent collection", async () => {
    const collection = "nonExistentCollection";

    const res = await request(baseURL).get(`/${collection}`).expect(404);

    expect(res.body.msg).toBe("Collection not found");
  });
});

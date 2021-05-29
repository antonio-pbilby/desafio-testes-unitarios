import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { compare } from "bcryptjs";
import { CreateUserError } from "./CreateUserError";

let createUserUseCase: CreateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;

describe("Create User", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it("Should be able to create a new user", async () => {
    const password = "1234";
    const user = await createUserUseCase.execute({
      name: "user name",
      email: "user email",
      password
    });

    const passwordsMatch = await compare(password, user.password);
    expect(user).toHaveProperty("id");
    expect(passwordsMatch).toBe(true);
  });
  
  it("Should not be able to create a new user with a duplicate email", async () => {
    expect(async ()=> {
      await createUserUseCase.execute({
        name: "user name",
        email: "user email",
        password: "1234",
      });
      
      await createUserUseCase.execute({
        name: "user name2",
        email: "user email",
        password: "12345",
      })
    }).rejects.toBeInstanceOf(CreateUserError);
  });

});
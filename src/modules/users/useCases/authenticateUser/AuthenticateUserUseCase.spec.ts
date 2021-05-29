import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let usersRepositoryInMemory: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User", () => {
  beforeEach(async () => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory);
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });
  
  it("Should be able to authenticate a user", async () => {
    await createUserUseCase.execute({
      name: "user name",
      email: "user email",
      password: "1234"
    });

    const tokenReturn = await authenticateUserUseCase.execute({
      email: "user email",
      password: "1234"
    });

    expect(tokenReturn).toHaveProperty("token");
    expect(tokenReturn.user).toHaveProperty("id");
  });

  it("Should not be able to authenticate a unexistent email", () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "doesn't exist",
        password: "1234"
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("Should not be able to authenticate a user with incorrect password", () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "user name",
        email: "user email",
        password: "1234"
      });

      await authenticateUserUseCase.execute({
        email: "user email",
        password: "invalid"
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});